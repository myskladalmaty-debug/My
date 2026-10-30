const API_BASE = '';
// n8n workflow that looks up MoySklad cost prices and writes them back —
// triggered directly from the "Найти цены" button below.
const N8N_FIND_PRICES_WEBHOOK = 'https://n8n4701.hostkey.in/webhook/find-prices';
const TOKEN_KEY = 'sklad_manage_token';
const LANG_KEY = 'sklad_manage_lang';
const LOW_STOCK_THRESHOLD = 5;

const translations = {
  ru: {
    loginSubtitle: 'Простой кабинет для управления товарами',
    passwordPlaceholder: 'Пароль',
    loginBtn: 'Войти',
    logoutBtn: 'Выйти',
    addBtn: '+ Добавить товар',
    countLabel: (n) => `Товаров: ${n}`,
    countLabelFiltered: (n) => `Показано: ${n}`,
    thName: 'Название',
    thPrice: 'Цена',
    thStock: 'Остаток',
    thStatus: 'Статус',
    published: 'Опубликован',
    draft: 'Черновик',
    edit: 'Изменить',
    del: 'Удалить',
    emptyList: 'Товаров пока нет — нажмите «Добавить товар»',
    emptyFiltered: 'Нет товаров под этот фильтр',
    clearFilter: 'показать все',
    loadingList: 'Загрузка…',
    loadErrorList: 'Не удалось загрузить товары',
    modalTitleNew: 'Новый товар',
    modalTitleEdit: 'Редактировать товар',
    l_paste: 'Вставьте текст товара (например, из поста поставщика)',
    pasteHint: 'Название определится само по первой строке — можно поправить ниже',
    l_name: 'Название *',
    l_sku: 'Артикул',
    l_category: 'Категория',
    categoryHint: 'Нет нужной категории — добавьте её в «📁 Категории» вверху.',
    noCategory: '— без категории —',
    l_description: 'Описание',
    l_price: 'Опт. цена',
    l_minqty: 'Мин. партия, шт',
    l_stock: 'Остаток, шт (наличие)',
    l_photo: 'Фото',
    l_published: 'Опубликован (виден клиентам в каталоге)',
    l_isNew: 'Новинка (отмечен в каталоге как новый товар)',
    badgeNew: 'Новинка',
    moreShow: '+ Ещё поля (артикул, цена, категория)',
    moreHide: '– Скрыть дополнительные поля',
    cancel: 'Отмена',
    save: 'Сохранить',
    saving: 'Сохранение…',
    currentPhoto: (name) => `Текущее фото: ${name}. Выберите новый файл, чтобы заменить.`,
    confirmDelete: 'Удалить этот товар?',
    toastSaved: 'Сохранено',
    toastSaveError: 'Ошибка: не удалось сохранить товар',
    toastDeleted: 'Товар удалён',
    toastDeleteError: 'Ошибка удаления',
    loginErrorConn: 'Ошибка соединения с сервером',
    loginErrorGeneric: 'Не удалось войти',
    statTotal: 'Всего товаров',
    statPublished: 'Опубликовано',
    statLowStock: 'Мало на складе',
    chipDraft: 'Черновики',
    chipHighStock: 'Много на складе',
    chipNoPhoto: 'Без фото',
    chipNoPrice: 'Без цены',
    chipNoDescription: 'Без описания',
    chipNew: 'Новинки',
    chipTelegram: '📱 Из Telegram',
    bulkSelectedCount: (n) => `Выбрано: ${n}`,
    bulkPublish: 'Опубликовать',
    bulkUnpublish: 'Снять с публикации',
    bulkDelete: 'Удалить',
    bulkConfirmDelete: (n) => `Удалить выбранные товары (${n} шт.)? Это нельзя отменить.`,
    bulkDeselect: 'Отменить выбор',
    pricingTitle: 'Настройки алгоритма цены',
    pricingHint: 'Опт. цена считается по формуле: себестоимость + наценка, с округлением вверх.',
    l_markup: 'Наценка, %',
    l_roundTo: 'Округлять до, ₸',
    pricingFormula: (m, r) => `Пример: себестоимость 400 ₸ → цена = ${Math.ceil((400 * (1 + m / 100)) / r) * r} ₸`,
    pricingCoverage: (n) => `Себестоимость известна у ${n} товаров — только для них можно посчитать цену.`,
    l_forceApply: 'Пересчитать даже те цены, что я менял(а) вручную',
    pricingSave: 'Сохранить настройки',
    pricingApply: 'Применить ко всем товарам',
    pricingApplying: 'Применяю…',
    pricingApplied: (n) => `Готово — обновлено цен: ${n}`,
    pricingSaved: 'Настройки сохранены',
    syncMoyskladBtn: '🔄 Синхронизировать с МойСклад',
    syncNewOnlyBtn: '🆕 Новинки за 14 дней',
    syncingMoysklad: (n) => `Синхронизация… (${n})`,
    syncMoyskladDone: (imported, updated, deleted) => `Готово: добавлено ${imported}, обновлено ${updated}, удалено ${deleted}`,
    syncMoyskladError: 'Не удалось синхронизировать с МойСклад',
    findPricesBtn: '💰 Найти цены по МойСклад',
    findingPrices: 'Ищу цены…',
    findPricesDone: (updated, total) => `Готово: цена найдена для ${updated} из ${total}`,
    findPricesError: 'Не удалось найти цены',
    importFileBtn: '📄 Загрузить из файла',
    importFileHint: 'Excel/CSV — только текст. ZIP-архив (таблица + папка с фото) — с фото.',
    importingFile: 'Загружаю…',
    importFileDone: (created, total, withPhoto) => `Готово: добавлено ${created} из ${total} строк (с фото: ${withPhoto}). Товары — черновики, проверьте и опубликуйте вручную.`,
    importFileError: 'Не удалось загрузить файл',
    selectAll: 'Выбрать все',
    categoriesBtn: '📁 Категории',
    categoriesTitle: 'Категории и подкатегории',
    categoriesHint: 'Когда клиент выбирает основную категорию, её подкатегории появляются в каталоге вторым рядом.',
    l_newCategory: 'Новая категория',
    newCategoryPlaceholder: 'например: Фены',
    l_newCategoryParent: 'Где она будет',
    parentNone: '— основная категория —',
    parentInside: (name) => `подкатегория в «${name}»`,
    addCategory: '+ Добавить',
    categoriesEmpty: 'Категорий пока нет — добавьте первую выше.',
    renameCategory: 'Переименовать',
    deleteCategory: 'Удалить',
    renamePrompt: 'Новое название категории:',
    confirmDeleteCategory: (name) => `Удалить категорию «${name}»? Товары останутся, но без категории.`,
    confirmDeleteMain: (name, n) => `Удалить категорию «${name}»? Товары останутся, но без категории, а её подкатегории (${n}) станут основными.`,
    categoryExists: 'Такая категория уже есть',
    categoryNameRequired: 'Введите название категории',
    toastCategorySaved: 'Категория сохранена',
    toastCategoryDeleted: 'Категория удалена',
    toastCategoryError: 'Ошибка: не удалось сохранить категорию',
    productsShort: (n) => `${n} шт.`,
    close: 'Закрыть',
    filterAllCategories: 'Все категории',
    filterNoCategory: (n) => `Без категории (${n})`,
    bulkCategory: '📁 В категорию',
    moveTitle: (n) => `Переместить в категорию (${n} шт.)`,
    moveSave: 'Переместить',
    moveDone: 'Готово — товары перемещены',
  },
  kz: {
    loginSubtitle: 'Тауарларды басқаруға арналған қарапайым кабинет',
    passwordPlaceholder: 'Құпия сөз',
    loginBtn: 'Кіру',
    logoutBtn: 'Шығу',
    addBtn: '+ Тауар қосу',
    countLabel: (n) => `Тауарлар: ${n}`,
    countLabelFiltered: (n) => `Көрсетілді: ${n}`,
    thName: 'Аты',
    thPrice: 'Бағасы',
    thStock: 'Қалдық',
    thStatus: 'Мәртебесі',
    published: 'Жарияланды',
    draft: 'Жоба',
    edit: 'Өзгерту',
    del: 'Жою',
    emptyList: 'Тауарлар әлі жоқ — «Тауар қосу» батырмасын басыңыз',
    emptyFiltered: 'Бұл сүзгі бойынша тауар жоқ',
    clearFilter: 'барлығын көрсету',
    loadingList: 'Жүктелуде…',
    loadErrorList: 'Тауарларды жүктеу мүмкін болмады',
    modalTitleNew: 'Жаңа тауар',
    modalTitleEdit: 'Тауарды өңдеу',
    l_paste: 'Тауар мәтінін қойыңыз (мысалы, жеткізушінің хабарламасынан)',
    pasteHint: 'Атауы бірінші жолдан автоматты түрде анықталады — төменде түзетуге болады',
    l_name: 'Атауы *',
    l_sku: 'Артикул',
    l_category: 'Санат',
    categoryHint: 'Қажетті санат жоқ па — оны жоғарыдағы «📁 Санаттар» арқылы қосыңыз.',
    noCategory: '— санатсыз —',
    l_description: 'Сипаттама',
    l_price: 'Көтерме бағасы',
    l_minqty: 'Ең аз партия, дана',
    l_stock: 'Қалдық, дана (бар-жоғы)',
    l_photo: 'Фото',
    l_published: 'Жарияланды (клиенттерге каталогта көрінеді)',
    l_isNew: 'Жаңа тауар (каталогта жаңа деп белгіленеді)',
    badgeNew: 'Жаңа',
    moreShow: '+ Қосымша өрістер (артикул, баға, санат)',
    moreHide: '– Қосымша өрістерді жасыру',
    cancel: 'Бас тарту',
    save: 'Сақтау',
    saving: 'Сақталуда…',
    currentPhoto: (name) => `Ағымдағы фото: ${name}. Ауыстыру үшін жаңа файл таңдаңыз.`,
    confirmDelete: 'Бұл тауарды жою керек пе?',
    toastSaved: 'Сақталды',
    toastSaveError: 'Қате: тауарды сақтау мүмкін болмады',
    toastDeleted: 'Тауар жойылды',
    toastDeleteError: 'Жою кезінде қате шықты',
    loginErrorConn: 'Сервермен байланыс қатесі',
    loginErrorGeneric: 'Кіру мүмкін болмады',
    statTotal: 'Барлық тауарлар',
    statPublished: 'Жарияланған',
    statLowStock: 'Қоймада аз қалды',
    chipDraft: 'Жобалар',
    chipHighStock: 'Қоймада көп',
    chipNoPhoto: 'Фотосыз',
    chipNoPrice: 'Бағасыз',
    chipNoDescription: 'Сипаттамасыз',
    chipNew: 'Жаңалар',
    chipTelegram: '📱 Telegram-нан',
    bulkSelectedCount: (n) => `Таңдалды: ${n}`,
    bulkPublish: 'Жариялау',
    bulkUnpublish: 'Жариялаудан алу',
    bulkDelete: 'Жою',
    bulkConfirmDelete: (n) => `Таңдалған тауарларды жою керек пе (${n} дана)? Бұны қайтару мүмкін емес.`,
    bulkDeselect: 'Таңдауды болдырмау',
    pricingTitle: 'Баға алгоритмінің баптаулары',
    pricingHint: 'Көтерме баға формула бойынша есептеледі: өзіндік құн + үстеме баға, жоғары дөңгелектеп.',
    l_markup: 'Үстеме баға, %',
    l_roundTo: 'Дөңгелектеу, ₸',
    pricingFormula: (m, r) => `Мысал: өзіндік құн 400 ₸ → баға = ${Math.ceil((400 * (1 + m / 100)) / r) * r} ₸`,
    pricingCoverage: (n) => `Өзіндік құн ${n} тауарда белгілі — тек солар үшін баға есептеуге болады.`,
    l_forceApply: 'Мен өзім өзгерткен бағаларды да қайта есептеу',
    pricingSave: 'Баптауларды сақтау',
    pricingApply: 'Барлық тауарларға қолдану',
    pricingApplying: 'Қолданылуда…',
    pricingApplied: (n) => `Дайын — жаңартылған бағалар: ${n}`,
    pricingSaved: 'Баптаулар сақталды',
    syncMoyskladBtn: '🔄 МойСклад-пен синхрондау',
    syncNewOnlyBtn: '🆕 14 күндегі жаңалар',
    syncingMoysklad: (n) => `Синхрондалуда… (${n})`,
    syncMoyskladDone: (imported, updated, deleted) => `Дайын: қосылды ${imported}, жаңартылды ${updated}, жойылды ${deleted}`,
    syncMoyskladError: 'МойСклад-пен синхрондау мүмкін болмады',
    findPricesBtn: '💰 МойСклад-тан баға табу',
    findingPrices: 'Бағалар ізделуде…',
    findPricesDone: (updated, total) => `Дайын: ${total} тауардың ${updated} бағасы табылды`,
    findPricesError: 'Бағаларды табу мүмкін болмады',
    importFileBtn: '📄 Файлдан жүктеу',
    importFileHint: 'Excel/CSV — тек мәтін. ZIP-архив (кесте + фото қалтасы) — фотомен.',
    importingFile: 'Жүктелуде…',
    importFileDone: (created, total, withPhoto) => `Дайын: ${total} жолдан ${created} қосылды (фотомен: ${withPhoto}). Тауарлар — жоба, тексеріп, қолмен жариялаңыз.`,
    importFileError: 'Файлды жүктеу мүмкін болмады',
    selectAll: 'Барлығын таңдау',
    categoriesBtn: '📁 Санаттар',
    categoriesTitle: 'Санаттар және ішкі санаттар',
    categoriesHint: 'Клиент негізгі санатты таңдағанда, оның ішкі санаттары каталогта екінші қатарда шығады.',
    l_newCategory: 'Жаңа санат',
    newCategoryPlaceholder: 'мысалы: Фендер',
    l_newCategoryParent: 'Қай жерде болады',
    parentNone: '— негізгі санат —',
    parentInside: (name) => `«${name}» ішіндегі ішкі санат`,
    addCategory: '+ Қосу',
    categoriesEmpty: 'Санаттар әлі жоқ — біріншісін жоғарыда қосыңыз.',
    renameCategory: 'Атын өзгерту',
    deleteCategory: 'Жою',
    renamePrompt: 'Санаттың жаңа атауы:',
    confirmDeleteCategory: (name) => `«${name}» санатын жою керек пе? Тауарлар қалады, бірақ санатсыз.`,
    confirmDeleteMain: (name, n) => `«${name}» санатын жою керек пе? Тауарлар санатсыз қалады, ал оның ішкі санаттары (${n}) негізгі болады.`,
    categoryExists: 'Мұндай санат бар',
    categoryNameRequired: 'Санат атауын енгізіңіз',
    toastCategorySaved: 'Санат сақталды',
    toastCategoryDeleted: 'Санат жойылды',
    toastCategoryError: 'Қате: санатты сақтау мүмкін болмады',
    productsShort: (n) => `${n} дана`,
    close: 'Жабу',
    filterAllCategories: 'Барлық санаттар',
    filterNoCategory: (n) => `Санатсыз (${n})`,
    bulkCategory: '📁 Санатқа',
    moveTitle: (n) => `Санатқа ауыстыру (${n} дана)`,
    moveSave: 'Ауыстыру',
    moveDone: 'Дайын — тауарлар ауыстырылды',
  },
};

let lang = localStorage.getItem(LANG_KEY) || 'ru';
function t(key, ...args) {
  const value = translations[lang][key];
  return typeof value === 'function' ? value(...args) : value;
}

let products = [];
let editingId = null; // documentId being edited, or null when adding
let selectedFiles = [];

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  return { Authorization: 'Bearer ' + getToken() };
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (el.style.display = 'none'), 2500);
}

function money(v) {
  if (v === null || v === undefined) return '';
  return Number(v).toLocaleString('ru-RU') + ' ₸';
}

// Product names come from MoySklad, supplier files and the Telegram bot —
// pass them through this before putting them into HTML, so they show as
// plain text and can never turn into markup or scripts in the cabinet.
function escapeHtml(s) {
  return (s ?? '').toString()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------- Language ----------

function applyStaticText() {
  document.getElementById('loginSubtitle').textContent = t('loginSubtitle');
  document.getElementById('passwordInput').placeholder = t('passwordPlaceholder');
  document.getElementById('loginBtn').textContent = t('loginBtn');
  document.getElementById('logoutBtn').textContent = t('logoutBtn');
  document.getElementById('addBtn').textContent = t('addBtn');
  document.getElementById('importFileBtn').textContent = t('importFileBtn');
  document.getElementById('importFileHint').textContent = t('importFileHint');
  document.getElementById('syncMoyskladBtn').textContent = t('syncMoyskladBtn');
  document.getElementById('syncNewOnlyBtn').textContent = t('syncNewOnlyBtn');
  document.getElementById('l_paste').textContent = t('l_paste');
  document.getElementById('pasteHint').textContent = t('pasteHint');
  document.getElementById('l_name').textContent = t('l_name');
  document.getElementById('l_sku').textContent = t('l_sku');
  document.getElementById('l_category').textContent = t('l_category');
  document.getElementById('categoryHint').textContent = t('categoryHint');
  document.getElementById('categoriesBtn').textContent = t('categoriesBtn');
  document.getElementById('categoriesTitle').textContent = t('categoriesTitle');
  document.getElementById('categoriesHint').textContent = t('categoriesHint');
  document.getElementById('l_newCategory').textContent = t('l_newCategory');
  document.getElementById('f_newCategoryName').placeholder = t('newCategoryPlaceholder');
  document.getElementById('l_newCategoryParent').textContent = t('l_newCategoryParent');
  document.getElementById('addCategoryBtn').textContent = t('addCategory');
  document.getElementById('categoriesCloseBtn').textContent = t('close');
  document.getElementById('moveCancelBtn').textContent = t('cancel');
  document.getElementById('moveSaveBtn').textContent = t('moveSave');
  document.getElementById('l_price').textContent = t('l_price');
  document.getElementById('l_minqty').textContent = t('l_minqty');
  document.getElementById('l_stock').textContent = t('l_stock');
  document.getElementById('l_photo').textContent = t('l_photo');
  document.getElementById('l_published').textContent = t('l_published');
  document.getElementById('l_isNew').textContent = t('l_isNew');
  document.getElementById('cancelBtn').textContent = t('cancel');
  document.getElementById('saveBtn').textContent = t('save');
  document.getElementById('modalTitle').textContent = editingId ? t('modalTitleEdit') : t('modalTitleNew');
  document.getElementById('moreToggle').textContent = document.getElementById('moreFields').classList.contains('hidden')
    ? t('moreShow')
    : t('moreHide');

  document.querySelectorAll('#langSwitch button, #langSwitchLogin button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.documentElement.lang = lang === 'ru' ? 'ru' : 'kk';
}

function setLang(newLang) {
  lang = newLang;
  localStorage.setItem(LANG_KEY, lang);
  applyStaticText();
  renderStats();
  renderFolderTabs();
  renderChips();
  renderCategoryFilter();
  renderTable();
  if (!document.getElementById('categoriesOverlay').classList.contains('hidden')) renderCategoriesModal();
}

function setupLangSwitch() {
  document.querySelectorAll('#langSwitch button, #langSwitchLogin button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

// ---------- Auth ----------

function showApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
  loadCategories();
  loadProducts();
}

function showLogin(message) {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('appScreen').classList.add('hidden');
  document.getElementById('loginError').textContent = message || '';
}

async function login() {
  const password = document.getElementById('passwordInput').value;
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';
  try {
    const res = await fetch(API_BASE + '/api/manage/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      errorEl.textContent = body.error?.message || t('loginErrorGeneric');
      return;
    }
    const json = await res.json();
    setToken(json.token);
    showApp();
  } catch (e) {
    errorEl.textContent = t('loginErrorConn');
    console.error(e);
  }
}

function logout() {
  clearToken();
  showLogin();
}

// ---------- Products list ----------

function normalize(item) {
  return item.attributes ? { id: item.id, documentId: item.documentId, ...item.attributes } : item;
}

async function loadProducts() {
  const wrap = document.getElementById('tableWrap');
  wrap.innerHTML = `<div class="empty">${t('loadingList')}</div>`;
  try {
    const res = await fetch(API_BASE + '/api/manage/products', { headers: authHeaders() });
    if (res.status === 401) {
      logout();
      return;
    }
    const json = await res.json();
    products = (json.data || []).map(normalize);
    selected = new Set([...selected].filter(id => products.some(p => p.documentId === id)));
    renderStats();
    renderFolderTabs();
    renderChips();
    renderCategoryFilter();
    renderTable();
  } catch (e) {
    wrap.innerHTML = `<div class="empty">${t('loadErrorList')}</div>`;
    console.error(e);
  }
}

const HIGH_STOCK_THRESHOLD = 50;

let statFilter = 'published'; // one of the keys in FILTERS
let selected = new Set(); // documentIds currently checked in the table

const FILTERS = {
  all: () => true,
  published: p => p.published,
  draft: p => !p.published,
  lowStock: p => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD,
  highStock: p => (p.stock ?? 0) > HIGH_STOCK_THRESHOLD,
  noPhoto: p => !(p.images && p.images.length),
  noPrice: p => !((p.wholesalePrice ?? 0) > 0),
  noStock: p => (p.stock ?? 0) <= 0,
  noDescription: p => !(p.description && p.description.trim()),
  isNew: p => !!p.isNew,
  telegram: p => p.source === 'telegram',
};

let searchText = '';
let viewMode = (() => { try { return localStorage.getItem('sklad_manage_view') || 'grid'; } catch { return 'grid'; } })();

function filteredProducts() {
  const q = searchText.trim().toLowerCase();
  return products.filter(FILTERS[statFilter] || FILTERS.all).filter(matchesCategoryFilter)
    .filter(p => !q || `${p.name || ''} ${p.sku || ''}`.toLowerCase().includes(q))
    // on-site products first, then new ones, then the rest (stable: keeps the name order inside each group)
    .sort((a, b) => (b.published ? 2 : 0) + (b.isNew ? 1 : 0) - ((a.published ? 2 : 0) + (a.isNew ? 1 : 0)));
}

const L = (ru, kz) => (lang === 'kz' ? kz : ru);

function photoUrl(p) {
  const img = p.images && p.images[0];
  if (!img) return '';
  const f = img.formats && (img.formats.small || img.formats.thumbnail);
  const u = (f && f.url) || img.url || '';
  return u.startsWith('http') ? u : API_BASE + u;
}

const FIX_KEYS = ['noPhoto', 'noPrice', 'noStock'];

// Top navigation: four big tabs, and under them either categories or "what to fix" pills.
function renderSidebar() {
  const el = document.getElementById('sidebar');
  if (!el) return;
  const isFix = FIX_KEYS.includes(statFilter);
  const cnt = (f) => products.filter(FILTERS[f]).length;
  const fixN = products.filter(p => p.published && (FILTERS.noPhoto(p) || FILTERS.noPrice(p))).length;
  const tab = (key, ico, label, sub, n, active, warn) => `<button type="button" class="tab ${active ? 'active' : ''} ${warn ? 'warn' : ''}" data-tab="${key}"><span class="ico">${ico}</span><span><span class="tl">${label}</span><small>${sub}</small></span><span class="tn">${n}</span></button>`;
  const tabProducts = products.filter(FILTERS[isFix ? 'all' : statFilter] || FILTERS.all);
  const inCat = (p, id) => { const ids = new Set([id, ...subcategoriesOf(id).map(c => c.documentId)]); return p.category && ids.has(p.category.documentId); };
  const pill = (attr, val, label, n, active) => `<button type="button" class="pill ${active ? 'active' : ''}" ${attr}="${val}">${escapeHtml(label)}<b>${n}</b></button>`;
  let row = '';
  if (isFix) {
    row = `<div class="pills">
      ${pill('data-sf', 'noPhoto', L('📷 Без фото', '📷 Фотосыз'), cnt('noPhoto'), statFilter === 'noPhoto')}
      ${pill('data-sf', 'noPrice', L('💰 Без цены', '💰 Бағасыз'), cnt('noPrice'), statFilter === 'noPrice')}
      ${pill('data-sf', 'noStock', L('📉 Нет в наличии', '📉 Қалдық жоқ'), cnt('noStock'), statFilter === 'noStock')}
    </div>`;
  } else {
    const mains = mainCategories();
    const subs = categoryFilter !== 'all' && categoryFilter !== 'none' ? subcategoriesOf(mains.some(c => c.documentId === categoryFilter) ? categoryFilter : (categories.find(c => c.documentId === categoryFilter)?.parent?.documentId || '')) : [];
    const parentId = subs.length ? (categories.find(c => c.documentId === categoryFilter)?.parent?.documentId || categoryFilter) : null;
    row = `<div class="pills">
      ${pill('data-cf', 'all', L('Все категории', 'Барлық санаттар'), tabProducts.length, categoryFilter === 'all')}
      ${mains.map(c => pill('data-cf', c.documentId, c.name, tabProducts.filter(p => inCat(p, c.documentId)).length, categoryFilter === c.documentId || parentId === c.documentId)).join('')}
      ${pill('data-cf', 'none', L('Без категории', 'Санатсыз'), tabProducts.filter(p => !p.category).length, categoryFilter === 'none')}
    </div>
    ${subs.length ? `<div class="pills sub">${subs.map(c => pill('data-cf', c.documentId, c.name, tabProducts.filter(p => p.category && p.category.documentId === c.documentId).length, categoryFilter === c.documentId)).join('')}</div>` : ''}`;
  }
  el.innerHTML = `<div class="tabs">
    ${tab('isNew', '🆕', L('Новинки', 'Жаңалықтар'), L('свежие поступления', 'жаңа түскендер'), cnt('isNew'), statFilter === 'isNew')}
    ${tab('published', '✅', L('На сайте', 'Сайтта'), L('что видят клиенты', 'клиенттер көретіні'), cnt('published'), statFilter === 'published')}
    ${tab('all', '📦', L('Все товары', 'Барлық тауар'), L('вся база', 'бүкіл база'), products.length, statFilter === 'all')}
    ${tab('fix', '🛠', L('Нужно поправить', 'Түзету керек'), L('нет фото или цены', 'фото не бағасы жоқ'), fixN, isFix, fixN > 0)}
  </div>${row}`;
  el.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.tab;
    statFilter = k === 'fix' ? 'noPhoto' : k;
    categoryFilter = 'all';
    selected.clear();
    renderTable();
  }));
  el.querySelectorAll('[data-sf]').forEach(b => b.addEventListener('click', () => {
    statFilter = b.dataset.sf;
    selected.clear();
    renderTable();
  }));
  el.querySelectorAll('[data-cf]').forEach(b => b.addEventListener('click', () => {
    categoryFilter = b.dataset.cf;
    selected.clear();
    renderTable();
  }));
}

async function togglePublish(documentId, value) {
  try {
    const res = await fetch(API_BASE + '/api/manage/products/' + documentId, { method: 'PUT', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ published: value }) });
    if (!res.ok) throw new Error('fail');
    const p = products.find(x => x.documentId === documentId);
    if (p) p.published = value;
    showToast(t('toastSaved'));
    renderTable();
  } catch (e) {
    console.error(e);
    showToast(L('Ошибка, попробуйте ещё раз', 'Қате, қайталап көріңіз'));
  }
}


function setFilter(key) {
  statFilter = statFilter === key ? 'all' : key;
  if (key === 'all') categoryFilter = 'all';
  selected.clear();
  renderStats();
  renderFolderTabs();
  renderChips();
  renderCategoryFilter();
  renderTable();
}

function renderStats() {
  const total = products.length;
  const publishedCount = products.filter(FILTERS.published).length;
  const lowStockCount = products.filter(FILTERS.lowStock).length;

  document.getElementById('stats').innerHTML = `
    <button type="button" class="stat-card ${statFilter === 'all' ? 'active' : ''}" data-filter="all">
      <div class="stat-icon">📦</div>
      <div>
        <div class="stat-value">${total}</div>
        <div class="stat-label">${t('statTotal')}</div>
      </div>
    </button>
    <button type="button" class="stat-card ${statFilter === 'published' ? 'active' : ''}" data-filter="published">
      <div class="stat-icon">✅</div>
      <div>
        <div class="stat-value">${publishedCount}</div>
        <div class="stat-label">${t('statPublished')}</div>
      </div>
    </button>
    <button type="button" class="stat-card ${lowStockCount > 0 ? 'warn' : ''} ${statFilter === 'lowStock' ? 'active' : ''}" data-filter="lowStock">
      <div class="stat-icon">⚠️</div>
      <div>
        <div class="stat-value">${lowStockCount}</div>
        <div class="stat-label">${t('statLowStock')}</div>
      </div>
    </button>
  `;

  document.querySelectorAll('#stats [data-filter]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

// "Новинки" — отдельная папка, а не мелкий чип среди прочих: сюда попадают
// абсолютно все новые товары, откуда бы они ни пришли (МойСклад, файл,
// Телеграм), и это то, что сотрудник открывает в первую очередь.
function renderFolderTabs() {
  const isNewCount = products.filter(FILTERS.isNew).length;

  document.getElementById('folderTabs').innerHTML = `
    <button type="button" class="folder-tab ${statFilter === 'isNew' ? 'active' : ''}" data-filter="isNew">
      <span class="folder-icon">🆕</span>
      <span>${t('chipNew')} (${isNewCount})</span>
    </button>
  `;

  document.querySelectorAll('#folderTabs [data-filter]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

function renderChips() {
  const draftCount = products.filter(FILTERS.draft).length;
  const highStockCount = products.filter(FILTERS.highStock).length;
  const noPhotoCount = products.filter(FILTERS.noPhoto).length;
  const noPriceCount = products.filter(FILTERS.noPrice).length;
  const noDescriptionCount = products.filter(FILTERS.noDescription).length;
  const telegramCount = products.filter(FILTERS.telegram).length;

  // "issue" — данные, которые стоит исправить (без фото/цены/описания);
  // "status" — просто метки/статусы, не обязательно проблема.
  // "Новинки" сюда не входят — у них своя отдельная папка над чипами.
  const chips = [
    ['draft', t('chipDraft'), draftCount, 'status'],
    ['noPhoto', t('chipNoPhoto'), noPhotoCount, 'issue'],
    ['noPrice', t('chipNoPrice'), noPriceCount, 'issue'],
    ['noDescription', t('chipNoDescription'), noDescriptionCount, 'issue'],
    ['telegram', t('chipTelegram'), telegramCount, 'status'],
    ['highStock', t('chipHighStock'), highStockCount, 'status'],
  ];

  document.getElementById('chips').innerHTML = chips.map(([key, label, count, type]) => `
    <button type="button" class="${type} ${statFilter === key ? 'active' : ''}" data-filter="${key}">${type === 'issue' ? '⚠️ ' : ''}${label} (${count})</button>
  `).join('');

  document.querySelectorAll('#chips [data-filter]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

// ---------- Categories ----------
// Two levels: main categories and subcategories inside them. The catalog
// shows the main ones as the first row and the chosen one's subcategories
// as a second row.

let categories = []; // every category, each with parent: { documentId, name } or null
let categoryFilter = 'all'; // 'all', 'none' or a category documentId

async function loadCategories() {
  try {
    const res = await fetch(API_BASE + '/api/manage/categories', { headers: authHeaders() });
    if (res.status === 401) {
      logout();
      return;
    }
    const json = await res.json();
    categories = (json.data || []).map(normalize);
  } catch (e) {
    console.error(e);
  }
  renderCategoryFilter();
  renderTable();
  if (!document.getElementById('categoriesOverlay').classList.contains('hidden')) renderCategoriesModal();
}

const byName = (a, b) => a.name.localeCompare(b.name, 'ru');

function mainCategories() {
  return categories.filter(c => !c.parent).sort(byName);
}

function subcategoriesOf(documentId) {
  return categories.filter(c => c.parent?.documentId === documentId).sort(byName);
}

function categoryPath(c) {
  return c.parent ? `${c.parent.name} › ${c.name}` : c.name;
}

// "Фены › Philips" for a product, or '' when it has no category.
function productCategoryLabel(p) {
  if (!p.category) return '';
  const c = categories.find(x => x.documentId === p.category.documentId);
  return c ? categoryPath(c) : p.category.name;
}

// Products directly in this category, plus (for a main one) in its subcategories.
function countInCategory(documentId) {
  const ids = new Set([documentId, ...subcategoriesOf(documentId).map(c => c.documentId)]);
  return products.filter(p => p.category && ids.has(p.category.documentId)).length;
}

function matchesCategoryFilter(p) {
  if (categoryFilter === 'all') return true;
  const id = p.category?.documentId || null;
  if (categoryFilter === 'none') return !id;
  return id === categoryFilter || subcategoriesOf(categoryFilter).some(c => c.documentId === id);
}

// <option>s for every category, main ones followed by their subcategories.
function categoryOptionsHtml(withCounts) {
  return mainCategories().map(main => {
    const count = (c) => (withCounts ? ` (${countInCategory(c.documentId)})` : '');
    return [
      `<option value="${escapeHtml(main.documentId)}">${escapeHtml(main.name)}${count(main)}</option>`,
      ...subcategoriesOf(main.documentId).map(sub =>
        `<option value="${escapeHtml(sub.documentId)}">${escapeHtml(categoryPath(sub))}${count(sub)}</option>`),
    ].join('');
  }).join('');
}

function renderCategoryFilter() {
  const el = document.getElementById('categoryFilter');
  if (categoryFilter !== 'all' && categoryFilter !== 'none' && !categories.some(c => c.documentId === categoryFilter)) {
    categoryFilter = 'all';
  }
  const noneCount = products.filter(p => !p.category).length;
  el.innerHTML = `
    <option value="all">${t('filterAllCategories')}</option>
    <option value="none">${t('filterNoCategory', noneCount)}</option>
    ${categoryOptionsHtml(true)}
  `;
  el.value = categoryFilter;
  el.classList.toggle('hidden', categories.length === 0 && noneCount === products.length);
}

function setupCategoryFilter() {
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    categoryFilter = e.target.value;
    selected.clear();
    renderTable();
  });
}

function renderCategoriesModal() {
  const parentSelect = document.getElementById('f_newCategoryParent');
  const chosenParent = parentSelect.value;
  const mains = mainCategories();
  parentSelect.innerHTML = `<option value="">${t('parentNone')}</option>` +
    mains.map(c => `<option value="${escapeHtml(c.documentId)}">${escapeHtml(t('parentInside', c.name))}</option>`).join('');
  if (mains.some(c => c.documentId === chosenParent)) parentSelect.value = chosenParent;

  const row = (c, kind) => `
    <div class="category-row ${kind}">
      <span class="category-name">${escapeHtml(c.name)}</span>
      <span class="category-count">${t('productsShort', countInCategory(c.documentId))}</span>
      <button type="button" class="icon-btn" data-rename-category="${escapeHtml(c.documentId)}" title="${t('renameCategory')}" aria-label="${t('renameCategory')}">✏️</button>
      <button type="button" class="icon-btn" data-delete-category="${escapeHtml(c.documentId)}" title="${t('deleteCategory')}" aria-label="${t('deleteCategory')}">🗑</button>
    </div>`;
  document.getElementById('categoryTree').innerHTML = mains.length
    ? mains.map(main => row(main, 'main') + subcategoriesOf(main.documentId).map(sub => row(sub, 'sub')).join('')).join('')
    : `<div class="empty">${t('categoriesEmpty')}</div>`;
}

function openCategoriesModal() {
  document.getElementById('f_newCategoryName').value = '';
  document.getElementById('f_newCategoryParent').value = '';
  renderCategoriesModal();
  document.getElementById('categoriesOverlay').classList.remove('hidden');
  loadCategories();
}

function closeCategoriesModal() {
  document.getElementById('categoriesOverlay').classList.add('hidden');
}

async function addCategory() {
  const nameEl = document.getElementById('f_newCategoryName');
  const name = nameEl.value.trim();
  const parent = document.getElementById('f_newCategoryParent').value || null;
  if (!name) {
    showToast(t('categoryNameRequired'));
    nameEl.focus();
    return;
  }
  const sameLevel = parent ? subcategoriesOf(parent) : mainCategories();
  if (sameLevel.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    showToast(t('categoryExists'));
    return;
  }
  const btn = document.getElementById('addCategoryBtn');
  btn.disabled = true;
  try {
    const res = await fetch(API_BASE + '/api/manage/categories', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parent }),
    });
    if (!res.ok) throw new Error('create category failed');
    nameEl.value = '';
    showToast(t('toastCategorySaved'));
    await loadCategories();
  } catch (e) {
    console.error(e);
    showToast(t('toastCategoryError'));
  } finally {
    btn.disabled = false;
  }
}

async function renameCategory(documentId) {
  const c = categories.find(x => x.documentId === documentId);
  if (!c) return;
  const name = (prompt(t('renamePrompt'), c.name) || '').trim();
  if (!name || name === c.name) return;
  try {
    const res = await fetch(API_BASE + '/api/manage/categories/' + documentId, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('rename category failed');
    showToast(t('toastCategorySaved'));
    await loadCategories();
    loadProducts();
  } catch (e) {
    console.error(e);
    showToast(t('toastCategoryError'));
  }
}

async function deleteCategory(documentId) {
  const c = categories.find(x => x.documentId === documentId);
  if (!c) return;
  const subs = subcategoriesOf(documentId).length;
  if (!confirm(subs ? t('confirmDeleteMain', c.name, subs) : t('confirmDeleteCategory', c.name))) return;
  try {
    const res = await fetch(API_BASE + '/api/manage/categories/' + documentId, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('delete category failed');
    showToast(t('toastCategoryDeleted'));
    await loadCategories();
    loadProducts();
  } catch (e) {
    console.error(e);
    showToast(t('toastCategoryError'));
  }
}

function setupCategories() {
  document.getElementById('categoriesBtn').addEventListener('click', openCategoriesModal);
  document.getElementById('categoriesCloseBtn').addEventListener('click', closeCategoriesModal);
  document.getElementById('addCategoryBtn').addEventListener('click', addCategory);
  document.getElementById('f_newCategoryName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addCategory();
  });
  document.getElementById('categoryTree').addEventListener('click', (e) => {
    const renameBtn = e.target.closest('[data-rename-category]');
    if (renameBtn) renameCategory(renameBtn.dataset.renameCategory);
    const deleteBtn = e.target.closest('[data-delete-category]');
    if (deleteBtn) deleteCategory(deleteBtn.dataset.deleteCategory);
  });
  document.getElementById('categoriesOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'categoriesOverlay') closeCategoriesModal();
  });
  setupCategoryFilter();
  setupBulkMove();
}

// ---------- Move selected products to a category ----------

function openMoveModal() {
  if (!selected.size) return;
  document.getElementById('moveTitle').textContent = t('moveTitle', selected.size);
  const select = document.getElementById('f_moveCategory');
  select.innerHTML = `<option value="">${t('noCategory')}</option>${categoryOptionsHtml(false)}`;
  const firstMain = mainCategories()[0];
  select.value = firstMain ? firstMain.documentId : '';
  document.getElementById('moveOverlay').classList.remove('hidden');
}

function closeMoveModal() {
  document.getElementById('moveOverlay').classList.add('hidden');
}

async function bulkMoveToCategory() {
  const ids = [...selected];
  const category = document.getElementById('f_moveCategory').value || null;
  const btn = document.getElementById('moveSaveBtn');
  const originalText = btn.textContent;
  let done = 0;
  btn.disabled = true;

  const CONCURRENCY = 5;
  let index = 0;
  async function worker() {
    while (index < ids.length) {
      const id = ids[index++];
      try {
        await fetch(API_BASE + '/api/manage/products/' + id, {
          method: 'PUT',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ category }),
        });
      } catch (e) {
        console.error('bulk move failed for', id, e);
      }
      done += 1;
      btn.textContent = `${originalText} (${done}/${ids.length})`;
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  btn.disabled = false;
  btn.textContent = originalText;
  closeMoveModal();
  selected.clear();
  showToast(t('moveDone'));
  loadProducts();
}

function setupBulkMove() {
  document.getElementById('bulkCategoryBtn').addEventListener('click', openMoveModal);
  document.getElementById('moveCancelBtn').addEventListener('click', closeMoveModal);
  document.getElementById('moveSaveBtn').addEventListener('click', bulkMoveToCategory);
  document.getElementById('moveOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'moveOverlay') closeMoveModal();
  });
}

function renderBulkBar() {
  const bar = document.getElementById('bulkBar');
  if (selected.size === 0) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  document.getElementById('bulkCount').textContent = t('bulkSelectedCount', selected.size);
  document.getElementById('bulkPublishBtn').textContent = t('bulkPublish');
  document.getElementById('bulkUnpublishBtn').textContent = t('bulkUnpublish');
  document.getElementById('bulkCategoryBtn').textContent = t('bulkCategory');
  document.getElementById('bulkFindPricesBtn').textContent = t('findPricesBtn');
  document.getElementById('bulkDeleteBtn').textContent = t('bulkDelete');
  document.getElementById('bulkDeselectBtn').textContent = t('bulkDeselect');
}

function renderTable() {
  renderSidebar();
  const wrap = document.getElementById('tableWrap');
  const list = filteredProducts();
  const countLabelEl = document.getElementById('countLabel');
  const unfiltered = statFilter === 'all' && categoryFilter === 'all';
  if (unfiltered) {
    // Не дублируем "Всего товаров" из карточки статистики выше — здесь
    // текст нужен только когда включён фильтр и список стал короче.
    countLabelEl.textContent = '';
  } else {
    countLabelEl.innerHTML = `${t('countLabelFiltered', list.length)} · <a href="#" id="clearFilterLink">${t('clearFilter')}</a>`;
    document.getElementById('clearFilterLink').addEventListener('click', (e) => {
      e.preventDefault();
      setFilter('all');
    });
  }

  renderBulkBar();

  if (list.length === 0) {
    wrap.innerHTML = `<div class="empty">${unfiltered ? t('emptyList') : t('emptyFiltered')}</div>`;
    return;
  }

  const allChecked = list.length > 0 && list.every(p => selected.has(p.documentId));
  const card = (p) => {
    const url = photoUrl(p);
    const st = p.stock ?? 0;
    const price = p.wholesalePrice ?? 0;
    const box = Number(p.minOrderQty) || 1;
    return `
    <div class="pcard ${selected.has(p.documentId) ? 'sel' : ''}">
      <input type="checkbox" class="pchk" data-check="${p.documentId}" ${selected.has(p.documentId) ? 'checked' : ''} />
      <div class="pimg" data-edit="${p.documentId}">
        ${url ? `<img src="${escapeHtml(url)}" loading="lazy" alt="" />` : `<div class="nophoto"><b>📷</b><span>${L('нет фото', 'фото жоқ')}</span></div>`}
        <div class="pbadges">${p.isNew ? `<span class="pb new">${L('Новинка', 'Жаңа')}</span>` : ''}<span class="pb ${p.published ? 'on' : 'off'}">${p.published ? L('На сайте', 'Сайтта') : L('Черновик', 'Жоба')}</span></div>
      </div>
      <div class="pbody">
        <div class="psku">${escapeHtml(p.sku || p.name || '')}</div>
        <div class="pname">${escapeHtml(p.name || '')}</div>
        ${price > 0 ? `<div class="pprice">${money(price)}</div>` : `<div class="pprice none">${L('нет цены', 'бағасы жоқ')}</div>`}
        <div class="pmeta"><span class="stk ${st <= 0 ? 'zero' : st < 100 ? 'low' : ''}">${st} ${L('шт.', 'дана')}</span><span>📦 ${box} ${L('в короб.', 'қорапта')}</span></div>
        ${p.category ? `<div class="pcat">📁 ${escapeHtml(productCategoryLabel(p))}</div>` : ''}
        <div class="pact">
          <button data-edit="${p.documentId}">✏️ ${t('edit')}</button>
          <button class="${p.published ? '' : 'pub'}" data-pub="${p.documentId}" data-val="${p.published ? 0 : 1}">${p.published ? L('Скрыть', 'Жасыру') : L('На сайт', 'Сайтқа')}</button>
          <button class="del" data-del="${p.documentId}" title="${t('del')}">🗑</button>
        </div>
      </div>
    </div>`;
  };

  wrap.innerHTML = `
    <label class="select-all" style="display:flex;gap:8px;align-items:center;margin:2px 2px 10px;font-size:13.5px;color:var(--muted);cursor:pointer;"><input type="checkbox" id="selectAllCheckbox" ${allChecked ? 'checked' : ''} /><span>${t('selectAll')} (${list.length})</span></label>
    <div class="pgrid ${viewMode === 'list' ? 'list' : ''}">${list.map(card).join('')}</div>
  `;

  wrap.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.edit));
  });
  wrap.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.del));
  });
  wrap.querySelectorAll('[data-pub]').forEach(btn => {
    btn.addEventListener('click', () => togglePublish(btn.dataset.pub, btn.dataset.val === '1'));
  });
  wrap.querySelectorAll('[data-check]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = cb.dataset.check;
      if (e.target.checked) selected.add(id); else selected.delete(id);
      cb.closest('.pcard').classList.toggle('sel', e.target.checked);
      renderBulkBar();
      const selectAll = document.getElementById('selectAllCheckbox');
      if (selectAll) selectAll.checked = list.every(p => selected.has(p.documentId));
    });
  });
  const selectAllCb = document.getElementById('selectAllCheckbox');
  if (selectAllCb) {
    selectAllCb.addEventListener('change', (e) => {
      if (e.target.checked) list.forEach(p => selected.add(p.documentId));
      else list.forEach(p => selected.delete(p.documentId));
      renderTable();
    });
  }
}

async function bulkSetPublished(publishedValue) {
  const ids = [...selected];
  const btn = publishedValue ? document.getElementById('bulkPublishBtn') : document.getElementById('bulkUnpublishBtn');
  const originalText = btn.textContent;
  let done = 0;
  btn.disabled = true;

  const CONCURRENCY = 5;
  let index = 0;
  async function worker() {
    while (index < ids.length) {
      const id = ids[index++];
      try {
        await fetch(API_BASE + '/api/manage/products/' + id, {
          method: 'PUT',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: publishedValue }),
        });
      } catch (e) {
        console.error('bulk update failed for', id, e);
      }
      done += 1;
      btn.textContent = `${originalText} (${done}/${ids.length})`;
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  btn.disabled = false;
  selected.clear();
  showToast(t('toastSaved'));
  loadProducts();
}

async function bulkDeleteSelected() {
  const ids = [...selected];
  if (!ids.length) return;
  if (!confirm(t('bulkConfirmDelete', ids.length))) return;

  const btn = document.getElementById('bulkDeleteBtn');
  const originalText = btn.textContent;
  let done = 0;
  btn.disabled = true;

  const CONCURRENCY = 5;
  let index = 0;
  async function worker() {
    while (index < ids.length) {
      const id = ids[index++];
      try {
        await fetch(API_BASE + '/api/manage/products/' + id, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      } catch (e) {
        console.error('bulk delete failed for', id, e);
      }
      done += 1;
      btn.textContent = `${originalText} (${done}/${ids.length})`;
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  btn.disabled = false;
  selected.clear();
  showToast(t('toastDeleted'));
  loadProducts();
}

// ---------- Modal / form ----------

let nameAutoFilled = false;

// Pull a product name out of a pasted block of text — takes the first
// non-empty line and strips leading emoji/symbols (e.g. "🎩 Фен для волос"
// -> "Фен для волос"), since suppliers usually put the product name first.
function extractName(text) {
  const firstLine = (text || '').split('\n').map(l => l.trim()).find(l => l.length > 0) || '';
  return firstLine.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function setupPasteAutofill() {
  const descEl = document.getElementById('f_description');
  const nameEl = document.getElementById('f_name');

  descEl.addEventListener('input', () => {
    if (!nameAutoFilled) return;
    nameEl.value = extractName(descEl.value);
  });

  nameEl.addEventListener('input', () => {
    // once the user edits the name by hand, stop overwriting it from paste
    nameAutoFilled = false;
  });
}

function setupMoreToggle() {
  document.getElementById('moreToggle').addEventListener('click', () => {
    const fields = document.getElementById('moreFields');
    fields.classList.toggle('hidden');
    document.getElementById('moreToggle').textContent = fields.classList.contains('hidden')
      ? t('moreShow')
      : t('moreHide');
  });
}

function renderPhotoPreview(urls) {
  const el = document.getElementById('photoPreview');
  el.innerHTML = urls.map(u => `<img src="${escapeHtml(u)}" />`).join('');
}

// ---------- Import products from Excel/CSV file ----------

async function syncMoysklad(sinceDays) {
  const btn = document.getElementById(sinceDays ? 'syncNewOnlyBtn' : 'syncMoyskladBtn');
  const originalText = btn.textContent;
  btn.disabled = true;

  let offset = 0;
  let imported = 0;
  let updated = 0;
  let deleted = 0;
  const errors = [];
  const sinceParam = sinceDays ? `&sinceDays=${sinceDays}` : '';

  try {
    while (true) {
      btn.textContent = t('syncingMoysklad', imported + updated);
      const res = await fetch(API_BASE + `/api/manage/import-moysklad?offset=${offset}&limit=50${sinceParam}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error?.message || 'failed');

      imported += result.imported || 0;
      updated += result.updated || 0;
      deleted += result.deleted || 0;
      if (result.errors?.length) errors.push(...result.errors);

      if (result.nextOffset === null || result.nextOffset === undefined) break;
      offset = result.nextOffset;
    }

    showToast(t('syncMoyskladDone', imported, updated, deleted));
    if (errors.length) console.error('MoySklad sync errors:', errors);
    loadProducts();
  } catch (e) {
    console.error(e);
    showToast(t('syncMoyskladError'));
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

async function bulkFindPrices() {
  const ids = [...selected];
  if (!ids.length) return;
  const btn = document.getElementById('bulkFindPricesBtn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = t('findingPrices');

  // Send the article/model straight in the webhook body — n8n doesn't need
  // a separate "fetch our product list, then match by id" step, it already
  // has what it needs to look the cost up in MoySklad.
  const items = ids
    .map((id) => products.find((p) => p.documentId === id))
    .filter((p) => p && (p.sku || p.moyskladId))
    .map((p) => ({ id: p.documentId, sku: p.sku || null, moyskladId: p.moyskladId || null }));

  try {
    const res = await fetch(N8N_FIND_PRICES_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, items }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result?.error?.message || 'failed');

    showToast(t('findPricesDone', result.updated, result.total));
    selected.clear();
    loadProducts();
  } catch (e) {
    console.error(e);
    showToast(t('findPricesError'));
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function setupImportFile() {
  const btn = document.getElementById('importFileBtn');
  const input = document.getElementById('importFileInput');

  btn.addEventListener('click', () => input.click());

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;

    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = t('importingFile');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(API_BASE + '/api/manage/import-file', {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error?.message || 'failed');

      showToast(t('importFileDone', result.created, result.totalRows, result.withPhoto || 0));
      if (result.errors?.length) {
        console.error('Import file errors:', result.errors);
      }
      loadProducts();
    } catch (e) {
      console.error(e);
      showToast(t('importFileError'));
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
      input.value = '';
    }
  });
}

// ---------- Pricing algorithm settings ----------

let pricingCoverageCount = 0;

function applyPricingStaticText() {
  document.getElementById('pricingTitle').textContent = t('pricingTitle');
  document.getElementById('pricingHint').textContent = t('pricingHint');
  document.getElementById('l_markup').textContent = t('l_markup');
  document.getElementById('l_roundTo').textContent = t('l_roundTo');
  document.getElementById('l_forceApply').textContent = t('l_forceApply');
  document.getElementById('pricingCancelBtn').textContent = t('cancel');
  document.getElementById('pricingSaveBtn').textContent = t('pricingSave');
  document.getElementById('pricingApplyBtn').textContent = t('pricingApply');
  updatePricingFormulaPreview();
  document.getElementById('pricingCoverage').textContent = t('pricingCoverage', pricingCoverageCount);
}

function updatePricingFormulaPreview() {
  const m = Number(document.getElementById('f_markup').value) || 0;
  const r = Number(document.getElementById('f_roundTo').value) || 1;
  document.getElementById('pricingFormula').textContent = t('pricingFormula', m, r);
}

async function openPricingModal() {
  try {
    const res = await fetch(API_BASE + '/api/manage/pricing-settings', { headers: authHeaders() });
    const json = await res.json();
    document.getElementById('f_markup').value = json.settings.markupPercent;
    document.getElementById('f_roundTo').value = json.settings.roundTo;
    pricingCoverageCount = json.productsWithCostPrice;
  } catch (e) {
    console.error(e);
  }
  applyPricingStaticText();
  document.getElementById('pricingOverlay').classList.remove('hidden');
}

function closePricingModal() {
  document.getElementById('pricingOverlay').classList.add('hidden');
}

async function savePricingSettings() {
  const markupPercent = Number(document.getElementById('f_markup').value) || 0;
  const roundTo = Number(document.getElementById('f_roundTo').value) || 1;
  await fetch(API_BASE + '/api/manage/pricing-settings', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ markupPercent, roundTo }),
  });
  showToast(t('pricingSaved'));
}

async function applyPricingToAll() {
  await savePricingSettings();
  const btn = document.getElementById('pricingApplyBtn');
  const force = document.getElementById('f_forceApply').checked;
  btn.disabled = true;
  btn.textContent = t('pricingApplying');
  try {
    const res = await fetch(API_BASE + '/api/manage/apply-pricing', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    });
    const json = await res.json();
    showToast(t('pricingApplied', json.updated));
    closePricingModal();
    loadProducts();
  } catch (e) {
    console.error(e);
    showToast(t('toastSaveError'));
  } finally {
    btn.disabled = false;
    btn.textContent = t('pricingApply');
  }
}

function setupPricing() {
  document.getElementById('pricingBtn').addEventListener('click', openPricingModal);
  document.getElementById('pricingCancelBtn').addEventListener('click', closePricingModal);
  document.getElementById('pricingSaveBtn').addEventListener('click', savePricingSettings);
  document.getElementById('pricingApplyBtn').addEventListener('click', applyPricingToAll);
  document.getElementById('f_markup').addEventListener('input', updatePricingFormulaPreview);
  document.getElementById('f_roundTo').addEventListener('input', updatePricingFormulaPreview);
  document.getElementById('pricingOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'pricingOverlay') closePricingModal();
  });
}

function openModal(documentId) {
  editingId = documentId || null;
  selectedFiles = [];
  document.getElementById('photoHint').textContent = '';
  document.getElementById('f_photo').value = '';
  renderPhotoPreview([]);

  const p = editingId ? products.find(x => x.documentId === editingId) : null;

  document.getElementById('modalTitle').textContent = p ? t('modalTitleEdit') : t('modalTitleNew');
  document.getElementById('f_name').value = p?.name || '';
  document.getElementById('f_sku').value = p?.sku || '';
  const categorySelect = document.getElementById('f_category');
  categorySelect.innerHTML = `<option value="">${t('noCategory')}</option>${categoryOptionsHtml(false)}`;
  // Category list not loaded (yet)? Keep the product's own category as an
  // option, so saving the form never silently drops it.
  if (p?.category && !categories.some(c => c.documentId === p.category.documentId)) {
    categorySelect.insertAdjacentHTML('beforeend',
      `<option value="${escapeHtml(p.category.documentId)}">${escapeHtml(p.category.name)}</option>`);
  }
  categorySelect.value = p?.category?.documentId || '';
  document.getElementById('f_description').value = p?.description || '';
  document.getElementById('f_price').value = p?.wholesalePrice ?? 0;
  document.getElementById('f_minqty').value = p?.minOrderQty ?? 1;
  document.getElementById('f_stock').value = p?.stock ?? 0;
  document.getElementById('f_published').checked = !!p?.published;
  document.getElementById('f_isNew').checked = !!p?.isNew;

  // New product: name isn't set yet, so pasting the description auto-fills it.
  // Editing: the name already exists, don't overwrite it from paste.
  nameAutoFilled = !p;

  const moreFields = document.getElementById('moreFields');
  moreFields.classList.toggle('hidden', !p); // expanded when editing, collapsed when adding
  document.getElementById('moreToggle').textContent = moreFields.classList.contains('hidden')
    ? t('moreShow')
    : t('moreHide');

  if (p?.images?.length) {
    document.getElementById('photoHint').textContent = t('currentPhoto', p.images.map(i => i.name).join(', '));
    renderPhotoPreview(p.images.map(img => {
      const url = (img.formats && img.formats.thumbnail && img.formats.thumbnail.url) || img.url;
      return url.startsWith('http') ? url : API_BASE + url;
    }));
  }

  document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  editingId = null;
}

async function uploadPhotos(files) {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  const res = await fetch(API_BASE + '/api/manage/upload', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error('Не удалось загрузить фото');
  const json = await res.json();
  return json.map(f => f.id);
}

async function saveProduct(e) {
  e.preventDefault();
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = t('saving');

  try {
    const categoryId = document.getElementById('f_category').value || null;

    const data = {
      name: document.getElementById('f_name').value.trim(),
      sku: document.getElementById('f_sku').value.trim() || null,
      description: document.getElementById('f_description').value.trim() || null,
      wholesalePrice: parseFloat(document.getElementById('f_price').value) || 0,
      minOrderQty: parseInt(document.getElementById('f_minqty').value, 10) || 1,
      stock: parseInt(document.getElementById('f_stock').value, 10) || 0,
      published: document.getElementById('f_published').checked,
      isNew: document.getElementById('f_isNew').checked,
      category: categoryId,
    };

    if (selectedFiles.length) {
      const imageIds = await uploadPhotos(selectedFiles);
      if (imageIds.length) data.images = imageIds;
    }

    const url = editingId
      ? API_BASE + '/api/manage/products/' + editingId
      : API_BASE + '/api/manage/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Сервер отклонил сохранение');

    closeModal();
    showToast(t('toastSaved'));
    loadProducts();
  } catch (err) {
    console.error(err);
    showToast(t('toastSaveError'));
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = t('save');
  }
}

async function deleteProduct(documentId) {
  if (!confirm(t('confirmDelete'))) return;
  try {
    const res = await fetch(API_BASE + '/api/manage/products/' + documentId, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Не удалось удалить');
    showToast(t('toastDeleted'));
    loadProducts();
  } catch (e) {
    showToast(t('toastDeleteError'));
    console.error(e);
  }
}

// ---------- Wire up ----------

function setupToolbar() {
  const input = document.getElementById('searchInput');
  input.placeholder = L('Поиск по названию или артикулу…', 'Атауы немесе артикулы бойынша іздеу…');
  let tm;
  input.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { searchText = input.value; renderTable(); }, 200); });
  const paint = () => document.querySelectorAll('#viewToggle button').forEach(b => b.classList.toggle('active', b.dataset.view === viewMode));
  document.querySelectorAll('#viewToggle button').forEach(b => b.addEventListener('click', () => {
    viewMode = b.dataset.view;
    try { localStorage.setItem('sklad_manage_view', viewMode); } catch { /* ignore */ }
    paint();
    renderTable();
  }));
  paint();
  const tg = document.getElementById('sidebarToggle');
  tg.textContent = '☰ ' + L('Разделы', 'Бөлімдер');
  tg.addEventListener('click', () => document.body.classList.add('sb-open'));
  document.getElementById('sbBackdrop').addEventListener('click', () => document.body.classList.remove('sb-open'));
}

function init() {
  setupToolbar();
  applyStaticText();
  setupLangSwitch();

  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('passwordInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') login();
  });
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('addBtn').addEventListener('click', () => openModal(null));
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('productForm').addEventListener('submit', saveProduct);
  setupPasteAutofill();
  setupPricing();
  setupCategories();
  setupImportFile();
  document.getElementById('syncMoyskladBtn').addEventListener('click', () => syncMoysklad());
  document.getElementById('syncNewOnlyBtn').addEventListener('click', () => syncMoysklad(14));
  setupMoreToggle();
  document.getElementById('f_photo').addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files || []);
    renderPhotoPreview(selectedFiles.map(f => URL.createObjectURL(f)));
    if (selectedFiles.length) document.getElementById('photoHint').textContent = '';
  });
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.getElementById('bulkPublishBtn').addEventListener('click', () => bulkSetPublished(true));
  document.getElementById('bulkUnpublishBtn').addEventListener('click', () => bulkSetPublished(false));
  document.getElementById('bulkFindPricesBtn').addEventListener('click', () => bulkFindPrices());
  document.getElementById('bulkDeleteBtn').addEventListener('click', () => bulkDeleteSelected());
  document.getElementById('bulkDeselectBtn').addEventListener('click', () => {
    selected.clear();
    renderTable();
  });

  if (getToken()) {
    showApp();
  } else {
    showLogin();
  }
}

init();
