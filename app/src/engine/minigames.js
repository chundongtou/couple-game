/* ==========================================================================
 * 今晚飞行棋 · 温度计 / 真心话转盘 / 大冒险转盘
 * 纯逻辑。不读不写公寓热度。旧 stroll* 不再提供。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var THERMO_LABELS = {
    1: ['还想聊天', '坐近一点', '靠着肩', '牵着手', '想被抱一下', '额头碰额头', '轻声说喜欢'],
    2: ['看着就好', '靠得很近', '吻在嘴角', '手停在腰上', '吻得更深', '衣领会松', '想被碰到衣服里', '今晚别只是抱'],
    3: ['还在说话', '吻深一点', '手放进来', '压近一点', '想被要', '别停在前戏', '去更暗的地方', '看着我做', '再狠一点', '现在就继续', '做到出汗'],
    4: ['还能等', '想被吻狠一点', '手不要停', '衣服可以脱掉', '想听你的声音', '别只是磨', '换到更近的地方', '照你想的来', '做到腿软', '今晚不用收着', '你想要到哪']
  };

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

  function fail(state, code, message) {
    return { ok: false, state: state || null, events: [], error: { code: code, message: message } };
  }
  function ok(state, events) {
    if (state && Object.prototype.hasOwnProperty.call(state, 'heat')) delete state.heat;
    return { ok: true, state: state, events: events || [], error: null };
  }

  function draw() { return root.FlightDraw; }

  function capOf(state) {
    var D = draw();
    if (D && D.SCALE_CAP && D.SCALE_CAP[state.scale]) return D.SCALE_CAP[state.scale];
    return state.maxStarCap || 2;
  }

  function stripHeat(s) {
    if (s && Object.prototype.hasOwnProperty.call(s, 'heat')) delete s.heat;
    return s;
  }

  function thermoBegin(state) {
    if (!state) return fail(null, 'NO_SESSION', '没有温度计可开始');
    var s = stripHeat(clone(state));
    var cap = capOf(s);
    var labels = THERMO_LABELS[cap] || THERMO_LABELS[2];
    s.thermo = {
      max: labels.length - 1,
      labels: labels,
      a: null,
      b: null,
      passing: false,
      revealed: false
    };
    return ok(s, [{ type: 'thermo', max: s.thermo.max }]);
  }

  function thermoSet(state, player, place, guess) {
    if (!state) return fail(null, 'NO_SESSION', '没有温度计');
    if (player !== 'a' && player !== 'b') return fail(state, 'AWAITING_OTHER', '要分清是谁');
    var s = stripHeat(clone(state));
    if (!s.thermo) return fail(state, 'AWAITING_OTHER', '温度计还没开始');
    if (s.thermo.revealed) return fail(state, 'AWAITING_OTHER', '已经揭晓了');
    var max = s.thermo.max;
    s.thermo[player] = {
      place: Math.max(0, Math.min(max, Math.round(Number(place) || 0))),
      guess: Math.max(0, Math.min(max, Math.round(Number(guess) || 0)))
    };
    return ok(s, [{ type: 'lock', player: player }]);
  }

  function thermoPass(state) {
    if (!state || !state.thermo || !state.thermo.a) return fail(state || null, 'AWAITING_OTHER', '还没轮到换手');
    var s = stripHeat(clone(state));
    s.thermo.passing = true;
    return ok(s, [{ type: 'pass-phone' }]);
  }

  function thermoReveal(state) {
    if (!state || !state.thermo) return fail(state || null, 'AWAITING_OTHER', '没有温度计');
    if (!state.thermo.a || !state.thermo.b) return fail(state, 'AWAITING_OTHER', '两个人都还没标');
    if (state.thermo.revealed) return ok(stripHeat(clone(state)), []);
    var s = stripHeat(clone(state));
    var t = s.thermo;
    var err = Math.abs(t.a.guess - t.b.place) + Math.abs(t.b.guess - t.a.place);
    var maxErr = t.max * 2;
    var closeness = maxErr === 0 ? 1 : 1 - err / maxErr;
    t.revealed = true;
    t.err = err;
    t.closeness = Math.round(closeness * 100) / 100;
    return ok(s, [{ type: 'reveal', closeness: t.closeness, err: err }]);
  }

  function dealWheel(state, kind) {
    if (!state) return fail(null, 'NO_SESSION', '没有转盘');
    if (kind !== 'truth' && kind !== 'dare') return fail(state, 'INVALID_SETUP', '转盘只有真话和动作');
    var s = stripHeat(clone(state));
    var D = draw();
    var purpose = kind === 'truth' ? 'cell-truth' : 'cell-dare';
    var slots = [];
    for (var i = 0; i < 6; i++) {
      var got = D.take(s, purpose);
      s = got.state;
      slots.push(got.card);
    }
    s.wheel = { kind: kind, slots: slots, index: null, spun: false };
    s.prompt = null;
    return ok(s, [{ type: 'deal', kind: kind, slots: slots.length }]);
  }

  function spinWheel(state) {
    if (!state || !state.wheel || !state.wheel.slots || !state.wheel.slots.length) {
      return fail(state || null, 'AWAITING_OTHER', '转盘还没备好');
    }
    var s = stripHeat(clone(state));
    var rng = createRng(s.rng || 1);
    var idx = Math.floor(rng.next() * s.wheel.slots.length);
    s.rng = rng.state();
    s.wheel.index = idx;
    s.wheel.spun = true;
    var card = s.wheel.slots[idx];
    s.prompt = { card: card, who: null, role: 'wheel', mode: s.wheel.kind };
    return ok(s, [{ type: 'spin', index: idx, card: card }]);
  }

  function rerollWheel(state) {
    if (!state || !state.wheel) return fail(state || null, 'AWAITING_OTHER', '没有转盘可重转');
    var s = stripHeat(clone(state));
    s.rerolls = s.rerolls || { truth: 2, dare: 2 };
    var key = s.wheel.kind === 'truth' ? 'truth' : 'dare';
    if ((s.rerolls[key] || 0) <= 0) return fail(state, 'AWAITING_OTHER', '没有重转次数了');
    s.rerolls[key] -= 1;
    var kind = s.wheel.kind;
    return dealWheel(s, kind);
  }

  function handTruth(state, who) {
    if (!state || !state.prompt) return fail(state || null, 'AWAITING_OTHER', '还没有题目可交给谁');
    var s = stripHeat(clone(state));
    s.prompt.who = who === 'other' ? 'other' : 'self';
    s.prompt.hand = s.prompt.who;
    return ok(s, [{ type: 'hand', who: s.prompt.who }]);
  }

  function newStandalone(kind, settings, seed) {
    settings = settings || {};
    if (kind !== 'thermo' && kind !== 'truth' && kind !== 'dare') {
      return fail(null, 'INVALID_SETUP', '单独玩只有温度计、真心话转盘、大冒险转盘');
    }
    var scale = settings.scale || 'warm';
    var caps = { gentle: 1, warm: 2, hot: 3, open: 4 };
    if (!caps[scale]) return fail(null, 'INVALID_SETUP', '尺度认不出来');
    var names = settings.names || { a: '他', b: '她' };
    var now = Date.now();
    var rng = (seed === undefined || seed === null) ? ((now % 2147483646) + 1) : ((Number(seed) >>> 0) || 1);
    var state = {
      v: 1,
      kind: 'standalone',
      game: kind,
      id: 'door-' + now.toString(36) + '-' + rng.toString(36),
      ts: now,
      scale: scale,
      maxStarCap: caps[scale],
      boundaries: Array.isArray(settings.blacklist) ? settings.blacklist.slice() : (Array.isArray(settings.boundaries) ? settings.boundaries.slice() : []),
      names: { a: (names.a && String(names.a)) || '他', b: (names.b && String(names.b)) || '她' },
      rng: rng,
      usedCards: {},
      log: [],
      rerolls: { truth: 2, dare: 2 },
      thermo: null,
      wheel: null,
      prompt: null
    };
    if (kind === 'thermo') return thermoBegin(state);
    return dealWheel(state, kind);
  }

  root.Minigames = {
    THERMO_LABELS: THERMO_LABELS,
    newStandalone: newStandalone,
    thermoBegin: thermoBegin,
    thermoSet: thermoSet,
    thermoPass: thermoPass,
    thermoReveal: thermoReveal,
    dealWheel: dealWheel,
    spinWheel: spinWheel,
    rerollWheel: rerollWheel,
    handTruth: handTruth
  };
})(typeof window !== 'undefined' ? window : this);
