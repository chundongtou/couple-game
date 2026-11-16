# V6 复审报告（RV · 代码 / 契约 / 验收整合）

- 复审人：rv2（RV，只读审查；本轮只新增本文件）
- 复审时间：2026-11-16 18:35（Asia/Shanghai）
- 被审快照：`app/src` 最后修改 = `ui/screens/boot.js:18:22:31`（Q-01 修复），其余文件 ≤17:56；`dist/rebuild/index.html` sha256 前 8 位 **d4a5a966**（300,817 B raw / 95,018 B gzip）
- 最高口径：`docs/v6/impl-freeze.md`（与 spec / api-contract 冲突时以冻结单为准）
- 审查输入：`docs/v6/spec.md`（48 AC）、`docs/v6/audit.md`（16 问题）、`architecture.md`、`api-contract.md`、`copy.md`、`reports/v6/*`（17:53 全量与 18:20 重跑；18:28/18:29 定向复跑）
- 复核方式：源码交叉核对 + 引擎测试 + `build --check --strict` + Playwright(msedge) 实测（390×844 / 360×640，两套构建：a89ac98c→修复前、d4a5a966→当前）；不改实现、不 commit。

> QA 报告在复审期间被 QA（qa2）持续重跑覆盖：17:53/18:20 的全量报告仍写 FAIL；18:28 `qa-e2e-events.md`、18:29 `qa-e2e-check.md` 是针对当前构建 d4a5a966 的定向复跑，均 PASS。本报告以**代码快照 d4a5a966 + 定向复跑 + RV 独立实测**为准，并明确标注仍待 QA 全量闭环的项。

---

## 0. 结论（先给结论）

| 项 | 结论 |
|---|---|
| **总评** | **APPROVE（产品代码 / 契约 / 验收面）** |
| **产品侧 P0 缺陷** | **0**（唯一曾在案的 Q-01 / AC-F1-1 已修复并复测；Q-05/06 是 QA 夹具坐标错误，已由 QA 修夹具后 PASS；Q-02~Q-04 无法复现） |
| **P0 必改项（产品代码）** | **0** |
| **发布门剩余（非代码）** | ① QA 在 d4a5a966 上跑一次全量 `run_all.py --final` 并覆盖 `qa-report.md`（qa2 进行中；现有全量报告是 18:20 旧构建快照）；② DOC 把 `release-notes.md` 的“已知问题/QA 状态”更新到修复后事实（R-06）。两项不改变 APPROVE 的技术判断。 |
| **非阻塞必改（P1×2 / P2×4）** | R-01 暂停时长计入回顾时长；R-02 暂停态刷新不复原暂停页；R-03 回顾页未显示目标张数；R-04 收尾/回顾文案未含「记录会留着」；R-05 旧测试债务标注；R-06 文档同步。 |

若 Lead 采用“48 AC 字面 100%”口径：**A2-3（回顾页无目标张数）、A6-2（暂停态刷新）、G1-4（暂停计时）、G5-1（收尾页文案）四处为 PARTIAL**，按缺陷分级是 P1/P2，不阻断本轮发布；建议按 R-01..R-04 排期修复，不要把它们误记为“已 100% 通过”。

---

## 1. 闸门与工程证据（命令 + 输出）

### 1.1 构建（当前源码 → 干净目录）

```powershell
$py="C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
& $py tools/rebuild/build_app.py --out $env:TEMP\v6-rv-build2 --check --strict
```

关键输出（节选）：

```
modules: 28/28 js, 1/1 data, 1 css; missing(0): none
minify: on (esbuild 0.25.12, es2018, charset=utf8) js=on css=on
sw: couple-flight-v6-d4a5a966 (precache 8 项)
index gzip 92.8 KB / 140 KB (ADR-012)
first-screen gzip 125.8 KB / 180 KB (ADR-012: index+cards+manifest)
[STAT] index.html 293.8 KB   gzip 92.8 KB
[STAT] assets/cards.6e682ef2.js 186.6 KB  gzip 32.6 KB
[CHECK] PASS 产物不含/不引用 board.js
[CHECK] PASS sw CACHE == couple-flight-v6-d4a5a966
[CHECK] PASS sw PRECACHE 条目都在磁盘上 / 与产物清单一致 / 不含 board.js / 含首屏题库
[CHECK] PASS 首屏 index.html gzip 92.8 KB ≤ 140 KB (ADR-012)
[CHECK] PASS 首屏 index.html raw 293.8 KB ≤ 520 KB (ADR-012)
[CHECK] PASS 首屏总 gzip 125.8 KB ≤ 180 KB (ADR-012：index+cards+manifest)
[CHECK] 27 passed, 0 failed -> GREEN
```

- SW 预缓存清单（8 项）：`./`、`./index.html`、`./manifest.webmanifest`、`./assets/cards.6e682ef2.js`、4 个 PWA 图标；不含 `board.js`。
- 产物里**没有** `assets/board.js`（V5 的 511 KB three.js 包）；`app/src/view/board.js`（SVG 棋盘）是**内联**在 index 的应用代码，和冻结单“首屏不再加载 511KB board.js”不矛盾。README/release-notes 的表述建议按 S-05 澄清一次。
- `dist/rebuild` 当前与当前源码同哈希 d4a5a966；`--check` 对干净目录运行（README §149 已说明仓库根的 V5 `assets/board.js` 是回滚资源）。

### 1.2 引擎测试

```powershell
node qa/rebuild/flight-engine.test.mjs   # 700 passed, 0 failed
```

章节覆盖：V6 规则修复（§13）、meta/连击（§14）、合作收尾（§15）、V5→v2 迁移（§16）、命运格（§17）、尺度区分（§18）、快照落盘（§19），与 spec/冻结单三处一致。迁移断言包括：v1 `validate` 升级 v2、`cardsProcessed` 从 log 统计、`meta` 从 log 重放（8+3+5=16）、旧 rules 快照不被 V6 默认值覆盖、`Store.getSession` 读 v1 后**原样备份**到 `couple2.backup.session`（§16 第 89–92 条）。

旧文件 `qa/rebuild/engine.test.mjs` 仍是 103 passed / 5 failed（5 条是 V5“公寓”存档/导出语义，非 V6 发布门）；见 R-05，不要用“全部测试都绿”口径对外。

### 1.3 QA 定向复跑（当前构建 d4a5a966）

- `reports/v6/qa-e2e-events.md`（18:28:18，PASS 8 / FAIL 0）：AC-C1-2 击落归属/回机坪、AC-C1-3 叠机两人一起、AC-C2-3 叠机放过奖励步、AC-C2-2 进航放过仍进军、H6 全 PASS。
- `reports/v6/qa-e2e-check.md`（18:29:22，PASS 115 / FAIL 0）：含 AC-A4-3（before=hot after=hot ui=true）、AC-F1-1（“今晚完成了（0ms）”）、AC-F2-1 六项（含“时长/27 秒”）、AC-A2-3（mode=quick target=4 planeCount=2）、AC-E3-1（4ms）、C3-1（0–4ms）、B6-2、B3-3（棋盘入口）等。
- 仍待闭环：`reports/v6/qa-report.md` 最新全量仍是 **18:21:30 / 旧构建 a89ac98c / FAIL（Q-01..Q-06）**。发布前必须用当前构建跑一次全量并覆盖，否则发布门证据链不完整。

### 1.4 网络 / XSS / 隐私（静态 + 动态）

- 全 `app/src` 无 `fetch(` / `XMLHttpRequest` / `sendBeacon` / `navigator.share` / 外链图片（源码检索无命中）；`app/src/ui/share.js:369-450` 只在本地 `<canvas>` 绘制，`toBlob/toDataURL + a.download` 触发下载，不上传、不生成外链。
- Playwright 全程 `ps.requests` 只有同源静态资源；6 个场景 `pageerrors=[]`、`console_errors=[]`、`failed_requests=[]`、`bad_responses=[]`。
- XSS：把题卡文本注入为 `<img src=x onerror="window.__XSS__=1">HELLO<b>X</b>` 后，`[data-test=prompt-text]` 以**文本**显示全部字面量，页面 `img` 数 0、`window.__XSS__` 未置位；`prompt-card.js` 的 `esc()` 覆盖 actor/target/card text，`ledger.js` 的明细同样 `esc()`。

---

## 2. 关键验收实测（Playwright + Edge；证据在 RV 本机 `%TEMP%\rv-shots\` 与 QA `qa/v6/shots/`）

### 2.1 红线：全放过局能收尾 + 收尾文本 ≤500ms（AC-C2/E2/E3/F1-1）

场景：390×844，快局（2 架 / 目标 4 张 / 目标 heat 40），用引擎测试钩子固定骰子，**4 张普通题卡全部点「放过」→ 2 张收尾卡全部点「放过」**：

| 观测 | 结果 |
|---|---|
| 收尾触发 | 第 4 张后出现「今晚最后一段」+「收尾卡 · 第 1/2 张」（`ending-start`），随后第 2/2 张 |
| 收尾卡归属 | prompt.actorId = a / b，kicker 分别含「给 阿岚」「给 阿策」 |
| 完成文本时延 | 点第 2 张「放过」→ `[data-test=finish-text]` **57ms**（旧构建 a89ac98c 同法 104ms；QA 18:29 当前构建 0ms） |
| 回顾 | 「今晚回顾 / 今晚完成了」；时长「23 秒」；题卡「共 6 张 · 做了 0 · 放过 6」；心动值 18 · 灯刚亮；连击 0；小游戏「今晚没有小游戏。」；明细 6 条可展开；无「这一笔没有句子」、无「失败/扣分/惩罚」、标题区无「赢/输/胜/负」 |
| heat 单调 | 3 → 6 → 9 → 12（4 张放过）→ 15 → 18（2 张收尾放过），任何一步不下降；`cardsProcessed` 1→2→3→4，收尾卡不增加（4→4） |
| 控制台 | 0 pageerror / 0 console error |

同法再跑“做了/放过”混合局（做、放、做、放 + 两张收尾都做）：heat 0→8→11→19→22→32→42；streak 1→1→2→2→3→4（**放过不清零**）；finish 58ms；回顾「共 6 张 · 做了 4 · 放过 2 / 心动值 42 / 最高连击 4」。

### 2.2 事件题卡：击落 / 叠机 / 进航（AC-C1-2/C1-3/C2-2/C2-3）

> 说明：QA 17:53/18:20 的 Q-05/Q-06 是因为夹具把“黄方起飞格”当成 red 的 `ring:12` 使用（a 的颜色≠red 时 ring:12+2 会跨进航线），产品侧实际正确；qa2 已把夹具改成按颜色算坐标，18:28 复跑 PASS。RV 用独立夹具复验：

| 用例 | 实测 |
|---|---|
| 击落 | `prompt.kind=capture`、`actorId/targetId=b`（被击落方）；kicker=「击落 · 阿策 的飞机回机坪了 · 这张给 阿策」；放过/做了后 `b:0` 回 `hangar:yellow:0` |
| 叠机 | `prompt.kind=stack-duo`、`targetId=both`；kicker=「叠机 · 两人一起 · 这张给你们俩」；点放过后落点 `ring:2` → `ring:3`（**+1 奖励步仍生效**） |
| 进航 | `prompt.kind=home-entry`；点放过后 `a:0` = `home:red:0`（**仍进军**），`awaiting=roll`，`cardsProcessed=1`，heat +3 |

### 2.3 暂停 / 安全词（AC-B4/B5/G1/G2/G5）

- 所有屏幕右上角安全词胶囊 `[data-test=safety-word]` = **96×48**，`z-index:380`，在 boot/settings/小游戏大厅/以前的夜/主桌/题卡/暂停/回顾 **8 个屏**扫描：可点、`elementFromPoint` 命中自身、与任何可见 button/a/input 的矩形**零交叠**。
- 长按 1.7s → `data-screen=pause`；短按 0.5s → 仍在 `table`；暂停层四个动作都在：继续 / 今晚就到这 / 看今晚记录 / 加一条今晚不做的；`session.phase` 仍 `playing`，继续后回到原屏且原题卡仍在（`awaiting=prompt`）。
- 「看今晚记录」是暂停内只读预览（`pause-recap-stats` / `pause-recap-list`），不跳 ledger。
- 「今晚就到这」→ 先出确认页（此时 session 仍 playing）→ 确认后 `safeWord` → history 1 条、`safe:true`、session 清空、ledger 标题「今晚就到这」、无输赢词。
- 暂停页含「今晚的记录会留着，不会少一条。」（AC-G5-1 暂停侧 PASS）；收尾页/回顾页写的是「今晚的记录都留在这儿。」（见 R-04 字面口径）。

### 2.4 门厅 / 主桌 / 响应式 / 可访问入口

- A1：360×640 开始按钮 rect y=548.2..604.2（<640）；390×844 y=752.2..808.2（<844），两档都完整在首屏。
- A2：快局/长夜两份文案齐全；开局后引擎 `mode=quick, planeCount=2, targetCards=4, targetHeat=40, v=2`。
- A4-3（Q-01 修复）：点「热烈」→ `settings.scale=hot` → 刷新后 `settings.scale=hot`、`aria-pressed=true`（`boot.js:239-245` 点选即落盘；当前构建实测通过）。
- A5：首次规则速览 / 主桌「规则」两处都能读到 6 条（6 起飞 / 6 可再掷 / 跳/飞/进航 / 击落回机坪 / 放过不惩罚 / 安全词随时可停）。
- B1：骰子文字「掷出 N」首现 37–49ms，2 秒后仍保留；6 点带「再掷一次」。
- B2：全在机坪强掷 5 → hint「没有飞机能动，换 阿策 掷骰」+ 原因「飞机还在机坪，得掷到 6 才起飞」；回合 a→b。
- B3：可走子有文字按钮（含颜色/第几架/从哪走）+ 棋盘高亮；QA 18:29 的 B3-3（棋盘入口点出同一步）PASS。
- B6：状态条四项「X 的回合 / 第 N/4 张 / 心动值 X / 连击 Y」；结算后同步 0–4ms（QA）/ RV 含 Playwright 点击等待 341–382ms，均 ≤500ms。
- H1-2（360 宽）：掷骰 336×44、暂停 48×44、安全词 96×48，中心 `elementFromPoint` 都命中自身。
- H4-1：boot 在 320/360/390/430 四档 `scrollWidth == clientWidth`。
- 棋盘 DOM：`[data-square]` = **92**（52 主环 + 20 航线 + 16 机坪 + 4 终点），`.bv-piece[data-piece]` 4（快局 2+2），主桌 `[data-test=rules]` 存在。

### 2.5 P0 AC 对照（逐条，来自 spec §4；PASS/PARTIAL/UNVERIFIED）

| AC 组 | 重点断言 | 结论 | 证据 |
|---|---|---|---|
| A1 | 360/390 首屏可见开始按钮 | PASS | §2.4；QA AC-A1-1/2 |
| A2 | 快局/长夜 + 目标/时长/架数；引擎状态一致 | **PASS**（A2-3 回顾页目标数 PARTIAL，见 R-03） | §2.4；qa-e2e-check AC-A2-3 |
| A3 | 空名/同名/同色行内错误，修正后进主桌 | PASS（QA） | qa-e2e-check AC-A3-1/3/4；boot.js:297-337（同色自动互斥） |
| A4 | 四档说明、DOM 可读、选择被记住 | PASS | QA AC-A4-1/2/3；RV A4-3 实测 |
| A5 | 规则速览 6 条、可再次打开 | PASS | §2.4 |
| A6 | 刷新续玩：掷骰/题卡/小游戏/暂停 | **PARTIAL（暂停页不还原）** | 题卡/掷骰 QA PASS + RV；暂停：R-02 证据 |
| B1 | 点数文字 ≤800ms、保留、6 再掷、DOM 可读 | PASS | §2.4；QA |
| B2 | 无子可走原因 + 自动换人 | PASS | §2.4 |
| B3 | 文字按钮 + 高亮 + 两入口同一步 | PASS | QA AC-B3-1/2/3（含棋盘入口） |
| B4 | 安全词 7 屏常驻、不遮挡、不误触 | PASS | §2.3（8 屏零交叠 + hit 自身） |
| B5 | 暂停按钮进 pause、返回状态不变、≥44 | PASS | RV B5 实测 + QA B5-1/2 |
| B6 | 状态条四项、结算 ≤500ms、无横向溢出 | PASS | §2.4；QA B6 |
| C1 | 题卡 100% 归属人名（cell/capture/stack/ending） | PASS | §2.2；QA C1-1/2/3；prompt-card.js:191-228 |
| C2 | 放过不惩罚 5 条 | PASS | §2.1/2.2（heat、进航、叠机、连击、回顾文案） |
| C3 | 结算 ≤500ms 记录 toast + 状态条 | PASS | QA C3-1 0–5ms；RV 341–382ms 含点击等待 |
| D1 | 小游戏格直接进可玩面板、无「玩过了」 | PASS（QA） | qa-e2e（thermo/truth-wheel）；table.js:704-712 |
| D2 | 可跳过、跳过/完成都记录、不扣 heat | PASS（QA） | QA D2-2；resolveMinigame 记录 log、heat 0/+5 |
| D3 | 回主桌原状态、不需重掷 | PASS（QA） | QA D3-1；engine resolveMinigame → afterAction |
| E1 | heat 数值严格/不降/阶段/三处一致 | PASS | §2.1；flight-meta.js:35-156；engine:987-988/1063 |
| E2 | 无输赢、两张收尾卡各一人、回顾无输赢词、全放放过也进回顾 | PASS | §2.1；engine 85 + ledger `ending=shared` |
| E3 | 三条件触发、触发后不再出普通题 | PASS | §2.1（卡数）；heat/长夜到达：engine §15（84-85）；触发后 `roll` 返回 `AWAITING_OTHER`（engine 85） |
| F1 | 完成文本 ≤500ms、不依赖动画、不再只说给输家 | PASS | §2.1（57/58ms；QA 0ms）；table.js:973-1007 |
| F2 | 6 类信息 + 明细可展开 + 无占位句 + 60 条上限 | PASS | §2.1；ledger.js:370-408；store.js:47（60） |
| G1 | 任意屏暂停、四动作、继续不丢、暂停不抽题/不计时 | **PARTIAL（时长口径）** | §2.3；G1-4 计时见 R-01 |
| G2 | 长按 1.6s→暂停、短按不触发、不归档、今晚就到这归档 | PASS | §2.3（long 1.7s / short 0.5s；history safe；session 清空） |
| G5 | 暂停/收尾说明含「记录会留着」、无惩罚词 | **PARTIAL（收尾页字面）** | §2.3；R-04 |
| H1 | 关键按钮 ≥44、中心 hit-test | PASS | §2.4；QA H1-1 |
| H2 | 减少动画 ≤100ms、文本仍在 | PASS（QA） | QA H2-1（6ms）、H2-2 |
| H3 | 离线可开局/续玩/收尾 | PASS（部分 UNVERIFIED） | QA H3-1（断网 boot 67ms + 开局）；整局离线见 §5 |
| H4 | 320–430 无横向滚动、字号 ≥15px | PASS | §2.4；QA H4-2 |
| H6 | 主路径 0 pageerror / 0 console error | PASS | 6 个 RV 场景 + QA 各分组均 0/0 |

---

## 3. 必改项（编号 → 文件:行 → 怎么改 → 为什么）

> P0 必改项：**0**。以下按优先级列出非阻塞必改；R-01/R-02 建议本轮修（改动小、影响体验/口径），R-03~R-06 可跟下一个补丁。

### R-01 [P1] 暂停时长被计入 `ledger.durationMs`，与 HUD/暂停页口径不一致（AC-G1-4）

- 位置：
  - `app/src/engine/flight-engine.js:1069-1072,1112`：`startedAt = state.ts; durationMs = endedAt - startedAt`（**墙钟**，包含暂停）
  - `app/src/ui/screens/table.js:317,481,1108`：HUD 用本地 `pauseAccum` 扣掉暂停（`now-start-pauseAccum`），但**不写回 state**
  - `app/src/ui/screens/pause.js:96,114`：暂停页/记录页用 `Date.now() - startedAt(s)`，同样没扣暂停
- 证据：390×844 混合局，暂停 3.01s → `ledger.durationMs=28705`、`endedAt-startedAt=28.705s`、活跃时间 ≈25.69s；`pause_included=true`。HUD 与回顾页对同一局会差一个暂停时长，AC-G1-4“计时不计入时长”只在 HUD 局部成立。
- 怎么改（二选一）：
  1. 在 state 里持久化暂停累计：`table.js` 打开/关闭暂停时累加 `state.pausedMs`（并 `saveSession`），`buildLedger` 用 `endedAt - startedAt - (state.pausedMs||0)`；`pause.js` 的展示也读同一字段；
  2. 或把“活跃起点”维护在 state（`state.activeStartedAt`），暂停时冻结、继续时顺延，ledger 用 `endedAt - activeStartedAt - pausedAccum`。
- 为什么：AC-G1-4 明确“暂停期间…计时不计入时长”；不修会导致回顾时长被长暂停显著拉长（E7-3 的 ±5s 也会因此失真）。

### R-02 [P1] 暂停态刷新/重开后，点「继续今晚飞行棋」直接回到主桌/题卡，不还原暂停页（AC-A6-2）

- 位置：
  - `app/src/ui/screens/pause.js:18,288-327`：暂停层状态只存在模块内存（`state.open/el`），不落 session
  - `app/src/core/store.js:118-160`：session 里没有 paused 标记
  - `app/src/ui/screens/boot.js:111-112`（`continue-flight` 按钮）、`boot.js:287`（`go==="resume"` → `Router.reset('table')`）
- 证据：暂停中 → `page.reload()` → 首页仍有「继续今晚飞行棋」（A6-1 PASS）→ 点击后 `data-screen=table`、`pause-layer` 数量 0、`awaiting=prompt`（**题卡会直接弹出**）。AC-A6-2 要求“相同暂停页”，当前为 PARTIAL。
- 怎么改：`App.Pause.open()` 时把 `state.paused=true`（或 `pausedAt`）写进 session（`saveSession`），close/继续时清掉；`boot.js` 的 resume 分支（或 `table.mount` 末尾）若读到 `paused`，在 table mount 后再 `App.Pause.open('resume')`（不要直接弹题卡）。注意与 R-01 共用暂停字段。
- 为什么：刷新/切后台回来时直接暴露题卡/交互，弱化“安全词=先停一下”的语义；这是 A6 明确列举的状态之一。

### R-03 [P2] 回顾页没有显示“目标张数”，A2-3“同一组数字”只满足一半

- 位置：`app/src/ui/screens/ledger.js:378-389`（“题卡”行只写 `共 N 张 · 做了 D · 放过 S`，无 target）；暂停页有（`pause.js:26-37,53-57`）。
- 怎么改：在回顾“题卡”行追加 `· 目标 N 张`（`ledger.mode/targetCards` 已在 ledger 里；或 `stats` 补 `targetCards`），复用暂停页的同一组数字。
- 为什么：AC-A2-3 要求“该目标在暂停页与回顾页可读到同一组数字”；当前只有暂停页可读。

### R-04 [P2] 收尾页/回顾页文案不是「记录会留着」（AC-G5-1 字面）

- 位置：`app/src/ui/screens/table.js:588-590`（“今晚的记录都留在这儿。”）、`app/src/ui/screens/ledger.js:374`（同句）；暂停页是「今晚的记录会留着，不会少一条。」（`pause.js:108,123,156`）。
- 怎么改：收尾区/回顾页顶卡片改用「今晚的记录会留着。」或补一句；不改语义只统一字面。
- 为什么：AC-G5-1 写“暂停页与收尾页各有一句说明文本，包含「记录会留着」”；现在收尾页是近义句，QA 只在暂停侧判了 PASS。

### R-05 [P2] 旧测试债务未标注：`qa/rebuild/engine.test.mjs` 5 条 V5 公寓断言失败

- 位置：`qa/rebuild/engine.test.mjs:355-398`（`Store.getSession` 归档 `mid-voyage`、`exportAll.app='couple-apartment'` 等旧语义）；文档只在 `docs/REBUILD.md`/README 引用 `flight-engine.test.mjs`，没有说明这个旧文件。
- 现状：`node qa/rebuild/engine.test.mjs` = 103 passed / 5 failed；与 V6 无关，但会误导“全绿”口径或 CI。
- 怎么改：在文件头加 `V5 公寓遗留；发布门只跑 flight-engine.test.mjs` 的说明并标记 skip/移入 `legacy/`，或把 5 条断言更新为 V6（若保留该文件作回归用途）。
- 为什么：避免把历史债误读成 V6 回归；发布门定义已改为 flight-engine。

### R-06 [P2] 发布文档同步到修复后事实

- 位置：`docs/v6/release-notes.md:33`（命运卡“不选 +3”——实现/AC-E5-3 是**不选=0**，`flight-meta.js:43,50` 的 `fateSkipped` 是 UI 不可达分支）；`release-notes.md:117-130,152-158`（仍把 Q-01/Q-02~04 写成未修“已知问题”，引用 17:53/18:20 旧快照）；README 对 board.js 的表述可补一句“内联的是 SVG 棋盘源码，不含 511KB three.js 资源”。
- 怎么改：DOC 在发布前更新 §4 验收引用 + §6.2 已知问题（改为已修复或删除）+ §1.3 命运热值句；QA 全量重跑后替换报告引用。
- 为什么：文档是发布对外口径，当前与实现/复测不一致，会误导 release 判断。

---

## 4. 建议项（S-01…，不阻塞）

- **S-01** spec §7 第 20 步：“保存到以前的夜”V6 是幂等保存 + toast，不跳「以前的夜」列表（`ledger.js:438-443`；QA notes 也记录）。要么在冻结单里写明这一偏差，要么改成跳 `nights` 并按 id 高亮；当前 UI 不骗人但和验收路径字面不一致。
- **S-02** 命运格 heat 死分支：`flight-meta.js:43,50`（`fateSkipped:3`）在 UI 不可达（`flight-engine.js:967-978` 不选直接 return，不 applyMeta），但 release notes 声称“不选 +3”。建议删分支或补“选了卡再放过”的 UI，避免下一轮误测。
- **S-03** `pause.js:96,114` 的“今晚 m:ss”在实现 R-01 后改为读同一 `pausedMs`，否则暂停页/HUD/回顾三处仍会出现两种时长。
- **S-04** QA 报告可复现性：`AC-F2-1-时长` 在 18:20 全量报“未命中”，但同一构建的截图与 RV 用 `Q.body_text` + QA 原正则（`e2e_v6.py:1523`）复跑六项全 True；建议 QA 在失败时把 `body_text` 截断写入 evidence，避免“报告与截图矛盾”，并在最终报告标注构建哈希。
- **S-05** 文档口径：README/release-notes 统一说明“首屏不加载的是 `assets/board.js`（511KB three.js）；`app/src/view/board.js` 是 SVG 棋盘源码，随 index 内联（约 92KB 源，gzip 后计入 92.8KB 的 index 预算）”。
- **S-06** QA 覆盖矩阵与用例同步：18:20 报告的矩阵仍有 A2-3/B3-3 等“未覆盖”，而 18:29 定向脚本已覆盖；建议全量重跑后重新生成矩阵，避免“P0 执行率 100% 但矩阵未覆盖”的自相矛盾。
- **S-07** 主桌 `data-test="round"` 显示“第 1 回合”与 spec 的“回合条”可接受；若后续要按人统计回合，建议在 view 里暴露 `rounds`，当前 `roundOf` 是 UI 推算（table.js 内部），不影响验收。

---

## 5. 未验证项（UNVERIFIED；含怎么验）

1. **QA 全量（含 perf/visual）在 d4a5a966 上重跑**：`python qa/v6/run_all.py --final`。现有全量报告 18:20 是旧构建 a89ac98c，必须重跑；RV 只做了定向 + 自测。
2. **真机 iOS Safari / Android Chrome**（spec §9.6）：长按安全区、PWA 安装、滚动/键盘、震动。需真机手测。
3. **断网下完成一整局**（AC-H3-2）：QA 只验了断网 boot + 开局；SW PRECACHE 与同源请求已核对，整局离线路径未实测。
4. **分享图实际下载文件**：`App.Share.exportLedger` 在 headless 下的 download 事件未捕获；代码层已确认 canvas→blob→a.download、无网络、不包含题卡原文（`includeText` 才画）。可用本地 Chrome 手动点一次「存成图片」验文件尺寸 1080×1350。
5. **P1 项**：C6 换一张、D4 温度计遮挡页、D5 转盘重转、E4 里程碑双人选卡、G3 中途边界即时生效、G4 导入导出——本轮未逐条重验（部分 QA/owner 已验）；不阻断 P0 结论。
6. **长夜 4 架浏览器整局**：引擎 §15 已覆盖“长夜任一进终点触发 + 两张收尾”；浏览器只跑了快局，长夜只验了开局配置与文案。
7. **3D 回滚开关**：`settings.boardView:'3d'` 预留不生效（release notes 已声明），不在 V6 验收内。
8. **视觉像素回归**：引用 QA `reports/v6/qa-visual.md`（PASS 47/0，基线截图），RV 未独立做像素 diff。

---

## 6. 集成说明（发布/回滚/风险）

### 6.1 集成状态

- **模块与顺序**：`tools/rebuild/build_app.py` 的 28 个 JS 模块全部入包，`flight-meta` 在 `flight-engine` 之前（构建闸门 `assert_module_order` PASS）；题库独立 `assets/cards.6e682ef2.js`（191,068 B / 32.6KB gzip），首屏 1 个外链脚本 + preload，head 无阻塞脚本。
- **契约一致性**：`App.BoardView{mount,setState,play,setChoices,setReduced,setSound,unmount}`、`App.PromptCard.open(host,prompt,state,handlers)`、`App.MiniGame.open(host,kind,state,handlers)`、`App.Pause.open(reason)/isOpen/close`、`App.UI.rulesSheet()` 均与 `impl-freeze §3` / `api-contract §7.1` 对齐；table 只通过门面调用，跨模块无重复实现。
- **选择器/QA 口径**：`[data-square]` 92、`.bv-piece[data-piece]`、主桌 `[data-test=rules]`、`[data-test=roll/pause/status-cards/status-heat/status-streak/turn-a/turn-b/prompt-*/minigame-*/safety-word]` 均在；QA 的定向复跑（18:28/18:29）对当前构建 PASS。
- **数据**：`state.v=2`、`mode/targetCards/targetHeat/cardsProcessed/meta/endingQueue/endingIndex` 落盘；V5 `v:1` 迁移 + `couple2.backup.session` 原样备份（engine §16 + store.js:118-156）；history 上限 60；无网络请求、只 localStorage。
- **版本/缓存**：`App.version=6.0.0`；`sw.js` CACHE=`couple-flight-v6-d4a5a966`，BUILD 与 index sha8 一致；PRECACHE 8 项与磁盘一致；manifest start_url/scope 未变。

### 6.2 发布步骤（建议）

1. **冻结源码**：当前源最后改动是 `boot.js:18:22:31`；发布前请通知所有 owner 停止改源码，然后由 fe-build 重新跑：
   `python tools/rebuild/build_app.py --out dist/rebuild --check --strict`（干净目录或 `dist/rebuild`，二者哈希应一致）。
2. **QA 全量**：在当前构建上 `python qa/v6/run_all.py --final`，确认 `qa-report.md` 的结论为 PASS（或只剩明确非阻塞 P1），并记录 index sha256 前 8 位。
3. **提交**：各 owner 只提交自己写作用域；RV 未改实现、未 commit；本文件 `docs/v6/review.md` 由 RV 新增。
4. **发布**：按用户授权用 token 推 `main` 触发 Pages；如果最终 index 哈希与 QA 报告不一致，必须重跑 QA/记录新哈希。

### 6.3 回滚

- 同一次构建的 `index.html + assets/cards.<hash>.js + sw.js + icons/ + manifest.webmanifest` 必须一起回滚（缓存名/index 哈希/题库哈希互相关联）；不要只回滚 index。
- V5 回滚需同时恢复 `assets/board.js`（本 V6 产物默认不含）与 V5 的 `sw.js`；`couple2.backup.session` 保留的是首次读取到的原始 session（V5 v1），可人工导出。
- 历史最多 60 局；`docs/REBUILD.md §6` 有详细回滚步骤（RV 已核对 build 脚本行为，未重复执行回滚演练）。

### 6.4 风险

- **源码在复审期间仍在动**（boot.js 18:22 的 A4-3 修复）：发布前必须用最终快照重跑 build/QA；否则本报告与 QA 报告会指向不同哈希。
- **内联体积**：index 293.8KB raw / 92.8KB gzip，符合 ADR-012（520KB/140KB），但解析量集中在单文档；QA 实测 slow4G+4×CPU DCL 1.38s（中位），硬门槛 3.5s，余量充足；低端机仍建议发布后观察 FCP/DCL。
- **暂停时长/暂停恢复**（R-01/R-02）：不阻塞发布，但会在“暂停很久再回来”的真实场景里出现时长偏差和直接弹题卡；建议本轮补掉或写进已知限制。
- **旧测试/报告churn**：`engine.test.mjs` 5 fails 与 QA 报告多次覆盖容易造成误判；发布口径只认 flight-engine 700/0 + 最终 `build --check` + 当前构建 QA 全量。
- **发布后重点观察**：SW 更新是否及时（CACHE 哈希已内置）、离线冷启、iOS 长按安全区/滚动、回顾分享图下载。

---

## 7. 附：复审用命令与环境

- Python：`C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe`（3.12.14）；Node v26.13.1；Edge `channel=msedge` headless。
- 构建：`build_app.py --out %TEMP%\v6-rv-build2 --check --strict` → 27/27 GREEN。
- 引擎：`node qa/rebuild/flight-engine.test.mjs` → 700/0。
- RV Playwright 场景：390×844 / 360×640；全放过局、混合局、暂停/安全词、回顾、capture/stack/home-entry 夹具、XSS 注入、B4 八屏扫描、H1/H4；截图 `%TEMP%\rv-shots\*.png`（`skip_ledger.png`、`mix_ledger.png`、`pause_360.png`、`resume_after_pause_*.png`）。
- QA 定向报告：`reports/v6/qa-e2e-events.md`（18:28:18）、`reports/v6/qa-e2e-check.md`（18:29:22），构建 sha8=d4a5a966。
- 注意：本报告写于 QA 全量重跑之前；若 QA 全量结果与 §0 冲突，以**当前构建的新全量报告**为准，并请把哈希写进报告头。
