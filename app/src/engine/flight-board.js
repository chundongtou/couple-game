/* ==========================================================================
 * 今晚飞行棋 · 棋盘拓扑（锁死坐标，见 T-003 清单 §1）
 * 外周 52 格顺时针。四色起飞错开 13 格。航线 N = 5，再加 goal。
 * 跳 / 飞不在 UI 里重算，只读这张表。
 *
 * 红 takeoff ring:0  进航 ring:50  飞点 ring:20 → ring:32 → 再跳 ring:36  禁跳 ring:48
 * 黄 takeoff ring:13 进航 ring:11  飞点 ring:33 → ring:45 → 再跳 ring:49  禁跳 ring:9
 * 蓝 takeoff ring:26 进航 ring:24  飞点 ring:46 → ring:6  → 再跳 ring:10  禁跳 ring:22
 * 绿 takeoff ring:39 进航 ring:37  飞点 ring:7  → ring:19 → 再跳 ring:23  禁跳 ring:35
 *
 * V6 命运格（docs/v6/impl-freeze.md §2.3）：候选 7/31，但 ring:7 是绿方飞点、
 * 与功能格冲突，按冻结单退路改用 FATE_CELLS = [5, 29]。命运格不再自动跳格，
 * 落定后由引擎给两张不同池的卡二选一（prompt.kind='fate'）。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  var COLORS = ['red', 'yellow', 'blue', 'green'];
  var TAKEOFF = { red: 0, yellow: 13, blue: 26, green: 39 };
  var HOME_STEPS = 5;

  /* 主路线出题约八成：39 题/小游戏 + 2 命运 = 41/52。
   * 这是本轮对「普通格不出题」的显式变更，不是 A1–A3 或叠机击落开关。
   * 起飞、飞点、进航共 12 格不出普通题，短字仍是功能名。
   * 禁跳、飞后再跳会出题，但印刷层仍写停/跳，不改成看不出功能的题格。
   * 跳、飞、进航的坐标不在这里重算。 */
  var CELL_KIND = {
    1: 'truth', 2: 'truth', 5: 'truth', 9: 'truth', 12: 'truth',
    16: 'truth', 17: 'truth', 23: 'truth', 25: 'truth', 28: 'truth',
    31: 'truth', 38: 'truth', 42: 'truth', 43: 'truth', 51: 'truth',
    4: 'dare', 6: 'dare', 15: 'dare', 18: 'dare', 19: 'dare',
    22: 'dare', 27: 'dare', 30: 'dare', 32: 'dare', 35: 'dare',
    41: 'dare', 44: 'dare', 45: 'dare', 48: 'dare', 49: 'dare',
    3: 'touch', 8: 'touch', 21: 'touch', 29: 'touch', 34: 'touch', 47: 'touch',
    10: 'thermo', 36: 'thermo',
    14: 'wheel', 40: 'wheel'
  };
  var WHEEL_KIND = { 14: 'truth-wheel', 40: 'dare-wheel' };

  /* V6 命运格：候选 7/31 中 7 是飞点，冲突 → 用冻结单退路 5/29。 */
  var FATE_CELLS = [5, 29];
  FATE_CELLS.forEach(function (n) { CELL_KIND[n] = 'fate'; });

  function mod(n) { return ((n % 52) + 52) % 52; }

  function colorOfRing(n) { return COLORS[mod(n) % 4]; }

  function isForbidden(n) {
    var c = colorOfRing(n);
    return n === mod(TAKEOFF[c] + 48);
  }

  function isFlyIndex(n) {
    var c = colorOfRing(n);
    return n === mod(TAKEOFF[c] + 20);
  }

  var squares = [];
  var byId = {};

  function add(sq) {
    squares.push(sq);
    byId[sq.id] = sq;
  }

  COLORS.forEach(function (c) {
    for (var slot = 0; slot < 4; slot++) {
      add({
        id: 'hangar:' + c + ':' + slot,
        kind: 'hangar',
        color: c,
        isFly: false,
        jumpTo: null,
        flyTo: null
      });
    }
  });

  for (var n = 0; n < 52; n++) {
    var color = colorOfRing(n);
    var fly = isFlyIndex(n);
    var forbid = isForbidden(n);
    var fate = FATE_CELLS.indexOf(n) >= 0;
    add({
      id: 'ring:' + n,
      kind: CELL_KIND[n] || 'ring',
      color: color,
      wheel: WHEEL_KIND[n] || null,
      isFly: fly,
      /* 命运格是功能格：不自动跳格，落定后由引擎发二选一题卡。 */
      jumpTo: (forbid || fate) ? null : ('ring:' + mod(n + 4)),
      flyTo: fly ? ('ring:' + mod(n + 12)) : null,
      fate: fate
    });
  }

  COLORS.forEach(function (c) {
    for (var step = 0; step < HOME_STEPS; step++) {
      add({
        id: 'home:' + c + ':' + step,
        kind: 'home',
        color: c,
        step: step,
        isFly: false,
        jumpTo: null,
        flyTo: null
      });
    }
    add({
      id: 'home:' + c + ':goal',
      kind: 'goal',
      color: c,
      isFly: false,
      jumpTo: null,
      flyTo: null
    });
  });

  var takeoffOf = {};
  var homeEntryOf = {};
  var homePathOf = {};
  var flyOf = {};
  var flyDestOf = {};
  var flyThenJumpOf = {};
  var noJumpOf = {};

  COLORS.forEach(function (c) {
    var t = TAKEOFF[c];
    takeoffOf[c] = 'ring:' + t;
    homeEntryOf[c] = 'ring:' + mod(t + 50);
    flyOf[c] = 'ring:' + mod(t + 20);
    flyDestOf[c] = 'ring:' + mod(t + 32);
    flyThenJumpOf[c] = 'ring:' + mod(t + 36);
    noJumpOf[c] = 'ring:' + mod(t + 48);
    var path = [];
    for (var s = 0; s < HOME_STEPS; s++) path.push('home:' + c + ':' + s);
    path.push('home:' + c + ':goal');
    homePathOf[c] = path;
  });

  var BOARD = {
    colors: COLORS.slice(),
    homeSteps: HOME_STEPS,
    fateCells: FATE_CELLS.slice(),
    squares: squares,
    takeoffOf: takeoffOf,
    homeEntryOf: homeEntryOf,
    homePathOf: homePathOf,
    flyOf: flyOf,
    flyDestOf: flyDestOf,
    flyThenJumpOf: flyThenJumpOf,
    noJumpOf: noJumpOf
  };

  function square(id) { return byId[id] || null; }

  function parseSquare(id) {
    var hangar = /^hangar:(red|yellow|blue|green):(\d+)$/.exec(id || '');
    if (hangar) return { type: 'hangar', color: hangar[1], slot: Number(hangar[2]) };
    var ring = /^ring:(\d+)$/.exec(id || '');
    if (ring) return { type: 'ring', n: Number(ring[1]) };
    var goal = /^home:(red|yellow|blue|green):goal$/.exec(id || '');
    if (goal) return { type: 'goal', color: goal[1] };
    var home = /^home:(red|yellow|blue|green):(\d+)$/.exec(id || '');
    if (home) return { type: 'home', color: home[1], step: Number(home[2]) };
    return null;
  }

  function progressOf(color, ringId) {
    var loc = parseSquare(ringId);
    if (!loc || loc.type !== 'ring') return -1;
    return mod(loc.n - TAKEOFF[color]);
  }

  function ringAt(color, progress) {
    return 'ring:' + mod(TAKEOFF[color] + progress);
  }

  root.FlightBoard = {
    COLORS: COLORS,
    TAKEOFF: TAKEOFF,
    HOME_STEPS: HOME_STEPS,
    FATE_CELLS: FATE_CELLS,
    map: function () { return BOARD; },
    square: square,
    parseSquare: parseSquare,
    progressOf: progressOf,
    ringAt: ringAt,
    mod: mod
  };
})(typeof window !== 'undefined' ? window : this);
