/* ==========================================================================
 * 升温夜航 · V3 重制版 —— 数值与规则常量（唯一数值权威）
 * app/src/engine/balance.js
 * 纯数据 + 纯函数；无 DOM、无 localStorage、无副作用。
 * UI 可读：App.Balance.SHOP / LENGTHS / ENDINGS …
 * 引擎可读：App.Balance.YIELD / DRAW / ACT_THRESHOLDS …
 * 修改数值只改这里；engine.js 不写死收益数字。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var Balance = {
    VERSION: 1,
    SESSION_VERSION: 1,

    /* ---------- 长度：回合数与三幕切分（DESIGN §1.4） ---------- */
    LENGTHS: {
      quick: { id: 'quick', name: '短夜', rounds: 9, acts: [3, 3, 3], desc: '9 回合 · 约 20 分钟' },
      classic: { id: 'classic', name: '整夜', rounds: 14, acts: [5, 5, 4], desc: '14 回合 · 约 40 分钟' },
      deep: { id: 'deep', name: '深潜', rounds: 18, acts: [6, 6, 6], desc: '18 回合 · 约 60 分钟' }
    },
    DEFAULT_LENGTH: 'classic',
    LENGTH_ORDER: ['quick', 'classic', 'deep'],

    /* ---------- 设置默认值（DESIGN §2 setup） ---------- */
    DEFAULT_SETTINGS: {
      maxStar: 3,          /* 1 温柔 / 2 暧昧 / 3 热烈 / 4 不设限 */
      length: 'classic',
      sound: true,
      haptics: true,
      reduced: false,
      safeHold: 2,         /* 安全词长按秒数 */
      blacklist: [],       /* 文本关键词或标签名 */
      gentleOnly: false    /* 缓和开关：封顶 2 星并屏蔽高强度标签 */
    },
    MAX_STAR_MIN: 1,
    MAX_STAR_MAX: 4,

    /* ---------- 资源（DESIGN §1.3） ---------- */
    RES_KEYS: ['heart', 'tension', 'sync'],
    RES_LABEL: { heart: '心动', tension: '张力', sync: '默契', coins: '星屑' },
    RESOURCE_START: { heart: 0, tension: 0, sync: 0, coins: 0 },
    RESOURCE_MAX: 999,

    /* ---------- 类型基础收益（DESIGN §1.2） ----------
     * 收益 = round(base * star / 2)，每种资源最低 1（若该资源有 base）。
     * 星屑 coins = star + floor(combo / 3)，加码完成时整体 ×2。
     */
    TYPE_YIELD: {
      truth: { sync: 1.5, heart: 0.5 },   /* 💬 真心话 */
      dare: { tension: 1.5, heart: 0.5 },   /* ⚡ 大冒险 */
      touch: { heart: 1.5, tension: 1 },   /* 🫧 触碰 */
      sync: { sync: 2, heart: 1 },        /* 🪢 共鸣 */
      spark: { tension: 2, heart: 1.5 },   /* 🌟 心跳（深潜专属） */
      punish: {}                            /* 🚫 惩罚（仅事件/风险，不给常规收益） */
    },
    TYPE_META: {
      truth: { icon: '💬', name: '真心话' },
      dare: { icon: '⚡', name: '大冒险' },
      touch: { icon: '🫧', name: '触碰' },
      sync: { icon: '🪢', name: '共鸣' },
      spark: { icon: '🌟', name: '心跳' },
      punish: { icon: '🚫', name: '惩罚' }
    },
    DRAW_POOLS: ['truth', 'dare', 'touch', 'sync', 'spark'],
    NEVER_ON_HAND: ['punish'],

    YIELD: { starHalf: 2, min: 1 },
    COINS: { perStar: 1, comboDiv: 3 },
    ESCALATE: { multiplier: 2, starStep: 1 },

    /* ---------- 完成 / 跳过 / 缓一缓 ---------- */
    COMPLETE: { combo: 1 },
    SKIP: { tension: -1, comboReset: true, gentle: 1 },
    ESCALATE_SKIP: { heart: -1, comboReset: true, gentle: 0 },
    GENTLE: { maxUses: 2, starStep: -1 },
    COMBO: { tokenEvery: 5, coinEvery: 3 },

    TOKEN_KEYS: ['shield', 'reroll', 'escalate'],
    TOKEN_START: { shield: 0, reroll: 1, escalate: 0 },
    TOKEN_META: {
      shield: { icon: '🛡️', name: '护身符', desc: '抵消一次惩罚/负面结算' },
      reroll: { icon: '🔄', name: '换牌券', desc: '重抽整手 3 张手牌' },
      escalate: { icon: '🌊', name: '加码券', desc: '已到最高星时仍可深潜一次' }
    },
    TOKEN_MAX: 99,
    TOKEN_ROLLPOOL: ['shield', 'reroll', 'escalate'],

    /* ---------- 商店（3–4 件，DESIGN §2 shop） ---------- */
    SHOP: [
      { id: 'shield', name: '护身符', icon: '🛡️', price: 6, desc: '抵消一次惩罚/负面结算' },
      { id: 'reroll', name: '换牌券', icon: '🔄', price: 4, desc: '立刻重抽整手' },
      { id: 'escalate', name: '加码券', icon: '🌊', price: 8, desc: '满星时也能深潜一次' },
      { id: 'heart', name: '心糖', icon: '❤️', price: 5, desc: '立即 +1 心动' }
    ],

    /* ---------- 幕末共鸣检定（DESIGN §1.4） ---------- */
    ACT_THRESHOLDS: { 1: 12, 2: 26, 3: 42 },  /* classic 14 回合基准 */
    THRESHOLD_REF_ROUNDS: 14,
    ACT_SCORE_WEIGHT: { heart: 1, sync: 1.2, tension: 0.8, gentle: 2 },
    ACT_REWARD: { coins: 5, token: true },
    ADAPT: { starBias: -1, minStar: 1, biasFloor: -2 },

    /* ---------- 抽牌（DESIGN §1.1 / §1.5） ---------- */
    DRAW: {
      handSize: 3,
      maxSameType: 2,
      /* 幕强度 → 星级权重（会被 maxStar / 自适应 bias 裁剪） */
      starWeights: {
        1: { 1: 46, 2: 30, 3: 15, 4: 7, 5: 2 },
        2: { 1: 20, 2: 31, 3: 28, 4: 15, 5: 6 },
        3: { 1: 10, 2: 20, 3: 29, 4: 25, 5: 16 }
      },
      typeWeights: { truth: 30, dare: 25, touch: 20, sync: 12, spark: 13 },
      sparkMinMaxStar: 4,
      deepPreferPools: ['spark', 'touch', 'dare', 'truth', 'sync'],
      usedResetOnEmpty: true
    },
    GENTLE_ONLY: { maxStar: 2, blockTags: ['束缚', '露出', '道具', '喝酒', '蒙眼'] },

    /* ---------- 黑名单 ---------- */
    BLACKLIST: { maxEntries: 100, maxLen: 40 },

    /* ---------- 结局（DESIGN §1.4，6 结局；CONTENT.endings 优先） ---------- */
    ENDINGS: [
      { id: 'safe', name: '海面下的拥抱', kind: 'safe', desc: '安全词响起时，船把你们轻轻放回浅水。' },
      { id: 'slow', name: '慢一点，也很靠近', kind: 'slow', desc: '温柔值足够，心动也在。' },
      { id: 'frequency', name: '同一个频率', kind: 'frequency', desc: '默契与心动一起亮起来。' },
      { id: 'undercurrent', name: '不眠的暗涌', kind: 'undercurrent', desc: '张力把夜拉得很长。' },
      { id: 'dawn', name: '天亮之前', kind: 'dawn', desc: '心动够了，天还没亮。' },
      { id: 'each', name: '各自听见的海', kind: 'each', desc: '兜底：也有各自的海。' }
    ],
    /* 内置结局判定（CONTENT 缺失/无命中时使用；顺序即优先级） */
    ENDING_RULES: [
      { id: 'safe', test: function (s) { return !!(s.flags && s.flags.safeWord); } },
      { id: 'slow', test: function (s) { return s.gentle >= 3 && s.resources.heart >= 6; } },
      { id: 'frequency', test: function (s) { return s.resources.sync >= 15 && s.resources.heart >= 8; } },
      { id: 'undercurrent', test: function (s) { return s.resources.tension >= 18; } },
      { id: 'dawn', test: function (s) { return s.resources.heart >= 14; } },
      { id: 'each', test: function () { return true; } }
    ],

    /* ---------- 奖项（≥2；CONTENT.awards 优先，缺额用内置补齐） ---------- */
    AWARDS_MIN: 2,
    AWARDS_MAX: 3,
    AWARDS: [
      { id: 'combo', name: '连击王', icon: '⚡', desc: '最大连击最高', test: function (s) { return s.maxCombo >= 3; } },
      { id: 'deep', name: '深潜者', icon: '🌊', desc: '完成过加码深潜', test: function (s) { return !!s.flags.deepDone; } },
      { id: 'gentle', name: '温柔守护', icon: '🕯️', desc: '温柔值 ≥3', test: function (s) { return s.gentle >= 3; } },
      { id: 'brave', name: '最高星', icon: '🌟', desc: '见过 ★4 以上', test: function (s) { return s.maxStarSeen >= 4; } },
      { id: 'together', name: '一起走完', icon: '🪢', desc: '完成整晚', test: function () { return true; } }
    ],

    /* ---------- 兜底卡（题库空/过滤过严时保证 3 张手牌） ---------- */
    FALLBACK_CARDS: [
      { id: 'fb1', text: '用一个词形容此刻的对方。', star: 1, tags: [], src: 'ENGINE' },
      { id: 'fb2', text: '和对方对视十秒，先笑的人先说一句话。', star: 1, tags: [], src: 'ENGINE' },
      { id: 'fb3', text: '告诉对方：今晚你最想记住的一个瞬间。', star: 1, tags: [], src: 'ENGINE' }
    ],

    /* ---------- 数值纯函数（可供 UI 展示“预期收益”） ---------- */
    yieldFor: function (type, star) {
      var base = Balance.TYPE_YIELD[type] || {};
      var s = Math.max(1, Number(star) || 1);
      var out = {};
      for (var i = 0; i < Balance.RES_KEYS.length; i++) {
        var k = Balance.RES_KEYS[i];
        if (base[k]) out[k] = Math.max(Balance.YIELD.min, Math.round(base[k] * s / Balance.YIELD.starHalf));
      }
      return out;
    },
    coinsFor: function (star, combo) {
      var s = Math.max(1, Number(star) || 1);
      var c = Math.max(0, Number(combo) || 0);
      return s * Balance.COINS.perStar + Math.floor(c / Balance.COINS.comboDiv);
    },
    actThreshold: function (act, rounds) {
      var base = Balance.ACT_THRESHOLDS[act] || Balance.ACT_THRESHOLDS[3];
      var ref = Balance.THRESHOLD_REF_ROUNDS;
      var r = Math.max(1, Number(rounds) || ref);
      return Math.max(1, Math.round(base * r / ref));
    },
    actScore: function (state) {
      var w = Balance.ACT_SCORE_WEIGHT;
      var r = (state && state.resources) || {};
      return Math.round(((r.heart || 0) * w.heart + (r.sync || 0) * w.sync + (r.tension || 0) * w.tension + ((state && state.gentle) || 0) * w.gentle) * 10) / 10;
    },
    totalRounds: function (length) {
      var cfg = Balance.LENGTHS[length] || Balance.LENGTHS[Balance.DEFAULT_LENGTH];
      return cfg.rounds;
    },
    actEndRound: function (length, act) {
      var cfg = Balance.LENGTHS[length] || Balance.LENGTHS[Balance.DEFAULT_LENGTH];
      var n = 0;
      for (var i = 0; i < act && i < cfg.acts.length; i++) n += cfg.acts[i];
      return n;
    },
    actOfRound: function (length, round) {
      var cfg = Balance.LENGTHS[length] || Balance.LENGTHS[Balance.DEFAULT_LENGTH];
      var acc = 0;
      for (var i = 0; i < cfg.acts.length; i++) {
        acc += cfg.acts[i];
        if (round <= acc) return i + 1;
      }
      return cfg.acts.length;
    },
    endingById: function (id) {
      for (var i = 0; i < Balance.ENDINGS.length; i++) if (Balance.ENDINGS[i].id === id) return Balance.ENDINGS[i];
      return Balance.ENDINGS[Balance.ENDINGS.length - 1];
    }
  };

  root.Balance = Balance;
  if (typeof module !== 'undefined' && module.exports) module.exports = Balance;
})(typeof window !== 'undefined' ? window : this);
