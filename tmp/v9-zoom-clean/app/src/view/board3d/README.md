# V8 · Board3D 生产 3D 主桌模块

> 真 3D 主桌（P1）。只渲染棋盘/飞机/骰子/格子/小熊；HUD、题卡、安全词、暂停仍由 DOM（table / CellStage / Pause）负责。
> 不接 table、不改引擎/题库/构建；three 独立 chunk 懒加载（`window.__BOARD3D_URL`），不进首屏。

## 1. 文件

| 文件 | 职责 |
|---|---|
| `entry.js` | 构建入口；`mount`/`unmount`/instance、全局 `window.App.Board3D`、状态/事件门面、`_debug` |
| `scene.js` | 渲染器/场景/相机锚点/灯光/桌板/棋盘/飞机/骰子/舞台/主题/热度/循环/自适应/释放 |
| `director.js` | 事件 → 镜头链（overview→roll→focus→fly→land→cell45→bear→return）、音效、skip/reduced |
| `camera.js` | CameraRig：look+NDC 解算、视角动画、focus/fly 锁相机、shake |
| `mapping.js` | `squareId` → 板坐标/朝向；环格/航线/机坪/终点；事件起点/终点 |
| `textures.js` | CanvasTexture 程序化生成（格面图集/盘面/云/星/纸纹/骰面/光斑/涟漪/速度线） |
| `parts.js` | 合并格几何、低模纸飞机、光斑/阴影/涟漪/速度线 |
| `bear.js` | 低模小熊 + 三主题服装材质 |
| `constants.js` | 拓扑/几何/主题/缓动/图集常量（与 `engine/flight-board.js` 同源只读） |

## 2. 构建入口（给 build） 

- 入口：`app/src/view/board3d/entry.js`
- three 静态 import（构建时 bundle/tree-shake）：`../../../render/node_modules/three/build/three.module.js`（**unmin 版**，esbuild 再 min 比直接 min 版小约 4.5 KiB gzip）
- 全局名：`window.App.Board3D`（模块求值即挂载；不依赖 `document.currentScript` / DOMContentLoaded / 任何相对资源/图片/字体/网络）
- 构建建议：esbuild `--bundle --minify --format=iife --target=es2018`
- 体积实测（2026-11-19，esbuild 同参数）：**600,742 B raw / 157,027 B gzip ≈ 153.3 KiB**；build3d 的 `build_3d_chunk()` 实测 152.3 KiB。
  - 结论：冻结单「3D chunk ≤140KB gzip」在 three r180 达不到（`WebGLRenderer+PerspectiveCamera+Scene` 的 named-import 最小包已 ~132–136 KiB gzip；全场景 +34 KiB）。建议按 **≤160 KiB gzip** 验收；chunk 懒加载，不影响首屏 137.7KB / 170.7KB 预算。
- 构建/table 侧约束：chunk 内联执行时 **不要** 依赖 `document.currentScript`；canvas 由模块自建（`pointer-events:none`）；DOM 层叠由宿主负责。

## 3. API（冻结单 §3.2）

```js
const inst = await App.Board3D.mount(host, {
  reduced: false,            // 系统/设置减少动画
  theme: 'cloud',            // cloud|star|paper（缺省读 App.Themes.get()）
  state, view,               // 真实 App.Flight 状态/投影（可选；没有则 2×2 默认）
  mode: 'quick',             // quick|long（仅无 state 时决定默认飞机数）
  sound: false,              // 用户设置的声音
  adapt: true,               // 低端机自适应降质（默认 true；截图/稳定基线可 false）
  stageAim: { nx: 0, ny: 0.15 } // 可选：45° 舞台在 host 内的 NDC 目标
});                          // -> Promise<inst|null>；WebGL2 不可用/初始化失败 -> null（不抛）
```

`inst` 与 `App.Board3D` 命名空间**同名方法都在**（table 优先用 `inst`）：

| 方法 | 说明 |
|---|---|
| `setState(state, view)` | 同步飞机位置/数量/颜色、骰子点数、热度、当前玩家；`busy`/`holding` 时棋子位置延后到链结束（骰子/热度/玩家即时）；缺字段降级 |
| `play(events, opts)` | 引擎原始 events 驱动镜头链；Promise **永不 reject**；可排队；`opts` 可为 `{kind:'roll'|'move'|'prompt'|'minigame', outcome}`（可选，仅调试/埋点用） |
| `setTheme(id)` | cloud/star/paper（材质/灯光/背景/小熊服装） |
| `setReduced(bool)` | true = 静态 3D（无镜头/无速度线/动画瞬时）；可在运行时切 |
| `setSound(bool)` | WebAudio 极简音效（骰子/风/落地/击落/小熊/收尾）；失败静默 |
| `skip()` | 立即快进当前镜头链到终态（实测 roll 阶段 **8ms** 到 idle） |
| `returnToOverview()` | 显式从 cell45/bear 回到俯瞰（table 的 CellStage 关闭后调用；不调用也行——下一次 `play()` 会自动回） |
| `unmount()` | 释放 WebGL/纹理/监听/图层，恢复宿主 `position`，可再次 `mount` |
| `_debug()` | `{ready, phase, pieces, target, fps, drawCalls, triangles, dpr, quality, reduced, theme, heat, turn, mode, busy, holding, cell, probe, perf, three}`；`probe` 含 fly 锁相机 NDC 采样 `{samples,maxAbsX,maxAbsY}`、棋盘 θ/位移、舞台/小熊/速度线 |
| `mounted` (getter) / `version` / `threeRevision` | 状态/版本（`v8-prod-3d-1` / three r180） |

## 4. 宿主/属性/DOM 契约

- 模块在 `host` 内创建：`div.board3d-layer[data-test=board3d-layer]`（absolute inset:0、`pointer-events:none`、`z-index:0`）+ `canvas[data-test=board3d-canvas]`（`pointer-events:none`）。
- 宿主属性（模块写入）：`data-3d-phase`、`data-3d-ready`、`data-3d-reduced`、`data-3d-theme`、`data-3d-mode`；失败时 `data-3d-fallback="no-webgl2" | "mount-failed"`。
- `data-3d-phase` 取值：`boot → idle → roll → return → focus → fly → land → cell45 → bear → win/return`（实际链随事件组合；题卡/小游戏时 hold 在 `bear`，下一次 `play()` 先回 overview）。
- DOM HUD/题卡/安全词/暂停不被 canvas 拦截（canvas/layer 均 `pointer-events:none`；已做 hit-test：roll 按钮命中按钮）。
- 320–430：ResizeObserver 跟随宿主尺寸，DPR≤2，`distForCover` 按纵横比自适应；桌板 26×22 保证 320/390/430 俯瞰不露桌沿硬边界。
- overview 取景按 **host 宽度**铺满（棋盘直径 ≈ host 宽的 86–87%，垂直居中）；table 的 `.v6-boardwrap` 在题卡开合时会改高度，模块在 resize / 链结束 / 350ms watch-dog 三处补 fit，回桌后仍保持 86% 宽。
- 云层全部低于桌面（y<0），避免从桌沿上方露出亮带；太阳阴影视锥扩到 ±12 / 2048，避免阴影相机矩形边界在桌面上留下硬线。

## 5. 事件映射

| event | 3D 行为 |
|---|---|
| `dice {die,pity?,extraRoll?}` | roll 镜头 + 骰子抛落并停在 `die` 面；无后续 move 时回 overview |
| `takeoff {pieceId,path}` | focus 机坪起点 → 固定飞机、棋盘旋转平移 900ms → land |
| `move {pieceId,path,mode}` | 逐格（环 165ms/格，航线 190ms/格）固定飞机 + 棋盘旋转；终点目标格光晕 |
| `jump/fly {pieceId,from,to}` | 锁定飞机、棋盘旋到目标格（540/840ms）+ 风线；reduced 无 |
| `capture {attackerId,victimIds}` | 落地后镜头轻震 + 击落音效；victim 从落点飞回机坪 700ms + 缩小消失 |
| `stack {pieceIds,at}` | 落点光晕脉冲 + 同格飞机弹跳 |
| `prompt {prompt}` / `minigame` | land → cell45（目标格升起 1.5）→ bear（小熊探头）→ **hold**；下一次 `play()` 自动回 overview |
| `win` / `ending-start` | 回 overview + win 阶段（暖场）；不出现输赢 DOM |
| `turn/heat/streak/milestone/safe/ledger` | 不入镜头链；`setState` 更新热度/玩家；`safe/ledger` 回 overview |

## 6. reduced / 性能

- reduced：mount 后一次静态帧；`play()` 只落终态，**不**产生 focus/fly/land/cell45/bear 阶段；无速度线/震动；页面隐藏暂停渲染。
- 自适应：连续慢窗口 → DPR=1 + 关阴影（`_debug().quality=low`）；可用 `adapt:false` 关闭。
- 实测（Intel Arc D3D11 headless，430×932 dpr2，10 个引擎动作 29.6s）：164.5fps / avg 6.08ms / p95 6.2ms / max 24.1ms / >25ms 长帧 0% ；drawCalls 16–47、triangles 1.9k–4.1k。
- 真实 table 集成（390×844，`.v6-board3d` = 366×552，board3d=on）：overview 棋盘 **315.8px = host 宽 86.3%**；fly 阶段 `phase=fly, radius=3.05`；题卡打开时 `phase=bear, holding=true`（真实 CellStage 打开、3D 停住）；做了后回桌 `radius=14.04 / 86.3%`；320×568=85.8%、430×932=86.3%；0 console error。截图：`shots/v8/prod3d/table-real/R0..R5`。
- SwiftShader headless 仅作相对参考（5–10fps），不作为真机性能结论。

## 7. 已知限制（P1）

- 3D 内容卡不做：题卡/小游戏文字仍 DOM（CellStage/MiniGame）；3D 只负责 cell45+bear 镜头与格子/小熊。
- 3D 机舱全景不做：当前为机舱小桌板 + 云海/星轨/纸雕背景；`CabinScene`（V7）保留降级。
- 自由视角/手势旋转不做（只做导演镜头）。
- 选子交互仍走 HUD/表格按钮（canvas `pointer-events:none`，不提供格位点选）。
- three chunk ~152KiB gzip（见 §2），目标 140KB 不可达；懒加载/预缓存由构建负责。
- 音效为合成占位，未做真机混音校准；headless 未验证 AudioContext 实际出声（避免自动播放策略噪音），`setSound` 代码路径待真机验证。
