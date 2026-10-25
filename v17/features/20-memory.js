/* =============================================================================
   V17 功能 B · 我们的回忆册 + 数据备份  (v17/features/20-memory.js)
   -----------------------------------------------------------------------------
   自包含片段：运行时注入 CSS / DOM，只读既有全局函数，不修改 index.html。
   - 首页 .v12-tiles 追加第 6 张卡「📖 回忆册」(data-t="mem-tile")
   - 全屏抽屉 #v17MemSheet / data-t="mem-sheet"（z-index 高于 toast，body 滚动锁）
   - 统计条 4 格 + 两个 Tab（时间线 / 数据备份，复用 .hub-tabs/.hub-tab）
   - 时间线：couple-memories 按 ts 倒序，详情展开、改备注(≤40)、删除(confirm)
   - 自动记录：包装 showPartyReport → 原函数后 v17MemUpsertToday()（按天 upsert）
   - 数据备份：导出全部 couple-* 键为 JSON 文件；导入校验后只写 couple-* 键并刷新
   - 三主题走 --v12-* 令牌 + body.light/.sketch；无外部请求；ES5 风格
   稳定选择器：mem-tile / mem-sheet / mem-tab-timeline / mem-tab-backup /
                mem-export / mem-import / mem-file / mem-item / mem-stats / mem-close
   额外：mem-empty / mem-detail / mem-note / mem-del / mem-incognito / mem-backup /
         mem-backup-overview / mem-timeline
   ========================================================================== */
(function () {
  var TAB = 'timeline';      /* 当前页签 timeline | backup */
  var EXP = {};              /* {ts: true} 展开的条目 */
  var LOCKED = false;        /* body 滚动锁是否由我们持有 */
  var PREV_OVERFLOW = '';    /* 打开抽屉前的 body.style.overflow */
  var STYLE_ON = false;
  var SHEET_ID = 'v17MemSheet';
  var MAX_ITEMS = 200;

  /* ------------------------------ 小工具 ------------------------------ */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function dateKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function fmtDate(iso) {
    var p = String(iso || '').split('-');
    if (p.length !== 3) return String(iso || '');
    var y = parseInt(p[0], 10), m = parseInt(p[1], 10), dd = parseInt(p[2], 10);
    if (!y || !m || !dd) return String(iso || '');
    var wd = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var dt = new Date(y, m - 1, dd);
    return m + '月' + dd + '日 ' + wd[dt.getDay()];
  }

  function dayDiff(a, b) { /* a、b 均为 YYYY-MM-DD，返回 b - a 的天数 */
    var pa = String(a || '').split('-'), pb = String(b || '').split('-');
    if (pa.length !== 3 || pb.length !== 3) return 0;
    var ua = Date.UTC(+pa[0], +pa[1] - 1, +pa[2]);
    var ub = Date.UTC(+pb[0], +pb[1] - 1, +pb[2]);
    if (!isFinite(ua) || !isFinite(ub)) return 0;
    return Math.round((ub - ua) / 86400000);
  }

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }

  function gameLabel(id) {
    try {
      var g = null;
      if (typeof GAMES !== 'undefined' && GAMES && GAMES.length) {
        for (var i = 0; i < GAMES.length; i++) { if (GAMES[i].id === id) { g = GAMES[i]; break; } }
      }
      if (g) return g.icon + ' ' + g.name;
    } catch (e) {}
    return String(id);
  }

  /* --------------------------- 数据读写 / 清洗 --------------------------- */
  function sanitizeBy(by) {
    var out = {}, n = 0;
    try {
      for (var k in by) {
        if (!Object.prototype.hasOwnProperty.call(by, k)) continue;
        if (n >= 8) break;
        if (!/^[A-Za-z0-9_-]{1,32}$/.test(k)) continue;
        var v = Math.round(num(by[k]));
        if (v <= 0) continue;
        out[k] = v; n++;
      }
    } catch (e) {}
    return out;
  }

  function readMem() {
    var out = { v: 1, list: [] };
    try {
      var raw = null;
      try { raw = localStorage.getItem('couple-memories'); } catch (e) { raw = null; }
      if (!raw) return out;
      var o = JSON.parse(raw);
      if (!o || typeof o !== 'object' || !o.list || typeof o.list.length !== 'number') return out;
      var arr = [];
      for (var i = 0; i < o.list.length; i++) {
        var e = o.list[i];
        if (!e || typeof e !== 'object') continue;
        var ts = Number(e.ts);
        if (!isFinite(ts) || ts <= 0) continue;
        var date = String(e.date || '');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
        arr.push({
          ts: ts,
          date: date,
          heat: Math.round(num(e.heat)),
          tasks: Math.round(num(e.tasks)),
          games: Math.round(num(e.games)),
          kisses: Math.round(num(e.kisses)),
          drinks: Math.round(num(e.drinks)),
          punished: Math.round(num(e.punished)),
          moqi: Math.round(num(e.moqi)),
          note: typeof e.note === 'string' ? e.note.slice(0, 40) : '',
          by: e.by && typeof e.by === 'object' ? sanitizeBy(e.by) : {}
        });
      }
      arr.sort(function (a, b) { return b.ts - a.ts; });
      out.list = arr.slice(0, MAX_ITEMS);
    } catch (e) { /* 坏 JSON 直接回退空册 */ }
    return out;
  }

  function saveMem(data) {
    try {
      var list = (data && data.list) ? data.list : [];
      list.sort(function (a, b) { return b.ts - a.ts; });
      if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
      try { localStorage.setItem('couple-memories', JSON.stringify({ v: 1, list: list })); } catch (e) { return false; }
      return true;
    } catch (e) { return false; }
  }

  function todayKey() { return dateKey(new Date()); }

  function refreshFromParty() { /* 自动记录：把当天的 couple-party + 热度 upsert 进回忆册 */
    var P = {};
    try { P = JSON.parse(localStorage.getItem('couple-party') || '{}') || {}; } catch (e) { P = {}; }
    var heat = 0;
    try { heat = num(getHeat()); } catch (e) { heat = 0; }
    var tasks = Math.round(num(P.tasks));
    if (tasks <= 0 && heat <= 0) return false; /* 当天没有数据，不记录 */

    var today = todayKey();
    var kisses = Math.round(num(P.kisses));
    var drinks = Math.round(num(P.drinks));
    var punished = Math.round(num(P.punished));
    var games = Math.round(num(P.games));
    var by = sanitizeBy(P.byGame || {});

    var moqi = 0; /* 若功能 A 写入 couple-moqi，取当天最近一次默契度 */
    try {
      var M = JSON.parse(localStorage.getItem('couple-moqi') || '{}');
      if (M && M.lastAt === today && M.heart && num(M.heart.last) > 0) {
        moqi = Math.round(num(M.heart.last));
      }
    } catch (e) {}

    var data = readMem();
    var found = null;
    for (var i = 0; i < data.list.length; i++) {
      if (data.list[i].date === today) { found = data.list[i]; break; }
    }
    if (found) { /* 同一天只更新数字，不新增 */
      found.heat = heat;
      found.tasks = tasks;
      found.games = games;
      found.kisses = kisses;
      found.drinks = drinks;
      found.punished = punished;
      found.by = by;
      if (moqi > 0) found.moqi = moqi;
    } else {
      data.list.push({
        ts: Date.now(),
        date: today,
        heat: heat,
        tasks: tasks,
        games: games,
        kisses: kisses,
        drinks: drinks,
        punished: punished,
        moqi: moqi,
        note: '',
        by: by
      });
    }
    return saveMem(data);
  }

  /* ------------------------------ 样式注入 ------------------------------ */
  function ensureStyle() {
    if (STYLE_ON) return;
    try {
      var old = document.getElementById('v17MemStyle');
      if (old) { STYLE_ON = true; return; }
      var css = ''
        + '.v17mem-sheet{position:fixed;inset:0;z-index:10050;display:none;flex-direction:column;width:100%;height:100%;'
        + 'background:linear-gradient(180deg,#0f0820 0%,#07040f 100%);color:var(--v12-ink);font-family:inherit;'
        + 'overflow:hidden;-webkit-tap-highlight-color:transparent}'
        + '.v17mem-sheet.on{display:flex;animation:v17memIn .3s cubic-bezier(.2,.8,.2,1)}'
        + '@keyframes v17memIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}'
        + 'body.light .v17mem-sheet,body.sketch .v17mem-sheet{background:linear-gradient(180deg,#fff9fc 0%,#fdf1f6 100%);color:#3a2233}'
        + '.v17mem-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;'
        + 'padding:calc(14px + env(safe-area-inset-top)) 16px 12px;border-bottom:1px solid var(--v12-line);'
        + 'background:rgba(15,8,32,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);position:relative;z-index:2}'
        + 'body.light .v17mem-head,body.sketch .v17mem-head{background:rgba(255,249,252,.94)}'
        + '.v17mem-title{font-size:18px;font-weight:800;letter-spacing:.01em;color:var(--v12-ink)}'
        + '.v17mem-sub{font-size:11.5px;color:var(--v12-dim2);margin-top:3px}'
        + '.v17mem-close{width:44px;height:44px;min-width:44px;border-radius:14px;border:1px solid var(--v12-line);'
        + 'background:rgba(255,255,255,.06);color:var(--v12-ink);font-size:18px;line-height:1;cursor:pointer;'
        + 'flex:0 0 auto;font-family:inherit;touch-action:manipulation}'
        + 'body.light .v17mem-close,body.sketch .v17mem-close{background:rgba(255,255,255,.75)}'
        + '.v17mem-close:active{transform:scale(.94)}'
        + '.v17mem-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;'
        + 'padding:14px 14px calc(30px + env(safe-area-inset-bottom));max-width:520px;margin:0 auto;width:100%}'
        + '.v17mem-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:0 0 12px}'
        + '.v17mem-stat{background:var(--v12-surf);border:1px solid var(--v12-line);border-radius:14px;'
        + 'padding:9px 4px;text-align:center;min-width:0}'
        + '.v17mem-stat span{display:block;font-size:10px;color:var(--v12-dim2);margin-bottom:2px;white-space:nowrap}'
        + '.v17mem-stat b{display:block;font-size:14px;color:var(--v12-ink);font-variant-numeric:tabular-nums;'
        + 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
        + '.v17mem-stats .v17mem-stat:nth-child(3) b{font-size:12.5px}'
        + '.v17mem-sheet .hub-tabs{padding:0 0 10px}'
        /* 既有 body.light/.sketch .hub-tab 背景规则会盖掉 .hub-tab.on 的渐变，导致浅色主题下
           选中页签白字白底；这里只在回忆册抽屉内提权修复，不改既有样式表。 */
        + '.v17mem-sheet .hub-tab.on{background:linear-gradient(135deg,var(--v12-m),var(--v12-v));color:#fff;'
        + 'border-color:transparent;box-shadow:0 0 18px rgba(255,45,149,.3)}'
        + '.v17mem-sheet .hub-tab{min-height:36px;display:inline-flex;align-items:center}'
        + '.v17mem-incog{font-size:11.5px;line-height:1.55;color:#ffb86b;background:rgba(255,170,60,.1);'
        + 'border:1px solid rgba(255,170,60,.32);border-radius:12px;padding:9px 11px;margin:0 0 10px}'
        + 'body.light .v17mem-incog,body.sketch .v17mem-incog{color:#a8641a;background:rgba(255,196,120,.16)}'
        + '.v17mem-card{background:var(--v12-surf);border:1px solid var(--v12-line);border-radius:16px;'
        + 'padding:12px 13px;margin:0 0 10px;font-size:12.5px;line-height:1.7;color:var(--v12-dim)}'
        + '.v17mem-card b{color:var(--v12-ink)}'
        + '.v17mem-empty{text-align:center;font-size:13px;line-height:1.9;color:var(--v12-dim);'
        + 'background:var(--v12-surf);border:1px dashed var(--v12-line);border-radius:18px;padding:26px 16px;margin:8px 0 12px}'
        + '.v17mem-empty .v17mem-empty-ic{font-size:30px;display:block;margin-bottom:6px}'
        + '.v17mem-item{background:var(--v12-surf);border:1px solid var(--v12-line);border-radius:16px;'
        + 'margin:0 0 10px;overflow:hidden;transition:border-color .2s,box-shadow .2s}'
        + '.v17mem-item.open{border-color:rgba(255,45,149,.42);box-shadow:0 0 20px rgba(255,45,149,.1)}'
        + '.v17mem-item-head{padding:12px 13px;cursor:pointer;-webkit-tap-highlight-color:transparent}'
        + '.v17mem-row1{display:flex;align-items:center;gap:8px}'
        + '.v17mem-date{font-size:14px;font-weight:700;color:var(--v12-ink)}'
        + '.v17mem-badge{font-size:10px;color:#fff;background:linear-gradient(135deg,var(--v12-m),var(--v12-v));'
        + 'border-radius:999px;padding:2px 8px;font-weight:600;white-space:nowrap}'
        + '.v17mem-arrow{margin-left:auto;font-size:11px;color:var(--v12-dim2)}'
        + '.v17mem-nums{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px;font-size:11.5px;color:var(--v12-dim)}'
        + '.v17mem-nums span{background:rgba(255,255,255,.05);border:1px solid var(--v12-line);border-radius:999px;'
        + 'padding:2px 8px;white-space:nowrap}'
        + 'body.light .v17mem-nums span,body.sketch .v17mem-nums span{background:rgba(255,255,255,.7)}'
        + '.v17mem-nums .v17mem-hot{color:var(--v12-g);border-color:rgba(255,209,102,.35)}'
        + 'body.light .v17mem-nums .v17mem-hot,body.sketch .v17mem-nums .v17mem-hot{color:#a5731a;border-color:rgba(165,115,26,.35)}'
        + '.v17mem-note{margin-top:7px;font-size:12px;color:var(--v12-dim);line-height:1.6;word-break:break-word}'
        + '.v17mem-detail{padding:11px 13px 13px;border-top:1px dashed var(--v12-line);animation:v17memCardIn .28s ease}'
        + '@keyframes v17memCardIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}'
        + '.v17mem-chips{display:flex;flex-wrap:wrap;gap:6px;font-size:11.5px}'
        + '.v17mem-chip{color:var(--v12-dim);border:1px solid var(--v12-line);background:rgba(255,255,255,.04);'
        + 'border-radius:999px;padding:3px 9px;white-space:nowrap}'
        + 'body.light .v17mem-chip,body.sketch .v17mem-chip{background:rgba(255,255,255,.65)}'
        + '.v17mem-sub2{font-size:11px;color:var(--v12-dim2);margin:10px 0 3px;letter-spacing:.04em}'
        + '.v17mem-game{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:var(--v12-dim);'
        + 'padding:4px 0;border-bottom:1px dashed rgba(255,255,255,.07)}'
        + 'body.light .v17mem-game,body.sketch .v17mem-game{border-bottom-color:rgba(150,80,110,.12)}'
        + '.v17mem-game b{color:var(--v12-g);font-weight:600;white-space:nowrap}'
        + 'body.light .v17mem-game b,body.sketch .v17mem-game b{color:#a5731a}'
        + '.v17mem-actions{display:flex;gap:8px;margin-top:12px}'
        + '.v17mem-btn{width:100%;min-height:46px;border-radius:14px;border:1px solid var(--v12-line);'
        + 'background:rgba(255,255,255,.06);color:var(--v12-ink);font-family:inherit;font-size:14px;font-weight:700;'
        + 'cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;touch-action:manipulation;'
        + '-webkit-tap-highlight-color:transparent}'
        + '.v17mem-btn.primary{background:linear-gradient(135deg,#ff2d95,#8b5cf6);border:0;color:#fff;'
        + 'box-shadow:0 0 20px rgba(255,45,149,.28),inset 0 1px 0 rgba(255,255,255,.28)}'
        + '.v17mem-btn.ghost{background:rgba(255,255,255,.05)}'
        + 'body.light .v17mem-btn.ghost,body.sketch .v17mem-btn.ghost{background:rgba(255,255,255,.72);color:#6d4a5c}'
        + '.v17mem-btn.danger{color:var(--v12-danger);border-color:rgba(255,92,122,.4);background:rgba(255,92,122,.08)}'
        + '.v17mem-btn.sm{min-height:40px;font-size:12.5px;flex:1;width:auto;padding:0 10px}'
        + '.v17mem-btn:active{transform:scale(.975)}'
        + '.v17mem-panel>.v17mem-btn{margin:0 0 9px}'
        + '.v17mem-tip{font-size:10.5px;line-height:1.65;color:var(--v12-dim2);margin:10px 2px 0;text-align:center}';
      var st = document.createElement('style');
      st.id = 'v17MemStyle';
      st.type = 'text/css';
      st.appendChild(document.createTextNode(css));
      (document.head || document.getElementsByTagName('head')[0] || document.body).appendChild(st);
      STYLE_ON = true;
    } catch (e) { STYLE_ON = true; }
  }

  /* ------------------------------ 抽屉 DOM ------------------------------ */
  function ensureSheet() {
    var sh = document.getElementById(SHEET_ID);
    if (sh) return sh;
    sh = document.createElement('div');
    sh.id = SHEET_ID;
    sh.className = 'v17mem-sheet';
    sh.setAttribute('data-t', 'mem-sheet');
    sh.setAttribute('role', 'dialog');
    sh.setAttribute('aria-modal', 'true');
    sh.setAttribute('aria-label', '我们的回忆册');
    sh.innerHTML = '<div class="v17mem-head">'
      + '<div><div class="v17mem-title">📖 我们的回忆</div><div class="v17mem-sub">这些夜晚，值得留档</div></div>'
      + '<button class="v17mem-close" data-t="mem-close" aria-label="关闭回忆册" onclick="v17MemClose()">✕</button>'
      + '</div>'
      + '<div class="v17mem-body" id="v17MemBody"></div>';
    document.body.appendChild(sh);
    return sh;
  }

  function scrollBody() {
    var sh = document.getElementById(SHEET_ID);
    return sh ? sh.querySelector('.v17mem-body') : null;
  }

  /* ------------------------------ 渲染片段 ------------------------------ */
  function incognitoTip() {
    try {
      if (typeof SET !== 'undefined' && SET && SET.incognito) {
        return '<div class="v17mem-incog" data-t="mem-incognito">🛡️ 无痕模式开启中：回大厅会清空这些数据。要留档的话，先在「数据备份」里导出一次。</div>';
      }
    } catch (e) {}
    return '';
  }

  function statsHtml(list) {
    var tasks = 0, maxHeat = 0, minDate = '';
    for (var i = 0; i < list.length; i++) {
      tasks += list[i].tasks || 0;
      if (list[i].heat > maxHeat) maxHeat = list[i].heat;
      if (!minDate || list[i].date < minDate) minDate = list[i].date;
    }
    var days = 0;
    if (list.length && minDate) {
      var d = dayDiff(minDate, todayKey()) + 1;
      days = d > 0 ? d : 1;
    }
    return '<div class="v17mem-stats" data-t="mem-stats">'
      + '<div class="v17mem-stat"><span>共</span><b>' + list.length + ' 晚</b></div>'
      + '<div class="v17mem-stat"><span>累计任务</span><b>' + tasks + '</b></div>'
      + '<div class="v17mem-stat"><span>最高温度</span><b>🔥 ' + maxHeat + '</b></div>'
      + '<div class="v17mem-stat"><span>陪伴</span><b>' + days + ' 天</b></div>'
      + '</div>';
  }

  function tabsHtml() {
    return '<div class="hub-tabs v17mem-tabs">'
      + '<div class="hub-tab' + (TAB === 'timeline' ? ' on' : '') + '" data-t="mem-tab-timeline" onclick="v17MemSwitchTab(\'timeline\')">🕰️ 时间线</div>'
      + '<div class="hub-tab' + (TAB === 'backup' ? ' on' : '') + '" data-t="mem-tab-backup" onclick="v17MemSwitchTab(\'backup\')">💾 数据备份</div>'
      + '</div>';
  }

  function detailHtml(e) {
    var chips = '<div class="v17mem-chips">'
      + '<span class="v17mem-chip">💋 亲吻 ' + e.kisses + ' 次</span>'
      + '<span class="v17mem-chip">🍷 喝酒 ' + e.drinks + ' 杯</span>'
      + '<span class="v17mem-chip">💞 默契度 ' + (e.moqi > 0 ? e.moqi + '%' : '—') + '</span>'
      + (e.punished > 0 ? '<span class="v17mem-chip">😈 受罚 ' + e.punished + ' 次</span>' : '')
      + '</div>';
    var games = '';
    var ids = [];
    for (var k in (e.by || {})) { if (Object.prototype.hasOwnProperty.call(e.by, k)) ids.push(k); }
    ids.sort(function (a, b) { return e.by[b] - e.by[a]; });
    for (var i = 0; i < ids.length && i < 6; i++) {
      games += '<div class="v17mem-game"><span>' + esc(gameLabel(ids[i])) + '</span><b>' + e.by[ids[i]] + ' 次</b></div>';
    }
    var byHtml = games ? '<div class="v17mem-sub2">🎮 游戏明细</div>' + games : '';
    return '<div class="v17mem-detail" data-t="mem-detail">' + chips + byHtml
      + '<div class="v17mem-actions">'
      + '<button class="v17mem-btn ghost sm" data-t="mem-note" onclick="v17MemEditNote(' + e.ts + ')">✏️ 改备注</button>'
      + '<button class="v17mem-btn danger sm" data-t="mem-del" onclick="v17MemDel(' + e.ts + ')">🗑️ 删除</button>'
      + '</div></div>';
  }

  function itemHtml(e) {
    var open = !!EXP[e.ts];
    var isToday = e.date === todayKey();
    var note = e.note ? '<div class="v17mem-note">📝 ' + esc(e.note) + '</div>' : '';
    return '<div class="v17mem-item' + (open ? ' open' : '') + '" data-t="mem-item" data-date="' + esc(e.date) + '" data-ts="' + e.ts + '">'
      + '<div class="v17mem-item-head" onclick="v17MemToggle(' + e.ts + ')">'
      + '<div class="v17mem-row1"><span class="v17mem-date">' + esc(fmtDate(e.date)) + '</span>'
      + (isToday ? '<span class="v17mem-badge">今晚</span>' : '')
      + '<span class="v17mem-arrow">' + (open ? '▴' : '▾') + '</span></div>'
      + '<div class="v17mem-nums"><span class="v17mem-hot">🔥 ' + e.heat + '</span>'
      + '<span>📋 ' + e.tasks + ' 任务</span><span>🎮 ' + e.games + ' 局</span></div>'
      + note
      + '</div>'
      + (open ? detailHtml(e) : '')
      + '</div>';
  }

  function timelineHtml(list) {
    if (!list.length) {
      return '<div class="v17mem-empty" data-t="mem-empty"><span class="v17mem-empty-ic">💌</span>'
        + '还没有记录。今晚玩一局，看一眼本晚战报，它就会自动存进来 💌</div>'
        + '<button class="v17mem-btn ghost" onclick="v17MemGotoReport()">📊 去看看今晚战报</button>';
    }
    var h = '';
    for (var i = 0; i < list.length; i++) h += itemHtml(list[i]);
    return h;
  }

  function scanStorage() {
    var n = 0, bytes = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('couple-') === 0) {
          var v = '';
          try { v = localStorage.getItem(k) || ''; } catch (e) { v = ''; }
          n++;
          bytes += (k.length + v.length) * 2; /* UTF-16 近似值 */
        }
      }
    } catch (e) {}
    var kb = bytes / 1024;
    var kbStr = kb < 10 ? (Math.round(kb * 10) / 10).toFixed(1) : String(Math.round(kb));
    return { n: n, kb: kbStr };
  }

  function backupHtml() {
    var st = scanStorage();
    return '<div class="v17mem-card">🔐 <b>数据只存在这台手机的浏览器里。</b><br>'
      + '换手机 / 清缓存 / 无痕模式都会丢。建议偶尔导出一次备份。</div>'
      + '<div class="v17mem-card" data-t="mem-backup-overview">📦 已保存 <b>' + st.n + '</b> 项数据 · 约 <b>' + st.kb + '</b> KB</div>'
      + '<button class="v17mem-btn primary" data-t="mem-export" onclick="v17MemExport()">⬇️ 导出备份</button>'
      + '<button class="v17mem-btn ghost" data-t="mem-import" onclick="v17MemImportPick()">⬆️ 导入备份</button>'
      + '<input type="file" accept="application/json,.json" data-t="mem-file" style="display:none" onchange="v17MemImportFile(this)">'
      + '<div class="v17mem-tip">导入只覆盖同名的 couple-* 数据，不会动其它内容；文件只在本机解析，不会上传。</div>';
  }

  function render() {
    var sh = ensureSheet();
    var body = sh.querySelector('.v17mem-body');
    if (!body) return;
    var top = body.scrollTop || 0;
    var data = readMem();
    var html = incognitoTip() + statsHtml(data.list) + tabsHtml()
      + (TAB === 'timeline'
        ? '<div class="v17mem-panel" data-t="mem-timeline">' + timelineHtml(data.list) + '</div>'
        : '<div class="v17mem-panel" data-t="mem-backup">' + backupHtml() + '</div>');
    body.innerHTML = html;
    body.scrollTop = top;
  }

  /* ------------------------------ 行为函数 ------------------------------ */
  function openSheet() {
    try {
      ensureStyle();
      var sh = ensureSheet();
      TAB = 'timeline';
      render();
      sh.classList.add('on');
      if (!LOCKED) {
        try { PREV_OVERFLOW = document.body.style.overflow || ''; } catch (e) { PREV_OVERFLOW = ''; }
        LOCKED = true;
      }
      try { document.body.style.overflow = 'hidden'; } catch (e) {}
      try { if (typeof sndDing === 'function') sndDing(); } catch (e) {}
    } catch (e) {}
  }

  function closeSheet() {
    try {
      var sh = document.getElementById(SHEET_ID);
      if (sh) sh.classList.remove('on');
    } catch (e) {}
    if (LOCKED) {
      try { document.body.style.overflow = PREV_OVERFLOW || ''; } catch (e) {}
      LOCKED = false;
    }
  }

  function switchTab(tab) {
    TAB = (tab === 'backup') ? 'backup' : 'timeline';
    render();
  }

  function toggleItem(ts) {
    var key = String(ts);
    if (EXP[key]) delete EXP[key]; else EXP[key] = true;
    render();
  }

  function findEntry(list, ts) {
    for (var i = 0; i < list.length; i++) { if (String(list[i].ts) === String(ts)) return list[i]; }
    return null;
  }

  function editNote(ts) {
    try {
      var data = readMem();
      var e = findEntry(data.list, ts);
      if (!e) { toast('这条记录已经不在了'); return; }
      var nv = prompt('今晚的一句话（最多40字）', e.note || '');
      if (nv === null) return;
      nv = String(nv).replace(/\s+/g, ' ').trim();
      if (nv.length > 40) nv = nv.slice(0, 40);
      e.note = nv;
      if (saveMem(data)) {
        render();
        toast(nv ? '备注已保存 💌' : '备注已清空');
      } else {
        toast('保存失败，浏览器存储不可用');
      }
    } catch (err) { toast('改备注失败'); }
  }

  function delEntry(ts) {
    try {
      var data = readMem();
      var e = findEntry(data.list, ts);
      if (!e) { toast('这条记录已经不在了'); return; }
      if (!confirm('删除这条回忆？\n' + fmtDate(e.date) + ' · 删除后无法恢复')) return;
      var out = [];
      for (var i = 0; i < data.list.length; i++) {
        if (String(data.list[i].ts) !== String(ts)) out.push(data.list[i]);
      }
      data.list = out;
      delete EXP[String(ts)];
      if (saveMem(data)) {
        render();
        toast('已删除 🗑️');
      } else {
        toast('删除失败，浏览器存储不可用');
      }
    } catch (err) { toast('删除失败'); }
  }

  function gotoReport() {
    closeSheet();
    try { if (typeof showPartyReport === 'function') showPartyReport(); } catch (e) {}
  }

  /* ------------------------------ 备份：导出 ------------------------------ */
  function downloadBlob(blob, filename) {
    try {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { if (a.parentNode) a.parentNode.removeChild(a); } catch (e) {}
        try { URL.revokeObjectURL(url); } catch (e) {}
      }, 3000);
      return true;
    } catch (e) { return false; }
  }

  function exportBackup() {
    try {
      var data = {}, n = 0;
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf('couple-') === 0) {
            var v = '';
            try { v = localStorage.getItem(k); } catch (e) { v = ''; }
            data[k] = v;
            n++;
          }
        }
      } catch (e) {}
      var payload = { app: 'couple-game', v: 17, exportedAt: new Date().toISOString(), data: data };
      var txt = JSON.stringify(payload, null, 1);
      var fname = '情侣升温游戏备份-' + dateKey() + '.json';
      var blob = new Blob([txt], { type: 'application/json' });
      toast('已打包 ' + n + ' 项数据 ⬇️');
      /* 手机上优先系统分享，失败/不支持则回退下载 */
      try {
        if (typeof File !== 'undefined' && typeof navigator !== 'undefined' && navigator &&
            navigator.canShare && typeof navigator.share === 'function') {
          var file = new File([blob], fname, { type: 'application/json' });
          if (navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], title: '情侣升温游戏 · 数据备份' })
              .catch(function () { downloadBlob(blob, fname); });
            return;
          }
        }
      } catch (e) {}
      downloadBlob(blob, fname);
    } catch (e) {
      try { toast('导出失败：' + (e && e.message ? e.message : e)); } catch (e2) {}
    }
  }

  /* ------------------------------ 备份：导入 ------------------------------ */
  function importPick() {
    try {
      var sh = document.getElementById(SHEET_ID);
      var inp = sh ? sh.querySelector('[data-t="mem-file"]') : null;
      if (!inp) { toast('请先在「数据备份」页签里导入'); return; }
      inp.click();
    } catch (e) { toast('无法打开文件选择器'); }
  }

  function importFile(input) {
    try {
      var f = (input && input.files && input.files[0]) ? input.files[0] : null;
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var txt = '';
        try { txt = String(reader.result || ''); } catch (e) { txt = ''; }
        try { doImport(txt); } catch (e) { toast('备份文件格式不对'); }
        try { input.value = ''; } catch (e) {}
      };
      reader.onerror = function () {
        toast('备份文件读取失败');
        try { input.value = ''; } catch (e) {}
      };
      reader.readAsText(f, 'utf-8');
    } catch (e) { toast('备份文件格式不对'); }
  }

  function isPlainObject(o) {
    return !!o && typeof o === 'object' && Object.prototype.toString.call(o) !== '[object Array]';
  }

  function valueToStr(v) {
    if (typeof v === 'string') return v;
    if (v === null || v === undefined) return null;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    try { return JSON.stringify(v); } catch (e) { return null; }
  }

  function doImport(txt) {
    var obj = null;
    try { obj = JSON.parse(String(txt || '')); } catch (e) { toast('备份文件格式不对'); return false; }
    if (!isPlainObject(obj)) { toast('备份文件格式不对'); return false; }
    var map = null, exportedAt = '';
    if (isPlainObject(obj.data)) {
      map = obj.data;
      exportedAt = typeof obj.exportedAt === 'string' ? obj.exportedAt : '';
    } else {
      map = obj; /* 兼容没有外层包装的裸键值对象 */
    }
    var keys = [];
    try {
      for (var k in map) {
        if (!Object.prototype.hasOwnProperty.call(map, k)) continue;
        if (k.length > 80) continue;
        if (!/^couple-[A-Za-z0-9_-]{1,64}$/.test(k)) continue; /* 不合法键名忽略 */
        if (map[k] === undefined || map[k] === null) continue;
        keys.push(k);
        if (keys.length > 300) break;
      }
    } catch (e) {}
    if (!keys.length) { toast('备份文件格式不对'); return false; }

    var when = '';
    if (exportedAt) {
      var d = new Date(exportedAt);
      if (!isNaN(d.getTime())) {
        when = '\n备份时间：' + d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
          + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
      }
    }
    if (!confirm('将恢复 ' + keys.length + ' 项数据' + when + '\n同名数据会被覆盖，其它数据保留。\n\n继续导入？')) {
      return false;
    }
    var ok = 0;
    for (var i = 0; i < keys.length; i++) {
      var val = valueToStr(map[keys[i]]);
      if (val === null) continue;
      try { localStorage.setItem(keys[i], val); ok++; } catch (e) {}
    }
    if (ok === 0) { toast('导入失败：浏览器存储不可用'); return false; }
    try { toast('已恢复 ' + ok + ' 项数据，正在刷新…'); } catch (e) {}
    setTimeout(function () {
      try { location.reload(); } catch (e) {}
    }, 700);
    return true;
  }

  /* ------------------------------ 首页入口 ------------------------------ */
  function mountTile() {
    try {
      var tiles = document.querySelector('.v12-tiles');
      if (!tiles) return;
      var mine = tiles.querySelector('[data-t="mem-tile"]');
      if (!mine) {
        var html = '<div class="v12-tile" data-t="mem-tile" onclick="v17MemOpen()">'
          + '<div class="ic">📖</div><div class="nm">回忆册</div>'
          + '<div class="ds">这些夜晚，值得留档</div><div class="tag">NEW</div></div>';
        if (tiles.insertAdjacentHTML) tiles.insertAdjacentHTML('beforeend', html);
        else tiles.innerHTML = tiles.innerHTML + html;
        mine = tiles.querySelector('[data-t="mem-tile"]');
      }
      if (!mine) return;
      /* 回忆册固定第 6 张：其他 feature 的入口可能在本片段之后才挂载（如 DOMContentLoaded 里），
         这里把已存在的卡移到末尾，保证顺序稳定。 */
      var last = tiles.lastElementChild;
      while (last && last.nodeType !== 1) last = last.previousElementSibling;
      if (last && last !== mine) tiles.appendChild(mine);
    } catch (e) {}
  }

  /* ------------------------------ 包装既有函数 ------------------------------ */
  function wrapAll() {
    /* 1) renderHome：原函数执行后再挂载（内部已判重） */
    try {
      var rh = window.renderHome;
      if (typeof rh === 'function' && !rh.__v17MemWrapped) {
        var newRh = function () {
          var r = rh.apply(this, arguments);
          try { mountTile(); } catch (e) {}
          return r;
        };
        newRh.__v17MemWrapped = true;
        window.renderHome = newRh;
      }
    } catch (e) {}

    /* 2) showPartyReport：原函数执行后 upsert 当天记录（不改变弹窗行为） */
    try {
      var spr = window.showPartyReport;
      if (typeof spr === 'function' && !spr.__v17MemWrapped) {
        var newSpr = function () {
          var r;
          try {
            r = spr.apply(this, arguments);
          } finally {
            try { refreshFromParty(); } catch (e) {}
          }
          return r;
        };
        newSpr.__v17MemWrapped = true;
        window.showPartyReport = newSpr;
      }
    } catch (e) {}

    /* 3) 首次打开时手动挂载一次（首屏 renderHome 发生在本片段之前） */
    try { mountTile(); } catch (e) {}
  }

  /* ------------------------------ 初始化 ------------------------------ */
  function init() {
    try { ensureStyle(); } catch (e) {}
    try { ensureSheet(); } catch (e) {}
    try { wrapAll(); } catch (e) {}
    /* 其他 feature 可能在 DOMContentLoaded 里才挂首页入口卡；那时再校正一次顺序，
       保证「回忆册」始终是第 6 张。 */
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          try { mountTile(); } catch (e) {}
        }, false);
      } else {
        mountTile();
      }
    } catch (e) {}
    try {
      document.addEventListener('keydown', function (ev) {
        try {
          var k = ev.key || '';
          var code = ev.keyCode || 0;
          if (k === 'Escape' || k === 'Esc' || code === 27) {
            var sh = document.getElementById(SHEET_ID);
            if (sh && sh.className.indexOf('on') >= 0) closeSheet();
          }
        } catch (e) {}
      });
    } catch (e) {}
  }

  /* ------------------------------ 全局导出 ------------------------------ */
  window.v17MemOpen = openSheet;
  window.v17MemClose = closeSheet;
  window.v17MemSwitchTab = switchTab;
  window.v17MemToggle = toggleItem;
  window.v17MemEditNote = editNote;
  window.v17MemDel = delEntry;
  window.v17MemGotoReport = gotoReport;
  window.v17MemExport = exportBackup;
  window.v17MemImportPick = importPick;
  window.v17MemImportFile = importFile;
  window.v17MemUpsertToday = refreshFromParty;
  window.v17MemRender = render;
  window.v17MemRead = readMem;

  init();
})();
