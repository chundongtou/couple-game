/* ==========================================================================
 * 今晚在这间公寓 —— 数值与规则常量
 * 纯数据。引擎只读这里，不写死收益。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var Balance = {
    VERSION: 2,
    SESSION_VERSION: 2,

    ROOMS: ['living', 'kitchen', 'balcony', 'bathroom', 'bedroom'],
    ROOM_META: {
      living: { id: 'living', name: '客厅', play: 'talk', hint: '沙发上的话' },
      kitchen: { id: 'kitchen', name: '厨房', play: 'dare', hint: '做到的事' },
      balcony: { id: 'balcony', name: '阳台', play: 'thermo', hint: '今晚的温度' },
      bathroom: { id: 'bathroom', name: '浴室', play: 'truth', hint: '要说的真话' },
      bedroom: { id: 'bedroom', name: '卧室', play: 'close', hint: '更近的话或动作' }
    },

    /* 1 温柔 / 2 暧昧 / 3 热烈 / 4 不设限 */
    INTENSITY: {
      1: { id: 1, name: '温柔', key: 'tender' },
      2: { id: 2, name: '暧昧', key: 'flirt' },
      3: { id: 3, name: '热烈', key: 'hot' },
      4: { id: 4, name: '不设限', key: 'open' }
    },

    /* 开场热度。热烈 / 不设限一进门就已经带电。 */
    HEAT_START: { 1: 4, 2: 14, 3: 28, 4: 40 },
    /* 走路与完成时的热度倍率。 */
    HEAT_MULT: { 1: 0.55, 2: 1, 3: 1.55, 4: 1.8 },
    VISIT_HEAT: { living: 8, kitchen: 12, balcony: 9, bathroom: 10, bedroom: 14 },
    REVISIT_RATIO: 0.35,
    HEAT_MAX: 100,
    /* quiet < 22 <= warm < 48 <= charged < 72 <= burning */
    HEAT_WARM: 22,
    HEAT_CHARGED: 48,
    HEAT_BURNING: 72,

    ROOM_MINUTES: { living: 16, kitchen: 14, balcony: 12, bathroom: 12, bedroom: 22 },
    START_MINUTES: 21 * 60 + 40,

    REROLLS: { truth: 2, dare: 2 },

    /* 尺度封顶（卡面星级 1–5）。温柔锁在 1；暧昧最多到 3（热了或再深一点）；
       热烈开场就能到 4，热起来开放 5；不设限从第一句就是 5。 */
    BAND: {
      1: { baseMax: 1, hotMax: 1, hotAt: 999, prefer: 1, preferHot: 1, preferHotAt: 999 },
      2: { baseMax: 2, hotMax: 3, hotAt: 46, prefer: 1, preferHot: 2, preferHotAt: 32 },
      3: { baseMax: 4, hotMax: 5, hotAt: 34, prefer: 2, preferMid: 3, preferMidAt: 22, preferHot: 4, preferHotAt: 48 },
      4: { baseMax: 5, hotMax: 5, hotAt: 0, prefer: 3, preferHot: 4, preferHotAt: 55 }
    },

    GENTLE_BLOCK_TAGS: ['束缚', '露出', '道具', '蒙眼'],

    /* 露骨词：温柔与暧昧抽牌时排除（星级打漏的也排除）。热烈 / 不设限不使用这条。 */
    EXPLICIT_SRC: '口交|插入|高潮|射精|射了|射在|全裸|裸体|自慰|肉棒|抽插|后入|骑乘|乳头|乳房|私处|下体|做爱|口爆|内射|调教|绑住|束缚|脱光|肛|潮吹|吞精|被口|口对方|口你|口我|阴茎|阴道|阴蒂|精液|深喉|坐脸',

    /* 只对温柔再收一层，避免星级打成 1 的直球漏进来。 */
    GENTLE_EXTRA_SRC: '做几次|做多少次|一天做|下不了床|叫出来|内裤|内衣|胸口|臀部|大腿内侧|舌吻|伸进|摸进|敏感部位|打屁股|湿了|硬了|喘给|呻吟',

    THERMO_LABELS: {
      1: ['还想聊天', '坐近一点', '靠着肩', '牵着手', '想被抱一下', '额头碰额头', '轻声说喜欢'],
      2: ['看着就好', '靠得很近', '吻在嘴角', '手停在腰上', '吻得更深', '衣领会松', '想被碰到衣服里', '今晚别只是抱'],
      3: ['还在说话', '吻深一点', '手放进来', '压近一点', '想被要', '别停在前戏', '去更暗的地方', '看着我做', '再狠一点', '现在就继续', '做到出汗'],
      4: ['还能等', '想被吻狠一点', '手不要停', '衣服可以脱掉', '想听你的声音', '别只是磨', '换到更近的地方', '照你想的来', '做到腿软', '今晚不用收着', '你想要到哪']
    },

    STROLL_TILES: [
      { id: 'sofa', room: 'living', name: '沙发' },
      { id: 'record', room: 'living', name: '唱片机' },
      { id: 'glass', room: 'kitchen', name: '杯沿' },
      { id: 'counter', room: 'kitchen', name: '台面' },
      { id: 'rain', room: 'balcony', name: '窗边的雨' },
      { id: 'rail', room: 'balcony', name: '栏杆' },
      { id: 'mirror', room: 'bathroom', name: '镜子' },
      { id: 'steam', room: 'bathroom', name: '热水' },
      { id: 'bed', room: 'bedroom', name: '床沿' },
      { id: 'lamp', room: 'bedroom', name: '床头灯' },
      { id: 'rug', room: 'living', name: '地毯' },
      { id: 'hall', room: 'kitchen', name: '过道' }
    ],

    MEMORY_TITLE: '今晚在这间公寓',
    MEMORY_LINES: {
      safe: '你们先回去把灯关了。已经做过的、说过的，都留在这页上。没有要扣的，也没有要道歉的。',
      empty: '灯还没在房间里停久。这一页很短，也算今晚。',
      warm: '有几间房亮过。谁问了，谁做了，都写在这里，不打分。',
      deep: '房间一间间热起来。这一页只记你们真的走过的，不评价。'
    },

    FALLBACK_CARDS: [
      { id: 'fb1', text: '用一个词，说你现在看见对方的样子。', star: 1, tags: [], pool: 'truth' },
      { id: 'fb2', text: '看着对方的眼睛，说一件你一直记得的小事。', star: 1, tags: [], pool: 'truth' },
      { id: 'fb3', text: '把手放在对方手背上，停十秒，再说一句实话。', star: 1, tags: [], pool: 'sync' },
      { id: 'fb4', text: '问对方：此刻你更想说话，还是先靠着？', star: 1, tags: [], pool: 'truth' },
      { id: 'fb5', text: '坐近一点，说你今晚想把灯留到多晚。', star: 1, tags: [], pool: 'truth' }
    ],

    BOUNDARIES: [
      { id: '束缚', name: '束缚' },
      { id: '露出', name: '露出' },
      { id: '道具', name: '道具' },
      { id: '喝酒', name: '喝酒' },
      { id: '蒙眼', name: '蒙眼' },
      { id: '角色', name: '角色' }
    ],

    DEFAULT_SETTINGS: {
      maxStar: 3,
      sound: true,
      haptics: true,
      reduced: false,
      gentleOnly: false,
      blacklist: [],
      names: { a: '他', b: '她' }
    },

    stageOf: function (heat) {
      var h = Number(heat) || 0;
      if (h >= Balance.HEAT_BURNING) return 'burning';
      if (h >= Balance.HEAT_CHARGED) return 'charged';
      if (h >= Balance.HEAT_WARM) return 'warm';
      return 'quiet';
    },
    stageLabel: function (heat) {
      var s = Balance.stageOf(heat);
      if (s === 'burning') return '很深了';
      if (s === 'charged') return '已经烫';
      if (s === 'warm') return '热起来了';
      return '还轻';
    }
  };

  root.Balance = Balance;
  if (typeof module !== 'undefined' && module.exports) module.exports = Balance;
})(typeof window !== 'undefined' ? window : this);
