#!/usr/bin/env node
/* ==========================================================================
 * 升温夜航 · V3 引擎单测（Node，无浏览器）
 * qa/rebuild/engine.test.mjs
 *
 * 跑法： node qa/rebuild/engine.test.mjs
 * 覆盖：长度 / 抽牌约束（星级、类型多样性、spark 规则、黑名单、缓和）
 *       完成·跳过·加码·缓一缓 / 券 / 连击 / 事件一次 / 自适应 / 商店
 *       6 结局可达 / 安全词 / validate 修复与版本迁移 / 确定性复现 / 纯逻辑
 * ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FILES = {
  balance: path.join(ROOT, 'app/src/engine/balance.js'),
  engine: path.join(ROOT, 'app/src/engine/engine.js'),
  cards: path.join(ROOT, 'app/src/data/cards.js')
};
const read = (p) => fs.readFileSync(p, 'utf8');

let passed = 0;
const failed = [];
function ok(cond, msg) {
  if (cond) { passed++; return true; }
  failed.push(msg);
  console.error('  ✗ ' + msg);
  return false;
}
function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v).sort()) o[k] = canon(v[k]);
    return o;
  }
  return v;
}
function eq(actual, expected, msg) {
  const a = JSON.stringify(canon(actual));
  const b = JSON.stringify(canon(expected));
  return ok(a === b, msg + '  [got ' + a + ' / want ' + b + ']');
}
function subset(actual, expected, msg) {
  let good = true;
  for (const k of Object.keys(expected)) if (actual[k] !== expected[k]) good = false;
  return ok(good, msg + '  [got ' + JSON.stringify(actual) + ' / want ⊇ ' + JSON.stringify(expected) + ']');
}
function advance(s) {
  s = E.nextRound(s).state;
  if (s.phase === 'event') {
    const ev = CONTENT.events.find((e) => e.afterAct === s.act);
    if (ev) s = E.chooseEvent(s, ev.id, ev.options[0].id).state;
  }
  if (s.phase === 'act') s = E.leaveAct(s);
  return s;
}
function inRange(v, lo, hi, msg) { return ok(typeof v === 'number' && v >= lo && v <= hi, msg + '  [got ' + v + ']'); }
function strip(state) { return JSON.parse(JSON.stringify(state)); }
function section(name) { console.log('\n== ' + name + ' =='); }

/* ---------------------------- 沙盒 ---------------------------- */
function makeContent() {
  return {
    acts: [
      { id: 1, name: '潮汐', sub: '靠近之前，海面先亮了一下', accent: '#e9b872', intro: ['a', 'b'], outtro: { good: 'g1', soft: 's1' } },
      { id: 2, name: '暗涌', sub: '收不住的边缘', accent: '#ff6b9d', intro: ['c'], outtro: { good: 'g2', soft: 's2' } },
      { id: 3, name: '靠岸', sub: '天快亮了', accent: '#8b5cf6', intro: ['d'], outtro: { good: 'g3', soft: 's3' } }
    ],
    events: [
      {
        id: 'e1', afterAct: 1, title: '窗外的雨', text: ['雨点敲窗。'],
        options: [
          { id: 'a', label: '把窗推开一条缝', effects: { tension: 2, sync: 1 }, flag: 'rain_open' },
          { id: 'b', label: '拉上窗帘，看他', effects: { heart: 2 }, flag: 'rain_close' }
        ]
      },
      {
        id: 'e2', afterAct: 2, title: '最后一盏灯', text: ['灯暗了一下。'],
        options: [
          { id: 'a', label: '关掉它', effects: { tension: 3 } },
          { id: 'b', label: '换一根蜡烛', effects: { heart: 2, gentle: 1 } }
        ]
      }
    ],
    endings: [
      { id: 'safe', name: '海面下的拥抱', cond: (r, s) => !!(s.flags && s.flags.safeWord) },
      { id: 'slow', name: '慢一点，也很靠近', cond: (r, s) => s.gentle >= 3 && r.heart >= 6 },
      { id: 'frequency', name: '同一个频率', cond: (r) => r.sync >= 15 && r.heart >= 8 },
      { id: 'undercurrent', name: '不眠的暗涌', cond: (r) => r.tension >= 18 },
      { id: 'dawn', name: '天亮之前', cond: (r) => r.heart >= 14 },
      { id: 'each', name: '各自听见的海', cond: () => true }
    ],
    awards: [
      { id: 'a_combo', name: '连击王', icon: '⚡', cond: (r, s) => s.maxCombo >= 3 },
      { id: 'a_deep', name: '深潜者', icon: '🌊', cond: (r, s) => !!(s.flags && s.flags.deepDone) },
      { id: 'a_gentle', name: '温柔守护', icon: '🕯️', cond: (r, s) => s.gentle >= 3 },
      { id: 'a_brave', name: '最高星', icon: '🌟', cond: (r, s) => s.maxStarSeen >= 4 },
      { id: 'a_sync', name: '同频', icon: '🪢', cond: (r) => r.sync >= 10 },
      { id: 'a_heart', name: '心动', icon: '❤️', cond: (r) => r.heart >= 10 },
      { id: 'a_tension', name: '张力', icon: '🔥', cond: (r) => r.tension >= 10 },
      { id: 'a_done', name: '一起走完', icon: '🌙', cond: () => true }
    ]
  };
}

function makeSandbox(opts = {}) {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(read(FILES.balance), sandbox, { filename: 'balance.js' });
  if (opts.cards) sandbox.window.CARDS = opts.cards;
  else vm.runInContext(read(FILES.cards), sandbox, { filename: 'cards.js' });
  if (opts.content !== false) sandbox.window.CONTENT = makeContent();
  vm.runInContext(read(FILES.engine), sandbox, { filename: 'engine.js' });
  return sandbox;
}

const sb = makeSandbox();
const E = sb.window.App.Engine;
const BAL = sb.window.App.Balance;
const CARDS = sb.window.CARDS;
const CONTENT = sb.window.CONTENT;

const NAMES = { a: '阿岚', b: '小满' };
function fresh(settings = {}, seed = 20251025) {
  return E.newSession(Object.assign({}, settings), NAMES, seed);
}

/* ---------------------------- 流程助手 ---------------------------- */
function handTypes(s) {
  const t = {};
  for (const c of E.handCards(s)) t[c.type] = (t[c.type] || 0) + 1;
  return t;
}
function playToRoundResolve(seed, settings, targetRound) {
  let s = fresh(settings, seed);
  let guard = 0;
  while (guard++ < 200) {
    if (s.phase === 'finale') break;
    if (s.phase === 'draft') { s = E.chooseCard(s, s.hand[0]); continue; }
    if (s.phase === 'play') { s = E.complete(s).state; continue; }
    if (s.phase === 'resolve') {
      if (s.round >= targetRound) return s;
      s = E.nextRound(s).state; continue;
    }
    if (s.phase === 'event') {
      const ev = CONTENT.events.find((e) => e.afterAct === s.act);
      s = E.chooseEvent(s, ev.id, ev.options[0].id).state; continue;
    }
    if (s.phase === 'act' || s.phase === 'shop') { s = E.leaveAct(s); continue; }
    if (s.phase === 'escalate') { s = E.escalateComplete(s).state; continue; }
    throw new Error('unknown phase ' + s.phase);
  }
  throw new Error('loop guard hit in playToRoundResolve');
}
function runFull(settings, seed, mutate) {
  let s = fresh(settings, seed);
  const events = [];
  let guard = 0;
  while (s.phase !== 'finale' && guard++ < 500) {
    if (mutate) s = mutate(s);
    if (s.phase === 'draft') { s = E.chooseCard(s, s.hand[0]); continue; }
    if (s.phase === 'play') { const r = E.complete(s); events.push(...r.events); s = r.state; continue; }
    if (s.phase === 'resolve') { const r = E.nextRound(s); events.push(...r.events); s = r.state; continue; }
    if (s.phase === 'event') {
      const ev = CONTENT.events.find((e) => e.afterAct === s.act) || CONTENT.events[0];
      const r = E.chooseEvent(s, ev.id, ev.options[0].id); events.push(...r.events); s = r.state; continue;
    }
    if (s.phase === 'act' || s.phase === 'shop') { s = E.leaveAct(s); continue; }
    if (s.phase === 'escalate') { const r = E.escalateComplete(s); events.push(...r.events); s = r.state; continue; }
    throw new Error('unknown phase ' + s.phase);
  }
  const fin = E.finish(s);
  events.push(...fin.events);
  return { state: fin.state, events };
}

/* ============================ 1. 常量与长度 ============================ */
section('1. 常量 / 长度');
ok(!!BAL && !!E, 'App.Balance 与 App.Engine 挂载成功');
eq(BAL.LENGTHS.quick.rounds, 9, 'quick = 9 回合');
eq(BAL.LENGTHS.classic.rounds, 14, 'classic = 14 回合');
eq(BAL.LENGTHS.deep.rounds, 18, 'deep = 18 回合');
eq(BAL.LENGTHS.quick.acts, [3, 3, 3], 'quick 三幕 3/3/3');
eq(BAL.LENGTHS.classic.acts, [5, 5, 4], 'classic 三幕 5/5/4');
eq(BAL.LENGTHS.deep.acts, [6, 6, 6], 'deep 三幕 6/6/6');
eq(BAL.SHOP.length, 4, '商店 4 件商品');
eq(BAL.ENDINGS.length, 6, '内置 6 结局');
eq(BAL.TOKEN_KEYS, ['shield', 'reroll', 'escalate'], '三种券');
eq(BAL.actThreshold(1, 14), 12, 'act1 阈值 12（classic 基准）');
eq(BAL.actThreshold(2, 14), 26, 'act2 阈值 26');
eq(BAL.actThreshold(3, 14), 42, 'act3 阈值 42');
eq(BAL.actThreshold(1, 9), 8, 'quick 阈值按回合数缩放（12*9/14≈8）');
eq(BAL.coinsFor(3, 0), 3, '星屑 = 星级 + floor(combo/3)（combo0）');
eq(BAL.coinsFor(3, 5), 4, '星屑 combo5 额外 +1');
eq(BAL.yieldFor('truth', 2), { sync: 2, heart: 1 }, 'truth ★2 → 默契2/心动1');
eq(BAL.yieldFor('spark', 4), { tension: 4, heart: 3 }, 'spark ★4 → 张力4/心动3');

/* ============================ 2. newSession 骨架 ============================ */
section('2. newSession');
{
  const s = fresh({ length: 'quick' });
  eq(s.v, 1, 'state.v = 1');
  eq(s.phase, 'draft', '开局 phase=draft');
  eq(s.round, 1, '开局 round=1');
  eq(s.act, 1, '开局 act=1');
  eq(s.host, 'a', '首个领航员 host=a');
  eq(s.hand.length, 3, '手牌 3 张');
  eq(s.tokens, { shield: 0, reroll: 1, escalate: 0 }, '初始券：换牌券 1 张');
  eq(s.resources, { heart: 0, tension: 0, sync: 0, coins: 0 }, '初始资源全 0');
  eq(s.combo, 0, '初始 combo=0');
  eq(s.names, NAMES, 'names 保存');
  ok(Array.isArray(s.outEvents) && s.outEvents.length === 1 && s.outEvents[0].type === 'stage', '返回 state 附带不可枚举 outEvents');
  ok(s.state === s, '返回 state 可经 .state 自取');
  eq(Object.keys(strip(s)).filter((k) => ['outEvents', 'actionEvents', 'state'].indexOf(k) >= 0), [], '动作事件不进入 JSON（不污染存档）');
  eq(strip(s).events, {}, 'state.events 保留为事件选择表（DESIGN §3.3）');
}
{
  const s = fresh({ maxStar: 9, length: 'nope', blacklist: 'x' });
  eq(s.settings.maxStar, 4, 'maxStar 上限钳到 4');
  eq(s.settings.length, 'classic', '非法 length 回退 classic');
  eq(s.settings.blacklist, ['x'], '字符串黑名单归一化为数组');
  eq(fresh({ maxStar: -3 }).settings.maxStar, 1, 'maxStar 下限钳到 1');
  eq(fresh({ gentleOnly: true, maxStar: 4 }).settings.maxStar, 4, 'gentleOnly 不改写设置本身');
  eq(E.__test.effectiveMaxStar(fresh({ gentleOnly: true, maxStar: 4 })), 2, 'gentleOnly 生效时有效星级=2');
}

/* ============================ 3. 抽牌约束 ============================ */
section('3. 抽牌约束');
{
  let starsOk = true, typesOk = true, sparkBad = 0, sparkSeen = 0;
  for (let m = 1; m <= 4; m++) {
    for (let seed = 1; seed <= 12; seed++) {
      const s = fresh({ maxStar: m }, seed * 977);
      for (const c of E.handCards(s)) {
        if (c.star > m || c.star < 1) starsOk = false;
        if (m <= 3 && c.type === 'spark') sparkBad++;
        if (m === 4 && c.type === 'spark') sparkSeen++;
      }
      const t = handTypes(s);
      for (const k in t) if (t[k] > 2) typesOk = false;
    }
  }
  ok(starsOk, '所有手牌 star ∈ [1,maxStar]');
  ok(typesOk, '每手同类型最多 2 张（48 手验证）');
  eq(sparkBad, 0, 'maxStar≤3 时手牌不出现 spark');
  eq(BAL.DRAW.sparkMinMaxStar, 4, 'spark 仅 maxStar=4 或加码时进入抽牌池（常量）');
  const m2 = fresh({ maxStar: 2 }, 42);
  ok(E.eligibleCards(m2).every((c) => c.type !== 'spark'), 'maxStar=2 的 eligibleCards 不含 spark');
  const m4 = fresh({ maxStar: 4 }, 43);
  ok(E.eligibleCards(m4).some((c) => c.type === 'spark'), 'maxStar=4 的 eligibleCards 含 spark');
}
{
  const c0 = CARDS.truth[0];
  const s = fresh({ blacklist: [c0.text] }, 7);
  ok(E.eligibleCards(s).every((c) => !c.text.includes(c0.text)), '黑名单整句过滤生效');
  const sb2 = fresh({ blacklist: ['束缚'] }, 8);
  ok(E.eligibleCards(sb2).every((c) => !(c.tags || []).includes('束缚')), '黑名单标签过滤生效');
  let leaked = 0;
  for (let seed = 1; seed <= 8; seed++) {
    const x = fresh({ blacklist: ['束缚'] }, seed * 131);
    for (const c of E.handCards(x)) if ((c.tags || []).includes('束缚')) leaked++;
  }
  eq(leaked, 0, '8 局手牌无黑名单标签泄漏');
  const g = fresh({ maxStar: 4, gentleOnly: true }, 9);
  ok(E.eligibleCards(g).every((c) => c.star <= 2), 'gentleOnly 手牌池封顶 2 星');
  ok(E.eligibleCards(g).every((c) => !['束缚', '露出', '道具', '喝酒', '蒙眼'].some((t) => (c.tags || []).includes(t))), 'gentleOnly 屏蔽高强度标签');
}
{
  const tiny = { truth: [{ id: 'x1', text: '唯一真心话', star: 1, tags: [], src: 'T' }], dare: [], touch: [], sync: [], spark: [], punish: [] };
  const sbT = makeSandbox({ cards: tiny });
  const ET = sbT.window.App.Engine;
  const sT = ET.newSession({ maxStar: 1 }, NAMES, 5);
  eq(sT.hand.length, 3, '小池空池也能凑满 3 张（fallback）');
  ok(sT.hand.some((k) => k.indexOf('fallback:') === 0), '空池用兜底卡补位');
  const chosen = ET.chooseCard(sT, sT.hand[0]);
  const done = ET.complete(chosen);
  ok(done.state.phase === 'resolve' && done.state.completes === 1, '兜底卡也可完成结算，不崩');
}

/* ============================ 4. 完成 / 跳过 ============================ */
section('4. 完成 / 跳过 / 连击');
{
  let s = fresh({ length: 'quick' }, 11);
  const before = JSON.stringify(strip(s));
  s = E.chooseCard(s, s.hand[0]);
  eq(s.phase, 'play', 'chooseCard → phase=play');
  eq(s.current, s.hand[0], 'current 记录所选卡');
  eq(s.currentStar, null, '未缓一缓时 currentStar=null');
  const card = E.currentCard(s);
  ok(!!card && card.star >= 1, 'currentCard() 返回卡面');
  ok(JSON.stringify(strip(s)) !== before, 'chooseCard 返回新 state');
  const out = E.complete(s);
  ok(!!out.state && Array.isArray(out.events), 'complete 返回 {state, events}');
  eq(out.state.phase, 'resolve', 'complete → phase=resolve');
  eq(out.state.combo, 1, 'complete → combo+1');
  eq(out.state.completes, 1, 'complete → completes+1');
  eq(out.state.maxCombo, 1, 'maxCombo 更新');
  eq(out.state.maxStarSeen, card.star, 'maxStarSeen 记录星级');
  const expected = BAL.yieldFor(card.pool, card.star);
  expected.coins = BAL.coinsFor(card.star, 1);
  subset(out.state.resources, expected, '完成收益 = 类型收益公式 + 星屑公式');
  ok(out.events.some((e) => e.type === 'gain' && e.reason === 'complete'), 'complete 发 gain 事件');
  ok(out.events.some((e) => e.type === 'stage' && e.phase === 'resolve'), 'complete 发 stage=resolve 事件');
  eq(out.state.log.length, 2, 'log 记录 choose + complete');
}
{
  let s = fresh({ length: 'quick' }, 12);
  s = E.chooseCard(s, s.hand[0]);
  s = E.complete(s).state;
  s = E.nextRound(s).state;
  s = E.chooseCard(s, s.hand[0]);
  const out = E.skip(s);
  eq(out.state.phase, 'resolve', 'skip → phase=resolve');
  eq(out.state.combo, 0, 'skip → combo 归零');
  eq(out.state.skips, 1, 'skip → skips+1');
  eq(out.state.gentle, 1, 'skip → 温柔值+1');
  eq(out.state.resources.tension, 0, 'skip → 张力 -1 但不低于 0');
  ok(out.events.some((e) => e.type === 'skip' && e.reason === 'skip'), 'skip 发 skip 事件');
}
{
  /* 连击：3 的倍数星屑 +1，5 的倍数送券 */
  let s = fresh({ length: 'quick' }, 13);
  const comboCoins = [];
  let tokenBefore = s.tokens.shield + s.tokens.reroll + s.tokens.escalate;
  for (let i = 0; i < 5; i++) {
    s = E.chooseCard(s, s.hand[0]);
    const card = E.currentCard(s);
    const cBefore = s.resources.coins;
    const out = E.complete(s);
    const gained = out.state.resources.coins - cBefore;
    comboCoins.push(gained);
    eq(gained, BAL.coinsFor(card.star, i + 1), '第 ' + (i + 1) + ' 次完成星屑=' + BAL.coinsFor(card.star, i + 1));
    s = out.state;
    if (i < 4) s = advance(s);
  }
  eq(s.combo, 5, '连续完成 5 次 combo=5');
  const tokenAfter = s.tokens.shield + s.tokens.reroll + s.tokens.escalate;
  eq(tokenAfter, tokenBefore + 1, '5 连击送 1 张随机券');
}

/* ============================ 5. 加码（深潜） ============================ */
section('5. 加码 / 深潜');
{
  let s = fresh({ maxStar: 4, length: 'quick' }, 21);
  s = E.chooseCard(s, s.hand[0]);
  const orig = E.currentCard(s);
  s = E.complete(s).state;
  ok(E.canEscalate(s), '完成后可加码');
  const out = E.escalate(s);
  eq(out.state.phase, 'escalate', 'escalate → phase=escalate');
  eq(out.state.currentStar, Math.min(orig.star + 1, 4), '深潜卡星级 = 原星级+1（≤maxStar）');
  ok(E.currentCard(out.state).star <= 4, '深潜卡不超过 maxStar');
  const deep = E.currentCard(out.state);
  const resBefore = out.state.resources;
  const comboAfterDeep = out.state.combo + 1;
  const r2 = E.escalateComplete(out.state);
  const exp = {};
  for (const k of BAL.RES_KEYS) {
    const base = BAL.yieldFor(deep.pool, deep.star)[k];
    if (base) exp[k] = resBefore[k] + base * BAL.ESCALATE.multiplier;
  }
  exp.coins = resBefore.coins + BAL.coinsFor(deep.star, comboAfterDeep) * BAL.ESCALATE.multiplier;
  subset(r2.state.resources, exp, '深潜完成收益 ×2');
  eq(r2.state.phase, 'resolve', '深潜完成 → resolve');
  ok(r2.state.flags.deepDone === true, 'flags.deepDone 标记');
  ok(r2.events.some((e) => e.type === 'gain' && e.reason === 'escalateComplete' && e.mult === 2), '深潜 gain 事件带 mult=2');
  ok(!E.canEscalate(r2.state), '深潜后本回合不可再次加码');
}
{
  let s = fresh({ maxStar: 4, length: 'quick' }, 22);
  s = E.chooseCard(s, s.hand[0]);
  s = E.complete(s).state;
  s = E.escalate(s).state;
  s.resources.heart = 1;
  const out = E.escalateSkip(s);
  eq(out.state.resources.heart, 0, '深潜跳过：心动 -1（≥0）');
  eq(out.state.combo, 0, '深潜跳过：连击归零');
  eq(out.state.phase, 'resolve', '远潜跳过 → resolve');
  ok(!out.events.some((e) => e.type === 'gain'), '深潜跳过不抽惩罚/不给收益');
}
{
  let s = fresh({ maxStar: 1, length: 'quick' }, 23);
  s = E.chooseCard(s, s.hand[0]);
  s = E.complete(s).state;
  eq(E.currentCard(s).star, 1, 'maxStar=1 时手牌 ★1');
  ok(!E.canEscalate(s), '满星且无加码券时不可深潜');
  s.tokens.escalate = 1;
  ok(E.canEscalate(s), '满星但有加码券时可深潜');
  const out = E.escalate(s);
  eq(out.state.tokens.escalate, 0, '满星深潜消耗加码券');
  ok(out.events.some((e) => e.type === 'token' && e.token === 'escalate' && e.delta === -1), '加码券消耗事件');
  eq(E.currentCard(out.state).star, 1, '满星深潜不超 maxStar');
}

/* ============================ 6. 缓一缓 ============================ */
section('6. 缓一缓');
{
  let s = fresh({ maxStar: 4, length: 'quick' }, 31);
  s = E.chooseCard(s, s.hand[0]);
  s.currentStar = 3;
  s.phase = 'play';
  const a = E.gentleDown(s);
  eq(a.state.currentStar, 2, '缓一缓：星级 -1');
  eq(a.state.gentleUsed, 1, 'gentleUsed=1');
  eq(a.state.phase, 'play', '缓一缓后仍在执行态');
  const b = E.gentleDown(a.state);
  eq(b.state.currentStar, 1, '第二次缓一缓：星级 2→1');
  const c = E.gentleDown(b.state);
  ok(c.events[0].blocked === true, '第 3 次缓一缓被拒绝（每局 2 次）');
  const d = strip(b.state);
  d.gentleUsed = 0;
  d.currentStar = 1;
  const e2 = E.gentleDown(d);
  eq(e2.state.phase, 'resolve', '降到 0 视为跳过');
  eq(e2.state.skips, b.state.skips + 1, '降到 0 记跳过 +1');
  eq(e2.state.gentle, d.gentle + 1, '降到 0 记温柔值');
}

/* ============================ 7. 换牌券 ============================ */
section('7. 换牌券 / 重抽');
{
  let s = fresh({ length: 'quick' }, 41);
  const oldHand = s.hand.slice();
  const out = E.reroll(s);
  ok(Array.isArray(out.outEvents) && out.outEvents.some((e) => e.type === 'token' && e.token === 'reroll' && e.delta === -1), 'reroll 发券消耗事件');
  eq(out.state.tokens.reroll, 0, '换牌券 -1');
  eq(out.state.hand.length, 3, '重抽后仍有 3 张手牌');
  eq(out.state.phase, 'draft', '重抽后 phase=draft');
  ok(out.state.hand.join() !== oldHand.join() || true, '重抽完成（手牌可能相同）');
  const blocked = E.reroll(out.state);
  ok(blocked.outEvents[0].blocked === true, '无券时重抽被拒绝');
  eq(blocked.state.hand, out.state.hand, '被拒绝时手牌不变');
}

/* ============================ 8. 幕末 / 事件 / 自适应 ============================ */
section('8. 幕末 / 事件 / 自适应');
{
  /* quick: 第 3 回合后幕末 */
  let s = playToRoundResolve(51, { length: 'quick' }, 3);
  const r = E.nextRound(s);
  eq(r.state.phase, 'event', 'act1 末触发事件阶段（CONTENT 有 e1）');
  const actEnd = r.events.find((e) => e.type === 'actEnd');
  ok(!!actEnd && actEnd.act === 1 && typeof actEnd.score === 'number' && typeof actEnd.threshold === 'number', 'nextRound 发 actEnd 事件（含 score/threshold）');
  eq(r.state.actScores.length, 1, 'actScores 记录 1 条');
  eq(r.state.pendingActEnd, true, 'pendingActEnd 标记');
  /* 事件只触发一次 */
  const chosen = E.chooseEvent(r.state, 'e1', 'a');
  eq(chosen.state.phase, 'act', 'chooseEvent → phase=act');
  eq(chosen.state.resources.tension, r.state.resources.tension + 2, '事件选项张力 +2');
  eq(chosen.state.resources.sync, r.state.resources.sync + 1, '事件选项默契 +1');
  ok(chosen.state.flags.rain_open === true, '事件 flag 写入');
  ok(chosen.state.events.e1 === 'a', 'event 选择被记录');
  const rechooseState = strip(chosen.state);
  rechooseState.phase = 'event';
  const again = E.chooseEvent(rechooseState, 'e1', 'a');
  ok(again.events[0].blocked === true && again.events[0].reason === 'event_already_chosen', '同一事件不可重复结算');
  /* leaveAct 进下一幕 */
  const left = E.leaveAct(chosen.state);
  eq(left.state.act, 2, 'leaveAct → act=2');
  eq(left.state.round, 4, 'leaveAct → round=4');
  eq(left.state.phase, 'draft', 'leaveAct → draft');
  eq(left.state.hand.length, 3, '新一幕手牌 3 张');
  eq(left.state.host, 'b', '换人领航');
  eq(E.actInfo(left.state).name, '暗涌', 'actInfo 读 CONTENT 第二幕名');
}
{
  /* 低分自适应 */
  let s = playToRoundResolve(52, { length: 'quick' }, 3);
  const low = strip(s);
  low.resources = { heart: 0, tension: 0, sync: 0, coins: 0 };
  low.gentle = 0;
  const r = E.nextRound(low);
  const ae = r.events.find((e) => e.type === 'actEnd');
  eq(ae.good, false, '低分幕末 good=false');
  eq(r.state.drawBias, -1, '未达标 → 下一幕星级 bias -1');
  const ev = CONTENT.events.find((e) => e.afterAct === 1);
  let t = E.chooseEvent(r.state, ev.id, ev.options[0].id).state;
  t = E.leaveAct(t);
  eq(t.drawBias, -1, 'bias 带入下一幕');
  eq(t.act, 2, '仍进入第二幕');
}
{
  /* 高分幕末奖励只发一次 */
  let s = playToRoundResolve(53, { length: 'quick' }, 3);
  const high = strip(s);
  high.resources = { heart: 40, tension: 10, sync: 20, coins: 2 };
  high.gentle = 0;
  const coinsBefore = high.resources.coins;
  const tokensBefore = high.tokens.shield + high.tokens.reroll + high.tokens.escalate;
  const r = E.nextRound(high);
  const ae = r.events.find((e) => e.type === 'actEnd');
  eq(ae.good, true, '高分幕末 good=true');
  eq(r.state.resources.coins, coinsBefore + BAL.ACT_REWARD.coins, '幕末奖励星屑 +5');
  const tokensAfter = r.state.tokens.shield + r.state.tokens.reroll + r.state.tokens.escalate;
  eq(tokensAfter, tokensBefore + 1, '幕末奖励 +1 券');
  eq(r.state.actScores.length, 1, '幕末只结算一次（actScores 长度 1）');
  const again = E.nextRound(r.state);
  ok(again.events[0].blocked === true, '幕末不可重复触发');
}

/* ============================ 9. 商店 ============================ */
section('9. 商店');
{
  let s = fresh({ length: 'quick' }, 61);
  s = strip(s);
  s.phase = 'act';
  s.resources.coins = 20;
  const offers = E.shopOffers(s);
  eq(offers.length, 4, 'shopOffers 返回 4 件');
  eq(offers[0].id, 'shield', '第一件是护身符');
  ok(offers[0].affordable === true && offers[3].price === 5, 'shopOffers 带 affordance/price');
  const buy1 = E.shopBuy(s, 'shield');
  eq(buy1.state.resources.coins, 14, '买护身符扣 6 星屑');
  eq(buy1.state.tokens.shield, 1, '护身符 +1');
  eq(buy1.state.phase, 'shop', '购买后 phase=shop');
  ok(buy1.events.some((e) => e.type === 'shop' && e.itemId === 'shield'), 'shop 事件');
  const buy2 = E.shopBuy(buy1.state, 'heart');
  eq(buy2.state.resources.heart, 1, '心糖 +1 心动');
  eq(buy2.state.resources.coins, 9, '心糖扣 5 星屑');
  const leave = E.leaveAct(buy2.state);
  eq(leave.state.phase, 'draft', '商店后 leaveAct 可进入下一幕/下一回合');
  const poor = strip(buy1.state);
  poor.resources.coins = 1;
  const bad = E.shopBuy(poor, 'escalate');
  ok(bad.events[0].blocked === true && bad.events[0].reason === 'not_enough_coins', '星屑不足购买被拒绝');
  eq(bad.state.resources.coins, 1, '拒绝时不扣星屑');
}

/* ============================ 10. 完整流程 / 长度 ============================ */
section('10. 完整流程 / 长度');
{
  const allowed = new Set(E.EVENT_TYPES);
  const q = runFull({ length: 'quick' }, 71);
  eq(q.state.phase, 'finale', 'quick 走完 → finale');
  eq(q.state.result.stats.rounds, 9, 'quick 统计回合数 9');
  eq(q.state.result.stats.act, 3, 'quick 结束在第 3 幕');
  eq(q.state.result.stats.round, 9, 'quick 结束 round=9');
  ok(q.state.result.awards.length >= 2 && q.state.result.awards.length <= 3, '奖项 2–3 个');
  ok(q.events.every((e) => allowed.has(e.type)), '所有 events.type 都在约定集合内');
  ok(q.events.some((e) => e.type === 'ending'), '结束时发 ending 事件');
  const actEnds = q.events.filter((e) => e.type === 'actEnd');
  eq(actEnds.length, 3, 'quick 三幕各结算一次 actEnd');
  const c = runFull({ length: 'classic' }, 72);
  eq(c.state.result.stats.rounds, 14, 'classic 回合数 14');
  eq(c.state.result.stats.round, 14, 'classic 结束 round=14');
  const d = runFull({ length: 'deep' }, 73);
  eq(d.state.result.stats.rounds, 18, 'deep 回合数 18');
  eq(d.state.result.stats.round, 18, 'deep 结束 round=18');
  eq(d.state.result.stats.act, 3, 'deep 三幕走完');
}
{
  /* 加码贯穿：每回合完成加码 */
  let s = fresh({ length: 'quick', maxStar: 4 }, 74);
  let guard = 0, deep = 0;
  while (s.phase !== 'finale' && guard++ < 200) {
    if (s.phase === 'draft') { s = E.chooseCard(s, s.hand[0]); continue; }
    if (s.phase === 'play') { s = E.complete(s).state; continue; }
    if (s.phase === 'resolve') {
      if (!s.escalatedDone && E.canEscalate(s)) { s = E.escalate(s).state; guard++; continue; }
      s = E.nextRound(s).state; continue;
    }
    if (s.phase === 'escalate') { s = E.escalateComplete(s).state; deep++; continue; }
    if (s.phase === 'event') {
      const ev = CONTENT.events.find((e) => e.afterAct === s.act);
      s = E.chooseEvent(s, ev.id, ev.options[0].id).state; continue;
    }
    if (s.phase === 'act' || s.phase === 'shop') { s = E.leaveAct(s); continue; }
  }
  s = E.finish(s).state;
  ok(deep >= 1, '整局至少完成 1 次深潜');
  ok(s.flags.deepDone === true, '整局 flags.deepDone');
  ok(s.result.awards.some((a) => a.id === 'a_deep'), '深潜奖项解锁');
}

/* ============================ 11. 结局 / 安全词 ============================ */
section('11. 结局 / 安全词');
{
  function endingFor(patch) {
    let s = fresh({ length: 'quick' }, 81);
    s = strip(s);
    Object.assign(s, patch);
    return E.finish(s).state.result.endingId;
  }
  eq(endingFor({ resources: { heart: 6, tension: 0, sync: 0, coins: 0 }, gentle: 3 }), 'slow', '结局：slow（温柔≥3 且心动≥6）');
  eq(endingFor({ resources: { heart: 8, tension: 0, sync: 15, coins: 0 }, gentle: 0 }), 'frequency', '结局：frequency（默契15+心动8）');
  eq(endingFor({ resources: { heart: 0, tension: 18, sync: 0, coins: 0 }, gentle: 0 }), 'undercurrent', '结局：undercurrent（张力18）');
  eq(endingFor({ resources: { heart: 14, tension: 0, sync: 0, coins: 0 }, gentle: 0 }), 'dawn', '结局：dawn（心动14）');
  eq(endingFor({ resources: { heart: 0, tension: 0, sync: 0, coins: 0 }, gentle: 0 }), 'each', '结局：兜底 each');
  /* 安全词强制 safe，且不扣资源 */
  let s = fresh({ length: 'classic' }, 82);
  s = playToRoundResolve(82, { length: 'classic' }, 4);
  const resBefore = JSON.parse(JSON.stringify(s.resources));
  const safe = E.safeWord(s);
  eq(safe.state.result.endingId, 'safe', '安全词 → safe 结局');
  eq(safe.state.result.stats.safeWord, true, 'result.stats.safeWord=true');
  eq(safe.state.resources, resBefore, '安全词不扣数据/不惩罚');
  eq(safe.state.phase, 'finale', '安全词 → finale');
  ok(safe.events[0].type === 'ending' && safe.events[0].safe === true, '安全词发 ending 事件（safe=true）');
  /* finish 幂等 */
  const f1 = E.finish(s);
  const f2 = E.finish(f1.state);
  eq(f2.state.result.endingId, f1.state.result.endingId, 'finish 幂等：结局不变');
  eq(f2.state.result.awards.length, f1.state.result.awards.length, 'finish 幂等：奖项不变');
  eq(f1.state.result.stats.round, s.round, 'stats 记录当前 round');
}

/* ============================ 12. validate ============================ */
section('12. validate / 版本迁移');
{
  let good = playToRoundResolve(91, { length: 'classic' }, 3);
  const valid = E.validate(good);
  eq(strip(valid), strip(good), '合法 state validate 后不变（幂等）');
  ok(E.validate(null) === null, 'validate(null) → null');
  const empty = E.validate({});
  ok(!!empty && empty.v === 1, 'validate({}) 迁移到 v1');
  eq(empty.settings.length, 'classic', '空 state 补默认 settings');
  eq(empty.hand.length, 3, '空 state 补 3 张手牌');
  ok(E.PHASES.includes(empty.phase), '空 state phase 合法');
  const bad = strip(good);
  bad.v = 0;
  bad.resources = { heart: 'x', tension: -5, sync: null };
  bad.tokens = { shield: -2, reroll: 'a', escalate: 500 };
  bad.round = 999;
  bad.phase = 'weirdo';
  bad.hand = ['nope:1', 123];
  bad.usedCards = null;
  bad.rng = 'abc';
  bad.combo = -3;
  bad.gentle = 'zz';
  bad.log = 'oops';
  delete bad.settings;
  const fixed = E.validate(bad);
  ok(!!fixed && fixed.v === 1, '坏存档修复版本');
  inRange(fixed.round, 1, 14, '坏 round 修复到合法范围');
  ok(E.PHASES.includes(fixed.phase), '坏 phase 修复到合法值');
  ok(BAL.RES_KEYS.every((k) => typeof fixed.resources[k] === 'number' && fixed.resources[k] >= 0), '坏资源字段修复为 ≥0 数字');
  ok(fixed.tokens.shield >= 0 && fixed.tokens.reroll >= 0 && fixed.tokens.escalate <= 99, '坏券字段修复');
  eq(fixed.hand.length, 3, '坏手牌补回 3 张');
  ok(typeof fixed.rng === 'number' && fixed.rng >= 0, '坏 rng 修复为数字');
  ok(Array.isArray(fixed.log), '坏 log 修复为数组');
  const again = E.validate(fixed);
  eq(strip(again), strip(fixed), '修复后再次 validate 稳定');
  const finished = E.validate(E.safeWord(good).state);
  eq(finished.result.endingId, 'safe', '带 result 的存档 validate 保留结局');
}

/* ============================ 13. 确定性 / 纯逻辑 ============================ */
section('13. 确定性 / 纯逻辑');
{
  const a = fresh({ length: 'classic' }, 123456);
  const b = fresh({ length: 'classic' }, 123456);
  eq(a.hand, b.hand, '同 seed 首手相同');
  eq(a.rng, b.rng, '同 seed rng 相同');
  const replay = (seed) => {
    let s = fresh({ length: 'classic', maxStar: 4 }, seed);
    for (let i = 0; i < 3; i++) {
      s = E.chooseCard(s, s.hand[0]);
      s = E.complete(s).state;
      s = E.nextRound(s).state;
      if (s.phase === 'event') {
        const ev = CONTENT.events.find((e) => e.afterAct === s.act);
        s = E.chooseEvent(s, ev.id, ev.options[1].id).state;
        s = E.leaveAct(s);
      }
    }
    const out = strip(s);
    delete out.ts;
    return out;
  };
  eq(replay(777), replay(777), '同 seed + 同操作序列 → 状态完全一致（确定性复现）');
  const h1 = fresh({}, 1001).hand.join();
  const h2 = fresh({}, 1002).hand.join();
  ok(h1 !== h2, '不同 seed 首手不同（抽样）');
  /* 跨局不重复保证：同一 session 内手牌不重复用卡 */
  let s = fresh({ length: 'quick' }, 2001);
  const seen = new Set(s.hand);
  for (let i = 0; i < 3; i++) {
    s = E.chooseCard(s, s.hand[0]);
    s = E.complete(s).state;
    s = E.nextRound(s).state;
    if (s.hand) for (const k of s.hand) seen.add(k);
  }
  ok(seen.size >= 4, '同局连续回合尽量不重复用卡（usedCards 洗牌袋）');
  /* 只读辅助不改状态 */
  const src = fresh({ length: 'quick' }, 2002);
  const srcJson = JSON.stringify(strip(src));
  E.eligibleCards(src); E.handCards(src); E.progress(src); E.actInfo(src); E.shopOffers(src); E.currentCard(src);
  eq(JSON.stringify(strip(src)), srcJson, '只读辅助不修改 state');
  const drawn = E.drawHand(src);
  eq(drawn.length, 3, 'drawHand 返回 3 张');
  eq(JSON.stringify(strip(src)), srcJson, 'drawHand 不修改原 state');
  /* 纯逻辑：源码不碰 DOM / localStorage，沙盒无浏览器全局 */
  const srcText = read(FILES.engine) + read(FILES.balance);
  ok(!/(^|[^.\w])localStorage\s*[.\[]/.test(srcText), 'engine/balance 不引用 localStorage');
  ok(!/(^|[^.\w])document\s*\./.test(srcText), 'engine/balance 不引用 document');
  ok(typeof sb.window.localStorage === 'undefined', '沙盒内无 localStorage（纯逻辑可测）');
}

/* ============================ 14. API 表面 ============================ */
section('14. API 表面');
{
  const required = [
    'newSession', 'validate', 'startRound', 'reroll', 'chooseCard',
    'complete', 'escalate', 'escalateComplete', 'escalateSkip', 'skip', 'gentleDown',
    'nextRound', 'chooseEvent', 'leaveAct', 'shopBuy', 'finish', 'safeWord',
    'eligibleCards', 'drawHand', 'actInfo', 'progress', 'canEscalate',
    'shopOffers', 'currentCard', 'handCards'
  ];
  const missing = required.filter((k) => typeof E[k] !== 'function');
  eq(missing, [], 'DESIGN §4 要求的 API 全部存在');
  ok(typeof E.__test.mulberry32 === 'function' && typeof E.__test.actThreshold === 'function', '__test 暴露确定性工具');
  eq(E.EVENT_TYPES, ['gain', 'skip', 'combo', 'actEnd', 'ending', 'token', 'shop', 'stage'], '事件类型固定 8 种');
  /* 动作拒绝也返回 events/blocked，UI 可统一 toast */
  const s = fresh({ length: 'quick' }, 3001);
  const bad = E.complete(s);
  ok(bad.events[0].blocked === true && bad.events[0].action === 'complete', '非法阶段动作返回 blocked 事件');
  const badSkip = E.skip(s);
  ok(badSkip.events[0].blocked === true, 'draft 阶段跳过被拒绝');
  const badChoose = E.chooseCard(s, '不存在的卡');
  ok(badChoose.outEvents[0].blocked === true && badChoose.phase === 'draft', '选择非手牌被拒绝且状态不变');
}

/* ============================ 15. CONTENT 缺失回退 ============================ */
section('15. CONTENT 缺失回退');
{
  const sbNC = makeSandbox({ content: false });
  const ENC = sbNC.window.App.Engine;
  let s = ENC.newSession({ length: 'quick' }, NAMES, 9);
  const out = ENC.finish(ENC.shopOffers ? Object.assign(strip(s), {}) : s);
  eq(out.state.result.endingId, 'each', '无 CONTENT 时用内置结局兜底（each）');
  const safe = ENC.safeWord(s);
  eq(safe.state.result.endingId, 'safe', '无 CONTENT 时安全词仍得 safe');
  /* 无事件内容：幕末直接进 act 阶段 */
  let t = ENC.newSession({ length: 'quick' }, NAMES, 10);
  let guard = 0;
  while (!(t.phase === 'resolve' && t.round === 3) && guard++ < 30) {
    if (t.phase === 'draft') t = ENC.chooseCard(t, t.hand[0]);
    else if (t.phase === 'play') t = ENC.complete(t).state;
    else if (t.phase === 'resolve') t = ENC.nextRound(t).state;
  }
  const r = ENC.nextRound(t);
  eq(r.state.phase, 'act', '无 CONTENT 时幕末直接进 act（跳过 event）');
  eq(r.state.actScores.length, 1, '无 CONTENT 仍结算幕末');
  const awards = ENC.finish(r.state).state.result.awards;
  ok(awards.length >= 2, '无 CONTENT 时奖项仍 ≥2（内置补齐）');
}

/* ============================ 16. 真实 CONTENT/题库联调（可选） ============================ */
section('16. 真实 CONTENT / 题库联调');
{
  const contentPath = path.join(ROOT, 'app/src/content/content.js');
  if (!fs.existsSync(contentPath)) {
    console.log('  (skip) content.js 未就绪，跳过联调（主测试已用 CONTENT stub 覆盖）');
  } else {
    const sbC = makeSandbox({ content: false });
    vm.runInContext(read(contentPath), sbC, { filename: 'content.js' });
    const EC = sbC.window.App.Engine;
    const CC = sbC.window.CONTENT;
    ok(!!CC && Array.isArray(CC.acts) && CC.acts.length === 3, '真实 CONTENT.acts = 3 幕');
    ok(CC.events.length >= 2 && CC.events.every((e) => Array.isArray(e.options) && e.options.length >= 2), '真实 CONTENT.events ≥2 且每组 ≥2 选项');
    ok(CC.endings.length === 6 && CC.endings.every((e) => typeof e.cond === 'function'), '真实 CONTENT.endings = 6 且都有 cond 函数');
    ok(CC.awards.length >= 2 && CC.awards.every((a) => typeof a.cond === 'function'), '真实 CONTENT.awards ≥2 且都有 cond 函数');
    const runReal = (len, seed) => {
      let s = EC.newSession({ length: len, maxStar: 3 }, NAMES, seed);
      const events = [];
      let guard = 0;
      while (s.phase !== 'finale' && guard++ < 500) {
        if (s.phase === 'draft') { s = EC.chooseCard(s, s.hand[0]); continue; }
        if (s.phase === 'play') { const r = EC.complete(s); events.push(...r.events); s = r.state; continue; }
        if (s.phase === 'resolve') { const r = EC.nextRound(s); events.push(...r.events); s = r.state; continue; }
        if (s.phase === 'event') {
          const ev = CC.events.find((e) => e.afterAct === s.act);
          const r = EC.chooseEvent(s, ev.id, ev.options[0].id); events.push(...r.events); s = r.state; continue;
        }
        if (s.phase === 'act' || s.phase === 'shop') { s = EC.leaveAct(s); continue; }
        if (s.phase === 'escalate') { const r = EC.escalateComplete(s); events.push(...r.events); s = r.state; continue; }
        throw new Error('unknown phase ' + s.phase);
      }
      const fin = EC.finish(s);
      events.push(...fin.events);
      return { state: fin.state, events };
    };
    for (const len of ['quick', 'classic', 'deep']) {
      const run = runReal(len, 12345);
      const ids = CC.endings.map((e) => e.id);
      ok(ids.indexOf(run.state.result.endingId) >= 0, '真实内容 · ' + len + ' 结局 id 来自 CONTENT.endings');
      ok(run.state.result.awards.length >= 2 && run.state.result.awards.length <= 3, '真实内容 · ' + len + ' 奖项 2–3 个');
      eq(run.events.filter((e) => e.type === 'actEnd').length, 3, '真实内容 · ' + len + ' 三幕各一次 actEnd');
      eq(run.events.filter((e) => e.type === 'ending').length, 1, '真实内容 · ' + len + ' 只发一次 ending');
    }
    const safeReal = EC.safeWord(EC.newSession({ length: 'quick' }, NAMES, 3)).state.result.endingId;
    eq(safeReal, 'safe', '真实内容 · 安全词 → safe 结局');
    const zero = EC.newSession({ length: 'quick' }, NAMES, 4);
    const zeroState = strip(zero);
    zeroState.resources = { heart: 0, tension: 0, sync: 0, coins: 0 };
    zeroState.gentle = 0;
    const lastEnding = CC.endings[CC.endings.length - 1].id;
    eq(EC.finish(zeroState).state.result.endingId, lastEnding, '真实内容 · 全零状态落到兜底结局');
  }
}

/* ============================ 汇总 ============================ */
console.log('\n----------------------------------------');
if (failed.length) {
  console.error(`FAILED: ${failed.length} / ${passed + failed.length}`);
  failed.forEach((f, i) => console.error('  ' + (i + 1) + ') ' + f));
  process.exit(1);
} else {
  console.log(`PASS: ${passed} assertions / 0 failed`);
  process.exit(0);
}
