# V9.3 摇骰「手拿起 → 抛出 → 物理弹跳 → 落棋盘中间」交接单（FE·3D / task-54）

日期：2026-11-19 · 代码根：`couple-game/` · 状态：**DONE / 已冻结**
提交：lead 已合并为 `eaa8adb`「V9.3.0：一只手拿起骰子→抛向棋盘→真实物理弹跳→落棋盘中间」；
本轮未自行 commit，工作区对写作用域 5 个文件无未提交改动（`git status` 干净；唯一脏文件 `qa/v6/e2e_v6.py` 非本任务）。

## 1. 改动文件（写作用域内）

| 文件 | 改动 |
|---|---|
| `app/src/view/board3d/scene.js` | 手节点装配、`tossDie` 完整编排、240Hz 轻量刚体预演、落定 slerp、`setDieVisible`、`dieDebug`；`DIE_HOME` 改为 `(0.84, 0.208, 0.53)` |
| `app/src/view/board3d/director.js` | `_phaseRoll` 相机与抛骰并行（560ms 推近）；`_roll()` 对准新落点 + 按 host 纵横比自适应距离；`Sfx.diceLand(speed)`；聚焦/飞行/格子舞台时隐藏骰子、回俯瞰再显；`debug()` 带骰子状态 |
| `app/src/view/board3d/parts.js` | 新增 `makeHand()`：掌/4 指/拇指/腕口/前臂（皮革 + 布袖）；4 draw / 480 tris |
| `app/src/view/board3d/constants.js` | 新增 `DIE_FLOOR`、`DIE_HOME_POS`（并注释落点选择依据） |
| `app/src/view/board3d/textures.js` | 未改 |

未改：table/UI/audio/entry/camera/zoom/构建/引擎；未 commit。

## 2. 实现要点

**手（程序化低模，电影机舱飞行手套）**：掌垫 + 指根垫 + 腕口（皮革，1 draw）+ 4 指合并（带指缝/外张、两节 + 圆指尖，1 draw）+ 拇指（1 draw）+ 前臂/袖（布，1 draw）。
`setGrip(0..1)` 手指/拇指 pivot 合拢；从画面右侧进入 → 下沉 → 合拢 → 托起 → 甩出 → 退出。
手与骰子均 `castShadow/receiveShadow`，抓握时掌心离骰顶 ~6mm，手指/腕口最低点仍高于盘面，不穿棋盘。

**骰子轻量刚体**：位置/速度/四元数/角速度；重力 8.6、桌面碰撞（支撑半高按四元数取立方体最低点，倒角/翻滚时不穿盘面）、恢复系数 0.47/0.42/0.37 + 种子抖动、切向摩擦 0.74/0.70/0.66、角速度阻尼、圆形边界（R=2.78）反弹；240Hz 预演、运行时按帧采样。落点固定在棋盘中心附近空位，最后 320ms 位置收敛 + slerp 到「面=点数、平躺」的最近 yaw 朝向（四选一，翻动量最小）。

**编排**：`tossDie(value, instant, hooks)` 内部完成 hand→throw→physics→settle；`reduced/instant` 直接 `placeDie`；返回 Promise 不阻塞其它事件。全程 2.40s（≤2.5s）：手进入 260 + 下沉 80 + 合拢 110 + 托起 260 + 甩出 130（840ms 出手）+ 物理 1.22–1.54s（含 320ms 落定段）。
`director._phaseRoll`：相机推近 560ms 与手/骰子并行 → roll 段总时长 ≈2.4s。
音效：出手 `Sfx.dice()`，每次弹到盘面 `Sfx.diceLand(speed)`，落定 `tick()`（director 内部合成，未改 table/audio）。
聚焦/飞行/落地/45° 舞台时骰子（含接触影）隐藏（棋盘会旋转平移，骰子是世界坐标），回俯瞰恢复；reduced 不参与镜头链，骰子常显静态。

## 3. 4 帧 × 3 尺寸证据（`shots/v9.3-dice/`）

冻结动画时刻抓帧（避免 headless 低帧误差）；骰子初始点数 4，最终 top=4=value。

| 尺寸 (host) | 手拿起 t=720ms | 抛出 t=960ms | 弹跳 t=1320ms | 落定 |
|---|---|---|---|---|
| 390×844 (366×557, aspect .657) | `390x844-hold.png` 手在手举高，die=(.560,.900,.390) hand=true 59 draw/10,556 tris | `390x844-throw.png` die=(.591,.686,.391) 手在右侧 hand=true | `390x844-bounce.png` die=(.846,.401,.519) hand=false 55/10,076 | `390x844-settled.png` die=(.84,.208,.53) top=4 hand=false |
| 320×568 (296×298, aspect .993) | `320x568-hold.png` 同上、手 NDC(-.123,.538) | `320x568-throw.png` 手 NDC(.762,.356) | `320x568-bounce.png` | `320x568-settled.png` |
| 430×932 (406×645, aspect .629) | `430x932-hold.png` 手 NDC(-.185,.511) | `430x932-throw.png` 手 NDC(1.136,.336) | `430x932-bounce.png` | `430x932-settled.png` |

画质：high 全部可见；320 另抓 `320x568-hold-low.png`（low：55 draw / 10,550 tris，手 NDC(-.084,.513)）、`320x568-hold-medium.png`（medium：57 draw / 10,554 tris，手 NDC(-.091,.538)）。
（low/medium 图是测试夹具直接驱动 3D play，HUD 文本为上一条 forced roll 留下的「掷出 6」，非 3D 状态。）

真实主桌联动（`__V6_TEST__.forceDie(6)` → 点「掷骰」）：`390x844-table-roll.png` / `390x844-table-settled.png`（320/430 同名）——roll 阶段被观测到（rollPhase=true），HUD「掷出 6」。

## 4. 最终骰面 = 引擎点数（程序验证）

- 直接 `App.Board3D.play([{type:'dice',die:4}])`（3 尺寸 × 4 帧）：`probe.die = {value:4, top:4, up:1.0000, atHome:0, hand:false, tossing:false}`。
- 真实主桌 forceDie(6) 点击掷骰：`state.rollContext.die = log.kind='roll'.die = 6`；3D `probe.die.top=6, up=1.0, atHome=0`。
- 骰面映射/落定函数未改语义（DIE_FACES / dieSettleQuat），只把落定从「倾斜 30.7°」改成「平躺 + 最近 yaw」：顶面即点数、重心高度=半边长（消除旧姿态角点穿盘）。
- 未验证项：真机像素级读数；以程序化 `top/up` 为准。

## 5. 物理/时长/性能/体积

- 物理（`phys-probe.json`）：total 2400ms；release 840ms；settle 2060→2380ms（320ms，slerp 翻动角 50.2°）；落定前物理时刻：弹跳 #1 1136ms（速度 3.00）、#2 1419ms（1.08），之后滑动到 2060ms 开始落定；restAt 1.521s（相对出手）。
- 手模型：**4 draw / 480 tris**（≤8 / ≤3k）；4 个 mesh（掌/指/拇指/袖）。
- 3D draw/tris：overview 84 / 13,304；roll 段 55–59 / 10,076–10,556（预算 draw≤90、tris≤20k）。
- 构建：`dist/v93`（= `dist/v93-final` 同哈希，源为当前 HEAD）；`--check --budget-3d 210` **49/49 GREEN**；
  3D chunk `assets/board3d.dafa9488.js` raw 674.1KB / **gzip 178.7KB ≤210KB**；index 139.2/140KB；首屏总 179.6/180KB。
- 控制台：0 console error / 0 pageerror；唯一 warning 是 `[table] 3D play 超时，先纠偏`（table.js 自带 12s 兜底，headless SwiftShader 仅 2–4fps 时触发；3D 动画 clock 沿用场景 dt≤120ms 的既有口径，真机 60fps 下总时长 2.40s）。

## 6. reduced 静态

`reduced-390x844-a.png` / `-b.png`（只裁 3D 宿主）：`reduced=1`，`raf=0`，`placeDie(5)` 后 `probe.die={value:5, top:5, up:1, atHome:0, hand:false, tossing:false}` 前后完全一致；两张 PNG 在 815,448 像素中仅底部 26px 有 ±1 灰阶差异（截图裁切取整），3D 画面实质静止。

## 7. 已知偏差 / 遗留

1. **手模型风格**：程序化低模「飞行手套」色块，近看仍偏方块（指节/拇指细节有限）；按任务卡「优先保轮廓/节奏」取舍，未做皮肤/法线贴图。
2. **落点**：采用 `(0.84, 0.53)`（半径≈1.0，黄/蓝进航格之间的空盘面），不是任务卡建议的 `(0.55, 0.9)`——后者与蓝进航内格边缘擦边（净距≈0），实测新落点到进航格/中心鼓/机库最小间隙 ≥0.30。
3. **物理是 2.5D**：平面 + 圆形边界，不做与中心鼓/机库/棋子的真实碰撞；轨迹调在安全楔形内（半径 0.6–1.3、121°±），避免穿格。
4. **低端/低帧**：画面 <8fps 时场景动画 clock（dt 上限 120ms）会拉长墙钟时长（headless 实测 ~4.4s），真机 60fps 为 2.40s；未做真机 GPU fps 测试。
5. 落定后骰子平躺、yaw 取「最近 4 朝向」之一并保留到下一次 `placeDie`（避免 roll 结束 setState 时朝向跳变）。
6. 意图性行为：focus/fly/land/cell45 阶段骰子隐藏（棋盘旋转平移，骰子世界坐标固定），回俯瞰恢复。

## 8. 复现命令

```powershell
$py='C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'
& $py tools/rebuild/build_app.py --out dist/v93 --check --budget-3d 210
node shots/v9.3-dice/dice_cdp.mjs          # 3 尺寸 × 4 帧 + 真实主桌 + low/medium + reduced
node shots/v9.3-dice/probe_phys.mjs        # 手 draw/tris + 弹跳时刻/落定角/total
```

证据文件：`shots/v9.3-dice/report.json`（全部帧/度量）、`phys-probe.json`、`run.log`、`sim2.mjs`（落点/初速调参）、`dice_cdp.mjs`/`probe_phys.mjs`（测试脚本）。
