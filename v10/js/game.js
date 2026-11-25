/*  game.js — 规则引擎（纯逻辑，无 DOM）
 *  飞行棋骨架：36 格环道 + 4 格归航道；掷 6 起飞；撞子击落；卡片驱动温度。
 */
(function (w) {
  "use strict";

  var TRACK = 36;
  var HOME = 4;
  var D = w.Data;

  /* 环道格子类型：按 6 格一循环铺开，保证一条路上三种题都有 */
  var CELL_PATTERN = ["truth", "touch", "dare", "truth", "touch", "wheel"];

  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return (s >>> 0) / 4294967296;
    };
  }

  function buildTrack(offset) {
    var t = [];
    for (var i = 0; i < TRACK; i++) t.push(CELL_PATTERN[(i + offset) % CELL_PATTERN.length]);
    return t;
  }

  function create(opts) {
    opts = opts || {};
    var seed = opts.seed || (Date.now() % 2147483647);
    var mode = opts.mode === "long" ? "long" : "quick";
    var planes = mode === "long" ? 4 : 2;
    var target = mode === "long" ? 8 : 4;

    function mkPlanes(color) {
      var arr = [];
      for (var i = 0; i < planes; i++) arr.push({ i: i, steps: -1, home: 0, done: false });
      return arr;
    }

    return {
      v: 1,
      seed: seed,
      rand: rng(seed),
      mode: mode,
      level: opts.level === "explicit" ? "explicit" : "soft",
      names: { a: (opts.names && opts.names.a) || "他", b: (opts.names && opts.names.b) || "她" },
      colors: { a: "#e0a45e", b: "#b05c62" },
      planesPerPlayer: planes,
      targetCards: target,
      track: buildTrack(0),
      start: { a: 0, b: 18 },
      p: { a: mkPlanes(), b: mkPlanes() },
      turn: "a",
      die: null,
      phase: "roll",          // roll | move | card | ending | done
      card: null,
      used: {},               // 用过的卡 id
      heat: 0,
      arousal: { a: 4, b: 5 },
      miss: { a: 0, b: 0 },
      streak: 0,
      bestStreak: 0,
      cardsDone: 0,
      cardsSkipped: 0,
      ledger: [],
      winner: null,
      awaiting: null
    };
  }

  function other(p) { return p === "a" ? "b" : "a"; }

  function cellOf(st, player, steps) {
    var base = st.start[player];
    return (base + steps) % TRACK;
  }

  function cellType(st, player, steps) {
    var i = cellOf(st, player, steps);
    return st.track[i];
  }

  /* 掷骰 */
  function roll(st) {
    if (st.phase !== "roll") return { ok: false, err: "现在不是掷骰阶段" };
    var n = 1 + Math.floor(st.rand() * 6);
    st.die = n;
    var player = st.turn;
    var hasHangar = st.p[player].some(function (pl) { return pl.steps < 0; });
    var movable = st.p[player].filter(function (pl) { return pl.steps >= 0 && !pl.done && pl.home < HOME; });

    /* 掷 6 且有机可起飞：起飞并再掷一次 */
    if (n === 6 && hasHangar) {
      takeoff(st, player);
      st.miss[player] = 0;
      return { ok: true, die: n, auto: "takeoff", again: true };
    }
    /* 连续两次没起飞 → 这一掷保底起飞（原版规则） */
    if (hasHangar && !movable.length && st.miss[player] >= 2) {
      takeoff(st, player);
      st.miss[player] = 0;
      return { ok: true, die: n, auto: "takeoff", again: false, pity: true };
    }
    /* 没有能动的飞机：这一轮过 */
    if (!movable.length) {
      if (hasHangar) st.miss[player] = (st.miss[player] || 0) + 1;
      st.turn = other(player);
      st.phase = "roll";
      st.awaiting = null;
      return { ok: true, die: n, pass: true };
    }
    st.phase = "move";
    st.awaiting = { type: "move", die: n };
    return { ok: true, die: n };
  }

  function takeoff(st, player) {
    var plane = st.p[player].find(function (pl) { return pl.steps < 0; });
    if (!plane) return false;
    plane.steps = 0;
    plane.home = 0;
    return true;
  }

  function movablePlanes(st, player) {
    return st.p[player].filter(function (pl) { return pl.steps >= 0 && !pl.done; });
  }

  /* 选择一架飞机前进 */
  function move(st, planeIndex) {
    if (st.phase !== "move" || !st.awaiting) return { ok: false, err: "现在不能移动" };
    var player = st.turn;
    var plane = st.p[player][planeIndex];
    if (!plane || plane.steps < 0 || plane.done) return { ok: false, err: "这架飞机不能动" };

    var n = st.awaiting.die;
    var before = plane.steps;
    plane.steps += n;

    var res = { ok: true, from: before, to: plane.steps, captured: null, home: false, finished: false };

    /* 进入归航道 */
    if (plane.steps >= TRACK) {
      var h = plane.steps - TRACK;
      if (h >= HOME) { h = HOME - 1; plane.steps = TRACK + h; }
      plane.home = h + 1;
      res.home = true;
      if (plane.home >= HOME) { plane.done = true; res.finished = true; }
    } else {
      /* 撞子：同格且同一圈 */
      var foe = other(player);
      var cell = cellOf(st, player, plane.steps);
      st.p[foe].forEach(function (opp) {
        if (opp.steps >= 0 && !opp.done && opp.steps < TRACK && cellOf(st, foe, opp.steps) === cell) {
          opp.steps = -1; opp.home = 0;
          res.captured = { player: foe, plane: opp.i };
        }
      });
    }

    st.phase = "card";
    st.card = drawCard(st, plane.home > 0 ? "touch" : cellType(st, player, plane.steps));
    st.awaiting = { type: "card" };
    return res;
  }

  /* 抽卡：按类型池，过滤已用，池空则重置 */
  function drawCard(st, kind) {
    var poolName = kind === "wheel" ? "dare" : kind;
    var pool = D.byPool(poolName);
    if (!pool.length) pool = D.byPool("truth");
    var fresh = pool.filter(function (c) { return !st.used[c.id]; });
    if (!fresh.length) { st.used = {}; fresh = pool; }
    var card = fresh[Math.floor(st.rand() * fresh.length)];
    st.used[card.id] = true;
    return {
      id: card.id, pool: poolName, text: card.text, star: card.star || 1,
      tags: card.tags || [], kind: kind
    };
  }

  /* 完成 / 跳过 */
  function resolveCard(st, opts) {
    opts = opts || {};
    if (st.phase !== "card" || !st.card) return { ok: false };
    var skipped = !!opts.skip;
    var reaction = Math.max(0, Math.min(3, opts.reaction == null ? 1 : opts.reaction));

    if (skipped) {
      st.cardsSkipped++;
      st.streak = 0;
      st.ledger.push({ ts: Date.now(), player: st.turn, card: st.card, done: false });
    } else {
      st.cardsDone++;
      st.streak++;
      st.bestStreak = Math.max(st.bestStreak, st.streak);
      var delta = 2 + (st.card.star || 1) + reaction;
      st.heat = Math.min(100, st.heat + delta);
      var who = st.turn, partner = other(who);
      st.arousal[partner] = Math.min(10, st.arousal[partner] + (reaction - 1));
      st.arousal[who] = Math.min(10, st.arousal[who] + (reaction >= 2 ? 1 : 0));
      st.ledger.push({ ts: Date.now(), player: st.turn, card: st.card, done: true, reaction: reaction });
    }
    st.card = null;
    st.awaiting = null;
    st.phase = "roll";
    st.turn = other(st.turn);

    /* 结束条件 */
    var allHome = st.p.a.every(function (p) { return p.done; }) || st.p.b.every(function (p) { return p.done; });
    if (allHome) { st.phase = "ending"; st.winner = st.p.a.every(function (p) { return p.done; }) ? "a" : "b"; }
    else if (st.cardsDone >= st.targetCards) { st.phase = "ending"; st.winner = null; }
    return { ok: true, done: !skipped, heat: st.heat };
  }

  function stats(st) {
    return {
      heat: st.heat,
      cardsDone: st.cardsDone,
      cardsSkipped: st.cardsSkipped,
      bestStreak: st.bestStreak,
      home: {
        a: st.p.a.filter(function (p) { return p.done; }).length,
        b: st.p.b.filter(function (p) { return p.done; }).length
      }
    };
  }

  function save(st) { try { localStorage.setItem("v10.save", JSON.stringify(stripRand(st))); } catch (e) { } }

  function stripRand(st) {
    var o = {};
    for (var k in st) if (k !== "rand") o[k] = st[k];
    return o;
  }

  function load() {
    try {
      var raw = localStorage.getItem("v10.save");
      if (!raw) return null;
      var st = JSON.parse(raw);
      st.rand = rng(st.seed);
      if (!st.miss) st.miss = { a: 0, b: 0 };
      if (!st.arousal) st.arousal = { a: 4, b: 5 };
      return st;
    } catch (e) { return null; }
  }

  function clear() { try { localStorage.removeItem("v10.save"); } catch (e) { } }

  w.Game = {
    create: create, roll: roll, move: move, resolveCard: resolveCard, drawCard: drawCard,
    takeoff: takeoff, movablePlanes: movablePlanes, stats: stats,
    save: save, load: load, clear: clear, TRACK: TRACK, HOME: HOME, cellType: cellType
  };
})(window);
