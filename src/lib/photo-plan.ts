// Which photos a product should have after comparing the cabinet with MoySklad.
//
// Clients see every MoySklad photo. Every MoySklad photo is uploaded into the cabinet under its
// MoySklad file name, so the two are matched by name. A MoySklad photo is downloaded only when the
// cabinet has no copy of it or MoySklad's copy is newer. A copy the manager uploaded by hand
// ("photo (1).jpg", the same file) counts as that photo, so nothing shows twice.
// A cabinet file MoySklad doesn't have was added by hand and stays — except an old first photo that
// MoySklad has since replaced with a newer one. If the manager put a photo first in the cabinet after
// MoySklad's first photo, it stays first and MoySklad's photos follow it.

export type CabImage = { id: number; name: string; createdAt: string; size?: number };
export type MsImage = { filename: string; updated: string; size?: number };
export type PlanStep = { id: number } | { download: number; fallback?: number };

// MoySklad writes Moscow time without a zone.
export const msTime = (s: string) => Date.parse(String(s || '').replace(' ', 'T') + '+03:00') || 0;

// "IMG_1 (1).JPG" and "img_1.jpg" are the same file downloaded twice.
const stem = (name: string) => String(name || '').toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/\s*\(\d+\)$/, '').trim();

// Telegram names one photo "5413789483745876927.jpg" or "photo_5413789483745876927_y.jpg".
const longNumbers = (name: string): string[] => String(name || '').match(/\d{12,}/g) || [];

// The same file uploaded by hand: same name apart from the "(1)", the same Telegram photo number,
// or the same size (cabinet: KB, MoySklad: bytes).
function sameFile(c: CabImage, m: MsImage): boolean {
  if (stem(c.name) === stem(m.filename)) return true;
  const nums = longNumbers(m.filename);
  if (longNumbers(c.name).some((n) => nums.includes(n))) return true;
  return !!c.size && !!m.size && Math.abs(c.size * 1024 - m.size) <= 1024;
}

// null — MoySklad has no photos: the cabinet's photos are left as they are.
export function planPhotos(cab: CabImage[], ms: MsImage[]): PlanStep[] | null {
  if (!ms.length) return null;
  const msNames = new Set(ms.map((m) => m.filename));
  const first = cab[0];
  const firstIsOwn = !!first && !msNames.has(first.name);
  const manualFirst = firstIsOwn && Date.parse(first.createdAt) >= msTime(ms[0].updated);
  const used = new Set<number>();
  const fromMs: PlanStep[] = ms.map((m, i) => {
    const same = cab.filter((c) => c.name === m.filename);
    const fresh = same.find((c) => Date.parse(c.createdAt) + 60000 >= msTime(m.updated));
    if (fresh) { used.add(fresh.id); return { id: fresh.id }; }
    const copy = !same.length && cab.find((c) => !msNames.has(c.name) && !used.has(c.id) && sameFile(c, m));
    if (copy) { used.add(copy.id); return { id: copy.id }; }
    // if the download fails, the old copy is better than no photo
    const fallback = same[0]?.id ?? (i === 0 && firstIsOwn && !manualFirst ? first.id : undefined);
    return fallback === undefined ? { download: i } : { download: i, fallback };
  });
  const keepFirst = manualFirst && !used.has(first.id);
  const own = cab.filter((c, i) => !msNames.has(c.name) && !used.has(c.id) && (i > 0 || manualFirst)).map((c) => ({ id: c.id }));
  // a hand-made copy standing first keeps its place
  if (manualFirst && used.has(first.id)) {
    const at = fromMs.findIndex((s) => 'id' in s && s.id === first.id);
    return [fromMs[at], ...fromMs.filter((_, i) => i !== at), ...own];
  }
  return keepFirst ? [own[0], ...fromMs, ...own.slice(1)] : [...fromMs, ...own];
}
