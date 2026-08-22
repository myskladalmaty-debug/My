import type { Core } from '@strapi/strapi';

// Actions the public (unauthenticated) API should expose — anyone can read
// the catalog without logging in or registering. Only "read" actions are
// public; creating/editing/deleting still requires the admin panel login.
const PUBLIC_ACTIONS = [
  'api::product.product.find',
  'api::product.product.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
];

// Field names in the schema (name, sku, wholesalePrice, ...) are English
// identifiers — that's normal/required for the API, but the Content Manager
// form would otherwise *display* those raw English names as labels. This
// renames just the on-screen labels to Russian, in both the edit form and
// the list view columns.
const RUSSIAN_LABELS: Record<string, Record<string, string>> = {
  'api::product.product': {
    name: 'Название',
    published: 'Опубликован',
    sku: 'Артикул',
    slug: 'Ссылка (slug)',
    description: 'Описание',
    wholesalePrice: 'Опт. цена',
    minOrderQty: 'Мин. партия, шт',
    stock: 'Остаток, шт',
    images: 'Фото',
    category: 'Категория',
  },
  'api::category.category': {
    name: 'Название',
    slug: 'Ссылка (slug)',
    products: 'Товары',
  },
};

async function applyRussianLabels(strapi: Core.Strapi) {
  const contentTypesService = strapi.plugin('content-manager').service('content-types');

  for (const [uid, labels] of Object.entries(RUSSIAN_LABELS)) {
    const configuration = await contentTypesService.findConfiguration({ uid });
    if (!configuration) continue;

    const metadatas = { ...configuration.metadatas };
    for (const [field, label] of Object.entries(labels)) {
      if (!metadatas[field]) continue;
      metadatas[field] = {
        edit: { ...metadatas[field].edit, label },
        list: { ...metadatas[field].list, label },
      };
    }

    await contentTypesService.updateConfiguration(
      { uid },
      {
        settings: configuration.settings,
        metadatas,
        layouts: configuration.layouts,
      }
    );
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await applyRussianLabels(strapi);

    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    for (const action of PUBLIC_ACTIONS) {
      const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
        where: { action, role: publicRole.id },
      });

      if (!existing) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }
  },
};
