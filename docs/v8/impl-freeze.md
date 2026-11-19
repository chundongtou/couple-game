# V8 真 3D 主桌冻结单（P1 生产接入）

> 用户拍板：**全部 3D**；固定飞机+棋盘旋转的飞行错觉；45° 格子 + 3D 小熊 + 右侧内容卡。
> P0 原型已上线预览（`app/dev/board3d-demo.html`），证据：飞机 NDC 恒 0、棋盘 θ/位移在变；three r180 本地可用。
> 本冻结单定义 **生产接入**，不做「一次性全换」；V7 保留降级。

## 1. 原则

- **V7 不动**：现有 SVG/Cinema/CellStage 继续可用；V8 是新增 3D 视图，按开关/能力启用。
- **首屏不变**：3D + three 不进首屏 bundle；独立 chunk 懒加载，PWA 预缓存，离线可用。
- **引擎不动**：只消费 `App.Flight` 的 state/view/events；规则/题卡/存档不变。
- **HUD/题卡仍 DOM**：可读性、无障碍、长文本、QA 复用；3D 只做棋盘/飞机/骰子/格子/小熊。
- **失败回落**：WebGL2 不可用 / chunk 加载失败 / 首帧过慢 / reduced → V7 SVG 主桌，用户无感。

## 2. 3D 范围（P1）

必须：
- 3D 圆形棋盘：52 环格 + 4 机坪 + 4×5 步航线 + 中心终点；格面图标/短标签用 CanvasTexture。
- 低模纸飞机（红/黄各 2/4 架，按 mode）；3D 骰子；桌板/阴影/云海基础环境。
- 镜头链：overview → roll → focus（对准当前飞机）→ fly（**飞机固定、棋盘旋转+平移**，目标格到机腹下方）→ land → cell45（格子升起、3D 小熊探头）→ return。
- 3D 小熊：低模（球/圆柱），随主题换装（pilot/starlight/paper）。
- 状态/事件：`setState(state, view)`、`play(events)`；支持 takeoff/move/jump/fly/capture/stack/dice/prompt。
- 主题：cloud/star/paper 材质/灯光；`setTheme`。
- reduced：静态 3D 棋盘 + 淡入，不转镜头。
- 320–430 适配；DOM HUD/题卡/安全词始终最上。

暂不做（P2）：
- 3D 机舱全景（先保留 V7 机舱作为背景/或简单桌板环境）。
- 3D 内容卡（文字仍 DOM）。
- 3D 小游戏/命运二选一内部（沿用 DOM CellStage/MiniGame）。
- 自由视角/手势旋转（只做导演镜头）。

## 3. 技术结构

### 3.1 3D 子包（懒加载）
- 入口 `app/src/view/board3d/entry.js`：`import * as THREE from '../../../render/node_modules/three/build/three.module.min.js'`（构建时 tree-shake）。
- 构建产出 `assets/board3d.<hash>.js`（IIFE，暴露 `window.App.Board3D`）；index 注入 `window.__BOARD3D_URL`。
- 构建脚本新增：独立 esbuild（bundle/minify/format=iife/target=es2018），哈希、SW PRECACHE、离线。
- 首屏 budget 不变；3D chunk 目标 ≤140KB gzip（tree-shaken three + 场景）。

### 3.2 生产 API
```js
App.Board3D = {
  mount(host, {reduced, theme, state, view, mode}) -> Promise<inst|null>,
  setState(state, view),          // 同步棋子/热度/当前玩家
  play(events, opts),             // 与引擎事件对齐；返回 Promise，永不 reject
  setTheme(id), setReduced(flag), setSound(flag),
  skip(), unmount(),
  _debug() -> {ready, phase, pieces, target, fps, drawCalls}
};
```
- `mount` 不阻塞：先加载 chunk，失败返回 null，table 回落 V7。
- 3D canvas `pointer-events:none`（交互仍走 HUD/棋盘 DOM？P1 先只渲染，选子按钮在 HUD）。
- 题卡/收尾由 table 打开 `App.CellStage`；3D 只负责 `cell45/bear` 镜头与格子/小熊。

### 3.3 table 集成
- 新增 `settings.board3d`（默认 `auto`）：`auto` = WebGL2 可用且非 reduced → 3D；`off` → V7；`on` → 强制尝试 3D（失败回落）。
- 门厅/设置加「3D 主桌（Beta）」开关（P1 可先只在设置页）。
- 现有 `mountBoard/cinema/cabin/cellstage` 保留；3D 启用时：
  - 隐藏 `.v6-board`/CabinScene/Cinema 的视觉层（HUD 不动），挂载 3D canvas 到 `.v6-boardwrap`/专用层。
  - `commit` 调 `Board3D.play(events)` 替代 BoardView+Cinema；`render` 后 `setState`。
  - `openPrompt` 仍 CellStage；`returnToOverview` 由 3D 相机处理。
- 关闭时完全回 V7，零回归。

### 3.4 构建/测试
- `tools/rebuild/build_app.py`：`build_3d_chunk()`；`--with-3d`（默认生产开启）；`--check` 增加 chunk 存在/哈希/SW/预算。
- QA：WebGL2 headless（SwiftShader）能挂载；无 WebGL 回落 V7；chunk 404 回落；reduced 静态；320–430；拍照；性能只在真机可信（报告标注）。
- 视觉：V8 3D 截图单独基线；V7 基线不变。

## 4. Owner / 写作用域
| owner | 作用域 |
|---|---|
| fe3d-prod | `app/src/view/board3d/**`、`app/dev/board3d-prod-demo.html` |
| build3d | `tools/rebuild/build_app.py` |
| table3d | `app/src/ui/screens/table.js`、`app/src/ui/screens/settings.js`/`boot.js`（仅开关） |
| qa | `qa/v6/**` |
| doc | README/DESIGN/spec/release-notes |
| lead | 构建、发布、线上冒烟、`.devteam/` |

**禁止**：改引擎/题库；把 three 塞进首屏；3D 拦截 HUD/题卡；reduced 失效；git commit。
