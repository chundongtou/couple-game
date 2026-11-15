/* ==========================================================================
 * 今晚这一页 · 规则引擎
 * 纯逻辑：无 DOM、无 localStorage、无网络。
 * 动作入参不变，返回 { state, events }。newSession / openArcade / previewDraw
 * 直接返回 state 或卡面数组。
 *
 * 一晚三页（热身 / 升温 / 靠近），每页六个贴纸位。
 * 自选贴与对贴交替；对贴的两张落在同一格。
 * 叠贴不是每回合都有。撕掉留下胶痕，不扣升温、不卡关。
 * 页间用胶带段买贴纸店的三件小东西。三页之后是封底海报。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  function B() { return root.Balance; }
  function cardsRoot() { return global.CARDS || {}; }
  function contentRoot() { return global.CONTENT || null; }

  function clone(o) { return o === null || o === undefined ? o : JSON.parse(JSON.stringify(o)); }
  function isArr(o) { return Object.prototype.toString.call(o) === '[object Array]'; }
  function isObj(o) { return !!o && typeof o === 'object' && !isArr(o); }
  function isNum(n) { return typeof n === 'number' && isFinite(n); }
  function clamp(n, lo, hi) { n = Number(n); if (!isFinite(n)) n = lo; return Math.max(lo, Math.min(hi, n)); }
  function clampInt(n, lo, hi) { n = Math.round(Number(n)); if (!isFinite(n)) n = lo; return Math.max(lo, Math.min(hi, n)); }
  function intOr(n, d) { n = Math.round(Number(n)); return isFinite(n) ? n : d; }

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
  function otherOf(who) { return who === 'a' ? 'b' : 'a'; }

  function ok(state, events) { return { state: state, events: events || [] }; }
  function blocked(state, reason) {
    return { state: state ? clone(state) : state, events: [{ type: 'stage', blocked: true, reason: reason || 'blocked' }] };
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
    _index = { byKey: {}, byPool: {} };
    var pools = Object.keys(C || {});
    for (var p = 0; p < pools.length; p++) {
      var pool = pools[p];
      var arr = C[pool] || [];
      _index.byPool[pool] = [];
      for (var i = 0; i < arr.length; i++) {
        var card = arr[i];
        if (!card || !card.id) continue;
        var key = pool + ':' + card.id;
        if (_index.byKey[key]) continue;
        var rec = { key: key, pool: pool, id: String(card.id), card: card };
        _index.byKey[key] = rec;
        _index.byPool[pool].push(rec);
      }
    }
    return _index;
  }

  function resolveKey(key) {
    if (key === null || key === undefined) return null;
    var fb = fallbackMap();
    if (typeof key === 'string' && fb[key]) return fb[key];
    var idx = ensureIndex();
    if (typeof key === 'string' && idx.byKey[key]) return idx.byKey[key];
    return null;
  }

  function cardInfoFromRec(rec) {
    if (!rec) return null;
    var card = rec.card || {};
    var pool = rec.pool === 'fallback' ? 'truth' : rec.pool;
    return {
      key: rec.key,
      text: String(card.text || ''),
      star: Math.max(1, intOr(card.star, 1)),
      pool: pool,
      tags: (card.tags || []).slice(),
      typeName: B().typeName(pool)
    };
  }

  function cardByKey(key) {
    return cardInfoFromRec(resolveKey(key));
  }

  function infoOf(entry) {
    if (!entry) return null;
    if (typeof entry === 'string') return cardByKey(entry);
    if (entry.key && entry.text) return {
      key: entry.key,
      text: entry.text,
      star: entry.star || 1,
      pool: entry.pool || 'truth',
      tags: (entry.tags || []).slice(),
      typeName: entry.typeName || B().typeName(entry.pool || 'truth')
    };
    return null;
  }

  /* ---------------------------- 设置 ---------------------------- */
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
      sound: s.sound === undefined ? def.sound : !!s.sound,
      haptics: s.haptics === undefined ? def.haptics : !!s.haptics,
      reduced: s.reduced === undefined ? def.reduced : !!s.reduced,
      safeHold: clamp(s.safeHold === undefined ? def.safeHold : s.safeHold, 1, 10),
      blacklist: normalizeBlacklist(s.blacklist),
      gentleOnly: s.gentleOnly === undefined ? def.gentleOnly : !!s.gentleOnly
    };
    if (s.seed !== undefined) out.seed = (Number(s.seed) >>> 0);
    return out;
  }

  function normName(v, d) {
    var s = String(v === null || v === undefined ? '' : v).trim();
    if (!s) return d;
    return s.slice(0, B().NAME_MAX);
  }

  function normNames(names) {
    if (isArr(names)) names = { a: names[0], b: names[1] };
    names = isObj(names) ? names : {};
    return { a: normName(names.a, '他'), b: normName(names.b, '她') };
  }

  function effectiveMax(state) {
    var b = B();
    var s = state && state.settings ? state.settings : {};
    var maxS = clampInt(s.maxStar === undefined ? 3 : s.maxStar, b.MAX_STAR_MIN, b.MAX_STAR_MAX);
    if (s.gentleOnly) maxS = Math.min(maxS, b.GENTLE_ONLY.maxStar);
    maxS = Math.max(1, maxS - (state.soften || 0));
    return maxS;
  }

  function isBlacklisted(card, blacklist) {
    if (!blacklist || !blacklist.length || !card) return false;
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

  function gentleBlocked(card, settings) {
    if (!settings || !settings.gentleOnly) return false;
    var tags = (card && card.tags) || [];
    var block = B().GENTLE_ONLY.blockTags;
    for (var i = 0; i < block.length; i++) if (tags.indexOf(block[i]) >= 0) return true;
    return false;
  }

  /* ---------------------------- 抽取 ---------------------------- */
  function defaultPools(state) {
    var b = B();
    var pools = b.DRAW_POOLS.slice();
    if (effectiveMax(state) < b.DRAW.sparkMinMaxStar) pools = pools.filter(function (p) { return p !== 'spark'; });
    return pools;
  }

  function entryKey(entry) {
    if (!entry) return '';
    return typeof entry === 'string' ? entry : (entry.key || '');
  }

  function candidates(state, opt, chosenKeys, ignoreSeen) {
    var max = effectiveMax(state);
    var min = opt.starMin || 1;
    var maxS = Math.min(opt.starMax || max, max);
    if (maxS < min) min = maxS;
    var pools = opt.pools || defaultPools(state);
    var idx = ensureIndex();
    var settings = state.settings || {};
    var out = [];
    for (var p = 0; p < pools.length; p++) {
      var pool = pools[p];
      if (pool === 'spark' && max < B().DRAW.sparkMinMaxStar && !opt.allowSpark) continue;
      if (pool === 'punish') continue;
      var list = idx.byPool[pool] || [];
      for (var i = 0; i < list.length; i++) {
        var rec = list[i];
        var star = intOr(rec.card.star, 1);
        if (star < min || star > maxS) continue;
        if (isBlacklisted(rec.card, settings.blacklist)) continue;
        if (gentleBlocked(rec.card, settings)) continue;
        if (!ignoreSeen && state.seen && state.seen.indexOf(rec.key) >= 0) continue;
        if (chosenKeys.indexOf(rec.key) >= 0) continue;
        out.push(rec.key);
      }
    }
    return out;
  }

  function typeOfKey(key) {
    var info = cardByKey(key);
    return info ? info.pool : '';
  }

  function countType(keys, pool) {
    var n = 0;
    for (var i = 0; i < keys.length; i++) if (typeOfKey(keys[i]) === pool) n++;
    return n;
  }

  function preferStar(state, opt) {
    if (opt.prefer) return opt.prefer;
    var max = effectiveMax(state);
    if (state.spread <= 1) return 1;
    if (state.spread === 2) return Math.min(2, max);
    return Math.min(3, max);
  }

  function pickWeighted(state, keys, prefer) {
    var bag = [];
    for (var i = 0; i < keys.length; i++) {
      var star = (cardByKey(keys[i]) || {}).star || 1;
      var w = star === prefer ? 4 : (Math.abs(star - prefer) === 1 ? 2 : 1);
      for (var k = 0; k < w; k++) bag.push(keys[i]);
    }
    if (!bag.length) return null;
    return bag[Math.floor(nextRand(state) * bag.length)];
  }

  function pickOneKey(state, opt, chosen) {
    var list = candidates(state, opt, chosen, false);
    var filtered = [];
    var cap = B().DRAW.maxSameType;
    for (var i = 0; i < list.length; i++) {
      if (countType(chosen, typeOfKey(list[i])) >= cap) continue;
      filtered.push(list[i]);
    }
    if (!filtered.length) filtered = list;
    if (!filtered.length) return null;
    return pickWeighted(state, filtered, preferStar(state, opt));
  }

  function drawKeys(state, n, opt) {
    opt = Object.assign({}, opt || {});
    var keys = [];
    var relaxed = false;
    var guard = 0;
    while (keys.length < n && guard++ < n * 20) {
      var key = pickOneKey(state, opt, keys);
      if (!key && !relaxed) {
        relaxed = true;
        opt = Object.assign({}, opt, { starMin: 1, starMax: effectiveMax(state) });
        var keep = keys.slice();
        state.seen = (state.seen || []).filter(function (k) { return keep.indexOf(k) >= 0; });
        continue;
      }
      if (!key) break;
      keys.push(key);
    }
    var fb = B().FALLBACK_CARDS;
    var f = 0;
    while (keys.length < n) {
      keys.push('fallback:' + fb[f % fb.length].id);
      f++;
    }
    for (var i = 0; i < keys.length; i++) {
      if (state.seen.indexOf(keys[i]) < 0) state.seen.push(keys[i]);
    }
    return keys;
  }

  function drawInfos(state, n, opt) {
    return drawKeys(state, n, opt).map(cardByKey);
  }

  function dareWindow(state) {
    var max = effectiveMax(state);
    var target = clampInt(1 + Math.floor((state.heat || 0) / 8), 1, max);
    return { starMin: Math.max(1, target - 1), starMax: target, prefer: target, pools: B().DARE_POOLS };
  }

  /* ---------------------------- 关系 / 热度 ---------------------------- */
  function pairRelation(a, b) {
    a = infoOf(a);
    b = infoOf(b);
    if (!a || !b) return 'apart';
    var d = Math.abs((a.star || 1) - (b.star || 1));
    var same = a.pool && a.pool === b.pool;
    if (same || d <= 1) return 'close';
    if (d >= 3) return 'far';
    return 'apart';
  }

  function cleanNote(s) {
    return String(s === null || s === undefined ? '' : s).replace(/\s+/g, ' ').trim().slice(0, B().NOTE_MAX);
  }

  function tiltOf(state) {
    return Math.round((nextRand(state) * 70 - 35)) / 10;
  }

  function applyHeat(state, delta, events, reason) {
    delta = Math.round(Number(delta) || 0);
    if (!delta) return 0;
    var before = state.heat || 0;
    state.heat = clamp(before + delta, 0, B().HEAT_MAX);
    var got = state.heat - before;
    if (events && got) events.push({ type: 'heat', delta: got, heat: state.heat, reason: reason || '' });
    return got;
  }

  function applyTape(state, delta, events, reason) {
    delta = Math.round(Number(delta) || 0);
    if (!delta) return;
    var before = state.tape || 0;
    state.tape = clamp(before + delta, 0, B().TAPE_MAX);
    if (events) events.push({ type: 'tape', delta: state.tape - before, tape: state.tape, reason: reason || '' });
  }

  function applyImprint(state, delta, events) {
    delta = Math.round(Number(delta) || 0);
    if (!delta) return;
    var before = state.imprint || 0;
    state.imprint = clamp(before + delta, 0, B().IMPRINT_MAX);
    if (events) events.push({ type: 'imprint', delta: state.imprint - before, imprint: state.imprint });
  }

  function logLine(state, text) {
    state.log = state.log || [];
    state.log.push({ t: state.turn || 0, text: String(text || '').slice(0, 80) });
    if (state.log.length > 40) state.log.shift();
  }

  function curPage(state) {
    return state.pages[clampInt(state.spread, 1, 3) - 1];
  }

  function firstEmpty(page) {
    var slots = page && page.slots || [];
    for (var i = 0; i < slots.length; i++) if (!slots[i] || slots[i].kind === 'empty') return i;
    return -1;
  }

  function specialAt(spread, slot) {
    var row = B().SPECIAL_SLOTS[spread];
    if (!row) return null;
    return row[slot] || null;
  }

  function emptySlot(i) { return { i: i, kind: 'empty' }; }

  function makePages() {
    return B().SPREADS.map(function (def) {
      var slots = [];
      for (var i = 0; i < B().SLOTS_PER_SPREAD; i++) slots.push(emptySlot(i));
      return { id: def.id, name: def.name, sub: def.sub, slots: slots, extras: [] };
    });
  }

  /* ---------------------------- 结局 ---------------------------- */
  function callCond(fn, state) {
    if (typeof fn !== 'function') return false;
    try { return !!fn(state, state); } catch (e) { return false; }
  }

  function textOf(v) {
    if (isArr(v)) return v.join('\n');
    return v ? String(v) : '';
  }

  function pickEnding(state) {
    var content = contentRoot();
    var list = content && content.endings || [];
    for (var i = 0; i < list.length; i++) {
      if (callCond(list[i].cond, state)) return list[i];
    }
    var rules = B().ENDING_RULES;
    for (var j = 0; j < rules.length; j++) {
      try { if (rules[j].test(state)) return B().endingById(rules[j].id); } catch (e) {}
    }
    return B().endingById('gentle');
  }

  function pickAwards(state) {
    var content = contentRoot();
    var list = (content && content.awards) || [];
    var out = [];
    var seen = {};
    function push(a) {
      if (!a || seen[a.id] || out.length >= 3) return;
      seen[a.id] = true;
      out.push({ id: a.id, name: a.name, icon: a.icon || '' });
    }
    for (var i = 0; i < list.length; i++) if (callCond(list[i].cond, state)) push(list[i]);
    var fb = B().AWARDS;
    for (var j = 0; j < fb.length && out.length < 2; j++) {
      try { if (fb[j].test(state)) push(fb[j]); } catch (e) {}
    }
    return out;
  }

  function finishInto(state, events, asSafe) {
    if (asSafe) {
      state.flags = state.flags || {};
      state.flags.safeWord = true;
    }
    state.phase = 'poster';
    state.mode = 'done';
    state.game = null;
    var ending = pickEnding(state);
    state.result = {
      endingId: ending.id,
      endingName: ending.name,
      stamp: ending.stamp || ending.name,
      quote: ending.quote || '',
      text: textOf(ending.text || ending.desc),
      awards: pickAwards(state),
      stats: {
        heat: state.heat || 0,
        imprint: state.imprint || 0,
        tape: state.tape || 0,
        pastes: state.pastes || 0,
        peels: state.peels || 0,
        stacks: state.stacks || 0
      },
      safe: !!(state.flags && state.flags.safeWord)
    };
    if (events) events.push({ type: 'ending', endingId: ending.id, endingName: ending.name, safe: state.result.safe, awards: state.result.awards });
    logLine(state, '封底 · ' + ending.name);
  }

  /* ---------------------------- 开局 ---------------------------- */
  function createBase(settings, names, seed) {
    var b = B();
    var cfg = normalizeSettings(settings);
    var sd = seed === undefined || seed === null || seed === '' ? cfg.seed : (Number(seed) >>> 0);
    if (!isNum(sd)) sd = (Date.now() >>> 0);
    sd = sd >>> 0;
    if (!sd) sd = 1;
    return {
      v: b.SESSION_VERSION,
      kind: 'journal',
      id: 'j' + sd.toString(36) + (Date.now() % 2176782336).toString(36),
      ts: Date.now(),
      names: normNames(names),
      settings: cfg,
      spread: 1,
      slot: 0,
      turn: 0,
      stickerTurn: 0,
      host: 'a',
      mode: 'pick',
      phase: 'choose',
      hand: [],
      hands: { a: [], b: [] },
      picks: { a: null, b: null },
      secretWho: 'a',
      pairMark: null,
      current: null,
      stackCard: null,
      stackBase: 1,
      stackSnooze: false,
      turnsSinceStack: 0,
      pages: makePages(),
      heat: 0,
      imprint: 0,
      tape: b.TAPE_START,
      pastes: 0,
      peels: 0,
      stacks: 0,
      peek: 0,
      soften: 0,
      stackCharges: 0,
      seen: [],
      maxStarSeen: 1,
      flags: { safeWord: false },
      game: null,
      standalone: false,
      arcadePaste: null,
      result: null,
      archived: false,
      log: [],
      rng: sd
    };
  }

  function noteStar(state, star) {
    if ((star || 1) > (state.maxStarSeen || 1)) state.maxStarSeen = star;
  }

  function placeSlot(state, slotObj) {
    var page = curPage(state);
    slotObj.i = state.slot;
    page.slots[state.slot] = slotObj;
  }

  function pushExtra(state, extra) {
    var page = curPage(state);
    page.extras = page.extras || [];
    if (page.extras.length >= B().EXTRAS_MAX) page.extras.shift();
    page.extras.push(extra);
  }

  /* ---------------------------- 回合推进 ---------------------------- */
  function startGame(state, kind, events) {
    state.phase = 'minigame';
    state.mode = 'game';
    state.current = null;
    if (kind === 'thermo') {
      var max = effectiveMax(state);
      var n = clampInt(max + 2, 3, B().THERMO_BANDS.length);
      var bands = [];
      for (var i = 0; i < n; i++) bands.push({ id: i, label: B().THERMO_BANDS[i] });
      state.game = { kind: 'thermo', step: 'a', bands: bands, a: null, b: null, gain: 0, dist: null, exact: 0, imprint: false };
    } else if (kind === 'truth') {
      state.game = {
        kind: 'truth',
        step: 'ready',
        segments: drawInfos(state, B().WHEEL_SEGMENTS, { pools: B().TRUTH_POOLS }),
        index: -1,
        who: null,
        rerolls: 0
      };
    } else if (kind === 'dare') {
      var w = dareWindow(state);
      state.game = {
        kind: 'dare',
        step: 'ready',
        segments: drawInfos(state, B().WHEEL_SEGMENTS, w),
        index: -1,
        who: null,
        rerolls: 0,
        targetStar: w.prefer
      };
    } else {
      state.game = {
        kind: 'map',
        step: 'walk',
        tiles: drawInfos(state, B().MAP_TILES, { pools: B().MAP_POOLS }),
        pos: -1,
        moves: 0,
        maxMoves: B().MAP_MOVES,
        log: [],
        lastStep: 0
      };
    }
    if (events) events.push({ type: 'game', kind: kind, step: state.game.step });
  }

  function beginTurn(state, events) {
    var page = curPage(state);
    var idx = firstEmpty(page);
    if (idx < 0) {
      if (state.spread >= 3) { finishInto(state, events, false); return; }
      state.phase = 'shop';
      state.mode = 'shop';
      state.game = null;
      if (events) events.push({ type: 'stage', phase: 'shop', spread: state.spread });
      return;
    }
    state.slot = idx;
    state.turn += 1;
    state.host = (state.turn % 2 === 1) ? 'a' : 'b';
    state.current = null;
    state.stackCard = null;
    state.pairMark = null;
    state.picks = { a: null, b: null };
    state.game = null;
    var spec = specialAt(state.spread, idx);
    if (spec) {
      startGame(state, spec, events);
      if (events) events.push({ type: 'stage', phase: 'minigame', mode: 'game', game: spec, host: state.host, slot: idx });
      return;
    }
    state.stickerTurn += 1;
    state.mode = (state.stickerTurn % 2 === 1) ? 'pick' : 'pair';
    var extra = state.peek > 0 ? B().PEEK_EXTRA : 0;
    if (extra) state.peek -= 1;
    var n = B().HAND_SIZE + extra;
    if (state.mode === 'pick') {
      state.hand = drawInfos(state, n, {});
      state.phase = 'choose';
    } else {
      state.hands = { a: drawInfos(state, n, {}), b: drawInfos(state, n, {}) };
      state.secretWho = state.host;
      state.phase = 'secret1';
    }
    if (events) events.push({ type: 'stage', phase: state.phase, mode: state.mode, host: state.host, slot: idx });
  }

  function afterFill(state, events) {
    var page = curPage(state);
    if (firstEmpty(page) < 0) {
      if (state.spread >= 3) { finishInto(state, events, false); return; }
      state.phase = 'shop';
      state.mode = 'shop';
      state.game = null;
      if (events) events.push({ type: 'stage', phase: 'shop', spread: state.spread });
      return;
    }
    beginTurn(state, events);
  }

  function considerStack(state, events, baseStar) {
    state.turnsSinceStack += 1;
    var periodic = state.turnsSinceStack >= B().STACK_EVERY;
    var charge = (state.stackCharges || 0) > 0 && !state.stackSnooze;
    if (periodic || charge) {
      state.phase = 'stackOffer';
      state.stackBase = baseStar || 1;
      if (periodic) state.turnsSinceStack = 0;
      state.stackSnooze = true;
      if (events) events.push({ type: 'stage', phase: 'stackOffer' });
      return;
    }
    afterFill(state, events);
  }

  function newSession(settings, names, seed) {
    var state = createBase(settings, names, seed);
    var events = [];
    beginTurn(state, events);
    return state;
  }

  /* ---------------------------- 自选贴 ---------------------------- */
  function handList(state, which) {
    if (which === 'a') return state.hands && state.hands.a || [];
    if (which === 'b') return state.hands && state.hands.b || [];
    return state.hand || [];
  }

  function resolvePick(hand, id) {
    if (!hand || !hand.length) return null;
    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
      var i = Number(id);
      return hand[i] ? infoOf(hand[i]) : null;
    }
    var key = typeof id === 'object' && id ? id.key : id;
    for (var k = 0; k < hand.length; k++) {
      var info = infoOf(hand[k]);
      if (info && info.key === key) return info;
    }
    return null;
  }

  function chooseSticker(state, cardId) {
    if (!state || state.phase !== 'choose') return blocked(state, 'choose');
    var card = resolvePick(state.hand, cardId);
    if (!card) return blocked(state, 'card');
    var next = clone(state);
    var events = [];
    next.current = card;
    next.phase = 'do';
    events.push({ type: 'stage', phase: 'do', card: card, host: next.host, to: otherOf(next.host) });
    return ok(next, events);
  }

  function paste(state, note) {
    if (!state || state.phase !== 'do' || !state.current) return blocked(state, 'paste');
    var next = clone(state);
    var events = [];
    var card = infoOf(next.current);
    noteStar(next, card.star);
    var heat = B().heatForStar(card.star);
    placeSlot(next, {
      i: next.slot,
      kind: 'sticker',
      card: card,
      note: cleanNote(note),
      who: otherOf(next.host),
      from: next.host,
      title: card.typeName,
      text: card.text,
      tilt: tiltOf(next),
      stack: null,
      game: ''
    });
    next.pastes += 1;
    applyHeat(next, heat, events, 'paste');
    applyTape(next, B().TAPE_ON_PASTE, events, 'paste');
    events.push({ type: 'paste', slot: next.slot, card: card });
    logLine(next, card.typeName + ' · 贴上');
    next.current = null;
    considerStack(next, events, card.star);
    return ok(next, events);
  }

  function peel(state) {
    if (!state || state.phase !== 'do') return blocked(state, 'peel');
    var next = clone(state);
    var events = [];
    placeSlot(next, {
      i: next.slot,
      kind: 'residue',
      title: '胶痕',
      text: '这里揭走过',
      tilt: tiltOf(next),
      stack: null,
      game: ''
    });
    next.peels += 1;
    next.current = null;
    events.push({ type: 'peel', slot: next.slot });
    logLine(next, '撕掉 · 留下胶痕');
    afterFill(next, events);
    return ok(next, events);
  }

  /* ---------------------------- 对贴 ---------------------------- */
  function lockSecret(state, cardId) {
    if (!state || (state.phase !== 'secret1' && state.phase !== 'secret2')) return blocked(state, 'secret');
    var who = state.secretWho;
    var card = resolvePick(handList(state, who), cardId);
    if (!card) return blocked(state, 'card');
    var next = clone(state);
    var events = [];
    next.picks[who] = card;
    if (next.phase === 'secret1') {
      next.phase = 'secret2';
      next.secretWho = otherOf(who);
      events.push({ type: 'stage', phase: 'secret2', who: next.secretWho });
    } else {
      next.phase = 'reveal';
      next.pairMark = pairRelation(next.picks.a, next.picks.b);
      events.push({ type: 'stage', phase: 'reveal', mark: next.pairMark });
    }
    return ok(next, events);
  }

  function resolvePair(state, spec) {
    if (!state || state.phase !== 'reveal') return blocked(state, 'reveal');
    spec = spec || {};
    var aStatus = spec.a === 'peel' ? 'peel' : 'paste';
    var bStatus = spec.b === 'peel' ? 'peel' : 'paste';
    var next = clone(state);
    var events = [];
    var ca = infoOf(next.picks.a);
    var cb = infoOf(next.picks.b);
    var mark = next.pairMark || pairRelation(ca, cb);
    var pasted = (aStatus === 'paste' ? 1 : 0) + (bStatus === 'paste' ? 1 : 0);
    var peeled = (aStatus === 'peel' ? 1 : 0) + (bStatus === 'peel' ? 1 : 0);
    var heat = 0;
    if (aStatus === 'paste') { heat += B().heatForStar(ca.star); noteStar(next, ca.star); }
    if (bStatus === 'paste') { heat += B().heatForStar(cb.star); noteStar(next, cb.star); }
    var slot;
    if (pasted === 0) {
      slot = { i: next.slot, kind: 'residue', title: '胶痕', text: '这一对被揭走了', tilt: tiltOf(next), stack: null, game: '', mark: mark };
    } else {
      var bits = [];
      if (aStatus === 'paste') bits.push(next.names.a + '：' + ca.text);
      if (bStatus === 'paste') bits.push(next.names.b + '：' + cb.text);
      slot = {
        i: next.slot,
        kind: 'pair',
        a: aStatus === 'paste' ? ca : null,
        b: bStatus === 'paste' ? cb : null,
        aStatus: aStatus,
        bStatus: bStatus,
        mark: mark,
        note: cleanNote(spec.note),
        title: '对贴 · ' + (B().MARKS[mark] ? B().MARKS[mark].name : ''),
        text: bits.join('\n'),
        tilt: tiltOf(next),
        stack: null,
        game: ''
      };
    }
    placeSlot(next, slot);
    next.pastes += pasted;
    next.peels += peeled;
    if (heat) applyHeat(next, heat, events, 'pair');
    if (pasted) applyTape(next, B().TAPE_ON_PASTE, events, 'pair');
    if (pasted === 2 && mark === 'close') applyImprint(next, 1, events);
    events.push({ type: pasted ? 'paste' : 'peel', slot: next.slot, mark: mark, pasted: pasted, peeled: peeled });
    logLine(next, '对贴 · ' + (B().MARKS[mark] ? B().MARKS[mark].name : mark));
    var base = Math.max(aStatus === 'paste' ? ca.star : 1, bStatus === 'paste' ? cb.star : 1);
    if (pasted) considerStack(next, events, base);
    else afterFill(next, events);
    return ok(next, events);
  }

  /* ---------------------------- 叠贴 ---------------------------- */
  function acceptStack(state) {
    if (!state || state.phase !== 'stackOffer') return blocked(state, 'stack');
    var next = clone(state);
    var events = [];
    if (next.stackCharges > 0) next.stackCharges -= 1;
    next.stackSnooze = next.stackCharges > 0 ? false : true;
    var max = effectiveMax(next);
    var base = next.stackBase || 1;
    var want = Math.min(max, Math.max(1, base + 1));
    var drawn = drawInfos(next, 1, {
      starMin: Math.min(want, max),
      starMax: max,
      prefer: want,
      pools: B().DEEP_POOLS
    });
    next.stackCard = drawn[0];
    next.phase = 'stackDo';
    events.push({ type: 'stage', phase: 'stackDo', card: next.stackCard });
    return ok(next, events);
  }

  function declineStack(state) {
    if (!state || state.phase !== 'stackOffer') return blocked(state, 'stack');
    var next = clone(state);
    var events = [];
    next.stackSnooze = true;
    next.stackCard = null;
    afterFill(next, events);
    return ok(next, events);
  }

  function pasteStack(state) {
    if (!state || state.phase !== 'stackDo' || !state.stackCard) return blocked(state, 'stack');
    var next = clone(state);
    var events = [];
    var card = infoOf(next.stackCard);
    var page = curPage(next);
    var slot = page.slots[next.slot];
    if (!slot || slot.kind === 'empty') return blocked(state, 'slot');
    slot.stack = { card: card, status: 'paste', text: card.text };
    noteStar(next, card.star);
    next.pastes += 1;
    next.stacks += 1;
    next.flags.stacked = true;
    applyHeat(next, B().heatForStar(card.star), events, 'stack');
    applyTape(next, B().TAPE_ON_PASTE, events, 'stack');
    events.push({ type: 'stack', slot: next.slot, card: card });
    logLine(next, '叠贴 · ' + card.typeName);
    next.stackCard = null;
    next.phase = 'resolve';
    afterFill(next, events);
    return ok(next, events);
  }

  function peelStack(state) {
    if (!state || state.phase !== 'stackDo') return blocked(state, 'stack');
    var next = clone(state);
    var events = [];
    var page = curPage(next);
    var slot = page.slots[next.slot];
    if (slot && slot.kind !== 'empty') {
      slot.stack = { status: 'peel', text: '叠层揭走了' };
    }
    next.peels += 1;
    next.stackCard = null;
    events.push({ type: 'peel', slot: next.slot, stack: true });
    logLine(next, '叠层撕掉');
    afterFill(next, events);
    return ok(next, events);
  }

  /* ---------------------------- 贴纸店 ---------------------------- */
  function findShop(id) {
    var list = B().SHOP;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function shopOffers(state) {
    var tape = state && state.tape || 0;
    return B().SHOP.map(function (item) {
      var soldOut = item.id === 'soften' && state && (state.soften || 0) >= B().SOFTEN_MAX;
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        desc: item.desc,
        affordable: tape >= item.price && !soldOut,
        soldOut: !!soldOut
      };
    });
  }

  function shopBuy(state, itemId) {
    if (!state || state.phase !== 'shop') return blocked(state, 'shop');
    var item = findShop(itemId);
    if (!item) return blocked(state, 'item');
    if ((state.tape || 0) < item.price) return blocked(state, 'tape');
    if (item.id === 'soften' && (state.soften || 0) >= B().SOFTEN_MAX) return blocked(state, 'soften');
    var next = clone(state);
    var events = [];
    applyTape(next, -item.price, events, 'shop');
    if (item.id === 'peek') next.peek += 1;
    else if (item.id === 'soften') next.soften += 1;
    else if (item.id === 'stack') { next.stackCharges += 1; next.stackSnooze = false; }
    events.push({ type: 'shop', itemId: item.id, price: item.price, tape: next.tape });
    logLine(next, '贴纸店 · ' + item.name);
    return ok(next, events);
  }

  function leaveShop(state) {
    if (!state || state.phase !== 'shop') return blocked(state, 'shop');
    if (state.spread >= 3) return finish(state);
    var next = clone(state);
    var events = [];
    next.spread += 1;
    beginTurn(next, events);
    events.push({ type: 'stage', phase: next.phase, spread: next.spread, turned: true });
    return ok(next, events);
  }

  /* ---------------------------- 小游戏 ---------------------------- */
  function gameOk(state, kind) {
    return state && state.phase === 'minigame' && state.game && (!kind || state.game.kind === kind);
  }

  function thermoCommit(state, payload) {
    if (!gameOk(state, 'thermo')) return blocked(state, 'thermo');
    var step = state.game.step;
    if (step !== 'a' && step !== 'b') return blocked(state, 'thermo');
    payload = payload || {};
    if (!isNum(payload.place) || !isNum(payload.guess)) return blocked(state, 'band');
    var n = state.game.bands.length;
    var place = Math.round(payload.place);
    var guess = Math.round(payload.guess);
    if (place < 0 || guess < 0 || place >= n || guess >= n) return blocked(state, 'band');
    var next = clone(state);
    var events = [];
    next.game[step] = { place: place, guess: guess };
    if (step === 'a') {
      next.game.step = 'b';
      events.push({ type: 'game', kind: 'thermo', step: 'b' });
    } else {
      var a = next.game.a;
      var b = next.game.b;
      var dist = Math.abs(a.place - b.place);
      next.game.dist = dist;
      next.game.gain = Math.max(1, B().THERMO_HEAT_MAX - dist);
      next.game.exact = (a.guess === b.place ? 1 : 0) + (b.guess === a.place ? 1 : 0);
      next.game.imprint = dist <= 1;
      next.game.step = 'result';
      events.push({ type: 'game', kind: 'thermo', step: 'result', dist: dist, gain: next.game.gain });
    }
    return ok(next, events);
  }

  function thermoKeep(state) {
    if (!gameOk(state, 'thermo') || state.game.step !== 'result') return blocked(state, 'thermo');
    var next = clone(state);
    var events = [];
    var g = next.game;
    var la = g.bands[g.a.place].label;
    var lb = g.bands[g.b.place].label;
    var text = next.names.a + ' 贴在「' + la + '」，' + next.names.b + ' 贴在「' + lb + '」。';
    if (g.exact) text += '有人猜中了。';
    applyHeat(next, g.gain, events, 'thermo');
    if (g.imprint) applyImprint(next, 1, events);
    var slot = {
      kind: 'thermo',
      game: 'thermo',
      title: '今晚的温度贴',
      text: text,
      a: g.a,
      b: g.b,
      bands: g.bands,
      dist: g.dist,
      tilt: tiltOf(next),
      stack: null
    };
    placeSlot(next, slot);
    next.pastes += 1;
    applyTape(next, B().TAPE_ON_PASTE, events, 'thermo');
    logLine(next, '温度贴 · 相差 ' + g.dist + ' 档');
    if (next.standalone) return finishArcade(next, events, slot, g.gain);
    next.game = null;
    afterFill(next, events);
    return ok(next, events);
  }

  function wheelSpin(state, opts) {
    opts = opts || {};
    if (!gameOk(state) || (state.game.kind !== 'truth' && state.game.kind !== 'dare')) return blocked(state, 'wheel');
    var reroll = !!opts.reroll;
    if (state.game.step === 'spun' && !reroll) return blocked(state, 'spun');
    if (state.game.step === 'ready' && reroll) return blocked(state, 'reroll');
    if (reroll) {
      if ((state.game.rerolls || 0) >= B().WHEEL_REROLLS) return blocked(state, 'reroll-max');
      if ((state.tape || 0) < B().REROLL_COST) return blocked(state, 'tape');
    }
    var next = clone(state);
    var events = [];
    if (reroll) {
      applyTape(next, -B().REROLL_COST, events, 'reroll');
      next.game.rerolls += 1;
    }
    var n = next.game.segments.length || 1;
    var idx = Math.floor(nextRand(next) * n);
    var guard = 0;
    while (reroll && n > 1 && idx === state.game.index && guard++ < 8) idx = Math.floor(nextRand(next) * n);
    next.game.index = idx;
    next.game.step = 'spun';
    next.game.who = opts.who === 'other' ? 'other' : 'self';
    var card = next.game.segments[idx];
    events.push({ type: 'game', kind: next.game.kind, step: 'spun', index: idx, card: card, reroll: reroll });
    return ok(next, events);
  }

  function wheelKeep(state) {
    if (!gameOk(state) || state.game.step !== 'spun') return blocked(state, 'wheel');
    if (state.game.kind !== 'truth' && state.game.kind !== 'dare') return blocked(state, 'wheel');
    var next = clone(state);
    var events = [];
    var g = next.game;
    var card = infoOf(g.segments[g.index]);
    noteStar(next, card.star);
    var stamp = g.kind === 'dare';
    applyHeat(next, B().heatForStar(card.star), events, g.kind);
    var who = g.who === 'other' ? otherOf(next.host) : next.host;
    var slot = {
      kind: stamp ? 'stamp' : 'sticker',
      game: g.kind,
      card: card,
      title: stamp ? '印章 · ' + card.typeName : card.typeName,
      text: card.text,
      who: who,
      from: next.host,
      tilt: stamp ? -8 : tiltOf(next),
      stack: null,
      star: card.star
    };
    placeSlot(next, slot);
    next.pastes += 1;
    applyTape(next, B().TAPE_ON_PASTE, events, g.kind);
    logLine(next, (stamp ? '印章' : '贴纸轮') + ' · ' + card.typeName);
    if (next.standalone) return finishArcade(next, events, slot, B().heatForStar(card.star));
    next.game = null;
    afterFill(next, events);
    return ok(next, events);
  }

  function mapRoll(state) {
    if (!gameOk(state, 'map') || state.game.step !== 'walk') return blocked(state, 'map');
    if ((state.game.moves || 0) >= (state.game.maxMoves || B().MAP_MOVES)) return blocked(state, 'map');
    if (state.game.pos >= state.game.tiles.length - 1) return blocked(state, 'map');
    var next = clone(state);
    var events = [];
    var step = 1 + Math.floor(nextRand(next) * 3);
    var dest = Math.min(next.game.tiles.length - 1, next.game.pos + step);
    var card = infoOf(next.game.tiles[dest]);
    next.game.pos = dest;
    next.game.moves += 1;
    next.game.lastStep = step;
    next.game.log.push({ pos: dest, step: step, card: card });
    if (next.game.moves >= next.game.maxMoves || dest >= next.game.tiles.length - 1) next.game.step = 'done';
    events.push({ type: 'game', kind: 'map', step: next.game.step, pos: dest, roll: step, card: card, moves: next.game.moves });
    return ok(next, events);
  }

  function mapKeep(state) {
    if (!gameOk(state, 'map')) return blocked(state, 'map');
    if (!state.game.log || !state.game.log.length) return blocked(state, 'map-empty');
    var next = clone(state);
    var events = [];
    var lines = [];
    for (var i = 0; i < next.game.log.length; i++) {
      var row = next.game.log[i];
      var card = infoOf(row.card);
      lines.push(card.text);
      pushExtra(next, { title: '地图第 ' + (row.pos + 1) + ' 格', text: card.text, game: 'map', star: card.star || 1 });
      noteStar(next, card.star || 1);
    }
    applyHeat(next, 1, events, 'map');
    var slot = {
      kind: 'map',
      game: 'map',
      title: '手帐地图贴',
      text: '我们一起走过 ' + next.game.log.length + ' 格。\n' + lines.join('\n'),
      log: next.game.log,
      tilt: tiltOf(next),
      stack: null
    };
    placeSlot(next, slot);
    next.pastes += 1;
    applyTape(next, B().TAPE_ON_PASTE, events, 'map');
    logLine(next, '地图 · 走了 ' + next.game.log.length + ' 格');
    if (next.standalone) return finishArcade(next, events, slot, 1);
    next.game = null;
    afterFill(next, events);
    return ok(next, events);
  }

  function finishArcade(state, events, slot, gain) {
    state.phase = 'arcadeDone';
    state.arcadePaste = {
      title: slot.title || '贴纸',
      text: slot.text || '',
      star: (slot.card && slot.card.star) || 1,
      game: slot.game || '',
      heatGain: gain || 0
    };
    events.push({ type: 'stage', phase: 'arcadeDone', paste: state.arcadePaste });
    return ok(state, events);
  }

  function openArcade(kind, settings, names, seed, extras) {
    var known = B().GAMES[kind] ? kind : 'thermo';
    var state = createBase(settings, names, seed);
    state.standalone = true;
    state.kind = 'arcade';
    state.slot = 0;
    state.spread = 1;
    if (extras && isNum(extras.heat)) state.heat = clamp(extras.heat, 0, B().HEAT_MAX);
    var events = [];
    startGame(state, known, events);
    return state;
  }

  function pasteExtra(state, paste) {
    if (!state || !state.pages) return blocked(state, 'extra');
    paste = paste || {};
    var next = clone(state);
    var events = [];
    var idx = clampInt((next.spread || 1), 1, next.pages.length) - 1;
    if (next.phase === 'poster') idx = next.pages.length - 1;
    next.spread = idx + 1;
    pushExtra(next, {
      title: String(paste.title || '贴进来的').slice(0, 40),
      text: String(paste.text || '').slice(0, 280),
      game: paste.game || '',
      star: paste.star || 1
    });
    if (paste.heatGain) applyHeat(next, paste.heatGain, events, 'extra');
    events.push({ type: 'paste', extra: true });
    logLine(next, '页边 · ' + (paste.title || '贴纸'));
    return ok(next, events);
  }

  /* ---------------------------- 收尾 / 迁移 ---------------------------- */
  function safeWord(state) {
    if (!state || typeof state !== 'object') return blocked(state, 'safe');
    if (state.phase === 'poster' && state.result) return ok(clone(state), []);
    var next = clone(state);
    var events = [];
    finishInto(next, events, true);
    return ok(next, events);
  }

  function finish(state) {
    if (!state || typeof state !== 'object') return blocked(state, 'finish');
    if (state.phase === 'poster' && state.result) return ok(clone(state), []);
    var next = clone(state);
    var events = [];
    finishInto(next, events, false);
    return ok(next, events);
  }

  function isLegacy(s) {
    if (!s || typeof s !== 'object') return false;
    if (s.kind === 'journal' || s.kind === 'arcade') return false;
    if (isArr(s.pages) && s.pages[0] && isArr(s.pages[0].slots)) return false;
    if (s.resources && !s.pages) return true;
    return false;
  }

  function legacyEntry(s) {
    s = s || {};
    var r = s.resources || {};
    var res = s.result || {};
    var names = s.names || {};
    return {
      id: s.id || ('legacy-' + (s.ts || Date.now())),
      ts: s.ts || Date.now(),
      names: { a: names.a || '他', b: names.b || '她' },
      kind: 'voyage',
      legacy: true,
      ending: res.endingId || 'voyage',
      endingName: res.endingName || '一段夜航',
      heart: r.heart || 0,
      tension: r.tension || 0,
      sync: r.sync || 0,
      heat: 0,
      imprint: 0,
      rounds: s.round || 0,
      completes: s.completes || 0,
      skips: s.skips || 0,
      pastes: s.completes || 0,
      peels: s.skips || 0,
      maxCombo: s.maxCombo || 0,
      maxStar: s.maxStarSeen || 0,
      awards: (res.awards || []).map(function (a) { return a && a.name ? a.name : String(a || ''); }),
      note: '从旧版升温夜航留下的一夜'
    };
  }

  function repairPage(page, def, i) {
    var slots = [];
    var src = page && isArr(page.slots) ? page.slots : [];
    for (var k = 0; k < B().SLOTS_PER_SPREAD; k++) {
      var slot = src[k];
      if (!slot || !slot.kind) slots.push(emptySlot(k));
      else { slot.i = k; slots.push(slot); }
    }
    return {
      id: def.id,
      name: (page && page.name) || def.name,
      sub: (page && page.sub) || def.sub,
      slots: slots,
      extras: page && isArr(page.extras) ? page.extras.slice(0, B().EXTRAS_MAX) : []
    };
  }

  function validate(input) {
    if (!input || typeof input !== 'object') return null;
    if (isLegacy(input)) return input;
    if (!isArr(input.pages) || !input.phase) return null;
    var s = clone(input);
    s.v = B().SESSION_VERSION;
    s.kind = s.kind || 'journal';
    s.settings = normalizeSettings(s.settings);
    s.names = normNames(s.names);
    s.spread = clampInt(s.spread || 1, 1, 3);
    s.heat = clamp(s.heat || 0, 0, B().HEAT_MAX);
    s.imprint = clamp(s.imprint || 0, 0, B().IMPRINT_MAX);
    s.tape = clamp(s.tape || 0, 0, B().TAPE_MAX);
    s.pastes = Math.max(0, intOr(s.pastes, 0));
    s.peels = Math.max(0, intOr(s.peels, 0));
    s.stacks = Math.max(0, intOr(s.stacks, 0));
    s.pages = B().SPREADS.map(function (def, i) { return repairPage(s.pages[i], def, i); });
    s.flags = s.flags || { safeWord: false };
    s.seen = isArr(s.seen) ? s.seen : [];
    s.hands = s.hands || { a: [], b: [] };
    s.picks = s.picks || { a: null, b: null };
    if (!isNum(s.rng)) s.rng = 1;
    return s;
  }

  function handCards(state, which) {
    return handList(state || {}, which).map(infoOf).filter(Boolean);
  }

  function previewDraw(settings, n, seed) {
    var s = createBase(settings, { a: '甲', b: '乙' }, seed === undefined ? 1 : seed);
    return drawInfos(s, n || B().HAND_SIZE, {});
  }

  function progress(state) {
    if (!state) return null;
    var page = state.pages && state.pages[clampInt(state.spread || 1, 1, 3) - 1];
    var filled = 0;
    if (page) for (var i = 0; i < page.slots.length; i++) if (page.slots[i].kind !== 'empty') filled++;
    var sp = B().spreadById(state.spread || 1);
    return {
      spread: state.spread,
      spreadName: sp.name,
      phase: state.phase,
      mode: state.mode,
      host: state.host,
      slot: state.slot,
      filled: filled,
      total: B().SLOTS_PER_SPREAD,
      heat: state.heat || 0,
      imprint: state.imprint || 0,
      tape: state.tape || 0
    };
  }

  root.Engine = {
    version: '2.0.0',
    newSession: newSession,
    chooseSticker: chooseSticker,
    lockSecret: lockSecret,
    resolvePair: resolvePair,
    paste: paste,
    peel: peel,
    acceptStack: acceptStack,
    declineStack: declineStack,
    pasteStack: pasteStack,
    peelStack: peelStack,
    shopOffers: shopOffers,
    shopBuy: shopBuy,
    leaveShop: leaveShop,
    thermoCommit: thermoCommit,
    thermoKeep: thermoKeep,
    wheelSpin: wheelSpin,
    wheelKeep: wheelKeep,
    mapRoll: mapRoll,
    mapKeep: mapKeep,
    openArcade: openArcade,
    pasteExtra: pasteExtra,
    safeWord: safeWord,
    finish: finish,
    validate: validate,
    isLegacy: isLegacy,
    legacyEntry: legacyEntry,
    handCards: handCards,
    cardByKey: cardByKey,
    pairRelation: pairRelation,
    previewDraw: previewDraw,
    progress: progress,
    effectiveMax: effectiveMax
  };
})(typeof window !== 'undefined' ? window : this);
