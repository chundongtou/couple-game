#!/usr/bin/env node
/* 今晚在这间公寓 · 引擎单测
 * node qa/rebuild/engine.test.mjs
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

function makeSandbox() {
  const sandbox = { window: {}, console, Math, Date, JSON, Object, Array, Number, String, RegExp, parseInt };
  sandbox.global = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(read(path.join(ROOT, 'app/src/engine/balance.js')), sandbox, { filename: 'balance.js' });
  vm.runInContext(read(path.join(ROOT, 'app/src/data/cards.js')), sandbox, { filename: 'cards.js' });
  vm.runInContext(read(path.join(ROOT, 'app/src/engine/engine.js')), sandbox, { filename: 'engine.js' });
  return sandbox;
}

const sb = makeSandbox();
const E = sb.window.App.Engine;
const BAL = sb.window.App.Balance;
const CARDS = sb.window.CARDS;
const NAMES = { a: '阿岚', b: '小满' };
const EXPLICIT = new RegExp(BAL.EXPLICIT_SRC);
const GENTLE_EXTRA = new RegExp(BAL.GENTLE_EXTRA_SRC);

function fresh(settings = {}, seed = 20251115) {
  return E.newSession(Object.assign({ maxStar: 3 }, settings), NAMES, seed);
}
function mean(arr) { return arr.reduce((s, n) => s + n, 0) / (arr.length || 1); }
function drawN(state, opts, n) {
  const stars = [];
  const texts = [];
  let s = state;
  for (let i = 0; i < n; i++) {
    const r = E.drawPrompt(s, opts);
    const card = r.state.prompt.card;
    stars.push(card.star);
    texts.push(card.text);
    s = r.state;
  }
  return { stars, texts, state: s };
}

section('1. 公寓会话 / 卧室不锁');
ok(!!E && !!BAL, '引擎与数值挂载');
ok(E.newSession({ maxStar: 1 }, NAMES, 1).kind === 'apartment', '新局是公寓');
eq(BAL.ROOMS, ['living', 'kitchen', 'balcony', 'bathroom', 'bedroom'], '五间房');
const tender = fresh({ maxStar: 1 }, 3);
ok(E.roomOpen(tender, 'bedroom').ok === true, '温柔开局卧室可进');
ok(E.roomOpen(tender, 'bedroom').locked === false, '卧室没有锁');
ok(E.roomOpen(fresh({ maxStar: 4 }, 3), 'bedroom').ok, '不设限卧室可进');
ok(E.roomOpen(tender, 'attic').ok === false, '未知房间拒绝');

section('2. 走路、重访、热度');
{
  let s = fresh({ maxStar: 3 }, 11);
  const snap = JSON.stringify(s);
  const entered = E.enterRoom(s, 'living');
  ok(JSON.stringify(s) === snap, 'enterRoom 不改入参');
  s = entered.state;
  ok(s.phase === 'room' && s.room === 'living' && s.lit.living && s.visits.living === 1, '走进客厅并点灯');
  ok(E.heatStage(s) !== 'charged', '只进一间，热烈尚未到烫');
  s = E.leaveRoom(s).state;
  ok(s.phase === 'plan' && s.lit.living, '离开后灯还亮着');
  s = E.enterRoom(s, 'kitchen').state;
  ok(s.visits.kitchen === 1 && s.lit.kitchen && s.lit.living, '厨房点亮，客厅仍亮');
  ok(s.heat >= BAL.HEAT_CHARGED, '热烈走两间后热度已到烫 ' + s.heat);
  ok(E.heatStage(s) === 'charged' || E.heatStage(s) === 'burning', '阶段是 charged/burning');
  const before = s.heat;
  s = E.enterRoom(s, 'living').state;
  ok(s.visits.living === 2, '可以重访客厅');
  ok(s.heat > before, '重访仍有一点热，但局没有结束条件');
  s = E.enterRoom(s, 'bedroom').state;
  ok(s.room === 'bedroom' && s.visits.bedroom === 1, '中途就能进卧室');
}

section('3. 四种尺度的升温差');
function heatAfter(cap, rooms, seed) {
  let s = fresh({ maxStar: cap }, seed);
  rooms.forEach((r) => { s = E.enterRoom(s, r).state; });
  return s.heat;
}
const hT = heatAfter(1, ['living', 'kitchen'], 4);
const hF = heatAfter(2, ['living', 'kitchen'], 4);
const hH = heatAfter(3, ['living', 'kitchen'], 4);
const hO = heatAfter(4, ['living', 'kitchen'], 4);
ok(hT < BAL.HEAT_WARM, '温柔走两间仍轻 ' + hT);
ok(hF < BAL.HEAT_CHARGED && hF > hT, '暧昧比温柔热，但还没到烫 ' + hF);
ok(hH >= BAL.HEAT_CHARGED, '热烈两间到烫 ' + hH);
ok(hO > hH && hO >= BAL.HEAT_BURNING, '不设限两间比热烈更热，到很深 ' + hO);
ok(E.band(fresh({ maxStar: 1 })).maxStar === 1, '温柔封顶 1 星');
ok(E.band(fresh({ maxStar: 2 })).maxStar <= 2, '暧昧开场不超过 2');
ok(E.band(fresh({ maxStar: 3 })).maxStar >= 4, '热烈开场就能抽到 4 星');
ok(E.band(fresh({ maxStar: 4 })).maxStar === 5, '不设限开场到 5 星');
{
  let s = fresh({ maxStar: 3 }, 8);
  s = E.enterRoom(s, 'living').state;
  s = E.enterRoom(s, 'kitchen').state;
  ok(E.band(s).minPrefer >= 4, '热烈两间后优先 4 星以上');
}
{
  const g = fresh({ maxStar: 4, gentleOnly: true }, 2);
  ok(E.band(g).cap === 2, '再柔一点把不设限压回暧昧档');
}

section('4. 温柔不漏、热烈更直接、边界永远赢');
{
  const s = fresh({ maxStar: 1 }, 21);
  const sample = drawN(s, { pools: ['truth', 'dare', 'touch', 'sync'], talk: true }, 40);
  ok(sample.stars.every((n) => n <= 1), '温柔抽到的星级都 ≤ 1');
  ok(sample.texts.every((t) => !EXPLICIT.test(t) && !GENTLE_EXTRA.test(t)), '温柔抽不到露骨句');
  const leaks = [];
  Object.keys(CARDS).forEach((pool) => {
    CARDS[pool].forEach((c) => {
      const card = Object.assign({ pool, type: pool }, c);
      if ((EXPLICIT.test(c.text) || GENTLE_EXTRA.test(c.text)) && E.cardAllowed(card, s)) leaks.push(c.id);
    });
  });
  ok(leaks.length === 0, '温柔档全库露骨句都被滤掉 ' + leaks.slice(0, 5).join(','));
}
{
  const soft = drawN(fresh({ maxStar: 1 }, 30), { pools: ['truth', 'sync'], talk: true }, 24);
  let hotState = fresh({ maxStar: 3 }, 30);
  hotState = E.enterRoom(hotState, 'living').state;
  hotState = E.enterRoom(hotState, 'kitchen').state;
  const hot = drawN(hotState, { pools: ['truth', 'dare', 'touch', 'spark'], talk: false }, 24);
  ok(mean(hot.stars) >= mean(soft.stars) + 1.5, '热烈均星 ' + mean(hot.stars).toFixed(2) + ' 明显高于温柔 ' + mean(soft.stars).toFixed(2));
  ok(hot.stars.some((n) => n >= 4), '热烈样本里有 4 星以上');
  const open = drawN(fresh({ maxStar: 4 }, 30), { pools: ['dare', 'touch', 'spark'] }, 20);
  ok(mean(open.stars) >= 3.5, '不设限开场均星 ≥ 3.5，实际 ' + mean(open.stars).toFixed(2));
  ok(open.stars.some((n) => n >= 4), '不设限能抽到直球');
}
{
  const s = fresh({ maxStar: 4, blacklist: ['束缚'] }, 6);
  s.heat = 96;
  let seen = 0;
  let bad = 0;
  Object.keys(CARDS).forEach((pool) => {
    CARDS[pool].forEach((c) => {
      if ((c.tags || []).indexOf('束缚') >= 0 || String(c.text).indexOf('束缚') >= 0) {
        seen++;
        if (E.cardAllowed(Object.assign({ pool, type: pool }, c), s)) bad++;
      }
    });
  });
  ok(seen > 8, '题库里确有束缚内容 ' + seen);
  ok(bad === 0, '不设限也抽不到被划掉的束缚');
  const kw = fresh({ maxStar: 4, blacklist: ['高潮'] }, 6);
  kw.heat = 96;
  let kwBad = 0;
  let kwSeen = 0;
  Object.keys(CARDS).forEach((pool) => {
    CARDS[pool].forEach((c) => {
      if (String(c.text).indexOf('高潮') >= 0) {
        kwSeen++;
        if (E.cardAllowed(Object.assign({ pool, type: pool }, c), kw)) kwBad++;
      }
    });
  });
  ok(kwSeen > 0 && kwBad === 0, '自定义关键词边界生效 seen=' + kwSeen + ' bad=' + kwBad);
  const drawn = drawN(s, { pools: ['truth', 'dare', 'touch', 'spark'] }, 30);
  ok(drawn.texts.every((t) => t.indexOf('束缚') < 0), '抽牌路径同样避开束缚');
}

section('5. 客厅可以停，也可以再深一点');
{
  let s = fresh({ maxStar: 2 }, 12);
  s = E.enterRoom(s, 'living').state;
  const offered = E.livingOffer(s, { who: 'b', role: 'listen' });
  s = offered.state;
  ok(s.prompt && s.prompt.card.text, '客厅抽出一句沙发话题');
  ok(s.prompt.who === 'b' && s.prompt.role === 'listen', '可以指定谁先听');
  const light = s.prompt.card.star;
  const deeper = E.pushDeeper(s);
  ok(deeper.state.prompt.card.text !== s.prompt.card.text || deeper.state.log.length === 1, '再深一点会换一句并记下刚才那句');
  ok(deeper.state.heat >= s.heat, '往下问不会降温');
  ok(E.band(deeper.state, { deeper: true }).maxStar <= 3, '暧昧再深一点也不越到不设限');
  const done = E.settlePrompt(deeper.state, 'hold');
  ok(done.state.prompt === null && done.state.log.length >= 1, '可以停在这里');
  ok(light <= 3, '暧昧话题星级受控 ' + light);
}

section('6. 厨房转盘与浴室重抽');
{
  let s = fresh({ maxStar: 4 }, 15);
  s = E.enterRoom(s, 'kitchen').state;
  s = E.dealWheel(s, 'dare').state;
  ok(s.wheel.slots.length === 12 && s.wheel.kind === 'dare', '厨房发 12 格转盘');
  const spun = E.spinWheel(s);
  s = spun.state;
  ok(s.wheel.spun && s.prompt.card.text === s.wheel.slots[s.wheel.index].text, '转盘停在其中一格');
  const hotStars = s.wheel.slots.map((c) => c.star);
  ok(mean(hotStars) >= 3, '高热度厨房转盘偏烫 ' + mean(hotStars).toFixed(2));
  s = E.settlePrompt(s, 'done').state;
  ok(s.log[0].outcome === 'done' && s.heat > BAL.HEAT_START[4], '做到了会升温');

  let soft = fresh({ maxStar: 1 }, 16);
  soft = E.enterRoom(soft, 'kitchen').state;
  soft = E.dealWheel(soft, 'dare').state;
  ok(soft.wheel.slots.every((c) => c.star <= 1 && !EXPLICIT.test(c.text)), '温柔厨房转盘仍然轻');
}
{
  let s = fresh({ maxStar: 3 }, 18);
  s = E.enterRoom(s, 'bathroom').state;
  s = E.dealWheel(s, 'truth').state;
  s = E.spinWheel(s).state;
  s = E.handTruth(s, 'other').state;
  ok(s.prompt.who === 'other', '真心话可以交给对方');
  ok(s.truthRerolls === 2, '开局两次重抽');
  s = E.rerollWheel(s).state;
  s = E.rerollWheel(s).state;
  ok(s.truthRerolls === 0 && s.wheel.spun === false, '两次用完，盘面重发');
  const third = E.rerollWheel(s);
  ok(third.events[0].type === 'blocked' && third.events[0].reason === 'no-reroll', '第三次重抽被拒绝');
  ok(third.state.truthRerolls === 0, '拒绝重抽不扣成负数');
}

section('7. 阳台温度：猜得越近越热');
{
  function play(placeA, guessA, placeB, guessB, cap) {
    let s = fresh({ maxStar: cap }, 40);
    s = E.thermoBegin(s).state;
    s = E.thermoSet(s, 'a', placeA, guessA).state;
    s = E.thermoSet(s, 'b', placeB, guessB).state;
    return E.thermoReveal(s);
  }
  const close = play(5, 5, 5, 5, 4);
  const far = play(5, 0, 5, 10, 4);
  ok(close.events[0].type === 'reveal', '两边都锁了才能揭开');
  ok(close.state.thermo.delta > far.state.thermo.delta, '猜得近的升温更多 ' + close.state.thermo.delta + ' > ' + far.state.thermo.delta);
  ok(E.thermoReveal(E.thermoBegin(fresh()).state).events[0].reason === 'incomplete', '缺一边不能揭');
  let tiny = E.thermoBegin(fresh({ maxStar: 1 })).state;
  ok(tiny.thermo.max === BAL.THERMO_LABELS[1].length - 1, '温柔温度尺更短');
  tiny = E.thermoSet(tiny, 'a', 99, -3).state;
  ok(tiny.thermo.a.place === tiny.thermo.max && tiny.thermo.a.guess === 0, '温度被夹在尺的两端');
  ok(E.thermoBegin(fresh({ maxStar: 4 })).state.thermo.max > tiny.thermo.max, '不设限温度尺更长');
  ok(E.thermoBegin(fresh({ maxStar: 3 })).state.thermo.max === BAL.THERMO_LABELS[3].length - 1, '热烈用长尺');
}

section('8. 公寓散步不是竞速');
{
  let s = E.strollStart(fresh({ maxStar: 3 }, 50)).state;
  ok(s.phase === 'stroll' && s.stroll.pos === 0, '一枚我们，从起点走');
  ok(s.scores == null && s.players == null, '没有双方分数');
  const landed = E.strollRoll(s);
  s = landed.state;
  ok(s.stroll.lastDie >= 1 && s.stroll.lastDie <= 3, '一步只走 1 到 3 格');
  ok(s.stroll.pos === s.stroll.lastDie, '共享棋子落到那一格');
  const tile = s.stroll.pending.tile;
  ok(tile.room && s.stroll.pending.card.text, '落地就是那一间的事');
  ok(s.lit[tile.room] === true, '走过的房间会亮');
  ok(E.strollRoll(s).events[0].reason === 'pending', '这件事没做完不能继续走');
  const settled = E.strollSettle(s, 'pass');
  ok(!settled.state.stroll.pending, '可以先放下，没有惩罚字段');
  ok(settled.state.heat >= s.heat, '放下不降热');
  ok(E.strollRoll(settled.state).state.stroll.pending, '放下之后还能再走');
}

section('9. 安全词与关灯');
{
  let s = fresh({ maxStar: 4 }, 60);
  s = E.enterRoom(s, 'bedroom').state;
  s = E.bedroomMode(s, 'act').state;
  s = E.bedroomDraw(s).state;
  ok(s.room === 'bedroom' && s.prompt.card.text, '卧室能直接做事');
  ok(!EXPLICIT.test(s.prompt.card.text) || s.settings.maxStar === 4, '不设限卧室允许直球');
  s = E.settlePrompt(s, 'done').state;
  const heat = s.heat;
  const n = s.log.length;
  const text = s.log[0].text;
  const snap = JSON.stringify(s);
  const fin = E.safeWord(s);
  ok(JSON.stringify(s) === snap, '安全词不改入参');
  ok(fin.state.phase === 'done' && fin.state.flags.safeWord, '进入关灯');
  ok(fin.state.heat === heat && fin.state.log.length === n && fin.state.log[0].text === text, '热度和已经发生的都还在');
  ok(fin.state.result.title === '今晚在这间公寓', '记忆页标题');
  ok(fin.state.result.safe === true && fin.state.result.shamed === false, '不评判');
  ok(!/惩罚|丢人|失败|检讨|羞耻/.test(fin.state.result.line), '收尾文案没有羞辱');
  ok(fin.state.result.rooms.some((r) => r.id === 'bedroom'), '亮过的卧室写在记忆页');
  const closed = E.closeNight(fresh({ maxStar: 2 }, 61));
  ok(!closed.state.flags.safeWord && closed.state.result.safe === false, '普通关灯不是安全词');
  ok(closed.state.result.title === '今晚在这间公寓', '空走一晚也能有一页');
}

section('10. 游戏门带回今晚');
{
  let door = E.newStandalone('dare', { maxStar: 4, names: NAMES }, 70);
  ok(door.mode === 'standalone' && door.room === 'kitchen', '大冒险转盘独立开在厨房');
  const base = door.heat;
  door = E.dealWheel(door, 'dare').state;
  door = E.spinWheel(door).state;
  door = E.settlePrompt(door, 'done').state;
  ok(door.heat > base, '独立局自己会升温');
  const pack = E.standalonePack(door);
  ok(pack.heatDelta === door.heat - base && pack.moments.length === 1, '可以打包结果');
  let night = fresh({ maxStar: 3 }, 71);
  const h0 = night.heat;
  const pasted = E.pasteStandalone(night, pack);
  ok(pasted.state.heat === Math.min(100, h0 + pack.heatDelta), '热度加进今晚');
  ok(pasted.state.lit.kitchen === true, '厨房被点亮');
  ok(pasted.state.log[0].via === 'door', '记下是从游戏门带回的');
  const again = E.pasteStandalone(pasted.state, pack);
  ok(again.events[0].already === true, '同一场不能带回两次');
  ok(again.state.heat === pasted.state.heat && again.state.log.length === pasted.state.log.length, '第二次不重复加');
  let thermo = E.newStandalone('thermo', { maxStar: 2, names: NAMES }, 72);
  ok(thermo.room === 'balcony', '温度计独立开在阳台');
  let truth = E.newStandalone('truth', { maxStar: 1, names: NAMES }, 73);
  ok(truth.room === 'bathroom', '真心话独立开在浴室');
  let walk = E.newStandalone('stroll', { maxStar: 3, names: NAMES }, 74);
  ok(walk.phase === 'stroll' && walk.mode === 'standalone', '散步可以单独走');
}

section('11. 确定性、旧夜航归档');
{
  function path(seed) {
    let s = fresh({ maxStar: 3 }, seed);
    s = E.enterRoom(s, 'living').state;
    s = E.livingOffer(s, { who: 'a', role: 'ask' }).state;
    return [s.heat, s.prompt.card.id, s.minutes];
  }
  eq(path(99), path(99), '同一种子同一条夜');
  const legacy = {
    v: 1, id: 'old-voyage', phase: 'play', act: 2, round: 6,
    hand: ['tr1'], resources: { heart: 4, tension: 2, sync: 1, coins: 3 },
    names: NAMES, ts: 1700000000000
  };
  ok(E.isLegacy(legacy) && !E.isLegacy(fresh()), '能认出旧夜航，不把公寓当旧档');
  ok(E.validate(legacy) === null, '旧档不能当公寓局恢复');
  const archived = E.archiveLegacy(legacy);
  ok(archived.kind === 'voyage' && /不会在这间公寓里继续/.test(archived.note), '旧档收成以前的夜');
  const fixed = E.validate(Object.assign(fresh({ maxStar: 9 }, 3), { heat: 500, phase: 'nope' }));
  ok(fixed.heat === 100 && fixed.phase === 'plan' && fixed.settings.maxStar <= 4, '坏档被修回可玩范围');
}

section('12. 存档迁移');
{
  const mem = {};
  const storebox = {
    window: sb.window,
    console,
    localStorage: {
      getItem: (k) => (k in mem ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v); },
      removeItem: (k) => { delete mem[k]; }
    },
    JSON, Date, Object, Array, String, Number, parseInt, Math
  };
  storebox.window.localStorage = storebox.localStorage;
  vm.createContext(storebox);
  vm.runInContext(read(path.join(ROOT, 'app/src/core/util.js')), storebox, { filename: 'util.js' });
  vm.runInContext(read(path.join(ROOT, 'app/src/core/bus.js')), storebox, { filename: 'bus.js' });
  vm.runInContext(read(path.join(ROOT, 'app/src/core/store.js')), storebox, { filename: 'store.js' });
  const Store = storebox.window.App.Store;
  mem['couple2.session'] = JSON.stringify({
    v: 1, id: 'mid-voyage', phase: 'draft', act: 1, round: 2,
    hand: ['a', 'b', 'c'], resources: { heart: 1, tension: 0, sync: 0, coins: 0 }, ts: 1710000000000
  });
  ok(Store.getSession() === null, '进行中的旧夜航不会续进公寓');
  ok(Store.hasSession() === false, '没有可继续的公寓局');
  const hist = Store.getHistory();
  ok(hist.length === 1 && hist[0].kind === 'voyage' && hist[0].id === 'mid-voyage', '旧局收进以前的夜');
  const night = fresh({ maxStar: 3 }, 80);
  Store.saveSession(night);
  ok(Store.hasSession() && Store.getSession().kind === 'apartment', '新公寓局可以保存继续');
  const dumped = Store.exportAll();
  ok(dumped.app === 'couple-apartment' && dumped.session.kind === 'apartment', '导出含公寓存档');
  Store.clearSession();
  const imported = Store.importAll({
    app: 'couple-voyage',
    settings: { maxStar: 4, names: { a: '甲', b: '乙' } },
    session: { id: 'import-old', phase: 'play', resources: { heart: 2 }, hand: ['x'] },
    history: [{ id: 'h1', kind: 'voyage', title: '以前的夜航', endingName: '天亮之前' }]
  });
  ok(imported.ok, '旧导出能导入');
  ok(Store.getSession() === null, '导入的旧局不会被续玩');
  ok(Store.getHistory().some((x) => x.id === 'import-old'), '导入的旧局在以前的夜');
  ok(Store.getSettings().maxStar === 4 && Store.getSettings().names.a === '甲', '尺度和名字跟着进来');
}

console.log('\n' + passed + ' passed, ' + failed.length + ' failed');
if (failed.length) {
  failed.forEach((f) => console.error(' - ' + f));
  process.exit(1);
}
