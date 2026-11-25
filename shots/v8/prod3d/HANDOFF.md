# V8 Board3D · 交接单（task-36 · FE-3D-Prod）

> 状态：**完成（含真实 table 联调修复；待 Lead/QA 验收）** · 2026-11-19
> 代码根：`couple-game/`（未 commit）· 任务卡：task-36（V8 Board3D：生产 3D 场景与 API）

## 1. 产出

| 类型 | 路径 | 说明 |
|---|---|---|
| 生产模块 | `app/src/view/board3d/entry.js` | 构建入口；`window.App.Board3D`；mount/instance/`_debug` |
| 生产模块 | `app/src/view/board3d/{scene,director,camera,mapping,textures,parts,bear,constants}.js` | 场景/镜头链/相机/坐标映射/纹理/零件/小熊/常量（共 9 个 ESM 文件） |
| 模块文档 | `app/src/view/board3d/README.md` | API、事件映射、构建/体积、限制（给 table3d/QA/build3d） |
| Demo | `app/dev/board3d-prod-demo.html` | 真实引擎（`App.Flight` + 真实题库 `data/cards.js`）一局：掷骰/选子/走子/题卡/小游戏/收尾/三主题/reduced/自动；不接 table |
| 证据 | `shots/v8/prod3d/report.json`、`verify_skip_gpu.json`、`evidence.md`、29+ 截图 | 阶段链/锁相机/320-430/reduced/事件映射/API/DOM/GPU 帧率 |

写作用域：仅 `app/src/view/board3d/**`、`app/dev/board3d-prod-demo.html`（证据目录 `shots/v8/prod3d/` 为本任务截图，未改 table/build/引擎/题库）。

## 2. 给 build3d（chunk 接入）

- 入口：`app/src/view/board3d/entry.js`
- three import：`import * as THREE from '../../../render/node_modules/three/build/three.module.js'`（**unmin 版**；esbuild 再 min 比直接 min 版小 ~4.5 KiB gzip）
- 全局名：`window.App.Board3D`，模块求值即挂（无 `document.currentScript` / DOMContentLoaded / 相对资源依赖；fetch 正文内联执行安全）
- 建议命令：`esbuild entry.js --bundle --minify --format=iife --target=es2018`
- 体积实测（本机 esbuild，2026-11-19）：**600,742 B raw / 157,027 B gzip ≈ 153.3 KiB**；build3d 的 `build_3d_chunk()` 实测（同源码）152.3 KiB。
  - ≤140KB gzip 不可达：`WebGLRenderer+PerspectiveCamera+Scene` 最小 named-import 包已 132.3–136 KiB gzip；three 两文件原始 gzip 178.9 KiB。建议按 **≤160 KiB gzip** 验收（懒加载，不影响首屏）。
- SW/哈希/`window.__BOARD3D_URL`/离线由 build3d 负责；本模块无外部资源，chunk 可内联。

## 3. 给 table3d（已完成真实联调 35/35）

- host 属性：模块写 `data-3d-phase`/`data-3d-ready`/`data-3d-reduced`/`data-3d-theme`/`data-3d-mode`；失败 `data-3d-fallback`。
- DOM：`div.board3d-layer[data-test=board3d-layer]` + `canvas[data-test=board3d-canvas]`，均 `pointer-events:none`；宿主 `[data-test=board3d]` 归 table。
- `inst` 与 `App.Board3D` 同名方法都在（优先 inst）；`play()` 永不 reject；题卡 batch 里带 `prompt` 时 hold 在 `bear`，下一次 `play()` 自动回 overview。
- 选子仍走 HUD 按钮；`stage(name)` **不存在**，不要调用。
- 新增/明确：`returnToOverview()` 已在 `App.Board3D` 与 inst 上导出（table 的 CellStage 关闭后调用；不调用也会在下一次 `play()` 自动回俯瞰）。
- 本轮根据联调反馈已改：layer `data-test=board3d` → `board3d-layer`；桌板 13×11 → **26×22**、云层压到桌面下、阴影视锥 ±12/2048（320/390/430 overview 不再露桌沿硬边界/阴影硬线/亮带）；**overview 按 host 宽度铺满（棋盘 86–87%）且 host 高度变化自动 refit**（table 题卡开合会改 `.v6-boardwrap` 高度）；skip 改即时（roll 阶段 8ms）。

## 4. 证据（可复跑）

```bash
# 本地静态服务（代码根 couple-game/）
python -m http.server 8777 --bind 127.0.0.1
# demo（直接引源码 ESM，无需构建）
http://127.0.0.1:8777/app/dev/board3d-prod-demo.html
```

关键命令/结果：

1. **入口 bundle**（esbuild，与 build3d 同参）：
   `app/render/node_modules/.bin/esbuild.cmd app/src/view/board3d/entry.js --bundle --minify --format=iife --target=es2018`
   → `raw 598,636 B / gzip 156,553 B`；chunk 内含 `getShaderPrecisionFormat/createProgram/compileShader/drawElements`（渲染器完整，非空壳）。
2. **主路径（真实引擎，430×932 dpr2，Edge headless + SwiftShader，`?adapt=0`）**：
   - `roll(6)` → `roll/return>`；选子 → `focus/fly/land/return`；`roll(2)` → `focus/fly/land/cell45/bear`（hold）。
   - 题卡：真实题库「真心话 · 归属 小满 · 池 truth」；做了后 `heat 0→8、cards 0→1、turn a→b`。
   - fly 探针：`lock.samples=4, maxAbsX=0, maxAbsY=0`（飞机钉在屏幕中心，棋盘旋转+平移）。
   - 390×844 / 320×568 同一阶段链全通过；320 截图含 cell45。
3. **reduced**（`?reduced=1`）：阶段只 `[idle]`，`forbiddenPhases=[]`，`data-3d-reduced=1`，无 fly/focus/cell45/bear；运行时 `setReduced(true/false)` 双向切换正常。
4. **事件映射（合成事件 + 真实 state 注入）**：
   - `jump`：`focus/fly/land/return`
   - `capture`：`focus/fly/land/capture/return`
   - `stack + prompt`：`focus/fly/land/stack/cell45/bear`（hold）
   - `skip()` during roll：**14ms** 到 idle；hold 中 skip 回 idle。
5. **API/DOM 契约**：canvas `860×1864@dpr2`、`pointer-events:none`、layer `pointer-events:none, z-index:0`；roll 按钮 hit-test 命中按钮；`play([{type:'bogus'}])`/`play([])` 均 resolve（永不 reject）；`unmount`→`mount` 重开一局正常。
6. **模式/主题**：quick 4 架/长夜 `mode=long` 8 架（drawCalls 65）；cloud/star/paper 三主题截图与材质切换正常。
7. **真 GPU 帧率**（Intel Arc D3D11，headless 不强制 SwiftShader，430×932 dpr2，auto 10 个引擎动作 29.6s）：
   `164.5fps / avg 6.08ms / p95 6.2ms / max 24.1ms / >25ms 长帧 0% / quality=high`；
   drawCalls 16–47，triangles 1.9k–4.1k。SwiftShader headless 仅相对参考（5–10fps），不作真机结论。
8. **截图**（`shots/v8/prod3d/`）：`01-overview-430/390/320`、`02-roll-*`、`03-choose-*`、`04-focus-*`、`05-fly-390`、`06-cell45-320`、`07-bear-prompt-*`、`08-after-done-*`、`09-theme-star/paper-430`、`10-reduced-430`、`10b-reduced-toggle-430`、`11-reduced-prompt-430`、`12-stack-430`、`13-perf-end-430`、`14-long-overview-430`、`15-gpu-perf-430`。
9. **真实 table 集成（390×844，`board3d=on`，build3d 构建产物）**：
   - overview：`.v6-board3d` host **366×552**，棋盘 **315.8px = host 宽 86.3%**（`radius=14.54`）。
   - 真实引擎 `forceDie(6)→选子→forceDie(2)`：阶段 `fly`（`radius=3.05, phase=fly`）→ `cell45` → `bear`；真实 `App.CellStage` 打开，`phase=bear, holding=true`，相机停住；持卡 1.2s 后仍 `bear`。
   - 题卡：真实题库「真心话 · 这张给 他」「你幻想过的深夜冒险地点是哪里？」；做了后 `heat 0→8、cards 0→1`，3D 回桌 `radius=14.04 / 86.3%`。
   - 320×568 host 296×303 → 棋盘 **85.8%**；430×932 host 406×640 → **86.3%**；0 console error/pageerror。
   - 截图：`shots/v8/prod3d/table-real/R0-overview-390x844.png`、`R1-fly-390x844.png`、`R2-cell45-390x844.png`、`R3-bear-hold-card-390x844.png`、`R4-after-done-390x844.png`、`R5-overview-320x568.png`、`R5-overview-430x932.png`；数据 `table-real/report.json`。
10. **table3d 独立复跑（最终源码重建后）：53/53 PASS**（其 chunk `assets/board3d.9dc51f0f.js`，152.3KiB gzip，包含本轮 entry/scene/director 修改）：
   - 构图：ring 半径中心距 299px = **81.7% host 宽**（按外盘换算 ≈86%，与我方 315.8px/86.3% 外盘口径一致）；320/390/430 全过；顶部天空带/桌沿硬边消失。
   - hold/return：真实 move→prompt 阶段链 `idle→roll→focus→fly→land→cell45→bear`，持卡 `phase=bear/holding`；做了后命中 `returnToOverview` 主路径（`returnCalls=1 / emptyPlays=0`），回 idle；stub 兜底 `play([])` 仍有覆盖。
   - layer 唯一：宿主 `[data-test=board3d]` / `board3d-layer` / `board3d-canvas` 各 1 个，Playwright strict 安全；skip 8ms、`_debug().probe` 正常。
   - 题卡开合 552→600→533 的 refit 时序验证通过，0 console error/pageerror。
   - 证据：`shots/table3d-v8/selftest-real-result.json`、`shots/R1-real-3d-390x844.png`、`shots/R8-real-3d-move-prompt-390x844.png`、`shots/R8-real-3d-after-return-390x844.png`。

## 5. 偏差（明确说明）

| 项 | 状态 |
|---|---|
| 3D chunk ≤140KB gzip | **未达成**：最终源码实测 **153.3 KiB gzip**（build3d chunk 152.3 KiB）；原因是 three r180 WebGLRenderer 本身 132–136 KiB。已向 build3d/Lead 报告，建议预算 ≤160 KiB；**未**通过删渲染能力硬压（会破坏 3D）。 |
| 3D 内容卡/小游戏内部 | **未做**（冻结单 P2）：文字仍 DOM，3D 只做 cell45+bear；题卡/小游戏由 table 的 CellStage/MiniGame 负责。 |
| 3D 机舱全景/自由视角 | **未做**（冻结单 P2）；当前机舱小桌板+背景，V7 CabinScene 保留降级。 |
| 音效 | `setSound` 代码路径已接入（骰子/风/落地/击落/小熊/收尾合成音），headless 为避免自动播放策略未验证实际出声 → **待真机**。 |
| 真机性能 | 真 GPU headless 数据达标；**未在真实手机验证**（帧率/发热/省电）→ 标注待 QA/真机。 |
| table 联调 | **已完成并复跑通过**：prod3d 真实包 390×844（overview 86.3% host 宽、fly/cell45/bear 持卡、回桌 86.3%、320/430 85.8–86.3%、0 error）；table3d 按最终源码重建后 **53/53 PASS**（含构图/hold/return/layer 唯一/refit 断言）。证据：`table-real/`、`shots/table3d-v8/selftest-real-result.json`。 |

## 6. 遗留 / 下一步

1. build3d：按 ≤160 KiB gzip 验收 + SW 预缓存；chunk 内容哈希/离线由构建负责。
2. table3d：只需复跑其 35 用例确认 `board3d-layer` 改名不冲突；构图/持卡已在真实包验证（本轮已修）。
3. QA：按 `data-3d-phase` 加 V8 断言；截图建议 CDP captureScreenshot 兜底（SwiftShader 下 `page.screenshot` 偶发超时），或 `?adapt=0&reduced=1` 取静态帧。
4. Doc：README/DESIGN/spec/release-notes 的 V8 段由 doc owner 汇总（本模块 API/限制见 README）。
5. 真机验证音效/发热/低端机自适应降级；如需要，可评估 named-import 定制 three 构建（仅省 ~1–5 KiB gzip，不建议本版做）。

## 7. 约束遵守

- 未改 table/build/引擎/题库/构建脚本；未 `git commit`。
- three 只进独立 chunk（源码静态 import，构建由 build3d 产出；demo 直接 ESM 引源码，不产出首屏资源）。
- canvas/layer `pointer-events:none`，DOM HUD/题卡/安全词不被拦截。
- 本交接单与代码均在写作用域内；截图/报告在 `shots/v8/prod3d/`（证据目录）。
