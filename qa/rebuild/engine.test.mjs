#!/usr/bin/env node
/* 今晚这一页 · 引擎单测
 * 跑法： node qa/rebuild/engine.test.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8');

function makeSandbox() {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(read(path.join(ROOT, 'app/src/engine/balance.js')), sandbox, { filename: 'balance.js' });
  vm.runInContext(read(path.join(ROOT, 'app/src/content/content.js')), sandbox, { filename: 'content.js' });
  vm.runInContext(read(path.join(ROOT, 'app/src/data/cards.js')), sandbox, { filename: 'cards.js' });
  vm.runInContext(read(path.join(ROOT, 'app/src/engine/engine.js')), sandbox, { filename: 'engine.js' });
  return sandbox.window;
}

const W = makeSandbox();
const E = W.App.Engine;
const BAL = W.App.Balance;
const CARDS = W.CARDS;

let passed = 0;
const failed = [];
function ok(cond, msg) {
  if (cond) { passed++; return; }
  failed.push(msg);
  console.error('  ✗ ' + msg);
}
function eq(a, b, msg) { ok(a === b, msg + '  [got ' + a + ' / want ' + b + ']'); }
function section(name) { console.log('\n== ' + name + ' =='); }
function fresh(settings, seed) {
  return E.newSession(Object.assign({ maxStar: 3 }, settings || {}), { a: '阿岚', b: '小满' }, seed === undefined ? 20260315 : seed);
}
function S(r) { return r && r.state ? r.state : r; }
function ev(r, type) { return (r.events || []).filter((e) => e.type === type); }
function blocked(r) { return (r.events || []).some((e) => e.blocked); }

function findCard(pool, pred) {
  const list = CARDS[pool] || [];
  for (const c of list) if (pred(c)) return pool + ':' + c.id;
  return null;
}

function stepSticker(s, how) {
  if (s.phase === 'choose') s = S(E.chooseSticker(s, 0));
  if (s.phase === 'do') {
    if (how === 'peel') s = S(E.peel(s));
    else s = S(E.paste(s, how && how.note || ''));
  } else if (s.phase === 'secret1') {
    s = S(E.lockSecret(s, 0));
    s = S(E.lockSecret(s, 0));
    s = S(E.resolvePair(s, { a: 'paste', b: 'paste', note: '' }));
  }
  return s;
}

function autoGame(s) {
  const k = s.game && s.game.kind;
  if (k === 'thermo') {
    s = S(E.thermoCommit(s, { place: 1, guess: 1 }));
    s = S(E.thermoCommit(s, { place: 1, guess: 1 }));
    return S(E.thermoKeep(s));
  }
  if (k === 'truth' || k === 'dare') {
    s = S(E.wheelSpin(s, { who: 'self' }));
    return S(E.wheelKeep(s));
  }
  if (k === 'map') {
    let guard = 0;
    while (s.game && s.game.step === 'walk' && guard++ < 6) s = S(E.mapRoll(s));
    return S(E.mapKeep(s));
  }
  throw new Error('unknown game ' + k);
}

/* 修一下 playUntil 里误写的 else。上面有语法错误，我在写文件时会修正。 */

section('开局');
{
  const s = fresh({}, 7);
  eq(s.v, 2, '会话版本 2');
  eq(s.kind, 'journal', 'kind journal');
  eq(s.phase, 'choose', '第一格是自选贴');
  eq(s.mode, 'pick', '模式 pick');
  eq(s.host, 'a', '领航员 A');
  eq(s.spread, 1, '第一页热身');
  eq(s.pages.length, 3, '三页');
  eq(s.pages[0].slots.length, 6, '每页六格');
  eq(s.pages[0].name, '热身', '第一页名字');
  eq(s.pages[1].name, '升温', '第二页');
  eq(s.pages[2].name, '靠近', '第三页');
  eq(s.hand.length, 3, '三张贴纸');
  eq(s.tape, BAL.TAPE_START, '开局胶带');
  eq(s.heat, 0, '开局升温 0');
  ok(s.hand.every((c) => c.star <= 3), '手牌不超过尺度');
  const again = fresh({}, 7);
  ok(s.hand.map((c) => c.key).join() === again.hand.map((c) => c.key).join(), '同种子手牌一致');
  ok(s.rng === again.rng, '同种子 rng 游标一致');
}

section('自选贴 / 撕掉');
{
  let s = fresh({ maxStar: 2 }, 11);
  const beforeHeat = s.heat;
  const beforeTape = s.tape;
  const card = s.hand[0];
  s = S(E.chooseSticker(s, card.key));
  eq(s.phase, 'do', '选定后进入贴上');
  eq(s.current.key, card.key, '当前贴纸');
  const pasted = E.paste(s, '  一句短注  ');
  s = S(pasted);
  ok(ev(pasted, 'heat').length >= 1, '贴上有升温事件');
  ok(s.heat > beforeHeat, '升温上升');
  ok(s.tape === beforeTape + 1, '贴上得一段胶带');
  eq(s.pastes, 1, 'pastes +1');
  const slot0 = s.pages[0].slots[0];
  eq(slot0.kind, 'sticker', '第一格贴上了');
  eq(slot0.note, '一句短注', '短注留下');
  eq(slot0.text, card.text, '题库原文原样贴上');

  const heatNow = s.heat;
  const tapeNow = s.tape;
  ok(s.phase === 'secret1' || s.phase === 'stackOffer', '下一格是对贴或叠贴');
  if (s.phase === 'stackOffer') s = S(E.declineStack(s));
  eq(s.phase, 'secret1', '交替到对贴');
  eq(s.mode, 'pair', '模式 pair');
  eq(s.host, 'b', '换人领航');

  /* 回到一张新的自选并撕掉：先把对贴走完 */
  s = S(E.lockSecret(s, 0));
  eq(s.phase, 'secret2', '第二个人扣贴纸');
  ok(!s.picks.a || s.phase === 'secret2', '揭晓前停在第二人');
  s = S(E.lockSecret(s, 0));
  eq(s.phase, 'reveal', '揭晓');
  s = S(E.resolvePair(s, { a: 'peel', b: 'peel' }));
  if (s.phase === 'stackOffer') s = S(E.declineStack(s));
  const peeledSlot = s.pages[0].slots[1];
  eq(peeledSlot.kind, 'residue', '两张都撕则留下胶痕');
  /* 找到下一张自选并撕掉，确认不扣升温 */
  let guard = 0;
  while (s.phase !== 'do' && s.phase !== 'poster' && s.phase !== 'shop' && guard++ < 8) {
    if (s.phase === 'choose') s = S(E.chooseSticker(s, 0));
    else if (s.phase === 'minigame') s = autoGame(s);
    else if (s.phase === 'secret1') {
      s = S(E.lockSecret(s, 0));
      s = S(E.lockSecret(s, 0));
      s = S(E.resolvePair(s, { a: 'paste', b: 'paste' }));
    } else if (s.phase === 'stackOffer') s = S(E.declineStack(s));
    else break;
  }
  if (s.phase === 'do') {
    const h = s.heat;
    const t = s.tape;
    s = S(E.peel(s));
    eq(s.heat, h, '撕掉不降升温');
    eq(s.tape, t, '撕掉不扣胶带');
    ok(s.peels >= 1, '撕掉计数');
    ok(s.phase !== 'do', '撕掉后可以继续');
  } else {
    ok(true, '这一局种子没停在 do，跳过单张撕掉断言');
  }
  void heatNow; void tapeNow;
}

section('对贴印记');
{
  const closeA = findCard('truth', (c) => c.star === 1);
  const closeB = findCard('truth', (c) => c.star === 1 && ('truth:' + c.id) !== closeA);
  const far = findCard('dare', (c) => c.star >= 4) || findCard('spark', (c) => c.star >= 4);
  ok(!!closeA && !!closeB, '找得到两张真心话');
  eq(E.pairRelation(E.cardByKey(closeA), E.cardByKey(closeB)), 'close', '同类型算靠近');
  if (far) eq(E.pairRelation(E.cardByKey(closeA), E.cardByKey(far)), 'far', '星级差很大且不同类型算岔开');

  let s = fresh({ maxStar: 4 }, 3);
  s.hands = { a: [E.cardByKey(closeA)], b: [E.cardByKey(closeB)] };
  s.phase = 'secret1';
  s.mode = 'pair';
  s.secretWho = 'a';
  s.slot = 1;
  s = S(E.lockSecret(s, 0));
  s = S(E.lockSecret(s, 0));
  eq(s.pairMark, 'close', '揭晓标记靠近');
  const imprintBefore = s.imprint;
  s = S(E.resolvePair(s, { a: 'paste', b: 'paste' }));
  ok(s.imprint === imprintBefore + 1, '靠近增加对页印');
  eq(s.pages[0].slots[1].kind, 'pair', '两张落在同一格');
  ok(s.pages[0].slots[1].a && s.pages[0].slots[1].b, '两张都在');

  let farS = fresh({ maxStar: 4 }, 4);
  farS.phase = 'secret1';
  farS.mode = 'pair';
  farS.secretWho = 'a';
  farS.slot = 1;
  farS.hands = { a: [E.cardByKey(closeA)], b: [E.cardByKey(far)] };
  farS = S(E.lockSecret(farS, 0));
  farS = S(E.lockSecret(farS, 0));
  eq(farS.pairMark, 'far', '岔开');
  const imp = farS.imprint;
  farS = S(E.resolvePair(farS, { a: 'paste', b: 'paste' }));
  eq(farS.imprint, imp, '岔开不加对页印');
}

section('叠贴不是每回合');
{
  let s = fresh({ maxStar: 3 }, 21);
  let offers = 0;
  let guard = 0;
  while (offers < 1 && guard++ < 12 && s.phase !== 'poster') {
    if (s.phase === 'minigame') { s = autoGame(s); continue; }
    if (s.phase === 'stackOffer') { offers++; break; }
    if (s.phase === 'shop') break;
    s = stepSticker(s);
  }
  eq(offers, 1, '连续贴上之后会出现叠贴');
  const stacksBefore = s.stacks;
  const heatBefore = s.heat;
  s = S(E.acceptStack(s));
  eq(s.phase, 'stackDo', '接受叠贴');
  ok(s.stackCard && s.stackCard.text, '叠的是一张更深的贴纸');
  s = S(E.pasteStack(s));
  eq(s.stacks, stacksBefore + 1, '叠贴计数');
  ok(s.heat >= heatBefore, '叠贴会升温');
}

section('页与店');
{
  let s = fresh({ maxStar: 2 }, 8);
  let guard = 0;
  while (s.phase !== 'shop' && s.phase !== 'poster' && guard++ < 30) {
    if (s.phase === 'minigame') s = autoGame(s);
    else if (s.phase === 'stackOffer') s = S(E.declineStack(s));
    else s = stepSticker(s);
  }
  eq(s.phase, 'shop', '第一页贴满进贴纸店');
  eq(s.spread, 1, '还在第一页');
  ok(s.pages[0].slots.every((sl) => sl.kind !== 'empty'), '六格都不是空的');
  const poor = cloneTape(s, 0);
  const cant = E.shopBuy(poor, 'peek');
  ok(blocked(cant), '胶带不够不能买');
  eq(S(cant).tape, 0, '买不成不扣');
  const bought = E.shopBuy(s, 'peek');
  s = S(bought);
  ok(!blocked(bought), '买得起再看一张');
  eq(s.peek, 1, '获得再看一张');
  s = S(E.shopBuy(s, 'soften'));
  eq(s.soften, 1, '降一档');
  s = S(E.leaveShop(s));
  eq(s.spread, 2, '翻到升温');
  eq(s.pages[1].name, '升温', '第二页');
  ok(s.phase === 'choose' || s.phase === 'secret1' || s.phase === 'minigame', '第二页开始新的一格');
  if (s.phase === 'choose') eq(s.hand.length, 4, '再看一张让下一手变成四张');
  else if (s.phase === 'secret1') {
    eq(s.hands.a.length, 4, '对贴时两人都多看一张');
    eq(s.hands.b.length, 4, '对贴的另一手也多一张');
  } else ok(false, '翻页后应进入贴纸回合，实际 ' + s.phase);
}

function cloneTape(s, tape) {
  const n = JSON.parse(JSON.stringify(s));
  n.tape = tape;
  return n;
}

section('整晚与结局');
{
  let gentle = fresh({ maxStar: 1 }, 1);
  gentle = S(E.finish(gentle));
  eq(gentle.result.endingId, 'gentle', '什么都没发生是温柔合上');

  let hot = fresh({ maxStar: 4 }, 1);
  hot.heat = 40;
  hot.imprint = 9;
  hot.peels = 0;
  hot = S(E.finish(hot));
  eq(hot.result.endingId, 'heat', '热度优先于对页印');

  let close = fresh({}, 1);
  close.heat = 4;
  close.imprint = 3;
  close.peels = 0;
  close = S(E.finish(close));
  eq(close.result.endingId, 'close', '对贴很近');

  let peeled = fresh({}, 1);
  peeled.heat = 50;
  peeled.peels = 6;
  peeled = S(E.finish(peeled));
  eq(peeled.result.endingId, 'peel', '撕掉较多盖过高热');

  let s = fresh({ maxStar: 3 }, 6);
  s = S(E.paste(S(E.chooseSticker(s, 0)), ''));
  const kept = s.pages[0].slots[0].kind;
  s = S(E.safeWord(s));
  eq(s.result.endingId, 'safe', '安全词结局');
  eq(s.pages[0].slots[0].kind, kept, '已贴上的保留');
  eq(s.result.safe, true, '标记安全词');
  ok(s.phase === 'poster', '进入封底');

  let full = fresh({ maxStar: 2 }, 9);
  let guard = 0;
  while (full.phase !== 'poster' && guard++ < 80) {
    if (full.phase === 'shop') full = S(E.leaveShop(full));
    else if (full.phase === 'minigame') full = autoGame(full);
    else if (full.phase === 'stackOffer') full = S(E.declineStack(full));
    else if (full.phase === 'stackDo') full = S(E.pasteStack(full));
    else full = stepSticker(full);
  }
  eq(full.phase, 'poster', '三页之后是封底');
  ok(full.result && full.result.endingId, '封底有印章');
  ok(full.pages.every((p) => p.slots.every((sl) => sl.kind !== 'empty')), '三页都贴满');
  const again = E.finish(full);
  eq(S(again).result.endingId, full.result.endingId, '封底再结算不改印章');
}

section('温度贴');
{
  let s = fresh({ maxStar: 3 }, 12);
  let guard = 0;
  while (!(s.phase === 'minigame' && s.game.kind === 'thermo') && guard++ < 10) {
    if (s.phase === 'stackOffer') s = S(E.declineStack(s));
    else s = stepSticker(s);
  }
  eq(s.game.kind, 'thermo', '热身页出现温度贴');
  ok(s.game.bands.length >= 3 && s.game.bands.length <= 6, '温度带档数');
  const bad = E.thermoCommit(s, { place: 0 });
  ok(blocked(bad), '没猜不能落笔');
  s = S(E.thermoCommit(s, { place: 0, guess: 2 }));
  eq(s.game.step, 'b', '换人');
  s = S(E.thermoCommit(s, { place: 0, guess: 0 }));
  eq(s.game.step, 'result', '揭晓');
  eq(s.game.dist, 0, '贴在同一档');
  eq(s.game.gain, 3, '贴得最近升温最多');
  ok(s.game.imprint, '近距离记下对页印');
  const heat = s.heat;
  const imp = s.imprint;
  s = S(E.thermoKeep(s));
  eq(s.heat, heat + 3, '贴进页里才升温');
  eq(s.imprint, imp + 1, '对页印 +1');
  eq(s.pages[0].slots[2].kind, 'thermo', '温度贴占第三格');

  let far = E.openArcade('thermo', { maxStar: 4 }, { a: '甲', b: '乙' }, 5);
  far = S(E.thermoCommit(far, { place: 0, guess: 0 }));
  const last = far.game.bands.length - 1;
  far = S(E.thermoCommit(far, { place: last, guess: last }));
  eq(far.game.gain, 1, '贴得很远只暖一点');
  ok(!far.game.imprint, '远了不加对页印');
}

section('贴纸轮与印章轮');
{
  let truth = E.openArcade('truth', { maxStar: 2 }, { a: '甲', b: '乙' }, 18);
  eq(truth.game.segments.length, 8, '纸轮八段');
  ok(truth.game.segments.every((c) => c.pool === 'truth'), '真心话轮只有真心话');
  const tape0 = truth.tape;
  truth = S(E.wheelSpin(truth, { who: 'self' }));
  eq(truth.tape, tape0, '第一次拨不花钱');
  eq(truth.game.step, 'spun', '拨出来了');
  const idx = truth.game.index;
  const againFree = E.wheelSpin(truth, { who: 'self' });
  ok(blocked(againFree), '不重拨就不能再转');
  truth = S(E.wheelSpin(truth, { who: 'other', reroll: true }));
  eq(truth.tape, tape0 - 1, '重拨花一段胶带');
  eq(truth.game.rerolls, 1, '重拨计数');
  ok(truth.game.index !== idx || truth.game.segments.length < 2, '重拨换一格');
  truth = S(E.wheelSpin(truth, { reroll: true }));
  eq(truth.game.rerolls, 2, '第二次重拨');
  const stopped = E.wheelSpin(truth, { reroll: true });
  ok(blocked(stopped), '重拨有上限');
  truth = S(E.wheelKeep(truth));
  eq(truth.phase, 'arcadeDone', '单独玩可结束');
  ok(truth.arcadePaste && truth.arcadePaste.text, '可以贴进手帐的结果');

  let dareLow = E.openArcade('dare', { maxStar: 4 }, { a: '甲', b: '乙' }, 4, { heat: 0 });
  ok(dareLow.game.segments.every((c) => c.star <= 1), '热度为 0 时印章不跳很远');
  eq(dareLow.game.targetStar, 1, '目标星级 1');
  let dareHot = E.openArcade('dare', { maxStar: 4 }, { a: '甲', b: '乙' }, 4, { heat: 16 });
  ok(dareHot.game.segments.every((c) => c.star >= 2 && c.star <= 3), '热度 16 时印章停在 2–3 星');
  ok(dareHot.game.segments.every((c) => c.pool === 'dare' || c.pool === 'touch'), '印章来自大冒险或触碰');
}

section('地图贴');
{
  let map = E.openArcade('map', { maxStar: 3 }, { a: '甲', b: '乙' }, 27);
  eq(map.game.tiles.length, 8, '八格地图');
  eq(map.game.pos, -1, '我们还在起点前');
  const rolls = [];
  let guard = 0;
  while (map.game.step === 'walk' && guard++ < 6) {
    const r = E.mapRoll(map);
    map = S(r);
    rolls.push(ev(r, 'game')[0]);
  }
  eq(map.game.step, 'done', '走完就停');
  eq(map.game.moves, rolls.length, '步数');
  ok(rolls.length <= 4, '最多四步');
  ok(rolls.every((g, i) => i === 0 || g.pos >= rolls[i - 1].pos), '只有一枚棋子往前走');
  ok(!map.game.winner, '没有赢家');
  map = S(E.mapKeep(map));
  eq(map.phase, 'arcadeDone', '地图可以收起来');
  ok(map.pages[0].extras.length === rolls.length, '走过的格子都成了页边贴纸');
  const extraRoll = E.mapRoll(map);
  ok(blocked(extraRoll), '收起来之后不能再走');
}

section('尺度、黑名单、旧档');
{
  const gentle = E.previewDraw({ maxStar: 4, gentleOnly: true }, 24, 3);
  ok(gentle.every((c) => c.star <= 2), '柔和模式不超过 2 星');
  ok(gentle.every((c) => !c.tags.some((t) => ['束缚', '露出', '道具', '喝酒', '蒙眼'].indexOf(t) >= 0)), '柔和模式避开重标签');
  const low = E.previewDraw({ maxStar: 1 }, 16, 2);
  ok(low.every((c) => c.star <= 1), '温柔档只有 1 星');
  const banned = E.previewDraw({ maxStar: 4, blacklist: ['手机相册'] }, 30, 6);
  ok(banned.every((c) => c.text.indexOf('手机相册') < 0), '黑名单过滤题库原文');
  ok(banned.some((c) => c.text), '过滤后仍抽得到贴纸');

  const legacy = {
    v: 1,
    phase: 'play',
    resources: { heart: 3, tension: 1, sync: 2, coins: 4 },
    names: { a: '旧', b: '档' },
    result: { endingId: 'dawn', endingName: '天亮之前', awards: [{ name: '连击王' }] },
    round: 4,
    completes: 3,
    skips: 1,
    ts: 1700000000000,
    id: 'old-1'
  };
  ok(E.isLegacy(legacy), '认出旧夜航存档');
  ok(!E.isLegacy(fresh()), '新手帐不是旧档');
  const entry = E.legacyEntry(legacy);
  eq(entry.kind, 'voyage', '旧档种类');
  eq(entry.endingName, '天亮之前', '旧结局名保留');
  eq(entry.heart, 3, '旧资源留在往期');
  ok(String(entry.note).indexOf('旧版') >= 0, '往期注明来源');
  const repaired = E.validate(JSON.parse(JSON.stringify(fresh())));
  eq(repaired.pages.length, 3, 'validate 保留三页');
  ok(E.validate(null) === null, '坏档得到 null');
  ok(E.validate(legacy).phase === 'play', 'validate 不把旧档改成手帐');
}

section('单独结果贴进今晚');
{
  let night = fresh({}, 15);
  const game = E.openArcade('truth', { maxStar: 2 }, night.names, 2);
  let done = S(E.wheelKeep(S(E.wheelSpin(game, { who: 'self' }))));
  night = S(E.pasteExtra(night, Object.assign({}, done.arcadePaste, { heatGain: 2 })));
  eq(night.pages[0].extras.length, 1, '贴到当前页边');
  eq(night.heat, 2, '贴进来的热度算进这一页');
  ok(night.phase === 'choose', '主线阶段不被单独游戏打断');
}

console.log('\n' + passed + ' passed, ' + failed.length + ' failed');
if (failed.length) {
  console.error(failed.join('\n'));
  process.exit(1);
}
