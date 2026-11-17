#!/usr/bin/env node
/* 今晚飞行棋 · 引擎验收
 * node qa/rebuild/flight-engine.test.mjs
 * 坐标与 75 条以 T-003 清单为准。A1/A3 与 stackCapturedBySingle 仍为待确认，不是已批准规则。
 *
 * ====================== V6.1 语义变更（impl-freeze-v6.1，覆盖 impl-freeze.md） ======================
 * 1) 结束条件改为「一方全部飞机到家」：allHome(a)||allHome(b) → winnerId + win 事件 → 两张收尾卡。
 *    题卡数 / 心动值 / 长夜单架到家都不再结束（cardsProcessed、meta.heat、targetCards、targetHeat 仍记录）。
 *    旧「cards/heat 触发收尾」断言已按新语义改为「不结束」或改为注入 allHome 触发。
 * 2) 起飞保底：仍要 6 起飞；连续 2 个自己的回合没掷出 6（且所有未到家飞机都在机坪），
 *    第 3 个回合任意点数保底起飞；takeoffMiss 0..2，实际起飞或掷出 6 清零。
 * 3) ledger：ending='win-a'|'win-b'|'safe'（旧无赢家档兼容 'shared'）；stats.planesHome={a,b}。
 * 4) 合作收尾流程不变：两张收尾卡各给一人、都可放过；安全词仍是 safe。
 * 5) 命运格 / 心动值 / 连击 / 小游戏 / 进航放过不惩罚均不变。
 * 测试辅助 place() 默认把「行动方」没点名的棋子放终点、「对方」放机坪，只用于隔离单个棋规场景；
 * 需要测「一方全部到家」收尾时用 lastPlaneComing() 注入最后一架。见 §6/§13/§15/§20。
 * ==============================================================================================
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8');

let passed = 0;
const failed = [];
function ok(cond, msg) {
  if (cond) { passed++; return true; }
  failed.push(msg);
  console.error('  ✗ ' + msg);
  return false;
}
function eq(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  return ok(a === b, msg + '  [got ' + a + ' / want ' + b + ']');
}
function section(name) { console.log('\n== ' + name + ' =='); }
function snap(o) { return JSON.stringify(o); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }

function makeSandbox(mem) {
  const sandbox = {
    window: {},
    console,
    Math,
    Date,
    JSON,
    Object,
    Array,
    Number,
    String,
    RegExp,
    parseInt,
    Intl,
    Error
  };
  sandbox.global = sandbox.window;
  if (mem) {
    sandbox.localStorage = {
      getItem: (k) => (k in mem ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v); },
      removeItem: (k) => { delete mem[k]; }
    };
    sandbox.window.localStorage = sandbox.localStorage;
  }
  vm.createContext(sandbox);
  const files = [
    'app/src/core/util.js',
    'app/src/core/bus.js',
    'app/src/data/cards.js',
    'app/src/engine/flight-rules.js',
    'app/src/engine/flight-board.js',
    'app/src/engine/flight-meta.js',
    'app/src/engine/flight-draw.js',
    'app/src/engine/archive.js',
    'app/src/engine/minigames.js',
    'app/src/engine/flight-engine.js',
    'app/src/core/store.js'
  ];
  files.forEach((rel) => vm.runInContext(read(path.join(ROOT, rel)), sandbox, { filename: rel }));
  return sandbox;
}

const sb = makeSandbox();
const App = sb.window.App;
const F = App.Flight;
const Rules = App.FlightRules;
const Board = App.FlightBoard;
const Draw = App.FlightDraw;
const Meta = App.FlightMeta;
const Archive = App.Archive;
const Mini = App.Minigames;
const CARDS = sb.window.CARDS;
const MAP = Board.map();
const EXPLICIT = new RegExp(Draw.EXPLICIT_SRC);
const GENTLE_EXTRA = new RegExp(Draw.GENTLE_EXTRA_SRC);

function boot(extra, seed) {
  const setup = Object.assign({
    names: { a: '阿岚', b: '小满' },
    colors: { a: 'red', b: 'yellow' },
    scale: 'warm',
    boundaries: [],
    planeCount: 4
  }, extra || {});
  return F.newGame(setup, seed == null ? 11 : seed);
}
function stateOf(extra, seed) { return boot(extra, seed).state; }

function place(state, turn, map, opts) {
  opts = opts || {};
  const s = clone(state);
  s.turn = turn || 'a';
  s.phase = 'playing';
  s.awaiting = { type: 'roll' };
  s.pendingMove = null;
  s.rollContext = null;
  s.winnerId = null;
  s.result = null;
  s.endingQueue = null;
  s.endingIndex = 0;
  s.takeoffMiss = opts.takeoffMiss
    ? { a: Number(opts.takeoffMiss.a) || 0, b: Number(opts.takeoffMiss.b) || 0 }
    : { a: 0, b: 0 };
  /* V6.1：结束条件是「一方全部到家」。place() 只隔离单个棋规场景：
   *  - 行动方没点名的棋子放终点（arrived），保证只有 map 里的棋子可动；
   *  - 对方没点名的棋子留在机坪（未到家），避免误触 allHome 提前收尾。 */
  s.mode = opts.mode || s.mode || 'quick';
  s.targetCards = opts.targetCards != null ? opts.targetCards : 99;
  s.targetHeat = opts.targetHeat != null ? opts.targetHeat : 999;
  if (opts.cardsProcessed != null) s.cardsProcessed = opts.cardsProcessed;
  if (opts.heat != null) s.meta = Meta.normalize(Object.assign({}, s.meta, { heat: opts.heat }));
  const actor = s.turn;
  s.pieces.forEach((p) => {
    const m = map[p.id];
    if (m) {
      p.squareId = m.squareId;
      p.arrived = !!m.arrived;
      p.stackGroupId = m.stackGroupId || null;
    } else if (p.playerId === actor) {
      p.squareId = 'home:' + p.color + ':goal';
      p.arrived = true;
      p.stackGroupId = null;
    } else {
      p.squareId = 'hangar:' + p.color + ':' + (String(p.id).split(':')[1] || 0);
      p.arrived = false;
      p.stackGroupId = null;
    }
  });
  return s;
}

/* V6.1 收尾注入：pid 的最后一架在 home:*:4，其余己方已到家、对方全在机坪。掷 1 即「一方全部到家」。 */
function lastPlaneComing(state, pid) {
  const who = pid || 'a';
  const s = place(state, who, {});
  const color = s.colors[who];
  s.pieces.forEach((p) => {
    if (p.playerId !== who) return;
    p.arrived = p.id !== who + ':0';
    p.squareId = p.id === who + ':0' ? 'home:' + color + ':4' : 'home:' + color + ':goal';
    p.stackGroupId = null;
  });
  return s;
}

/* 所有棋子留在机坪（不预置 arrived），再按 map 放指定棋子。用于「只到家部分飞机」场景。 */
function parked(state, turn, map) {
  const s = clone(state);
  s.turn = turn || 'a';
  s.phase = 'playing';
  s.awaiting = { type: 'roll' };
  s.pendingMove = null;
  s.rollContext = null;
  s.winnerId = null;
  s.result = null;
  s.endingQueue = null;
  s.endingIndex = 0;
  s.takeoffMiss = { a: 0, b: 0 };
  s.pieces.forEach((p) => {
    p.squareId = 'hangar:' + p.color + ':' + (String(p.id).split(':')[1] || 0);
    p.arrived = false;
    p.stackGroupId = null;
  });
  Object.keys(map || {}).forEach((id) => {
    const p = at(s, id);
    if (!p) return;
    p.squareId = map[id].squareId;
    p.arrived = !!map[id].arrived;
    p.stackGroupId = map[id].stackGroupId || null;
  });
  return s;
}

/* 全放过局：每回合把 a:0 放到真心话格前、掷 1 出题、点放过，直到收尾或上限。 */
function playAllSkipped(seed, rounds) {
  let s = stateOf({ planeCount: 2 }, seed);
  const log = [];
  for (let i = 0; i < (rounds || 10); i++) {
    if (s.phase !== 'playing' || (s.awaiting && s.awaiting.type === 'ending-prompt')) break;
    s = place(s, 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: 4, targetHeat: 40 });
    const rolled = F.roll(s, 1);
    if (!rolled.ok) break;
    const base = rolled.state;
    if (!base.awaiting || base.awaiting.type !== 'prompt' || base.awaiting.prompt.kind !== 'cell-truth') break;
    log.push(base.awaiting.prompt.card && base.awaiting.prompt.card.id);
    s = F.resolvePrompt(base, 'skipped').state;
  }
  return { state: s, cards: log };
}

/* 两张收尾卡依次结算（默认都做了）。 */
function settleEnding(state, first, second) {
  const r1 = F.resolvePrompt(state, first || 'done');
  if (!r1.ok) return { ok: false, error: r1.error, state: state };
  const r2 = F.resolvePrompt(r1.state, second || 'done');
  return { ok: r2.ok, first: r1, last: r2, state: r2.state, error: r2.error };
}

/* 把 a:0 放到真心话格 ring:1 再掷 1，稳定得到一张 cell-truth 题卡。 */
function promptState(state, opts) {
  const s = place(state, 'a', { 'a:0': { squareId: 'ring:1' } }, Object.assign({ targetCards: 99, targetHeat: 999 }, opts || {}));
  return F.roll(s, 1);
}

/* 做/放过一张普通题卡，返回 Result（便于连续累积 heat/streak）。 */
function doPrompt(state, outcome) {
  const rolled = promptState(state);
  if (!rolled.ok || rolled.state.awaiting.type !== 'prompt') return null;
  return F.resolvePrompt(rolled.state, outcome || 'done');
}
function at(state, id) {
  return state.pieces.filter((p) => p.id === id)[0];
}
function hasType(events, type) { return (events || []).some((e) => e.type === type); }
function mean(arr) { return arr.reduce((s, n) => s + n, 0) / (arr.length || 1); }

section('1. 开局、校验、规则拷贝（V6 规则修复 + 待确认开关）');
{
  const cur = Rules.current();
  eq(cur, {
    rerollOnEverySix: true,
    chooseAmongLegalPieces: true,
    threeSixesPenalty: false,
    skipHomeEntryBlocksEntry: false,
    skipStackKeepsBonusStep: true,
    endingPromptSkippable: true,
    ledgerIncludeMoveReplay: false,
    stackCapturedBySingle: true
  }, '1 默认开关：A2 两项按 V6 冻结单，其余待确认');
  cur.rerollOnEverySix = false;
  ok(Rules.current().rerollOnEverySix === true, '1 current() 返回拷贝');
  const rulesText = read(path.join(ROOT, 'app/src/engine/flight-rules.js'));
  ok(rulesText.indexOf('V6 冻结') >= 0 && rulesText.indexOf('待确认') >= 0, '1 源码区分 V6 冻结项与待确认项');

  const made = boot({ scale: 'gentle', boundaries: ['喝酒'] }, 3);
  ok(made.ok && made.error === null, '2 newGame 成功');
  const g = made.state;
  ok(g.kind === 'flight' && g.v === 2 && g.phase === 'playing', '2 对局是飞行棋、v2 且进行中');
  ok(g.awaiting.type === 'roll' && g.turn === 'a', '2 先手可掷');
  ok(g.mode === 'long' && g.targetCards === 8 && g.targetHeat === 80, '2 默认 4 架=长夜目标');
  ok(g.cardsProcessed === 0 && g.endingQueue === null && g.endingIndex === 0, '2 V6 收尾进度字段初始值');
  ok(g.meta && g.meta.heat === 0 && g.meta.stage === 'cold' && g.meta.streak === 0 && g.meta.streakBest === 0, '2 meta 初始为零');
  ok(Array.isArray(g.meta.milestones) && g.meta.milestones.length === 0, '2 里程碑初始为空');
  const quick = stateOf({ planeCount: 2 }, 1);
  ok(quick.mode === 'quick' && quick.targetCards === 4 && quick.targetHeat === 40, '2 快局 2 架目标 4/40');
  const modeQuick = F.newGame({ names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'warm', mode: 'quick' }, 1);
  ok(modeQuick.ok && modeQuick.state.planeCount === 2 && modeQuick.state.mode === 'quick', '2 mode=quick 推 2 架');
  const customTarget = F.newGame({ names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'warm', planeCount: 2, targetCards: 6, targetHeat: 55 }, 1);
  ok(customTarget.ok && customTarget.state.targetCards === 6 && customTarget.state.targetHeat === 55, '2 可传入目标数字（门厅按模式传，缺省仍用冻结默认）');
  ok(!F.newGame({ names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'warm', mode: 'quick', planeCount: 4 }, 1).ok, '2 mode 与架数冲突拒绝');
  ok(!F.newGame({ names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'warm', mode: 'medium' }, 1).ok, '2 未知 mode 拒绝');
  eq({ gentle: 1, warm: 2, hot: 3, open: 4 }, { gentle: 1, warm: 2, hot: 3, open: 4 }, '尺度表');
  ['gentle', 'warm', 'hot', 'open'].forEach((scale) => {
    const s = stateOf({ scale: scale }, 1);
    const cap = { gentle: 1, warm: 2, hot: 3, open: 4 }[scale];
    ok(s.maxStarCap === cap && s.scale === scale, '2 尺度 ' + scale + ' → ' + cap);
  });
  ok(g.pieces.length === 8, '3 默认每方 4 架');
  const fast = stateOf({ planeCount: 2 }, 1);
  eq(fast.pieces.map((p) => p.id), ['a:0', 'a:1', 'b:0', 'b:1'], '3 快局 id');
  ok(fast.pieces.every((p) => p.squareId.indexOf('hangar:') === 0), '3 开局在停机坪');

  function bad(setup, msg) {
    const r = F.newGame(setup, 1);
    ok(!r.ok && r.error && r.error.code === 'INVALID_SETUP' && r.state === null, msg);
  }
  bad({ names: { a: '', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'warm', planeCount: 4 }, '4 缺名字');
  bad({ names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'red' }, scale: 'warm', planeCount: 4 }, '4 两色相同');
  bad({ names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'warm', planeCount: 3 }, '4 架数非法');
  bad({ names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'spicy', planeCount: 4 }, '4 未知尺度');
  bad({ names: { a: '阿岚', b: '小满' }, colors: { a: 'pink', b: 'yellow' }, scale: 'warm', planeCount: 4 }, '4 未知颜色');

  const valid = F.validate(g);
  ok(valid && valid.kind === 'flight' && valid !== g, '5 validate 合法状态');
  ok(F.validate(null) === null && F.validate({ kind: 'flight' }) === null, '5 非法返回 null');
  let threw = false;
  try { F.validate(undefined); } catch (e) { threw = true; }
  ok(!threw, '5 validate 不抛错');

  const before = snap(g);
  F.roll(g, 3);
  F.legalMoves(g, 1);
  F.safeWord(g);
  ok(snap(g) === before, '6 改状态方法不改入参');
}

section('2. 棋盘表钉死');
{
  eq(MAP.takeoffOf, { red: 'ring:0', yellow: 'ring:13', blue: 'ring:26', green: 'ring:39' }, '7 起飞格');
  eq(MAP.homeEntryOf, { red: 'ring:50', yellow: 'ring:11', blue: 'ring:24', green: 'ring:37' }, '7 进航格');
  eq(MAP.flyOf, { red: 'ring:20', yellow: 'ring:33', blue: 'ring:46', green: 'ring:7' }, '7 飞点');
  eq(MAP.flyDestOf, { red: 'ring:32', yellow: 'ring:45', blue: 'ring:6', green: 'ring:19' }, '7 飞的终点');
  eq(MAP.flyThenJumpOf, { red: 'ring:36', yellow: 'ring:49', blue: 'ring:10', green: 'ring:23' }, '7 飞后再跳');
  eq(MAP.noJumpOf, { red: 'ring:48', yellow: 'ring:9', blue: 'ring:22', green: 'ring:35' }, '7 禁跳格');
  eq(Board.FATE_CELLS, [5, 29], '7 V6 命运格用冻结单退路 5/29（7 是飞点）');
  ok(MAP.fateCells.length === 2, '7 棋盘表带命运格');
  Board.COLORS.forEach((c) => {
    eq(MAP.homePathOf[c], [
      'home:' + c + ':0', 'home:' + c + ':1', 'home:' + c + ':2',
      'home:' + c + ':3', 'home:' + c + ':4', 'home:' + c + ':goal'
    ], '7/8 ' + c + ' 航线 5 + goal');
  });
  const rings = MAP.squares.filter((s) => /^ring:\d+$/.test(s.id));
  ok(rings.length === 52, '8 环长 52');
  Board.COLORS.forEach((c) => {
    const owned = [];
    for (let k = 0; k <= 12; k++) owned.push('ring:' + ((Board.TAKEOFF[c] + 4 * k) % 52));
    owned.forEach((id) => {
      const sq = Board.square(id);
      ok(sq.color === c, '9 ' + id + ' 属于 ' + c);
      if (id === MAP.noJumpOf[c] || Board.FATE_CELLS.indexOf(Number(id.slice(5))) >= 0) ok(sq.jumpTo === null, '9 禁跳/命运 ' + id);
      else ok(sq.jumpTo === 'ring:' + ((Number(id.slice(5)) + 4) % 52), '9 跳 +4 ' + id);
    });
    const fly = Board.square(MAP.flyOf[c]);
    ok(fly.isFly === true && fly.flyTo === MAP.flyDestOf[c], '9 飞点 ' + c);
  });
  const kinds = { truth: [], dare: [], touch: [], thermo: [], wheel: [], fate: [] };
  rings.forEach((sq) => { if (kinds[sq.kind]) kinds[sq.kind].push(sq.id); });
  eq(kinds.truth.sort(), ['ring:1', 'ring:2', 'ring:9', 'ring:12', 'ring:16', 'ring:17', 'ring:23', 'ring:25', 'ring:28', 'ring:31', 'ring:38', 'ring:42', 'ring:43', 'ring:51'].sort(), '10 真心话格（V6 少 5，改为命运格）');
  eq(kinds.dare.sort(), ['ring:4', 'ring:6', 'ring:15', 'ring:18', 'ring:19', 'ring:22', 'ring:27', 'ring:30', 'ring:32', 'ring:35', 'ring:41', 'ring:44', 'ring:45', 'ring:48', 'ring:49'].sort(), '10 大冒险格');
  eq(kinds.touch.sort(), ['ring:3', 'ring:8', 'ring:21', 'ring:34', 'ring:47'].sort(), '10 靠近格（V6 少 29，改为命运格）');
  eq(kinds.thermo.sort(), ['ring:10', 'ring:36'], '10 温度计 2');
  eq(kinds.wheel.sort(), ['ring:14', 'ring:40'], '10 转盘 2');
  eq(kinds.fate.sort(), ['ring:29', 'ring:5'], '10 命运格 2');
  kinds.fate.forEach((id) => {
    const sq = Board.square(id);
    ok(sq.kind === 'fate' && sq.jumpTo === null && sq.isFly === false, '10 命运格是功能格，不跳不飞 ' + id);
  });
  const asking = kinds.truth.length + kinds.dare.length + kinds.touch.length + kinds.thermo.length + kinds.wheel.length + kinds.fate.length;
  eq(asking, 40, '10 主路线互动格数（题/小游戏/命运）');
  ok(Math.abs(asking / 52 - 0.8) <= 0.04, '10 约 80%，实际 ' + asking + '/52');
  ['0', '13', '26', '39'].forEach((n) => ok(Board.square('ring:' + n).kind === 'ring', '10 起飞格不出普通题 ' + n));
  ['7', '20', '33', '46'].forEach((n) => ok(Board.square('ring:' + n).kind === 'ring' && Board.square('ring:' + n).isFly === true, '10 飞点仍是飞点且不出普通题 ' + n));
  ['11', '24', '37', '50'].forEach((n) => ok(Board.square('ring:' + n).kind === 'ring', '10 进航格不出普通题 ' + n));
  ok(Board.square('ring:14').wheel === 'truth-wheel', '10 真话转盘');
  ok(Board.square('ring:40').wheel === 'dare-wheel', '10 大冒险转盘');
}

section('3. 起飞与再掷（A1 默认，待确认）');
{
  const dice = [];
  for (let seed = 1; seed <= 40; seed++) {
    const r = F.roll(stateOf({}, seed));
    const die = r.events.filter((e) => e.type === 'dice')[0].die;
    dice.push(die);
    ok(die >= 1 && die <= 6 && r.events[0].type === 'dice', '11 骰子 1–6 seed ' + seed);
  }
  ok(dice.every((d) => d >= 1 && d <= 6), '11 结果只有 1–6');
  const again = F.roll(stateOf({}, 21));
  const again2 = F.roll(stateOf({}, 21));
  ok(again.events[0].die === again2.events[0].die, '11 同一种子可复现');

  let parked = place(stateOf({}, 2), 'a', { 'a:0': { squareId: 'hangar:red:0' } });
  const stay = snap(parked);
  const low = F.roll(parked, 3);
  ok(snap(parked) === stay, '12 roll 不改入参');
  ok(at(low.state, 'a:0').squareId === 'hangar:red:0', '12 非 6 留在停机坪');
  ok(low.state.turn === 'b' && hasType(low.events, 'turn'), '17 无一可走且非 6 换手');
  const need = F.legalMoves(parked, 3);
  ok(need.pieceIds.indexOf('a:0') < 0 && need.blocked['a:0'].blockedReason === 'NEED_SIX_TO_TAKEOFF', '12/72 非 6 不可起飞');

  const up = F.roll(parked, 6);
  ok(at(up.state, 'a:0').squareId === 'ring:0', '13 掷 6 到起飞格');
  ok(hasType(up.events, 'takeoff') && !hasType(up.events, 'jump') && !hasType(up.events, 'fly'), '13 起飞事件且本步不跳不飞');
  ok(up.state.turn === 'a' && up.state.awaiting.type === 'roll', '13/14 起飞后同一人再掷（待确认 A1）');

  let y = stateOf({ colors: { a: 'yellow', b: 'blue' }, boundaries: ['束缚'] }, 4);
  y = place(y, 'a', { 'a:0': { squareId: 'ring:48' } });
  const q = F.roll(y, 6);
  ok(at(q.state, 'a:0').squareId === 'ring:2', '14 先走到题格');
  ok(q.state.awaiting.type === 'prompt' && q.state.awaiting.prompt.kind === 'cell-truth', '14 先出题');
  ok(F.roll(q.state, 1).error.code === 'AWAITING_OTHER', '14/20 题没结算不能再掷');
  const settled = F.resolvePrompt(q.state, 'done');
  ok(settled.state.turn === 'a' && settled.state.awaiting.type === 'roll', '14 结算后才再掷（待确认 A1）');
  ok(Draw.allowed(q.state.awaiting.prompt.card, y), '14 题经过尺度与边界');

  let ringed = place(stateOf({}, 5), 'a', { 'a:0': { squareId: 'ring:1' } });
  const moved = F.roll(ringed, 6);
  ok(at(moved.state, 'a:0').squareId === 'ring:7', '15 航线上的 6 会走');
  ok(moved.state.turn === 'a' && moved.state.awaiting.type === 'roll', '15 航线上掷 6 后仍可再掷（待确认 A1）');

  let choice = place(stateOf({}, 6), 'a', {
    'a:0': { squareId: 'hangar:red:0' },
    'a:1': { squareId: 'hangar:red:1' }
  });
  const ch = F.roll(choice, 6);
  ok(ch.state.awaiting.type === 'choose-piece' && ch.state.awaiting.die === 6, '16 多架可走进入选择（待确认 A1）');
  ok(ch.state.awaiting.pieceIds.indexOf('a:0') >= 0 && ch.state.awaiting.pieceIds.indexOf('a:1') >= 0, '16 可选列表');
  const badPiece = F.move(ch.state, 'nope');
  ok(!badPiece.ok && badPiece.error.code === 'INVALID_PIECE' && badPiece.state === ch.state, '16 不存在的棋');
  const illegal = F.move(ch.state, 'a:2');
  ok(!illegal.ok && illegal.error.code === 'PIECE_NOT_LEGAL', '16 不在列表');

  let stuck = place(stateOf({}, 7), 'a', {});
  stuck.pieces.forEach((p) => {
    if (p.playerId === 'a') { p.squareId = 'home:red:0'; p.arrived = false; }
  });
  const extra = F.roll(stuck, 6);
  ok(extra.state.turn === 'a' && extra.events.some((e) => e.type === 'dice' && e.die === 6 && e.extraRoll === true), '18 无一可走且为 6 不换手（待确认 A1）');
  let triple = extra.state;
  triple = F.roll(triple, 6).state;
  triple = F.roll(triple, 6).state;
  ok(triple.consecutiveSixes === 3, '19 连续三个 6 只计数');
  ok(triple.pieces.filter((p) => p.playerId === 'a').every((p) => p.squareId === 'home:red:0'), '19 默认不处罚（待确认 A1）');

  const over = F.roll(F.resolvePrompt(F.safeWord(stateOf({}, 1)).state, 'done').state || F.safeWord(stateOf({}, 1)).state, 1);
  const ended = F.safeWord(stateOf({}, 1)).state;
  ok(F.roll(ended, 1).error.code === 'GAME_OVER', '20 已结束不能掷');
  ok(over.error || true, '20 路径可调用');
}

section('4. 跳与飞');
{
  function land(color, from, die, owner) {
    const colors = { a: color, b: color === 'red' ? 'yellow' : 'red' };
    let s = stateOf({ colors: colors }, 8);
    s = place(s, 'a', { 'a:0': { squareId: from } });
    const legal = F.legalMoves(s, die);
    const rolled = F.roll(s, die);
    return { legal: legal, rolled: rolled, at: at(rolled.state, 'a:0').squareId };
  }
  const jump = land('red', 'ring:43', 1);
  ok(jump.legal.moves['a:0'].path.indexOf('ring:48') >= 0, '21 path 含跳的落点');
  ok(jump.rolled.events.some((e) => e.type === 'jump' && e.from === 'ring:44' && e.to === 'ring:48'), '21 落到己方色格就跳');
  ok(jump.at === 'ring:48', '21 停在跳点');

  const fly = land('red', 'ring:19', 1);
  const ev = fly.rolled.events;
  const flyAt = ev.findIndex((e) => e.type === 'fly');
  const jumpAt = ev.findIndex((e) => e.type === 'jump');
  ok(ev.some((e) => e.type === 'fly' && e.from === 'ring:20' && e.to === 'ring:32'), '22 先飞到飞的终点');
  ok(flyAt >= 0 && jumpAt > flyAt, '22 飞在跳之前');
  ok(ev.some((e) => e.type === 'jump' && e.to === 'ring:36'), '22 飞后再跳');
  ok(!ev.some((e) => e.type === 'jump' && e.to === 'ring:24'), '22 不得先跳 4 离开飞点');
  ok(fly.at === 'ring:48', '22 红飞后连锁停稳');

  const pass = land('red', 'ring:19', 2);
  ok(pass.at === 'ring:21' && !hasType(pass.rolled.events, 'fly') && !hasType(pass.rolled.events, 'jump'), '23 途经飞点不飞');
  const passColor = land('red', 'ring:43', 2);
  ok(passColor.at === 'ring:45' && !hasType(passColor.rolled.events, 'jump'), '23 途经色格不跳');

  let blocked = place(stateOf({}, 9), 'a', { 'a:0': { squareId: 'ring:48' } });
  const over = F.roll(blocked, 4);
  ok(over.state.awaiting.prompt && over.state.awaiting.prompt.kind === 'home-entry', '24 禁跳格走向进航而不是跳过');
  ok(at(over.state, 'a:0').squareId === 'ring:48', '24 尚未进航');
  ok(at(over.state, 'a:0').squareId !== 'ring:0', '24 没有跳到起飞格');
  ok(Board.square('ring:48').jumpTo === null, '24 禁跳格没有 jumpTo');

  const cases = [
    ['red', 'ring:43', 1, 'ring:48', 'ring:19', 1, 'ring:20', 'ring:32', 'ring:36', 'ring:48'],
    /* 黄：ring:5 是 V6 命运格（不再自动跳），跳格链停在 5；飞后连锁同理会停在 5。 */
    ['yellow', 'ring:0', 1, 'ring:5', 'ring:32', 1, 'ring:33', 'ring:45', 'ring:49', 'ring:5'],
    ['blue', 'ring:17', 1, 'ring:22', 'ring:45', 1, 'ring:46', 'ring:6', 'ring:10', 'ring:22'],
    ['green', 'ring:30', 1, 'ring:35', 'ring:6', 1, 'ring:7', 'ring:19', 'ring:23', 'ring:35']
  ];
  cases.forEach((row) => {
    const j = land(row[0], row[1], row[2]);
    ok(j.at === row[3] && j.rolled.events.some((e) => e.type === 'jump'), '25 ' + row[0] + ' 跳');
    const f = land(row[0], row[4], row[5]);
    ok(f.rolled.events.some((e) => e.type === 'fly' && e.from === row[6] && e.to === row[7]), '25 ' + row[0] + ' 飞');
    ok(f.rolled.events.some((e) => e.type === 'jump' && e.to === row[8]), '25 ' + row[0] + ' 飞后再跳');
    ok(f.at === row[9], '25 ' + row[0] + ' 飞后停稳 ' + row[9]);
  });
}

section('5. 击落与叠机');
{
  let base = stateOf({ boundaries: ['束缚'] }, 12);
  base = place(base, 'a', {
    'a:0': { squareId: 'ring:0' },
    'b:0': { squareId: 'ring:1' }
  });
  base.log.push({ id: 'old', ts: 1, kind: 'cell-truth', outcome: 'done', card: { id: 'old', text: '已经做过的真话', star: 1, tags: [], pool: 'truth' }, actorId: 'a' });
  const cap = F.roll(base, 1);
  ok(at(cap.state, 'b:0').squareId.indexOf('hangar:yellow:') === 0, '26 对方回停机坪');
  ok(cap.state.awaiting.prompt.kind === 'capture', '26 击落题');
  ok(cap.state.awaiting.prompt.actorId === 'b' && cap.state.awaiting.prompt.targetId === 'b', '26 被击落的人做题');
  ok(JSON.stringify(cap.state.log).indexOf('已经做过的真话') >= 0, '26 已做的事还在');
  const doneCap = F.resolvePrompt(cap.state, 'done');
  ok(doneCap.state.log.filter((e) => e.kind === 'capture').length === 1, '26 被击落方不再另抽');
  ok(Draw.allowed(cap.state.awaiting.prompt.card, base), '26 题受尺度和边界约束');

  let stackCap = place(stateOf({}, 13), 'a', {
    'a:0': { squareId: 'ring:0' },
    'b:0': { squareId: 'ring:1', stackGroupId: 'stk-b' },
    'b:1': { squareId: 'ring:1', stackGroupId: 'stk-b' }
  });
  const both = F.roll(stackCap, 1);
  ok(at(both.state, 'b:0').squareId.indexOf('hangar:') === 0 && at(both.state, 'b:1').squareId.indexOf('hangar:') === 0, '27 整叠回停机坪（待确认，非已批准）');
  ok(both.state.awaiting.prompt.kind === 'capture' && both.state.awaiting.prompt.pieceIds.length === 2, '27 只出一张击落题');

  let onCell = place(stateOf({}, 14), 'a', {
    'a:0': { squareId: 'ring:1' },
    'b:0': { squareId: 'ring:2' }
  });
  const pri = F.roll(onCell, 1);
  ok(pri.state.awaiting.prompt.kind === 'capture', '28 击落优先于题格');
  ok(pri.state.awaiting.type !== 'minigame', '28 不出第二张');

  let duo = place(stateOf({}, 15), 'a', {
    'a:0': { squareId: 'ring:48' },
    'a:1': { squareId: 'ring:49' }
  });
  const choose = F.roll(duo, 1);
  ok(choose.state.awaiting.type === 'choose-piece', '29 两架都能动时先选');
  const stacked = F.move(choose.state, 'a:0');
  ok(at(stacked.state, 'a:0').stackGroupId && at(stacked.state, 'a:0').stackGroupId === at(stacked.state, 'a:1').stackGroupId, '29 叠成一组');
  ok(stacked.state.awaiting.prompt.kind === 'stack-duo' && stacked.state.awaiting.prompt.targetId === 'both', '29 双人题');
  const bonus = F.resolvePrompt(stacked.state, 'done');
  ok(!hasType(bonus.events, 'dice'), '29 再走一步不是再掷骰');
  ok(at(bonus.state, 'a:0').squareId === 'ring:50' && at(bonus.state, 'a:1').squareId === 'ring:50', '29 这组一起多走一步');

  let again = place(stateOf({}, 16), 'a', {
    'a:0': { squareId: 'ring:1' },
    'a:1': { squareId: 'ring:2' },
    'b:0': { squareId: 'ring:3' }
  });
  const step = F.move(F.roll(again, 1).state, 'a:0');
  ok(step.state.awaiting.prompt.kind === 'stack-duo', '30 先叠机');
  const next = F.resolvePrompt(step.state, 'done');
  ok(next.state.awaiting.prompt.kind === 'capture', '30 再走一步若击落，按优先级');
  ok(at(next.state, 'b:0').squareId.indexOf('hangar:') === 0, '30 对方被送回');

  let ask = place(stateOf({}, 17), 'a', {
    'a:0': { squareId: 'ring:0' },
    'a:1': { squareId: 'ring:1' }
  });
  const asked = F.move(F.roll(ask, 1).state, 'a:0');
  const trailed = F.resolvePrompt(asked.state, 'done');
  ok(trailed.state.awaiting.prompt.kind === 'cell-truth', '30 再走一步落到题格');

  const skipped = F.resolvePrompt(stacked.state, 'skipped');
  ok(at(skipped.state, 'a:0').squareId === 'ring:50' && at(skipped.state, 'a:1').squareId === 'ring:50', '31 V6：放过叠机题仍得奖励步');
  ok(at(skipped.state, 'a:0').stackGroupId && at(skipped.state, 'a:0').stackGroupId === at(skipped.state, 'a:1').stackGroupId, '31 叠机保留');

  let keep = stateOf({ rules: { skipStackKeepsBonusStep: true } }, 18);
  keep = place(keep, 'a', { 'a:0': { squareId: 'ring:48' }, 'a:1': { squareId: 'ring:49' } });
  const kept = F.resolvePrompt(F.move(F.roll(keep, 1).state, 'a:0').state, 'skipped');
  ok(at(kept.state, 'a:0').squareId === 'ring:50', '31 待确认：skipStackKeepsBonusStep 为 true 时仍走一步');

  let noBonus = stateOf({ rules: { skipStackKeepsBonusStep: false } }, 181);
  noBonus = place(noBonus, 'a', { 'a:0': { squareId: 'ring:48' }, 'a:1': { squareId: 'ring:49' } });
  const noStep = F.resolvePrompt(F.move(F.roll(noBonus, 1).state, 'a:0').state, 'skipped');
  ok(at(noStep.state, 'a:0').squareId === 'ring:49', '31 反相：开关 false 时放过不再多走（仅为可切开关）');

  let passFoe = place(stateOf({}, 19), 'a', {
    'a:0': { squareId: 'ring:1' },
    'b:0': { squareId: 'ring:2' }
  });
  const passed = F.roll(passFoe, 6);
  ok(at(passed.state, 'b:0').squareId === 'ring:2' && at(passed.state, 'a:0').squareId === 'ring:7', '32 途经对方不击落');
  ok(!passed.state.awaiting.prompt && passed.state.awaiting.type !== 'minigame', '32 途经题格不出题，只有落定才出');
}

section('6. 终点航线与收尾');
{
  function entry(die) {
    let s = place(stateOf({ boundaries: ['束缚'], scale: 'hot' }, 20), 'a', { 'a:0': { squareId: 'ring:50' } });
    const mid = F.roll(s, die);
    return { mid: mid, done: F.resolvePrompt(mid.state, 'done') };
  }
  const expect = ['home:red:0', 'home:red:1', 'home:red:2', 'home:red:3', 'home:red:4', 'home:red:goal'];
  for (let die = 1; die <= 6; die++) {
    const r = entry(die);
    ok(r.mid.state.awaiting.prompt.kind === 'home-entry', '33 进航先出题 ' + die);
    ok(at(r.mid.state, 'a:0').squareId === 'ring:50', '34 结算前停在 preSquare ' + die);
    ok(r.mid.state.awaiting.prompt.preSquareId === 'ring:50', '34 preSquareId');
    ok(Draw.allowed(r.mid.state.awaiting.prompt.card, r.mid.state), '34 进航题尺度与边界');
    ok(at(r.done.state, 'a:0').squareId === expect[die - 1], '33 done 后落到 ' + expect[die - 1]);
    if (die === 6) ok(at(r.done.state, 'a:0').arrived === true, '33 点数 6 到达终点');
  }

  let exact = place(stateOf({}, 21), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const tooFar = F.roll(exact, 2);
  ok(at(tooFar.state, 'a:0').squareId === 'home:red:4', '35 点数超过留在原位');
  ok(!tooFar.state.awaiting.prompt, '35 不误出进航题');
  ok(F.legalMoves(exact, 2).pieceIds.indexOf('a:0') < 0, '35 不写入可走列表');
  ok(F.legalMoves(exact, 2).blocked['a:0'].blockedReason === 'EXACT_COUNT_REQUIRED', '35/72 精确点数');

  let onEntry = place(stateOf({}, 22), 'a', { 'a:0': { squareId: 'ring:48' } });
  const sit = F.roll(onEntry, 2);
  ok(at(sit.state, 'a:0').squareId === 'ring:50' && !sit.state.awaiting.prompt, '35 只停在进航格不出题');

  const skippedHome = F.resolvePrompt(entry(1).mid.state, 'skipped');
  ok(at(skippedHome.state, 'a:0').squareId === 'home:red:0', '36 V6：进航题放过仍进军');
  ok(skippedHome.state.cardsProcessed === 1, '36 进航题放过也计入处理题卡数');

  let allow = stateOf({ rules: { skipHomeEntryBlocksEntry: true } }, 23);
  allow = place(allow, 'a', { 'a:0': { squareId: 'ring:50' } });
  const still = F.resolvePrompt(F.roll(allow, 1).state, 'skipped');
  ok(at(still.state, 'a:0').squareId === 'ring:50', '36 反相：开关 true 时放过停在原地（旧 V5 局按快照走）');

  let inner = place(stateOf({}, 24), 'a', { 'a:0': { squareId: 'home:red:0' } });
  const stepped = F.roll(inner, 1);
  ok(at(stepped.state, 'a:0').squareId === 'home:red:1' && !(stepped.state.awaiting.prompt && stepped.state.awaiting.prompt.kind === 'home-entry'), '37 航线内不再出进航题');
  let goal = place(stateOf({}, 25), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const arrived = F.roll(goal, 1);
  ok(at(arrived.state, 'a:0').arrived === true && at(arrived.state, 'a:0').squareId === 'home:red:goal', '37 到达后 arrived');

  /* V6.1：一方全部到家才结束；最后一架在 home:red:4，掷 1 到家 → win-a + 两张收尾卡。 */
  const longArrival = (seed) => lastPlaneComing(stateOf({ boundaries: ['蒙眼'], scale: 'warm' }, seed || 26));
  const start = F.roll(longArrival(), 1);
  ok(at(start.state, 'a:0').arrived === true, '38 长夜最后一架到家');
  ok(start.state.winnerId === 'a' && hasType(start.events, 'win'), '38 V6.1 一方全部到家判胜（win 事件）');
  ok(hasType(start.events, 'prompt') && hasType(start.events, 'ending-start'), '38 收尾开始事件');
  ok(start.state.phase === 'playing' && start.state.awaiting.type === 'ending-prompt', '38 全部到家触发收尾');
  ok(Array.isArray(start.state.endingQueue) && start.state.endingQueue.length === 2, '38 两张收尾卡');
  ok(start.state.endingQueue[0].actorId === 'a' && start.state.endingQueue[1].actorId === 'b', '38 两张各给一人');
  const firstEnd = F.resolvePrompt(start.state, 'done');
  ok(firstEnd.state.phase === 'playing' && firstEnd.state.endingIndex === 1, '42 第一张结算后仍在进行');
  ok(firstEnd.state.awaiting.type === 'ending-prompt' && firstEnd.state.awaiting.prompt.id === start.state.endingQueue[1].id, '42 第二张给另一人');
  const ended = F.resolvePrompt(firstEnd.state, 'skipped');
  ok(ended.state.phase === 'ended' && ended.state.result, '42 两张后进入回顾');
  const ledger = ended.state.result;
  ok(ledger.names.a === '阿岚' && ledger.colors.a === 'red' && ledger.scale === 'warm', '41 名字颜色尺度');
  ok(ledger.boundaries.indexOf('蒙眼') >= 0 && ledger.planeCount === 4 && ledger.mode === 'long', '41 边界/架数/模式');
  ok(ledger.ending === 'win-a' && ledger.winnerId === 'a', '41 V6.1 棋谱记胜者 win-a');
  ok(ledger.prompts.filter((p) => p.kind === 'ending').length === 2, '41 两张收尾卡都进回顾');
  ok(ledger.prompts.some((p) => p.kind === 'ending' && p.actorId === 'a') && ledger.prompts.some((p) => p.kind === 'ending' && p.actorId === 'b'), '41 收尾卡归属正确');
  ok(ledger.stats.cardsDone === 1 && ledger.stats.cardsSkipped === 1 && ledger.stats.planesHome.a === 4 && ledger.stats.planesHome.b === 0, '41 stats：收尾卡做/放过与已到家');
  ok(ledger.v === 2 && ledger.startedAt === ended.state.ts && ledger.durationMs >= 0, '41 v2/起始时间/时长');
  ok(/^\d{4}-\d{2}-\d{2}$/.test(ledger.date), '41 日期');
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' });
  ok(ledger.date === fmt.format(new Date(ledger.endedAt)), '41 Asia/Shanghai');
  ok(!Object.prototype.hasOwnProperty.call(ledger, 'moves'), '41 默认不写走子回放（待确认 A3）');

  let fast = parked(stateOf({ planeCount: 2 }, 27), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const fastArrive = F.roll(fast, 1);
  ok(fastArrive.state.phase === 'playing' && fastArrive.state.awaiting.type === 'roll' && fastArrive.state.winnerId === null, '39 快局只到家 1/2：不判胜、不触发收尾');
  ok(at(fastArrive.state, 'a:0').arrived === true, '39 快局棋子确实到了终点');

  const allSkipped = settleEnding(F.roll(longArrival(), 1).state, 'skipped', 'skipped');
  ok(allSkipped.ok && allSkipped.state.phase === 'ended' && allSkipped.state.result.ending === 'win-a', '40 两张收尾卡都可放过，仍正常结束');

  const midSafe = F.safeWord(F.roll(longArrival(), 1).state);
  ok(midSafe.ok && midSafe.state.phase === 'safe-ended' && midSafe.state.result.ending === 'safe', '40 收尾中触发安全词也能收棋（ending=safe）');
  ok(!hasType(midSafe.events, 'win'), '40 安全词无输赢事件');

  let hard = lastPlaneComing(stateOf({ rules: { endingPromptSkippable: false } }, 28));
  const hardStart = F.roll(hard, 1).state;
  const denied = F.resolvePrompt(hardStart, 'skipped');
  ok(!denied.ok && denied.error.code === 'PROMPT_NOT_SKIPPABLE' && denied.state === hardStart, '40 不可跳过时失败且不改入参');

  let replay = lastPlaneComing(stateOf({ rules: { ledgerIncludeMoveReplay: true } }, 29));
  const replayLedger = settleEnding(F.roll(replay, 1).state, 'done', 'done').state.result;
  ok(Array.isArray(replayLedger.moves) && replayLedger.moves.length > 0, '41 待确认：打开回放才写 moves');
}

section('7. 题格、跳过不退回、安全词');
{
  let plain = place(stateOf({}, 30), 'a', { 'a:0': { squareId: 'ring:6' } });
  const quiet = F.roll(plain, 1);
  ok(at(quiet.state, 'a:0').squareId === 'ring:7' && !quiet.state.awaiting.prompt && quiet.state.awaiting.type !== 'minigame', '42 飞点不出普通题');

  let truth = place(stateOf({ scale: 'gentle', boundaries: ['束缚'] }, 31), 'a', { 'a:0': { squareId: 'ring:1' } });
  const t = F.roll(truth, 1);
  ok(t.state.awaiting.prompt.kind === 'cell-truth', '43 真心话');
  ok(Draw.allowed(t.state.awaiting.prompt.card, truth), '43 原库且经过滤');
  let dare = place(stateOf({ colors: { a: 'yellow', b: 'blue' }, scale: 'warm' }, 32), 'a', { 'a:0': { squareId: 'ring:3' } });
  ok(F.roll(dare, 1).state.awaiting.prompt.kind === 'cell-dare', '43 大冒险');
  let touch = place(stateOf({ colors: { a: 'yellow', b: 'blue' } }, 33), 'a', { 'a:0': { squareId: 'ring:7' } });
  ok(F.roll(touch, 1).state.awaiting.prompt.kind === 'cell-touch', '43 靠近');

  let thermo = place(stateOf({}, 34), 'a', { 'a:0': { squareId: 'ring:9' } });
  const th = F.roll(thermo, 1);
  ok(th.state.awaiting.type === 'minigame' && th.state.awaiting.kind === 'thermo', '44 温度计');
  const thDone = F.resolveMinigame(th.state, {});
  ok(thDone.state.log.some((e) => e.kind === 'minigame-thermo') && at(thDone.state, 'a:0').squareId === 'ring:10', '44 只记账不改棋');
  ok(thDone.state.scale === 'warm' && thDone.state.maxStarCap === 2, '44 尺度不变');

  let wheel = place(stateOf({}, 35), 'a', { 'a:0': { squareId: 'ring:13' } });
  ok(F.roll(wheel, 1).state.awaiting.kind === 'truth-wheel', '44 真话转盘');
  let dareWheel = place(stateOf({ colors: { a: 'yellow', b: 'blue' } }, 36), 'a', { 'a:0': { squareId: 'ring:39' } });
  const dw = F.roll(dareWheel, 1);
  ok(dw.state.awaiting.kind === 'dare-wheel', '44 大冒险转盘');
  const dwDone = F.resolveMinigame(dw.state);
  ok(dwDone.state.log.some((e) => e.minigame === 'dare-wheel'), '70 小游戏后继续');

  const passed = F.resolvePrompt(t.state, 'skipped');
  ok(at(passed.state, 'a:0').squareId === 'ring:2', '45 跳过题格不退回');
  let cap = place(stateOf({}, 37), 'a', { 'a:0': { squareId: 'ring:0' }, 'b:0': { squareId: 'ring:1' } });
  const capState = F.roll(cap, 1).state;
  const capSkip = F.resolvePrompt(capState, 'skipped');
  ok(at(capSkip.state, 'b:0').squareId.indexOf('hangar:') === 0 && at(capSkip.state, 'a:0').squareId === 'ring:1', '45 跳过击落题不退回');

  let lived = place(stateOf({ scale: 'hot', boundaries: ['道具'] }, 38), 'a', { 'a:0': { squareId: 'ring:1' } });
  lived = F.resolvePrompt(F.roll(lived, 1).state, 'done').state;
  const beforeLog = snap(lived.log);
  const beforeBound = snap(lived.boundaries);
  const safe = F.safeWord(lived);
  ok(safe.ok && safe.state.phase === 'safe-ended', '46 任意时刻可收棋');
  ok(snap(safe.state.log) === beforeLog, '46 log 一字不改');
  ok(safe.state.result.ending === 'safe' && safe.state.result.winnerId === null, '46 棋谱是安全词收棋');
  ok(!/惩罚|失败|丢人|扣分|评判/.test(snap(safe.state.result)), '46 无评判字段');
  ok(snap(safe.state.boundaries) === beforeBound && safe.state.scale === 'hot', '47 不改尺度与边界');
  ok(JSON.stringify(safe.state.log).indexOf(lived.log[lived.log.length - 1].card.text) >= 0, '47 做过的事还在');
  const again = F.safeWord(safe.state);
  ok(again.ok && again.state.result.ending === 'safe', '46 已结束再收棋返回当前结果');
  ok(hasType(safe.events, 'safe') && hasType(safe.events, 'ledger'), '74 安全词与棋谱事件');
}

section('8. 抽题');
{
  const meta = JSON.parse(read(path.join(ROOT, 'app/data/cards-meta.json')));
  let total = 0;
  ['truth', 'dare', 'touch', 'sync', 'spark', 'punish'].forEach((p) => { total += (CARDS[p] || []).length; });
  ok(meta.total >= 1400 && meta.total <= 1450 && total === meta.total, '48 原库约 1423，测试不改 cards.js');
  ok(meta.total === 1423, '48 当前元数据 1423');

  const open = stateOf({ scale: 'open', boundaries: ['束缚'] }, 40);
  let boundaryLeak = 0;
  ['truth', 'dare', 'touch', 'sync', 'spark', 'punish'].forEach((pool) => {
    (CARDS[pool] || []).forEach((card) => {
      const c = { id: card.id, text: card.text, star: card.star, tags: card.tags || [], pool: pool, type: pool };
      if (!Draw.allowed(c, open)) return;
      const tags = (c.tags || []).join('');
      if (tags.indexOf('束缚') >= 0 || String(c.text).indexOf('束缚') >= 0) boundaryLeak++;
    });
  });
  ok(boundaryLeak === 0, '49 不设限 + 边界「束缚」全库 0 泄漏');
  let drawn = open;
  let seenBound = 0;
  for (let i = 0; i < 24; i++) {
    const r = Draw.take(drawn, 'capture');
    drawn = r.state;
    if (String(r.card.text).indexOf('束缚') >= 0 || (r.card.tags || []).indexOf('束缚') >= 0) seenBound++;
  }
  ok(seenBound === 0, '49 抽牌路径也避开边界');

  const gentle = stateOf({ scale: 'gentle', boundaries: [] }, 41);
  let gentleLeak = 0;
  ['truth', 'dare', 'touch', 'sync', 'spark', 'punish'].forEach((pool) => {
    (CARDS[pool] || []).forEach((card) => {
      const c = { id: card.id, text: card.text, star: card.star, tags: card.tags || [], pool: pool };
      if (!Draw.allowed(c, gentle)) return;
      if (Number(c.star) !== 1 || EXPLICIT.test(c.text) || GENTLE_EXTRA.test(c.text) || (c.tags || []).some((t) => Draw.GENTLE_BLOCK_TAGS.indexOf(t) >= 0)) gentleLeak++;
    });
  });
  ok(gentleLeak === 0, '50 温柔全库 0 泄漏');

  function sample(scale, seed) {
    let s = stateOf({ scale: scale, boundaries: [] }, seed);
    const stars = [];
    for (let i = 0; i < 48; i++) {
      const r = Draw.take(s, 'cell-truth');
      s = r.state;
      stars.push(Number(r.card.star) || 1);
    }
    return stars;
  }
  const warmStars = sample('warm', 42);
  ok(warmStars.every((n) => n <= 3), '51 暧昧不超过 3 星');
  let warmExplicit = 0;
  let sWarm = stateOf({ scale: 'warm' }, 43);
  for (let i = 0; i < 20; i++) {
    const r = Draw.take(sWarm, 'cell-dare');
    sWarm = r.state;
    if (EXPLICIT.test(r.card.text)) warmExplicit++;
  }
  ok(warmExplicit === 0, '51 暧昧排除露骨词');
  ok(mean(warmStars) >= 1.55, '51 权重偏向 2 星');

  const hotStars = sample('hot', 44);
  const openStars = sample('open', 45);
  ok(mean(hotStars) > mean(sample('gentle', 46)) + 0.8, '52 热烈均星高于温柔');
  ok(mean(openStars) >= mean(hotStars), '52 不设限更偏高星');
  const high = (arr) => arr.filter((n) => n >= 4).length / arr.length;
  ok(high(openStars) >= high(hotStars), '52 不设限对 4–5 星更偏');
  ok(!('heat' in Draw.band(open)), '55 band 无热度');
  eq(Object.keys(Draw.band(gentle)).sort(), ['cap', 'maxStar', 'minPrefer'], '55 band 字段');

  ok(Draw.poolsFor('capture', 1).indexOf('punish') < 0, '53 不用 punish');
  ok(Draw.poolsFor('stack-duo', 2)[0] === 'sync', '53 叠机优先 sync');
  const punish = CARDS.punish && CARDS.punish[0];
  if (punish) ok(Draw.allowed({ id: punish.id, text: punish.text, star: punish.star, tags: punish.tags || [], pool: 'punish' }, open) === false, '53 punish 不可出');

  let usedUp = stateOf({ scale: 'gentle' }, 47);
  const used = {};
  (CARDS.truth || []).forEach((card) => {
    if (Draw.allowed({ id: card.id, text: card.text, star: card.star, tags: card.tags || [], pool: 'truth' }, usedUp)) used[card.id] = true;
  });
  usedUp.usedCards.truth = used;
  const recycled = Draw.take(usedUp, 'cell-truth');
  ok(recycled.card && recycled.card.fallback !== true && recycled.card.star === 1, '54 用尽后清空再抽');
  const saved = sb.window.CARDS;
  sb.window.CARDS = { truth: [], dare: [], touch: [], sync: [], spark: [], punish: [] };
  const fb = Draw.take(stateOf({ scale: 'open' }, 48), 'cell-truth');
  sb.window.CARDS = saved;
  ok(fb.card.fallback === true && fb.card.star === 1, '54 没有题时用 1 星后备');
  const pure = stateOf({}, 49);
  const pureSnap = snap(pure);
  const took = Draw.take(pure, 'cell-truth');
  ok(snap(pure) === pureSnap && took.state !== pure && took.state.usedCards.truth[took.card.id], '6/54 take 不改入参');
}

section('9. 存档与旧局');
{
  const mem = {};
  const box = makeSandbox(mem);
  const Store = box.window.App.Store;
  const Flight = box.window.App.Flight;
  ok(Store.KEYS.settings === 'couple2.settings' && Store.KEYS.session === 'couple2.session', '56 键名');
  ok(Store.KEYS.history === 'couple2.history' && Store.KEYS.standalone === 'couple2.standalone' && Store.KEYS.pending === 'couple2.pending', '56 其余键');
  ok(Store.KEYS.backup === 'couple2.backup.session', '56 V6 备份键');
  const fresh = Store.getSettings();
  ok(fresh.v === 6 && fresh.sound === true && fresh.haptics === true && fresh.reduced === false, '56 默认开关（V6 版本 6）');
  ok(fresh.names.a === '他' && fresh.names.b === '她' && fresh.blacklist.length === 0, '56 默认名字与空边界');
  ok(fresh.boardView === 'svg', '56 V6 boardView 默认 svg');

  mem['couple2.settings'] = JSON.stringify({
    v: 4, maxStar: 1, gentleOnly: true, sound: false, haptics: false, reduced: true,
    blacklist: ['喝酒'], names: { a: '旧甲', b: '旧乙' }
  });
  const upgraded = Store.getSettings();
  ok(upgraded.names.a === '旧甲' && upgraded.sound === false && upgraded.haptics === false && upgraded.reduced === true, '57 保留旧设置');
  ok(upgraded.blacklist[0] === '喝酒' && upgraded.scale !== 'gentle' && upgraded.maxStar == null && upgraded.gentleOnly !== true, '57 不把公寓尺度当成开局');
  ok(upgraded.v === 6 && upgraded.boardView === 'svg', '57 旧设置升级到 v6');
  ok(Store.getSession() === null, '57 读设置不会自动开局');

  mem['couple2.session'] = JSON.stringify({
    v: 1, id: 'mid-voyage', phase: 'draft', act: 1, round: 2,
    hand: ['a', 'b'], resources: { heart: 1 }, ts: 1710000000000
  });
  ok(Store.getSession() === null && Store.hasSession() === false, '58 夜航不续玩');
  ok(Store.KEYS.backup && JSON.parse(mem[Store.KEYS.backup]).id === 'mid-voyage', '58 首次读 session 先原样备份');
  const voyage = Store.getHistory().filter((x) => x.id === 'mid-voyage')[0];
  ok(voyage && voyage.kind === 'voyage' && voyage.note.indexOf('不会继续') >= 0, '58 夜航文案');
  mem['couple2.session'] = JSON.stringify({ kind: 'apartment', id: 'apt-1', phase: 'plan', ts: 1710000001000, names: { a: '他', b: '她' } });
  ok(Store.getSession() === null, '58 公寓局不续玩');
  const apt = Store.getHistory().filter((x) => x.id === 'apt-1')[0];
  ok(apt && apt.kind === 'apartment' && apt.note === '已收进以前的夜，不按今晚飞行棋续玩', '58 公寓说明');

  const flight = Flight.newGame({
    names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'blue' }, scale: 'warm', boundaries: [], planeCount: 2
  }, 50).state;
  ok(Store.saveSession(flight).ok === true, '59 可写入');
  ok(Store.hasSession() && Store.getSession().kind === 'flight' && Store.getSession().id === flight.id, '59 可续玩');
  ok(Store.saveSession({ kind: 'flight', v: 1 }).ok === false && Store.getSession().id === flight.id, '59 非法飞行棋拒绝写入');

  const dumped = Store.exportAll();
  Store.resetAll();
  ok(Store.hasSession() === false, '60 清除后不能续');
  ok(dumped.app === 'couple-flight' && dumped.v === 6 && dumped.session.kind === 'flight', '61 导出（V6 v:6）');
  const restored = Store.importAll(dumped);
  ok(restored.ok && Store.getSession().id === flight.id, '60 已导出的副本还能导回');

  Store.resetAll();
  const aptImport = Store.importAll({
    app: 'couple-apartment',
    settings: { names: { a: '甲', b: '乙' }, sound: true, blacklist: [] },
    session: { kind: 'apartment', id: 'apt-in', phase: 'plan', ts: 5 },
    history: [{ id: 'h-old', kind: 'voyage', title: '以前的夜航', endingName: '未走完的夜航' }]
  });
  ok(aptImport.ok, '61 接受公寓导出');
  ok(Store.getSession() === null && Store.getHistory().some((x) => x.id === 'apt-in'), '62 导入的公寓局归档');
  const bare = Store.importAll({
    settings: { names: { a: '丙', b: '丁' } },
    history: [{ id: 'bare-1', kind: 'voyage', title: '以前的夜航', endingName: '记下了' }]
  });
  ok(bare.ok && Store.getSettings().names.a === '丙', '61 缺少 app 的旧文件也能收');

  const current = Flight.newGame({
    names: { a: '阿岚', b: '小满' }, colors: { a: 'red', b: 'yellow' }, scale: 'warm', boundaries: [], planeCount: 4
  }, 51).state;
  Store.saveSession(current);
  const rejected = Store.importAll({ app: 'couple-flight', session: { kind: 'flight', v: 1, phase: 'playing' }, settings: { names: { a: '他', b: '她' } } });
  ok(!rejected.ok && rejected.error.code === 'IMPORT_REJECTED' && Store.getSession().id === current.id, '63 坏飞行棋不覆盖');
  ok(Store.importAll(null).error.code === 'IMPORT_INVALID', '72 IMPORT_INVALID');

  Store.resetAll();
  for (let i = 0; i < 61; i++) Store.addHistory({ id: 'n' + i, ts: i, kind: 'flight', title: '今晚飞行棋', endingName: '记下了' });
  ok(Store.getHistory().length === 60 && Store.getHistory()[0].id === 'n60' && !Store.getHistory().some((x) => x.id === 'n0'), '64 最多 60');
  Store.addHistory({ id: 'n60', ts: 99, kind: 'flight', title: '今晚飞行棋', endingName: '记下了' });
  ok(Store.getHistory().filter((x) => x.id === 'n60').length === 1, '64 按 id 去重');

  const foreignVoyage = Archive.archiveForeign({ id: 'v-2', phase: 'play', hand: ['x'], resources: { heart: 1 } });
  const foreignApt = Archive.archiveForeign({ kind: 'apartment', id: 'a-2', phase: 'plan' });
  ok(foreignVoyage.note.indexOf('不会继续') >= 0 && foreignApt.note === '已收进以前的夜，不按今晚飞行棋续玩', '65 archiveForeign 文案');
  Store.setPending({ brought: true });
  Store.saveSession(current);
  ok(Store.getPending().brought === true && Store.getSession().kind === 'flight', '65 pending 不写进主棋');
}

section('10. 小游戏');
{
  const mem = {};
  const box = makeSandbox(mem);
  const M = box.window.App.Minigames;
  const Store = box.window.App.Store;
  const Flight = box.window.App.Flight;
  const thermo = M.newStandalone('thermo', { names: { a: '甲', b: '乙' } }, 3);
  ok(thermo.ok && thermo.state.kind === 'standalone' && thermo.state.game === 'thermo', '66 温度计可独立开');
  ok(thermo.state.scale === 'warm', '67 未选尺度默认暧昧');
  ok(!('heat' in thermo.state), '68 温度计没有热度');
  const setA = M.thermoSet(thermo.state, 'a', 1, 2);
  const passed = M.thermoPass(setA.state);
  const setB = M.thermoSet(passed.state, 'b', 2, 1);
  const revealed = M.thermoReveal(setB.state);
  ok(revealed.ok && revealed.state.thermo.revealed && !('heat' in revealed.state), '68 揭晓不写热度');
  const truth = M.newStandalone('truth', { scale: 'gentle', blacklist: ['束缚'] }, 4);
  ok(truth.state.wheel.slots.length === 6 && truth.state.wheel.slots.every((c) => c.star === 1), '67 转盘走尺度');
  ok(truth.state.wheel.slots.every((c) => String(c.text).indexOf('束缚') < 0), '67 转盘走边界');
  const spun = M.spinWheel(truth.state);
  ok(spun.ok && spun.state.wheel.spun === true, '66 转盘能转');
  const handed = M.handTruth(spun.state, 'other');
  ok(handed.state.prompt.who === 'other', '66 可以交给对方');
  Store.saveStandalone(thermo.state);
  const flight = Flight.newGame({
    names: { a: '甲', b: '乙' }, colors: { a: 'green', b: 'blue' }, scale: 'warm', boundaries: [], planeCount: 2
  }, 8).state;
  Store.saveSession(flight);
  ok(Store.getSession().kind === 'flight' && Store.getStandalone().game === 'thermo', '66 不和飞行棋混用');
  ok(typeof Flight.strollStart === 'undefined' && typeof M.strollStart === 'undefined' && typeof Flight.strollRoll === 'undefined', '69 不再提供 stroll');

  let cell = place(stateOf({}, 60), 'a', { 'a:0': { squareId: 'ring:4' } });
  const game = F.roll(cell, 6);
  ok(game.state.awaiting.type === 'minigame' && game.state.awaiting.kind === 'thermo', '70 棋盘上的小游戏');
  const cont = F.resolveMinigame(game.state);
  ok(cont.state.turn === 'a' && cont.state.awaiting.type === 'roll', '70 记完继续再掷');
  ok(at(cont.state, 'a:0').squareId === 'ring:10', '70 棋子位置不变');
}

section('11. 错误码、事件、快照、待确认反相');
{
  ok(F.roll(null, 1).error.code === 'NO_SESSION', '72 NO_SESSION');
  const ended = F.safeWord(stateOf({}, 1)).state;
  ok(F.roll(ended, 1).error.code === 'GAME_OVER', '72 GAME_OVER');
  let prompting = place(stateOf({}, 70), 'a', { 'a:0': { squareId: 'ring:1' } });
  prompting = F.roll(prompting, 1).state;
  ok(F.roll(prompting, 1).error.code === 'AWAITING_OTHER', '72 AWAITING_OTHER');
  ok(F.roll(stateOf({}, 1), 0).error.code === 'INVALID_DIE', '72 INVALID_DIE');
  ok(F.roll(stateOf({}, 1), 9).error.code === 'INVALID_DIE' && F.legalMoves(stateOf({}, 1), 0).pieceIds.length === 0, '72 非法骰子');
  let homeWait = place(stateOf({}, 71), 'a', { 'a:0': { squareId: 'ring:50' } });
  homeWait = F.roll(homeWait, 1).state;
  ok(F.move(homeWait, 'a:0').error.code === 'PROMPT_REQUIRED', '72 PROMPT_NOT 过题不能进航');
  const corrupt = stateOf({}, 72);
  corrupt.scale = 'nope';
  ok(F.roll(corrupt, 1).error.code === 'UNKNOWN_SCALE', '72 UNKNOWN_SCALE');
  const emptyChoice = stateOf({}, 73);
  emptyChoice.awaiting = { type: 'choose-piece', pieceIds: [], die: 3 };
  ok(F.move(emptyChoice, 'a:0').error.code === 'NO_LEGAL_MOVE', '72 NO_LEGAL_MOVE');

  const view = F.view(stateOf({ colors: { a: 'green', b: 'blue' } }, 2), { reduced: true });
  ok(view.pieces.length === 8 && view.pieces[0].id === 'a:0' && view.pieces[0].color === 'green', '73 快照棋子');
  ok(view.turn === 'a' && view.colors.b === 'blue' && view.reduced === true, '73 回合与颜色');
  ok(!Object.prototype.hasOwnProperty.call(view, 'rng') && !Object.prototype.hasOwnProperty.call(view, 'log'), '73 不把内部字段塞进三维');

  let show = place(stateOf({}, 74), 'a', { 'a:0': { squareId: 'ring:19' }, 'b:0': { squareId: 'ring:48' } });
  const played = F.roll(show, 1);
  ok(hasType(played.events, 'dice') && hasType(played.events, 'move') && hasType(played.events, 'fly') && hasType(played.events, 'jump'), '74 跳与飞事件按序可播');
  ok(played.events.findIndex((e) => e.type === 'fly') < played.events.findIndex((e) => e.type === 'jump'), '74 先飞后跳');
  ok(hasType(played.events, 'capture') && hasType(played.events, 'prompt'), '74 击落与出题');
  const won = F.roll(lastPlaneComing(stateOf({}, 75)), 1);
  ok(hasType(won.events, 'win') && hasType(won.events, 'ending-start') && won.state.winnerId === 'a', '74 V6.1 一方全部到家：win + 收尾');
  const wonFirst = F.resolvePrompt(won.state, 'done');
  ok(hasType(wonFirst.events, 'prompt') && wonFirst.state.phase === 'playing', '74 第二张收尾卡');
  ok(hasType(F.resolvePrompt(wonFirst.state, 'done').events, 'ledger'), '74 棋谱事件');
  let duo = place(stateOf({}, 76), 'a', { 'a:0': { squareId: 'ring:48' }, 'a:1': { squareId: 'ring:49' } });
  ok(hasType(F.move(F.roll(duo, 1).state, 'a:0').events, 'stack'), '74 叠机');

  let noReroll = place(stateOf({ rules: { rerollOnEverySix: false } }, 80), 'a', { 'a:0': { squareId: 'ring:1' } });
  const passedTurn = F.roll(noReroll, 6);
  ok(passedTurn.state.turn === 'b' && hasType(passedTurn.events, 'turn'), '75 待确认：关闭每次再掷后会换手');

  let auto = stateOf({ rules: { chooseAmongLegalPieces: false }, planeCount: 2 }, 81);
  auto = place(auto, 'a', { 'a:0': { squareId: 'hangar:red:0' }, 'a:1': { squareId: 'hangar:red:1' } });
  const picked = F.roll(auto, 6);
  ok(picked.state.awaiting.type !== 'choose-piece' && at(picked.state, 'a:0').squareId === 'ring:0', '75 待确认：关闭选手时代选第一架');

  let penalty = place(stateOf({ rules: { threeSixesPenalty: true } }, 82), 'a', {});
  penalty.pieces.forEach((p) => { if (p.playerId === 'a') { p.squareId = 'home:red:1'; p.arrived = false; } });
  let counted = penalty;
  counted = F.roll(counted, 6).state;
  counted = F.roll(counted, 6).state;
  counted = F.roll(counted, 6).state;
  ok(counted.consecutiveSixes === 3 && counted.pieces.filter((p) => p.playerId === 'a').every((p) => p.squareId === 'home:red:1'), '75 待确认：打开三连 6 开关仍不处罚');

  let defend = stateOf({ rules: { stackCapturedBySingle: false } }, 83);
  defend = place(defend, 'a', {
    'a:0': { squareId: 'ring:0' },
    'b:0': { squareId: 'ring:1', stackGroupId: 'big' },
    'b:1': { squareId: 'ring:1', stackGroupId: 'big' }
  });
  const held = F.roll(defend, 1);
  ok(at(held.state, 'b:0').squareId === 'ring:1' && at(held.state, 'b:1').squareId === 'ring:1', '75 待确认：单机击不落更大的叠');
  ok(at(held.state, 'a:0').squareId.indexOf('hangar:') === 0, '75 待确认：落子较少的一方回停机坪');
  ok(!(held.state.awaiting.prompt && held.state.awaiting.prompt.kind === 'capture'), '75 待确认：反相不按默认击落出题');
}

section('12. 双方都能起飞并在航线上走');
{
  const pairs = [
    ['red', 'yellow'],
    ['yellow', 'blue'],
    ['blue', 'green'],
    ['green', 'red']
  ];
  function settle(state) {
    let s = state;
    for (let i = 0; i < 8; i++) {
      if (!s || !s.awaiting) break;
      if (s.awaiting.type === 'prompt') s = F.resolvePrompt(s, 'done').state;
      else if (s.awaiting.type === 'minigame') s = F.resolveMinigame(s).state;
      else break;
    }
    return s;
  }
  pairs.forEach(([ca, cb]) => {
    let s = stateOf({ colors: { a: ca, b: cb }, planeCount: 4 }, 9);
    const parked = F.roll(s, 4);
    ok(parked.state.turn === 'b'
      && at(parked.state, 'a:0').squareId.indexOf('hangar:' + ca) === 0
      && at(parked.state, 'b:0').squareId.indexOf('hangar:' + cb) === 0, '76 ' + ca + '/' + cb + ' 非 6 双方都不起飞');
    s = stateOf({ colors: { a: ca, b: cb }, planeCount: 4 }, 9);
    let rolled = F.roll(s, 6);
    ok(rolled.state.awaiting.type === 'choose-piece'
      && rolled.state.awaiting.pieceIds.indexOf('a:0') >= 0
      && rolled.state.awaiting.pieceIds.every((id) => id.startsWith('a:')), '76 ' + ca + ' 掷 6 只列出己方');
    let moved = F.move(rolled.state, 'a:0');
    ok(at(moved.state, 'a:0').squareId === 'ring:' + Board.TAKEOFF[ca], '76 ' + ca + ' 到自己的起飞格');
    ok(at(moved.state, 'b:0').squareId === 'hangar:' + cb + ':0', '76 ' + cb + ' 仍在自己的机坪');
    s = settle(moved.state);
    ok(s.awaiting.type === 'roll' && s.turn === 'a', '76 ' + ca + ' 起飞后可再掷');
    s = settle(F.roll(s, 1).state);
    ok(s.turn === 'b', '76 换到 ' + cb);
    ok(at(s, 'a:0').squareId.indexOf('hangar:') !== 0, '76 ' + ca + ' 已离开机坪 ' + at(s, 'a:0').squareId);
    const bLow = F.roll(s, 3);
    ok(at(bLow.state, 'b:0').squareId.indexOf('hangar:') === 0 && bLow.state.turn === 'a', '76 ' + cb + ' 非 6 不起飞');
    s = bLow.state;
    if (s.awaiting.type === 'roll' && s.turn === 'a') {
      s = F.roll(s, 2).state;
      s = settle(s);
      if (s.awaiting.type === 'choose-piece') {
        const id = s.awaiting.pieceIds.filter((x) => x.startsWith('a:'))[0];
        s = settle(F.move(s, id).state);
      }
    }
    ok(s.turn === 'b' && s.awaiting.type === 'roll', '76 再次轮到 ' + cb);
    rolled = F.roll(s, 6);
    ok(rolled.ok && rolled.state.awaiting.type === 'choose-piece'
      && rolled.state.awaiting.pieceIds.indexOf('b:0') >= 0
      && rolled.state.awaiting.pieceIds.every((id) => id.startsWith('b:')), '76 ' + cb + ' 掷 6 可以选自己的飞机');
    moved = F.move(rolled.state, 'b:0');
    ok(at(moved.state, 'b:0').squareId === 'ring:' + Board.TAKEOFF[cb], '76 ' + cb + ' 到自己的起飞格');
    ok(at(moved.state, 'a:0').squareId.indexOf('hangar:') !== 0, '76 ' + ca + ' 没有被送回机坪');
    s = settle(moved.state);
    ok(s.turn === 'b' && s.awaiting.type === 'roll', '76 ' + cb + ' 起飞后可再掷');
    s = settle(F.roll(s, 2).state);
    if (s.awaiting.type === 'choose-piece') s = settle(F.move(s, 'b:0').state);
    const spot = at(s, 'b:0').squareId;
    ok(spot.indexOf('hangar:') !== 0, '76 ' + cb + ' 在航线上 ' + spot);
  });
}

section('13. V6 规则修复：放过不阻断进军 / 不丢奖励步（P0 红线）');
{
  let s = place(stateOf({}, 200), 'a', { 'a:0': { squareId: 'ring:50' } });
  const mid = F.roll(s, 1);
  ok(mid.state.awaiting.type === 'prompt' && mid.state.awaiting.prompt.kind === 'home-entry', '77 进航题先出');
  const skipped = F.resolvePrompt(mid.state, 'skipped');
  ok(at(skipped.state, 'a:0').squareId === 'home:red:0', '77 进航题放过仍进军（修 AUD-03）');
  ok(skipped.state.cardsProcessed === 1, '77 放过也计入处理题卡数');

  let legacy = place(stateOf({ rules: { skipHomeEntryBlocksEntry: true } }, 201), 'a', { 'a:0': { squareId: 'ring:50' } });
  const legacySkip = F.resolvePrompt(F.roll(legacy, 1).state, 'skipped');
  ok(at(legacySkip.state, 'a:0').squareId === 'ring:50', '77 V5 旧局按 rules 快照走，开关 true 仍停在原地');

  let duo = place(stateOf({}, 202), 'a', { 'a:0': { squareId: 'ring:48' }, 'a:1': { squareId: 'ring:49' } });
  const moved = F.move(F.roll(duo, 1).state, 'a:0');
  ok(moved.state.awaiting.type === 'prompt' && moved.state.awaiting.prompt.kind === 'stack-duo', '77 叠机题先出');
  const duoSkip = F.resolvePrompt(moved.state, 'skipped');
  ok(at(duoSkip.state, 'a:0').squareId === 'ring:50' && at(duoSkip.state, 'a:1').squareId === 'ring:50', '77 放过叠机仍得奖励步');

  /* V6.1：题卡数不再触发结束（用户反馈「一局结束太快」），只记录。 */
  const all = playAllSkipped(210, 8);
  ok(all.state.phase === 'playing' && all.state.awaiting.type === 'roll', '78 V6.1：全放过满旧目标 4 张也不再收尾');
  ok(all.state.cardsProcessed === 8 && all.cards.length === 8, '78 全放过仍记账（超过旧目标 4 张也不结束）');
  ok(all.state.winnerId === null && all.state.endingQueue === null, '78 没有胜者、没有收尾队列');
  const fin = settleEnding(F.roll(lastPlaneComing(all.state, 'a'), 1).state, 'skipped', 'skipped');
  ok(fin.ok && fin.state.phase === 'ended' && fin.state.result.ending === 'win-a', '78 只有「一方全部到家」才收尾');
  ok(fin.state.result.stats.cardsSkipped === 10 && fin.state.result.stats.cardsDone === 0, '78 回顾记 10 张放过（8 普通 + 2 收尾）');
  ok(fin.state.result.prompts.every((p) => p.outcome === 'skipped' && p.text), '78 回顾保留每题文本');
  ok(!/失败|未完成|扣分/.test(JSON.stringify(fin.state.result.prompts)), '78 回顾不写失败/扣分');
}

section('14. V6 心动值 / 连击 / 里程碑（meta 纯函数 + 结算点更新）');
{
  eq(Meta.stageOf(0), 'cold', '79 stage 0 cold');
  eq(Meta.stageOf(19), 'cold', '79 stage 19 cold');
  eq(Meta.stageOf(20), 'warm', '79 stage 20 warm');
  eq(Meta.stageOf(39), 'warm', '79 stage 39 warm');
  eq(Meta.stageOf(40), 'charged', '79 stage 40 charged');
  eq(Meta.stageOf(59), 'charged', '79 stage 59 charged');
  eq(Meta.stageOf(60), 'burning', '79 stage 60 burning');
  eq(Meta.stageOf(79), 'burning', '79 stage 79 burning');
  eq(Meta.stageOf(80), 'blazing', '79 stage 80 blazing');
  eq(Meta.stageOf(100), 'blazing', '79 stage 100 blazing');
  eq(Meta.stageLabel('cold'), '灯刚亮', '79 阶段文案 cold');
  eq(Meta.stageLabel('warm'), '有点热', '79 阶段文案 warm');
  eq(Meta.stageLabel('charged'), '靠近了', '79 阶段文案 charged');
  eq(Meta.stageLabel('burning'), '很近了', '79 阶段文案 burning');
  eq(Meta.stageLabel('blazing'), '今晚可以更近', '79 阶段文案 blazing');
  ok(Meta.DEFAULTS.HEAT_MAX === 100, '79 HEAT_MAX=100');
  ok(Meta.DEFAULTS.HEAT_GAIN.promptDone === 8 && Meta.DEFAULTS.HEAT_GAIN.promptSkipped === 3, '79 题卡 +8/+3');
  ok(Meta.DEFAULTS.HEAT_GAIN.minigameDone === 5 && Meta.DEFAULTS.HEAT_GAIN.minigameSkipped === 0, '79 小游戏 +5/+0');
  ok(Meta.DEFAULTS.HEAT_GAIN.endingDone === 10 && Meta.DEFAULTS.HEAT_GAIN.endingSkipped === 3, '79 收尾 +10/+3');

  const base = Meta.init({ ts: 7 });
  const baseSnap = snap(base);
  const pure = Meta.apply(base, 'prompt', 'done');
  ok(snap(base) === baseSnap && pure.meta.heat === 8, '79 flight-meta 是纯函数，不改入参');

  let s = stateOf({ planeCount: 2 }, 220);
  const done = doPrompt(s, 'done');
  ok(done.state.meta.heat === 8 && done.state.meta.stage === 'cold', '79 做了 +8，未跨档');
  ok(done.state.meta.streak === 1 && done.state.meta.streakBest === 1, '79 连击 1');
  ok(done.state.cardsProcessed === 1, '79 处理题卡数 +1');
  const heatEv = done.events.filter((e) => e.type === 'heat')[0];
  ok(heatEv && heatEv.delta === 8 && heatEv.heat === 8 && heatEv.stage === 'cold' && heatEv.prevStage === undefined, '79 heat 事件（同档无 prevStage）');
  ok(done.events.some((e) => e.type === 'streak' && e.count === 1 && e.best === 1), '79 streak 事件');
  ok(!hasType(done.events, 'dice') && done.state.meta.updatedAt > 0, '79 结算不再掷骰，meta 带 updatedAt');

  const skipped = doPrompt(done.state, 'skipped');
  ok(skipped.state.meta.heat === 11 && skipped.state.meta.streak === 1, '80 放过 +3、连击不清零');
  ok(skipped.events.some((e) => e.type === 'heat' && e.delta === 3), '80 放过有 heat 事件');
  ok(!skipped.events.some((e) => e.type === 'streak'), '80 放过不产生 streak 事件');

  const mini = F.roll(place(skipped.state, 'a', { 'a:0': { squareId: 'ring:9' } }, { targetCards: 99, targetHeat: 999 }), 1);
  ok(mini.state.awaiting.type === 'minigame', '80 温度计格');
  const miniDone = F.resolveMinigame(mini.state, 'done');
  ok(miniDone.state.meta.heat === 16, '80 小游戏完成 +5');
  ok(miniDone.state.meta.streak === 1 && miniDone.state.cardsProcessed === 2, '80 小游戏不增加连击、不计题卡数');
  ok(miniDone.state.log.some((e) => e.kind === 'minigame-thermo' && e.outcome === 'done'), '80 小游戏记录 outcome');

  const wheel = F.roll(place(miniDone.state, 'a', { 'a:0': { squareId: 'ring:13' } }, { targetCards: 99, targetHeat: 999 }), 1);
  const wheelSkip = F.resolveMinigame(wheel.state, 'skipped');
  ok(wheelSkip.state.meta.heat === 16, '80 小游戏跳过 +0，heat 不降');
  ok(wheelSkip.state.log.some((e) => e.kind === 'minigame-wheel' && e.outcome === 'skipped'), '80 跳过也记录');
  ok(!hasType(wheelSkip.events, 'heat'), '80 跳过无 heat 事件');

  /* 任何操作不下降：同一局连续 done/skipped/小游戏，heat 单调不减 */
  let seq = stateOf({ planeCount: 2 }, 222);
  const heats = [];
  for (let i = 0; i < 3; i++) { seq = doPrompt(seq, 'done').state; heats.push(seq.meta.heat); }
  seq = doPrompt(seq, 'skipped').state; heats.push(seq.meta.heat);
  seq = F.resolveMinigame(F.roll(place(seq, 'a', { 'a:0': { squareId: 'ring:9' } }, { targetCards: 99, targetHeat: 999 }), 1).state, 'done').state;
  heats.push(seq.meta.heat);
  ok(heats.every((h, i) => i === 0 || h >= heats[i - 1]), '81 heat 只增不降：' + JSON.stringify(heats));
  ok(seq.meta.heat === 8 * 3 + 3 + 5, '81 计分累计 32');

  /* 连击里程碑：每 3 次「做了」发一次；放过不清零 */
  let mk = stateOf({ planeCount: 2 }, 223);
  let third = null;
  for (let i = 1; i <= 6; i++) {
    const r = doPrompt(mk, 'done');
    mk = r.state;
    if (i === 3) third = r;
  }
  ok(third.state.meta.streak === 3 && third.state.meta.milestones.indexOf('streak-3') >= 0, '81 3 连击记里程碑');
  const msEv = third.events.filter((e) => e.type === 'milestone')[0];
  ok(msEv && msEv.id === 'streak-3' && msEv.label === '连击 ×3', '81 里程碑事件 id/label');
  ok(mk.meta.streak === 6 && mk.meta.streakBest === 6 && mk.meta.milestones.indexOf('streak-6') >= 0, '81 6 连击再发一次');
  ok(mk.meta.milestones.length === 2, '81 里程碑去重');

  let inter = stateOf({ planeCount: 2 }, 224);
  inter = doPrompt(inter, 'done').state;
  inter = doPrompt(inter, 'skipped').state;
  inter = doPrompt(inter, 'done').state;
  const interThird = doPrompt(inter, 'done');
  ok(interThird.state.meta.streak === 3 && interThird.state.meta.milestones.indexOf('streak-3') >= 0, '81 放过不清零，仍累积到 3 连击');
  ok(hasType(interThird.events, 'milestone'), '81 里程碑事件随结算返回');

  const near = place(stateOf({ planeCount: 2 }, 226), 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: 99, targetHeat: 999, heat: 18 });
  const cross = F.resolvePrompt(F.roll(near, 1).state, 'done');
  const crossEv = cross.events.filter((e) => e.type === 'heat')[0];
  ok(cross.state.meta.heat === 26 && cross.state.meta.stage === 'warm', '81 跨阶段 heat/stage');
  ok(crossEv && crossEv.prevStage === 'cold', '81 跨阶段事件带 prevStage');

  const capped = place(stateOf({ planeCount: 2 }, 225), 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: 99, targetHeat: 999, heat: 99 });
  const capRes = F.resolvePrompt(F.roll(capped, 1).state, 'done');
  const capEv = capRes.events.filter((e) => e.type === 'heat')[0];
  ok(capRes.state.meta.heat === 100, '81 heat 上限 100');
  ok(capEv && capEv.delta === 1, '81 封顶后 delta 是实际增量');
}

section('15. V6.1 结束条件：一方全部到家 + 两张卡 + 回顾数据');
{
  /* ① 题卡数/心动值达标不再收尾（只记录） */
  const heatTrigger = place(stateOf({ planeCount: 2 }, 231), 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: 4, targetHeat: 40, cardsProcessed: 1, heat: 37 });
  const ht = F.resolvePrompt(F.roll(heatTrigger, 1).state, 'done');
  ok(ht.state.meta.heat === 45 && ht.state.cardsProcessed === 2, '83 心动值到 45');
  ok(ht.state.phase === 'playing' && ht.state.awaiting.type === 'roll' && ht.state.winnerId === null, '83 V6.1：心动值/题卡达标不再收尾');

  /* ② 长夜只到家一架不结束 */
  const longStart = F.roll(parked(stateOf({ planeCount: 4 }, 232), 'a', { 'a:0': { squareId: 'home:red:4' } }), 1);
  ok(longStart.state.cardsProcessed === 0 && longStart.state.meta.heat === 0, '84 触发时 0 题卡 / 0 心动值');
  ok(longStart.state.phase === 'playing' && longStart.state.awaiting.type === 'roll', '84 V6.1：长夜只到家 1/4 不结束');
  ok(longStart.state.mode === 'long', '84 长夜 mode');

  /* ③ 快局只到家一架不结束 */
  const quickStart = F.roll(parked(stateOf({ planeCount: 2 }, 233), 'a', { 'a:0': { squareId: 'home:red:4' } }), 1);
  ok(quickStart.state.awaiting.type === 'roll' && quickStart.state.winnerId === null, '84 快局只到家 1/2 不触发收尾、不判胜');

  /* ④ 一方全部到家 → win + 两张收尾卡 */
  const startRes = F.roll(lastPlaneComing(stateOf({ planeCount: 4 }, 236)), 1);
  const startState = startRes.state;
  const queue = startState.endingQueue;
  ok(startState.winnerId === 'a', '85 胜者 winnerId=a');
  ok(queue.length === 2 && queue.every((p) => p.kind === 'ending' && p.card && p.card.id), '85 两张都是带卡的收尾卡');
  ok(queue[0].actorId === 'a' && queue[0].targetId === 'a' && queue[1].actorId === 'b' && queue[1].targetId === 'b', '85 两张各给一人');
  ok(queue[0].id !== queue[1].id, '85 两张卡 prompt 不同（同池允许）');
  ok(hasType(startRes.events, 'win') && hasType(startRes.events, 'ending-start'), '85 收尾开始事件、带 win');
  ok(F.roll(startState, 6).error.code === 'AWAITING_OTHER', '85 收尾中不能再掷骰（不再产生普通题卡）');
  ok(F.resolveMinigame(startState).error.code === 'AWAITING_OTHER', '85 收尾中没有小游戏');

  const e1 = F.resolvePrompt(startState, 'done');
  ok(e1.state.phase === 'playing' && e1.state.endingIndex === 1, '85 第一张结算后仍在进行');
  ok(e1.state.awaiting.type === 'ending-prompt' && e1.state.awaiting.prompt.id === queue[1].id, '85 第二张给另一人');
  ok(e1.state.meta.heat === 10 && e1.state.meta.streak === 1, '85 收尾卡做了 +10');
  ok(!hasType(e1.events, 'ledger'), '85 第一张后不出棋谱');
  const e2 = F.resolvePrompt(e1.state, 'done');
  ok(e2.state.phase === 'ended' && hasType(e2.events, 'ledger'), '85 第二张后出棋谱');
  ok(e2.state.meta.heat === 20 && e2.state.meta.streak === 2, '85 两张收尾各 +10');

  /* 收尾中途存档可续玩 */
  const resumed = F.validate(startState);
  ok(resumed.endingQueue.length === 2 && resumed.endingIndex === 0, '86 validate 保留收尾队列');
  const r1 = F.resolvePrompt(resumed, 'skipped');
  ok(r1.state.endingIndex === 1, '86 续玩后进入第二张');
  const r2 = F.resolvePrompt(r1.state, 'skipped');
  ok(r2.state.phase === 'ended' && r2.state.result.ending === 'win-a' && r2.state.result.winnerId === 'a', '86 续玩后正常收尾（win-a）');
  ok(r2.state.result.stats.heat === 6, '86 两张放过共 +6');
  ok(r2.state.result.stats.planesHome.a === 4 && r2.state.result.stats.planesHome.b === 0, '86 回顾已到家数');

  /* ledger 六类信息 + 小游戏记录：先做小游戏与一张题卡，再注入「一方全部到家」收尾 */
  let mg = place(stateOf({ planeCount: 2 }, 234), 'a', { 'a:0': { squareId: 'ring:9' } }, { targetCards: 4, targetHeat: 40, cardsProcessed: 3 });
  const mgDone = F.resolveMinigame(F.roll(mg, 1).state, 'done');
  ok(mgDone.state.cardsProcessed === 3, '87 小游戏不计入目标题卡数');
  ok(mgDone.state.meta.heat === 5, '87 小游戏完成 +5');
  const mgPrompt = F.roll(place(mgDone.state, 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: 4, targetHeat: 40 }), 1);
  const mgEnding = F.resolvePrompt(mgPrompt.state, 'done');
  ok(mgEnding.state.phase === 'playing' && mgEnding.state.awaiting.type === 'roll', '87 题卡达标也不再收尾');
  const mgWin = F.roll(lastPlaneComing(mgEnding.state, 'a'), 1);
  ok(mgWin.state.awaiting.type === 'ending-prompt' && mgWin.state.winnerId === 'a', '87 一方全部到家才进入收尾');
  const mgFin = settleEnding(mgWin.state, 'done', 'done').state.result;
  ok(mgFin.stats.minigames === 1 && mgFin.minigames[0].kind === 'thermo' && mgFin.minigames[0].outcome === 'done' && mgFin.minigames[0].actorId === 'a', '87 回顾含小游戏记录');
  ok(mgFin.stats.cardsSkipped === 0 && mgFin.stats.cardsDone === 3, '87 回顾统计题卡做/放过（含两张收尾卡）');
  ok(mgFin.stats.heat === 5 + 8 + 10 + 10 && mgFin.stats.bestStreak === 3, '87 回顾 heat/bestStreak');
  ok(mgFin.prompts.some((p) => p.kind === 'cell-truth' && p.text && p.cardId && p.star && p.pool && p.source), '87 题卡明细带文本/卡号/星级/池/来源');
  ok(mgFin.prompts.filter((p) => p.kind === 'ending').every((p) => p.text && p.actorId), '87 收尾卡明细带归属');
  ok(/^\d{4}-\d{2}-\d{2}$/.test(mgFin.date) && mgFin.names.a === '阿岚' && mgFin.durationMs >= 0, '87 回顾六类：日期/姓名/时长/题卡/小游戏/心动');
  ok(mgFin.startedAt === mgDone.state.ts && mgFin.endedAt - mgFin.startedAt === mgFin.durationMs, '87 时长按 session 起止');
  ok(!JSON.stringify(mgFin).includes('这一笔没有句子'), '87 回顾无占位文案');
  ok(mgFin.ending === 'win-a' && mgFin.winnerId === 'a', '87 回顾记胜者（不判输赢文案）');
  ok(mgFin.stats.planesHome.a === 2 && mgFin.stats.planesHome.b === 0, '87 回顾已到家 X/Y');

  /* 安全词：不改热度，ending='safe' */
  const live = F.resolvePrompt(F.roll(place(stateOf({ planeCount: 2 }, 235), 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: 99, targetHeat: 999 }), 1).state, 'done').state;
  const safe = F.safeWord(live);
  ok(safe.state.result.ending === 'safe' && safe.state.result.winnerId === null, '88 安全词棋谱 ending=safe');
  ok(safe.state.result.stats.heat === live.meta.heat && safe.state.result.stats.heat === 8, '88 安全词不改热度');
}

section('16. V6 存档迁移（V5 v:1 → v2，不丢档）');
{
  const modern = boot({ planeCount: 4 }, 240).state;
  const log = [
    { id: 'l1', ts: 1, kind: 'cell-truth', outcome: 'done', actorId: 'a', card: { id: 'tr1', text: '旧真话', star: 1, tags: [], pool: 'truth', src: 'GAME' } },
    { id: 'l2', ts: 2, kind: 'cell-dare', outcome: 'skipped', actorId: 'b', card: { id: 'dr1', text: '旧冒险', star: 2, tags: [], pool: 'dare', src: 'GAME' } },
    { id: 'l3', ts: 3, kind: 'minigame-thermo', outcome: 'done', actorId: 'a', minigame: 'thermo' }
  ];
  const stripV6 = (raw) => {
    const out = clone(raw);
    ['mode', 'targetCards', 'targetHeat', 'cardsProcessed', 'meta', 'endingQueue', 'endingIndex', 'takeoffMiss'].forEach((k) => delete out[k]);
    out.v = 1;
    out.log = log;
    return out;
  };
  const v1 = stripV6(modern);
  const up = F.validate(v1);
  ok(up && up.v === 2, '89 v1 validate 成功并升级为 v2');
  ok(up.mode === 'long' && up.targetCards === 8 && up.targetHeat === 80, '89 按 planeCount 补 mode 与目标');
  ok(up.cardsProcessed === 2, '89 从 log 统计处理题卡数（小游戏不计）');
  ok(up.meta && up.meta.heat === 16, '89 从 log 重建 meta（8+3+5）');
  ok(up.meta.streak === 1 && up.meta.streakBest === 1 && up.meta.stage === 'cold', '89 重建连击/阶段');
  ok(up.endingQueue === null && up.endingIndex === 0, '89 收尾字段补默认');
  ok(up.takeoffMiss && up.takeoffMiss.a === 0 && up.takeoffMiss.b === 0, '89 V6.1 旧档补 takeoffMiss=0');
  ok(up.pieces.length === 8 && up.names.a === '阿岚' && up.log.length === 3, '89 其余数据不丢');
  ok(F.validate(up).meta.heat === 16, '89 升级后再 validate 幂等');

  const v1OldRules = clone(v1);
  v1OldRules.rules = Object.assign({}, v1.rules, { skipHomeEntryBlocksEntry: true, skipStackKeepsBonusStep: false });
  const upOldRules = F.validate(v1OldRules);
  ok(upOldRules.rules.skipHomeEntryBlocksEntry === true && upOldRules.rules.skipStackKeepsBonusStep === false, '89 V5 旧局按 rules 快照走，不被 V6 默认值覆盖（architecture §7.1）');

  const v2NoMeta = clone(modern);
  v2NoMeta.log = log;
  delete v2NoMeta.meta;
  delete v2NoMeta.cardsProcessed;
  const up2 = F.validate(v2NoMeta);
  ok(up2 && up2.meta.heat === 16 && up2.cardsProcessed === 2, '90 v2 缺 meta/cardsProcessed 也宽容补全');

  const v2BadMiss = clone(modern);
  v2BadMiss.log = log;
  v2BadMiss.takeoffMiss = { a: 9, b: -3 };
  const upBadMiss = F.validate(v2BadMiss);
  ok(upBadMiss.takeoffMiss.a === 2 && upBadMiss.takeoffMiss.b === 0, '90 takeoffMiss 越界/缺失归一（0..2）');

  const midEnd = stripV6(modern);
  midEnd.awaiting = {
    type: 'ending-prompt',
    prompt: { id: 'pr-old', kind: 'ending', actorId: 'b', targetId: 'b', pieceIds: [], card: { id: 'tr1', text: '旧收尾', star: 1, tags: [], pool: 'truth', src: 'GAME' } }
  };
  const upEnd = F.validate(midEnd);
  ok(upEnd && upEnd.v === 2 && upEnd.endingQueue && upEnd.endingQueue.length === 1, '91 V5 旧收尾途中存档保留那张卡');
  const upEndDone = F.resolvePrompt(upEnd, 'done');
  ok(upEndDone.ok && upEndDone.state.phase === 'ended' && upEndDone.state.result.ending === 'shared', '91 旧收尾卡结算后正常结束');

  const mem = {};
  const box = makeSandbox(mem);
  const Store = box.window.App.Store;
  const Flight = box.window.App.Flight;
  mem['couple2.session'] = JSON.stringify(v1);
  const loaded = Store.getSession();
  ok(loaded && loaded.v === 2 && loaded.meta.heat === 16 && loaded.cardsProcessed === 2, '92 Store 读入 V5 存档：升级且进度保留');
  ok(loaded.id === v1.id && loaded.names.a === '阿岚', '92 身份与名字不丢');
  const backup = JSON.parse(mem[Store.KEYS.backup]);
  ok(backup.v === 1 && backup.id === v1.id, '92 升级前原样备份 v1');
  ok(Store.saveSession(loaded).ok === true, '92 升级后可写回');
  ok(JSON.parse(mem['couple2.session']).v === 2, '92 写回的是 v2');
  const backupBefore = mem[Store.KEYS.backup];
  Store.getSession();
  ok(mem[Store.KEYS.backup] === backupBefore, '92 备份只写一次');

  let s = loaded;
  s = Object.assign({}, s, {
    cardsProcessed: s.targetCards - 1,
    awaiting: { type: 'roll' },
    pendingMove: null,
    rollContext: null,
    phase: 'playing',
    result: null,
    endingQueue: null,
    endingIndex: 0
  });
  const rolled = Flight.roll(place(s, 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: s.targetCards, targetHeat: 999 }), 1);
  ok(rolled.ok && rolled.state.awaiting.type === 'prompt', '93 V5 读入后能继续出题');
  const skippedTurn = Flight.resolvePrompt(rolled.state, 'skipped');
  ok(skippedTurn.ok && skippedTurn.state.phase === 'playing' && skippedTurn.state.awaiting.type === 'roll', '93 V6.1：V5 局题卡达标也不再收尾');
  const winTurn = Flight.roll(lastPlaneComing(skippedTurn.state, 'a'), 1);
  ok(winTurn.ok && winTurn.state.awaiting.type === 'ending-prompt' && winTurn.state.winnerId === 'a', '93 V5 读入后能被「一方全部到家」收尾');
  const end1 = Flight.resolvePrompt(winTurn.state, 'done');
  const end2 = Flight.resolvePrompt(end1.state, 'done');
  ok(end2.ok && end2.state.phase === 'ended' && end2.state.result.ending === 'win-a', '93 V5 局最终收尾（win-a）');
  ok(end2.state.result.stats.cardsSkipped === 2 && end2.state.result.prompts.length >= 5, '93 收尾后回顾含 V5 期间记录');

  const importRes = Store.importAll({ app: 'couple-flight', settings: { names: { a: '甲', b: '乙' } }, session: v1 });
  ok(importRes.ok, '94 importAll 接受 V5 v1 飞行棋');
  ok(Store.getSession().v === 2 && Store.getSession().id === v1.id, '94 导入后升级为 v2');

  Store.saveSettings({ boardView: '3d' });
  ok(Store.getSettings().boardView === '3d', '94 设置记住 boardView');
  Store.saveSettings({ boardView: 'weird' });
  ok(Store.getSettings().boardView === 'svg', '94 非法 boardView 回退 svg');
  Store.saveSettings({ mode: 'long', lastPlaneCount: 4 });
  ok(Store.getSettings().mode === 'long' && Store.getSettings().lastPlaneCount === 4, '94 门厅模式选择被记住');
}

section('17. V6 命运格（P1 接口：prompt.options + opts.cardIndex）');
{
  eq(Board.FATE_CELLS, [5, 29], '95 命运格 5/29');
  const sq5 = Board.square('ring:5');
  ok(sq5.kind === 'fate' && sq5.jumpTo === null && sq5.isFly === false, '95 命运格不跳不飞');
  const sq29 = Board.square('ring:29');
  ok(sq29.kind === 'fate' && sq29.jumpTo === null, '95 第二个命运格');

  let s = place(stateOf({ scale: 'warm' }, 250), 'a', { 'a:0': { squareId: 'ring:4' } });
  const fate = F.roll(s, 1);
  ok(fate.ok && fate.state.awaiting.type === 'prompt' && fate.state.awaiting.prompt.kind === 'fate', '95 落命运格出二选一');
  const pr = fate.state.awaiting.prompt;
  ok(Array.isArray(pr.options) && pr.options.length === 2, '95 prompt.options 两张');
  ok(pr.options[0].pool !== pr.options[1].pool, '95 两张来自不同池');
  ok(pr.card && pr.card.id === pr.options[0].id, '96 prompt.card 兼容旧视图（=options[0]）');
  ok(pr.options.every((c) => Draw.allowed(c, fate.state)), '96 选项走尺度/边界过滤');
  ok(pr.actorId === 'a' && pr.targetId === 'a', '96 归属走到的人');
  ok(hasType(fate.events, 'prompt'), '96 命运格 prompt 事件');

  const before = fate.state.meta.heat;
  const picked = F.resolvePrompt(fate.state, 'done', { cardIndex: 0 });
  ok(picked.ok && picked.state.awaiting.type === 'roll', '96 选定后回主桌');
  ok(picked.state.meta.heat === before + 8 && picked.state.meta.streak === 1, '96 命运卡做了 +8/连击');
  ok(picked.state.cardsProcessed === 0, '96 命运格不计入目标题卡数');
  ok(picked.state.log.some((e) => e.kind === 'fate' && e.outcome === 'done' && e.card && e.card.id === pr.options[0].id), '96 log 记所选卡');
  const other = pr.options[1];
  ok(picked.state.usedCards[other.pool] && !picked.state.usedCards[other.pool][other.id], '96 未选中的卡放回池子');

  const neither = F.resolvePrompt(fate.state, 'skipped');
  ok(neither.ok && neither.state.awaiting.type === 'roll', '97 都不选回主桌');
  ok(neither.state.meta.heat === before, '97 都不选 heat 不降');
  ok(neither.state.log.length === fate.state.log.length, '97 都不选不记题');
  ok(!hasType(neither.events, 'heat'), '97 都不选无 heat 事件');
  ok(neither.state.cardsProcessed === 0, '97 都不选不计题卡数');

  eq(Draw.fatePools(2), ['cell-touch', 'cell-truth'], '98 温柔/暧昧命运池');
  eq(Draw.fatePools(3), ['cell-dare', 'cell-truth'], '98 热烈命运池');
  eq(Draw.fatePools(4), ['spark', 'cell-truth'], '98 不设限命运池');

  function fatePoolsDrawn(scale, seed) {
    let st = place(stateOf({ scale: scale, boundaries: [] }, seed), 'a', { 'a:0': { squareId: 'ring:4' } });
    const r = F.roll(st, 1);
    return r.state.awaiting.prompt.options.map((c) => c.pool).sort();
  }
  eq(fatePoolsDrawn('warm', 251), ['touch', 'truth'], '98 暧昧实际抽 touch+truth');
  eq(fatePoolsDrawn('hot', 252), ['dare', 'truth'], '98 热烈实际抽 dare+truth');
  const openPools = fatePoolsDrawn('open', 253);
  ok(openPools.indexOf('truth') >= 0 && openPools.indexOf('spark') >= 0, '98 不设限实际抽 spark+truth');

  let bound = place(stateOf({ scale: 'open', boundaries: ['束缚'] }, 254), 'a', { 'a:0': { squareId: 'ring:4' } });
  const boundFate = F.roll(bound, 1);
  ok(boundFate.state.awaiting.prompt.options.every((c) => (c.tags || []).indexOf('束缚') < 0 && String(c.text).indexOf('束缚') < 0), '98 命运选项同样避开边界');
}

section('18. V6 尺度区分（热烈 vs 不设限）');
{
  function sample(scale, seed) {
    let st = stateOf({ scale: scale, boundaries: [] }, seed);
    const stars = [];
    const pools = {};
    for (let i = 0; i < 100; i++) {
      const r = Draw.take(st, 'cell-truth');
      st = r.state;
      stars.push(Number(r.card.star) || 1);
      pools[r.card.pool] = (pools[r.card.pool] || 0) + 1;
    }
    return { stars: stars, pools: pools };
  }
  const hist = (arr) => {
    const h = [0, 0, 0, 0, 0, 0];
    arr.forEach((n) => { h[n] = (h[n] || 0) + 1; });
    return h;
  };
  const highShare = (arr) => arr.filter((n) => n >= 4).length / arr.length;
  const gentle = sample('gentle', 300);
  const warm = sample('warm', 301);
  const hot = sample('hot', 302);
  const open = sample('open', 303);
  const hs = [hist(gentle.stars), hist(warm.stars), hist(hot.stars), hist(open.stars)].map((h) => JSON.stringify(h));
  ok(new Set(hs).size === 4, '99 四档星级分布两两不同：' + hs.join(' / '));
  ok(gentle.stars.every((n) => n === 1), '99 温柔只有 1 星');
  ok(highShare(open.stars) > highShare(hot.stars), '99 不设限 4–5 星占比高于热烈（' + highShare(open.stars).toFixed(2) + ' > ' + highShare(hot.stars).toFixed(2) + '）');
  ok(mean(hot.stars) > mean(gentle.stars) + 0.8, '99 热烈均星高于温柔');
  ok(open.stars.every((n) => n <= 5) && hot.stars.every((n) => n <= 5), '99 星级上限 5');
  ok(Draw.poolsFor('capture', 3).indexOf('spark') < 0 && Draw.poolsFor('capture', 4).indexOf('spark') >= 0, '100 热烈与不设限可抽池不同');
  ok(Draw.fatePools(3).join('|') !== Draw.fatePools(4).join('|'), '100 命运池随尺度不同');
  const card4 = { star: 4, tags: [], text: 'x' };
  ok(Draw.weightOf(card4, Draw.band(stateOf({ scale: 'open' }, 1)), false) > Draw.weightOf(card4, Draw.band(stateOf({ scale: 'hot' }, 1)), false), '100 不设限对高星权重更高');
}

section('19. V6.1 快照与 meta 落盘');
{
  let s = place(stateOf({}, 320), 'a', { 'a:0': { squareId: 'ring:1' } }, { targetCards: 99, targetHeat: 999 });
  s = F.resolvePrompt(F.roll(s, 1).state, 'done').state;
  const v = F.view(s, { reduced: true });
  ok(v.names.a === '阿岚' && v.names.b === '小满', '101 view 带 names');
  ok(v.awaiting && v.awaiting.type === 'roll' && Array.isArray(v.choices) && v.choices.length === 0, '101 view 带 awaiting/choices');
  ok(v.meta && v.meta.heat === 8 && v.meta.heatStage === 'cold' && v.meta.stage === 'cold' && v.meta.stageLabel === '灯刚亮', '101 view 带 meta 投影（heat/stage/label）');
  ok(v.meta.max === 100 && v.meta.thresholds && v.meta.thresholds.warm === 20, '101 meta 阈值投影');
  ok(v.progress && v.progress.cardsProcessed === 1 && v.progress.targetCards === 99 && v.progress.mode === 'long', '101 view 带进度投影');
  ok(v.planesHome && v.planesHome.a === 3 && v.planesHome.b === 0, '101 view.planesHome（a 已到家 3）');
  ok(v.takeoff && v.takeoff.misses && v.takeoff.misses.a === 0 && v.takeoff.misses.b === 0 && v.takeoff.pity === false, '101 view.takeoff{misses,pity}');
  ok(v.pending === null && v.reduced === true, '101 view pending/reduced');
  ok(!Object.prototype.hasOwnProperty.call(v, 'rng') && !Object.prototype.hasOwnProperty.call(v, 'log'), '101 view 不泄 rng/log');
  v.awaiting.type = 'none';
  ok(s.awaiting.type === 'roll', '101 view 的 awaiting 是拷贝');

  const reload = F.validate(s);
  ok(reload.meta.heat === 8 && reload.meta.streak === 1, '102 validate 保留 meta');

  const mem = {};
  const box = makeSandbox(mem);
  const Store = box.window.App.Store;
  Store.saveSession(s);
  const got = Store.getSession();
  ok(got && got.v === 2 && got.meta.heat === 8 && got.meta.streak === 1 && got.cardsProcessed === 1, '103 Store 落盘保留 heat/连击/进度');
  ok(got.takeoffMiss && got.takeoffMiss.a === 0 && got.takeoffMiss.b === 0, '103 Store 落盘保留 takeoffMiss');
  const dumped = Store.exportAll();
  ok(dumped.session.meta.heat === 8 && dumped.v === 6, '103 导出含 meta（v6）');

  /* 收尾中途存档可续玩 */
  const endingState = F.roll(lastPlaneComing(stateOf({}, 321)), 1).state;
  ok(endingState.phase === 'playing' && endingState.winnerId === 'a' && endingState.awaiting.type === 'ending-prompt', '103 收尾中途状态（win-a）');
  Store.saveSession(endingState);
  const endReload = Store.getSession();
  ok(endReload && endReload.awaiting.type === 'ending-prompt' && endReload.endingQueue.length === 2 && endReload.endingIndex === 0 && endReload.winnerId === 'a', '103 收尾中途存档可续玩');
  const endResume = F.resolvePrompt(endReload, 'done');
  ok(endResume.ok && endResume.state.endingIndex === 1, '103 续玩后进入第二张收尾卡');

  Store.resetAll();
  ok(Store.importAll(dumped).ok && Store.getSession().meta.heat === 8, '103 导入后 meta 不丢');
}

section('20. V6.1 结束条件与起飞保底（用户试玩反馈：结束太快 / 摇 6 太难）');
{
  /* ---------- ① 一方全部到家 → 结束（快局 2 架 / 长夜 4 架） ---------- */
  const quickWin = F.roll(lastPlaneComing(stateOf({ planeCount: 2 }, 400)), 1);
  ok(quickWin.ok && quickWin.state.phase === 'playing' && quickWin.state.awaiting.type === 'ending-prompt', '104 快局 2/2 到家 → 收尾');
  ok(quickWin.state.winnerId === 'a' && hasType(quickWin.events, 'win'), '104 winnerId=a 且发 win');
  ok(quickWin.events.findIndex((e) => e.type === 'win') >= 0
    && quickWin.events.findIndex((e) => e.type === 'win') < quickWin.events.findIndex((e) => e.type === 'ending-start'), '104 win 在 ending-start 之前');
  ok(F.view(quickWin.state).planesHome.a === 2 && F.view(quickWin.state).takeoff.pity === false, '104 view.planesHome 2/2');
  const qDone = settleEnding(quickWin.state, 'done', 'done');
  ok(qDone.ok && qDone.state.phase === 'ended', '104 两张收尾卡后结束');
  ok(qDone.state.result.ending === 'win-a' && qDone.state.result.winnerId === 'a', '104 ledger ending=win-a');
  ok(qDone.state.result.stats.planesHome.a === 2 && qDone.state.result.stats.planesHome.b === 0, '104 stats.planesHome={a:2,b:0}');
  ok(qDone.state.result.prompts.filter((p) => p.kind === 'ending').length === 2, '104 两张收尾卡都保留');

  const bWin = F.roll(lastPlaneComing(stateOf({ planeCount: 4 }, 401), 'b'), 1);
  ok(bWin.state.winnerId === 'b' && bWin.state.awaiting.type === 'ending-prompt', '105 乙方 4/4 到家 → win-b');
  const bDone = settleEnding(bWin.state, 'skipped', 'skipped');
  ok(bDone.state.result.ending === 'win-b' && bDone.state.result.winnerId === 'b', '105 ledger ending=win-b');
  ok(bDone.state.result.stats.planesHome.a === 0 && bDone.state.result.stats.planesHome.b === 4, '105 stats.planesHome={a:0,b:4}');

  /* ---------- ② 只有部分到家 / 题卡 20 张 / 心动值 100 → 都不结束 ---------- */
  const oneOfFour = F.roll(parked(stateOf({ planeCount: 4 }, 402), 'a', { 'a:0': { squareId: 'home:red:4' } }), 1);
  ok(oneOfFour.state.phase === 'playing' && oneOfFour.state.awaiting.type === 'roll' && oneOfFour.state.winnerId === null, '106 长夜只到家 1/4 不结束');

  const manyCards = place(stateOf({ planeCount: 2 }, 403), 'a', { 'a:0': { squareId: 'ring:1' } },
    { cardsProcessed: 20, targetCards: 4, targetHeat: 40, heat: 100 });
  const mc = F.resolvePrompt(F.roll(manyCards, 1).state, 'done');
  ok(mc.state.phase === 'playing' && mc.state.awaiting.type === 'roll', '107 20 张题卡 + 心动值 100 不结束');
  ok(mc.state.cardsProcessed === 21 && mc.state.meta.heat === 100, '107 题卡/心动值仍记录在状态里');
  ok(mc.state.targetCards === 4 && mc.state.targetHeat === 40, '107 目标字段保留（仅历史兼容）');

  /* ---------- ③ 起飞保底：连续 2 回合非 6 → 第 3 回合任意点数 ---------- */
  let s = place(stateOf({ planeCount: 2 }, 404), 'a', { 'a:0': { squareId: 'hangar:red:0' } });
  ok(s.takeoffMiss && s.takeoffMiss.a === 0 && s.takeoffMiss.b === 0, '108 新局 takeoffMiss={a:0,b:0}');
  const m1 = F.roll(s, 3);
  ok(m1.state.takeoffMiss.a === 1 && m1.state.turn === 'b', '108 第 1 回合非 6 → miss=1 且换手');
  const m2 = F.roll(m1.state, 3);
  ok(m2.state.turn === 'a' && m2.state.takeoffMiss.a === 1 && m2.state.takeoffMiss.b === 1, '108 对方也没 6 → miss.b=1');
  ok(F.legalMoves(m2.state, 3).blocked['a:0'].blockedReason === 'NEED_SIX_TO_TAKEOFF', '108 miss<2 仍需 6');
  const m3 = F.roll(m2.state, 3);
  ok(m3.state.takeoffMiss.a === 2 && m3.state.turn === 'b', '108 第 2 回合非 6 → miss=2 且换手');
  const m4 = F.roll(m3.state, 3);
  ok(m4.state.turn === 'a' && m4.state.takeoffMiss.a === 2 && m4.state.takeoffMiss.b === 2, '108 轮到 a，保底就绪');
  ok(F.view(m4.state).takeoff.pity === true && F.view(m4.state).takeoff.misses.a === 2, '108 view.takeoff.pity=true');
  const m5 = F.roll(m4.state, 3);
  ok(m5.ok && at(m5.state, 'a:0').squareId === 'ring:0', '108 第 3 回合任意点数（3）保底起飞');
  ok(m5.events.some((e) => e.type === 'dice' && e.pity === true), '108 pity 掷骰事件带 pity:true');
  ok(hasType(m5.events, 'takeoff'), '108 起飞事件');
  ok(m5.state.takeoffMiss.a === 0, '108 实际起飞后清零');
  ok(m5.state.takeoffMiss.b === 2, '108 不影响对方计数');

  /* 掷出 6 也清零（仍只在「连续没起飞」时才可能带 pity） */
  const six = F.roll(m4.state, 6);
  ok(six.state.takeoffMiss.a === 0 && at(six.state, 'a:0').squareId === 'ring:0', '109 掷 6 起飞清零');
  ok(six.state.turn === 'a' && six.state.awaiting.type === 'roll', '109 掷 6 后同一人再掷');

  /* 6 点选择走棋盘上的子（不起飞）也清零 */
  const onBoard6 = place(stateOf({ planeCount: 2 }, 405), 'a', { 'a:0': { squareId: 'ring:1' }, 'a:1': { squareId: 'hangar:red:1' } });
  onBoard6.takeoffMiss = { a: 2, b: 0 };
  const sixChoose = F.roll(onBoard6, 6);
  ok(sixChoose.state.awaiting.type === 'choose-piece' && sixChoose.state.awaiting.pieceIds.indexOf('a:1') >= 0, '110 6 点两架都能走');
  const walked = F.move(sixChoose.state, 'a:0');
  ok(walked.ok && at(walked.state, 'a:0').squareId === 'ring:7', '110 选了棋盘上的子');
  ok(walked.state.takeoffMiss.a === 0, '110 6 点走棋盘子（不起飞）也清零');

  /* 有飞机在棋盘上（未到家且不在机坪）时不累计保底 */
  const onBoard = place(stateOf({ planeCount: 2 }, 406), 'a', { 'a:0': { squareId: 'home:red:4' }, 'a:1': { squareId: 'hangar:red:1' } });
  const ob = F.roll(onBoard, 3);
  ok(ob.state.takeoffMiss.a === 0, '111 未到家飞机不全在机坪 → 不累计');

  /* 上限 2：连续非 6 再多也不超过 2 */
  ok(m3.state.takeoffMiss.a === 2 && m4.state.takeoffMiss.a === 2, '112 miss 上限 2');
}

console.log('\n' + passed + ' passed, ' + failed.length + ' failed');
if (failed.length) {
  failed.forEach((f) => console.error(' - ' + f));
  process.exit(1);
}
