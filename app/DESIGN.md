# 今晚飞行棋 V6.2 · 规则与数值

> 唯一事实来源：本文写「规则是什么、数值是多少」。实现细节看 `app/src/`，构建与发版看 `docs/REBUILD.md`，UI 文案看 `docs/v6/copy.md`。
> 口径优先级：`docs/v6/impl-freeze-cabin.md`（V6.2 沉浸主桌）> `docs/v6/impl-freeze-v6.1.md`（V6.1 规则调整）> `docs/v6/impl-freeze.md`（V6.0 冻结）> 本文 > `docs/v6/spec.md` / `docs/v6/api-contract.md`。改数值 = 改 `app/src/engine/**` 里的常量，然后跑引擎测试。

一句话：两个人、一部手机、一枚环形星轨棋盘。题卡一起做，心动值一起涨，**谁先把自己的飞机全部送回家，谁「先到家」**；之后两张收尾卡一人一张——只写「先到家」，不写输赢。

V6.2 起，主桌多了一层「夜航客舱」场景与一套全动态镜头；**规则、数值、存档与 V6.1 完全一致**，视觉与动画的实现口径见 §17。

## 1. 一局的结构

| 阶段 | 屏幕 | 发生什么 |
|---|---|---|
| 门厅 | `boot` | 选快局 / 长夜（先送完 2 / 4 架）、两个名字、两种颜色、四档尺度、边界；有存档时「继续今晚飞行棋」 |
| 主桌 | `table` | 掷骰、走子、抽题卡 / 小游戏 / 命运、心动值与连击、暂停入口、安全词常驻 |
| 收尾 | `table`（收尾卡） | **一方全部飞机到家**后，两张收尾卡一人一张；处理完进回顾 |
| 回顾 | `ledger` | 「<姓名> 先到家」+「已到家 X/Y」、6 类信息 + 题卡明细；「保存到以前的夜」「再开一夜」；可「存成图片」 |
| 其他 | `nights` / `settings` / `minigame` | 以前的夜、设置、单独玩的小游戏 |

- 进行中的一局存在 `couple2.session`（`kind:"flight"`，结构版本 `v:2`）。
- 暂停层（`data-screen=pause`）覆盖当前屏但**不卸载**它；继续后回到原状态。
- 安全词只暂停；只有「今晚就到这」才归档并结束这一局。

## 2. 棋盘

SVG 绘制的环形星轨棋盘，俯视 + 明暗/投影的 2.5D 质感，viewBox 720×730。

| 组成 | 数量 | 说明 |
|---|---|---|
| 主环 | 52 格 | 四色交替，顺时针；红/黄/蓝/绿起飞位分别在第 0 / 13 / 26 / 39 格 |
| 机坪 | 4 色 × 4 槽 = 16 格 | 每方最多 4 架；快局只用前 2 架 |
| 航线 | 4 色 × 5 格 = 20 格 | 进航后走自己的航线 |
| 终点 | 4 色 × 1 = 4 格 | 走到终点即 `arrived` |
| 合计 | **92 个格位** | 52 主环 + 16 机坪 + 20 航线 + 4 终点 |

主环的格类型（V6 实测分布）：

| 类型 | 数量 | 落上去发生什么 |
|---|---|---|
| 真心话（truth） | 14 | 抽一张真心话 |
| 大冒险（dare） | 15 | 抽一张大冒险 |
| 靠近（touch） | 5 | 抽一张靠近卡 |
| 温度计（thermo） | 2（第 10、36 格） | 直接开温度计面板 |
| 转盘（wheel） | 2（第 14、40 格） | 第 14 格真心话转盘、第 40 格大冒险转盘 |
| 命运（fate） | 2（第 5、29 格） | 两张不同池的卡二选一（见 §6） |
| 功能格 | 12 | 4 个起飞、4 个飞点、4 个进航，不抽普通题卡 |

- **跳**：落在**自己颜色**的普通格上向前 4 格（禁跳格与命运格除外）。
- **飞**：落在**自己颜色**的飞点上向前 12 格（四色各 1 个飞点）。
- **进航**：落到自己的进航格，转进自己的航线（`起飞位 + 50` 格）。
- **命运格**：候选 7 / 31 中 7 是绿方飞点，按冻结单退路改用 **5 / 29**；命运格不再自动跳格。

> 可视化调试：`app/dev/board-demo.html`（只用于截图/自测，不进产物）。

## 3. 回合与走子

1. 点「掷骰」：1–6，页面显示点数文字；骰子动画 ≤1.6s。
2. **6 起飞 + 两回合保底**：掷出 6 才有一架飞机从机坪起飞；但同一个玩家**连续 2 个自己的回合都没掷出 6**（且该玩家所有未到家的飞机都在机坪），**第 3 个自己的回合任意点数都可起飞**。起飞成功或掷出 6 后保底计数清零（`takeoffMiss`，0–2）。
3. **6 可再掷**：掷出 6，走完这一步后还能再掷一次（`rerollOnEverySix: true`）。
4. **选子**：有多个合法走子时给文字按钮（「红 · 第 1 架 · 从机坪起飞」这类），不自动替玩家选。
5. **无子可走**：明确写出原因（例如飞机都在机坪、没掷到 6，并提示「连续两次没起飞后，这一掷任意点数保底起飞」），然后换人；不静默换人。
6. **击落**：落在对方飞机所在格，对方飞机回机坪，并抽一张对应题卡。
7. **叠机**：落在自己飞机所在格，叠成一摞，抽「两人一起」的卡；叠机后有 1 步奖励（放过也保留，见 §8）。
8. **进航**：落到进航格抽一张进航题卡；**放过也照样进军**。
9. **到达**：走完 5 格航线到终点即 `arrived`；HUD 状态条显示双方「已到家 X/N」与「在飞 N 架」。

规则开关在 `app/src/engine/flight-rules.js`。V6 冻结的两条：`skipHomeEntryBlocksEntry: false`（放过仍进军）、`skipStackKeepsBonusStep: true`（放过仍得叠机奖励步）；其余开关沿用暂定值，**进行中的旧局按 `state.rules` 快照走**。

> 起飞保底（V6.1）的边界：保底计数在**换手前**按本回合点数记账（`noteTakeoffMiss`），`computePlan` 读的是本回合开始前的计数，所以第 1、2 个没 6 的回合不会提前起飞、第 3 个回合才保底；**掷出 6 一律清零**、实际起飞也清零；非 6 时只有「该玩家所有未到家的飞机都在机坪」才 +1（有子在外面就不累计）。

## 4. 题卡

- 每张卡都有归属：格位题 / 击落 / 进航 → 当前行动方姓名；叠机 → 「两人一起」；收尾 → 收尾卡指定的人。
- 卡面显示类型、星级、来源。动作固定为 **做了 / 放过**。
- 「做了」：心动值 +8、连击 +1；「放过」：心动值 +3、连击不清零、不挡路、不扣分。
- 计入 `cardsProcessed` 的只有 6 类普通卡：真心话 / 大冒险 / 靠近 / 击落 / 叠机 / 进航。**小游戏、命运卡、收尾卡不计入**，但都会结算心动值与连击。
- **V6.1：题卡数不决定结束。** `cardsProcessed` 只是过程计数（状态条「第 N 张」），`targetCards / targetHeat` 字段保留但 `shouldEnd` 不再读；一局何时结束只看「一方全部飞机到家」（见 §8）。
- 题卡原文只存在本机；回顾页里默认收起，分享图默认不画原文。

## 5. 心动值 / 连击

心动值是双方共享的一个 0–100 的数值，只增不降；棋盘动作本身（起飞、击落、叠机、跳/飞）不加也不减，但这些动作**抽到的题卡按题卡规则结算**（击落 / 叠机 / 进航都是普通题卡的一种）。

| 结算 | 心动值 | 连击 |
|---|---|---|
| 普通题卡「做了」 | +8 | +1 |
| 普通题卡「放过」 | +3 | 不变 |
| 小游戏完成 | +5 | 不计 |
| 小游戏跳过 | +0 | 不变 |
| 收尾卡「做了」 | +10 | +1 |
| 收尾卡「放过」 | +3 | 不变 |
| 命运卡选了「做了」 | +8 | +1 |
| 命运卡「今晚先不选」/ 放过 | +3 | 不变 |

阶段（`heat` 唯一真源，`stage` 由 heat 重算）：

| heat | 阶段名 | 内部 id |
|---|---|---|
| 0–19 | 灯刚亮 | `cold` |
| 20–39 | 有点热 | `warm` |
| 40–59 | 靠近了 | `charged` |
| 60–79 | 很近了 | `burning` |
| 80–100 | 今晚可以更近 | `blazing` |

- 连击是全局限定在「做了」上的累计：`done` +1，`skipped` 不变；`streakBest` 记录最高值。
- 每 3 次「做了」由引擎发一个 `milestone` 事件并存进 `meta.milestones`。**V6 界面只显示连击数**；「连击里程碑换双人选卡」是 P1 奖励，尚未上线。
- 状态条、暂停页、回顾页显示同一个心动值与阶段名。
- **V6.1：心动值只作过程记录**，不再触发结束（V6.0 的 `heat >= targetHeat` 已废弃，`targetHeat` 仅作历史兼容）。

## 6. 命运格（第 5、29 格）

- 落上后同时给两张**不同池**的卡，二选一；另一张放回池子。
- 池子随尺度变：温柔/暧昧 = 靠近 + 真心话；热烈 = 大冒险 + 真心话；不设限 = spark + 真心话。
- 选择「做了」+8、「今晚先不选」+3（不惩罚），都不计入 `cardsProcessed`（过程计数，不影响结束）。
- 不选不会失败，也不会扣心动值。

## 7. 小游戏

| 格 | 小游戏 | 怎么玩 | 结算 |
|---|---|---|---|
| 第 10、36 格 | 温度计（thermo） | 两人各自放一个温度，再猜对方放哪；猜得越近越热 | 完成 +5，跳过 +0 |
| 第 14 格 | 真心话转盘 | 抽一张真心话，自己说或交给对方；可重抽，每种 2 次 | 完成 +5，跳过 +0 |
| 第 40 格 | 大冒险转盘 | 同上，抽大冒险 | 完成 +5，跳过 +0 |

- 落在格上**直接进可玩面板**；面板里有「跳过」，完成/跳过都写入回顾，不会出现「玩过了，继续走棋」这种空按钮。
- 温度计是「谁猜得近谁更热」，不是比赛，不记输赢。
- 独立入口（门厅「小游戏」，旧 hash 链接 `#/door` 也可达）可以单独玩；结果可「带回今晚」写进当前这一夜。

## 8. 结束与收尾（先到家，不判输赢）

> V6.1 起结束条件 = **飞行棋胜负**：任意一方把本局全部飞机送进终点。题卡张数 / 心动值 / 单架到家都不再结束（`impl-freeze-v6.1.md` §1）。

| 模式 | 每人飞机 | 收尾条件 | 预计时长 | `targetCards` / `targetHeat`（历史字段） |
|---|---|---|---|---|
| 快局 `quick` | 2 架 | 一方 2 架全部 `arrived` | 15–25 分钟 | 4 / 40，只兼容，不参与判定 |
| 长夜 `long` | 4 架 | 一方 4 架全部 `arrived` | 30–50 分钟 | 8 / 80，只兼容，不参与判定 |

**结束判定（`shouldEnd`）**：`allHome(a) || allHome(b)` —— 该玩家本局**所有** `pieces` 的 `arrived === true`。

判定发生在每次走子 / 题卡结算之后（`afterAction` / `resolvePrompt` 之后）；最后一步落格题卡先结算，再进收尾。

命中后（`enterEnding`）：

- 先写 `s.winnerId`，事件顺序固定 `win → prompt(收尾卡 a) → ending-start`。
- 从 `ending` 池按 mild 权重抽 **2 张收尾卡**，一人一张（顺序：先 a 再 b；允许同池）。
- 两张都可以「放过」；放过不减 heat、不判失败。
- 两张处理完 → `phase='ended'` → 生成 ledger → 进入今晚回顾。
- 文案：主桌 `data-test=winner-text` 显示「<姓名> 先到家」；回顾首屏「<姓名> 先到家」+「已到家 X/N 架」，汇总里另有一格「已到家」；旧档 `ending='shared'`（V6.0 合作收尾）或没有赢家时显示「今晚一起走到这里」，`safe` 显示「安全词收棋 / 今晚就到这」。
- **不惩罚**：赢家不额外加心动值、输家不扣分；界面不出现「输/赢/胜/负」（「先到家」不算判定词）。
- `winnerId` 只用于文案与 ledger（`ending: 'win-a' | 'win-b' | 'safe'`；`stats.planesHome: {a, b}`），不参与其它逻辑。

### 不惩罚「放过」（红线，逐条）

1. 心动值不减少（可 +3）。
2. 不阻断进终点：进航题放过 → 照样进军。
3. 不丢奖励步：叠机题放过 → 仍得固定奖励步。
4. 连击不清零。
5. 回顾只写「今晚先放过」，不写失败 / 未完成 / 扣分。
6. 放过不影响结束判定：V6.1 只看「一方全部飞机到家」，所以全放过局同样能收尾。

## 9. 暂停 / 安全词 / 今晚就到这

- 「先收棋」胶囊在所有屏幕常驻（`z-index:380`），按住 **1.6 秒**（有环形进度）打开暂停层；松手取消。
- 暂停层四个动作：**继续 / 今晚就到这 / 看今晚记录 / 加一条今晚不做的**；面板写明「今晚的记录会留着，不会少一条」。
- 暂停层打开期间安全词仍可点；主桌自己的暂停按钮与安全词区域不重叠。
- 「今晚就到这」→ 确认 → `Flight.safeWord()` → 归档进 `couple2.history` → 清 session → 回顾页；`ending='safe'`。
- 「加一条今晚不做的」→ 从下一张题卡起生效，并立即触发一次抽卡过滤；上限 20 条。
- 安全词≠结束：它不归档、不改已写下的记录。

## 10. 尺度与题池

四档在 `app/src/core/store.js` 里映射为 1–4；题池过滤与权重在 `app/src/engine/flight-draw.js`。

| 档 | 内部值 | 卡面星级 | 引擎可用星级（`maxStar`） | 抽卡倾向 | 额外过滤 |
|---|---|---|---|---|---|
| 温柔 `gentle` | 1 | ★1 | 1★ | 只留 1 星 | 露骨句 + `束缚/露出/道具/蒙眼` 标签 + 温柔追加词表全排除 |
| 暧昧 `warm` | 2 | ★1–2 | 1–3★ | 2★ 权重 20，1★ 4，3★ 3 | 露骨句排除 |
| 热烈 `hot` | 3 | ★1–3 | 1–5★ | 3★ 起加权，4–5★ 再加成 | 无（边界仍生效） |
| 不设限 `open` | 4 | ★1–4 | 1–5★ | 4★ 起加权，4–5★ 更高 | 无；`spark` 池只在这一档进入击落 / 进航 / 收尾 / 命运抽卡 |

- 卡面星级是门厅上的简化标签；引擎实际允许的最高星级见上表（热烈 / 不设限都可到 5★）。
- **边界**（开局、暂停页、设置里加的词/标签）在**任何尺度**都会被排除；匹配标签或原文子串。
- 暂停页「加一条今晚不做的」最多再加 20 条；设置页加的边界属于「下次开局」，没有这个 20 条的限制提示。设置里改尺度/边界「下次开局生效」，进行中的这一局按开局快照走。
- 高尺度内容面向成年伴侣；不是未成年人内容。

## 11. 今晚回顾与分享图

回顾页固定 6 类信息（`docs/v6/copy.md` §6.2 为文案口径），V6.1 另加「先到家 / 已到家」：

| 项 | 内容 |
|---|---|
| 今晚 | 日期 · 姓名 & 姓名 · 尺度 |
| 时长 | 从开始到结束 |
| 题卡 | 共 N 张 · 做了 D · 放过 S |
| 心动值 | 数值 · 阶段名 |
| 最高连击 | `streakBest` |
| 小游戏 | 次数 · 完成 X · 跳过 Y |
| 已到家（V6.1） | `<姓名> X/N · <姓名> Y/N · 共 X+Y/2N 架`（`data-test=ledger-home`）；旧档缺数据用 `—` |

- 首屏另写「<姓名> 先到家」+「已到家 X/N 架」；`ending='shared'` 旧档写「今晚一起走到这里」。
- 下方「今晚的每一张」按时间列出每张卡的归属、类型、星级、结果；原文默认收起，点「展开原文」才显示。
- 小游戏明细写成「温度计 · 完成」「转盘 · 跳过」，**不允许出现「（这一笔没有句子）」**。
- 「存成图片」：本机 Canvas 生成 1080×1350 PNG（暗夜星轨 + 暖光纸感）；不请求网络、不上传、不生成外链；默认不画题卡原文（显式 `includeText` 才画，且最多 4 条）。
- 「以前的夜」最多保留 **60 局**；旧条目缺字段时按兜底逻辑渲染。
- 回顾页**不判输赢**：写「<姓名> 先到家」与「已到家 X/Y」，只有「做了 / 放过 / 心动值 / 连击」，不写失败或惩罚。

## 12. 存档结构（v2）与迁移

`couple2.*` 五个既有键名与语义不变；V6 新增一个只写一次的备份键：

| 键 | 说明 |
|---|---|
| `couple2.settings` | `v:6`、sound / haptics / reduced / names / colors / blacklist / boardView |
| `couple2.session` | 进行中的对局：`kind:"flight"`, `v:2` |
| `couple2.history` | 以前的夜 / 以前的一局（最多 60 条） |
| `couple2.standalone` | 独立小游戏进度 |
| `couple2.pending` | 独立小游戏「带回今晚」的临时结果 |
| `couple2.backup.session` | 首次读到 session 时的原样备份（只写一次，永不覆盖；quota 失败静默跳过） |

`state`（`couple2.session`）的 V6 关键字段：

```ts
{
  v: 2, kind: 'flight',
  names: { a, b }, colors: { a, b }, scale: 'gentle'|'warm'|'hot'|'open',
  boundaries: string[],                     // 生效中的边界（含暂停页后加的）
  planeCount: 2|4, mode: 'quick'|'long',
  targetCards: number, targetHeat: number,  // V6.1 起只作历史兼容（quick 4/40，long 8/80），shouldEnd 不读
  cardsProcessed: number,                   // 6 类普通卡结算数（做了/放过都算）；只是过程计数
  takeoffMiss: { a: number, b: number },    // V6.1 起飞保底：连续未掷出 6 的回合数，0..2
  winnerId: 'a' | 'b' | null,               // V6.1 先到家的一方；只用于文案与 ledger
  meta: { heat, stage, streak, streakBest, milestones, updatedAt },
  endingQueue: Prompt[] | null, endingIndex: number,
  phase: 'playing'|'ended'|'safe-ended', turn: 'a'|'b',
  pieces: [...], log: [...], rules: {...}, rng: number, awaiting: {...}
}
```

`view`（只读投影）在 V6.1 额外给：`planesHome: {a,b}`、`takeoff: { misses: {a,b}, pity: boolean }`；`progress.targetCards / targetHeat` 仍返回但只作兼容，界面不要再拿来做「进度目标」。

`ledger`（写进 history 的回顾数据）：

```ts
{
  v: 2, date, startedAt, endedAt, durationMs, names, colors, scale, mode, planeCount,
  boundaries, ending: 'win-a'|'win-b'|'safe',  // 旧档可能仍是 'shared'（V6.0 合作收尾）
  winnerId: 'a'|'b'|null,
  stats: { cardsDone, cardsSkipped, heat, bestStreak, minigames, planesHome: {a,b} },
  prompts: [{ kind, outcome, actorId, cardId, text, star, pool, source }],
  minigames: [{ kind, outcome, actorId }]
}
```

迁移规则（`Flight.validate()`）：

- 只接受 `kind:"flight"`、`v:1` 或 `v:2`；`v:1`（V5）**原样续玩**：补 `mode / targetCards / targetHeat / cardsProcessed / meta / endingQueue` 等可选默认值，**永不新增必填项**，读不出也不丢数据（先备份再移除）。
- **V6.1 补丁**：旧档（`v:1` / `v:2`）缺 `takeoffMiss` 时补 `{a:0, b:0}`，缺 `winnerId` 时补 `null`；两者都不算必填项。
- V5 停在「赢家收尾」的单卡局面：保留已发的那张，按单卡收束。
- 旧 ledger：`ending` 缺值或不认识时按 `winnerId` 兜底（`win-a` / `win-b`），都没有按 `shared` 显示「今晚一起走到这里」；`stats.planesHome` 兼容旧的总数（number）与完全不存在的档（显示 `—`）。
- 公寓局（`kind:"apartment"`）与更早的升温夜航：`Archive.archiveForeign()` 收进 history，清 session，不按 V6 规则续玩。
- 设置里的公寓遗留 `maxStar / gentleOnly`：清掉并给 `suggestScale` 建议；`boardView` 默认 `"svg"`。
- 导出：`{ app:"couple-flight", v:6, exportedAt, settings, session, history, standalone, pending }`；导入兼容 `couple-flight / couple-apartment / couple-voyage`，对 `flight` session 先 `validate()`，不通过整体拒绝、不覆盖现状。

## 13. 引擎 / 视图接口（改代码前先看这里）

| 命名空间 | 文件 | 职责 |
|---|---|---|
| `App.Flight` | `engine/flight-engine.js` | `newGame / validate / roll / legalMoves / move / resolvePrompt / resolveMinigame / safeWord / buildLedger / view`；纯逻辑，无 DOM |
| `App.FlightMeta` | `engine/flight-meta.js` | 心动值、连击、里程碑的纯函数：`applyPrompt / apply / normalize / fromLog / view` |
| `App.FlightDraw` | `engine/flight-draw.js` | 抽卡：尺度上限、边界过滤、权重、`take(state, purpose)` |
| `App.FlightBoard` | `engine/flight-board.js` | 棋盘拓扑：`map()`、`FATE_CELLS`、格类型与跳/飞/进航坐标 |
| `App.Minigames` | `engine/minigames.js` | 温度计 / 转盘纯逻辑 |
| `App.BoardView` | `view/board.js` | SVG 棋盘：`mount / setState / play / setChoices / setReduced / setSound / unmount`；只读快照，不碰 `App.Flight` / localStorage |
| `App.CabinScene` | `view/cabin.js` | V6.2 机舱场景 + 相机：`mount(host,{boardEl,reduced,sound,names}) / unmount / setMood / play(events,{state}) / setReduced / setSound`；只改 `boardEl.style.transform` 与场景 CSS 变量，不读引擎、不写 localStorage |
| `App.PromptCard` | `ui/overlay/prompt-card.js` | `open(host, prompt, state, handlers)` |
| `App.MiniGame` | `ui/overlay/minigame.js` | `open(...)`；面板关闭由 table 调 `Flight.resolveMinigame` |
| `App.Pause` | `ui/screens/pause.js` | `open(reason) / close() / isOpen()` |
| `App.Safe` | `core/safe.js` | `init / sync / trigger`；长按时长常量 `holdMs = 1600` |
| `App.Share` | `ui/share.js` | `exportLedger(input, opts?) / ledgerCanvas / ledgerDataUrl` |
| `App.Store` | `core/store.js` | 设置 / session / history / 导入导出 / 备份 |

数据流是单向的：UI → `App.Flight.*`（纯函数）→ `Store.saveSession` → `BoardView.play(events)` → `setState` 纠偏。引擎不读 DOM、不写 localStorage；视图不调用引擎。

## 14. 改数值去哪里

| 想改 | 改哪里 |
|---|---|
| 心动值计分 / 阶段阈值 / 连击里程碑间隔 | `engine/flight-meta.js` 的 `HEAT_GAIN` / `THRESHOLDS` / `MILESTONE_EVERY` |
| 结束条件（一方全部到家）/ 每人飞机数 | `engine/flight-engine.js` 的 `allHome()` / `shouldEnd()` / `winnerOf()`；门厅架数在 `engine/flight-engine.js` 的 `targetsFor()`（`targetCards/targetHeat` 只作兼容） |
| 起飞保底（几回合保底、计数上限） | `engine/flight-engine.js` 的 `noteTakeoffMiss()` / `takeoffPity()` / `missOf()`（当前写死 2：0..2） |
| 尺度上限、过滤词、抽卡权重、命运池 | `engine/flight-draw.js` 的 `SCALE_CAP` / `band()` / `weightOf()` / `allowed()` / `fatePools()` |
| 棋盘格型、命运格位置 | `engine/flight-board.js` 的 `CELL_KIND` / `FATE_CELLS` |
| 规则开关（放过/叠机/再掷/选子） | `engine/flight-rules.js` 的 `DEFAULTS` |
| UI 文案 | `docs/v6/copy.md`（改完同步 QA 断言） |
| 视觉令牌（颜色/圆角/缓动/字体） | `app/src/styles/base.css` 的 `:root` |
| 题库 | `app/data/raw.json` → `python tools/rebuild/make_cards.py`；产物 `app/src/data/cards.js` 不要手改 |

## 15. 视觉令牌（摘要）

- 底色：`#08060F / #120D24 / #150F2A`；星云紫 `#241540`，光晕 `#8E7BD8`。
- 暖光：琥珀 `#F3C077`、深琥珀 `#E2965E`、玫瑰 `#E9887A`。
- 文字：米白 `#FBF3E7`、次级 `#C9B6CE`、弱 `#8E7C9E`；暖纸题卡 `#F7EAD6 → #F1DFC4`，纸上字 `#2C1C15`。
- 四色棋子：红 `#F08C80`、黄 `#F0C877`、蓝 `#8FA6E8`、绿 `#7FC9A8`。
- 字体：标题/数字 `"Noto Serif SC","Songti SC","STSong",serif`；正文 `"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif`（不引外链字体）。
- 动效时长：`--t-fast:160ms / --t-mid:320ms / --t-slow:640ms`；减少动画时关键反馈 ≤100ms。
- 骰子 / 走子 / 题卡动画上限：1.6s / 2.0s / 0.4s（`docs/v6/impl-freeze.md` §3.1）。

## 16. 本版已知偏离（实现与文案/规格的差异，登记不藏）

1. **命运格位置**：规格候选 7/31，7 与绿方飞点冲突，按冻结单退路落地为 **5/29**。
2. **`boardView:"3d"` 设置**：字段保留但 V6 主桌只用 SVG；3D 资源（`assets/board.js` + `app/render/`）保留为回滚参考，不被首屏或主桌加载。
3. **连击里程碑奖励**：引擎发 `milestone` 事件，但「双人选卡」P1 奖励未在 V6 UI 落地；界面只显示连击数。
4. **卡面星级标签**：门厅的 ★ 数（1 / 1–2 / 1–3 / 1–4）是简化提示；引擎实际最高星级以 §10 为准。
5. **安全词长按**：1.6 秒；实现里短按（>120ms 且 <1.6s）只显示「按住 1.6 秒」提示，不进入暂停。
6. **`targetCards / targetHeat` 保留但不参与判定**（V6.1）：仍出现在 `view.progress` 与旧档里，仅作历史兼容；主桌状态条已改为「双方已到家」。
7. **`takeoffMiss` 不追溯历史**（V6.1）：旧档补 `{a:0,b:0}` 后从下一个回合重新累计保底，不根据 `log` 反推。
8. **暂停页状态卡仍是旧文案**（V6.1，待对齐）：`app/src/ui/screens/pause.js` 仍写「第 N/目标 张」，未改成本文的「双方已到家」；见 `docs/v6/copy.md` §9-D9。
9. **安全词收尾的回顾标题**（V6.1，待对齐）：`app/src/ui/screens/ledger.js` 当前对 `safe` 结局写「安全词收棋」，`copy.md` §5.3 要求「今晚就到这」；见 `docs/v6/copy.md` §9-D11。
10. **规则速览 6 条结构**（V6.1）：第 1 条合并为「6 起飞 · 6 可再掷」，第 4 条新增「先到家就收尾」（`data-test="rules-end"`），条数仍为 6；见 `copy.md` §1.6 / §9-D10。
11. **舷窗高度受 UI 限制**（V6.2）：舷窗放在顶部 HUD 与棋盘之间，小屏 / 棋盘偏上时会被压矮（最小约 64–66px），不是固定设计比例；见 §17.6。
12. **桌面反馈落在桌板前沿**（V6.2）：涟漪 / 聚光 / 心形脉冲定位在棋盘下沿的桌板边（`board.top + board.height + 11~12px`），不压在棋盘格上；见 §17.6。
13. **`setSound` 目前只记录状态**（V6.2）：`App.CabinScene.setSound` 接受并保存开关，但机舱场景没有新增独立音效；骰子 / 走子音效仍由 `App.BoardView` 负责，见 §17.6。

> 改上面任何一条之前，先改 `docs/v6/impl-freeze.md`（或让 Lead 出 ADR），再改本文与实现，避免文档和代码各说各话。

## 17. 视觉与动画：夜航客舱（V6.2）

> 实现：`app/src/view/cabin.js`；集成：`app/src/ui/screens/table.js`。冻结口径：`docs/v6/impl-freeze-cabin.md`。
> 本节只写「场景怎么分层、镜头对哪些事件有反应、reduced 与性能边界」，不重复 §15 的颜色令牌。

### 17.1 场景分层（从后到前）

宿主是 `.v6-table` 内的 `.v6-cabin`（`data-test="cabin"`）：`position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none`。`cabin.js` 再往里挂 `.cabin-root`（`data-test="cabin-scene"`，`aria-hidden="true"`），根节点与所有子元素都是 `pointer-events:none !important`。

| 层 | 实现 | 内容 / 作用 |
|---|---|---|
| 舱壁 | `.cb-wall` / `.cb-seams` / `.cb-curve` / `.cb-bins` | 深靛→酒红渐变舱壁、竖向壁板接缝、顶部行李舱弧线与卡扣/小灯、四周压暗 |
| 舷窗 | `.cb-window` ×2（左/右）+ `.cb-win-inner` canvas | 圆角窗框、遮光板、玻璃反光；Canvas 画夜空、月/晨光、星、云、地平线、机翼与机翼灯（约每 2.4s 闪一次） |
| 阅读灯 / 顶部光 | `.cb-lampglow` ×2、`.cb-lampcone`、`.cb-toplight` | 阅读灯呼吸（4.5s）、灯锥落在桌板；收家时顶部灯带亮起 |
| 小桌板 | `.cb-tray`（含 `.cb-mat` / `.cb-trayglow` / `.cb-tray-latch`） | 浅木桌板 + 垫布 + 厚度投影，向棋盘四周外扩（左右 14px、下 36px）；棋盘精确坐在垫布上，布局不变 |
| 光效 | `.cb-warm` / `.cb-dawn` / `.cb-turnlamp` / `.cb-spot` / `.cb-ripple` / `.cb-heart` / `.cb-flash` / `.cb-dim` | 热度暖光、收家晨光、换手侧灯、题卡聚光、落点涟漪、叠机心形脉冲、击落闪白、题卡/暂停压暗 |
| 前景 | `.cb-dust` canvas、`.cb-vignette`、`.cb-grain`、`.cb-reflect` | 灰尘 / 星尘、暗角、颗粒、玻璃反光；粒子数量随视口宽（16–32）与 reduced 调整 |
| UI 层（不属于场景） | `.v6-boardwrap` z-index 1；HUD / 状态 / 回合条 / 掷骰条 / 行动区 z-index 2；题卡/小游戏宿主 z-index 30+ | 始终在场景之上；场景不接收点击，也不改棋盘 52 格与按钮的点击路径 |

- 相机只改 `.v6-board`（`boardEl`）的 `transform`（`translate3d / scale / rotate`，跳/飞时加 `perspective + rotateX`），并在 mount / unmount 时保存、恢复原有 `transform / will-change / transform-origin / backface-visibility`。
- 场景层通过 `--cb-cam-x / --cb-cam-y` 做视差：舷窗与桌板小幅反向/同向位移，制造「镜头在动」的层次，但不改布局。
- `.v6-table` 背景改为暗色兜底（`#08060F`），场景缺席时主桌仍是可读的暗底，不会露白。

### 17.2 相机事件表

事件来自 `table.js` 的棋盘事件序列，`CabinScene.play(events)` 与 `BoardView.play(events)` 并行；场景只做画面回应，不等待、不阻塞棋局。

| 事件 | 镜头 / 场景反应 | 关键参数（`cabin.js`） | reduced |
|---|---|---|---|
| `dice` 掷骰 | 轻推近 + 舱灯闪一下 | `translateY -4px, scale 1.03`；进入 260ms、保持 900ms、回位 420ms | 无 |
| `takeoff` 起飞 | 跟拍落点 + 窗外云层加速 | `followTo(landing, scale 1.02)`；进入 360ms、保持 460ms、回位 560ms；`boost=1` | 无 |
| `move` 走子 | 按落点方向平移 + 轻推近 + 落点涟漪 | 位移 6–12px（按方向长度），`scale 1.02`；进入 500ms、保持 280ms、回位 700ms | 无 |
| `jump` / `fly` 跳/飞 | 跟拍 + 轻微仰角；飞时窗外星光拉线 | `scale 1.02, rotateX 0.6deg`；进入 420ms、保持 260/280ms、回位 560/600ms；`streak=1` | 无 |
| `capture` 击落 | 画面震动 + 闪白 + 舱灯闪 + 桌沿红波纹 | 震动 `±6px / ±0.4deg / 320ms`；闪白 0.62 → 0（520ms 淡出） | 无 |
| `stack` 叠机 | 轻推近 + 心形脉冲光 + 涟漪 | `scale 1.012`；进入 240ms、保持 240ms、回位 420ms | 无 |
| `turn` 换手 | 镜头移向当前玩家一侧；该侧阅读灯亮起 | `x = -8px`（a 左）/ `+8px`（b 右）；进入 600ms、保持 240ms、回位 520ms | 无 |
| `prompt` / `minigame` 题卡/小游戏 | 拉远 + 压暗 + 桌沿聚光 | base `scale 0.99`（520ms）；`is-overlay` 压暗；聚光落在落点或题卡格 | 只保留压暗/聚光的透明度过渡 |
| `heat` 热度 | 舱灯从琥珀变暖、云层散开一点、轻推 | `warm = heat/100`（600ms）；跨阶段时 `cloudPart +0.32`；`scale 1.01` | 暖度直接到位，无推近 |
| `win` 收家 | 拉远 + 窗外 8s 日出 + 顶灯亮起 + 星尘落下 | base `scale 0.97`（900ms）；`dawn 0→1`（8000ms） | 日出直接到位，无镜头 |
| `safe` 安全词 | 压暗、镜头缓回正，无庆祝特效 | `is-safe` 压暗 0.85；base 回 0（800ms） | 只保留压暗 |
| `ledger` / `ending-start` 收尾 | 压暗；若无赢家则轻微拉远 | `is-ended` 压暗 0.45；无赢家时 base `scale 0.99`（700/600ms） | 只保留压暗 |

- 相机 `rAF` 只在动画期间运行，动画结束即释放；待机的 ±0.7px 轻浮动由场景循环在非 reduced 时叠加。
- `data-cabin-cam` 记录最近一次 bump/shake 的标记（`rest` 表示回位）；`win` / `prompt` 使用 base 相机，不单独改这个标记——验收以 `.v6-board` 的 `style.transform` 是否变化为准。
- 题卡 / 小游戏关闭后场景会恢复；另有 60s 定时清理作为防御（避免压暗态残留），真实题卡层不受影响。

### 17.3 减少动画（reduced）

- 触发条件：设置里的「减少动画」（`table.js` 转发 `setReduced`）**或**系统 `prefers-reduced-motion: reduce`；后者命中时即使设置关闭也保持 reduced（以系统为准）。
- 生效表现：`data-cabin-reduced="1"`、根节点加 `is-reduced`；不创建相机动画、不震动、不闪白/波纹/心形脉冲；棋盘的 `transform` 被清空并保持空；场景只静态绘制一帧，不跑场景 rAF；以 reduced 挂载时粒子数量减半（运行中切换则粒子静止、不重建）；暖度/晨光直接到目标值；只保留 `opacity/filter` 的 100–200ms 过渡。
- `play()` 在 reduced 下立即 resolve（返回 `{reduced:true, planned:0}`），不排队、不延迟棋局。
- 运行时切换立即生效：关闭 reduced 会重启场景循环；开启 reduced 会停循环、清相机、重绘静态帧。

### 17.4 性能预算

| 项 | 做法 / 目标 |
|---|---|
| Canvas 分辨率 | 舷窗 DPR ≤ 2；灰尘层 DPR ≤ 1.5；两块窗 canvas + 一块灰尘 canvas，不额外建 canvas |
| 绘制量 | 每窗 22 颗星 + 4 团云；热度高时最多再加 8 颗星；宽度决定粒子数 16–32（以 reduced 挂载时减半） |
| 帧率 | 可见时场景约 30fps（帧间隔 <31ms 跳过绘制）；相机只在自己的动画期间跑 rAF，结束即释放 |
| 页面隐藏 | `visibilitychange` → `data-cabin-paused="1"`，停场景 rAF、停相机、清 transform；回到前台再启动 |
| 长帧目标 | 连续走子时长帧（>25ms）占比 ≤5%（冻结单目标；实测以 QA 的 `reports/v6/qa-perf.md` 为准） |
| 布局抖动 | 相机只写 `transform` / CSS 变量；测量棋盘/格位时临时 `transform:none` 再恢复，不触发重排循环 |
| 资源 | 不引外部图片 / 字体 / JS；噪点用内联 SVG data URI；首屏体积预算沿用 ADR-012（index gzip ≤140KB），实际体积与达标情况看 `reports/v6/` |

### 17.5 集成契约与降级

- `table.js` 在 `.v6-table` 里放 `<div class="v6-cabin" data-test="cabin">`；`mountCabin()` 调 `App.CabinScene.mount(cabinHost, { boardEl, reduced, sound, names })`，`boardEl` 是 `.v6-board`。
- `commit` 时 `playBoard(events)` 与 `CabinScene.play(events, { state })` 并行；场景返回的 Promise 永不 reject（reduced 立即 resolve），`table.js` 仍挂 `.then(null, …)` 兜底。
- 状态更新后调 `CabinScene.setMood({ heat, stage, turn, winner, phase, overlay })`；`overlay` 在题卡 / 小游戏打开时为 true。
- `App.CabinScene` 缺失、`mount` 返回 `null` 或抛错：主桌照常工作（场景宿主保持空白 + 暗色兜底背景），不弹阻塞提示。`unmount()` 恢复宿主与棋盘的原始样式。
- 调试钩子：`[data-test="cabin-scene"]`、`data-cabin-version="6.2.0"`、`data-cabin-reduced`、`data-cabin-cam`、`data-cabin-mood="night|dawn"`、`data-cabin-dawn`、`data-cabin-paused`；`App.CabinScene._debug()` 返回相机 / 场景 / 布局快照（仅自测，不是稳定契约）。

### 17.6 已知限制（V6.2）

1. **舷窗高度受 UI 限制**：舷窗只能放在顶部 HUD 与棋盘之间的空档里；棋盘偏上或屏幕矮（如 320×640）时窗高被压到最小约 64–66px，观感比设计稿扁——为了不挤占棋盘与按钮，这是有意的取舍。
2. **桌面反馈在桌板前沿**：棋盘盖住了桌板中心，所以涟漪 / 聚光 / 心形脉冲被定位在棋盘下沿的桌板边上（`board.top + board.height + 11~12px`），读作「桌沿回应」，不是棋子脚下的精确位置。
3. **相机只是棋盘的 2.5D transform**：没有真正的 3D 场景与景深；舷窗/桌板的视差只是 CSS 变量位移，幅度刻意很小。
4. **`setSound` 只保存开关**：场景目前不新增独立音效；声音仍由棋盘/UI 层负责，关闭声音后所有状态文本仍完整。
5. **收家 / 题卡的镜头是 base 相机**：`win` 与 `prompt` 走 base 动画，不写 `data-cabin-cam` 事件标记；验收看 transform 或 `data-cabin-mood="dawn"`，不要只等属性变化。
6. **视觉基线会变**：V6.2 有意重做主桌背景，`table` 视觉基线需要更新；`boot / prompt / ledger` 只有在确有变化时才更新（见 `reports/v6/qa-visual.md`）。
7. **场景是装饰层**：`aria-hidden`、不接收点击、不参与玩法；所有状态与操作仍在棋盘与 UI 层，关掉场景不影响一局。
