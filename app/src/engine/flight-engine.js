/* ==========================================================================
 * 今晚飞行棋 · 对局状态机
 * 纯函数：不改入参，无 DOM，无 localStorage。
 * 跳 / 飞 / 航线只读 FlightBoard。A1/A2/A3 与叠机击落开关均为待确认。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var SCALES = { gentle: 1, warm: 2, hot: 3, open: 4 };
  var PROMPT_KINDS = {
    'cell-truth': 1, 'cell-dare': 1, 'cell-touch': 1,
    capture: 1, 'stack-duo': 1, 'home-entry': 1, ending: 1,
    'minigame-thermo': 1, 'minigame-wheel': 1
  };

  function board() { return root.FlightBoard; }
  function drawApi() { return root.FlightDraw; }
  function rulesApi() { return root.FlightRules; }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function fail(state, code, message) {
    return { ok: false, state: state, events: [], error: { code: code, message: message } };
  }
  function pass(state, events) {
    return { ok: true, state: state, events: events || [], error: null };
  }

  function mergeRules(over) {
    var base = rulesApi().current();
    if (!over || typeof over !== 'object') return base;
    Object.keys(base).forEach(function (k) {
      if (typeof over[k] === 'boolean') base[k] = over[k];
    });
    return base;
  }

  function shanghaiDate(ts) {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date(ts));
    } catch (e) {
      var d = new Date(ts + 8 * 3600 * 1000);
      var y = d.getUTCFullYear();
      var m = d.getUTCMonth() + 1;
      var day = d.getUTCDate();
      return y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
    }
  }

  function nextId(s, prefix) {
    s.seq = (s.seq || 0) + 1;
    return prefix + '-' + s.seq;
  }

  function otherOf(pid) { return pid === 'a' ? 'b' : 'a'; }

  function pieceById(s, id) {
    var list = s.pieces || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function groupIdsOf(s, pieceId) {
    var p = pieceById(s, pieceId);
    if (!p) return [];
    if (!p.stackGroupId) return [p.id];
    return s.pieces.filter(function (x) {
      return x.stackGroupId === p.stackGroupId && !x.arrived;
    }).map(function (x) { return x.id; });
  }

  function othersAt(s, squareId, ignore) {
    return (s.pieces || []).filter(function (p) {
      return p.squareId === squareId && ignore.indexOf(p.id) < 0 && !p.arrived;
    });
  }

  function freeHangar(s, color) {
    var used = {};
    (s.pieces || []).forEach(function (p) {
      var m = /^hangar:(red|yellow|blue|green):(\d+)$/.exec(p.squareId || '');
      if (m && m[1] === color) used[m[2]] = true;
    });
    for (var i = 0; i < 4; i++) {
      if (!used[i]) return 'hangar:' + color + ':' + i;
    }
    return 'hangar:' + color + ':0';
  }

  function crossesHome(color, fromId, toId) {
    var B = board();
    var a = B.progressOf(color, fromId);
    var b = B.progressOf(color, toId);
    if (a < 0 || b < 0) return false;
    if (a < 50 && b > 50) return true;
    if (b < a && a <= 50) return true;
    return false;
  }

  function homeDest(color, destIndex) {
    if (destIndex >= 5) return 'home:' + color + ':goal';
    return 'home:' + color + ':' + destIndex;
  }

  function homePathUntil(color, destIndex) {
    var path = [];
    var last = Math.min(4, destIndex);
    for (var s = 0; s <= last; s++) path.push('home:' + color + ':' + s);
    if (destIndex >= 5) path.push('home:' + color + ':goal');
    return path;
  }

  function emptyPlan(pieceId, reason) {
    return {
      legal: false,
      pieceId: pieceId,
      path: [],
      modes: [],
      captures: [],
      stacksWith: null,
      wouldEnterHome: false,
      blockedReason: reason || 'NONE',
      segments: [],
      dest: null,
      from: null
    };
  }

  /* 几何计划：不改状态。ignore 是一起走的棋，不当成叠机或击落对象。 */
  function computePlan(state, piece, die, ignore) {
    var B = board();
    var plan = emptyPlan(piece.id, 'NONE');
    plan.from = piece.squareId;
    plan.legal = false;
    if (!piece || piece.arrived) {
      plan.blockedReason = 'NONE';
      return plan;
    }
    var loc = B.parseSquare(piece.squareId);
    if (!loc) {
      plan.blockedReason = 'INVALID_PIECE';
      return plan;
    }
    var color = piece.color;

    if (loc.type === 'hangar') {
      if (die !== 6) {
        plan.blockedReason = 'NEED_SIX_TO_TAKEOFF';
        return plan;
      }
      var dest = B.map().takeoffOf[color];
      plan.legal = true;
      plan.blockedReason = undefined;
      plan.path = [dest];
      plan.dest = dest;
      plan.modes = ['takeoff'];
      plan.takeoff = true;
      plan.segments = [];
      decorateLanding(state, plan, ignore, color, false);
      return plan;
    }

    if (loc.type === 'goal') {
      plan.blockedReason = 'NONE';
      return plan;
    }

    if (loc.type === 'home') {
      if (loc.color !== color) {
        plan.blockedReason = 'EXACT_COUNT_REQUIRED';
        return plan;
      }
      var destIndex = loc.step + die;
      if (destIndex > 5) {
        plan.blockedReason = 'EXACT_COUNT_REQUIRED';
        return plan;
      }
      plan.legal = true;
      plan.blockedReason = undefined;
      plan.path = [];
      for (var st = loc.step + 1; st <= Math.min(4, destIndex); st++) plan.path.push('home:' + color + ':' + st);
      if (destIndex >= 5) plan.path.push('home:' + color + ':goal');
      plan.dest = homeDest(color, destIndex);
      plan.modes = destIndex >= 5 ? ['walk', 'arrive'] : ['walk'];
      plan.inHome = true;
      decorateLanding(state, plan, ignore, color, true);
      return plan;
    }

    if (loc.type !== 'ring') {
      plan.blockedReason = 'INVALID_PIECE';
      return plan;
    }

    var progress = B.progressOf(color, piece.squareId);
    if (progress < 0) {
      plan.blockedReason = 'INVALID_PIECE';
      return plan;
    }

    if (progress + die > 50) {
      var remain = progress + die - 50;
      var enterIndex = remain - 1;
      if (enterIndex > 5) {
        plan.blockedReason = 'EXACT_COUNT_REQUIRED';
        return plan;
      }
      plan.legal = true;
      plan.blockedReason = undefined;
      plan.wouldEnterHome = true;
      plan.path = homePathUntil(color, enterIndex);
      plan.dest = homeDest(color, enterIndex);
      plan.modes = ['enter-home'].concat(enterIndex >= 5 ? ['arrive'] : []);
      plan.enterIndex = enterIndex;
      return plan;
    }

    var walk = [];
    for (var i = 1; i <= die; i++) walk.push(B.ringAt(color, progress + i));
    var cursor = walk[walk.length - 1];
    var segments = [];
    var guard = 0;
    var chain = [cursor];
    while (guard++ < 8) {
      if (othersAt(state, cursor, ignore).length) break;
      var sq = B.square(cursor);
      if (sq && sq.isFly && sq.flyTo && sq.color === color) {
        if (crossesHome(color, cursor, sq.flyTo)) break;
        segments.push({ type: 'fly', from: cursor, to: sq.flyTo });
        cursor = sq.flyTo;
        chain.push(cursor);
        continue;
      }
      if (sq && sq.jumpTo && sq.color === color) {
        if (crossesHome(color, cursor, sq.jumpTo)) break;
        segments.push({ type: 'jump', from: cursor, to: sq.jumpTo });
        cursor = sq.jumpTo;
        chain.push(cursor);
        continue;
      }
      break;
    }
    plan.legal = true;
    plan.blockedReason = undefined;
    plan.walk = walk;
    plan.segments = segments;
    plan.path = walk.slice();
    segments.forEach(function (seg) {
      if (plan.path[plan.path.length - 1] !== seg.to) plan.path.push(seg.to);
    });
    plan.dest = cursor;
    plan.modes = ['walk'].concat(segments.map(function (seg) { return seg.type; }));
    decorateLanding(state, plan, ignore, color, false);
    return plan;
  }

  function decorateLanding(state, plan, ignore, color, inHome) {
    plan.captures = [];
    plan.stacksWith = null;
    if (!plan.dest || plan.wouldEnterHome) return;
    var occ = othersAt(state, plan.dest, ignore);
    if (!occ.length) return;
    var foes = occ.filter(function (p) { return p.color !== color; });
    var friends = occ.filter(function (p) { return p.color === color; });
    if (inHome) foes = [];
    if (foes.length) {
      plan.captures = foes.map(function (p) { return p.id; });
      plan.captureCount = foes.length;
      plan.attackerCount = ignore.length || 1;
    } else if (friends.length && plan.dest.indexOf(':goal') < 0) {
      plan.stacksWith = friends[0].id;
    }
  }

  function sendHangar(s, piece) {
    piece.squareId = freeHangar(s, piece.color);
    piece.stackGroupId = null;
    piece.arrived = false;
  }

  function logMove(s, pieceId, from, to, die) {
    s.log.push({
      id: nextId(s, 'log'),
      ts: Date.now(),
      kind: 'move',
      actorId: s.turn,
      pieceId: pieceId,
      from: from,
      to: to,
      die: die
    });
  }

  function makeCardPrompt(s, kind, actorId, targetId, pieceIds, pre) {
    var got = drawApi().take(s, kind === 'cell-truth' || kind === 'cell-dare' || kind === 'cell-touch' || kind === 'capture' || kind === 'stack-duo' || kind === 'home-entry' || kind === 'ending' ? kind : 'cell-truth');
    s.usedCards = got.state.usedCards;
    s.rng = got.state.rng;
    var prompt = {
      id: nextId(s, 'pr'),
      kind: kind,
      card: got.card,
      actorId: actorId,
      targetId: targetId,
      pieceIds: pieceIds.slice()
    };
    if (pre) prompt.preSquareId = pre;
    return prompt;
  }

  function occupantPrompt(s, plan, movers) {
    var rules = s.rules;
    var dest = plan.dest;
    var moverIds = movers.map(function (p) { return p.id; });
    if (plan.captures && plan.captures.length) {
      var attackerCount = movers.length;
      var defenderCount = plan.captures.length;
      /* 待确认：stackCapturedBySingle 默认 true。反相时只击落数量不多于落子的对方棋。 */
      if (rules.stackCapturedBySingle === false && attackerCount < defenderCount) {
        movers.forEach(function (p) { sendHangar(s, p); });
        return { type: 'repelled' };
      }
      var victims = plan.captures.map(function (id) { return pieceById(s, id); }).filter(Boolean);
      victims.forEach(function (p) { sendHangar(s, p); });
      var victimPlayer = victims[0] ? victims[0].playerId : otherOf(s.turn);
      var prompt = makeCardPrompt(s, 'capture', victimPlayer, victimPlayer, victims.map(function (p) { return p.id; }));
      s.awaiting = { type: 'prompt', prompt: prompt };
      return { type: 'capture', prompt: prompt, victims: victims.map(function (p) { return p.id; }) };
    }
    if (plan.stacksWith) {
      var target = pieceById(s, plan.stacksWith);
      var friends = othersAt(s, dest, moverIds).filter(function (p) { return p.color === movers[0].color; });
      var gid = (target && target.stackGroupId) || movers[0].stackGroupId || nextId(s, 'stk');
      movers.forEach(function (p) { p.stackGroupId = gid; });
      friends.forEach(function (p) { p.stackGroupId = gid; });
      var all = s.pieces.filter(function (p) { return p.stackGroupId === gid && !p.arrived; }).map(function (p) { return p.id; });
      var promptStack = makeCardPrompt(s, 'stack-duo', s.turn, 'both', all);
      s.pendingMove = { type: 'bonus', pieceIds: all.slice(), steps: 1, from: dest };
      s.awaiting = { type: 'prompt', prompt: promptStack };
      return { type: 'stack', prompt: promptStack, pieceIds: all, at: dest };
    }
    var sq = board().square(dest);
    if (!sq || plan.dest.indexOf(':goal') >= 0) return null;
    if (sq.kind === 'truth' || sq.kind === 'dare' || sq.kind === 'touch') {
      var key = sq.kind === 'truth' ? 'cell-truth' : (sq.kind === 'dare' ? 'cell-dare' : 'cell-touch');
      var cellPrompt = makeCardPrompt(s, key, s.turn, s.turn, moverIds);
      s.awaiting = { type: 'prompt', prompt: cellPrompt };
      return { type: 'prompt', prompt: cellPrompt };
    }
    if (sq.kind === 'thermo' || sq.kind === 'wheel') {
      var game = sq.kind === 'thermo' ? 'thermo' : (sq.wheel || 'truth-wheel');
      s.awaiting = { type: 'minigame', kind: game, pieceIds: moverIds.slice() };
      return { type: 'minigame', kind: game };
    }
    return null;
  }

  function placeMovers(movers, dest) {
    var goal = dest.indexOf(':goal') >= 0;
    movers.forEach(function (p) {
      p.squareId = dest;
      if (goal) {
        p.arrived = true;
        p.stackGroupId = null;
      }
    });
  }

  function emitMotion(events, primary, plan, opt) {
    if (plan.takeoff) {
      events.push({ type: 'takeoff', pieceId: primary.id, path: [plan.from].concat(plan.path) });
      return;
    }
    var mode = opt && opt.bonus ? 'bonus' : 'walk';
    if (plan.walk && plan.walk.length) {
      events.push({ type: 'move', pieceId: primary.id, path: plan.walk.slice(), mode: mode });
    } else if (plan.path && plan.path.length && !plan.segments.length) {
      events.push({ type: 'move', pieceId: primary.id, path: plan.path.slice(), mode: mode });
    }
    (plan.segments || []).forEach(function (seg) {
      events.push({ type: seg.type, pieceId: primary.id, from: seg.from, to: seg.to });
    });
  }

  function applyPlan(s, pieceIds, die, opt, events) {
    opt = opt || {};
    var movers = pieceIds.map(function (id) { return pieceById(s, id); }).filter(Boolean);
    if (!movers.length) return { illegal: true, reason: 'INVALID_PIECE' };
    var primary = movers[0];
    var ignore = movers.map(function (p) { return p.id; });
    var plan = computePlan(s, primary, die, ignore);
    if (!plan.legal) return { illegal: true, reason: plan.blockedReason || 'NO_LEGAL_MOVE' };

    if (plan.wouldEnterHome && !opt.applyingHome) {
      s.pendingMove = {
        type: 'enter-home',
        pieceIds: ignore.slice(),
        steps: die,
        from: primary.squareId
      };
      var prompt = makeCardPrompt(s, 'home-entry', s.turn, s.turn, ignore, primary.squareId);
      s.awaiting = { type: 'prompt', prompt: prompt };
      events.push({ type: 'prompt', prompt: prompt });
      return { waiting: true };
    }

    if (opt.applyingHome && plan.wouldEnterHome) {
      /* 结算时从原格真正走进航线，不再次出题。 */
      placeMovers(movers, plan.dest);
      logMove(s, primary.id, plan.from, plan.dest, die);
      events.push({
        type: 'move',
        pieceId: primary.id,
        path: plan.path.slice(),
        mode: 'walk'
      });
      return { waiting: false };
    }

    emitMotion(events, primary, plan, opt);
    placeMovers(movers, plan.dest);
    logMove(s, primary.id, plan.from, plan.dest, die);

    var effect = occupantPrompt(s, plan, movers);
    if (effect && effect.type === 'capture') {
      events.push({ type: 'capture', attackerId: primary.id, victimIds: effect.victims });
      events.push({ type: 'prompt', prompt: effect.prompt });
      return { waiting: true };
    }
    if (effect && effect.type === 'stack') {
      events.push({ type: 'stack', pieceIds: effect.pieceIds, at: effect.at });
      events.push({ type: 'prompt', prompt: effect.prompt });
      return { waiting: true };
    }
    if (effect && effect.type === 'prompt') {
      events.push({ type: 'prompt', prompt: effect.prompt });
      return { waiting: true };
    }
    if (effect && effect.type === 'minigame') {
      events.push({ type: 'minigame', kind: effect.kind });
      return { waiting: true };
    }
    return { waiting: false };
  }

  function allHome(s, pid) {
    var mine = (s.pieces || []).filter(function (p) { return p.playerId === pid; });
    return mine.length > 0 && mine.every(function (p) { return p.arrived; });
  }

  function checkWin(s, events) {
    /* 只在刚走完的这一方把最后一架送回家时判胜。对方若早已全部到家，应在对方那一步结束。 */
    if (!allHome(s, s.turn)) return false;
    var w = s.turn;
    s.winnerId = w;
    s.rollContext = null;
    s.pendingMove = null;
    var other = otherOf(w);
    var prompt = makeCardPrompt(s, 'ending', other, other, s.pieces.filter(function (p) { return p.playerId === w; }).map(function (p) { return p.id; }));
    s.awaiting = { type: 'ending-prompt', prompt: prompt };
    events.push({ type: 'win', playerId: w });
    events.push({ type: 'prompt', prompt: prompt });
    return true;
  }

  function finishTurn(s, events) {
    var extra = !!(s.rollContext && s.rollContext.extra && s.rules && s.rules.rerollOnEverySix);
    s.pendingMove = null;
    s.rollContext = null;
    if (extra) {
      s.awaiting = { type: 'roll' };
      return;
    }
    s.turn = otherOf(s.turn);
    s.consecutiveSixes = 0;
    s.awaiting = { type: 'roll' };
    events.push({ type: 'turn', playerId: s.turn, color: s.colors[s.turn] });
  }

  function afterAction(s, events) {
    if (s.awaiting && (s.awaiting.type === 'prompt' || s.awaiting.type === 'minigame' || s.awaiting.type === 'ending-prompt')) return;
    if (checkWin(s, events)) return;
    finishTurn(s, events);
  }

  function playing(state) {
    return state && (state.phase === 'playing' || state.phase === 'setup');
  }

  function rollDie(s) {
    var rng = drawApi().take ? null : null;
    var a = (Number(s.rng) >>> 0) || 1;
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    var u = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    s.rng = a >>> 0;
    return 1 + Math.floor(u * 6);
  }

  function beginRoll(s, die) {
    var extra = die === 6 && !!(s.rules && s.rules.rerollOnEverySix);
    if (die === 6) s.consecutiveSixes = (s.consecutiveSixes || 0) + 1;
    else s.consecutiveSixes = 0;
    s.rollContext = { die: die, extra: extra };
    s.log.push({
      id: nextId(s, 'log'),
      ts: Date.now(),
      kind: 'roll',
      die: die,
      actorId: s.turn
    });
    /* threeSixesPenalty 为 true 时本轮也不处罚，只计数。待确认 A1。 */
    return extra;
  }

  function newGame(setup, seed) {
    setup = setup || {};
    var names = setup.names || {};
    var colors = setup.colors || {};
    var aName = names.a != null ? String(names.a).trim() : '';
    var bName = names.b != null ? String(names.b).trim() : '';
    var aColor = colors.a;
    var bColor = colors.b;
    var scale = setup.scale;
    var count = setup.planeCount == null ? 4 : setup.planeCount;
    var known = board().COLORS;
    if (!aName || !bName || !aColor || !bColor || aColor === bColor || known.indexOf(aColor) < 0 || known.indexOf(bColor) < 0 || (count !== 2 && count !== 4) || !SCALES[scale]) {
      return fail(null, 'INVALID_SETUP', '名字、颜色、尺度或飞机架数不完整');
    }
    var now = Date.now();
    var rng = (seed === undefined || seed === null) ? ((now % 2147483646) + 1) : ((Number(seed) >>> 0) || 1);
    var boundaries = [];
    (setup.boundaries || []).forEach(function (item) {
      var t = String(item || '').trim();
      if (t && boundaries.indexOf(t) < 0) boundaries.push(t);
    });
    var pieces = [];
    ['a', 'b'].forEach(function (pid) {
      var color = pid === 'a' ? aColor : bColor;
      for (var i = 0; i < count; i++) {
        pieces.push({
          id: pid + ':' + i,
          playerId: pid,
          color: color,
          squareId: 'hangar:' + color + ':' + i,
          stackGroupId: null,
          arrived: false
        });
      }
    });
    var state = {
      v: 1,
      kind: 'flight',
      id: 'flight-' + now.toString(36) + '-' + rng.toString(36),
      ts: now,
      names: { a: aName, b: bName },
      colors: { a: aColor, b: bColor },
      scale: scale,
      maxStarCap: SCALES[scale],
      boundaries: boundaries,
      planeCount: count,
      rules: mergeRules(setup.rules),
      phase: 'playing',
      turn: 'a',
      consecutiveSixes: 0,
      pieces: pieces,
      usedCards: { truth: {}, dare: {}, touch: {}, sync: {}, spark: {}, punish: {} },
      log: [],
      awaiting: { type: 'roll' },
      winnerId: null,
      rng: rng,
      result: null,
      pendingMove: null,
      rollContext: null,
      seq: 0
    };
    return pass(state, []);
  }

  function validate(raw) {
    try {
      if (!raw || typeof raw !== 'object') return null;
      if (raw.kind !== 'flight' || raw.v !== 1) return null;
      if (['setup', 'playing', 'ended', 'safe-ended'].indexOf(raw.phase) < 0) return null;
      if (!raw.names || !String(raw.names.a || '').trim() || !String(raw.names.b || '').trim()) return null;
      if (!raw.colors || raw.colors.a === raw.colors.b) return null;
      if (board().COLORS.indexOf(raw.colors.a) < 0 || board().COLORS.indexOf(raw.colors.b) < 0) return null;
      if (raw.planeCount !== 2 && raw.planeCount !== 4) return null;
      if (!SCALES[raw.scale]) return null;
      if (!raw.pieces || raw.pieces.length !== raw.planeCount * 2) return null;
      if (!raw.awaiting || !raw.awaiting.type) return null;
      var s = clone(raw);
      s.rules = mergeRules(s.rules);
      s.maxStarCap = SCALES[s.scale];
      if (!Array.isArray(s.boundaries)) s.boundaries = [];
      if (!Array.isArray(s.log)) s.log = [];
      if (!s.usedCards) s.usedCards = {};
      return s;
    } catch (e) {
      return null;
    }
  }

  function legalMoves(state, die) {
    var empty = { pieceIds: [], moves: {}, blocked: {} };
    var n = Number(die);
    if (!state || n !== (n | 0) || n < 1 || n > 6) return empty;
    var pieceIds = [];
    var moves = {};
    var blocked = {};
    (state.pieces || []).forEach(function (p) {
      if (p.arrived || p.playerId !== state.turn) return;
      var ignore = groupIdsOf(state, p.id);
      var plan = computePlan(state, p, n, ignore);
      if (plan.legal) {
        pieceIds.push(p.id);
        moves[p.id] = {
          pieceId: p.id,
          path: plan.path.slice(),
          modes: plan.modes.slice(),
          captures: (plan.captures || []).slice(),
          stacksWith: plan.stacksWith || null,
          wouldEnterHome: !!plan.wouldEnterHome,
          blockedReason: plan.blockedReason
        };
      } else {
        blocked[p.id] = {
          pieceId: p.id,
          path: [],
          modes: [],
          captures: [],
          stacksWith: null,
          wouldEnterHome: false,
          blockedReason: plan.blockedReason || 'NONE'
        };
      }
    });
    return { pieceIds: pieceIds, moves: moves, blocked: blocked };
  }

  function guard(state) {
    if (!state) return fail(null, 'NO_SESSION', '没有进行中的棋局');
    if (state.phase === 'ended' || state.phase === 'safe-ended') return fail(state, 'GAME_OVER', '这局已经结束');
    if (!playing(state)) return fail(state, 'NO_SESSION', '没有进行中的棋局');
    if (!SCALES[state.scale]) return fail(state, 'UNKNOWN_SCALE', '尺度无法识别');
    return null;
  }

  function roll(state, dieOpt) {
    var blocked = guard(state);
    if (blocked) return blocked;
    if (!state.awaiting || state.awaiting.type !== 'roll') {
      if (state.awaiting && (state.awaiting.type === 'prompt' || state.awaiting.type === 'ending-prompt') && state.awaiting.prompt && state.awaiting.prompt.kind === 'home-entry') {
        return fail(state, 'PROMPT_REQUIRED', '还没过进航这张题');
      }
      return fail(state, 'AWAITING_OTHER', '现在还不能掷骰');
    }
    var injected = dieOpt !== undefined && dieOpt !== null && dieOpt !== '';
    if (injected) {
      var d = Number(dieOpt);
      if (d !== (d | 0) || d < 1 || d > 6) return fail(state, 'INVALID_DIE', '骰子只能是 1 到 6');
    }
    var s = clone(state);
    var die = injected ? Number(dieOpt) : rollDie(s);
    var extra = beginRoll(s, die);
    var events = [{ type: 'dice', die: die, extraRoll: extra ? true : undefined }];
    if (events[0].extraRoll === undefined) delete events[0].extraRoll;
    var legal = legalMoves(s, die);
    if (!legal.pieceIds.length) {
      s.rollContext = { die: die, extra: extra };
      if (extra) {
        events[0].extraRoll = true;
        s.awaiting = { type: 'roll' };
        s.rollContext = null;
      } else {
        finishTurn(s, events);
      }
      return pass(s, events);
    }
    var chosen = legal.pieceIds.slice().sort();
    if (chosen.length > 1 && s.rules.chooseAmongLegalPieces) {
      s.awaiting = { type: 'choose-piece', pieceIds: chosen, die: die };
      return pass(s, events);
    }
    /* 待确认 A1：chooseAmongLegalPieces 为 false 时按 id 顺序代选第一架。 */
    chosen.sort();
    var ids = groupIdsOf(s, chosen[0]);
    var applied = applyPlan(s, ids, die, {}, events);
    if (applied.illegal) return fail(state, applied.reason || 'NO_LEGAL_MOVE', '这步走不了');
    if (!applied.waiting) afterAction(s, events);
    return pass(s, events);
  }

  function move(state, pieceId) {
    var blocked = guard(state);
    if (blocked) return blocked;
    var awaiting = state.awaiting || {};
    if (awaiting.type === 'prompt' || awaiting.type === 'ending-prompt') {
      if (awaiting.prompt && awaiting.prompt.kind === 'home-entry') return fail(state, 'PROMPT_REQUIRED', '还没过进航这张题');
      return fail(state, 'AWAITING_OTHER', '先把眼前这张处理完');
    }
    if (awaiting.type !== 'choose-piece') return fail(state, 'AWAITING_OTHER', '现在不是选飞机');
    if (!awaiting.pieceIds || !awaiting.pieceIds.length) return fail(state, 'NO_LEGAL_MOVE', '没有可走的飞机');
    if (!pieceById(state, pieceId)) return fail(state, 'INVALID_PIECE', '没有这架飞机');
    if (awaiting.pieceIds.indexOf(pieceId) < 0) return fail(state, 'PIECE_NOT_LEGAL', '这架飞机这步不能走');
    var s = clone(state);
    var ids = groupIdsOf(s, pieceId);
    var events = [];
    var applied = applyPlan(s, ids, awaiting.die, {}, events);
    if (applied.illegal) return fail(state, applied.reason || 'NO_LEGAL_MOVE', '这步走不了');
    if (!applied.waiting) afterAction(s, events);
    return pass(s, events);
  }

  function pushPromptLog(s, prompt, outcome) {
    s.log.push({
      id: nextId(s, 'log'),
      ts: Date.now(),
      kind: prompt.kind,
      outcome: outcome,
      card: prompt.card ? {
        id: prompt.card.id,
        text: prompt.card.text,
        star: prompt.card.star,
        tags: prompt.card.tags || [],
        pool: prompt.card.pool || prompt.card.type
      } : undefined,
      actorId: prompt.targetId === 'both' ? 'both' : prompt.actorId,
      pieceId: prompt.pieceIds && prompt.pieceIds[0]
    });
  }

  function runPending(s, pending, events) {
    if (!pending) return { waiting: false };
    if (pending.type === 'enter-home') {
      return applyPlan(s, pending.pieceIds, pending.steps, { applyingHome: true }, events);
    }
    if (pending.type === 'bonus') {
      return applyPlan(s, pending.pieceIds, pending.steps, { bonus: true }, events);
    }
    return { waiting: false };
  }

  function resolvePrompt(state, outcome) {
    var blocked = guard(state);
    if (blocked) return blocked;
    var awaiting = state.awaiting || {};
    if (awaiting.type !== 'prompt' && awaiting.type !== 'ending-prompt') {
      return fail(state, 'AWAITING_OTHER', '现在没有要结算的题');
    }
    var how = outcome === 'skipped' ? 'skipped' : (outcome === 'done' ? 'done' : null);
    if (!how) return fail(state, 'AWAITING_OTHER', '只能做了或放过');
    var prompt = awaiting.prompt;
    if (awaiting.type === 'ending-prompt' && how === 'skipped' && state.rules && state.rules.endingPromptSkippable === false) {
      return fail(state, 'PROMPT_NOT_SKIPPABLE', '这张收尾先做完');
    }
    var s = clone(state);
    prompt = s.awaiting.prompt;
    pushPromptLog(s, prompt, how);
    var events = [];

    if (awaiting.type === 'ending-prompt') {
      s.phase = 'ended';
      s.awaiting = { type: 'none' };
      s.pendingMove = null;
      s.rollContext = null;
      s.result = buildLedger(s);
      events.push({ type: 'ledger' });
      return pass(s, events);
    }

    if (prompt.kind === 'home-entry') {
      var pending = s.pendingMove;
      /* 待确认 A2：默认跳过则停在进入前的格子。反相为跳过仍进入。 */
      var enter = how === 'done' || (how === 'skipped' && s.rules.skipHomeEntryBlocksEntry === false);
      s.awaiting = { type: 'roll' };
      s.pendingMove = null;
      if (enter && pending && pending.type === 'enter-home') {
        runPending(s, pending, events);
      }
      afterAction(s, events);
      return pass(s, events);
    }

    if (prompt.kind === 'stack-duo') {
      var bonus = s.pendingMove;
      s.awaiting = { type: 'roll' };
      s.pendingMove = null;
      /* 待确认 A2：默认跳过叠机题不再多走一步。反相仍多走一步。 */
      var step = how === 'done' || (how === 'skipped' && s.rules.skipStackKeepsBonusStep === true);
      if (step && bonus && bonus.type === 'bonus') {
        var applied = runPending(s, bonus, events);
        if (applied.waiting) return pass(s, events);
      }
      afterAction(s, events);
      return pass(s, events);
    }

    s.awaiting = { type: 'roll' };
    afterAction(s, events);
    return pass(s, events);
  }

  function resolveMinigame(state) {
    var blocked = guard(state);
    if (blocked) return blocked;
    if (!state.awaiting || state.awaiting.type !== 'minigame') return fail(state, 'AWAITING_OTHER', '现在没有小游戏');
    var s = clone(state);
    var kind = s.awaiting.kind;
    var logKind = kind === 'thermo' ? 'minigame-thermo' : 'minigame-wheel';
    s.log.push({
      id: nextId(s, 'log'),
      ts: Date.now(),
      kind: logKind,
      outcome: 'done',
      minigame: kind,
      actorId: s.turn,
      pieceId: s.awaiting.pieceIds && s.awaiting.pieceIds[0]
    });
    s.awaiting = { type: 'roll' };
    var events = [];
    afterAction(s, events);
    return pass(s, events);
  }

  function buildLedger(state) {
    if (!state || (state.phase !== 'ended' && state.phase !== 'safe-ended')) return null;
    var endedAt = Date.now();
    var prompts = [];
    (state.log || []).forEach(function (entry) {
      if (!entry || !entry.outcome || !PROMPT_KINDS[entry.kind]) return;
      prompts.push({
        kind: entry.kind,
        outcome: entry.outcome,
        pool: entry.card ? entry.card.pool : undefined,
        text: entry.card ? entry.card.text : undefined,
        star: entry.card ? entry.card.star : undefined
      });
    });
    var ending = 'win-a';
    var winnerId = state.winnerId || null;
    if (state.phase === 'safe-ended') {
      ending = 'safe';
      winnerId = null;
    } else if (state.winnerId === 'b') ending = 'win-b';
    else if (state.winnerId === 'a') ending = 'win-a';
    var ledger = {
      date: shanghaiDate(endedAt),
      endedAt: endedAt,
      names: { a: state.names.a, b: state.names.b },
      colors: { a: state.colors.a, b: state.colors.b },
      scale: state.scale,
      boundaries: (state.boundaries || []).slice(),
      planeCount: state.planeCount,
      ending: ending,
      winnerId: winnerId,
      prompts: prompts
    };
    /* 待确认 A3：默认不写逐步走子。 */
    if (state.rules && state.rules.ledgerIncludeMoveReplay) {
      ledger.moves = (state.log || []).filter(function (entry) {
        return entry && (entry.kind === 'roll' || entry.kind === 'move');
      });
    }
    return ledger;
  }

  function safeWord(state) {
    if (!state) return fail(null, 'NO_SESSION', '没有进行中的棋局');
    if (state.phase === 'ended' || state.phase === 'safe-ended') {
      if (state.result) return pass(state, []);
      var done = clone(state);
      done.result = buildLedger(done);
      return pass(done, []);
    }
    if (state.kind !== 'flight') return fail(state, 'NO_SESSION', '没有进行中的棋局');
    var beforeLog = JSON.stringify(state.log || []);
    var s = clone(state);
    s.phase = 'safe-ended';
    s.winnerId = null;
    s.awaiting = { type: 'none' };
    s.pendingMove = null;
    s.rollContext = null;
    if (JSON.stringify(s.log || []) !== beforeLog) s.log = clone(state.log || []);
    s.result = buildLedger(s);
    return pass(s, [{ type: 'safe' }, { type: 'ledger' }]);
  }

  function view(state, opts) {
    opts = opts || {};
    return {
      pieces: ((state && state.pieces) || []).map(function (p) {
        return {
          id: p.id,
          color: p.color,
          squareId: p.squareId,
          arrived: !!p.arrived,
          stackGroupId: p.stackGroupId || null
        };
      }),
      turn: state && state.turn,
      colors: state && state.colors ? { a: state.colors.a, b: state.colors.b } : { a: 'red', b: 'yellow' },
      reduced: !!opts.reduced
    };
  }

  root.Flight = {
    newGame: newGame,
    validate: validate,
    roll: roll,
    legalMoves: legalMoves,
    move: move,
    resolvePrompt: resolvePrompt,
    resolveMinigame: resolveMinigame,
    safeWord: safeWord,
    buildLedger: buildLedger,
    view: view
  };
})(typeof window !== 'undefined' ? window : this);
