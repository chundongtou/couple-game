# V6.1 规则调整冻结单（用户试玩反馈，2026-11-17）

> 背景：V6 上线后用户试玩反馈「一局结束太快」，并明确要「一个人四架飞机全部到终点后结束；开局摇 6 起飞有一家非常难」。
> 本文件是 V6.1 的唯一协调口径；与 `spec.md` / `impl-freeze.md` 冲突处，以本文件为准。

## 1. 用户拍板的规则

1. **结束条件改为飞行棋胜负**：任意一方把**本局全部飞机**送进终点（`home:<color>:goal`）→ 本局结束。
   - 快局：每人 2 架；长夜：每人 4 架（保持现有模式）。
   - **不再**用「题卡数达到目标」或「心动值达到目标」结束；`targetCards/targetHeat` 字段保留但只作历史兼容，不参与判定。
   - 去掉「长夜任一架进终点就结束」。
2. **起飞规则**：仍保留「掷出 6 起飞」；但同一玩家**连续 2 个自己的回合都没掷出 6**（且该玩家所有未到家的飞机都在机坪），**第 3 个回合任意点数都可起飞**；起飞成功后计数清零；掷出 6 也清零。
3. 收尾：赢家出现后仍发两张「今晚最后一张」（各给一人），都处理/放过后进「今晚回顾」；回顾写「X 先到家」，不使用羞辱性输赢文案。
4. 题卡、心动值、连击、小游戏、命运格、边界、安全词、暂停机制不变；心动值只作过程记录，不再触发结束。

## 2. 引擎契约增量（BE）

### 2.1 状态
```ts
takeoffMiss: { a: number; b: number };   // 0..2；连续未掷出 6 的回合数
```
- `newGame` 初始 0；`validate` 旧档缺省补 0；`view` 暴露 `planesHome: {a,b}`、`takeoff: {misses:{a,b}, pity:boolean}`。
- `targetCards/targetHeat` 保留默认值（旧 UI/测试兼容），但 `shouldEnd` 不再读。

### 2.2 结束
- `allHome(s, pid)`：该玩家所有 `pieces` 的 `arrived === true`。
- `shouldEnd(s)`：`allHome(a) || allHome(b)`；`winnerId` = 到家的一方。
- `enterEnding(s, events)`：先写 `s.winnerId`，事件顺序 `[{type:'win', playerId}, {type:'prompt', prompt: 收尾卡a}, {type:'ending-start'}]`；仍用 `endingQueue=[给a,给b]`、`endingIndex` 两张卡。
- `buildLedger`：`ending: 'win-a'|'win-b'|'safe'`；`winnerId` 保留；`stats.planesHome = {a,b}`；`stats.cardsDone/cardsSkipped/heat/bestStreak/minigames` 不变。
- `resolvePrompt` 第二张收尾卡后 `phase='ended'`；现有流程不变。

### 2.3 起飞保底
- 在 `finishTurn`（换手前）更新当前行动方：
  - 若 `rollContext.die === 6` → `takeoffMiss[pid]=0`；
  - 否则若该玩家所有未到家飞机都在机坪（`allUnarrivedInHangar`）→ `takeoffMiss[pid]=min(2, +1)`；
  - 其他情况不变。
- `computePlan` 的机坪分支：`die===6` **或** `state.takeoffMiss[piece.playerId] >= 2 && allUnarrivedInHangar(state, playerId)` 可起飞；否则 `NEED_SIX_TO_TAKEOFF`。
- 实际起飞时（`applyPlan` 的 `plan.takeoff`）把 `takeoffMiss[color]=0`。
- `roll` 的 `view`/事件：额外给 `pity:true` 时发 `{type:'takeoff-pity'}`（或 `dice` 事件带 `pity:true`），UI 用于提示「连续两次没起飞，这一掷保底」；不改变骰子结果。
- 注意：**先判断本回合是否已有 pity，再在回合结束计数**，避免第二回合就提前起飞（详见 §4 测试）。

### 2.4 测试（`qa/rebuild/flight-engine.test.mjs`）
- 新增：一方 2/4 架全部到家 → `phase=ended`、`winnerId` 正确、ledger `win-a/b`、`stats.planesHome` 正确、两张收尾卡。
- 新增：题卡做到 20 张但未全部到家 → **不结束**；heat 到 100 但未全部到家 → **不结束**。
- 新增：连续 2 回合非 6 且全在机坪 → 第 3 回合任意点数可起飞；起飞后 `takeoffMiss=0`；掷 6 也清零。
- 修改旧断言：所有「cards/heat 触发结束」的用例改为「不触发」，或改为注入 allHome 触发。

## 3. UI 契约增量（FE）

### 3.1 门厅（fe-shell，`boot.js` + copy）
- 模式卡：
  - 快局：`先送完 2 架飞机 · 约 15–25 分钟 · 每人 2 架`
  - 长夜：`先送完 4 架飞机 · 约 30–50 分钟 · 每人 4 架`
- 规则速览 6 条：把「6 起飞」改为「6 起飞；连续两次没掷出 6，第三次任意点数保底起飞」；「结束」改为「一方把全部飞机送进终点就收尾」；去掉题卡目标/心动值结束的说法。
- 不再显示「目标 4/8 张题卡」。

### 3.2 主桌（fe-table，`table.js`）
- 状态条：`红 0/2 · 黄 0/2 · 心动值 X · 连击 Y`（或等价；必须能读到双方到家数）；不再显示「第 N/目标 张」。
- 起飞提示：当 `view.takeoff.pity === true`，掷骰前显示「连续两次没起飞 · 这一掷任意点数保底起飞」；掷骰结果文本仍显示点数。
- 胜者：`win` 事件 → 主桌显示「<姓名> 先到家」；finish 文本「今晚完成了」保留，不出现「输/赢/胜/负」字样（可用「先到家」）。
- 收尾：继续用 `App.PromptCard.open` 两张 ending 卡；之后进 ledger。
- `data-test` 保持：`status-cards` 可改文案但保留节点；新增 `status-home`、`takeoff-pity`、`winner-text`。

### 3.3 回顾（fe-cards，`ledger.js`）
- 标题/副标题显示「<姓名> 先到家（2/4 架）」；统计增加「已到家 X/Y」；不出现「输了/失败/惩罚」。
- 兼容旧档：`ending='shared'` 的旧局显示「今晚一起走到这里」。
- `prompt-card` 的 ending 卡文案不变（各给一人）。

### 3.4 文档/测试
- `docs/v6/spec.md` §4 E2/E3、§7 20 点击路径、`copy.md`、`DESIGN.md`、`README.md`、`release-notes.md` 同步新规则。
- QA E2E：主路径改为构造「一方全部到家」；新增起飞保底用例；旧「4 张题卡触发收尾」断言全部替换。
- 构建/发布：重新 `--release`、`--check`、推送 main，线上冒烟。

## 4. 关键边界（防错）
- **计数时机**：`finishTurn` 里在换手前用 `rollContext.die` 更新；`computePlan` 读的是本回合开始前的 `takeoffMiss`。第 1 次非 6 后 miss=1，第 2 次非 6 后 miss=2，第 3 次任意点数可起飞。
- **已有飞机在棋盘上**时不累计保底（避免「有子可走也算没起飞」）。
- **6 起飞**：若掷 6，`takeoffMiss` 清零；若 6 点选择移动棋盘上的子而不起飞，也清零。
- **结束判定**只在 `afterAction`/`resolvePrompt` 之后执行；最后一步落格题卡先结算，再进收尾。
- **赢家**只用于文案与 ledger；不加减心动值、不惩罚输家。

## 5. Owner / 写作用域
| owner | 写作用域 |
|---|---|
| be | `app/src/engine/**`、`qa/rebuild/flight-engine.test.mjs` |
| fe-shell | `app/src/ui/screens/boot.js`、`app/src/core/ui.js`（规则速览文案） |
| fe-table | `app/src/ui/screens/table.js` |
| fe-cards | `app/src/ui/screens/ledger.js` |
| qa | `qa/v6/**` |
| doc | `README.md`、`app/DESIGN.md`、`docs/v6/{spec,copy,release-notes}.md` |
| lead | 构建、发布、线上冒烟 |

**禁止**：改 `app/src/data/cards.js`；新增露骨文案；git commit（Lead 统一）。
