// Same origin by default (when Strapi itself serves this page). When this
// page is deployed separately (e.g. on Vercel), config.js sets
// window.SKLAD_API_BASE to the backend's full URL before this file loads.
const API_BASE = window.SKLAD_API_BASE || '';
const PAGE_SIZE = 30;
const LANG_KEY = 'sklad_catalog_lang';

const translations = {
  ru: {
    pageTitle: 'Каталог товаров',
    pageSubtitle: 'Оптовая продажа — цены и минимальные партии указаны у каждого товара',
    searchPlaceholder: 'Поиск по названию или артикулу…',
    allCategories: 'Все',
    newFilter: '🆕 Новинки',
    resultCount: (n) => `Найдено товаров: ${n}`,
    loading: 'Загрузка каталога…',
    loadingMore: 'Загрузка…',
    loadMore: 'Показать ещё',
    emptyNotFound: 'Ничего не найдено. Попробуйте изменить запрос или категорию.',
    emptyNoProducts: 'Товары пока не добавлены. Загляните позже.',
    errorLoad: 'Не удалось загрузить каталог. Попробуйте обновить страницу.',
    inStock: 'В наличии',
    outStock: 'Под заказ',
    badgeNew: 'Новинка',
    fromQty: (n) => `от ${n} шт.`,
    articleLabel: 'Артикул',
    howToBuyTitle: 'Как купить',
    howToBuySteps: [
      'Выберите нужные товары в каталоге выше — обратите внимание на минимальную партию заказа.',
      'Свяжитесь с нами по любому из контактов ниже и укажите название и количество товара.',
      'Мы подтвердим наличие, стоимость с учётом объёма и оформим отправку.',
    ],
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
  },
  kz: {
    pageTitle: 'Тауарлар каталогы',
    pageSubtitle: 'Көтерме сату — әр тауарда бағасы және ең аз партия саны көрсетілген',
    searchPlaceholder: 'Атауы немесе артикулы бойынша іздеу…',
    allCategories: 'Барлығы',
    newFilter: '🆕 Жаңалар',
    resultCount: (n) => `Табылған тауарлар: ${n}`,
    loading: 'Каталог жүктелуде…',
    loadingMore: 'Жүктелуде…',
    loadMore: 'Тағы да көрсету',
    emptyNotFound: 'Ештеңе табылмады. Сұранымды немесе санатты өзгертіп көріңіз.',
    emptyNoProducts: 'Тауарлар әлі қосылмады. Кейінірек кіріңіз.',
    errorLoad: 'Каталогты жүктеу мүмкін болмады. Бетті жаңартып көріңіз.',
    inStock: 'Бар',
    outStock: 'Тапсырыс бойынша',
    badgeNew: 'Жаңа',
    fromQty: (n) => `${n} даннан бастап`,
    articleLabel: 'Артикул',
    howToBuyTitle: 'Қалай сатып алуға болады',
    howToBuySteps: [
      'Жоғарыдағы каталогтан керекті тауарларды таңдаңыз — ең аз тапсырыс партиясына назар аударыңыз.',
      'Төмендегі кез келген байланыс арқылы бізге хабарласып, тауардың атауы мен санын көрсетіңіз.',
      'Біз қолжетімділікті, көлемге сай құнын растап, жөнелтуді рәсімдейміз.',
    ],
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
  },
};

let lang = localStorage.getItem(LANG_KEY) || 'ru';
function t(key, ...args) {
  const value = translations[lang][key];
  return typeof value === 'function' ? value(...args) : value;
}

let currentPage = 1;
let pageCount = 1;
let activeCategory = null;
let searchQuery = '';
let searchDebounce = null;
let allCategories = [];

function money(v) {
  if (v === null || v === undefined) return '';
  return Number(v).toLocaleString('ru-RU') + ' ₸';
}

function imageUrl(product) {
  const img = product.images && product.images[0];
  if (!img) return '';
  const url = (img.formats && img.formats.small && img.formats.small.url) || img.url;
  return url.startsWith('http') ? url : API_BASE + url;
}

function escapeAttr(s) {
  return (s || '').toString()
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

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const count = cartTotalBoxes();
  badge.textContent = count;
  badge.hidden = count === 0;
}

function addToCart(sku, name) {
  const existing = cart.find((i) => i.sku === sku);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ sku, name, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function changeCartQty(sku, delta) {
  const item = cart.find((i) => i.sku === sku);
  if (!item) return;
  item.qty += delta;
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
          <div class="cart-item-sku">${item.sku}</div>
          <div class="cart-item-name">${item.name}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-qty-delta="-1" data-sku="${escapeAttr(item.sku)}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-qty-delta="1" data-sku="${escapeAttr(item.sku)}">+</button>
        </div>
        <button class="cart-item-remove" data-remove-sku="${escapeAttr(item.sku)}" aria-label="Удалить">✕</button>
      </div>
    `).join('');
  }
  document.getElementById('cartTotal').textContent = t('cartTotalBoxes', cartTotalBoxes());
  document.getElementById('cartDiscountHint').textContent = t('cartDiscountHint');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  checkoutBtn.textContent = t('cartCheckout');
  checkoutBtn.disabled = cart.length === 0;
}

function buildOrderMessage() {
  const lines = [];
  lines.push(t('orderDiscountLine'));
  lines.push('');
  lines.push(t('orderGreeting'));
  lines.push('');
  cart.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.sku} — ${item.qty} ${t('boxesShort')}`);
  });
  lines.push('');
  lines.push(t('orderTotalLine', cartTotalBoxes()));
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
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    addToCart(btn.dataset.sku, btn.dataset.name);
    const original = btn.textContent;
    btn.textContent = `✓ ${t('addedToCart')}`;
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('added');
    }, 1200);
  });
  updateCartBadge();
}

function productCardHtml(p) {
  const img = imageUrl(p);
  const sku = p.sku || p.name;
  return `
    <div class="card">
      ${p.isNew ? `<span class="badge-new">${t('badgeNew')}</span>` : ''}
      <div class="card-image">
        ${img ? `<img src="${img}" alt="${p.name}" loading="lazy" />` : `<span class="no-photo" aria-hidden="true">📦</span>`}
      </div>
      <div class="card-body">
        <h3>${p.sku || p.name}</h3>
        ${p.wholesalePrice > 0 ? `<div class="price">${money(p.wholesalePrice)}</div>` : ''}
        ${p.description ? `<div class="desc">${p.description}</div>` : ''}
        <div class="card-footer">
          <span class="minqty">${t('fromQty', p.minOrderQty || 1)}</span>
          <span class="stock in">
            <i class="dot"></i>${t('inStock')}
          </span>
        </div>
        <button class="add-to-cart-btn" data-sku="${escapeAttr(sku)}" data-name="${escapeAttr(p.name)}">🛒 ${t('addToCart')}</button>
      </div>
    </div>
  `;
}

function buildProductsUrl(page) {
  const params = new URLSearchParams();
  params.set('populate', '*');
  params.set('pagination[page]', page);
  params.set('pagination[pageSize]', PAGE_SIZE);
  params.set('filters[published][$eq]', 'true');
  if (activeCategory === 'new') {
    params.set('sort', 'createdAt:desc');
    params.set('filters[isNew][$eq]', 'true');
  } else {
    params.set('sort', 'name:asc');
    if (activeCategory) {
      params.set('filters[category][id][$eq]', activeCategory);
    }
  }
  if (searchQuery) {
    params.set('filters[$or][0][name][$containsi]', searchQuery);
    params.set('filters[$or][1][sku][$containsi]', searchQuery);
  }
  return API_BASE + '/api/products?' + params.toString();
}

function normalize(item) {
  return item.attributes ? { id: item.id, ...item.attributes } : item;
}

async function loadProducts(reset) {
  const content = document.getElementById('content');
  const loadMoreBtn = document.getElementById('loadMore');

  if (reset) {
    currentPage = 1;
    content.className = 'loading';
    content.textContent = t('loading');
  } else {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = t('loadingMore');
  }

  try {
    const res = await fetch(buildProductsUrl(currentPage));
    const json = await res.json();
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
        content.innerHTML = products.map(productCardHtml).join('');
      }
    } else {
      content.insertAdjacentHTML('beforeend', products.map(productCardHtml).join(''));
    }

    loadMoreBtn.style.display = currentPage < pageCount ? 'block' : 'none';
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = t('loadMore');
  } catch (e) {
    content.className = 'empty';
    content.textContent = t('errorLoad');
    console.error(e);
  }
}

function renderCategories() {
  const el = document.getElementById('categories');
  const buttons = [
    { id: null, name: t('allCategories') },
    { id: 'new', name: t('newFilter') },
    ...allCategories,
  ];
  el.innerHTML = buttons.map(c => `
    <button data-id="${c.id}" class="${activeCategory === c.id ? 'active' : ''}">${c.name}</button>
  `).join('');
  el.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      activeCategory = id === 'null' ? null : id === 'new' ? 'new' : Number(id);
      el.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadProducts(true);
    });
  });
}

function setupSearch() {
  const input = document.getElementById('search');
  input.placeholder = t('searchPlaceholder');
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

function renderStaticText() {
  document.getElementById('pageTitle').textContent = t('pageTitle');
  document.getElementById('pageSubtitle').textContent = t('pageSubtitle');
  document.getElementById('search').placeholder = t('searchPlaceholder');
  document.getElementById('howToBuyTitle').textContent = t('howToBuyTitle');
  document.getElementById('howToBuySteps').innerHTML = t('howToBuySteps').map(s => `<li>${s}</li>`).join('');
  document.getElementById('cartTitle').textContent = t('cartTitle');
  renderCartDrawer();
  document.getElementById('contacts').innerHTML = `
    <a class="whatsapp" href="https://whatsapp.com/channel/0029VaJ8LFg4tRrsQ7ts2Z3H" target="_blank" rel="noopener">WhatsApp</a>
    <a class="telegram" href="https://t.me/rmz_tehniki_almaty" target="_blank" rel="noopener">Telegram</a>
    <a class="phone" href="tel:+77772544464">+7 777 254 44 64</a>
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
  renderCategories();
  loadProducts(true);
}

function setupLangSwitch() {
  document.querySelectorAll('#langSwitch button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

async function init() {
  renderStaticText();
  setupLangSwitch();

  try {
    const categoriesRes = await fetch(API_BASE + '/api/categories?pagination[pageSize]=100');
    const categoriesJson = await categoriesRes.json();
    allCategories = (categoriesJson.data || []).map(normalize);
    renderCategories();
  } catch (e) {
    console.error('Не удалось загрузить категории', e);
  }

  setupSearch();
  setupLoadMore();
  setupCart();
  loadProducts(true);
}

init();
