/* ==========================================================================
 * 今晚飞行棋 · 抽题
 * 词表从公寓 balance.js 原样迁出，不重写、不读热度。边界永远优先。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var SCALE_CAP = { gentle: 1, warm: 2, hot: 3, open: 4 };

  /* 与 app/src/engine/balance.js 同一份词表，不改写。 */
  var GENTLE_BLOCK_TAGS = ['束缚', '露出', '道具', '蒙眼'];
  var EXPLICIT_SRC = '口交|插入|高潮|射精|射了|射在|全裸|裸体|自慰|肉棒|抽插|后入|骑乘|乳头|乳房|私处|下体|做爱|口爆|内射|调教|绑住|束缚|脱光|肛|潮吹|吞精|被口|口对方|口你|口我|阴茎|阴道|阴蒂|精液|深喉|坐脸';
  var GENTLE_EXTRA_SRC = '做几次|做多少次|一天做|下不了床|叫出来|内裤|内衣|胸口|臀部|大腿内侧|舌吻|伸进|摸进|敏感部位|打屁股|湿了|硬了|喘给|呻吟';
  var FALLBACK_CARDS = [
    { id: 'fb1', text: '用一个词，说你现在看见对方的样子。', star: 1, tags: [], pool: 'truth' },
    { id: 'fb2', text: '看着对方的眼睛，说一件你一直记得的小事。', star: 1, tags: [], pool: 'truth' },
    { id: 'fb3', text: '把手放在对方手背上，停十秒，再说一句实话。', star: 1, tags: [], pool: 'sync' },
    { id: 'fb4', text: '问对方：此刻你更想说话，还是先靠着？', star: 1, tags: [], pool: 'truth' },
    { id: 'fb5', text: '坐近一点，说你今晚想把灯留到多晚。', star: 1, tags: [], pool: 'truth' }
  ];

  var POOLS = ['truth', 'dare', 'touch', 'sync', 'spark', 'punish'];

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function createRng(seed) {
    var a = (Number(seed) >>> 0) || 1;
    return {
      next: function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      },
      state: function () { return a >>> 0; }
    };
  }

  function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }

  function capOf(state) {
    if (state && SCALE_CAP[state.scale]) return SCALE_CAP[state.scale];
    var n = Number(state && state.maxStarCap);
    if (n >= 1 && n <= 4) return n;
    return 2;
  }

  function band(state) {
    var cap = capOf(state);
    /* 无热度。暧昧偏向 2 星；热烈 / 不设限把偏好抬高，不设限再加成 4–5 星。 */
    var table = {
      1: { cap: 1, maxStar: 1, minPrefer: 1 },
      2: { cap: 2, maxStar: 3, minPrefer: 2 },
      3: { cap: 3, maxStar: 5, minPrefer: 3 },
      4: { cap: 4, maxStar: 5, minPrefer: 4 }
    };
    return table[cap] || table[1];
  }

  function boundaryList(state) {
    var raw = [];
    if (state && Array.isArray(state.boundaries)) raw = raw.concat(state.boundaries);
    if (state && Array.isArray(state.blacklist)) raw = raw.concat(state.blacklist);
    if (state && state.settings && Array.isArray(state.settings.blacklist)) raw = raw.concat(state.settings.blacklist);
    var out = [];
    var seen = {};
    raw.forEach(function (item) {
      var n = norm(item);
      if (!n || seen[n]) return;
      seen[n] = true;
      out.push(n);
    });
    return out;
  }

  function hitsBoundary(card, state) {
    var list = boundaryList(state);
    if (!list.length || !card) return false;
    var tags = (card.tags || []).map(norm);
    var text = norm(card.text);
    for (var i = 0; i < list.length; i++) {
      if (tags.indexOf(list[i]) >= 0) return true;
      if (list[i] && text.indexOf(list[i]) >= 0) return true;
    }
    return false;
  }

  function allowed(card, state) {
    if (!card || !card.text) return false;
    var pool = card.pool || card.type;
    if (pool === 'punish' || card.type === 'punish') return false;
    var bd = band(state);
    var star = Number(card.star) || 1;
    if (star > bd.maxStar) return false;
    if (hitsBoundary(card, state)) return false;
    if (bd.cap <= 2 && new RegExp(EXPLICIT_SRC).test(card.text)) return false;
    if (bd.cap <= 1) {
      if (star !== 1) return false;
      if (new RegExp(GENTLE_EXTRA_SRC).test(card.text)) return false;
      var tags = card.tags || [];
      for (var i = 0; i < tags.length; i++) {
        if (GENTLE_BLOCK_TAGS.indexOf(tags[i]) >= 0) return false;
      }
    }
    if ((pool === 'spark' || card.type === 'spark') && bd.maxStar < 4) return false;
    return true;
  }

  function weightOf(card, bd, mild) {
    var s = Number(card.star) || 1;
    if (mild) return Math.max(1, 7 - s);
    if (bd.cap === 2) {
      if (s === 2) return 20;
      if (s === 1) return 4;
      return 3;
    }
    var w = 1;
    if (s >= bd.minPrefer) w = 6 + (s - bd.minPrefer) * 4;
    else if (s >= bd.minPrefer - 1) w = 2;
    if (bd.cap >= 4 && s >= 4) w += 10;
    else if (bd.cap === 3 && s >= 4) w += 3;
    return w;
  }

  function library() {
    var C = (global.CARDS || {});
    return C;
  }

  function rngOf(state) { return createRng(state.rng || 1); }

  function saveRng(state, rng) { state.rng = rng.state(); }

  function collect(state, pool, ignoreUsed) {
    var bd = band(state);
    var used = (state.usedCards && state.usedCards[pool]) || {};
    var list = library()[pool] || [];
    var items = [];
    for (var i = 0; i < list.length; i++) {
      var raw = list[i];
      if (!ignoreUsed && used[raw.id]) continue;
      var card = {
        id: raw.id,
        text: raw.text,
        star: raw.star,
        tags: raw.tags || [],
        pool: pool,
        type: pool,
        src: raw.src || ''
      };
      if (!allowed(card, state)) continue;
      items.push(card);
    }
    return items;
  }

  function pickWeighted(items, rng, bd, mild) {
    var total = 0;
    var weights = [];
    for (var i = 0; i < items.length; i++) {
      var w = weightOf(items[i], bd, mild);
      weights.push(w);
      total += w;
    }
    if (total <= 0) return items[0];
    var t = rng.next() * total;
    for (var j = 0; j < items.length; j++) {
      t -= weights[j];
      if (t < 0) return items[j];
    }
    return items[items.length - 1];
  }

  function takePool(state, pool, mild) {
    var items = collect(state, pool, false);
    if (!items.length) {
      state.usedCards = state.usedCards || {};
      state.usedCards[pool] = {};
      items = collect(state, pool, false);
    }
    if (!items.length) return null;
    var rng = rngOf(state);
    var card = pickWeighted(items, rng, band(state), mild);
    saveRng(state, rng);
    state.usedCards = state.usedCards || {};
    state.usedCards[pool] = state.usedCards[pool] || {};
    state.usedCards[pool][card.id] = true;
    return card;
  }

  function poolsFor(purpose, cap) {
    if (purpose === 'cell-truth') return ['truth'];
    if (purpose === 'cell-dare') return ['dare'];
    if (purpose === 'cell-touch') return ['touch'];
    if (purpose === 'truth') return ['truth'];
    if (purpose === 'dare') return ['dare'];
    if (purpose === 'touch') return ['touch'];
    if (purpose === 'sync') return ['sync'];
    if (purpose === 'spark') return ['spark'];
    if (purpose === 'fate') return fatePools(cap);
    if (purpose === 'capture') {
      var caps = ['dare', 'touch', 'truth'];
      /* V6 尺度区分：spark 池只对「不设限」开放（AUD-13）。 */
      if (cap >= 4) caps.push('spark');
      return caps;
    }
    if (purpose === 'stack-duo') return ['sync', 'touch'];
    if (purpose === 'home-entry' || purpose === 'ending') {
      var home = ['truth', 'touch', 'dare'];
      if (cap >= 4) home.push('spark');
      return home;
    }
    return ['truth'];
  }

  /* 命运格：两个不同池各抽一张，二选一；尺度越高越靠近 spark。
   * 温柔/暧昧 = 真心话 + 靠近；热烈 = 大冒险 + 真心话；不设限 = spark + 真心话。 */
  function fatePools(cap) {
    var n = Number(cap) || 2;
    if (n >= 4) return ['spark', 'cell-truth'];
    if (n >= 3) return ['cell-dare', 'cell-truth'];
    return ['cell-touch', 'cell-truth'];
  }

  function fallback(state) {
    var rng = rngOf(state);
    var card = FALLBACK_CARDS[Math.floor(rng.next() * FALLBACK_CARDS.length)];
    saveRng(state, rng);
    return {
      id: card.id,
      text: card.text,
      star: 1,
      tags: [],
      pool: card.pool || 'truth',
      type: card.pool || 'truth',
      fallback: true,
      src: 'flight'
    };
  }

  function take(state, purpose) {
    var s = clone(state || {});
    s.usedCards = s.usedCards || {};
    POOLS.forEach(function (p) {
      if (!s.usedCards[p]) s.usedCards[p] = {};
    });
    if (!s.rng) s.rng = 1;
    var bd = band(s);
    var pools = poolsFor(purpose, bd.cap);
    var mild = purpose === 'ending';
    var card = null;
    for (var i = 0; i < pools.length; i++) {
      card = takePool(s, pools[i], mild);
      if (card) break;
    }
    if (!card) card = fallback(s);
    return { state: s, card: card };
  }

  root.FlightDraw = {
    SCALE_CAP: SCALE_CAP,
    GENTLE_BLOCK_TAGS: GENTLE_BLOCK_TAGS,
    EXPLICIT_SRC: EXPLICIT_SRC,
    GENTLE_EXTRA_SRC: GENTLE_EXTRA_SRC,
    FALLBACK_CARDS: FALLBACK_CARDS,
    allowed: allowed,
    band: band,
    take: take,
    poolsFor: poolsFor,
    fatePools: fatePools,
    weightOf: weightOf
  };
})(typeof window !== 'undefined' ? window : this);
