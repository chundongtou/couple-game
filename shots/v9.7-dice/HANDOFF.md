# V9.7 参考实拍：白骰蓝/红点 + 浅肤色手捏握上挑抛出（FE·3D / task-58）交接单

状态：**DONE / 已冻结**（2026-11-21）· 代码根 `couple-game/` · 未自行 commit；lead 已提交 `3c81f50` V9.7.0（parts.js / scene.js / textures.js + 构建产物），工作区对 board3d 干净。
参考帧：`shots/ref-dice-hand/toss/crop-011.0.png`、`crop-012.0.png`、`contact-sheet.png`。

## 1. 骰子（参考实拍）
- **白/象牙白底**，2/3/5/6 **蓝点**、1/4 **红点**，圆点带高光/细描边；面边微阴影。
- **圆角/倒角**：BoxGeometry 6×6 细分 → 盒内缩 + 法向圆弧（半径 0.13×边长）；保留 DIE_FACES 面序，按 6 个 group 逐面重映射 3×2 图集 UV（修复细分网格 UV 被重复 remap 的坑）。tris 12→432，仍 1 draw。
- 尺寸仍 0.34（物理/落点不变）；最终骰面=引擎点数。
- 图集证据：`shots/v9.7-dice/die-atlas.png`（白底、蓝点 2/3/5/6、红点 1/4）。

## 2. 手（V9.7.1 收版）
- 浅粉/中性肤色（程序化 albedo/normal/roughness，降橙降红，roughness≈0.60）；纤细手指（3 节 + 圆关节，宽度收窄）；**5 个浅粉半透明指甲**（4 指 InstancedMesh + 拇指，抬到可见面）；掌弓/大鱼际/小鱼际/掌垫/指根补强。
- **捏握**：骰子移到指尖前方（gripLocal `(0.02,-0.215,-0.165)`），拇指从掌内侧压向骰子上部、食指/中指 curl 包住骰面，其余指跟随；骰面可见。
- 深色夹克袖口（收窄锥形 0.15→0.108 local）+ 黄铜方扣/铆钉；整体 **0.82×**。
- 手 **11 draw / 7,672 渲染 tris**（≤14/≤9k；逐几何 4,048，Instanced 按实例计 7,672）。

## 3. 动作 / 物理（上挑抛出）
- 手从侧前进入 → 捏起 → 手腕上挑（release 初速 **vy=+1.5**、向中心内侧）→ 骰子快速旋转（ω≈18.8/9.4/−13.6 rad/s）→ **2 次弹跳** → 落 `(0.63,0.63)`。
- 时间轴：release 840ms；实测弹跳 1336ms（2.80）/1644ms（1.33）；settle 2060–2380ms（320ms，35.8°）；total **2400ms ≤2500**。
- reduced/instant 直接 `placeDie`；落点/物理/最终骰面不变。

## 4. 4 帧 × 390/320/430（真实时间轴，冻结抓帧）
`shots/v9.7-dice/{390x844,320x568,430x932}-{hold,throw,bounce,settled}.png`

| 帧 | t | hand | 骰子（三尺寸一致） | 390 draw/tris |
|---|---|---|---|---|
| hold | 730ms | true | pos=(0.761, 0.482, 0.782)，捏起托住 | 73 / 19,188 |
| throw | 960ms | true | pos=(0.789, 0.756, 0.816)，上挑飞行 | 73 / 19,188 |
| bounce | 1450ms | false | pos=(0.624, 0.408, 0.644)，第一次弹跳后 | 59 / 11,366 |
| settled | 2400ms | **false** | pos=(0.63, 0.208, 0.63)，top=4=value | 59 / 11,366 |

另：`390x844-settled-overview.png`；320 `-hold-low.png`/`-hold-medium.png`（hand=true）。**与视频对照**：`shots/v9.7-dice/compare-ref.png`（参考 crop-011/012 vs V9.7 hold/throw）。

## 5. 最终骰面 / clearance / reduced
- 直接 play die=4 → settled `{value:4, top:4, up:1.0000, atHome:0, hand:false}`；真实主桌 forceDie(6) → state/log die=6、3D top=6、roll 段 hand=true。
- 落点/clearance 不变：`(0.63,0.63)` r=0.891 φ=135°；保守 hub 黄铜基环 **+0.0205**、中心鼓 +0.1405、蓝进航内格 +0.070。
- reduced：raf=0、两帧宿主截图字节完全一致、value=5 top=5 hand=false。

## 6. 构建 / 体积 / error
- `dist/v97 --check --budget-3d 225` **49/49 GREEN**；chunk `board3d.12586267.js` raw 701,138B / **gzip 186,461B = 182.1KB ≤225KB**；index 139.2/140KB；首屏 179.6/180KB。
- **0 console error / 0 pageerror**；2 条 warning 为 table 自带 12s 3D play watchdog（headless SwiftShader 0.3–1fps 时触发；真机 60fps 约 2.4s 不会触发）。

## 7. 已知偏差 / 遗留
1. 骰子（0.34）比手大，捏握是“指尖/指腹夹住骰面上部”的近似，不是参考视频里小骰子那样两指完全对捏。
2. 皮肤仍为程序化低模贴图手（暖阅读灯下偏亮），非扫描资产；指甲可见但克制。
3. 物理沿用 2.5D 刚体（平面+圆边界），实测 2 次弹跳（落在“2–3 次”范围内）。
4. headless 0.3–1fps（冻结抓帧不受影响）；真机 fps/全量 e2e 未测。

## 8. 复现
```powershell
$py='C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'
& $py tools/rebuild/build_app.py --out dist/v97 --check --budget-3d 225
node shots/v9.7-dice/final.mjs dist/v97 shots/v9.7-dice     # 3 尺寸 × 4 帧 + 主桌 + low/med + reduced + clearance
node shots/v9.7-dice/probe_phys.mjs                          # 手 draw/tris、弹跳时刻、落定角
node shots/v9.7-dice/sim_up.mjs                              # 上挑抛物理调参
$py tmp/make_compare.py                                      # 与参考帧对照图
```
证据：`shots/v9.7-dice/report.json`、`phys-probe.json`、`final.log`、各尺寸 PNG、`compare-ref.png`、`die-atlas.png`、`HANDOFF.md`。
