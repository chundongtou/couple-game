# 今晚飞行棋 V6 · 技术架构与动画方案

- 作者：AR（架构）
- 日期：2026-11-16
- 状态：**草案（Draft）**。文中所有"推荐"均未获用户批准，箭头（→）表示建议执行方向，不等于已定案。
- 关联任务：`task-2`（任务板）；写作用域：`couple-game/docs/v6/architecture.md`、`couple-game/docs/v6/api-contract.md`
- 上游输入：`docs/v6/spec.md`（PA，**撰写中，本文件未引用其结论**）、`docs/v6/audit.md`（PA，撰写中）、`docs/v6/mocks/`（FE 视觉 spike，撰写中）
- 下游消费者：FE（视图/动画）、BE（引擎/存档）、QA（测试）、DOC（发布说明）

> **阅读顺序**：§1 是实测基线（数字都可复现）；§2/§3 是两个必须拍板的决策；§4 是可执行预算；§5 目录与依赖规则；§6 动画；§7 存档；§8 测试；§9 风险；§10 待验证清单（谁验、怎么验）。契约正文在 `api-contract.md`，本文不重复。

---

## 1. 现状基线（2026-11-16 本机实测）

### 1.1 产物体积

测量方式：`node` + `zlib` 读本地文件（`gzip level 9`、`brotli` 默认档）。源码位置见括号。

| 产物 | 原始 | gzip -9 | brotli | 说明 |
|---|---|---|---|---|
| `index.html`（仓库根，线上首页） | 173.4 KB | 47.1 KB | 38.7 KB | `tools/rebuild/build_app.py --release` 产物，23 个 JS + CSS 内联 |
| `assets/board.js` | 499.1 KB | **126.3 KB** | 104.4 KB | `app/render` 的 Vite IIFE 产物，已 `minify: true` |
| `assets/cards.js` | 188.0 KB | 32.9 KB | 27.2 KB | 题库，从 HTML 拆出后**仍以阻塞 `<script src>` 加载** |
| `sw.js` | 6.2 KB | 2.6 KB | 2.0 KB | 预缓存 + network-first 导航 |
| `manifest.webmanifest` | 0.9 KB | 0.4 KB | 0.3 KB | — |
| `app/src/styles/base.css` | 20.7 KB | 5.8 KB | 5.0 KB | 样式令牌集中在这一个文件 |

**首屏文本资源合计：862.6 KB raw / 209.4 KB gzip**（index + board + cards + sw + manifest）。

three.js 单独估算：`app/render/node_modules/three/build/three.core.min.js` = 372 KB raw / **99 KB gzip**，占 `board.js` gzip 体积的 **78%**。即：board.js 里真正属于这个游戏的代码只有约 27 KB gzip。

### 1.2 首屏时间成本（拆解到"谁在拖"）

环境：Edge 157.0.4341.60（Playwright `channel="msedge"`，headless）、视口 390×844 DPR2、`service_workers="block"`、`cacheDisabled=true`、本机静态服务（禁缓存）。CDP `Network.emulateNetworkConditions` 节流；最后一行额外加 `Emulation.setCPUThrottlingRate(4)` 模拟中端机。

| 用例 | 网络 | FCP | DOMContentLoaded | load | JS heap |
|---|---|---|---|---|---|
| 全量（现状） | fast4G | 384 ms | **1944 ms** | 1945 ms | 2.64 MB |
| 全量（现状） | slow4G | 312 ms* | **4410 ms** | 4415 ms | 2.64 MB |
| 屏蔽 `board.js` | fast4G | 136 ms | 809 ms | 811 ms | 2.10 MB |
| 屏蔽 `board.js` | slow4G | 324 ms* | 1962 ms | 1965 ms | 1.59 MB |
| 屏蔽 `board.js`+`cards.js` | fast4G | 128 ms | **425 ms** | 430 ms | 1.69 MB |
| 屏蔽 `board.js`+`cards.js` | slow4G | 328 ms* | **1088 ms** | 1094 ms | 1.69 MB |
| 全量（现状） | slow4G + 4× CPU | 508 ms | **4630 ms** | 4636 ms | — |
| 屏蔽 `board.js` | slow4G + 4× CPU | 372 ms | 2175 ms | 2210 ms | — |
| 屏蔽 `board.js`+`cards.js` | slow4G + 4× CPU | 348 ms | **1258 ms** | 1295 ms | — |

\* FCP 在 slow4G 下反而更低是本地回环 + 静态服务导致的重排噪声，**不要用它做优化依据**；真正可比的信号是 DCL/load（首帧渲染由 CSS 背景先撑住，应用界面要等内联 JS 解析执行完）。

结论（可直接写进汇报）：
1. **`board.js` 一项目前就把门厅可用时间推迟 1.1 s（fast4G）/ 2.4 s（slow4G）/ 2.5 s（slow4G+4×CPU）**；
2. 再把 `cards.js` 移出关键路径，还能再省约 0.4 s（fast4G）/ 0.9 s（slow4G+4×CPU）；
3. 两个都移走后，门厅可交互时间落在 **1.26 s（slow4G+4×CPU）**，这才是 V6 预算的基线。

### 1.3 运行时成本（主桌屏）

用引擎生成一局合法 session 写进 `localStorage.couple2.session`，再 `App.Router.reset('table')`，稳定 2.5 s 后读 `performance.memory.usedJSHeapSize`：

| 用例 | canvas 存在 | JS heap | 页面错误 |
|---|---|---|---|
| 主桌 + 3D 棋盘 | ✅ | **11.02 MB** | 0 |
| 主桌（`board.js` 被 abort） | ❌ | **2.14 MB** | 0（只是 toast「棋盘脚本还没载入」，棋照样能走） |

即：**three.js 棋盘在主桌常驻约 8.9 MB 堆**。另外两条读源码得到的硬事实：

- `app/render/src/main.js:877-883`：`loop()` 无条件 `requestAnimationFrame` 递归，**主桌停留期间持续渲染**（每帧 `updateShadows()` + `renderer.render()`），不因静止而降频。移动端代价是持续 GPU/电量。
- `app/render/src/main.js` 全文没有 `webglcontextlost` / `webglcontextrestored` / WebGL 能力探测；`mount()` 的 `catch` 只 toast「棋盘没有摆上来」（884-888 行）。**没有 WebGL 或上下文丢失 = 棋盘消失且不可恢复**（只有「离开→重进」能重建）。

### 1.4 代码与工程健康度

- **死代码 75.3 KB / 10 个文件**：不在 `build_app.py` 的 `JS_MODULES` 里、也无任何引用——`app/src/engine/engine.js`（31.9 KB，公寓局引擎）、`engine/balance.js`（7.0 KB）、`ui/screens/{close,door,foyer,kit,plan,room}.js`（33.6 KB）、`ui/night.js`（1.3 KB）、`content/content.js`（2.5 KB）。当前实际参与构建的屏只有 `boot / table / ledger / nights / settings / minigame`（已核对 `Router.reset|go` 的调用点）。
- **构建脚本体积报告不准**：`tools/rebuild/build_app.py:172-173` 用的是"拆题库之前"的 `html` 变量算体积，所以它打印 `356 KB (gzip 80 KB)`，而真实产物是 `169.2 KB / 46.9 KB`（拆走后 `assets/cards.js` 另算）。**所有对外口径以磁盘文件为准，不要引用构建脚本的打印值。**
- **题库不阻塞是"假"的**：题库虽已拆成独立文件，但模板第 444 行仍是同步 `<script src="assets/cards.js">`，它排在应用 JS 之前 → 照样堵解析。
- **棋盘脚本是全局同步加载**：模板第 443 行 `<script src="assets/board.js">`，无论用户去哪一屏都要先下 126 KB gzip。
- **仓库没有自动化性能/视觉回归**：`qa/` 里已有 Playwright 基础设施（`qa/harness.py` 禁缓存静态服务、`qa/rebuild/e2e.py` 大脚本、截图落 `reports/`），但没有预算门限、没有基线图。

### 1.5 复现命令

```powershell
# 体积（任一目录）
node -e "const fs=require('fs'),z=require('zlib');for(const f of ['index.html','assets/board.js','assets/cards.js']){const b=fs.readFileSync(f);console.log(f,(b.length/1024).toFixed(1)+'KB raw',(z.gzipSync(b,{level:9}).length/1024).toFixed(1)+'KB gz')}"

# 构建（写到临时目录，不污染仓库）
$py="C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
& $py tools/rebuild/build_app.py --out $env:TEMP\cgbuild

# 引擎测试（现状 493 passed / 0 failed）
node qa/rebuild/flight-engine.test.mjs
```

---

## 2. 决策 D1：棋盘渲染层要不要重写（A / B / C）

### 2.1 三个方案的确切边界

| 方案 | 内容 | 明确**不包含**什么 |
|---|---|---|
| **A 保留 three.js** | 继续 `app/render`（Vite + three 0.180.0）产出 `assets/board.js`，模板同步加载；只在现有 `BoardView` 上补 V6 的新事件与皮肤 | 不做 WebGL 回退、不做按需加载、不拆包 |
| **B DOM/SVG 2.5D 重写** | 用 SVG（92 个格位 + 8 个棋子）+ CSS 3D 倾斜 + Web Animations 重画棋盘；`assets/board.js` 移出首屏加载路径；引擎事件契约不变 | 不引入任何渲染库；不用 Canvas 画棋盘本体（粒子另说）；不改引擎 |
| **C 折中** | 两种常见理解：**C1「SVG 默认 + 3D 保留为懒加载可选视图（单向回滚通道）」**；**C2「双渲染器常驻 + 降级切换」** | C 不等于 C2。**本文推荐的 C 指 C1**；C2 明确不推荐（见 2.3） |

### 2.2 四维对比（证据都来自 §1）

| 维度 | A：three.js | B：SVG 2.5D | C1：B 默认 + A 冻结为可选 |
|---|---|---|---|
| **性能（字节）** | 首屏 +126.3 KB gzip；单独一个 499 KB 文件，无法与主包共享压缩 | **实测原型 8.1 KB raw / 3.5 KB gzip**（含 CSS+JS+52 格+8 棋子，见 2.4），生产预估 ≤ 12 KB gzip，可内联进主包复用压缩 | 首屏同 B；A 只在用户主动切换时下载 |
| **性能（时间）** | 门厅 DCL +1.1 s（fast4G）/ +2.5 s（slow4G+4×CPU） | 门厅 DCL ≈ 0 增量（内联） | 同 B |
| **性能（内存/GPU）** | 主桌常驻 **8.9 MB** 堆；**常驻 rAF 渲染循环**；无 WebGL 回退 | 主桌原型 1.44 MB 堆、104 个 SVG 节点；无 GPU 依赖；只在动画期间工作在合成线程 | 同 B；A 可选 |
| **可测性** | canvas 像素：只能截图对比；命中测试是 raycast，单测不可达；E2E 无法断言"棋子在 ring:14" | **DOM/SVG 可断言**：`[data-square="ring:14"] [data-piece="a:0"]`、`getBBox()`、`getComputedStyle().transform`；命中测试是普通事件监听，可单测 | 两套都要维护测试（若 A 冻结只做冒烟） |
| **动画表达力** | 强：真 3D 纵深、金属/玻璃材质、投射阴影、骰子翻滚、相机推拉 | 中上：2.5D 倾斜 + 路径动效 + 阴影贴图 + 叠加 canvas 粒子；**做不出真实光照与自由视角**（可接受：单手机两人俯视场景用不到） | = B（+ 可选 3D 演出） |
| **维护成本** | 需要 three 场景/材质/相机/手势**全部自己写**（`main.js` 939 行）+ Vite 构建链；改一个视觉要重建 499 KB 产物；**无 WebGL 回退是真实线上风险** | 纯 DOM/CSS/WAAPI，改完刷新即生效，无需构建链；布局坐标可复用 `layout.js` 的极坐标 | 中：多一个"冻结"的旧视图；**不维护它**，只保证不崩 |

### 2.3 推荐

> **推荐 C1：V6 默认用 B（SVG 2.5D）重写棋盘；A（three.js）代码与产物原地冻结保留，作为一次性回滚通道，默认不加载、不投入维护、不再跟 V6 新特性。**
>
> 若排期紧到只能选一个：**选 B**；A 的唯一优势（3D 立体感）在当前"两人一部手机、俯视、单手操作"的场景里不构成竞争力，却要付出 126 KB gzip + 8.9 MB 堆 + 常驻渲染循环 + 无回退的代价。

**为什么不选 A（保留 three.js）**
- 首屏是当前明确痛点，而 `board.js` 一个文件就占首屏 gzip 的 **60%**（126.3 / 209.4），且它在门厅屏完全用不到；
- 主桌 8.9 MB 堆 + 常驻 rAF 在低端安卓上有掉帧与耗电风险，且没有任何 WebGL 缺失/上下文丢失兜底——线上用户的失败模式是"棋盘没了，只剩按钮"，且刷新才能恢复；
- 可测性是硬伤：V6 的验收标准大多是"状态可感知"（可走子高亮、击落可感知），canvas 里这些只能靠人眼截图。

**为什么不选 C2（双渲染器常驻）**
- 两套渲染器同时要跟同一批事件、同一份快照、同一套皮肤令牌演进，测试面 ×2，收益（"用户可自选 3D"）在这个产品里没有需求来源；
- 真要做"演出模式"，正确形态是**同一渲染器的不同皮肤/镜头**，而不是两套图元系统。

**C1 的成本与边界（写清楚，避免日后扯皮）**
- A 的代码不再接受功能开发；V6 新事件（heat/streak/milestone）A **可以忽略**（`playOne` 已经把未知事件转成 `board-event` DOM 事件，见 `main.js:574-577`）；
- 触发回滚时允许"降级"：3D 视图不显示 V6 新状态（热度条等），但不崩、不阻断走棋；
- **退场时间点**：V6 上线满 2 周无回滚请求 → 删除 `app/render/`、`assets/board.js`、模板里的 `<script>` 与 sw 预缓存条目，届时首屏再省 126 KB gzip，并去掉 Vite/three 构建链（= 彻底 B）。

**回滚方式（一行开关，不改代码）**
`couple2.settings.boardView = "svg" | "3d"`（默认 `"svg"`，V6 新增设置项，写进 `Store.DEFAULT_SETTINGS`）；切 `"3d"` 时 `App.BoardView` 变成动态 `import`/`<script>` 加载 `assets/board.js`，加载失败 → 自动回退 `"svg"` + toast。所以**回滚不需要 revert 任何 commit**。

### 2.4 B 的可行性证据（已跑原型，不是纸上推演）

在 `%TEMP%\svgspike\index.html` 写了一个 2.5D 棋盘原型（不改仓库）：复用 `app/render/src/layout.js` 的同一套极坐标（52 格外环、四色机坪、航线 5 步 + goal），y 轴压扁 0.62 做俯视透视，8 个棋子用 `transform` + WAAPI 逐格位移，`transform-box: fill-box`。

| 指标 | 实测 |
|---|---|
| 体积 | 8.1 KB raw / **3.5 KB gzip**（含全部 CSS + JS + 52 格 + 8 棋子） |
| DOM 节点 | 117 个（其中 SVG 图元 104 个） |
| JS heap | 1.44 MB |
| DCL | 74 ms（fast4G）/ 216 ms（slow4G） |
| 动画：12 步 × 3 次 | 每 12 步 297–300 帧，**>25 ms 的帧 0 个**，最差单帧 24/6/6 ms |
| 动画：整整一圈 52 步 | 1300 帧，**>25 ms 的帧 0 个**，最差 6 ms |

（数字的局限：headless Edge + 桌面 CPU、无真机、无 GPU 省电约束；可信部分是"没有长帧"这个相对结论，绝对帧率请 QA 在真机复核——见 §10 U7。）

### 2.5 B 的具体做法（给 FE 的施工口径）

1. **坐标**：`layout.js` 的极坐标 → SVG `viewBox="-12 -12 24 24"`，`y *= 0.62`（透视压扁）。**拓扑不许改**：52 格顺序、四色起飞偏移 13、航线 5 步 + goal 全部沿用 `flight-board.js`，渲染层只读不改、不重算跳/飞。
2. **图元**：格位一律 `<rect rx>` 圆角矩形（不用图片、不用 `<use>` 引外部）；棋子 `<g>` 内一个 `<path>`；阴影用同位置的半透明椭圆（1 个/棋子），不用 CSS `filter: drop-shadow` 做常驻阴影（会强制离屏合成）。
3. **命中测试**：`<g data-piece="a:0">` 上挂 `click`（移动端用 `pointerup`），命中区加一个透明 `<circle r="0.5">` 扩大热区；**不再需要 raycast**，也就没有"点不中"的 72 px 兜底逻辑。
4. **可走子高亮**：加 `data-choice="1"` + CSS `@keyframes` 呼吸光，比改材质 emissive 便宜。
5. **2.5D 纵深**：整体 `<g transform="rotateX(...)">` 不要用（SVG 不支持 3D 变换）；改为在**容器 div** 上用 `perspective` + `rotateX(18deg)` 包裹 SVG，动画只动内层 SVG 的 `transform`（合成层），避免每帧重算 SVG 几何。
6. **禁止**：`foreignObject`（Safari 行为差异大）、在 SVG 里嵌 HTML、`filter` 做常驻发光。

### 2.6 需要 FE 先验证的 3 件事（未定，不装懂）

| # | 待验证 | 谁验 | 怎么验 | 不通过怎么办 |
|---|---|---|---|---|
| V1 | iOS Safari 上 `<g>` 元素 WAAPI 动画是否走合成层（不卡主线程） | FE | iPhone 真机 + `prefers-reduced-motion` 关，跑 52 步动画录屏 | 退到「逐格改 `transform` 属性 + `will-change: transform`」，仍不行则棋子改用绝对定位 `<div>` 覆盖层（不用 SVG 动画） |
| V2 | 2.5D 倾斜后 52 格的文字/编号在 390 宽下是否可读 | FE | `docs/v6/mocks` 的静态稿 + 实机截图 | 去掉倾斜（纯俯视），用阴影与光晕做纵深 |
| V3 | 4× CPU 降速下 8 棋子 + 粒子叠加时的帧时间 | QA | §4.2 的脚本，连续 20 次走子采样 | 粒子降级为 CSS `steps()` 或直接关（reduced 档） |

---

## 3. 决策 D2：构建产物与加载策略

### 3.1 目标形态

**首屏 = 一个内联单文件 `index.html`；其余资源全部移出关键路径、按需加载、带内容哈希。**

保留"单文件内联"的理由：①门厅一次 RTT 拿全，弱网下不必等模块瀑布；②离线首屏只需缓存一个文档；③现有 `build_app.py` 的模型就是它，改造面最小。
放弃"全单文件"的理由：题库（188 KB）与棋盘（499 KB）不需要在门厅出现，塞进首个 RTT 纯亏。

### 3.2 资源清单与加载时机

| 资源 | 内容 | 加载时机 | 失败退化 |
|---|---|---|---|
| `index.html` | CSS + core + engine + view + ui + 启动（全部内联） | 立即（唯一阻塞资源） | — |
| `assets/cards.<hash>.js` | `window.CARDS` 题库 | ①`<link rel="prefetch">`（`load` 之后）②进主桌前 `App.Assets.ensureCards()` 显式 await | 3 s 超时 → 用 `flight-draw.js` 内置 `FALLBACK_CARDS`（5 张）+ toast 一次；不阻断开局 |
| `assets/board.<hash>.js` | 旧 three.js 棋盘（冻结） | 仅当 `settings.boardView === "3d"` | 加载/挂载失败 → 回退 SVG + toast「3D 棋盘不可用，已用平面棋盘」 |
| `assets/fonts/*` | 无（V6 不引外链字体；用系统字体栈 `--font` / `--sans`） | — | — |
| `icons/*` | PWA 图标 | 由 `manifest`/`<link rel=apple-touch-icon>` 按需 | 已有 |
| `sw.js` | 预缓存与版本 | `load` 后注册（现有 `ui/pwa.js`） | 静默跳过（`file://` 已有处理） |

**关键改动：模板从「两个阻塞 `<script src>`」变成「一个 `<link rel="prefetch">` + 一个按需加载」**。当前模板第 443/444 行的同步脚本必须在 V6 去掉。

### 3.3 题库懒加载的正确姿势（有坑，先说清楚）

`flight-draw.js:129` 读的是 `global.CARDS`，抽不到就静默走 `FALLBACK_CARDS`（第 214 行）——**这意味着"忘了 await"不会报错，只会静默出兜底题**，是最难被 QA 发现的缺陷。所以契约必须固定：

> **规则 C-1**：任何会导致抽题的动作（`Flight.roll` / `Flight.move` / `Flight.resolvePrompt` 之后可能抽题），其**调用方必须先 `await App.Assets.ensureCards()`**。`ensureCards()` 幂等、带 3 s 超时、返回 `{ok, fallback}`；`UI/table` 在 `mount` 时 await 一次并把「掷骰」按钮置为 disabled 直到 resolve（正常情况已由 prefetch 命中，用户感知不到）。

> **规则 C-2**：`FALLBACK_CARDS` 只允许在 `ensureCards()` 明确超时后使用，且必须 toast 一次「题库没下全，这局用简短版」，不得静默。

### 3.4 service worker 与缓存版本

现状：`sw.js:15` `CACHE = 'couple-flight-v1'`，预缓存 11 项（含 `board.js`、`cards.js`、`arcade/*`），导航 network-first、静态资源 cache-first。

V6 目标（**构建时自动生成，禁止手改**）：

- `CACHE = "couple-flight-v6-" + buildHash`，`buildHash` = `index.html` 内容的 sha256 前 8 位；
- `PRECACHE` = `["./","./index.html","./manifest.webmanifest","./assets/cards.<hash>.js","./icons/*"]`；**`board.js` 不进预缓存**（可选特性，走 cache-first 运行时缓存）；
- 移出 `./arcade/*`（V6 不再发布游戏厅；如仍需保留，单列一条并由发布说明确认）；
- 保留 network-first 导航（这是老用户不被旧缓存锁死的关键），`skipWaiting()` + `clients.claim()` 保持现状；
- 更新提示沿用 `ui/pwa.js` 的「新版本已就绪」toast。

离线不退化（硬要求）：SW 安装成功后，**断网冷启动门厅 + 开一局 + 掷一次骰**必须全通，且抽到的不是兜底卡（因为 `cards.js` 在预缓存里）。

### 3.5 构建脚本改造点（只列契约，不写实现）

`tools/rebuild/build_app.py` 需要：

1. 计算 `buildHash`，把 `index.html` 里对 `assets/cards.<hash>.js` 的引用写成哈希名；同步重写 `sw.js` 的 `CACHE` 与 `PRECACHE`（模板化 `sw.js`：`sw.template.js` → `sw.js`）；
2. **修正第 172-173 行的体积口径**：改成对最终落盘文件统计（HTML + 所有资源），并打印 `gzip` 口径；这是对外汇报的唯一数据源；
3. 新增 `--check` 模式（给 CI/QA 用）：校验 ①`index.html` 引用的每个 `assets/*` 都存在且哈希匹配 ②`sw.js` 的 `PRECACHE` 与磁盘一致 ③没有任何 `<script src>` 出现在 `</head>` 之前或内联 JS 之前 ④体积超过 §4 预算时非零退出；
4. 支持 `--board=svg|3d|none` 决定是否把 `board.js` 拷进产物（`none` 时不拷，减小发布包）。

### 3.6 产物一致性检查（发布门）

发布前必须跑：`build_app.py --release --check`（退出码 0）+ `node qa/rebuild/flight-engine.test.mjs`（0 failed）+ `qa/v6/perf_budget.py`（P0 全绿）。三者任一失败 → 不许发布。

---

## 4. 首屏性能预算（可执行数字）

### 4.1 预算表

测量档位（下称"标准档"）：**slow 4G（1.6 Mbps / 750 kbps / RTT 150 ms）+ 4× CPU 降速 + 清缓存 + SW 阻断 + 390×844 DPR2**；数字均为门厅屏（`#screen` 内出现「开始」按钮）为准。

| 编号 | 预算项 | 上限（P0 硬门槛） | 现状 | 余量/说明 |
|---|---|---|---|---|
| PB-1 | `index.html` 原始体积 | ≤ 220 KB | 173.4 KB | 允许 V6 新增 UI 约 45 KB 源码 |
| PB-2 | `index.html` gzip | ≤ 58 KB | 47.1 KB | 内联 SVG 棋盘预计 +8~12 KB gzip |
| PB-3 | 首屏**阻塞**资源总量（raw） | ≤ 220 KB | 169.2 KB（no-board-no-cards） | 只算 `index.html` |
| PB-4 | 门厅 DOMContentLoaded | **≤ 1500 ms** | **1258 ms**（基线） | 允许 +19% |
| PB-5 | 门厅 FCP | ≤ 600 ms | 348 ms | 背景先撑住 |
| PB-6 | 主桌可掷骰（`table` 屏出现「掷骰」且 enabled） | ≤ 800 ms（从点击「开始」起） | 未测 | **待 QA 首测后定稿** |
| PB-7 | 主桌 JS heap | ≤ 6 MB | 2.14 MB（无棋盘）／11.02 MB（3D） | 直接排除 3D 常驻 |
| PB-8 | 单次动画帧时间 P95 | ≤ 16.7 ms | 原型最差 6 ms（桌面/headless） | 真机复核 |
| PB-9 | 20 次连续走子的掉帧率（>25 ms 的帧占比） | ≤ 5% | 原型 0/1300 | 真机复核 |
| PB-10 | 单回合动画总时长 | ≤ 2500 ms | — | 见 §6.2 时长表 |
| PB-11 | 用户跳过到终态 | ≤ 150 ms | — | §6.4 |
| PB-12 | 断网冷启动门厅（SW 命中） | ≤ 1500 ms 且可开局 | 未测 | 待 QA |
| PB-13 | 首屏**必需**网络请求数 | ≤ 2（document + manifest 之外的都不可阻塞） | 4（doc+board+cards+manifest） | V6 目标 2 |

P1 目标（fast4G）：门厅 DCL ≤ 700 ms（现状 425 ms）。

### 4.2 测量方法与判据

- 脚本：`qa/v6/perf_budget.py`（QA 落库；骨架可直接复用本文 §1.2 的 CDP 参数与 `performance.getEntriesByType` 取值）。
- 采样：每档 **3 次取中位数**；报告里同时给原始 3 个数。
- 判据：PB-1~PB-13 全绿才算 G4（可交付）通过；PB-6/PB-8/PB-9/PB-12 允许一次"真机手测 + 录屏"替代（用户在场时由用户手测，QA 记录）。
- 归因工具：`performance.getEntriesByType('resource')` 排序 + `--check` 的体积报告；不引入 Lighthouse（离线环境不可靠，且它自带 Node 依赖）。

### 4.3 超预算时的处置顺序（写死，避免吵）

1. 先砍**非关键资源**（把新加的图片/装饰 JS 改成 CSS 或删）；
2. 再拆 `index.html`：把 `ledger/nights/settings/minigame` 四个屏的代码从首屏内联移到 `assets/screens.<hash>.js`（预计可回收 15~25 KB gzip）；
3. 最后才允许放宽预算，且必须在 `decisions.md` 写一条 ADR 说明原因。

---

## 5. 模块划分与目录结构

### 5.1 分层与依赖方向（单向，违反即 review 打回）

```
data(cards)      → 纯数据，全局 window.CARDS
core/            → util bus store audio motion ui(shell) safe haptics      （不依赖 game）
engine/          → flight-board flight-rules flight-draw flight-engine minigames archive meta
view/            → layout cells pieces effects animator storyboard feedback （依赖 engine 的类型/快照，不依赖 ui）
ui/              → router screens/* overlay/prompt-card pwa                 （依赖 engine + view + core）
app.js           → 组合根：只做装配与启动
```

硬规则：
- `engine/**` 里**不许出现** `document` / `window`（`App.FlightBoard` 等挂在 `window.App` 是历史包袱，V6 允许保留挂载方式，但模块内部不得读 DOM）；
- `view/**` 不许 import `ui/**`，不许直接读 `localStorage`；
- `ui/screens/**` 不许直接 `new` 动画对象或碰 SVG 细节，只能通过 `App.BoardView` / `App.Animator` 门面；
- 只有 `core/store.js` 碰 `localStorage`（现状已如此，V6 保持）。

### 5.2 目录树（现状 → V6 目标）

```
couple-game/
  index.html                  ← 构建产物（--release）
  manifest.webmanifest
  sw.template.js              【新】缓存版本模板，构建时生成 sw.js
  sw.js                       ← 构建产物
  assets/
    cards.<hash>.js           ← 构建产物（懒加载 + 预缓存）
    board.<hash>.js           ← 旧 3D 棋盘（冻结；--board=none 时不产出）
  app/
    index.template.html       【改】去掉两个同步 <script src>，改 <link rel=prefetch>
    DESIGN.md                 【改】文档债：仍是公寓版（见 state.md 已知限制 3）
    src/
      app.js
      core/{util,bus,store,audio,motion,ui,safe}.js
      engine/{flight-board,flight-rules,flight-draw,flight-engine,minigames,archive}.js
      engine/meta.js          【新】热度/连击/里程碑投影（纯函数，只读 state+events）
      view/                   【新】渲染层
        board/index.js        BoardView 门面（实现 api-contract.md §7.1）
        board/layout.js       SVG 坐标（从 app/render/src/layout.js 的极坐标平移）
        board/cells.js        92 格位一次性构建
        board/pieces.js       棋子创建/定位/叠机编队偏移
        effects.js            击落/叠机/热度粒子（单个 canvas 层，reduced 时关闭）
        animator.js           时间线播放器（play/skip/abort/isPlaying）
        storyboard.js         事件 → 步骤表（含 §6.2 时长表，可注入）
        feedback.js           事件 → 音效/触觉 映射（唯一出口）
      ui/router.js
      ui/screens/{boot,table,ledger,nights,settings,minigame}.js
      ui/overlay/prompt-card.js
      ui/pwa.js
      styles/base.css
      styles/board.css        【新】棋盘与动效关键帧（从 screens/table.js 的内联 CSS 迁出）
      data/cards.js           ← 数据源（构建时单独产出 assets/cards.<hash>.js）
    render/                   【冻结】旧 three.js 棋盘源码（V6 不再改；退场时整目录删除）
  qa/
    rebuild/flight-engine.test.mjs     （493 passed 基线）
    v6/contract/*.json                 【新】引擎↔视图契约 golden 样例
    v6/perf_budget.py                  【新】§4.2 预算脚本
    v6/e2e_v6.py                       【新】主路径 E2E（Edge channel）
    v6/visual/                         【新】结构化视觉快照 + 少量整屏图基线
  docs/v6/{spec,audit,architecture,api-contract}.md
```

**删除（V6 允许一并做）**：§1.4 列的 10 个死文件（75.3 KB），以及 `screens/table.js` 里的内联棋盘 CSS（迁到 `styles/board.css`）。

### 5.3 模块职责速查（新文件）

| 模块 | 唯一职责 | 明确不做 |
|---|---|---|
| `engine/meta.js` | 从 `state + events` 投影出热度/连击/里程碑，写回 `state.meta` | 不改规则、不改 `awaiting`、不抽题、不碰 DOM |
| `view/board/index.js` | 实现 `BoardView` 六个方法 + 三个 DOM 事件 | 不含业务判断（什么事件该等用户确认，由 `ui/screens/table.js` 决定） |
| `view/animator.js` | 串/并行播放步骤表，支持 skip/abort/reduced | 不认识"棋"，只认识步骤对象 |
| `view/storyboard.js` | 事件 → 步骤表（纯函数，时长表可注入） | 不直接操作 DOM |
| `view/feedback.js` | 事件 → SFX/触觉 token | 不做方向判断（静音/省电开关读 settings） |

### 5.4 死代码处置

10 个文件（75.3 KB）一次删完：`engine/engine.js`、`engine/balance.js`、`content/content.js`、`ui/night.js`、`ui/screens/{close,door,foyer,kit,plan,room}.js`。**V6 首次提交即删除**（git 历史里还在，随时可查）。删除前跑一次 `grep -r "App.Screens\.(foyer|door|kit|plan|room|close)"` 确认零引用（当前为 0 命中）。

---

## 6. 动画架构

### 6.1 三段式（谁负责什么）

```
engine（纯函数）           storyboard（纯函数）            animator（命令式）        renderer（DOM/SVG）
state+events  ─────────▶  步骤表 Step[]        ─────────▶  播放/skip/abort ───────▶  改 transform/opacity
（含最终状态，已提交）      （时长表可注入）                 （单写者，串行）           （只做视觉，无业务）
```

**铁律 A-0：状态先于动画。** 引擎返回的 `state` 已经是最终状态，`ui` 立刻 `Store.saveSession(state)` 并可立即渲染"终态"；动画只是把"上一次终态 → 新终态"之间的过程补出来。因此：

- 动画被跳过、被打断、页面被切后台，**都不会**造成状态不一致；
- 动画期间不写 `state`、不调引擎（`table.js` 现有 `busy` 锁就是这条规则的雏形，V6 保持并命名）。

### 6.2 时间线模型与时长表

一个 `Step` 的最小形状：`{kind, target, to, ms, ease, parallelWithPrev, sound, haptic, skippable}`。
`storyboard.build(events, {reduced, speed})` 返回 `Step[][]`（外层并行组，内层串行）。

时长表（`storyboard.DUR`，单位 ms，可被测试注入；`reduced` 列是减少动效时取值）：

| 事件 | 步骤 | 常规 | reduced |
|---|---|---|---|
| `dice` | 骰子旋转入位 | 520 | 90 |
| | 数字落定 + 微回弹 | 160 | 0 |
| `takeoff` | 机坪 → 起飞格（抛物弧） | 380 | 90 |
| | 起飞格闪一下 | 180 | 0 |
| `move`（每格） | 单格位移 | 120 /格，上限 6 格 720 | 30 /格 |
| `jump` | 跳 4 格弧线 | 320 | 80 |
| `fly` | 飞 12 格弧线 + 尾迹 | 620 | 120 |
| `capture` | 被击落棋子回机坪 | 380 | 90 |
| | 落点震动 + 闪光 | 300 | 60 |
| `stack` | 合并到一起 + 编队展开 | 480 | 100 |
| `prompt` | 题卡翻入（**不自动继续**） | 260 | 60 |
| `minigame` | 小游戏面板打开 | 220 | 60 |
| `turn` | 回合胶囊滑动 + 棋盘描边换色 | 320 | 60 |
| `heat`(V6) | 热度条增长 + 数字滚动 | 400 | 90 |
| `streak`(V6) | 连击徽章弹出 | 520 | 80 |
| `win` | 终局演出（禁止粒子时只剩光晕） | 1400 | 300 |
| （全局） | 每步之间的呼吸间隔 | 60 | 0 |

**单回合上限 PB-10 = 2500 ms**：`animator.play()` 若计算出的总时长超过上限，按比例压缩（`scale = limit / total`，压缩下限 0.5），并在 `console.debug` 记一条（QA 可用它做断言）。

### 6.3 减少动效（三层判定，任一命中即 reduced）

1. `settings.reduced === true`（用户显式设置，现有键）；
2. `matchMedia('(prefers-reduced-motion: reduce)')` 命中（现有 `motion.js:12` 已实现）；
3. **运行时省电**：`document.hidden` 或 `navigator.connection && navigator.connection.saveData === true`（省流量模式，Chrome/Android 支持）→ 临时 reduced。

reduced 时：所有装饰性动效关闭（粒子、光晕、骰子旋转、卡片翻入的 3D 部分），只保留**功能性最小动效**（棋子最终位置、骰子点数、题卡出现），时长取自时长表 reduced 列，且**不允许出现 >90 ms 的位移**。文字类动效（打字机 `typewriter`）在 reduced 下直接全文显示（现有实现已如此）。

### 6.4 打断与跳过

| 场景 | 规则 |
|---|---|
| 用户点击棋盘/舞台空白 | `animator.skip()`：当前及其后所有步骤立即到终态（WAAPI `finish()` 后 `commitStyles()`），总耗时 ≤150 ms（PB-11） |
| 用户点击题卡按钮 | 直接终止动画队列，转交 `ui/screens/table.js` 的 `commit(resolvePrompt)`（题卡永远优先于动画） |
| 页面切后台 / `visibilitychange.hidden` | 立即 `skip()`（避免回来时补播一串旧动画） |
| 新事件到达时上一批未播完 | 不可能：`busy` 锁保证 Engine 调用被串行化（`table.js` 现有行为，保留） |
| 动画中卸载屏幕（离开主桌） | `unmount()` → `animator.abort()`（不 resolve 后续步骤）、清理 WAAPI animations（`Anim.cancel()`），防内存泄漏 |

**不可跳过的步骤：没有。** 这是刻意的：两人共用手机、随时可能被打断，任何不可跳过的东西都会变成"卡住"。

### 6.5 音效与触觉挂点（唯一出口 `view/feedback.js`）

| 事件 | SFX（`App.Audio.play`） | 触觉（`App.UI.tap` 风格） | 备注 |
|---|---|---|---|
| `dice` | `flip` | 10 ms | 骰子落定后再补一声 `tick` |
| `takeoff` | `select` | 14 ms | |
| `move`（逐格） | `tick` | 8 ms | **限流：每 2 格才响一次**，避免机关枪 |
| `jump` / `fly` | `chime` / `reveal` | 18 ms | |
| `capture` | `warn` | `[24,40,24]` | |
| `stack` | `chime` | 14 ms | |
| `prompt` | `soft`（仅 `cell-truth`/`cell-touch`/`ending`） | 10 ms | 题卡按钮点击另算 |
| `heat`(V6) | `coin` | 8 ms | 只在跨档位（cold→warm→charged→burning）时响 |
| `streak`(V6) | `combo` | `[14,30,18]` | |
| `win` | `ending` | `[14,30,18]` ×2 | |
| 错误（引擎 `ok:false`） | `error` | 0（不震） | 与 toast 同帧 |

规则：①静音开关 `settings.sound` 与 `settings.haptics` 是总闸，**在 feedback.js 里判一次**（不在每个事件里判）；②`navigator.vibrate` 必须在用户手势后调用（现有 `ui.js:61-66` 已有 `userTapped` 守卫，V6 保留）；③同一帧内相同 SFX 只响一次（去重键 `name + frameId`）；④`reduced` 不关声音（声音不是动效）。

### 6.6 避免 layout thrash（10 条硬规则，review 逐条对）

1. 位移/缩放/透明只用 `transform` / `opacity`；**禁止**动画 `top/left/width/height/margin/padding`。
2. SVG 图元动画前设 `transform-box: fill-box; transform-origin: center`（否则 `transform-origin` 按 viewBox 解析，动画会飘）。
3. 一帧内不混读写：**布局读**（`getBoundingClientRect`/`getBBox`/`offsetWidth`）只在 `mount`、`ResizeObserver`、`orientationchange` 时做，结果存进 `view/board/layout.js` 的缓存；动画期一律用缓存的 SVG 坐标。
4. rAF 回调里**禁止**任何布局读；需要读就先 `await new Promise(requestAnimationFrame)` 让读写分帧。
5. 结构变更（叠机合并、棋子增删）只在**步骤边界**做，不在补间中途 `appendChild`。
6. 粒子用**一个** `<canvas>` 覆盖层，`contain: strict` + `pointer-events: none`，DPR 上限 2；`reduced` 时不创建。
7. `will-change` 只加在"正在动的 ≤12 个元素"上，动画结束立即移除（`Anim.onfinish`）；禁止全局 `*{will-change}`。
8. 数字滚动（热度、连击）用 `font-variant-numeric: tabular-nums` + 固定宽度容器，只改 `textContent`，不改字号/字重。
9. 视图更新走**一次** `DocumentFragment` 批量插入，不用"逐个 createElement + append"循环（现有 `screens/*.js` 大量用 `innerHTML +=`，V6 新代码不许再用字符串拼接循环）。
10. 动画期间不读 `document.body.scrollTop` / 不触发 `scrollIntoView`。

### 6.7 可测性（动画必须能被测试，否则回归靠人眼）

- `storyboard.build(events, opts)` 是**纯函数**，输出可直接做 golden 断言（`qa/v6/contract/storyboard-*.json`）；
- `animator` 支持注入时钟：`createAnimator({now, raf})`，测试里用假时钟同步推进，**不依赖真实时间**（Playwright 里也能同步断言终态）；
- 每个 `play()` 返回 `Promise<{steps, totalMs, aborted}>`，E2E 直接 `await` 后断言 DOM 终态；
- 时长表断言：给 `Flight.roll(state, 6)` 产生的事件流，断言 `totalMs ≤ 2500`。

---

## 7. 存档兼容与迁移

（完整字段与错误码见 `api-contract.md` §9；这里只定策略与不变量）

### 7.1 不变量（任何改动不得违反）

1. **绝不丢数据**：五个键 `couple2.{settings,session,history,standalone,pending}` 的名字与语义不变；
2. **绝不"因为读不懂就清空"**：`validate()` 失败时的行为只能是"当成没有进行中的对局"，对局数据本身必须**先归档/备份**再移除；
3. **旧局不迁移规则**：V5 进行中的棋局按 V5 规则走完（`rules` 已存在 state 里，天然快照），V6 只补默认字段；
4. **导入导出向后兼容**：能读 `couple-apartment` / `couple-voyage` 的导出（现有 `importAll` 已支持），V6 的导出必须能被 V5 读（未知字段忽略）。

### 7.2 迁移矩阵

| 来源 | 处理 | 证据/实现位置 |
|---|---|---|
| `couple2.session` = V5 `flight`（`v:1`） | **原样续玩**；缺省字段补默认（`rules` 合并、`meta` 初始化、`boundaries` 补 `[]`） | `flight-engine.js:585-607 validate()` 已做宽容处理，V6 只加 `meta` |
| `couple2.session` = `apartment` | `Archive.archiveForeign()` → 写进 `couple2.history`（标题「今晚在这间公寓」），清 session，toast 一次 | `archive.js` + `store.js:114-131` |
| `couple2.session` = 更旧（`hand/tokens/resources/phase∈draft…finale`） | 同上，归档为 `kind:"voyage"` | `archive.js:14-63` |
| `couple2.settings`（含公寓遗留 `maxStar/gentleOnly`） | `cleanSettings()` 清掉并给 `suggestScale` 建议；V6 新增 `boardView` 默认 `"svg"` | `store.js:59-84` |
| `couple2.history`（≤60 条） | 原样保留；V6 新增 `meta` 摘要字段（可选），旧条目无该字段照常渲染 | `store.js:172-184` |
| V6 新增 `state.meta` | 只是 `flight` 状态里的**额外字段**，`validate()` 会原样 clone 保留 | `validate()` 只校验必填项 |

**风险点（必须做）**：V6 若为了新 UI 而把 `validate()` 改严（例如要求 `meta` 必填），会让所有 V5 存档瞬间非法 → 数据被"当垃圾丢掉"。**规则：`validate()` 只能加"可选字段的类型校验 + 补默认"，永不新增必填项**（写进 code review 清单）。

**新增备份动作**：`Store.backupSession()` —— 首次读到 session 时，若 `couple2.backup.session` 不存在，就把原始 JSON 原样写进去（一次，之后不再覆盖）。代价 <5 KB localStorage，收益是任何迁移事故都能回溯。失败（quota）静默跳过。

### 7.3 导出/导入

- `exportAll()` 的 `v` 从 5 升 6，`app: "couple-flight"` 不变；
- `importAll()` 对 `app` 的判定保持白名单 `couple-flight | couple-apartment | couple-voyage`；对 `session.kind==="flight"` 先 `validate()`，不通过则**整体拒绝且不覆盖现状**（现有行为，保留）；
- 导入成功后必须 `Bus.emit('session')` 刷新视图（现有行为）。

---

## 8. 测试策略

### 8.1 分层与现状（已有 vs 要建）

| 层 | 现状 | V6 要建 | 门槛 |
|---|---|---|---|
| 引擎单测（node） | `qa/rebuild/flight-engine.test.mjs` — **493 passed / 0 failed** | 新增 `meta` 投影、`storyboard` 时长表、错误码负例 | ≥ 560 断言，0 failed |
| 契约 golden | 无 | `qa/v6/contract/*.json`：事件序列 + 快照 + 步骤表 | 与 `api-contract.md` 一一对应 |
| E2E（Playwright/Edge） | `qa/harness.py`（禁缓存静态服务）+ `qa/rebuild/e2e.py`（大而全，1.4 万行级） | `qa/v6/e2e_v6.py`：**只跑主路径**（开局→掷骰→走子→题卡→结束→回顾→安全词） | 8 条用例全绿，失败截图落 `reports/v6/shots/` |
| 视觉回归 | 无 | 结构化快照（`getBoundingClientRect` + 关键 `computedStyle`）+ 少量整屏图人工确认 | 结构差异 = 0；整屏图差异人工签收 |
| 离线/PWA | 无自动化 | `context.set_offline(True)` + 二次导航断言；SW 版本一致性由 `--check` 管 | PB-12 达标 |
| 性能回归 | 无 | `qa/v6/perf_budget.py`（§4.2） | PB-1~13 全绿 |

### 8.2 为什么视觉回归只做"结构化快照 + 少量整屏"

Edge 与真机的字体/抗锯齿差异会让整屏像素比对人肉维护基线（每天被误报淹没）。**替代方案**：

1. **主判据**：每个关键元素导出 `{selector, x, y, w, h, visible, color, fontSize}` 的 JSON 快照，容忍 `±1px`；
2. **辅判据**：4 张整屏截图（门厅/主桌/题卡/回顾）落 `docs/v6/shots/`，由用户/QA 签收，**不做自动 diff**；
3. 若日后确实要自动像素 diff：用 Pillow（DSH Python 已有 **Pillow 12.3.0 + numpy 2.3.5**，无需新依赖）自写 <100 行差分脚本，阈值"非文本区域差异像素 ≤ 0.3%"，并对文本区做 mask。**不引入 pixelmatch/reg-suit**（要 npm 新依赖，且 Node 侧无现成 CI）。

### 8.3 工具现状与缺口

| 工具 | 状态（今日实测） | 说明 |
|---|---|---|
| DSH Python 3.12.14 | ✅ | `C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe` |
| Playwright（python） | ✅ 可用 | `p.chromium.launch(channel="msedge")` → **Edge 157.0.4341.60 OK** |
| Playwright 自带 chromium | ❌ **未安装** | `chromium_headless_shell-1255` 不存在；**替代：一律用 `channel="msedge"`**，不要写 `browser=chromium` 默认 |
| Pillow / numpy | ✅ 12.3.0 / 2.3.5 | 视觉差分可用 |
| Node 26 / node:test | ✅ v26.13.1 | 引擎测试可继续用 `node xxx.test.mjs` |
| Lighthouse / 站点审计 | ❌ 无 | 用自写 CDP 预算脚本替代 |
| axe-core 等 a11y 工具 | ❌ 无 | 手工清单：`role=main`、`aria-live=polite`、按钮可达 44×44、焦点顺序、颜色对比 ≥4.5:1 |
| 真机农场 | ❌ 无 | 用户手测 + 录屏（PB-6/8/9/12 允许这条替代） |

### 8.4 E2E 必须覆盖的 8 条（V6 验收的最小集）

1. 首次进入 → 门厅可点「开始」→ 选名字/颜色/尺度/架数 → 进主桌（≤20 次点击走完主路径的一部分，PA 的验收口径）；
2. 掷骰 → 骰子可见 → 有合法走子时出现可选高亮；无可走子时自动换手；
3. 走子穿过进航格 → 出「进航」题卡 → 「做了」/「放过」都能继续；
4. 叠机（同色两架叠）→ 出题卡 → 结算后编队正确；
5. 击落（敌方棋子回机坪）→ 被击落方视角正确；
6. 结束 → 回顾（ledger）→ 「以前的夜」能看到这一局；
7. 安全词：任意时刻可达，收棋后不丢已发生记录、不改热度（现有 `safeWord` 语义）；
8. 设置里 `reduced` 打开 → 动画降级（用 `animator.play()` 的 `totalMs` 断言 ≤ 上限）；`sound/haptics` 关闭 → feedback 不触发。

### 8.5 契约测试（保证 FE 与 BE 并行不互相等）

`qa/v6/contract/` 下放 golden：

- `events-roll.json`：给定 `setup + seed`，`Flight.roll(state)` 返回的 `events` 序列（含 `type` 与字段名）；
- `snapshot-*.json`：`Flight.view(state)` 的输出；
- `storyboard-*.json`：`storyboard.build(events)` 的步骤表 + `totalMs`；
- `errors.json`：每个错误码一个负例（构造触发条件 + 期望 `error.code`）。

**FE 用这些 golden 做 mock**（不依赖引擎现成实现），**BE 用同一份做回归**。任何一方改契约，必须同时改 golden 并在 PR 描述里贴 `node qa/rebuild/flight-engine.test.mjs` 输出。

---

## 9. 风险清单（5 条，含回滚）

| # | 风险 | 概率/影响 | 触发信号 | 回滚方案（不改代码的那种优先） |
|---|---|---|---|---|
| R1 | SVG 2.5D 重写工期超出，视觉不达 FE 自评基线 → 主桌"降级感" | 中/高 | G2 前 SVG 主桌三屏截图 FE 自评 <3/5，或 §2.6 的 V1/V2 不通过 | `settings.boardView="3d"` 一行开关切回冻结的 3D 视图（`assets/board.js` 保留在仓库与产物里）；**不需要 revert** |
| R2 | 题库懒加载改坏，静默抽兜底题（最隐蔽） | 中/中 | QA 用例 3 抽到的卡在 `FALLBACK_CARDS` 里；或 `ensureCards()` 超时率 >0.5% | 模板恢复 `cards.js` 为 `defer` 同步加载（还原第 444 行），损失 32.9 KB gzip，功能立刻正确 |
| R3 | SW 缓存版本写错/新旧共存 → 用户卡旧版 | 中/中 | 发布后 QA 离线用例拿到旧 `index.html`；`caches.keys()` 出现两个 v6 前缀 | `CACHE` 名改回上一版 + `skipWaiting` 已是现状；构建脚本 `--check` 强制版本与 hash 绑定，禁止手改 |
| R4 | 存档迁移把旧局判非法而清空（数据事故） | 低/极高 | 任何 `validate()` 收紧的 diff；QA 用 V5 真存档回归失败 | `validate()` 只增可选字段（§7.2 规则）+ `Store.backupSession()` 一次性备份 + 归档不删除（`archive.js`） |
| R5 | 动画在主线程过重，低端机掉帧/发烫 | 中/中 | PB-8/PB-9 超限；真机录屏可见卡顿 | 全局「减少动效」默认开（`reduced` 时长表）+ 粒子层关闭；再不行把 `capture/win` 演出降级为纯色闪 |

---

## 10. 未定项与待验证（谁验、怎么验、验不过怎么办）

> 本表代替"待定"。没有一项交给"以后再说"。

| # | 事项 | 谁 | 怎么验 | 前提/依赖 | 验不过的退路 |
|---|---|---|---|---|---|
| U1 | 2.5D 棋盘在 iOS Safari 的 WAAPI 合成层行为 | FE | iPhone 真机 52 步动画录屏 + `prefers-reduced-motion` 开关各一次 | 需用户提供 iPhone | 见 §2.6 V1 |
| U2 | 主桌可掷骰时间（PB-6 的 800 ms 是否合理） | QA | `qa/v6/perf_budget.py` 首测后回填目标 | 需 V6 主桌第一版 | 放宽到实测 ×1.3，并写 ADR |
| U3 | 热度/连击的**阈值与倍率**（`warm/charged/burning` 分界、连击奖励） | PA | 在 `spec.md` 给出可测口径；AR 只固定字段与事件形状（`api-contract.md` §6.4） | PA 的 spec 定稿 | 若无结论，V6 只上"只读展示"，不接任何规则效果 |
| U4 | 二选一命运格是否进 V6（PA 提案） | PA + 用户 | spec 里给 P0/P1 结论；进则 AR 补 `choice` 事件与存档字段 | 用户拍板 | 不进 V6（不影响本文其他部分） |
| U5 | 是否在 V6 保留 `arcade/*` 游戏厅 | PA + 用户 | 看线上是否需要该入口 | 用户拍板 | 保留则 sw 预缓存单列，且不影响 PB-13 |
| U6 | `state.meta` 的持久化位置（随 session / 独立键） | BE | 用 V5 存档升级一次，断言 `meta` 不丢且 `validate()` 通过 | 无 | 独立键 `couple2.meta`（多一次读写，但零风险） |
| U7 | 真机（低端安卓）帧率与耗电 | QA + 用户 | 录屏 + 系统电量统计，20 次走子 | 需用户提供机型 | 默认 `reduced`，见 R5 |
| U8 | 3D 棋盘何时彻底删除 | 总控 | V6 上线满 2 周无回滚 → 删 `app/render/`（§2.3） | — | 继续冻结保留（成本仅是仓库体积） |
| U9 | `flight-rules.js` 里 A1/A2/A3 与 `stackCapturedBySingle` 这 8 个开关的最终取值（掷 6 是否连掷、多架可选、进航/叠机「放过」的语义、收尾题可否跳过、单架能否击落叠机） | PA + 用户 | PA 在 `spec.md` 给结论；AR 保证全是可切开关（`FlightRules.DEFAULTS`） | 用户拍板 | 维持现状默认值（`flight-rules.js` 现有 8 项），`threeSixesPenalty` 的罚则 V6 仍不实现（现状即如此） |

---

## 附录 A：本次测量用到的关键脚本片段

```python
# 首屏预算采样（QA 可直接落库为 qa/v6/perf_budget.py）
cdp.send("Network.emulateNetworkConditions",
         {"offline": False, "downloadThroughput": 1.6*1024*1024/8,
          "uploadThroughput": 750*1024/8, "latency": 150})
cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})
# 取数
performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd
performance.getEntriesByType('paint')  # first-contentful-paint
performance.memory.usedJSHeapSize      # 需 Chrome 系
```

```js
// 体积口径（唯一可信来源：磁盘文件）
const b = fs.readFileSync(f);
console.log(f, (b.length/1024).toFixed(1)+"KB raw", (zlib.gzipSync(b,{level:9}).length/1024).toFixed(1)+"KB gz");
```

## 附录 B：本文所有数字的出处

| 数字 | 来源 |
|---|---|
| 173.4/47.1 KB（index.html） | 本机 `assets` 与仓库根实测（node zlib） |
| 499.1/126.3 KB（board.js） | 同上 |
| 188.0/32.9 KB（cards.js） | 同上 |
| three.core.min.js 372 KB/99 KB | `app/render/node_modules/three/build/` 实测 |
| 493 passed / 0 failed | `node qa/rebuild/flight-engine.test.mjs` |
| 门厅 DCL 1944/4410/1258… | §1.2 脚本（本机 Edge 157 headless） |
| 主桌 heap 11.02/2.14 MB | §1.3 脚本 |
| SVG 原型 3.5 KB gzip / 1.44 MB heap / 0 长帧 | `%TEMP%\svgspike\index.html`（不入库的原型） |
| 死代码 75.3 KB / 10 文件 | `build_app.py` 的 `JS_MODULES` 与实际 `app/src/**` 差集 |
| 构建打印 356 KB 与真实 169.2 KB | `build_app.py --out <tmp>` 输出 vs 落盘文件 |
