# 今晚飞行棋 V6 · 规则与数值

> 唯一事实来源：本文写「规则是什么、数值是多少」。实现细节看 `app/src/`，构建与发版看 `docs/REBUILD.md`，UI 文案看 `docs/v6/copy.md`。
> 口径优先级：`docs/v6/impl-freeze.md`（Lead 冻结）> 本文 > `docs/v6/spec.md` / `docs/v6/api-contract.md`。改数值 = 改 `app/src/engine/**` 里的常量，然后跑引擎测试。

一句话：两个人、一部手机、一枚环形星轨棋盘。题卡一起做，心动值一起涨，玩到「今晚最后一段」——**没有输赢**。

## 1. 一局的结构

| 阶段 | 屏幕 | 发生什么 |
|---|---|---|
| 门厅 | `boot` | 选快局 / 长夜、两个名字、两种颜色、四档尺度、边界；有存档时「继续今晚飞行棋」 |
| 主桌 | `table` | 掷骰、走子、抽题卡 / 小游戏 / 命运、心动值与连击、暂停入口、安全词常驻 |
| 收尾 | `table`（收尾卡） | 满足收尾条件后，两张收尾卡一人一张；处理完进回顾 |
| 回顾 | `ledger` | 6 类信息 + 题卡明细；「保存到以前的夜」「再开一夜」；可「存成图片」 |
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
2. **6 起飞**：只有掷出 6，才有一架飞机从机坪起飞。
3. **6 可再掷**：掷出 6，走完这一步后还能再掷一次（`rerollOnEverySix: true`）。
4. **选子**：有多个合法走子时给文字按钮（「红 · 第 1 架 · 从机坪起飞」这类），不自动替玩家选。
5. **无子可走**：明确写出原因（例如四架都在机坪、没掷到 6），然后换人；不静默换人。
6. **击落**：落在对方飞机所在格，对方飞机回机坪，并抽一张对应题卡。
7. **叠机**：落在自己飞机所在格，叠成一摞，抽「两人一起」的卡；叠机后有 1 步奖励（放过也保留，见 §8）。
8. **进航**：落到进航格抽一张进航题卡；**放过也照样进军**。
9. **到达**：走完 5 格航线到终点即 `arrived`；HUD 显示「在飞 N 架」。

规则开关在 `app/src/engine/flight-rules.js`。V6 冻结的两条：`skipHomeEntryBlocksEntry: false`（放过仍进军）、`skipStackKeepsBonusStep: true`（放过仍得叠机奖励步）；其余开关沿用暂定值，**进行中的旧局按 `state.rules` 快照走**。

## 4. 题卡

- 每张卡都有归属：格位题 / 击落 / 进航 → 当前行动方姓名；叠机 → 「两人一起」；收尾 → 收尾卡指定的人。
- 卡面显示类型、星级、来源。动作固定为 **做了 / 放过**。
- 「做了」：心动值 +8、连击 +1；「放过」：心动值 +3、连击不清零、不挡路、不扣分。
- 计入「目标题卡数」的只有 6 类普通卡：真心话 / 大冒险 / 靠近 / 击落 / 叠机 / 进航。**小游戏、命运卡、收尾卡不计入**，但都会结算心动值与连击。
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

## 6. 命运格（第 5、29 格）

- 落上后同时给两张**不同池**的卡，二选一；另一张放回池子。
- 池子随尺度变：温柔/暧昧 = 靠近 + 真心话；热烈 = 大冒险 + 真心话；不设限 = spark + 真心话。
- 选择「做了」+8、「今晚先不选」+3（不惩罚），都不计入目标题卡数。
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

## 8. 目标与收尾（无输赢）

| 模式 | 飞机 | 目标题卡 | 目标心动值 | 预计时长 |
|---|---|---|---|---|
| 快局 `quick` | 2 架/人 | 4 张 | 40 | 8–12 分钟 |
| 长夜 `long` | 4 架/人 | 8 张 | 80 | 25–40 分钟 |

**收尾条件（任一满足）**：

1. `cardsProcessed >= targetCards`；或
2. `meta.heat >= targetHeat`；或
3. 长夜：任意一方有 1 架飞机到达终点。

判定发生在**普通题卡 / 小游戏的结算之后**，不发生在掷骰或走子时。命中后不再抽普通题卡，进入「今晚最后一段」：

- 从 `ending` 池按 mild 权重抽 **2 张收尾卡**，一人一张（顺序：先 a 再 b；允许同池）。
- 两张都可以「放过」；放过不减 heat、不判失败。
- 两张处理完 → `phase='ended'` → 生成 ledger → 进入今晚回顾。
- 结束页**不判输赢**：`winnerId` 保留字段但 V6 不展示；ledger 的 `ending` 为 `'shared'`（走到收尾）或 `'safe'`（安全词/主动结束）。
- 「输赢」只在 P2 的「长夜记录谁先到家」彩蛋里可能出现，不影响结束页。

### 不惩罚「放过」（红线，逐条）

1. 心动值不减少（可 +3）。
2. 不阻断进终点：进航题放过 → 照样进军。
3. 不丢奖励步：叠机题放过 → 仍得固定奖励步。
4. 连击不清零。
5. 回顾只写「今晚先放过」，不写失败 / 未完成 / 扣分。
6. 放过也计入目标张数，所以全放过的局也能按目标收尾。

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

回顾页固定 6 类信息（`docs/v6/copy.md` §6.2 为文案口径）：

| 项 | 内容 |
|---|---|
| 今晚 | 日期 · 姓名 & 姓名 · 尺度 |
| 时长 | 从开始到结束 |
| 题卡 | 共 N 张 · 做了 D · 放过 S |
| 心动值 | 数值 · 阶段名 |
| 最高连击 | `streakBest` |
| 小游戏 | 次数 · 完成 X · 跳过 Y |

- 下方「今晚的每一张」按时间列出每张卡的归属、类型、星级、结果；原文默认收起，点「展开原文」才显示。
- 小游戏明细写成「温度计 · 完成」「转盘 · 跳过」，**不允许出现「（这一笔没有句子）」**。
- 「存成图片」：本机 Canvas 生成 1080×1350 PNG（暗夜星轨 + 暖光纸感）；不请求网络、不上传、不生成外链；默认不画题卡原文（显式 `includeText` 才画，且最多 4 条）。
- 「以前的夜」最多保留 **60 局**；旧条目缺字段时按兜底逻辑渲染。
- 回顾页**没有输赢**：只有「一起完成 / 放过 / 心动值」，不写失败。

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
  targetCards: number, targetHeat: number,  // quick 4/40，long 8/80
  cardsProcessed: number,                   // 6 类普通卡结算数（做了/放过都算）
  meta: { heat, stage, streak, streakBest, milestones, updatedAt },
  endingQueue: Prompt[] | null, endingIndex: number,
  phase: 'playing'|'ended'|'safe-ended', turn: 'a'|'b',
  pieces: [...], log: [...], rules: {...}, rng: number, awaiting: {...}
}
```

`ledger`（写进 history 的回顾数据）：

```ts
{
  v: 2, date, startedAt, endedAt, durationMs, names, colors, scale, mode, planeCount,
  boundaries, ending: 'shared'|'safe', winnerId: null,
  stats: { cardsDone, cardsSkipped, heat, bestStreak, minigames, planesHome },
  prompts: [{ kind, outcome, actorId, cardId, text, star, pool, source }],
  minigames: [{ kind, outcome, actorId }]
}
```

迁移规则（`Flight.validate()`）：

- 只接受 `kind:"flight"`、`v:1` 或 `v:2`；`v:1`（V5）**原样续玩**：补 `mode / targetCards / targetHeat / cardsProcessed / meta / endingQueue` 等可选默认值，**永不新增必填项**，读不出也不丢数据（先备份再移除）。
- V5 停在「赢家收尾」的单卡局面：保留已发的那张，按单卡收束。
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
| 快局长夜的目标张数 / 目标心动值 / 收尾条件 | `engine/flight-engine.js` 的 `targetsFor()` / `shouldEnd()` |
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

> 改上面任何一条之前，先改 `docs/v6/impl-freeze.md`（或让 Lead 出 ADR），再改本文与实现，避免文档和代码各说各话。
