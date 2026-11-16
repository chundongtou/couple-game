# 今晚飞行棋 V6 · 现状体验审计（audit）

- 作者：PA（产品分析）
- 日期：2026-11-16
- 状态：**初稿 v1**（线上 `https://chundongtou.github.io/couple-game/` 与本地构建 `dist/rebuild` 均取证：线上用截图比对主路径布局，本地构建用于可重复测量与构造状态；两者主路径 UI 文本/控件一致）
- 关联任务：`task-1`；上游输入：无；下游消费者：`docs/v6/spec.md`（本文件结论 → 需求/验收标准）、`architecture.md`（AR 已引用）、`mocks/`（FE）、QA 回归
- 取证环境：DHA 运行时 Python 3.12 + Playwright 1.59 + Edge（headless，`channel="msedge"`）；构建命令 `python tools/rebuild/build_app.py --out dist/rebuild`（356 KB / gzip 80 KB，23 个 JS 模块）
- 取证视口：430×932 DPR2（主）、390×844 DPR2、360×640 DPR2
- 截图与原始数据：`shots/v6/*.png`、`shots/v6/probe.json`、`shots/v6/probe2.json`、`shots/v6/analyze.json`（均在 worktree 的 `shots/`，gitignore，不随仓库提交）
- 复现脚本：`shots/probe_v6.py`（主路径/遮挡/小游戏格/回顾/离线）、`shots/probe2_v6.py`（续玩/安全词/收尾/pageerror）、`shots/analyze.mjs`（题库可用量 + 对局长度模拟）

> 排序口径：按「今晚这场能不能顺利走完」的影响降序。P0 = 主路径走不通或违反产品红线；P1 = 明显伤体验/信息缺失；P2 = 工程与一致性债。

---

## 0. 结论摘要（先看这五条）

1. **主桌唯一的退出按钮被安全词胶囊完全盖住**：390×844 下「离开」按钮矩形 `x=320.9..378.0, y=10..54`，安全词胶囊 `x=301.1..380.0, y=8..52`，实测点「离开」命中的是安全词里的 `<span>先收棋</span>`，点击后仍停在主桌（`probe.json` → `leave_hit_test` / `screen_after_leave_click=table`）。结果是：**除了终止本局，玩家没有正常退出/返回的路径**。
2. **「放过」实际有惩罚，且能让整局永远无法结束**：进航（`home-entry`）题选择「放过」= 这架飞机这步不进军、停在原地（`flight-rules.js:12`、`flight-engine.js:777-788`）。模拟 40 局「两人全程只按放过」：**400 回合内结束 0 局**（`analyze.json` → `sims[1]`、`sims[3]`）。这直接违反任务卡要求的「放过不惩罚」红线。
3. **掷骰结果只在 3D 骰子上，页面没有任何文字点数；无棋可走时回合静默换人**：实测掷出 3、四架飞机都还在机坪 → 无合法走子 → 回合从「他」切到「她」，`#toasts` 为空、操作区仍是「掷骰」、全页无 `1-6` 数字文本（`probe.json` → `after_roll`、`die_number_in_dom=[]`）。玩家无法确认自己掷了几点、为什么换人。
4. **落在「温度计 / 转盘」格不会启动小游戏**：主桌只显示「落到了温度计」+「玩过了，继续走棋」（`table.js:111-116`），点一下就把这一步记为完成（`flight-engine.js:809-829` 直接写 `outcome:'done'`）。小游戏界面虽然存在（`ui/screens/minigame.js`），但主桌没有任何入口，必须回开场页才能进（而离开按钮又被盖住，见第 1 条）。
5. **题卡不写归属人名**：所有格子的题卡 kicker 是「真心话 · 这张给走到的人」，只有击落/收尾卡才带人名（`prompt-card.js:30-39`；实测 `prompt_kicker`）。两人共用一部手机时，「给谁做」只能靠顶部回合名推断，题卡本身不可自证。

---

## 1. 问题清单（16 条，按影响排序）

### AUD-01【P0】主桌「离开」按钮被安全词胶囊完全遮挡，无法正常退出

- 现象：主桌右上角同时有安全词「先收棋」与「离开」。安全词为 `position:fixed; top:8px; right:10px; z-index:380`（`core/safe.js:11-19`），主桌 HUD 的「离开」在 `.table-hud`（`table.js:11-16, 36`，`z-index:5`），安全词按层级盖在按钮正上方；两者在 390 宽下横向重叠 57px、纵向重叠 42px。
- 证据：
  - `probe.json` → `safe_rect {x:341.1,y:8,w:78.9,h:44}`、`leave_rect2 {x:361.0,y:10,w:57.0,h:44}`
  - `probe.json` → `leave_hit_test {tag:"SPAN", txt:"先收棋"}`；`probe2_v6.py` 390 宽复测 `leave_box_390 x=320.95..378` vs `safe_box_390 x=301.1..380`（`probe2.json`）
  - 点击「离开」中心后：`screen_after_leave_click=table`、`session_after_leave_click=playing`（`probe.json`）
  - 截图：`shots/v6/02-table-430x932.png`（右上角只剩「先收棋」，看不到「离开」）
- 影响：只能长按安全词结束整局才能离开；一旦误触/想暂停就没有回头路。与「保留存档、随时能停」的产品目标冲突。
- 复现：开局 → 主桌 → 点右上角「离开」位置 → 无反应；用脚本把安全词临时 `display:none` 后同一点击可正常回开场。

### AUD-02【P0】安全词并非「随时可达」：只在主桌显示，其他屏不可用

- 现象：安全词只在 `body[data-screen="table"]` 且本局 `phase==="playing"` 时显示（`core/safe.js:8` `SHOW={table:1}`、`29-44`）；开场页、小游戏、设置、回顾页都隐藏（实测 `opacity:0; pointer-events:none`）。但开场页文案写「长按「先收棋」可以随时停」（`ui/screens/boot.js:84`），设置页也写「安全词在棋局右上角，按住约一秒半」（`ui/screens/settings.js:29`）。
- 证据：`probe.json` → `safe_on_boot` / `safe_on_minigame` / `safe_on_settings` 均为 `{visible:"0", pe:"none"}`；`01-boot-430x932.png`、`05-minigame.png`、`06-settings.png` 无安全词。
- 影响：玩家在小游戏/设置/回顾页时没有「马上停」的入口；文案承诺与实现不一致。
- 复现：主桌 → 脚本 `Router.reset('boot')` → 安全词消失；`reset('minigame')` / `reset('settings')` 同样消失。

### AUD-03【P0】「放过」会阻断进军，导致对局可能永远无法结束（违反「放过不惩罚」）

- 现象：进航题「放过」时默认不进军（`engine/flight-rules.js:16` `skipHomeEntryBlocksEntry:true`；`flight-engine.js:779-785` `enter = done || (skipped && !skipHomeEntryBlocksEntry)`），于是这架飞机永远到不了终点；叠机题放过还会丢掉奖励步（`flight-rules.js:17`、`flight-engine.js:790-801`）。没有「放过也能进军/补偿」的等价路径。
- 证据（模拟，40 局/组，`shots/analyze.mjs`）：`sims` 中「每人 4 架·全放过」「每人 2 架·全放过」都是 **finished=0 / 400 回合仍未结束**，平均掷骰 192.8 次、题卡 174.7 张；而全做组 40/40 结束（4 架均 94.2 次掷骰、32.6 张题卡；2 架均 46.3 次掷骰、15.3 张题卡）。原始数据：`shots/v6/analyze.json`。
- 影响：a) 一对不愿做某类题的伴侣会被卡在「永远走不完的棋」里；b) 唯一能结束的方式是安全词——等于把「放过」惩罚成「今晚结束」。
- 复现：用 `flight-engine.test.mjs` 的 `place()` 思路把一方 1 架放在 `ring:48`（红），掷到进航格 → 出现「进航」题 → 点「放过」→ 该飞机仍在 `ring:48`，下一回合再掷到进航格仍弹同一张题。

### AUD-04【P0】掷骰点数不可读、无棋可走时静默换人

- 现象：点数只存在于 3D 骰子（`app/render/src/main.js:438-476`），DOM 里没有任何点数文本；`roll()` 在无合法走子时直接 `finishTurn()`，不发提示（`flight-engine.js:673-683`）。无「上一把掷了几点」的残留信息，动画结束后只剩对方回合。
- 证据：`probe.json` → `after_roll.log_tail[0].die=3`、`after_roll.turn="b"`、`after_roll_actions="掷骰"`、`after_roll_toasts=""`、`die_number_in_dom=[]`；截图 `03-after-roll-430x932.png`（骰子只在棋盘下缘，约 30px，点数难辨）。
- 影响：玩家会怀疑「是不是没掷成功」「为什么轮到我了」；两人共用一部手机时，低头看题卡/手机的几秒就错过骰子动画。
- 复现：开局（4 架、默认都停机坪）→ 点掷骰 → 任意非 6 点数 → 回合立即换人，页面无任何文字说明。

### AUD-05【P0】小游戏格不启动小游戏，只有一个「玩过了，继续走棋」

- 现象：落 `thermo` / `wheel` 格后，引擎把 `awaiting` 设为 `{type:'minigame', kind}`（`flight-engine.js:353-356`），但主桌只渲染一行「落到了温度计」+ 一个「玩过了，继续走棋」按钮（`table.js:111-116`）；点击直接 `resolveMinigame` 记账并继续（`flight-engine.js:809-829`），**没有任何小游戏交互**。主桌也没有「小游戏」入口（`probe2.json` → `minigame_link_on_table=false`）；独立小游戏只在开场页的「小游戏」里（`boot.js:80`）。
- 证据：`probe.json` → `minigame_cell_actions="落到了温度计 / 玩过了，继续走棋"`、`minigame_cell_has_minigame_ui=false`；截图 `07-minigame-cell.png`。
- 影响：棋盘 52 格里 4 格（`flight-board.js:33-34`，8%）的玩法是空的；玩家点了「玩过了」但没有玩，回顾里还会显示「温度计 · 做了」，记录与事实不符。
- 复现：构造 `awaiting={type:'minigame',kind:'thermo'}` 存档 → 打开主桌 → 只有一行字 + 一个按钮。

### AUD-06【P1】题卡不显示归属人名，只写「这张给走到的人」

- 现象：`whoLine()` 对 `cell-truth/cell-dare/cell-touch` 返回固定文案「这张给走到的人」；只有 `capture/ending` 显示人名，`stack-duo` 显示「两人一起」（`ui/overlay/prompt-card.js:30-39`）。
- 证据：`probe.json` → `prompt_kicker="真心话 · 这张给走到的人"`；截图 `08-prompt-card.png`、`04-no-prompt.png`（顶部回合名还留在画面上，但题卡自身无法自证）。
- 影响：两人各自低头时，题卡在谁手里、该谁做，需要回到顶部小字确认；对「真心话」这类需要对方回答的题，归属尤其重要。
- 复现：任意一方落在题格 → 题卡 kicker 永远是「这张给走到的人」。

### AUD-07【P1】结束没有胜负/完成宣告，收尾题默认塞给「没赢的那一方」

- 现象：一方全部到家后，引擎直接给**对方**发一张 `ending` 题（`flight-engine.js:454-467`，`makeCardPrompt(s,'ending',other,other,...)`），随后在结算时结束（`767-775`）；主桌没有胜利横幅/toast/音效，直接进入回顾（`table.js:81-86`）。实测 `ending_prompt_text` 首行「今晚最后一张 · 他 来做」，`ending_prompt_win_banner=""`。
- 证据：`probe2.json` → `ending_prompt_text`、`ending_prompt_win_banner`；截图 `14-ending-prompt.png`、`15-ledger-win.png`。
- 影响：赢家没有任何「赢了」的反馈；输家被迫做一张收尾题（题卡可以放过，但流程上仍是被安排的）；整个夜晚的结束像「流程走到这里」，不像「今晚的收尾」。
- 复现：把一方只剩一架在 `home:red:4`，掷 1 → 直接弹「今晚最后一张」给另一方。

### AUD-08【P1】收尾题允许「放过」，但「今晚最后一张」没有任何替代收束

- 现象：`endingPromptSkippable` 默认 true（`flight-rules.js:18`），点「放过」同样结束（`flight-engine.js:767-775`）。没有「换一张」「今晚就到这」「说一句收尾话」的替代动作；结束后的回顾也只有「回到开场」。
- 证据：题卡只有「做了 / 放过」两个按钮（`prompt-card.js:54-57`）；回顾页按钮 `ledger.js:56`。
- 影响：情侣可能两张都不想做，但流程没有第三种「我们就到这」的体面收尾。
- 复现：赢局收尾题点「放过」→ 直接进回顾。

### AUD-09【P1】「今晚回顾」信息不足，且小游戏记录显示占位文案「（这一笔没有句子）」

- 现象：`buildLedger()` 只保留 `kind/outcome/card.text/star/pool`，丢弃 `actorId`（`flight-engine.js:831-871`），回顾无法显示「谁做的/谁放过的」；小游戏条目没有 `card`，回顾统一渲染 `p.text || "（这一笔没有句子）"`（`ui/screens/ledger.js:31-35`）。回顾也没有时长、题卡总数、放过数、小游戏结果、连击/心动等任何汇总。
- 证据：构造 5 条日志（含 `minigame-thermo`、`capture`、`skipped`）后 `ledger_text` 出现「温度计 · 做了 / （这一笔没有句子）」（`probe.json` → `ledger_text`）；截图 `09-ledger.png`。
- 影响：V6 的「今晚回顾」是本次改版的核心卖点之一，但现状连「谁做了什么」都还原不了；占位文案直接暴露实现状态。
- 复现：构造含 `minigame-thermo` 的 `state.log` → `buildLedger` → 打开回顾。

### AUD-10【P1】3D 棋盘上的格名在手机上不可读，且没有非 3D 的等价信息

- 现象：棋盘 52 格环半径 8.15（`app/render/src/layout.js:13`），每格贴图 0.86×0.86 单位（`main.js:767`），在 430 宽屏幕上每格约 15–16 CSS px；贴图里的字是 78px/256px（`print.js:178`），折算到屏幕约 **5px**，截图里无法辨认「真心/冒险/靠近/温度/飞/跳/停/进」。所有格子与棋子的位置只存在于 canvas，DOM 没有格子/棋子的等价文本（`probe.json` → `table_dom_texts` 只有「他的回合/离开/掷骰」）。WebGL 挂载失败时只 toast「棋盘没有摆上来」（`main.js:884-888`），没有可玩的兜底棋盘。
- 证据：截图 `02-table-430x932.png`、`03-after-roll-430x932.png`、`04-no-prompt.png`（格名看不清，只能看颜色）；`probe.json` → `table_dom_texts`、`board_canvas {w:430,h:932}`；`09` 之外无 DOM 棋盘。
- 影响：第一次玩的人不知道每格是什么；色弱/强光下更糟；低端机 WebGL 失败后整盘不可见但仍能掷骰，体验断裂。
- 复现：手机或 430 宽视口打开主桌，放大看格子仍不可读；用 DOM 查询不到任何格子文本。

### AUD-11【P1】开局页主按钮在首屏外，且「尺度」没有任何说明

- 现象：开局页把所有配置（名字、两组颜色、尺度、6 个边界、自定义边界、飞机数、开始按钮）堆在一个长页里；430×932 下「摆上棋盘」在 `y=1063.75`（首屏外 132px），360×640 下在 `y=1623.09`（首屏外 983px）。四个尺度只有「温柔/暧昧/热烈/不设限」四个词（`boot.js:11-16,63-66`），没有解释会造成什么差别；「热烈」和「不设限」实际可抽题池完全相同（1212 条，见 AUD-13）。
- 证据：`probe.json` → `boot_cta {y:1063.75}`、`360_boot_cta {y:1623.09}`；截图 `01-boot-430x932.png`。
- 影响：第一次来的人很可能没看到「摆上棋盘」就以为页面到底了；尺度选错要到下一局才能改（设置页没有尺度）。
- 复现：新开 360×640 视口打开首页 → 首屏看不到开始按钮，需要下滑近 1000px。

### AUD-12【P1】没有任何玩法说明/首次引导

- 现象：全站没有「规则/怎么玩/帮助」入口或弹层（`app/src` 全量 grep「规则|怎么玩|玩法|帮助|教程」只命中代码注释与旧版文件）。玩家需要自己猜：6 才能起飞、6 可再掷、跳/飞/进航、击落回机坪、叠机、进终点要精确点数、边界与安全词怎么用。
- 证据：`boot.js` 页面结构（`47-85`）只有表单与三个跳转按钮；`table.js` 仅有回合名 + 离开 + 掷骰；`ledger.js` 无规则；截图 `01/02`。
- 影响：第一次玩要边玩边试错；「为什么我的飞机不动」「为什么又要掷一次」会直接打断氛围。
- 复现：打开首页与主桌，找不到任何规则说明。

### AUD-13【P1】默认「暧昧」局实际只有约一半题库可用；「热烈」「不设限」两档可抽题完全相同

- 现象：`FlightDraw.allowed()` 按尺度封顶星级（`engine/flight-draw.js:51-61,91-110`）。实测空边界下可用量：温柔 179、暧昧 **705**、热烈 **1212**、不设限 **1212**（总计 1423；`punish` 池 211 条永远不可抽）。「热烈」和「不设限」的区别只剩权重（`flight-draw.js:112-126`），可抽集合完全一致。另：边界只影响 0–6% 的题（加一条「蒙眼」后暧昧 truth 352→348、touch 126→118；加「露出」dare 169→164，见 `analyze.json` → `boundaryImpact.warm`）。
- 证据：`shots/v6/analyze.json` → `allowedPerScale`；`flight-draw.js:51-61`。
- 影响：用默认「暧昧」的人会很快觉得题目类型重复；选「不设限」并不会真的多出题库；边界的「有效性」也容易被误解（加一个词只挡几条）。
- 复现：`node shots/analyze.mjs`。

### AUD-14【P1】没有「暂停/中途改边界」：设置页只有 3 个开关

- 现象：设置页只有声音/震动/减弱动画三个开关（`ui/screens/settings.js:18-22`）；尺度、边界、名字只能在开局页改。游戏中想加一条「今晚不做的」只能结束本局；想暂停只能退出页面（而离开按钮被盖住，见 AUD-01）。
- 证据：`06-settings.png`；`settings.js` 全文 78 行。
- 影响：安全边界本应「随时可加」；「暂停」是夜间私密场景的刚需（有人敲门、去倒水、困了）。现状把这两件事都绑定在「结束本局」上。
- 复现：主桌 → 无法打开设置（无入口）；回开场 → 设置 → 只有 3 个开关。

### AUD-15【P2】结束/安全词离场时抛未捕获异常（ResizeObserver 访问已销毁的 renderer）

- 现象：每次从主桌进入回顾（赢局或安全词）都会在控制台抛 `Uncaught TypeError: Cannot read properties of null (reading 'setSize')`，栈在 `assets/board.js` 的 ResizeObserver 回调里。原因可从源码定位：`main.js` 的 `resize()` 直接使用 `renderer.setSize`（`main.js:859-866`），而 `unmount()` 先 `renderer.dispose()` 再把 `renderer=null`（`main.js:905-922`），已排队的 ResizeObserver 回调仍会执行一次。
- 证据：`probe2.json` → `errs.after_win`、`errs.after_safe`（同一错误，带 stack）；`probe.json` → `errors` 同样出现。
- 影响：用户不可见，但会污染错误监控/QA 的「0 console error」门；也说明离场时的资源释放顺序没有验证。
- 复现：`probe2_v6.py`，赢局结算或长按安全词后读 `window.__errs`。

### AUD-16【P2】文档与自动化测试停在旧版「公寓」，对 V6 是错误输入

- 现象：`README.md` 与 `app/DESIGN.md` 描述的是上一版「今晚在这间公寓」（房间、热度、游戏门），与线上飞行棋不一致；`qa/README.md` 写的是 V16/V17 的 `test_v17.py`、`tools/build.py`；`qa/rebuild/e2e.py` 断言 `boot/setup/journey/play/...` 等旧屏幕（`e2e.py:48-49`），没有一条浏览器级飞行棋用例。仓库里仍保留 `ui/screens/foyer|plan|room|door|kit|close.js` 与 `engine/engine.js|balance.js|content.js|night.js` 等旧文件（构建清单 `build_app.py:24-47` 未打包，但会误导后来者），`base.css` 里也仍有大量旧公寓样式（`.room/.lamp-btn/.coat/.door-card` 等）。
- 证据：`README.md` 首段；`app/DESIGN.md` 全文；`qa/README.md`；`qa/rebuild/e2e.py:48-49`；`tools/rebuild/build_app.py` 的 `JS_MODULES`；`base.css:231-390`。
- 影响：AR/FE/QA/DOC 都会读错输入；V6 若按旧文档改，会做错方向。浏览器级回归目前只覆盖引擎（493 条），UI 无护栏。
- 复现：打开 README / DESIGN / qa README 对照线上页面。

---

## 2. 现状可用基线（V6 必须保留，不要改坏）

| 项 | 实测 | 证据 |
|---|---|---|
| 构建 | 成功，356 KB / gzip 80 KB | `python tools/rebuild/build_app.py --out dist/rebuild` 输出 |
| 引擎测试 | 493 passed / 0 failed | `node qa/rebuild/flight-engine.test.mjs`（本机跑过） |
| 存档续玩 | 刷新/退出后「继续今晚飞行棋」可回到主桌；题卡中途刷新也能恢复题卡 | `probe2.json` → `reload_boot_continue`、`reload_prompt_restored` |
| 安全词 | 长按 1.6s 触发；结束后写入历史并清空当前 session | `core/safe.js:56-76,78-93`；`probe2.json` → `safe_screen_after=ledger`、`session_after=null`、`history 1→2` |
| PWA/离线 | 本地 http 下 SW 注册成功；断网刷新仍能打开开局页 | `probe.json` → `sw_registrations=1`、`offline_reload {screen:boot, has_start:true}`；`sw.js` |
| 边界过滤 | 边界命中即排除（标签/文本双匹配） | `flight-draw.js:79-89`；引擎测试覆盖 |
| 不新增露骨文案 | 现状题库 1423 条原样使用；新 UI 文案未引入露骨描述 | `app/src/data/cards.js` |

---

## 3. 证据索引

| 文件 | 内容 |
|---|---|
| `shots/v6/01-boot-430x932.png` | 开局页首屏（开始按钮在屏外） |
| `shots/v6/02-table-430x932.png` | 主桌（右上角只剩「先收棋」，看不到「离开」；格名不可读） |
| `shots/v6/03-after-roll-430x932.png` | 掷骰后回合换人，无点数文字 |
| `shots/v6/07-minigame-cell.png` | 落温度计格只显示「玩过了，继续走棋」 |
| `shots/v6/08-prompt-card.png` | 题卡「真心话 · 这张给走到的人」 |
| `shots/v6/09-ledger.png` | 回顾含「（这一笔没有句子）」 |
| `shots/v6/10-360x640-prompt.png` | 小屏题卡与安全词位置 |
| `shots/v6/11-offline.png` | 离线刷新 |
| `shots/v6/12-boot-after-leave.png` | 脚本触发离开后的开场页（「继续今晚飞行棋」） |
| `shots/v6/13-reload-mid-prompt.png` | 题卡中途刷新恢复 |
| `shots/v6/14-ending-prompt.png` | 收尾题卡（无胜利宣告） |
| `shots/v6/15-ledger-win.png` | 赢局回顾 |
| `shots/v6/16-after-safe.png` | 安全词结束后的回顾 |
| `shots/v6/probe.json` | 主路径/遮挡/小游戏格/回顾/离线 原始测量 |
| `shots/v6/probe2.json` | 续玩/安全词/收尾/页面错误 原始测量 |
| `shots/v6/analyze.json` | 题库可用量、边界影响、对局长度模拟 |

---

## 4. 未覆盖 / 待验证（交给 QA 与后续角色）

1. **真机**：以上均为 Edge headless（Chromium 内核），iOS Safari 的 PWA 安装、`pointerdown` 长按、`env(safe-area-inset-*)` 未在真机验证；标「待验证」。
2. **安卓返回键**：`ui/router.js` 只用内存栈，没有 `popstate` 处理；在 PWA/浏览器里按返回键的实际行为（退出站点 vs 回上一屏）未验证。
3. **弱网首屏**：AR 已在 `architecture.md` 记录首屏 2–4s 的时间成本；PA 未重复测量。
4. **无障碍**：本次只做了 DOM 文本与 3D canvas 的对比，未跑屏幕阅读器/对比度工具；建议 QA 按 spec 的 H 组验收项测。
5. **`shoot` 之外的旧版 V17 页面**（`arcade/`、`pages/`、`v17/` 等）不在本次体验主路径，未逐页审计；若 V6 仍发布这些入口，需要另立任务。
