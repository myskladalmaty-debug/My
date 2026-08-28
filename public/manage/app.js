const API_BASE = '';
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
    categoryPlaceholder: 'например: Мыло',
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
    syncingMoysklad: (n) => `Синхронизация… (${n})`,
    syncMoyskladDone: (imported, updated, deleted) => `Готово: добавлено ${imported}, обновлено ${updated}, удалено ${deleted}`,
    syncMoyskladError: 'Не удалось синхронизировать с МойСклад',
    importFileBtn: '📄 Загрузить из файла',
    importFileHint: 'Excel/CSV — только текст. ZIP-архив (таблица + папка с фото) — с фото.',
    importingFile: 'Загружаю…',
    importFileDone: (created, total, withPhoto) => `Готово: добавлено ${created} из ${total} строк (с фото: ${withPhoto}). Товары — черновики, проверьте и опубликуйте вручную.`,
    importFileError: 'Не удалось загрузить файл',
  },
  kz: {
    loginSubtitle: 'Тауарларды басқаруға арналған қарапайым кабинет',
    passwordPlaceholder: 'Құпия сөз',
    loginBtn: 'Кіру',
    logoutBtn: 'Шығу',
    addBtn: '+ Тауар қосу',
    countLabel: (n) => `Тауарлар: ${n}`,
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
    categoryPlaceholder: 'мысалы: Сабын',
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
    syncingMoysklad: (n) => `Синхрондалуда… (${n})`,
    syncMoyskladDone: (imported, updated, deleted) => `Дайын: қосылды ${imported}, жаңартылды ${updated}, жойылды ${deleted}`,
    syncMoyskladError: 'МойСклад-пен синхрондау мүмкін болмады',
    importFileBtn: '📄 Файлдан жүктеу',
    importFileHint: 'Excel/CSV — тек мәтін. ZIP-архив (кесте + фото қалтасы) — фотомен.',
    importingFile: 'Жүктелуде…',
    importFileDone: (created, total, withPhoto) => `Дайын: ${total} жолдан ${created} қосылды (фотомен: ${withPhoto}). Тауарлар — жоба, тексеріп, қолмен жариялаңыз.`,
    importFileError: 'Файлды жүктеу мүмкін болмады',
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
  document.getElementById('l_paste').textContent = t('l_paste');
  document.getElementById('pasteHint').textContent = t('pasteHint');
  document.getElementById('l_name').textContent = t('l_name');
  document.getElementById('l_sku').textContent = t('l_sku');
  document.getElementById('l_category').textContent = t('l_category');
  document.getElementById('f_category').placeholder = t('categoryPlaceholder');
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
  renderChips();
  renderTable();
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
    renderChips();
    renderTable();
  } catch (e) {
    wrap.innerHTML = `<div class="empty">${t('loadErrorList')}</div>`;
    console.error(e);
  }
}

const HIGH_STOCK_THRESHOLD = 50;

let statFilter = 'all'; // one of the keys in FILTERS
let selected = new Set(); // documentIds currently checked in the table

const FILTERS = {
  all: () => true,
  published: p => p.published,
  draft: p => !p.published,
  lowStock: p => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD,
  highStock: p => (p.stock ?? 0) > HIGH_STOCK_THRESHOLD,
  noPhoto: p => !(p.images && p.images.length),
  noPrice: p => !((p.wholesalePrice ?? 0) > 0),
  noDescription: p => !(p.description && p.description.trim()),
  isNew: p => !!p.isNew,
  telegram: p => p.source === 'telegram',
};

function filteredProducts() {
  return products.filter(FILTERS[statFilter] || FILTERS.all);
}

function setFilter(key) {
  statFilter = statFilter === key ? 'all' : key;
  selected.clear();
  renderStats();
  renderChips();
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

function renderChips() {
  const draftCount = products.filter(FILTERS.draft).length;
  const highStockCount = products.filter(FILTERS.highStock).length;
  const noPhotoCount = products.filter(FILTERS.noPhoto).length;
  const noPriceCount = products.filter(FILTERS.noPrice).length;
  const noDescriptionCount = products.filter(FILTERS.noDescription).length;
  const isNewCount = products.filter(FILTERS.isNew).length;
  const telegramCount = products.filter(FILTERS.telegram).length;

  const chips = [
    ['draft', t('chipDraft'), draftCount],
    ['highStock', t('chipHighStock'), highStockCount],
    ['noPhoto', t('chipNoPhoto'), noPhotoCount],
    ['noPrice', t('chipNoPrice'), noPriceCount],
    ['noDescription', t('chipNoDescription'), noDescriptionCount],
    ['isNew', t('chipNew'), isNewCount],
    ['telegram', t('chipTelegram'), telegramCount],
  ];

  document.getElementById('chips').innerHTML = chips.map(([key, label, count]) => `
    <button type="button" class="${statFilter === key ? 'active' : ''}" data-filter="${key}">${label} (${count})</button>
  `).join('');

  document.querySelectorAll('#chips [data-filter]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
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
  document.getElementById('bulkDeleteBtn').textContent = t('bulkDelete');
  document.getElementById('bulkDeselectBtn').textContent = t('bulkDeselect');
}

function renderTable() {
  const wrap = document.getElementById('tableWrap');
  const list = filteredProducts();
  const countLabelEl = document.getElementById('countLabel');
  if (statFilter === 'all') {
    countLabelEl.textContent = t('countLabel', products.length);
  } else {
    countLabelEl.innerHTML = `${t('countLabel', list.length)} · <a href="#" id="clearFilterLink">${t('clearFilter')}</a>`;
    document.getElementById('clearFilterLink').addEventListener('click', (e) => {
      e.preventDefault();
      setFilter('all');
    });
  }

  renderBulkBar();

  if (list.length === 0) {
    wrap.innerHTML = `<div class="empty">${statFilter === 'all' ? t('emptyList') : t('emptyFiltered')}</div>`;
    return;
  }

  const allChecked = list.length > 0 && list.every(p => selected.has(p.documentId));

  wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th class="row-check"><input type="checkbox" id="selectAllCheckbox" ${allChecked ? 'checked' : ''} /></th>
          <th>${t('thName')}</th>
          <th>${t('thPrice')}</th>
          <th>${t('thStock')}</th>
          <th>${t('thStatus')}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${list.map(p => `
          <tr>
            <td class="row-check"><input type="checkbox" data-check="${p.documentId}" ${selected.has(p.documentId) ? 'checked' : ''} /></td>
            <td>${p.name}${p.isNew ? ` <span class="badge new">${t('badgeNew')}</span>` : ''}</td>
            <td>${money(p.wholesalePrice)}</td>
            <td>${p.stock ?? 0} шт.</td>
            <td><span class="badge ${p.published ? 'on' : 'off'}">${p.published ? t('published') : t('draft')}</span></td>
            <td class="row-actions">
              <button data-edit="${p.documentId}">${t('edit')}</button>
              <button class="del" data-del="${p.documentId}">${t('del')}</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  wrap.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.edit));
  });
  wrap.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.del));
  });
  wrap.querySelectorAll('[data-check]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = cb.dataset.check;
      if (e.target.checked) selected.add(id); else selected.delete(id);
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
  el.innerHTML = urls.map(u => `<img src="${u}" />`).join('');
}

// ---------- Import products from Excel/CSV file ----------

async function syncMoysklad() {
  const btn = document.getElementById('syncMoyskladBtn');
  const originalText = btn.textContent;
  btn.disabled = true;

  let offset = 0;
  let imported = 0;
  let updated = 0;
  let deleted = 0;
  const errors = [];

  try {
    while (true) {
      btn.textContent = t('syncingMoysklad', imported + updated);
      const res = await fetch(API_BASE + `/api/manage/import-moysklad?offset=${offset}&limit=50`, {
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

    // Recompute wholesale prices for anything newly imported (skips
    // products already priced by hand).
    await fetch(API_BASE + '/api/manage/apply-pricing', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

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
  document.getElementById('f_category').value = p?.category?.name || '';
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

async function findOrCreateCategory(name) {
  if (!name || !name.trim()) return null;
  const trimmed = name.trim();

  const res = await fetch(API_BASE + '/api/manage/categories', { headers: authHeaders() });
  const json = await res.json();
  const categories = (json.data || []).map(normalize);
  const existing = categories.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing.documentId;

  const createRes = await fetch(API_BASE + '/api/manage/categories', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: trimmed }),
  });
  const createJson = await createRes.json();
  return normalize(createJson.data).documentId;
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
    const categoryId = await findOrCreateCategory(document.getElementById('f_category').value);

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

function init() {
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
  setupImportFile();
  document.getElementById('syncMoyskladBtn').addEventListener('click', () => syncMoysklad());
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
