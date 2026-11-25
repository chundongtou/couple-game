# task-52 · V9.1 follow-up：主桌实际裁切内露出小物（cinematic2）

- 状态：**DONE**（未 commit；只改 `board3d/{constants,scene}.js`，另 `textures/parts` 本轮未动）
- 口径：真实主桌（dist 生产产物 + HUD/掷骰条/行动区/缩放按钮），**不是**单独 demo
- 日期：2026-11-19

## 1) 先定位真实原因（重要）
`shots/v9.1-smoke/table.png` 里只剩双杯，不是位置被裁，而是**主桌 3D 自适应降到了 low 画质**：
- `low` 档原来 `props:false` → `propGroup.visible=false`，而两只杯子（cup1/cup2）不在 propGroup，所以只剩杯子 + 水渍/机舱静态层。
- 本机用 `table_check.mjs` 实测：真实主桌初始 `quality=medium`；慢设备/长时间运行会自适应降档到 low（`_adaptCheck`，V9 既有逻辑）。
- 只挪位置不修这条，用户仍会在降档后看到「空桌」。

修复（`constants.js`）：`QUALITY.low.props = true`（小物保留），low 仍关蒸汽/光尘/额外点光/阴影/dpr=1；`scene.js` 的 `_updateAmbient` 增加 `extraLights` 门控，避免降档后点光被动画重新点亮。
→ 慢设备降档后画面仍丰富（见 `real4-390x844-low.png`）。

## 2) 前排小物重新布局（z 4.6–5.0 → 3.6–4.35）
以真实主桌 host（390：366×556.8，棋盘 y 364.5–638.6，行动区 y=780，缩放按钮 x≥332）实测调位：
| 小物 | 旧 | 新 | 说明 |
|---|---|---|---|
| notebook+glasses+pen | (-0.06,4.58) | (-0.10,4.15) | 从被裁提升到行动区上方 |
| tickets | (-1.04,4.98) | (-1.05,4.42) | 仍在杯与笔记本之间 |
| cards | (2.10,4.88) | (1.90,4.35) | 避开右下缩放按钮 |
| keys | (1.02,4.58) | (0.55,4.15) | 移到笔记本右侧，避开毛毯 |
| tray | (2.92,3.64) | (1.62,3.62) | 移到真骰子 DIE_HOME 正下方；不再被「+」按钮压住 |
| blanket | (2.46,4.66) | (1.15,4.35) | 避开缩放按钮竖列（320 也不压按钮） |
| cup2 | (-2.52,4.62) | (-2.42,4.30) | 与杯 1 成对 |
| newspaper | (-2.98,3.68) | (-2.65,4.08) | 从画框外收进杯下左侧 |
| tray 内衬 | 近黑 | 深绿绒 + 黄铜圈加粗 | 读作骰子托盘，不再是深色圆盘 |

后排 lamp/candle/plant/books/photo：真实主桌三尺寸都可见，未删未挪。

## 3) 真实主桌验证（命令 + 数字）
`node shots/v9.1-cinematic/table_check.mjs --dist=dist/rebuild-v91-cine --out=shots/v9.1-cinematic/table --tag=real4 --sizes=390x844,320x568,430x932`

| 尺寸 | host | quality | 可见小物锚点 | 压棋盘 | 压缩放按钮 | 压 3D 格子/小熊 | error |
|---|---|---|---|---|---|---|---|
| 390×844 | 366×556.8 | medium | **10/10** | 0 | 0 | 0 | 0 |
| 320×568 | 296×297.8 | medium | **10/10**（前排下半被底边裁，锚点仍在宿主内） | 0 | 0 | 0 | 0 |
| 430×932 | 406×644.8 | medium | **10/10** | 0 | 0 | 0 | 0 |

- 「压棋盘」= 小物锚点投影落在环格 R=3.30 投影多边形内；三尺寸 `boardHit=[]`。
- 「压缩放按钮」= 锚点 ±16px 与 `+ / − / 1×` 矩形相交；三尺寸 `zoomHits=[]`。
- `cell45/bear` 用真实宿主/真相机驱动 `App.Board3D.play`：`stageHits=[]`、`bearHits=[]`（3D 格子/小熊不被小物压）。
- 题卡：DOM 层 z30 在 3D canvas（z1）之上，结构上不会被 3D 小物遮挡；cell45 左 36% 的 3D 舞台已验证无小物。
- 0 console error / warning（三尺寸）。

### low 画质（复现并验证修复）
| 尺寸 | propGroup | steam | motes | 台灯点光 | draw | tris | dpr |
|---|---|---|---|---|---|---|---|
| 390 | **true** | false | false | 0 | 76 | 13,290 | 1.0 |
| 320 | **true** | false | false | 0 | 74 | 13,130 | 1.0 |
| 430 | **true** | false | false | 0 | 76 | 13,290 | 1.0 |

low 截图 `real4-<size>-low.png` 中前排/后排小物仍在。

## 4) 证据文件（`couple-game/shots/v9.1-cinematic/table/`）
- `before-table.png`：lead 提供的 bug 截图（`shots/v9.1-smoke/table.png` 副本）
- `real4-390x844-overview.png` / `real4-320x568-overview.png` / `real4-430x932-overview.png`（带完整 HUD）
- `real4-<size>-low.png`（low 画质：小物仍在）
- `real4-<size>-cell45.png` / `real4-<size>-bear.png`（真宿主 3D 舞台）
- `real4-report.json`（host/DOM 矩形、每个小物 page 坐标与 clearance、low 指标、errors）
- 脚本：`shots/v9.1-cinematic/table_check.mjs`

## 5) 其它口径
- 构建：`build_app.py --out dist/rebuild-v91-cine --check --budget-3d 200` → **49 passed / 0 failed GREEN**；3D chunk gzip **174.6KB ≤ 200KB**。
- draw：medium 下 84/82/84（≤110）；tris 13.3k（≤28k）。
- `shots/v9.1-cinematic/after/` 已用最终布局重出（390/320/430 × overview/star/paper/fly/cell45/bear），与真实主桌口径一致。
- 未改 entry/camera/zoom/director/table/UI/audio/build/engine；未 commit。

## 6) 偏差 / 遗留
- 320×568 主桌 host 只有 296×297.8，棋盘下沿到行动区仅约 51px：前排小物的**下半**仍会被底边裁掉（锚点与上半可见）；后排 5 件 + 双杯 + 托盘在 320 完整可见，满足「≥2–3 件可见」。
- 相机/取景由 entry/camera 决定（不在本任务写作用域），本任务只在 board3d 内调小物位置与画质档。
- 真机 GPU fps 未测（SwiftShader 只报 draw/tris）；建议 QA 在最终 release 上复跑真实主桌 3D on/auto + 题卡打开态。
