/* ElderPath — language launcher (self-contained, drop on any page).
   Floating globe button → searchable language list.
   • Hand-crafted languages (window.EP_T, loaded on the homepage) translate
     IN PLACE — instant, no redirect, genuine native quality.
   • Every other language uses Google's translation proxy (100+ langs).
   Flat design, brand colors, accessible.                                    */
(function () {
  'use strict';
  var host = location.hostname;
  if (/translate\.goog$/.test(host)) return;            // already on Google's proxy
  if (/[?&]embed=1\b/.test(location.search)) return;     // hide inside embeds

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
    { c: 'haw', n: 'ʻŌlelo Hawaiʻi', e: 'Hawaiian' }
  ];
  var BYCODE = {}; LANGS.forEach(function (l) { BYCODE[l.c] = l; });
  var NATIVE = (window.EP_T && typeof window.EP_T === 'object') ? window.EP_T : null;
  function hasNative(c) { return NATIVE && NATIVE[c]; }

  function norm(s) { return (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); }

  function proxyURL(code) {
    var h = host.replace(/-/g, '--').replace(/\./g, '-');
    var sep = location.search ? '&' : '?';
    return 'https://' + h + '.translate.goog' + location.pathname + location.search +
      sep + '_x_tr_sl=en&_x_tr_tl=' + encodeURIComponent(code) + '&_x_tr_hl=' + encodeURIComponent(code);
  }

  /* ---- in-place native translation ---- */
  var CHANGED = [];                 // {node, orig} for revert
  function setNode(node, text) { CHANGED.push({ node: node, orig: node.textContent }); node.textContent = text; }

  function firstTextChild(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) return el.childNodes[i];
    }
    return null;
  }
  function lastTextChild(el) {
    for (var i = el.childNodes.length - 1; i >= 0; i--) {
      if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) return el.childNodes[i];
    }
    return null;
  }

  function applyNative(code) {
    var dict = NATIVE[code]; if (!dict) return false;
    // general pass: elements whose whole text is one translatable unit
    var SEL = '.announce-extra,.announce strong,nav a,.menu-drawer a,.drawer-note,.kicker,h1,h2,h3,' +
      '.sub,.lead,option,.hstat .n,.hstat .l,.b-photo p,.b-small p,.b-small .big,.evidence .stat,' +
      '.evidence p,.evidence a,blockquote,.attr,.cmp th,.cmp td,.mid-cta p,.mid-cta a,.step p,.step .meta,' +
      '.gl-cap,.m-col p,.money-card li,.voice p,.who,.voices-cap,.faq-a p,.final p,.privacy-note,' +
      '.foot-links a,.disclaimer,button[type=submit],' +
      '.rc-tag,.rc-row .label,.rc-violations strong,.rc-note,.grade .gl,.report-callout .new,.lead-in,.src-chip';
    [].forEach.call(document.querySelectorAll(SEL), function (el) {
      var key = norm(el.textContent), t = dict[key];
      if (t === undefined) return;
      // money-card h3 / icon-bearing → set text node only (keep the icon)
      if (el.querySelector && el.querySelector('svg, .ic, img')) {
        var tn = lastTextChild(el); if (tn) setNode(tn, t); return;
      }
      setNode(el, t);
    });
    // money-card h3 titles (have an icon span; handled above by svg check, but ensure)
    [].forEach.call(document.querySelectorAll('.money-card h3'), function (h) {
      var key = norm(h.textContent), t = dict[key]; if (t === undefined) return;
      var tn = lastTextChild(h); if (tn) setNode(tn, t);
    });
    // FAQ questions (text node before the chevron)
    [].forEach.call(document.querySelectorAll('.faq-q'), function (b) {
      var tn = firstTextChild(b); if (!tn) return;
      var t = dict[norm(tn.textContent)]; if (t !== undefined) setNode(tn, t);
    });
    // report-callout link: translate the text after the "Free tool" badge
    var rcLink = document.querySelector('.report-callout a');
    if (rcLink) { var rtn = lastTextChild(rcLink); if (rtn && dict[norm(rtn.textContent)] !== undefined) setNode(rtn, dict[norm(rtn.textContent)]); }
    // announce bar leading text node
    var ann = document.querySelector('.announce');
    if (ann) { var atn = firstTextChild(ann); if (atn) { var at = dict[norm(atn.textContent)]; if (at !== undefined) setNode(atn, at + ' '); } }
    // hero "try it now" line (text · link · text)
    var ht = document.querySelector('.hero-try');
    if (ht) {
      var pre = firstTextChild(ht), link = ht.querySelector('a'), post = lastTextChild(ht);
      if (pre && dict[norm(pre.textContent)] !== undefined) setNode(pre, dict[norm(pre.textContent)] + ' ');
      if (link && dict[norm(link.textContent)] !== undefined) setNode(link, dict[norm(link.textContent)]);
      if (post && post !== pre && dict[norm(post.textContent)] !== undefined) setNode(post, ' ' + dict[norm(post.textContent)]);
    }
    document.documentElement.lang = code;
    try { localStorage.setItem('ep-lang', code); } catch (e) {}
    fabLabel.textContent = (BYCODE[code] && BYCODE[code].n) || code;
    return true;
  }
  function revertNative() {
    CHANGED.forEach(function (c) { c.node.textContent = c.orig; });
    CHANGED = [];
    document.documentElement.lang = 'en';
    try { localStorage.removeItem('ep-lang'); } catch (e) {}
    fabLabel.textContent = 'Language';
  }

  function choose(code) {
    if (hasNative(code)) { revertNative(); applyNative(code); close(); }
    else { try { localStorage.setItem('ep-lang', '@' + code); } catch (e) {} location.href = proxyURL(code); }
  }

  /* ---- styles ---- */
  var css =
    '.ep-i18n-fab{position:fixed;right:20px;bottom:20px;z-index:1000;display:inline-flex;align-items:center;gap:8px;' +
    'height:48px;padding:0 18px 0 16px;border-radius:999px;border:1.5px solid #7c3c17;background:#9d4f24;color:#fff;' +
    'font:600 14.5px/1 Inter,-apple-system,sans-serif;cursor:pointer;transition:background .15s}' +
    '.ep-i18n-fab:hover{background:#7c3c17}.ep-i18n-fab:focus-visible{outline:3px solid #2b251d;outline-offset:2px}' +
    '.ep-i18n-fab svg{width:20px;height:20px;flex-shrink:0}' +
    '@media(max-width:480px){.ep-i18n-fab{padding:0;width:48px;justify-content:center}.ep-i18n-fab-label{display:none}}' +
    'body.menu-open .ep-i18n-fab,body.menu-open .ep-i18n-panel{display:none}' +
    '.ep-i18n-panel{position:fixed;right:20px;bottom:78px;z-index:1001;width:300px;max-width:calc(100vw - 40px);' +
    'max-height:min(70vh,540px);display:flex;flex-direction:column;background:#fffdf9;border:1.5px solid #e3dac8;' +
    'border-radius:16px;overflow:hidden;font-family:Inter,-apple-system,sans-serif}.ep-i18n-panel[hidden]{display:none}' +
    '.ep-i18n-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px}' +
    '.ep-i18n-head strong{font:700 14px/1.2 Georgia,serif;color:#2b251d}' +
    '.ep-i18n-x{background:none;border:none;font-size:22px;line-height:1;color:#6e6553;cursor:pointer;padding:0 4px}.ep-i18n-x:hover{color:#2b251d}' +
    '.ep-i18n-search{margin:0 16px 10px;height:40px;padding:0 14px;border:1.5px solid #e3dac8;border-radius:999px;font:400 15px Inter,sans-serif;color:#2b251d;background:#fff}' +
    '.ep-i18n-search:focus{outline:none;border-color:#9d4f24}' +
    '.ep-i18n-list{overflow-y:auto;padding:0 8px 8px}' +
    '.ep-i18n-grp{font:700 10.5px/1 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6e6553;padding:10px 12px 6px}' +
    '.ep-i18n-item{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:9px 12px;border-radius:10px;font-family:inherit}' +
    '.ep-i18n-item:hover,.ep-i18n-item:focus-visible{background:#f3ece0;outline:none}' +
    '.ep-i18n-item .tx{display:flex;flex-direction:column;gap:1px;min-width:0}' +
    '.ep-i18n-n{font-size:15px;font-weight:600;color:#2b251d}.ep-i18n-e{font-size:12px;color:#6e6553}' +
    '.ep-i18n-tag{font:700 10px/1 Inter,sans-serif;color:#2f6b52;background:#e7f0ea;border-radius:999px;padding:4px 8px;white-space:nowrap}' +
    '.ep-i18n-reset .ep-i18n-n{color:#9d4f24}' +
    '.ep-i18n-empty{padding:14px 12px;color:#6e6553;font-size:14px}' +
    '.ep-i18n-note{margin:0;padding:10px 16px;border-top:1.5px solid #e3dac8;font-size:11.5px;line-height:1.45;color:#6e6553}' +
    '@media(prefers-reduced-motion:reduce){.ep-i18n-fab{transition:none}}';
  var stEl = document.createElement('style'); stEl.textContent = css; document.head.appendChild(stEl);

  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
  var fab = document.createElement('button');
  fab.className = 'ep-i18n-fab'; fab.type = 'button';
  fab.setAttribute('aria-haspopup', 'dialog'); fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-label', 'Translate this page — choose your language');
  fab.innerHTML = GLOBE + '<span class="ep-i18n-fab-label">Language</span>';
  var fabLabel = fab.querySelector('.ep-i18n-fab-label');

  var panel = document.createElement('div');
  panel.className = 'ep-i18n-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Choose a language');
  panel.innerHTML =
    '<div class="ep-i18n-head"><strong>Read in your language</strong><button class="ep-i18n-x" type="button" aria-label="Close">×</button></div>' +
    '<input class="ep-i18n-search" type="search" placeholder="Search 50+ languages…" aria-label="Search languages" autocomplete="off">' +
    '<div class="ep-i18n-list" role="listbox" aria-label="Languages"></div>' +
    '<p class="ep-i18n-note"></p>';
  var listEl = panel.querySelector('.ep-i18n-list');
  var searchEl = panel.querySelector('.ep-i18n-search');
  var noteEl = panel.querySelector('.ep-i18n-note');

  function item(l, isNative) {
    var b = document.createElement('button');
    b.className = 'ep-i18n-item'; b.type = 'button'; b.setAttribute('role', 'option');
    var tx = '<span class="tx"><span class="ep-i18n-n"></span><span class="ep-i18n-e"></span></span>';
    b.innerHTML = tx + (isNative ? '<span class="ep-i18n-tag">native</span>' : '');
    b.querySelector('.ep-i18n-n').textContent = l.n;
    b.querySelector('.ep-i18n-e').textContent = l.e;
    b.addEventListener('click', function () { choose(l.c); });
    return b;
  }
  function header(txt) { var h = document.createElement('div'); h.className = 'ep-i18n-grp'; h.textContent = txt; return h; }

  function renderList(filter) {
    var f = norm(filter).toLowerCase();
    listEl.innerHTML = '';
    var natives = LANGS.filter(function (l) { return hasNative(l.c); });
    var rest = LANGS.filter(function (l) { return !hasNative(l.c); });
    function match(l) { return !f || l.n.toLowerCase().indexOf(f) >= 0 || l.e.toLowerCase().indexOf(f) >= 0 || l.c.toLowerCase().indexOf(f) >= 0; }
    var nf = natives.filter(match), rf = rest.filter(match);

    if (!f && CHANGED.length) {                      // currently translated → offer reset
      var r = document.createElement('button');
      r.className = 'ep-i18n-item ep-i18n-reset'; r.type = 'button';
      r.innerHTML = '<span class="tx"><span class="ep-i18n-n">English (original)</span><span class="ep-i18n-e">Show the page as written</span></span>';
      r.addEventListener('click', function () { revertNative(); close(); });
      listEl.appendChild(r);
    }
    if (nf.length) { listEl.appendChild(header('Hand-crafted translations')); nf.forEach(function (l) { listEl.appendChild(item(l, true)); }); }
    if (rf.length) { if (nf.length || NATIVE) listEl.appendChild(header('More languages · auto-translated')); rf.forEach(function (l) { listEl.appendChild(item(l, false)); }); }
    if (!nf.length && !rf.length) listEl.innerHTML = '<p class="ep-i18n-empty">No language matches your search.</p>';
    noteEl.textContent = NATIVE
      ? 'Top languages are translated by hand. The rest use Google — instant, but rougher. Your data is never sent anywhere.'
      : 'Instant translation by Google. The original English page stays at this address.';
  }
  renderList('');

  function open() {
    panel.hidden = false; fab.setAttribute('aria-expanded', 'true');
    searchEl.value = ''; renderList(''); setTimeout(function () { searchEl.focus(); }, 10);
    document.addEventListener('keydown', onKey); document.addEventListener('click', onOutside, true);
  }
  function close() {
    panel.hidden = true; fab.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKey); document.removeEventListener('click', onOutside, true);
    fab.focus();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function onOutside(e) { if (!panel.contains(e.target) && !fab.contains(e.target)) close(); }
  fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
  panel.querySelector('.ep-i18n-x').addEventListener('click', close);
  searchEl.addEventListener('input', function () { renderList(this.value); });

  function mount() {
    document.body.appendChild(fab); document.body.appendChild(panel);
    // restore a previously chosen hand-crafted language (never auto-redirect to proxy)
    try {
      var saved = localStorage.getItem('ep-lang');
      if (saved && hasNative(saved)) applyNative(saved);
    } catch (e) {}
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
