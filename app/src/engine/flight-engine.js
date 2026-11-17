/* ==========================================================================
 * 今晚飞行棋 · 对局状态机（V6.1）
 * 纯函数：不改入参，无 DOM，无 localStorage。
 * 跳 / 飞 / 航线只读 FlightBoard；抽题只读 FlightDraw；热度/连击只读 FlightMeta。
 *
 * V6.1 语义（docs/v6/impl-freeze-v6.1.md，覆盖 impl-freeze.md 冲突处）：
 *   - 结束条件改为飞行棋胜负：任意一方本局全部飞机都到终点（home:*:goal）→ 结束，
 *     写 winnerId、发 win 事件，再发两张收尾卡各给一人。题卡数 / 心动值 / 单架到家都不再结束。
 *   - 起飞保底：仍要 6 起飞；但连续 2 个自己的回合没掷出 6（且所有未到家飞机都在机坪），
 *     第 3 个回合任意点数保底起飞；实际起飞或掷出 6 都清零（takeoffMiss，0..2）。
 *   - 合作收尾流程不变：两张收尾卡都可放过，回顾用「先到家」文案，不出现输赢羞辱。
 *   - 放过不惩罚：进航题放过仍进军，叠机题放过仍得奖励步（规则开关见 flight-rules）。
 *   - meta 在 resolvePrompt / resolveMinigame 结算点更新，随 state 落盘。
 *   - state.v = 2；v:1 / V6 旧档读入补默认、不丢档（validate）。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var SCALES = { gentle: 1, warm: 2, hot: 3, open: 4 };
  var PROMPT_KINDS = {
    'cell-truth': 1, 'cell-dare': 1, 'cell-touch': 1,
    capture: 1, 'stack-duo': 1, 'home-entry': 1, ending: 1, fate: 1,
    'minigame-thermo': 1, 'minigame-wheel': 1
  };
  /* 计入「目标题卡数」的普通题卡（收尾卡 / 命运格 / 小游戏不计）。 */
  var TARGET_KINDS = {
    'cell-truth': 1, 'cell-dare': 1, 'cell-touch': 1,
    capture: 1, 'stack-duo': 1, 'home-entry': 1
  };

  function board() { return root.FlightBoard; }
  function drawApi() { return root.FlightDraw; }
  function rulesApi() { return root.FlightRules; }
  function metaApi() { return root.FlightMeta; }

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

  function modeOf(planeCount) { return planeCount === 2 ? 'quick' : 'long'; }

  function targetsFor(mode) {
    return mode === 'quick'
      ? { targetCards: 4, targetHeat: 40 }
      : { targetCards: 8, targetHeat: 80 };
  }

  /* 缺 meta 时补初始值；已有 meta 时容错归一（heat 只夹不降）。 */
  function ensureMeta(s) {
    var M = metaApi();
    s.meta = M ? M.normalize(s.meta) : (s.meta || {
      heat: 0, stage: 'cold', streak: 0, streakBest: 0, milestones: [], updatedAt: 0
    });
    return s.meta;
  }

  /* 结算点统一入口：更新 state.meta 并把 heat/streak/milestone 事件追加进本次 Result。 */
  function applyMeta(s, kind, outcome, events) {
    var M = metaApi();
    if (!M) return;
    var got = M.applyPrompt(s.meta, kind, outcome);
    s.meta = got.meta;
    (got.events || []).forEach(function (ev) { events.push(ev); });
  }

  function processedFromLog(log) {
    var n = 0;
    (Array.isArray(log) ? log : []).forEach(function (entry) {
      if (!entry || !entry.outcome) return;
      if (TARGET_KINDS[entry.kind]) n++;
    });
    return n;
  }

  function arrivedCount(s, pid) {
    return (s.pieces || []).filter(function (p) {
      return !!p.arrived && (!pid || p.playerId === pid);
    }).length;
  }

  /* V6.1 §2.2：该玩家本局全部飞机都到终点才算赢。 */
  function allHome(s, pid) {
    var list = (s.pieces || []).filter(function (p) { return p.playerId === pid; });
    return list.length > 0 && list.every(function (p) { return p.arrived === true; });
  }

  /* V6.1 §2.3：该玩家所有「未到家」的飞机都在机坪（已全部到家时不算，避免当成可保底）。 */
  function allUnarrivedInHangar(s, pid) {
    var list = (s.pieces || []).filter(function (p) { return p.playerId === pid && !p.arrived; });
    if (!list.length) return false;
    return list.every(function (p) {
      var loc = board().parseSquare(p.squareId);
      return !!loc && loc.type === 'hangar';
    });
  }

  function missOf(v) {
    var n = Math.floor(Number(v));
    if (!isFinite(n) || n < 0) return 0;
    return Math.min(2, n);
  }

  function takeoffMissOf(s, pid) {
    return missOf(s && s.takeoffMiss ? s.takeoffMiss[pid] : 0);
  }

  /* 本回合是否已具备保底起飞：连续 2 回合没起飞且所有未到家飞机都在机坪。 */
  function takeoffPity(s) {
    if (!s || (s.turn !== 'a' && s.turn !== 'b')) return false;
    return takeoffMissOf(s, s.turn) >= 2 && allUnarrivedInHangar(s, s.turn);
  }

  function resetTakeoffMiss(s, pid) {
    if (!s.takeoffMiss || typeof s.takeoffMiss !== 'object') s.takeoffMiss = { a: 0, b: 0 };
    if (pid === 'a' || pid === 'b') s.takeoffMiss[pid] = 0;
  }

  /* 换手前按本回合点数记账：6 清零；非 6 且全在机坪 +1（上限 2）；其他不变。 */
  function noteTakeoffMiss(s) {
    var ctx = s.rollContext;
    if (!ctx) return;
    var pid = s.turn;
    if (pid !== 'a' && pid !== 'b') return;
    if (!s.takeoffMiss || typeof s.takeoffMiss !== 'object') s.takeoffMiss = { a: 0, b: 0 };
    if (Number(ctx.die) === 6) { s.takeoffMiss[pid] = 0; return; }
    if (allUnarrivedInHangar(s, pid)) s.takeoffMiss[pid] = Math.min(2, takeoffMissOf(s, pid) + 1);
  }

  /* 胜负（V6.1 §2.2）：任一方本局飞机全部到家即结束；不再看题卡数/心动值/单架到家。 */
  function winnerOf(s) {
    if (allHome(s, 'a')) return 'a';
    if (allHome(s, 'b')) return 'b';
    return null;
  }

  function shouldEnd(s) {
    if (!s || s.phase !== 'playing') return false;
    return winnerOf(s) !== null;
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
      /* V6.1 §2.3：6 起飞；连续 2 回合未起飞且该玩家所有未到家飞机都在机坪时，任意点数保底起飞。 */
      var pity = takeoffMissOf(state, piece.playerId) >= 2 && allUnarrivedInHangar(state, piece.playerId);
      if (die !== 6 && !pity) {
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

  /* 命运格：两个不同池各抽一张，prompt.options 二选一（P1 接口，UI 由 fe-cards 接）。
   * 抽卡按尺度决定池（FlightDraw.fatePools）：温柔/暧昧 真话+靠近；
   * 热烈 大冒险+真话；不设限 spark+真话。边界与星级过滤仍走 FlightDraw.allowed。 */
  function makeFatePrompt(s, actorId, pieceIds) {
    var D = drawApi();
    var cap = s.maxStarCap || 2;
    if (D.band) {
      try { cap = D.band(s).cap || cap; } catch (e) { /* 保持 cap */ }
    }
    var pools = D.fatePools ? D.fatePools(cap) : ['cell-touch', 'cell-truth'];
    var options = [];
    pools.forEach(function (purpose) {
      var got = D.take(s, purpose);
      s.usedCards = got.state.usedCards;
      s.rng = got.state.rng;
      if (got.card && !options.some(function (c) { return c && got.card && c.id === got.card.id; })) {
        options.push(got.card);
      }
    });
    if (options.length < 2) {
      var fb = D.take(s, 'ending');
      s.usedCards = fb.state.usedCards;
      s.rng = fb.state.rng;
      if (fb.card) options.push(fb.card);
    }
    var prompt = {
      id: nextId(s, 'pr'),
      kind: 'fate',
      card: options[0],
      options: options,
      actorId: actorId,
      targetId: actorId,
      pieceIds: pieceIds.slice()
    };
    s.awaiting = { type: 'prompt', prompt: prompt };
    return { type: 'prompt', prompt: prompt };
  }

  /* 「另一张放回池子」：把未选中的卡从 usedCards 里释放，后续还能抽到。 */
  function releaseCard(s, card) {
    if (!card || !s.usedCards) return;
    var pool = card.pool || card.type;
    var bucket = s.usedCards[pool];
    if (bucket && bucket[card.id]) delete bucket[card.id];
  }

  function releaseFateOptions(s, prompt, chosenIndex) {
    var opts = (prompt && prompt.options) || [];
    opts.forEach(function (card, i) {
      if (chosenIndex !== null && i === chosenIndex) return;
      releaseCard(s, card);
    });
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
    if (sq.kind === 'fate') {
      return makeFatePrompt(s, s.turn, moverIds);
    }
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
    /* V6.1 §2.3：实际起飞后该玩家保底计数清零。 */
    if (plan.takeoff) resetTakeoffMiss(s, primary.playerId);

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

  /* 合作收尾：两张收尾卡，各给一人；从 ending 池 mild 权重抽（同池允许）。
   * 冻结单 §2.2：事件 [{type:'prompt'}, {type:'ending-start'}]。 */
  function endingPrompt(s, pid) {
    var got = drawApi().take(s, 'ending');
    s.usedCards = got.state.usedCards;
    s.rng = got.state.rng;
    return {
      id: nextId(s, 'pr'),
      kind: 'ending',
      card: got.card,
      actorId: pid,
      targetId: pid,
      pieceIds: []
    };
  }

  /* 收尾（V6.1 §2.2）：一方全部到家 → 先写 winnerId 并发 win；再给两张收尾卡（各给一人）。
   * 事件顺序固定：[{type:'win', playerId}, {type:'prompt'}, {type:'ending-start'}]。 */
  function enterEnding(s, events) {
    if (!s || s.phase !== 'playing') return false;
    if (s.awaiting && s.awaiting.type === 'ending-prompt') return false;
    var winnerId = winnerOf(s);
    s.winnerId = winnerId;
    if (winnerId) events.push({ type: 'win', playerId: winnerId });
    var queue = [endingPrompt(s, 'a'), endingPrompt(s, 'b')];
    s.endingQueue = queue;
    s.endingIndex = 0;
    s.pendingMove = null;
    s.rollContext = null;
    s.awaiting = { type: 'ending-prompt', prompt: queue[0] };
    events.push({ type: 'prompt', prompt: queue[0] });
    events.push({ type: 'ending-start' });
    return true;
  }

  function finishTurn(s, events) {
    /* V6.1 §2.3 / §4：换手前按本回合点数记账（computePlan 读的是本回合开始前的计数）。 */
    noteTakeoffMiss(s);
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
    /* V6.1：先判「一方全部到家」收尾；题卡数/心动值不再触发结束。 */
    if (shouldEnd(s) && enterEnding(s, events)) return;
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
    var modeIn = setup.mode;
    if (modeIn != null && modeIn !== 'quick' && modeIn !== 'long') {
      return fail(null, 'INVALID_SETUP', '名字、颜色、尺度或飞机架数不完整');
    }
    var count = setup.planeCount == null ? (modeIn === 'quick' ? 2 : 4) : setup.planeCount;
    var known = board().COLORS;
    if (!aName || !bName || !aColor || !bColor || aColor === bColor || known.indexOf(aColor) < 0 || known.indexOf(bColor) < 0 || (count !== 2 && count !== 4) || !SCALES[scale] ||
        (modeIn === 'quick' && count !== 2) || (modeIn === 'long' && count !== 4)) {
      return fail(null, 'INVALID_SETUP', '名字、颜色、尺度或飞机架数不完整');
    }
    var mode = modeOf(count);
    var targets = targetsFor(mode);
    /* 只增多可选入参（fe-shell 门厅会按模式传同一组数字）；不传则用冻结单默认值。 */
    var customCards = Number(setup.targetCards);
    var customHeat = Number(setup.targetHeat);
    var targetCards = isFinite(customCards) && customCards > 0 ? Math.floor(customCards) : targets.targetCards;
    var targetHeat = isFinite(customHeat) && customHeat > 0 ? Math.floor(customHeat) : targets.targetHeat;
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
      v: 2,
      kind: 'flight',
      id: 'flight-' + now.toString(36) + '-' + rng.toString(36),
      ts: now,
      names: { a: aName, b: bName },
      colors: { a: aColor, b: bColor },
      scale: scale,
      maxStarCap: SCALES[scale],
      boundaries: boundaries,
      planeCount: count,
      mode: mode,
      targetCards: targetCards,
      targetHeat: targetHeat,
      cardsProcessed: 0,
      rules: mergeRules(setup.rules),
      phase: 'playing',
      turn: 'a',
      consecutiveSixes: 0,
      takeoffMiss: { a: 0, b: 0 },
      pieces: pieces,
      usedCards: { truth: {}, dare: {}, touch: {}, sync: {}, spark: {}, punish: {} },
      log: [],
      awaiting: { type: 'roll' },
      winnerId: null,
      rng: rng,
      result: null,
      pendingMove: null,
      rollContext: null,
      seq: 0,
      meta: metaApi()
        ? metaApi().init({ ts: now })
        : { heat: 0, stage: 'cold', streak: 0, streakBest: 0, milestones: [], updatedAt: now },
      endingQueue: null,
      endingIndex: 0
    };
    return pass(state, []);
  }

  function validate(raw) {
    try {
      if (!raw || typeof raw !== 'object') return null;
      /* V6：同时接受 v:1（V5 旧档）与 v:2；不得拒绝 v1（api-contract §9.3）。 */
      if (raw.kind !== 'flight' || (raw.v !== 1 && raw.v !== 2)) return null;
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
      /* ---- V6 迁移：只补可选默认，永不新增必填项（architecture §7.2） ---- */
      s.v = 2;
      s.mode = modeOf(s.planeCount);
      var targets = targetsFor(s.mode);
      /* V6.1：targetCards/targetHeat 保留默认值（旧 UI/测试兼容），但 shouldEnd 不再读。 */
      if (!(Number(s.targetCards) > 0)) s.targetCards = targets.targetCards;
      if (!(Number(s.targetHeat) > 0)) s.targetHeat = targets.targetHeat;
      if (!(Number(s.cardsProcessed) >= 0)) s.cardsProcessed = processedFromLog(s.log);
      /* V6.1 迁移：旧档补起飞保底计数（0..2），不新增必填项。 */
      var tm = (s.takeoffMiss && typeof s.takeoffMiss === 'object') ? s.takeoffMiss : {};
      s.takeoffMiss = { a: missOf(tm.a), b: missOf(tm.b) };
      var M = metaApi();
      if (M) {
        s.meta = (s.meta && typeof s.meta === 'object' && typeof s.meta.heat === 'number')
          ? M.normalize(s.meta)
          : M.fromLog(s.log);
      } else {
        ensureMeta(s);
      }
      if (Array.isArray(s.endingQueue)) {
        s.endingQueue = s.endingQueue.filter(function (p) { return p && typeof p === 'object'; });
        if (!s.endingQueue.length) s.endingQueue = null;
      }
      if (s.endingQueue) {
        s.endingIndex = Math.max(0, Math.min(s.endingQueue.length - 1, Math.floor(Number(s.endingIndex) || 0)));
      } else {
        s.endingQueue = null;
        s.endingIndex = 0;
        /* V5 在旧「赢家收尾」途中存档：保留已发的那张，按单卡收束，不丢档。 */
        if (s.awaiting && s.awaiting.type === 'ending-prompt' && s.awaiting.prompt) {
          s.endingQueue = [s.awaiting.prompt];
        }
      }
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
    /* V6.1 §2.3：先判断本回合是否已具备保底（读的是掷骰前状态），再记账。 */
    var pity = takeoffPity(s);
    var die = injected ? Number(dieOpt) : rollDie(s);
    var extra = beginRoll(s, die);
    var events = [{ type: 'dice', die: die }];
    if (extra) events[0].extraRoll = true;
    if (pity) events[0].pity = true;
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

  function pushPromptLog(s, prompt, outcome, cardOverride) {
    var hasOverride = arguments.length > 3;
    var card = hasOverride ? cardOverride : (prompt ? prompt.card : null);
    var entry = {
      id: nextId(s, 'log'),
      ts: Date.now(),
      kind: prompt ? prompt.kind : 'cell-truth',
      outcome: outcome,
      actorId: prompt && prompt.targetId === 'both' ? 'both' : (prompt ? prompt.actorId : undefined),
      pieceId: prompt && prompt.pieceIds ? prompt.pieceIds[0] : undefined
    };
    if (card) {
      entry.card = {
        id: card.id,
        text: card.text,
        star: card.star,
        tags: card.tags || [],
        pool: card.pool || card.type,
        src: card.src || ''
      };
    }
    s.log.push(entry);
  }

  function bumpCardsProcessed(s) {
    s.cardsProcessed = (Number(s.cardsProcessed) || 0) + 1;
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

  function resolvePrompt(state, outcome, opts) {
    var blocked = guard(state);
    if (blocked) return blocked;
    var awaiting = state.awaiting || {};
    if (awaiting.type !== 'prompt' && awaiting.type !== 'ending-prompt') {
      return fail(state, 'AWAITING_OTHER', '现在没有要结算的题');
    }
    var how = outcome === 'skipped' ? 'skipped' : (outcome === 'done' ? 'done' : null);
    if (!how) return fail(state, 'AWAITING_OTHER', '只能做了或放过');
    if (awaiting.type === 'ending-prompt' && how === 'skipped' && state.rules && state.rules.endingPromptSkippable === false) {
      return fail(state, 'PROMPT_NOT_SKIPPABLE', '这张收尾先做完');
    }
    var s = clone(state);
    var prompt = s.awaiting.prompt;
    var events = [];

    /* ---- 命运格（P1）：两张不同池的卡二选一；opts.cardIndex 选定 ----
     * 未选 = 都不选：回主桌，不记题、不动热度、不算失败（spec §5.3 / AC-E5-3）。
     * 命运格不计入目标题卡数（AC-E5-4）。 */
    if (prompt.kind === 'fate') {
      var cardIndex = null;
      if (opts && (opts.cardIndex === 0 || opts.cardIndex === 1)) {
        var picked = (prompt.options || [])[opts.cardIndex];
        if (picked) cardIndex = opts.cardIndex;
      }
      releaseFateOptions(s, prompt, cardIndex);
      if (cardIndex === null) {
        s.awaiting = { type: 'roll' };
        afterAction(s, events);
        return pass(s, events);
      }
      var chosen = prompt.options[cardIndex];
      pushPromptLog(s, prompt, how, chosen);
      applyMeta(s, 'fate', how, events);
      s.awaiting = { type: 'roll' };
      afterAction(s, events);
      return pass(s, events);
    }

    pushPromptLog(s, prompt, how);
    applyMeta(s, prompt.kind, how, events);

    /* ---- 收尾卡：两张各给一人，依次结算；第二张后结束并出棋谱（无输赢） ---- */
    if (awaiting.type === 'ending-prompt') {
      var queue = Array.isArray(s.endingQueue) && s.endingQueue.length ? s.endingQueue : [prompt];
      var next = Math.floor(Number(s.endingIndex) || 0) + 1;
      if (next < queue.length) {
        s.endingIndex = next;
        s.awaiting = { type: 'ending-prompt', prompt: queue[next] };
        events.push({ type: 'prompt', prompt: queue[next] });
        return pass(s, events);
      }
      s.endingIndex = queue.length;
      s.phase = 'ended';
      s.awaiting = { type: 'none' };
      s.pendingMove = null;
      s.rollContext = null;
      s.result = buildLedger(s);
      events.push({ type: 'ledger' });
      return pass(s, events);
    }

    /* ---- 普通题卡：进航题 / 叠机题「放过」按 V6 规则保留进军与奖励步 ---- */
    if (prompt.kind === 'home-entry') {
      var pending = s.pendingMove;
      var enter = how === 'done' || (how === 'skipped' && s.rules.skipHomeEntryBlocksEntry === false);
      s.awaiting = { type: 'roll' };
      s.pendingMove = null;
      bumpCardsProcessed(s);
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
      bumpCardsProcessed(s);
      var step = how === 'done' || (how === 'skipped' && s.rules.skipStackKeepsBonusStep === true);
      if (step && bonus && bonus.type === 'bonus') {
        var applied = runPending(s, bonus, events);
        if (applied.waiting) return pass(s, events);
      }
      afterAction(s, events);
      return pass(s, events);
    }

    s.awaiting = { type: 'roll' };
    bumpCardsProcessed(s);
    afterAction(s, events);
    return pass(s, events);
  }

  function resolveMinigame(state, outcomeOpt) {
    var blocked = guard(state);
    if (blocked) return blocked;
    if (!state.awaiting || state.awaiting.type !== 'minigame') return fail(state, 'AWAITING_OTHER', '现在没有小游戏');
    var s = clone(state);
    var kind = s.awaiting.kind;
    var how = outcomeOpt === 'skipped' ? 'skipped' : 'done';
    var logKind = kind === 'thermo' ? 'minigame-thermo' : 'minigame-wheel';
    s.log.push({
      id: nextId(s, 'log'),
      ts: Date.now(),
      kind: logKind,
      outcome: how,
      minigame: kind,
      actorId: s.turn,
      pieceId: s.awaiting.pieceIds && s.awaiting.pieceIds[0]
    });
    var events = [];
    /* 小游戏完成 +5；跳过 +0（跳过不扣心动，只记录）。 */
    applyMeta(s, logKind, how, events);
    s.awaiting = { type: 'roll' };
    afterAction(s, events);
    return pass(s, events);
  }

  function buildLedger(state) {
    if (!state || (state.phase !== 'ended' && state.phase !== 'safe-ended')) return null;
    var endedAt = Date.now();
    var startedAt = Number(state.ts) || endedAt;
    var meta = metaApi() ? metaApi().normalize(state.meta) : ensureMeta(state);
    var winnerId = (state.winnerId === 'a' || state.winnerId === 'b') ? state.winnerId : winnerOf(state);
    var ledgerWinnerId = (state.phase === 'safe-ended') ? null : winnerId;
    var prompts = [];
    var minigames = [];
    var cardsDone = 0;
    var cardsSkipped = 0;
    (state.log || []).forEach(function (entry) {
      if (!entry || typeof entry !== 'object') return;
      if (entry.kind === 'minigame-thermo' || entry.kind === 'minigame-wheel') {
        minigames.push({
          kind: entry.minigame || (entry.kind === 'minigame-thermo' ? 'thermo' : 'truth-wheel'),
          outcome: entry.outcome === 'skipped' ? 'skipped' : 'done',
          actorId: entry.actorId || 'a'
        });
        return;
      }
      if (!entry.outcome || !PROMPT_KINDS[entry.kind]) return;
      var item = {
        kind: entry.kind,
        outcome: entry.outcome,
        actorId: entry.actorId || 'a'
      };
      if (entry.card) {
        item.cardId = entry.card.id;
        item.text = entry.card.text;
        item.star = entry.card.star;
        item.pool = entry.card.pool || entry.card.type;
        item.source = entry.card.src || entry.card.pool || entry.card.type || '';
      }
      prompts.push(item);
      /* 回顾统计（spec §5.4「今晚一起完成 N 张 / 放过 M 张」）含收尾卡；
       * 收尾卡仍不计入目标进度 cardsProcessed。 */
      if (entry.outcome === 'done') cardsDone++;
      else cardsSkipped++;
    });
    var ledger = {
      v: 2,
      date: shanghaiDate(endedAt),
      startedAt: startedAt,
      endedAt: endedAt,
      durationMs: Math.max(0, endedAt - startedAt),
      names: { a: state.names.a, b: state.names.b },
      colors: { a: state.colors.a, b: state.colors.b },
      scale: state.scale,
      mode: state.mode || modeOf(state.planeCount),
      planeCount: state.planeCount,
      boundaries: (state.boundaries || []).slice(),
      /* V6.1 §2.2：一方全部到家 → win-a/win-b；安全词 → safe；
       * winnerId 缺失的旧「合作收尾」档仍记 shared（UI 兼容文案）。 */
      ending: state.phase === 'safe-ended' ? 'safe' : (ledgerWinnerId ? 'win-' + ledgerWinnerId : 'shared'),
      winnerId: state.phase === 'safe-ended' ? null : ledgerWinnerId,
      stats: {
        cardsDone: cardsDone,
        cardsSkipped: cardsSkipped,
        heat: Number(meta.heat) || 0,
        bestStreak: Number(meta.streakBest) || 0,
        minigames: minigames.length,
        planesHome: { a: arrivedCount(state, 'a'), b: arrivedCount(state, 'b') }
      },
      prompts: prompts,
      minigames: minigames
    };
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
    var awaiting = state && state.awaiting ? clone(state.awaiting) : { type: 'none' };
    var M = metaApi();
    var meta = M ? M.view(state && state.meta) : (state && state.meta) || null;
    var mode = state && (state.mode || modeOf(state.planeCount));
    var queue = state && Array.isArray(state.endingQueue) ? state.endingQueue : [];
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
      reduced: !!opts.reduced,
      /* 【V6 新增】api-contract §5 允许追加，视图必须容忍缺失。 */
      names: state && state.names ? { a: state.names.a, b: state.names.b } : undefined,
      awaiting: awaiting,
      choices: awaiting.type === 'choose-piece' ? (awaiting.pieceIds || []).slice() : [],
      pending: state && state.pendingMove ? {
        type: state.pendingMove.type,
        pieceIds: (state.pendingMove.pieceIds || []).slice(),
        steps: state.pendingMove.steps,
        from: state.pendingMove.from
      } : null,
      meta: meta,
      /* V6 进度投影：状态条「第 N/目标 张」「心动值」「连击」只读这里。 */
      progress: {
        mode: mode,
        cardsProcessed: Number(state && state.cardsProcessed) || 0,
        targetCards: Number(state && state.targetCards) || 0,
        targetHeat: Number(state && state.targetHeat) || 0,
        endingIndex: Number(state && state.endingIndex) || 0,
        endingTotal: queue.length
      },
      /* V6.1 §2.1：状态条「已到家」与起飞保底投影（targetCards/targetHeat 仅历史兼容）。 */
      planesHome: { a: arrivedCount(state || {}, 'a'), b: arrivedCount(state || {}, 'b') },
      takeoff: {
        misses: { a: takeoffMissOf(state, 'a'), b: takeoffMissOf(state, 'b') },
        pity: takeoffPity(state)
      }
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
