export default {
  routes: [
    { method: 'POST', path: '/manage/login', handler: 'manage.login', config: { auth: false } },
    { method: 'GET', path: '/manage/products', handler: 'manage.listProducts', config: { auth: false } },
    { method: 'POST', path: '/manage/products', handler: 'manage.createProduct', config: { auth: false } },
    { method: 'PUT', path: '/manage/products/:id', handler: 'manage.updateProduct', config: { auth: false } },
    { method: 'DELETE', path: '/manage/products/:id', handler: 'manage.deleteProduct', config: { auth: false } },
    { method: 'GET', path: '/manage/categories', handler: 'manage.listCategories', config: { auth: false } },
    { method: 'POST', path: '/manage/categories', handler: 'manage.createCategory', config: { auth: false } },
    { method: 'POST', path: '/manage/upload', handler: 'manage.upload', config: { auth: false } },
    { method: 'POST', path: '/manage/import-moysklad', handler: 'manage.importMoysklad', config: { auth: false } },
    { method: 'GET', path: '/manage/pricing-settings', handler: 'manage.getPricingSettings', config: { auth: false } },
    { method: 'POST', path: '/manage/pricing-settings', handler: 'manage.savePricingSettings', config: { auth: false } },
    { method: 'POST', path: '/manage/apply-pricing', handler: 'manage.applyPricing', config: { auth: false } },
    { method: 'POST', path: '/manage/import-file', handler: 'manage.importFile', config: { auth: false } },
    { method: 'POST', path: '/manage/telegram-webhook', handler: 'manage.telegramWebhook', config: { auth: false } },
  ],
};
