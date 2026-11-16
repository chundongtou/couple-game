# 今晚飞行棋 V6 · 交付报告

- 交付日期：2026-11-16
- 提交：`0ec5a4b`（已推送到 `main`，2026-11-16 19:19；GitHub Actions run 133 部署成功）
- 线上地址：https://chundongtou.github.io/couple-game/ （已发布 V6）
- 本地预览（可选）：`http://127.0.0.1:8900/`（命令：`cd couple-game && <DSH python> -m http.server 8900 --bind 127.0.0.1`）

## 1. 一句话

把 V5「能玩的原型」改成暗光下好看、反馈清楚、20 分钟内能收尾的双人升温棋：视觉 A「午夜星轨·暖光纸感」、SVG 2.5D 棋盘替换 three.js、心动值/连击/命运格/合作收尾/今晚回顾全部落地，首屏不再加载 511KB 的 `assets/board.js`。

## 2. 交付物

| 类别 | 路径 |
|---|---|
| 源码 | `app/src/**`（28 个模块）、`app/index.template.html`、`app/dev/board-demo.html` |
| 引擎 | `app/src/engine/{flight-engine,flight-board,flight-draw,flight-meta,flight-rules}.js` |
| 视图 | `app/src/view/board.js`（SVG 2.5D + 演出） |
| UI | `app/src/ui/{screens,overlay,share.js}`、`app/src/styles/base.css` |
| 构建 | `tools/rebuild/build_app.py`、`sw.template.js`、`manifest.webmanifest` |
| 发布产物 | 根 `index.html`（300,817 B）、`assets/cards.6e682ef2.js`、`sw.js`（CACHE `couple-flight-v6-d4a5a966`）、`manifest.webmanifest`、`icons/` |
| 规格/设计 | `docs/v6/{spec,audit,architecture,api-contract,impl-freeze,copy,review,release-notes}.md`、`docs/v6/mocks/` |
| 测试 | `qa/rebuild/flight-engine.test.mjs`、`qa/v6/{e2e_v6,perf_budget,visual,run_all,qa_lib}.py` |
| 文档 | `README.md`、`docs/REBUILD.md`、`app/DESIGN.md` |

## 3. 验收结果（全部实测）

| 门 | 结果 | 证据 |
|---|---|---|
| 构建 | `--check` **27/27 GREEN** | index 92.8KB gzip / 293.8KB raw；首屏总 gzip 125.8KB；SW 哈希与 index 一致；产物无 board.js |
| 引擎 | **700 passed / 0 failed** | `node qa/rebuild/flight-engine.test.mjs` |
| QA 全量 | **PASS 589 / FAIL 0 / SKIP 0**；P0 473/473；缺陷 0 | `reports/v6/qa-report.md`（`run_all.py --final`，UTF-8 环境） |
| E2E | **PASS 526 / 0 / 0**（主路径/暂停/安全词/小游戏/回顾/事件题/命运/响应式/离线/reduced） | `reports/v6/qa-e2e.md` |
| 性能 | **PASS 12/12**：gzip 口径 DCL 1229–1343ms（V5 同档 4630ms）、FCP 344–416ms、主桌可掷骰 468–518ms、heap 5.75MB、断网 71–84ms | `reports/v6/qa-perf.md` |
| 视觉 | **PASS 49/0**（boot/table/prompt/ledger 基线 + 结构断言） | `reports/v6/qa-visual.md` |
| 代码审查 | **APPROVE**，产品 P0=0 | `docs/v6/review.md`（R-01…R-06 为 P1/P2） |
| 发布产物冒烟 | 0 pageerror / 0 console error；无 board.js 请求；92 格/4 子；规则/暂停/掷骰可用 | 本地 8900 端口（脚本 `shots/release_smoke.py`） |

## 4. 关键行为变化（用户能感知）

1. **掷骰结果有文字**（「掷出 6 · 再掷一次」），无子可走会说明并自动换人。
2. **题卡带归属人名**（「大冒险 · 这张给 阿岚」），有星级/来源/先看棋盘。
3. **放过 = 不惩罚**：不扣心动值、进航仍进军、叠机仍得奖励步、连击不清零、全放过也能在目标内收尾。
4. **合作收尾**：快局 4 张 / 长夜 8 张题卡，或心动值到 40/80，或长夜一方进终点；两张收尾卡各给一人；无输赢。
5. **安全词全屏常驻**：长按 1.6s 暂停（不归档）；「今晚就到这」才收进以前的夜。
6. **今晚回顾**：日期/时长/题卡做与放过/心动值与最高连击/小游戏/每条明细 + 心动曲线 + 分享图。
7. **V5 存档不丢**：`couple2.*` 迁移到 `state.v=2`，首次读入备份到 `couple2.backup.session`。

## 5. 已知限制 / 遗留（不阻塞发布）

- **P1**：暂停秒数计入回顾时长（R-01）；暂停中刷新回主桌而非暂停页（R-02）。
- **P2**：回顾未显示目标张数（R-03）；收尾/回顾未逐字写「记录会留着」（R-04）；旧公寓测试 `qa/rebuild/engine.test.mjs` 5 条失败属历史债（R-05，不影响发布门）。
- **P1 未做**：连击里程碑「双人选卡」、3D 回滚开关（`boardView:"3d"` 预留字段）。
- **真机未验**：iOS Safari 字体回退/安全区/长按、低端安卓玻璃性能；本地 Edge + Playwright 已验。

## 5.5 发布前 Pages 子路径模拟（2026-11-16 19:15）

为确认部署到 `https://chundongtou.github.io/couple-game/`（子路径，不是域名根）后不会出现绝对路径 404，本地把发布产物放进 `dist/site/couple-game/`，用 `http://127.0.0.1:8902/couple-game/` 模拟 Pages：

- 门厅/主桌/题库/清单全部 200，**0 个 4xx/5xx，0 pageerror/console error**；
- `manifest` 解析到 `/couple-game/manifest.webmanifest`，`start_url/scope="./"` 正确；
- SW 注册 scope = `http://127.0.0.1:8902/couple-game/`，controller 已接管；断网刷新仍可开门厅、题库在、可开局；
- 主桌 `[data-square]=92`，棋盘/棋子/暂停/掷骰正常；
- 截图：`shots/pages-sim/{boot,table,offline}.png`。

结论：V6 产物可直接由 GitHub Pages 子路径发布，无需改任何路径。

## 6. 发布（已完成）

- 推送：`git push origin main` → `382ebf4..0ec5a4b  main -> main`（本机直连 GitHub 443 不通，经本机代理 `127.0.0.1:26800` 完成）
- GitHub Actions：run 133「Deploy to GitHub Pages」`completed / success`
- 线上地址：https://chundongtou.github.io/couple-game/
- 线上冒烟（2026-11-16 19:22，Playwright + Edge，430×932）：
  - `title = 今晚飞行棋 V6`、`App.version = 6.0.0`、`CARDS` 6 池加载
  - 门厅 → 主桌：`[data-square]=92`、`.bv-piece[data-piece]=4`、规则按钮存在、状态条「第 0/4 张」
  - 暂停层 `data-screen=pause` 可开/继续；`__V6_TEST__.forceDie(6)` → 「掷出 6 · 再掷一次」
  - SW：scope `https://chundongtou.github.io/couple-game/`、active、controller 接管；`caches.keys()` = `couple-flight-v6-d4a5a966`
  - **无 board.js 请求**、0 个 4xx/5xx、0 pageerror、0 console error
  - 截图：`shots/live-v6/{boot,table,pause}.png`

## 7. 回滚

- 最快：GitHub 上 revert 本次 commit（`0ec5a4b`），Pages 自动回到 V5。
- 整套回滚：`git checkout <old-commit> -- index.html manifest.webmanifest sw.js assets/ icons/`（index/assets/sw 必须同一构建）。
- 旧 3D 资源 `assets/board.js`、`assets/cards.js` 与 `app/render/` 仍在仓库，作为回滚参考；V6 首屏与主桌都不加载它们。
