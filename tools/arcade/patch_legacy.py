# -*- coding: utf-8 -*-
"""生成「经典游戏厅」：把 V17 旧版单文件包装成只装 3 个经典玩法的独立窗口。

- 数据/代码来源：git 提交 98f56c4 的 index.html（旧版 V17 完整单文件）
- 不修改根 index.html（新版 升温夜航），输出 arcade/index.html
- 去掉旧版 PWA 注册/manifest，避免在 /arcade/ 下 404；注入游戏厅首页与返回钩子

用法：python tools/arcade/patch_legacy.py
"""
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "arcade" / "index.html"
CACHE = ROOT / "arcade" / "_legacy-v17.html"
LEGACY_COMMIT = "98f56c4"

SEED = (
    "<script>try{localStorage.setItem('couple-onboarded','1');"
    "localStorage.setItem('couple-night',JSON.stringify({d:new Date().toDateString()}));}catch(e){}</script>"
)

CSS = """
/* ===== 经典游戏厅（包装层，不影响旧版内部样式） ===== */
body.arcade-home { overflow: hidden !important; }
html.arcade-embed .header { display: none !important; }
#arcadeHome{position:fixed;inset:0;z-index:100000;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;
  background:
    radial-gradient(900px 520px at 82% -10%, rgba(154,124,255,.30), transparent 60%),
    radial-gradient(760px 480px at 10% 108%, rgba(255,95,158,.24), transparent 60%),
    linear-gradient(180deg,#0b0617,#070411 55%,#0a0614);
  color:#f7f1ff;padding:calc(26px + env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom));
  font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif;}
#arcadeHome.on{display:block;}
#arcadeHome::before{content:"";position:fixed;left:50%;top:6%;width:340px;height:340px;transform:translateX(-50%);
  border-radius:50%;background:radial-gradient(circle,rgba(243,200,121,.18),transparent 68%);filter:blur(20px);pointer-events:none;}
.arcade-inner{position:relative;z-index:1;max-width:520px;margin:0 auto;min-height:100%;display:flex;flex-direction:column;}
.arcade-brand{font-size:10.5px;letter-spacing:.34em;color:#7d7194;font-weight:700;}
.arcade-title{font-size:clamp(34px,9.4vw,44px);line-height:1.12;font-weight:800;letter-spacing:.03em;margin-top:18px;
  background:linear-gradient(100deg,#fff 0%,#f3c879 42%,#ff5f9e 78%,#9a7cff 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;}
.arcade-sub{margin-top:14px;font-size:13.5px;line-height:1.85;color:#b3a6c9;letter-spacing:.03em;}
.arcade-grid{margin-top:30px;display:flex;flex-direction:column;gap:12px;}
.arcade-card{display:flex;align-items:center;gap:14px;width:100%;min-height:92px;padding:16px 18px;text-align:left;
  border-radius:22px;border:1px solid rgba(255,255,255,.12);
  background:linear-gradient(160deg,rgba(255,255,255,.085),rgba(255,255,255,.03));
  color:#f7f1ff;cursor:pointer;transition:transform .16s ease,border-color .2s,box-shadow .2s;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
.arcade-card:active{transform:scale(.975);}
.arcade-card:hover{border-color:rgba(243,200,121,.45);box-shadow:0 12px 34px rgba(0,0,0,.4);}
.arcade-card .ic{width:52px;height:52px;flex:0 0 auto;border-radius:16px;display:flex;align-items:center;justify-content:center;
  font-size:26px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);}
.arcade-card .tx{flex:1;min-width:0;}
.arcade-card .tx b{display:block;font-size:16.5px;letter-spacing:.04em;}
.arcade-card .tx span{display:block;margin-top:4px;font-size:11.5px;line-height:1.6;color:#a79cc2;}
.arcade-card .go{color:#f3c879;font-size:18px;flex:0 0 auto;opacity:.8;}
.arcade-foot{margin-top:auto;padding-top:34px;display:flex;flex-direction:column;gap:12px;align-items:flex-start;}
.arcade-link{display:inline-flex;align-items:center;min-height:44px;padding:0 4px;color:#f3c879;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:.04em;}
.arcade-new{display:inline-block;margin-left:6px;padding:2px 6px;border-radius:6px;background:linear-gradient(135deg,#ff5f9e,#9a7cff);color:#fff;font-size:8.5px;letter-spacing:.12em;vertical-align:2px;}
.arcade-note{font-size:10.5px;line-height:1.8;color:#6f6689;letter-spacing:.04em;}
@media (max-width:340px){.arcade-card{min-height:84px;padding:14px}.arcade-title{font-size:31px}}
"""

HOME = """
<div id="arcadeHome" role="dialog" aria-label="经典游戏厅">
  <div class="arcade-inner">
    <div class="arcade-brand">CLASSIC ARCADE · 经典游戏厅</div>
    <h1 class="arcade-title">今晚，先玩哪一盘？</h1>
    <p class="arcade-sub">真心话、大冒险、飞行棋，独立在这个窗口里。<br>新版「升温夜航」的进度和数据，不会受影响。</p>
    <div class="arcade-grid">
      <a class="arcade-card" href="thermometer.html" aria-label="打开温度计" style="text-decoration:none">
        <span class="ic" aria-hidden="true">🌡️</span>
        <span class="tx"><b>温度计 <span class="arcade-new">NEW</span></b><span>12 格慢慢升温：掷骰子前进，完成落点的那一格，随时可停</span></span>
        <span class="go" aria-hidden="true">→</span>
      </a>
      <button class="arcade-card" type="button" data-game="truth" aria-label="打开真心话转盘">
        <span class="ic" aria-hidden="true">🎡</span>
        <span class="tx"><b>真心话转盘</b><span>转盘决定谁来回答，答不上来就领一条惩罚</span></span>
        <span class="go" aria-hidden="true">→</span>
      </button>
      <button class="arcade-card" type="button" data-game="dare" aria-label="打开大冒险转盘">
        <span class="ic" aria-hidden="true">🔥</span>
        <span class="tx"><b>大冒险转盘</b><span>转盘决定谁去执行，做完才算过关</span></span>
        <span class="go" aria-hidden="true">→</span>
      </button>
      <button class="arcade-card" type="button" data-game="flight" aria-label="打开飞行棋">
        <span class="ic" aria-hidden="true">✈️</span>
        <span class="tx"><b>飞行棋</b><span>对飞 / 环岛 / 双轨 / 融合，骰子决定今晚的走向</span></span>
        <span class="go" aria-hidden="true">→</span>
      </button>
    </div>
    <div class="arcade-foot">
      <a class="arcade-link" href="../">← 回到「升温夜航」新版</a>
      <div class="arcade-note">这一页只装了 3 个经典玩法 · 旧版数据键 couple-* 与新版 couple2.* 完全隔离</div>
    </div>
  </div>
</div>
"""

JS = """
(function(){
  var overlay = document.getElementById('arcadeHome');
  var wrapped = false;
  var EMBED = /[?&]embed=1/.test(location.search);
  if (EMBED) { try { document.documentElement.classList.add('arcade-embed'); } catch (e) {} }
  function show(){
    try { if (typeof closeModal === 'function') closeModal(); } catch (e) {}
    try { if (window.__v3CloseSheet) window.__v3CloseSheet(); } catch (e) {}
    try { document.body.classList.remove('v3-flight-play'); } catch (e) {}
    overlay.classList.add('on');
    document.body.classList.add('arcade-home');
    document.title = '经典游戏厅 · 升温夜航';
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function hide(){
    overlay.classList.remove('on');
    document.body.classList.remove('arcade-home');
  }
  function start(game){
    hide();
    try { if (typeof closeModal === 'function') closeModal(); } catch (e) {}
    try { if (window.__v3CloseSheet) window.__v3CloseSheet(); } catch (e) {}
    try { startGame(game); } catch (e) { if (!EMBED) show(); }
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function v3CtrlInit(){
    if (document.getElementById('v3CtrlSheet')) return;
    var bar = document.querySelector('.ctrl-btns');
    if (!bar) return;
    var sheet = document.createElement('div');
    sheet.id = 'v3CtrlSheet';
    sheet.className = 'v3-sheet-mask';
    sheet.setAttribute('data-test', 'v3-ctrl-sheet');
    sheet.innerHTML = '<div class="v3-sheet" role="dialog" aria-label="工具">'
      + '<div class="v3-sheet-grip"></div>'
      + '<div class="v3-sheet-title">工具 · 本局</div>'
      + '<div class="v3-sheet-items" id="v3SheetItems"></div>'
      + '<div class="v3-sheet-grid" id="v3SheetActions"></div>'
      + '<button type="button" class="v3-sheet-close">收起</button>'
      + '</div>';
    document.body.appendChild(sheet);
    var items = document.getElementById('ctrlItems');
    if (items) sheet.querySelector('#v3SheetItems').appendChild(items);
    var actions = sheet.querySelector('#v3SheetActions');
    Array.prototype.slice.call(bar.querySelectorAll('.ctrl-btn')).forEach(function(b){
      var id = b.id || '';
      var oc = b.getAttribute('onclick') || '';
      if (id === 'ctrlRelax' || /panelUndo|panelReset|panelHome/.test(oc)) actions.appendChild(b);
    });
    var more = document.createElement('button');
    more.type = 'button';
    more.className = 'ctrl-btn v3-more';
    more.setAttribute('data-test', 'v3-more');
    more.innerHTML = '⋯ 更多';
    more.addEventListener('click', function(){ sheet.classList.add('on'); });
    bar.appendChild(more);
    var logBtn = document.createElement('button');
    logBtn.type = 'button';
    logBtn.className = 'ctrl-btn';
    logBtn.setAttribute('data-test', 'v3-log');
    logBtn.innerHTML = '📜 本局记录';
    logBtn.addEventListener('click', function(){ close(); setTimeout(v3LogOpen, 150); });
    actions.appendChild(logBtn);
    Array.prototype.forEach.call(bar.querySelectorAll('.ctrl-btn'), function(b){
      if (/v12PanelDone/.test(b.getAttribute('onclick') || '')) b.classList.add('v3-primary');
    });
    function close(){ sheet.classList.remove('on'); }
    sheet.addEventListener('click', function(e){ if (e.target === sheet) close(); });
    sheet.querySelector('.v3-sheet-close').addEventListener('click', close);
    actions.addEventListener('click', function(){ setTimeout(close, 120); });
    sheet.querySelector('#v3SheetItems').addEventListener('click', function(){ setTimeout(close, 120); });
    window.__v3CloseSheet = close;
  }
  function v3LogOpen(){
    var mask = document.getElementById('v3LogSheet');
    if (!mask) {
      mask = document.createElement('div');
      mask.id = 'v3LogSheet';
      mask.className = 'v3-sheet-mask';
      mask.setAttribute('data-test', 'v3-log-sheet');
      mask.innerHTML = '<div class="v3-sheet v3-log-sheet">'
        + '<div class="v3-sheet-grip"></div>'
        + '<div class="v3-sheet-title">本局记录 · 今晚</div>'
        + '<div class="v3-log-list" id="v3LogList"></div>'
        + '<button type="button" class="v3-sheet-close">收起</button>'
        + '</div>';
      document.body.appendChild(mask);
      function closeLog(){ mask.classList.remove('on'); }
      mask.addEventListener('click', function(e){ if (e.target === mask) closeLog(); });
      mask.querySelector('.v3-sheet-close').addEventListener('click', closeLog);
      window.__v3CloseLog = closeLog;
    }
    var src = document.getElementById('logDrawer');
    var list = mask.querySelector('#v3LogList');
    var html = src ? String(src.innerHTML || '').trim() : '';
    list.innerHTML = html || '<div class="log-empty">本局还没有记录</div>';
    mask.classList.add('on');
  }
  var DIY_KEY = 'couple-flight-diy-v1';
  var DIY_TYPES = [
    ['truth', '💜 真心话'], ['dare', '🔥 大冒险'], ['touch', '💞 触碰'],
    ['drink', '🍷 喝酒'], ['strip', '🍒 脱衣'], ['punish', '💣 惩罚']
  ];
  var DIY_DEFAULT = { weights: { drink: 1, strip: 0, spicy: 1, duo: 1, event: 1 }, cards: [] };
  function v3DIYNorm(d){
    var out = { weights: {}, cards: [] };
    var w = (d && d.weights) || {};
    var base = DIY_DEFAULT.weights;
    ['drink', 'strip', 'spicy', 'duo', 'event'].forEach(function(k){
      var v = (w[k] === undefined || w[k] === null) ? base[k] : w[k];
      out.weights[k] = Math.max(0, Math.min(3, Number(v) || 0));
    });
    var cards = (d && d.cards instanceof Array) ? d.cards : [];
    cards.forEach(function(c){
      if (!c || !c.text) return;
      out.cards.push({
        type: String(c.type || 'dare'),
        text: String(c.text).slice(0, 80),
        count: Math.max(1, Math.min(3, Number(c.count) || 1))
      });
    });
    out.cards = out.cards.slice(0, 12);
    return out;
  }
  var DIY_STORE_KEY = 'couple-flight-diy-presets-v1';
  function v3DIYSeed(){
    return [
      { id: 'builtin-daily', name: '日常', builtin: true, weights: { drink: 1, strip: 0, spicy: 1, duo: 1, event: 1 }, cards: [] },
      { id: 'builtin-tipsy', name: '微醺', builtin: true, weights: { drink: 3, strip: 0, spicy: 2, duo: 1, event: 1 }, cards: [{ type: 'drink', text: '和对方碰杯，喝一口', count: 1 }] },
      { id: 'builtin-party', name: '派对', builtin: true, weights: { drink: 3, strip: 2, spicy: 3, duo: 2, event: 2 }, cards: [{ type: 'drink', text: '和对方碰杯，喝一口', count: 2 }, { type: 'strip', text: '脱掉一件外衣', count: 1 }] },
      { id: 'builtin-soft', name: '温柔', builtin: true, weights: { drink: 0, strip: 0, spicy: 0, duo: 2, event: 1 }, cards: [{ type: 'touch', text: '闭眼让对方在你手心写三个字', count: 1 }] }
    ];
  }
  function v3DIYStoreNorm(st){
    var out = { activeId: '', presets: [] };
    var list = (st && st.presets instanceof Array) ? st.presets : [];
    list.forEach(function(p){
      if (!p || !p.name) return;
      var norm = v3DIYNorm(p);
      out.presets.push({ id: String(p.id || ('diy-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5))), name: String(p.name).slice(0, 16), builtin: !!p.builtin, weights: norm.weights, cards: norm.cards });
    });
    if (!out.presets.length) out.presets = v3DIYSeed();
    out.activeId = (st && st.activeId) || out.presets[0].id;
    if (!out.presets.some(function(p){ return p.id === out.activeId; })) out.activeId = out.presets[0].id;
    return out;
  }
  function v3DIYStoreLoad(){
    try {
      var raw = JSON.parse(localStorage.getItem(DIY_STORE_KEY) || 'null');
      if (raw && raw.presets instanceof Array) return v3DIYStoreNorm(raw);
    } catch (e) {}
    var presets = v3DIYSeed();
    var activeId = presets[0].id;
    try {
      var old = JSON.parse(localStorage.getItem(DIY_KEY) || 'null');
      if (old) {
        var norm = v3DIYNorm(old);
        presets.push({ id: 'diy-migrated', name: '我的预设', builtin: false, weights: norm.weights, cards: norm.cards });
        activeId = 'diy-migrated';
      }
    } catch (e) {}
    var st = { activeId: activeId, presets: presets };
    try { localStorage.setItem(DIY_STORE_KEY, JSON.stringify(st)); } catch (e) {}
    return st;
  }
  function v3DIYStoreSave(st){
    st = v3DIYStoreNorm(st);
    try { localStorage.setItem(DIY_STORE_KEY, JSON.stringify(st)); } catch (e) {}
    return st;
  }
  function v3DIYLoad(){
    var st = v3DIYStoreLoad();
    var p = null;
    st.presets.forEach(function(x){ if (x.id === st.activeId) p = x; });
    return v3DIYNorm(p || st.presets[0]);
  }
  function v3DIYSave(d){
    var norm = v3DIYNorm(d);
    try { localStorage.setItem(DIY_KEY, JSON.stringify(norm)); } catch (e) {}
    return norm;
  }
  function v3DIYExpand(cards){
    var out = [];
    (cards || []).forEach(function(c){
      for (var i = 0; i < (c.count || 1); i++) out.push({ type: c.type, text: c.text });
    });
    return out.slice(0, 10);
  }
  function v3DIYInfo(t){
    var i = Number(String(t).replace('diy', ''));
    return (window._flDIYActive && window._flDIYActive[i]) || { type: 'dare', text: '一个自定义任务' };
  }
  function v3DIYEachLane(cells, fn){
    if (!cells || !cells.length) return;
    if (cells[0] instanceof Array) cells.forEach(fn); else fn(cells);
  }
  function v3DIYApplyWeights(cells, weights){
    if (!cells || !cells.length) return;
    var w = (weights || (window._flDIY && window._flDIY.weights) || DIY_DEFAULT.weights);
    v3DIYEachLane(cells, function(lane){
      function ok(c){ return c && ['start', 'end', 'cross'].indexOf(c) < 0 && !/^custom|^diy/.test(c); }
      Object.keys(w).forEach(function(type){
        var weight = Number(w[type]) || 0;
        if (weight === 1) return;
        var idxs = [];
        for (var i = 0; i < lane.length; i++) {
          if (lane[i] === type) idxs.push(i);
        }
        if (weight === 0) {
          idxs.forEach(function(i){ lane[i] = i % 2 ? 'dare' : 'truth'; });
          return;
        }
        var target = Math.max(1, Math.floor(lane.length * (weight === 2 ? 0.18 : 0.30)));
        var pool = [];
        for (var j = 0; j < lane.length; j++) {
          if (ok(lane[j]) && lane[j] !== type) pool.push(j);
        }
        for (var k = pool.length - 1; k > 0; k--) {
          var r = Math.floor(Math.random() * (k + 1));
          var tmp = pool[k]; pool[k] = pool[r]; pool[r] = tmp;
        }
        pool.slice(0, target).forEach(function(i){ lane[i] = type; });
      });
    });
  }
  function v3DIYPlaceCards(cells, mode){
    var list = window._flDIYActive || [];
    if (!list.length || !cells) return;
    var lanes = (cells[0] instanceof Array) ? cells : [cells];
    var used = 0;
    list.forEach(function(card, ci){
      var lane = lanes[mode === 'A' ? (ci % lanes.length) : 0];
      if (!lane) return;
      var free = [];
      for (var i = 2; i < lane.length - 1; i++) {
        if (['start', 'end', 'cross'].indexOf(lane[i]) < 0 && !/^custom|^diy/.test(lane[i])) free.push(i);
      }
      if (!free.length) return;
      var pos = free[Math.floor((used + 1) * free.length / (list.length + 1))] || free[free.length - 1];
      if (pos == null) return;
      lane[pos] = 'diy' + ci;
      used++;
    });
  }
  function v3DIYSummary(d){
    d = v3DIYNorm(d || (window._flDIY || v3DIYLoad()));
    var n = 0;
    d.cards.forEach(function(c){ n += c.count || 1; });
    var extra = [];
    if (d.weights.drink !== 1) extra.push('喝酒' + ['关', '标准', '多', '很多'][d.weights.drink]);
    if (d.weights.strip > 0) extra.push('脱衣' + ['', '标准', '多', '很多'][d.weights.strip]);
    if (d.weights.spicy > 1) extra.push('刺激多');
    return (n ? n + ' 张自定义卡' : '未加自定义卡') + (extra.length ? ' · ' + extra.join(' · ') : '');
  }
  function v3DIYSheet(){
    var old = document.getElementById('v3DIYMask');
    if (old) old.remove();
    var data = v3DIYNorm(window._flDIY || v3DIYLoad());
    var mask = document.createElement('div');
    mask.id = 'v3DIYMask';
    mask.className = 'v3-sheet-mask on';
    mask.setAttribute('data-test', 'flight-diy-sheet');
    mask.innerHTML = '<div class="v3-sheet v3-diy-sheet">'
      + '<div class="v3-sheet-grip"></div>'
      + '<div class="v3-sheet-title">DIY 预设</div>'
      + '<p class="v3-wish-sub">调棋盘比例、加自己的卡；应用后下一局自动生效。</p>'
      + '<div class="v3-diy-block"><div class="v3-voice-sub">棋盘比例</div><div id="v3DiyWeights"></div></div>'
      + '<div class="v3-diy-block"><div class="v3-voice-sub">自定义卡</div><div id="v3DiyCards"></div>'
      + '<button type="button" class="v3-diy-add" data-diy-add>＋ 加一条</button></div>'
      + '<div class="v3-pause-actions" style="margin-top:14px">'
      + '<button type="button" class="v3-btn primary" data-diy-save>应用这套预设</button>'
      + '<button type="button" class="v3-btn ghost" data-diy-close>先不改</button>'
      + '</div></div>';
    document.body.appendChild(mask);
    var weightBox = mask.querySelector('#v3DiyWeights');
    var labels = { drink: '🍷 喝酒', strip: '🍒 脱衣', spicy: '💣 刺激', duo: '💑 双人', event: '🎁 事件' };
    ['drink', 'strip', 'spicy', 'duo', 'event'].forEach(function(key){
      var row = document.createElement('div');
      row.className = 'v3-diy-weight';
      row.innerHTML = '<span>' + labels[key] + '</span>';
      var opts = document.createElement('div');
      opts.className = 'v3-diy-opts';
      ['关', '标准', '多', '很多'].forEach(function(txt, val){
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = txt;
        b.className = (data.weights[key] === val ? 'on' : '');
        b.addEventListener('click', function(){
          data.weights[key] = val;
          Array.prototype.forEach.call(opts.children, function(x){ x.classList.remove('on'); });
          b.classList.add('on');
        });
        opts.appendChild(b);
      });
      row.appendChild(opts);
      weightBox.appendChild(row);
    });
    var cardsBox = mask.querySelector('#v3DiyCards');
    function addCardRow(c){
      var row = document.createElement('div');
      row.className = 'v3-diy-card';
      var sel = document.createElement('select');
      DIY_TYPES.forEach(function(t){
        var o = document.createElement('option'); o.value = t[0]; o.textContent = t[1]; sel.appendChild(o);
      });
      sel.value = c.type || 'dare';
      var inp = document.createElement('input');
      inp.maxLength = 80; inp.placeholder = '写一条游戏里没有的任务'; inp.value = c.text || '';
      var cnt = document.createElement('select');
      [1, 2, 3].forEach(function(n){ var o = document.createElement('option'); o.value = n; o.textContent = '×' + n; cnt.appendChild(o); });
      cnt.value = c.count || 1;
      var del = document.createElement('button');
      del.type = 'button'; del.className = 'v3-diy-del'; del.textContent = '✕';
      del.addEventListener('click', function(){ row.remove(); });
      row.appendChild(sel); row.appendChild(inp); row.appendChild(cnt); row.appendChild(del);
      cardsBox.appendChild(row);
    }
    data.cards.forEach(addCardRow);
    mask.querySelector('[data-diy-add]').addEventListener('click', function(){ addCardRow({ type: 'dare', text: '', count: 1 }); });
    mask.querySelector('[data-diy-close]').addEventListener('click', function(){ mask.remove(); });
    mask.addEventListener('click', function(e){ if (e.target === mask) mask.remove(); });
    mask.querySelector('[data-diy-save]').addEventListener('click', function(){
      var cards = [];
      Array.prototype.forEach.call(cardsBox.querySelectorAll('.v3-diy-card'), function(row){
        var text = row.querySelector('input').value.trim();
        if (!text) return;
        cards.push({
          type: row.querySelector('select').value,
          text: text.slice(0, 80),
          count: Number(row.querySelectorAll('select')[1].value) || 1
        });
      });
      data.cards = cards;
      var saved = v3DIYSave(data);
      window._flDIY = saved;
      if (window._flSetup) window._flSetup.diy = saved;
      mask.remove();
      try { toast('DIY 预设已保存，下一局生效'); } catch (e) {}
      try { renderFlightSetup(document.getElementById('gContent')); } catch (e) {}
    });
  }
  window.v3DIYNorm = v3DIYNorm;
  window.v3DIYLoad = v3DIYLoad;
  window.v3DIYSave = v3DIYSave;
  window.v3DIYExpand = v3DIYExpand;
  window.v3DIYInfo = v3DIYInfo;
  window.v3DIYApplyWeights = v3DIYApplyWeights;
  window.v3DIYPlaceCards = v3DIYPlaceCards;
  function v3DIYSheet2(selectedId){
    var st = v3DIYStoreLoad();
    var selected = null;
    st.presets.forEach(function(p){ if (p.id === (selectedId || st.activeId)) selected = p; });
    if (!selected) selected = st.presets[0];
    var data = v3DIYNorm(selected);
    var old = document.getElementById('v3DIYMask');
    if (old) old.remove();
    var mask = document.createElement('div');
    mask.id = 'v3DIYMask';
    mask.className = 'v3-sheet-mask on';
    mask.setAttribute('data-test', 'flight-diy-sheet');
    mask.innerHTML = '<div class="v3-sheet v3-diy-sheet">'
      + '<div class="v3-sheet-grip"></div>'
      + '<div class="v3-sheet-title">DIY 预设</div>'
      + '<p class="v3-wish-sub">选一套预设，或改比例/加卡后另存。应用后下一局自动生效。</p>'
      + '<div class="v3-diy-presets" id="v3DiyPresets"></div>'
      + '<div class="v3-diy-name-row"><input id="v3DiyName" maxlength="16" placeholder="预设名称"><button type="button" class="v3-diy-saveas" data-diy-saveas>另存为</button></div>'
      + '<div class="v3-diy-block"><div class="v3-voice-sub">棋盘比例</div><div id="v3DiyWeights"></div></div>'
      + '<div class="v3-diy-block"><div class="v3-voice-sub">自定义卡</div><div id="v3DiyCards"></div>'
      + '<button type="button" class="v3-diy-add" data-diy-add>＋ 加一条</button></div>'
      + '<div class="v3-pause-actions" style="margin-top:14px">'
      + '<button type="button" class="v3-btn primary" data-diy-save>应用这套预设</button>'
      + '<button type="button" class="v3-btn ghost" data-diy-del style="display:none">删除这套预设</button>'
      + '<button type="button" class="v3-btn ghost" data-diy-close>先不改</button>'
      + '</div></div>';
    document.body.appendChild(mask);
    var chipBox = mask.querySelector('#v3DiyPresets');
    st.presets.forEach(function(p){
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'v3-diy-chip' + (p.id === selected.id ? ' on' : '') + (p.id === st.activeId ? ' active' : '');
      chip.textContent = p.name + (p.id === st.activeId ? ' · 使用中' : '');
      chip.addEventListener('click', function(){ mask.remove(); v3DIYSheet2(p.id); });
      chipBox.appendChild(chip);
    });
    var nameInput = mask.querySelector('#v3DiyName');
    nameInput.value = selected.name || '我的预设';
    var weightBox = mask.querySelector('#v3DiyWeights');
    var labels = { drink: '🍷 喝酒', strip: '🍒 脱衣', spicy: '💣 刺激', duo: '💑 双人', event: '🎁 事件' };
    ['drink', 'strip', 'spicy', 'duo', 'event'].forEach(function(key){
      var row = document.createElement('div');
      row.className = 'v3-diy-weight';
      row.innerHTML = '<span>' + labels[key] + '</span>';
      var opts = document.createElement('div');
      opts.className = 'v3-diy-opts';
      ['关', '标准', '多', '很多'].forEach(function(txt, val){
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = txt;
        b.className = (data.weights[key] === val ? 'on' : '');
        b.addEventListener('click', function(){
          data.weights[key] = val;
          Array.prototype.forEach.call(opts.children, function(x){ x.classList.remove('on'); });
          b.classList.add('on');
        });
        opts.appendChild(b);
      });
      row.appendChild(opts);
      weightBox.appendChild(row);
    });
    var cardsBox = mask.querySelector('#v3DiyCards');
    function addCardRow(c){
      var row = document.createElement('div');
      row.className = 'v3-diy-card';
      var sel = document.createElement('select');
      DIY_TYPES.forEach(function(t){
        var o = document.createElement('option'); o.value = t[0]; o.textContent = t[1]; sel.appendChild(o);
      });
      sel.value = c.type || 'dare';
      var inp = document.createElement('input');
      inp.maxLength = 80; inp.placeholder = '写一条游戏里没有的任务'; inp.value = c.text || '';
      var cnt = document.createElement('select');
      [1, 2, 3].forEach(function(n){ var o = document.createElement('option'); o.value = n; o.textContent = '×' + n; cnt.appendChild(o); });
      cnt.value = c.count || 1;
      var del = document.createElement('button');
      del.type = 'button'; del.className = 'v3-diy-del'; del.textContent = '✕';
      del.addEventListener('click', function(){ row.remove(); });
      row.appendChild(sel); row.appendChild(inp); row.appendChild(cnt); row.appendChild(del);
      cardsBox.appendChild(row);
    }
    data.cards.forEach(addCardRow);
    mask.querySelector('[data-diy-add]').addEventListener('click', function(){ addCardRow({ type: 'dare', text: '', count: 1 }); });
    mask.querySelector('[data-diy-close]').addEventListener('click', function(){ mask.remove(); });
    mask.addEventListener('click', function(e){ if (e.target === mask) mask.remove(); });
    function readCards(){
      var cards = [];
      Array.prototype.forEach.call(cardsBox.querySelectorAll('.v3-diy-card'), function(row){
        var text = row.querySelector('input').value.trim();
        if (!text) return;
        cards.push({
          type: row.querySelector('select').value,
          text: text.slice(0, 80),
          count: Number(row.querySelectorAll('select')[1].value) || 1
        });
      });
      return cards;
    }
    function persist(preset){
      st.presets = st.presets.map(function(p){ return p.id === preset.id ? preset : p; });
      if (!st.presets.some(function(p){ return p.id === preset.id; })) st.presets.push(preset);
      st.activeId = preset.id;
      st = v3DIYStoreSave(st);
      window._flDIY = v3DIYNorm(preset);
      if (window._flSetup) window._flSetup.diy = window._flDIY;
      mask.remove();
      try { toast('已应用预设：' + preset.name); } catch (e) {}
      try { renderFlightSetup(document.getElementById('gContent')); } catch (e) {}
    }
    mask.querySelector('[data-diy-save]').addEventListener('click', function(){
      var cards = readCards();
      var name = (nameInput.value || '').trim().slice(0, 16) || selected.name;
      var changed = JSON.stringify(cards) !== JSON.stringify(selected.cards)
        || JSON.stringify(data.weights) !== JSON.stringify(selected.weights);
      if (!changed) { persist(selected); return; }
      if (selected.builtin) {
        var copy = { id: 'diy-' + Date.now(), name: name + ' 副本', builtin: false, weights: data.weights, cards: cards };
        st.presets.push(copy);
        persist(copy);
        return;
      }
      var updated = { id: selected.id, name: name, builtin: false, weights: data.weights, cards: cards };
      persist(updated);
    });
    mask.querySelector('[data-diy-saveas]').addEventListener('click', function(){
      var name = (nameInput.value || '').trim().slice(0, 16) || ('我的预设 ' + (st.presets.length + 1));
      var preset = { id: 'diy-' + Date.now(), name: name, builtin: false, weights: data.weights, cards: readCards() };
      st.presets.push(preset);
      persist(preset);
    });
    var delBtn = mask.querySelector('[data-diy-del]');
    if (!selected.builtin && st.presets.length > 1) {
      delBtn.style.display = '';
      delBtn.addEventListener('click', function(){
        st.presets = st.presets.filter(function(p){ return p.id !== selected.id; });
        st.activeId = st.presets[0].id;
        st = v3DIYStoreSave(st);
        mask.remove();
        try { toast('已删除预设'); } catch (e) {}
        v3DIYSheet2(st.presets[0].id);
      });
    }
  }
  window.v3DIYSheet = v3DIYSheet2;
  function v3CustomSetupSection(){
    var s = window._flSetup || (window._flSetup = {});
    var sec = document.createElement('section');
    sec.className = 'v3-set-group collapsed';
    sec.setAttribute('data-group', 'custom');
    var head = document.createElement('button');
    head.type = 'button';
    head.className = 'v3-set-head';
    head.setAttribute('aria-expanded', 'false');
    head.innerHTML = '<span class="v3-set-name">自定义</span><span class="v3-set-sub">称呼 · 互写一格</span><i class="v3-set-arrow">⌄</i>';
    var body = document.createElement('div');
    body.className = 'v3-set-body';
    body.innerHTML = '<p>称呼</p>'
      + '<div class="v3-custom-row"><input data-cn="m" maxlength="6" placeholder="男方称呼"><input data-cn="f" maxlength="6" placeholder="女方称呼"></div>'
      + '<p>互写一格（可选，会插入棋盘）</p>'
      + '<textarea data-cc="0" maxlength="60" placeholder="你写给 TA 的一格任务"></textarea>'
      + '<textarea data-cc="1" maxlength="60" placeholder="TA 写给你的一格任务"></textarea>'
      + '<button type="button" class="v3-diy-open" data-diy-open>✨ DIY 预设 · 棋盘比例 / 自定义卡</button>'
      + '<div class="v3-diy-summary" data-diy-summary></div>';
    var names = s.names || {};
    var m = body.querySelector('[data-cn="m"]');
    var f = body.querySelector('[data-cn="f"]');
    if (m) m.value = names.m || '';
    if (f) f.value = names.f || '';
    var custom = s.custom || ['', ''];
    var t0 = body.querySelector('[data-cc="0"]');
    var t1 = body.querySelector('[data-cc="1"]');
    if (t0) t0.value = custom[0] || '';
    if (t1) t1.value = custom[1] || '';
    function sync(){
      s.names = { m: m ? m.value.trim().slice(0, 6) : '', f: f ? f.value.trim().slice(0, 6) : '' };
      s.custom = [t0 ? t0.value.trim().slice(0, 60) : '', t1 ? t1.value.trim().slice(0, 60) : ''];
    }
    [m, f, t0, t1].forEach(function(el){ if (el) el.addEventListener('input', sync); });
    var diyBtn = body.querySelector('[data-diy-open]');
    if (diyBtn) diyBtn.addEventListener('click', function(){ window.v3DIYSheet(); });
    var diySum = body.querySelector('[data-diy-summary]');
    if (diySum) {
      var st0 = v3DIYStoreLoad();
      var an0 = '';
      st0.presets.forEach(function(p){ if (p.id === st0.activeId) an0 = p.name; });
      diySum.textContent = '当前：' + (an0 ? an0 + ' · ' : '') + v3DIYSummary(s.diy || v3DIYLoad());
    }
    head.addEventListener('click', function(){
      var open = sec.classList.toggle('collapsed') === false;
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    sec.appendChild(head);
    sec.appendChild(body);
    return sec;
  }
  function v3FlightSetupDecorate(){
    var content = document.getElementById('gContent');
    if (!content) return;
    try { v3FlightBarSync(); } catch (e) {}
    var wrap = content.querySelector('.bomb-wrap');
    var h2 = wrap ? wrap.querySelector('h2') : null;
    var isFlight = !!(wrap && h2 && String(h2.textContent || '').indexOf('飞行棋') >= 0);
    document.body.classList.toggle('v3-flight-setup', isFlight);
    if (isFlight) v3AddResumeCard(wrap, h2);
    if (!isFlight || wrap.getAttribute('data-v3-set') === '1') return;
    wrap.setAttribute('data-v3-set', '1');
    var nodes = Array.prototype.slice.call(wrap.children).filter(function(n){ return n !== h2 && !(n.classList && n.classList.contains('v3-resume-flight')); });
    var buckets = { basic: [], rhythm: [], boundary: [] };
    var footer = [];
    var current = null;
    nodes.forEach(function(el){
      var t = String(el.textContent || '').trim();
      if (el.classList && el.classList.contains('wheel-btns')) { footer.push(el); return; }
      if (/酒量额度/.test(t)) { footer.push(el); return; }
      if (el.tagName === 'P') {
        if (/^①|^②|^③/.test(t)) current = 'basic';
        else if (/^④|^⑤|^⑦|^⑧/.test(t)) current = 'rhythm';
        else if (/^⑥/.test(t)) current = 'boundary';
      }
      if (current) buckets[current].push(el); else footer.push(el);
    });
    var meta = {
      basic: ['基础', '人数 · 比例 · 玩法'],
      rhythm: ['节奏与强度', '难度 · 快局 · 沙漏 · 圈数'],
      boundary: ['边界', '脱衣模式 · 酒量额度']
    };
    var state = window.__v3SetState || (window.__v3SetState = { basic: true, rhythm: false, boundary: false });
    var frag = document.createDocumentFragment();
    Object.keys(buckets).forEach(function(key){
      if (!buckets[key].length) return;
      var sec = document.createElement('section');
      sec.className = 'v3-set-group' + (state[key] ? '' : ' collapsed');
      sec.setAttribute('data-group', key);
      var head = document.createElement('button');
      head.type = 'button';
      head.className = 'v3-set-head';
      head.setAttribute('aria-expanded', state[key] ? 'true' : 'false');
      head.innerHTML = '<span class="v3-set-name">' + meta[key][0] + '</span>'
        + '<span class="v3-set-sub">' + meta[key][1] + '</span>'
        + '<i class="v3-set-arrow" aria-hidden="true">⌄</i>';
      var body = document.createElement('div');
      body.className = 'v3-set-body';
      buckets[key].forEach(function(n){ body.appendChild(n); });
      head.addEventListener('click', function(){
        state[key] = !state[key];
        sec.classList.toggle('collapsed', !state[key]);
        head.setAttribute('aria-expanded', state[key] ? 'true' : 'false');
      });
      sec.appendChild(head);
      sec.appendChild(body);
      frag.appendChild(sec);
    });
    try { frag.appendChild(v3CustomSetupSection()); } catch (e) {}
    if (footer.length) {
      var foot = document.createElement('div');
      foot.className = 'v3-set-footer';
      footer.forEach(function(n){ foot.appendChild(n); });
      frag.appendChild(foot);
    }
    h2.parentNode.insertBefore(frag, h2.nextSibling);
    var start = wrap.querySelector('.wheel-btns .wheel-btn.spin');
    if (start) start.classList.add('v3-start-btn');
  }
  function v3FlightSetupInit(){
    var content = document.getElementById('gContent');
    if (!content || content._v3Obs) return;
    content._v3Obs = true;
    if (window.MutationObserver) {
      new MutationObserver(function(){ setTimeout(v3FlightSetupDecorate, 0); })
        .observe(content, { childList: true });
    }
    v3FlightSetupDecorate();
  }
  function v3WheelInit(kind, items, colors){
    var map = kind === 'truth'
      ? { wheel: 'truthCanvas', disc: 'truthDisc', labels: 'truthLabels', angle: '_truthAngle' }
      : { wheel: 'dareCanvas', disc: 'dareDisc', labels: 'dareLabels', angle: '_dareAngle' };
    var wheel = document.getElementById(map.wheel);
    var disc = document.getElementById(map.disc);
    var labels = document.getElementById(map.labels);
    if (!wheel || !disc || !labels) return;
    var wrap = wheel.parentNode;
    if (wrap && wrap.classList) wrap.classList.add('v3-wheel-wrap');
    var n = items.length || 1;
    var seg = 360 / n;
    var stops = [];
    for (var i = 0; i < n; i++) {
      var c = colors[i % colors.length];
      stops.push(c + ' ' + (i * 100 / n).toFixed(4) + '% ' + ((i + 1) * 100 / n).toFixed(4) + '%');
    }
    disc.style.background = 'conic-gradient(from -90deg,' + stops.join(',') + ')';
    labels.innerHTML = '';
    items.forEach(function(txt, idx){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'v3-wheel-label';
      b.style.setProperty('--a', ((idx + 0.5) * seg) + 'deg');
      b.setAttribute('data-i', idx);
      b.setAttribute('aria-label', '选择：' + txt);
      b.title = txt;
      var span = document.createElement('span');
      span.textContent = txt.length > 7 ? txt.slice(0, 6) + '…' : txt;
      b.appendChild(span);
      b.addEventListener('click', function(e){ e.stopPropagation(); v3WheelPick(kind, idx); });
      labels.appendChild(b);
    });
    var ang = window[map.angle] || 0;
    wheel.style.transform = 'rotate(' + ang + 'deg)';
    wheel.style.setProperty('--rot', (ang % 360) + 'deg');
  }
  function v3WheelPick(kind, idx){
    if (kind === 'truth') {
      if (window._truthSpinning) return;
      window.__v3Pick = { canvasId: 'truthCanvas', idx: idx };
      try { spinTruthWheel(); } catch (e) { window.__v3Pick = null; }
    } else {
      if (window._dareSpinning) return;
      window.__v3Pick = { canvasId: 'dareCanvas', idx: idx };
      try { spinDareWheel(); } catch (e) { window.__v3Pick = null; }
    }
  }
  window.v3WheelInit = v3WheelInit;
  window.v3WheelPick = v3WheelPick;

  /* ---------- 飞行棋：保存/继续、暂停/收起、心愿券 ---------- */
  var FL_SAVE = 'couple-flight-save-v1';
  function v3Pad2(n){ return n < 10 ? ('0' + n) : String(n); }
  function v3ClampDiff(n){ return Math.max(1, Math.min(4, Number(n) || 1)); }
  function v3StageDist(len, level){
    var old = (typeof SET !== 'undefined' ? SET.diff : 3);
    try { if (typeof SET !== 'undefined') SET.diff = v3ClampDiff(level); } catch (e) {}
    var arr = flDist(len);
    try { if (typeof SET !== 'undefined') SET.diff = old; } catch (e) {}
    return arr;
  }
  function v3StagedLane(len, base){
    var a = Math.max(1, Math.floor(len / 3));
    var b = Math.max(a + 1, Math.floor(len * 2 / 3));
    return v3StageDist(a, base)
      .concat(v3StageDist(Math.max(1, b - a), base + 1))
      .concat(v3StageDist(Math.max(1, len - b), base + 2));
  }
  function v3PlaceCustomCells(cells, mode){
    var tasks = window._flCustom || [];
    if (!tasks.length) return;
    if (mode === 'A') {
      if (cells[0] && tasks[0]) cells[0][Math.max(2, Math.floor(cells[0].length * 0.55))] = 'custom0';
      if (cells[1] && tasks[1]) cells[1][Math.max(2, Math.floor(cells[1].length * 0.72))] = 'custom1';
      return;
    }
    if (tasks[0]) cells[Math.max(2, Math.floor(cells.length * 0.38))] = 'custom0';
    if (tasks[1]) cells[Math.max(3, Math.floor(cells.length * 0.7))] = 'custom1';
  }
  function v3RestageRing(level){
    if (!(window._flMode === 'B' || window._flMode === 'D')) return;
    if (!window._flCells || !window._flCells.length) return;
    var len = window._flCells.length;
    var arr = v3StageDist(len, level);
    arr[0] = 'start';
    if (window._flMode === 'D') {
      arr[Math.floor(len / 4)] = 'cross';
      arr[Math.floor(len * 3 / 4)] = 'cross';
    }
    try { v3DIYApplyWeights([arr], window._flDIY ? window._flDIY.weights : null); v3DIYPlaceCards(arr, window._flMode); } catch (e) {}
    v3PlaceCustomCells(arr, window._flMode);
    window._flCells = arr;
  }
  function v3CatchUpBonus(p){
    if (!p || !window._flP || !p.wind) return 0;
    function prog(x){
      if (window._flMode === 'A') return (window._flTPos && window._flTPos[x.team]) || 0;
      if (window._flMode === 'B' || window._flMode === 'D') return (x.lap || 0) * (window._flCells ? window._flCells.length : 1) + (x.pos || 0);
      return x.pos || 0;
    }
    var others = window._flP.filter(function(x){ return x.id !== p.id && !x.done; });
    if (!others.length) return 0;
    var best = Math.max.apply(null, others.map(prog));
    if (prog(p) >= best) return 0;
    p.wind = 0;
    try { toast('🌬 风向：' + p.name + ' 落后，本回合 +1 点'); } catch (e) {}
    return 1;
  }
  window.v3StagedLane = v3StagedLane;
  window.v3PlaceCustomCells = v3PlaceCustomCells;
  window.v3RestageRing = v3RestageRing;
  window.v3CatchUpBonus = v3CatchUpBonus;
  function v3FlightSnapshot(){
    if (!window._flP || !window._flCells || window._flWin) return null;
    return {
      v: 1, ts: Date.now(),
      mode: window._flMode, modeName: window._flModeName, laps: window._flLaps,
      turn: window._flTurn, order: window._flOrder,
      P: window._flP, cells: window._flCells, sideM: window._flSideM, sideF: window._flSideF,
      tpos: window._flTPos, six: window._flSix, rolled: window._flRolled,
      clothes: window._flClothes, upUses: window._flUpUses,
      godId: window._flGod ? window._flGod.id : null, godUses: window._flGodUses,
      energyUp: window._flEnergyUp, hourglass: window._flHourglass,
      setup: window._flSetup, diff: (typeof SET !== 'undefined' ? SET.diff : null),
      diy: window._flDIY, diyActive: window._flDIYActive
    };
  }
  function v3SaveFlight(){
    var s = v3FlightSnapshot();
    if (!s) return;
    try { localStorage.setItem(FL_SAVE, JSON.stringify(s)); } catch (e) {}
  }
  function v3ClearFlight(){
    try { localStorage.removeItem(FL_SAVE); } catch (e) {}
  }
  function v3LoadFlight(){
    try {
      var s = JSON.parse(localStorage.getItem(FL_SAVE) || 'null');
      if (!s || s.v !== 1 || !(s.P instanceof Array) || !(s.cells instanceof Array)) return null;
      return s;
    } catch (e) { return null; }
  }
  function v3SaveFlightIfActive(){
    if (window.curGame === 'flight' && window._flP && !window._flWin) v3SaveFlight();
  }
  function v3ResumeFlight(){
    var s = v3LoadFlight();
    if (!s) { try { toast('没有可继续的棋局'); } catch (e) {} return false; }
    window._flSess = (window._flSess || 0) + 1;
    window._flP = s.P;
    window._flMode = s.mode;
    window._flModeName = s.modeName;
    window._flLaps = s.laps;
    window._flTurn = s.turn;
    window._flOrder = s.order;
    window._flCells = s.cells;
    window._flSideM = s.sideM;
    window._flSideF = s.sideF;
    window._flTPos = s.tpos || [0, 0];
    window._flSix = s.six || 0;
    window._flRolled = !!s.rolled;
    window._flClothes = s.clothes || {};
    window._flUpUses = s.upUses || 0;
    window._flGod = (s.godId != null && s.P[s.godId]) ? s.P[s.godId] : null;
    window._flGodUses = s.godUses || 0;
    window._flEnergyUp = s.energyUp || 0;
    window._flHourglass = !!s.hourglass;
    window._flSetup = s.setup || window._flSetup;
    window._flDIY = s.diy || v3DIYLoad();
    window._flDIYActive = s.diyActive || v3DIYExpand(window._flDIY.cards);
    if (s.diff && typeof SET !== 'undefined') SET.diff = s.diff;
    window._flWin = false;
    window._flSixNext = false;
    window._flDuelState = null;
    window._flDuelCell = false;
    window._flEventChoice = null;
    window._flWheel = null;
    window._flWheelSegs = null;
    ['flWheelOverlay', 'flChoiceOverlay'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.classList.remove('show');
    });
    try { flRender(); } catch (e) {}
    try { v12FlStartTurnTimer(); } catch (e) {}
    try { toast('继续上次棋局 · 第 ' + (window._flTurn + 1) + ' 回合'); } catch (e) {}
    return true;
  }
  function v3EnsurePause(){
    var mask = document.getElementById('v3PauseMask');
    if (mask) return mask;
    mask = document.createElement('div');
    mask.id = 'v3PauseMask';
    mask.className = 'v3-sheet-mask';
    mask.setAttribute('data-test', 'flight-pause');
    mask.innerHTML = '<div class="v3-sheet v3-pause-sheet">'
      + '<div class="v3-sheet-grip"></div>'
      + '<div class="v3-sheet-title">棋局暂停</div>'
      + '<p class="v3-pause-text" id="v3PauseText"></p>'
      + '<div class="v3-pause-actions">'
      + '<button type="button" class="v3-btn primary" data-resume>继续棋局</button>'
      + '<button type="button" class="v3-btn ghost" data-collapse>保存并收起</button>'
      + '</div>'
      + '</div>';
    document.body.appendChild(mask);
    mask.querySelector('[data-resume]').addEventListener('click', function(){
      mask.classList.remove('on');
      try { v12FlStartTurnTimer(); } catch (e) {}
    });
    mask.querySelector('[data-collapse]').addEventListener('click', function(){
      mask.classList.remove('on');
      try { goHome(); } catch (e) {}
    });
    mask.addEventListener('click', function(e){
      if (e.target === mask) {
        mask.classList.remove('on');
        try { v12FlStartTurnTimer(); } catch (e) {}
      }
    });
    return mask;
  }
  function v3PauseFlight(){
    if (!window._flP) return;
    if (window._flWin) { try { toast('本局已经结束'); } catch (e) {} return; }
    try { v12FlStopTurnTimer(); } catch (e) {}
    v3SaveFlight();
    var mask = v3EnsurePause();
    var p = window._flP[window._flOrder[window._flTurn]];
    var txt = document.getElementById('v3PauseText');
    if (txt) {
      txt.textContent = '第 ' + (window._flTurn + 1) + ' 回合 · ' + (p ? ('轮到 ' + p.name + ' 摇骰子') : '棋局进行中')
        + '。进度已经保存，可以继续，也可以先收起。';
    }
    mask.classList.add('on');
  }
  function v3Confirm(title, text, okLabel, cb){
    var mask = document.createElement('div');
    mask.className = 'v3-sheet-mask on';
    mask.setAttribute('data-test', 'flight-confirm');
    mask.innerHTML = '<div class="v3-sheet v3-confirm-sheet">'
      + '<div class="v3-sheet-grip"></div>'
      + '<div class="v3-sheet-title"></div>'
      + '<p class="v3-pause-text"></p>'
      + '<div class="v3-pause-actions">'
      + '<button type="button" class="v3-btn primary" data-ok></button>'
      + '<button type="button" class="v3-btn ghost" data-cancel>先不了</button>'
      + '</div></div>';
    document.body.appendChild(mask);
    mask.querySelector('.v3-sheet-title').textContent = title;
    mask.querySelector('.v3-pause-text').textContent = text;
    mask.querySelector('[data-ok]').textContent = okLabel;
    function close(){ mask.remove(); }
    mask.querySelector('[data-cancel]').addEventListener('click', close);
    mask.querySelector('[data-ok]').addEventListener('click', function(){ close(); cb(); });
    mask.addEventListener('click', function(e){ if (e.target === mask) close(); });
  }
  function v3ConfirmReset(){
    v3Confirm('重设本局？', '当前棋局会先保存，新的一局开始后会覆盖这份存档。', '重设', function(){
      v3ClearFlight();
      try { renderFlightSetup(document.getElementById('gContent')); } catch (e) {}
    });
  }
  var VOICE_KEY = 'couple-flight-voice-v1';
  var V3_VOICE_PRESETS = [
    { id: 'gentle', icon: '🌸', name: '温柔', rate: 0.92, pitch: 1.06 },
    { id: 'deep', icon: '🌙', name: '低沉', rate: 0.9, pitch: 0.82 },
    { id: 'bright', icon: '✨', name: '俏皮', rate: 1.06, pitch: 1.18 },
    { id: 'news', icon: '📻', name: '播报', rate: 1.0, pitch: 1.0 }
  ];
  function v3Voices(){
    try {
      var all = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      var zh = all.filter(function(v){ return /^zh/i.test(v.lang || ''); });
      return { list: zh.length ? zh : all, zh: zh.length > 0 };
    } catch (e) { return { list: [], zh: false }; }
  }
  function v3VoiceCfg(){
    try {
      var c = JSON.parse(localStorage.getItem(VOICE_KEY) || 'null');
      if (c && typeof c === 'object') return { preset: c.preset || 'gentle', voiceURI: c.voiceURI || '', voiceName: c.voiceName || '' };
    } catch (e) {}
    return { preset: 'gentle', voiceURI: '', voiceName: '' };
  }
  function v3VoiceSave(cfg){
    try { localStorage.setItem(VOICE_KEY, JSON.stringify(cfg)); } catch (e) {}
  }
  function v3VoicePreset(id){
    for (var i = 0; i < V3_VOICE_PRESETS.length; i++) if (V3_VOICE_PRESETS[i].id === id) return V3_VOICE_PRESETS[i];
    return V3_VOICE_PRESETS[0];
  }
  function v3Speak(text){
    if (!text) return;
    try {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { toast('这个浏览器不支持朗读'); return; }
      var cfg = v3VoiceCfg(), preset = v3VoicePreset(cfg.preset);
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text).slice(0, 220));
      u.lang = 'zh-CN';
      u.rate = preset.rate;
      u.pitch = preset.pitch;
      var vs = v3Voices().list;
      for (var i = 0; i < vs.length; i++) {
        if ((cfg.voiceURI && vs[i].voiceURI === cfg.voiceURI) || (cfg.voiceName && vs[i].name === cfg.voiceName)) { u.voice = vs[i]; break; }
      }
      window.speechSynthesis.speak(u);
    } catch (e) { try { toast('朗读失败'); } catch (e2) {} }
  }
  function v3VoiceSheet(){
    var old = document.getElementById('v3VoiceMask');
    if (old) old.remove();
    var mask = document.createElement('div');
    mask.id = 'v3VoiceMask';
    mask.className = 'v3-sheet-mask on';
    mask.setAttribute('data-test', 'flight-voice-sheet');
    mask.innerHTML = '<div class="v3-sheet v3-voice-sheet">'
      + '<div class="v3-sheet-grip"></div>'
      + '<div class="v3-sheet-title">朗读音色</div>'
      + '<p class="v3-wish-sub">音色来自系统 TTS；预设会调整语速和音高。选了会自动记住。</p>'
      + '<div class="v3-voice-presets" id="v3VoicePresets"></div>'
      + '<div class="v3-voice-sub">系统音色</div>'
      + '<div class="v3-voice-list" id="v3VoiceList"></div>'
      + '<div class="v3-pause-actions" style="margin-top:14px">'
      + '<button type="button" class="v3-btn primary" data-voice-test>试听</button>'
      + '<button type="button" class="v3-btn ghost" data-voice-close>完成</button>'
      + '</div></div>';
    document.body.appendChild(mask);
    var cfg = v3VoiceCfg();
    var presetBox = mask.querySelector('#v3VoicePresets');
    V3_VOICE_PRESETS.forEach(function(p){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'v3-voice-preset' + (cfg.preset === p.id ? ' on' : '');
      b.setAttribute('data-preset', p.id);
      b.innerHTML = '<i>' + p.icon + '</i><b>' + p.name + '</b><span>' + (p.rate === 1 ? '标准语速' : (p.rate < 1 ? '慢一点' : '快一点')) + '</span>';
      b.addEventListener('click', function(){
        cfg.preset = p.id;
        v3VoiceSave(cfg);
        Array.prototype.forEach.call(presetBox.querySelectorAll('.v3-voice-preset'), function(x){ x.classList.toggle('on', x === b); });
        v3Speak('今晚，用这个声音读给你听。');
      });
      presetBox.appendChild(b);
    });
    function renderVoices(){
      var box = mask.querySelector('#v3VoiceList');
      if (!box) return;
      var vs = v3Voices();
      var list = vs.list || [];
      box.innerHTML = '';
      if (!list.length) {
        box.innerHTML = '<div class="v3-voice-empty">系统暂时没有可用音色，先用上面的预设语速/音高。</div>';
        return;
      }
      var auto = document.createElement('button');
      auto.type = 'button';
      auto.className = 'v3-voice-row' + (!cfg.voiceURI && !cfg.voiceName ? ' on' : '');
      auto.innerHTML = '<b>自动</b><span>跟随系统默认</span>';
      auto.addEventListener('click', function(){
        cfg.voiceURI = ''; cfg.voiceName = ''; v3VoiceSave(cfg); renderVoices();
      });
      box.appendChild(auto);
      list.slice(0, 12).forEach(function(v){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'v3-voice-row' + ((cfg.voiceURI === v.voiceURI || (!cfg.voiceURI && cfg.voiceName === v.name)) ? ' on' : '');
        var nm = document.createElement('b'); nm.textContent = v.name || '未命名音色';
        var sp = document.createElement('span'); sp.textContent = (v.lang || '') + (v.localService ? ' · 本机' : ' · 在线');
        b.appendChild(nm); b.appendChild(sp);
        b.addEventListener('click', function(){
          cfg.voiceURI = v.voiceURI || ''; cfg.voiceName = v.name || '';
          v3VoiceSave(cfg); renderVoices(); v3Speak('这个声音，可以吗？');
        });
        box.appendChild(b);
      });
    }
    renderVoices();
    setTimeout(renderVoices, 250);
    mask.querySelector('[data-voice-test]').addEventListener('click', function(){
      v3Speak('今晚的任务是：把手机放下，看着对方的眼睛十秒。');
    });
    mask.querySelector('[data-voice-close]').addEventListener('click', function(){ mask.remove(); });
    mask.addEventListener('click', function(e){ if (e.target === mask) mask.remove(); });
  }
  function v3DiceRoll(v, cb){
    var ov = document.getElementById('flDiceOverlay');
    var wrap = document.getElementById('flDiceOverlayWrap');
    var lbl = document.getElementById('flDiceOverlayLabel');
    if (!ov || !wrap) { if (cb) cb(); return; }
    var sess = window._flSess || 0;
    var who = '';
    try {
      var st = window._flDuelState;
      if (st) who = st.r1 === null ? st.p1.name : st.p2.name;
      else { var p = window._flP[window._flOrder[window._flTurn]]; if (p) who = p.name; }
    } catch (e) {}
    var cube = null;
    try { cube = v12DicePrepare(wrap); } catch (e) {}
    ov.classList.add('show', 'v3-dice-live');
    if (lbl) {
      lbl.className = 'v3-dice-label rolling';
      lbl.innerHTML = '<span class="v3-dice-kicker">摇骰中</span>' + (who ? '<span class="v3-dice-who">· ' + who + '</span>' : '');
    }
    try { sndSpin(); vibrate(8); } catch (e) {}
    var done = false;
    function finish(){
      if (done) return;
      done = true;
      if (lbl) {
        lbl.className = 'v3-dice-label landed';
        lbl.innerHTML = '<span class="v3-dice-kicker">' + (who ? who + ' 摇出' : '摇出') + '</span><b class="v3-dice-num">' + v + '</b><span class="v3-dice-unit">点</span>';
      }
      try { sndDing(); vibrate([28, 18, 46]); } catch (e) {}
      try { v12Fx.ripple(innerWidth / 2, innerHeight * 0.55); } catch (e) {}
      var zoom = ov.querySelector('.fl-ov-zoom');
      if (zoom) {
        zoom.classList.add('landed');
        setTimeout(function(){ try { zoom.classList.remove('landed'); } catch (e) {} }, 620);
      }
      setTimeout(function(){
        ov.classList.remove('show', 'v3-dice-live');
        if (window._flSess === sess && cb) cb();
      }, 720);
    }
    try { v12DiceSpin(cube, v, { duration: 1150, onDone: finish }); }
    catch (e) { finish(); }
    setTimeout(function(){ if (!done) finish(); }, 2500);
  }
  window.v3DiceRoll = v3DiceRoll;
  function v3ReadTask(){
    var el = document.getElementById('flTask');
    var txt = '';
    if (el) {
      try {
        var clone = el.cloneNode(true);
        Array.prototype.forEach.call(clone.querySelectorAll('button, .fl-btns, .fav-btn'), function(n){ n.remove(); });
        txt = String(clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
      } catch (e) {
        txt = String(el.innerText || '').replace(/\s+/g, ' ').trim();
      }
    }
    if (!txt) { try { toast('当前没有可朗读的任务'); } catch (e) {} return; }
    v3Speak(txt.slice(0, 220));
  }
  function v3PrivacyToggle(){
    var mask = document.getElementById('v3PrivacyMask');
    if (!mask) {
      mask = document.createElement('div');
      mask.id = 'v3PrivacyMask';
      mask.className = 'v3-privacy-mask';
      mask.innerHTML = '<div class="v3-privacy-card"><b>已遮住</b><span>点一下恢复</span></div>';
      mask.addEventListener('click', function(){ mask.classList.remove('on'); });
      document.body.appendChild(mask);
    }
    mask.classList.add('on');
  }
  function v3FlightFocus(){
    if (!window._flP) return;
    var el = document.querySelector('.fl-piece.cur');
    if (!el) return;
    try {
      var r = el.getBoundingClientRect();
      if (r.top < 90 || r.bottom > innerHeight - 140) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    } catch (e) {}
  }
  function v3FlightBarSync(){
    var content = document.getElementById('gContent');
    var play = !!(content && content.querySelector('.fl-ring, .fl-lane'));
    document.body.classList.toggle('v3-flight-play', play);
    if (play) v3FlightFocus();
  }
  function v3FlightBarInit(){
    if (document.getElementById('v3FlightBar')) return;
    var bar = document.createElement('div');
    bar.id = 'v3FlightBar';
    bar.setAttribute('data-test', 'flight-bar');
    var items = [
      ['pause', '⏸', '暂停', function(){ v3PauseFlight(); }],
      ['log', '📜', '记录', function(){ v3LogOpen(); }],
      ['read', '🔊', '朗读', function(){ v3ReadTask(); }],
      ['voice', '🎙', '音色', function(){ v3VoiceSheet(); }],
      ['reset', '⚙️', '重设', function(){ v3ConfirmReset(); }],
      ['home', '🏠', '大厅', function(){ try { goHome(); } catch (e) {} }],
      ['privacy', '🙈', '遮一下', function(){ v3PrivacyToggle(); }]
    ];
    items.forEach(function(it){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'v3-fbar-btn';
      b.setAttribute('data-act', it[0]);
      b.innerHTML = '<span class="v3-fbar-ic">' + it[1] + '</span><span class="v3-fbar-tx">' + it[2] + '</span>';
      b.addEventListener('click', it[3]);
      bar.appendChild(b);
    });
    document.body.appendChild(bar);
    document.addEventListener('click', function(e){
      var cell = e.target && e.target.closest ? e.target.closest('.fl-cell') : null;
      if (!cell) return;
      var types = { 't-truth': '💜 真心话：落到这里要回答一个问题', 't-dare': '🔥 大冒险：落到这里要执行一个任务', 't-drink': '🍷 喝酒：落到这里要喝一口', 't-safe': '🛡 安全屋：平安无事', 't-spicy': '💣 刺激挑战：强度更高', 't-duo': '💑 双人互动：两个人一起', 't-duel': '⚔️ 对撞：抢格对决', 't-event': '🎁 事件：抽一个事件', 't-prison': '⛓️ 监狱：跳过一轮', 't-ktv': '🎤 KTV：唱一句放行', 't-item': '🎲 道具：拿一张道具', 't-cross': '💞 交汇：可能进支线' };
      for (var k in types) {
        if (cell.classList.contains(k)) { try { toast(types[k]); } catch (err) {} break; }
      }
    });
    v3FlightBarSync();
  }
  window.v3ConfirmReset = v3ConfirmReset;
  window.v3ReadTask = v3ReadTask;
  window.v3PrivacyToggle = v3PrivacyToggle;
  function v3WishOpen(){
    var mask = document.getElementById('v3WishMask');
    if (mask) { mask.classList.add('on'); var ta0 = mask.querySelector('textarea'); if (ta0) setTimeout(function(){ ta0.focus(); }, 60); return; }
    mask = document.createElement('div');
    mask.id = 'v3WishMask';
    mask.className = 'v3-sheet-mask';
    mask.setAttribute('data-test', 'flight-wish-sheet');
    mask.innerHTML = '<div class="v3-sheet v3-wish-sheet">'
      + '<div class="v3-sheet-grip"></div>'
      + '<div class="v3-sheet-title">赢家心愿券</div>'
      + '<p class="v3-wish-sub">输家赛后兑现一个不越界的小心愿。写下它，会存进「升温夜航」的回忆册。</p>'
      + '<textarea class="v3-wish-input" maxlength="80" rows="3" placeholder="今晚想要什么？例如：给我按脚 10 分钟"></textarea>'
      + '<div class="v3-pause-actions">'
      + '<button type="button" class="v3-btn primary" data-wish-save>存进回忆册</button>'
      + '<button type="button" class="v3-btn ghost" data-wish-cancel>先不写</button>'
      + '</div>'
      + '</div>';
    document.body.appendChild(mask);
    function close(){ mask.classList.remove('on'); }
    mask.addEventListener('click', function(e){ if (e.target === mask) close(); });
    mask.querySelector('[data-wish-cancel]').addEventListener('click', close);
    mask.querySelector('[data-wish-save]').addEventListener('click', function(){
      var ta = mask.querySelector('textarea');
      var w = ta ? String(ta.value || '').trim() : '';
      if (!w) { try { toast('先写一句心愿吧'); } catch (e) {} return; }
      close();
      v3WishSave(w);
    });
    mask.classList.add('on');
    setTimeout(function(){ var ta = mask.querySelector('textarea'); if (ta) ta.focus(); }, 60);
  }
  function v3WishSave(w){
    w = String(w || '').trim().slice(0, 200);
    if (!w) return;
    var el = document.getElementById('flTask');
    if (el) {
      el.innerHTML = '<div class="fl-task"><div style="font-size:22px">👑 心愿券</div>'
        + '<div style="font-size:16px;margin-top:6px">' + w.replace(/[<>&]/g, function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c]; }) + '</div>'
        + '<div style="font-size:12px;color:#aaa;margin-top:6px">已收进回忆册 · 输家记得兑现</div></div>';
    }
    try { logEvent('✈️ 心愿券：' + w); } catch (e) {}
    try { toast('心愿已收进回忆册'); } catch (e) {}
    try { v3ClearFlight(); } catch (e) {}
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'arcade:flight-wish',
          wish: w,
          winner: window._flWinnerName || '',
          names: (typeof HE !== 'undefined' && HE) ? { a: HE.him, b: HE.her } : { a: '他', b: '她' },
          turn: (window._flTurn || 0) + 1
        }, '*');
      }
    } catch (e) {}
  }
  window.v3SaveFlight = v3SaveFlight;
  window.v3ClearFlight = v3ClearFlight;
  window.v3SaveFlightIfActive = v3SaveFlightIfActive;
  window.v3ResumeFlight = v3ResumeFlight;
  window.v3PauseFlight = v3PauseFlight;
  window.v3WishOpen = v3WishOpen;

  function v3AddResumeCard(wrap, h2){
    if (!wrap || !h2 || wrap.querySelector('.v3-resume-flight')) return;
    var s = v3LoadFlight();
    if (!s) return;
    var card = document.createElement('div');
    card.className = 'v3-resume-flight';
    card.setAttribute('data-test', 'flight-resume');
    var tx = document.createElement('div');
    tx.className = 'v3-resume-tx';
    var b = document.createElement('b');
    b.textContent = '继续上次棋局';
    var sp = document.createElement('span');
    var dt = new Date(s.ts || Date.now());
    var stamp = (dt.getMonth() + 1) + '/' + dt.getDate() + ' ' + v3Pad2(dt.getHours()) + ':' + v3Pad2(dt.getMinutes());
    sp.textContent = (s.modeName || '飞行棋') + ' · 第 ' + ((s.turn || 0) + 1) + ' 回合 · ' + stamp;
    tx.appendChild(b);
    tx.appendChild(sp);
    var go = document.createElement('button');
    go.type = 'button';
    go.className = 'v3-resume-go';
    go.textContent = '继续';
    go.addEventListener('click', function(){ v3ResumeFlight(); });
    var fresh = document.createElement('button');
    fresh.type = 'button';
    fresh.className = 'v3-resume-x';
    fresh.textContent = '新开';
    fresh.addEventListener('click', function(){
      v3ClearFlight();
      card.remove();
      try { toast('已清除上次棋局'); } catch (e) {}
    });
    card.appendChild(tx);
    card.appendChild(go);
    card.appendChild(fresh);
    h2.parentNode.insertBefore(card, h2);
  }
  window.v3AddResumeCard = v3AddResumeCard;

  function v3LaunchFlight3D(setup){
    var diy = null;
    try {
      var store = JSON.parse(localStorage.getItem('couple-flight-diy-presets-v1') || 'null');
      if (store && store.presets && store.presets.length) {
        var active = null;
        store.presets.forEach(function(p){ if (p.id === store.activeId) active = p; });
        diy = active || store.presets[0];
      }
    } catch (e) {}
    var payload = {
      v: 1,
      ts: Date.now(),
      setup: setup || {},
      diy: diy
    };
    try { localStorage.setItem('couple3d.flightLaunch', JSON.stringify(payload)); } catch (e) {}
    var old = document.getElementById('v3Flight3DFrame');
    if (old) old.remove();
    var frame = document.createElement('iframe');
    frame.id = 'v3Flight3DFrame';
    frame.className = 'v3-flight3d-frame';
    frame.setAttribute('data-test', 'flight-3d-frame');
    frame.setAttribute('allow', 'fullscreen');
    frame.src = '../3d/?from=arcade&embed=1';
    document.body.appendChild(frame);
    if (!window.__v3Flight3DMsgBound) {
      window.__v3Flight3DMsgBound = true;
      window.addEventListener('message', function(e){
        if (!e || !e.data || e.data.type !== 'arcade:back') return;
        var f = document.getElementById('v3Flight3DFrame');
        if (f) f.remove();
        try { renderFlightSetup(document.getElementById('gContent')); } catch (err) {}
      });
    }
    try { logEvent('✈️ 已切到 3D 夜航棋盘'); } catch (e) {}
    return true;
  }
  window.v3LaunchFlight3D = v3LaunchFlight3D;

  function wrapHome(){
    if (wrapped) return;
    wrapped = true;
    if (EMBED) {
      window.goHome = function(){
        try { v3SaveFlightIfActive(); } catch (e) {}
        try { parent.postMessage({ type: 'arcade:back' }, '*'); } catch (e) {}
      };
      return;
    }
    if (typeof window.goHome !== 'function') { wrapped = false; return; }
    var orig = window.goHome;
    window.goHome = function(){
      try { v3SaveFlightIfActive(); } catch (e) {}
      var r = orig.apply(this, arguments);
      show();
      return r;
    };
  }
  window.Arcade = { show: show, start: start };
  Array.prototype.forEach.call(document.querySelectorAll('[data-game]'), function(btn){
    btn.addEventListener('click', function(){ start(btn.getAttribute('data-game')); });
  });
  function boot(){
    wrapHome();
    var m = String(location.search || '').match(/[?&]game=(truth|dare|flight)/);
    if (m) start(m[1]);
    else if (!EMBED) show();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ try { v3CtrlInit(); } catch (e) {} try { v3FlightSetupInit(); } catch (e) {} try { v3FlightBarInit(); } catch (e) {} boot(); });
  } else { try { v3CtrlInit(); } catch (e) {} try { v3FlightSetupInit(); } catch (e) {} try { v3FlightBarInit(); } catch (e) {} boot(); }
})();
"""


def load_legacy():
    if CACHE.exists():
        return CACHE.read_text(encoding="utf-8")
    try:
        out = subprocess.run(
            ["git", "show", LEGACY_COMMIT + ":index.html"],
            cwd=str(ROOT), capture_output=True, check=True
        )
        text = out.stdout.decode("utf-8")
        CACHE.write_text(text, encoding="utf-8", newline="")
        return text
    except Exception as e:
        raise SystemExit("无法读取旧版 index.html（%s）：%s" % (LEGACY_COMMIT, e))


def patch(html):
    # 1) 去掉旧版 PWA 片段（避免 /arcade/sw.js 404）
    start = html.find("/* ===== V17 FEATURE: 30-pwa.js")
    end = html.find("/* ===== V17 FEATURE: 40-shellfix.js", start + 1)
    if start >= 0 and end > start:
        html = html[:start] + html[end:]
    # 1.5) 转盘/玩家颜色换成新版夜航调色（只改视觉常量）
    html = html.replace(
        "var colors=['#6c2bd9','#7c3aed','#8b5cf6','#a855f7','#7c3aed','#8b5cf6','#6c2bd9','#a855f7'];",
        "var colors=['#3b2a63','#4d2f6b','#6b3a70','#8a446e','#4d2f6b','#6b3a70','#3b2a63','#8a446e'];",
    )
    html = html.replace(
        "var colors=['#ff6b6b','#ee5a24','#e74c3c','#ff4757','#ff6348','#e55039','#eb4d4b','#fc5c65'];",
        "var colors=['#5a2434','#73303c','#8f3b44','#a8474c','#73303c','#8f3b44','#5a2434','#a8474c'];",
    )
    html = html.replace(
        "window._rouColors=['#00cec9','#a855f7','#ff6b6b','#f39c12','#ff4757','#ff4757'];",
        "window._rouColors=['#4fd6c8','#9a7cff','#ff5f9e','#f3c879','#ff5f9e','#ff5f9e'];",
    )
    html = html.replace(
        "p.color=['#3498db','#e040fb','#2ecc71','#f39c12'][i];",
        "p.color=['#4fd6c8','#ff5f9e','#f3c879','#9a7cff'][i];",
    )
    html = html.replace("ctx.fillStyle=i%2===0?'#ffd700':'#ff6b9d';", "ctx.fillStyle=i%2===0?'#f3c879':'#ff5f9e';")
    # 1.6) 真心话/大冒险：canvas 转盘换成 DOM 转盘（文字水平、扇区可点）
    html = html.replace(
        "+'<canvas id=\"truthCanvas\" width=\"1200\" height=\"1200\"></canvas>'",
        "+'<div id=\"truthCanvas\" class=\"v3-wheel\" style=\"--rot:0deg\"><div class=\"v3-wheel-disc\" id=\"truthDisc\"></div><div class=\"v3-wheel-labels\" id=\"truthLabels\"></div></div>'",
    )
    html = html.replace(
        "+'<canvas id=\"dareCanvas\" width=\"1200\" height=\"1200\"></canvas>'",
        "+'<div id=\"dareCanvas\" class=\"v3-wheel\" style=\"--rot:0deg\"><div class=\"v3-wheel-disc\" id=\"dareDisc\"></div><div class=\"v3-wheel-labels\" id=\"dareLabels\"></div></div>'",
    )
    html = html.replace(
        "setTimeout(function(){var cv=document.getElementById('truthCanvas');if(cv)drawWheel(cv,items,colors)},50);",
        "setTimeout(function(){v3WheelInit('truth',items,colors)},30);",
    )
    html = html.replace(
        "setTimeout(function(){var cv=document.getElementById('dareCanvas');if(cv)drawWheel(cv,items,colors)},50);",
        "setTimeout(function(){v3WheelInit('dare',items,colors)},30);",
    )
    html = html.replace(
        "function drawWheel(canvas,items,colors){\n  var ctx=canvas.getContext('2d');",
        "function drawWheel(canvas,items,colors){\n  if(!canvas||typeof canvas.getContext!=='function')return;\n  var ctx=canvas.getContext('2d');",
    )
    html = html.replace(
        "  var angle=1080+Math.random()*720;\n  window[angleKey]+=angle;",
        "  var pick=window.__v3Pick;\n  var pickIdx=null;\n  if(pick&&pick.canvasId===canvasId){pickIdx=pick.idx;window.__v3Pick=null;}\n  var angle;\n  if(pickIdx!=null){\n    var seg0=360/items.length;\n    var desired=((360-((pickIdx+0.5)*seg0))%360+360)%360;\n    var cur=((window[angleKey]%360)+360)%360;\n    angle=1080+((desired-cur+360)%360);\n  }else{\n    angle=1080+Math.random()*720;\n  }\n  window[angleKey]+=angle;",
    )
    html = html.replace(
        "    var finalAngle=window[angleKey]%360;\n    var idx=Math.floor(((360-finalAngle)%360)/seg)%n;\n    sndDing();",
        "    var finalAngle=window[angleKey]%360;\n    var idx=Math.floor(((360-finalAngle)%360)/seg)%n;\n    try{if(cv&&cv.classList&&cv.classList.contains('v3-wheel'))cv.style.setProperty('--rot',(window[angleKey]%360)+'deg');}catch(e){}\n    sndDing();",
    )
    # 飞行棋：保存/继续、暂停、心愿券
    html = html.replace(
        "  buildFlightBoard(s.mode);\n}",
        "  buildFlightBoard(s.mode);\n  try{v3SaveFlight();}catch(e){}\n}",
    )
    html = html.replace(
        "try{v12FlStartTurnTimer();}catch(e){}",
        "try{v12FlStartTurnTimer();}catch(e){} try{v3SaveFlight();}catch(e){}",
    )
    html = html.replace(
        "  window._flWin=true;",
        "  window._flWin=true;\n  try{v3ClearFlight();}catch(e){}",
    )
    html = html.replace(
        "var names=type==='team'?(window._flP.length===2?window._flP[id].name:(window._flP[id*2].name+'&'+window._flP[id*2+1].name)):window._flP[id].name;",
        "var names=type==='team'?(window._flP.length===2?window._flP[id].name:(window._flP[id*2].name+'&'+window._flP[id*2+1].name)):window._flP[id].name;\n  window._flWinnerName=names;",
    )
    html = html.replace(
        "function flWish(){\n  var w=prompt",
        "function flWish(){\n  if(window.v3WishOpen){window.v3WishOpen();return;}\n  var w=prompt",
    )
    html = html.replace(
        "+'<h2 style=\"margin-bottom:4px\">✈️ '+window._flModeName+'</h2>'",
        "+'<div class=\"v3-fl-head\"><h2 style=\"margin-bottom:4px\">✈️ '+window._flModeName+'</h2><button class=\"v3-fl-pause\" type=\"button\" onclick=\"v3PauseFlight()\">⏸ 暂停</button></div>'",
    )
    # 旧地址/旧设置不变，开局后切到 3D 棋盘
    html = html.replace(
        "  var s=window._flSetup=window._flSetup||{n:2,m:1,f:1,mode:'A',laps:1,diff:SET.diff};\n  var players=[];",
        "  var s=window._flSetup=window._flSetup||{n:2,m:1,f:1,mode:'A',laps:1,diff:SET.diff};\n  if(window.v3LaunchFlight3D){try{return window.v3LaunchFlight3D(s);}catch(e){}}\n  var players=[];",
    )
    # 飞行棋：三段式棋盘 / 自定义格 / 追赶 / 自定义称呼
    html = html.replace(
        "if(s.m===1&&s.f===1)players=[{name:HE.him,g:'M'},{name:HE.her,g:'F'}];",
        "if(s.m===1&&s.f===1)players=[{name:(s.names&&s.names.m)||HE.him,g:'M'},{name:(s.names&&s.names.f)||HE.her,g:'F'}];",
    )
    html = html.replace(
        "  window._flP=players;",
        "  window._flP=players;\n  window._flCustom=(s.custom||[]).map(function(x){return String(x||'').trim();});\n  window._flDIY=(s.diy?v3DIYNorm(s.diy):v3DIYLoad());\n  window._flDIYActive=v3DIYExpand(window._flDIY.cards);",
    )
    html = html.replace(
        "p.drink=0;p.drinkMax=p.g==='M'?5:3;p.pardon=1;p.half=p.g==='F'?1:0;",
        "p.drink=0;p.drinkMax=p.g==='M'?5:3;p.pardon=1;p.half=p.g==='F'?1:0;p.wind=1;p.team=players.length===2?i:(i<2?0:1);",
    )
    html = html.replace(
        "p.track='main';p.sidePos=-1;p.done=false;p.team=i<2?0:1;p.six=0;p.skip=false;p.lap=0;",
        "p.track='main';p.sidePos=-1;p.done=false;p.six=0;p.skip=false;p.lap=0;",
    )
    html = html.replace(
        "window._flCells=[flDist(ALEN),flDist(ALEN)];",
        "window._flCells=[v3StagedLane(ALEN,SET.diff),v3StagedLane(ALEN,SET.diff)];",
    )
    html = html.replace(
        "window._flCells[0][0]='start';window._flCells[1][0]='start';\n    window._flCells[0][ALEN-1]='end';window._flCells[1][ALEN-1]='end';",
        "window._flCells[0][0]='start';window._flCells[1][0]='start';\n    window._flCells[0][ALEN-1]='end';window._flCells[1][ALEN-1]='end';\n    try{v3DIYApplyWeights(window._flCells,window._flDIY.weights);v3DIYPlaceCards(window._flCells,'A');}catch(e){}\n    try{v3PlaceCustomCells(window._flCells,'A');}catch(e){}",
    )
    html = html.replace(
        "window._flCells=ring;",
        "window._flCells=ring;\n    try{v3DIYApplyWeights(window._flCells,window._flDIY.weights);v3DIYPlaceCards(window._flCells,'B');}catch(e){}\n    try{v3PlaceCustomCells(window._flCells,'B');}catch(e){}",
    )
    html = html.replace(
        "var main=flDist(14);main[0]='start';main[3]='cross';main[10]='cross';main[13]='end';\n    window._flCells=main;",
        "var main=v3StagedLane(14,SET.diff);main[0]='start';main[3]='cross';main[10]='cross';main[13]='end';\n    try{v3DIYApplyWeights(main,window._flDIY.weights);v3DIYPlaceCards(main,'C');}catch(e){}\n    try{v3PlaceCustomCells(main,'C');}catch(e){}\n    window._flCells=main;",
    )
    html = html.replace(
        "  var v=Math.floor(Math.random()*6)+1;\n  flDiceRoll(v,function(){flMove(p,v);});",
        "  var v=Math.floor(Math.random()*6)+1;\n  try{v=Math.min(6,v+v3CatchUpBonus(p));}catch(e){}\n  flDiceRoll(v,function(){flMove(p,v);});",
    )
    html = html.replace(
        "p.lap++;",
        "p.lap++; p.wind=1; try{v3RestageRing((SET.diff||3)+p.lap);}catch(e){}",
    )
    html = html.replace(
        "function flIcon(t){return FLIGHT_ICONS[t]||'❓'}",
        "function flIcon(t){if(String(t).indexOf('custom')===0)return '✍️';if(t==='strip')return '🍒';if(String(t).indexOf('diy')===0){var dc=v3DIYInfo(t);return {truth:'💜',dare:'🔥',touch:'💞',drink:'🍷',strip:'🍒',punish:'💣'}[dc.type]||'✨';}return FLIGHT_ICONS[t]||'❓'}",
    )
    html = html.replace(
        "  }else{\n    flTaskShow('❓ '+p.name+' 踩中神秘格，无事发生',['done']);\n  }",
        "  }else if(t==='strip'){\n    if(!SET.strip){flTaskShow('🍒 脱衣格 · 需要先在「边界」里打开脱衣模式',['done']);}else{flStrip(p,'棋盘脱衣格');}\n  }else if(String(t).indexOf('diy')===0){\n    var dc=v3DIYInfo(t);\n    var dic={truth:'💜',dare:'🔥',touch:'💞',drink:'🍷',strip:'🍒',punish:'💣'}[dc.type]||'✨';\n    flTaskShow(dic+' DIY · '+p.name+'：'+dc.text,['done','pardon']);\n  }else if(String(t).indexOf('custom')===0){\n    var ci=Number(String(t).replace('custom',''))||0;\n    var ct=(window._flCustom&&window._flCustom[ci])||'一个没写完的任务';\n    flTaskShow('✍️ TA 写的格 · '+p.name+'：'+ct,['done','pardon']);\n  }else{\n    flTaskShow('❓ '+p.name+' 踩中神秘格，无事发生',['done']);\n  }",
    )
    # 回合卡死修复：完成任务时强制清掉转盘/骰子遮罩和 _flRolled
    html = html.replace(
        "function flDiceRoll(v,cb){",
        "function flDiceRoll(v,cb){\n  if(window.v3DiceRoll)return window.v3DiceRoll(v,cb);",
    )
    html = html.replace(
        "function flTaskShow(content,btns){\n  snapShot();",
        "function flTaskShow(content,btns){\n  try{flWheelClose();}catch(e){}\n  snapShot();",
    )
    html = html.replace(
        "  if(window._flRolled)return;",
        "  if(window._flRolled){\n    var _bw=document.getElementById('flWheelOverlay'),_bd=document.getElementById('flDiceOverlay'),_bt=document.getElementById('flTask');\n    var _busy=(_bw&&_bw.classList.contains('show'))||(_bd&&_bd.classList.contains('show'))||!!(_bt&&_bt.querySelector('.fl-task'));\n    if(_busy)return;\n    window._flRolled=false;\n  }",
    )
    html = html.replace(
        "  flNextTurn();\n}\nfunction flSwapTask(){",
        "  try{flWheelClose();}catch(e){}\n  try{if(document.getElementById('flDiceOverlay'))document.getElementById('flDiceOverlay').classList.remove('show');}catch(e){}\n  window._flRolled=false;window._flCur=null;\n  flNextTurn();\n}\nfunction flSwapTask(){",
    )
    html = html.replace(
        "  window._flTurn=(window._flTurn+1)%order.length;\n  flRender();",
        "  window._flTurn=(window._flTurn+1)%order.length;\n  window._flCur=null;\n  flRender();",
    )
    for pattern in [
        r'\n<link rel="manifest"[^>]*>',
        r'\n<link rel="apple-touch-icon"[^>]*>',
        r'\n<meta property="og:image"[^>]*>',
        r'\n<meta name="twitter:card"[^>]*>',
    ]:
        html = re.sub(pattern, "", html)
    # 3) 标题 / 主题色 / 预置“已开局/已引导”避免开场弹窗
    html = html.replace("<title>情侣升温游戏</title>", "<title>经典游戏厅 · 升温夜航</title>")
    html = html.replace('<meta name="theme-color" content="#6c2bd9">', '<meta name="theme-color" content="#0a0616">')
    early = '<style id="arcade-early">#homePage{display:none!important}html,body{background:#070411!important}</style>'
    html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">' + SEED + early, 1)
    # 4) 注入新版皮肤 + 游戏厅层（skin 放在最后，确保覆盖旧版所有样式）
    skin_path = ROOT / "arcade" / "skin.css"
    skin = skin_path.read_text(encoding="utf-8") if skin_path.exists() else ""
    inject = '<style id="arcade-skin">' + skin + "</style>\n" + '<style id="arcade-css">' + CSS + "</style>\n" + HOME + "\n<script>" + JS + "</script>\n"
    idx = html.rfind("</body>")
    if idx < 0:
        raise SystemExit("找不到 </body>")
    return html[:idx] + inject + html[idx:]


def main():
    src = load_legacy()
    out = patch(src)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(out, encoding="utf-8", newline="")
    print("written:", OUT, len(out.encode("utf-8")), "bytes")


if __name__ == "__main__":
    main()











