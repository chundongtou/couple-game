/* ==========================================================================
 * 今晚在这间公寓 —— 规则引擎
 * 纯逻辑：无 DOM、无 localStorage。UI 只派发动作。
 * 两个人、一部手机、一枚「我们」。没有三选一，没有贴纸格。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  function B() { return root.Balance; }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

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

  function rngOf(state) { return createRng(state.rng); }
  function saveRng(state, rng) { state.rng = rng.state(); }

  function pack(state, events) {
    return { state: state, events: events || [] };
  }
  function blocked(state, reason) {
    return pack(state, [{ type: 'blocked', reason: reason }]);
  }

  function norm(s) {
    return String(s || '').toLowerCase().replace(/\s+/g, '');
  }

  function capOf(state) {
    var b = B();
    var c = clamp(parseInt(state && state.settings && state.settings.maxStar, 10) || 1, 1, 4);
    if (state && state.settings && state.settings.gentleOnly) c = Math.min(c, 2);
    return c;
  }

  function explicitRe() { return new RegExp(B().EXPLICIT_SRC); }
  function gentleExtraRe() { return new RegExp(B().GENTLE_EXTRA_SRC); }

  function band(state, opts) {
    opts = opts || {};
    var b = B();
    var cap = capOf(state);
    var heat = clamp((state && state.heat) || 0, 0, b.HEAT_MAX);
    var spec = b.BAND[cap] || b.BAND[1];
    var maxStar = heat >= spec.hotAt ? spec.hotMax : spec.baseMax;
    var minPrefer = spec.prefer;
    if (spec.preferMidAt != null && heat >= spec.preferMidAt) minPrefer = spec.preferMid;
    if (heat >= spec.preferHotAt) minPrefer = spec.preferHot;
    if (opts.deeper && cap === 2) {
      maxStar = Math.max(maxStar, 3);
      minPrefer = Math.min(maxStar, minPrefer + 1);
    } else if (opts.deeper && cap >= 3) {
      minPrefer = Math.min(maxStar, minPrefer + 1);
    }
    if (cap <= 1) { maxStar = 1; minPrefer = 1; }
    if (minPrefer > maxStar) minPrefer = maxStar;
    return { cap: cap, maxStar: maxStar, minPrefer: minPrefer, heat: heat };
  }

  function hitsBoundary(card, state) {
    var list = ((state.settings && state.settings.blacklist) || []).map(norm).filter(Boolean);
    if (!list.length) return false;
    var tags = (card.tags || []).map(norm);
    var text = norm(card.text);
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (tags.indexOf(item) >= 0) return true;
      if (item && text.indexOf(item) >= 0) return true;
    }
    return false;
  }

  function cardAllowed(card, state, bandOpt) {
    if (!card || !card.text) return false;
    if (card.pool === 'punish' || card.type === 'punish') return false;
    var bd = bandOpt || band(state);
    var star = Number(card.star) || 1;
    if (star > bd.maxStar) return false;
    if (hitsBoundary(card, state)) return false;
    if (bd.cap <= 2 && explicitRe().test(card.text)) return false;
    if (bd.cap <= 1) {
      if (star > 1) return false;
      if (gentleExtraRe().test(card.text)) return false;
      var block = B().GENTLE_BLOCK_TAGS;
      var tags = card.tags || [];
      for (var i = 0; i < tags.length; i++) if (block.indexOf(tags[i]) >= 0) return false;
    }
    return true;
  }

  function isQuestion(card) {
    return /[？?]|吗|什么|哪|为什么|有没有|想不想|敢不敢|还是/.test(card.text || '');
  }

  function usable(card, state, bd, opts) {
    if (!cardAllowed(card, state, bd)) return false;
    if ((card.pool === 'spark' || card.type === 'spark') && bd.maxStar < 4) return false;
    if (opts && opts.talk && (card.pool === 'spark' || card.type === 'spark') && !isQuestion(card)) return false;
    return true;
  }

  function eachCard(fn) {
    var C = global.CARDS || {};
    var pools = ['truth', 'dare', 'touch', 'sync', 'spark', 'punish'];
    for (var p = 0; p < pools.length; p++) {
      var list = C[pools[p]] || [];
      for (var i = 0; i < list.length; i++) fn(list[i], pools[p]);
    }
  }

  function weightOf(card, bd) {
    var s = Number(card.star) || 1;
    var w = 1;
    if (s >= bd.minPrefer) w = 6 + (s - bd.minPrefer) * 4;
    else if (s >= bd.minPrefer - 1) w = 2;
    if (bd.cap >= 4 && s >= 4) w += 6;
    else if (bd.cap === 3 && s >= 4) w += 3;
    return w;
  }

  function pickWeighted(items, rng) {
    var total = 0;
    for (var i = 0; i < items.length; i++) total += items[i].w;
    if (total <= 0) return items[0].card;
    var t = rng.next() * total;
    for (var j = 0; j < items.length; j++) {
      t -= items[j].w;
      if (t < 0) return items[j].card;
    }
    return items[items.length - 1].card;
  }

  function fallbackCard(state) {
    var list = B().FALLBACK_CARDS;
    var rng = rngOf(state);
    var card = list[Math.floor(rng.next() * list.length)];
    saveRng(state, rng);
    return {
      id: card.id, text: card.text, star: 1, tags: [], pool: card.pool || 'truth',
      type: card.pool || 'truth', fallback: true, src: 'apartment'
    };
  }

  function collect(state, pools, bd, opts, ignoreUsed) {
    var want = {};
    for (var i = 0; i < pools.length; i++) want[pools[i]] = true;
    var used = state.used || {};
    var items = [];
    eachCard(function (raw, pool) {
      if (!want[pool]) return;
      if (!ignoreUsed && used[pool] && used[pool][raw.id]) return;
      var card = {
        id: raw.id, text: raw.text, star: raw.star, tags: raw.tags || [],
        pool: pool, type: pool, src: raw.src || ''
      };
      if (!usable(card, state, bd, opts)) return;
      items.push({ card: card, w: weightOf(card, bd) });
    });
    return items;
  }

  function clearUsed(state, pools) {
    state.used = state.used || {};
    for (var i = 0; i < pools.length; i++) state.used[pools[i]] = {};
  }

  function takeCard(state, pools, bd, opts) {
    var items = collect(state, pools, bd, opts, false);
    if (!items.length) {
      clearUsed(state, pools);
      items = collect(state, pools, bd, opts, false);
    }
    if (!items.length) return fallbackCard(state);
    var rng = rngOf(state);
    var card = pickWeighted(items, rng);
    saveRng(state, rng);
    state.used = state.used || {};
    state.used[card.pool] = state.used[card.pool] || {};
    state.used[card.pool][card.id] = true;
    return card;
  }

  function nextId(state) {
    state.seq = (state.seq || 0) + 1;
    return 'n' + state.seq;
  }

  function pushLog(state, prompt, outcome) {
    var card = (prompt && prompt.card) || {};
    state.log.push({
      id: nextId(state),
      room: (prompt && prompt.room) || state.room || '',
      game: (prompt && (prompt.mode || prompt.role)) || state.game || state.room || '',
      text: card.text || prompt.text || '',
      star: card.star || 0,
      tags: card.tags || [],
      outcome: outcome || 'done',
      who: (prompt && prompt.who) || '',
      via: (prompt && prompt.via) || ''
    });
  }

  function heatGain(state, base) {
    var mult = B().HEAT_MULT[capOf(state)] || 1;
    return Math.max(1, Math.round((Number(base) || 1) * mult));
  }

  function addHeat(state, amount) {
    var b = B();
    var next = clamp((state.heat || 0) + (amount || 0), 0, b.HEAT_MAX);
    var delta = next - (state.heat || 0);
    state.heat = next;
    return delta;
  }

  function blankLit() {
    return { living: false, kitchen: false, balcony: false, bathroom: false, bedroom: false };
  }
  function blankVisits() {
    return { living: 0, kitchen: 0, balcony: 0, bathroom: 0, bedroom: 0 };
  }

  function normalizeSettings(settings) {
    var d = B().DEFAULT_SETTINGS;
    settings = settings || {};
    var names = settings.names || d.names;
    var blacklist = Array.isArray(settings.blacklist) ? settings.blacklist : [];
    blacklist = blacklist.map(function (x) { return String(x || '').trim(); }).filter(Boolean).slice(0, 24);
    return {
      maxStar: clamp(parseInt(settings.maxStar, 10) || d.maxStar, 1, 4),
      sound: settings.sound !== false,
      haptics: settings.haptics !== false,
      reduced: !!settings.reduced,
      gentleOnly: !!settings.gentleOnly,
      blacklist: blacklist,
      names: {
        a: (names.a && String(names.a).trim()) || d.names.a,
        b: (names.b && String(names.b).trim()) || d.names.b
      }
    };
  }

  function newSession(settings, names, seed) {
    var b = B();
    var merged = normalizeSettings(settings || {});
    if (names) {
      if (names.a) merged.names.a = String(names.a).trim() || merged.names.a;
      if (names.b) merged.names.b = String(names.b).trim() || merged.names.b;
    }
    var cap = merged.gentleOnly ? Math.min(merged.maxStar, 2) : merged.maxStar;
    var heat = b.HEAT_START[cap] || b.HEAT_START[1];
    var now = Date.now();
    return {
      v: b.SESSION_VERSION,
      kind: 'apartment',
      mode: 'night',
      game: null,
      id: 'apt-' + now.toString(36) + '-' + ((Number(seed) >>> 0) || (now % 100000)).toString(36),
      ts: now,
      names: { a: merged.names.a, b: merged.names.b },
      settings: merged,
      phase: 'plan',
      room: null,
      at: 'foyer',
      heat: heat,
      heatBase: heat,
      minutes: b.START_MINUTES,
      lit: blankLit(),
      visits: blankVisits(),
      log: [],
      used: {},
      truthRerolls: b.REROLLS.truth,
      dareRerolls: b.REROLLS.dare,
      prompt: null,
      wheel: null,
      thermo: null,
      stroll: null,
      bedroomMode: null,
      flags: {},
      pasted: {},
      seq: 0,
      rng: (Number(seed) >>> 0) || ((now % 2147483646) + 1),
      result: null,
      archived: false
    };
  }

  function isLegacy(state) {
    if (!state || typeof state !== 'object') return false;
    if (state.kind === 'apartment') return false;
    if (state.hand || state.act || state.tokens || state.resources) return true;
    var ph = state.phase;
    return !!(ph && ['draft', 'play', 'resolve', 'escalate', 'event', 'act', 'shop', 'finale'].indexOf(ph) >= 0);
  }

  function archiveLegacy(state) {
    var res = (state && state.resources) || {};
    var result = (state && state.result) || {};
    var done = state && state.phase === 'finale';
    return {
      id: (state && state.id) || ('legacy-' + ((state && state.ts) || 0)),
      ts: (state && state.ts) || Date.now(),
      kind: 'voyage',
      title: '以前的夜航',
      endingName: result.endingName || (done ? '已靠岸' : '未走完的夜航'),
      note: '这是升温夜航的记录，已收进以前的夜，不会在这间公寓里继续。',
      heart: res.heart || 0,
      tension: res.tension || 0,
      sync: res.sync || 0,
      rounds: (state && state.round) || 0,
      safe: !!(state && state.flags && state.flags.safeWord),
      imported: true,
      rooms: [],
      names: (state && state.names) || null
    };
  }

  function knownRoom(id) { return B().ROOMS.indexOf(id) >= 0; }

  function roomOpen(state, roomId) {
    if (!knownRoom(roomId)) return { ok: false, locked: false, reason: 'unknown' };
    /* 卧室从第一分钟就开着，不做成夜末锁。 */
    return { ok: true, locked: false, reason: 'open' };
  }

  function enterRoom(state, roomId) {
    if (!state || state.kind !== 'apartment') return blocked(state, 'no-session');
    if (state.phase === 'done') return blocked(state, 'done');
    var gate = roomOpen(state, roomId);
    if (!gate.ok) return blocked(state, gate.reason);
    var b = B();
    var s = clone(state);
    var cap = capOf(s);
    if (s.mode !== 'standalone') {
      var gain = Math.max(1, Math.round((b.VISIT_HEAT[roomId] || 8) * (b.HEAT_MULT[cap] || 1)));
      if ((s.visits[roomId] || 0) > 0) gain = Math.max(1, Math.round(gain * b.REVISIT_RATIO));
      s.visits[roomId] = (s.visits[roomId] || 0) + 1;
      s.lit[roomId] = true;
      addHeat(s, gain);
      s.minutes = (s.minutes || b.START_MINUTES) + (b.ROOM_MINUTES[roomId] || 12);
    }
    s.phase = 'room';
    s.room = roomId;
    s.at = roomId;
    s.prompt = null;
    s.wheel = null;
    s.thermo = null;
    s.bedroomMode = null;
    s.stroll = null;
    return pack(s, [{ type: 'enter', room: roomId, heat: s.heat, lit: true }]);
  }

  function leaveRoom(state) {
    if (!state || state.kind !== 'apartment') return blocked(state, 'no-session');
    if (state.phase === 'done') return pack(state, []);
    var s = clone(state);
    s.at = s.room || s.at || 'foyer';
    s.phase = 'plan';
    s.prompt = null;
    s.wheel = null;
    s.thermo = null;
    s.bedroomMode = null;
    s.stroll = null;
    return pack(s, [{ type: 'leave', at: s.at }]);
  }

  function drawPrompt(state, opts) {
    if (!state || state.kind !== 'apartment') return blocked(state, 'no-session');
    opts = opts || {};
    var s = clone(state);
    var bd = band(s, opts);
    var pools = (opts.pools || ['truth']).slice();
    pools = pools.filter(function (p) {
      if (p === 'punish') return false;
      if (p === 'spark' && bd.maxStar < 4) return false;
      return true;
    });
    if (!pools.length) pools = ['truth'];
    var card = takeCard(s, pools, bd, opts);
    s.prompt = {
      card: card,
      room: opts.room || s.room,
      pools: pools,
      who: opts.who || null,
      role: opts.role || null,
      mode: opts.mode || null,
      deeper: !!opts.deeper,
      talk: !!opts.talk
    };
    return pack(s, [{ type: 'prompt', card: card, band: bd }]);
  }

  function livingOffer(state, opts) {
    opts = opts || {};
    if (!state || state.room !== 'living') return blocked(state, 'not-living');
    return drawPrompt(state, {
      pools: ['truth', 'sync'],
      room: 'living',
      who: opts.who || 'a',
      role: opts.role || 'ask',
      talk: true,
      deeper: false
    });
  }

  function pushDeeper(state) {
    if (!state || !state.prompt) return blocked(state, 'no-prompt');
    var prev = state.prompt;
    var pools = (prev.pools || ['truth']).slice();
    var bd = band(state, { deeper: true });
    if (bd.maxStar >= 4 && pools.indexOf('spark') < 0 && (prev.room === 'living' || prev.room === 'bedroom' || prev.talk)) {
      pools.push('spark');
    }
    var ret = drawPrompt(state, {
      pools: pools,
      room: prev.room,
      who: prev.who,
      role: prev.role,
      mode: prev.mode,
      talk: !!prev.talk || prev.room === 'living' || prev.room === 'bathroom',
      deeper: true
    });
    var s = ret.state;
    var gain = heatGain(s, bd.cap >= 3 ? 4 : 2);
    if (bd.cap <= 1) gain = heatGain(s, 1);
    var delta = addHeat(s, gain);
    pushLog(s, prev, 'deeper');
    ret.events.push({ type: 'heat', delta: delta, heat: s.heat });
    return ret;
  }

  function settlePrompt(state, outcome) {
    if (!state || !state.prompt) return blocked(state, 'no-prompt');
    var s = clone(state);
    var card = s.prompt.card || {};
    var how = outcome || 'done';
    var delta = 0;
    if (how === 'done') delta = addHeat(s, heatGain(s, Math.max(2, (card.star || 1) * 2)));
    else if (how === 'hold') delta = addHeat(s, heatGain(s, 1));
    pushLog(s, s.prompt, how);
    if (s.mode !== 'standalone' && s.prompt.room && s.lit && s.prompt.room in s.lit) s.lit[s.prompt.room] = true;
    s.prompt = null;
    return pack(s, [{ type: 'settle', outcome: how, delta: delta, heat: s.heat }]);
  }

  function dealWheelMut(s, kind) {
    var bd = band(s);
    var talk = kind === 'truth';
    var pools = talk ? ['truth'] : ['dare', 'touch'];
    if (!talk && bd.maxStar >= 4) pools.push('spark');
    if (talk && bd.cap >= 3 && bd.maxStar >= 4) pools.push('spark');
    var slots = [];
    for (var i = 0; i < 6; i++) slots.push(takeCard(s, pools, bd, { talk: talk }));
    s.wheel = { kind: kind, slots: slots, index: null, spun: false, pools: pools };
    s.prompt = null;
    return pack(s, [{ type: 'deal', kind: kind, slots: slots.length }]);
  }

  function dealWheel(state, kind) {
    if (!state || state.kind !== 'apartment') return blocked(state, 'no-session');
    if (kind !== 'truth' && kind !== 'dare') return blocked(state, 'kind');
    return dealWheelMut(clone(state), kind);
  }

  function spinWheel(state) {
    if (!state || !state.wheel || !state.wheel.slots || !state.wheel.slots.length) return blocked(state, 'no-wheel');
    var s = clone(state);
    var rng = rngOf(s);
    var idx = Math.floor(rng.next() * s.wheel.slots.length);
    saveRng(s, rng);
    s.wheel.index = idx;
    s.wheel.spun = true;
    var card = s.wheel.slots[idx];
    s.prompt = {
      card: card,
      room: s.room,
      pools: s.wheel.pools,
      who: null,
      role: 'wheel',
      mode: s.wheel.kind,
      talk: s.wheel.kind === 'truth'
    };
    return pack(s, [{ type: 'spin', index: idx, card: card }]);
  }

  function rerollWheel(state) {
    if (!state || !state.wheel) return blocked(state, 'no-wheel');
    var key = state.wheel.kind === 'truth' ? 'truthRerolls' : 'dareRerolls';
    if ((state[key] || 0) <= 0) return blocked(state, 'no-reroll');
    var s = clone(state);
    s[key] = (s[key] || 0) - 1;
    var kind = s.wheel.kind;
    return dealWheelMut(s, kind);
  }

  function handTruth(state, who) {
    if (!state || !state.prompt) return blocked(state, 'no-prompt');
    var s = clone(state);
    s.prompt.who = who === 'other' ? 'other' : 'self';
    s.prompt.hand = s.prompt.who;
    return pack(s, [{ type: 'hand', who: s.prompt.who }]);
  }

  function thermoMax(cap) {
    var labels = B().THERMO_LABELS[cap] || B().THERMO_LABELS[1];
    return labels.length - 1;
  }

  function thermoBegin(state) {
    if (!state || state.kind !== 'apartment') return blocked(state, 'no-session');
    var s = clone(state);
    var cap = capOf(s);
    s.thermo = { max: thermoMax(cap), a: null, b: null, passing: false, revealed: false, delta: 0, err: null, closeness: null };
    return pack(s, [{ type: 'thermo', max: s.thermo.max }]);
  }

  function thermoSet(state, player, place, guess) {
    if (!state) return blocked(state, 'no-session');
    if (player !== 'a' && player !== 'b') return blocked(state, 'player');
    var s = clone(state);
    if (!s.thermo) s.thermo = { max: thermoMax(capOf(s)), a: null, b: null, passing: false, revealed: false };
    if (s.thermo.revealed) return blocked(state, 'revealed');
    var max = s.thermo.max;
    s.thermo[player] = {
      place: clamp(Math.round(Number(place) || 0), 0, max),
      guess: clamp(Math.round(Number(guess) || 0), 0, max)
    };
    return pack(s, [{ type: 'lock', player: player }]);
  }

  function thermoPass(state) {
    if (!state || !state.thermo || !state.thermo.a) return blocked(state, 'no-a');
    var s = clone(state);
    s.thermo.passing = true;
    return pack(s, [{ type: 'pass-phone' }]);
  }

  function thermoReveal(state) {
    if (!state || !state.thermo) return blocked(state, 'no-thermo');
    if (!state.thermo.a || !state.thermo.b) return blocked(state, 'incomplete');
    if (state.thermo.revealed) return pack(state, []);
    var s = clone(state);
    var t = s.thermo;
    var err = Math.abs(t.a.guess - t.b.place) + Math.abs(t.b.guess - t.a.place);
    var maxErr = t.max * 2;
    var closeness = maxErr === 0 ? 1 : 1 - err / maxErr;
    var mult = B().HEAT_MULT[capOf(s)] || 1;
    var delta = Math.round(closeness * 16 * mult);
    var avg = (t.a.place + t.b.place) / 2;
    delta += Math.round((avg / Math.max(1, t.max)) * 6 * mult);
    delta = addHeat(s, delta);
    t.revealed = true;
    t.err = err;
    t.closeness = Math.round(closeness * 100) / 100;
    t.delta = delta;
    var names = s.names || { a: '他', b: '她' };
    pushLog(s, {
      card: { text: names.a + ' 和 ' + names.b + ' 在阳台上对了温度。猜近了 ' + Math.round(closeness * 100) + '。', star: 0, tags: [] },
      room: 'balcony',
      role: 'thermo',
      mode: 'thermo'
    }, 'reveal');
    if (s.mode !== 'standalone' && s.lit) s.lit.balcony = true;
    return pack(s, [{ type: 'reveal', delta: delta, closeness: t.closeness, err: err, heat: s.heat }]);
  }

  function bedroomMode(state, mode) {
    if (!state || state.room !== 'bedroom') return blocked(state, 'not-bedroom');
    var s = clone(state);
    s.bedroomMode = mode === 'act' ? 'act' : 'talk';
    s.prompt = null;
    return pack(s, [{ type: 'mode', mode: s.bedroomMode }]);
  }

  function bedroomDraw(state) {
    if (!state || state.room !== 'bedroom') return blocked(state, 'not-bedroom');
    var mode = state.bedroomMode || 'talk';
    var pools = mode === 'act' ? ['touch', 'dare'] : ['truth', 'sync'];
    var bd = band(state);
    if (bd.maxStar >= 4) pools.push('spark');
    return drawPrompt(state, {
      pools: pools,
      room: 'bedroom',
      mode: mode,
      talk: mode !== 'act',
      role: mode
    });
  }

  function strollStart(state) {
    if (!state || state.kind !== 'apartment') return blocked(state, 'no-session');
    if (state.phase === 'done') return blocked(state, 'done');
    var s = clone(state);
    s.phase = 'stroll';
    s.room = null;
    s.prompt = null;
    s.wheel = null;
    s.thermo = null;
    s.stroll = { pos: 0, pending: null, turns: 0, lastDie: 0 };
    return pack(s, [{ type: 'stroll', pos: 0 }]);
  }

  function poolsFor(room, bd) {
    var map = {
      living: ['truth', 'sync'],
      kitchen: ['dare', 'touch'],
      balcony: ['truth', 'sync'],
      bathroom: ['truth'],
      bedroom: ['touch', 'dare', 'truth']
    };
    var pools = (map[room] || ['truth']).slice();
    if (bd.maxStar >= 4 && (room === 'bedroom' || room === 'kitchen')) pools.push('spark');
    if (bd.maxStar >= 4 && room === 'bathroom') pools.push('spark');
    return pools;
  }

  function strollRoll(state) {
    if (!state || state.phase !== 'stroll' || !state.stroll) return blocked(state, 'not-stroll');
    if (state.stroll.pending) return blocked(state, 'pending');
    var s = clone(state);
    var rng = rngOf(s);
    var die = 1 + Math.floor(rng.next() * 3);
    saveRng(s, rng);
    var tiles = B().STROLL_TILES;
    var pos = (s.stroll.pos + die) % tiles.length;
    var tile = tiles[pos];
    s.stroll.pos = pos;
    s.stroll.lastDie = die;
    s.stroll.turns += 1;
    var bd = band(s);
    var pools = poolsFor(tile.room, bd);
    var talk = tile.room === 'living' || tile.room === 'bathroom' || tile.room === 'balcony';
    var card = takeCard(s, pools, bd, { talk: talk });
    s.stroll.pending = { tile: { id: tile.id, room: tile.room, name: tile.name }, card: card };
    if (s.mode !== 'standalone' && s.lit && tile.room in s.lit) s.lit[tile.room] = true;
    return pack(s, [{ type: 'land', die: die, tile: s.stroll.pending.tile, card: card }]);
  }

  function strollSettle(state, outcome) {
    if (!state || !state.stroll || !state.stroll.pending) return blocked(state, 'no-pending');
    var s = clone(state);
    var pending = s.stroll.pending;
    var how = outcome === 'pass' ? 'pass' : 'done';
    var delta = 0;
    if (how === 'done') delta = addHeat(s, heatGain(s, Math.max(2, (pending.card.star || 1) * 2)));
    pushLog(s, { card: pending.card, room: pending.tile.room, role: 'stroll', mode: 'stroll', who: '我们' }, how);
    if (s.mode !== 'standalone' && s.lit) s.lit[pending.tile.room] = true;
    s.stroll.pending = null;
    return pack(s, [{ type: 'settle', outcome: how, delta: delta, heat: s.heat, room: pending.tile.room }]);
  }

  function clockLabel(state) {
    var m = (state && state.minutes) || B().START_MINUTES;
    var h = Math.floor(m / 60) % 24;
    var min = m % 60;
    return pad2(h) + ':' + pad2(min);
  }

  function buildMemory(state) {
    var b = B();
    var lit = state.lit || {};
    var visits = state.visits || {};
    var rooms = [];
    b.ROOMS.forEach(function (id) {
      if (lit[id]) rooms.push({ id: id, name: b.ROOM_META[id].name, visits: visits[id] || 0 });
    });
    var safe = !!(state.flags && state.flags.safeWord);
    var line = b.MEMORY_LINES.warm;
    if (safe) line = b.MEMORY_LINES.safe;
    else if (!rooms.length && !(state.log || []).length) line = b.MEMORY_LINES.empty;
    else if ((state.heat || 0) >= b.HEAT_CHARGED) line = b.MEMORY_LINES.deep;
    var cap = capOf(state);
    return {
      title: b.MEMORY_TITLE,
      names: state.names || { a: '他', b: '她' },
      heat: state.heat || 0,
      stage: b.stageOf(state.heat || 0),
      intensity: cap,
      intensityName: (b.INTENSITY[cap] && b.INTENSITY[cap].name) || '',
      rooms: rooms,
      moments: (state.log || []).slice(),
      safe: safe,
      line: line,
      clock: clockLabel(state),
      shamed: false
    };
  }

  function finish(state, safe) {
    if (!state || state.kind !== 'apartment') return blocked(state, 'no-session');
    if (state.phase === 'done' && state.result) return pack(state, [{ type: 'ending', safe: !!state.result.safe }]);
    var s = clone(state);
    if (safe) s.flags = Object.assign({}, s.flags, { safeWord: true });
    s.phase = 'done';
    s.result = buildMemory(s);
    return pack(s, [{ type: safe ? 'safe' : 'close', heat: s.heat, result: s.result }]);
  }

  function safeWord(state) {
    if (!state) return blocked(state, 'no-session');
    var beforeHeat = state.heat;
    var beforeLog = (state.log || []).length;
    var ret = finish(state, true);
    /* 安全词不改热度、不改已经发生的记录。 */
    if (ret.state && ret.state !== state) {
      ret.state.heat = beforeHeat;
      if (ret.state.result) ret.state.result.heat = beforeHeat;
    }
    if (ret.state && (ret.state.log || []).length !== beforeLog) {
      ret.state.log = clone(state.log || []);
    }
    return ret;
  }

  function closeNight(state) { return finish(state, false); }

  var GAME_ROOM = { thermo: 'balcony', truth: 'bathroom', dare: 'kitchen', stroll: null };

  function newStandalone(game, settings, seed) {
    if (GAME_ROOM[game] === undefined && game !== 'stroll') game = 'dare';
    var names = settings && settings.names;
    var s = newSession(settings || {}, names, seed);
    s.mode = 'standalone';
    s.game = game;
    s.id = 'door-' + s.id;
    s.heatBase = s.heat;
    if (game === 'stroll') {
      var st = strollStart(s);
      st.state.mode = 'standalone';
      st.state.game = 'stroll';
      return st.state;
    }
    var entered = enterRoom(s, GAME_ROOM[game]);
    entered.state.mode = 'standalone';
    entered.state.game = game;
    entered.state.heat = s.heatBase;
    entered.state.heatBase = s.heatBase;
    entered.state.lit = blankLit();
    entered.state.visits = blankVisits();
    return entered.state;
  }

  function standalonePack(state) {
    if (!state) return null;
    var rooms = [];
    (state.log || []).forEach(function (m) {
      if (m.room && rooms.indexOf(m.room) < 0) rooms.push(m.room);
    });
    if (!rooms.length && state.room) rooms.push(state.room);
    return {
      id: state.id,
      game: state.game || state.room,
      room: state.room,
      heatDelta: Math.max(0, (state.heat || 0) - (state.heatBase || 0)),
      moments: clone(state.log || []),
      rooms: rooms
    };
  }

  function pasteStandalone(night, payload) {
    if (!night || night.kind !== 'apartment' || night.mode === 'standalone') return blocked(night, 'no-night');
    if (!payload || !payload.id) return blocked(night, 'no-pack');
    if (night.phase === 'done') return blocked(night, 'done');
    var s = clone(night);
    s.pasted = s.pasted || {};
    if (s.pasted[payload.id]) return pack(s, [{ type: 'paste', already: true, id: payload.id }]);
    s.pasted[payload.id] = true;
    var delta = addHeat(s, Math.max(0, Math.round(payload.heatDelta || 0)));
    (payload.moments || []).forEach(function (m) {
      s.log.push({
        id: nextId(s),
        room: m.room || payload.room || '',
        game: m.game || payload.game || 'door',
        text: m.text || '',
        star: m.star || 0,
        tags: m.tags || [],
        outcome: m.outcome || 'done',
        who: m.who || '',
        via: 'door'
      });
    });
    var rooms = payload.rooms || [];
    if (!rooms.length && payload.room) rooms = [payload.room];
    rooms.forEach(function (r) {
      if (s.lit && Object.prototype.hasOwnProperty.call(s.lit, r)) s.lit[r] = true;
    });
    return pack(s, [{ type: 'paste', already: false, id: payload.id, delta: delta, heat: s.heat }]);
  }

  function validate(state) {
    if (!state || typeof state !== 'object') return null;
    if (isLegacy(state)) return null;
    if (state.kind !== 'apartment') return null;
    var b = B();
    var s = clone(state);
    s.settings = normalizeSettings(s.settings);
    s.names = s.names || s.settings.names;
    s.heat = clamp(Number(s.heat) || 0, 0, b.HEAT_MAX);
    s.heatBase = clamp(Number(s.heatBase) || s.heat, 0, b.HEAT_MAX);
    s.lit = Object.assign(blankLit(), s.lit || {});
    s.visits = Object.assign(blankVisits(), s.visits || {});
    b.ROOMS.forEach(function (r) {
      s.lit[r] = !!s.lit[r];
      s.visits[r] = Math.max(0, parseInt(s.visits[r], 10) || 0);
    });
    if (['plan', 'room', 'stroll', 'done'].indexOf(s.phase) < 0) s.phase = 'plan';
    s.log = Array.isArray(s.log) ? s.log : [];
    s.truthRerolls = clamp(s.truthRerolls == null ? b.REROLLS.truth : s.truthRerolls, 0, 6);
    s.dareRerolls = clamp(s.dareRerolls == null ? b.REROLLS.dare : s.dareRerolls, 0, 6);
    s.pasted = s.pasted || {};
    s.flags = s.flags || {};
    s.minutes = s.minutes || b.START_MINUTES;
    if (s.phase === 'done' && !s.result) s.result = buildMemory(s);
    return s;
  }

  function heatStage(state) { return B().stageOf(state && state.heat); }

  root.Engine = {
    newSession: newSession,
    validate: validate,
    isLegacy: isLegacy,
    archiveLegacy: archiveLegacy,
    band: band,
    capOf: capOf,
    cardAllowed: cardAllowed,
    heatStage: heatStage,
    roomOpen: roomOpen,
    enterRoom: enterRoom,
    leaveRoom: leaveRoom,
    drawPrompt: drawPrompt,
    livingOffer: livingOffer,
    pushDeeper: pushDeeper,
    settlePrompt: settlePrompt,
    dealWheel: dealWheel,
    spinWheel: spinWheel,
    rerollWheel: rerollWheel,
    handTruth: handTruth,
    thermoBegin: thermoBegin,
    thermoSet: thermoSet,
    thermoPass: thermoPass,
    thermoReveal: thermoReveal,
    bedroomMode: bedroomMode,
    bedroomDraw: bedroomDraw,
    strollStart: strollStart,
    strollRoll: strollRoll,
    strollSettle: strollSettle,
    safeWord: safeWord,
    closeNight: closeNight,
    buildMemory: buildMemory,
    newStandalone: newStandalone,
    standalonePack: standalonePack,
    pasteStandalone: pasteStandalone,
    clockLabel: clockLabel
  };
})(typeof window !== 'undefined' ? window : this);
