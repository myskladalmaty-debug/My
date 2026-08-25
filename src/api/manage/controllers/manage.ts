import jwt from 'jsonwebtoken';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as XLSX from 'xlsx';
import AdmZip from 'adm-zip';

const MS_BASE = 'https://api.moysklad.ru/api/remap/1.2';

async function msFetch(pathname: string, token: string) {
  const res = await fetch(MS_BASE + pathname, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Encoding': 'gzip',
    } as any,
  });
  if (!res.ok) {
    throw new Error(`MoySklad ${pathname} -> HTTP ${res.status}`);
  }
  return res.json();
}

// Stock quantities live in a separate report endpoint, keyed by the
// product's id (extracted from the row's meta.href). Cached in memory for
// the lifetime of the server process since it doesn't change during an import run.
let stockMapCache: Record<string, number> | null = null;

async function getStockMap(token: string): Promise<Record<string, number>> {
  if (stockMapCache) return stockMapCache;
  const map: Record<string, number> = {};
  let offset = 0;
  const limit = 1000;
  while (true) {
    const json: any = await msFetch(`/report/stock/all?limit=${limit}&offset=${offset}`, token);
    for (const row of json.rows || []) {
      const href: string = row.meta?.href || '';
      const id = href.split('/').pop()?.split('?')[0];
      if (id) map[id] = row.stock ?? row.quantity ?? 0;
    }
    offset += limit;
    if (offset >= (json.meta?.size || 0)) break;
  }
  stockMapCache = map;
  return map;
}

// Builds a description in the format the shop actually uses on Telegram/
// WhatsApp posts (📦 В коробке / ✅ Твой хороший выбор), filled with real
// data (real pack size) — used only when MoySklad itself has no description
// for the product. No separate "Модель" line — the product's Название
// already serves as the model reference, so repeating it here is redundant.
function buildAutoDescription(minOrderQty: number): string {
  const lines: string[] = [];
  lines.push(`📦 В коробке: ${minOrderQty} pcs`);
  lines.push(`✅ Твой хороший выбор`);
  return lines.join('\n');
}

// --- Pricing algorithm settings (markup % + rounding step) ---
// Stored in Strapi's built-in key/value store so they persist and can be
// changed from the cabinet without touching code or restarting the server.

type PricingSettings = { markupPercent: number; roundTo: number };
const DEFAULT_PRICING_SETTINGS: PricingSettings = { markupPercent: 25, roundTo: 50 };

function pricingStore() {
  return strapi.store({ type: 'plugin', name: 'sklad' });
}

async function getPricingSettings(): Promise<PricingSettings> {
  const saved = await pricingStore().get({ key: 'pricingSettings' });
  return (saved as PricingSettings) || DEFAULT_PRICING_SETTINGS;
}

// costPrice -> wholesalePrice: add the markup, then round UP to the nearest
// `roundTo` (e.g. 50) so prices look clean (450, 500, 550 — never 483.20).
function computePrice(costPrice: number, settings: PricingSettings): number {
  const withMarkup = costPrice * (1 + settings.markupPercent / 100);
  const roundTo = settings.roundTo > 0 ? settings.roundTo : 1;
  return Math.ceil(withMarkup / roundTo) * roundTo;
}

async function findOrCreateCategoryId(name: string, cache: Map<string, string>): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const key = trimmed.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const existing: any = await strapi.documents('api::category.category').findMany({
    filters: { name: { $eqi: trimmed } },
    pagination: { pageSize: 1 },
  } as any);
  if (existing?.length) {
    cache.set(key, existing[0].documentId);
    return existing[0].documentId;
  }

  const created: any = await strapi.documents('api::category.category').create({
    data: { name: trimmed },
  } as any);
  cache.set(key, created.documentId);
  return created.documentId;
}

// Downloads one MoySklad product image and uploads it into our own Strapi
// media library, returning the new local file's id (or null on failure —
// a missing/broken photo should not abort the whole product import).
async function importProductImage(productId: string, token: string): Promise<number | null> {
  try {
    const listJson: any = await msFetch(`/entity/product/${productId}/images`, token);
    const first = listJson.rows?.[0];
    if (!first) return null;

    const downloadHref: string = first.meta.downloadHref;
    const res = await fetch(downloadHref, {
      headers: { Authorization: `Bearer ${token}`, 'Accept-Encoding': 'gzip' } as any,
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-img-'));
    const filename = first.filename || `${productId}.jpg`;
    const filepath = path.join(tmpDir, filename);
    fs.writeFileSync(filepath, buffer);

    try {
      const uploadService = strapi.plugin('upload').service('upload');
      const [uploaded]: any = await uploadService.upload({
        data: {},
        files: {
          filepath,
          originalFilename: filename,
          mimetype: res.headers.get('content-type') || 'image/jpeg',
          size: buffer.length,
        },
      });
      return uploaded?.id ?? null;
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  } catch {
    return null;
  }
}

// Secret used to sign the simple manager login token. Falls back to the
// admin JWT secret (already a random value in .env) so no extra setup is
// required, but you can set MANAGE_JWT_SECRET explicitly if you prefer.
function getSecret(): string {
  return process.env.MANAGE_JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'change-me';
}

function requireAuth(ctx: any): boolean {
  const header = ctx.request.header.authorization as string | undefined;
  if (!header || !header.startsWith('Bearer ')) {
    ctx.unauthorized('Требуется вход');
    return false;
  }
  const token = header.slice('Bearer '.length);
  try {
    jwt.verify(token, getSecret());
    return true;
  } catch {
    ctx.unauthorized('Сессия истекла, войдите заново');
    return false;
  }
}

export default {
  async login(ctx: any) {
    const { password } = (ctx.request.body || {}) as { password?: string };
    const expected = process.env.MANAGE_PASSWORD;

    if (!expected) {
      ctx.badRequest('Пароль кабинета не настроен на сервере. Задайте MANAGE_PASSWORD в файле .env и перезапустите сервер.');
      return;
    }
    if (!password || password !== expected) {
      ctx.unauthorized('Неверный пароль');
      return;
    }

    const token = jwt.sign({ role: 'manager' }, getSecret(), { expiresIn: '30d' });
    ctx.body = { token };
  },

  async listProducts(ctx: any) {
    if (!requireAuth(ctx)) return;
    const products = await strapi.documents('api::product.product').findMany({
      populate: ['images', 'category'],
      sort: 'name:asc',
      pagination: { pageSize: 1000 },
    } as any);
    ctx.body = { data: products };
  },

  async createProduct(ctx: any) {
    if (!requireAuth(ctx)) return;
    const data = ctx.request.body;
    const created = await strapi.documents('api::product.product').create({
      data,
      populate: ['images', 'category'],
    } as any);
    ctx.body = { data: created };
  },

  async updateProduct(ctx: any) {
    if (!requireAuth(ctx)) return;
    const { id } = ctx.params;
    const data = ctx.request.body;
    // Editing the price by hand (in the cabinet) protects it from being
    // overwritten later when the pricing algorithm is re-applied in bulk.
    if (data.wholesalePrice !== undefined) {
      data.priceManuallySet = true;
    }
    const updated = await strapi.documents('api::product.product').update({
      documentId: id,
      data,
      populate: ['images', 'category'],
    } as any);
    ctx.body = { data: updated };
  },

  async deleteProduct(ctx: any) {
    if (!requireAuth(ctx)) return;
    const { id } = ctx.params;
    await strapi.documents('api::product.product').delete({ documentId: id } as any);
    ctx.body = { data: true };
  },

  async listCategories(ctx: any) {
    if (!requireAuth(ctx)) return;
    const categories = await strapi.documents('api::category.category').findMany({
      sort: 'name:asc',
      pagination: { pageSize: 200 },
    } as any);
    ctx.body = { data: categories };
  },

  async createCategory(ctx: any) {
    if (!requireAuth(ctx)) return;
    const data = ctx.request.body;
    const created = await strapi.documents('api::category.category').create({ data } as any);
    ctx.body = { data: created };
  },

  async upload(ctx: any) {
    if (!requireAuth(ctx)) return;
    const uploadController = strapi.plugin('upload').controller('content-api');
    return uploadController.upload(ctx, async () => {});
  },

  // One-time import from MoySklad. Processes one page of products per call
  // (so a single HTTP request never runs too long); call again with a
  // higher `offset` to continue. Safe to re-run — products already
  // imported (matched by their MoySklad id) are skipped, not duplicated.
  async importMoysklad(ctx: any) {
    if (!requireAuth(ctx)) return;

    const token = process.env.MOYSKLAD_TOKEN;
    if (!token) {
      ctx.badRequest('MOYSKLAD_TOKEN не задан в .env');
      return;
    }

    const limit = Math.min(parseInt(ctx.query.limit, 10) || 15, 50);
    const offset = parseInt(ctx.query.offset, 10) || 0;
    const withImages = ctx.query.images !== 'false';

    const productsJson: any = await msFetch(`/entity/product?limit=${limit}&offset=${offset}`, token);
    const total = productsJson.meta?.size || 0;
    const rows = productsJson.rows || [];

    const stockMap = await getStockMap(token);
    const categoryCache = new Map<string, string>();

    let imported = 0;
    let updated = 0;
    const errors: string[] = [];

    let skipped = 0;
    let deleted = 0;

    async function processRow(row: any) {
      const stock = stockMap[row.id] ?? 0;
      const minOrderQty = row.packs?.[0]?.quantity || 1;
      const costPrice = (row.buyPrice?.value ?? 0) / 100;

      const existing: any = await strapi.documents('api::product.product').findMany({
        filters: { moyskladId: row.id },
        pagination: { pageSize: 1 },
        populate: ['images'],
      } as any);

      // Out of stock: don't bother creating it (skips the photo download
      // too — no point spending time on a product we won't show), and if
      // it was already imported before but is now out of stock, remove it.
      if (stock <= 0) {
        if (existing?.length) {
          await strapi.documents('api::product.product').delete({ documentId: existing[0].documentId } as any);
          deleted += 1;
        } else {
          skipped += 1;
        }
        return;
      }

      if (existing?.length) {
        // Already imported — just refresh stock/pack size/cost in case
        // MoySklad data changed or this field wasn't captured on an
        // earlier run. Only fill in description if it's still empty, so
        // we never overwrite something the admin already wrote by hand.
        // In stock -> published, so it's visible on the storefront.
        const updateData: any = { stock, minOrderQty, costPrice, published: true };
        if (!existing[0].description || !existing[0].description.trim()) {
          updateData.description = row.description || buildAutoDescription(minOrderQty);
        }
        // Backfill the photo if it's missing OR still points at the old
        // local-disk storage (a broken /uploads/... path — that file only
        // ever existed on the one machine that originally downloaded it,
        // before Supabase Storage was set up as shared storage).
        const currentImageUrl: string | undefined = existing[0].images?.[0]?.url;
        const hasWorkingImage = currentImageUrl && !currentImageUrl.startsWith('/uploads');
        if (!hasWorkingImage && withImages && row.images?.meta?.size > 0) {
          const imageId = await importProductImage(row.id, token!);
          if (imageId) updateData.images = [imageId];
        }
        await strapi.documents('api::product.product').update({
          documentId: existing[0].documentId,
          data: updateData,
        } as any);
        updated += 1;
        return;
      }

      const categoryId = row.pathName
        ? await findOrCreateCategoryId(row.pathName.split('/').filter(Boolean).pop() || '', categoryCache)
        : null;

      const priceMinor = row.salePrices?.[0]?.value ?? 0;
      const sku = row.article || row.code || null;

      const data: any = {
        name: row.name,
        sku,
        description: row.description || buildAutoDescription(minOrderQty),
        wholesalePrice: priceMinor / 100,
        costPrice,
        minOrderQty,
        stock,
        published: true, // reaching this point already means stock > 0
        moyskladId: row.id,
        category: categoryId,
        isNew: true, // first time we've seen this product — mark it as new
      };

      if (withImages && row.images?.meta?.size > 0) {
        const imageId = await importProductImage(row.id, token!);
        if (imageId) data.images = [imageId];
      }

      await strapi.documents('api::product.product').create({ data } as any);
      imported += 1;
    }

    // Process several products concurrently — most of the time per product
    // is spent waiting on network round-trips (MoySklad + Supabase), so
    // running a handful in parallel cuts wall-clock time a lot without
    // overwhelming either API.
    const CONCURRENCY = 5;
    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      const chunk = rows.slice(i, i + CONCURRENCY);
      await Promise.all(
        chunk.map((row: any) =>
          processRow(row).catch((err: any) => {
            errors.push(`${row.name || row.id}: ${err.message || err}`);
          })
        )
      );
    }

    ctx.body = {
      total,
      offset,
      limit,
      processed: rows.length,
      imported,
      updated,
      skipped,
      deleted,
      errors,
      nextOffset: offset + rows.length < total ? offset + rows.length : null,
    };
  },

  // --- Pricing algorithm: markup % + rounding, applied to costPrice ---

  async getPricingSettings(ctx: any) {
    if (!requireAuth(ctx)) return;
    const settings = await getPricingSettings();
    const withCost = await strapi.documents('api::product.product').count({
      filters: { costPrice: { $gt: 0 } },
    } as any);
    ctx.body = { settings, productsWithCostPrice: withCost };
  },

  async savePricingSettings(ctx: any) {
    if (!requireAuth(ctx)) return;
    const { markupPercent, roundTo } = ctx.request.body || {};
    const settings: PricingSettings = {
      markupPercent: Number(markupPercent) || 0,
      roundTo: Number(roundTo) || 1,
    };
    await pricingStore().set({ key: 'pricingSettings', value: settings });
    ctx.body = { settings };
  },

  // Recomputes wholesalePrice = costPrice + markup (rounded) for every
  // product that has a costPrice. Only touches products the admin hasn't
  // manually priced themselves — pass `force: true` to also overwrite
  // manually-set prices when re-running with new markup settings.
  async applyPricing(ctx: any) {
    if (!requireAuth(ctx)) return;
    const settings = await getPricingSettings();
    const force = ctx.request.body?.force === true;

    const products: any = await strapi.documents('api::product.product').findMany({
      filters: { costPrice: { $gt: 0 } },
      pagination: { pageSize: 5000 },
    } as any);

    let updated = 0;
    for (const p of products) {
      if (!force && p.priceManuallySet) continue;
      const newPrice = computePrice(p.costPrice, settings);
      await strapi.documents('api::product.product').update({
        documentId: p.documentId,
        data: { wholesalePrice: newPrice },
      } as any);
      updated += 1;
    }

    ctx.body = { updated, total: products.length, settings };
  },

  // Bulk-add products from an uploaded file — either a plain Excel/CSV
  // spreadsheet (no photos), or a .zip containing the spreadsheet plus a
  // folder of photos, matched to rows by the "Фото (имя файла)" column
  // (same layout as the template: Название, Артикул, Описание, Опт. цена,
  // Мин. партия шт, Остаток шт, Категория, Фото (имя файла)).
  async importFile(ctx: any) {
    if (!requireAuth(ctx)) return;

    const file = ctx.request.files?.file;
    if (!file) {
      ctx.badRequest('Файл не найден в запросе (поле "file")');
      return;
    }

    const originalName: string = file.originalFilename || file.name || '';
    const isZip = originalName.toLowerCase().endsWith('.zip');

    let sheetBuffer: Buffer;
    // filename (lowercase, basename only) -> image bytes, only populated for zips
    const imagesByName = new Map<string, Buffer>();
    // 0-indexed sheet row (matching XLSX.utils.sheet_to_json's row order, i.e.
    // data row i sits at sheet row i+1) -> image bytes. Populated for plain
    // .xlsx files that have pictures pasted directly into cells (common in
    // supplier/factory packing lists) rather than a "photo filename" column.
    const embeddedImagesByRow = new Map<number, { buffer: Buffer; ext: string }>();

    if (isZip) {
      let zip: AdmZip;
      try {
        zip = new AdmZip(file.filepath);
      } catch (err: any) {
        ctx.badRequest('Не удалось открыть zip-архив: ' + err.message);
        return;
      }
      const entries = zip.getEntries().filter((e) => !e.isDirectory);
      const sheetEntry = entries.find((e) => /\.(xlsx|xls|csv)$/i.test(e.entryName));
      if (!sheetEntry) {
        ctx.badRequest('В архиве не найдена таблица (.xlsx/.xls/.csv)');
        return;
      }
      sheetBuffer = sheetEntry.getData();

      for (const entry of entries) {
        if (/\.(jpe?g|png|webp|gif)$/i.test(entry.entryName)) {
          const base = entry.entryName.split('/').pop()!.toLowerCase();
          imagesByName.set(base, entry.getData());
        }
      }
    } else {
      sheetBuffer = fs.readFileSync(file.filepath);

      // A plain .xlsx is itself a zip container. If pictures were pasted
      // directly into cells (not referenced by a filename column), pull them
      // out of xl/media + xl/drawings and figure out which row each one sits
      // next to, so we can still attach a photo per product.
      if (/\.xlsx$/i.test(originalName)) {
        try {
          const xlsxZip = new AdmZip(file.filepath);
          const drawingEntry = xlsxZip
            .getEntries()
            .find((e) => /^xl\/drawings\/drawing\d+\.xml$/i.test(e.entryName));
          if (drawingEntry) {
            const drawingName = drawingEntry.entryName.split('/').pop()!;
            const relsEntry = xlsxZip.getEntry(`xl/drawings/_rels/${drawingName}.rels`);
            const relMap = new Map<string, string>(); // rId -> xl/media/imageN.ext
            if (relsEntry) {
              const relsXml = relsEntry.getData().toString('utf8');
              for (const m of relsXml.matchAll(/Id="(rId\d+)"[^>]*Target="\.\.\/([^"]+)"/g)) {
                relMap.set(m[1], `xl/${m[2]}`);
              }
            }
            const drawingXml = drawingEntry.getData().toString('utf8');
            const anchorRegex = /<xdr:(?:twoCellAnchor|oneCellAnchor)\b[\s\S]*?<xdr:row>(\d+)<\/xdr:row>[\s\S]*?r:embed="(rId\d+)"[\s\S]*?<\/xdr:(?:twoCellAnchor|oneCellAnchor)>/g;
            for (const m of drawingXml.matchAll(anchorRegex)) {
              const sheetRow = parseInt(m[1], 10); // 0-indexed, includes header row
              const target = relMap.get(m[2]);
              if (target) {
                const mediaEntry = xlsxZip.getEntry(target);
                if (mediaEntry) {
                  embeddedImagesByRow.set(sheetRow, {
                    buffer: mediaEntry.getData(),
                    ext: path.extname(target) || '.png',
                  });
                }
              }
            }
          }
        } catch {
          // No embedded pictures, or an unrecognised drawing format — that's
          // fine, we just proceed without photos for this file.
        }
      }
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(sheetBuffer, { type: 'buffer' });
    } catch (err: any) {
      ctx.badRequest('Не удалось прочитать таблицу: ' + err.message);
      return;
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    // Column names are matched loosely (trimmed, case-insensitive, a few
    // known synonyms) so the template doesn't have to be followed exactly.
    const norm = (s: string) => s.toString().trim().toLowerCase();
    function pick(row: any, ...candidates: string[]): string {
      const keys = Object.keys(row);
      for (const candidate of candidates) {
        const key = keys.find((k) => norm(k) === norm(candidate));
        if (key && row[key] !== '') return String(row[key]).trim();
      }
      return '';
    }

    async function uploadImageBuffer(buffer: Buffer, filename: string): Promise<number | null> {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'file-img-'));
      const filepath = path.join(tmpDir, filename);
      fs.writeFileSync(filepath, buffer);
      try {
        const ext = path.extname(filename).toLowerCase();
        const mime =
          ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.gif' ? 'image/gif' : 'image/jpeg';
        const uploadService = strapi.plugin('upload').service('upload');
        const [uploaded]: any = await uploadService.upload({
          data: {},
          files: { filepath, originalFilename: filename, mimetype: mime, size: buffer.length },
        });
        return uploaded?.id ?? null;
      } catch {
        return null;
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    }

    const categoryCache = new Map<string, string>();
    let created = 0;
    let withPhoto = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowLabel = `строка ${i + 2}`; // +2: header row + 1-indexed
      try {
        const sku = pick(row, 'Артикул', 'SKU', 'Sku') || null;
        // "Наименование товара" covers supplier packing-list layouts. If the
        // name cell is empty (common in those files — only the article is
        // filled in) fall back to the article so the row isn't skipped.
        const name = pick(row, 'Название', 'Name', 'Товар', 'Наименование товара', 'Наименование') || sku;
        if (!name) continue; // skip blank/example rows silently

        const description = pick(row, 'Описание', 'Description') || null;
        const priceRaw = pick(row, 'Опт. цена', 'Опт цена', 'Цена', 'Price');
        const minQtyRaw = pick(row, 'Мин. партия, шт', 'Мин. партия', 'Мин партия', 'Кол-во в коробке (QTY)', 'Кол-во в коробке');
        const stockRaw = pick(row, 'Остаток, шт', 'Остаток', 'Наличие', 'Stock', 'Общее кол-во, шт', 'Общее кол-во');
        const categoryName = pick(row, 'Категория', 'Category');
        const photoName = pick(row, 'Фото (имя файла)', 'Фото', 'Photo', 'Image');

        const wholesalePrice = parseFloat(priceRaw.replace(',', '.')) || 0;
        const minOrderQty = parseInt(minQtyRaw, 10) || 1;
        const stock = parseInt(stockRaw, 10) || 0;
        const categoryId = categoryName ? await findOrCreateCategoryId(categoryName, categoryCache) : null;

        const data: any = {
          name,
          sku,
          description,
          wholesalePrice,
          minOrderQty,
          stock,
          // Always created as a draft, regardless of stock — files can come
          // from very different sources (a clean price list vs. a supplier
          // packing list with no name/price), so publishing is a manual,
          // reviewed decision here rather than automatic like MoySklad sync.
          published: false,
          category: categoryId,
          isNew: true,
        };

        // Photo, in priority order: filename match (zip upload) first, then
        // a picture pasted directly into this row's cells (plain .xlsx).
        let imageBuffer: Buffer | undefined;
        let imageFilename = photoName || '';
        if (photoName) {
          imageBuffer = imagesByName.get(photoName.toLowerCase());
          if (!imageBuffer && isZip) {
            errors.push(`${rowLabel}: фото "${photoName}" не найдено в архиве (товар всё равно создан)`);
          }
        }
        if (!imageBuffer) {
          const embedded = embeddedImagesByRow.get(i + 1);
          if (embedded) {
            imageBuffer = embedded.buffer;
            imageFilename = `${sku || name}${embedded.ext}`;
          }
        }
        if (imageBuffer) {
          const imageId = await uploadImageBuffer(imageBuffer, imageFilename);
          if (imageId) {
            data.images = [imageId];
            withPhoto += 1;
          }
        }

        await strapi.documents('api::product.product').create({ data } as any);
        created += 1;
      } catch (err: any) {
        errors.push(`${rowLabel}: ${err.message || err}`);
      }
    }

    ctx.body = { totalRows: rows.length, created, withPhoto, errors };
  },
};
