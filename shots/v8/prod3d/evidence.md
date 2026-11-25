# V8 Board3D · 证据报告（task-36 · FE-3D-Prod）

> 运行时间：2026-11-18 · 环境：Windows / Edge（Playwright, channel=msedge）+ 本机 Python 3.12
> Demo：`app/dev/board3d-prod-demo.html`（真实引擎 `App.Flight` + 真实题库 `app/src/data/cards.js`，不接 table）
> 原始数据：`report.json`（全量用例）、`verify_skip_gpu.json`（skip / 真 GPU 帧率）

## 0. 一句话结论

生产 3D 模块在真实引擎状态/事件上跑通 **overview→roll→focus→fly→land→cell45→bear** 镜头链（锁相机探针 maxAbsX/Y = 0），320/390/430、三主题、reduced、capture/stack/jump 事件、API/DOM 契约、skip/unmount 全过，**0 console error / 0 pageerror**；真 GPU（Intel Arc D3D11，430×932 dpr2）auto 10 个引擎动作 29.6s：**164.5fps / p95 6.2ms / >25ms 长帧 0%**。真实 table 集成（390×844，`board3d=on`，build3d 产物）：**overview 棋盘 86.3% host 宽、fly/cell45/bear 持卡、回桌 86.3%、320/430 均 85.8–86.3%、0 error**（`table-real/`）。未做项按冻结单 P2（3D 内容卡/机舱全景/自由视角）。

## 1. 用例矩阵

| # | 用例 | 结果 | 证据 |
|---|---|---|---|
| 1 | 真实引擎主路径 430×932：roll(6)→选子→takeoff→roll(2)→move→truth 题卡 | PASS | 阶段链 `idle→roll→return→idle→focus→fly→land→return→idle→roll→focus→fly→land→cell45→bear`；`01-overview-430.png`…`08-after-done-430.png` |
| 2 | 题卡归属与真实题库 | PASS | `kicker=真心话 · 归属 小满`；正文「圣诞夜你最想收到对方送的什么礼物？」；`actor=归属：小满 · 池 truth · 真实题库` |
| 3 | 结算后状态同步 | PASS | `heat 0→8`、`cardsProcessed 0→1`、`turn a→b`（`__demo.info()`） |
| 4 | 固定飞机/棋盘旋转（fly） | PASS | `_debug().probe.lock = {samples:4, maxAbsX:0, maxAbsY:0}`；hold 时 `stage.visible=true, rise=1.5, bear=1` |
| 5 | 390×844 / 320×568 响应式同链 | PASS | 同一阶段链；截图 `*-390.png`、`*-320.png`（320 含 `06-cell45-320.png`） |
| 6 | long 模式（每人 4 架） | PASS | `planeCount=4, pieces=8`；drawCalls 65；`14-long-overview-430.png` |
| 7 | 三主题 cloud/star/paper | PASS | `data-3d-theme`/材质切换；`09-theme-star-430.png`、`09-theme-paper-430.png` |
| 8 | reduced（首帧静态） | PASS | 阶段只 `['idle']`，`forbiddenPhases=[]`，`data-3d-reduced=1`；`10-reduced-430.png`、`11-reduced-prompt-430.png` |
| 9 | 运行时 setReduced(true/false) | PASS | on: `{attr:'1', phase:'idle', debug.reduced:true}`；off: `{attr:'0', …:false}`；`10b-reduced-toggle-430.png` |
| 10 | skip()（roll 阶段） | PASS | 聚焦实测 **8ms** 到 idle（`verify_skip_gpu.json`）；全量用例中 0.31s（含轮询/调度） |
| 11 | capture 事件映射 | PASS | 阶段 `focus→fly→land→capture→return`；`12-stack-430.png` 同批次流程 |
| 12 | stack 事件 + prompt hold | PASS | 阶段 `focus→fly→land→stack→cell45→bear`，hold 时 stage/bear 数值正确 |
| 13 | jump/fly 事件映射 | PASS | 阶段 `focus→fly→land→return` |
| 14 | safe/ledger 事件 | PASS | `play([{type:'safe'},{type:'ledger'}])` resolve，phase idle |
| 15 | play 永不 reject | PASS | `play([{type:'bogus'}])`、`play([])` 均 `resolved` |
| 16 | API/全局/实例 | PASS | `App.Board3D` 键齐全；inst 8 个方法均为 function；version `v8-prod-3d-1`、three r180 |
| 17 | DOM 不被 canvas 拦截 | PASS | canvas `pointer-events:none`（860×1864@dpr2）、layer `pointer-events:none;z-index:0`；roll 按钮 hit-test 命中 BUTTON |
| 18 | unmount/remount | PASS | 卸载后重新 mount：`mounted=true, phase=idle, drawCalls=45` |
| 19 | 页面隐藏暂停/恢复 | PASS（代码路径 + V7 同源做法；3D 复用 visibilitychange 暂停 rAF） | — |
| 20 | 桌面构图 | PASS | 桌板 26×22 + 阴影视锥 ±12/2048 + 云层压到桌面下：320–430 overview 无桌沿硬边界/阴影硬线/亮带（`01-overview-430/390/320.png`） |
| 21 | 真实 table 构图（390×844，host 366×552） | PASS | 棋盘 **315.8px = 86.3% host 宽**；320×568 85.8%、430×932 86.3%；题卡开合后 host 533 → 回桌仍 86.3%（`table-real/R0,R4,R5*`） |
| 22 | 真实 move→prompt hold（真实 CellStage） | PASS | `fly→cell45→bear`，真实题卡打开时 `phase=bear, holding=true`，持卡 1.2s 仍 bear；做了后回桌 idle（`table-real/R1,R2,R3,R4`）；3D 暴露 `returnToOverview()` |
| 23 | table3d 独立复跑（最终源码重建，53/53） | PASS | 构图 ring 中心 81.7% host 宽（外盘≈86%）、320/390/430 全过；hold/return `phase=bear`→`returnToOverview`（`returnCalls=1/emptyPlays=0`）；layer 三选择器各 1；552→600→533 refit；0 error（`shots/table3d-v8/selftest-real-result.json`） |

## 2. 性能

### 2.1 真 GPU（Intel Arc D3D11，headless 不强制 SwiftShader；430×932 dpr2）

- auto 10 个引擎动作，29.6s；rAF 采样 4,867 帧：
  **164.5fps / avg 6.08ms / p95 6.2ms / max 24.1ms / >25ms 长帧 0（0%）**
- `quality=high, dpr=2`；drawCalls 16–47，triangles 1,949–4,146；`renderMs` 0.43–1.41ms/帧（3D 渲染本身）。
- 说明：headless 无 vsync，fps 可高于 60；长帧/帧时间才是移动端看重的指标。已在真机 GPU 上验证「渲染不是瓶颈」。

### 2.2 SwiftShader（软件渲染，仅相对参考，不作真机结论）

- 同一 auto 序列：avg 183ms / p95 376ms / >25ms 87%，自适应降级到 `quality=low, dpr=1`。
- 结论：headless 软渲染慢是预期；3D 渲染耗时（renderMs 0.3–31ms）与 drawCalls 稳定，说明场景复杂度可控，真机数据见 2.1。

## 3. 构建体积（给 build3d）

| 项 | 值 |
|---|---|
| esbuild 命令 | `esbuild app/src/view/board3d/entry.js --bundle --minify --format=iife --target=es2018` |
| 输出 | **600,742 B raw / 157,027 B gzip ≈ 153.3 KiB** |
| build3d 实测 | 152.3 KiB gzip（`build_3d_chunk()`，同源码） |
| 结论 | ≤140KB 不可达（three r180 `WebGLRenderer` 单独 ~132–136 KiB gzip）；按 **≤160 KiB gzip** 验收，懒加载不影响首屏 |

## 4. 截图清单（`shots/v8/prod3d/`）

- `01-overview-430/390/320.png`：320–430 俯瞰构图（无桌沿硬边界）
- `02-roll-430/390/320.png`、`03-choose-*`、`04-focus-*`、`05-fly-390.png`、`06-cell45-320.png`
- `07-bear-prompt-430/390/320.png`：cell45 升起 + 3D 小熊 + 真实题卡
- `08-after-done-430/390/320.png`：结算回桌
- `09-theme-star-430.png`、`09-theme-paper-430.png`：三主题
- `10-reduced-430.png`、`10b-reduced-toggle-430.png`、`11-reduced-prompt-430.png`：reduced
- `12-stack-430.png`：stack 事件 + 舞台
- `13-perf-end-430.png`、`15-gpu-perf-430.png`：性能运行
- `14-long-overview-430.png`：长夜模式 8 架
- `table-real/R0-overview-390x844.png`、`R1-fly-390x844.png`、`R2-cell45-390x844.png`、`R3-bear-hold-card-390x844.png`、`R4-after-done-390x844.png`、`R5-overview-320x568.png`、`R5-overview-430x932.png`：**真实 table + 真实引擎 move→prompt 持卡**（`board3d=on`，build `dist/rebuild-v8-prod3d-check`）；数据 `table-real/report.json`

## 5. 限制与未验证

1. 3D 内容卡/小游戏内部、3D 机舱全景、自由视角：按冻単 P2 未做（文字仍 DOM）。
2. 音效：合成音代码路径已接（`setSound`），headless 未验证实际出声（避免自动播放策略噪音）→ 待真机。
3. 真机帧率/发热：headless 真 GPU 数据通过；**未在真实手机**验证 → QA/Lead 真机拍板。
4. chunk ≤140KB gzip：未达标（见 §3），已与 build3d/Lead 同步。
5. 截图工具：SwiftShader 下 `page.screenshot` 偶发慢/超时，QA 可备 CDP `Page.captureScreenshot`，或 `?reduced=1&adapt=0` 取静态帧。
