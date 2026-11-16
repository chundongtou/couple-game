# 今晚飞行棋 V6.0.0 · 发布说明

- 版本：**6.0.0**（`app/src/app.js` → `App.version`）
- 日期：2026-11-16
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：仓库根产物 + GitHub Pages `main` 自动部署（本文档不改变发布方式）
- 需求 / 设计 / 验收：`docs/v6/spec.md`、`app/DESIGN.md`、`docs/v6/impl-freeze.md`；性能 / E2E / 视觉数据由 QA 执行，报告在 `reports/v6/`

---

## 0. 一句话

V6 把「今晚飞行棋」从能玩的原型改成**暗光下好看、反馈清楚、20 分钟内能收尾的双人升温棋**：视觉换成 **A · 午夜星轨 · 暖光纸感**，three.js 3D 棋盘换成 **SVG 2.5D 棋盘**（首屏不再加载 511 KB 的 `board.js`），并补齐心动值、连击、命运格、合作收尾、暂停/安全词、今晚回顾与分享图。**无输赢，合作收尾；V5 存档不丢。**

---

## 1. 主要变更

### 1.1 视觉：A · 午夜星轨 · 暖光纸感

- 深夜星空 + 琥珀/玫瑰暖光；玻璃面板与暖纸题卡的对比；宋体标题 + 黑体正文（系统字体栈，不引外链字体）。
- 设计令牌统一在 `app/src/styles/base.css` 的 `:root`（颜色 / 圆角 / 缓动 / 字体），所有屏幕只读变量。
- 门厅 360×640 首屏可见主按钮「摆上棋盘」；360 / 390 / 430 三档视口无横向滚动（QA 覆盖 320/360/390/430）。

### 1.2 棋盘：SVG 2.5D 替换 three.js

- 新棋盘由 `app/src/view/board.js`（`App.BoardView`）用 SVG 绘制：52 格主环 + 4 色 × 4 机坪 + 4 色 × 5 航线 + 4 终点 = **92 个格位**；中心是心动温度环与连击。
- 首屏与主桌**都不加载** `assets/board.js`（V5 的 511 KB three.js 产物）；3D 资源保留为回滚参考（见 §5）。
- 骰子点数有文字、无子可走有原因、可走子有文字按钮、落点有格名；动画时长上限：骰子 1.6s、整次走子 2.0s、题卡 0.4s，减少动画时关键反馈 ≤100ms。

### 1.3 玩法：心动值 / 连击 / 命运格 / 合作收尾

- **心动值**：双方共享 0–100，只增不降。题卡「做了」+8、「放过」+3；小游戏完成 +5、跳过 +0；收尾卡 +10 / +3；命运卡选「做了」+8、不选 +3；棋盘动作本身 +0（击落 / 叠机 / 进航抽到的卡按题卡结算）。五阶段：灯刚亮 / 有点热 / 靠近了 / 很近了 / 今晚可以更近。
- **连击**：「做了」+1，放过不清零；每 3 次记一个里程碑事件（V6 界面只显示连击数，双人选卡奖励留待后续）。
- **命运格**：第 5、29 格，两张不同池的卡二选一；另一张放回；不选不惩罚，不计入目标张数。
- **合作收尾**：快局 2 架 / 目标 4 张或 40；长夜 4 架 / 目标 8 张或 80，长夜多一个「任意一架进终点」条件。任一满足进入「今晚最后一段」：两张收尾卡一人一张，都可放过；结束**不判输赢**（`winnerId` 保留但不展示，ledger `ending` 为 `shared` / `safe`）。
- **放过不惩罚**（P0 红线）：心动值不减少、不阻断进终点、不丢叠机奖励步、连击不清零、回顾不写失败、放过也计入目标张数（修掉 V5「全放过永远结束不了」的问题）。

### 1.4 暂停 / 安全词

- 所有屏幕常驻右上角「先收棋」胶囊：按住 **1.6 秒**（环形进度）打开暂停层，不归档、不卸载当前屏。
- 暂停层四个动作：继续 / 今晚就到这 / 看今晚记录 / 加一条今晚不做的；只有「今晚就到这」确认后才归档进回顾（`ending:"safe"`）。
- 修掉 V5「安全词只在主桌、会遮挡离开按钮」的问题：主桌的暂停按钮与安全词区域不再重叠（QA 点击命中验证）。

### 1.5 今晚回顾 / 分享图

- 回顾页固定 6 类信息：今晚（日期/姓名/尺度）、时长、题卡（共 N / 做了 D / 放过 S）、心动值（含阶段名）、最高连击、小游戏；下方「今晚的每一张」可展开原文。
- 小游戏明细写「温度计 · 完成」「转盘 · 跳过」，不再出现 V5 的占位「（这一笔没有句子）」。
- 「存成图片」：本机 Canvas 生成 1080×1350 PNG（暗夜星轨 + 暖光纸感），**不请求网络、不上传、不生成外链**；默认不画题卡原文（显式 `includeText` 才画，最多 4 条）。
- 「以前的夜」最多保留 60 局；回顾无「输赢」。

### 1.6 工程与构建管线

- 题库外链：`assets/cards.<内容哈希>.js`（head `preload` + body `defer`），不再阻塞首屏；`index.html` 内联 CSS + 全部应用 JS。
- `sw.template.js` → `sw.js`：`CACHE = couple-flight-v6-<index.html sha256 前 8 位>`，`PRECACHE` 与磁盘一致、不含 `board.js`；导航 network-first、静态 cache-first；断网冷启动已验。
- minify 默认开：esbuild **0.25.12**，`target=es2018`、`charset=utf8`；`--no-minify` 可关。
- 发布门 `build_app.py --check`：**27 项**（模板/包标记、head 无阻塞脚本、资源存在、哈希一致、产物不含 board.js、sw 缓存与预缓存、manifest、ADR-012 三项预算）。
- 预算按 **ADR-012**：`index.html` ≤520 KB raw / ≤140 KB gzip；首屏总 gzip（index+cards+manifest）≤180 KB。

---

## 2. 性能（QA 实测，gzip 静态服务 + slow4G + 4×CPU）

数据来源：`reports/v6/qa-perf.md`（QA 生成于 2026-11-16 17:53，构建 `index.html` sha256 前 8 位 `a0bb61f1`）。V5 基线来自 `docs/v6/architecture.md` §1（本机同档实测）。
> 这些数字是本文编写时的快照；FE 后续若再改 UI，构建哈希与体积会轻微变化，发版前以最后一次 `build_app.py --check` 与 QA 报告为准。

| 指标 | V6 | V5 基线 | 说明 |
|---|---|---|---|
| 门厅 DCL（slow4G + 4×CPU） | **1384.2 ms**（3 次中位） | **4630 ms** | 不再加载 `board.js` + 题库移出关键路径 |
| 门厅 FCP（同档） | **384 ms** | 508 ms | 首屏骨架先把画面撑住 |
| `index.html` raw | 293.3 KB | 173.4 KB | SVG 棋盘内联，单文档变大 |
| `index.html` gzip | 92.7 KB | 47.1 KB | 同上 |
| 首屏总 gzip（index + cards + manifest） | **125.7 KB** | **209.4 KB**（index 47.1 + board 126.3 + cards 32.9 + sw 2.6 + manifest 0.4） | 减少约 40%；V5 的 126.3 KB `board.js` 是主因 |
| 主桌可掷骰（从点「开始」起） | 579 ms | 未测（V5 无此预算） | PB-6 |
| 主桌 JS heap | 5.77 MB | 11.02 MB（含 3D 棋盘） | three.js 常驻约 8.9 MB 被移除 |
| 首屏必需网络请求数 | 1 | 4（doc + board + cards + manifest） | PB-13 |
| 断网冷启动门厅 | 84 ms 且可开局 | 未测 | PB-12，SW 命中 |

- 口径说明：DCL 同档多轮实测在约 1.26–1.47s 之间浮动（本报告取最新一轮 3 次中位 1384ms）；V5 首屏总 gzip 的 AR §1.1 口径为 209.4KB，任务口径约 223KB（含 `board.js` 126KB），两种口径下 V6 的 125.7KB 都更低。
- 预算明细：PB-1/PB-2/PB-3/PB-4/PB-5/PB-6/PB-7/PB-12/PB-13 与两条裸文件参考全部 PASS（12/12）。
- 读法：单看 `index.html` 比 V5 大（92.7KB vs 47.1KB），因为 SVG 棋盘内联进去了；但 V5 还要再阻塞下载 `board.js`（126.3KB gzip）与 `cards.js`（32.9KB gzip），所以**首屏总 gzip 是 125.7KB vs 209.4KB**，DCL 也从 4630ms 降到 1384ms。
- 复现：`python tools/rebuild/build_app.py --out dist/rebuild --check`（体积）+ `python qa/v6/perf_budget.py --dist dist/rebuild`（时间，需 Playwright + Edge）。

---

## 3. 兼容性

### 3.1 V5 存档（不丢档）

- 进行中的 V5 飞行棋（`couple2.session`，`kind:"flight"`，`v:1`）**原样续玩**：`Flight.validate()` 只补可选默认字段（`mode / targetCards / targetHeat / cardsProcessed / meta / endingQueue`），**永不新增必填项**；`v` 升为 `2`。
- 首次读到 session 时把原始 JSON **原样备份**到 `couple2.backup.session`（只写一次，不覆盖；quota 失败静默跳过）。
- V5 停在「赢家收尾」的单卡局面：保留已发的那张，按单卡收束。
- 公寓局（`kind:"apartment"`）和更早的升温夜航：收进「以前的夜」（`couple2.history`，标题「今晚在这间公寓」/「以前的夜航」），不按 V6 规则续玩。
- 设置里的公寓遗留 `maxStar / gentleOnly` 会清掉并给 `suggestScale` 建议。

### 3.2 导出 / 导入

- 导出：`{ app:"couple-flight", v:6, exportedAt, settings, session, history, standalone, pending }`。
- 导入兼容 `couple-flight / couple-apartment / couple-voyage`；对 `flight` session 先 `validate()`，不通过整体拒绝且不覆盖现状；history 最多保留 60 条。
- 所有数据只在 `localStorage`（`couple2.*`），没有账号 / 云同步 / 上传；换手机请用导出/导入。

### 3.3 行为变化（与 V5 不同，需要知道）

1. **公寓玩法下线**：公寓的门厅 / 房间 / 关灯 / 游戏门那套屏幕不再是线上玩法；旧档进「以前的夜」。
2. **3D 主桌不再加载**：V6 主桌始终 SVG；`assets/board.js` 与 `app/render/` 保留为回滚资源，`settings.boardView:"3d"` 只是预留字段，当前不生效。
3. **结束不判输赢**：`winnerId` 不再展示；收尾统一为「今晚最后一段 + 今晚回顾」。
4. **放过语义修正**：放过不再阻断进军、不丢叠机奖励步、也计入目标张数（V5 的旧行为已修）。
5. **命运格位置**：规格候选 7/31，因 7 与绿方飞点冲突，落地为 5/29。
6. **安全词**：从「只在主桌」改为全屏常驻；长按 1.6 秒进暂停（不归档）。

---

## 4. 验收结果引用

> 以下 E2E / 性能 / 视觉均为 **QA 执行**，本文件只引用报告；数字以报告文件为准。

| 项 | 报告 | 最终状态（2026-11-16 18:40） |
|---|---|---|
| E2E（Playwright + Edge，全部分组 + 320/360/390/430） | `reports/v6/qa-e2e.md` / `qa-e2e.json` | **PASS 526 / FAIL 0 / SKIP 0** |
| 首屏性能预算 | `reports/v6/qa-perf.md` / `qa-perf.json` | **PASS 12 / 12**（gzip 口径 DCL 1229–1343ms、FCP 344–416ms、首屏总 gzip 125.8KB、断网冷启动 71–84ms） |
| 视觉回归 + 结构断言 | `reports/v6/qa-visual.md` / `qa-visual.json` | **PASS 49 / 0**（boot / table / prompt / ledger 基线；无 JS 错误） |
| 汇总 | `reports/v6/qa-report.md`（`qa/v6/run_all.py` 生成） | **PASS 589 / FAIL 0 / SKIP 0**；P0 执行 473/473（100%）、缺陷 0；**可发布：是** |

DOC 侧自查（命令与输出）：

- `python tools/rebuild/build_app.py --out dist/doc-verify --check` → **27 passed / 0 failed → GREEN**，index 293.3 KB raw / 92.7 KB gzip，首屏总 gzip 125.7 KB。
- `node qa/rebuild/flight-engine.test.mjs` → **700 passed / 0 failed**。
- 说明：完整 E2E / 性能 / 视觉需 QA 环境（Playwright + Edge）；DOC 未重复执行，引用上面 QA 报告。

**发布判断**：最终 QA 汇总 **PASS 589 / FAIL 0 / SKIP 0**，P0 用例 473/473、缺陷 0，**可发布：是**（发布门 = P0 全绿 + 构建 `--check` + 引擎 0 failed）。此前 Q-01（收尾文本 962ms）、Q-02~04（回顾时长「不到 1 分钟」）已分别修复并由最终全量复跑验证（收尾文本 0–57ms、时长「27 秒」）。

---

## 5. 回滚

- 最快：GitHub 上 revert 合并后的 commit（或 `git revert <commit>` 推 `main`），Pages 自动回到上一版。
- **整套回滚**：`git checkout <old-commit> -- index.html manifest.webmanifest sw.js assets/ icons/`（`index.html` / `assets` / `sw.js` 必须来自同一次构建，否则缓存与引用会对不上）。
- V6 的 SW 缓存名带 `index.html` 内容哈希，正常发版**不需要手工 bump 缓存版本**；回滚到 V5 时把 V5 的 `sw.js`、`assets/board.js`、`assets/cards.js` 一并恢复。
- 详细步骤与 3D 回滚资源说明见 `docs/REBUILD.md` §6。

---

## 6. 已知限制与已知问题

### 6.1 产品限制

- 只做竖屏，目标宽度 320–430；横屏 / 平板不做两栏布局。
- 两个人共用一部手机、轮流操作；没有联机 / 账号 / 云同步 / 第三人。
- 高尺度内容面向成年伴侣，需双方共同同意；任何一方随时可以停。不是未成年人内容。
- PWA 安装需要 `https` 或 `localhost`；iOS 只支持 Safari「添加到主屏幕」；局域网 `http://IP` 只能玩、不能安装。

### 6.2 已知问题（截至本文编写）

- **暂停时长计入回顾（P1，RV R-01）**：主桌暂停的秒数未从 `durationMs` 扣除，回顾时长会比实际活跃时长略长；不影响题卡/心动值/收尾。
- **暂停态刷新不复原暂停页（P1，RV R-02）**：暂停中刷新会回到主桌并恢复对局；状态不丢，但没有停在暂停层。
- **回顾页未显示目标张数（P2，RV R-03）**、**收尾/回顾未逐字写「记录会留着」（P2，RV R-04）**：均不影响主路径与数据。
- **连击里程碑奖励未上线**：引擎已发 `milestone` 事件，但「双人选卡」是 P1，V6 只显示连击数。
- **`boardView:"3d"` 预留字段不生效**：V6 主桌只用 SVG；若要 3D 主桌需回滚到 V5 或单独立项接回 loader。
- **仓库根 `--release --check` 会因回滚资源 `assets/board.js` 变红**：发布门请对干净输出目录跑 `--check`（见 `docs/REBUILD.md` §5.4）。

---

## 7. 后续（不在 V6 范围）

- P1：连击里程碑「双人选卡」奖励；暂停时长的统一扣除；暂停态刷新恢复；3D 回滚开关（若还要）。
- P2：回顾目标张数、收尾「记录会留着」逐字文案、回顾卡片图样式、长夜「谁先到家」彩蛋、横屏/平板、棋盘皮肤、成就系统、多语言（见 `docs/v6/spec.md` §5.9）。

---

## 8. 变更记录

| 版本 | 日期 | 摘要 |
|---|---|---|
| 6.0.0 | 2026-11-16 | 视觉 A；SVG 2.5D 棋盘替代 three.js；心动值 / 连击 / 命运格 / 合作收尾；暂停 / 安全词全屏；今晚回顾 + 分享图；题库外链哈希 + SW 模板 + minify + `--check` 发布门；V5 存档迁移与备份。 |
