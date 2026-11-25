# V9.6 真人感手部（FE·3D / task-57）交接单

状态：**DONE / 已冻结**（2026-11-19）· 代码根 `couple-game/` · 未自行 commit（待 lead 提交发布）
改动：`app/src/view/board3d/parts.js`（裸手材质/手指/指甲/夹克袖）、`textures.js`（`buildSkinTextures`：皮肤 albedo/normal/roughness）、`scene.js`（手部贴图统一进 `_tex` 释放表，1 行）；落点/物理/时间轴/director 未动。
V9.6.1（按 lead 反馈再收一版）：肤色降橙降饱和、手指缩短 ~14%/加粗/指尖收窄、指甲放大到浅粉半透明并放到可见面、夹克袖收窄锥形、握点后移（手掌退到侧后）。

## 1. 结构
- **裸手**：手掌（掌弓/大鱼际/小鱼际/掌垫/指根补强，顶点色 1 draw）、4 指各 **3 节**（近/中/远节，锥形圆柱 InstancedMesh）+ 指根/PIP/DIP/指尖 **4 圆关节**、拇指 2 节 + 圆关节；**5 个指甲**（4 指 InstancedMesh + 拇指 1 mesh，浅粉半透明微凸）。
- **皮肤**：程序化 albedo（暖米色、低饱和、血色斑驳/毛孔/掌纹/关节褶皱带）+ normal（毛孔+褶皱凹线）+ roughness（≈0.6；偏暗处更粗）；关节/掌垫轻红晕；低高光。
- 腕部裸肤 + **深色飞行夹克袖口**（收窄锥形 0.15→0.108 local）+ 黄铜方扣（框+针）+ 铆钉；前臂收进画面外。
- 抓握：手掌退到侧后，四指 per-finger 独立 curl 从骰子前/下绕住，拇指从上方/侧面压住；骰面可见；抛出时手指张开、落定前手完全退出。
- 整体 **0.82×**；`gripLocal (0,-0.203,-0.128)`；roll 相机沿用 V9.5（center 0.76,0.29,0.64 / radius 3.95*fit）。

## 2. 性能（手）
- **11 draw / 7,672 渲染 tris**（≤14 / ≤9k）；roll 帧总 73–75 draw / 18,768–18,836 tris（含手 + 阴影 pass）；无手基线 bounce/settled 59–62 / 10,946–11,096；overview 84 / 13,304。

## 3. 4 帧 × 390/320/430（真实时间轴 730/960/1210/2400ms，冻结抓帧）
`shots/v9.6-dice/{390x844,320x568,430x932}-{hold,throw,bounce,settled}.png`

| 帧 | t | hand | 骰子（三尺寸一致） | 390 draw/tris |
|---|---|---|---|---|
| hold | 730/731ms | true | pos=(1.158, 0.878, 1.157)，侧握托起 | 73 / 18,768 |
| throw | 960ms | true | pos=(0.956, 0.694, 0.956) | 73 / 18,768 |
| bounce | 1210ms | false | pos=(0.813, 0.383, 0.816) | 61 / 11,046 |
| settled | 2400ms | **false** | pos=(0.63, 0.208, 0.63)，top=4=value | 59 / 10,946 |

另：`390x844-settled-overview.png`；320 `-hold-low.png` / `-hold-medium.png`（hand=true）。

## 4. 落点 / 骰面 / 物理（未变）
- DIE_HOME **(0.63,0.63)** r=0.891 φ=135°；保守口径 hub 黄铜基环 **+0.0205**、中心鼓 +0.1405、蓝进航内格 +0.070；实际足迹采样 min +0.0963。
- 骰面：直接 play die=4 → `{value:4, top:4, up:1.0000, atHome:0, hand:false}`；真实主桌 forceDie(6) → `state/log die=6`、3D `top=6`、roll 段 hand=true。
- total **2400ms ≤2500**；release 840；settle 2060–2380（320ms，70.1°）；物理参数未改（弹跳 1136/1457/1611/1832ms）。
- reduced：raf=0、两帧宿主字节完全一致、value=5 top=5 hand=false。

## 5. 构建 / 体积 / 0 error
- `dist/v96 --check --budget-3d 225` **49/49 GREEN**；chunk `assets/board3d.04e20966.js` raw 684.0KB / **gzip 181.8KB ≤225KB**；index 139.2/140KB；首屏 179.6/180KB。
- **0 console error / 0 pageerror / 0 warning**。

## 6. 已知偏差 / 遗留
1. 皮肤是程序化贴图 + 低模几何：暖米色/毛孔/褶皱/掌纹/指甲都有，但近看仍偏“3D 角色手”，在暖阅读灯直射下会偏亮（非写实扫描）。
2. 指甲为浅粉半透明椭球（4 指 + 拇指），在 hold/throw 帧可见但尺寸克制（lead 要求微凸、不夸张）。
3. 骰子（0.34）比手大，四指只能从侧面压住/半包；按 lead 口径没有再加大手。
4. 物理沿用 2.5D 刚体；headless SwiftShader 1–2fps（冻结抓帧不受影响），真机 fps 未测。
5. 本轮未提交：`parts.js` / `textures.js` / `scene.js` 为 git 未提交改动，请 lead 统一提交并更新版本号。

## 7. 复现
```powershell
$py='C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'
& $py tools/rebuild/build_app.py --out dist/v96 --check --budget-3d 225
node shots/v9.4-dice/final.mjs dist/v96 shots/v9.6-dice
```
证据：`shots/v9.6-dice/report.json`、`final.log`、各尺寸 PNG、`HANDOFF.md`。
