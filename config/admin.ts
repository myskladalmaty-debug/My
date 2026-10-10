import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  // Стандартная панель Strapi (/admin) закрыта: товарами управляют из дашборда и кабинета /manage/.
  // Сам Strapi остаётся внутри как база товаров и фото; API каталога работает как раньше.
  serveAdminPanel: env.bool('SERVE_ADMIN_PANEL', false),
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
});

export default config;
