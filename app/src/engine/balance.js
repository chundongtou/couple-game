/* ==========================================================================
 * 今晚这一页 · 数值（唯一数值权威）
 * 引擎只读这里的常量；改价格、阈值、贴纸位、结局线只改这个文件。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var Balance = {
    VERSION: 2,
    SESSION_VERSION: 2,

    SPREADS: [
      { id: 1, name: '热身', sub: '先把这一页暖起来' },
      { id: 2, name: '升温', sub: '贴纸开始靠在一起' },
      { id: 3, name: '靠近', sub: '这一页留给更近的话' }
    ],
    SLOTS_PER_SPREAD: 6,

    /* 特殊格：对页 id → 槽位下标 → 小游戏。每格仍只占一个贴纸位。 */
    SPECIAL_SLOTS: {
      1: { 2: 'thermo' },
      2: { 1: 'truth', 4: 'dare' },
      3: { 3: 'map' }
    },

    GAMES: {
      thermo: { id: 'thermo', name: '今晚的温度贴', short: '温度贴', hall: '一条贴在页边的温度带。两人暗自落笔，再揭晓。' },
      truth: { id: 'truth', name: '真心话贴纸轮', short: '贴纸轮', hall: '夹在本子上的纸轮。自己拨，或递给对方拨。' },
      dare: { id: 'dare', name: '大冒险印章轮', short: '印章轮', hall: '拨到的结果盖成印章。强度跟着今晚的温度走。' },
      map: { id: 'map', name: '手帐地图贴', short: '地图贴', hall: '折出来的地图。两人共用一枚「我们」，走到哪一格就贴哪一格。' }
    },

    DEFAULT_SETTINGS: {
      maxStar: 3,
      sound: true,
      haptics: true,
      reduced: false,
      safeHold: 1.5,
      blacklist: [],
      gentleOnly: false
    },
    MAX_STAR_MIN: 1,
    MAX_STAR_MAX: 4,
    SCALES: [
      { n: 1, name: '温柔', sub: '轻一点的贴纸' },
      { n: 2, name: '暧昧', sub: '有一点电流' },
      { n: 3, name: '热烈', sub: '热，但还留着余地' },
      { n: 4, name: '不设限', sub: '边界交给你们' }
    ],

    HEAT_MAX: 99,
    IMPRINT_MAX: 99,
    TAPE_MAX: 99,
    TAPE_START: 3,
    /* 星级 1–2 只给 1 点升温，这样温柔地贴完整本也不会被判成「热度很高」。 */
    HEAT_BY_STAR: { 1: 1, 2: 1, 3: 2, 4: 3, 5: 3 },
    THERMO_HEAT_MAX: 3,

    /* 结局阈值。安全词优先，其次撕得多、热度高、对贴近，其余是温柔合上。 */
    PEEL_STAMP: 6,
    HEAT_STAMP: 32,
    IMPRINT_STAMP: 3,

    STACK_EVERY: 3,
    NOTE_MAX: 40,
    NAME_MAX: 10,
    HAND_SIZE: 3,
    PEEK_EXTRA: 1,
    WHEEL_SEGMENTS: 8,
    WHEEL_REROLLS: 2,
    MAP_TILES: 8,
    MAP_MOVES: 4,
    EXTRAS_MAX: 8,

    TAPE_ON_PASTE: 1,
    REROLL_COST: 1,

    MARKS: {
      close: { id: 'close', name: '靠近', note: '两张贴得很近' },
      apart: { id: 'apart', name: '错开', note: '两张各走各的' },
      far: { id: 'far', name: '岔开', note: '两张差得有点远' }
    },

    TYPE_META: {
      truth: { icon: '贴', name: '真心话' },
      dare: { icon: '印', name: '大冒险' },
      touch: { icon: '贴', name: '触碰' },
      sync: { icon: '贴', name: '共鸣' },
      spark: { icon: '贴', name: '深一点' },
      punish: { icon: '贴', name: '惩罚' },
      fallback: { icon: '贴', name: '贴纸' }
    },
    DRAW_POOLS: ['truth', 'dare', 'touch', 'sync', 'spark'],
    NEVER_ON_HAND: ['punish'],
    DRAW: {
      handSize: 3,
      maxSameType: 2,
      sparkMinMaxStar: 4
    },
    DEEP_POOLS: ['spark', 'touch', 'dare', 'truth', 'sync'],
    TRUTH_POOLS: ['truth'],
    DARE_POOLS: ['dare', 'touch'],
    MAP_POOLS: ['truth', 'dare', 'touch', 'sync'],

    GENTLE_ONLY: { maxStar: 2, blockTags: ['束缚', '露出', '道具', '喝酒', '蒙眼'] },
    BLACKLIST: { maxEntries: 100, maxLen: 40 },

    SHOP: [
      { id: 'peek', name: '再看一张', price: 2, desc: '下一手多看一张贴纸' },
      { id: 'soften', name: '降一档尺度', price: 2, desc: '接下来抽到的贴纸，星级上限降一档' },
      { id: 'stack', name: '多一次叠贴', price: 3, desc: '下一张贴上之后，可以再叠一张更深的' }
    ],
    SOFTEN_MAX: 2,

    THERMO_BANDS: ['凉', '温', '暖', '热', '烫', '不设限'],

    ENDINGS: [
      { id: 'safe', name: '合上本子', stamp: '合上本子', quote: '已经贴上的，都还在。', desc: '安全词把这一页轻轻合上。' },
      { id: 'peel', name: '撕掉较多', stamp: '胶痕也算数', quote: '揭走过的地方，留下一点胶。', desc: '这一页撕得比较多。' },
      { id: 'heat', name: '热度很高', stamp: '这一页是热的', quote: '温度带走到了靠上的地方。', desc: '这一页的热度很高。' },
      { id: 'close', name: '对贴很近', stamp: '对页很齐', quote: '两张贴纸一次次落到一起。', desc: '对贴常常贴得很近。' },
      { id: 'gentle', name: '温柔合上', stamp: '轻轻合上', quote: '这一页合得很轻。', desc: '没有特别的印章，这一页就这样合上。' }
    ],
    ENDING_RULES: [
      { id: 'safe', test: function (s) { return !!(s.flags && s.flags.safeWord); } },
      { id: 'peel', test: function (s) { return (s.peels || 0) >= Balance.PEEL_STAMP; } },
      { id: 'heat', test: function (s) { return (s.heat || 0) >= Balance.HEAT_STAMP; } },
      { id: 'close', test: function (s) { return (s.imprint || 0) >= Balance.IMPRINT_STAMP; } },
      { id: 'gentle', test: function () { return true; } }
    ],

    AWARDS: [
      { id: 'stacked', name: '叠了一层', icon: '叠', test: function (s) { return (s.stacks || 0) >= 1; } },
      { id: 'close', name: '对页很齐', icon: '印', test: function (s) { return (s.imprint || 0) >= Balance.IMPRINT_STAMP; } },
      { id: 'warm', name: '这一页是热的', icon: '温', test: function (s) { return (s.heat || 0) >= Balance.HEAT_STAMP; } },
      { id: 'kept', name: '贴住了', icon: '贴', test: function (s) { return (s.pastes || 0) >= 6; } },
      { id: 'together', name: '一起写下', icon: '页', test: function () { return true; } },
      { id: 'page', name: '今晚这一页', icon: '页', test: function () { return true; } }
    ],

    FALLBACK_CARDS: [
      { id: 'fb1', text: '用一个词形容此刻的对方。', star: 1, tags: [], src: 'ENGINE' },
      { id: 'fb2', text: '和对方对视十秒，先笑的人先说一句话。', star: 1, tags: [], src: 'ENGINE' },
      { id: 'fb3', text: '告诉对方：今晚你最想记住的一个瞬间。', star: 1, tags: [], src: 'ENGINE' },
      { id: 'fb4', text: '把对方的手放到一个让你觉得安心的地方。', star: 1, tags: [], src: 'ENGINE' },
      { id: 'fb5', text: '说一件你们都知道、但很少当面讲的小事。', star: 1, tags: [], src: 'ENGINE' },
      { id: 'fb6', text: '给这一页起一个只有你们懂的名字。', star: 1, tags: [], src: 'ENGINE' }
    ],

    heatForStar: function (star) {
      var s = Math.round(Number(star) || 1);
      if (s < 1) s = 1;
      if (s > 5) s = 5;
      return Balance.HEAT_BY_STAR[s] || 1;
    },
    spreadById: function (id) {
      for (var i = 0; i < Balance.SPREADS.length; i++) if (Balance.SPREADS[i].id === id) return Balance.SPREADS[i];
      return Balance.SPREADS[0];
    },
    endingById: function (id) {
      for (var i = 0; i < Balance.ENDINGS.length; i++) if (Balance.ENDINGS[i].id === id) return Balance.ENDINGS[i];
      return Balance.ENDINGS[Balance.ENDINGS.length - 1];
    },
    scaleByStar: function (n) {
      for (var i = 0; i < Balance.SCALES.length; i++) if (Balance.SCALES[i].n === n) return Balance.SCALES[i];
      return Balance.SCALES[2];
    },
    typeName: function (pool) {
      var m = Balance.TYPE_META[pool];
      return m ? m.name : '贴纸';
    }
  };

  root.Balance = Balance;
  if (typeof module !== 'undefined' && module.exports) module.exports = Balance;
})(typeof window !== 'undefined' ? window : this);
