# V6.2 沉浸主桌「夜航机舱」冻结单（2026-11-18）

> 用户拍板：世界观 = **机舱**；镜头 = **全动态（跟拍 + 震动）**；范围 = **直接全量**。
> 目标：让主桌从「漂在夜空里的棋盘」变成「夜航客舱里，小桌板上的一盘飞行棋」。

## 1. 体验目标

- 进入主桌即看到：客舱舱壁/舷窗/顶灯/小桌板；棋盘像放在小桌板上的一盘实体棋。
- 所有棋局事件都有画面回应：掷骰、走子、跳/飞、击落、叠机、题卡、换手、热度升级、收家。
- 镜头是活的：掷骰轻推、走子跟拍、击落震动、换手移向当前玩家、赢家拉远看日出。
- 不牺牲可读性：52 格、机坪、航线、中心热度环仍然清晰可点；环境只在四周和背后。
- 性能：中端手机 60fps 目标；减少动画时关闭镜头/震动、粒子减半；页面隐藏时暂停。

## 2. 画面构成（全屏，竖屏 320–430）

层级从后到前：

1. **客舱背景**：深靛/酒红舱壁、竖向壁板接缝、顶部行李舱弧线、暖色阅读灯、底部座椅靠背剪影；轻微噪点。
2. **两扇舷窗**（左右上侧）：圆角窗框、遮光板、窗外夜空；Canvas 云层 + 星星 + 机翼灯闪烁；热度/收家时窗外从夜航过渡到晨光。
3. **小桌板**：棋盘下方一块有厚度的浅木/象牙色桌板，带边缘高光与投影；棋盘放在上面，有接触阴影。
4. **棋盘**：现有 SVG 2.5D 棋盘，保持 92 格/棋子/热度环；不做视觉重排。
5. **光效层**：阅读灯锥形暖光落在桌板与棋盘上；舱灯随热度变暖/变暗；击落时闪白；收家时顶部灯带亮起。
6. **前景层**：暗角、玻璃反光、灰尘/星尘粒子、座椅边缘；`pointer-events:none`。
7. **UI 层**：HUD/回合条/行动区/题卡/安全词保持现有 z-index 与位置，不下移、不遮挡。

## 3. 动画清单（必须实现）

### 3.1 待机
- 云层水平缓慢漂移；星星闪烁；机翼灯每 2.4s 亮一次。
- 阅读灯呼吸（4.5s）；舱壁有极轻的明暗变化。
- 灰尘/星尘缓慢上浮；棋盘整体极轻浮动（±1px，仅非 reduced）。
- 棋盘热度环呼吸；当前玩家机坪微光。

### 3.2 掷骰
- 镜头：推近到 `scale 1.03, translateY -4px`，260ms 进入，900ms 后回位。
- 骰子：现有 3D 翻滚保留；舱灯轻闪一次；桌面阴影随骰子高度变化。
- 震动：轻（haptic 10ms）；reduced 时无镜头、无震动。

### 3.3 走子/起飞/跳/飞
- 镜头跟拍：读取事件路径终点格，计算其在棋盘上的相对位置，向该方向平移 6–12px、`scale 1.02`，500ms 跟随，700ms 回位。
- 棋子：现有 hop/弧线保留；落点格光晕 + 桌板轻涟漪；起飞时窗口云层向后加速 400ms。
- 跳/飞：镜头轻微仰角（rotateX 0.6deg）与平移；飞行时窗外星光拉线。

### 3.4 击落
- 镜头震动：`translate ±6px, rotate ±0.4deg`，320ms；同时窗口闪白、舱灯闪一下。
- 被击落棋子：现有回坪动画保留；桌面出现一圈红色波纹。
- 震动：重（haptic 38ms）。

### 3.5 叠机
- 镜头轻微推近 + 心形脉冲光；两架棋子靠拢；无震动。

### 3.6 换手
- 镜头平移向当前玩家一侧（a 左 / b 右，±8px），600ms；座位侧阅读灯亮起；上一侧灯暗下。
- 回合条保持不动（UI 不跟镜头）。

### 3.7 题卡/小游戏
- 镜头拉远到 `scale 0.99` 并压暗 0.92；桌面聚光灯落到落点；题卡仍从底部飞入。
- 卡片关闭后恢复。

### 3.8 热度/情绪
- `heat` 事件：阅读灯从琥珀→玫瑰；舱壁渐暖；窗外星星变多；热度跨阶段时窗口云层散开一点。
- 收家（win）：镜头拉远到 `scale 0.97`，窗外从夜航变日出（8s 渐变），顶部灯带亮起，星尘落下。
- 安全词/结束：镜头缓慢回正，灯光降到最暗，无庆祝特效。

### 3.9 减少动画
- `prefers-reduced-motion` 或 `settings.reduced`：关闭镜头移动/震动/浮动，粒子数量减半或静态，只保留 opacity/filter 的 100–200ms 过渡。

## 4. 技术结构

### 4.1 新模块 `app/src/view/cabin.js`
```js
App.CabinScene = {
  mount(host, opts) -> instance | null,
  // host: 全屏桌层（.v6-table 内）；opts: { boardEl, reduced, sound, names? }
  unmount(),
  setMood(mood),       // { heat, stage, turn, winner, phase, overlay }
  play(events, opts),  // 与 BoardView.play 并行；返回 Promise（永不 reject）
  setReduced(flag),
  setSound(flag)
};
```
- `mount`：在 host 内创建 `.cabin-root`（aria-hidden），内含背景/窗/桌板/光效/前景/Canvas；`pointer-events:none`；同时给 `boardEl` 加相机控制（不改 board.js 内部）。
- `play`：按事件序列编排镜头/光效，使用 `setTimeout`/rAF；可被 `unmount` 取消；reduced 时立即 resolve。
- 相机：只改 `boardEl` 的 `transform`（translate/scale/rotate）与场景层 CSS 变量；不改变布局，不拦截点击。
- 场景 Canvas：云/星/尘；DPR 上限 2；页面 `visibilitychange` 暂停；粒子数量按宽度/降低动画调整；空闲 30fps。
- 音效：可选，复用 `App.Audio`；不新增外部资源。

### 4.2 集成 `app/src/ui/screens/table.js`
- 结构：`.v6-table` 内新增 `<div class="v6-cabin" data-test="cabin"></div>`，`position:absolute; inset:0; z-index:0; pointer-events:none`；棋盘 wrap 提到 z-index:1，HUD/action 保持上层；`.v6-table` 背景透明或暗色兜底。
- `mount`：`App.CabinScene.mount(cabinHost, { boardEl, reduced, sound })`；缺失模块时主桌照常工作（降级 toast 可选）。
- `commit`：`playBoard(events)` 与 `CabinScene.play(events, { state })` 并行；`CabinScene.play` 失败/缺失不影响棋局。
- `render/paint` 后：`CabinScene.setMood({ heat, stage, turn, winner, phase, overlay })`。
- 设置：`setReduced/setSound` 转发。
- `cleanup`：`CabinScene.unmount()`。
- 现有 `BoardView` 的 `.is-shaking` 保留；场景震动在 cabin 层叠加，避免双重过度。

### 4.3 构建
- `tools/rebuild/build_app.py` 的 `JS_MODULES` 增加 `src/view/cabin.js`（放在 `ui/screens/table.js` 之前）。
- 首屏体积预算仍按 ADR-012（index gzip ≤140KB；新增代码预计 +15–30KB raw）。若超，cabin 场景可懒加载（P1）。

## 5. 验收标准（QA）

- `[data-test=cabin]` 存在；`pointer-events:none`；Canvas/DOM 层不拦截棋盘点击（52 格点击测试）。
- 掷骰/走子/击落/换手/收家各触发一次镜头 transform 变化（记录 `style.transform` 前后）；reduced 下无 transform、无 shake。
- 击落震动有视觉位移；收家后窗口/灯光进入日出态（截图对比）。
- 320/360/390/430 无横向溢出；HUD/题卡/安全词不被 cabin 覆盖（hit-test）。
- 0 pageerror/console error；20 次连续走子长帧（>25ms）≤5%；页面隐藏后 rAF 暂停。
- 视觉基线重新生成（V6.2 有意改变主桌背景），boot/prompt/ledger 基线仅在有变化时更新。
- 现有 V6.1 功能/E2E 全量回归通过。

## 6. Owner / 写作用域
| owner | 写作用域 |
|---|---|
| fe-cabin | `app/src/view/cabin.js`、`app/dev/cabin-demo.html` |
| fe-table3 | `app/src/ui/screens/table.js` |
| qa4 | `qa/v6/**`（E2E/视觉基线/性能） |
| doc3 | `README.md`、`app/DESIGN.md`、`docs/v6/release-notes.md`、`docs/v6/spec.md` 相关段 |
| lead | 构建、发布、线上冒烟、`.devteam/` |

**禁止**：改题库；新增露骨文案；相机遮挡/拦截棋盘；未经 reduced 处理；git commit（Lead 统一）。
