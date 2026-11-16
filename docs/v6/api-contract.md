# 今晚飞行棋 V6 · 引擎 ↔ 视图契约（api-contract）

- 作者：AR（架构）
- 日期：2026-11-16
- 状态：**草案 v6.0-draft1**（随 `architecture.md` 一并待总控/用户确认）
- 适用范围：`engine/**`（所有者 BE）、`view/**` + `ui/**`（所有者 FE）、`qa/v6/**`（所有者 QA）
- 目的：**让 FE 与 BE 可以并行开发而不互相等**。FE 按本文件的 schema 造 mock，BE 按本文件的 schema 出货；任何一方要改字段，走 §11 流程。

> 数字标【现状】的表示已与当前源码核对过（含行号）；标【V6 新增】的是本契约新定义的、当前代码里还没有的东西，**必须在 V6 实现**，否则契约不成立。

---

## 1. 总则（所有模块共同遵守）

| # | 约定 | 理由 |
|---|---|---|
| G-1 | 引擎是**纯函数**：`fn(state, ...) → Result`，**不改入参**，返回值里的 `state` 是新的深拷贝 | 现状已如此（`flight-engine.js:22 clone()`），V6 不得引入任何隐式状态 |
| G-2 | 引擎**不碰** `document`/`window`/`localStorage`/`setTimeout` | 才能在 node 里跑 493 条测试 |
| G-3 | 所有引擎调用返回**统一结果信封**（§2），不抛异常；业务失败走 `error.code` | 现状已如此（`fail()/pass()`，24-29 行） |
| G-4 | 事件（`events`）是**只读回放指令**，视图消费它写动画；视图**不得**据此改状态 | 状态已在 `Result.state` 里定稿 |
| G-5 | 新增字段只增不改；消费方必须**忽略未知事件类型与未知字段** | 让 FE/BE 能异步发布 |
| G-6 | 字段命名：`camelCase`；`squareId` 一律是**字符串坐标**（`ring:12` / `home:red:3` / `home:red:goal` / `hangar:red:0`） | 与 `flight-board.js:147-157 parseSquare()` 一致 |
| G-7 | 时间单位一律 ms；`ts`/`endedAt` 是 epoch 毫秒 | 现状 |
| G-8 | 随机性只允许来自 `state.rng`（LCG），测试可用 `seed`/注入 `die` 完全复现 | `newGame(setup, seed)`、`roll(state, die)` 已支持 |

---

## 2. 结果信封 `Result`

```ts
type Result = {
  ok: boolean;
  state: FlightState | null;   // ok=false 时为入参原样（未改动）
  events: Event[];             // ok=false 时为 []
  error: { code: ErrorCode; message: string } | null;
};
```

规则：
- `ok:false` → `state` 必须是**调用方传进来的那个对象**（引用相等），`events` 必须是 `[]`；
- `ok:true` → `state` 是新对象，`events` 至少是 `[]`（可以空，例如 `safeWord()` 在已结束局上的幂等返回）；
- `message` 是**给用户看的中文**，可以直接 `UI.toast(error.message)`（现状 `table.js:65` 就是这么用的）；
- 视图只能靠 `code` 做分支，**不许**匹配 `message` 文案。

### 2.1 错误码 `ErrorCode`（穷举，新增必须走 §11）

| code | 触发条件 | 用户可见文案（现状原文，可改文案不可改码） | 视图应做 |
|---|---|---|---|
| `INVALID_SETUP` | `newGame` 名字/颜色/尺度/架数不全或非法 | 名字、颜色、尺度或飞机架数不完整 | 留在开局屏，标红对应字段 |
| `NO_SESSION` | 无对局 / `state.kind !== 'flight'` | 没有进行中的棋局 | 回门厅 `Router.reset('boot')` |
| `GAME_OVER` | `phase ∈ {ended, safe-ended}` 时又调 `roll/move/...` | 这局已经结束 | 进回顾屏 |
| `UNKNOWN_SCALE` | `state.scale` 不在 `gentle/warm/hot/open` | 尺度无法识别 | 提示 + 回门厅 |
| `AWAITING_OTHER` | 当前 `awaiting.type` 不允许这个动作（例如没到选子就 `move`） | 现在还不能掷骰 / 现在不是选飞机 / 请先把眼前这张处理完 | 按 `state.awaiting` 重画操作区（**不弹错**，这是正常流程） |
| `PROMPT_REQUIRED` | 有 `home-entry` 题卡未结算就想 `roll/move` | 还没过进航这张题 | 强制打开题卡 |
| `PROMPT_NOT_SKIPPABLE` | `rules.endingPromptSkippable=false` 时对收尾题点「放过」 | 这张收尾先做完 | 把「放过」置灰 |
| `INVALID_DIE` | 注入的骰子不是 1..6 整数 | 骰子只能是 1 到 6 | 开发期断言（生产不注入） |
| `INVALID_PIECE` | `pieceId` 不存在 | 没有这架飞机 | 重画可走子 |
| `PIECE_NOT_LEGAL` | `pieceId` 存在但不在 `awaiting.pieceIds` 里 | 这架飞机这步不能走 | 同上 |
| `NO_LEGAL_MOVE` | 无可走子时强走 | 没有可走的飞机 / 这步走不了 | 自动换手（正常流程，不弹错） |

### 2.2 走子受阻原因 `blockedReason`（不是错误码）

`computePlan()` 的 `blockedReason`，出现在 `legalMoves().blocked[id]` 与 `emptyPlan()` 里：

| 值 | 含义 | 视图用途 |
|---|---|---|
| `NONE` | 没算过/无特殊原因 | — |
| `NEED_SIX_TO_TAKEOFF` | 机坪里的棋子需要 6 才能起飞 | 列表里给"需掷 6"的灰提示 |
| `EXACT_COUNT_REQUIRED` | 进航线需要精确点数 / 走的是别人颜色的航线 | 同上 |
| `INVALID_PIECE` | 坐标解析不出来 | 仅开发期 |

---

## 3. 引擎 API `App.Flight`（现状 10 个方法，V6 **不增不减**）

> 路径：`app/src/engine/flight-engine.js`（对外仍挂在 `window.App.Flight`，V6 不改挂载方式，避免动 `build_app.py` 的模块顺序）。

### 3.1 `Flight.newGame(setup, seed?) → Result`

| 入参 | 类型 | 必填 | 规则 |
|---|---|---|---|
| `setup.names.a/.b` | string | ✅ | 去空白后非空 |
| `setup.colors.a/.b` | `'red'\|'yellow'\|'blue'\|'green'` | ✅ | 两者不同 |
| `setup.scale` | `'gentle'\|'warm'\|'hot'\|'open'` | ✅ | 决定 `maxStarCap` = 1/2/3/4 |
| `setup.planeCount` | `2\|4` | ❌（默认 4） | — |
| `setup.boundaries` | string[] | ❌ | 去重、去空；用户边界词（**永久**过滤题库） |
| `setup.rules` | 部分 `Rules` | ❌ | 只接受布尔字段，其余忽略（`mergeRules()`） |
| `seed` | number | ❌ | 不传则用 `Date.now()` 派生；**测试必须传** |

出参：`ok:true` 时 `state.phase = 'playing'`、`awaiting = {type:'roll'}`、`turn = 'a'`、`events = []`。
失败：`INVALID_SETUP`（`state` 为 `null`）。

### 3.2 `Flight.validate(raw) → FlightState | null`

- 读存档时唯一入口（`store.js:126-129` 调用）。**只做"能不能读"，不做"能不能玩"**。
- 契约（**必须保持**）：未知字段原样保留；缺失的可选字段补默认（`rules` 合并、`boundaries→[]`、`log→[]`、`usedCards→{}`、`maxStarCap` 由 `scale` 重算）；任一**必填**项不合法 → 返回 `null`。
- 必填项清单（现状）：`kind==='flight'`、`v===1`、`phase ∈ setup/playing/ended/safe-ended`、`names.a/.b` 非空、`colors` 合法且不同、`planeCount ∈ {2,4}`、`scale` 合法、`pieces.length === planeCount*2`、`awaiting.type` 存在。
- **V6 硬约束**：不得新增必填项（否则 V5 存档全部失效，见 `architecture.md` §7.2）。

### 3.3 `Flight.legalMoves(state, die) → { pieceIds, moves, blocked }`

```ts
{ pieceIds: string[],                    // 当前行动方所有可走棋子的 id，升序
  moves: { [pieceId]: PlanView },        // 仅合法项
  blocked: { [pieceId]: PlanView } }     // 仅非法项
type PlanView = { pieceId, path: SquareId[], modes: string[], captures: pieceId[],
                  stacksWith: pieceId|null, wouldEnterHome: boolean, blockedReason: string };
```
非法 `die`（非 1..6 整数）→ 返回三个空对象（不报错）。

### 3.4 `Flight.roll(state, die?) → Result`

| 前置 | 说明 |
|---|---|
| `awaiting.type === 'roll'` | 否则 `AWAITING_OTHER`（若正在等 `home-entry` 题卡则 `PROMPT_REQUIRED`） |
| 已结束 | `GAME_OVER` |

`die` 省略 → 用 `state.rng` 掷；注入 `die` 仅测试用。
`events[0]` 恒为 `{type:'dice', die, extraRoll?}`（掷到 6 且 `rules.rerollOnEverySix` 时带 `extraRoll:true`）。

分支语义（**FE 必须照此画**）：
1. 无合法走子 → `awaiting` 回到 `roll`（若 `extraRoll` 仍是本回合）或 `finishTurn()`（换手，`events` 追加 `turn`）；
2. 有合法走子且 `rules.chooseAmongLegalPieces === true`（默认）→ `awaiting = {type:'choose-piece', pieceIds, die}`，**视图必须让用户选子**；
3. `chooseAmongLegalPieces === false` → 引擎自动选 `pieceIds.sort()[0]`，事件流里直接出现走子事件（**V6 默认仍为 true；该开关的最终取值见 `architecture.md` §10 U9，PA + 用户决定**）。

### 3.5 `Flight.move(state, pieceId) → Result`

- 仅当 `awaiting.type === 'choose-piece'`；`pieceId` 必须在 `awaiting.pieceIds` 里。
- 出发/到达/击落/叠机/题卡/小游戏的后续事件全部按 §6 顺序追加。
- 若落点触发题卡或小游戏 → `awaiting = {type:'prompt'|'minigame', ...}`，本回合**未结束**。

### 3.6 `Flight.resolvePrompt(state, outcome) → Result`

| `outcome` | 语义 |
|---|---|
| `'done'` | 做了 |
| `'skipped'` | 放过（**不惩罚原则**：默认不扣任何东西；只有 `rules.skipHomeEntryBlocksEntry / skipStackKeepsBonusStep` 决定是否保留奖励） |

- 仅 `awaiting.type ∈ {prompt, ending-prompt}`。
- 副作用：写一条 `log`（`kind` = prompt.kind，`outcome` = done/skipped）；`home-entry` 题卡结算时才真正把棋子走进航线（`applyingHome`）；`stack-duo` 结算时补 1 格奖励走（`bonus`）；`ending-prompt` 结算后 `phase='ended'` 且 `state.result = buildLedger(state)`，事件追加 `{type:'ledger'}`。
- 未知 `outcome` → `AWAITING_OTHER`。

### 3.7 `Flight.resolveMinigame(state) → Result`

- 仅 `awaiting.type === 'minigame'`；记一条 `log`（`kind = 'minigame-thermo' | 'minigame-wheel'`），然后走 `afterAction()`（可能换手/判胜）。
- 不接收任何成绩参数（小游戏结果**不影响棋局**，只写日志）。【现状】

### 3.8 `Flight.safeWord(state) → Result`

- 任意时刻可调（除 `kind !== 'flight'` → `NO_SESSION`）。
- 语义：`phase='safe-ended'`、`winnerId=null`、`awaiting={type:'none'}`、`result=buildLedger()`；事件 `[{type:'safe'},{type:'ledger'}]`。
- **不改已发生的记录**（`log` 原样保留；`buildLedger` 不写 `moves`）；**不改热度**（V6 若接 meta，热度只读）。
- 已结束的局再调 → 幂等返回（`ok:true`，`events:[]`，`state.result` 已存在则原样）。

### 3.9 `Flight.buildLedger(state) → Ledger | null`

仅 `phase ∈ {ended, safe-ended}` 返回：

```ts
type Ledger = {
  date: string;               // 上海时区 YYYY-MM-DD
  endedAt: number;            // epoch ms
  names: {a,b}; colors: {a,b};
  scale: 'gentle'|'warm'|'hot'|'open';
  boundaries: string[];
  planeCount: number;
  ending: 'win-a'|'win-b'|'safe';
  winnerId: 'a'|'b'|null;
  prompts: { kind: PromptKind, outcome: 'done'|'skipped', pool?, text?, star? }[];
  moves?: LogEntry[];         // 仅 rules.ledgerIncludeMoveReplay=true 时【现状默认不写；开关取值见 architecture.md §10 U9】
};
```

### 3.10 `Flight.view(state, opts?) → Snapshot`

见 §5。**这是视图唯一允许读取的状态形状**（禁止视图直接读 `state.log` / `state.usedCards` / `state.rng`）。

---

## 4. 状态模型 `FlightState`（存档的就是它）

```ts
type FlightState = {
  v: 1;                          // 结构版本；V6 升 v:2 见 §9.3
  kind: 'flight';
  id: string;                    // 'flight-<base36 ts>-<base36 seed>'
  ts: number;
  names: { a: string; b: string };
  colors: { a: Color; b: Color };
  scale: Scale;
  maxStarCap: 1|2|3|4;           // 由 scale 派生，validate 会重算
  boundaries: string[];
  planeCount: 2|4;
  rules: Rules;                  // 见下
  phase: 'setup'|'playing'|'ended'|'safe-ended';
  turn: 'a'|'b';
  consecutiveSixes: number;
  pieces: Piece[];               // 长度 = planeCount*2
  usedCards: { [pool: string]: { [cardId: string]: true } };
  log: LogEntry[];
  awaiting: Awaiting;
  winnerId: 'a'|'b'|null;
  rng: number;                   // LCG 状态（uint32）
  result: Ledger | null;
  pendingMove: PendingMove | null;
  rollContext: { die: number, extra: boolean } | null;
  seq: number;
  meta?: FlightMeta;             // 【V6 新增】见 §6.4；可选，缺省视为初始值
};

type Piece = { id: string; playerId: 'a'|'b'; color: Color;
               squareId: SquareId; stackGroupId: string|null; arrived: boolean };

type Awaiting =
  | { type: 'roll' }
  | { type: 'choose-piece'; pieceIds: string[]; die: number }
  | { type: 'prompt'; prompt: Prompt }
  | { type: 'ending-prompt'; prompt: Prompt }
  | { type: 'minigame'; kind: 'thermo'|'truth-wheel'|'dare-wheel'; pieceIds: string[] }
  | { type: 'none' };

type Rules = {                   // 全部布尔，默认值见 flight-rules.js
  rerollOnEverySix: true; chooseAmongLegalPieces: true; threeSixesPenalty: false;
  skipHomeEntryBlocksEntry: true; skipStackKeepsBonusStep: false;
  endingPromptSkippable: true; ledgerIncludeMoveReplay: false; stackCapturedBySingle: true;
};

type LogEntry = { id: string; ts: number; kind: string; outcome?: 'done'|'skipped';
                  die?: number; from?: SquareId; to?: SquareId; actorId?: 'a'|'b';
                  pieceId?: string; card?: {...}; minigame?: string };

type SquareId = `ring:${number}` | `home:${Color}:${number|'goal'}` | `hangar:${Color}:${number}`;
```

不变量（视图可依赖，QA 可断言）：
- `assume pieces.every(p => 0 <= parse(p.squareId) < …)` — 坐标必须能被 `FlightBoard.parseSquare()` 解析；
- `awaiting.type !== 'roll'` 且 `phase === 'playing'` ⇔ 当前有未结算交互（题卡/选子/小游戏）；
- `phase === 'playing'` ⇔ `result === null`；
- `turn` 恒为 `'a'|'b'`（即使 `awaiting='none'`）。

---

## 5. 快照 `Snapshot`（`Flight.view` 出参）

```ts
type Snapshot = {
  pieces: { id, color, squareId, arrived: boolean, stackGroupId: string|null }[];  // 顺序 = state.pieces
  turn: 'a'|'b';
  colors: { a: Color; b: Color };
  reduced: boolean;               // 透传 opts.reduced
};
```

**【V6 新增】** 允许追加（视图必须容忍缺失）：

```ts
  names?: { a: string; b: string };
  awaiting?: Awaiting;            // 让视图不必再读 state
  choices?: string[];             // = awaiting.type==='choose-piece' ? awaiting.pieceIds : []
  pending?: { type: 'enter-home'|'bonus'; pieceIds: string[]; steps: number } | null;
  meta?: MetaView;                // §6.4
```

> 为什么不让视图直接读 `state`：`table.js` 现在就在读（`state.names/state.awaiting`）。V6 把这些搬进快照，视图就只依赖快照形状，FE/BE 才能各改各的。

---

## 6. 事件契约 `Event[]`

### 6.1 通用规则

- 一次引擎调用的 `events` 是**一个有序序列**，视图必须**按序**播放，不得重排（`capture` 必须发生在 `move` 之后、`prompt` 之前，否则演出会错）。
- 视图可以**跳过**任何事件（只画终态），但不能**改动顺序语义**。
- `awaiting` 决定"这批事件播完后是否要等用户"：`awaiting.type ∈ {prompt, ending-prompt, minigame}` → 播完停下；否则播完自动重画操作区。

### 6.2 事件表（穷举【现状】）

| `type` | 字段 | 何时出现 | 视图期望（动画） | 播完要等用户？ |
|---|---|---|---|---|
| `dice` | `die:1..6`, `extraRoll?:true` | 每次 `roll()` 的第 1 个事件 | 骰子翻滚 → 落定显示点数；`extraRoll` 时给"再掷一次"提示 | 否 |
| `takeoff` | `pieceId`, `path: SquareId[]`（含起点） | 机坪→起飞格 | 抛物弧飞入 + 起飞格闪 | 否 |
| `move` | `pieceId`, `path: SquareId[]`, `mode: 'walk'\|'bonus'` | 普通行走（逐格）/ 叠机奖励 1 格 | 沿 `path` 逐格走 | 否 |
| `jump` | `pieceId`, `from`, `to` | 落地后触发"跳 4 格" | 短弧线跳 | 否 |
| `fly` | `pieceId`, `from`, `to` | 落到飞点 → 飞 12 格 | 长弧线 + 尾迹 | 否 |
| `capture` | `attackerId`, `victimIds: string[]` | 落点有敌机，且已把它们送回机坪 | 被击落方回机坪弧线 + 落点震动/闪光 | 否（紧随其后的 `prompt` 才是等待点） |
| `stack` | `pieceIds: string[]`, `at: SquareId` | 落点有友机 → 叠机 | 棋子聚拢 + 编队展开 | 否 |
| `prompt` | `prompt: Prompt` | 落点/击落/叠机/进航/收尾 产生题卡 | 题卡翻入 | **是**（`awaiting.type='prompt'\|'ending-prompt'`） |
| `minigame` | `kind: 'thermo'\|'truth-wheel'\|'dare-wheel'` | 落到温度计/转盘格 | 面板打开 | **是** |
| `turn` | `playerId`, `color` | 换手 | 回合胶囊滑动 + 棋盘描边换色 | 否 |
| `win` | `playerId` | 一方全部到家 | 终局演出 | 否（随后的 `prompt` 是收尾题） |
| `ledger` | —（空对象） | 收尾题结算 / 安全词 | 切回顾屏 | — |
| `safe` | — | 安全词 | 收棋演出（要克制：不给庆祝感） | — |

### 6.3 `Prompt` 对象

```ts
type Prompt = {
  id: string;                 // 'pr-<seq>'
  kind: PromptKind;
  actorId: 'a'|'b';           // 由谁回答
  targetId: 'a'|'b'|'both';   // 指向谁
  pieceIds: string[];
  card: { id: string; text: string; star: number; tags: string[]; pool: string } | null;
  preSquareId?: SquareId;     // 仅 home-entry
};
type PromptKind = 'cell-truth'|'cell-dare'|'cell-touch'|'capture'|'stack-duo'
                | 'home-entry'|'ending'|'minigame-thermo'|'minigame-wheel';
```

视图规则（现状 `prompt-card.js` 已实现，V6 沿用）：
- `targetId==='both'` → 两个人一起做（`stack-duo`）；
- `kind==='capture'` → 被击落方回答（`actorId` 是被击落者）；
- `kind==='ending'` → 输的一方回答；
- `card===null` 只在题库异常时为 `null`，视图必须给兜底文案（不得白屏）。

### 6.4 【V6 新增】热度 / 连击 / 里程碑（`App.FlightMeta`）

背景：热度（`heat`）与连击（`streak`）在当前飞行棋引擎里**不存在**（只存在于 V5 公寓局 `engine/engine.js`）。V6 若上这两个系统，**不得**把它们塞进规则判定，只做**展示与激励投影**：

```ts
// app/src/engine/meta.js   —— 纯函数，所有者 BE
type FlightMeta = {
  heat: number;                       // 0..100
  heatStage: 'cold'|'warm'|'charged'|'burning';
  streak: number;                     // 当前连续「做了」的题卡数（放过 → 归零）
  streakBest: number;
  milestones: string[];               // 已达成里程碑 id，去重
  updatedAt: number;
};
type MetaView = { heat, heatStage, streak, streakBest, thresholds: { warm, charged, burning }, max: 100 };

App.FlightMeta = {
  init(state): FlightMeta;                                    // 幂等，返回初始 meta
  project(state, events): { meta: FlightMeta; events: Event[] }; // 纯函数：读 state+events，返回新 meta 与新增的 meta 事件
  view(meta): MetaView;
  DEFAULTS: { HEAT_MAX: 100, THRESHOLDS: {...}, HEAT_GAIN: {...}, MILESTONES: {...} };
};
```

规则（契约级，不可协商）：
1. **`Flight` 的规则判定永不读 `meta`**（滚骰/走子/胜负与热度无关）；
2. `meta` 存储位置：`state.meta`（随 session 一起存，**零新 key、零迁移**）；缺失时 `init()` 补；
3. `project()` 只在 `ui` 层调用一次（每个 `Result` 之后），不在引擎内部调用；
4. 新增 meta 事件（同样是"只增不改"）：

| `type` | 字段 | 语义 |
|---|---|---|
| `heat` | `delta:number`, `heat:number`, `stage:string`, `prevStage?:string` | 热度变化；`prevStage` 存在 = 跨档，视图才播"升级"演出与音效 |
| `streak` | `count:number`, `best:number`, `reset?:true` | 连击变化；`reset:true` 表示因"放过"或换手归零 |
| `milestone` | `id:string`, `label:string` | 里程碑达成（视图可只做轻提示） |

5. **阈值与倍率由 PA 在 `spec.md` 拍板**；本契约只固定字段名、事件名、`0..100` 值域与"跨档才演出"的规则。PA 未定稿前，V6 实现**只做展示、不接任何规则效果**（见 `architecture.md` §10 U3）。
6. 「不惩罚放过」是硬原则：`streak` 归零可以，但**不得**扣热度、不得减骰子、不得跳过回合。

---

## 7. 视图契约

### 7.1 `App.BoardView`（棋盘渲染层门面，**新旧实现同一份契约**）

```ts
App.BoardView = {
  mount(el: HTMLElement, opts: { reduced?: boolean; sound?: boolean; mode?: 'svg'|'3d' }): void,
  setState(snapshot: Snapshot): void,          // 幂等；不得触发动画
  play(events: Event[]): Promise<{ played: number; skipped: boolean; totalMs: number }>,
  setChoices(pieceIds: string[]): void,        // 空数组 = 取消所有高亮
  setReduced(flag: boolean): void,
  setSound(flag: boolean): void,
  unmount(): void
};
```

| 方法 | 约束 |
|---|---|
| `mount` | 同一宿主重复 `mount` 必须先自清理（不叠加 canvas/SVG）；`mode` 缺省取 `settings.boardView`；失败**不得抛异常**，只 toast + 保持"无棋盘"状态（棋仍可下） |
| `setState` | **只画终态**，无过渡；用于初始化与"跳过动画后纠偏" |
| `play` | 串行播放；必须 resolve（不 reject）；空数组立即 resolve；播放中**不得**调用 `setState` 的副作用（两者由 `ui` 串行调度） |
| `setChoices` | 只影响高亮，不改棋子状态 |
| `unmount` | 移除 DOM、断开 `ResizeObserver`、`cancel()` 所有 WAAPI animation、解绑事件；之后 `play()` 必须立即 resolve |

DOM 事件（在 `el` 上派发，均 `bubbles: true`）：

| 事件名 | `detail` | 何时 |
|---|---|---|
| `board-pick` | `{ pieceId: string }` | 用户点了当前 `setChoices` 里的棋子【现状，`main.js:646`】 |
| `board-event` | 原始 `Event` 对象 | 视图不认识的/不负责演出的事件（`prompt` / `win` / `ledger` / `mine`）【现状，`main.js:574-577`】 |
| `board-ready` | `{ mode: 'svg'\|'3d' }` | 【V6 新增】棋盘首次可交互；`ui` 用它决定何时把「掷骰」置为 enabled |

### 7.2 `App.Animator`【V6 新增】

```ts
App.Animator = {
  create(host: HTMLElement, opts?: { reduced?, speed?, now?, raf? }): Animator;
};
type Animator = {
  play(steps: Step[][]): Promise<{ totalMs: number; aborted: boolean }>;
  skip(): Promise<void>;                 // 立即到终态，≤150ms
  abort(): void;                         // 取消，不 resolve 后续步骤
  isPlaying(): boolean;
};
type Step = { kind: string; target?: string; to?: unknown; ms: number; ease?: string;
              parallel?: boolean; sound?: string; haptic?: number|[number,number,number];
              skippable?: boolean; onEnd?: () => void };
```

- `storyboard.build(events, { reduced })` **纯函数**产出 `Step[][]`；**推荐调用链**：`ui` 只调 `BoardView.play(events)`，`BoardView` 内部用 `storyboard.build()` + `Animator` 播放；`App.Animator` 单独暴露给 `ui` 是为了非棋盘动画（题卡翻入、HUD 热度条、回合胶囊）。**禁止**同一条事件流同时交给 `BoardView.play()` 和 `Animator.play()`（会播两遍）。
- `play()` 必须**总有返回值**（用户中断 → `aborted:true`），调用方 `await` 后统一做"纠偏"：`board.setState(snapshot)`。

### 7.3 `App.Assets`【V6 新增】

```ts
App.Assets = {
  ensureCards(opts?: { timeoutMs?: number }): Promise<{ ok: boolean; fallback: boolean }>,
  ensureBoard3d(): Promise<{ ok: boolean }>,      // 仅 settings.boardView==='3d' 时用
  prefetch(): void                                // boot 后空闲时调用，幂等
};
```

**规则 C-1（重复强调）**：任何可能抽题的引擎调用之前，`ui` 必须已 `await ensureCards()`。超时（默认 3000ms）→ `fallback:true`，此时允许开局但必须 toast 一次「题库没下全，这局用简短版」；`ensureCards()` 幂等（重复调用返回同一个 promise）。

---

## 8. 视图 ↔ UI 的时序契约（谁能改状态）

```
用户点击
  → ui/screens/table.js  commit()
      ① busy = true                      // 单飞锁，禁止并发引擎调用
      ② ret = App.Flight.<op>(state)     // 同步、纯函数
      ③ if (!ret.ok) → toast(ret.error.message) + busy=false + 重画，结束
      ④ state = ret.state
      ⑤ Store.saveSession(state)         // 先落盘（铁律 A-0：状态先于动画）
      ⑥ metaEvents = FlightMeta.project(state, ret.events)  // 可选
      ⑦ await Assets.ensureCards()       // 仅当 ret.events 里可能出现题卡
      ⑧ await BoardView.play(ret.events.concat(metaEvents))
      ⑨ BoardView.setState(Flight.view(state))   // 纠偏（跳过后也一定对齐）
      ⑩ busy = false; 依据 awaiting 重画操作区 / 打开题卡 / 进回顾
```

**禁止**：`BoardView` 内部调 `Flight.*`；`screens/*` 内部操作 SVG 棋子；`view/*` 写 `localStorage`；在 `play()` 未完成时开始下一次 `commit()`（`busy` 锁保证）。

---

## 9. 存储契约

### 9.1 键（名字不变，语义不变）

| key | 内容 | 写入者 |
|---|---|---|
| `couple2.settings` | `Settings`（含 V6 新增 `boardView`） | `Store.saveSettings` |
| `couple2.session` | `FlightState`（进行中） | `Store.saveSession` |
| `couple2.history` | `HistoryEntry[]`（≤60，新的在前） | `Store.addHistory` |
| `couple2.standalone` | 小游戏独立局 | `Store.saveStandalone` |
| `couple2.pending` | 待领奖包 | `Store.setPending` |
| `couple2.backup.session` | 【V6 新增】首次读到 session 时的一次性原样备份 | `Store.backupSession` |

`Settings` V6 形状：
```ts
{ v: 6, sound: boolean, haptics: boolean, reduced: boolean,
  names: {a,b}, blacklist: string[],
  scale?: Scale, colors?: {a,b}, lastPlaneCount?: 2|4,
  boardView?: 'svg'|'3d' }          // 【V6 新增】默认 'svg'
```

### 9.2 读写规则

- 只有 `core/store.js` 碰 `localStorage`（`util.storage` 是唯一底层，`get` 失败返回默认值，`set` 失败返回 `false`）；
- `set` 返回 `false`（quota）时：`saveSession` 返回 `{ok:false}`，UI toast「这局的进度存不下了」并**保留内存里的 state 继续玩**（不清屏、不丢局）；
- 读 session 的顺序：`Archive.isForeign()` → 归档；否则 `Flight.validate()` → 通过即返回；不通过 → **先** `backupSession()`，再移除并返回 `null`。

### 9.3 版本与迁移

| 项 | 现状 | V6 | 兼容要求 |
|---|---|---|---|
| `state.v` | `1` | **升 `2`**（新增 `meta`、无其他结构变更） | `validate()` 必须同时接受 `v:1` 与 `v:2`，并把 v1 升成 v2（补 `meta`），**不得拒绝 v1** |
| `state.kind` | `'flight'` | 不变 | — |
| 导出 `app` 字段 | `'couple-flight'` | 不变 | 继续接受 `couple-apartment`/`couple-voyage` |
| 导出 `v` | `5` | `6` | 导入时不校验 `v`（现状就不校验） |

**测试要求**：`qa/rebuild/flight-engine.test.mjs` 必须新增 3 条 —— ①v1 存档 `validate()` 成功且 `meta` 被补全；②v1 存档导入后能继续下棋；③`validate()` 对缺失 `meta` 的 v2 也宽容。

### 9.4 旧局归档（不保数据就谈不上兼容）

| 来源 | 目标 | 实现 |
|---|---|---|
| `kind:'apartment'` | `history` 一条 `kind:'apartment'` | `archive.js:26-41`（现状） |
| 更旧 `voyage` 形状（`hand/tokens/resources/phase∈draft..finale`） | `history` 一条 `kind:'voyage'` | `archive.js:42-63`（现状） |
| V6 不认识的 `kind` | **不归档也不删除**，原样留着并 toast「这个存档认不出来，已保留」 | 【V6 新增】宁可留着占空间，也不误删 |

---

## 10. 契约测试（golden）

目录 `qa/v6/contract/`，每个文件既是 FE 的 mock 数据源，也是 BE 的回归用例：

| 文件 | 内容 | 断言方 |
|---|---|---|
| `events-roll.json` | `setup` + `seed` → `Flight.roll` 的 `events` | BE（node 测试）、FE（mock） |
| `events-capture.json` / `events-stack.json` / `events-home-entry.json` | 对应关键事件的完整序列 | 同上 |
| `snapshot-*.json` | `Flight.view(state)` 输出 | 同上 |
| `storyboard-*.json` | `storyboard.build(events)` 的步骤表 + `totalMs ≤ 2500` | FE（动画）、QA（时长预算） |
| `errors.json` | 每个 `ErrorCode` 一个可复现负例 | BE |
| `meta-*.json` | `FlightMeta.project()` 的输入/输出（含跨档、streak 归零、里程碑） | BE + FE |

生成方式：**由 BE 从实现生成一次，人工 review 后入库**（不许在测试里"现算现比"——那样契约就自动跟随实现漂移，等于没有契约）。

---

## 11. 变更流程（改契约的唯一合法路径）

1. 提改动的人写清楚：**新增/修改哪个字段或事件、为什么、FE 与 BE 各自要做什么**；
2. AR 确认是否破坏 G-5（只增不改）与 §9.3（存档兼容）；
3. 同步更新：本文件 + `qa/v6/contract/*.json` + `docs/v6/architecture.md` 相关章节；
4. 在 `.devteam/knowledge/decisions.md` 记一条 ADR（契约变更类）；
5. `send_message` 通知 FE / BE / QA；
6. 提交前必须贴 `node qa/rebuild/flight-engine.test.mjs` 的输出（0 failed）。

**紧急豁免**：只允许"新增可选字段"在 AR 不在线时先合并，但必须在 24h 内补第 3、4 步。

---

## 附录：与现状的差异清单（BE 的实现项）

| # | 差异 | 位置 | 优先级 |
|---|---|---|---|
| 1 | `validate()` 接受 `v:1` 与 `v:2`，并把 v1 补成 v2 | `flight-engine.js:585-607` | P0 |
| 2 | `Flight.view()` 追加 `names/awaiting/choices/pending/meta` | `flight-engine.js:894-910` | P0 |
| 3 | 新增 `engine/meta.js`（`FlightMeta`）与 3 个 meta 事件 | 新文件 | P0（若 PA 拍板要热度） |
| 4 | `Store` 新增 `boardView` 默认值与 `backupSession()` | `core/store.js` | P0 |
| 5 | `Store.getSession()` 遇到未知 `kind` 改为"保留+toast" | `core/store.js:114-131` | P1 |
| 6 | `qa/v6/contract/*.json` 生成 | 新目录 | P0 |
