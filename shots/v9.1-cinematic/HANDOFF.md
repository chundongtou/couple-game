# V9.1 画面丰富度（task-49）· 交接单 — cinematic2

- 任务：`task-49` V9.1 画面：机舱/桌面增加元素与氛围
- 状态：**DONE**（未 commit；只改 4 个文件，均在写作用域内）
- 日期：2026-11-19
- 代码根：`couple-game/`（worktree `dsh-bf954628-7cd3`，HEAD `5eb3ae2` V9.0.1）

## 1) 改动文件（`git diff --stat`）
```
app/src/view/board3d/constants.js |  43 ++-
app/src/view/board3d/parts.js     |  32 ++
app/src/view/board3d/scene.js     | 602 +++++++++++++++++++++++++++++++++++++-
app/src/view/board3d/textures.js  | 377 +++++++++++++++++++++++++++++++-
4 files changed, 1044 insertions(+), 10 deletions(-)
```
`bear.js` 未改（在写作用域内但无必要）。**未动** entry/camera/zoom/director/table/UI/audio/build/engine。

## 2) 做了什么（对应任务卡四条）

### 2.1 桌面小物（程序化低模，按材质合并 → 7 个 mesh + 少量独立发光体）
| 小物 | 位置（世界坐标，y=0 桌布面） | 说明 |
|---|---|---|
| 咖啡杯（V9 已有）+ 蒸汽 | (-1.72, 4.28) | 3 个 sprite 循环上升 |
| 第二只小茶杯 | (-2.52, 4.62) | 两个人，两只杯 |
| 摊开笔记本 + 钢笔 + 书签 + 折叠眼镜 | (-0.06, 4.58) | 横线纸贴图、中缝、眼镜放左页 |
| 散落车票/卡片（5 张） | (-1.04, 4.98) / (2.10, 4.88) | 图集里的车票纹样 |
| 黄铜钥匙（圈 + 2 把） | (1.02, 4.58) | 环 + 钥匙头 + 齿 |
| 骰子托盘（空盘） | (2.92, 3.64) | 真骰子仍在 DIE_HOME，不混淆 |
| 折好的毛毯（三层 + 卷边） | (2.46, 4.66) | 主题色随小熊围巾 |
| 小音箱（平放顶面网罩）+ 磁带 | (-2.72, 2.58) / (-2.52, 3.44) | 旧磁带/随身听的生活感 |
| 书堆（3 本）+ 杂志 + 明信片 | (3.02, -2.52) | 纸页在书口露出、封面书名条 |
| 小绿植（陶盆 + 10 片叶） | (2.78, -3.18) | 苔绿 PBR |
| 铜质小台灯 | (-2.55, -3.20) | 自发光灯罩 + 光晕 sprite + 桌面暖光池 + PointLight |
| 蜡烛（黄铜烛台 + 象牙蜡） | (-1.30, -3.85) | 烛焰 sprite + 点光，位于阅读灯下方 |
| 立式黄铜相框 | (-3.18, -2.28) | 照片=程序化夜色散景（无人物） |
| 报纸 | (-2.98, 3.68) | 左前角，近景被杯/框裁切属自然构图 |

### 2.2 机舱环境
- **舱壁板缝 + 铆钉**：直接加强 `buildWallTexture`（板缝两侧铆钉、压条下铆钉排、踢脚线），**0 draw**。
- **顶部行李舱 + 暖白灯带 + 灯带光晕**：横贯画面的舱柜 + 黄铜锁扣条，补画面上沿层次。
- **舷窗遮光板（V9 已有）+ 两侧窗帘 + 黄铜窗帘杆/端头**：竖向褶皱程序化贴图，顶部为轴轻微摆动。
- **地毯纹理**：`buildFloorTexture` 加斜织纹；**绒布垫**新增手缝织边、四角黄铜纹样、磨损光带（`buildMatOverlay`，0 draw）。
- **窗外云/远处灯火/机翼剪影/翼尖红色防撞灯**：`buildWindowView` 新增，0 draw。
- **座椅靠背/扶手：未做**（见 §6 偏差）。

### 2.3 氛围动画（`_updateAmbient`，reduced 完全不更新）
咖啡蒸汽循环、烛焰闪烁 + 烛光呼吸、铜台灯灯罩自发光呼吸、阅读灯 ±4.5% 呼吸 + 极轻闪烁（以 `applyHeat` 亮度为基准，不漂移）、窗帘轻摆、舷窗光缓慢变色、舷窗光尘上浮。
`setReduced(true)` 时两帧截图字节完全一致、rAF=0（见 §4）。

### 2.4 画质档 / 性能
- `QUALITY` 新增 `props/steam/motes`：high 全开；medium 关光尘；**low 关小物/蒸汽/光尘 + 台灯/蜡烛点光归零**。
- 贴图全部程序化 Canvas（无外链），新增 3 张图集 + 窗帘/蒸汽/烛焰/地板等；按材质桶合并降低 draw。

## 3) 证据：截图（`shots/`，gitignore）

- 基线（V9.0.1，任务开始前的 `shots/v9-cinematic/try6`）：`shots/v9.1-cinematic/before/`（24 文件）
- 本次：`shots/v9.1-cinematic/after/`
  - `after-390x844-{overview,overview-star,overview-paper,fly,cell45,bear,bear-zoom}.png` + `.json`
  - `after-320x568-…`（同上）
  - `after-430x932-…`（同上）
- 自检：`shots/v9.1-cinematic/qa/`（`qa-report.json`、3 尺寸 cell45/bear、reduced a/b、low）
- 探针脚本：`shots/v9.1-cinematic/probe.mjs` / `probe2.mjs`（落点投影）、`qa_check.mjs`（自动化断言）

## 4) 自测结果（命令 + 数字）

### 4.1 构图 / 性能（`node shots/v9-cinematic/cdp.mjs --out=…/after --sizes=390x844,320x568,430x932 --themes=cloud,star,paper`）
| 尺寸 | overview draw / tris | fly | cell45 | bear | console error |
|---|---|---|---|---|---|
| 390×844 | **84 / 13,304**（V9 基线 56 / 9,262） | 46 / 8,407 | 36 / 8,048 | 52 / 10,946 | 0 |
| 320×568 | **82 / 13,144** | 57 / 8,429 | 45 / 8,298 | 52 / 10,946 | 0 |
| 430×932 | **84 / 13,304** | 46 / 8,407 | 36 / 8,048 | 52 / 10,946 | 0 |

预算：draw ≤110 ✅、tris ≤28k ✅；三主题（cloud/star/paper）截图均出、0 error。

### 4.2 不挡棋盘/格子/小熊（`node shots/v9.1-cinematic/qa_check.mjs`）
- 10 个 prop 锚点投影到屏幕，算与「环格 R=3.30 投影多边形」的最近距离：
  - 390：全部 onScreen，**最小 clearance 24.1px**（音箱）；430：最小 26.5px；320：最小 21.5px，无一个落在棋盘轮廓内（propsOnBoard=[]）。
- cell45/bear 期间：所有 prop 锚点均不落在 3D 格子投影区/小熊包围盒（cellHits=[]、bearHits=[]）。
- 题卡是 DOM，3D canvas 永远在 DOM 之下（结构保证），3D 小物不会盖住题卡。

### 4.3 reduced 静态
`reduced:true` 挂载后 0.9s 两帧截图 **字节相同（1,416,096 B）**、`_raf=0`、相机坐标两帧一致 → 静态成立。

### 4.4 低画质降级
`setQuality('low')`：propGroup=false、steam 全 false、motes=false、台灯/蜡烛点光=0；draw **84 → 64**、tris 13,304 → 10,244。

### 4.5 体积（构建门）
`python tools/rebuild/build_app.py --out dist/rebuild-v91-cine --check --budget-3d 200` → **48 passed / 0 failed / GREEN**。
- 3D chunk：`assets/board3d.dd84f485.js` **raw 663.2 KB / gzip 174.5 KB ≤ 200 KB PASS**（V9.0.1 chunk gzip 167.1 KB → +7.4 KB）
- 首屏 index gzip 138.6/140 KB、首屏总 179.1/180 KB、SW 26 项含 chunk/16 wav、chunk IIFE 哈希一致（均 PASS，未回退他人指标）。

## 5) 偏差（有意的取舍）
1. **座椅靠背/扶手未做**：当前 overview 机位下棋盘占画面 89%、桌板 11.4 宽，座椅只能落在桌板外→画框外；放到桌板后方会压在桌面上/穿过舱壁，违背「不挡棋盘、不破坏小桌视角」。改用行李舱/灯带/窗帘/壁板铆钉/地毯织纹补机舱层次。若后续要座椅，需要改机位或加宽画框（不在本任务写作用域）。
2. **320×568 前排小物在画面外**：320 的可见下沿只到 z≈3.5，笔记本/眼镜/钥匙/毛毯锚点在屏外（见 qa propsOffScreen）；390/430 全部在画面内。320 可见的是后排（台灯/蜡烛/相框/绿植/书堆）+ 左中音箱 + 右前托盘边缘，构图仍比 V9 丰富且不挡棋盘。
3. **相框照片为程序化夜色散景**（不出现人物/不引入露骨内容），近看是「灯下散景照片」而非真实合影。
4. **骰子托盘是空盘**：真骰子仍在 DIE_HOME（不移动游戏可视位置，避免 320 裁切与 QA 断言风险）。
5. **未改 bear.js**：小熊造型/材质沿用 V9；本次丰富度加在环境与小物。

## 6) 遗留 / 建议
- 真机 GPU 帧率未测（本机 Edge/CDP 走 SwiftShader，只报 draw/tris；沿用 V9 口径）。
- 未跑生产 table 的完整 e2e/题卡 HUD 叠层回归（属 QA）；3D 画面证据用 `app/dev/board3d-prod-demo.html` 真实引擎 + 真实 `App.Board3D`。
- 构建产物 `dist/rebuild-v91-cine` 已 --check GREEN，未在真实主桌里重新挂载冒烟（建议 QA 在最终 release 上跑一次 3D on/auto）。
- 若后续想进一步增强「生活感」：可给毛毯/靠垫加布褶法线、把眼镜/钥匙做成可在 fly 镜头经过时被照亮的反光点；注意 draw ≤110 余量尚有 26（84→110）。
