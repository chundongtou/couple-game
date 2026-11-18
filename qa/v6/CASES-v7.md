# V7「云海机舱 · 45° 格子剧场」QA 用例清单

> 口径：`docs/v7/impl-freeze.md` §1–§6；执行入口 `qa/v6/run_all.py --final`（构建 → 引擎 → E2E → 性能 → 视觉）。
> 本轮在 `dist/rebuild-v7`（App.version=7.0.0，33 模块，index gzip 134.7KB / 首屏 167.8KB）上验收。
> 写作用域：`qa/v6/**`；不改 `app/`、不放宽产品断言。

## 0. AC 与套件映射

| AC | 验收点 | 执行套件 / 用例组 | 用例数（约） |
|---|---|---|---|
| AC-V7-1 | 镜头状态链 8 态 + 5–8s + 快进 | `e2e --only cinema`（V7-CHAIN/ROLL/RETURN/SKIP） | 12 |
| AC-V7-2 | POV / 第三人称跟拍 / 目标格发光 | `e2e --only cinema`（V7-POV/V7-CHASE/V7-LAND） | 5 |
| AC-V7-3 | 落地后 cell45/bear + 小熊 | `e2e --only cinema,cellstage` + `main` 收尾 | 8 |
| AC-V7-4 | CellStage 接管题卡与变体 | `e2e --only cellstage`（V7-CS-01…13 + 5 变体） | 20 |
| AC-V7-5 | 三主题 + 变量 + 刷新保持 + outfit | `e2e --only theme`（V7-THEME-01…08） | 8 |
| AC-V7-6 | 320/360/390/430 无溢出 + 92 格 + hit-test | `e2e --only cellstage,v7responsive,cabin` | 18 |
| AC-V7-7 | reduced 无 POV/跟拍/震动 | `e2e --only cinema`（settings P0；系统偏好 P1 观察） + `perf` | 8 |
| AC-V7-8 | 快进立即到终态 | `e2e --only cinema`（V7-SKIP-01…05） | 5 |
| AC-V7-9 | 门厅/20 回合长帧/隐藏暂停 | `perf_budget.py`（PB-1…13 + V7-PERF-01/02/02B/03） | 13 |
| AC-V7-10 | 视觉基线按 V7 重建 | `visual.py`（boot/table/prompt/ledger + star/paper 对照） | 12 |
| AC-V7-11 | V6.1 全量回归 | `e2e` 其余全组（main/skip/takeoff/win/notend/legacy/resume/pause/minigame/fate/events/responsive/offline/reduced） | 100+ |

## 1. V7 镜头链（cinema 组）

前置：门厅快局开局，`App.Cinema._debug()` 可读；夹具只构造合法局面（不改实现）。

| 编号 | 用例 | 断言 |
|---|---|---|
| V7-CINEMA-01 | Cinema 层挂载 | `[data-test=cinema]` 存在、`pointer-events:none`、铺满视口 |
| V7-CINEMA-02 | 版本/初始态 | `data-cinema-version=7.0.0`、`data-cinema-state=overview`、棋盘 transform='' |
| V7-CINEMA-03 | 相机接管 | `[data-test=cabin-scene][data-cabin-camera=off]`（board transform 归 Cinema） |
| V7-ROLL-01..04 | 掷骰镜头 | roll 出现且 scale≥1.02；快进按钮可见可点；回 overview 等待选子；roll 0.85–1.35s |
| V7-CHAIN-01 | 状态链顺序 | `pov→chase→land→cell45→bear` 依序出现（轮询 `data-cinema-state`） |
| V7-CHAIN-02 | 分段时间 | pov 0.95–1.3s / chase 1.35–2.6s / land 0.38–0.72s（`_debug().stats.log`） |
| V7-CHAIN-03 | 小熊探头 | cell45→bear 间隔 350–1100ms |
| V7-CHAIN-04 | 总时长 | roll+pov+chase+land+return+cell45→bear ∈ [5000, 8200]ms（不含用户答题） |
| V7-POV-01 | POV 前景 | `cinema-pov` 不透明度>0.5 + `.on`；机翼≥2、云≥5、速度线存在；棋盘含 rotateX |
| V7-CHASE-01 | 第三人称跟拍 | chase 时 scale≥1.05；`cinema-glow.on`（目标格发光） |
| V7-LAND-01 | 落地反馈 | land 状态内 `cinema-dust.on` 或 `cinema-ripple.on` |
| V7-CELL-01..04 | 落地后舞台 | cell-stage 出现、45° 格子可见；bear=data-test 可见/pilot/aria-hidden；prompt-card 在 cs-root 内、无 .pc-root |
| V7-RETURN-01..02 | 收卡回俯瞰 | 做了→return→overview（≤2.6s），棋盘 transform=''，cell-stage 收起；return 0.55–1.15s |
| V7-SKIP-01..05 | 快进 | roll/move 中按钮可见可点；点按 ≤2.5s 到终态；stats.log 中 pov/chase skipped=true |
| V7-REDUCED-01..05 | reduced（设置） | `data-cinema-reduced=1`、无 transform、无 pov/chase、无 dust；cell-stage `data-reduced=1` 动画≤10ms；收卡回 overview |
| V7-REDUCED-SYS | reduced（系统偏好，P1） | `prefers-reduced-motion` 下 `data-cinema-reduced=1` 且无 pov/chase（当前实现未接入 Cinema，P1 缺陷） |

## 2. CellStage（cellstage 组）

| 编号 | 用例 | 断言 |
|---|---|---|
| V7-CS-01 | 接管题卡 | `.cs-root` 存在、`prompt-card` 在内、`.v6-cardwrap/.pc-root`=0 |
| V7-CS-02 | 不吃棋盘点击 | root PE=none、card PE=auto |
| V7-CS-03 | 45° 舞台 | `.cs-cell-floor` transform 含 matrix3d；`.cs-text` transform=none |
| V7-CS-04 | 内容卡结构 | cell-type/prompt-source/cell-theme/prompt-kicker 含人名/prompt-stars 有 ★ |
| V7-CS-05 | 小熊 | `[data-test=bear]` 可见、outfit=pilot、aria-hidden=true、data-bear=on |
| V7-CS-06 | 触控/字号 | 做了/放过 h≥44；正文 font-size≥15 |
| V7-CS-07 | 安全词/暂停 | elementFromPoint 命中原控件，不落 `.cs-root` |
| V7-CS-08 | 无横向溢出 | scrollWidth≤clientWidth；card 左右在视口内 |
| V7-CS-09 | 先看棋盘 | collapse→cs-collapsed；restore 可恢复 |
| V7-CS-10 | 做了 | cards+1、心动 +8、cell 收起、等 data-cinema-state=overview |
| V7-CS-11..12 | 放过 | 第二张卡类型（大冒险）；放过 Δheat≥0、回主桌 |
| V7-CS-V-longtext | 长文本 | 500+ 字卡：scrollHeight>clientHeight、data-scrollable=1、按钮固定（滚动后 y 不变） |
| V7-CS-V-function | 功能格 | cell-type 含跳格；仅「继续」按钮；continue 回调 |
| V7-CS-V-fate | 命运格 | 2 张卡 + 今晚先不选；点第 2 张→choose(1) |
| V7-CS-V-ending | 收尾卡 | kind=ending；kicker「今晚最后一段 · 第 1/2 张 · 给 阿策」；done 回调 |
| V7-CS-V-minigame | 小游戏入口 | 「开始小游戏」按钮 + minigame 回调（产品主流程仍走旧 MiniGame，见偏差） |
| V7-HIT92-01/02 | 92 格 | 卡片收起/组件关闭后 92 格 elementFromPoint 全命中棋盘，cinema/cell/cabin=0 |

另：V6.1 `main` 主路径的两张收尾卡追加 `V7-ENDING-CELL` 断言（CellStage kind=ending、cs-card--ending、ending-card 标记）。

## 3. 主题（theme 组）

| 编号 | 用例 | 断言 |
|---|---|---|
| V7-THEME-01 | 门厅三选一 | `[data-test=themes]`、theme-cloud/star/paper 三卡、cloud 默认选中、html[data-theme=cloud] |
| V7-THEME-02 | 切 star | html/body data-theme=star、`--bg0=#08060F`、`--v7-board-rim=#B9A4F0`、settings.theme=star、theme-color |
| V7-THEME-03 | 刷新保持 | reload 后 html/settings/门厅 aria-pressed 均为 star |
| V7-THEME-04 | 主桌继承 | `.v6-table[data-theme=star]`、`data-cinema-theme=star`、变量下发、92 格不变 |
| V7-THEME-05 | star 题卡 | cell-stage data-theme=star / data-outfit=starlight；bear data-outfit=starlight |
| V7-THEME-06..08 | paper | 启动即 paper（落盘保持）、主桌/题卡继承、outfit=paper |

## 4. 响应式（v7responsive 组）

| 编号 | 用例 | 断言 |
|---|---|---|
| V7-RWD-01 | 门厅 | 4 视口无横向溢出 |
| V7-RWD-02 | 主桌 | 无横向溢出；Cinema PE=none |
| V7-RWD-03 | 92 格 | 4 视口 92 格全命中棋盘层 |
| V7-RWD-04 | 长文本格子舞台 | 4 视口：可滚动、card 在视口内、按钮在视口内且固定、安全词/暂停 hit-test 可达（取 rect 前等待入场动画 520ms） |

## 5. 性能（perf_budget.py）

- PB-1..PB-13（体积/门厅 DCL/FCP/可掷骰/heap/离线/请求数，slow4G + 4×CPU gzip 服务）。
- V7-PERF-01：20 回合连续走子（含镜头链）rAF 长帧 >25ms ≤5%，状态集合含 pov/chase/land。
- V7-PERF-02：隐藏/恢复不悬挂（cabin paused=1、pending 最终 false、恢复后可再次进入镜头状态）。
- V7-PERF-02B（P1）：隐藏期间 Cinema 显式暂停（当前无显式 pause，隐藏后下一阶段仍启动 rAF → P1 缺陷）。
- V7-PERF-03：reduced 设置下无 transform 帧、无 pov/chase、CellStage data-reduced=1。

## 6. 视觉（visual.py）

- 基线重建：`boot` / `table` / `prompt`（CellStage cloud）/ `ledger` / `v7-boot-star` / `v7-table-star` / `v7-cell-star` / `v7-boot-paper` / `v7-table-paper` / `v7-cell-paper`。
- 截图前测试侧冻结：CabinScene.setReduced(true) + CSS animation/transition 暂停；不改产品行为。
- 对比容差 1.5% 像素（单通道差>24 计为变化）。

## 7. 回归（V6.1/V6.2）

- V6.1 全组在 `dist/rebuild-v7` 上复跑：main / skip / takeoff / win / notend / legacy / resume / pause / minigame / fate / events / responsive / offline / reduced。
- 引擎：`node qa/rebuild/flight-engine.test.mjs` 0 failed。
- 构建：`build_app.py --out dist/rebuild-v7 --strict --check` 退出 0（27 项检查）。
- V6.2 相机断言迁移：旧 `data-cabin-cam` + transform 用例改为 `data-cinema-state` 镜头链（`run_cabin_camera_case_v62_legacy` 仅留档，不再执行）。

## 8. 偏差 / 观察（QA 记录）

| 级别 | 项 | 现状 | 处理 |
|---|---|---|---|
| P1 | 系统 `prefers-reduced-motion` 未接入 Cinema/table（V6.2 §3.9 继承） | director 已修：table.reduced() 并入系统偏好并 runtime 同步 Board/Cabin/Cinema/CellStage | 复跑 V7-REDUCED-SYS 为 PASS（见 e2e） |
| P1 | 页面隐藏时 Cinema 未显式暂停（隐藏期链继续 rAF） | director 已修：visibilitychange 冻结 pose/取消 rAF/保留 pending；host `data-cinema-paused=1` | perf V7-PERF-02B 按 raf/transform/chain 验收 |
| P2（偏差） | 小游戏格未走 CellStage「开始小游戏」网关（freeze §3 变体） | 产品仍 `awaiting=minigame` 直接开旧 MiniGame 覆盖层；完成后回主桌 | 记录为 P2 偏差，主流程可玩（V6 D1/D2/D3 全过）；未纳入 P0 断言 |
| P2（观察） | 非题卡落点（起飞/停/跳/飞等）后影院状态停在 `land`，棋盘保持放大偏移到下一次掷骰 | `data-cinema-state=land` 持久；下一回合 roll 前不主动回 overview | 记录观感观察；未明确违反冻结单（§1 的 return 只描述收卡后） |
| P2（观察） | CellStage 内容卡未显示「第 N 格」序号 | 引擎 prompt 未携带 squareIndex/cellIndex，`prompt-source` 仅「来自 X 格」 | 记录观察；冻结单只要求类型/星级/来源/归属 |

> 注：P1/P2 均不阻塞 P0 发布门；最终结论以 `reports/v6/qa-report.md` 为准。

