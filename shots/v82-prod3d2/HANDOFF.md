# V8.2 prod3d2 · 3D 视觉 P1 交接单（task-40）

> 角色：FE · 3D（只改 `app/src/view/board3d/**`）。未改 table/build/引擎/题库；未 commit。
> 冻结时间：2026-11-19 10:20（`build_app.py` 重建 chunk 哈希不变 = 源码已冻结）。

## 1. 结论

四项 P1 全部修完，真实 table 链路（`dist/rebuild-v8-prod3d2`，`board3d=on`）390/320/430 各跑一遍：
**0 console error / 0 pageerror**，chunk **155.1KB gzip（≤160**），drawCalls 44→50、triangles 3516→4084。

| QA 项 | 改法 | 证据（数值） | 截图 |
|---|---|---|---|
| **V8-V-01/03 overview 大片空蓝** | 垫面从纯色 Lambert 改成「织纹层（lambert，吃灯光）+ 暗角/灯池/嵌线叠层（basic）」；织纹=程序化 CanvasTexture（felt 绒布 / paper 木纹），按主题缓存。棋盘改用投影包围盒自动上下居中，占宽按 ring 口径 87% | 空区颜色种类 **6 → 798**、行均值 std **0.21 → 5.33**（`flat-report.json`）；占宽 **0.8707/0.8736/0.8708**（ring 半径 3.23 口径，目标 86–88%）；上下留白 **138.9/138.9**（390）、41.0/41.4（320）、167.8/167.9（430） | `table/after-R0-overview-390x844.png`、`after-R5-overview-320x568.png`、`after-R5-overview-430x932.png`、`v82/after-*-overview-{cloud,star,paper}.png` |
| **V8-V-02 小熊压字** | 舞台格 0.34→0.42 世界单位，换 256px 专用贴图（格面字偏前 + 类型名）；小熊移到格子左后（`STAGE_BEAR = {x:-0.072, z:-0.100, s:0.84}`，`bearSeat` 容器承载位移/缩放） | 小熊真实网格轮廓 vs 格面字框：竖向重叠 **5px → 0px**；小熊左缘 **30.6 → 36.5px**（≥16）；舞台格右缘到卡片左界 **10.5 → 13.3px**（10–16）；格面「真 / 真心话」完整可读 | `table/after-R3-bear-hold-card-390x844.png`、`after-R3-bear-zoom-390x844.png` |
| **V8-V-05 fly 中文斜置** | 额外生成「无中文图集」，fly 期间 `tileMat.map` 切过去（只留色块 + 箭头/星图标），land/cell45/return/reduced 恢复；两版图集除中文外像素一致，切换不跳色 | fly 阶段 `flyMode=true`，截图内无中文；飞机钉屏 `lock.maxAbsX=0 / maxAbsY=0`（board θ=1.734、tx=3.06 在变） | `table/after-R1-fly-390x844.png`、`v82/after-390x844-fly.png` |
| **V8-V-04 中心平面金盘** | 改为鼓形圆柱（侧/顶双材质）+ 底盘环 + 悬浮环 + 挤出立体星徽 + 暖光晕；星徽慢转、悬环呼吸；顶面 256px 程序化金盘贴图，按主题换色（金 / 银紫 / 暖金） | drawCalls +2（hub 内部 5 个 mesh）；overview 中心可见立体鼓面与星徽 | `table/after-R0-overview-390x844.png`、`v82/after-*-overview-*.png` |

## 2. 源码冻结（SHA256 前 16 位 / mtime）

> 注：本机 `core.autocrlf` 让工作区是 CRLF、git blob 是 LF，同一份内容两种字节哈希。下表「磁盘」列按工作区字节算，
> 「HEAD(LF)」列是 `git show HEAD:<path>` 的规范化字节；两边内容已验证逐字节等价（仅换行符不同）。

| 文件 | bytes | sha256[:16]（磁盘/CRLF） | sha256[:16]（HEAD/LF） | mtime |
|---|---|---|---|---|
| `app/src/view/board3d/scene.js` | 49043 | `62dda24d9ca1be77` | `ca397495dc9a0cbd` | 2026-11-19 09:49:27 |
| `app/src/view/board3d/textures.js` | 21464 | `228ce76828b2460b` | `228ce76828b2460b` | 2026-11-19 09:52:35 |
| `app/src/view/board3d/constants.js` | 8647 | `3f04d504958da587` | `6563add99b247068` | 2026-11-19 09:59:41 |
| `app/src/view/board3d/director.js` | 25701 | `0a9c196122362fc1` | `0a9c196122362fc1` | 2026-11-19 09:38:47 |
| `entry.js / bear.js / camera.js / parts.js / mapping.js / README.md` | 14573 / 4147 / 5030 / 7185 / 7062 / 8904 | 见 §4（未改） | 同左 | ≤ 2026-11-19 07:36 |

主线提交：`6cb6ec7 V8.2：3D 视觉 P1 修复 + 图例/自检`（lead 合并）；其 board3d 部分与上表内容逐字节一致
（`textures/director` 直接同哈希，`scene/constants` 仅 CRLF↔LF 差异）。因此 `dist/rebuild-v8-prod3d2` 的 chunk
`board3d.55063017.js` 就是提交内容的产物（连跑两次哈希一致）。

`director.js` 改动点：`_overview()` 用 `_centerBias()`（投影包围盒居中）+ `OVERVIEW_FILL`；`_run/_phaseLand/returnToOverview/_runReduced/setReduced` 调 `scene.setFlyMode()`。
`scene.js` 改动点：`_buildTable`（叠层）+ `_matTexFor`（按主题缓存）、`_buildBoard`（双图集 + hub）、`applyTheme/setDim`（新材质口径）、`setFlyMode`、`setStageSquare`（256px 舞台贴图）、`_buildStage`（bearSeat）、`_frame`（hub 动画）。
`textures.js` 新增：`buildWeaveTex / buildMatOverlay / buildHubTop / buildStagePlate`；`buildAtlas({glyph})`；删除已无用的 `makePaperTex`。
`constants.js` 新增：`STAGE_PLATE / STAGE_BEAR / STAGE_TEXT / OVERVIEW_FILL / HUB`、`THEMES[*].matTex / hub`。

## 3. 构建 / 体积 / 性能

```
python tools/rebuild/build_app.py --out dist/rebuild-v8-prod3d2
  modules: 33/33 js, missing(0)
  board3d: assets/board3d.55063017.js  595.3 KB raw / 155.1 KB gzip  (目标 ≤140 WARN / 验收 ≤160)
  index gzip 139.9 KB / 140 ; first-screen gzip 172.9 KB / 180
```
- chunk raw **609,547 B**、gzip **158,776 B = 155.06 KiB**、sha256 `55063017ee4bb693…`；重建两次哈希一致（确定性）。
- 体积增量来自 4 个新纹理生成器 + fly 双图集（≈ +3KB gzip）。

## 4. 自测方法与原始数据

工具（都在 `shots/v82-prod3d2/`，Node + Edge/CDP，无外部依赖，不改产品代码）：
- `table-run.mjs` → 真实 table 链路（rules-ok → board3d=on → start → 掷6起飞 → 掷2落真心话格 → cell45+bear 持卡 → 做了回桌），390/320/430；输出 `table/<tag>-R*.png` + `<tag>-table-report.json`。
- `cdp.mjs` → 单场景自测台（复用 `app/dev/board3d-prod-demo.html` 的真实模块，body 换成真实 host 尺寸 366×552 / 296×303 / 406×640，stageAim 与 table 同口径 `nx=-0.6, ny=0.14`），出 overview/fly/cell45/bear + 三主题；输出 `v82/after-*.png|json`。
- `compare_flat.py` → before/after 空区平坦度（`table/../v82/flat-report.json`）。
- 命令：`node shots/v82-prod3d2/table-run.mjs --out=shots/v82-prod3d2/table --tag=after`（需先 `python -m http.server 8793` 于 `couple-game/` 根）。

前后对比（同机、同 headless 软渲染、同链路、同 2.6s 稳态窗口；`table/<tag>-table-report.json` 的 `bench`）：
| 指标 | before（`dist/rebuild-v8-prod3d-check`，旧 chunk） | after（`dist/rebuild-v8-prod3d2`） |
|---|---|---|
| drawCalls / triangles | 45 / 3,518 | 51 / 4,086 |
| updateMs（JS/帧） | 0.10 | 0.07 |
| renderMs（提交/帧） | 0.95 | 0.59 |
| >25ms 长帧（2.6s 窗口） | 6 / 123 帧 | 0 / 130 帧 |
| overview `gapTop/gapBot` | 140.1 / 137.4 | 138.9 / 138.9 |
| 空区颜色种类（顶带） | 6 | 798 |
| 空区行均值 std | 0.21 | 5.33 |
| 舞台格 top 面边长（几何） | 0.340 | 0.420 |
| 小熊↔格面字竖向重叠 | 4.9 px | **0 px** |
| 小熊左缘 / 舞台到卡片左界 | 29.7 / 10.5 px | 35.5 / 12.6 px |
| console error / pageerror | 0 / 0 | 0 / 0 |

> 帧时间口径：headless 的 `avgMs` 受 rAF 节流影响（≈20ms/帧），**不能代表真机**；`renderMs` 是 `renderer.render` 提交耗时，
> 本次 after 0.59ms 反而低于 before 0.95ms（旧基线真 GPU 0.43–1.41ms 同量级）。新增全屏半透明垫面叠层的**真机填充成本未验**（本机只有 Intel Arc + SwiftShader 软渲染）。

## 5. 偏差 / 待验证 / 遗留

1. **「上下各 10–14% 留白」在竖屏 host 上不可达**：host 366×552（aspect 0.663）下棋盘占宽 87% 时，圆盘投影最大竖向填充 ≈52%，留白必然 ≈24% 各边。已做的是「上下留白相等（差 ≤0.4px）+ 用纹理把留白变成桌板」；若产品坚持 10–14%，只能牺牲占宽（≈55%）或改 host 比例。
2. **before 的舞台格/字框数值口径**：字框按 after 布局估算，旧版字居中，故 before 的 `glyph` 框仅作参考；判读以截图为准（旧截图里「真」被小熊完全遮住）。
3. **真机性能/填充成本未验**：drawCalls +6（+13%）、triangles +15%；新增 1 个全屏半透明叠层 + 1 层织纹贴图。稳态 `renderMs` 未回退（0.59 < 0.95），但真机 GPU 填充需发布前复测（本机无可信真机数据）。
4. **主题纸雕下棋盘盘面仍偏冷**：`buildBoardFace()` 盘面底色固定深蓝，未按主题换色（不在本次 P1 范围）。
5. 未动 `table.js / settings.js / build / 引擎 / 题库`，也未新增 `app/dev/*` 页面（自测走 Node+CDP 脚本）。
6. 自测脚本依赖 `python -m http.server 8793`（`couple-game/` 根）与 Playwright 之外的 CDP 客户端；`playwright` 在本机 bundled python 里**不可用**，故新写 `table-run.mjs` / `cdp.mjs`（Node 26 + Edge CDP，零依赖）。
