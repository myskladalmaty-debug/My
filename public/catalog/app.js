// Same origin by default (when Strapi itself serves this page). When this
// page is deployed separately (e.g. on Vercel), config.js sets
// window.SKLAD_API_BASE to the backend's full URL before this file loads.
const API_BASE = window.SKLAD_API_BASE || '';
const PAGE_SIZE = 30;
// Less than this many pieces is a reserve kept in MoySklad — not shown to clients.
const MIN_STOCK = 100;
const LANG_KEY = 'sklad_catalog_lang';

const translations = {
  ru: {
    brandName: 'Оптовый склад',
    brandTag: 'Алматы · рынок Байсат',
    heroKicker: 'Оптовый склад · Алматы',
    pageTitle: 'RMZ — посуда и товары для дома оптом в Алматы',
    heroTitle: 'Посуда и товары для дома оптом в Алматы',
    pageSubtitle: 'Посуда, кухонные аксессуары и подарочные наборы напрямую со склада в Алматы. Цена за штуку и за коробку указана у каждого товара.',
    heroCta: 'Перейти в каталог',
    catMenu: 'Каталог товаров',
    navHome: 'Главная',
    navNew: 'Новые поступления',
    navWholesale: 'Оптовые заказы',
    navHow: 'Как заказать',
    navContacts: 'Контакты',
    cartLabel: 'Корзина',
    sectionNew: 'Новые поступления',
    sectionWholesale: 'Оптовые заказы',
    perks: [
      ['Только коробками', 'Оптом, без розницы'],
      ['Заказ от 100 000 ₸', 'Разные позиции можно смешивать'],
      ['Доставка по Казахстану', 'Отправка в день заказа'],
    ],
    searchPlaceholder: 'Поиск товаров…',
    allCategories: 'Все товары',
    allInCategory: 'Все',
    resultCount: (n) => `Найдено товаров: ${n}`,
    loading: 'Загрузка каталога…',
    wakeHint: 'Каталог загружается дольше обычного — сервер просыпается, подождите до минуты…',
    loadingMore: 'Загрузка…',
    loadMore: 'Показать ещё',
    emptyNotFound: 'Ничего не найдено. Попробуйте изменить запрос или категорию.',
    emptyNoProducts: 'Товары пока не добавлены. Загляните позже.',
    errorLoad: 'Не удалось загрузить каталог. Попробуйте обновить страницу.',
    inStock: 'В наличии',
    outStock: 'Под заказ',
    badgeNew: 'Новинка',
    perPiece: 'за шт.',
    priceOnRequest: 'Цена по запросу — уточните в WhatsApp',
    inBox: (n) => (n > 1 ? `В коробке ${n} шт.` : 'Продаём от 1 шт.'),
    boxPrice: (v) => `Коробка: ${v}`,
    articleLabel: 'Артикул',
    howToBuyTitle: 'Как заказать',
    howToBuySteps: [
      'Откройте «Новые поступления» или «Оптовые заказы» и добавьте нужные коробки в корзину.',
      'Нажмите «Оформить заказ в WhatsApp» — список товаров придёт к нам готовым сообщением.',
      'Мы подтвердим наличие и итоговую сумму со скидкой, примем оплату переводом и организуем отправку по Казахстану.',
    ],
    footerAbout: 'RMZ — оптовый склад техники и товаров для дома. Завозим напрямую.',
    footerAddress: 'Алматы, рынок Байсат, 10 ряд, 19 контейнер',
    footerHours: 'Ежедневно 9:00–18:00 · заказы принимаем круглосуточно',
    addToCart: 'В корзину',
    addedToCart: 'Добавлено',
    cartTitle: 'Корзина',
    cartEmpty: 'Корзина пуста. Добавьте товары из каталога.',
    cartTotalBoxes: (n) => `Коробок в корзине: ${n}`,
    cartDiscountHint: '🎁 Скидка: от 5 коробок −5%, от 10 коробок −10%, от 20 коробок −15%',
    cartCheckout: '💬 Оформить заказ в WhatsApp',
    orderDiscountLine: '🎁 Скидки: от 5 коробок −5%, от 10 коробок −10%, от 20 коробок −15%',
    orderGreeting: 'Здравствуйте! Хочу заказать:',
    orderTotalLine: (n) => `Всего коробок: ${n}`,
    boxesShort: 'кор.',
    trustLine: (n) => `Прямые поставки · Только проверенные товары${n ? ` · ${n}+ позиций` : ''}`,
    navDelivery: 'Доставка и оплата',
    navTerms: 'Для оптовиков',
    deliveryTitle: 'Доставка и оплата',
    deliveryItems: [
      'Доставка по всему Казахстану — отправляем в день подтверждения заказа.',
      'Самовывоз со склада: Алматы, рынок Байсат, 10 ряд, 19 контейнер, ежедневно 9:00–18:00.',
      'Оплата банковским переводом после того, как менеджер подтвердит наличие и итоговую сумму.',
      'Заказ можно оформить в любое время через корзину и WhatsApp.',
    ],
    termsTitle: 'Для оптовиков',
    termsItems: [
      'Продаём только коробками — размер коробки указан у каждого товара.',
      'Минимальный заказ — 100 000 ₸, разные позиции можно смешивать.',
      'Цены и остатки обновляются со склада.',
      'Вопросы по заказу — менеджер в WhatsApp: +7 777 254 44 64.',
    ],
    footBuyers: 'Покупателям',
    footCompany: 'Компания',
    footNote: 'Цены и остатки обновляются со склада автоматически.',
    shareBtn: '🔗 Скопировать ссылку',
    copied: '✓ Ссылка скопирована',
    pBoxPrice: 'Цена за коробку',
    pcsShort: 'шт.',
    otherGroup: 'Прочее',
    sumLabel: 'Сумма',
    discLabel: (p) => `Скидка −${p}%`,
    totalLabel: 'Итого',
    cartBarBtn: 'Открыть корзину →',
    leftPcs: (n) => `Осталось ${n} шт.`,
    boxesPcs: (b, n) => `${b} кор. = ${n} шт.`,
    perBoxLine: (n) => `${n} шт. в коробке`,
  },
  kz: {
    brandName: 'Көтерме қойма',
    brandTag: 'Алматы · Байсат базары',
    heroKicker: 'Көтерме қойма · Алматы',
    pageTitle: 'RMZ — Алматыда үй тауарлары мен ыдыс-аяқ көтерме',
    heroTitle: 'Алматыда ыдыс-аяқ және үй тауарлары — көтерме',
    pageSubtitle: 'Алматыдағы қоймадан тікелей ыдыс-аяқ, асүй керек-жарақтары және сыйлық жиынтықтары. Әр тауардың дана және қорап бағасы көрсетілген.',
    heroCta: 'Каталогқа өту',
    catMenu: 'Тауарлар каталогы',
    navHome: 'Басты бет',
    navNew: 'Жаңа түскендер',
    navWholesale: 'Көтерме тапсырыстар',
    navHow: 'Қалай тапсырыс беру',
    navContacts: 'Байланыс',
    cartLabel: 'Себет',
    sectionNew: 'Жаңа түскен тауарлар',
    sectionWholesale: 'Көтерме тапсырыстар',
    perks: [
      ['Тек қораппен', 'Көтерме, бөлшексіз'],
      ['100 000 ₸-ден тапсырыс', 'Әртүрлі позицияларды араластыруға болады'],
      ['Қазақстан бойынша жеткізу', 'Тапсырыс күні жөнелтеміз'],
    ],
    searchPlaceholder: 'Тауар іздеу…',
    allCategories: 'Барлық тауар',
    allInCategory: 'Барлығы',
    resultCount: (n) => `Табылған тауарлар: ${n}`,
    loading: 'Каталог жүктелуде…',
    wakeHint: 'Каталог әдеттегіден ұзақ жүктелуде — сервер оянып жатыр, бір минутқа дейін күтіңіз…',
    loadingMore: 'Жүктелуде…',
    loadMore: 'Тағы да көрсету',
    emptyNotFound: 'Ештеңе табылмады. Сұранымды немесе санатты өзгертіп көріңіз.',
    emptyNoProducts: 'Тауарлар әлі қосылмады. Кейінірек кіріңіз.',
    errorLoad: 'Каталогты жүктеу мүмкін болмады. Бетті жаңартып көріңіз.',
    inStock: 'Бар',
    outStock: 'Тапсырыс бойынша',
    badgeNew: 'Жаңа',
    perPiece: 'данасы',
    priceOnRequest: 'Бағасы — WhatsApp-та нақтылаңыз',
    inBox: (n) => (n > 1 ? `Қорапта ${n} дана` : '1 даннан бастап'),
    boxPrice: (v) => `Қорап: ${v}`,
    articleLabel: 'Артикул',
    howToBuyTitle: 'Қалай тапсырыс беруге болады',
    howToBuySteps: [
      '«Жаңа түскен тауарлар» немесе «Көтерме тапсырыстар» бөлімін ашып, керекті қораптарды себетке қосыңыз.',
      '«WhatsApp арқылы тапсырыс беру» батырмасын басыңыз — тауар тізімі бізге дайын хабарлама болып келеді.',
      'Біз қолжетімділікті және жеңілдікті ескерген соңғы соманы растаймыз, төлемді аударыммен қабылдап, тапсырысты Қазақстан бойынша жөнелтеміз.',
    ],
    footerAbout: 'RMZ — техника мен үй тауарларының көтерме қоймасы. Тікелей әкелеміз.',
    footerAddress: 'Алматы, Байсат базары, 10-қатар, 19-контейнер',
    footerHours: 'Күн сайын 9:00–18:00 · тапсырыс тәулік бойы қабылданады',
    addToCart: 'Себетке',
    addedToCart: 'Қосылды',
    cartTitle: 'Себет',
    cartEmpty: 'Себет бос. Каталогтан тауар қосыңыз.',
    cartTotalBoxes: (n) => `Себеттегі қораптар: ${n}`,
    cartDiscountHint: '🎁 Жеңілдік: 5 қораптан −5%, 10 қораптан −10%, 20 қораптан −15%',
    cartCheckout: '💬 WhatsApp арқылы тапсырыс беру',
    orderDiscountLine: '🎁 Жеңілдіктер: 5 қораптан −5%, 10 қораптан −10%, 20 қораптан −15%',
    orderGreeting: 'Сәлеметсіз бе! Тапсырыс бергім келеді:',
    orderTotalLine: (n) => `Барлығы қорап: ${n}`,
    boxesShort: 'қор.',
    trustLine: (n) => `Тікелей жеткізу · Тек тексерілген тауарлар${n ? ` · ${n}+ позиция` : ''}`,
    navDelivery: 'Жеткізу және төлем',
    navTerms: 'Көтермешілерге',
    deliveryTitle: 'Жеткізу және төлем',
    deliveryItems: [
      'Бүкіл Қазақстан бойынша жеткізу — тапсырыс расталған күні жөнелтеміз.',
      'Қоймадан өзі алып кету: Алматы, Байсат базары, 10-қатар, 19-контейнер, күн сайын 9:00–18:00.',
      'Менеджер қолжетімділік пен соңғы соманы растағаннан кейін банк аударымымен төлем.',
      'Тапсырысты кез келген уақытта себет және WhatsApp арқылы беруге болады.',
    ],
    termsTitle: 'Көтерме сатып алушыларға',
    termsItems: [
      'Тек қораппен сатамыз — қорап көлемі әр тауарда көрсетілген.',
      'Ең аз тапсырыс — 100 000 ₸, әртүрлі позицияларды араластыруға болады.',
      'Бағалар мен қалдықтар қоймадан жаңартылып тұрады.',
      'Тапсырыс бойынша сұрақтар — WhatsApp-та менеджер: +7 777 254 44 64.',
    ],
    footBuyers: 'Сатып алушыларға',
    footCompany: 'Компания',
    footNote: 'Бағалар мен қалдықтар қоймадан автоматты түрде жаңарады.',
    shareBtn: '🔗 Сілтемені көшіру',
    copied: '✓ Сілтеме көшірілді',
    pBoxPrice: 'Қорап бағасы',
    pcsShort: 'дана',
    otherGroup: 'Басқалар',
    sumLabel: 'Сомасы',
    discLabel: (p) => `Жеңілдік −${p}%`,
    totalLabel: 'Барлығы',
    cartBarBtn: 'Себетті ашу →',
    leftPcs: (n) => `Қалды: ${n} дана`,
    boxesPcs: (b, n) => `${b} қор. = ${n} дана`,
    perBoxLine: (n) => `қорапта ${n} дана`,
  },
};

let lang = localStorage.getItem(LANG_KEY) || 'kz';
function t(key, ...args) {
  const value = translations[lang][key];
  return typeof value === 'function' ? value(...args) : value;
}

let currentPage = 1;
let pageCount = 1;
// The two sections of the shop: "new" — fresh arrivals, "wholesale" — the
// whole wholesale catalogue (with product categories under it).
let section = 'wholesale';
let sectionCounts = { new: null, wholesale: null };
let activeCategory = null; // inside "wholesale": null (all) or the id of a main category
let activeSubcategory = null; // id of a subcategory inside activeCategory, or null
let searchQuery = '';
let searchDebounce = null;
let wakeTimer = null;
let allCategories = []; // every category, each with parent: { id, name } or null

function money(v) {
  if (v === null || v === undefined) return '';
  return Number(v).toLocaleString('ru-RU') + ' ₸';
}

function imageUrl(product) {
  const img = product.images && product.images[0];
  if (!img) return '';
  const url = (img.formats && ((img.formats.medium && img.formats.medium.url) || (img.formats.small && img.formats.small.url))) || img.url;
  return url.startsWith('http') ? url : API_BASE + url;
}

// Product texts (names, descriptions, categories) come from MoySklad,
// supplier files and the Telegram bot — always pass them through this
// before putting them into HTML, so they show as plain text and can never
// turn into markup or scripts. Safe for both element text and "quoted"
// attribute values.
function escapeHtml(s) {
  return (s ?? '').toString()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------- Cart ----------
// Kept client-side only (localStorage) — a customer picks products, the
// cabinet never sees the cart until "Оформить заказ" opens WhatsApp with
// the list prefilled, same as messaging the shop directly.
const CART_KEY = 'sklad_cart';
const WHATSAPP_NUMBER = '77772544464';
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
} catch {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // private-browsing / storage disabled — cart just won't persist across reloads
  }
}

function cartTotalBoxes() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function discountPercent(boxes) {
  return boxes >= 20 ? 15 : boxes >= 10 ? 10 : boxes >= 5 ? 5 : 0;
}

function lineSum(item) {
  return item.qty * (item.box || 1) * (item.price || 0);
}

function cartSums() {
  const sum = cart.reduce((a, i) => a + lineSum(i), 0);
  const pct = 0; // скидки отключены
  const discount = Math.round(sum * pct / 100);
  return { sum, pct, discount, total: sum - discount };
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const count = cartTotalBoxes();
  badge.textContent = count;
  badge.hidden = count === 0;
  document.getElementById('cartSub').textContent = `${count} ${t('boxesShort')}`;
  const bar = document.getElementById('cartBar');
  const pcs = cart.reduce((sum, i) => sum + i.qty * (i.box || 1), 0);
  bar.hidden = count === 0;
  document.body.classList.toggle('has-cart-bar', count > 0);
  document.getElementById('cartBarInfo').textContent = `🛒 ${count} ${t('boxesShort')} · ${pcs} ${t('pcsShort')}`;
  document.getElementById('cartBarBtn').textContent = t('cartBarBtn');
  refreshCardControls();
}

// How many boxes can be ordered: what is in stock, but at least one.
function maxBoxes(box, stock) {
  return stock > 0 ? Math.max(1, Math.floor(stock / box)) : 99;
}

function addToCart(sku, name, box = 1, stock = 0, price = 0) {
  const existing = cart.find((i) => i.sku === sku);
  if (existing) {
    existing.box = box;
    existing.stock = stock;
    existing.price = price;
    if (existing.qty < maxBoxes(box, stock)) existing.qty += 1;
  } else {
    cart.push({ sku, name, qty: 1, box, stock, price });
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function changeCartQty(sku, delta) {
  const item = cart.find((i) => i.sku === sku);
  if (!item) return;
  const next = item.qty + delta;
  if (next > maxBoxes(item.box || 1, item.stock || 0)) return;
  item.qty = next;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.sku !== sku);
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function removeCartItem(sku) {
  cart = cart.filter((i) => i.sku !== sku);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function renderCartDrawer() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty">${t('cartEmpty')}</div>`;
  } else {
    container.innerHTML = cart.map((item) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-sku">${escapeHtml(item.sku)}</div>
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-pcs">${t('perBoxLine', item.box || 1)} · <b>${t('boxesPcs', item.qty, item.qty * (item.box || 1))}</b></div>
          ${item.price ? `<div class="cart-item-sum">${money(item.price)} × ${item.qty * (item.box || 1)} = <b>${money(lineSum(item))}</b></div>` : ''}
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-qty-delta="-1" data-sku="${escapeHtml(item.sku)}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-qty-delta="1" data-sku="${escapeHtml(item.sku)}">+</button>
        </div>
        <button class="cart-item-remove" data-remove-sku="${escapeHtml(item.sku)}" aria-label="Удалить">✕</button>
      </div>
    `).join('');
  }
  const sums = cartSums();
  document.getElementById('cartTotal').innerHTML = escapeHtml(t('cartTotalBoxes', cartTotalBoxes()))
    + (sums.sum ? `<div class="cart-sums"><span class="grand">${t('totalLabel')}: ${money(sums.total)}</span></div>` : '');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  checkoutBtn.textContent = t('cartCheckout');
  checkoutBtn.disabled = cart.length === 0;
}

function buildOrderMessage() {
  const lines = [];
  lines.push(t('orderGreeting'));
  lines.push('');
  cart.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.sku} — ${item.qty} ${t('boxesShort')} (${item.qty * (item.box || 1)} ${t('pcsShort')})`);
  });
  lines.push('');
  lines.push(t('orderTotalLine', cartTotalBoxes()));
  const sums = cartSums();
  if (sums.sum) {
    if (sums.pct) lines.push(`${t('discLabel', sums.pct)}: −${money(sums.discount)}`);
    lines.push(`${t('totalLabel')}: ${money(sums.total)}`);
  }
  return lines.join('\n');
}

function checkoutViaWhatsApp() {
  if (!cart.length) return;
  const message = buildOrderMessage();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function openCart() {
  renderCartDrawer();
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}

function setupCart() {
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartBar').addEventListener('click', openCart);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('cartCheckoutBtn').addEventListener('click', checkoutViaWhatsApp);
  document.getElementById('cartItems').addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('[data-qty-delta]');
    if (qtyBtn) {
      changeCartQty(qtyBtn.dataset.sku, parseInt(qtyBtn.dataset.qtyDelta, 10));
      return;
    }
    const removeBtn = e.target.closest('[data-remove-sku]');
    if (removeBtn) removeCartItem(removeBtn.dataset.removeSku);
  });
  // Event delegation on the (persistent) grid container — survives every
  // re-render of the product cards inside it.
  document.getElementById('content').addEventListener('click', (e) => {
    const step = e.target.closest('[data-card-delta]');
    if (step) {
      changeCartQty(step.dataset.sku, parseInt(step.dataset.cardDelta, 10));
      return;
    }
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) addToCart(btn.dataset.sku, btn.dataset.name, Number(btn.dataset.box) || 1, Number(btn.dataset.stock) || 0, Number(btn.dataset.price) || 0);
  });
  updateCartBadge();
}

// ---------- Product cards ----------

// The cabinet fills an empty description with "📦 В коробке: 36 pcs ✅ Твой хороший
// выбор" — it only repeats the box size shown on the card, so it is not shown.
const AUTO_DESC = /Твой хороший выбор/;

// Under the price: "add" button, or — once the product is in the cart — a
// stepper that changes the number of boxes and shows how many pieces that is.
function cardControlHtml(sku, name, box, stock, price) {
  const item = cart.find((i) => i.sku === sku);
  const attrs = `data-sku="${escapeHtml(sku)}"`;
  if (!item) {
    return `<button class="add-to-cart-btn" ${attrs} data-name="${escapeHtml(name)}" data-box="${box}" data-stock="${stock}" data-price="${price}">🛒 ${t('addToCart')}</button>`;
  }
  return `<div class="card-step">
      <button class="qty-btn" data-card-delta="-1" ${attrs} aria-label="−">−</button>
      <div class="step-info"><b>${t('boxesPcs', item.qty, item.qty * box)}</b></div>
      <button class="qty-btn" data-card-delta="1" ${attrs} aria-label="+">+</button>
    </div>`;
}

function refreshCardControls() {
  document.querySelectorAll('.card-cart').forEach((el) => {
    el.innerHTML = cardControlHtml(el.dataset.sku, el.dataset.name, Number(el.dataset.box) || 1, Number(el.dataset.stock) || 0, Number(el.dataset.price) || 0);
  });
}

function productCardHtml(p) {
  const img = imageUrl(p);
  const sku = p.sku || p.name;
  const perBox = Number(p.minOrderQty) || 1;
  const hasPrice = p.wholesalePrice > 0;
  productsBySku[sku] = p;
  return `
    <div class="card" data-sku="${escapeHtml(sku)}">
      ${p.isNew ? `<span class="badge-new">${t('badgeNew')}</span>` : ''}
      <div class="card-image">
        ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" loading="lazy" />` : `<span class="no-photo" aria-hidden="true">📦</span>`}
      </div>
      <div class="card-body">
        <h3>${escapeHtml(sku)}</h3>
        ${hasPrice ? `
          <div class="price-row"><span class="price">${money(p.wholesalePrice)}</span><span class="per">${t('perPiece')}</span></div>
          ${perBox > 1 ? `<div class="box-price">${t('boxPrice', money(p.wholesalePrice * perBox))}</div>` : ''}
        ` : `<div class="price-row"><span class="per">${t('priceOnRequest')}</span></div>`}
        ${p.description && !AUTO_DESC.test(p.description) ? `<div class="desc">${escapeHtml(p.description)}</div>` : ''}
        <div class="card-footer">
          <span class="minqty">${t('inBox', perBox)}</span>
          ${(p.stock > 0 && p.stock < 100)
            ? `<span class="stock low"><i class="dot"></i>${t('leftPcs', p.stock)}</span>`
            : `<span class="stock in"><i class="dot"></i>${t('inStock')}</span>`}
        </div>
        <div class="card-cart" data-sku="${escapeHtml(sku)}" data-name="${escapeHtml(p.name)}" data-box="${perBox}" data-stock="${Number(p.stock) || 0}" data-price="${Number(p.wholesalePrice) || 0}">${cardControlHtml(sku, p.name, perBox, Number(p.stock) || 0, Number(p.wholesalePrice) || 0)}</div>
      </div>
    </div>
  `;
}

function buildProductsUrl(page, extra = {}) {
  const params = new URLSearchParams();
  params.set('populate', '*');
  params.set('pagination[page]', page);
  params.set('pagination[pageSize]', extra.pageSize || PAGE_SIZE);
  params.set('filters[published][$eq]', 'true');
  params.set('filters[stock][$gte]', MIN_STOCK);
  if (section === 'new') {
    params.set('sort', 'createdAt:desc');
    params.set('filters[isNew][$eq]', 'true');
  } else {
    // Whole catalogue without a search: sorted by category, so the list can
    // be shown under category headings.
    if (!activeCategory && !activeSubcategory && !searchQuery) {
      params.set('sort[0]', 'category.name:asc');
      params.set('sort[1]', 'name:asc');
    } else {
      params.set('sort', 'name:asc');
    }
    if (activeSubcategory) {
      params.set('filters[category][id][$eq]', activeSubcategory);
    } else if (activeCategory) {
      // A main category shows its own products and those of its subcategories.
      [activeCategory, ...subcategoriesOf(activeCategory).map(c => c.id)].forEach((id, i) => {
        params.set(`filters[category][id][$in][${i}]`, id);
      });
    }
  }
  if (searchQuery) {
    params.set('filters[$or][0][name][$containsi]', searchQuery);
    params.set('filters[$or][1][sku][$containsi]', searchQuery);
  }
  return API_BASE + '/api/products?' + params.toString();
}

// Cards of one page; in the whole-catalogue view a heading is put in front of
// each new category (lastGroup remembers the one the previous page ended on).
let lastGroup = null;
function cardsHtml(products, reset) {
  const grouped = section === 'wholesale' && !activeCategory && !activeSubcategory && !searchQuery && allCategories.length > 0;
  if (reset) lastGroup = null;
  if (!grouped) return products.map(productCardHtml).join('');
  return products.map((p) => {
    const name = p.category?.name || '';
    let head = '';
    if (name !== lastGroup) {
      lastGroup = name;
      head = `<h2 class="cat-head">${escapeHtml(name ? categoryLabel(name) : t('otherGroup'))}</h2>`;
    }
    return head + productCardHtml(p);
  }).join('');
}

// ---------- Product window (own link: #p=SKU) ----------
const productsBySku = {};

function openProduct(p, pushHash = true) {
  const sku = p.sku || p.name;
  const perBox = Number(p.minOrderQty) || 1;
  const price = Number(p.wholesalePrice) || 0;
  const img = imageUrl(p);
  const low = p.stock > 0 && p.stock < 100;
  document.getElementById('pBody').innerHTML = `
    <div class="pview">
      <div>${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" />` : ''}</div>
      <div>
        <h2>${escapeHtml(sku)}</h2>
        <div class="cart-item-name">${escapeHtml(p.name)}</div>
        ${price ? `<div class="price-row" style="margin-top:12px"><span class="price">${money(price)}</span><span class="per">${t('perPiece')}</span></div>` : `<div class="per" style="margin-top:12px">${t('priceOnRequest')}</div>`}
        <div class="pfacts">
          ${price && perBox > 1 ? `<span>📦 ${t('pBoxPrice')}: <b>${money(price * perBox)}</b></span>` : ''}
          <span>${t('inBox', perBox)}</span>
          <span class="stock ${low ? 'low' : 'in'}"><i class="dot"></i>${low ? t('leftPcs', p.stock) : t('inStock')}</span>
        </div>
        ${p.description && !AUTO_DESC.test(p.description) ? `<div class="pdesc">${escapeHtml(p.description)}</div>` : ''}
        <div class="card-cart" data-sku="${escapeHtml(sku)}" data-name="${escapeHtml(p.name)}" data-box="${perBox}" data-stock="${Number(p.stock) || 0}" data-price="${price}">${cardControlHtml(sku, p.name, perBox, Number(p.stock) || 0, price)}</div>
        <button class="pshare" id="pShare" type="button">${t('shareBtn')}</button>
      </div>
    </div>`;
  document.getElementById('pModal').hidden = false;
  document.getElementById('pShare').addEventListener('click', async (e) => {
    const url = `${location.origin}${location.pathname}#p=${encodeURIComponent(sku)}`;
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard blocked */ }
    e.target.textContent = t('copied');
  });
  if (pushHash) history.replaceState(null, '', `#p=${encodeURIComponent(sku)}`);
}

function closeProduct() {
  document.getElementById('pModal').hidden = true;
  if (location.hash.startsWith('#p=')) history.replaceState(null, '', location.pathname + location.search);
}

async function openProductFromHash() {
  if (!location.hash.startsWith('#p=')) return;
  const sku = decodeURIComponent(location.hash.slice(3));
  try {
    const url = `${API_BASE}/api/products?populate=*&filters[published][$eq]=true&filters[sku][$eq]=${encodeURIComponent(sku)}`;
    const json = await (await fetch(url)).json();
    if (json.data?.[0]) openProduct(normalize(json.data[0]), false);
  } catch (e) {
    console.error(e);
  }
}

function setupProductWindow() {
  document.getElementById('pClose').addEventListener('click', closeProduct);
  document.getElementById('pModal').addEventListener('click', (e) => { if (e.target.id === 'pModal') closeProduct(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProduct(); });
  document.getElementById('content').addEventListener('click', (e) => {
    const hit = e.target.closest('.card-image, .card-body h3');
    if (!hit) return;
    const p = productsBySku[hit.closest('.card')?.dataset.sku];
    if (p) openProduct(p);
  });
  document.getElementById('pBody').addEventListener('click', (e) => {
    const step = e.target.closest('[data-card-delta]');
    if (step) changeCartQty(step.dataset.sku, parseInt(step.dataset.cardDelta, 10));
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) addToCart(btn.dataset.sku, btn.dataset.name, Number(btn.dataset.box) || 1, Number(btn.dataset.stock) || 0, Number(btn.dataset.price) || 0);
  });
}

function normalize(item) {
  return item.attributes ? { id: item.id, ...item.attributes } : item;
}

// How many products each section holds (shown on the section tabs). The
// answer also picks which section opens first: fresh arrivals when there
// are any, otherwise the whole catalogue.
async function fetchSectionCounts() {
  const base = `${API_BASE}/api/products?pagination[pageSize]=1&filters[published][$eq]=true&filters[stock][$gte]=${MIN_STOCK}`;
  const total = async (suffix) => {
    const json = await (await fetch(base + suffix)).json();
    return json.meta?.pagination?.total ?? null;
  };
  const [fresh, all] = await Promise.all([total('&filters[isNew][$eq]=true'), total('')]);
  return { new: fresh, wholesale: all };
}

function showLoading() {
  const content = document.getElementById('content');
  content.className = 'loading';
  content.textContent = t('loading');
  // The free server sleeps when nobody visits — the first load can take a minute.
  clearTimeout(wakeTimer);
  wakeTimer = setTimeout(() => {
    if (content.className === 'loading') content.textContent = t('wakeHint');
  }, 7000);
}

async function loadProducts(reset) {
  const content = document.getElementById('content');
  const loadMoreBtn = document.getElementById('loadMore');

  if (reset) {
    currentPage = 1;
    showLoading();
  } else {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = t('loadingMore');
  }

  try {
    const res = await fetch(buildProductsUrl(currentPage));
    const json = await res.json();
    clearTimeout(wakeTimer);
    const products = (json.data || []).map(normalize);
    pageCount = json.meta?.pagination?.pageCount || 1;
    const total = json.meta?.pagination?.total || products.length;

    document.getElementById('resultCount').textContent = total > 0 ? t('resultCount', total) : '';

    if (reset) {
      if (products.length === 0) {
        content.className = 'empty';
        content.textContent = searchQuery || activeCategory ? t('emptyNotFound') : t('emptyNoProducts');
      } else {
        content.className = 'grid';
        content.innerHTML = cardsHtml(products, true);
      }
    } else {
      content.insertAdjacentHTML('beforeend', cardsHtml(products, false));
    }

    loadMoreBtn.style.display = currentPage < pageCount ? 'block' : 'none';
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = t('loadMore');
  } catch (e) {
    clearTimeout(wakeTimer);
    content.className = 'empty';
    content.textContent = t('errorLoad');
    console.error(e);
  }
}

// ---------- Sections and categories ----------

const SECTION_ICONS = {
  new: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.2 5.3 5.8.5-4.4 3.8 1.4 5.6L12 15.2 7 18.2l1.4-5.6L4 8.8l5.8-.5L12 3Z"/></svg>',
  wholesale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9ZM3 7.5l9 4.5 9-4.5M12 12v9"/></svg>',
};

function renderSections() {
  document.getElementById('sections').innerHTML = ['new', 'wholesale'].map((key) => `
    <button data-section="${key}" class="${section === key ? 'active' : ''}" aria-pressed="${section === key}">
      <span class="s-ico">${SECTION_ICONS[key]}</span>
      <span class="s-name">${t(key === 'new' ? 'sectionNew' : 'sectionWholesale')}</span>
      ${sectionCounts[key] ? `<b class="s-count">${sectionCounts[key]}</b>` : ''}
    </button>
  `).join('');
}

function switchSection(next, { scroll = false } = {}) {
  if (next === section) {
    if (scroll) document.getElementById('shelf').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  section = next;
  activeCategory = null;
  activeSubcategory = null;
  renderSections();
  renderCategories();
  loadProducts(true);
  if (scroll) document.getElementById('shelf').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Categories with their parent, minus empty ones: a category with no
// published products (a main one counts its subcategories too) is left
// out, so customers never open an empty page. If the counts can't be
// fetched, every category is shown.
async function fetchCategories() {
  const base = API_BASE + '/api/categories?pagination[pageSize]=100&sort=name:asc';
  const counts = '&populate[products][count]=true&populate[products][filters][published][$eq]=true&populate[products][filters][stock][$gte]=' + MIN_STOCK;
  // Richest request first; an older backend that doesn't know subcategories
  // (the "parent" relation) or counts rejects it, so fall back step by step.
  const attempts = ['&populate[parent][fields][0]=name' + counts, counts, ''];
  let json = {};
  for (const extra of attempts) {
    json = await (await fetch(base + extra)).json();
    if (Array.isArray(json.data)) break;
  }
  const list = (json.data || []).map(normalize);
  const filled = (c) => c.products?.count === undefined || c.products.count > 0;
  return list
    .filter(c => filled(c) || (!c.parent && list.some(s => s.parent && s.parent.id === c.id && filled(s))))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru')); // same order as in the cabinet
}

function mainCategories() {
  return allCategories.filter(c => !c.parent);
}

function subcategoriesOf(id) {
  return allCategories.filter(c => c.parent && c.parent.id === id);
}

// Category names are typed in Russian in the cabinet; the usual ones get a
// Kazakh label here, any new category just keeps the name it was given.
const CATEGORY_KZ = {
  'Столовые приборы': 'Ас құралдары',
  'Кружки и стаканы': 'Кружкалар мен стақандар',
  'Хранение продуктов': 'Азық-түлік сақтау',
  'Сервировка': 'Дастарқан жабдықтары',
  'Кухонные аксессуары': 'Ас үй керек-жарақтары',
};

function categoryLabel(name) {
  return lang === 'kz' && CATEGORY_KZ[name] ? CATEGORY_KZ[name] : name;
}

function pillsHtml(buttons, activeId) {
  return buttons.map(c => `
    <button data-id="${escapeHtml(String(c.id))}" class="${activeId === c.id ? 'active' : ''}">${escapeHtml(categoryLabel(c.name))}</button>
  `).join('');
}

// Product categories only exist inside "Оптовые заказы": first row — all /
// main categories, second row (only when the chosen main category has any)
// — "all" of it plus its subcategories. "Новые поступления" has no rows.
function renderCategories() {
  renderCatMenu();
  const row = document.getElementById('categories');
  const subEl = document.getElementById('subcategories');
  const show = section === 'wholesale' && mainCategories().length > 0;
  row.hidden = !show;
  if (!show) {
    row.innerHTML = '';
    subEl.hidden = true;
    subEl.innerHTML = '';
    return;
  }
  row.innerHTML = pillsHtml([{ id: null, name: t('allCategories') }, ...mainCategories()], activeCategory);
  const subs = typeof activeCategory === 'number' ? subcategoriesOf(activeCategory) : [];
  subEl.hidden = subs.length === 0;
  subEl.innerHTML = subs.length
    ? pillsHtml([{ id: null, name: t('allInCategory') }, ...subs], activeSubcategory)
    : '';
}

// "Каталог товаров" drop-down in the main menu: every category, with its count.
function renderCatMenu() {
  const menu = document.getElementById('catMenu');
  const item = (id, name, count) => `<button type="button" data-id="${id}">${escapeHtml(categoryLabel(name))}${count ? `<b>${count}</b>` : ''}</button>`;
  menu.innerHTML = item('null', t('allCategories'), sectionCounts.wholesale)
    + mainCategories().map((c) => item(c.id, c.name, c.products?.count)).join('');
}

function setupMainMenu() {
  const menu = document.getElementById('catMenu');
  const btn = document.getElementById('catMenuBtn');
  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!menu.classList.contains('open')); });
  document.addEventListener('click', () => setOpen(false));
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    section = 'wholesale';
    activeCategory = b.dataset.id === 'null' ? null : Number(b.dataset.id);
    activeSubcategory = null;
    renderSections();
    renderCategories();
    loadProducts(true);
    document.getElementById('shelf').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-go]');
    if (!a) return;
    e.preventDefault();
    const go = a.dataset.go;
    if (go === 'new' || go === 'wholesale') switchSection(go, { scroll: true });
    else document.querySelector({ home: '#top', delivery: '#deliverySec', terms: '#termsSec', contacts: '#siteFooter' }[go]).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function pillId(btn) {
  const id = btn.dataset.id;
  return id === 'null' ? null : Number(id);
}

// On a phone the pill rows scroll sideways — keep the chosen pill in view.
function revealActivePill(rowId) {
  const active = document.querySelector(`#${rowId} button.active`);
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function setupNavigation() {
  document.getElementById('sections').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-section]');
    if (btn) switchSection(btn.dataset.section);
  });
  document.getElementById('heroBtn').addEventListener('click', () => switchSection('wholesale', { scroll: true }));
  setupMainMenu();
  document.getElementById('categories').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    activeCategory = pillId(btn);
    activeSubcategory = null;
    renderCategories();
    revealActivePill('categories');
    loadProducts(true);
  });
  document.getElementById('subcategories').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    activeSubcategory = pillId(btn);
    renderCategories();
    revealActivePill('subcategories');
    loadProducts(true);
  });
}

function setupSearch() {
  const input = document.getElementById('search');
  input.placeholder = t('searchPlaceholder');
  // On a phone the search box sits under the header, on a computer inside it.
  const phone = matchMedia('(max-width: 860px)');
  const place = () => document.getElementById(phone.matches ? 'searchSlotM' : 'searchSlotD').appendChild(document.getElementById('searchForm'));
  place();
  phone.addEventListener('change', place);
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(searchDebounce);
    searchQuery = input.value.trim();
    if (section !== 'wholesale') switchSection('wholesale');
    else loadProducts(true);
    document.getElementById('shelf').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  input.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    const value = e.target.value.trim();
    searchDebounce = setTimeout(() => {
      searchQuery = value;
      loadProducts(true);
    }, 350);
  });
}

function setupLoadMore() {
  document.getElementById('loadMore').addEventListener('click', () => {
    currentPage += 1;
    loadProducts(false);
  });
}

const PERK_ICONS = [
  '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9ZM3 7.5l9 4.5 9-4.5M12 12v9"/>',
  '<path d="M3 8a3 3 0 0 1 3-3h12v4M3 8v9a3 3 0 0 0 3 3h13a2 2 0 0 0 2-2V10a1 1 0 0 0-1-1H6a3 3 0 0 1-3-1ZM16.5 14.5h.01"/>',
  '<path d="M2.5 6.5h11v10h-11zM13.5 9.5h4l3 3v4h-7M6.5 19.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM17 19.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z"/>',
];

function renderStaticText() {
  document.title = t('pageTitle');
  document.getElementById('brandName').textContent = t('brandName');
  document.getElementById('brandTag').textContent = t('brandTag');
  document.getElementById('heroKicker').textContent = t('trustLine', sectionCounts.wholesale);
  document.getElementById('pageTitle').textContent = t('heroTitle');
  document.getElementById('pageSubtitle').textContent = t('pageSubtitle');
  document.getElementById('heroBtn').textContent = t('heroCta');
  document.getElementById('catMenuLabel').textContent = t('catMenu');
  document.getElementById('cartLabel').textContent = t('cartLabel');
  document.getElementById('navLinks').innerHTML = [
    ['home', 'navHome'], ['new', 'navNew'], ['wholesale', 'navWholesale'], ['delivery', 'navDelivery'], ['terms', 'navTerms'], ['contacts', 'navContacts'],
  ].map(([go, key]) => `<a href="#" data-go="${go}">${t(key)}</a>`).join('');
  document.getElementById('deliveryTitle').textContent = t('deliveryTitle');
  document.getElementById('deliveryList').innerHTML = t('deliveryItems').map((x) => `<li>${x}</li>`).join('');
  document.getElementById('termsTitle').textContent = t('termsTitle');
  document.getElementById('termsList').innerHTML = t('termsItems').map((x) => `<li>${x}</li>`).join('');
  updateCartBadge();
  document.getElementById('perks').innerHTML = t('perks').map(([title, text], i) => `
    <li>
      <span class="perk-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PERK_ICONS[i]}</svg></span>
      <span><b>${title}</b><small>${text}</small></span>
    </li>`).join('');
  document.getElementById('search').placeholder = t('searchPlaceholder');
  document.getElementById('howToBuyTitle').textContent = t('howToBuyTitle');
  document.getElementById('howToBuySteps').innerHTML = t('howToBuySteps').map(s => `<li>${s}</li>`).join('');
  document.getElementById('cartTitle').textContent = t('cartTitle');
  renderCartDrawer();
  const links = `
    <a class="whatsapp" href="https://wa.me/77772544464" target="_blank" rel="noopener">WhatsApp</a>
    <a class="channel" href="https://whatsapp.com/channel/0029VaJ8LFg4tRrsQ7ts2Z3H" target="_blank" rel="noopener">${lang === 'ru' ? 'Канал WhatsApp' : 'WhatsApp арнасы'}</a>
    <a class="telegram" href="https://t.me/rmz_tehniki_almaty" target="_blank" rel="noopener">Telegram</a>
    <a class="phone" href="tel:+77772544464">+7 777 254 44 64</a>
  `;
  document.getElementById('contacts').innerHTML = links;
  document.getElementById('siteFooter').innerHTML = `
    <div class="footer-col footer-brand"><h4>RMZ</h4><span>${t('footerAbout')}</span><span>📍 ${t('footerAddress')}</span><span>🕘 ${t('footerHours')}</span><span><a href="tel:+77772544464">+7 777 254 44 64</a></span></div>
    <div class="footer-col"><h4>${t('footBuyers')}</h4><a href="#" data-go="wholesale">${t('navWholesale')}</a><a href="#" data-go="new">${t('navNew')}</a><a href="#" data-go="delivery">${t('navDelivery')}</a></div>
    <div class="footer-col"><h4>${t('footCompany')}</h4><a href="#" data-go="terms">${t('navTerms')}</a><a href="https://wa.me/77772544464" target="_blank" rel="noopener">WhatsApp</a><a href="https://t.me/rmz_tehniki_almaty" target="_blank" rel="noopener">Telegram</a></div>
    <div class="footer-note">${t('footNote')}</div>
  `;

  document.querySelectorAll('#langSwitch button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.documentElement.lang = lang === 'ru' ? 'ru' : 'kk';
}

function setLang(newLang) {
  lang = newLang;
  localStorage.setItem(LANG_KEY, lang);
  renderStaticText();
  renderSections();
  renderCategories();
  loadProducts(true);
}

function setupLangSwitch() {
  document.querySelectorAll('#langSwitch button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

// If the logo file is missing the brand still shows as a text mark.
function setupLogo() {
  const img = document.getElementById('brandLogo');
  img.addEventListener('error', () => {
    img.replaceWith(Object.assign(document.createElement('span'), { className: 'brand-fallback', textContent: 'RMZ' }));  });
}

async function init() {
  setupLogo();
  renderStaticText();
  setupLangSwitch();
  setupNavigation();
  setupSearch();
  setupLoadMore();
  setupCart();
  setupProductWindow();
  section = null; // nothing is highlighted until we know which section opens
  renderSections();
  showLoading();

  // Counts decide the opening section: fresh arrivals first, when there are any.
  try {
    sectionCounts = await fetchSectionCounts();
  } catch (e) {
    console.error('Не удалось получить число товаров', e);
  }
  // A link ending in #new or #wholesale opens that section directly.
  const wanted = location.hash.slice(1);
  renderStaticText();
  section = wanted === 'new' || wanted === 'wholesale' ? wanted : sectionCounts.new > 0 ? 'new' : 'wholesale';
  renderSections();
  loadProducts(true);
  openProductFromHash();

  try {
    allCategories = await fetchCategories();
  } catch (e) {
    console.error('Не удалось загрузить категории', e);
  }
  renderCategories();
}

init();
