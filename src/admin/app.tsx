import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'ru',
    ],
    // Rebrand the admin panel from "Strapi" to "Склад".
    // Kept separate per-language so switching the UI language (the "English"
    // dropdown on the login screen) doesn't mix Russian and English text.
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Sklad!',
        'app.components.LeftMenu.navbrand.title': 'Sklad',
        'app.components.LeftMenu.navbrand.workplace': 'Dashboard',
      },
      ru: {
        'Auth.form.welcome.title': 'Добро пожаловать в Склад!',
        'app.components.LeftMenu.navbrand.title': 'Склад',
        'app.components.LeftMenu.navbrand.workplace': 'Кабинет',
      },
    },
    head: {
      title: 'Склад',
    },
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap(app: StrapiApp) {},
};
