# 今晚飞行棋 V9.1.1 · 规则与数值（含 V6.2 场景、V7 镜头、V8 真 3D、V9 电影写实、V9.1 小物/纯音乐）

> 唯一事实来源：本文写「规则是什么、数值是多少」，以及 V7 / V8 / V9 / V9.1 的表现层口径。实现细节看 `app/src/`，构建与发版看 `docs/REBUILD.md`，UI 文案看 `docs/v6/copy.md`。
> 口径优先级：`docs/v9/impl-freeze.md`（V9 电影写实 / 音频 / 缩放）> `docs/v8/impl-freeze.md`（V8 真 3D 主桌）> `docs/v7/impl-freeze.md`（V7 镜头/主题/格子舞台）> `docs/v6/impl-freeze-cabin.md`（V6.2 沉浸主桌）> `docs/v6/impl-freeze-v6.1.md`（V6.1 规则调整）> `docs/v6/impl-freeze.md`（V6.0 冻结）> 本文 > `docs/v6/spec.md` / `docs/v6/api-contract.md`。改数值 = 改 `app/src/engine/**` 里的常量，然后跑引擎测试。

一句话：两个人、一部手机、一枚环形星轨棋盘。题卡一起做，心动值一起涨，**谁先把自己的飞机全部送回家，谁「先到家」**；之后两张收尾卡一人一张——只写「先到家」，不写输赢。

V6.2 起，主桌多了一层「云海机舱」场景；V7 起，每回合再套一条电影镜头链，题卡改在 45° 格子舞台上呈现；V8 起，主桌默认换成**真 3D**（three r180 独立 chunk，失败回 V7）；V9 起，3D 主桌升为**电影写实**（PBR 胡桃木/黄铜/绒布、机舱环境、ACES 光色），声音换成采样拟音 + 环境循环，3D 俯瞰/空闲加入 0.8–1.5× 缩放；V9.1 起再给机舱/桌面加 14 类生活小物、7 项氛围动画与 13.52s 纯音乐，并把主桌暂停按钮补到 44px。**V9.1 / V9 / V8 / V7 / V6.2 的规则、数值、题库、存档完全一致**；V6.2 的场景口径见 §17，V7 的镜头 / 舞台 / 主题见 §18，V8 的 3D 架构 / 固定飞机数学 / 降级见 §19，V9 的材质 / UI 令牌 / 音频 / 缩放见 §20，V9.1 的小物 / 动画 / 纯音乐 / 修复见 §21。

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
- V7 只改主桌的呈现：每回合多一条镜头链（§18.1），题卡在 45° 格子舞台打开（§18.3）；门厅多一排「今晚的桌面」（§18.4）。阶段、按钮、引擎接口与结束条件都不变。
- V8 只改主桌的呈现（默认 3D，§19）：`settings.board3d`（`auto|off|on`，默认 `auto`）决定进 3D 还是 V7；3D 多一条镜头链与固定飞机飞行，题卡只出右侧 DOM 卡；阶段、按钮、引擎接口、结束条件与 V7 相同。
- V9 只改表现层（§20）：3D 材质/光照/机舱/道具、全局 UI 令牌与字体、采样音频与环境声、3D 缩放；阶段、按钮、引擎接口、存档结构与结束条件与 V8 相同；`settings.board3d` / `settings.theme` 语义不变，缩放不写存档。
- V9.1 只加表现层与一处可访问性修复（§21）：3D 小物 / 机舱细节 / 7 项氛围动画、music 床与 `mus-calm`、主桌暂停按钮 44px；V9.1.1 修 low 画质小物可见性、前排裁切与 V7 测试夹具。规则、题库、存档、边界与安全词不变。

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
| `App.CabinScene` | `view/cabin.js` | V6.2 机舱场景 + 灯光/视差：`mount / unmount / setMood / play / setReduced / setSound / setCameraEnabled`；V7 起 Cinema 接管 `boardEl` 后 `setCameraEnabled(false)`，场景只做视差/灯光 |
| `App.Cinema` | `view/cinema.js` | V7 镜头链：`mount / unmount / overview / roll / pov / chase / land / returnToOverview / stage / setTheme / setReduced / setSound / skip / _debug`；只改 `boardEl.style.transform` 与宿主 `--cv7-*` 变量，不调引擎、不写 localStorage |
| `App.CellStage` | `ui/overlay/cell-stage.js` | V7 45° 格子舞台 + 内容卡：`open(host, prompt, state, handlers)` → `close()`；兼容旧 PromptCard 的 `data-test`；不调引擎 |
| `App.Bear` | `ui/bear.js` | V7 向导小熊（程序化 SVG）：`render({outfit,mood,glyph,reduced}) / play / destroy / html`；装饰层（`aria-hidden`），不承载可读文本 |
| `App.Themes` | `ui/themes.js` | V7 三主题：`list / get / apply / set / bearOutfit / tokens / varsText / particles / ids / version`；`get()` 读 `settings.theme`，默认 `cloud` |
| `App.PromptCard` | `ui/overlay/prompt-card.js` | `open(host, prompt, state, handlers)`；V7 起作为 CellStage 缺失/抛错时的回退（V6 行为保留） |
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
| 镜头时长 / 位置 / 震动幅度（V7） | `app/src/view/cinema.js` 的 `ROLL_MS / POV_MS / LAND_MS / RETURN_MS / REDUCED_MS`、`rollPose() / povPose() / chasePose() / landPose()`、`chaseMs()`、`shake()` |
| 每回合镜头链的编排（V7） | `app/src/ui/screens/table.js` 的 `splitEvents()` / `cinematicMotion()` / `runShow()` / `openPrompt()` |
| 45° 舞台布局、变体、长文本（V7） | `app/src/ui/overlay/cell-stage.js` 的 `.cs-stage` / `.cs-card` / `.cs-scroll`、`buildMarkup()`、`fitStage()` |
| 主题表、主题令牌、小熊服装（V7） | `app/src/ui/themes.js` 的 `THEMES` / `palette()` / `bearOutfit()`；`app/src/ui/bear.js` 的 `OUTFITS` |
| 门厅 / 设置的主题入口（V7） | `app/src/ui/screens/boot.js`、`app/src/ui/screens/settings.js` 的 `[data-theme-pick]` 处理 |
| 构建模块顺序（V7） | `tools/rebuild/build_app.py` 的 `JS_MODULES` 与 `V7_ORDER_RULES`（先定义后使用） |

## 15. 视觉令牌（摘要）

- 底色：`#08060F / #120D24 / #150F2A`；星云紫 `#241540`，光晕 `#8E7BD8`。
- 暖光：琥珀 `#F3C077`、深琥珀 `#E2965E`、玫瑰 `#E9887A`。
- 文字：米白 `#FBF3E7`、次级 `#C9B6CE`、弱 `#8E7C9E`；暖纸题卡 `#F7EAD6 → #F1DFC4`，纸上字 `#2C1C15`。
- 四色棋子：红 `#F08C80`、黄 `#F0C877`、蓝 `#8FA6E8`、绿 `#7FC9A8`。
- 字体：标题/数字 `"Noto Serif SC","Songti SC","STSong",serif`；正文 `"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif`（不引外链字体）。
- 动效时长：`--t-fast:160ms / --t-mid:320ms / --t-slow:640ms`；减少动画时关键反馈 ≤100ms。
- 骰子 / 走子 / 题卡动画上限：1.6s / 2.0s / 0.4s（`docs/v6/impl-freeze.md` §3.1）。
- V7 主题令牌：`App.Themes.tokens()` 下发 `--v7-board-rim / --v7-board-rim-2 / --v7-square-glow / --v7-card-paper / --v7-scene-tint / --v7-cta` 等；主题样式由 `ui/themes.js` 注入 `<style id="style-v7-themes">`，**不重写 `base.css`**，同时保留 V6 旧令牌（`--bg0 / --amber / --ink / --line`…）以兼容旧组件。
- V7 45° 舞台配色：`CellStage` 优先用 `App.Themes.tokens()` 把 `--v7-card-* / --v7-board-rim*` 映射到 `--cs-paper* / --cs-accent*`；主题模块缺失时用模块内置的三套配色。
- **V9 令牌（当前生效，`app/src/styles/base.css` 的 `:root,html[data-theme]`）**：
  - 底色：墨黑 `--bg0 #07080D`、`--bg1 #0A121A`、深海蓝 `--bg2 #0C1722`；黄铜 `--brass/--amber-deep #B08A57`、暖琥珀 `--amber #E0A45E`、酒红 `--wine #732A35`、玫瑰 `--rose #9B4A52`。
  - 文字：米白 `--ink #F2E8D8`、次级 `--dim #B7A88F`、弱 `--dim2 #7E705C`；象牙纸 `--paper #F1E4CE`、`--paper2 #E7D6B8`、纸上字 `--paper-ink #2A1D14`。
  - 四色棋子：红 `#9E4A44`、黄 `#C99A57`、蓝 `#5F7A8C`、绿 `#4E6B62`（低饱和珐琅色，3D 里对应 `constants.js` 的 `HEX`：`#C9544A / #D7A24A / #5E7FB0 / #5C8F72`）。
  - 玻璃 / 线：`--glass rgba(8,12,18,.72)`、`--line rgba(176,138,87,.24)`；圆角 `--r-md 10px / --r-lg 14px`；动效 `--t-fast 150ms / --t-mid 300ms`；缓动 `--ease-out cubic-bezier(.16,1,.3,1)`。
  - 字体：标题 `"Noto Serif SC","Songti SC","STSong",serif`；正文 `"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif`（不引外链）。
  - `html[data-theme]` 同时重新声明同一套 V9 令牌，所以 cloud / star / paper 三主题下 UI chrome 仍统一为墨黑 / 黄铜 / 暖纸；V6/V7 的星轨紫 / 粉彩令牌只在旧组件兼容层与 V7 SVG 棋盘路径保留。

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
14. **POV 是固定机位**（V7）：`App.Cinema.pov()` 只做一段前景（机头 / 机翼 / 速度线 / 云）+ 棋盘倾斜，不做自由视角、不能转头环顾；见 §18.2 / §18.6。
15. **小游戏与功能格没有进 45° 舞台**（V7）：`CellStage` 已能渲染「开始小游戏」和功能格说明两种变体，但 `table.js` 只对 `prompt / ending-prompt` 调用 `CellStage.open`；落在小游戏格仍直接开旧 `App.MiniGame` 面板，跳 / 飞 / 进航走棋盘事件或进航题卡。见 §18.6。
16. **格子序号只部分显示**（V7）：内容卡能读「来自 真心话格」，但「第 N 格」只在引擎带上 `preSquareId`（如进航）或调用方另传 `squareIndex / cellIndex` 时出现；普通题卡不保证有序号。见 §18.6。
17. **主题不重绘主桌机舱与棋盘本体**（V7）：`App.Themes` 主要作用于门厅 / 设置 / 回顾的全局背景层、文字与按钮令牌、45° 舞台与内容卡、小熊服装、Cinema 的 POV 前景色；主桌的舱壁 / 舷窗 / 小桌板（`cabin.js`）与棋盘 SVG（`board.js`）仍是 V6.2 固定配色，只有继承到的 `--ink` 等通用令牌会变。`--v7-board-rim / --v7-square-glow` 已下发，当前由 `CellStage` 消费。见 §18.4 / §18.6。
18. **主题粒子是预留元数据**（V7）：`App.Themes.particles()` 暴露 `{kind,count,speed,colors}`，但机舱 Canvas 与棋盘粒子仍按 V6.2 的方式绘制，尚未按主题切换粒子种类 / 数量。见 §18.6。
19. **3D chunk 预算改为 180KB 目标 / 200KB 上限**（V9）：PBR + 机舱环境使 chunk 从 V8.2.2 的 155.06 KiB 涨到 **166.46 KiB gzip**；构建门目标 ≤180KB（冻结单 §4 上限 200KB），不再沿用 V8 的 ≤160KiB 验收。
20. **V9 的 Bloom / 景深不是重后处理**（V9）：high 档用发光 sprite（阅读灯 / 舷窗 / 终点 / 舞台光晕）与 FogExp2 雾化模拟 Bloom/DOF，没有引入 EffectComposer 后处理链；暗角 + 胶片颗粒是单 pass 全屏 quad。
21. **首屏骨架屏仍是旧配色**（V9）：`app/index.template.html` 的 `#boot-skeleton` 仍是 V6/V7 的星轨紫渐变（`#241540 / #120D24 / #08060F`）与旧 `theme-color #08060F`，未随 V9 换成墨黑 / 深海蓝；不在 V9 写作用域，登记为已知偏离。
22. **V7 降级画面没有 V9 化**（V9）：V9 只重做 3D 主桌与 UI chrome；没有 WebGL2 / 手动选 V7 时，SVG 棋盘、V7 机舱仍是 V8 配色（`view/board.js`、`view/cabin.js` 未改）。
23. **缩放只在 3D 的 overview / idle**（V9）：镜头链、题卡、加载中锁定；V7 没有缩放；缩放不写存档，重新 mount 回 1×。
24. **首装体积 / 时间未优化完**（V9，V9.1 更新为 17 wav / 1.4 MB，见 §21.6）：16 个 wav（819.4 KB）全部进 SW 预缓存；工作台记录首装 3D 约 7s、环境音约 10s 起（2026-11-19 本机对 GitHub Pages 网络），真机 / 弱网待复测；可优化为减少预缓存或只预载核心 SFX。
25. **320 前排小物下半被裁**（V9.1.1）：前排小物已收进真实主桌裁切带，390/430 可见 10/10 锚点；320×568 host 仅约 298px 高，前排小物下半仍会被底边裁切（后排 5 件 + 双杯 + 托盘可见）。这是给棋盘 / 按钮让位的取舍，见 §21.5。
26. **座椅靠背 / 扶手没做**（V9.1）：当前机位下只能落到画框外或压桌面，FE 用行李舱 / 窗帘 / 壁板层次替代；骰子托盘是空盘（真骰子仍在 `DIE_HOME`）；相框照片是程序化夜色散景（无人物）。
27. **纯音乐受预算限制取 13.52s**（V9.1）：16 s 的 22.05kHz mono WAV 为 705,600 B，超 600 KiB 预算；按允许的 12–16 s 回退档取 13.52 s（596,332 B），仍是 71 BPM / D 大调 / 4 小节无缝。真机人耳混音未验。
28. **3D chunk 涨到 174.58 KB gzip**（V9.1）：小物/机舱细节使 chunk 从 V9.0.1 的 166.46 KB 涨到 174.58 KB；构建改按 `--budget-3d 200` 验收（≤200 KB），不再按 V9 的 180 KB 目标判定。
29. **首屏贴着 180 KB 上限**（V9.1.1）：首屏总 gzip 179.12 KB（门禁 180 KB，余量约 0.88 KB）；后续再加首屏内容需要先减字节或 `--split-screens`。
30. **V7 E2E 夹具是测试专用**（V9.1.1）：`window.__E2E_BOARD3D_OFF__` 只由 `qa/v6/e2e_v6.py` 设置，`table.js` 在 `board3dMode()` 里优先返回 `off`；正常用户没有这个全局量，设置行为不变。

> 改上面任何一条之前，先改 `docs/v6/impl-freeze.md`（或让 Lead 出 ADR），再改本文与实现，避免文档和代码各说各话。

## 17. 视觉与动画：夜航客舱（V6.2）

> 实现：`app/src/view/cabin.js`；集成：`app/src/ui/screens/table.js`。冻结口径：`docs/v6/impl-freeze-cabin.md`。
> 本节只写「场景怎么分层、镜头对哪些事件有反应、reduced 与性能边界」，不重复 §15 的颜色令牌。
> **V7 起，`boardEl` 的 `transform` 由 `App.Cinema` 独占**（`table.js` 在 Cinema 挂载成功后调 `CabinScene.setCameraEnabled(false)`）；本节 17.2 的相机事件表只作为 V6.2 回退路径与场景光效的参考，镜头位置与时长以 §18.1–§18.2 为准。

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

---

## 18. V7：云海机舱 · 45° 格子剧场

> 实现：`app/src/view/cinema.js`（镜头链）、`app/src/ui/overlay/cell-stage.js`（45° 舞台 + 内容卡）、`app/src/ui/bear.js`（向导小熊）、`app/src/ui/themes.js`（三主题）；集成：`app/src/ui/screens/table.js`（每回合编排）、`boot.js` / `settings.js`（主题入口）。
> 冻结口径：`docs/v7/impl-freeze.md`；需求与 AC：`docs/v6/spec.md` §0.2。
> **V7 不改规则、数值、题库、存档结构、边界与安全词**（与 V6.2 完全一致），本章只写表现层。

### 18.1 每回合镜头链（状态机）

`App.Cinema` 在 `.v6-table` 内挂 `[data-cinema]`（`z-index:1`），在宿主上写 `data-cinema-state`；`table.js` 按事件把一回合拆成 `dice / motion / rest` 三段再编排。

| # | `data-cinema-state` | 画面 | 代码里的时长 |
|---|---|---|---|
| 1 | `overview` | 整个棋盘俯瞰；回位、清 POV / 光晕 / 压暗 | 回位过渡约 300–320ms（常驻态） |
| 2 | `roll` | 骰子落桌：棋盘轻推近 + 560ms 处一次极轻震动 | `ROLL_MS = 1000` |
| — | `overview`（多子可走时） | 回俯瞰等玩家选子，选完后继续 `pov` | 约 320ms + 用户操作 |
| 3 | `pov` | 第一人称：机头 / 机翼 / 速度线 / 云掠过，棋盘倾斜 | `POV_MS = 1100` |
| 4 | `chase` | 第三人称跟拍：目标格发光，飞机由远到近 | `chaseMs()`：`clamp(1420 + 步数×26, 1500, 2300)` |
| 5 | `land` | 目标格尘土 / 涟漪 + 轻震，镜头落到落点方向 | `LAND_MS = 520` |
| 6 | `cell45` | 棋盘压暗 + 目标格发光；舞台由 `CellStage` 画 | 打开舞台即进入（`table.js` 在 `openPrompt` 里调 `stage('cell45')`） |
| 7 | `bear` | 小熊探头、右侧内容卡滑入 | 舞台打开后 `640ms` 切到 `bear` |
| 8 | `return` | 卡片收起、小熊挥手、拉回俯瞰 | `RETURN_MS = 800` |

- 整条镜头链的冻结目标是 **5–8s**（不含用户答题）；上表是各段代码参数，棋盘骰子 / 走子演出可能更长，实测以 QA 报告为准。
- `choose-piece` 不是 Cinema 状态：`table.js` 调 `overview` 回俯瞰等待（`data-cinema-state="overview"`），选完子再走 `pov`。
- 没有位移（不能动 / 再掷）时 `cinematicMotion()` 直接 `overview({ms:260})`，不放 POV / 跟拍。
- 题卡 / 小游戏 / 收尾结算：棋盘演出结束后 `returnToOverview()` 把镜头拉回俯瞰。

### 18.2 POV 与跟拍实现

- **只动两处**：`boardEl.style.transform` 与宿主上的 CSS 变量 `--cv7-cam-x / --cv7-cam-y / --cv7-cam-s / --cv7-tx / --cv7-ty`；不写布局、不拦点击（`.cv7` 与子元素 `pointer-events:none`，只有「快进」按钮可点）。
- **transform 形式**：`translate3d(x,y,0) scale(s) rotate(rz)`；有俯仰时前置 `perspective(1000px)` 并追加 `rotateX(rx)`。`boardBox()` 测量时临时把 `transform` 置 `none`，量完恢复，避免累积位移。
- **POV**：`povPose()` = 向下 `board.height × 5.2%`、`scale 1.13`、`rotate -2.4deg`、`rotateX 21deg`；前景 `.cv7-pov` 含座舱顶框、左右窗框、机头/仪表台、左右机翼、速度线、5 团掠过的云和暗角。它是**固定机位**，不随手指或设备方向变化。
- **跟拍**：`endpointOf(events)` 从 `takeoff / move` 的 `path` 末尾、`jump / fly` 的 `to`、`stack` 的 `at` 取目标格；`squareDir()` / `squareCenter()` 把目标格换算成方向与像素坐标；`chasePose()` 位移最多 `board.width × 20%` / `board.height × 17.5%`、`scale 1.095`、轻微旋转与 `rotateX -4.2deg`。目标格由 `.cv7-glow` 发光（`--cv7-tx/ty` 定位）。
- **落地**：`pulseLand()` 在目标格触发 `.cv7-dust` / `.cv7-ripple`，再 `shake(4.5px, 0.42deg, 260ms)`；快进到终态时不再补震动。`landPose()` 位移最多 `board.width × 24.5%` / `board.height × 21.5%`、`scale 1.115`。
- **生命周期**：`mount()` 保存并改写 `boardEl` 的 `transform / will-change / transform-origin / backface-visibility`；`unmount()` 还原。页面 `visibilitychange` 隐藏时把当前阶段收束到终态，避免回来时间跳变。
- **状态 / 调试钩子**：`data-cinema-state`、`data-cinema-version="7.0.0"`、`data-cinema-reduced="0|1"`、`data-cinema-theme="cloud|star|paper"`、`data-cinema-skip="0|1"`；`data-test="cinema" / "cinema-pov" / "cinema-skip" / "cinema-glow" / "cinema-dust" / "cinema-ripple"`；`App.Cinema._debug()` 返回 pose / chain / stats 等快照（自测用，不是稳定契约）。

### 18.3 CellStage：45° 格子舞台与内容卡

- **层级**：根节点 `.cs-root`（`data-test="cell-stage"`）`position:fixed; inset:0; z-index:320`，高于题卡宿主（30）与 `#overlay`（300），低于暂停（340）与安全词（380）；根节点 `pointer-events:none`，只有内容卡 `.cs-card` 与「回到这张」按钮可点，所以棋盘、安全词、暂停都不被拦截。
- **布局**：`.cs-stage` 最大宽 520px、高 `min(520px, 100vh - 104px)`；宽 430 时 `grid-template-columns: 28% + 4% 间距 + 68% 内容卡`；`@media (max-width:360px)` 收成 `22% + 4% + 74%`，卡内边距更小。`fitStage()` 量内容自然高度后把舞台高度钳在 `[min(330, 上限), min(520, 视口高 - 104)]`，写 `data-stage-h` 与 `data-scrollable`。
- **45° 格子**：左列 `.cs-cell` + `.cs-cell-persp`（`perspective:560px`）+ `.cs-cell-floor`（`rotateX(52deg) rotateZ(-45deg)`，带厚度投影与网格线）→ 读作一个斜 45° 立起来的格面；上方是类型徽章 / 「来自 真心话格 · 第 N 格」标签，下面是探头的小熊。格子按主题换材质（云纹 / 星点 / 纸纹）。
- **内容卡**：暖纸底 + 类型色 kicker；`data-test` 与旧 `PromptCard` 对齐：`prompt-card / prompt-kicker / prompt-actor / prompt-meta / prompt-stars / prompt-source / prompt-reroll / prompt-stars-help / prompt-text / prompt-attrib / prompt-done / prompt-skip / prompt-fate-option / prompt-fate-skip / prompt-collapse / prompt-restore / prompt-foot`；新增 `cell-stage / cell-stage-cell / cell-type / cell-index / cell-theme / bear-host`。
- **变体**：普通题卡（类型/星级/来源/归属 + 做了/放过 + 先看棋盘）；命运格（两张二选一 + 今晚先不选）；收尾信（一人一张，可放过）；进航题卡（`home-entry`）。**小游戏格与功能格说明变体已渲染但当前流程未接入**（见 §18.6）。
- **长文本**：`.cs-scroll` 是卡内唯一的滚动区（`flex:1; overflow-y:auto`），按钮区 `.cs-acts` 在卡底固定；「先看棋盘」把舞台收成右下角「回到这张」，按 Esc 也可切换；关闭时 `.cs-exit` 淡出约 220ms。
- **降级**：`App.CellStage` 缺失或 `open()` 抛错 → `table.js` 回退 `App.PromptCard`；`App.Themes` 缺失 → `cloud` + `pilot`；`App.Bear` 缺失 → `.cs-nobear` 无熊布局；`App.Themes.get()` 抛错按 `cloud/pilot` 处理，不读 DOM 兜底。

### 18.4 主题与向导小熊

**三主题**（`App.Themes.list`，`cloud` 在首位；`get()` 无参读 `Store.getSettings().theme`，未知值回落 `cloud`）：

| id | 名字 | 小熊 outfit | 观感 / 令牌 |
|---|---|---|---|
| `cloud`（默认） | 云海机舱 | `pilot` 机长小熊（帽子 / 围巾 / 护目镜） | 冷蓝云海 + 暖阅读灯；令牌 `--bg0 #071320`、`--amber #F2C98A`、`--v7-cta` 冷蓝→暖金 |
| `star` | 星轨夜航 | `starlight` 星轨小熊（披风 / 星星别针） | 深紫星空 + 金色星轨；`--bg0 #08060F`、`--amber #F3C077` |
| `paper` | 纸雕童话 | `paper` 纸雕小熊（纸围巾 / 圆眼镜） | 暖纸层叠 + 台灯；`--bg0 #140F0B`、`--amber #D8A46A` |

- **apply / set**：`apply(rootEl, id)` 在 `<html>`、`<body>` 与传入根节点上写 `data-theme`，注入 `<style id="style-v7-themes">`（只覆盖变量与背景层，不重写 `base.css`），并同步 `<meta name="theme-color">`；`set(id, rootEl)` 同 apply 并写 `Store.saveSettings({theme:id})`。同一主题重复 apply 不重复 emit（幂等）。
- **主题改变什么**：`#bg` 背景 / 星云 / 星轨 / 颗粒、通用文字与玻璃令牌、主按钮渐变、45° 舞台与内容卡材质、小熊服装、Cinema 的 POV 前景色（Cinema 内部三套 `accent/sky/wing/instrument`）。
- **主题不改变什么**：52 格拓扑、题卡内容、规则、边界、安全词；主桌机舱与棋盘 SVG 的固定配色（见 §16 第 17 条）。
- **入口**：门厅「今晚的桌面」在「摆上棋盘」之前，`data-test="theme-cloud|star|paper"`（容器 `data-test="themes"`、说明 `theme-desc`）；点一下立即 `App.Themes.set()` 落盘并换肤，刷新记住。设置页同一排 `data-test="settings-theme-*"`（容器 `settings-themes`），说明 `settings-theme-desc`，当前主题名 + 「题目、规则、你们的边界都不变」。
- **小熊**：`App.Bear.render({outfit, mood, glyph, className, reduced})` 返回 `data-test="bear"`、`aria-hidden="true"`、`data-outfit`、`data-mood`、`data-glyph` 的节点；`play(el, mood)` 触发 `nod / put / wave / happy / blink / ear / peek`；`destroy(el)` 清计时器。CellStage 在「做了」→ `nod`、「放过」→ `put`、「二选一 / 小游戏」→ `happy`、「继续」→ `wave`；小熊始终不承载可读文本，文字都在内容卡里。
- **reduced**：小熊与 45° 舞台的循环动画静止；`data-reduced="1"`，只保留淡入。

### 18.5 编排、快进、reduced 与性能

- **table 编排**：`splitEvents()` 把事件分成 `dice / motion / rest`。`roll`：`BoardView` 的 dice 段与 `Cinema.roll()` 并行 → 若 `awaiting=choose-piece` 则 `Cinema.overview()` 等待 → 否则 `cinematicMotion()`（`POV` → `BoardView.play(motion)` 与 `Cinema.chase()` 并行 → `Cinema.land()`）→ 其余事件。`move`：选子后同样走 `POV → 跟拍 → 落地 → 其余`。题卡 / 小游戏：棋盘演出后 `Cinema.returnToOverview()`。所有 Cinema 调用都防御式（缺失 / 抛错 / reject → resolved `null`，棋局照常）。
- **CellStage 接入**：`openPrompt()` 优先 `App.CellStage.open()`，成功即 `Cinema.stage('cell45')`，`640ms` 后 `stage('bear')`；`handlers.done / skipped / choose / continue` 交给 `resolvePrompt` 或收起舞台。`resolve` 后 `table.js` 关舞台 → `Cinema.returnToOverview()`（由 `runShow` 的 prompt 分支触发）。
- **快进**：镜头动画期间显示「快进」（`data-test="cinema-skip"`，宿主 `data-cinema-skip="1"`）；`Cinema.skip()` 把当前阶段直接推到终态、resolve、并回调 `onSkip`，`table.js` 用 `BoardView` 的 Esc/pointerdown / `skip()` 让棋盘演出也到终态；`skipAll` 让后续阶段各约 130ms 直接到终态，直到回 `overview`。快进后不再补震动。
- **reduced**：`prefers-reduced-motion` 或设置「减少动画」→ `data-cinema-reduced="1"`、Cinema 零 `rAF`、零 `transform`、无 POV / 跟拍 / 震动；`pov()` / `chase()` 立即 resolve，`land()` / `overview()` / `return` 走 `REDUCED_MS = 160ms` 淡入；舞台 `data-reduced="1"` 静态出现；棋盘 / 场景的 reduced 规则沿用 §17.3。
- **性能**：全部走 `transform / opacity`，不跑滤镜 / 大层模糊；一条 `rAF` 只在过渡期间运行，结束释放；页面隐藏收束当前阶段；卸载顺序 `Cinema → CabinScene → BoardView`（Cinema 先还原 `boardEl`，避免场景还原把镜头写回）。长帧（>25ms）目标占比 ≤5%，实际以 `reports/v6/qa-perf.md` 的 V7 报告为准。
- **构建 / 版本**：`App.version = "7.0.0"`；`index.template.html` 的 title/og 为 V7；`manifest.webmanifest` name 为 V7；`build_app.py` 的 `JS_MODULES` 按 `themes → bear → … → cabin → cinema → … → prompt-card → cell-stage → table` 排列，并有 `V7_ORDER_RULES` 闸门防止「先使用后定义」。

### 18.6 已知限制（V7）

1. **POV 不是自由视角**：固定机位前景，不能转头 / 环顾 / 跟手指，也不改变可点区域；本质是「坐在驾驶舱里往前看」的一段镜头。
2. **小游戏没进 45° 舞台**：落在温度计 / 转盘格仍直接开旧 `App.MiniGame` 面板；`CellStage` 的「开始小游戏」变体已渲染但 `table.js` 未接线。
3. **功能格说明变体未接入**：引擎的 `awaiting` 只有 `prompt / ending-prompt / minigame / choose-piece / roll`，没有「功能格 prompt」；跳 / 飞走棋盘事件，进航走 `home-entry` 题卡，`CellStage` 的 `jump / fly / function` 变体当前不会被真实流程打开。
4. **格子序号只部分显示**：`squareIndexOf()` 依次读 `squareIndex → cellIndex+1 → preSquareId`（如 `ring:12`）；普通题卡的引擎 `prompt` 不带这些字段，所以只显示「来自 真心话格」。
5. **主题不重绘主桌机舱 / 棋盘本体**：`cabin.js` 的舱壁 / 舷窗 / 桌板与 `board.js` 的 SVG 格位是 V6.2 固定配色；主题主要改变全局背景层、文字 / 按钮令牌、45° 舞台与内容卡、小熊服装与 POV 前景。`--v7-board-rim*` 等变量已下发，当前由 `CellStage` 使用。
6. **主题粒子是预留元数据**：`App.Themes.particles()` 已暴露种类 / 数量，但场景与棋盘粒子没接，视觉上不随主题变化。
7. **45° 是 CSS 3D 透视，不是真 3D 引擎**：`perspective 560px + rotateX(52deg) + rotateZ(-45deg)` 的块面 + 投影；小屏（≤360）格子与卡片按 22% / 74% 收紧。
8. **层级是固定数值**：舞台 320 < 暂停 340 < 安全词 380；改层级要同时核对 §17 的机舱层与题卡宿主，别把安全词压下去。
9. **视觉基线需要按 V7 重建**：主桌、45° 舞台、三主题的门厅/设置都可能变；`boot / prompt / ledger` 只在确有像素变化时更新（以 `reports/v6/qa-visual.md` 为准）。
10. **回退是能力降级**：`Cinema` 缺失 → V6.2 的 CabinScene 相机；`CellStage` 缺失 → 旧 `PromptCard`；`Themes` 缺失 → `cloud`；`Bear` 缺失 → 无熊布局。降级后能玩，但不再有 V7 的镜头 / 舞台 / 小熊。
11. **真机未验**：iOS Safari / Android Chrome 的 CSS 3D、长按、安全区仍未真机验证（沿用 V6.2 遗留）。

### 18.7 QA 钩子与自测页

| 钩子 | 位置 | 用途 |
|---|---|---|
| `data-cinema-state / version / reduced / theme / skip` | `.v6-table`（与 `.cv7` 根） | 断言镜头链、reduced、主题、快进可用性 |
| `[data-test="cinema"] / "cinema-pov" / "cinema-skip" / "cinema-glow" / "cinema-dust" / "cinema-ripple"` | Cinema 覆盖层 | POV / 光晕 / 落地 / 快进断言 |
| `[data-test="cell-stage"]`、`data-kind / data-theme / data-outfit / data-bear / data-fate / data-reduced / data-scrollable / data-stage-h` | CellStage 根 | 舞台、主题、服装、滚动与降级断言 |
| `[data-test="cell-stage-cell"] / "cell-type" / "cell-index" / "cell-theme" / "bear-host"` | CellStage 内部 | 格面、类型、序号、主题 chip、小熊宿主 |
| `[data-test="bear"]` + `data-outfit / data-mood / data-glyph / data-reduced` | 小熊节点 | 随主题换装与动作 |
| `[data-test="theme-cloud"] / "theme-star" / "theme-paper"`、`settings-theme-*`、`data-theme` | 门厅 / 设置 / html+body+`.v6-table` | 主题选择、落盘、刷新保持 |
| `App.Cinema._debug()` / `root.__cellStage` / `App.Themes.get()/tokens()` | 运行时 | 自测用；不是稳定契约 |

自测页（不进构建）：`app/dev/cinema-demo.html`（mock 棋盘 + 各阶段按钮）、`app/dev/cell-stage-demo.html`（三主题 × 普通 / 命运 / 收尾 × 320/390/430）。

## 19. V8：真 3D 主桌（three r180 独立 chunk）

> 实现：`app/src/view/board3d/`（`entry.js` / `scene.js` / `director.js` / `camera.js` / `mapping.js` / `textures.js` / `parts.js` / `bear.js` / `constants.js`）；集成：`app/src/ui/screens/table.js`（开关 / 懒加载 / 挂载 / 降级 / 图例）、`settings.js`（三档 + 设备自检）；构建：`tools/rebuild/build_app.py` 的 `build_3d_chunk()`。
> 冻结口径：`docs/v8/impl-freeze.md`；需求与 AC：`docs/v6/spec.md` §0.3；模块说明：`app/src/view/board3d/README.md`。
> **V8 不改规则、数值、题库、存档结构、边界与安全词**（与 V7 完全一致），本章只写表现层。

### 19.1 架构与 API

3D 主桌是**独立子包**，不进首屏：

| 文件 | 职责 |
|---|---|
| `entry.js` | 构建入口；`mount` / `unmount` / 单例；全局 `window.App.Board3D`；状态/事件门面；`_debug()` |
| `scene.js` | 渲染器 / 场景 / 灯光 / 桌板 / 棋盘 / 飞机 / 骰子 / 舞台 / 主题 / 热度 / 循环 / 自适应 / 释放 |
| `director.js` | 事件 → 镜头链（overview → roll → focus → fly → land → cell45 → bear → return）、音效、skip / reduced |
| `camera.js` | `CameraRig`：look + NDC 解算、视角动画、fly 期间保持位姿、shake、投影测量（保留 `lock()/unlock()` API） |
| `mapping.js` | `squareId` → 板坐标 / 朝向 / 板组位姿（`poseForSquare`）；事件起点/终点 |
| `textures.js` | CanvasTexture 程序化生成（格面图集 / 无中文图集 / 盘面 / 云 / 星 / 纸纹 / 绒布 / 木纹 / 骰面 / 光斑 / 涟漪 / 速度线） |
| `parts.js` | 合并格几何、低模纸飞机、光斑 / 阴影 / 涟漪 / 速度线 |
| `bear.js` | 低模小熊 + 三主题服装材质 |
| `constants.js` | 拓扑 / 几何 / 主题 / 缓动 / 图集常量（与 `engine/flight-board.js` 同源只读） |

- **three r180**：`entry.js` 直接 `import * as THREE from '../../../render/node_modules/three/build/three.module.js'`（unmin 版，esbuild 再 min 比直接用 min 版小约 4.5 KiB gzip）；构建时 tree-shake + bundle。
- **chunk**：`build_app.py` 用 esbuild `--bundle --minify --format=iife --target=es2018 --charset=utf8` 产出 `assets/board3d.<内容哈希>.js`（IIFE，无 ESM 残留）；index 只内联一行 `window.__BOARD3D_URL = "assets/board3d.<hash>.js"`，**没有 `<script src>` / preload / prefetch**；该 chunk 进 `sw.js` PRECACHE（离线可用），但不计入首屏 gzip 预算。
- **加载**：`table.js` 同源时先 `fetch` 探一次再动态 `<script>` 内联执行同一份正文（404 不会留下 console error），跨域/无 fetch 才退回 `<script src>`；整页只尝试一次（失败不重试），9s 超时视为失败；`on` 模式也要求 WebGL2（没画面就没意义）。
- **骰子面映射（V8.2.2）**：`constants.js` 的 `DIE_FACES = [3, 4, 1, 6, 2, 5]` 对应 `BoxGeometry` 的材质顺序 **+X / -X / +Y / -Y / +Z / -Z**；`_buildDie()` 必须 `DIE_FACES.map(v => new MeshLambertMaterial({map: faces[v-1]}))` 取贴图，`dieFaceNormal(v)` / `dieSettleQuat(v)` 也用 `DIE_FACES.indexOf(v)` 求法线。之前直接 `faces.map` 会把贴图贴错面（引擎 / HUD 掷出 5 点、3D 骰子显示 3 点），V8.2.2 修的就是这一处。
- **API**（`inst` 与 `App.Board3D` 同名方法都在；table 优先用 `inst`）：

| 方法 | 说明 |
|---|---|
| `mount(host, {reduced, theme, state, view, mode, sound, stageAim, adapt})` | `Promise`，成功给实例、失败给 `null`；WebGL2 不可用 / 初始化失败返回 `null`（不抛）；不阻塞棋局 |
| `setState(state, view)` | 同步飞机位置/数量/颜色、骰子点数、热度、当前玩家；`busy`/`holding` 时棋子位置延后到链结束 |
| `play(events, opts)` | 引擎原始 events 驱动镜头链；Promise **永不 reject**；可排队 |
| `setTheme(id) / setReduced(flag) / setSound(flag)` | 三主题 / 静态 3D / WebAudio 合成音效（失败静默） |
| `skip()` | 快进当前镜头链到终态 |
| `returnToOverview()` | 显式从 cell45/bear 回俯瞰（题卡关闭后由 table 调用；不调用时下一次 `play()` 会自动回） |
| `unmount()` | 释放 WebGL / 纹理 / 监听 / 图层，恢复宿主 `position`，可再次 `mount` |
| `_debug()` | `{ready, phase, pieces, target, fps, drawCalls, triangles, dpr, quality, reduced, theme, heat, turn, mode, busy, holding, cell, probe, perf, three}` |
| `mounted` / `version` / `threeRevision` | `v8-prod-3d-1` / three r180 |

- **DOM 契约**：模块在宿主内创建 `div.board3d-layer[data-test=board3d-layer]`（absolute inset:0、`pointer-events:none`、`z-index:0`）+ `canvas[data-test=board3d-canvas]`（`pointer-events:none`、`aria-hidden`）；HUD / 题卡 / 暂停 / 安全词仍是 DOM 层，3D 不拦截点击也不承载可读文本。
- **自适应**：`ResizeObserver` 跟随宿主尺寸，DPR≤2，`distForCover` 按纵横比自适应；连续慢窗口自动降质（DPR=1、关阴影，`quality=low`），可用 `adapt:false` 关闭；页面隐藏暂停渲染。

### 19.2 镜头链（3D）

`table.js` 把引擎事件交给 `App.Board3D.play(events)`；`Director` 按事件组合出下面这条链，阶段写在 3D 宿主的 `data-3d-phase` 上。

| # | `data-3d-phase` | 画面 | 代码参数 |
|---|---|---|---|
| 1 | `idle` | 3D 棋盘俯瞰；棋盘占宽 86–88%、上下留白按投影包围盒居中 | `_overview()`：`distForCover(3.70, OVERVIEW_FILL=1.015, 42)`；`_centerBias()` 用投影包围盒求 `ny`（钳在 ±0.12）让上下留白相等 |
| 2 | `roll` | 3D 骰子抛落并停在引擎点数（六面按 `DIE_FACES` 映射），镜头推近骰子 | `_phaseRoll`：相机 620ms + `tossDie` |
| 3 | `focus` | 对准要动的飞机（起飞在机坪、走子在当前格）；飞机落到屏幕中心 | `_phaseFocus`：950ms；完成后相机停在 focus 位姿 |
| 4 | `fly` | **飞机固定、棋盘旋转 + 平移**：逐格把目标格转到机腹下方；速度线；格面中文暂时隐去（无中文图集；**V9 起环格本来就只有雕刻图标，不再切图集**，见 §20.2） | move 每格 165ms（进航线 190ms）、takeoff 900ms、jump 540ms、fly 840ms |
| 5 | `land` | 落地涟漪 / 轻震，镜头拉到落点 | `_phaseLand`：460ms；`setFlyMode(false)` 恢复中文格字 |
| 6 | `cell45` | 棋盘压暗，目标格升起 1.5 世界单位到 45° 舞台 | `_phaseCell`：相机 900ms + 升起 900ms 并行 |
| 7 | `bear` | 3D 小熊从格子左后探身，右侧滑入 **DOM 题卡**；**hold** 等答题 | 小熊 560ms；`holding=true` |
| 8 | `return` | 卡片收起、小熊退场，棋盘回正、镜头回俯瞰 | `returnToOverview`：700ms；`_overview()` 按当前纵横比重算 |

- **与 V7 的差异**：3D 没有 POV / 第三人称跟拍两段，而是 `focus → fly`（固定飞机 + 棋盘运动）；`cell45` / `bear` 由 3D 场景自己画（格面按主题贴图、小熊是 3D 低模），题卡是右侧 DOM；V7 的 45° CSS 舞台与小熊只在 V7 路径使用。
- **事件映射**：`dice` → roll；`takeoff/move/jump/fly` → focus + fly + land；`capture` → 落地后轻震 + 击落音效，被击落飞机飞回机坪 700ms 并缩小消失；`stack` → 落点光晕脉冲 + 同格飞机弹跳；`prompt/minigame` → land → cell45 → bear 并 hold（下一次 `play()` 自动回 overview）；`win/ending-start` → 回 overview + win 暖场；`turn/heat/streak/milestone/safe/ledger` 只更新状态 / 回 overview，不进入镜头链。
- **快进 / reduced**：`skip()` 立即把当前链推到终态；reduced 时 `play()` 只落终态（无 focus/fly/land/cell45/bear 阶段、无速度线/震动），mount 后只画一帧静态棋盘。

### 19.3 固定飞机的数学（fly 的核心）

3D 的「飞机不动、棋盘在动」是**相机锁 + 板组位姿**两件事拼出来的：

1. **相机停在 focus 位姿**：`focus` 结束时相机已对准飞机（`_animateCamera` 收敛到 `_focus()`，并把 `rig.state.center` 对齐到飞机世界位置）；`fly` 期间**不再发起任何相机动画**，每帧 `rig.apply()` 都从同一份 `rig.state` 重算，所以相机位姿保持不变。`CameraRig` 里保留 `lock()/unlock()` API（`_centerBias` 会保存/还原 `lockState`），但当前导演链没有调用 `rig.lock()`——「锁」是靠「不发起新动画」实现的，`_phaseLand` 的 `unlock()` 是防御性清理。
2. **钉飞机**：`scene.fixPlane(pieceId)` 把该飞机 `group.position` 设到世界原点上方 `FOCUS_WORLD = (0, PLANE_Y, 0)`（`PLANE_Y = TILE_TOP + PLANE_HOVER = 0.19`），并把**当时的** `boardGroup.rotation.y + localYaw` 冻结成 `fixedYaw`——之后棋盘怎么转，飞机的位置固定在原点、朝向也保持不变（所以从相机看始终是同一角度）；`updatePlaneTransforms()` 对 `mode:'fixed'` 的飞机每帧复写这个位置/朝向。
3. **转棋盘**：要走到格 `square` 时，`mapping.poseForSquare(square)` 给出板组位姿：
   - `θ = atan2(dirX, -dirZ)`：把该格的行进方向对齐屏幕前方（`-Z`）；
   - `world = R(θ)·local`，板组平移 `tx = -world.x`、`tz = -world.z`：把该格的局部坐标送到世界原点（飞机脚下）。
   - `applyPose({theta, tx, tz})` 写 `boardGroup.rotation.y / position.x / position.z`，同时 `updatePlaneTransforms()` 让其它飞机跟着棋盘走。
4. **逐格插值**：`_slideTo()` 在旧位姿与新位姿之间 `interpPose()` 缓动（角度走 `shortestDelta` 最短弧），于是画面读作「棋盘在脚下旋转 + 平移，飞机在屏幕中心前进」。
5. **可验证的硬指标**：`_updateLockProbe()` 在 fly 期间每帧把固定飞机投影到 NDC，累计 `lock.samples / maxAbsX / maxAbsY`；V8 QA 实测 `maxAbsX = 0.0`、`maxAbsY = 0.0`，同期棋盘 `theta` 变化 1.812 rad（V8.2 prod3d2 复测 1.734 rad）——这就是「飞机固定、棋盘在动」的证据。
6. **收尾**：`land` 时 `rig.unlock()`（防御性）、`rig.snap(...)` 把镜头切到落点，飞机回到板面坐标；`returnToOverview` 把板组角度/位移缓动回 0 并按当前纵横比重算俯瞰距离（题卡收起会改宿主高度，所以不能在动画开始时算死）。

> 一句话：**相机锁死 + 飞机钉在原点 + 用板组的 θ/平移把目标格送到原点**，比「移动飞机 + 追相机」便宜且稳定，窄屏也不会把目标格飞出画面。

### 19.4 45° 舞台、3D 小熊与右侧 DOM 卡

- **舞台参数**：目标格从盘面升起 `STAGE_RISE = 1.50` 世界单位，方位 `STAGE_AZIM = 24°`，格面 `STAGE_PLATE = 0.42`（V8.2 从 0.34 放大，给格面字留空间）；小熊座位 `STAGE_BEAR = {x:-0.072, z:-0.100, s:0.84}`——移到格子**左后**，不再压字；格面字位置 `STAGE_TEXT = {u:0.58, v:0.70}`（偏前，避开小熊）。
- **舞台相机**：`_stage()` 把 look 中心抬到 `TILE_BOTTOM + STAGE_RISE + 0.34`，`radius = distForCover(0.40, 0.52, 42)`、`elev 45°`、`azim = STAGE_AZIM`；相机与升起 900ms 并行，结束后小熊 560ms 探身。
- **题卡只出右侧 DOM 卡**：table 在 3D 激活时给 `.v6-table` 加 `.v8-3d-card`；CSS 为 `grid-template-columns:36% minmax(0,1fr)`（≤359 宽 `30%`）、`.cs-left{display:none}`（藏掉 V7 的 45° 舞台左列）、`.cs-card{grid-column:2}`；`stageAim = {nx:-0.6/-0.66, ny:0.14}` 把 3D 舞台瞄准左侧空出来的区域（390 屏卡片起点约 x=158 / 屏宽 390 ≈ 40.5%）。
- **持卡**：`_phaseCell` 结束设 `holding=true`、阶段停在 `bear`；题卡关闭后 table 调 `returnToOverview()`（不靠 `play([])` 兜底），3D 不拆、canvas 不重建，下一次 `play()` 也能自动回。
- **V8.2 视觉修法**（在 3D 侧）：舞台格 0.34→0.42 + 256px 专用贴图；小熊位移/缩放走 `bearSeat` 容器；实测「小熊↔格面字竖向重叠 5px → 0px」「小熊左缘 30.6 → 36.5px（≥16）」「舞台格右缘到卡片左界 10.5 → 13.3px」。

### 19.5 主题（3D）

| id | 名字 | 3D 表现 | 小熊 |
|---|---|---|---|
| `cloud`（默认） | 云海机舱 | 绒布垫面 + 冷蓝盘面 + 暖阅读灯；中心终点金色鼓面 + 星徽 | 机长小熊 |
| `star` | 星轨夜航 | 深紫星轨垫面 / 盘面；中心银紫 | 星轨小熊 |
| `paper` | 纸雕童话 | 木纹 / 纸纹垫面 + 暖纸盘面；中心暖金 | 纸雕小熊 |

- `table.js` 在主题变化时把 `App.Themes.get()` 的 id 转发给 `inst.setTheme(id)`；3D 自己按主题换垫面 / 盘面 / 中心终点 / 小熊服装的材质与灯光，并写 `data-3d-theme`。
- 主题只改画面：52 格拓扑、航线、题卡内容、规则、边界与安全词不变；3D 的「fly 无中文图集」与主题无关，是两版图集（中文 / 无中文）在链上切换。
- 主题与玩家预设（名字 / 颜色 / 尺度）互相独立；V7 与 3D 共用同一组主题 id，切主题不需要迁移。

### 19.6 开关、能力探测与降级

- `settings.board3d`：`auto`（默认）/ `off` / `on`；`table.js` 与 `settings.js` 各有一个 `BOARD3D_DEFAULT = "auto"`，用户手动选过就按用户值。
- 能力探测：`webgl2Available()` 建临时 canvas 取 `webgl2` 上下文（取到后主动 `loseContext()` 释放）；`board3dAllowed() = mode !== 'off' && webgl2Available()`——**reduced 不再是回退条件**（V8.1 起 `auto + reduced` 仍是静态 3D）。
- 降级路径与原因（写进 `data-board3d="v7"`、`data-board3d-reason`）：

| 路径 | reason | 表现 |
|---|---|---|
| 设置 `off` | `off` | 完整 V7，不请求 chunk |
| 无 WebGL2 | `no-webgl2` | 完整 V7，不请求 chunk；toast 说明没开启 WebGL2 |
| chunk 404 / 网络失败 / 9s 超时 | `chunk` | 完整 V7，chunk 只请求一次；toast「先用 2D 桌面」 |
| 模块未挂上 API | `api` | 完整 V7 |
| `mount` 返回 null | `mount-null` | 完整 V7，仍能掷骰 |
| `mount` 抛错 / reject | `mount-throw` / `mount-reject` | 完整 V7 |
| 载入后异常 | `load-error` | 完整 V7 |

- 失败**幂等**：`fallbackBoard3d()` 只回退一次，清空 3D 宿主、移除 `.v8-3d-card`、卸载实例；V7 的 `BoardView + Cinema + CabinScene + CellStage` 全部保留，所以降级后仍能完整玩。
- 提示文案：载入中「正在载入 3D 主桌…」；成功「3D 主桌已开启 · 飞机将固定在屏幕中心飞行」；失败「3D 主桌这次没起来，先用 2D 桌面」（无 WebGL2 时单独提示）；`off` 不提示。

### 19.7 构建、SW 与体积预算

- `build_app.py` 新增 `build_3d_chunk()`：入口 `app/src/view/board3d/entry.js`，three 从 `app/render/node_modules/three/build/three.module.js` 打进 bundle（tree-shake），产物按**内容哈希**命名；`--with-3d` 默认开，`--no-3d` 关闭（调试 / V7 口径）；chunk 缺失 / esbuild 缺失 / 打包失败只 WARN 跳过，不阻塞构建。
- `--check` 增加 3D 相关校验（chunk 存在 / 文件名哈希 == 内容哈希 / 无 ESM 残留 / index 注入 `__BOARD3D_URL` 且无 `<script src>` / SW PRECACHE 含 chunk / 首屏不引用 3D），发布门 **37 项**。
- **已发布 V8.2.2 构建实测（历史；V9 的构建 / SW / 预算见 §20.6）**（`assets/board3d.48364fb6.js`，骰面修复后重建；文件名哈希 == 内容哈希）：

| 指标 | 实测（V8.2.2 当前产物） | V8.2.1 / V8.2.0 发布值（对照） | 门槛 |
|---|---|---|---|
| 3D chunk raw | 609,553 B（595.3 KiB） | 609,547 / 609,547 B | — |
| 3D chunk gzip | **158,781 B = 155.06 KiB** | 155.05 / 155.05 KiB | 验收 ≤160 KiB（冻结单 140 KiB 不可达，见 §19.10） |
| index gzip | 143,236 B = **139.88 KB** | 143,237 / 143,219 B（139.88 / 139.86 KB） | ≤140 KB（余量约 124 B） |
| 首屏总 gzip（index + cards + manifest） | 177,087 B = **172.94 KB** | 177,087 / 177,068 B（172.94 / 172.92 KB） | ≤180 KB |
| SW | `couple-flight-v6-a21cab5e`，PRECACHE 9 项（含 3D chunk） | `78c1f4bd` / `3a1cec27` | 离线可用 |
| 构建门 | **37 passed / 0 failed → GREEN**（V8 构建实测；V8.2.1 改版本/文案、V8.2.2 只改骰面映射，均重建产物） | 37/37 GREEN | 0 failed |

- **版本**：`App.version = "8.2.2"`；`app/index.template.html` title/og 为 V8.2.2；`manifest.webmanifest` name 为 V8.2.2；3D 模块自报 `version=v8-prod-3d-1`（模块版本不随补丁号变化）。

- 首屏**不加载** 3D chunk：index 里没有 `<script src=board3d>`、没有 preload/prefetch、没有 three 内联；V7 路径（`off` / 无 WebGL2 / 降级）连请求都不发。V8 QA 在旧构建上验证过「断网冷启动 3D 从 SW 缓存挂载」；V8.2 只换了缓存版本号与 chunk 哈希，机制不变（发布前请按 §19.9 的报告口径复核）。

### 19.8 3D 图例与设备自检（V8.2）

**HUD 图例**（`table.js`，只在 3D 显示）：

- 入口：HUD 里「暂停 / 规则 / 图例」的 `data-test="board3d-legend"`；CSS `.v6-lbtn{display:none}` + `.v6-3d .v6-lbtn{display:inline-flex}`，V7 不出现。
- 面板：`data-test="board3d-legend-panel"`（默认 `hidden`），挂在 `.v6-boardwrap` 内，**顶边永远在 HUD 之下**，所以暂停与右上安全词不会被遮（几何 + hit-test 双证）；11 行 `data-test="board3d-legend-row"`。
- 内容（与 `board3d/constants.js` 的 `GLYPH` 对齐）：`真·真心话 / 敢·大冒险 / 触·靠近 / 缘·命运 / 温·温度计 / 轮·转盘 / 起·起飞 / 飞·飞点 / 停·禁跳 / 归·进航 / ··普通格`，说明均 ≤10 字。
- 开合：HUD「图例」toggle、面板「收起」；打开时加 `.v6-l3o` 收起底部行动区（避免一边看图例一边掷骰，320×568 也能一屏读完）；3D 回落 V7 或题卡要上来时自动收起；关闭后行动区回来。
- V8.2 为压体积去掉了 Esc 收起与 `role/aria-*` 装饰（非功能要求）；图例文案与玩法耦合，改规则要同步 `table.js` 顶部 `LEGEND3D`。

**设置页设备自检**（`settings.js`，「3D 主桌」三档之下一行）：

- `data-test="settings-board3d-status"`，机读属性 `data-webgl2 / data-reduced / data-board3d-set / data-board3d-mount / data-board3d-reason`；**只读**：不写 settings、不触发挂载、不改默认值。
- V8.2.1 起，这一块的标题明确写「3D 主桌 · **设备自检**」，自检行由 `dim` 提亮（更容易看见 WebGL2 / 上次进主桌结果）；只改文案与样式，逻辑不变。
- 主文案形如：「当前设备：3D 可用 · 自动 · WebGL2 可用 · 减少动画：关 · 上次进主桌：用上了 3D / 用了 V7（原因）/ 还没进过主桌」；无 WebGL2 时主文案换成「当前浏览器未开启 WebGL2，会使用 V7」。
- 读「上次 mount」的优先级：`window.__V6_TEST__.board3d()`（主桌还开着时的活状态）→ `.v6-table[data-board3d]` → `window.__BOARD3D_LAST__`（主桌卸载后的一行只读快照 `{s,r,m}`）。

### 19.9 QA 钩子与证据

| 钩子 | 位置 | 用途 |
|---|---|---|
| `data-board3d`（`on` / `v7`）/ `data-board3d-reason` | `.v6-table` | 断言 3D 是否挂上、降级原因 |
| `data-3d-phase` / `data-3d-ready` / `data-3d-reduced` / `data-3d-theme` / `data-3d-mode` / `data-3d-fallback` | 3D 宿主 `[data-test=board3d]` | 镜头链、静态 3D、主题、开关、挂载失败 |
| `[data-test="board3d-layer"]` / `"board3d-canvas"` | 3D 图层 / canvas | 挂载与 pointer-events 断言 |
| `[data-test="board3d-legend"]` / `"board3d-legend-panel"` / `"board3d-legend-row"` / `"board3d-legend-close"` | HUD / 面板 | 图例开合与 11 行内容 |
| `[data-test="settings-board3d-status"]` + `data-*` | 设置页 | 设备自检文案与原因 |
| `.v8-3d-card` / `.cs-left` / `.cs-card` | `.v6-table` | 3D 题卡只出右侧卡 |
| `App.Board3D._debug()` / `__V6_TEST__.board3d()` / `__BOARD3D_LAST__` | 运行时 | 自测用（不是稳定契约） |

- 证据：V8 QA（`reports/v6/qa-report.md`、`qa-e2e-v8-3d.md`、`qa-v8-handoff.md`）；V8.2 3D 视觉（`shots/v82-prod3d2/HANDOFF.md` + `flat-report.json` / `after-table-report.json`）；V8.2 图例 / 自检（`shots/v82-table3d2/HANDOFF.md` + `out/report.json`，119/119、0 console error）。3D 自测页（不进构建）：`app/dev/board3d-prod-demo.html`。

### 19.10 已知限制（V8）

1. **3D chunk 140 KiB 目标不可达**：three r180 的 `WebGLRenderer + PerspectiveCamera + Scene` 最小 named-import 包已约 132–136 KiB gzip，全场景再加约 30 KiB；已发布 V8.2 为 155.05 KiB，按 **≤160 KiB** 验收；140 KiB 记为已知偏离（要砍能力才可能，需产品拍板）。
2. **没有 3D 机舱全景**：场景是「机舱小桌板 + 云海 / 星轨 / 纸雕背景」，不是可环顾的 3D 客舱；V7 的 `CabinScene` 保留为降级。
3. **没有自由视角**：只有导演镜头，不能手势旋转 / 转头；**V9 起支持 0.8–1.5× 缩放（仅 overview/idle，§20.5）**；canvas `pointer-events:none`，选子仍走 HUD / 文字按钮，不提供 3D 格位点选。
4. **题卡文字仍 DOM**：3D 只画棋盘 / 飞机 / 骰子 / 格子 / 小熊；题卡、HUD、安全词、暂停都是 DOM（可读性、无障碍、长文本），3D 不承载可读正文。
5. **飞行中格面中文隐去（V8 口径）**：fly 期间切「无中文图集」（只留色块 + 箭头/星图标），避免旋转斜置的字成为主视觉；land / cell45 / reduced 恢复。**V9 起环格本来就不印中文（只有雕刻图标），这条不再适用**；要看语义请用 HUD 图例 / 落点格名（§20.2）。
6. **小游戏仍是原面板**：温度计 / 转盘格直接开 `App.MiniGame`，不进入 3D。
7. **320 格面短字仍偏小**：约 20px；V8.2 用 HUD 图例补语义，极小屏可切回 V7。
8. **真机未验**：iOS Safari / Android 中低端 GPU 的 3D fps / 发热 / 耗电未验，本文不写手机 fps；无头 SwiftShader 的帧率只作几何 / JS 参考（drawCalls 50 / triangles 4,084 / DPR 2 量级）。
9. **中途 WebGL context lost 未覆盖**：已验证的降级只有「无 WebGL2 / chunk 404 / mount 返回 null / mount 抛错 / off」五条；进 3D 后上下文丢失的回退待验证。
10. **音效未做真机校准（V8 期口径）**：V8 的 WebAudio 合成占位只验证 `setSound` 代码路径；**V9 已换成 14 件采样 + 2 条环境循环**（§20.4），真机人耳仍未验（§20.8）。
11. **构建 / 发布顺序耦合**：chunk 哈希进 index 与 SW，`--release` 必须整体重新生成；手工只替换 `index.html` 或只替换 chunk 会让缓存名/哈希不一致（发布门会拦）。
12. **V8.2 全量 QA 复跑待做**：V8 QA 基线（V7 567/0、V8 3D 108/0、P0 0）在 V8.0 构建上；V8.2 的 3D 视觉与图例/自检由 FE 自测覆盖（119/119、0 console error），完整 `e2e_v8_3d.py` 复跑归 QA——注意该套件的 `V8-3D-49` 仍断言「默认 off」，与 V8.1 起的 `auto` 不一致，复跑前需先改断言。V8.2.1 只动版本号与设置页文案 / 样式，V8.2.2 只修 3D 骰面映射，均不影响上述口径。

## 20. V9：午夜机舱 · 电影写实（材质 / 音频 / 缩放）

> 实现：`app/src/view/board3d/`（`scene.js` / `textures.js` / `parts.js` / `bear.js` / `constants.js` / `zoom.js` / `camera.js` / `entry.js`）、`app/src/core/audio.js`、`app/assets/audio/**`（素材 + 文档）、`app/src/styles/base.css` 与 `ui/screens/{boot,table,settings,ledger}.js`、`ui/overlay/{cell-stage,prompt-card}.js`（样式）；集成：`app/src/ui/screens/table.js`（缩放层 / 手势 / 按钮 / 锁定态）。
> 冻结口径：`docs/v9/impl-freeze.md`；需求与 AC：`docs/v6/spec.md` §0.4；音频文档：`app/assets/audio/{README,LICENSES,INTEGRATION}.md`；模块说明：`app/src/view/board3d/README.md`。
> **V9 不改规则、数值、题库、存档结构、边界与安全词**（与 V8 完全一致），本章只写表现层。

### 20.1 视觉方向、材质与光照

一句话：像在一架夜航客舱里，小桌板上摆着一副黄铜 / 胡桃木 / 绒布的实体棋；暖阅读灯、舷窗外云海、轻微景深与胶片颗粒。

**色板**（`constants.js` 的主题与 `base.css` 的令牌同源，见 §15）：

| 角色 | 色值 | 用途 |
|---|---|---|
| 墨黑 | `#07080D` | 背景 / 舱壁最深（主题 `ink` 在 `#04050B–#0A0806`） |
| 深海蓝 | `#0C1722` | 舱壁 / 窗（`bg2`） |
| 胡桃木 | `#3A2519` | 桌板 / 托盘（盘面 / 桌板用 tint 调） |
| 黄铜 | `#B08A57` | 边圈 / 按钮 / 高光 |
| 暖琥珀 | `#E0A45E` | 阅读灯 / 关键强调 |
| 象牙纸 | `#F1E4CE` | 内容卡 / 航线格 |
| 酒红 | `#732A35` | 危险 / 热情强调（少量） |
| 苔绿 / 雾蓝 | `#4E6B62` / `#5F7A8C` | 冷色平衡 |

- 禁止大面积粉彩 / 高饱和渐变；颜色只做小面积珐琅 / 灯光 / 强调；所有材质低饱和、暖冷对比。
- **PBR 材质口径**（`constants.js` 的 `MAT`，全部 `MeshStandardMaterial`）：

| 材质 | roughness | metalness | 其他 | 主要用在哪 |
|---|---:|---:|---|---|
| 胡桃木 `walnut` | 0.55 | 0.05 | normalScale 0.65、envMapIntensity 0.55 | 桌板 / 盘面 / 托盘 |
| 黄铜 `brass` | 0.32 | 0.85 | envMapIntensity 1.25 | 包边 / 嵌线 / 舷窗框 / 灯体 / 杯沿 |
| 绒布 `felt` | 0.95 | 0.00 | normalScale 1.15、envMapIntensity 0.30 | 垫布 / 遮光板 / 小熊 |
| 纸 `paper` | 0.80 | 0.00 | normalScale 0.45 | 纸飞机 / 内容卡 |
| 珐琅 `enamel` | 0.42 | 0.06 | envMapIntensity 0.80 | 环格格块 |
| 玻璃 `glass` | 0.12 | 0.00 | envMapIntensity 1.40、clearcoat 1 | 舷窗玻璃 |

- 程序化纹理（`textures.js`）：木纹（map/normal/rough）、绒布（map/normal/rough）、拉丝黄铜、纸纹、珐琅格面图集、舷窗景观、舱壁、地板、光斑 / 阴影 / 涟漪 / 速度线 / 灰尘——**无外链贴图 / HDR**。
- **渲染器与光照**（`scene.js`）：
  - `outputColorSpace = SRGBColorSpace`；`toneMapping = ACESFilmicToneMapping`；`toneMappingExposure` 由主题给 **1.16–1.28**（cloud 1.28 / star 1.16 / paper 1.26）；`shadowMap.type = PCFSoftShadowMap`。
  - 暖 key：`DirectionalLight`（约 3200K），位置 `(-3.4, 5.6, -2.2)`，cloud 主题 `keyInt 4.1`；投影 2048（high）/ 1024（medium），阴影相机 ±6.5、bias -0.0006、normalBias 0.015、radius 3。
  - 冷 rim：舷窗方向 `(4.6, 3.2, -3.4)`，`rimInt 1.05–1.65`，不投影；低 fill：`(0.4, 2.4, 6.0)`，`fillInt 0.42–0.52`；另有舱壁 wash 与阅读灯点光（`PointLight`，暖、无阴影，负责桌面近处衰减）。
  - 半球光 + 0.055 的 ambient 抬最暗部；`PMREMGenerator` + `buildEnvironmentScene()` 烘一张程序化「夜航机舱」环境（暖灯面 / 冷窗面 / 暗舱壁 / 木桌面），`scene.environment` 用量按主题 0.66–0.72，运行时零成本。
- **机舱 / 桌面**（`CABIN` / `TABLE` / `FELT`）：
  - 舱壁 30×12 在 `z=-4.66`；圆角舷窗 2.15×1.18 在 `(1.02, 0.78, -4.60)`，30% 圆角、黄铜挤出框（深 0.06 / 倒角 0.016）、`MeshPhysicalMaterial` 玻璃（opacity 0.16、clearcoat 1）；窗外是程序化 canvas 景观（云海 / 星轨 / 纸月，随主题换）。
  - 毛毡遮光板拉下 34%，下沿黄铜拉杆；阅读灯 = 壁座 + 悬臂 + 锥形罩（合并 1 draw）+ 自发光灯泡 + 加色光晕 sprite。
  - 胡桃木小桌板 11.4×12.6（z 偏移 1.8，近端桌沿出画），远端黄铜嵌线；绒布垫 9.6×9.4，外圈黄铜嵌线；每主题一张暗角 / 灯池 / 接触影叠层。
  - 近景道具：珐琅茶杯 + 深色咖啡液面 + 黄铜碟边（3 draw），放在 `(-1.72, 0.0045, 4.28)`，缩放 2.0。
  - 灰尘：1 个 `Points`（最多 110 个，按画质档 28 / 64 / 110），在阅读灯光锥内轻飘；`FogExp2` 密度 0.0145–0.016 做空气感。
- **后处理**：单 pass 全屏 quad 画暗角 + 胶片颗粒（`uGrain 0.055`、`uVig 0.58/0.42`），high/medium 开；Bloom / DOF 不上重后处理链，改用发光 sprite（阅读灯 / 舷窗 / 中心终点 / 舞台）与雾化模拟（见 §16-20）。
- **画质档**（`QUALITY`）：high = DPR 2 / 阴影 2048 / 灰尘 110 / 颗粒 + 发光；medium = 1.5 / 1024 / 64 / 发光；low = 1.0 / 无阴影 / 28 / 无颗粒 / 无环境贴图。`detectQuality()`：移动端 UA 默认 `medium`，桌面按 `deviceMemory` / `hardwareConcurrency` ≤4 降 `medium`；`adapt:true` 时连续慢帧还会自动降质并关阴影。
- **三主题**（都是「午夜机舱」的三个晚上，不再是粉彩 / 霓虹）：

| id | 3D 名字 | 曝光 | 垫布 | 舷窗景观 | 小熊 |
|---|---|---:|---|---|---|
| `cloud`（默认） | 云海夜航 | 1.28 | 冷蓝绒布 `#3E5A64` | 云海 + 月 + 0.28 星 | 机长（驼色毛 + 深蓝帽 + 酒红围巾） |
| `star` | 星轨夜航 | 1.16 | 深紫蓝绒布 `#333A5A` | 深空 + 满星 + 月 | 星轨（灰紫毛 + 紫帽 + 浅蓝围巾） |
| `paper` | 纸月夜航 | 1.26 | 暖棕绒布 `#6A5334` | 暖棕纸月 + 0.10 星 | 纸雕（暖棕毛 + 棕帽 + 砖红围巾） |

### 20.2 棋盘 / 棋子 / 小熊

- **棋盘几何**（与引擎同源只读，规则不变）：盘面半径 3.30；52 环格在半径 3.06、格边长 0.34；每色 5 格航线、4 格机坪、1 个终点；中心 hub（r 0.44 / h 0.10 / 黄铜环 0.60 / 星徽 0.20）。
- **格块**：厚度 0.085（底 0.02 / 顶 0.105）、**倒角 10%**；珐琅底 + 细彩边 + 内侧黄铜发丝线 + 四角铆点 + 磨痕，顶面高光按阅读灯方向；环格图集 8×8 @64px（11 类 × 4 色 + 暗槽 / 航线 / 机坪 / 空白槽）。
- **格面不再印大号中文**：环格只有**雕刻图标**（`drawIcon(..., {engrave:true})`，先画凹槽阴影再画受光主体）；`GLYPH` 的 11 个短字只用于 HUD 图例 / 45° 舞台标签 / 降级文案；因环格无中文，`fly` **不再切「无中文图集」**（V8 的两套图集机制在 V9 收敛成一套）。
- **中心终点**：立体黄铜鼓面 + 星徽 + 光晕；**纸飞机**：纸材质（roughness 0.80）+ 折痕阴影 + 黄铜配重，`parts.js` 低模；**小熊**：低模 + 绒布/毛毡材质（高 roughness、低 metalness，无塑料高光），帽子 / 围巾 / 护目镜随主题换色，左后探头位与 45° 舞台座位（`STAGE_BEAR = {x:-0.072, z:-0.100, s:0.84}`）沿用 V8.2。
- 3D 的 `VERSION = 'v9-cinematic-1'`；three r180，chunk 独立懒加载（见 §20.6）。

### 20.3 UI 令牌与字体

- 令牌见 §15 的「V9 令牌」：墨黑 / 深海蓝 / 黄铜 / 暖纸 / 酒红 / 四色珐琅；`html[data-theme]` 下仍强制同一套 V9 chrome，三主题只换背景与点缀，不再让 UI 变成粉彩 / 紫霓虹。
- 字体：标题 / 数字衬线（`Noto Serif SC / Songti SC`，字重 600–700），正文 / 按钮无衬线（`Noto Sans SC / 系统无衬线`，400–500）；不引外链字体。门厅标题拆成「今晚 / 飞行棋」两行衬线，按钮 10px 圆角（`--r-md`）、黄铜细线 + 内阴影，去掉 999px 胶囊 / 厚渐变。
- 图标：去掉 emoji / 系统符号，改用线性 chevron / 内联 SVG（返回、resume ▶、箭头等）。
- 统一范围：门厅、主桌 HUD、设置、今晚回顾、题卡（含 CellStage 45° 舞台与 legacy `PromptCard` 兜底）都用同一套 token / 字体 / 间距；`data-test` 全部保留（脚本比对 0 missing / 0 new），流程 / 文案 / 安全词 / 320–430 不因样式重写而变。
- FE 自测：120/120 PASS、0 console error；3D 主桌 390/320/430 全部 `data-board3d=on`、无横向溢出、安全词可命中、0 console error；三主题下 `--amber #E0A45E / --paper #F1E4CE / --ink #F2E8D8` 一致。证据：`shots/v9-ui/report.json`、`table3d-report.json`、`theme-report.json`、`prompt-fallback-report.json`。**主桌「暂停」按钮的 44px 命中区由 V9.1.0 修复（`base.css` 42→44），见 §21.4。**

### 20.4 音频：采样 / 总线 / 许可

- **素材**（V9 为 `app/assets/audio/`，16 个 WAV，**839,044 B = 819.4 KB**；V9.1 增加 `mus-calm` 后为 17 个 / 1,435,376 B，见 §21.3）：14 件 SFX（`dice-shake` 0.62s / `dice-land` 0.40s / `hop` 0.18s / `takeoff` 0.52s / `fly` 0.56s / `capture` 0.46s / `stack` 0.32s / `bear` 0.44s / `card` 0.36s / `stamp` 0.28s / `chime` 0.80s / `win` 1.30s / `ui-tap` 0.12s / `ui-select` 0.15s）+ 2 条环境（`amb-calm` 8.00s、`amb-win` 4.50s，整数周期无缝循环）。规格统一 22.05kHz / mono / 16-bit PCM；片段首尾有淡入淡出。
- **体积 / 响度**：SFX 287,706 B / 300KB（93.7%）；环境 551,338 B / 600KB（89.7%）；最大峰值 **-1.50 dBFS**；玩法 SFX 有效响度约 **-24.3～-20.5 LUFS**、UI 轻触 -24.5、环境约 **-33～-34 LUFS**；环境循环逐样本误差约 **1e-12**（`MANIFEST.json.loopProof`）。
- **许可**：Kenney 四个包（Casino Audio 1.1 / Impact Sounds 1.0 / Interface Sounds 1.0 / RPG Audio），全部 **CC0 1.0**，来源 URL / 逐文件 CC0 层 / 自制层 / 加工方式见 `LICENSES.md`；其余为自制 numpy 物理合成（模态合成 / 时变滤波噪声 / 加法合成 / 频域整数周期）。运行时**不请求任何外链**。
- **总线与处理**（`core/audio.js`）：voice → `sfx` / `ambience` / `music` 三子总线（各有增益与 reverb send）→ `master`（0.85）→ `compress`（threshold -14 / knee 6 / ratio 8 / attack 0.004 / release 0.22）→ 4× 过采样 `tanh` 软限幅 → destination；程序化 IR 混响（1.1s stereo）+ `StereoPanner` + 随机音高 / 音量 / 声像；同时活跃 voice 上限 20；播放时对 ambience 做 0.72 duck。
- **token**：`LAYERS` 共 **27 个 token**（tap/select/flip/tick/chime/coin/soft/warn/error/reveal/combo/act/ending/heatUp/diceShake/diceLand/hop/takeoff/fly/capture/stack/bear/cardIn/stamp/milestone/win/safe），旧 token 全部保留并映射到采样层；缺文件 / 解码失败时该 token 走 WebAudio 合成回退（一条 warn，不静默、不崩页）。
- **生命周期**：首次 `pointerdown/touchstart/keydown`（捕获阶段）才 `new AudioContext` / resume 并后台按顺序 preload（tap → select → diceShake → diceLand → cardIn → stamp → chime → hop → takeoff → fly → capture → stack → bear → win，串行、不阻塞）；`route=table` → `startAmbience()`（calm），离开 → 500ms 淡出停；`win/milestone` → scene `win`、`ending` → `ending`、`safe` → 回 `calm`；页面隐藏 60ms 后 `suspend()`，回前台按声音开关 resume（含 160ms 补救一次）；`setEnabled(false)` 把 master 目标拉到 0.0001 并停环境源、保留「想开环境」意图；`setVolumes` 可调 master/sfx/ambience/music；`render()` 供自测页做离线峰值 / 波形。
- **base 路径**：`window.__AUDIO_BASE__` > `?audio=` > `html[data-audio-base]` > `App.Audio._base` > 生产 `assets/audio/` / dev `../assets/audio/`；可用 `App.Audio.setBase()` 覆盖。
- **自测证据**：试听页 32/32 PASS（首次手势前 ctx=none / 0 解码，手势后 14 件解码、27 token 可播、开关 / 隐藏暂停、0 console error）；构建产物冒烟 19/19 PASS（`dist/audio9-check`）；接入后的整合冒烟 18/19，唯一 FAIL 是「首屏前无 wav 网络请求」与「16 wav 进 SW 预缓存」冲突（脚本写于接入前，非产物缺陷）；离线 10/10 PASS（关服务器后 `play('tap')` 仍从 SW cache 解码）。证据：`shots/audio9/out/report.json`、`built-smoke.json`、`verify.json`、`shots/build9/build-check.log`、`offline-check.json`。

### 20.5 缩放（`zoom.js` + `camera.js` + `table.js`）

- **状态机**（`ZoomState`，不依赖 three / DOM）：`zoom` = 用户倍数（1 = 默认俯瞰）；范围 **0.8×–1.5×**；相机距离倍率 `radiusFactor`：`zoom ≤ 1 → 1/zoom`（0.8→1.25），`zoom > 1 → 1 - 0.6*(zoom-1)`（1.5→0.70），并夹在 **0.7–1.4**——两端同时满足冻结单的「0.8–1.5×」与「半径 0.7–1.4」两种等价口径，且 1× 一定等于基准取景。
- **阻尼**：一阶低通 `tau = 110ms`，按真实帧间隔推进；`reduced` / `instant` 时瞬时到位。
- **锁定**：`active=false` 时视觉目标先回 1×（`want()` 返回 1），`target` 保留；回 idle 后平滑恢复用户缩放；换局 / 重新 mount 由新实例重置为 1×。`table.js` 在镜头链阶段（roll/focus/fly/land/cell45/bear）与题卡打开时 `canZoom()` 为 false，按钮禁用、缩放层 `data-zoom-locked="1"`。
- **手势 / 按钮**（`table.js`）：缩放层 `.v6-zoom[data-test=board3d-zoom-layer]` 只覆盖 `.v6-boardwrap`，`touch-action:none`；双指捏合按两指距离比缩放；桌面滚轮 `exp(-deltaY * 0.0012)`；右下角 `+` / `−` / `1×` 三个按钮（`data-test=board3d-zoom-in/out/reset`，44px 命中区，一档 1.13×，到边界禁用）；双击 / 双触（320ms 内、位移 <30px）复位；鼠标滚轮用 `passive:false` 阻止页面滚动。
- **API / 机读**：`App.Board3D.canZoom() / setZoom(v) / zoomBy(f) / resetZoom() / zoomInfo()`；宿主属性 `data-3d-zoom`（目标）、`data-3d-zoom-value`（当前阻尼值）、`data-3d-zoom-lock`（1 = 锁定）；`zoomInfo()` 返回 `{value,target,min,max,active,instant,radiusFactor,can}`；`__V6_TEST__.zoom() / zoomInfo()` 供 QA。
- **边界**：只在 3D 模式出现（V7 无缩放）；缩放层不挡 HUD / 题卡 / 安全词（几何 + hit-test）；缩小后按 host 宽度重新取景（320–430 不裁切）；**不写存档**。
- **证据**：模块级 42/42 PASS、0 console error（`shots/v9-zoom/snapshot-module/module-report.json`，320/390/430 各 14 条）；表级自测 32/36（`shots/v9-zoom/table/table-report.json`），4 条失败均为「点击后立即读相机倍率、阻尼未收敛」的断言口径问题（同一项在模块级显式等待后 42/42 通过），不是产品缺陷；最终以 QA 报告为准。

### 20.6 构建 / SW / 预算（V9.0.1 历史；V9.1 见 §21.6）

- `build_app.py`（V9 改动）：
  - `build_audio_chunk()`：把 `core/audio.js` 从内联 bundle 拆成独立 IIFE chunk `assets/audio.<sha8>.js`（esbuild minify），index 在 `<!--APP_SPLIT-->` 槽位输出 `<script src=... defer>`（在内联 bundle 之后、`DOMContentLoaded` / boot 之前）。
  - `copy_audio_assets()`：拷贝 16 个 wav 到 `assets/audio/`（不改名、不加哈希，清陈旧）；`--check` 校验存在 / 数量 == 16 / RIFF-WAVE 头 / SW 16 条 / audio chunk 落盘 + 哈希 + defer + 未被内联。
  - 3D chunk 预算从 V8 的 140KB 目标改为 **180KB 目标**（`--budget-3d` 可覆盖，仅报告 / 告警，不判 RED；冻结单 §4 给 200KB 上限）。
  - SW PRECACHE 从 9 项扩到 **26 项**（外壳 + 题库 + 3D chunk + audio chunk + 16 wav + 4 图标）。
  - 发布门 **48 项**（V8 是 37 项）。
- **V9.0.1 发布产物实测**（`dist/release-v901`，2026-11-19 14:55；`App.version = 9.0.1`；SW `couple-flight-v6-0777edcb`）：

| 指标 | 实测 | 门槛 |
|---|---:|---|
| index.html raw | 462,977 B（452.1 KB） | ≤520 KB |
| index.html gzip | **141,961 B = 138.63 KB** | ≤140 KB |
| 首屏总 gzip（index + cards + audio chunk + manifest） | **181,674 B = 177.42 KB** | ≤180 KB |
| cards chunk gzip | 33,417 B = 32.63 KB | — |
| audio chunk | 15,036 B raw / **5,863 B gzip**（defer） | 首屏外链脚本 |
| 3D chunk | 650,911 B raw / **170,456 B = 166.46 KB gzip** | 构建门 ≤180 KB（冻结单 ≤200 KB） |
| 16 个 wav | **839,044 B = 819.4 KB**（SFX 281.0 KiB / ambience 538.4 KiB） | SFX ≤300 KB / 环境 ≤600 KB |
| SW PRECACHE | 26 项，落盘 2,216.2 KB | 离线可用 |

- 构建命令与结果（DOC 复跑）：`python tools/rebuild/build_app.py --out dist/doc9-check --check` → **48 passed / 0 failed → GREEN**，`exit 0`；`--check` 同时核 3D / 音频 / SW / 预算各项。构建可复现：build9 交接单记录连续两次独立构建到不同目录，27 个文件 sha256 逐一相等（V9.0.0 构建；V9.0.1 只改 app.js / template / manifest / sw 与根产物）。
- **V9.0.1 首载预热**：`app/src/app.js` 在 boot 900ms 后 `fetch(window.__BOARD3D_URL, {cache:"force-cache"})`，只下载不执行；进主桌时 chunk 通常已在 HTTP / SW 缓存里。工作台记录：2026-11-19 本机对 GitHub Pages 网络首装 3D 约 **7s**、环境音约 **10s** 起；SW 接管后再次打开走缓存更快。真机 / 弱网待复测。
- **发布记录**：本地提交 `5eb3ae2`（V9.0.1）、`307794e`（V9.0.0）、`ab9fb2a`（音频 wav 根目录 hotfix）；远程 main `7939b5ca`（含 hotfix `9452e3b`）；Actions run 150 success；线上 <https://chundongtou.github.io/couple-game/> 确认 9.0.1 / 3D on / 缩放可用 / wav 200 / 0 报错。

### 20.7 QA 钩子与证据

| 钩子 | 位置 | 用途 |
|---|---|---|
| `data-test="board3d-zoom-layer"` / `-zoom-in` / `-zoom-out` / `-zoom-reset` | 3D 主桌棋盘区 | 缩放层与三按钮 |
| `data-zoom` / `data-zoom-target` / `data-zoom-locked` | 缩放层 | 当前值 / 目标 / 是否锁定 |
| `data-3d-zoom` / `data-3d-zoom-value` / `data-3d-zoom-lock` | 3D 宿主 | 目标 / 阻尼值 / 锁定 |
| `__V6_TEST__.zoom() / zoomInfo()`、`App.Board3D.zoomInfo()` | 运行时 | QA 直接设置 / 读取缩放 |
| `App.Audio.state()` / `debug()` / `render()` | 运行时 | 音频 base / 已解码 / 失败 / 总线 / 环境 / 峰值 |
| `data-3d-phase` / `data-3d-ready` / `data-3d-reduced` / `data-3d-theme` / `data-3d-fallback` | 3D 宿主 | 沿用 V8（§19.9） |

- 证据目录：`shots/v9-cinematic/`（before / try1–try6 试拍与 JSON）、`shots/v9-final/`、`shots/v9-zoom/`（模块 42/42 + table 32/36）、`shots/v9-ui/`（120/120 + 主题 / 兜底 / 3D 主桌）、`shots/audio9/`（32/32 + 19/19 + 离线 10/10）、`shots/build9/`（build-check.log / handoff / offline-check）、`shots/v9-smoke/`、`shots/v9-live2/`（线上首屏截图）。
- QA 报告：`reports/v6/qa-e2e-v9-smoke.md`（V9 冒烟 **78 PASS / 0 FAIL / 0 SKIP**，72.6s）作为历史证据保留；**V9.0.1 的中间 QA 状态已被 V9.1.1 的全量复跑取代（`reports/v6/qa-e2e-v911-final2.md`，567 PASS / 0 FAIL / 0 SKIP，见 §21.7）**。本文不写真机 fps / 真机人耳结论。

### 20.8 已知限制（V9.0.1 历史；当前见 §21.8）

1. **真机未验**：iOS Safari / Android 中低端 GPU 的 3D fps / 发热 / 耗电，以及 iOS 静音键 / 安卓外放低频 / 真机混音平衡，都未做真机验证；无头 SwiftShader 帧率只作几何 / JS 参考。
2. **首装体积 / 时间**：V9 的 16 个 wav 全部进 PRECACHE（**V9.1 已为 17 个 / 1.4 MB，见 §21.8**）；工作台记录首装 3D 约 7s、环境音约 10s 起（本机网络），真机 / 弱网待复测；可优化为减少预缓存或只预载核心 SFX。
3. **缩放范围有限**：只在 3D 的 overview / idle；镜头链与题卡期间锁定；V7 没有缩放；不能旋转 / 平移 / 环顾；不写存档，换局重置 1×。
4. **V7 降级画面没有 V9 化**：`view/board.js`（SVG 棋盘）与 `view/cabin.js`（V7 机舱）仍是 V8 配色；无 WebGL2 时观感不随 V9 升级（玩法一致）。
5. **首屏骨架屏仍是旧配色**：`index.template.html` 的 `#boot-skeleton` 与 `theme-color` 还是 V6/V7 的星轨紫（`#241540 / #120D24 / #08060F`），不在 V9 写作用域。
6. **Bloom / DOF 是轻量替代**：没有 EffectComposer 后处理链；发光 sprite + 雾化 + 单 pass 暗角颗粒，视觉上不是真正的镜头景深。
7. **3D chunk 预算**：V9.0.1 实测 166.46 KB gzip；**V9.1 已涨到 174.58 KB，按 `--budget-3d 200` 验收（§21.6）**。
8. **音频回退**：缺 wav / 解码失败时走合成回退；这保证不静音崩页，但音色与采样版不同（正常发布产物 17 个 wav 齐全）。
9. **中断 / 缓存**：发版后需要硬刷新 / 关闭 PWA 重开才能更新 SW；首装预热在 boot 900ms 后才触发，页面极快进主桌时仍可能等 chunk 下载。
10. **3D 上下文丢失未覆盖**：已验证的降级仍是「无 WebGL2 / chunk 404 / mount null / mount 抛错 / off」五条，进 3D 后 WebGL context lost 的回退未验证（沿用 V8）。
11. **V9 QA 状态**：V9.0.1 的中间 QA 状态已被 V9.1.1 的 **567 PASS / 0 FAIL** 全量复跑取代（§21.7），不再作为当前口径。

## 21. V9.1：生活化小物 / 氛围动画 / 纯音乐（2026-11-19）

> 实现：`app/src/view/board3d/{constants,scene,textures,parts}.js`（小物 / 机舱细节 / 动画）、`app/src/core/audio.js` + `app/assets/audio/**`（music 床 + `mus-calm.wav`）、`app/src/styles/base.css`（暂停按钮 44px）；集成：`table.js` 只加 V7 e2e 夹具（`__E2E_BOARD3D_OFF__`）。
> V9.1 **不改规则、数值、题库、存档结构、边界与安全词**；V9.1.1 只修小物可见性 / low 画质 / 测试夹具。构建与验收：`dist/release-v911`、`reports/v6/qa-e2e-v911-final2.md`。

### 21.1 桌面小物与机舱细节（14 类）

- **小物清单**（程序化几何 + 共享材质桶，不引外部模型 / 贴图）：
  - 前排：咖啡杯 + 第二只茶杯（带蒸汽）、报纸、摊开的笔记本 + 钢笔 + 书签 + 折叠眼镜、车票/卡片、钥匙、骰子托盘、毛毯。
  - 后排：音箱 + 磁带、书堆 + 杂志 + 明信片、小绿植、铜台灯 + 桌面光池、蜡烛 + 烛焰、立式相框。
  - 双杯按两只杯子计，合计 **14 类**；布局常量见 `constants.js` 的 `PROPS`（x/z/rot/s）。
- **机舱细节**（`CABIN_FX` + `textures.js`）：顶部行李舱 + 暖白灯带 + 光晕、窗帘 + 黄铜杆、舱壁壁板接缝 / 铆钉、地毯织纹、毡垫缝线 / 四角纹样、窗外远景灯火 + 机翼 + 红色信标。
- **共享材质桶**：matte / paper / print / brass / cloth / leaf / dark（`propAtlas` 4×2 印刷面 + 纸纹），小物合并成少量 draw；骰子托盘是空盘（真骰子仍由 `DIE_HOME` 管理）。
- **布局与可见性**（V9.1.1，真实主桌口径）：前排 z 从 4.6–5.0 收到 **3.6–4.35**，避开右下缩放按钮（44×3 竖列）；390/430 可见 **10/10 锚点**；320×568 host 仅约 298px 高，**前排小物下半仍被底边裁切**（后排 5 件 + 双杯 + 托盘可见，见 §21.8）。
- **性能**（真实主桌 host，V9.1.1）：medium draw **84/82/84**（390/320/430），triangles **13,304 / 13,144 / 13,304**；low draw **74–76**、tris **13,130–13,290**；预算 draw ≤110 / tris ≤28k；fly / cell45 / bear 最高 57 draw / 10,946 tris；0 console error。

### 21.2 氛围动画（7 项）与画质档

- **7 项动画**（`_updateAmbient`，reduced 不调用 → 静态）：咖啡蒸汽（循环上升 + 淡入淡出）、烛焰（缩放/透明度抖动 + 点光呼吸）、铜台灯（灯罩自发光 + 光晕 + 点光）、阅读灯（呼吸 ±4.5% + 极轻闪烁）、窗帘（双轴轻摆）、舷窗光（颜色 / 光晕缓慢变化）、舷窗光尘（26 个点缓慢上浮）。
- **画质档**：`QUALITY` 新增 `props / steam / motes`；high/medium 开蒸汽 + 光尘；**low 保留 props**（V9.1.1 修，旧配置会整组隐藏小物导致「画面又变干净」），只关蒸汽 / 光尘 / 额外点光 / 阴影 / 环境贴图；`extraLights` 同时门控动画里对点光的重新点亮，避免降档后被动画拉回亮度。
- **reduced**：7 项动画全静态，两帧截图字节相同、rAF=0；小物仍显示（只是不呼吸/不飘）。
- **V9.1.1 低档实测**：low 下 propGroup=true、steam/motes=false、台灯 / 蜡烛点光=0、draw 74–76、tris 13.1k、DPR=1，小物仍在。

### 21.3 纯音乐 `mus-calm` 与 music 总线

- **文件**：`app/assets/audio/mus-calm.wav`，**13.52 s / 71 BPM / D 大调 / 4 小节**，22.05 kHz mono PCM16，596,332 B；自制加法合成 + 循环卷积混响；相邻稳态周期逐样本误差 **1.9e-12**、循环边界阶跃 **-45.5 dBFS**（`MANIFEST.json.loopProof`）；峰值 **-2.5 dBFS**；music 预算 596,332 / 614,400 B（**97.1%**）。
- **为什么是 13.52 s**：16 s 的 22.05kHz mono WAV 为 705,600 B，超 600 KiB 预算；按任务允许的 12–16 s 回退档取 13.52 s，仍保持 71 BPM / 4 小节与无缝。
- **接入**：`audio.js` 新增 `musCalm` 文件、`MUSIC` 配置（fade 2.8s）、`startMusic / stopMusic / music / setMusicLevel`；`startAmbience()` 同时起环境 + music，`stopAmbience()` 一起停；`musicLevel` 默认 **0.095**（经 music 总线 0.85 + master 0.85，effective 约 **-38.65 LUFS**），低于 ambience；离线真实链路实测 music RMS 约 **-28.6 dBFS** vs ambience 约 **-27.4 dBFS**（低约 1.18 dB，不抢 SFX）。
- **场景**：`calm` 常速、`win` 更亮、`ending` 降速 + 低通；页面隐藏 / 声音开关 / 离开主桌与 env 同步 suspend / stop / resume；缺 `mus-calm` 时走合成 music 回退。
- **素材总量**：17 个 WAV（14 SFX + 2 env + 1 music）共 **1,435,376 B = 1,401.7 KiB**；许可仍是 Kenney 四包 CC0 + 自制（music 100% 自制），逐文件见 `app/assets/audio/LICENSES.md`。

### 21.4 暂停按钮 44px（AC-H1-1）

- `app/src/styles/base.css`：`.v6-table .v6-icon-btn` 的 `min-width / min-height` 从 **42px → 44px**（commit `c5a0f1e`），主桌「暂停」命中区达到 AC-H1-1 的 ≥44×44；不与安全词区域重叠的行为不变。
- 该修复是 V9.1.0 的一部分；V9.1.1 的 QA 全量（567/0）覆盖了 320/360/390/430 四视口的按钮命中区。

### 21.5 V9.1.1 修复：low 画质小物 / 真实裁切 / V7 夹具

- **low 画质**：`QUALITY.low.props` 从 `false` 改为 **`true`**，`steam/motes` 保持 false；`_applyPropsQuality()` 只在 `props && env` 时才开台灯 / 蜡烛额外点光，`_updateAmbient()` 用同一个 `extraLights` 门控动画里的点光强度——所以 slow 设备自适应降档后仍能看到小物，但不会把点光重新点亮。
- **真实裁切**：以 `shots/v9.1-smoke/table.png`（真实主桌 + HUD）为口径重排前排 props（z 4.6–5.0 → 3.6–4.35），并以 `table_check` 探针验证 390/320/430 的 10 个锚点、棋盘 / 缩放按钮 / cell45 / bear 的 hit-test；320 因 host 高度只有约 298px，前排下半仍裁（已知）。
- **V7 e2e 夹具**：`qa/v6/e2e_v6.py` 设置 `window.__E2E_BOARD3D_OFF__ = true`；`table.js` 的 `board3dMode()` 优先返回 `"off"`（正常用户没有这个全局量），使 V7 回归组在 3D 默认构建上也能稳定跑 Cabin / Cinema / CellStage / theme 断言。
- 版本：`App.version = "9.1.1"`；3D chunk 重新哈希为 `assets/board3d.d33bf008.js`；SW `couple-flight-v6-328928a4`。

### 21.6 构建 / SW / 体积（V9.1.1）

| 指标 | V9.1.1 实测（`dist/release-v911`） | 门槛 |
|---|---:|---|
| index.html raw | 463,019 B（452.2 KB） | ≤520 KB |
| index.html gzip | **141,986 B = 138.66 KB** | ≤140 KB |
| 首屏总 gzip（index + cards + audio + manifest） | **183,421 B = 179.12 KB** | ≤180 KB（余量约 0.88 KB） |
| 3D chunk | 679,125 B raw / **178,767 B = 174.58 KB gzip**（`assets/board3d.d33bf008.js`） | `--budget-3d 200`，≤200 KB |
| audio chunk | 20,545 B raw / **7,585 B gzip**（`assets/audio.36e25195.js`，defer） | 首屏外链脚本 |
| 17 个 wav | **1,435,376 B = 1,401.7 KiB**（SFX 281.0 / ambience 538.4 / music 582.4 KiB） | SFX ≤300 / env ≤600 / music ≤600 KB |
| cards chunk gzip | 33,417 B = 32.63 KB | — |
| SW | `couple-flight-v6-328928a4`，**PRECACHE 27 项**，落盘 2,831.6 KB | 离线可用 |
| 构建门 | **49 passed / 0 failed → GREEN**（`--budget-3d 200`） | 0 failed |

- 构建命令（DOC 复跑）：`python tools/rebuild/build_app.py --out dist/doc9-check-911 --check --budget-3d 200` → 49/49 GREEN，exit 0；检查项从 V9.0.1 的 48 项增加到 49 项（新增 music wav / SW 条目校验）。
- **V9.0.1 → V9.1.1 变化**：index 138.63 → 138.66 KB；首屏 177.42 → 179.12 KB；3D 166.46 → 174.58 KB；audio chunk 5,863 → 7,585 B gzip；wav 16 / 819.4 KB → 17 / 1.4 MB；SW 26 → 27 项；构建门 48 → 49 项。
- **首载预热**沿用 V9.0.1：boot 900ms 后 `fetch(__BOARD3D_URL, {cache:"force-cache"})`，只下载不执行；首装仍要下 chunk + 约 1.4 MB 音频，真机 / 弱网数字待复测。
- **发布记录**（工作台）：V9.1.0 本地 `c5a0f1e`，V9.1.1 本地 `9362a6c`；本轮文档不宣称已推送 / 已上线。

### 21.7 QA 状态与证据

- **V7 全量 E2E**：`python qa/v6/e2e_v6.py --dist dist/release-v911` → **567 PASS / 0 FAIL / 0 SKIP**（552.0s；`reports/v6/qa-e2e-v911-final2.md`；`__E2E_BOARD3D_OFF__` 夹具强制 `board3d=off`，覆盖 env / boot / main / skip / takeoff / win / notend / legacy / resume / pause / minigame / fate / events / responsive / offline / reduced / cabin / cinema / cellstage / theme / v7responsive）。
- **构建门**：49/49 GREEN（见 §21.6）。
- **3D / 音频 / 缩放冒烟**：`shots/v9.1-smoke/`（真实主桌 `table.png`、上下裁切 `crop-top/crop-bottom.png`）、`shots/v9.1-audio/`（music 波形 / 循环接缝 / 试听页 / `music-report.json` / `demo-report.json`）；V9 的缩放证据仍在 `shots/v9-zoom/`（模块 42/42）。
- **不写**：真机 3D fps / 发热 / 耗电、真机人耳混音结论；无头 SwiftShader 帧率只作 draw / tris / JS 参考。

### 21.8 已知限制（V9.1.1）

1. **320 前排小物下半裁切**：390/430 可见 10/10 锚点；320×568 host 约 298px 高，前排下半被底边裁（后排 5 件 + 双杯 + 托盘可见），是给棋盘 / 按钮让位的取舍。
2. **真机未验**：iOS Safari / Android 中低端 GPU 的 3D fps / 发热 / 耗电、iOS 静音键 / 安卓外放低频、真机混音平衡都未验；无头 SwiftShader 帧率只作几何 / JS 参考。
3. **首装体积 / 时间**：17 个 wav 全量进 PRECACHE（约 1.4 MB）；工作台记录首装 3D 约 7s、环境音约 10s 起（本机网络），真机 / 弱网待复测；可优化为减少预缓存 / 只预载核心 SFX 与 music。
4. **首屏余量很小**：首屏总 gzip 179.12 KB，距 180 KB 门禁仅约 0.88 KB；后续加首屏内容需先减字节或拆首屏脚本。
5. **3D chunk 174.58 KB gzip**：按 `--budget-3d 200` 验收，不再是 V9.0.1 的 180 KB 目标 / 166.46 KB。
6. **V7 降级画面仍是 V8 配色**：`view/board.js`、`view/cabin.js` 未 V9 化；无 WebGL2 时观感不随 V9.1 升级（玩法一致）。
7. **首屏骨架屏仍是旧配色**：`#boot-skeleton` / `theme-color` 还是 V6/V7 星轨紫，不在 V9.1 写作用域。
8. **道具取舍**：座椅靠背 / 扶手未做（机位下会压桌面）；骰子托盘是空盘（真骰子仍在 `DIE_HOME`）；相框照片是程序化夜色散景（无人物）。
9. **low 档细节减少**：low 保留小物但关蒸汽 / 光尘 / 额外点光 / 阴影；想看到全部氛围动画需要 high / medium。
10. **纯音乐人耳未验**：13.52s 无缝循环、峰值 / RMS / 许可都有离线证据，但真机外放 / 耳机听感未验；后续若换 OGG/FLAC 可再上 16–24 s。
