# 引擎 API 速查（V3 · 升温夜航）

`window.App.Engine` —— 纯逻辑规则权威：**无 DOM、无 localStorage、无网络**。UI 只读 state、派发动作、播放 events；持久化交给 `App.Store`。

## 加载
```html
<script src="src/engine/balance.js"></script>  <!-- App.Balance：全部数值 -->
<script src="src/engine/engine.js"></script>   <!-- App.Engine：规则 -->
```
引擎在调用时惰性读取 `window.CARDS` 与 `window.CONTENT`，加载顺序无关；两者缺失时使用内置兜底（兜底卡 / 内置结局与奖项）。

## 快速上手
```js
let s = App.Engine.newSession({ maxStar: 3, length: 'classic', blacklist: ['束缚'] }, { a: '阿岚', b: '小满' }, 20251025);
s = App.Engine.chooseCard(s, s.hand[0]);          // phase: draft -> play
const r1 = App.Engine.complete(s);                 // { state, events }
if (App.Engine.canEscalate(r1.state)) { /* 可选深潜 */ }
const r2 = App.Engine.nextRound(r1.state);         // 或幕末：{ phase:'event'|'act' }
s = App.Engine.leaveAct(App.Engine.chooseEvent(r2.state, 'e1', 'a').state); // 下一幕
const fin = App.Engine.finish(s);                  // result: { endingId, endingName, awards, stats }
```

## 动作（入参 state 不变，返回新对象）
| 动作 | 返回 | 说明 |
|---|---|---|
| `newSession(settings, names, seed?)` | state | 生成第 1 回合手牌；`names={a,b}` 或 `[a,b]` |
| `startRound(state)` | state | 恢复/补手牌，phase=draft |
| `reroll(state)` | state | 消耗换牌券，重抽 3 张 |
| `chooseCard(state, cardId)` | state | 接受 `pool:id`、裸 id、手牌下标；phase=play |
| `complete(state)` | `{state,events}` | 完成后 phase=resolve |
| `escalate(state)` | `{state,events}` | 深潜：星级 +1（满星需加码券） |
| `escalateComplete/Skip(state)` | `{state,events}` | 深潜完成 ×2 收益 / 跳过心动-1 |
| `skip(state)` | `{state,events}` | 张力-1、combo=0、温柔+1 |
| `gentleDown(state)` | `{state,events}` | 每局 2 次；降到 0 视为跳过 |
| `nextRound(state)` | `{state,events}` | 推进回合；幕末发 `actEnd` 并进 event/act |
| `chooseEvent(state,eventId,optionId)` | `{state,events}` | 每个事件只结算一次 |
| `leaveAct(state)` | state | 进下一幕（或末幕 → finale） |
| `shopBuy(state,itemId)` | `{state,events}` | shop 仅幕转场可用 |
| `finish(state)` / `safeWord(state)` | `{state,events}` | 结局 + 奖项 + stats |
| `useShield(state)` | `{state,events}` | 扩展动作：消耗护身符 |

**返回值命名**：DESIGN §3.3 的 `state.events` 是「事件选择表」；动作产生的 UI 事件挂在 `state.outEvents`（别名 `.actionEvents`），`state.state` 指回自身。`{state,events}` 形态的 `events` 是数组。两者都**不可枚举**，`JSON.stringify` 不会写入存档。

## 只读辅助
`eligibleCards / drawHand / actInfo / progress / canEscalate / shopOffers / currentCard / handCards / validate`
- `progress()` → `{round,total,percent,remaining,act,actRound,actLength,actPercent,host,phase}`
- `actInfo()` → `{act,name,sub,accent,intro,outtro,length,rounds,threshold}`
- `handCards()` → `[{key,id,pool,type,text,star,tags}]`
- `validate(state)` → 修复版 state（坏字段钳制、v0→v1 迁移、手牌补位）；入参非对象返回 `null`。

## 事件类型（UI 动画/音效/浮字）
| type | 关键字段 | 触发 |
|---|---|---|
| `gain` | `res{heart,tension,sync,coins}`, `reason`, `card` | 完成/深潜/事件/幕奖励 |
| `skip` | `reason`, `res`, `gentle` | 跳过 / 缓一缓到 0 |
| `combo` | `n`, `coinBonus` | 连击到 3 的倍数 |
| `token` | `token`, `delta`, `reason` | 换牌/加码/护身符/连击与幕奖励 |
| `actEnd` | `act`, `score`, `threshold`, `good`, `reward` | 幕末共鸣检定 |
| `stage` | `phase`, `blocked?`, `action?`, `reason?`, `card?`, `hand?` | 阶段切换；非法动作也走这里 |
| `shop` | `itemId`, `price`, `effect`, `coins` | 购买 |
| `ending` | `endingId`, `endingName`, `awards`, `stats`, `safe?` | 结局 |

## 关键数值（全部在 `App.Balance`）
- 长度：quick 9(3/3/3)、classic 14(5/5/4)、deep 18(6/6/6)。
- 收益：`Math.round(base*star/2)`，每种资源最低 1；星屑 `star + floor(combo/3)`；深潜 ×2。
- 幕末：`score = heart + sync*1.2 + tension*0.8 + gentle*2`；阈值 12/26/42（按总回合数缩放）；达标 +5 星屑 +1 券，未达标下一幕星级 -1。
- 结局判定顺序：安全词 → 温柔 → 默契 → 张力 → 心动 → 兜底；`CONTENT.endings` 存在时以内容顺序与 `cond(res, state, flags)` 为准。
- 商店：护身符 6 / 换牌券 4 / 加码券 8 / 心糖 5。

## 确定性
`newSession(..., seed)`（或 `settings.seed`）→ 内部 `mulberry32`，RNG 游标存 `state.rng`；同 seed + 同动作序列得到完全一致的状态（`qa/rebuild/engine.test.mjs` 有复现断言）。

## 测试
```bash
node qa/rebuild/engine.test.mjs     # 236 assertions，0 failed（含真实 CONTENT/题库联调）
```
