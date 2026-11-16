# V6 实施冻结单（Lead 定稿，2026-11-16）

> 本文件是 V6 实现的**唯一协调口径**。`docs/v6/spec.md`（PA）管需求与验收，`docs/v6/api-contract.md`（AR）管接口细节；**两者与本文件冲突时，以本文件为准**（冲突处已在此写明覆盖原因）。
> 用户已拍板：①视觉方向 **A · 午夜星轨·暖光纸感**；②**全面改版**（新棋盘 + 心动值 + 连击 + 命运格 + 合作收尾 + 今晚回顾）；③上线方式 **用户提供 GitHub token，由 Lead 直接推 main 触发 Pages**。

## 0. 一句话目标

把「今晚飞行棋」从“能玩的原型”改成**一款暗光下好看、反馈清楚、20 分钟内能收尾的双人升温棋**：SVG 2.5D 棋盘替换 three.js，心动值/连击/命运格/合作收尾/回顾全部落地，首屏不再加载 511KB board.js，旧存档与安全词机制不退化。

## 1. 范围（P0 = 必须；P1 = 本轮尽量，不阻塞发布）

### P0
1. 引擎：修复「放过阻断进军/丢奖励步」；合作收尾（目标题卡数/心动值/长夜一架进终点）；两张收尾卡；ledger 补人/时长/小游戏/统计；meta（heat/streak）随状态落盘。
2. 门厅：视觉 A；首屏可见「摆上棋盘」（360×640 不滚动）；快局/长夜；名字/颜色/尺度说明/边界；规则速览；存档续玩。
3. 主桌：SVG 2.5D 棋盘（52 格 + 4 机坪 + 航线 + 中心）；掷骰点数文字 + 骰子动画；可走子高亮 + 文字按钮；无子可走的原因提示；落点格名；回合条；状态条（第 N/目标 张、心动值、连击、时长）；暂停入口；安全词常驻且不遮挡。
4. 题卡：归属姓名；类型/星级/来源；做了/放过；≤400ms 入场；「放过」不惩罚；结算即时反馈。
5. 小游戏：落格直接进可玩面板（温度计/转盘），跳过/完成都记录。
6. 收尾与回顾：无输赢；6 类信息；题卡明细可展开；「今晚就到这」。
7. 安全/暂停：长按安全词=暂停（不归档）；暂停页 4 个动作；所有屏幕可达；「今晚就到这」才归档。
8. 动画与音效：骰子/走子/跳/飞/击落/叠机/题卡/升温/收尾/回顾的关键演出；减少动效全兼容。
9. 工程：移除首屏 board.js；新模块进构建；sw 缓存版本更新；`build --check`；引擎测试全绿；E2E 主路径 + 截图。

### P1（同轮尽量）
- 连击里程碑（每 3 次「做了」一次双人选卡）与连击显示；命运格二选一；尺度区分（热烈/不设限权重不同）；换一张（每局 2 次）；暂停页加边界；回顾保存图片；3D 回滚开关（settings.boardView）；离线冷启动复核。

### 明确不做
不改题库原文/不新增露骨文案；不做账号/云同步/联机/第三人；不做排行榜/公开分享；不改域名与发布方式；不做未成年人内容。

## 2. 引擎契约增量（BE 必读）

### 2.1 新增状态字段（`state` / `Store` 存档）
```ts
mode: 'quick' | 'long';        // 快局 2 架 / 长夜 4 架
targetCards: number;           // quick=4, long=8
targetHeat: number;            // quick=40, long=80
cardsProcessed: number;        // 已结算的普通题卡数（做了/放过都算）
meta: {
  heat: number;                // 0..100
  stage: 'cold'|'warm'|'charged'|'burning'|'blazing'; // 见 2.3
  streak: number;              // 「做了」累计连击（放过不清零）
  streakBest: number;
  milestones: string[];
  updatedAt: number;
};
endingQueue: Prompt[] | null;  // 两张收尾卡
endingIndex: number;           // 0/1
v: 2;                          // 结构版本；旧 v:1 读入时补默认值，不丢数据
```
- `winnerId` 保留字段但 V6 不用于展示；ledger `ending` 统一为 `'shared'`（安全词/主动结束为 `'safe'`）。
- 旧存档迁移：`Flight.validate` 对缺失字段补默认（mode 由 planeCount 推导；meta 从 log 重算或从 0 开始；cardsProcessed 从 log 统计）。**不允许让 V5 存档失效**。

### 2.2 收尾（覆盖 api-contract 的 `ending` 语义）
- `shouldEnd(s)`：`cardsProcessed >= targetCards` **或** `meta.heat >= targetHeat` **或**（`mode==='long'` 且任一方有 `arrived` 棋子）。
- 在**普通题卡/小游戏结算之后**检查；命中后不再产生新的普通题卡，改为进入收尾：
  - 构造 `endingQueue = [给 a 的 ending 卡, 给 b 的 ending 卡]`（各用 `FlightDraw.take(state,'ending')`，mild 权重；同池允许）。
  - `awaiting = { type:'ending-prompt', prompt: endingQueue[0] }`；事件 `[ {type:'prompt', prompt}, {type:'ending-start'} ]`。
  - `resolvePrompt` 结算第 1 张后，`endingIndex=1`，`awaiting = ending-prompt` 第 2 张；第 2 张结算后 `phase='ended'`、`result=buildLedger`、事件 `[{type:'ledger'}]`。
  - 两张都可放过；放过不减 heat、不判定失败。
- `checkWin` 不再结束对局；只用于检测 `arrived`（长夜触发条件）。

### 2.3 心动值 / 连击（覆盖 AR「UI 层投影」的做法：改由引擎在结算点更新，UI 只读）
- 在 `resolvePrompt`（普通/收尾）与 `resolveMinigame` 内调用 `Meta.apply*`，保证存档里 heat/streak 永远是最新。
- 计分（PA spec §5.1，严格）：题卡「做了」+8；「放过」+3；小游戏完成 +5；小游戏跳过 +0；收尾卡「做了」+10、「放过」+3；棋类事件 +0；**任何操作不得减少 heat**。
- `heat` 上限 100；阶段：0–19 `灯刚亮` / 20–39 `有点热` / 40–59 `靠近了` / 60–79 `很近了` / 80–100 `今晚可以更近`；内部 id 用 `cold/warm/charged/burning/blazing`。
- `streak`：`done` +1；`skipped` 不变（不清零）；`streakBest=max`。每 3 的倍数发 `milestone` 事件（P1 再实现双人选卡）。
- 事件：`{type:'heat', delta, heat, stage, prevStage?}`、`{type:'streak', count, best}`、`{type:'milestone', id, label}`。跨阶段才带 `prevStage`。
- P1 双人选卡/命运格字段：`fateCells = [7, 31]`（需避开起飞/飞点/进航；拿不到就用 5/29）；`prompt.kind='fate'`，`prompt.options=[cardA, cardB]`；`resolvePrompt(state, outcome, opts)` 中 `opts.cardIndex` 选定，未选=都不选，均不惩罚。**BE 先留接口，P1 落地。**

### 2.4 规则修复（P0 红线）
- `skipHomeEntryBlocksEntry: false`（放过仍进军）。
- `skipStackKeepsBonusStep: true`（放过仍得奖励步）。
- 其余 A1/A2/A3 开关保持原值。
- 现有 493 条测试里若断言旧语义 → 改测试并在测试文件头注明“V6 语义变更（spec §5.8）”。

### 2.5 ledger（回顾数据）
```ts
{ v:2, date, startedAt, endedAt, durationMs, names, colors, scale, mode, planeCount,
  boundaries, ending:'shared'|'safe', winnerId:null,
  stats:{ cardsDone, cardsSkipped, heat, bestStreak, minigames, planesHome },
  prompts:[{ kind, outcome, actorId:'a'|'b'|'both', cardId, text, star, pool, source }],
  minigames:[{ kind, outcome:'done'|'skipped', actorId }] }
```
- 不允许出现「（这一笔没有句子）」；无句子时用 `kind` 文案（如「温度计 · 完成」）。

## 3. 视图 / UI 冻结接口

### 3.1 `App.BoardView`（fe-board 实现，fe-table 只调这 6 个方法）
```js
mount(el, {reduced, sound}) // 幂等；失败 toast + 空棋盘，不抛异常
setState(snapshot)          // 只画终态；维度：pieces/turn/colors/names/choices/meta/awaiting
play(events) -> Promise     // 串行播放；必须 resolve；跳过也 resolve
setChoices(pieceIds)        // 高亮可走子
setReduced(flag) / setSound(flag) / unmount()
```
- 事件在 `el` 上冒泡：`board-pick` (`{pieceId}`), `board-event` (`{event}`)。
- 棋盘必须能：区分 52 格类型（题/小游戏/跳/飞/停/进/起飞/命运），显示机坪剩余、叠机、可走子高亮、落点脉冲、中心热度环、turn 换色。视觉参考 `docs/v6/mocks/a/table.png`，但**格位必须真实可读**（文字/图标，≥11px 或等价图例）。
- 动画时长上限：骰子 1.6s、整次走子 2.0s、题卡 0.4s；reduced 时 ≤100ms。

### 3.2 `App.PromptCard`（fe-cards 实现，fe-table 调用；兼容旧签名）
```js
App.PromptCard.open(host, prompt, state, handlers)
// handlers: { done(), skipped(), choose?(cardIndex), reroll?(), close?() }
// prompt.kind 增加 'ending' | 'fate'；fate 时 prompt.options 为两张卡
// 显示归属：cell 题=actor 姓名；capture=actor 姓名；stack-duo=「两人一起」；ending=target 姓名
// 关闭返回函数；打开期间安全词/暂停仍可点（z-index 低于安全词层）
```

### 3.3 小游戏面板 `App.MiniGame.open(host, kind, state, handlers)`（fe-cards 实现）
- `kind: 'thermo'|'truth-wheel'|'dare-wheel'`；面板内可操作（滑杆/转盘/抽卡），完成后 `handlers.done(result)`；有「跳过」。
- 面板关闭时调用 `App.Flight.resolveMinigame(state)` 由 table 负责（或 handlers 返回 done/skipped 由 table 调）。
- 禁止再出现「玩过了，继续走棋」空按钮。

### 3.4 安全词 / 暂停（fe-shell 实现）
- `App.Safe`：所有屏幕显示「先收棋」胶囊（top-right，`z-index:380`），长按 1.6s（进度环可见）→ 打开暂停层（不归档）。
- `App.Pause.open(reason)`：全屏 sheet `data-screen=pause`，四个动作：继续 / 今晚就到这 / 看今晚记录 / 加一条今晚不做的；含「记录会留着」文案。
- 「今晚就到这」→ 调 `App.Flight.safeWord(state)` → 存历史 → 清 session → 进 `ledger`。
- 暂停层必须覆盖当前屏幕但不卸载它（继续后状态不丢）。
- 主桌 HUD 右上角为安全词预留 ≥96×56 区域，主桌自己的暂停按钮放左下/左上，禁止重叠。

### 3.5 音效 / 触觉 token（fe-shell 的 audio.js 实现；其他模块只调名字）
`tap select flip tick chime coin soft warn error reveal combo act ending`（旧）
`diceShake diceLand hop takeoff fly capture stack heatUp milestone cardIn stamp win safe`（新）
- 所有调用走 `App.Audio.play(name)`；触觉 `App.UI.haptic(kind)`；声音关闭时不得依赖音效传达信息。

### 3.6 设计令牌（fe-shell 写入 base.css `:root`；所有模块只用变量）
```
--bg0:#08060F --bg1:#120D24 --bg2:#150F2A --nebula:#241540 --nebula-glow:#8E7BD8
--amber:#F3C077 --amber-deep:#E2965E --rose:#E9887A
--ink:#FBF3E7 --dim:#C9B6CE --dim2:#8E7C9E
--paper:#F7EAD6 --paper2:#F1DFC4 --paper-ink:#2C1C15
--glass:rgba(38,27,58,.42) --line:rgba(255,226,196,.13)
--red:#F08C80 --yellow:#F0C877 --blue:#8FA6E8 --green:#7FC9A8
--font-display:"Noto Serif SC","Songti SC","STSong",serif
--font-body:"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif
--r-sm:12px --r-md:18px --r-lg:26px --r-xl:34px
--t-fast:160ms --t-mid:320ms --t-slow:640ms
--ease-out:cubic-bezier(.16,1,.3,1)
```
- 旧变量名（`--gold/--cream/--wood...`）可保留别名避免大改，但新代码只用 V6 变量。

## 4. 模块与写作用域（同一文件只能一个 owner）

| owner | 写作用域 |
|---|---|
| be | `app/src/engine/**`, `app/src/core/store.js`, `qa/rebuild/**`（仅引擎测试与 fixture） |
| fe-shell | `app/src/styles/base.css`, `app/src/core/motion.js`, `app/src/core/audio.js`, `app/src/core/ui.js`, `app/src/core/safe.js`, `app/src/ui/router.js`, `app/src/app.js`, `app/src/ui/screens/boot.js`, `settings.js`, `nights.js`, `pause.js`（新）, `app/src/ui/pwa.js` |
| fe-board | `app/src/view/**`（新）, `app/dev/board-demo.html`（新，仅供截图） |
| fe-table | `app/src/ui/screens/table.js` |
| fe-cards | `app/src/ui/overlay/**`, `app/src/ui/share.js`（新）, `app/src/ui/screens/ledger.js`, `app/src/ui/screens/minigame.js` |
| fe-build | `tools/rebuild/build_app.py`, `app/index.template.html`, `sw.template.js`（新）, `sw.js`, `manifest.webmanifest` |
| pa | `docs/v6/copy.md`（新，UI 文案） |
| qa | `qa/v6/**` |
| doc | `README.md`, `docs/REBUILD.md`, `app/DESIGN.md` |
| rv | 只读审查 |

**模块清单（fe-build 按此顺序写入 `JS_MODULES`，缺文件时允许 WARN 跳过）**：
`core/util,bus,store,audio,motion,safe,ui; engine/flight-rules,flight-board,flight-meta,flight-draw,archive,minigames,flight-engine; view/board, view/animator, view/storyboard, view/feedback; ui/router; ui/overlay/prompt-card, ui/overlay/minigame, ui/safe?（在 core）, ui/share; ui/screens/boot,table,pause,ledger,nights,settings,minigame; ui/pwa; app`
- 可合并为 `src/view/board.js` 单文件（推荐，减少构建列表）；`view/animator.js`、`storyboard.js`、`feedback.js` 可并入 board.js，但必须保持 API 契约。
- 删除死代码：`engine/engine.js,balance.js,content/content.js,ui/night.js,ui/screens/{close,door,foyer,kit,plan,room}.js`（确认零引用后）。

## 5. 工程与验收门

- 构建：`python tools/rebuild/build_app.py --out dist/rebuild`（DSH 运行时 python）；发布：`--release`。`python` 路径：`C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe`。
- 引擎：`node qa/rebuild/flight-engine.test.mjs` 必须 0 failed（允许改测试以匹配 V6 语义，但需注明）。
- E2E：`qa/v6/e2e_v6.py`（Playwright + `channel="msedge"`），覆盖 spec §7 的 20 点击主路径 + 暂停/安全词/小游戏/回顾 + 360/390/430 三视口；截图存 `qa/v6/shots/`（gitignore）。
- 性能（**ADR-012 取代 architecture.md PB-1/PB-2 的 220KB/58KB**）：首屏 index.html ≤ **520KB raw / 140KB gzip**；首屏总传输（index+cards+manifest）≤ **180KB gzip**；首屏不加载 board.js。slow4G+4×CPU 的 DCL 目标改为 **≤2500ms（硬门槛 ≤3500ms）**——V5 实测 4630ms，V6 需证明比 V5 更快；若 minify 后仍超 3500ms，优先做「首屏只内联 boot 所需模块 + 游戏包按需加载」。
- 发布门：`build --check` 退出 0 + 引擎测试 0 failed + E2E 全绿 + RV APPROVE。
- 所有提交前 `git status` 只能包含本人写作用域；跨作用域需求发消息给 owner，不许直接改。

## 6. 交接口径（每个 owner 给 Lead 的交接单）

```
【交接单】T-xxx
状态：DONE / PARTIAL / BLOCKED
产出：文件路径 + 关键接口
证据：命令 + 关键输出 / 截图路径
偏差：无 / 与冻结单的差异 + 原因
遗留：需要谁接
```
