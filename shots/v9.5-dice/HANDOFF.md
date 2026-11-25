# V9.5 手部再细化（FE·3D / task-56）交接单

状态：**DONE / 已冻结**（2026-11-19）· 代码根 `couple-game/` · 未自行 commit（待 lead 提交发布）
改动：`app/src/view/board3d/parts.js`（手重做，+100/−67）、`app/src/view/board3d/director.js`（roll 相机稍拉远，4 行）；scene/constants/textures 未动（落点/物理/时间轴沿用 V9.4）。

## 1. 手部结构（V9.4 → V9.5）
- 整体 **0.82×**（V9.4 0.68；lead 口径 0.78–0.85）。
- **每指 3 节**（近/中/远节，锥形圆柱 InstancedMesh）+ **指根/PIP/DIP/指尖 4 个圆关节**；per-finger 独立 curl（各指相位/强度不同：`st` 0.86–1.03，近节 0.10→0.50、中节 +0.20→+0.82、远节 +0.16→+0.88）。
- **拇指 2 节 + 圆关节**，从掌内侧（与四指相对一侧）翻压骰子上部（hold 帧可见）。
- **大鱼际/小鱼际/掌弓/掌垫/指根补强**（顶点色合并 1 draw）；**双细缝线**（浅色蜡线 4 条，不再黑点）；**腕带黄铜方扣（框+针）+ 两铆钉 + 袖扣**（1 draw）。
- 深棕皮革 + 程序化皮革 grain（normal/rough，`buildLeatherTextures` 复用）；前臂加长收进画面外。
- **draw 9**（掌/近节/中节/远节/关节/拇指近/拇指远/袖/黄铜）；**渲染 tris 5,040**（probe 逐几何 2,796，Instanced 按实例计 = 5,040）≤12 / ≤7k。
- roll 相机：center `(0.76,0.29,0.64)`、radius `3.95*fit`（V9.4 3.6），320/390/430 手与骰子都清楚。

## 2. 4 帧 × 390/320/430（真实时间轴 730/960/1210/2400ms，冻结抓帧）
`shots/v9.5-dice/{390x844,320x568,430x932}-{hold,throw,bounce,settled}.png`

| 帧 | t | hand | 骰子（三尺寸一致） | 390 draw/tris |
|---|---|---|---|---|
| hold | 730ms | true | pos=(1.158, 0.878, 1.157)，侧握托起 | 71 / 16,136 |
| throw | 960ms | true | pos=(0.956, 0.693, 0.956) | 71 / 16,136 |
| bounce | 1210ms | false | pos=(0.813, 0.383, 0.816) | 61 / 11,046 |
| settled | 2400ms | **false** | pos=(0.63, 0.208, 0.63)，top=4=value | 59 / 10,946 |

另：`390x844-settled-overview.png`；320 `-hold-low.png` / `-hold-medium.png`（hand=true，68/16,196、70/16,200）。

## 3. 落点 / clearance（沿用 V9.4）
`DIE_HOME (0.63,0.63)`，r=0.891，φ=135°；保守口径（骰子半对角 0.2404）：**hub 黄铜基环 +0.0205**、中心鼓 +0.1405、蓝进航内格 +0.070、机库 +0.28~0.34。实际平躺足迹 8 点采样 min +0.0963（homeTiles）。不压 hub/星徽/进航格。

## 4. 最终骰面 / 时间轴 / 物理（未变）
- 直接 play die=4 → settled `{value:4, top:4, up:1.0000, atHome:0, hand:false}`；真实主桌 `forceDie(6)` → `state/log die=6`、3D `top=6`、roll 阶段 hand=true（t≈900）。
- total **2400ms ≤2500**；release 840ms；settle 2060–2380ms（320ms，70.1°）；弹跳 1136/1457/1611/1832ms（2.93/1.36/0.74/0.72）。
- reduced：raf=0、两帧宿主截图 815,448 像素仅底部 26px ±1 灰阶（裁切取整）、value=5 top=5 hand=false。

## 5. 性能 / 体积 / 0 error
- 手 **9 draw / 5,040 tris**（≤12 / ≤7k）；roll 帧较无手基线 +12 draw（含阴影 pass）/ +5,190 tris；overview 84/13,304；roll 59–71 / 10,946–16,136（预算 90 / 20k）。
- 构建 `dist/v95 --check --budget-3d 220` **49/49 GREEN**；chunk `board3d.c24d9dfd.js` raw 697,829B / **gzip 185,471B = 181.1KB ≤220KB**；index 139.2/140KB；首屏 179.6/180KB。
- **0 console error / 0 pageerror / 0 warning**。

## 6. 已知偏差 / 遗留
1. 手仍是程序化低模风格化手套（非写实扫描）：3 节手指/圆关节/拇指/掌弓/掌垫/黄铜扣都有，但近看仍能看出胶囊体；骰子（0.34）比手大，手指只能从侧面压住/半包。
2. 物理沿用 V9.4 的 2.5D 刚体；可见弹跳 4 次（比 2–3 次多 1 次微弹），落定段覆盖最后微弹。
3. headless SwiftShader 1–2fps（冻结抓帧不受影响）；真机 fps 未测。
4. 本轮未提交：`parts.js`/`director.js` 为 git 未提交改动，请 lead 统一提交并更新版本号。

## 7. 复现
```powershell
$py='C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'
& $py tools/rebuild/build_app.py --out dist/v95 --check --budget-3d 220
node shots/v9.4-dice/final.mjs dist/v95 shots/v9.5-dice   # 3 尺寸 × 4 帧 + 主桌 + low/med + reduced + clearance
node shots/v9.5-dice/probe_phys.mjs                       # 手 draw/tris、物理时刻/落定角
```
证据：`shots/v9.5-dice/report.json`、`phys-probe.json`、`final.log`、各尺寸 PNG、`HANDOFF.md`。
