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
    contactSoon: (name) => `${name} (скоро)`,
    contactAlert: 'Укажите реальный контакт в файле public/catalog/index.html (раздел "Как купить").',
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
    contactSoon: (name) => `${name} (жақында)`,
    contactAlert: 'public/catalog/index.html файлында ("Қалай сатып алуға болады" бөлімінде) нақты байланысты көрсетіңіз.',
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

function productCardHtml(p) {
  return `
    <div class="card">
      ${p.isNew ? `<span class="badge-new">${t('badgeNew')}</span>` : ''}
      ${imageUrl(p) ? `<img src="${imageUrl(p)}" alt="${p.name}" loading="lazy" />` : ''}
      <div class="card-body">
        <h3>${p.name}</h3>
        ${p.description ? `<div class="desc">${p.description}</div>` : ''}
        <div class="price-row">
          <span class="minqty">${t('fromQty', p.minOrderQty || 1)}</span>
        </div>
        <span class="stock ${p.stock > 0 ? 'in' : 'out'}">
          ${p.stock > 0 ? t('inStock') : t('outStock')}
        </span>
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

function setupContactPlaceholders() {
  document.querySelectorAll('.contacts a.placeholder').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      alert(t('contactAlert'));
    });
  });
}

function renderStaticText() {
  document.getElementById('pageTitle').textContent = t('pageTitle');
  document.getElementById('pageSubtitle').textContent = t('pageSubtitle');
  document.getElementById('search').placeholder = t('searchPlaceholder');
  document.getElementById('howToBuyTitle').textContent = t('howToBuyTitle');
  document.getElementById('howToBuySteps').innerHTML = t('howToBuySteps').map(s => `<li>${s}</li>`).join('');
  document.getElementById('contacts').innerHTML = `
    <a class="placeholder" href="#">${t('contactSoon', 'WhatsApp')}</a>
    <a class="placeholder" href="#">${t('contactSoon', 'Telegram')}</a>
    <a class="placeholder" href="#">${t('contactSoon', lang === 'ru' ? 'Телефон' : 'Телефон')}</a>
  `;
  setupContactPlaceholders();

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
  loadProducts(true);
}

init();
