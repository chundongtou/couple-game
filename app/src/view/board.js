/* ==========================================================================
 * 今晚飞行棋 V6 · view/board.js
 * SVG 2.5D 棋盘 + 骰子/走子/击落/叠机演出层。唯一门面：App.BoardView（impl-freeze §3.1）
 *
 * 依赖：只读 App.FlightBoard.map()（缺失时用内置兜底表，仅供自测页/降级）。
 *       可选 App.Audio / App.UI / App.Motion（都没有也能跑）。
 * 禁止：调用 App.Flight.*、读写 localStorage、外部图片/字体/JS。
 *
 * DOM / QA 钩子（见 app/dev/board-demo.html 自测）：
 *   [data-square="ring:14"|"home:red:2"|"hangar:red:0"|"home:red:goal"]（52 + 20 + 16 + 4）
 *   [data-piece="a:0"][data-piece-square="ring:14"][data-choice="1"]
 *   [data-test="board-heat"]（数字 + 心动温度 + 阶段名）/ [data-test="board-streak"] / [data-test="board-turn"]
 * 事件：board-pick {pieceId} / board-event {event} / board-ready {mode:'svg'}（均 bubbles）
 * ========================================================================== */
(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  var NS = 'http://www.w3.org/2000/svg';
  var TAU = Math.PI * 2;

  /* ============================ 1. 设计常量 ============================ */
  var COLORS = ['red', 'yellow', 'blue', 'green'];
  var CNAME = { red: '红', yellow: '黄', blue: '蓝', green: '绿' };
  var HEX = { red: '#F08C80', yellow: '#F0C877', blue: '#8FA6E8', green: '#7FC9A8' };
  var HEX_SOFT = { red: '#FFC6BA', yellow: '#FFE3AC', blue: '#C9D5FF', green: '#BFF0D8' };
  var HEX_DEEP = { red: '#C25B54', yellow: '#C79A45', blue: '#5F76BF', green: '#4E9C79' };

  /* 画布：720 x 730（约 1:1.014）。全部坐标用 viewBox 单位，DOM 层按百分比/缩放对齐。 */
  var VB = { w: 720, h: 730, cx: 360, cy: 360 };
  var R_RING = 282;        /* 52 格环半径 */
  var CELL = 32.5;         /* 格位边长（52 格 * 34.1 周长间距，留 1.6 缝） */
  var R_ORBIT = 300;
  var R_TURN = 308;        /* 回合描边半径 */
  var R_HEAT = 176;        /* 中心热度环 */
  var HUB_R = 156;         /* 中心终点盘 */
  var HOME_R = [258, 238, 218, 198, 178];
  var GOAL_R = 146;
  var HANGAR_W = 124;
  var HANGAR_H = 94;
  var HANGAR_BOX = {
    red: { x: 606, y: 80, side: 'right' },
    green: { x: 114, y: 80, side: 'left' },
    blue: { x: 114, y: 640, side: 'left' },
    yellow: { x: 606, y: 640, side: 'right' }
  };
  var HANGAR_SLOT = [[-20, 4], [20, 4], [-20, 30], [20, 30]]; /* 相对面板中心的 2x2 槽位 */
  var TAKEOFF_N = { red: 0, yellow: 13, blue: 26, green: 39 };
  var ENTRY_N = { red: 50, yellow: 11, blue: 24, green: 37 };

  var STAGE_IDS = ['cold', 'warm', 'charged', 'burning', 'blazing'];
  var STAGE_NAMES = {
    cold: '灯刚亮', warm: '有点热', charged: '靠近了',
    burning: '很近了', blazing: '今晚可以更近'
  };
  var KIND_NAME = {
    truth: '真心话', dare: '大冒险', touch: '靠近', thermo: '温度计',
    wheel: '转盘', plain: '普通格', ring: '普通格', home: '航线', goal: '终点',
    hangar: '机坪', fate: '命运格'
  };
  var GLYPH_CJK = { '温': 1, '转': 1, '飞': 1, '起': 1, '进': 1, '停': 1, '缘': 1 };
  var FALLBACK_FATE = [5, 29];
  var FACE_ROT = { 1: [0, 0], 2: [0, -90], 3: [-90, 0], 4: [90, 0], 5: [0, 90], 6: [0, 180] };
  var PIPS = {
    1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
  };
  var PLANE_PATH = 'M2.2 11.4l19.4-8.1c.5-.2.9.3.7.8l-7.4 18.6c-.2.5-.9.5-1.2.1l-3.2-6.5-6.6-3.3c-.6-.3-.6-1 0-1.4z';

  /* 兜底拓扑（与 engine/flight-board.js 同源；只有拿不到 App.FlightBoard 时才用） */
  var FALLBACK_CELL_KIND = {
    1: 'truth', 2: 'truth', 5: 'truth', 9: 'truth', 12: 'truth',
    16: 'truth', 17: 'truth', 23: 'truth', 25: 'truth', 28: 'truth',
    31: 'truth', 38: 'truth', 42: 'truth', 43: 'truth', 51: 'truth',
    4: 'dare', 6: 'dare', 15: 'dare', 18: 'dare', 19: 'dare',
    22: 'dare', 27: 'dare', 30: 'dare', 32: 'dare', 35: 'dare',
    41: 'dare', 44: 'dare', 45: 'dare', 48: 'dare', 49: 'dare',
    3: 'touch', 8: 'touch', 21: 'touch', 29: 'touch', 34: 'touch', 47: 'touch',
    10: 'thermo', 36: 'thermo', 14: 'wheel', 40: 'wheel'
  };
  var FALLBACK_WHEEL = { 14: 'truth-wheel', 40: 'dare-wheel' };

  /* ============================ 2. 小工具 ============================ */
  function clamp(n, lo, hi) { n = Number(n); if (isNaN(n)) n = lo; return Math.max(lo, Math.min(hi, n)); }
  function mod(n) { return ((n % 52) + 52) % 52; }
  function deg(a) { return a * 180 / Math.PI; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpAngle(a, b, t) {
    var d = ((b - a + 540) % 360) - 180;
    return a + d * t;
  }
  function nowMs() {
    return (global.performance && global.performance.now) ? global.performance.now() : Date.now();
  }
  function r1(n) { return Math.round(n * 10) / 10; }
  function tex(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }
  function html(tag, cls, txt) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (txt != null) el.textContent = txt;
    return el;
  }
  function angleOfRing(n) { return n / 52 * TAU; }
  function angleOfEntry(color) { return ENTRY_N[color] / 52 * TAU; }

  /* ============================ 3. 拓扑（只读 FlightBoard） ============================ */
  var topoCache = null;

  function getTopo() {
    if (topoCache) return topoCache;
    var B = App.FlightBoard;
    var map = (B && typeof B.map === 'function') ? B.map() : null;
    var squares = map && Array.isArray(map.squares) ? map.squares.slice() : fallbackSquares();
    var byId = {};
    squares.forEach(function (s) { if (s && s.id) byId[s.id] = s; });
    var takeoffOf = {}, homeEntryOf = {}, homePathOf = {};
    COLORS.forEach(function (c) {
      takeoffOf[c] = 'ring:' + TAKEOFF_N[c];
      homeEntryOf[c] = 'ring:' + ENTRY_N[c];
      homePathOf[c] = ['home:' + c + ':0', 'home:' + c + ':1', 'home:' + c + ':2',
        'home:' + c + ':3', 'home:' + c + ':4', 'home:' + c + ':goal'];
    });
    topoCache = {
      squares: squares, byId: byId,
      takeoffOf: takeoffOf, homeEntryOf: homeEntryOf, homePathOf: homePathOf,
      fateCells: (map && Array.isArray(map.fateCells)) ? map.fateCells.slice()
        : (B && Array.isArray(B.FATE_CELLS)) ? B.FATE_CELLS.slice() : FALLBACK_FATE.slice(),
      fromEngine: !!map
    };
    return topoCache;
  }

  function fallbackSquares() {
    var out = [];
    COLORS.forEach(function (c) {
      for (var s = 0; s < 4; s++) {
        out.push({ id: 'hangar:' + c + ':' + s, kind: 'hangar', color: c, isFly: false, jumpTo: null, flyTo: null });
      }
    });
    for (var n = 0; n < 52; n++) {
      var color = COLORS[n % 4];
      var forbid = (n === mod(TAKEOFF_N[color] + 48));
      var fly = (n === mod(TAKEOFF_N[color] + 20));
      var fate = FALLBACK_FATE.indexOf(n) >= 0;
      out.push({
        id: 'ring:' + n, kind: fate ? 'fate' : (FALLBACK_CELL_KIND[n] || 'ring'), color: color,
        wheel: FALLBACK_WHEEL[n] || null, isFly: fly, fate: fate,
        jumpTo: (forbid || fate) ? null : ('ring:' + mod(n + 4)),
        flyTo: fly ? ('ring:' + mod(n + 12)) : null
      });
    }
    COLORS.forEach(function (c) {
      for (var st = 0; st < 5; st++) {
        out.push({ id: 'home:' + c + ':' + st, kind: 'home', color: c, step: st, isFly: false, jumpTo: null, flyTo: null });
      }
      out.push({ id: 'home:' + c + ':goal', kind: 'goal', color: c, isFly: false, jumpTo: null, flyTo: null });
    });
    return out;
  }

  function parseSquare(id) {
    id = String(id || '');
    var m = /^hangar:(red|yellow|blue|green):(\d+)$/.exec(id);
    if (m) return { type: 'hangar', color: m[1], slot: Number(m[2]) };
    m = /^ring:(\d+)$/.exec(id);
    if (m) return { type: 'ring', n: mod(Number(m[1])) };
    m = /^home:(red|yellow|blue|green):goal$/.exec(id);
    if (m) return { type: 'goal', color: m[1] };
    m = /^home:(red|yellow|blue|green):(\d+)$/.exec(id);
    if (m) return { type: 'home', color: m[1], step: Number(m[2]) };
    return null;
  }

  function ringInfo(n) {
    var T = getTopo();
    var sq = T.byId['ring:' + n] || {};
    var color = sq.color || COLORS[n % 4];
    var takeoff = TAKEOFF_N[color] === n;
    var fly = !!sq.isFly;
    var entry = ENTRY_N[color] === n;
    var kind = sq.kind || 'ring';
    var fate = !!sq.fate || kind === 'fate';
    var nojump = !!(sq && !sq.jumpTo && !fate);
    var glyph, kindOut;
    if (takeoff) { glyph = '起'; kindOut = 'takeoff'; }
    else if (fly) { glyph = '飞'; kindOut = 'fly'; }
    else if (entry) { glyph = '进'; kindOut = 'entry'; }
    else if (fate) { glyph = '缘'; kindOut = 'fate'; }
    else if (kind === 'thermo') { glyph = '温'; kindOut = 'thermo'; }
    else if (kind === 'wheel') { glyph = '转'; kindOut = 'wheel'; }
    else if (kind === 'truth') { glyph = '♥'; kindOut = 'truth'; }
    else if (kind === 'dare') { glyph = '✦'; kindOut = 'dare'; }
    else if (kind === 'touch') { glyph = '♡'; kindOut = 'touch'; }
    else { glyph = '·'; kindOut = 'plain'; }
    return {
      kind: kindOut, glyph: glyph, color: color, takeoff: takeoff, fly: fly,
      entry: entry, nojump: nojump, fate: fate, wheel: sq.wheel || null
    };
  }

  /* ============================ 4. 坐标 ============================ */
  function squarePoint(id) {
    var loc = parseSquare(id);
    if (!loc) return null;
    if (loc.type === 'ring') {
      var a = angleOfRing(loc.n);
      return {
        x: VB.cx + Math.cos(a) * R_RING,
        y: VB.cy + Math.sin(a) * R_RING,
        rot: deg(a) + 128, scale: 1
      };
    }
    if (loc.type === 'home') {
      var ah = angleOfEntry(loc.color), rh = HOME_R[clamp(loc.step, 0, 4)];
      return {
        x: VB.cx + Math.cos(ah) * rh,
        y: VB.cy + Math.sin(ah) * rh,
        rot: deg(ah) + 218, scale: 0.72
      };
    }
    if (loc.type === 'goal') {
      var ag = angleOfEntry(loc.color);
      return {
        x: VB.cx + Math.cos(ag) * GOAL_R,
        y: VB.cy + Math.sin(ag) * GOAL_R,
        rot: deg(ag) + 218, scale: 0.8
      };
    }
    if (loc.type === 'hangar') {
      var box = HANGAR_BOX[loc.color];
      var slot = HANGAR_SLOT[clamp(loc.slot, 0, 3)];
      return {
        x: box.x + slot[0], y: box.y + slot[1],
        rot: box.side === 'right' ? 208 : 318, scale: 0.6
      };
    }
    return null;
  }

  function entryPoint(color) {
    var a = angleOfEntry(color);
    return { x: VB.cx + Math.cos(a) * GOAL_R, y: VB.cy + Math.sin(a) * GOAL_R };
  }

  /* ============================ 5. 文案（A11y / 图例） ============================ */
  function squareLabel(id) {
    var loc = parseSquare(id);
    if (!loc) return String(id);
    var T = getTopo();
    if (loc.type === 'ring') {
      var sq = T.byId[id] || {};
      var info = ringInfo(loc.n);
      var parts = ['第 ' + (loc.n + 1) + ' 格'];
      if (info.takeoff) parts.push('起飞格');
      else if (info.fly) parts.push('飞点，跳 12 格');
      else if (info.entry) parts.push('进航格');
      else parts.push(info.fate ? '命运格' : (KIND_NAME[sq.kind] || '普通格'));
      if (info.nojump) parts.push('不连跳');
      else if (!info.fate) parts.push('可连跳');
      if (!info.fate && st && st.fateSet && st.fateSet[loc.n]) parts.push('命运格');
      parts.push(CNAME[info.color] + '色格');
      return parts.join(' · ');
    }
    if (loc.type === 'home') {
      return CNAME[loc.color] + '方航线 · 第 ' + (loc.step + 1) + ' 步';
    }
    if (loc.type === 'goal') return CNAME[loc.color] + '方终点';
    if (loc.type === 'hangar') return CNAME[loc.color] + '方机坪 · 第 ' + (loc.slot + 1) + ' 架位';
    return id;
  }

  function pieceIndexOf(id) {
    var tail = String(id || '').split(':')[1];
    var n = Number(tail);
    return isNaN(n) ? 0 : n;
  }

  function playerOfColor(color) {
    if (!st || !st.colors) return null;
    if (st.colors.a === color) return 'a';
    if (st.colors.b === color) return 'b';
    return null;
  }

  function playerName(pid) {
    if (st && st.names && st.names[pid]) return st.names[pid];
    var color = st && st.colors && st.colors[pid];
    return color ? CNAME[color] + '方' : (pid === 'a' ? '红方' : '黄方');
  }

  function pieceLabel(id) {
    var meta = (st && st.pieceMeta && st.pieceMeta[id]) || {};
    var color = meta.color || ((st && st.colors) ? (st.colors[String(id).charAt(0)] || 'red') : 'red');
    var pid = meta.playerId || String(id).charAt(0);
    var sq = (st && st.piecePos && st.piecePos[id]) || '';
    return playerName(pid) + ' 第 ' + (pieceIndexOf(id) + 1) + ' 架 · ' + squareLabel(sq);
  }

  function stageOf(heat) {
    if (heat >= 80) return 'blazing';
    if (heat >= 60) return 'burning';
    if (heat >= 40) return 'charged';
    if (heat >= 20) return 'warm';
    return 'cold';
  }

  /* ============================ 6. CSS（自包含，只用 V6 变量 + 兜底值） ============================ */
  var CSS = [
    '.board-v6{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;',
    '--s:1;--bv-turn:#F3C077;--bv-turn-soft:rgba(243,192,119,.4);--bv-line:rgba(255,226,196,.13);',
    '--bv-ink:#FBF3E7;--bv-dim:#C9B6CE;--bv-dim2:#8E7C9E;--bv-amber:#F3C077;',
    'font-family:var(--font-body,"Noto Sans SC","Microsoft YaHei","PingFang SC",-apple-system,sans-serif);',
    'color:var(--ink,#FBF3E7);-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none}',
    '.board-v6 *{box-sizing:border-box}',
    '.bv-stage{position:relative;flex:none;width:720px;height:750px;max-width:100%;max-height:100%}',
    '.bv-svg{position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible}',
    '.bv-svg text{font-family:var(--font-body,"Noto Sans SC","Microsoft YaHei",sans-serif)}',
    '.bv-svg .ic{font-size:19px;font-weight:600;text-anchor:middle;dominant-baseline:central;pointer-events:none}',
    '.bv-svg .ic.cn{font-size:16.5px;font-weight:500}',
    '.bv-svg .badge{font-size:8.5px;pointer-events:none;opacity:.92}',
    '.bv-cell{cursor:pointer;outline:none}',
    '.bv-cell .face{transition:stroke-opacity var(--t-fast,160ms),filter var(--t-fast,160ms)}',
    '.bv-cell:hover .face{stroke-opacity:.9}',
    '.bv-cell:focus-visible .face{stroke:#FFF3E6;stroke-width:2}',
    '.bv-cell.is-here .face{filter:drop-shadow(0 0 6px rgba(255,233,210,.45))}',
    '.bv-cell.is-land .face{animation:bv-land 460ms ease-out 2}',
    '.bv-cell.is-fate .face{stroke-dasharray:3 3;stroke-opacity:.8}',
    '@keyframes bv-land{0%{filter:drop-shadow(0 0 0 rgba(255,233,210,0));stroke-opacity:.4}45%{filter:drop-shadow(0 0 10px rgba(255,233,210,.95));stroke-opacity:1}100%{filter:drop-shadow(0 0 0 rgba(255,233,210,0));stroke-opacity:.4}}',
    '.bv-hangar{pointer-events:auto;cursor:pointer;transition:opacity var(--t-mid,320ms)}',
    '.bv-hangar.is-idle{opacity:.4}',
    '.bv-hangar .slot{pointer-events:auto;cursor:pointer}',
    '.bv-hangar.is-here .panel{stroke-opacity:.55}',
    '.bv-lane{pointer-events:none}',
    '.bv-step{pointer-events:auto;cursor:pointer}',
    '.bv-step.is-here circle.core{fill-opacity:.85}',
    '.bv-goal{pointer-events:auto;cursor:pointer}',
    '.bv-goal.is-here .core{filter:drop-shadow(0 0 6px rgba(255,233,210,.5))}',
    '.bv-turn-arc{transition:stroke var(--t-mid,320ms) linear}',
    '.bv-pieces{position:absolute;inset:0;pointer-events:none;z-index:7}',
    '.bv-piece{position:absolute;left:0;top:0;width:calc(42px*var(--s));height:calc(42px*var(--s));padding:0;border:0;',
    'background:transparent;transform-origin:50% 50%;pointer-events:auto;cursor:pointer;will-change:transform;z-index:2}',
    '.bv-piece::after{content:"";position:absolute;inset:calc(-9px*var(--s));border-radius:50%}',
    '.bv-piece .bv-plane{position:absolute;inset:0;width:100%;height:100%;overflow:visible;fill:var(--pc,#F3C077);',
    'stroke:rgba(28,18,32,.5);stroke-width:.4;filter:drop-shadow(0 calc(1.5px*var(--s)) calc(2.5px*var(--s)) rgba(3,2,10,.55))}',
    '.bv-piece .bv-plane path{stroke:rgba(255,248,240,.85);stroke-width:.7;stroke-linejoin:round}',
    '.bv-piece .bv-piece-halo{position:absolute;inset:calc(-6px*var(--s));border-radius:50%;pointer-events:none;',
    'border:calc(1px*var(--s)) solid var(--pc,#F3C077);opacity:0;transition:opacity var(--t-fast,160ms)}',
    '.bv-piece .bv-piece-shadow{position:absolute;left:50%;top:calc(100% - calc(6px*var(--s)));width:calc(28px*var(--s));',
    'height:calc(9px*var(--s));transform:translateX(-50%);border-radius:50%;background:rgba(3,2,10,.5);',
    'filter:blur(calc(3px*var(--s)));pointer-events:none}',
    '.bv-piece .bv-piece-badge{position:absolute;right:calc(-3px*var(--s));top:calc(1px*var(--s));',
    'min-width:calc(15px*var(--s));height:calc(15px*var(--s));padding:0 calc(3px*var(--s));border-radius:999px;',
    'background:linear-gradient(180deg,#F7DFC0,#D9A96E);color:#2C1C15;font-size:calc(9.5px*var(--s));font-weight:700;',
    'line-height:calc(15px*var(--s));text-align:center;box-shadow:0 calc(2px*var(--s)) calc(5px*var(--s)) rgba(3,2,10,.5)}',
    '.bv-piece.is-turn .bv-plane{filter:drop-shadow(0 0 calc(5px*var(--s)) var(--bv-turn-soft))}',
    '.bv-piece.is-arrived{opacity:.92}',
    '.board-v6.has-choices .bv-piece{opacity:.5}',
    '.board-v6.has-choices .bv-piece.is-choice{opacity:1;z-index:4}',
    '.bv-piece.is-choice .bv-piece-halo{opacity:.95;box-shadow:0 0 calc(9px*var(--s)) var(--pc,#F3C077);animation:bv-halo 1.5s ease-in-out infinite}',
    '.bv-piece.is-choice .bv-plane{animation:bv-choice 1.5s ease-in-out infinite}',
    '.bv-piece.is-picked .bv-piece-halo{animation:bv-pick 420ms ease-out}',
    '@keyframes bv-halo{0%,100%{transform:scale(.94);opacity:.65}50%{transform:scale(1.06);opacity:1}}',
    '@keyframes bv-choice{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(-4px*var(--s)))}}',
    '@keyframes bv-pick{0%{transform:scale(1);opacity:1}100%{transform:scale(1.9);opacity:0}}',
    '.bv-hub{position:absolute;left:50%;top:50%;width:calc(312px*var(--s));height:calc(312px*var(--s));',
    'transform:translate(-50%,-50%);border-radius:50%;display:flex;flex-direction:column;align-items:center;',
    'justify-content:center;gap:calc(2px*var(--s));text-align:center;pointer-events:none;z-index:6}',
    '.bv-hub-goal{font-size:calc(16px*var(--s));letter-spacing:.34em;text-indent:.34em;color:rgba(243,192,119,.92)}',
    '.bv-hub-heart{width:calc(40px*var(--s));height:calc(40px*var(--s));margin:calc(1px*var(--s)) 0}',
    '.bv-hub-heart path{fill:rgba(233,136,122,.24);stroke:var(--bv-turn,#F0A394);stroke-width:1.2;transition:stroke var(--t-mid,320ms)}',
    '.bv-hub-heat{display:flex;flex-direction:column;align-items:center;gap:calc(1px*var(--s))}',
    '.bv-hub-temp{font-family:var(--font-display,"Noto Serif SC","Songti SC","STSong",serif);font-size:calc(54px*var(--s));',
    'line-height:1;color:#FFF0DA;text-shadow:0 0 calc(22px*var(--s)) rgba(243,192,119,.38);display:flex;align-items:flex-start}',
    '.bv-heat-deg{font-size:.48em;color:var(--bv-amber,#F3C077);margin-left:calc(1px*var(--s));margin-top:calc(5px*var(--s))}',
    '.bv-hub-label{font-size:calc(14px*var(--s));letter-spacing:.26em;text-indent:.26em;color:var(--bv-dim2,#8E7C9E)}',
    '.bv-hub-stage{font-size:calc(15px*var(--s));letter-spacing:.14em;color:var(--bv-dim,#C9B6CE);margin-top:calc(1px*var(--s))}',
    '.bv-hub-stage.is-up{animation:bv-up 700ms ease-out}',
    '.bv-hub-streak{margin-top:calc(3px*var(--s));font-size:calc(15px*var(--s));letter-spacing:.1em;color:var(--bv-dim2,#8E7C9E);',
    'padding:calc(2px*var(--s)) calc(9px*var(--s));border-radius:999px;border:calc(1px*var(--s)) solid transparent}',
    '.bv-hub-streak.is-on{color:#F3C077;border-color:rgba(243,192,119,.26);background:rgba(243,192,119,.08)}',
    '.bv-hub-streak.is-bump{animation:bv-bump 320ms ease-out}',
    '.bv-hub.is-heat .bv-hub-heat{animation:bv-bump 620ms ease-out}',
    '.bv-hub.is-heat .bv-hub-heart path{filter:drop-shadow(0 0 8px rgba(233,136,122,.65))}',
    '@keyframes bv-bump{0%{transform:scale(1)}35%{transform:scale(1.07)}100%{transform:scale(1)}}',
    '@keyframes bv-up{0%{filter:drop-shadow(0 0 0 rgba(243,192,119,0));color:#FFF3E6}100%{filter:drop-shadow(0 0 8px rgba(243,192,119,0));color:var(--bv-dim,#C9B6CE)}}',
    '.bv-dice{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);z-index:9;',
    'perspective:calc(480px*var(--s));opacity:0;transition:opacity 180ms ease-out;pointer-events:none}',
    '.bv-dice.is-on{opacity:1}',
    '.bv-dice-cube{position:relative;width:calc(72px*var(--s));height:calc(72px*var(--s));transform-style:preserve-3d;',
    'transform:rotateX(-18deg) rotateY(22deg)}',
    '.bv-face{position:absolute;inset:0;border-radius:calc(11px*var(--s));display:grid;',
    'grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);padding:calc(7px*var(--s));gap:calc(2px*var(--s));',
    'background:linear-gradient(160deg,#3D2619,#24150E);box-shadow:inset 0 calc(1px*var(--s)) 0 rgba(255,226,196,.25),',
    'inset 0 calc(-4px*var(--s)) calc(8px*var(--s)) rgba(0,0,0,.45),0 0 0 calc(1px*var(--s)) rgba(255,226,196,.22)}',
    '.bv-face i{width:calc(6px*var(--s));height:calc(6px*var(--s));border-radius:50%;align-self:center;justify-self:center;',
    'background:#FBEBD2;box-shadow:0 0 calc(5px*var(--s)) rgba(251,235,210,.4)}',
    '.bv-face i.off{background:transparent;box-shadow:none}',
    '.bv-dice-glow{position:absolute;inset:calc(-18px*var(--s));border-radius:50%;z-index:-1;',
    'background:radial-gradient(circle,rgba(243,192,119,.32),transparent 70%)}',
    '.bv-f1{transform:translateZ(calc(36px*var(--s)))}',
    '.bv-f2{transform:rotateY(90deg) translateZ(calc(36px*var(--s)))}',
    '.bv-f3{transform:rotateX(90deg) translateZ(calc(36px*var(--s)))}',
    '.bv-f4{transform:rotateX(-90deg) translateZ(calc(36px*var(--s)))}',
    '.bv-f5{transform:rotateY(-90deg) translateZ(calc(36px*var(--s)))}',
    '.bv-f6{transform:rotateY(180deg) translateZ(calc(36px*var(--s)))}',
    '.bv-legend{position:absolute;left:50%;top:95.2%;transform:translate(-50%,-50%);z-index:8;',
    'display:inline-flex;align-items:center;gap:calc(6px*var(--s));padding:calc(4px*var(--s)) calc(14px*var(--s));',
    'border-radius:999px;border:calc(1px*var(--s)) solid rgba(243,192,119,.24);cursor:pointer;',
    'background:rgba(24,16,40,.62);color:#E8D8C2;font-size:calc(20px*var(--s));letter-spacing:.12em;',
    'backdrop-filter:blur(calc(10px*var(--s)));-webkit-backdrop-filter:blur(calc(10px*var(--s)))}',
    '.bv-legend:active{transform:translate(-50%,-50%) scale(.97)}',
    '.bv-legend-panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:12;',
    'width:calc(500px*var(--s));max-width:92%;max-height:78%;overflow:auto;padding:calc(16px*var(--s)) calc(18px*var(--s));',
    'border-radius:calc(20px*var(--s));background:rgba(20,13,36,.94);border:calc(1px*var(--s)) solid rgba(255,226,196,.18);',
    'box-shadow:0 calc(18px*var(--s)) calc(44px*var(--s)) rgba(3,2,10,.55);color:var(--bv-ink,#FBF3E7)}',
    '.bv-legend-panel[hidden]{display:none}',
    '.bv-legend-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:calc(8px*var(--s))}',
    '.bv-legend-title{font-size:calc(22px*var(--s));letter-spacing:.1em;color:#F3D6A8}',
    '.bv-legend-x{border:0;background:transparent;color:#C9B6CE;font-size:calc(20px*var(--s));cursor:pointer;padding:calc(2px*var(--s)) calc(6px*var(--s))}',
    '.bv-legend-rows{display:grid;grid-template-columns:1fr 1fr;gap:calc(6px*var(--s)) calc(14px*var(--s))}',
    '.bv-legend-row{display:flex;align-items:center;gap:calc(8px*var(--s));font-size:calc(18px*var(--s));color:#DECDD8;line-height:1.35}',
    '.bv-legend-row b{flex:none;width:calc(26px*var(--s));height:calc(26px*var(--s));border-radius:calc(7px*var(--s));',
    'display:flex;align-items:center;justify-content:center;background:rgba(255,226,196,.08);color:#FFE9D2;font-size:calc(15px*var(--s))}',
    '.bv-legend-note{margin-top:calc(10px*var(--s));font-size:calc(16px*var(--s));color:#9C8AAE;line-height:1.5}',
    '.bv-tip{position:absolute;z-index:11;transform:translate(-50%,-118%);padding:calc(5px*var(--s)) calc(12px*var(--s));',
    'border-radius:999px;background:rgba(18,11,32,.9);border:calc(1px*var(--s)) solid rgba(255,226,196,.28);',
    'color:#FFF3E6;font-size:calc(19px*var(--s));letter-spacing:.04em;white-space:nowrap;pointer-events:none;opacity:0;',
    'transition:opacity 140ms ease-out}',
    '.bv-tip.is-on{opacity:1}',
    '.bv-float{position:absolute;z-index:10;transform:translate(-50%,-100%);pointer-events:none;',
    'padding:calc(3px*var(--s)) calc(10px*var(--s));border-radius:999px;background:rgba(243,192,119,.16);',
    'border:calc(1px*var(--s)) solid rgba(243,192,119,.4);color:#FFE3B8;font-size:calc(17px*var(--s));',
    'letter-spacing:.06em;white-space:nowrap;animation:bv-float 900ms ease-out forwards}',
    '@keyframes bv-float{0%{opacity:0;transform:translate(-50%,-90%) scale(.9)}18%{opacity:1;transform:translate(-50%,-120%) scale(1)}100%{opacity:0;transform:translate(-50%,-230%) scale(1)}}',
    '.bv-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
    '.board-v6.is-shaking .bv-stage{animation:bv-shake 320ms ease-out}',
    '@keyframes bv-shake{0%,100%{transform:translate(0,0)}25%{transform:translate(calc(-2px*var(--s)),calc(1px*var(--s)))}55%{transform:translate(calc(2px*var(--s)),calc(-1px*var(--s)))}80%{transform:translate(calc(-1px*var(--s)),0)}}',
    '.board-v6.is-won .bv-hub{animation:bv-win 900ms ease-out}',
    '.board-v6.is-won .bv-hub-heat{text-shadow:0 0 calc(30px*var(--s)) rgba(243,192,119,.55)}',
    '@keyframes bv-win{0%{filter:brightness(1)}40%{filter:brightness(1.25)}100%{filter:brightness(1)}}',
    '.board-v6.is-done .bv-stage,.board-v6.is-safe .bv-stage{filter:saturate(.8) brightness(.78);transition:filter 420ms ease-out}',
    '.board-v6.is-reduced *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}',
    '.bv-legend-panel{-webkit-overflow-scrolling:touch}',
    '@media (prefers-reduced-motion: reduce){.bv-piece .bv-plane,.bv-piece .bv-piece-halo{animation:none!important}}'
  ].join('');

  function injectCss() {
    if (global.document.getElementById && global.document.getElementById('style-board-v6')) return;
    if (App.UI && typeof App.UI.injectStyle === 'function') {
      try { App.UI.injectStyle('board-v6', CSS); return; } catch (e) {}
    }
    var tag = global.document.createElement('style');
    tag.id = 'style-board-v6';
    tag.textContent = CSS;
    (global.document.head || global.document.documentElement).appendChild(tag);
  }

  /* ============================ 7. 运行态 ============================ */
  var st = null;

  function emptyState() {
    return {
      mounted: false, host: null, root: null, stage: null, svg: null,
      layer: null, hub: null, tipEl: null, diceEl: null, diceCube: null,
      legendBtn: null, legendPanel: null, legendFateRow: null,
      heatArc: null, heatDot: null, heatDotHalo: null, heatNum: null,
      heatWrap: null, stageEl: null, streakEl: null, turnLive: null,
      cellEls: {}, tipTimer: 0,
      colors: { a: 'red', b: 'yellow' }, names: { a: '他', b: '她' }, turn: 'a',
      pieces: [], pieceEls: {}, piecePos: {}, pieceMeta: {}, pieceXY: {},
      meta: { heat: 0, stage: 'cold', streak: 0, streakBest: 0 },
      fateSet: {}, fateCells: [],
      choices: [], reduced: false, sound: true,
      playing: false, abort: false, queue: Promise.resolve(),
      timers: {}, rafs: {}, tweenRes: {},
      scale: 1, stageW: 720, stageH: 750, ro: null, rafLayout: 0,
      lastLanding: null, lastDie: 0, snapshot: null, topoWarn: false
    };
  }

  /* ============================ 8. 构建 DOM ============================ */
  function buildRoot(host) {
    var root = html('div', 'board-v6');
    root.setAttribute('data-board-view', 'svg');
    root.setAttribute('data-test', 'board');
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', '飞行棋盘：52 格环形轨道、四色机坪、四色 5 步航线和中心终点');

    var stage = html('div', 'bv-stage');
    var svg = buildSvg();
    stage.appendChild(svg);

    var layer = html('div', 'bv-pieces');
    layer.setAttribute('data-layer', 'pieces');
    stage.appendChild(layer);

    var hub = buildHub();
    stage.appendChild(hub);

    /* 中心热度环的 DOM 覆盖层之外，骰子与图例也放在 stage 内，跟随缩放 */
    var dice = buildDice();
    stage.appendChild(dice);

    var legendBtn = html('button', 'bv-legend', '图例');
    legendBtn.type = 'button';
    legendBtn.setAttribute('data-test', 'board-legend');
    legendBtn.setAttribute('aria-haspopup', 'dialog');
    legendBtn.setAttribute('aria-label', '格位图例');
    stage.appendChild(legendBtn);

    var legendPanel = buildLegendPanel();
    stage.appendChild(legendPanel);

    var tip = html('div', 'bv-tip');
    tip.setAttribute('data-test', 'board-tip');
    tip.setAttribute('role', 'status');
    stage.appendChild(tip);

    var live = html('div', 'bv-sr');
    live.setAttribute('data-test', 'board-turn');
    live.setAttribute('aria-live', 'polite');
    stage.appendChild(live);

    root.appendChild(stage);
    host.appendChild(root);

    st.root = root; st.stage = stage; st.svg = svg; st.layer = layer; st.hub = hub;
    st.diceEl = dice; st.legendBtn = legendBtn; st.legendPanel = legendPanel; st.tipEl = tip;
    st.turnLive = live;
    st.heatWrap = hub.querySelector('[data-test="board-heat"]');
    st.heatNum = hub.querySelector('[data-heat]');
    st.stageEl = hub.querySelector('.bv-hub-stage');
    st.streakEl = hub.querySelector('[data-test="board-streak"]');
    st.diceCube = dice.querySelector('.bv-dice-cube');
    st.heatArc = svg.querySelector('.bv-heat-arc');
    st.heatDot = svg.querySelector('.bv-heat-dot');
    st.heatDotHalo = svg.querySelector('.bv-heat-dot-halo');
    st.legendFateRow = legendPanel.querySelector('[data-legend="fate"]');

    bindEvents(root);
  }

  function buildSvg() {
    var svg = tex('svg', {
      class: 'bv-svg', viewBox: '0 0 ' + VB.w + ' ' + VB.h,
      preserveAspectRatio: 'xMidYMid meet', role: 'group',
      'aria-label': '棋盘格位：52 格环形轨道、四色机坪与航线'
    });
    svg.appendChild(buildDefs());
    svg.appendChild(buildAmbient());
    svg.appendChild(buildConnectors());
    svg.appendChild(buildLanes());
    svg.appendChild(buildHangars());
    svg.appendChild(buildRing());
    svg.appendChild(buildCenter());
    svg.appendChild(buildGoals());
    return svg;
  }

  function buildDefs() {
    var defs = tex('defs');
    COLORS.forEach(function (c) {
      var lg = tex('linearGradient', { id: 'bv-cell-' + c, x1: '0', y1: '0', x2: '0', y2: '1' });
      lg.appendChild(tex('stop', { offset: '0', 'stop-color': HEX[c], 'stop-opacity': '.24' }));
      lg.appendChild(tex('stop', { offset: '.55', 'stop-color': HEX[c], 'stop-opacity': '.08' }));
      lg.appendChild(tex('stop', { offset: '1', 'stop-color': '#0B0714', 'stop-opacity': '.95' }));
      defs.appendChild(lg);
    });
    var hub = tex('radialGradient', { id: 'bv-hub', cx: '.5', cy: '.34', r: '.78' });
    hub.appendChild(tex('stop', { offset: '0', 'stop-color': '#4E3474', 'stop-opacity': '.82' }));
    hub.appendChild(tex('stop', { offset: '.6', 'stop-color': '#23143D', 'stop-opacity': '.92' }));
    hub.appendChild(tex('stop', { offset: '1', 'stop-color': '#120B20', 'stop-opacity': '.96' }));
    defs.appendChild(hub);
    var glow = tex('radialGradient', { id: 'bv-glow', cx: '.5', cy: '.5', r: '.5' });
    glow.appendChild(tex('stop', { offset: '0', 'stop-color': '#8E7BD8', 'stop-opacity': '.20' }));
    glow.appendChild(tex('stop', { offset: '.55', 'stop-color': '#5E4290', 'stop-opacity': '.10' }));
    glow.appendChild(tex('stop', { offset: '1', 'stop-color': '#08060F', 'stop-opacity': '0' }));
    defs.appendChild(glow);
    var warm = tex('radialGradient', { id: 'bv-warm', cx: '.5', cy: '.5', r: '.5' });
    warm.appendChild(tex('stop', { offset: '0', 'stop-color': '#F3C077', 'stop-opacity': '.11' }));
    warm.appendChild(tex('stop', { offset: '.62', 'stop-color': '#E2965E', 'stop-opacity': '.05' }));
    warm.appendChild(tex('stop', { offset: '1', 'stop-color': '#E2965E', 'stop-opacity': '0' }));
    defs.appendChild(warm);
    var shadow = tex('radialGradient', { id: 'bv-shadow', cx: '.5', cy: '.5', r: '.5' });
    shadow.appendChild(tex('stop', { offset: '0', 'stop-color': '#03020A', 'stop-opacity': '.55' }));
    shadow.appendChild(tex('stop', { offset: '.72', 'stop-color': '#03020A', 'stop-opacity': '.28' }));
    shadow.appendChild(tex('stop', { offset: '1', 'stop-color': '#03020A', 'stop-opacity': '0' }));
    defs.appendChild(shadow);
    var arc = tex('linearGradient', { id: 'bv-arc', x1: '0', y1: '1', x2: '1', y2: '0' });
    arc.appendChild(tex('stop', { offset: '0', 'stop-color': '#F3C077' }));
    arc.appendChild(tex('stop', { offset: '.62', 'stop-color': '#EDA57E' }));
    arc.appendChild(tex('stop', { offset: '1', 'stop-color': '#E9887A' }));
    defs.appendChild(arc);
    var rim = tex('linearGradient', { id: 'bv-rim', x1: '0', y1: '0', x2: '1', y2: '1' });
    rim.appendChild(tex('stop', { offset: '0', 'stop-color': '#FFE9D2', 'stop-opacity': '.45' }));
    rim.appendChild(tex('stop', { offset: '.5', 'stop-color': '#F3C077', 'stop-opacity': '.16' }));
    rim.appendChild(tex('stop', { offset: '1', 'stop-color': '#E9887A', 'stop-opacity': '.4' }));
    defs.appendChild(rim);
    var blur = tex('filter', { id: 'bv-blur', x: '-30%', y: '-30%', width: '160%', height: '160%' });
    blur.appendChild(tex('feGaussianBlur', { stdDeviation: '16' }));
    defs.appendChild(blur);
    return defs;
  }

  function buildAmbient() {
    var g = tex('g', { class: 'bv-ambient', 'aria-hidden': 'true' });
    g.appendChild(tex('ellipse', {
      cx: VB.cx, cy: VB.cy + 54, rx: 312, ry: 282,
      fill: 'url(#bv-shadow)', filter: 'url(#bv-blur)', opacity: '.9'
    }));
    g.appendChild(tex('circle', { cx: VB.cx, cy: VB.cy, r: 236, fill: 'url(#bv-warm)', opacity: '.9' }));
    g.appendChild(tex('circle', { cx: VB.cx, cy: VB.cy, r: R_ORBIT, fill: 'url(#bv-glow)', opacity: '.85' }));
    g.appendChild(tex('circle', {
      cx: VB.cx, cy: VB.cy, r: 318, fill: 'none',
      stroke: 'rgba(255,226,196,.07)', 'stroke-width': '1', 'stroke-dasharray': '1 9', 'stroke-linecap': 'round'
    }));
    /* 外圈回合描边（颜色随 turn 变化） */
    g.appendChild(tex('circle', {
      class: 'bv-turn-arc', cx: VB.cx, cy: VB.cy, r: R_TURN,
      fill: 'none', stroke: '#F3C077', 'stroke-width': '2', 'stroke-opacity': '.3',
      'stroke-dasharray': '1730 206', 'stroke-linecap': 'round',
      transform: 'rotate(-90 ' + VB.cx + ' ' + VB.cy + ')'
    }));
    return g;
  }

  function buildConnectors() {
    var g = tex('g', { class: 'bv-connectors', 'aria-hidden': 'true' });
    COLORS.forEach(function (c) {
      var box = HANGAR_BOX[c];
      var a = angleOfRing(TAKEOFF_N[c]);
      var tx = VB.cx + Math.cos(a) * R_RING, ty = VB.cy + Math.sin(a) * R_RING;
      var dx = tx - box.x, dy = ty - box.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var sx = box.x + dx / len * (HANGAR_W / 2 - 8);
      var sy = box.y + dy / len * (HANGAR_H / 2 - 8);
      var ex = tx - dx / len * (CELL / 2 + 8);
      var ey = ty - dy / len * (CELL / 2 + 8);
      var mx = (sx + ex) / 2 + (c === 'red' || c === 'blue' ? 18 : -18);
      var my = (sy + ey) / 2;
      var path = tex('path', {
        d: 'M' + r1(sx) + ' ' + r1(sy) + ' Q' + r1(mx) + ' ' + r1(my) + ' ' + r1(ex) + ' ' + r1(ey),
        fill: 'none', stroke: HEX[c], 'stroke-opacity': '.16', 'stroke-width': '1.4',
        'stroke-dasharray': '3 7', 'stroke-linecap': 'round'
      });
      g.appendChild(path);
    });
    return g;
  }

  function buildLanes() {
    var g = tex('g', { class: 'bv-lanes' });
    COLORS.forEach(function (c) {
      var a = angleOfEntry(c);
      var lane = tex('g', { class: 'bv-lane', 'data-color': c, role: 'img' });
      lane.setAttribute('aria-label', CNAME[c] + '方 5 步航线');
      var x1 = VB.cx + Math.cos(a) * (HOME_R[0] + 14);
      var y1 = VB.cy + Math.sin(a) * (HOME_R[0] + 14);
      var x2 = VB.cx + Math.cos(a) * (HOME_R[4] - 10);
      var y2 = VB.cy + Math.sin(a) * (HOME_R[4] - 10);
      lane.appendChild(tex('line', {
        x1: r1(x1), y1: r1(y1), x2: r1(x2), y2: r1(y2),
        stroke: HEX[c], 'stroke-opacity': '.13', 'stroke-width': '10', 'stroke-linecap': 'round'
      }));
      HOME_R.forEach(function (r, step) {
        var x = VB.cx + Math.cos(a) * r, y = VB.cy + Math.sin(a) * r;
        var stepG = tex('g', {
          class: 'bv-step', 'data-square': 'home:' + c + ':' + step,
          'data-square-type': 'home', 'data-color': c, role: 'img'
        });
        stepG.setAttribute('aria-label', squareLabel('home:' + c + ':' + step));
        stepG.appendChild(tex('circle', {
          class: 'core', cx: r1(x), cy: r1(y), r: '6.4',
          fill: HEX[c], 'fill-opacity': '.16', stroke: HEX[c], 'stroke-opacity': '.55', 'stroke-width': '1'
        }));
        var dot = tex('circle', { cx: r1(x), cy: r1(y), r: '1.8', fill: HEX_SOFT[c], 'fill-opacity': '.75' });
        stepG.appendChild(dot);
        var title = tex('title');
        title.textContent = squareLabel('home:' + c + ':' + step);
        stepG.appendChild(title);
        lane.appendChild(stepG);
        st.cellEls['home:' + c + ':' + step] = stepG;
      });
      g.appendChild(lane);
    });
    return g;
  }

  function buildRing() {
    var g = tex('g', { class: 'bv-ring' });
    for (var n = 0; n < 52; n++) {
      var id = 'ring:' + n;
      var info = ringInfo(n);
      var a = angleOfRing(n);
      var x = VB.cx + Math.cos(a) * R_RING;
      var y = VB.cy + Math.sin(a) * R_RING;
      var cell = tex('g', {
        class: 'bv-cell k-' + info.kind + (info.nojump ? ' is-nojump' : '') +
          (info.fly ? ' is-fly' : '') + (info.takeoff ? ' is-takeoff' : '') +
          (info.entry ? ' is-entry' : '') + (info.fate ? ' is-fate' : ''),
        'data-square': id, 'data-square-type': 'ring', 'data-n': String(n),
        'data-kind': info.kind, 'data-color': info.color, 'data-jump': (info.nojump || info.fate) ? '0' : '1',
        role: 'button', tabindex: '0'
      });
      cell.setAttribute('transform', 'translate(' + r1(x) + ' ' + r1(y) + ')');
      cell.setAttribute('aria-label', squareLabel(id));
      cell.appendChild(tex('rect', {
        class: 'ext', x: -CELL / 2, y: -CELL / 2 + 3, width: CELL, height: CELL,
        rx: 9, fill: 'rgba(3,2,8,.55)'
      }));
      cell.appendChild(tex('rect', {
        class: 'face', x: -CELL / 2, y: -CELL / 2, width: CELL, height: CELL, rx: 9,
        fill: 'url(#bv-cell-' + info.color + ')', stroke: HEX[info.color],
        'stroke-opacity': info.takeoff || info.fly ? '.6' : '.26', 'stroke-width': '1'
      }));
      cell.appendChild(tex('rect', {
        class: 'inner', x: -CELL / 2 + 2.6, y: -CELL / 2 + 2.6, width: CELL - 5.2, height: CELL - 5.2,
        rx: 7, fill: 'none', stroke: 'rgba(255,246,235,.07)', 'stroke-width': '1'
      }));
      if (info.fly) {
        cell.appendChild(tex('circle', {
          class: 'fly-ring', r: '19', fill: 'none', stroke: 'rgba(200,215,255,.30)',
          'stroke-width': '1', 'stroke-dasharray': '2 4'
        }));
      }
      if (info.takeoff) {
        cell.appendChild(tex('circle', { class: 'takeoff-halo', r: '13', fill: 'rgba(255,244,235,.07)' }));
      }
      var glyph = tex('text', {
        class: 'ic' + (GLYPH_CJK[info.glyph] ? ' cn' : ''), x: '0', y: '1.6',
        fill: info.takeoff ? '#FFF1E2' : (info.fly ? '#DCE4FF' : HEX_SOFT[info.color]),
        'fill-opacity': '.92'
      });
      glyph.textContent = info.glyph;
      cell.appendChild(glyph);
      if (info.nojump) {
        var badge = tex('text', {
          class: 'badge', x: '10.5', y: '-7.5', 'text-anchor': 'middle', fill: '#F0A394'
        });
        badge.textContent = '停';
        cell.appendChild(badge);
      }
      var title = tex('title');
      title.textContent = squareLabel(id);
      cell.appendChild(title);
      g.appendChild(cell);
      st.cellEls[id] = cell;
    }
    return g;
  }

  function buildHangars() {
    var g = tex('g', { class: 'bv-hangars' });
    COLORS.forEach(function (c) {
      var box = HANGAR_BOX[c];
      var hg = tex('g', {
        class: 'bv-hangar', 'data-hangar': c, 'data-color': c,
        'data-x': String(box.x), 'data-y': String(box.y), role: 'group'
      });
      hg.setAttribute('aria-label', CNAME[c] + '方机坪');
      hg.setAttribute('transform', 'translate(' + box.x + ' ' + box.y + ')');
      hg.appendChild(tex('rect', {
        class: 'panel', x: -HANGAR_W / 2, y: -HANGAR_H / 2, width: HANGAR_W, height: HANGAR_H,
        rx: 18, fill: 'rgba(18,12,30,.52)', stroke: HEX[c], 'stroke-opacity': '.38', 'stroke-width': '1'
      }));
      hg.appendChild(tex('rect', {
        x: -HANGAR_W / 2 + 4, y: -HANGAR_H / 2 + 4, width: HANGAR_W - 8, height: HANGAR_H - 8,
        rx: 15, fill: 'none', stroke: 'rgba(255,246,235,.06)', 'stroke-width': '1'
      }));
      hg.appendChild(tex('circle', { cx: -40, cy: -33, r: '3.4', fill: HEX[c] }));
      var label = tex('text', { x: -31, y: -29, 'font-size': '16', fill: HEX_SOFT[c], 'letter-spacing': '.05em' });
      label.textContent = CNAME[c] + ' · 起飞';
      hg.appendChild(label);
      var count = tex('text', {
        class: 'hangar-count', x: -40, y: -10, 'font-size': '13', fill: 'rgba(201,182,206,.78)'
      });
      count.textContent = '剩 4';
      hg.appendChild(count);
      HANGAR_SLOT.forEach(function (slot, i) {
        var slotG = tex('g', {
          class: 'slot', 'data-square': 'hangar:' + c + ':' + i,
          'data-square-type': 'hangar', 'data-color': c, role: 'img'
        });
        slotG.setAttribute('aria-label', squareLabel('hangar:' + c + ':' + i));
        slotG.setAttribute('transform', 'translate(' + slot[0] + ' ' + slot[1] + ')');
        slotG.appendChild(tex('circle', {
          r: '11.5', fill: 'rgba(255,246,235,.03)', stroke: HEX[c],
          'stroke-opacity': '.28', 'stroke-width': '1', 'stroke-dasharray': '2 3'
        }));
        slotG.appendChild(tex('circle', { r: '1.5', fill: HEX[c], 'fill-opacity': '.45' }));
        var title = tex('title');
        title.textContent = squareLabel('hangar:' + c + ':' + i);
        slotG.appendChild(title);
        hg.appendChild(slotG);
        st.cellEls['hangar:' + c + ':' + i] = slotG;
      });
      g.appendChild(hg);
    });
    return g;
  }

  function buildCenter() {
    var g = tex('g', { class: 'bv-center', 'aria-hidden': 'true' });
    g.appendChild(tex('circle', {
      cx: VB.cx, cy: VB.cy, r: HUB_R,
      fill: 'url(#bv-hub)', stroke: 'rgba(255,226,196,.14)', 'stroke-width': '1.2'
    }));
    g.appendChild(tex('circle', {
      cx: VB.cx, cy: VB.cy, r: HUB_R - 7, fill: 'none',
      stroke: 'url(#bv-rim)', 'stroke-width': '1', opacity: '.7'
    }));
    g.appendChild(tex('circle', {
      cx: VB.cx, cy: VB.cy, r: R_HEAT, fill: 'none',
      stroke: 'rgba(255,226,196,.09)', 'stroke-width': '5'
    }));
    var circ = TAU * R_HEAT;
    g.appendChild(tex('circle', {
      class: 'bv-heat-arc', cx: VB.cx, cy: VB.cy, r: R_HEAT, fill: 'none',
      stroke: 'url(#bv-arc)', 'stroke-width': '5', 'stroke-linecap': 'round',
      'stroke-dasharray': '0 ' + circ.toFixed(2),
      transform: 'rotate(-90 ' + VB.cx + ' ' + VB.cy + ')', opacity: '.95'
    }));
    g.appendChild(tex('circle', {
      cx: VB.cx, cy: VB.cy, r: R_HEAT, fill: 'none',
      stroke: 'rgba(255,226,196,.05)', 'stroke-width': '15', opacity: '.35'
    }));
    var dot = tex('circle', { class: 'bv-heat-dot', cx: VB.cx, cy: VB.cy - R_HEAT, r: '3.4', fill: '#FFE9D2' });
    var halo = tex('circle', {
      class: 'bv-heat-dot-halo', cx: VB.cx, cy: VB.cy - R_HEAT, r: '8',
      fill: 'rgba(255,233,210,.14)'
    });
    g.appendChild(halo);
    g.appendChild(dot);
    return g;
  }

  function buildGoals() {
    var g = tex('g', { class: 'bv-goals' });
    COLORS.forEach(function (c) {
      var p = entryPoint(c);
      var el = tex('g', {
        class: 'bv-goal', 'data-square': 'home:' + c + ':goal',
        'data-square-type': 'goal', 'data-color': c, role: 'img'
      });
      el.setAttribute('aria-label', squareLabel('home:' + c + ':goal'));
      el.appendChild(tex('circle', {
        class: 'core', cx: r1(p.x), cy: r1(p.y), r: '13.5',
        fill: HEX[c], 'fill-opacity': '.16', stroke: HEX[c], 'stroke-opacity': '.7', 'stroke-width': '1.2'
      }));
      var plane = tex('g', { transform: 'translate(' + r1(p.x - 6.7) + ' ' + r1(p.y - 6.7) + ') scale(0.56)' });
      plane.appendChild(tex('path', {
        d: PLANE_PATH, fill: HEX[c], 'fill-opacity': '.85', stroke: 'rgba(255,246,234,.5)', 'stroke-width': '1'
      }));
      el.appendChild(plane);
      var title = tex('title');
      title.textContent = squareLabel('home:' + c + ':goal');
      el.appendChild(title);
      g.appendChild(el);
      st.cellEls['home:' + c + ':goal'] = el;
    });
    return g;
  }

  function buildHub() {
    var hub = html('div', 'bv-hub');
    hub.innerHTML =
      '<div class="bv-hub-goal">终 点</div>' +
      '<svg class="bv-hub-heart" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 20s-7.4-4.6-7.4-10A4.2 4.2 0 0 1 12 7.2 4.2 4.2 0 0 1 19.4 10c0 5.4-7.4 10-7.4 10z"/></svg>' +
      '<div class="bv-hub-heat" data-test="board-heat">' +
      '<div class="bv-hub-temp"><span class="bv-heat-num" data-heat>0</span><span class="bv-heat-deg">°</span></div>' +
      '<div class="bv-hub-label">心动温度</div>' +
      '<div class="bv-hub-stage" data-test="board-stage">灯刚亮</div>' +
      '</div>' +
      '<div class="bv-hub-streak" data-test="board-streak">连击 ×0</div>';
    return hub;
  }

  function buildDice() {
    var wrap = html('div', 'bv-dice');
    wrap.setAttribute('data-test', 'board-dice');
    wrap.setAttribute('aria-hidden', 'true');
    var cube = html('div', 'bv-dice-cube');
    for (var f = 1; f <= 6; f++) {
      var face = html('div', 'bv-face bv-f' + f);
      var on = PIPS[f] || [];
      for (var i = 0; i < 9; i++) {
        var pip = html('i', on.indexOf(i) >= 0 ? '' : 'off');
        face.appendChild(pip);
      }
      cube.appendChild(face);
    }
    var glow = html('div', 'bv-dice-glow');
    wrap.appendChild(cube);
    wrap.appendChild(glow);
    st.diceEl = wrap;
    st.diceCube = cube;
    return wrap;
  }

  function buildLegendPanel() {
    var panel = html('div', 'bv-legend-panel');
    panel.setAttribute('data-test', 'board-legend-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '格位图例');
    panel.hidden = true;
    var rows = [
      ['♥', '真心话格', '题卡'],
      ['✦', '大冒险格', '题卡'],
      ['♡', '靠近格', '题卡'],
      ['温', '温度计格', '小游戏'],
      ['转', '转盘格', '小游戏'],
      ['飞', '飞点', '跳 12 格'],
      ['↗', '跳格', '落在自己颜色格自动跳 4 格'],
      ['起', '起飞格', '全在机坪时任意点数起飞'],
      ['进', '进航格', '进入航线'],
      ['停', '不连跳', '落在这一格不再连跳'],
      ['缘', '命运格', '两张卡二选一（P1）']
    ];
    var head = html('div', 'bv-legend-head');
    head.appendChild(html('span', 'bv-legend-title', '格位图例'));
    var x = html('button', 'bv-legend-x', '✕');
    x.type = 'button';
    x.setAttribute('aria-label', '关闭图例');
    head.appendChild(x);
    panel.appendChild(head);
    var grid = html('div', 'bv-legend-rows');
    rows.forEach(function (row) {
      var line = html('div', 'bv-legend-row');
      if (row[0] === '缘') line.setAttribute('data-legend', 'fate');
      var mark = html('b', null, row[0]);
      line.appendChild(mark);
      var txt = html('span');
      txt.textContent = row[1];
      var sub = html('span');
      sub.style.color = '#9C8AAE';
      sub.style.fontSize = '0.9em';
      sub.textContent = ' · ' + row[2];
      txt.appendChild(sub);
      line.appendChild(txt);
      grid.appendChild(line);
      if (row[0] === '缘') {
        line.hidden = true;
        st.legendFateRow = line;
      }
    });
    panel.appendChild(grid);
    var note = html('div', 'bv-legend-note');
    note.textContent = '格位颜色 = 航线颜色（红/黄/蓝/绿）。落在自己颜色的格上会自动跳 4 格；「停」格不连跳。点任意格可看格名。';
    panel.appendChild(note);
    return panel;
  }

  /* ============================ 9. 尺寸 / 布局 ============================ */
  function layoutStage() {
    if (!st || !st.mounted || !st.host) return;
    var w = st.host.clientWidth || 0;
    var h = st.host.clientHeight || 0;
    if (w <= 0 || h <= 0) return;
    var scale = Math.min(w / VB.w, h / VB.h);
    if (!isFinite(scale) || scale <= 0) return;
    st.scale = scale;
    st.stageW = Math.round(VB.w * scale);
    st.stageH = Math.round(VB.h * scale);
    st.stage.style.width = st.stageW + 'px';
    st.stage.style.height = st.stageH + 'px';
    st.root.style.setProperty('--s', String(scale));
    positionAll(true);
    hideTip();
  }

  function px(unit) { return unit * st.scale; }

  /* ============================ 10. 棋子 ============================ */
  function createPieceEl(p) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'bv-piece';
    el.setAttribute('data-piece', p.id);
    el.innerHTML =
      '<span class="bv-piece-halo" aria-hidden="true"></span>' +
      '<span class="bv-piece-shadow" aria-hidden="true"></span>' +
      '<svg class="bv-plane" viewBox="0 0 24 24" aria-hidden="true"><path d="' + PLANE_PATH + '"/></svg>' +
      '<span class="bv-piece-badge" hidden></span>';
    var color = p.color || 'red';
    el.style.setProperty('--pc', HEX[color]);
    st.layer.appendChild(el);
    return el;
  }

  function reconcilePieces(pieces) {
    var seen = {};
    pieces.forEach(function (p) {
      if (!p || !p.id) return;
      seen[p.id] = true;
      st.piecePos[p.id] = p.squareId || '';
      st.pieceMeta[p.id] = {
        color: p.color || 'red',
        arrived: !!p.arrived,
        playerId: p.playerId || playerOfColor(p.color) || String(p.id).charAt(0)
      };
      var el = st.pieceEls[p.id];
      if (!el) {
        el = createPieceEl(p);
        st.pieceEls[p.id] = el;
      }
      el.setAttribute('data-piece', p.id);
      el.setAttribute('data-piece-square', p.squareId || '');
      el.setAttribute('data-color', p.color || '');
      el.setAttribute('data-player', st.pieceMeta[p.id].playerId);
      el.setAttribute('data-arrived', p.arrived ? '1' : '0');
      el.classList.toggle('is-arrived', !!p.arrived);
      el.style.setProperty('--pc', HEX[p.color] || HEX.red);
      el.setAttribute('aria-label', pieceLabel(p.id));
    });
    Object.keys(st.pieceEls).forEach(function (id) {
      if (seen[id]) return;
      st.pieceEls[id].remove();
      delete st.pieceEls[id];
      delete st.piecePos[id];
      delete st.pieceMeta[id];
      delete st.pieceXY[id];
    });
  }

  function computePlacements() {
    var groups = {};
    Object.keys(st.piecePos).forEach(function (id) {
      var sq = st.piecePos[id] || '';
      (groups[sq] = groups[sq] || []).push(id);
    });
    var out = {};
    Object.keys(groups).forEach(function (sq) {
      var ids = groups[sq].slice().sort();
      var base = squarePoint(sq);
      if (!base) return;
      ids.forEach(function (id, idx) {
        var off = groupOffset(ids.length, idx);
        out[id] = {
          x: base.x + off.dx, y: base.y + off.dy,
          rot: base.rot, scale: base.scale * off.scale,
          stack: ids.length, stackIndex: idx, square: sq
        };
      });
    });
    return out;
  }

  function groupOffset(n, i) {
    if (n <= 1) return { dx: 0, dy: 0, scale: 1 };
    var arr = n === 2 ? [[-14, 0], [14, 0]]
      : n === 3 ? [[-13, 6], [13, 6], [0, -10]]
        : [[-13, -9], [13, -9], [-13, 10], [13, 10]];
    var a = arr[Math.min(i, arr.length - 1)];
    return { dx: a[0], dy: a[1], scale: n === 2 ? 0.78 : 0.72 };
  }

  function setPieceXY(id, x, y, lift, rot, scale) {
    var el = st.pieceEls[id];
    if (!el) return;
    el.style.transform = 'translate3d(' + r1(x) + 'px,' + r1(y) + 'px,0) translate(-50%,-50%) translateY(' + r1(-lift) + 'px) rotate(' + r1(rot) + 'deg) scale(' + scale.toFixed(3) + ')';
    st.pieceXY[id] = { x: x, y: y, rot: rot, scale: scale };
  }

  function applyPlacement(id, pl, lift) {
    if (!pl) return;
    setPieceXY(id, px(pl.x), px(pl.y), lift || 0, pl.rot, pl.scale);
    var el = st.pieceEls[id];
    if (el) {
      el.setAttribute('data-stack', String(pl.stack || 1));
      var badge = el.querySelector('.bv-piece-badge');
      if (badge) {
        var show = (pl.stack > 1 && pl.stackIndex === 0);
        badge.hidden = !show;
        if (show) badge.textContent = '×' + pl.stack;
      }
    }
  }

  function positionAll(instant) {
    if (!st || !st.mounted) return;
    var pls = computePlacements();
    Object.keys(pls).forEach(function (id) {
      if (!instant) return;
      applyPlacement(id, pls[id]);
    });
    updateTurnClasses();
  }

  function updateTurnClasses() {
    Object.keys(st.pieceEls).forEach(function (id) {
      var meta = st.pieceMeta[id] || {};
      var pid = meta.playerId;
      st.pieceEls[id].classList.toggle('is-turn', pid === st.turn);
    });
  }

  function relayoutSquare(sq, animate) {
    var ids = Object.keys(st.piecePos).filter(function (id) { return st.piecePos[id] === sq; });
    if (!ids.length) return Promise.resolve();
    var pls = computePlacements();
    if (!animate || st.reduced) {
      ids.forEach(function (id) { applyPlacement(id, pls[id]); });
      return Promise.resolve();
    }
    return Promise.all(ids.map(function (id) {
      var el = st.pieceEls[id];
      var cur = st.pieceXY[id];
      var to = pls[id];
      if (!el || !cur || !to) return Promise.resolve();
      var tx = px(to.x), ty = px(to.y);
      return tween(320, function (p) {
        setPieceXY(id, lerp(cur.x, tx, p), lerp(cur.y, ty, p), 0, lerpAngle(cur.rot, to.rot, p), lerp(cur.scale, to.scale, p));
      }, 'inout').then(function () { applyPlacement(id, to); });
    }));
  }

  function updatePieceSquareAttr(id, sq) {
    var el = st.pieceEls[id];
    if (!el) return;
    el.setAttribute('data-piece-square', sq || '');
    el.setAttribute('aria-label', pieceLabel(id));
  }

  /* ============================ 11. 中心 / meta ============================ */
  function setHeatVisual(heat) {
    heat = clamp(Math.round(Number(heat) || 0), 0, 100);
    st.meta.heat = heat;
    var circ = TAU * R_HEAT;
    var len = circ * heat / 100;
    if (st.heatArc) st.heatArc.setAttribute('stroke-dasharray', len.toFixed(2) + ' ' + (circ - len).toFixed(2));
    if (st.heatNum) st.heatNum.textContent = String(heat);
    if (st.heatWrap) st.heatWrap.setAttribute('data-heat', String(heat));
    if (st.root) st.root.setAttribute('data-heat', String(heat));
    var ang = -Math.PI / 2 + heat / 100 * TAU;
    var cx = VB.cx + Math.cos(ang) * R_HEAT;
    var cy = VB.cy + Math.sin(ang) * R_HEAT;
    if (st.heatDot) {
      st.heatDot.setAttribute('cx', cx.toFixed(2));
      st.heatDot.setAttribute('cy', cy.toFixed(2));
    }
    if (st.heatDotHalo) {
      st.heatDotHalo.setAttribute('cx', cx.toFixed(2));
      st.heatDotHalo.setAttribute('cy', cy.toFixed(2));
    }
  }

  function setStageVisual(evStage, heat, bump) {
    var stage = evStage && STAGE_NAMES[evStage] ? evStage : stageOf(heat);
    st.meta.stage = stage;
    if (st.stageEl && st.stageEl.textContent !== STAGE_NAMES[stage]) {
      st.stageEl.textContent = STAGE_NAMES[stage];
      if (bump && !st.reduced) {
        st.stageEl.classList.remove('is-up');
        void st.stageEl.offsetWidth;
        st.stageEl.classList.add('is-up');
      }
    }
    if (st.root) st.root.setAttribute('data-stage', stage);
  }

  function setStreakVisual(count, best, bump) {
    count = Math.max(0, Math.round(Number(count) || 0));
    st.meta.streak = count;
    st.meta.streakBest = Math.max(count, Math.round(Number(best) || 0));
    if (st.streakEl) {
      st.streakEl.textContent = '连击 ×' + count;
      st.streakEl.classList.toggle('is-on', count > 0);
      st.streakEl.setAttribute('data-streak', String(count));
      if (bump && !st.reduced) {
        st.streakEl.classList.remove('is-bump');
        void st.streakEl.offsetWidth;
        st.streakEl.classList.add('is-bump');
      }
    }
    if (st.root) st.root.setAttribute('data-streak', String(count));
  }

  function applyMeta(meta) {
    if (!meta) meta = {};
    var heat = clamp(Number(meta.heat || 0), 0, 100);
    setHeatVisual(heat);
    setStageVisual(meta.stage || meta.heatStage, heat, false);
    setStreakVisual(Number(meta.streak || 0), Number(meta.streakBest || meta.best || 0), false);
  }

  /* ============================ 12. 回合 / 命运 / 可走子 ============================ */
  function applyTurn(turn, instant) {
    if (turn !== 'a' && turn !== 'b') turn = st.turn || 'a';
    st.turn = turn;
    var color = (st.colors && st.colors[turn]) || 'red';
    var name = playerName(turn);
    if (st.root) {
      st.root.style.setProperty('--bv-turn', HEX[color] || HEX.red);
      st.root.style.setProperty('--bv-turn-soft', 'rgba(' + hexToRgb(HEX[color] || HEX.red) + ',.45)');
      st.root.setAttribute('data-turn', turn);
      st.root.setAttribute('data-turn-color', color);
    }
    if (st.turnLive) st.turnLive.textContent = name + '的回合 · ' + CNAME[color] + '方';
    if (!instant) {
      var arc = st.svg && st.svg.querySelector('.bv-turn-arc');
      if (arc) {
        arc.style.stroke = HEX[color] || HEX.red;
        arc.style.strokeOpacity = '.34';
      }
    } else if (st.svg) {
      var arc2 = st.svg.querySelector('.bv-turn-arc');
      if (arc2) {
        arc2.style.stroke = HEX[color] || HEX.red;
        arc2.style.strokeOpacity = '.3';
      }
    }
    updateTurnClasses();
  }

  function hexToRgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
    if (!m) return '243,192,119';
    var n = parseInt(m[1], 16);
    return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
  }

  function applyFate(cells) {
    var set = {};
    var list = [];
    (cells || []).forEach(function (c) {
      var loc = parseSquare(c);
      var n = (typeof c === 'number') ? c : (loc && loc.type === 'ring' ? loc.n : NaN);
      if (isNaN(n)) return;
      n = mod(n);
      set[n] = true;
      list.push(n);
      var cell = st.cellEls['ring:' + n];
      if (cell) {
        cell.classList.add('is-fate');
        var label = squareLabel('ring:' + n);
        cell.setAttribute('aria-label', label);
        var title = cell.querySelector('title');
        if (title) title.textContent = label;
      }
    });
    st.fateSet = set;
    st.fateCells = list;
    if (st.legendFateRow) st.legendFateRow.hidden = list.length === 0;
    if (st.root) st.root.setAttribute('data-fate', list.join(','));
  }

  function applyChoices(ids, silent) {
    ids = Array.isArray(ids) ? ids.filter(Boolean) : [];
    st.choices = ids;
    var has = ids.length > 0;
    if (st.root) st.root.classList.toggle('has-choices', has);
    Object.keys(st.pieceEls).forEach(function (id) {
      var el = st.pieceEls[id];
      var on = has && ids.indexOf(id) >= 0;
      el.classList.toggle('is-choice', on);
      if (on) el.setAttribute('data-choice', '1');
      else el.removeAttribute('data-choice');
      el.setAttribute('aria-label', pieceLabel(id) + (on ? ' · 可走' : ''));
    });
    if (!silent && has) {
      /* 让第一架可走子在视觉上更显眼 */
      var first = ids[0];
      var el = st.pieceEls[first];
      if (el && !st.reduced) {
        el.classList.remove('is-picked');
        void el.offsetWidth;
        el.classList.add('is-picked');
      }
    }
  }

  /* ============================ 13. 状态同步 ============================ */
  function clearTransient() {
    hideTip();
    hideDice(true);
    if (st.root) {
      st.root.classList.remove('is-shaking', 'is-won', 'is-done', 'is-safe', 'is-playing');
      st.root.setAttribute('data-ending', '');
    }
    if (st.svg) {
      Array.prototype.forEach.call(st.svg.querySelectorAll('.bv-cell.is-land'), function (el) {
        el.classList.remove('is-land');
      });
    }
    Array.prototype.forEach.call(st.root.querySelectorAll('.bv-float'), function (el) { el.remove(); });
  }

  function applySnapshot(snap) {
    snap = snap && typeof snap === 'object' ? snap : {};
    st.snapshot = snap;
    if (st.playing) {
      st.abort = true;
      flushWaits();
    }
    if (snap.colors) {
      st.colors = { a: snap.colors.a || 'red', b: snap.colors.b || 'yellow' };
    }
    if (snap.names) {
      st.names = { a: String(snap.names.a || '他'), b: String(snap.names.b || '她') };
    }
    if (snap.reduced === true) st.reduced = true;
    if (st.root) {
      st.root.classList.toggle('is-reduced', !!st.reduced);
      st.root.setAttribute('data-reduced', st.reduced ? '1' : '0');
    }
    clearTransient();
    if (snap.meta) applyMeta(snap.meta);
    var pieces = Array.isArray(snap.pieces) ? snap.pieces : [];
    st.pieces = pieces;
    reconcilePieces(pieces);
    applyTurn(snap.turn || st.turn, true);
    if (Array.isArray(snap.fateCells)) applyFate(snap.fateCells);
    applyChoices(Array.isArray(snap.choices) ? snap.choices : [], true);
    positionAll(true);
    refreshHere();
    updateHangarCounts();
  }

  function refreshHere() {
    if (!st || !st.cellEls) return;
    var occupied = {};
    Object.keys(st.piecePos).forEach(function (id) { occupied[st.piecePos[id]] = true; });
    Object.keys(st.cellEls).forEach(function (sq) {
      var el = st.cellEls[sq];
      var on = !!occupied[sq];
      el.classList.toggle('is-here', on);
    });
    var hangar = st.svg && st.svg.querySelectorAll('.bv-hangar');
    if (hangar) {
      Array.prototype.forEach.call(hangar, function (g) {
        var c = g.getAttribute('data-color');
        var n = 0;
        Object.keys(st.piecePos).forEach(function (id) {
          if (st.piecePos[id] === null) return;
          if (String(st.piecePos[id]).indexOf('hangar:' + c + ':') === 0) n++;
        });
        g.classList.toggle('is-here', true);
        var active = st.colors && (st.colors.a === c || st.colors.b === c);
        g.classList.toggle('is-idle', !active);
        g.setAttribute('data-remain', String(n));
        g.setAttribute('aria-label', CNAME[c] + '方机坪 · ' + (active ? ('还剩 ' + n + ' 架') : '本局未上场'));
        var countEl = g.querySelector('.hangar-count');
        if (countEl) countEl.textContent = active ? ('剩 ' + n) : '未上场';
      });
    }
  }

  function updateHangarCounts() {
    refreshHere();
  }

  /* ============================ 14. 动效原语 ============================ */
  function tween(ms, fn, ease) {
    return new Promise(function (resolve) {
      if (!st || !st.mounted) { safeCall(fn, 1, 1); resolve(); return; }
      if (st.reduced) { safeCall(fn, 1, 1); resolve(); return; }
      if (!ms || ms <= 0) { safeCall(fn, 1, 1); resolve(); return; }
      var t0 = nowMs();
      var raf = 0;
      var done = false;
      var token = 't' + (++tweenSeq);
      function fin() {
        if (done) return;
        done = true;
        if (raf) { try { global.cancelAnimationFrame(raf); } catch (e) {} }
        delete st.rafs[raf];
        delete st.tweenRes[token];
        resolve();
      }
      st.tweenRes[token] = fin;
      function step() {
        if (!st || !st.mounted) { fin(); return; }
        var raw = (nowMs() - t0) / ms;
        var p = Math.min(1, raw);
        var e = ease === 'linear' ? p
          : ease === 'inout' ? (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
            : 1 - Math.pow(1 - p, 3);
        if (st.abort) { safeCall(fn, 1, 1); fin(); return; }
        safeCall(fn, e, p);
        if (p < 1) {
          raf = global.requestAnimationFrame(step);
          st.rafs[raf] = 1;
        } else {
          fin();
        }
      }
      raf = global.requestAnimationFrame(step);
      st.rafs[raf] = 1;
    });
  }
  var tweenSeq = 0;

  function safeCall(fn, e, p) {
    try { fn(e, p); } catch (err) { /* 演出失败不得影响棋局 */ }
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      if (!st || !st.mounted || st.reduced || st.abort || !ms || ms <= 0) return resolve();
      var token = 'w' + (++waitSeq);
      var timer = global.setTimeout(function () {
        delete st.timers[token];
        resolve();
      }, ms);
      st.timers[token] = { timer: timer, resolve: resolve };
    });
  }
  var waitSeq = 0;

  function flushWaits() {
    if (!st) return;
    Object.keys(st.timers).forEach(function (token) {
      var item = st.timers[token];
      delete st.timers[token];
      try { global.clearTimeout(item.timer); } catch (e) {}
      try { item.resolve(); } catch (e) {}
    });
  }

  function flushTweens() {
    if (!st) return;
    Object.keys(st.tweenRes).forEach(function (token) {
      var fin = st.tweenRes[token];
      delete st.tweenRes[token];
      try { fin(); } catch (e) {}
    });
    Object.keys(st.rafs).forEach(function (raf) {
      try { global.cancelAnimationFrame(Number(raf)); } catch (e) {}
      delete st.rafs[raf];
    });
  }

  function sfx(name) {
    if (!st || !st.sound) return;
    try {
      if (App.Audio && typeof App.Audio.play === 'function') App.Audio.play(name);
    } catch (e) {}
  }

  function haptic(kind) {
    try {
      if (App.UI && typeof App.UI.haptic === 'function') App.UI.haptic(kind);
    } catch (e) {}
  }

  function pulseCell(sq, times) {
    var el = st && st.cellEls ? st.cellEls[sq] : null;
    if (!el || st.reduced) return;
    el.classList.remove('is-land');
    void el.offsetWidth;
    el.classList.add('is-land');
    global.setTimeout(function () {
      if (el) el.classList.remove('is-land');
    }, 980);
    void times;
  }

  function shakeBoard() {
    if (!st || st.reduced) return;
    st.root.classList.remove('is-shaking');
    void st.root.offsetWidth;
    st.root.classList.add('is-shaking');
    global.setTimeout(function () {
      if (st.root) st.root.classList.remove('is-shaking');
    }, 420);
  }

  function floatText(x, y, text) {
    if (!st || !st.stage) return;
    var el = html('div', 'bv-float', text);
    el.style.left = r1(x) + 'px';
    el.style.top = r1(y) + 'px';
    st.stage.appendChild(el);
    global.setTimeout(function () { el.remove(); }, 920);
  }

  function floatAtSquare(sq, text) {
    var p = squarePoint(sq);
    if (!p) return;
    floatText(px(p.x), px(p.y) - px(18), text);
  }

  function floatAtCenter(text) {
    floatText(px(VB.cx), px(VB.cy - 186), text);
  }

  function showTip(text, x, y) {
    if (!st || !st.tipEl) return;
    st.tipEl.textContent = text;
    st.tipEl.style.left = r1(clamp(x, 40, st.stageW - 40)) + 'px';
    st.tipEl.style.top = r1(clamp(y, 26, st.stageH - 6)) + 'px';
    st.tipEl.classList.add('is-on');
    if (st.tipTimer) global.clearTimeout(st.tipTimer);
    st.tipTimer = global.setTimeout(function () {
      if (st && st.tipEl) st.tipEl.classList.remove('is-on');
    }, 1900);
  }

  function hideTip() {
    if (!st || !st.tipEl) return;
    st.tipEl.classList.remove('is-on');
    if (st.tipTimer) { global.clearTimeout(st.tipTimer); st.tipTimer = 0; }
  }

  function showSquareTip(sq) {
    var p = squarePoint(sq);
    if (!p) { showTip(squareLabel(sq), px(VB.cx), px(VB.cy)); return; }
    sfx('tap');
    showTip(squareLabel(sq) + ' · ' + sq, px(p.x), px(p.y) - px(20));
  }

  function showPieceTip(id) {
    sfx('tap');
    var cur = st.pieceXY[id];
    showTip(pieceLabel(id), cur ? cur.x : px(VB.cx), (cur ? cur.y : px(VB.cy)) - px(22));
  }

  function showDice() {
    if (!st || !st.diceEl) return;
    st.diceEl.hidden = false;
    st.diceEl.classList.remove('is-off');
    st.diceEl.classList.add('is-on');
  }

  function hideDice(instant) {
    if (!st || !st.diceEl) return;
    st.diceEl.classList.remove('is-on');
    if (instant) {
      st.diceEl.hidden = true;
      st.diceEl.classList.remove('is-off');
      return;
    }
    st.diceEl.hidden = true;
  }

  function setCube(rx, ry) {
    if (st && st.diceCube) st.diceCube.style.transform = 'rotateX(' + r1(rx) + 'deg) rotateY(' + r1(ry) + 'deg)';
  }

  /* ============================ 15. 演出（play 事件） ============================ */
  function piecePlacementForSquare(id, sq) {
    var base = squarePoint(sq);
    if (!base) return null;
    return { x: base.x, y: base.y, rot: base.rot, scale: base.scale };
  }

  function movePieceTo(id, sq, ms, lift) {
    var el = st.pieceEls[id];
    var to = piecePlacementForSquare(id, sq);
    if (!to) return Promise.resolve();
    if (!ms || st.reduced) {
      setPieceXY(id, px(to.x), px(to.y), 0, to.rot, to.scale);
      return Promise.resolve();
    }
    var cur = st.pieceXY[id] || { x: px(to.x), y: px(to.y), rot: to.rot, scale: to.scale };
    var tx = px(to.x), ty = px(to.y);
    return tween(ms, function (p) {
      var l = Math.sin(p * Math.PI) * (lift || 0);
      setPieceXY(id, lerp(cur.x, tx, p), lerp(cur.y, ty, p), l, lerpAngle(cur.rot, to.rot, p), lerp(cur.scale, to.scale, p));
    }, 'inout').then(function () {
      setPieceXY(id, tx, ty, 0, to.rot, to.scale);
    });
  }

  async function playDice(ev) {
    var die = clamp(Math.round(Number(ev.die) || 1), 1, 6);
    st.lastDie = die;
    if (st.root) st.root.setAttribute('data-die', String(die));
    if (st.reduced) {
      /* reduced：不翻不滚，只落一个可见骰面（≤100ms 由 runReduced 保证） */
      showDice();
      setCube(FACE_ROT[die][0], FACE_ROT[die][1]);
      hideDice(true);
      return;
    }
    showDice();
    sfx('diceShake');
    haptic('heavy');
    var target = FACE_ROT[die];
    var sx = target[0] + 720 + (die * 90 % 180);
    var sy = target[1] + 1080 + (die * 120 % 240);
    setCube(sx, sy);
    await tween(780, function (p) {
      setCube(sx + (target[0] - sx) * p, sy + (target[1] - sy) * p);
    }, 'linear');
    await tween(150, function (p) {
      var wob = Math.sin(p * Math.PI) * (1 - p) * 7;
      setCube(target[0] + wob, target[1]);
    }, 'inout');
    setCube(target[0], target[1]);
    sfx('diceLand');
    haptic('success');
    if (ev.extraRoll) floatAtCenter('再掷一次');
    await wait(340);
    st.diceEl.classList.remove('is-on');
    await wait(180);
    hideDice(true);
  }

  async function playTakeoff(ev) {
    var path = Array.isArray(ev.path) ? ev.path : [];
    var to = path[path.length - 1];
    if (!to) return;
    sfx('takeoff');
    floatAtSquare(to, '起飞');
    pulseCell(to);
    await movePieceTo(ev.pieceId, to, 620, 52);
    st.piecePos[ev.pieceId] = to;
    st.lastLanding = to;
    updatePieceSquareAttr(ev.pieceId, to);
    refreshHere();
    updateHangarCounts();
    await relayoutSquare(to, false);
  }

  async function playMove(ev) {
    var path = Array.isArray(ev.path) ? ev.path : [];
    if (!path.length) return;
    var stepMs = Math.max(90, Math.min(200, Math.round(1500 / path.length)));
    if (st.reduced) stepMs = 0;
    for (var i = 0; i < path.length; i++) {
      var sq = path[i];
      sfx('hop');
      await movePieceTo(ev.pieceId, sq, stepMs, 18);
      st.piecePos[ev.pieceId] = sq;
      st.lastLanding = sq;
      updatePieceSquareAttr(ev.pieceId, sq);
      refreshHere();
      pulseCell(sq);
    }
    await relayoutSquare(path[path.length - 1], false);
  }

  async function playJump(ev) {
    var to = ev.to || ev.from;
    if (!to) return;
    sfx('hop');
    floatAtSquare(to, '+4 格');
    await movePieceTo(ev.pieceId, to, 380, 34);
    st.piecePos[ev.pieceId] = to;
    st.lastLanding = to;
    updatePieceSquareAttr(ev.pieceId, to);
    refreshHere();
    pulseCell(to);
    await relayoutSquare(to, false);
  }

  async function playFly(ev) {
    var to = ev.to || ev.from;
    if (!to) return;
    sfx('fly');
    floatAtSquare(ev.from || to, '飞 12 格');
    await movePieceTo(ev.pieceId, to, 560, 62);
    st.piecePos[ev.pieceId] = to;
    st.lastLanding = to;
    updatePieceSquareAttr(ev.pieceId, to);
    refreshHere();
    pulseCell(to);
    await relayoutSquare(to, false);
  }

  function freeHangarSlot(color, ignoreId) {
    var used = {};
    Object.keys(st.piecePos).forEach(function (id) {
      if (id === ignoreId) return;
      var loc = parseSquare(st.piecePos[id]);
      if (loc && loc.type === 'hangar' && loc.color === color) used[loc.slot] = true;
    });
    for (var i = 0; i < 4; i++) if (!used[i]) return i;
    return 0;
  }

  async function playCapture(ev) {
    var victims = Array.isArray(ev.victimIds) ? ev.victimIds : [];
    if (!victims.length) return;
    var at = st.piecePos[victims[0]] || st.lastLanding;
    pulseCell(at);
    shakeBoard();
    sfx('capture');
    haptic('warn');
    await Promise.all(victims.map(function (id) {
      var meta = st.pieceMeta[id] || {};
      var color = meta.color || (parseSquare(st.piecePos[id] || '') || {}).color || 'red';
      var slot = freeHangarSlot(color, id);
      var to = 'hangar:' + color + ':' + slot;
      return movePieceTo(id, to, 480, 46).then(function () {
        st.piecePos[id] = to;
        updatePieceSquareAttr(id, to);
      });
    }));
    floatAtSquare(at, '送回机坪');
    refreshHere();
    updateHangarCounts();
    if (at) await relayoutSquare(at, false);
  }

  async function playStack(ev) {
    var ids = Array.isArray(ev.pieceIds) ? ev.pieceIds : [];
    var at = ev.at;
    if (!at || !ids.length) return;
    ids.forEach(function (id) { st.piecePos[id] = at; });
    sfx('stack');
    await relayoutSquare(at, true);
    floatAtSquare(at, '叠机 ×' + ids.length);
    pulseCell(at);
    refreshHere();
    ids.forEach(function (id) { updatePieceSquareAttr(id, at); });
  }

  function landingSquareForPrompt(ev) {
    var prompt = ev.prompt || {};
    var pid = prompt.pieceIds && prompt.pieceIds[0];
    if (pid && st.piecePos[pid]) return st.piecePos[pid];
    return st.lastLanding;
  }

  async function playPrompt(ev) {
    var sq = landingSquareForPrompt(ev);
    if (sq) {
      pulseCell(sq);
      if (ev.prompt && ev.prompt.preSquareId) {
        var piece = (ev.prompt.pieceIds || [])[0];
        if (piece) {
          st.piecePos[piece] = sq;
          updatePieceSquareAttr(piece, sq);
          refreshHere();
        }
      }
    }
    sfx('cardIn');
    await wait(220);
    fire('board-event', { event: ev });
  }

  async function playMinigame(ev) {
    var sq = st.lastLanding;
    if (sq) pulseCell(sq);
    sfx('reveal');
    await wait(200);
    fire('board-event', { event: ev });
  }

  async function playTurn(ev) {
    if (ev && ev.color) {
      if (ev.playerId === 'a' || ev.playerId === 'b') {
        st.turn = ev.playerId;
      }
      if (!st.colors) st.colors = { a: 'red', b: 'yellow' };
      if (st.turn === 'a') st.colors.a = ev.color; else st.colors.b = ev.color;
      st.root.classList.toggle('is-turn-b', st.turn === 'b');
      st.root.style.setProperty('--bv-turn', HEX[ev.color] || HEX.red);
      st.root.style.setProperty('--bv-turn-soft', 'rgba(' + hexToRgb(HEX[ev.color] || HEX.red) + ',.45)');
      var arc = st.svg.querySelector('.bv-turn-arc');
      if (arc) { arc.style.stroke = HEX[ev.color] || HEX.red; arc.style.strokeOpacity = '.4'; }
      if (st.turnLive) st.turnLive.textContent = playerName(st.turn) + '的回合 · ' + CNAME[ev.color] + '方';
      if (st.root) {
        st.root.setAttribute('data-turn', st.turn);
        st.root.setAttribute('data-turn-color', ev.color);
      }
      updateTurnClasses();
    }
    sfx('select');
    await wait(260);
  }

  async function playHeat(ev) {
    var to = clamp(Number(ev.heat) || 0, 0, 100);
    var delta = Number(ev.delta) || (to - st.meta.heat);
    var from = st.meta.heat;
    var prevStage = ev.prevStage || st.meta.stage;
    var newStage = ev.stage || stageOf(to);
    if (st.reduced) {
      setHeatVisual(to);
      setStageVisual(newStage, to, false);
      return;
    }
    await tween(520, function (p) { setHeatVisual(from + (to - from) * p); }, 'out');
    setHeatVisual(to);
    setStageVisual(newStage, to, newStage !== prevStage);
    if (st.hub) {
      st.hub.classList.remove('is-heat');
      void st.hub.offsetWidth;
      st.hub.classList.add('is-heat');
      global.setTimeout(function () { if (st.hub) st.hub.classList.remove('is-heat'); }, 700);
    }
    if (newStage !== prevStage) {
      sfx('heatUp');
      haptic('success');
      floatAtCenter('心动 +' + (delta > 0 ? delta : 0));
    } else if (delta > 0) {
      floatAtCenter('心动 +' + delta);
    }
  }

  async function playStreak(ev) {
    setStreakVisual(ev.count, ev.best, true);
    await wait(180);
  }

  async function playMilestone(ev) {
    sfx('milestone');
    haptic('success');
    floatAtCenter(ev.label || '连击里程碑');
    await wait(520);
  }

  async function playWin() {
    st.root.classList.add('is-won');
    sfx('win');
    haptic('success');
    floatAtCenter('一架到家');
    await wait(880);
  }

  async function playLedger() {
    st.root.classList.add('is-done');
    sfx('ending');
    await wait(420);
  }

  async function playSafe() {
    st.root.classList.add('is-safe');
    sfx('safe');
    await wait(300);
  }

  async function playEnding() {
    sfx('cardIn');
    if (st.root) st.root.setAttribute('data-ending', '1');
    floatAtCenter('今晚最后一段');
    await wait(620);
  }

  function fire(name, detail) {
    if (!st || !st.mounted) return;
    var target = st.root || st.host;
    if (!target) return;
    try {
      var ev;
      if (typeof global.CustomEvent === 'function') {
        ev = new global.CustomEvent(name, { detail: detail, bubbles: true });
      } else {
        ev = global.document.createEvent('CustomEvent');
        ev.initCustomEvent(name, true, false, detail);
      }
      target.dispatchEvent(ev);
    } catch (e) {}
  }

  async function handle(ev) {
    if (!ev || typeof ev !== 'object') return;
    switch (ev.type) {
      case 'dice': await playDice(ev); return;
      case 'takeoff': await playTakeoff(ev); return;
      case 'move': await playMove(ev); return;
      case 'jump': await playJump(ev); return;
      case 'fly': await playFly(ev); return;
      case 'capture': await playCapture(ev); return;
      case 'stack': await playStack(ev); return;
      case 'prompt': await playPrompt(ev); return;
      case 'minigame': await playMinigame(ev); return;
      case 'turn': await playTurn(ev); return;
      case 'win': await playWin(ev); fire('board-event', { event: ev }); return;
      case 'ledger': await playLedger(ev); fire('board-event', { event: ev }); return;
      case 'safe': await playSafe(ev); fire('board-event', { event: ev }); return;
      case 'heat': await playHeat(ev); return;
      case 'streak': await playStreak(ev); return;
      case 'milestone': await playMilestone(ev); return;
      case 'ending-start': await playEnding(ev); return;
      default: fire('board-event', { event: ev }); return;
    }
  }

  /* reduced：整批瞬时应用 + 一次 45ms 收尾（整次 play ≤100ms） */
  function applyInstant(ev) {
    if (!ev || typeof ev !== 'object') return;
    switch (ev.type) {
      case 'dice':
        st.lastDie = clamp(Math.round(Number(ev.die) || 1), 1, 6);
        if (st.root) st.root.setAttribute('data-die', String(st.lastDie));
        setCube(FACE_ROT[st.lastDie][0], FACE_ROT[st.lastDie][1]);
        hideDice(true);
        return;
      case 'takeoff':
      case 'move': {
        var path = Array.isArray(ev.path) ? ev.path : [];
        var to = path.length ? path[path.length - 1] : null;
        if (to) {
          var pl = piecePlacementForSquare(ev.pieceId, to);
          if (pl) {
            setPieceXY(ev.pieceId, px(pl.x), px(pl.y), 0, pl.rot, pl.scale);
            st.piecePos[ev.pieceId] = to;
            updatePieceSquareAttr(ev.pieceId, to);
            st.lastLanding = to;
          }
        }
        break;
      }
      case 'jump':
      case 'fly': {
        var to2 = ev.to || ev.from;
        if (to2) {
          var pl2 = piecePlacementForSquare(ev.pieceId, to2);
          if (pl2) {
            setPieceXY(ev.pieceId, px(pl2.x), px(pl2.y), 0, pl2.rot, pl2.scale);
            st.piecePos[ev.pieceId] = to2;
            updatePieceSquareAttr(ev.pieceId, to2);
            st.lastLanding = to2;
          }
        }
        break;
      }
      case 'capture': {
        (ev.victimIds || []).forEach(function (id) {
          var meta = st.pieceMeta[id] || {};
          var color = meta.color || 'red';
          var slot = freeHangarSlot(color, id);
          var to3 = 'hangar:' + color + ':' + slot;
          var pl3 = piecePlacementForSquare(id, to3);
          if (pl3) {
            setPieceXY(id, px(pl3.x), px(pl3.y), 0, pl3.rot, pl3.scale);
            st.piecePos[id] = to3;
            updatePieceSquareAttr(id, to3);
          }
        });
        refreshHere();
        updateHangarCounts();
        break;
      }
      case 'stack': {
        (ev.pieceIds || []).forEach(function (id) { st.piecePos[id] = ev.at; });
        positionAll(true);
        break;
      }
      case 'prompt':
        fire('board-event', { event: ev });
        break;
      case 'minigame':
        fire('board-event', { event: ev });
        break;
      case 'turn':
        applyTurn(ev.playerId || st.turn, true);
        if (ev.color) {
          if (!st.colors) st.colors = { a: 'red', b: 'yellow' };
          if (st.turn === 'a') st.colors.a = ev.color; else st.colors.b = ev.color;
          applyTurn(st.turn, true);
        }
        break;
      case 'win':
        st.root.classList.add('is-won');
        fire('board-event', { event: ev });
        break;
      case 'ledger':
        st.root.classList.add('is-done');
        fire('board-event', { event: ev });
        break;
      case 'safe':
        st.root.classList.add('is-safe');
        fire('board-event', { event: ev });
        break;
      case 'heat':
        setHeatVisual(ev.heat);
        setStageVisual(ev.stage, Number(ev.heat) || 0, false);
        break;
      case 'streak':
        setStreakVisual(ev.count, ev.best, false);
        break;
      case 'milestone':
        break;
      case 'ending-start':
        if (st.root) st.root.setAttribute('data-ending', '1');
        break;
      default:
        fire('board-event', { event: ev });
        return;
    }
  }

  function applyAllInstant(list) {
    for (var i = 0; i < list.length; i++) {
      if (!st || !st.mounted) break;
      applyInstant(list[i]);
    }
    refreshHere();
  }

  /* ============================ 16. play 主循环 ============================ */
  async function runEvents(list) {
    var S = st;
    if (!S || !S.mounted) return { played: 0, skipped: true, totalMs: 0 };
    if (!list.length) return { played: 0, skipped: false, totalMs: 0 };
    var t0 = nowMs();
    var played = 0;
    var skipped = false;
    if (S.reduced) {
      S.playing = true;
      S.abort = false;
      try {
        applyAllInstant(list);
      } catch (e) {}
      await new Promise(function (resolve) {
        if (!S.mounted) return resolve();
        var timer = global.setTimeout(resolve, 45);
        S.timers['reduced' + (++waitSeq)] = { timer: timer, resolve: resolve };
      });
      if (S.mounted) S.playing = false;
      return { played: list.length, skipped: false, totalMs: Math.round(nowMs() - t0) };
    }
    S.playing = true;
    S.abort = false;
    if (S.root) S.root.classList.add('is-playing');
    try {
      for (var i = 0; i < list.length; i++) {
        if (!S.mounted) break;
        var ev = list[i];
        if (S.abort) {
          skipped = true;
          applyInstant(ev);
          played++;
          continue;
        }
        try {
          await handle(ev);
        } catch (err) {
          fire('board-event', { event: ev });
        }
        if (S.abort && !S.reduced) skipped = true;
        played++;
      }
      refreshHere();
    } catch (err) {
      /* 演出异常不得让 play reject（契约：play 必须 resolve） */
    } finally {
      if (S.mounted) {
        S.playing = false;
        S.abort = false;
        if (S.root) S.root.classList.remove('is-playing');
      }
    }
    return { played: played, skipped: skipped, totalMs: Math.round(nowMs() - t0) };
  }

  function play(events) {
    if (!st || !st.mounted) {
      return Promise.resolve({ played: 0, skipped: true, totalMs: 0 });
    }
    var list = Array.isArray(events) ? events.slice() : [];
    if (!list.length) return Promise.resolve({ played: 0, skipped: false, totalMs: 0 });
    var p = st.queue.then(function () { return runEvents(list); });
    st.queue = p.then(function () { }, function () { });
    return p;
  }

  /* ============================ 17. 事件绑定 ============================ */
  function bindEvents(root) {
    root.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.closest && t.closest('.bv-legend, .bv-legend-panel')) return;
      var piece = t && t.closest ? t.closest('[data-piece]') : null;
      if (piece) {
        var id = piece.getAttribute('data-piece');
        if (st.choices && st.choices.indexOf(id) >= 0 && !st.playing) {
          sfx('select');
          haptic('select');
          piece.classList.remove('is-picked');
          void piece.offsetWidth;
          piece.classList.add('is-picked');
          fire('board-pick', { pieceId: id });
        } else {
          showPieceTip(id);
        }
        return;
      }
      var cell = t && t.closest ? t.closest('[data-square]') : null;
      if (cell) {
        showSquareTip(cell.getAttribute('data-square'));
        return;
      }
      var hg = t && t.closest ? t.closest('[data-hangar]') : null;
      if (hg) {
        var c = hg.getAttribute('data-hangar');
        sfx('tap');
        showTip(CNAME[c] + '方机坪 · ' + (hg.getAttribute('data-remain') || '') + ' 架待飞', px(hg.getAttribute('data-x') || VB.cx), px(hg.getAttribute('data-y') || VB.cy) - px(30));
        return;
      }
      if (st.legendPanel && !st.legendPanel.hidden) {
        st.legendPanel.hidden = true;
        st.legendBtn.setAttribute('aria-expanded', 'false');
      }
    });
    root.addEventListener('keydown', function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var sq = t.getAttribute('data-square');
      if (sq && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
        e.preventDefault();
        showSquareTip(sq);
      }
      if (e.key === 'Escape') {
        if (st.legendPanel && !st.legendPanel.hidden) {
          st.legendPanel.hidden = true;
          st.legendBtn.setAttribute('aria-expanded', 'false');
        } else if (st.playing) {
          st.abort = true;
          flushWaits();
        }
      }
    });
    root.addEventListener('pointerdown', function () {
      if (st.playing && !st.reduced) {
        st.abort = true;
        flushWaits();
      }
    }, true);
    if (st.legendBtn) {
      st.legendBtn.addEventListener('click', function () {
        var open = st.legendPanel.hidden;
        st.legendPanel.hidden = !open;
        st.legendBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        sfx('tap');
      });
    }
    if (st.legendPanel) {
      var x = st.legendPanel.querySelector('.bv-legend-x');
      if (x) x.addEventListener('click', function () {
        st.legendPanel.hidden = true;
        st.legendBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ============================ 18. 门面 App.BoardView ============================ */
  function mount(host, opts) {
    opts = opts || {};
    try {
      if (!host || !host.nodeType) return;
      injectCss();
      if (st && st.mounted) {
        if (st.host === host) unmount();
        else unmount();
      }
      st = emptyState();
      st.mounted = true;
      st.host = host;
      st.reduced = !!opts.reduced;
      st.sound = opts.sound !== false;
      st.colors = { a: 'red', b: 'yellow' };
      st.names = { a: '他', b: '她' };
      st.turn = 'a';
      st.topo = null;
      getTopo();
      if (global.getComputedStyle && global.getComputedStyle(host).position === 'static') {
        host.style.position = 'relative';
      }
      host.innerHTML = '';
      host.setAttribute('data-board-mount', '1');
      buildRoot(host);
      st.root.classList.toggle('is-reduced', !!st.reduced);
      st.root.setAttribute('data-reduced', st.reduced ? '1' : '0');
      st.root.setAttribute('data-topology', getTopo().fromEngine ? 'engine' : 'fallback');
      st.root.setAttribute('data-mode', 'svg');
      st.root.setAttribute('data-version', '6.0.0');
      applyFate(getTopo().fateCells || []);
      setHeatVisual(0);
      setStageVisual('cold', 0, false);
      setStreakVisual(0, 0, false);
      applyTurn('a', true);
      layoutStage();
      global.requestAnimationFrame(function () {
        if (!st || !st.mounted) return;
        layoutStage();
        fire('board-ready', { mode: 'svg' });
      });
      if (typeof global.ResizeObserver === 'function') {
        st.ro = new global.ResizeObserver(function () { layoutStage(); });
        st.ro.observe(host);
      } else {
        st.onResize = function () { layoutStage(); };
        global.addEventListener('resize', st.onResize);
      }
    } catch (err) {
      try {
        if (App.UI && typeof App.UI.toast === 'function') App.UI.toast('棋盘没搭起来，先看列表也能下');
      } catch (e) {}
      try {
        if (host) {
          host.innerHTML = '';
          host.setAttribute('data-board-error', '1');
        }
      } catch (e2) {}
      st = emptyState();
    }
  }

  function setState(snapshot) {
    if (!st || !st.mounted) return;
    try { applySnapshot(snapshot); } catch (e) { /* 视图失败不影响棋局 */ }
  }

  function setChoices(pieceIds) {
    if (!st || !st.mounted) return;
    try { applyChoices(pieceIds, false); } catch (e) {}
  }

  function setReduced(flag) {
    if (!st) return;
    st.reduced = !!flag;
    if (st.root) {
      st.root.classList.toggle('is-reduced', st.reduced);
      st.root.setAttribute('data-reduced', st.reduced ? '1' : '0');
    }
  }

  function setSound(flag) {
    if (!st) return;
    st.sound = flag !== false;
  }

  function unmount() {
    var S = st;
    if (!S) return;
    try {
      S.mounted = false;
      S.abort = true;
      flushWaits();
      flushTweens();
      if (S.ro && S.ro.disconnect) { try { S.ro.disconnect(); } catch (e) {} }
      if (S.onResize) { try { global.removeEventListener('resize', S.onResize); } catch (e) {} }
      if (S.tipTimer) { try { global.clearTimeout(S.tipTimer); } catch (e) {} }
      if (S.host) {
        try { S.host.removeAttribute('data-board-mount'); } catch (e) {}
        try { S.host.innerHTML = ''; } catch (e) {}
      }
      if (S.root && S.root.parentNode) {
        try { S.root.parentNode.removeChild(S.root); } catch (e) {}
      }
    } catch (err) {
      /* 卸载失败也要保持可再次 mount */
    }
    st = null;
  }

  App.BoardView = {
    version: '6.0.0',
    mount: mount,
    setState: setState,
    play: play,
    setChoices: setChoices,
    setReduced: setReduced,
    setSound: setSound,
    unmount: unmount
  };
})(typeof window !== 'undefined' ? window : this);
