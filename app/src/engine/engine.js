/* ==========================================================================
 * 升温夜航 · V3 重制版 —— 规则引擎（唯一规则权威）
 * app/src/engine/engine.js
 *
 * 约定：
 *  - window.App.Engine；纯逻辑，无 DOM、无 localStorage、无网络。
 *  - 所有动作返回新 state（不可变更新，内部 JSON 深拷贝）；不修改入参。
 *  - 两种返回形态：
 *      · 状态型动作（newSession / startRound / reroll / chooseCard / leaveAct）
 *        返回 state，并附带不可枚举的 `.events` 与 `.state`，因此
 *        `r = Engine.reroll(s); r.round` 与 `r.state.round`、`r.events` 都可用。
 *      · 结算型动作（complete / skip / escalate* / nextRound / chooseEvent /
 *        shopBuy / finish / safeWord / useShield）返回 `{state, events}`。
 *  - events 类型固定为：gain | skip | combo | actEnd | ending | token | shop | stage
 *    （被拒绝的动作也返回 stage 事件并带 blocked:true，UI 可 toast）。
 *  - 确定性：内部 RNG = mulberry32(seed)，状态里保存 `rng` 游标；
 *    newSession(settings, names, seed?) 的 seed 也可来自 settings.seed。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var EVENTS = ['gain', 'skip', 'combo', 'actEnd', 'ending', 'token', 'shop', 'stage'];
  var PHASES = ['draft', 'play', 'resolve', 'escalate', 'event', 'act', 'shop', 'finale'];

  function B() { return root.Balance; }
  function cardsRoot() { return global.CARDS || {}; }
  function contentRoot() { return global.CONTENT || null; }

  /* ---------------------------- 基础工具 ---------------------------- */
  function clone(o) { return o === null || o === undefined ? o : JSON.parse(JSON.stringify(o)); }
  function isArr(o) { return Object.prototype.toString.call(o) === '[object Array]'; }
  function isObj(o) { return !!o && typeof o === 'object' && !isArr(o); }
  function isNum(n) { return typeof n === 'number' && isFinite(n); }
  function clamp(n, lo, hi) { n = Number(n); if (!isFinite(n)) n = lo; return Math.max(lo, Math.min(hi, n)); }
  function clampInt(n, lo, hi) { n = Math.round(Number(n)); if (!isFinite(n)) n = lo; return Math.max(lo, Math.min(hi, n)); }
  function intOr(n, d) { n = Math.round(Number(n)); return isFinite(n) ? n : d; }
  function nowMs() { return Date.now(); }

  /* mulberry32：确定性 PRNG（DESIGN §4） */
  function mulberry32(seed) {
    var a = (Number(seed) >>> 0) || 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function nextRand(state) {
    var fn = mulberry32(state.rng);
    var v = fn();
    state.rng = (state.rng + 0x6D2B79F5) >>> 0;
    return v;
  }
  function pickOne(state, arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(nextRand(state) * arr.length)];
  }

  /* ---------------------------- 卡牌索引 ---------------------------- */
  var _cardsRef = null;
  var _index = null;
  var _fallback = null;

  function fallbackMap() {
    if (_fallback) return _fallback;
    _fallback = {};
    var list = (B() && B().FALLBACK_CARDS) || [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      _fallback['fallback:' + c.id] = { key: 'fallback:' + c.id, pool: 'fallback', id: c.id, card: c };
    }
    return _fallback;
  }

  function ensureIndex() {
    var C = cardsRoot();
    if (_cardsRef === C && _index) return _index;
    _cardsRef = C;
    _index = { byKey: {}, byPool: {}, all: [] };
    var pools = Object.keys(C || {});
    for (var p = 0; p < pools.length; p++) {
      var pool = pools[p];
      var arr = C[pool] || [];
      _index.byPool[pool] = _index.byPool[pool] || [];
      for (var i = 0; i < arr.length; i++) {
        var card = arr[i];
        if (!card || !card.id) continue;
        var key = pool + ':' + card.id;
        if (_index.byKey[key]) continue;
        var rec = { key: key, pool: pool, id: String(card.id), card: card };
        _index.byKey[key] = rec;
        _index.byPool[pool].push(rec);
        _index.all.push(rec);
      }
    }
    return _index;
  }

  function resolveCardKey(key) {
    if (key === null || key === undefined) return null;
    var fb = fallbackMap();
    if (typeof key === 'string' && fb[key]) return fb[key];
    var idx = ensureIndex();
    if (typeof key === 'string') {
      if (idx.byKey[key]) return idx.byKey[key];
      /* 兼容裸 id：仅在唯一时可解析 */
      if (key.indexOf(':') < 0) {
        var found = null;
        for (var pool in idx.byPool) {
          if (!Object.prototype.hasOwnProperty.call(idx.byPool, pool)) continue;
          var list = idx.byPool[pool];
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === key) {
              if (found) return null;
              found = list[i];
            }
          }
        }
        if (found) return found;
      }
    }
    return null;
  }

  function recInfo(rec, overrideStar) {
    if (!rec) return null;
    var card = rec.card || {};
    return {
      key: rec.key,
      id: rec.id,
      pool: rec.pool,
      type: rec.pool,
      text: card.text || '',
      star: Math.max(1, intOr(overrideStar, intOr(card.star, 1))),
      tags: (card.tags || []).slice(),
      src: card.src || ''
    };
  }

  /* ---------------------------- 设置与过滤 ---------------------------- */
  function normalizeBlacklist(list) {
    var b = B();
    var out = [];
    if (!list) return out;
    if (typeof list === 'string') list = [list];
    if (!isArr(list)) return out;
    for (var i = 0; i < list.length && out.length < b.BLACKLIST.maxEntries; i++) {
      var v = String(list[i] === null || list[i] === undefined ? '' : list[i]).trim();
      if (!v) continue;
      if (v.length > b.BLACKLIST.maxLen) v = v.slice(0, b.BLACKLIST.maxLen);
      if (out.indexOf(v) < 0) out.push(v);
    }
    return out;
  }

  function normalizeSettings(input) {
    var b = B();
    var s = isObj(input) ? input : {};
    var def = b.DEFAULT_SETTINGS;
    var out = {
      maxStar: clampInt(s.maxStar === undefined ? def.maxStar : s.maxStar, b.MAX_STAR_MIN, b.MAX_STAR_MAX),
      length: b.LENGTHS[s.length] ? s.length : def.length,
      sound: s.sound === undefined ? def.sound : !!s.sound,
      haptics: s.haptics === undefined ? def.haptics : !!s.haptics,
      reduced: s.reduced === undefined ? def.reduced : !!s.reduced,
      safeHold: clamp(s.safeHold === undefined ? def.safeHold : s.safeHold, 1, 10),
      blacklist: normalizeBlacklist(s.blacklist),
      gentleOnly: s.gentleOnly === undefined ? def.gentleOnly : !!s.gentleOnly
    };
    if (s.seed !== undefined) out.seed = (Number(s.seed) >>> 0);
    if (s.volume !== undefined) out.volume = clamp(s.volume, 0, 1);
    if (isNum(s.hapticsStrength)) out.hapticsStrength = clamp(s.hapticsStrength, 0, 1);
    return out;
  }

  function effectiveMaxStar(state) {
    var b = B();
    var s = state && state.settings ? state.settings : {};
    var maxS = clampInt(s.maxStar, b.MAX_STAR_MIN, b.MAX_STAR_MAX);
    if (s.gentleOnly) maxS = Math.min(maxS, b.GENTLE_ONLY.maxStar);
    return maxS;
  }

  function isBlacklisted(card, blacklist) {
    if (!blacklist || !blacklist.length) return false;
    var text = String(card.text || '');
    var tags = card.tags || [];
    for (var i = 0; i < blacklist.length; i++) {
      var kw = blacklist[i];
      if (!kw) continue;
      if (text.indexOf(kw) >= 0) return true;
      if (tags.indexOf(kw) >= 0) return true;
    }
    return false;
  }

  function isAllowed(state, rec) {
    var b = B();
    var card = rec.card || {};
    var star = intOr(card.star, 1);
    if (star < 1) return false;
    if (star > effectiveMaxStar(state)) return false;
    if (state.settings && state.settings.gentleOnly) {
      if (star > b.GENTLE_ONLY.maxStar) return false;
      var tags = card.tags || [];
      var block = b.GENTLE_ONLY.blockTags || [];
      for (var i = 0; i < block.length; i++) if (tags.indexOf(block[i]) >= 0) return false;
    }
    if (isBlacklisted(card, state.settings ? state.settings.blacklist : null)) return false;
    return true;
  }

  /* ---------------------------- 洗牌袋 ---------------------------- */
  function isUsed(state, pool, id) {
    return !!(state.usedCards && state.usedCards[pool] && state.usedCards[pool][id]);
  }
  function markUsed(state, pool, id) {
    state.usedCards = state.usedCards || {};
    state.usedCards[pool] = state.usedCards[pool] || {};
    state.usedCards[pool][id] = true;
  }
  function unmarkUsed(state, key) {
    var rec = resolveCardKey(key);
    if (!rec || rec.pool === 'fallback') return;
    if (state.usedCards && state.usedCards[rec.pool]) delete state.usedCards[rec.pool][rec.id];
  }
  function resetUsed(state, pools) {
    state.usedCards = state.usedCards || {};
    var list = pools || (B().DRAW_POOLS || []);
    for (var i = 0; i < list.length; i++) state.usedCards[list[i]] = {};
  }

  /* ---------------------------- 抽牌 ---------------------------- */
  function pickStarForAct(state) {
    var b = B();
    var maxS = effectiveMaxStar(state);
    var act = clampInt(state.act, 1, 3);
    var weights = b.DRAW.starWeights[act] || b.DRAW.starWeights[3];
    var bag = [];
    for (var s = 1; s <= maxS; s++) {
      var w = intOr(weights[s], 0);
      for (var i = 0; i < w; i++) bag.push(s);
    }
    if (!bag.length) for (var j = 1; j <= maxS; j++) bag.push(j);
    var star = bag[Math.floor(nextRand(state) * bag.length)] || 1;
    star = clamp(star + intOr(state.drawBias, 0), b.ADAPT.minStar, maxS);
    return star;
  }

  function collectCandidates(state, opt) {
    opt = opt || {};
    var b = B();
    var idx = ensureIndex();
    var out = [];
    var pools = opt.pools || b.DRAW_POOLS;
    var maxS = effectiveMaxStar(state);
    for (var p = 0; p < pools.length; p++) {
      var pool = pools[p];
      if (pool === 'spark' && !opt.allowSpark && maxS < b.DRAW.sparkMinMaxStar) continue;
      if (opt.excludeTypes && opt.excludeTypes.indexOf(pool) >= 0) continue;
      var list = idx.byPool[pool] || [];
      for (var i = 0; i < list.length; i++) {
        var rec = list[i];
        if (!isAllowed(state, rec)) continue;
        var star = intOr(rec.card.star, 1);
        if (opt.star && !opt.ignoreStar && star !== opt.star) continue;
        if (!opt.ignoreUsed && isUsed(state, rec.pool, rec.id)) continue;
        out.push(rec);
      }
    }
    return out;
  }

  function weightedPick(state, recs) {
    var b = B();
    if (!recs || !recs.length) return null;
    var total = 0;
    var weights = [];
    for (var i = 0; i < recs.length; i++) {
      var w = (b.DRAW.typeWeights[recs[i].pool] || 1);
      weights.push(w);
      total += w;
    }
    var r = nextRand(state) * total;
    for (var j = 0; j < recs.length; j++) {
      r -= weights[j];
      if (r <= 0) return recs[j];
    }
    return recs[recs.length - 1];
  }

  /* 抽一张；带 6 级放宽，保证不崩 */
  function drawOne(state, opt) {
    opt = opt || {};
    var b = B();
    var maxS = effectiveMaxStar(state);
    var allowSpark = opt.allowSpark;
    if (allowSpark === undefined) allowSpark = maxS >= b.DRAW.sparkMinMaxStar;
    var base = {
      star: opt.star || null,
      excludeTypes: opt.excludeTypes || null,
      allowSpark: allowSpark,
      pools: opt.pools || null
    };
    /* 若所有资格卡都被 used 标记，视为本池用尽 -> 重洗 */
    var withUsed = collectCandidates(state, base);
    if (!withUsed.length) {
      var ignoring = collectCandidates(state, {
        star: base.star, excludeTypes: null, allowSpark: allowSpark, pools: base.pools, ignoreUsed: true
      });
      if (ignoring.length) resetUsed(state, base.pools || b.DRAW_POOLS);
    }
    var attempts = [
      base,
      { star: base.star, excludeTypes: null, allowSpark: allowSpark, pools: base.pools },
      { star: null, excludeTypes: null, allowSpark: allowSpark, pools: base.pools, ignoreStar: true },
      { star: null, excludeTypes: null, allowSpark: true, pools: null, ignoreStar: true }
    ];
    for (var a = 0; a < attempts.length; a++) {
      var rec = weightedPick(state, collectCandidates(state, attempts[a]));
      if (rec) {
        markUsed(state, rec.pool, rec.id);
        return rec;
      }
    }
    return null;
  }

  function drawIntoHand(state) {
    var b = B();
    var size = b.DRAW.handSize;
    state.hand = [];
    for (var i = 0; i < size; i++) {
      var counts = {};
      for (var h = 0; h < state.hand.length; h++) {
        var r0 = resolveCardKey(state.hand[h]);
        if (!r0) continue;
        counts[r0.pool] = (counts[r0.pool] || 0) + 1;
      }
      var exclude = [];
      for (var t in counts) {
        if (Object.prototype.hasOwnProperty.call(counts, t) && counts[t] >= b.DRAW.maxSameType) exclude.push(t);
      }
      var rec = drawOne(state, { star: pickStarForAct(state), excludeTypes: exclude });
      if (!rec) break;
      if (state.hand.indexOf(rec.key) >= 0) continue; /* 同手不重复；极端小池时由兜底补位 */
      state.hand.push(rec.key);
    }
    /* 兜底：题库空 / 过滤过严时保证 3 张 */
    var guard = 0;
    while (state.hand.length < size && guard < size * 3) {
      guard++;
      var fbList = b.FALLBACK_CARDS || [];
      var fb = fbList[state.hand.length % fbList.length];
      var key = 'fallback:' + fb.id;
      if (state.hand.indexOf(key) >= 0) break;
      state.hand.push(key);
    }
    return state.hand;
  }

  /* ---------------------------- 状态骨架 ---------------------------- */
  function blankState(settings, names, seed) {
    var b = B();
    var namesObj = { a: '你', b: 'TA' };
    if (isArr(names)) {
      namesObj = { a: String(names[0] || namesObj.a), b: String(names[1] || namesObj.b) };
    } else if (isObj(names)) {
      namesObj = { a: String(names.a || namesObj.a), b: String(names.b || namesObj.b) };
    }
    var settingsNorm = normalizeSettings(settings);
    var seedNum = (seed === undefined || seed === null || seed === '') ? null : (Number(seed) >>> 0);
    if (seedNum === null && settingsNorm.seed !== undefined) seedNum = settingsNorm.seed >>> 0;
    if (seedNum === null) seedNum = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    seedNum = seedNum >>> 0;
    return {
      v: b.SESSION_VERSION,
      id: 's' + seedNum.toString(36),
      ts: nowMs(),
      names: namesObj,
      settings: settingsNorm,
      act: 1,
      round: 1,
      host: 'a',
      resources: { heart: b.RESOURCE_START.heart, tension: b.RESOURCE_START.tension, sync: b.RESOURCE_START.sync, coins: b.RESOURCE_START.coins },
      gentle: 0,
      combo: 0,
      maxCombo: 0,
      skips: 0,
      completes: 0,
      maxStarSeen: 0,
      tokens: { shield: b.TOKEN_START.shield, reroll: b.TOKEN_START.reroll, escalate: b.TOKEN_START.escalate },
      hand: [],
      current: null,
      currentStar: null,
      phase: 'draft',
      usedCards: {},
      events: {},
      flags: {},
      log: [],
      result: null,
      rng: seedNum,
      drawBias: 0,
      gentleUsed: 0,
      escalated: false,
      escalatedDone: false,
      actScores: [],
      pendingActEnd: false,
      lastAct: false,
      seed: seedNum
    };
  }

  /* 把「动作产生的 UI 事件」挂到 state 上（不可枚举，不污染存档）。
   * 注意：state.events 是 DESIGN §3.3 的「事件选择表」，两者不能同名，
   * 因此动作事件挂在 .outEvents / .actionEvents。 */
  function emit(state, events) {
    var list = events || [];
    try {
      Object.defineProperty(state, 'outEvents', { value: list, enumerable: false, configurable: true, writable: true });
      Object.defineProperty(state, 'actionEvents', { value: list, enumerable: false, configurable: true, writable: true });
      Object.defineProperty(state, 'state', { get: function () { return state; }, enumerable: false, configurable: true });
    } catch (e) {
      state.outEvents = list;
      state.actionEvents = list;
      state.state = state;
    }
    return state;
  }

  function blocked(state, action, reason) {
    var ev = [{ type: 'stage', phase: state.phase, blocked: true, action: action, reason: reason || 'action_not_allowed' }];
    return { state: emit(clone(state), ev), events: ev };
  }
  function blockedState(state, action, reason) {
    var ev = [{ type: 'stage', phase: state.phase, blocked: true, action: action, reason: reason || 'action_not_allowed' }];
    return emit(clone(state), ev);
  }

  /* ---------------------------- 资源/日志 ---------------------------- */
  function addRes(state, deltas) {
    var applied = {};
    if (!deltas) return applied;
    var keys = B().RES_KEYS;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (!isNum(deltas[k]) || deltas[k] === 0) continue;
      var before = state.resources[k] || 0;
      state.resources[k] = clamp(before + deltas[k], 0, B().RESOURCE_MAX);
      applied[k] = state.resources[k] - before;
    }
    if (isNum(deltas.coins) && deltas.coins !== 0) {
      var cBefore = state.resources.coins || 0;
      state.resources.coins = clamp(cBefore + deltas.coins, 0, B().RESOURCE_MAX);
      applied.coins = state.resources.coins - cBefore;
    }
    if (isNum(deltas.gentle) && deltas.gentle !== 0) {
      state.gentle = clamp(state.gentle + deltas.gentle, 0, 99);
    }
    return applied;
  }

  function pushLog(state, entry) {
    state.log = state.log || [];
    state.log.push(entry);
    if (state.log.length > 200) state.log.shift();
  }

  function cardEventData(info) {
    if (!info) return null;
    return { key: info.key, id: info.id, pool: info.pool, type: info.type, text: info.text, star: info.star, tags: info.tags };
  }

  function grantComboToken(state, events) {
    var b = B();
    if (!state.combo || state.combo % b.COMBO.tokenEvery !== 0) return null;
    var tk = b.TOKEN_ROLLPOOL[Math.floor(nextRand(state) * b.TOKEN_ROLLPOOL.length)];
    state.tokens[tk] = clampInt((state.tokens[tk] || 0) + 1, 0, b.TOKEN_MAX);
    events.push({ type: 'token', token: tk, name: b.TOKEN_META[tk].name, delta: 1, combo: state.combo, reason: 'combo' });
    return tk;
  }

  /* ---------------------------- 生命周期 ---------------------------- */
  function newSession(settings, names, seed) {
    var s = blankState(settings, names, seed);
    s.phase = 'draft';
    drawIntoHand(s);
    return emit(s, [{ type: 'stage', phase: 'draft', round: s.round, act: s.act, host: s.host, hand: s.hand.slice() }]);
  }

  function startRound(state) {
    var s = clone(state);
    if (s.phase === 'finale') return emit(s, [{ type: 'stage', phase: 'finale' }]);
    if (s.phase !== 'draft') return emit(s, [{ type: 'stage', phase: s.phase, resumed: true }]);
    if (!s.hand || s.hand.length !== B().DRAW.handSize) drawIntoHand(s);
    return emit(s, [{ type: 'stage', phase: 'draft', round: s.round, act: s.act, host: s.host, hand: s.hand.slice() }]);
  }

  function reroll(state) {
    var s = clone(state);
    if (s.phase !== 'draft') return blockedState(s, 'reroll', 'wrong_phase');
    if (!s.tokens || (s.tokens.reroll || 0) <= 0) return blockedState(s, 'reroll', 'no_token');
    s.tokens.reroll = Math.max(0, (s.tokens.reroll || 0) - 1);
    for (var i = 0; i < (s.hand || []).length; i++) unmarkUsed(s, s.hand[i]);
    drawIntoHand(s);
    pushLog(s, { round: s.round, type: 'reroll' });
    return emit(s, [
      { type: 'token', token: 'reroll', name: B().TOKEN_META.reroll.name, delta: -1 },
      { type: 'stage', phase: 'draft', rerolled: true, hand: s.hand.slice(), round: s.round, act: s.act, host: s.host }
    ]);
  }

  function chooseCard(state, cardId) {
    var s = clone(state);
    if (s.phase !== 'draft') return blockedState(s, 'chooseCard', 'wrong_phase');
    var hand = s.hand || [];
    var key = null;
    if (typeof cardId === 'number' && cardId >= 0 && cardId < hand.length) {
      key = hand[Math.floor(cardId)];
    } else if (hand.indexOf(cardId) >= 0) {
      key = cardId;
    } else {
      for (var i = 0; i < hand.length; i++) {
        var rec = resolveCardKey(hand[i]);
        if (rec && (rec.id === cardId || rec.key === cardId)) { key = hand[i]; break; }
      }
    }
    var chosen = resolveCardKey(key);
    if (!chosen) return blockedState(s, 'chooseCard', 'card_not_in_hand');
    s.current = chosen.key;
    s.currentStar = null;
    s.escalated = false;
    s.phase = 'play';
    var info = recInfo(chosen, null);
    pushLog(s, { round: s.round, type: 'choose', cardId: chosen.key, text: info.text, star: info.star });
    return emit(s, [{ type: 'stage', phase: 'play', round: s.round, act: s.act, host: s.host, card: cardEventData(info) }]);
  }

  function currentCard(state) {
    if (!state || !state.current) return null;
    var rec = resolveCardKey(state.current);
    if (!rec) return null;
    var star = state.currentStar === null || state.currentStar === undefined ? rec.card.star : state.currentStar;
    return recInfo(rec, star);
  }

  function complete(state) {
    var s = clone(state);
    if (s.phase !== 'play') return blocked(s, 'complete', 'wrong_phase');
    var info = currentCard(s);
    if (!info) return blocked(s, 'complete', 'no_current_card');
    var b = B();
    s.combo = (s.combo || 0) + b.COMPLETE.combo;
    s.maxCombo = Math.max(s.maxCombo || 0, s.combo);
    s.completes = (s.completes || 0) + 1;
    s.maxStarSeen = Math.max(s.maxStarSeen || 0, info.star);
    var gain = b.yieldFor(info.pool, info.star);
    var coins = b.coinsFor(info.star, s.combo);
    gain.coins = coins;
    var applied = addRes(s, gain);
    s.phase = 'resolve';
    s.escalated = false;
    s.escalatedDone = false;
    pushLog(s, { round: s.round, type: 'complete', cardId: info.key, text: info.text, star: info.star, deltas: applied });
    var events = [
      { type: 'gain', reason: 'complete', res: applied, combo: s.combo, card: cardEventData(info) }
    ];
    if (s.combo > 0 && s.combo % b.COMBO.coinEvery === 0) events.push({ type: 'combo', n: s.combo, coinBonus: true });
    grantComboToken(s, events);
    events.push({ type: 'stage', phase: 'resolve', canEscalate: canEscalate(s) });
    return { state: emit(s, events), events: events };
  }

  function canEscalate(state) {
    if (!state || state.phase !== 'resolve' || !state.current || state.escalated) return false;
    var info = currentCard(state);
    if (!info) return false;
    var maxS = effectiveMaxStar(state);
    if (info.star < maxS) return true;
    if (info.star >= maxS && (state.tokens.escalate || 0) > 0) return true;
    return false;
  }

  function escalate(state) {
    var s = clone(state);
    if (!canEscalate(s)) return blocked(s, 'escalate', 'not_allowed');
    var b = B();
    var info = currentCard(s);
    var maxS = effectiveMaxStar(s);
    var target = clamp(info.star + b.ESCALATE.starStep, 1, maxS);
    var usedToken = info.star >= maxS;
    if (usedToken) s.tokens.escalate = Math.max(0, (s.tokens.escalate || 0) - 1);
    var preferPools = b.DRAW.deepPreferPools;
    var rec = drawOne(s, { star: target, allowSpark: true, pools: preferPools });
    if (!rec) rec = drawOne(s, { star: target, allowSpark: true });
    if (!rec) return blocked(s, 'escalate', 'no_card');
    s.escalated = true;
    s.current = rec.key;
    s.currentStar = intOr(rec.card.star, target);
    s.phase = 'escalate';
    var deepInfo = recInfo(rec, s.currentStar);
    pushLog(s, { round: s.round, type: 'escalate', cardId: deepInfo.key, text: deepInfo.text, star: deepInfo.star });
    var events = [
      { type: 'stage', phase: 'escalate', card: cardEventData(deepInfo), tokenUsed: usedToken }
    ];
    if (usedToken) events.push({ type: 'token', token: 'escalate', name: b.TOKEN_META.escalate.name, delta: -1, reason: 'max_star_deep' });
    return { state: emit(s, events), events: events };
  }

  function escalateComplete(state) {
    var s = clone(state);
    if (s.phase !== 'escalate') return blocked(s, 'escalateComplete', 'wrong_phase');
    var info = currentCard(s);
    if (!info) return blocked(s, 'escalateComplete', 'no_current_card');
    var b = B();
    s.combo = (s.combo || 0) + b.COMPLETE.combo;
    s.maxCombo = Math.max(s.maxCombo || 0, s.combo);
    s.completes = (s.completes || 0) + 1;
    s.maxStarSeen = Math.max(s.maxStarSeen || 0, info.star);
    s.flags = s.flags || {};
    s.flags.deepDone = true;
    var baseGain = b.yieldFor(info.pool, info.star);
    var gain = {};
    for (var i = 0; i < b.RES_KEYS.length; i++) {
      var k = b.RES_KEYS[i];
      if (baseGain[k]) gain[k] = baseGain[k] * b.ESCALATE.multiplier;
    }
    gain.coins = b.coinsFor(info.star, s.combo) * b.ESCALATE.multiplier;
    var applied = addRes(s, gain);
    s.phase = 'resolve';
    s.escalatedDone = true;
    pushLog(s, { round: s.round, type: 'escalateComplete', cardId: info.key, text: info.text, star: info.star, deltas: applied, mult: b.ESCALATE.multiplier });
    var events = [
      { type: 'gain', reason: 'escalateComplete', mult: b.ESCALATE.multiplier, res: applied, combo: s.combo, card: cardEventData(info) }
    ];
    if (s.combo > 0 && s.combo % b.COMBO.coinEvery === 0) events.push({ type: 'combo', n: s.combo, coinBonus: true });
    grantComboToken(s, events);
    events.push({ type: 'stage', phase: 'resolve', escalatedDone: true });
    return { state: emit(s, events), events: events };
  }

  function escalateSkip(state) {
    var s = clone(state);
    if (s.phase !== 'escalate') return blocked(s, 'escalateSkip', 'wrong_phase');
    var info = currentCard(s);
    var b = B();
    var applied = addRes(s, { heart: b.ESCALATE_SKIP.heart });
    s.combo = 0;
    s.skips = (s.skips || 0) + 1;
    s.phase = 'resolve';
    s.escalatedDone = true;
    pushLog(s, { round: s.round, type: 'escalateSkip', cardId: info ? info.key : null, deltas: applied });
    var events = [
      { type: 'skip', reason: 'escalateSkip', res: applied, gentle: 0, card: cardEventData(info) },
      { type: 'stage', phase: 'resolve' }
    ];
    return { state: emit(s, events), events: events };
  }

  function skip(state) {
    var s = clone(state);
    if (s.phase !== 'play') return blocked(s, 'skip', 'wrong_phase');
    var info = currentCard(s);
    var b = B();
    var applied = addRes(s, { tension: b.SKIP.tension, gentle: b.SKIP.gentle });
    s.combo = 0;
    s.skips = (s.skips || 0) + 1;
    s.phase = 'resolve';
    pushLog(s, { round: s.round, type: 'skip', cardId: info ? info.key : null, deltas: applied });
    var events = [
      { type: 'skip', reason: 'skip', res: applied, combo: 0, gentle: s.gentle, card: cardEventData(info) },
      { type: 'stage', phase: 'resolve', canEscalate: canEscalate(s) }
    ];
    return { state: emit(s, events), events: events };
  }

  function gentleDown(state) {
    var s = clone(state);
    if (s.phase !== 'play') return blocked(s, 'gentleDown', 'wrong_phase');
    var b = B();
    if ((s.gentleUsed || 0) >= b.GENTLE.maxUses) return blocked(s, 'gentleDown', 'no_uses_left');
    var info = currentCard(s);
    if (!info) return blocked(s, 'gentleDown', 'no_current_card');
    var next = info.star + b.GENTLE.starStep;
    s.gentleUsed = (s.gentleUsed || 0) + 1;
    s.gentle = clamp((s.gentle || 0) + 1, 0, 99);
    if (next <= 0) {
      var applied = addRes(s, { tension: b.SKIP.tension });
      s.combo = 0;
      s.skips = (s.skips || 0) + 1;
      s.phase = 'resolve';
      pushLog(s, { round: s.round, type: 'gentleSkip', cardId: info.key, deltas: applied });
      var evs = [
        { type: 'skip', reason: 'gentleToZero', gentle: s.gentle, res: applied },
        { type: 'stage', phase: 'resolve' }
      ];
      return { state: emit(s, evs), events: evs };
    }
    s.currentStar = next;
    pushLog(s, { round: s.round, type: 'gentleDown', cardId: info.key, star: next });
    var events = [{ type: 'stage', phase: 'play', gentleDown: true, star: next, usesLeft: b.GENTLE.maxUses - s.gentleUsed, card: cardEventData(info) }];
    return { state: emit(s, events), events: events };
  }

  /* ---------------------------- 幕末 / 事件 / 商店 ---------------------------- */
  function actInfo(state) {
    var b = B();
    var c = contentRoot();
    var act = clampInt(state && state.act, 1, 3);
    var cfg = b.LENGTHS[(state && state.settings && state.settings.length) || b.DEFAULT_LENGTH] || b.LENGTHS.classic;
    var actMeta = null;
    if (c && c.acts && c.acts[act - 1]) actMeta = c.acts[act - 1];
    return {
      act: act,
      index: act - 1,
      name: (actMeta && actMeta.name) || ('第 ' + act + ' 幕'),
      sub: (actMeta && actMeta.sub) || '',
      accent: (actMeta && actMeta.accent) || '',
      intro: (actMeta && actMeta.intro) || [],
      outtro: (actMeta && actMeta.outtro) || null,
      length: actMeta ? actMeta.length : cfg.acts[act - 1],
      rounds: cfg.acts[act - 1],
      threshold: b.actThreshold(act, cfg.rounds)
    };
  }

  function actEndRoundOf(state) {
    var b = B();
    var cfg = b.LENGTHS[(state.settings && state.settings.length) || b.DEFAULT_LENGTH] || b.LENGTHS.classic;
    return b.actEndRound(cfg.id, clampInt(state.act, 1, 3));
  }

  function applyActEnd(state) {
    var b = B();
    var info = actInfo(state);
    var score = b.actScore(state);
    var good = score >= info.threshold;
    var reward = null;
    var events = [];
    if (good) {
      reward = { coins: b.ACT_REWARD.coins };
      state.resources.coins = clamp((state.resources.coins || 0) + b.ACT_REWARD.coins, 0, b.RESOURCE_MAX);
      events.push({ type: 'gain', reason: 'actReward', res: { coins: b.ACT_REWARD.coins } });
      if (b.ACT_REWARD.token) {
        var tk = b.TOKEN_ROLLPOOL[Math.floor(nextRand(state) * b.TOKEN_ROLLPOOL.length)];
        state.tokens[tk] = clampInt((state.tokens[tk] || 0) + 1, 0, b.TOKEN_MAX);
        reward.token = tk;
        events.push({ type: 'token', token: tk, name: b.TOKEN_META[tk].name, delta: 1, reason: 'actReward' });
      }
    } else {
      state.drawBias = Math.max(b.ADAPT.biasFloor, intOr(state.drawBias, 0) + b.ADAPT.starBias);
      events.push({ type: 'stage', phase: state.phase, adaptive: true, drawBias: state.drawBias, reason: 'actBelowThreshold' });
    }
    state.actScores = state.actScores || [];
    state.actScores.push({ act: info.act, score: score, threshold: info.threshold, good: good });
    var ev = { type: 'actEnd', act: info.act, score: score, threshold: info.threshold, good: good, reward: reward };
    return { event: ev, events: events };
  }

  function eventForAct(state, act) {
    var c = contentRoot();
    if (!c || !c.events) return null;
    for (var i = 0; i < c.events.length; i++) {
      var e = c.events[i];
      if (!e || !e.id) continue;
      if (intOr(e.afterAct, act) !== act) continue;
      if (state.events && state.events[e.id]) continue;
      if (state.flags && state.flags['event_' + e.id]) continue;
      return e;
    }
    return null;
  }

  function nextRound(state) {
    var s = clone(state);
    if (s.phase !== 'resolve') return blocked(s, 'nextRound', 'wrong_phase');
    var b = B();
    var cfg = b.LENGTHS[(s.settings && s.settings.length) || b.DEFAULT_LENGTH] || b.LENGTHS.classic;
    var total = cfg.rounds;
    var events = [];
    var lastRound = s.round >= total;
    var atActEnd = !lastRound && s.round === actEndRoundOf(s);
    if (!lastRound && !atActEnd) {
      s.round = s.round + 1;
      s.host = s.host === 'a' ? 'b' : 'a';
      s.phase = 'draft';
      s.current = null;
      s.currentStar = null;
      s.escalated = false;
      s.escalatedDone = false;
      drawIntoHand(s);
      events.push({ type: 'stage', phase: 'draft', round: s.round, act: s.act, host: s.host, hand: s.hand.slice() });
      return { state: emit(s, events), events: events };
    }
    /* 幕末 */
    var ae = applyActEnd(s);
    events.push(ae.event);
    events = events.concat(ae.events);
    if (lastRound) {
      s.phase = 'act';
      s.lastAct = true;
      s.pendingActEnd = true;
      events.push({ type: 'stage', phase: 'act', lastAct: true });
      return { state: emit(s, events), events: events };
    }
    var ev = eventForAct(s, s.act);
    if (ev) {
      s.phase = 'event';
      s.pendingActEnd = true;
      events.push({ type: 'stage', phase: 'event', eventId: ev.id, title: ev.title || '', afterAct: s.act });
    } else {
      s.phase = 'act';
      s.pendingActEnd = true;
      events.push({ type: 'stage', phase: 'act', afterAct: s.act });
    }
    return { state: emit(s, events), events: events };
  }

  function chooseEvent(state, eventId, optionId) {
    var s = clone(state);
    if (s.phase !== 'event') return blocked(s, 'chooseEvent', 'wrong_phase');
    var c = contentRoot();
    var ev = null;
    if (c && c.events) {
      for (var i = 0; i < c.events.length; i++) {
        if (c.events[i] && c.events[i].id === eventId) { ev = c.events[i]; break; }
      }
      if (!ev) {
        for (var j = 0; j < c.events.length; j++) {
          if (c.events[j] && intOr(c.events[j].afterAct, s.act) === s.act) { ev = c.events[j]; break; }
        }
      }
    }
    if (!ev) return blocked(s, 'chooseEvent', 'event_not_found');
    if (s.events && s.events[ev.id] !== undefined) return blocked(s, 'chooseEvent', 'event_already_chosen');
    var opt = null;
    var opts = ev.options || [];
    for (var k = 0; k < opts.length; k++) if (opts[k] && opts[k].id === optionId) { opt = opts[k]; break; }
    if (!opt) return blocked(s, 'chooseEvent', 'option_not_found');
    var effects = opt.effects || {};
    var applied = addRes(s, effects);
    if (opt.flag) {
      s.flags = s.flags || {};
      s.flags[opt.flag] = true;
    }
    s.flags = s.flags || {};
    s.flags['event_' + ev.id] = true;
    s.events = s.events || {};
    s.events[ev.id] = opt.id;
    s.phase = 'act';
    pushLog(s, { round: s.round, type: 'event', eventId: ev.id, optionId: opt.id, deltas: applied });
    var events = [
      { type: 'gain', reason: 'event', eventId: ev.id, optionId: opt.id, res: applied, flag: opt.flag || null },
      { type: 'stage', phase: 'act', afterAct: s.act }
    ];
    return { state: emit(s, events), events: events };
  }

  function leaveAct(state) {
    var s = clone(state);
    if (s.phase !== 'act' && s.phase !== 'shop') return blockedState(s, 'leaveAct', 'wrong_phase');
    var b = B();
    var cfg = b.LENGTHS[(s.settings && s.settings.length) || b.DEFAULT_LENGTH] || b.LENGTHS.classic;
    if (s.lastAct || s.act >= 3 || s.round >= cfg.rounds) {
      s.phase = 'finale';
      return emit(s, [{ type: 'stage', phase: 'finale', act: s.act }]);
    }
    s.act = s.act + 1;
    s.round = s.round + 1;
    s.host = s.host === 'a' ? 'b' : 'a';
    s.phase = 'draft';
    s.current = null;
    s.currentStar = null;
    s.escalated = false;
    s.escalatedDone = false;
    s.pendingActEnd = false;
    drawIntoHand(s);
    return emit(s, [{ type: 'stage', phase: 'draft', round: s.round, act: s.act, host: s.host, hand: s.hand.slice() }]);
  }

  function shopOffers(state) {
    var list = (B() && B().SHOP) || [];
    var coins = state && state.resources ? state.resources.coins || 0 : 0;
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      out.push({ id: it.id, name: it.name, icon: it.icon, price: it.price, desc: it.desc, affordable: coins >= it.price });
    }
    return out;
  }

  function shopBuy(state, itemId) {
    var s = clone(state);
    if (s.phase !== 'act' && s.phase !== 'shop') return blocked(s, 'shopBuy', 'wrong_phase');
    var list = (B() && B().SHOP) || [];
    var item = null;
    for (var i = 0; i < list.length; i++) if (list[i].id === itemId) { item = list[i]; break; }
    if (!item) return blocked(s, 'shopBuy', 'item_not_found');
    if ((s.resources.coins || 0) < item.price) return blocked(s, 'shopBuy', 'not_enough_coins');
    s.resources.coins = clamp(s.resources.coins - item.price, 0, B().RESOURCE_MAX);
    var effect = {};
    if (item.id === 'heart') {
      effect = addRes(s, { heart: 1 });
    } else if (B().TOKEN_KEYS.indexOf(item.id) >= 0) {
      s.tokens[item.id] = clampInt((s.tokens[item.id] || 0) + 1, 0, B().TOKEN_MAX);
      effect[item.id] = 1;
    }
    if (s.phase === 'act') s.phase = 'shop';
    pushLog(s, { round: s.round, type: 'shop', itemId: item.id, price: item.price });
    var events = [
      { type: 'shop', itemId: item.id, name: item.name, price: item.price, effect: effect, coins: s.resources.coins },
      { type: 'gain', reason: 'shop', res: { coins: -item.price } }
    ];
    return { state: emit(s, events), events: events };
  }

  /* ---------------------------- 结局 / 奖项 ---------------------------- */
  function contentEndingList() {
    var c = contentRoot();
    if (c && isArr(c.endings) && c.endings.length) return c.endings;
    return null;
  }

  function pickEnding(state, forceId) {
    var b = B();
    var list = contentEndingList();
    if (list) {
      if (forceId) {
        for (var f = 0; f < list.length; f++) {
          if (list[f] && (list[f].id === forceId || list[f].kind === forceId)) return list[f];
        }
        if (forceId === 'safe') return list[0];
      }
      for (var i = 0; i < list.length; i++) {
        var e = list[i];
        if (!e) continue;
        if (typeof e.cond === 'function') {
          var ok = false;
          try { ok = !!e.cond(state.resources, state, state.flags); } catch (err) { ok = false; }
          if (ok) return e;
        }
      }
      return list[list.length - 1];
    }
    if (forceId) return b.endingById(forceId);
    for (var j = 0; j < b.ENDING_RULES.length; j++) {
      var rule = b.ENDING_RULES[j];
      var hit = false;
      try { hit = !!rule.test(state); } catch (e2) { hit = false; }
      if (hit) return b.endingById(rule.id);
    }
    return b.endingById('each');
  }

  function pickAwards(state) {
    var b = B();
    var out = [];
    var seen = {};
    var c = contentRoot();
    var contentAwards = c && isArr(c.awards) ? c.awards : null;
    function push(id, name, icon, desc) {
      if (!id || seen[id]) return;
      seen[id] = true;
      out.push({ id: id, name: name, icon: icon, desc: desc });
    }
    if (contentAwards) {
      for (var i = 0; i < contentAwards.length && out.length < b.AWARDS_MAX; i++) {
        var a = contentAwards[i];
        if (!a || !a.id) continue;
        var hit = true;
        if (typeof a.cond === 'function') {
          try { hit = !!a.cond(state.resources, state, state.flags); } catch (e) { hit = false; }
        }
        if (hit) push(a.id, a.name, a.icon, a.desc);
      }
    }
    for (var j = 0; j < b.AWARDS.length && out.length < b.AWARDS_MAX; j++) {
      var fa = b.AWARDS[j];
      var ok = false;
      try { ok = !!fa.test(state); } catch (e2) { ok = false; }
      if (ok) push(fa.id, fa.name, fa.icon, fa.desc);
    }
    var pad = b.AWARDS[b.AWARDS.length - 1];
    while (out.length < b.AWARDS_MIN) push(pad.id + '_' + out.length, pad.name, pad.icon, pad.desc);
    return out.slice(0, b.AWARDS_MAX);
  }

  function buildResult(state, forceEndingId) {
    var b = B();
    var e = pickEnding(state, forceEndingId) || b.ENDING_RULES[b.ENDING_RULES.length - 1];
    var endingId = (e && e.id) || 'each';
    var endingName = (e && e.name) || b.endingById(endingId).name;
    var awards = pickAwards(state);
    var cfg = b.LENGTHS[(state.settings && state.settings.length) || b.DEFAULT_LENGTH] || b.LENGTHS.classic;
    return {
      v: 1,
      endingId: endingId,
      endingName: endingName,
      quote: (e && e.quote) || ((e && e.text) ? '' : b.endingById(endingId).desc || ''),
      awards: awards,
      ts: nowMs(),
      stats: {
        length: cfg.id,
        rounds: cfg.rounds,
        round: state.round,
        act: state.act,
        heart: state.resources.heart,
        tension: state.resources.tension,
        sync: state.resources.sync,
        coins: state.resources.coins,
        gentle: state.gentle,
        combo: state.combo,
        maxCombo: state.maxCombo,
        skips: state.skips,
        completes: state.completes,
        maxStarSeen: state.maxStarSeen,
        maxCombo: state.maxCombo,
        actScores: (state.actScores || []).slice(),
        safeWord: !!(state.flags && state.flags.safeWord)
      }
    };
  }

  function finish(state) {
    var s = clone(state);
    if (!s.result || !s.result.endingId) s.result = buildResult(s, null);
    s.phase = 'finale';
    var events = [{ type: 'ending', endingId: s.result.endingId, endingName: s.result.endingName, awards: s.result.awards, stats: s.result.stats }];
    return { state: emit(s, events), events: events };
  }

  function safeWord(state) {
    var s = clone(state);
    s.flags = s.flags || {};
    s.flags.safeWord = true;
    s.result = buildResult(s, 'safe');
    s.phase = 'finale';
    var events = [{
      type: 'ending',
      endingId: s.result.endingId,
      endingName: s.result.endingName,
      awards: s.result.awards,
      stats: s.result.stats,
      safe: true
    }];
    pushLog(s, { round: s.round, type: 'safeWord' });
    return { state: emit(s, events), events: events };
  }

  function useShield(state) {
    var s = clone(state);
    if ((s.tokens.shield || 0) <= 0) return blocked(s, 'useShield', 'no_token');
    s.tokens.shield = Math.max(0, s.tokens.shield - 1);
    var events = [{ type: 'token', token: 'shield', name: B().TOKEN_META.shield.name, delta: -1, reason: 'useShield' }];
    pushLog(s, { round: s.round, type: 'shield' });
    return { state: emit(s, events), events: events };
  }

  /* ---------------------------- 只读辅助 ---------------------------- */
  function eligibleCards(state) {
    var out = [];
    var recs = collectCandidates(state, { ignoreUsed: true });
    for (var i = 0; i < recs.length; i++) out.push(recInfo(recs[i], null));
    return out;
  }

  function handCards(state) {
    var out = [];
    var hand = (state && state.hand) || [];
    for (var i = 0; i < hand.length; i++) {
      var rec = resolveCardKey(hand[i]);
      if (rec) out.push(recInfo(rec, null));
    }
    return out;
  }

  function progress(state) {
    var b = B();
    var cfg = b.LENGTHS[(state && state.settings && state.settings.length) || b.DEFAULT_LENGTH] || b.LENGTHS.classic;
    var act = clampInt(state && state.act, 1, 3);
    var actEnd = b.actEndRound(cfg.id, act);
    var actStart = b.actEndRound(cfg.id, act - 1) + 1;
    var round = clampInt(state && state.round, 1, cfg.rounds);
    var actRound = clampInt(round - actStart + 1, 1, cfg.acts[act - 1]);
    return {
      round: round,
      total: cfg.rounds,
      percent: Math.round(round / cfg.rounds * 100),
      remaining: cfg.rounds - round,
      act: act,
      actRound: actRound,
      actLength: cfg.acts[act - 1],
      actPercent: Math.round(actRound / cfg.acts[act - 1] * 100),
      host: (state && state.host) || 'a',
      phase: (state && state.phase) || 'draft'
    };
  }

  /* ---------------------------- 存档校验 ---------------------------- */
  function validate(input) {
    if (!isObj(input)) return null;
    var b = B();
    var s = clone(input);
    /* 版本迁移：v0/缺失 -> v1 */
    if (!s.v || !isNum(s.v) || s.v < 1) s.v = b.SESSION_VERSION;
    if (s.v > b.SESSION_VERSION) s.v = b.SESSION_VERSION; /* 未来版本降级保护 */
    s.names = isObj(s.names) ? { a: String(s.names.a || '你'), b: String(s.names.b || 'TA') } : { a: '你', b: 'TA' };
    s.settings = normalizeSettings(s.settings);
    var cfg = b.LENGTHS[s.settings.length] || b.LENGTHS.classic;
    s.round = clampInt(s.round, 1, cfg.rounds);
    s.act = b.actOfRound(cfg.id, s.round);
    if (s.phase === 'event' || s.phase === 'act' || s.phase === 'shop') {
      s.act = clampInt(s.act, 1, 3);
    }
    s.host = s.host === 'b' ? 'b' : 'a';
    var def = b.RESOURCE_START;
    s.resources = isObj(s.resources) ? s.resources : {};
    for (var i = 0; i < b.RES_KEYS.length; i++) {
      var k = b.RES_KEYS[i];
      s.resources[k] = clampInt(isNum(s.resources[k]) ? s.resources[k] : def[k], 0, b.RESOURCE_MAX);
    }
    s.resources.coins = clampInt(isNum(s.resources.coins) ? s.resources.coins : 0, 0, b.RESOURCE_MAX);
    s.gentle = clampInt(isNum(s.gentle) ? s.gentle : 0, 0, 99);
    s.combo = clampInt(isNum(s.combo) ? s.combo : 0, 0, 999);
    s.maxCombo = clampInt(isNum(s.maxCombo) ? s.maxCombo : s.combo, s.combo, 999);
    s.skips = clampInt(isNum(s.skips) ? s.skips : 0, 0, 9999);
    s.completes = clampInt(isNum(s.completes) ? s.completes : 0, 0, 9999);
    s.maxStarSeen = clampInt(isNum(s.maxStarSeen) ? s.maxStarSeen : 0, 0, b.MAX_STAR_MAX);
    s.tokens = isObj(s.tokens) ? s.tokens : {};
    for (var t = 0; t < b.TOKEN_KEYS.length; t++) {
      var tk = b.TOKEN_KEYS[t];
      s.tokens[tk] = clampInt(isNum(s.tokens[tk]) ? s.tokens[tk] : (b.TOKEN_START[tk] || 0), 0, b.TOKEN_MAX);
    }
    s.usedCards = isObj(s.usedCards) ? s.usedCards : {};
    var usedPools = Object.keys(s.usedCards);
    for (var p = 0; p < usedPools.length; p++) {
      if (!isObj(s.usedCards[usedPools[p]])) s.usedCards[usedPools[p]] = {};
    }
    s.events = isObj(s.events) ? s.events : {};
    s.flags = isObj(s.flags) ? s.flags : {};
    s.actScores = isArr(s.actScores) ? s.actScores.slice(0, 3) : [];
    s.drawBias = clampInt(isNum(s.drawBias) ? s.drawBias : 0, b.ADAPT.biasFloor, 0);
    s.gentleUsed = clampInt(isNum(s.gentleUsed) ? s.gentleUsed : 0, 0, b.GENTLE.maxUses);
    s.escalated = !!s.escalated;
    s.escalatedDone = !!s.escalatedDone;
    s.pendingActEnd = !!s.pendingActEnd;
    s.lastAct = !!s.lastAct;
    s.rng = isNum(s.rng) ? (s.rng >>> 0) : ((Date.now() >>> 0) ^ 0x9e3779b9) >>> 0;
    /* phase 合法性 */
    if (PHASES.indexOf(s.phase) < 0) s.phase = 'draft';
    /* hand / current 修复 */
    var hand = isArr(s.hand) ? s.hand : [];
    var fixedHand = [];
    for (var h = 0; h < hand.length; h++) {
      var recH = resolveCardKey(hand[h]);
      if (!recH) continue;
      if (fixedHand.indexOf(recH.key) >= 0) continue;
      fixedHand.push(recH.key);
    }
    s.hand = fixedHand.slice(0, b.DRAW.handSize);
    var curRec = resolveCardKey(s.current);
    s.current = curRec ? curRec.key : null;
    s.currentStar = curRec && isNum(s.currentStar) ? clampInt(s.currentStar, 1, effectiveMaxStar(s)) : null;
    if (s.currentStar !== null && curRec && s.currentStar > intOr(curRec.card.star, 1)) s.currentStar = intOr(curRec.card.star, 1);
    if (s.phase === 'play' || s.phase === 'escalate') {
      if (!s.current) s.phase = 'draft';
    }
    if (s.phase === 'resolve' && !s.current) s.phase = 'draft';
    if (s.phase === 'draft' && s.hand.length !== b.DRAW.handSize) {
      if (!s.hand.length) s.hand = [];
      drawIntoHand(s);
    }
    s.log = isArr(s.log) ? s.log.slice(-200) : [];
    if (!s.result || !isObj(s.result) || !s.result.endingId) {
      s.result = null;
    } else {
      var er = b.endingById(s.result.endingId);
      s.result.endingId = s.result.endingId || er.id;
      s.result.endingName = s.result.endingName || er.name;
      if (!isArr(s.result.awards)) s.result.awards = [];
      if (!isObj(s.result.stats)) s.result.stats = {};
    }
    if (s.phase === 'finale' && !s.result) {
      /* 不在这里生成结局（避免 validate 依赖 CONTENT 副作用）；UI 调 finish() */
      s.result = null;
    }
    s.ts = isNum(s.ts) ? s.ts : nowMs();
    s.id = typeof s.id === 'string' && s.id ? s.id : ('s' + s.rng.toString(36));
    return s;
  }

  /* ---------------------------- 导出 ---------------------------- */
  var Engine = {
    version: '1.0.0',
    EVENT_TYPES: EVENTS.slice(),
    PHASES: PHASES.slice(),
    /* 生命周期 */
    newSession: newSession,
    validate: validate,
    /* 抽牌 */
    startRound: startRound,
    reroll: reroll,
    chooseCard: chooseCard,
    /* 结算 */
    complete: complete,
    escalate: escalate,
    escalateComplete: escalateComplete,
    escalateSkip: escalateSkip,
    skip: skip,
    gentleDown: gentleDown,
    /* 幕与事件 */
    nextRound: nextRound,
    chooseEvent: chooseEvent,
    leaveAct: leaveAct,
    shopBuy: shopBuy,
    finish: finish,
    safeWord: safeWord,
    /* 扩展动作 */
    useShield: useShield,
    /* 只读辅助 */
    eligibleCards: eligibleCards,
    drawHand: function (state) { var s = clone(state); drawIntoHand(s); return s.hand; },
    actInfo: actInfo,
    progress: progress,
    canEscalate: canEscalate,
    shopOffers: shopOffers,
    currentCard: currentCard,
    handCards: handCards,
    /* 供单测/工具使用 */
    __test: {
      mulberry32: mulberry32,
      actThreshold: function (act, rounds) { return B().actThreshold(act, rounds); },
      yieldFor: function (type, star) { return B().yieldFor(type, star); },
      coinsFor: function (star, combo) { return B().coinsFor(star, combo); },
      effectiveMaxStar: effectiveMaxStar,
      isBlacklisted: isBlacklisted,
      cardKey: function (pool, id) { return pool + ':' + id; },
      zeroState: function (settings, names, seed) { var s = blankState(settings, names, seed); drawIntoHand(s); return s; }
    }
  };

  root.Engine = Engine;
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
})(typeof window !== 'undefined' ? window : this);
