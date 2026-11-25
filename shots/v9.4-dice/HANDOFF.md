# V9.4 手更真实 + 落点更靠中心（FE·3D / task-55）交接单

状态：**DONE / 已冻结**（2026-11-19）· 代码根 `couple-game/` · 未自行 commit（lead 已提交 `e978510` V9.4.0）
⚠️ **发布前必读**：`app/src/view/board3d/textures.js` 有未提交改动（新增 `buildLeatherTextures()`，手部 normal/roughness 贴图依赖它）。`e978510` 未包含该文件，干净 checkout 构建 `entry.js` 会因缺少导出而失败；当前 `dist/v94` 可用是因为工作区有该改动。请把 textures.js 一并提交/重建后再发布。

## 1. 改动（写作用域内）
| 文件 | 内容 |
|---|---|
| `parts.js` | `makeHand()` 重做：深棕皮革飞行手套（0.68 缩放）、掌体/掌根/鱼际/指根垫/掌垫/腕带（顶点色）、4 指各 2 节（锥形圆柱 InstancedMesh + 指根/PIP/指尖圆关节，per-finger 矩阵独立合拢）、拇指 2 节、皮质前臂（1.70 长，收进画面外）、黄铜腕扣/铆钉/袖扣；缝线改为两条细暗线（无黑色圆点） |
| `textures.js` | 新增 `buildLeatherTextures(128)`：皮革颗粒/折痕 → 法线 + 粗糙度（程序化，无外链） |
| `scene.js` | `DIE_HOME` → `(0.63,0.208,0.63)`（constants 共享）；`RELEASE_DIE=(1.032,0.80,1.032)`；刚体初速 `(-0.636,-0.35,-0.636)`、角速 `(12.1,5.5,-8.1)`、seed 5；抓握姿态改为侧握（roll≈0.92，die 可见顶面）；gripLocal `(0,-0.198,-0.075)` |
| `director.js` | roll 相机 center `(0.73,0.28,0.64)`、radius `3.6*fit`（手/出手点/落点都在框内） |
| `constants.js` | `DIE_HOME_POS=(0.63,0.63)` + clearance 注释 |

## 2. 落点 / clearance（45° 空楔形）
- 落点 **`(0.63, 0.63)`**，r=**0.891**，φ=135°。V9.3 为 (0.84,0.53) r=0.993 → **近 10.3%**。
- **保守口径（骰子半对角 0.2404，保证任意落定 yaw 合法）**：hub 黄铜基环（外沿 0.63）**+0.0205**、中心鼓 +0.1405、蓝进航内格（r*sin31.15°−0.15−0.2404）**+0.070**、机库 +0.28~0.34、棋盘外沿 +2.169。
- 任务建议的 `(0.58,0.58)` r=0.820 在扣半对角后：hub 基环 **−0.0502**、蓝进航内格 **+0.0009** → 会压环/擦格，故取最近合法值 `(0.63,0.63)`。
- 实际平躺足迹 8 点采样（informative）：hubRing +0.183 / homeTiles +0.096 / hangar +0.341（采样受落定 yaw 影响，以保守口径为准；`report.json` 内同时保留两种口径）。

## 3. 4 帧 × 390/320/430（真实时间轴 730/960/1210/2400ms，冻结抓帧）
`shots/v9.4-dice/{390x844,320x568,430x932}-{hold,throw,bounce,settled}.png`

| 帧 | 时间 | hand | 骰子状态（三尺寸一致） | 390 draw/tris |
|---|---|---|---|---|
| hold（侧握托起） | 730/731ms | true | pos=(1.158, 0.878, 1.157)，离盘 1.003 | 67 / 14,466 |
| throw（空中） | 960/961ms | true | pos=(0.956, 0.693, 0.956) | 65–67 / 14,462 |
| bounce（弹跳） | 1210ms | false | pos=(0.813, 0.383, 0.816) | 57–58 / 10,942 |
| settled（落定，roll 机位） | 2400ms | **false** | pos=(0.63, 0.208, 0.63)，top=4=value | 56 / 10,940 |

另：`390x844-settled-overview.png`（回俯瞰，落点居中可见）；320 额外 `320x568-hold-low.png`（low：hand=true，59 draw / 13,590 tris）、`320x568-hold-medium.png`（66 / 14,530）。

## 4. 最终骰面 = 引擎点数
- 直接 play die=4（三尺寸、4 帧）：settled `probe.die={value:4, top:4, up:1.0000, pos:(0.63,0.208,0.63), atHome:0, hand:false, tossing:false}`。
- 真实主桌 `forceDie(6)`+点掷骰：`state.rollContext.die = log.kind='roll'.die = 6`；3D `top=6, up=1.0, phase=idle`；roll 帧 hand=true（t≈900）被观测到。

## 5. 时长 / 物理 / 性能 / 体积
- 时间轴：total **2400ms ≤2500**；release 840ms；settle 2060→2380ms（320ms，slerp 70.1°）；实测弹跳 1136/1457/1611/1832ms（速度 2.93/1.36/0.74/0.72），随后 320ms 落定（最后 1.254s 的微弹在落定段内，不再单独可见）。
- 手：**8 draw / 3,520 tris**（InstancedMesh 按实例计；≤10 / ≤5k）；scale 0.68。
- 3D：overview 84/13,304；roll 56–69 draw / 10,940–14,534 tris（手可见时 +8 draw / +3.5k tris；预算 draw≤90、tris≤20k）。
- 构建：`build_app.py --out dist/v94 --check --budget-3d 215` **49/49 GREEN**；chunk `assets/board3d.2b17645b.js` raw 696,935B / **gzip 185,088B = 180.75KB ≤215KB**；index 139.2/140KB；首屏 179.6/180KB。
- **0 console error / 0 pageerror / 0 warning**（本轮抓帧用冻结+手动推进，未触发 table 12s watchdog）。

## 6. reduced
390：`reduced-390x844-a/b.png`（只裁 3D 宿主）**字节完全一致**；`raf=0`、`reduced=1`；`placeDie(5)` 后 `{value:5, top:5, up:1, atHome:0, hand:false, tossing:false}` 前后一致。

## 7. 已知偏差 / 遗留
1. 手是程序化低模深色皮手套：分节手指/圆关节/拇指/腕扣都有，但仍是风格化（不是写实扫描）；按 lead 要求缩到 0.68 后，手比 0.34 的骰子小（骰子本身是「大号棋盘骰」），手指只能从侧面压住/半包，不能像真实手掌一样完全包住。
2. 抓握为侧握（骰面可见），掌垫不再整掌压住骰面；缝线为细暗线。
3. 物理仍是 2.5D（平面+圆边界，不与 hub/机库/棋子碰撞）；4 次可见弹跳 + 320ms 落定（比计划的 2–3 次多 1 次微弹）。
4. headless SwiftShader 0.5–0.8fps（冻结抓帧不受影响）；真机 GPU fps 未测。
5. `textures.js` 未进 `e978510`（见页首），发布前必须补。

## 8. 复现
```powershell
$py='C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'
& $py tools/rebuild/build_app.py --out dist/v94 --check --budget-3d 215
node shots/v9.4-dice/final.mjs dist/v94 shots/v9.4-dice        # 3 尺寸 × 4 帧 + 主桌 + low/med + reduced + clearance
node shots/v9.4-dice/probe_phys.mjs                            # 手 draw/tris、弹跳时刻、落定角
node shots/v9.4-dice/sim.mjs ; node shots/v9.4-dice/sim2.mjs   # 落点 clearance 与物理调参
```
证据：`shots/v9.4-dice/report.json`、`phys-probe.json`、`final.log`、`sim*.mjs`、`390x844-*`/`320x568-*`/`430x932-*` PNG。
