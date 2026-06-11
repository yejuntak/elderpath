/* ElderPath — language launcher (self-contained, drop on any page)
   A floating globe button opens a searchable language list; choosing one
   loads the current page through Google's translation proxy (100+ langs,
   accurate, no maintenance). Flat design, no shadows, brand colors.       */
(function () {
  'use strict';
  var host = location.hostname;
  if (/translate\.goog$/.test(host)) return;            // already proxied — Google's own bar takes over
  if (/[?&]embed=1\b/.test(location.search)) return;     // hide inside embeds

  // Native-name list, US-caregiver + world majors first. Google `tl` codes.
  var LANGS = [
    { c: 'es', n: 'Español', e: 'Spanish' },
    { c: 'zh-CN', n: '简体中文', e: 'Chinese (Simplified)' },
    { c: 'zh-TW', n: '繁體中文', e: 'Chinese (Traditional)' },
    { c: 'vi', n: 'Tiếng Việt', e: 'Vietnamese' },
    { c: 'tl', n: 'Tagalog', e: 'Tagalog / Filipino' },
    { c: 'ko', n: '한국어', e: 'Korean' },
    { c: 'ru', n: 'Русский', e: 'Russian' },
    { c: 'ar', n: 'العربية', e: 'Arabic' },
    { c: 'ht', n: 'Kreyòl Ayisyen', e: 'Haitian Creole' },
    { c: 'fr', n: 'Français', e: 'French' },
    { c: 'pt', n: 'Português', e: 'Portuguese' },
    { c: 'hi', n: 'हिन्दी', e: 'Hindi' },
    { c: 'gu', n: 'ગુજરાતી', e: 'Gujarati' },
    { c: 'pa', n: 'ਪੰਜਾਬੀ', e: 'Punjabi' },
    { c: 'bn', n: 'বাংলা', e: 'Bengali' },
    { c: 'ur', n: 'اردو', e: 'Urdu' },
    { c: 'fa', n: 'فارسی', e: 'Persian / Farsi' },
    { c: 'pl', n: 'Polski', e: 'Polish' },
    { c: 'de', n: 'Deutsch', e: 'German' },
    { c: 'it', n: 'Italiano', e: 'Italian' },
    { c: 'ja', n: '日本語', e: 'Japanese' },
    { c: 'uk', n: 'Українська', e: 'Ukrainian' },
    { c: 'so', n: 'Soomaali', e: 'Somali' },
    { c: 'am', n: 'አማርኛ', e: 'Amharic' },
    { c: 'sw', n: 'Kiswahili', e: 'Swahili' },
    { c: 'hmn', n: 'Hmoob', e: 'Hmong' },
    { c: 'th', n: 'ไทย', e: 'Thai' },
    { c: 'km', n: 'ភាសាខ្មែរ', e: 'Khmer' },
    { c: 'lo', n: 'ລາວ', e: 'Lao' },
    { c: 'my', n: 'မြန်မာ', e: 'Burmese' },
    { c: 'ne', n: 'नेपाली', e: 'Nepali' },
    { c: 'ta', n: 'தமிழ்', e: 'Tamil' },
    { c: 'te', n: 'తెలుగు', e: 'Telugu' },
    { c: 'ml', n: 'മലയാളം', e: 'Malayalam' },
    { c: 'id', n: 'Bahasa Indonesia', e: 'Indonesian' },
    { c: 'tr', n: 'Türkçe', e: 'Turkish' },
    { c: 'el', n: 'Ελληνικά', e: 'Greek' },
    { c: 'he', n: 'עברית', e: 'Hebrew' },
    { c: 'hy', n: 'Հայերեն', e: 'Armenian' },
    { c: 'ka', n: 'ქართული', e: 'Georgian' },
    { c: 'nl', n: 'Nederlands', e: 'Dutch' },
    { c: 'ro', n: 'Română', e: 'Romanian' },
    { c: 'yi', n: 'ייִדיש', e: 'Yiddish' },
    { c: 'sr', n: 'Српски', e: 'Serbian' },
    { c: 'hr', n: 'Hrvatski', e: 'Croatian' },
    { c: 'cs', n: 'Čeština', e: 'Czech' },
    { c: 'hu', n: 'Magyar', e: 'Hungarian' },
    { c: 'sv', n: 'Svenska', e: 'Swedish' },
    { c: 'fi', n: 'Suomi', e: 'Finnish' },
    { c: 'haw', n: 'ʻŌlelo Hawaiʻi', e: 'Hawaiian' },
    { c: 'es-419', n: 'Español (Latinoamérica)', e: 'Spanish (Latin America)' }
  ];

  function proxyURL(code) {
    var h = host.replace(/-/g, '--').replace(/\./g, '-');
    var sep = location.search ? '&' : '?';
    return 'https://' + h + '.translate.goog' + location.pathname + location.search +
      sep + '_x_tr_sl=en&_x_tr_tl=' + encodeURIComponent(code) + '&_x_tr_hl=' + encodeURIComponent(code);
  }

  var css =
    '.ep-i18n-fab{position:fixed;right:20px;bottom:20px;z-index:1000;display:inline-flex;align-items:center;gap:8px;' +
    'height:48px;padding:0 18px 0 16px;border-radius:999px;border:1.5px solid #7c3c17;background:#9d4f24;color:#fff;' +
    'font:600 14.5px/1 Inter,-apple-system,sans-serif;cursor:pointer;transition:background .15s}' +
    '.ep-i18n-fab:hover{background:#7c3c17}' +
    '.ep-i18n-fab:focus-visible{outline:3px solid #2b251d;outline-offset:2px}' +
    '.ep-i18n-fab svg{width:20px;height:20px;flex-shrink:0}' +
    '@media(max-width:480px){.ep-i18n-fab{padding:0;width:48px;justify-content:center}.ep-i18n-fab-label{display:none}}' +
    'body.menu-open .ep-i18n-fab,body.menu-open .ep-i18n-panel{display:none}' +
    '.ep-i18n-panel{position:fixed;right:20px;bottom:78px;z-index:1001;width:300px;max-width:calc(100vw - 40px);' +
    'max-height:min(70vh,520px);display:flex;flex-direction:column;background:#fffdf9;border:1.5px solid #e3dac8;' +
    'border-radius:16px;overflow:hidden;font-family:Inter,-apple-system,sans-serif}' +
    '.ep-i18n-panel[hidden]{display:none}' +
    '.ep-i18n-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px}' +
    '.ep-i18n-head strong{font:700 14px/1.2 Georgia,serif;color:#2b251d}' +
    '.ep-i18n-x{background:none;border:none;font-size:22px;line-height:1;color:#6e6553;cursor:pointer;padding:0 4px}' +
    '.ep-i18n-x:hover{color:#2b251d}' +
    '.ep-i18n-search{margin:0 16px 10px;height:40px;padding:0 14px;border:1.5px solid #e3dac8;border-radius:999px;' +
    'font:400 15px Inter,sans-serif;color:#2b251d;background:#fff}' +
    '.ep-i18n-search:focus{outline:none;border-color:#9d4f24}' +
    '.ep-i18n-list{overflow-y:auto;padding:0 8px 8px}' +
    '.ep-i18n-item{display:flex;flex-direction:column;gap:1px;width:100%;text-align:left;background:none;border:none;' +
    'cursor:pointer;padding:9px 12px;border-radius:10px;font-family:inherit}' +
    '.ep-i18n-item:hover,.ep-i18n-item:focus-visible{background:#f3ece0;outline:none}' +
    '.ep-i18n-n{font-size:15px;font-weight:600;color:#2b251d}' +
    '.ep-i18n-e{font-size:12px;color:#6e6553}' +
    '.ep-i18n-empty{padding:14px 12px;color:#6e6553;font-size:14px}' +
    '.ep-i18n-note{margin:0;padding:10px 16px;border-top:1.5px solid #e3dac8;font-size:11.5px;line-height:1.45;color:#6e6553}' +
    '@media(prefers-reduced-motion:reduce){.ep-i18n-fab{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';

  var fab = document.createElement('button');
  fab.className = 'ep-i18n-fab'; fab.type = 'button';
  fab.setAttribute('aria-haspopup', 'dialog');
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-label', 'Translate this page — choose your language');
  fab.innerHTML = GLOBE + '<span class="ep-i18n-fab-label">Language</span>';

  var panel = document.createElement('div');
  panel.className = 'ep-i18n-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Choose a language');
  panel.innerHTML =
    '<div class="ep-i18n-head"><strong>Read in your language</strong>' +
    '<button class="ep-i18n-x" type="button" aria-label="Close">×</button></div>' +
    '<input class="ep-i18n-search" type="search" placeholder="Search 50+ languages…" aria-label="Search languages" autocomplete="off">' +
    '<div class="ep-i18n-list" role="listbox" aria-label="Languages"></div>' +
    '<p class="ep-i18n-note">Instant translation by Google. The original English page stays at this address.</p>';

  var listEl = panel.querySelector('.ep-i18n-list');
  var searchEl = panel.querySelector('.ep-i18n-search');

  function go(code) { try { localStorage.setItem('ep-lang', code); } catch (e) {} location.href = proxyURL(code); }

  function renderList(filter) {
    var f = (filter || '').toLowerCase().trim();
    listEl.innerHTML = '';
    var shown = LANGS.filter(function (l) {
      return !f || l.n.toLowerCase().indexOf(f) >= 0 || l.e.toLowerCase().indexOf(f) >= 0 || l.c.toLowerCase().indexOf(f) >= 0;
    });
    if (!shown.length) { listEl.innerHTML = '<p class="ep-i18n-empty">No language matches “' + f.replace(/[<&]/g, '') + '”.</p>'; return; }
    shown.forEach(function (l) {
      var b = document.createElement('button');
      b.className = 'ep-i18n-item'; b.type = 'button'; b.setAttribute('role', 'option');
      b.innerHTML = '<span class="ep-i18n-n"></span><span class="ep-i18n-e"></span>';
      b.querySelector('.ep-i18n-n').textContent = l.n;
      b.querySelector('.ep-i18n-e').textContent = l.e;
      b.addEventListener('click', function () { go(l.c); });
      listEl.appendChild(b);
    });
  }
  renderList('');

  function open() {
    panel.hidden = false; fab.setAttribute('aria-expanded', 'true');
    searchEl.value = ''; renderList('');
    setTimeout(function () { searchEl.focus(); }, 10);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onOutside, true);
  }
  function close() {
    panel.hidden = true; fab.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('click', onOutside, true);
    fab.focus();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function onOutside(e) { if (!panel.contains(e.target) && !fab.contains(e.target)) close(); }

  fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
  panel.querySelector('.ep-i18n-x').addEventListener('click', close);
  searchEl.addEventListener('input', function () { renderList(this.value); });

  function mount() { document.body.appendChild(fab); document.body.appendChild(panel); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
