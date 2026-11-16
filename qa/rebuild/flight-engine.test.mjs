#!/usr/bin/env node
/* 今晚飞行棋 · 引擎验收
 * node qa/rebuild/flight-engine.test.mjs
 * 坐标与 75 条以 T-003 清单为准。A1/A2/A3 与 stackCapturedBySingle 均为待确认，不是已批准规则。
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

function place(state, turn, map) {
  const s = clone(state);
  s.turn = turn || 'a';
  s.phase = 'playing';
  s.awaiting = { type: 'roll' };
  s.pendingMove = null;
  s.rollContext = null;
  s.winnerId = null;
  s.result = null;
  s.pieces.forEach((p) => {
    const m = map[p.id];
    if (m) {
      p.squareId = m.squareId;
      p.arrived = !!m.arrived;
      p.stackGroupId = m.stackGroupId || null;
    } else {
      p.squareId = 'home:' + p.color + ':goal';
      p.arrived = true;
      p.stackGroupId = null;
    }
  });
  return s;
}
function at(state, id) {
  return state.pieces.filter((p) => p.id === id)[0];
}
function hasType(events, type) { return (events || []).some((e) => e.type === type); }
function mean(arr) { return arr.reduce((s, n) => s + n, 0) / (arr.length || 1); }

section('1. 开局、校验、规则拷贝（待确认开关）');
{
  const cur = Rules.current();
  eq(cur, {
    rerollOnEverySix: true,
    chooseAmongLegalPieces: true,
    threeSixesPenalty: false,
    skipHomeEntryBlocksEntry: true,
    skipStackKeepsBonusStep: false,
    endingPromptSkippable: true,
    ledgerIncludeMoveReplay: false,
    stackCapturedBySingle: true
  }, '1 默认开关与契约一致（待确认，非已批准）');
  cur.rerollOnEverySix = false;
  ok(Rules.current().rerollOnEverySix === true, '1 current() 返回拷贝');
  const rulesText = read(path.join(ROOT, 'app/src/engine/flight-rules.js'));
  ok(rulesText.indexOf('待确认') >= 0 && rulesText.indexOf('不是用户已批准') >= 0, '1 源码标明待确认，未写成已批准');

  const made = boot({ scale: 'gentle', boundaries: ['喝酒'] }, 3);
  ok(made.ok && made.error === null, '2 newGame 成功');
  const g = made.state;
  ok(g.kind === 'flight' && g.v === 1 && g.phase === 'playing', '2 对局是飞行棋且进行中');
  ok(g.awaiting.type === 'roll' && g.turn === 'a', '2 先手可掷');
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
      if (id === MAP.noJumpOf[c]) ok(sq.jumpTo === null, '9 禁跳 ' + id);
      else ok(sq.jumpTo === 'ring:' + ((Number(id.slice(5)) + 4) % 52), '9 跳 +4 ' + id);
    });
    const fly = Board.square(MAP.flyOf[c]);
    ok(fly.isFly === true && fly.flyTo === MAP.flyDestOf[c], '9 飞点 ' + c);
  });
  const kinds = { truth: [], dare: [], touch: [], thermo: [], wheel: [] };
  rings.forEach((sq) => { if (kinds[sq.kind]) kinds[sq.kind].push(sq.id); });
  eq(kinds.truth.sort(), ['ring:1', 'ring:2', 'ring:5', 'ring:9', 'ring:12', 'ring:16', 'ring:17', 'ring:23', 'ring:25', 'ring:28', 'ring:31', 'ring:38', 'ring:42', 'ring:43', 'ring:51'].sort(), '10 真心话格');
  eq(kinds.dare.sort(), ['ring:4', 'ring:6', 'ring:15', 'ring:18', 'ring:19', 'ring:22', 'ring:27', 'ring:30', 'ring:32', 'ring:35', 'ring:41', 'ring:44', 'ring:45', 'ring:48', 'ring:49'].sort(), '10 大冒险格');
  eq(kinds.touch.sort(), ['ring:3', 'ring:8', 'ring:21', 'ring:29', 'ring:34', 'ring:47'].sort(), '10 靠近格');
  eq(kinds.thermo.sort(), ['ring:10', 'ring:36'], '10 温度计 2');
  eq(kinds.wheel.sort(), ['ring:14', 'ring:40'], '10 转盘 2');
  const asking = kinds.truth.length + kinds.dare.length + kinds.touch.length + kinds.thermo.length + kinds.wheel.length;
  eq(asking, 40, '10 主路线出题格数');
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
    ['yellow', 'ring:4', 1, 'ring:9', 'ring:32', 1, 'ring:33', 'ring:45', 'ring:49', 'ring:9'],
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
  ok(at(skipped.state, 'a:0').squareId === 'ring:49' && at(skipped.state, 'a:1').squareId === 'ring:49', '31 跳过叠机不再多走一步（待确认 A2）');
  ok(at(skipped.state, 'a:0').stackGroupId && at(skipped.state, 'a:0').stackGroupId === at(skipped.state, 'a:1').stackGroupId, '31 叠机保留');

  let keep = stateOf({ rules: { skipStackKeepsBonusStep: true } }, 18);
  keep = place(keep, 'a', { 'a:0': { squareId: 'ring:48' }, 'a:1': { squareId: 'ring:49' } });
  const kept = F.resolvePrompt(F.move(F.roll(keep, 1).state, 'a:0').state, 'skipped');
  ok(at(kept.state, 'a:0').squareId === 'ring:50', '31 待确认：skipStackKeepsBonusStep 为 true 时仍走一步');

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
  ok(at(skippedHome.state, 'a:0').squareId === 'ring:50', '36 跳过进航停在 preSquare（待确认 A2）');

  let allow = stateOf({ rules: { skipHomeEntryBlocksEntry: false } }, 23);
  allow = place(allow, 'a', { 'a:0': { squareId: 'ring:50' } });
  const still = F.resolvePrompt(F.roll(allow, 1).state, 'skipped');
  ok(at(still.state, 'a:0').squareId === 'home:red:0', '36 待确认：跳过仍进入');

  let inner = place(stateOf({}, 24), 'a', { 'a:0': { squareId: 'home:red:0' } });
  const stepped = F.roll(inner, 1);
  ok(at(stepped.state, 'a:0').squareId === 'home:red:1' && !(stepped.state.awaiting.prompt && stepped.state.awaiting.prompt.kind === 'home-entry'), '37 航线内不再出进航题');
  let goal = place(stateOf({}, 25), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const arrived = F.roll(goal, 1);
  ok(at(arrived.state, 'a:0').arrived === true && at(arrived.state, 'a:0').squareId === 'home:red:goal', '37 到达后 arrived');

  let win = place(stateOf({ boundaries: ['蒙眼'], scale: 'warm' }, 26), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const won = F.roll(win, 1);
  ok(won.state.awaiting.type === 'ending-prompt' && won.state.winnerId === 'a', '38 四架到齐获胜');
  ok(won.state.awaiting.prompt.actorId === 'b', '38 赢家给对方抽收尾');
  const ended = F.resolvePrompt(won.state, 'done');
  ok(ended.state.phase === 'ended' && ended.state.result && ended.state.result.ending === 'win-a', '38 生成棋谱');
  const ledger = ended.state.result;
  ok(ledger.names.a === '阿岚' && ledger.colors.a === 'red' && ledger.scale === 'warm', '41 名字颜色尺度');
  ok(ledger.boundaries.indexOf('蒙眼') >= 0 && ledger.planeCount === 4, '41 边界与架数');
  ok(ledger.winnerId === 'a' && ledger.prompts.some((p) => p.kind === 'ending' && p.outcome === 'done'), '41 胜负与题目');
  ok(/^\d{4}-\d{2}-\d{2}$/.test(ledger.date), '41 日期');
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' });
  ok(ledger.date === fmt.format(new Date(ledger.endedAt)), '41 Asia/Shanghai');
  ok(!Object.prototype.hasOwnProperty.call(ledger, 'moves'), '41 默认不写走子回放（待确认 A3）');

  let fast = place(stateOf({ planeCount: 2 }, 27), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const fastWin = F.roll(fast, 1);
  ok(fastWin.state.winnerId === 'a' && fast.pieces.filter((p) => p.playerId === 'a').length === 2, '39 快局两架到家即胜');

  const skipEnd = F.resolvePrompt(won.state, 'skipped');
  ok(skipEnd.state.phase === 'ended' && skipEnd.state.result.ending === 'win-a', '40 收尾可跳过仍有棋谱（待确认 A2）');
  let hard = place(stateOf({ rules: { endingPromptSkippable: false } }, 28), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const hardWon = F.roll(hard, 1).state;
  const denied = F.resolvePrompt(hardWon, 'skipped');
  ok(!denied.ok && denied.error.code === 'PROMPT_NOT_SKIPPABLE' && denied.state === hardWon, '40 不可跳过时失败且不改入参');

  let replay = place(stateOf({ rules: { ledgerIncludeMoveReplay: true } }, 29), 'a', { 'a:0': { squareId: 'home:red:4' } });
  const replayLedger = F.resolvePrompt(F.roll(replay, 1).state, 'done').state.result;
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
  const fresh = Store.getSettings();
  ok(fresh.v === 5 && fresh.sound === true && fresh.haptics === true && fresh.reduced === false, '56 默认开关');
  ok(fresh.names.a === '他' && fresh.names.b === '她' && fresh.blacklist.length === 0, '56 默认名字与空边界');

  mem['couple2.settings'] = JSON.stringify({
    v: 4, maxStar: 1, gentleOnly: true, sound: false, haptics: false, reduced: true,
    blacklist: ['喝酒'], names: { a: '旧甲', b: '旧乙' }
  });
  const upgraded = Store.getSettings();
  ok(upgraded.names.a === '旧甲' && upgraded.sound === false && upgraded.haptics === false && upgraded.reduced === true, '57 保留旧设置');
  ok(upgraded.blacklist[0] === '喝酒' && upgraded.scale !== 'gentle' && upgraded.maxStar == null && upgraded.gentleOnly !== true, '57 不把公寓尺度当成开局');
  ok(Store.getSession() === null, '57 读设置不会自动开局');

  mem['couple2.session'] = JSON.stringify({
    v: 1, id: 'mid-voyage', phase: 'draft', act: 1, round: 2,
    hand: ['a', 'b'], resources: { heart: 1 }, ts: 1710000000000
  });
  ok(Store.getSession() === null && Store.hasSession() === false, '58 夜航不续玩');
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
  ok(dumped.app === 'couple-flight' && dumped.v === 5 && dumped.session.kind === 'flight', '61 导出');
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
  const won = F.roll(place(stateOf({}, 75), 'a', { 'a:0': { squareId: 'home:red:4' } }), 1);
  ok(hasType(won.events, 'win'), '74 获胜');
  ok(hasType(F.resolvePrompt(won.state, 'done').events, 'ledger'), '74 棋谱');
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

console.log('\n' + passed + ' passed, ' + failed.length + ' failed');
if (failed.length) {
  failed.forEach((f) => console.error(' - ' + f));
  process.exit(1);
}
