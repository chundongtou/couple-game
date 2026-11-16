# 今晚飞行棋 V6 —— 构建、发布与维护

> 本文只讲「怎么构建 / 怎么发 / 怎么改 / 出了问题怎么看」。规则与数值以 `app/DESIGN.md` 为准，需求与验收以 `docs/v6/spec.md` 为准，UI 文案以 `docs/v6/copy.md` 为准。
>
> **旧「今晚在这间公寓」玩法已下线**：V6 用飞行棋 + 题卡 + 合作收尾替代了公寓的房间玩法；公寓时代的源码还留在 `app/src` 里但**不在构建清单**，只作为对照/回滚参考。旧文档内容可以在 git 历史里查到，仓库里以本文为准。

---

## 1. 一页速查

| 想做什么 | 命令（在仓库根 `couple-game/` 执行） |
|---|---|
| 开发构建到 `dist/rebuild/` | `python tools/rebuild/build_app.py --out dist/rebuild` |
| 构建 + 发布门（27 项） | `python tools/rebuild/build_app.py --out dist/rebuild --check` |
| 本地预览（禁缓存） | `python tools/rebuild/dev_app.py --port 8877 --no-build`（先构建到 `dist/rebuild`） |
| 只服务已构建目录 | `python -m http.server 8899 --directory dist/rebuild` |
| 生产构建（写仓库根） | `python tools/rebuild/build_app.py --release` |
| 引擎测试（无浏览器） | `node qa/rebuild/flight-engine.test.mjs` |
| QA 一键（构建+引擎+E2E+性能+视觉） | `python qa/v6/run_all.py --dist dist/rebuild --final` |

- DSH 工作台的 Python：`C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe`（本机 Python 3.12.14、Node 26.13.1、esbuild 0.25.12 实测）。
- 报告与截图：`reports/v6/`、`qa/v6/shots/`（都在 `.gitignore`，不提交）。
- 线上：<https://chundongtou.github.io/couple-game/>（push `main` 自动部署）。

---

## 2. 目录结构（V6 实际）

```
couple-game/                          ← 仓库根 = GitHub Pages 站点根
├─ index.html                        ← 发布产物（--release 生成；不要手改）
├─ assets/
│  ├─ cards.<hash>.js                ← 发布产物：题库外链（带内容哈希）
│  ├─ cards.js  /  board.js          ← V5 遗留回滚资源（V6 首屏不引用；board.js 511KB）
├─ sw.js                             ← 由 sw.template.js 生成（不要手改）
├─ sw.template.js                    ← SW 模板（占位符 __CACHE_NAME__ / __BUILD_HASH__ / __PRECACHE__）
├─ manifest.webmanifest              ← PWA 清单（手工维护）
├─ icons/                            ← PWA 图标 5 张（192/512/maskable/apple-touch/og-image）
├─ app/                              ← 源码（唯一开发入口）
│  ├─ DESIGN.md                      ← 规则与数值（唯一事实来源）
│  ├─ index.template.html            ← HTML 模板：<!--APP_CSS--> <!--APP_JS--> <!--APP_PRELOAD--> <!--APP_SPLIT--> <!--APP_CARDS-->
│  ├─ data/                          ← 题库原始数据（raw.json 等）
│  ├─ dev/board-demo.html            ← 棋盘自测页（不进产物）
│  ├─ render/                        ← V5 three.js 棋盘源码（回滚参考，不在 V6 构建清单）
│  └─ src/
│     ├─ app.js                      ← 启动装配（App.version="6.0.0" / 首次手势解锁音频 / PWA / Safe）
│     ├─ core/{util,bus,store,audio,motion,safe,ui}.js
│     ├─ engine/{flight-rules,flight-board,flight-meta,flight-draw,archive,minigames,flight-engine}.js
│     ├─ view/board.js               ← SVG 2.5D 棋盘 + 骰子/走子/击落/叠机演出
│     ├─ ui/router.js  ui/pwa.js  ui/share.js
│     ├─ ui/overlay/{prompt-card,minigame}.js
│     ├─ ui/screens/{boot,table,pause,ledger,nights,settings,minigame}.js
│     ├─ styles/base.css             ← 设计令牌 + 基础组件
│     └─ data/cards.js               ← 题库产物（make_cards.py 生成，不要手改）
├─ tools/rebuild/
│  ├─ build_app.py                   ← 内联构建 / --release / --check / minify
│  ├─ dev_app.py                     ← 构建 + 禁缓存本地服务
│  ├─ make_cards.py                  ← raw.json → app/src/data/cards.js
│  └─ extract_data.py / enrich_scores.py / inspect_data.py / gen_icons.py
├─ qa/
│  ├─ rebuild/flight-engine.test.mjs ← 引擎测试（700 用例）
│  └─ v6/{run_all,e2e_v6,perf_budget,visual,qa_lib}.py + 探测脚本
├─ docs/v6/                          ← spec / architecture / audit / copy / api-contract / impl-freeze / release-notes
├─ reports/v6/                       ← QA 报告与截图（gitignore）
└─ .github/workflows/pages.yml       ← push main → 部署 Pages
```

**公寓时代遗留（不在构建清单，不要引用、不要改）**：`app/src/engine/engine.js`、`app/src/engine/balance.js`、`app/src/content/content.js`、`app/src/ui/night.js`、`app/src/ui/screens/{close,door,foyer,kit,plan,room}.js`。它们只是历史源码；构建只读 `build_app.py` 的 `JS_MODULES`（当前 28 个 JS 模块）。

---

## 3. 构建是怎么工作的

`python tools/rebuild/build_app.py` 做的事，按顺序：

1. **读源码**：按 `JS_MODULES` / `DATA_MODULES` / `CSS_FILES` 的顺序读 `app/src/**`；缺文件时 `[WARN] 跳过未完成的模块`（并行开发期），`--strict` 时缺模块直接失败。
2. **语法体检**：每个 JS / 题库文件跑 `node --check`（找不到 node 就跳过，不阻断构建）。
3. **minify（默认开）**：用 `app/render/node_modules` 里的 **esbuild 0.25.12** 对「拼接后的最终结果」压缩——JS `target=es2018`、CSS `loader=css`、`charset=utf8`（保证中文不被转成 `\uXXXX`）。`--no-minify` 关闭；esbuild 缺失/失败时告警并降级为未压缩，不会让构建挂掉。
4. **内联 / 外链**：
   - 应用 JS 默认内联进 `index.html`；`--external-js` 可拆成 `assets/app.<hash>.js`（defer）。`--release` 是否默认 external 由 `RELEASE_EXTERNAL_JS_DEFAULT` 控制（当前 `False`）。
   - 题库一律外链 `assets/cards.<内容哈希>.js`，head 里 `preload`，body 底部 `defer`。
   - `--split-screens` 可把 `ledger/nights/settings/minigame` 四个屏拆成 `assets/screens.<hash>.js`（首屏 gzip 顶到预算时的备用杠杆）。
5. **写产物**：`index.html`、`assets/cards.<hash>.js`、`sw.js`（由 `sw.template.js` 生成：`CACHE = couple-flight-v6-<index.html sha256 前 8 位>`，`PRECACHE` 与磁盘一致、**不含 board.js**）、`manifest.webmanifest`、`icons/`。
   - 陈旧产物清理：上一次的 `cards.<hash>.js` / `screens.<hash>.js` / `app.<hash>.js`（只要哈希不在本次 keep 集合里）在**任何输出目录**都会被删掉；非仓库根目录在非 `--board=3d` 时还会删 `assets/board.js`。**仓库根额外保留 V5 的 `assets/cards.js` 与 `assets/board.js`**（回滚资源，清理逻辑对这两个名字在仓库根故意不删）。
6. **体积口径**：一律对**落盘文件**统计 raw / gzip，并按 ADR-012 预算判定：

| 预算项 | 上限 | 覆盖参数 |
|---|---|---|
| `index.html` raw | 520 KB | `--budget-raw` |
| `index.html` gzip | 140 KB | `--budget` |
| 首屏总 gzip（index + cards + manifest） | 180 KB | `--budget-total` |

> 预算编号沿用 `docs/v6/architecture.md` §4，但数值以 **ADR-012** 为准（旧的 220KB/58KB 已由 Lead 裁决取代）。

常用参数：

```bash
--out <dir>        # 输出目录（默认 dist/rebuild；--release 默认仓库根）
--release          # 写仓库根（部署用）
--check            # 构建后跑发布门，失败退出 1
--strict           # 缺模块视为错误（最终集成用；与 --check 一起用）
--board=svg|none|3d# 默认 svg/none 都不复制 assets/board.js；3d 才把 511KB 棋盘一起拷进产物
--no-minify        # 调试：不压缩
--external-js / --inline-js  # 整包 JS 外链 / 强制内联
--split-screens    # 拆四个非首屏屏到 assets/screens.<hash>.js
--budget / --budget-raw / --budget-total  # 临时覆盖预算（会打印覆盖提示）
```

### `--check` 检查什么（27 项）

- 模板占位符全部替换；`v6-bundle` 标记在、`window.App` 已定义；inline/external 模式自洽。
- `<head>` 里没有阻塞 `<script src>`；`<body>` 的外链脚本都带 `defer/async`；没有外链 stylesheet；题库有 `preload`。
- `index.html` 引用的本地资源都存在；`assets/*.<hash>.js` 的文件名哈希 == 内容哈希。
- 默认产物**不含、不引用** `board.js`（`--board=3d` 时反过来要求它在）。
- `sw.js` 存在，`CACHE == couple-flight-v6-<index 哈希>`，`BUILD == index 哈希`；`PRECACHE` 可解析、条目都在磁盘上、与产物清单一致、不含 `board.js`、含题库。
- `manifest.webmanifest` 合法、`start_url/scope == "./"`、图标文件都存在。
- 首屏 raw / gzip / 首屏总 gzip 三项预算。

本机实测（2026-11-16，`--out dist/doc-verify --check`）：**27 passed / 0 failed → GREEN**，index 293.3 KB raw / 92.7 KB gzip，首屏总 gzip 125.7 KB。`--external-js` 模式下会多一项 external 专项检查（28 项，也是 GREEN）。

---

## 4. 本地预览

```bash
# 构建 + 禁缓存服务（推荐；--no-build 表示直接服务已构建目录）
python tools/rebuild/build_app.py --out dist/rebuild
python tools/rebuild/dev_app.py --port 8877 --no-build

# 或者分两步
python tools/rebuild/build_app.py --out dist/rebuild
python -m http.server 8899 --directory dist/rebuild
```

- `dev_app.py` 不带 `--no-build` 时会先构建；此外它还会检查 V5 3D 棋盘源码是否比 `assets/board.js` 新，必要时执行 `npm run build`（需要 `app/render/node_modules`）。V6 日常预览用 `--no-build` 或 `http.server` 更稳。

浏览器开 <http://127.0.0.1:8877/> 或 <http://127.0.0.1:8899/>。

- **不要用 `file://` 双击打开**：Service Worker 不注册，离线与安装都不可用；题库外链在部分浏览器下也会受限。
- 端口被占用就换一个（DSH 工作台里 QA 可能占用 8899；`dev_app.py` 默认 8877）。
- 手机真机调试：`--bind 0.0.0.0` + 电脑局域网 IP；但这样只能玩，安装 PWA 需要 `localhost` 或 `https`。
- 构建产物是单文件 `index.html` + `assets/cards.<hash>.js` + `sw.js` + `manifest` + `icons/`；`dist/` 与 `reports/` 都在 `.gitignore`。

---

## 5. 发布（GitHub Pages）

### 5.1 生成根目录产物

```bash
python tools/rebuild/build_app.py --release
```

写仓库根：`index.html`、`assets/cards.<hash>.js`、`sw.js`、`manifest.webmanifest`、`icons/`。

> **三件套必须来自同一次构建**：`index.html` 引用的 `assets/cards.<hash>.js`、`sw.js` 里的 `CACHE/BUILD/PRECACHE` 是同一套哈希。只替换其中一个（尤其是只改 `index.html` 或只改 `sw.js`）会得到引用不存在文件 / 旧缓存锁死的线上版本。
> **不要手改** `index.html`、`sw.js`、`assets/cards*.js`、`app/src/data/cards.js`：它们都是产物。

### 5.2 发布前检查清单

- [ ] 根目录 `index.html` 是刚由 `--release` 生成的（文件内有 `v6-bundle:<hash> modules:28 min:1` 标记；`git diff` 只包含本次改动）。
- [ ] `git status` 里 `index.html` / `assets/` / `sw.js` / `manifest.webmanifest` 是同一批改动；没有半成品 `dist/` 或私密文件被 `git add`。
- [ ] `python tools/rebuild/build_app.py --out dist/rebuild --check` → `GREEN`（27 项）。
- [ ] `node qa/rebuild/flight-engine.test.mjs` → `700 passed, 0 failed`。
- [ ] QA 报告：`reports/v6/qa-report.md`（汇总）+ `qa-e2e.md` / `qa-perf.md` / `qa-visual.md`；按冻结单发布门：`--check` GREEN + 引擎 0 failed + E2E 全绿 + RV APPROVE（P1 例外需 Lead 明确豁免，不能由 DOC 自行放宽）。
- [ ] `manifest.webmanifest` 与 `icons/` 五张图齐全（192 / 512 / maskable-512 / apple-touch-180 / og-image）。
- [ ] 版本号：`app/src/app.js` 的 `App.version`（当前 `6.0.0`）与 `docs/v6/release-notes.md` 一致；`--release` **不会**自动改版本号。

### 5.3 部署

- 站点发布目录是**仓库根**；`.github/workflows/pages.yml` 在 **push 到 `main`** 时自动部署（`upload-pages-artifact path: '.'`）。
- 流程：`--release` 生成根产物 → 提交 → 推 `main` → Pages 自动更新（约 1–2 分钟）。
- 也可以手动：GitHub Actions → "Deploy to GitHub Pages" → Run workflow。
- 线上地址：<https://chundongtou.github.io/couple-game/>。
- 因为 `path:'.'` 会把整个仓库上传，仓库根的历史目录（`arcade/`、`pages/`、`app3d/` 等）也会被部署；V6 不链接它们，不要在发布说明里把它们当 V6 功能。

### 5.4 关于 `--release --check`

`--check` 里有一项「产物不含/不引用 board.js」。仓库根保留了 V5 的回滚资源 `assets/board.js`（511 KB），而清理逻辑对仓库根**故意不删**旧 assets，所以在仓库根上跑 `--release --check` 会得到 **26 passed / 1 failed → RED**（已在临时副本实测复现）。

- 发布门请对干净输出目录跑：`python tools/rebuild/build_app.py --out dist/rebuild --check`。
- 或临时把 `assets/board.js` 移出仓库根再跑 `--release --check`（发布完放回去）——但别把它提交删除，它是回滚资源。

---

## 6. 回滚

### 6.1 最快：revert 提交

GitHub 上 revert 合并后的 commit（或本地 `git revert <commit>` 后推 `main`），Pages 自动回到上一版。

### 6.2 回滚到某个历史版本（整套一起回）

```bash
git checkout <old-commit> -- index.html manifest.webmanifest sw.js assets/ icons/
```

- **必须整套回滚**：`index.html` + `assets/` + `sw.js` + `manifest.webmanifest` + `icons/`。
- V6 的 `CACHE` 名带 `index.html` 内容哈希，正常情况下内容一变缓存名自动变，**不需要手工 bump 缓存版本**；但前提是 `sw.js` 和 `index.html` 一起换。只换 `index.html` 会让旧 SW 继续按旧清单缓存。
- 回滚到 **V5** 时，`sw.js` 要一起回到 V5 那一版（V5 的 `CACHE` 名与预缓存清单不同），并且把 `assets/board.js`、`assets/cards.js` 一并恢复（V5 的 `index.html` 引用它们）。
- 回滚后强刷一次线上页，DevTools → Application → Service Workers 里确认 `CACHE` 名与预期一致。

### 6.3 3D 棋盘回滚资源的正确说法

- `app/render/`（three.js 源码）与 `assets/board.js`（V5 产物）保留，目的是「需要时能回到 V5 的 3D 主桌」或做实验参考。
- `build_app.py --board=3d` 只是**把 board.js 拷进产物**；V6 的 `App.BoardView` 始终是 SVG，主桌没有加载 board.js 的代码路径；设置里的 `boardView:"3d"` 目前只是预留字段。
- 所以：**不要承诺「改个设置就能切 3D」**。真要 3D 主桌，回滚到 V5 的整套产物（§6.2），或单独立项把 loader 接回来（需要改 `table.js` / `view/board.js` 与构建清单）。

---

## 7. 模块地图

| 文件 / 目录 | 职责 | 改它要注意 |
|---|---|---|
| `app/src/app.js` | 启动装配：版本号、路由、首次手势解锁音频、PWA 注册、Safe 初始化 | 版本号在这里 |
| `app/src/core/store.js` | 设置 / session / history / standalone / pending / backup；导入导出 | 键名不能改；`validate()` 失败只能「先备份再移除」，不准清空 |
| `app/src/core/safe.js` | 全局安全词胶囊（长按 1.6s → 暂停） | z-index 380，不能与主桌按钮重叠 |
| `app/src/core/audio.js` / `motion.js` / `ui.js` | 音效 token、动效（含 reduced 判定）、UI 小组件/toast/haptic | 音效只走 `App.Audio.play(name)` |
| `app/src/engine/flight-engine.js` | 规则状态机：newGame / roll / legalMoves / move / resolvePrompt / resolveMinigame / safeWord / buildLedger / view | 纯逻辑、确定性（`mulberry32`）；不碰 DOM/localStorage |
| `app/src/engine/flight-meta.js` | 心动值 / 连击 / 里程碑（纯函数） | 只增不降；`stage` 由 heat 重算 |
| `app/src/engine/flight-draw.js` | 抽卡：尺度上限、边界过滤、权重、命运池 | 改权重/过滤先看 `app/DESIGN.md` §10 |
| `app/src/engine/flight-board.js` | 棋盘拓扑：52 格、机坪、航线、终点、跳/飞/进航、命运格 | 改格型要同步 `view/board.js` 与 QA 断言 |
| `app/src/engine/minigames.js` | 温度计 / 真心话转盘 / 大冒险转盘（纯逻辑） | 独立小游戏也用这一套 |
| `app/src/engine/archive.js` | 公寓局 / 旧夜航 → history | 旧档不按新规则续玩 |
| `app/src/engine/flight-rules.js` | 规则开关（放过仍进军、叠机奖励步…） | 旧局按 `state.rules` 快照走 |
| `app/src/view/board.js` | SVG 2.5D 棋盘 + 骰子/走子/击落/叠机演出；门面 `App.BoardView` | 只读快照；不调 `App.Flight`、不读写 localStorage |
| `app/src/ui/screens/table.js` | 主桌编排：HUD / 回合条 / 骰子 / 棋盘容器 / 题卡与小游戏宿主 / busy 单飞 | 时序：调引擎 → `Store.saveSession` → `BoardView.play` → `setState` 纠偏 |
| `app/src/ui/overlay/prompt-card.js` | 题卡面板（做了/放过/命运/收尾） | `App.PromptCard.open(host,prompt,state,handlers)` |
| `app/src/ui/overlay/minigame.js` | 温度计 / 转盘面板 | 关闭后由 table 调 `Flight.resolveMinigame` |
| `app/src/ui/screens/pause.js` | 暂停层（四个动作；不卸载当前屏） | 只有「今晚就到这」会走 `Flight.safeWord` |
| `app/src/ui/share.js` | 回顾分享图（Canvas 1080×1350，本机生成） | 不上传、不生成外链；默认不画题卡原文 |
| `app/src/styles/base.css` | 设计令牌 + 基础组件 | 新代码只用 V6 变量 |
| `app/index.template.html` | HTML 模板、PWA / 分享 meta、首屏骨架 | 占位符一个都不能少；改 meta 要 `--release` |
| `sw.template.js` | SW 模板（install/activate/fetch 策略） | 不要手改 `sw.js`；模板占位符缺一个构建会失败 |
| `tools/rebuild/build_app.py` | 构建 / 发布门 / minify / 哈希 / SW 生成 | 改模块顺序要同步本文 §2 与 DESIGN §14 |
| `qa/rebuild/flight-engine.test.mjs` | 引擎测试（700 用例，含 V6 收尾/迁移/命运/尺度） | 改规则必须同步测试，并在文件头注明 V6 语义变更 |
| `qa/v6/*.py` | QA 总控 / E2E / 性能 / 视觉 | 由 QA 维护 |

---

## 8. 测试

| 层 | 命令 | 通过标准 |
|---|---|---|
| 引擎（无浏览器） | `node qa/rebuild/flight-engine.test.mjs` | 本机实测 **700 passed / 0 failed** |
| 构建 + 发布门 | `python tools/rebuild/build_app.py --out dist/rebuild --check` | 本机实测 **27 passed / 0 failed → GREEN** |
| E2E（Playwright + Edge） | `python qa/v6/e2e_v6.py --dist dist/rebuild` | 主路径 / 暂停 / 小游戏 / 命运 / 响应式 / 离线 / 减少动画全绿 |
| 首屏性能 | `python qa/v6/perf_budget.py --dist dist/rebuild` | ADR-012 预算全绿（slow4G + 4×CPU，gzip 静态服务） |
| 视觉回归 | `python qa/v6/visual.py --dist dist/rebuild` | 结构断言 + 基线图对比通过（首次运行生成基线） |
| 一键 | `python qa/v6/run_all.py --dist dist/rebuild --final` | 汇总 `reports/v6/qa-report.md`；退出码 0=PASS / 1=FAIL / 2=PARTIAL |

- E2E 常用参数：`--only boot,main,pause,offline`（分组：`env,boot,main,skip,resume,pause,minigame,fate,responsive,offline,reduced`）、`--viewports 390x844,360x640`、`--headed`。
- 需要 Playwright 与 Edge（`channel="msedge"`）；DSH 运行时已装 Playwright 1.65.2。
- 报告：`reports/v6/qa-{e2e,perf,visual}.md|json`，日志 `reports/v6/logs/`，截图 `qa/v6/shots/`、`reports/v6/visual/`（均 gitignore）。
- 改引擎后至少跑引擎测试；改 UI / 题卡 / 构建后再跑 `--check` + E2E 相关分组。完整验收由 QA 执行，DOC 不替代 QA。

---

## 9. 怎么改内容 / 数值 / 样式

| 想改什么 | 改哪里 | 备注 |
|---|---|---|
| 心动值计分 / 阶段 / 连击里程碑 | `app/src/engine/flight-meta.js` | 数值表见 `app/DESIGN.md` §5 |
| 快局/长夜目标、收尾条件 | `app/src/engine/flight-engine.js` `targetsFor()` / `shouldEnd()` | 改完跑引擎 V6 收尾用例 |
| 尺度上限 / 过滤 / 抽卡权重 / 命运池 | `app/src/engine/flight-draw.js` | 见 DESIGN §10 |
| 棋盘格型 / 命运格位置 | `app/src/engine/flight-board.js` | 改坐标要同步 view 与 QA 结构断言 |
| 界面文案 | `docs/v6/copy.md` → 对应 `ui/**` | 文案 deck 是 QA 断言的字面来源，先改 deck |
| 视觉令牌（颜色/圆角/缓动/字体） | `app/src/styles/base.css` 的 `:root` | 不要另写 body 背景 |
| 题库 | `app/data/raw.json` → `python tools/rebuild/make_cards.py` | `app/src/data/cards.js` 是产物，不要手改 |
| PWA / 分享 meta | `app/index.template.html` 的 `<head>` | 改完 `--release` |
| 缓存策略 | `sw.template.js` | 不要手改 `sw.js` |

改完统一流程：**改源码 → `build_app.py --out dist/rebuild` → 本地 8877 验证 → 引擎测试 → `--release` → 提交推 `main`**。

版本号发布时手动改 `app/src/app.js`（`App.version`），并同步 `docs/v6/release-notes.md`；`--release` 不会自动 bump。

---

## 10. 存档兼容（摘要）

- 五个既有键名不变：`couple2.{settings,session,history,standalone,pending}`；新增 `couple2.backup.session`（首次读 session 原样备份一次）。
- V5 进行中的飞行棋（`v:1`）原样续玩：`Flight.validate()` 只补可选默认（`mode/targetCards/targetHeat/cardsProcessed/meta/endingQueue`），**永不新增必填项**；读不出时先备份再移除，不把「读不懂」当垃圾反复读。
- 公寓局 / 旧夜航：`Archive.archiveForeign()` → 收进 history（`kind:"apartment"|"voyage"`），清 session，不按 V6 规则续玩。
- 导出 `v:6`；导入兼容 `couple-flight / couple-apartment / couple-voyage`，对 flight session 先 `validate()`，不通过整体拒绝、不覆盖现状。
- 完整字段与迁移矩阵见 `app/DESIGN.md` §12 与 `docs/v6/architecture.md` §7。

---

## 11. 已知坑 / 边界

1. **`--release --check` 在仓库根会红**（`assets/board.js` 回滚资源存在）；发布门请对干净输出目录跑 `--check`（§5.4）。
2. **`--check` 不是只检查**：它会先构建再检查；要查哪个目录就指定哪个 `--out`（会重新构建该目录后再查）。
3. **`app/render/node_modules` 不进仓库**：干净 clone 里没有 esbuild 时构建会 `[WARN] 没找到 esbuild…本次不压缩`，产物更大；本机的 esbuild 0.25.12 在该目录（`npm ci` 属于环境准备，未在本轮验证）。未压缩产物本机实测 `--check` 仍 GREEN（index gzip 124.4 KB / 首屏总 157.4 KB，都在 ADR-012 预算内），但余量很小，发布仍应压缩。
4. **缺模块 WARN 不阻断**：并行开发期允许；最终集成用 `--strict --check`，缺一个模块就算失败。
5. **`sw.js` 缓存名自动生成**：V6 不需要手工 bump；但 `index.html` / `assets` / `sw.js` 必须同一次构建（§5.1）。
6. **`assets/board.js` 不进 SW 预缓存**：它 511KB 且默认不加载；`--board=3d` 只是拷进产物，不改变运行时加载逻辑。
7. **PWA 需要安全上下文**：`https` 或 `localhost`；局域网 `http://IP` 不能安装。iOS 只支持 Safari「添加到主屏幕」。
8. **`file://` 打开没有 SW**：本地预览请用 http。
9. **端口冲突**：DSH 工作台里 QA 可能占用 8899；本地预览用 8877 或换端口。
10. **根目录 `assets/cards.js`（V5）不再被 V6 `index.html` 引用**：保留作为回滚资源，不要以为它是 V6 的题库产物（V6 是 `assets/cards.<hash>.js`）。
11. **发布方式不变**：仍是仓库根 + GitHub Pages `main`；不要引入新的构建目录/子路径，否则 `sw.js` 的相对 scope 与 `manifest` 会出问题。

---

## 12. 故障排查

| 现象 | 可能原因 | 处置 |
|---|---|---|
| 打开白屏 | JS 语法错误 / 模板占位符没替换 | 看构建输出；`node --check` 失败的模块会带文件名；`--check` 会指出占位符 |
| `[WARN] 跳过未完成的模块` | 源码文件缺失（并行开发常见） | 补文件；最终用 `--strict` |
| `--check` 有 FAIL | 体积超预算 / sw 与磁盘不一致 / 引用了 board.js | 按 FAIL 行的提示处理；对干净目录重新构建后再查 |
| 线上还是旧版 | Pages 未部署完 / SW 缓存 / 只换了部分产物 | 等 1–2 分钟；强制刷新；确认 `sw.js` 的 `CACHE` 与 `index.html` 哈希一致 |
| 装了 PWA 仍不更新 | 只改 `index.html` 没重生成 `sw.js` | 重新 `--release` 整套发布 |
| 离线打不开 | 没用 http(s) / SW 没注册 / 预缓存缺文件 | 用 `localhost`；看 DevTools Application；`--check` 的 PRECACHE 项 |
| 题库不加载、出兜底短题 | `assets/cards.<hash>.js` 缺失或哈希不匹配 | 重新构建；确认 `--check` 的哈希项 PASS |
| E2E 起不来 | 端口被占 / 缺 Playwright 或 Edge | 换端口；`python -m playwright install`；确认 Edge 存在 |
| 手机上看不到「摆上棋盘」 | 视口 <320 或浏览器缩放异常 | 目标宽度 320–430；不支持横屏/平板两栏 |

---

## 13. 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| 6.0.0 | 2026-11-16 | V6 重写：SVG 2.5D 棋盘替换 three.js、题库外链哈希、`sw.template.js`、minify（esbuild）、`--check` 发布门、ADR-012 预算；公寓玩法下线（源码保留、不构建）。本文同步重写。 |
| 5.x | 2026-11 | 公寓版（旧文档见 git 历史 `docs/REBUILD.md`）。 |
