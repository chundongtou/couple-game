# 今晚飞行棋 · 发布说明（V8.2.2）

> 本文件从 V8.2.2 起按版本向前追加；**V8.2.1、V8.2.0、V8.1.0、V8.0.0、V7.0.0、V6.2.0、V6.1.0 与 V6.0.0（附录）的发布说明原样保留在下文**（含当次性能 / 验收数据）。
> 本文件不重复 QA 的测试数字；需要数字时请看 `reports/v6/` 下的报告。**不写未验证的真机 3D fps。**

## V8.2.2 · 2026-11-19

- 版本：**8.2.2**（`app/src/app.js` → `App.version`；已确认）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变（仓库根产物 + GitHub Pages `main` 自动部署）；工作台记录：本地提交 `4b9fc82`
- 依据：3D 骰面错面（引擎 / HUD 掷出 5 点、3D 骰子显示 3 点）；`app/src/view/board3d/scene.js` 的 `_buildDie()` 与 `constants.js` 的 `DIE_FACES`
- 验收：代码映射核对 + 构建产物实测；本段不声称全量 QA 复跑

### 1. 为什么改

V8.2 的 3D 骰子在部分点位上「引擎 / HUD 与 3D 骰面不一致」：`BoxGeometry` 的六个材质槽顺序是 **+X / -X / +Y / -Y / +Z / -Z**，而骰面贴图数组是按点数 1..6 排的；`_buildDie()` 之前直接 `faces.map(...)` 按数组顺序贴，等于把贴图贴到了错误的面上（例：引擎掷出 5 点，3D 骰子落定后显示 3 点）。这会让人以为掷骰结果被改了，属于必须修的显示错误。

### 2. 变更

- `scene.js` `_buildDie()`：材质按 `DIE_FACES.map((v) => new THREE.MeshLambertMaterial({ map: faces[v - 1] }))` 生成——`DIE_FACES = [3, 4, 1, 6, 2, 5]` 给出 +X/-X/+Y/-Y/+Z/-Z 六个轴上的真实点数，`faces[v-1]` 取对应贴图。
- `dieFaceNormal(v)` / `dieSettleQuat(v)` 保持按 `DIE_FACES.indexOf(v)` 求法线（与贴图映射同源），保证「落定姿态」和「面贴图」一致。
- 版本：`App.version = "8.2.2"`；`app/index.template.html` title/og 与 `manifest.webmanifest` name 升到 V8.2.2；重建 3D chunk（`assets/board3d.48364fb6.js`）与仓库根产物。
- 其余 3D 场景、镜头链、题卡、规则、题库、存档、边界与安全词均未变。

### 3. 性能与兼容

| 指标 | V8.2.2 当前产物 | V8.2.1 / V8.2.0 | 门禁 |
|---|---|---|---|
| index gzip | **143,236 B = 139.88 KB** | 143,237 / 143,219 B（139.88 / 139.86 KB） | ≤140 KB |
| 首屏总 gzip | **177,087 B = 172.94 KB** | 177,087 / 177,068 B（172.94 / 172.92 KB） | ≤180 KB |
| 3D chunk gzip | **158,781 B = 155.06 KiB** | 155.05 / 155.05 KiB | ≤160 KiB |
| SW | `couple-flight-v6-a21cab5e`（PRECACHE 9 项含 chunk） | `78c1f4bd` / `3a1cec27` | 离线可用 |

- 构建门 37 项（V8 构建实测 37/37 GREEN；本次只改骰面映射并重建产物，未动构建项）。
- 兼容：无迁移；`couple2.*` 与 `settings.board3d` 语义不变；发版后需要硬刷新 / 关闭 PWA 重开以更新 SW 缓存。

### 4. 验收引用

- 骰面一致性：代码映射（`DIE_FACES`）+ 3D 骰子落定截图与 HUD 文案核对；`reports/v6/` 的 V8 基线（V7 567/0、V8 3D 108/0、P0 0）不变。
- 本段不声称 V8.2.2 的全量 QA 复跑（归 QA；`e2e_v8_3d.py` 的 `V8-3D-49` 仍需先改「默认 off」断言）。

### 5. 回滚

- 回滚到 V8.2.1：`git revert 4b9fc82` 后重新构建 / 推送即可；无数据迁移。
- 或只回滚表现层：把 `settings.board3d` 设为 `off`，主桌直接用 V7。

### 6. 已知限制 / 待验证

- 沿用 V8.2：3D chunk 155.06 KiB（≤160 验收；140 目标不可达）、无 3D 机舱全景 / 自由视角、题卡文字 DOM、小游戏原面板、真机 3D fps / 发热未验、WebGL context lost 未覆盖、音效未真机校准。
- 骰面映射目前以代码核对 + 人工截图验证；若要进自动化，建议 QA 加「截骰面 + 与 HUD 文案对拍」用例。

### 7. 变更记录（V8.2.2）

| 版本 | 日期 | 摘要 |
|---|---|---|
| 8.2.2 | 2026-11-19 | 修 3D 骰面错面：`BoxGeometry` 的 +X/-X/+Y/-Y/+Z/-Z 按 `DIE_FACES=[3,4,1,6,2,5]` 取贴图；版本升 8.2.2；chunk `48364fb6`（155.06KiB gzip），index 139.88KB / 首屏 172.94KB；玩法与规则不变。 |

## V8.2.1 · 2026-11-19

- 版本：**8.2.1**（`app/src/app.js` → `App.version`；已确认）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变（仓库根产物 + GitHub Pages `main` 自动部署）；工作台记录：本地提交 `b6cbbd7`
- 依据：设置页自查体验（3D 主桌块里「设备自检」不够显眼）；`docs/v6/spec.md` §0.3
- 验收：沿用 V8.2 的构建与体积门禁；本段只记版本 / 文案变化，不引用未复跑的全量 QA

### 1. 为什么改

V8.2 给设置页加了设备自检，但块标题仍只写「3D 主桌 · 下次进主桌生效」，自检行又是 `dim` 弱化色——用户找不到「为什么这次没进 3D」。V8.2.1 只做一处可读性修正：**把「设备自检」写进标题、把自检行提亮**，并同步版本号与构建产物。

### 2. 变更

- 设置页「3D 主桌」块标题：`3D 主桌 · 下次进主桌生效` → `3D 主桌 · **设备自检** · 下次进主桌生效`。
- 自检行 `data-test="settings-board3d-status"`：`small dim` → `small`（提亮），属性与文案逻辑不变（WebGL2 / reduced / 档位 / 上次 mount / reason）。
- `App.version = "8.2.1"`；`app/index.template.html` title/og 与 `manifest.webmanifest` name 升到 V8.2.1；重建仓库根产物（index / sw / manifest）。
- **3D 代码、chunk、规则、题库、存档、边界与安全词均未变**：3D chunk 仍是 `assets/board3d.55063017.js`（609,547 B raw / 158,776 B gzip = 155.05 KiB）。

### 3. 性能与兼容

| 指标 | V8.2.1 发布产物 | V8.2.0 发布值 | 门禁 |
|---|---|---|---|
| index gzip | **143,237 B = 139.88 KB** | 143,219 B = 139.86 KB | ≤140 KB |
| 首屏总 gzip | **177,087 B = 172.94 KB** | 177,068 B = 172.92 KB | ≤180 KB |
| 3D chunk gzip | 158,776 B = 155.05 KiB | 同左 | ≤160 KiB |
| SW | `couple-flight-v6-78c1f4bd`（PRECACHE 9 项含 chunk） | `couple-flight-v6-3a1cec27` | 离线可用 |

- 构建门 37 项（V8 构建实测 37/37 GREEN；本次只改版本/文案并重建产物，未动构建项）。
- 兼容：无迁移；`couple2.*` 与 `settings.board3d` 语义不变；发版后需要硬刷新 / 关闭 PWA 重开以更新 SW 缓存。

### 4. 验收引用

- V8.2 验收口径不变：`reports/v6/qa-report.md`（V8.0 基线 567/0 + 108/0 + P0 0）、`shots/v82-prod3d2/`、`shots/v82-table3d2/`（119/119、0 console error）。
- 本段不声称 V8.2.1 的全量 QA 复跑（归 QA；`e2e_v8_3d.py` 的 `V8-3D-49` 仍需先改「默认 off」断言）。

### 5. 回滚

- 回滚到 V8.2.0：`git revert b6cbbd7` 后重新构建 / 推送即可；无数据迁移。
- 或只回滚表现层：把 `settings.board3d` 设为 `off`，主桌直接用 V7。

### 6. 已知限制 / 待验证

- 沿用 V8.2：3D chunk 155.05 KiB（≤160 验收；140 目标不可达）、无 3D 机舱全景 / 自由视角、题卡文字 DOM、小游戏原面板、真机 3D fps / 发热未验、WebGL context lost 未覆盖、音效未真机校准。
- 本次只动设置页文案 / 样式与版本号，不改变上述任何限制。

### 7. 变更记录（V8.2.1）

| 版本 | 日期 | 摘要 |
|---|---|---|
| 8.2.1 | 2026-11-19 | 设置页「3D 主桌」块标题标注「设备自检」、自检行提亮；`App.version` / title / manifest 升到 8.2.1；重建根产物（index 139.88KB gzip / 首屏 172.94KB / SW 78c1f4bd）。3D chunk 与玩法不变。 |

## V8.2.0 · 2026-11-19

- 版本：**8.2.0**（`app/src/app.js` → `App.version`；已确认）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变（仓库根产物 + GitHub Pages `main` 自动部署）；工作台记录：远程 main `3c920d1`，Actions run 144 success
- 依据：`docs/v8/impl-freeze.md`、QA V8 的 3D 视觉缺陷（V8-V-01/02/03/04/05）、`docs/v6/spec.md` §0.3、`app/DESIGN.md` §19
- 验收：3D 视觉修复由 FE 证据（`shots/v82-prod3d2/`）+ 图例/自检自测（`shots/v82-table3d2/`）覆盖；**完整 QA 套件对 V8.2 的复跑归 QA**，本文不把 V8.0 的 QA 数字当成 V8.2 的复跑结果

### 1. 为什么改（用户反馈与目标）

V8.1 已经把 3D 变成默认，但 QA 在 V8.0 构建上留了 **4 条视觉 P1 + 1 条 P2**：3D overview 上下暗场大、背景像空蓝（V8-V-01）、无机舱背景 / 无图例入口 / 格面语义弱（V8-V-03）、小熊压住格面字（V8-V-02）、飞行中远端格面中文随棋盘旋转斜置（V8-V-05），以及中心终点是平面金盘（V8-V-04，P2）。V8.2 的目标是**把 3D 从「能跑」收敛到「可以当默认画面」**，同时补上 3D 模式缺失的格子图例与设备自检，让「为什么没进 3D」可自查。

### 2. 变更（变更源：`docs/v8/impl-freeze.md` + `shots/v82-prod3d2/HANDOFF.md`）

#### 2.1 3D 视觉 P1（`app/src/view/board3d/**`）

| QA 项 | 改法 | 证据（数值） |
|---|---|---|
| V8-V-01/03 overview 大片空蓝 | 垫面从纯色 Lambert 改为「织纹层（lambert，吃灯光）+ 暗角 / 灯池 / 嵌线叠层（basic）」；织纹为程序化 CanvasTexture（felt 绒布 / paper 木纹），按主题缓存；棋盘改用投影包围盒自动上下居中，占宽按 ring 口径 87% | 空区颜色种类 **6 → 798**、行均值 std **0.21 → 5.33**；占宽 **0.8707 / 0.8736 / 0.8708**（390/320/430，目标 86–88%）；上下留白 **138.9/138.9**（390）、41.0/41.4（320）、167.8/167.9（430） |
| V8-V-02 小熊压字 | 舞台格 0.34→0.42 世界单位，换 256px 专用贴图（格面字偏前 + 类型名）；小熊移到格子左后（`STAGE_BEAR = {x:-0.072, z:-0.100, s:0.84}`） | 小熊真实网格轮廓 vs 格面字框：竖向重叠 **5px → 0px**；小熊左缘 **30.6 → 36.5px**（≥16）；舞台格右缘到卡片左界 **10.5 → 13.3px**；格面「真 / 真心话」完整可读 |
| V8-V-05 fly 中文斜置 | 额外生成「无中文图集」，fly 期间 `tileMat.map` 切过去（只留色块 + 箭头/星图标），land / cell45 / return / reduced 恢复；两版图集除中文外像素一致 | fly 阶段“无中文”截图；飞机锁在屏幕中心 `lock.maxAbsX=0 / maxAbsY=0`（board θ=1.734、tx=3.06 在变） |
| V8-V-04 中心平面金盘 | 改为鼓形圆柱（侧/顶双材质）+ 底盘环 + 悬浮环 + 挤出立体星徽 + 暖光晕；星徽慢转、悬环呼吸；顶面 256px 程序化金盘贴图，按主题换色 | drawCalls +2（hub 内 5 个 mesh）；overview 中心可见立体鼓面与星徽 |
| V8-V-03 信息密度 | 3D 模式补 HUD「图例」（11 类格面短字）；设置页补「设备自检」；格面语义由图例补足 | 119/119 自测、0 console error；图例 11 行、320 一屏读完、不遮暂停/安全词 |

#### 2.2 3D 图例入口（`table.js`）

- HUD「暂停 / 规则 / 图例」新增 `data-test="board3d-legend"`；只在 3D 显示（`.v6-lbtn{display:none}` + `.v6-3d .v6-lbtn{display:inline-flex}`），V7 不显示，V7 原有「落点格名 → 格子说明」原样保留。
- 面板 `data-test="board3d-legend-panel"`（默认 `hidden`）挂在 `.v6-boardwrap` 内，**顶边永远在 HUD 之下**，暂停与右上安全词不可能被遮（几何 + hit-test 双证）；11 行 `data-test="board3d-legend-row"`，内容与 `board3d/constants.js` 的 `GLYPH` 对齐（`真/敢/触/缘/温/轮/起/飞/停/归/·`，说明 ≤10 字）。
- 开合 = HUD toggle + 面板「收起」；打开时加 `.v6-l3o` 收起底部行动区（避免一边看图例一边掷骰，320×568 一屏读完）；3D 回落 V7 或题卡要上来时自动收起。
- 为控制 index 体积（140KB gzip 门禁）压掉了 Esc 收起、`role/aria-*` 装饰与渐变/毛玻璃（非任务卡要求，功能不变）。

#### 2.3 设置页设备自检（`settings.js`）

- 「3D 主桌」三档之下一行 `data-test="settings-board3d-status"`，文案示例：「当前设备：3D 可用 · 自动 · WebGL2 可用 · 减少动画：关 · 上次进主桌：用上了 3D / 用了 V7（原因）/ 还没进过主桌」；无 WebGL2 时主文案「当前浏览器未开启 WebGL2，会使用 V7」。
- 机读属性 `data-webgl2 / data-reduced / data-board3d-set / data-board3d-mount / data-board3d-reason`；**只读**：不写 settings、不触发挂载、不改默认值/三档逻辑。
- 读「上次 mount」优先级：`window.__V6_TEST__.board3d()`（主桌开着）→ `.v6-table[data-board3d]` → `window.__BOARD3D_LAST__`（卸载后的一行只读快照）。

#### 2.4 不变的东西（重要）

- **规则、数值、题库、文案、存档结构、导入导出、安全词机制与 V7 完全一致**；`App.Flight`、`App.BoardView`、`App.Cinema` 的数据与事件契约不变。
- 3D 仍然只做表现层：题卡 / HUD / 安全词 / 暂停是 DOM，小游戏仍是 `MiniGame`；canvas `pointer-events:none`，选子仍走 HUD。
- 版本：`App.version = "8.2.0"`；`app/index.template.html` title/og 为 V8.2；`manifest.webmanifest` name 为 V8.2。

### 3. 性能与兼容

- **构建**（`build_app.py --out dist/rebuild-v82-final --check`）：**37 passed / 0 failed → GREEN**；index 465,083 B raw / **143,219 B gzip = 139.86 KB**（门禁 140 KB，余量约 141 B）；首屏总 gzip **177,068 B = 172.92 KB**（门禁 180 KB）。
- **3D chunk**：`assets/board3d.55063017.js`，**609,547 B raw（595.3 KiB）/ 158,776 B gzip = 155.05 KiB**（验收 ≤160 KiB）；两次重建哈希一致（确定性）；比 V8.0 的 `9dc51f0f`（152.3 KiB）增加约 2.75 KiB，来自 4 个新纹理生成器 + fly 双图集。
- **SW**：`couple-flight-v6-3a1cec27`，PRECACHE 9 项（含 3D chunk）；离线机制沿用 V8 QA 已验证的「SW 预缓存 + 断网冷启动 3D 可挂载」，V8.2 只换了缓存版本与 chunk 哈希，发布前请按 `reports/v6/` 复核。
- **3D 几何量**（headless SwiftShader）：drawCalls 44→50、triangles 3,516→4,084、DPR 2；**不作为产品 fps 结论**（真机 iOS / Android 未验）。
- **存档**：`couple2.*` 键名、`v:2` 结构不变，**无迁移**；`settings.board3d` 缺省按 `auto`；V7 的进行中对局原样续玩。
- **回退**：`board3d=off` 或任何失败路径都回完整 V7；3D 的视觉修复不影响 V7 的 `Cinema` / `CellStage` / `CabinScene`。

### 4. 验收引用（不写数字，以报告为准）

| 项 | 证据路径 | V8.2.0 状态 |
|---|---|---|
| 3D overview / fly / bear / 中心终点视觉 | `shots/v82-prod3d2/HANDOFF.md`、`v82/flat-report.json`、`table/after-*.png` | 4 项 P1 + 1 项 P2 已修（FE 证据） |
| 3D 图例 / 设备自检 | `shots/v82-table3d2/HANDOFF.md`、`out/report.json`（119/119，0 console error / 0 pageerror） | PASS（FE 自测） |
| V8 3D 基础验收（挂载/镜头链/固定飞机/五条降级/reduced/320–430/主题/SW） | `reports/v6/qa-e2e-v8-3d.md`、`reports/v6/qa-v8-handoff.md` | V8.0 构建上 108/0；V8.2 复跑待 QA |
| V7 全量回归 | `reports/v6/qa-e2e-v8.md` | V8.0 构建上 567/0；V8.2 复跑待 QA |
| 构建门 / 体积 | `reports/v6/qa-report.md`、`reports/v6/logs/v8-build-check.log` + V8.2 构建实测 | 37/37 GREEN；index 139.86KB / 首屏 172.92KB / chunk 155.05KB |
| 汇总与发布判断 | `reports/v6/qa-report.md` | V8.0 口径 **PASS（含 P1）**；V8.2 视觉项已由 FE 证据关闭，**全量 QA 复跑后以新报告为准** |

> 注意：`qa/v6/e2e_v8_3d.py` 的 `V8-3D-49` 仍断言「默认 off」，与 V8.1 起的 `auto` 不一致；QA 复跑前需先改断言，否则会误报。

### 5. 回滚

- 与 V7 相同：GitHub 上 revert 发布 commit（或 `git revert <commit>` 推 `main`），Pages 自动回到上一版。
- V8.2 是纯表现层增量：回滚到 V8.1 / V8.0 / V7 **不需要任何数据迁移**，`couple2.*` 存档原样可用；`settings.board3d` 被旧版忽略（不报错），主桌回到旧默认或 V7。
- 构建产物结构未变（单文件 index + cards + sw + icons **+ 3D chunk**）；回滚时 `index.html` / `assets/` / `sw.js` 要一起换，避免出现「旧 index 指向新 chunk 名 / 旧 SW 缓存名对不上」。
- 只回滚 3D 的临时办法：把 `settings.board3d` 设成 `off`（设置 → 今晚的桌面 → 3D 主桌 → V7），不需要发版。

### 6. 已知限制 / 待验证

- **3D chunk 140KB 目标不可达**：three r180 的 named-import 最小包已约 132–136 KiB gzip，全场景再加约 30 KiB；V8.2 为 155.05 KiB，按 ≤160 KiB 验收，140 KiB 记为已知偏离（要砍能力才可能，需产品拍板）。
- **没有 3D 机舱全景 / 自由视角**：3D 场景是「机舱小桌板 + 云海 / 星轨 / 纸雕背景」；只有导演镜头，不能手势旋转 / 缩放 / 转头；选子仍走 HUD。
- **题卡文字仍 DOM、小游戏仍原面板**：3D 只画棋盘/飞机/骰子/格子/小熊。
- **飞行中格面中文隐去**：fly 期间用无中文图集，land / cell45 / reduced 恢复；要看字请等落地或看 HUD 图例。
- **320 格面短字仍偏小**（约 20px）：V8.2 用 HUD 图例补语义，极小屏可切回 V7。
- **真机未验**：iOS Safari / Android 中低端 GPU 的 3D fps / 发热 / 耗电未验，本文不写手机 fps；无头 SwiftShader 帧率只作几何 / JS 参考。
- **中途 WebGL context lost 未覆盖**：已验证的降级只有「无 WebGL2 / chunk 404 / mount 返回 null / mount 抛错 / off」五条。
- **音效未做真机校准**：WebAudio 合成占位，无头环境只验证 `setSound` 代码路径。
- **2D 侧还有 V7 遗留限制**：POV 非自由视角、小游戏未进 45° 舞台、格子序号只部分显示、主题不重绘主桌机舱（详见 V7 段）。

### 7. 变更记录（V8.2.0）

| 版本 | 日期 | 摘要 |
|---|---|---|
| 8.2.0 | 2026-11-19 | 3D 视觉 P1 修复：桌板绒布/木纹纹理 + 暗角、棋盘垂直居中 87% 宽、小熊移到格左后不压字、fly 隐去中文格字、中心终点立体（鼓面 + 星徽）；新增 3D HUD 图例（11 类格面短字）与设置页设备自检（WebGL2 / reduced / 档位 / 上次 mount）；构建 37/37、index 139.86KB / 首屏 172.92KB、3D chunk 155.05KB gzip。规则、数值、题库、存档、边界与安全词与 V7 一致。 |

## V8.1.0 · 2026-11-19

- 版本：**8.1.0**（`app/src/app.js` → `App.version`；已确认）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变；工作台记录：远程 main `867ca72`（Actions run 142+ success）
- 依据：用户反馈「打开游戏没啥变化，3D 也没有，跟随视角也没有」+ V8 QA `qa-v8-handoff.md` §6
- 验收：以线上冒烟与 `reports/v6/` 的 V8 QA 基线为准；本段不写未跑过的数字

### 1. 为什么改（根因）

V8.0 以 **Beta 默认 off** 发布：设置页才能手动开 3D，大多数用户看到的是 V7，于是体感「完全没变化」。另外首次进 3D 要下载约 600KB chunk（3s 量级），没有提示时更像「没反应」。V8.1 只做最小修复：**默认切到 auto、把载入/成功/失败说清楚、reduced 不再回退 V7**，不动规则与 3D 实现。

### 2. 变更

- `table.js` / `settings.js` 的 `BOARD3D_DEFAULT`：`off` → **`auto`**；`auto` 不再因 reduced 回 V7（reduced 时 3D 自己走静态棋盘）。
- 3D 首次载入 toast「正在载入 3D 主桌…」；激活 toast「3D 主桌已开启 · 飞机将固定在屏幕中心飞行」；无 WebGL2 / 失败 toast 明示回 2D；`off` 不提示。
- 设置页文案去掉「Beta」，三档说明改为「自动 / V7 / 3D（强制尝试，失败自动回 V7）」，并说明「减少动画时是静态 3D」。
- 入口不变：设置 → 今晚的桌面 → 3D 主桌（自动 / V7 / 3D）。
- **注意**：3D 跟随 / 飞行镜头只在成功走子时出现（掷 6 起飞后再走一步）；无子可走时不会飞。

### 3. 性能与兼容

- 首屏仍不加载 3D chunk；默认（V8.1 起）进主桌才懒加载，失败不阻塞。
- 存档：无迁移；`settings.board3d` 缺省按 `auto`；V7 / V6 存档照旧。
- 回滚：把默认改回 `off` 并重新构建即可（或让用户手动选 V7）；数据不受影响。

### 4. 验收引用

- V8 QA 基线：`reports/v6/qa-report.md`、`qa-e2e-v8.md`、`qa-e2e-v8-3d.md`、`qa-perf-v8.md`（V8.0 构建）。
- 线上冒烟：工作台记录 `shots/live-v81/`（默认 auto、3D canvas、chunk `9dc51f0f`、0 error）。
- 复跑提醒：`e2e_v8_3d.py` 的 `V8-3D-49` 仍断言默认 off，需随 V8.1 改断言。

### 5. 已知限制 / 待验证

- 沿用 V8.0：3D chunk 约 152.3KB、无 3D 机舱全景 / 自由视角、题卡文字 DOM、小游戏原面板、真机 fps 未验。
- 用户侧需要**硬刷新 / 关闭 PWA 重开**才能拿到新 SW 缓存；若仍无 3D，看是否出现「没开启 WebGL2」提示（多为浏览器 / 内置 WebView 限制），可在设置页自检（V8.2 起）确认。

### 6. 变更记录（V8.1.0）

| 版本 | 日期 | 摘要 |
|---|---|---|
| 8.1.0 | 2026-11-19 | `board3d` 默认 `off` → `auto`；首次载入 / 成功 / 失败均有提示；reduced 改为静态 3D 不再回退 V7；设置页去掉 Beta 文案。规则、题库、存档、边界与安全词不变。 |

## V8.0.0 · 2026-11-19

- 版本：**8.0.0**（`app/src/app.js` → `App.version`；已确认）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变；工作台记录：远程 API commit `1e4ed24`（Actions run 140 success）
- 依据：`docs/v8/impl-freeze.md`（用户拍板：全部 3D、固定飞机 + 棋盘旋转、45° 格子 + 3D 小熊 + 右侧内容卡）、`docs/v6/spec.md` §0.3、`app/DESIGN.md` §19
- 验收：`reports/v6/qa-report.md`（V8 口径）、`qa-v8-handoff.md`；**本段只引用已跑过的数字，不写真机 fps**

### 1. 为什么改（用户反馈与目标）

V7 的 45° 舞台是 CSS 3D 透视、棋盘是 SVG，用户希望主桌「全部 3D」：摇骰后棋盘放大、视角落到飞机；飞行时**飞机固定在屏幕上，棋盘旋转 / 平移**制造前进错觉；到目标格后 45° 格子 + 3D 小熊 + 右侧内容卡。V8 用 three r180 做一路独立的 3D 主桌，**V7 完整保留**作为能力降级，避免「一次性全换」的风险。

### 2. 变更

- 新增 `app/src/view/board3d/`（entry / scene / director / camera / mapping / textures / parts / bear / constants）：3D 圆形棋盘（52 环格 + 4 机坪 + 4×5 航线 + 中心终点）、低模纸飞机、3D 骰子、桌板 / 阴影 / 云海背景、3D 机长小熊、三主题（cloud / star / paper）。
- 镜头链：`overview → roll → focus → fly → land → cell45 → bear → return`；fly 期间相机停在 focus 位姿、飞机固定在屏幕中心、棋盘旋转 + 平移；题卡只出右侧 DOM 卡（`.v8-3d-card`，`.cs-left` 隐藏），做后 `returnToOverview` 回俯瞰。
- 构建：`build_3d_chunk()` 产出 three 独立 IIFE chunk（懒加载、内容哈希、SW PRECACHE），index 只注入 `window.__BOARD3D_URL`，首屏不加载；`--with-3d` 默认开、`--no-3d` 可关；`--check` 增加 3D 校验项。
- table / settings 接入 `settings.board3d`（`auto` / `off` / `on`），**Beta 默认 off**；失败路径（off / 无 WebGL2 / chunk 404 / mount 返回 null / mount 抛错）完整回 V7。
- 版本：`App.version = "8.0.0"`；title / og / manifest 为 V8。

### 3. 性能与兼容

- **构建**（V8.0 最终构建）：37 passed / 0 failed GREEN；index 138.2KB gzip / 首屏 171.2KB gzip；3D chunk `assets/board3d.9dc51f0f.js` 586.6KB raw / **152.3KB gzip**（验收 ≤160KB；冻结单 140KB 记为已知偏离）。
- **性能**（slow4G + 4×CPU）：DCL 1598ms（门槛 3500）、FCP 434ms（600）、主桌可掷骰 678ms（800）、heap 5.04MB（6）、断网冷启动 90ms（1500）、首屏请求 1（2）——均 PASS；3D 在 SwiftShader 下只记录几何 / JS（drawCalls 45–46 / triangles 3,518–3,520），**不以软件 fps 判产品**。
- **兼容**：`couple2.*` 键名、`v:2` 结构、导入导出、V6/V7 存档全部不变，无迁移；V7 的 E2E / 引擎 / 视觉走原路径。
- **回滚**：`settings.board3d=off` 或发版回退均可；V7 代码与资源未动。

### 4. 验收引用

| 项 | 报告路径 | V8.0.0 状态 |
|---|---|---|
| V7 全量回归（21 组） | `reports/v6/qa-e2e-v8.md` | **PASS 567 / FAIL 0 / SKIP 0** |
| V8 真 3D 套件 | `reports/v6/qa-e2e-v8-3d.md` | **PASS 108 / FAIL 0 / SKIP 0** |
| 性能预算 | `reports/v6/qa-perf-v8.md` | PASS 21 / FAIL 0 / SKIP 2（裸文件参考，不入门槛） |
| 汇总 | `reports/v6/qa-report.md` | **PASS（含 P1）**；P0 0 / P1 4 + P2 1（视觉） |
| 视觉评审 | `reports/v6/qa-v8-handoff.md` §5、`qa/v6/shots/v8-3d/` | 4 条 P1 + 1 条 P2（V8.2 全部修复） |

### 5. 已知限制 / 待验证

- 默认 `off`（Beta）：用户不手动开就看不到 3D（V8.1 修）。
- 4 条视觉 P1 + 1 条 P2：overview 上下暗场 / 无机舱背景与图例入口 / 小熊压字 / fly 格字斜置；P2 为中心平面金盘（V8.2 全部修）。
- 3D chunk 140KB 目标不可达（152.3KB），按 ≤160KB 验收。
- 真机 iOS / Android 3D fps / 发热未验；中途 WebGL context lost 未覆盖；音效实际出声未验。
- 无 3D 机舱全景 / 自由视角；题卡文字仍 DOM；小游戏仍 `MiniGame`。

### 6. 变更记录（V8.0.0）

| 版本 | 日期 | 摘要 |
|---|---|---|
| 8.0.0 | 2026-11-19 | 真 3D 主桌 Beta：three r180 独立 chunk 懒加载、3D 棋盘/飞机/骰子/小熊/三主题、镜头链 + 固定飞机棋盘旋转、45° 格子 + 右侧 DOM 卡；`board3d=auto / off / on`（Beta 默认 off），失败完整回 V7。构建 37/37、index 138.2KB / 首屏 171.2KB、chunk 152.3KB gzip；V7 回归 567/0、V8 3D 108/0、P0 0、P1 4 + P2 1。 |

## V7.0.0 · 2026-11-18

- 版本：**7.0.0**（`app/src/app.js` → `App.version`；已确认）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变（仓库根产物 + GitHub Pages `main` 自动部署）
- 依据：`docs/v7/impl-freeze.md`（用户拍板：**第三人称跟拍 + 第一人称 POV 两者都要**、主题 = 云海机舱、小熊随主题换装、每回合 5–8 秒、直接全量）、`docs/v6/spec.md` §0.2、`app/DESIGN.md` §18
- 验收：E2E / 性能 / 视觉由 QA 执行，报告在 `reports/v6/`；**本文件不写未跑过的数字**

### 1. 为什么改（用户反馈与目标）

V6.2 已经有「夜航客舱」和全动态镜头，但镜头始终是「一块棋盘被推近 / 拉远」——每回合的走子仍然只是棋盘上的动作。V7 的目标（冻结单原话）是：**把主桌从「一块好看的棋盘」升级为「每回合都像一小段电影」**：俯瞰 → 掷骰 → POV → 跟拍 → 落地 → 45° 格子特写 → 小熊 + 本格内容 → 拉回俯瞰。

用户拍板了五件事：**第三人称跟拍和第一人称 POV 两者都要**；主题 = **云海机舱**；小熊 = **随主题换装**；每回合 **5–8 秒**；范围 **直接全量**。所以 V7 是纯表现层改版：规则、题库、存档、边界与安全词不动，避免影响 V6.1 已经稳定的对局。

### 2. 变更（变更源：`docs/v7/impl-freeze.md`）

#### 2.1 每回合镜头链（`App.Cinema`）

| # | 状态 | 画面 | 时长 |
|---|---|---|---|
| 1 | `overview` | 整个棋盘俯瞰；当前玩家一侧灯亮 | 常驻 |
| 2 | `roll` | 骰子落桌、镜头轻推近、机舱轻震 | 约 1.0s |
| — | `overview`（多子可走） | 回俯瞰，可走子高亮 + 文字按钮，等玩家选子 | 用户操作 |
| 3 | `pov` | 第一人称：机头 / 机翼 / 速度线 / 云掠过，棋盘倾斜 | 约 1.1s |
| 4 | `chase` | 第三人称跟拍：目标格发光，飞机由远到近 | 1.5–2.3s |
| 5 | `land` | 落地：尘土 / 涟漪 / 轻震，目标格放大 | 约 0.5s |
| 6 | `cell45` | 棋盘压暗，目标格升到 45° 格子舞台 | 打开舞台即进入 |
| 7 | `bear` | 小熊探头，右侧内容卡滑入 | 舞台打开后约 0.64s |
| 8 | `return` | 卡片收起、小熊挥手、拉回俯瞰 | 约 0.8s |

- 整条目标是 **5–8 秒**（不含答题和读卡时间；各段见上表）。`choose-piece` 不是 Cinema 状态，回到 `overview` 等待选子。
- 镜头只改 `.v6-board` 的 `transform` 和宿主 `--cv7-*` 变量，不改布局、不拦点击（「快进」按钮除外）；POV 是**固定机位**，不做自由视角。
- 机舱场景继续保留：`CabinScene` 退到场景视差 / 灯光（`setCameraEnabled(false)`），棋盘相机由 `Cinema` 独占；`Cinema` 缺失时回退到 V6.2 场景相机。

#### 2.2 45° 格子舞台 + 小熊 + 内容卡（`App.CellStage` / `App.Bear`）

- 落在题卡 / 命运 / 收尾 / 进航时，棋盘压暗，目标格升起为 45° 小舞台：左列 45° 格面 + 探头小熊，右列暖纸内容卡（类型 / 星级 / 归属 / 来源 + 做了 / 放过）。
- 布局：430 宽约 **28% / 68%**；320 宽约 **22% / 74%**，卡片可滚动、按钮固定；高度按内容自适应并钳在 `[约 330px, min(520px, 视口高 - 104px)]`；长文本只在卡内滚动。
- 变体：普通题卡、命运格二选一（另加「今晚先不选」）、收尾信、进航题卡；「先看棋盘」可把舞台暂时收起，再「回到这张」。
- 层级：舞台 `z-index:320` > 题卡宿主（30），< 暂停（340）与安全词（380）；舞台根 `pointer-events:none`，只有内容卡可点。
- 小熊：单只向导，程序化 SVG，无外部素材；三套服装随主题（机长 / 星轨 / 纸雕），动作有探头、眨眼、耳朵抖、举牌、点头、放下牌子（不评判）；`aria-hidden`，不承载可读文本。
- `data-test` 与旧 `PromptCard` 对齐（`prompt-card / prompt-kicker / prompt-done / prompt-skip / prompt-actor / prompt-fate-option` 等），QA 可复用；`CellStage` 缺失 / 抛错时 `table.js` 回退旧 `PromptCard`。

#### 2.3 三个主题与门厅「今晚的桌面」（`App.Themes`）

| id | 名字 | 小熊 | 观感 |
|---|---|---|---|
| `cloud`（默认） | 云海机舱 | `pilot` 机长小熊 | 冷蓝云海 + 暖阅读灯；内容卡暖纸 |
| `star` | 星轨夜航 | `starlight` 星轨小熊 | 深紫星空 + 金色星轨；内容卡紫纸 |
| `paper` | 纸雕童话 | `paper` 纸雕小熊 | 暖纸层叠 + 台灯；内容卡奶白纸 |

- 门厅在「摆上棋盘」之前新增三选一（`data-test="theme-cloud|star|paper"`），点一下立即换、立即写 `settings.theme`，刷新记住；设置页也有同一排，并提示「题目、规则、你们的边界都不变」。
- 主题与玩家预设（名字 / 颜色 / 尺度）独立，可任意组合；主题样式由 `ui/themes.js` 注入，只覆盖变量与背景层，**不改 `base.css` 本体**。
- 主题作用范围：门厅 / 设置 / 回顾的全局背景层、文字与按钮令牌、45° 舞台与内容卡材质、小熊服装、`Cinema` 的 POV 前景色。**主桌机舱（舱壁 / 舷窗 / 桌板）与棋盘 SVG 本体的固定配色不在本版重绘**，`--v7-board-rim*` 等令牌当前由 `CellStage` 消费；主题粒子元数据（`App.Themes.particles()`）已下发但未接入场景 / 棋盘粒子。

#### 2.4 编排、快进与减少动画

- `table.js` 把 `BoardView.play(events)` 拆成 `dice / motion / rest` 三段：`roll` 先播骰子（与 `Cinema.roll` 并行）→ 多子可走回俯瞰等待 → `POV` → `BoardView.play(motion)` 与 `Cinema.chase` 并行 → `Cinema.land` → 其余事件；题卡 / 小游戏后 `Cinema.returnToOverview()`。
- **快进**：镜头动画期间显示「快进」（`data-test="cinema-skip"`，宿主 `data-cinema-skip="1"`）；点按后当前阶段立即到终态，后续阶段各约 130ms 到终态，直到回俯瞰；同时让棋盘演出到终态（BoardView 的 Esc / pointerdown / `skip()`），不悬挂、不补震动。
- **减少动画**：系统 `prefers-reduced-motion` 或设置里的「减少动画」命中时：`data-cinema-reduced="1"`、无 POV / 跟拍 / 震动 / 闪白 / `transform`；`pov()` / `chase()` 立即 resolve，各阶段 160ms 级淡入，格子舞台静态出现；关闭后镜头链恢复。

#### 2.5 不变的东西（重要）

- **规则、数值、题库、文案、存档结构、导入导出、安全词机制与 V6.2 完全一致**；`App.Flight`、`App.BoardView` 的数据与事件契约不变。
- 主桌新增的只是表现层模块：`view/cinema.js`、`ui/overlay/cell-stage.js`、`ui/bear.js`、`ui/themes.js`；`CabinScene` 的 V6.2 API 保留（新增 `setCameraEnabled`），`PromptCard` 保留为回退。
- 版本：`App.version = "7.0.0"`；`app/index.template.html` title/og 为 V7；`manifest.webmanifest` name 为 V7；构建模块表按 `themes → bear → … → cabin → cinema → … → prompt-card → cell-stage → table` 顺序，并有 `V7_ORDER_RULES` 闸门。

### 3. 性能与兼容

- 镜头全部走 `transform / opacity`，不跑滤镜 / 大层模糊；一条 `rAF` 只在过渡期间运行，结束释放；页面隐藏时把当前阶段收束到终态；卸载顺序 `Cinema → CabinScene → BoardView`。
- 首屏预算沿用 ADR-012（index gzip ≤140KB；首屏 ≤180KB，含 cards + manifest）；V7 新增的四个模块已计入构建产物体积。实际体积、帧率、长帧与视觉对比以 `reports/v6/` 为准。
- 存档：`couple2.*` 键名与 `v:2` 结构不变，**无迁移**；新增的 `settings.theme` 缺省 `cloud`，旧设置 / 旧导出没有该字段时按 `cloud` 处理；V6.2 的进行中对局原样续玩。
- 兼容：`prefers-reduced-motion` 与设置「减少动画」都生效（系统优先）；声音 / 震动设置不受影响；`CellStage / Themes / Bear / Cinema` 任一缺失都自动降级，棋局可继续。
- 构建模块顺序有闸门：`themes` 在 `boot / table` 之前，`cinema` 在 `cabin` 之后，`cell-stage` 在 `prompt-card` 之后、`table` 之前；顺序写错时 `build_app.py` 直接报错退出。

### 4. 验收引用（不写数字，以报告为准）

| 项 | 报告路径 | V7.0.0 状态 |
|---|---|---|
| 镜头链 / POV / 跟拍 / 快进 / reduced / 320–430 | `reports/v6/qa-e2e.md` / `qa-e2e.json` | 以 QA 最终报告为准（V7 用例） |
| 45° 舞台 / 小熊 / 三主题 / 长文本 / 安全词遮挡 | `reports/v6/qa-e2e.md` / `qa-e2e.json` | 以 QA 最终报告为准（V7 用例） |
| 首屏性能 / 主桌帧率 / 长帧 | `reports/v6/qa-perf.md` / `qa-perf.json` | 以 QA 最终报告为准 |
| 视觉回归（主桌 / 舞台 / 主题基线重建） | `reports/v6/qa-visual.md` / `qa-visual.json` | 以 QA 最终报告为准 |
| 汇总与发布门 | `reports/v6/qa-report.md`（`qa/v6/run_all.py`） | **发布判断以它为准确** |

DOC 侧核对（2026-11-18，可复现）：

- `App.version` 为 `7.0.0`（`app/src/app.js`）；`app/index.template.html` 的 title / og 为 V7；`manifest.webmanifest` 的 name 为 V7。
- `tools/rebuild/build_app.py` 的模块表含 `src/ui/themes.js`、`src/ui/bear.js`、`src/view/cinema.js`、`src/ui/overlay/cell-stage.js`，且 `V7_ORDER_RULES` 顺序闸门在。
- DOC 对一个干净输出目录跑过 `build_app.py --check`：33 个模块、27 项发布门 0 failed。本文件未写未跑过的 E2E / 性能数字。

### 5. 回滚

- 与 V6.2 相同：GitHub 上 revert 发布 commit（或 `git revert <commit>` 推 `main`），Pages 自动回到上一版。
- V7 是**纯表现层新增**：回滚到 V6.2 不需要任何数据迁移，`couple2.*` 存档原样可用；`settings.theme` 被旧版忽略（不报错），主桌回到 V6.2 的机舱 + 全动态镜头，题卡回到旧 `PromptCard`。
- 构建产物结构未变（单文件 index + cards + sw + icons）；只需回滚 `index.html` / `assets/` / `sw.js`；SW 缓存名带内容哈希，正常发版不用手工 bump。

### 6. 已知限制 / 待验证

- **POV 不是自由视角**：固定机位前景（机头 / 机翼 / 速度线 + 棋盘倾斜），不能转头 / 环顾 / 跟手指，也不改变可点区域。
- **小游戏没进 45° 舞台**：落在温度计 / 转盘格仍直接打开旧 `MiniGame` 面板；`CellStage` 的「开始小游戏」变体已渲染但 `table.js` 未接线。
- **功能格说明变体未接入**：引擎没有「功能格 prompt」；跳 / 飞走棋盘事件，进航走 `home-entry` 题卡，`CellStage` 的 `jump / fly / function` 变体当前不会被真实流程打开。
- **格子序号只部分显示**：内容卡能读「来自 真心话格」，但「第 N 格」只在引擎带 `preSquareId`（如进航）或调用方另传 `squareIndex / cellIndex` 时出现；普通题卡不保证有。
- **主题不给主桌机舱整体换肤**：主桌舱壁 / 舷窗 / 桌板与棋盘 SVG 仍是 V6.2 固定配色；主题主要改变门厅 / 设置 / 回顾背景、文字与按钮令牌、45° 舞台与内容卡、小熊服装、POV 前景色。
- **主题粒子是预留元数据**：`App.Themes.particles()` 已暴露种类 / 数量，但机舱 Canvas 与棋盘粒子尚未按主题切换。
- **45° 舞台是 CSS 3D 透视**：`perspective 560px + rotateX(52deg) + rotateZ(-45deg)` 的块面 + 投影，不是真 3D 引擎；小屏按 22% / 74% 收紧。
- **视觉基线会变**：主桌、45° 舞台、三主题的门厅 / 设置都可能需要按 V7 重建；`boot / prompt / ledger` 只在确有像素变化时更新（见 `reports/v6/qa-visual.md`）。
- **真机未验**：iOS Safari / Android Chrome 的 CSS 3D、长按、安全区仍未真机验证（沿用 V6.2 遗留）。
- **QA 最终报告**：V7 的 E2E / 性能 / 视觉以 `reports/v6/` 最新文件为准；若某项尚未覆盖，状态标「待验证」，不按旧版本推断。

### 7. 变更记录（V7.0.0）

| 版本 | 日期 | 摘要 |
|---|---|---|
| 7.0.0 | 2026-11-18 | 每回合 5–8s 镜头链（overview → roll → pov → chase → land → cell45 → bear → return）+ 第一人称 POV + 第三人称跟拍 + 落地反馈；45° 格子舞台 + 向导小熊 + 暖纸内容卡；三主题（云海机舱 / 星轨夜航 / 纸雕童话）+ 门厅「今晚的桌面」+ 设置页切换；快进 / reduced；规则、数值、题库、存档、边界与安全词与 V6.2 一致。更早版本的变更记录见下方 V6.2.0 §7、V6.1.0 §9 与附录 §8。 |

## V6.2.0 · 2026-11-18

- 版本：**6.2.0**（`app/src/app.js` → `App.version`；已确认）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变（仓库根产物 + GitHub Pages `main` 自动部署）
- 依据：`docs/v6/impl-freeze-cabin.md`（用户拍板：世界观 = 机舱、镜头 = 全动态、范围 = 全量）、`docs/v6/spec.md` §0.1、`app/DESIGN.md` §17
- 验收：E2E / 性能 / 视觉由 QA 执行，报告在 `reports/v6/`；**本文件不写未跑过的数字**

### 1. 为什么改（用户试玩反馈）

用户 V6.1.0 试玩后反馈：**「画面要身临其境，动画再多一点」**。此前主桌是一块「漂在夜空里的棋盘」，掷骰 / 走子 / 击落只有棋子自己的动作，镜头始终静止。

拍板结论：主桌搬进「夜航客舱」，镜头全动态（跟拍 + 震动），一次全量落地；**规则、数值与存档不动**，避免影响 V6.1 已经稳定的对局。

### 2. 变更（变更源：`docs/v6/impl-freeze-cabin.md`）

#### 2.1 场景：夜航客舱

- 主桌新增全屏场景：深靛 / 酒红舱壁与壁板接缝、顶部行李舱、两扇舷窗（圆角窗框 / 遮光板 / 玻璃反光）、窗外 Canvas（云、星、月 / 晨光、机翼与机翼灯）、浅木小桌板（棋盘坐在垫布上）、阅读灯与顶部灯带、前景灰尘 / 暗角 / 颗粒。
- 场景是**装饰层**：`pointer-events:none`、`aria-hidden`，不改变棋盘与 UI 的位置、层级和点击；场景缺席或加载失败时，主桌用暗色底照常工作。
- 热度与收家会改变窗外和舱灯：夜航 → 日出；换手时当前玩家一侧的阅读灯亮起。

#### 2.2 全动态镜头（事件 → 画面）

| 事件 | 画面回应 |
|---|---|
| 掷骰 | 轻推近；舱灯闪一下 |
| 起飞 / 走子 / 跳 / 飞 | 向落点方向跟拍；起飞时窗外云层加速，飞行时星光拉线 |
| 击落 | 画面震动 + 闪白 + 舱灯闪 + 桌沿红波纹 |
| 叠机 | 轻推近 + 心形脉冲光 |
| 换手 | 镜头移向当前玩家一侧，该侧阅读灯亮起 |
| 题卡 / 小游戏 | 拉远 + 压暗 + 桌沿聚光 |
| 热度升级 | 舱灯从琥珀变暖，云层散开一点 |
| 收家 | 拉远看窗外日出（约 8s 渐变）+ 顶部灯带亮起 |

镜头只改棋盘的 `transform`（平移 / 缩放 / 轻微旋转），不改布局、不拦截点击；动画时长都在冻结单范围内，结束回位。

#### 2.3 减少动画

- 设置「减少动画」或系统 `prefers-reduced-motion: reduce` 命中时：关闭镜头移动、震动、闪白、波纹、心形脉冲与粒子浮动；场景静态绘制，粒子减半；只保留透明度类过渡。
- 系统偏好优先：即使设置里关掉「减少动画」，系统要求减少动画时仍保持 reduced。
- reduced 下 `CabinScene.play()` 立即 resolve，不排队、不延迟棋局。

#### 2.4 不变的东西（重要）

- 规则、数值、题库、文案、存档结构、导入导出、安全词机制与 V6.1 **完全一致**；`App.Flight`、`App.BoardView` 的数据与事件契约不变。
- 主桌新增的只是 `App.CabinScene`（`app/src/view/cabin.js`）与 `.v6-cabin` 宿主；`table.js` 的集成全部防御式，场景失败不影响棋局。
- 版本：`App.version = "6.2.0"`；构建模块表新增 `src/view/cabin.js`（放在 `ui/screens/table.js` 之前）。

### 3. 性能与兼容

- 场景 Canvas 的 DPR 有上限（舷窗 ≤2、灰尘 ≤1.5），粒子数量按视口宽调整、reduced 减半；可见时约 30fps，页面切后台暂停，相机动画结束释放 rAF。
- 首屏体积预算沿用 `docs/v6/impl-freeze.md` / ADR-012（index gzip ≤140KB）；V6.2 的实际体积、帧率、长帧与视觉对比以 `reports/v6/` 为准。
- 存档：`couple2.*` 键名与 `v:2` 结构不变，**无迁移**；V6.1 的进行中对局原样续玩，刷新 / 离线行为不变。
- 兼容：`prefers-reduced-motion` 与设置「减少动画」都生效（系统优先）；声音 / 震动设置不受影响。

### 4. 验收引用（不写数字，以报告为准）

| 项 | 报告路径 | V6.2.0 状态 |
|---|---|---|
| 机舱层 / pointer-events / 相机事件 / reduced / 320–430 | `reports/v6/qa-e2e.md` / `qa-e2e.json` | 以 QA 最终报告为准（V6.2 用例） |
| 首屏性能与主桌帧率 / 长帧 | `reports/v6/qa-perf.md` / `qa-perf.json` | 以 QA 最终报告为准 |
| 视觉回归（`table` 基线更新） | `reports/v6/qa-visual.md` / `qa-visual.json` | 以 QA 最终报告为准 |
| 汇总与发布门 | `reports/v6/qa-report.md`（`qa/v6/run_all.py`） | **发布判断以它为准确** |

DOC 侧核对（2026-11-18，可复现）：

- `App.version` 为 `6.2.0`（`app/src/app.js`）；构建模块表含 `src/view/cabin.js`（`tools/rebuild/build_app.py`）。
- 机舱行为口径按 `app/src/view/cabin.js` 与 `app/src/ui/screens/table.js` 的集成代码核对；本文件未写未跑过的 E2E / 性能数字。

### 5. 回滚

- 与 V6.1 相同：GitHub 上 revert 发布 commit（或 `git revert <commit>` 推 `main`），Pages 自动回到上一版。
- V6.2 是**纯新增表现层**：回滚到 V6.1 不需要任何数据迁移，`couple2.*` 存档原样可用，只是主桌回到无场景的暗底棋盘。
- 构建产物结构未变（单文件 index + cards + sw + icons），只需回滚 `index.html` / `assets/` / `sw.js`；SW 缓存名带内容哈希，正常发版不用手工 bump。

### 6. 已知限制 / 待验证

- **QA 最终报告**：V6.2 的 E2E / 性能 / 视觉以 `reports/v6/` 最新文件为准；若某项尚未覆盖，状态标「待验证」，不按旧版本推断。
- **舷窗高度受 UI 限制**：舷窗只能放在顶部 HUD 与棋盘之间，小屏会被压矮（最小约 64–66px），不是固定设计比例。
- **桌面反馈落在桌板前沿**：涟漪 / 聚光 / 心形脉冲定位在棋盘下沿的桌板边上，不是棋子脚下的精确位置。
- **相机只有棋盘的 2.5D transform + 场景视差**，没有真正 3D 景深；收家 / 题卡用 base 相机，不写 `data-cabin-cam` 事件标记。
- **`setSound` 只保存开关**：机舱没有新增独立音效，声音仍由棋盘 / UI 层负责。
- **视觉基线**：`table` 需要更新；`boot / prompt / ledger` 仅在确有像素变化时更新。

### 7. 变更记录（V6.2.0）

| 版本 | 日期 | 摘要 |
|---|---|---|
| 6.2.0 | 2026-11-18 | 主桌「夜航客舱」场景（舱壁 / 双舷窗 / 云星 Canvas / 小桌板 / 阅读灯 / 前景）+ 全动态镜头（掷骰 / 走子 / 击落震动 / 换手 / 题卡 / 热度 / 收家日出）；reduced 全关；规则、数值、存档与 V6.1 一致。更早版本的变更记录见下方 V6.1.0 §9 与附录 §8。 |

## V6.1.0 · 2026-11-17

- 版本：**6.1.0**（`app/src/app.js` → `App.version`；发布前需确认已从 6.0.0 升到 6.1.0，见 §8）
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：不变（仓库根产物 + GitHub Pages `main` 自动部署）
- 依据：`docs/v6/impl-freeze-v6.1.md`（用户拍板的规则，唯一协调口径）、`docs/v6/spec.md` §0、`app/DESIGN.md`、`docs/v6/copy.md`
- 验收：E2E / 性能 / 视觉由 QA 执行，报告在 `reports/v6/`；**本文件不写未跑过的数字**

### 1. 为什么改（用户试玩反馈）

用户 V6.0.0 试玩后提了两条：

1. **「一局结束太快」**：题卡数 / 心动值一到就收尾，还没走完棋盘就结束了，棋没下完的感觉很重。
2. **「开局摇 6 起飞有一家非常难」**：整局都可能摇不到 6，一架飞机都上不了场。

拍板结论：结束回到飞行棋本身——**任意一方把本局全部飞机送进终点才结束**；起飞**保留 6**，但加**两回合保底**。

### 2. 规则改动（变更源：`docs/v6/impl-freeze-v6.1.md`）

#### 2.1 结束条件：一方全部飞机到家

- 新判定：`allHome(a) || allHome(b)`，即某一方**本局所有**飞机 `arrived === true` → 写 `winnerId` → 发 `win` 事件 → 两张收尾卡。
- 快局每人 **2 架**；长夜每人 **4 架**（模式不变）。
- 判定时机：每次走子 / 题卡结算之后（`afterAction` / `resolvePrompt` 之后）；最后一步落格题卡先结算，再进收尾。
- 收尾流程不变：两张「今晚最后一张」各给一人，都可放过；两张处理完进「今晚回顾」。

#### 2.2 起飞保底：6 起飞 + 两回合保底

- 仍要**掷出 6** 才能起飞。
- 同一玩家**连续 2 个自己的回合都没掷出 6**（且该玩家所有未到家的飞机都在机坪）→ **第 3 个自己的回合任意点数都可起飞**。
- 计数 `takeoffMiss`（`{a,b}`，0–2）：**掷出 6 一律清零**；实际起飞清零；非 6 时只有「所有未到家的飞机都在机坪」才 +1（有子在外面就不累计）。
- 计数时机：**换手前**按本回合点数记账，`computePlan` 读的是本回合开始前的计数 —— 所以第 1、2 个没 6 的回合不会提前起飞。
- 提示：具备保底时，掷骰前显示「连续两次没起飞 · 这一掷任意点数保底起飞」（`data-test=takeoff-pity`）；骰子事件带 `pity: true`。

#### 2.3 不再触发结束的字段

- `targetCards`、`targetHeat` **保留但不参与判定**（旧 UI / 旧测试兼容）；题卡做到 20 张、心动值到 100，只要没全部到家就**不结束**。
- 去掉 V6.0 的「长夜任一架进终点就结束」。
- 心动值只作过程记录，不加减输赢分。

#### 2.4 收尾与回顾文案

- 主桌 `win` 后显示「**<姓名> 先到家**」（`data-test=winner-text`）；「今晚完成了」保留。
- 回顾首屏「<姓名> 先到家」+「已到家 X/N 架」，汇总新增一格「已到家」（`data-test=ledger-home`）。
- 不出现「输 / 赢 / 胜 / 负」；赢家不额外加心动值、输家不扣分。
- 旧档 `ledger.ending='shared'`（V6.0 合作收尾）显示「今晚一起走到这里」；`safe` 显示「今晚就到这 / 安全词收棋」。

### 3. UI / 文案改动（`docs/v6/copy.md` 已同步）

| 位置 | V6.0.0 | V6.1.0 |
|---|---|---|
| 门厅模式卡 | `目标 4 张题卡 · 约 8–12 分钟 · 2 架` / `目标 8 张题卡 · 约 25–40 分钟 · 4 架` | `先送完 2 架飞机 · 约 15–25 分钟 · 每人 2 架` / `先送完 4 架飞机 · 约 30–50 分钟 · 每人 4 架` |
| 玩法速览 | 6 条：6 起飞 / 6 可再掷 / 跳飞进航 / 击落 / 放过 / 安全词 | 6 条：**6 起飞 · 6 可再掷（含保底）** / 跳飞进航 / 击落 / **先到家就收尾** / 放过 / 安全词（第 4 条高亮 `data-test=rules-end`） |
| 主桌状态条 | `第 N/目标 张 · 心动值 X · 连击 Y` | `红 X/2 · 黄 Y/2 · 心动值 X · 连击 Y`（双方已到家；`第 N 张` 只作过程计数） |
| 起飞提示 | 无 | 保底回合掷骰前提示「连续两次没起飞 · 这一掷任意点数保底起飞」 |
| 无子可走原因 | 「没掷到 6」 | 「都还在机坪：掷出 6 起飞；连续两次没起飞后，这一掷任意点数保底起飞」 |
| 主桌胜者 | 无 | 「<姓名> 先到家」 |
| 回顾 | 无输赢、6 类信息 | 6 类信息 + 「<姓名> 先到家」+「已到家 X/Y」 |

### 4. 兼容性

- **进行中的 V6.0 对局（`couple2.session`，`v:2`）原样续玩**：`Flight.validate()` 只补可选默认值 `takeoffMiss: {a:0,b:0}`（与 `winnerId: null`），**不新增必填项**；读数失败不丢档（先备份再移除）。
- **V5 对局（`v:1`）**：仍按 V6.0 的迁移规则处理（补 `mode / targetCards / targetHeat / cardsProcessed / meta / endingQueue` 等），V6.1 再补 `takeoffMiss`；`v` 升为 `2`。
- **旧回顾（history）**：`ending` 缺值 / 仍是 `shared` 时按 `winnerId` 兜底，都没有就显示「今晚一起走到这里」；`stats.planesHome` 兼容旧的总数（number）与完全没有该字段的旧档（显示 `—`）。
- **存档键名、导出/导入格式不变**：仍是 `couple2.*` 与 `{ app:"couple-flight", v:6, ... }`；导入仍对 `flight` session 先 `validate()`。
- **不兼容的只有语义**：旧档里 `targetCards` 之后不再当结束条件用（字段仍保留，不影响续玩）。

### 5. 验收引用（不写数字，以报告为准）

| 项 | 报告路径 | V6.1.0 状态 |
|---|---|---|
| 引擎单测（全到家收尾 / 题卡 20 张不结束 / 起飞保底 / 旧档补 `takeoffMiss`） | `qa/rebuild/flight-engine.test.mjs`（`node` 直接跑） | **已通过**：DOC 于 2026-11-17 执行，用例已随 V6.1 更新（含 §20「结束条件与起飞保底」）；条数以最新一次执行为准 |
| 浏览器 E2E（主路径改为「构造一方全到家」+ 保底用例） | `reports/v6/qa-e2e.md` / `qa-e2e.json` | **待 QA 重跑**：目录里的报告仍是 V6.0.0 的 |
| 首屏性能预算 | `reports/v6/qa-perf.md` / `qa-perf.json` | 待重跑（V6.1 未改构建产物结构，预期同档） |
| 视觉回归 | `reports/v6/qa-visual.md` / `qa-visual.json` | 待重跑（门厅 / 状态条 / 回顾有文案变化，基线需更新） |
| 汇总 | `reports/v6/qa-report.md`（`qa/v6/run_all.py`） | **待 QA 最终报告；发布门以它为判断依据** |

DOC 侧自查（本文件可复现，数字以最新一次执行为准）：

- `node qa/rebuild/flight-engine.test.mjs` → 通过（2026-11-17 执行；V6.1 §20 覆盖「一方全部到家结束」与「两回合保底起飞」；条数以最新一次执行为准）。
- `python tools/rebuild/build_app.py --out dist/doc-verify --check` → 发布门 GREEN（体积在 ADR-012 预算内；具体数字以最新一次执行与报告为准）。
- 引擎侧脚本走通 §7 路径：注入 `home:<color>:3/4` → `roll(1) → move → roll(1) → roll(2)` → 事件 `dice → move → win → prompt → ending-start`，两张收尾卡后 `phase='ended'`、`ledger.ending='win-a'`、`stats.planesHome={a:2,b:0}`（详见 `docs/v6/spec.md` §7）。
- 旧档兼容：删掉 `takeoffMiss` 的 `v:2` 档经 `validate()` 补 `{a:0,b:0}`；`v:1` 档同样接受并升到 `v:2`。

### 6. 回滚

- 与 V6.0.0 相同：GitHub 上 revert 发布 commit（或 `git revert <commit>` 推 `main`），Pages 自动回到上一版。
- 整套回滚命令见附录 §5；**V6.1.0 只改应用内规则与文案**，构建产物结构未变，回滚 V6.0.0 的 `index.html` / `assets` / `sw.js` 即可。
- SW 缓存名带 `index.html` 内容哈希，正常发版不需要手工 bump。

### 7. 已知限制 / 已知问题

沿用附录 §6（竖屏 320–430、两人共机、无联机、PWA 需 https、暂停时长未从回顾扣除等）。V6.1 新增/待对齐：

- **一局变长**：全到家结束意味着快局比 V6.0 长（门厅写 15–25 分钟）；第一次玩建议先选快局。
- **规则速览结构**：第 1 条合并成「6 起飞 · 6 可再掷」、第 4 条新增「先到家就收尾」，条数仍是 6（`copy.md` §9-D10）。
- **暂停页状态卡**仍是 V6.0 的「第 N/目标 张」（`app/src/ui/screens/pause.js`），未改成「双方已到家」（`copy.md` §9-D9，待对齐）。
- **安全词收尾的回顾标题**当前写「安全词收棋」，`copy.md` §5.3 要求「今晚就到这」（`copy.md` §9-D11，待对齐）。
- **`App.version` 仍为 6.0.0**（`app/src/app.js`），发布前需升到 6.1.0（见 §8）。

### 8. 待验证 / 待对齐（本文件与实现状态）

| # | 项 | 现状 | 需要谁 |
|---|---|---|---|
| V1 | `App.version` | `6.0.0`（未升） | Lead / BE：改成 `6.1.0` 后重新 `--release` |
| V2 | 引擎单测 | 已通过（2026-11-17 执行，含 V6.1 结束条件与保底起飞用例；条数以最新一次执行为准） | 已由 BE/QA 完成；后续改动需重跑 |
| V3 | E2E 主路径 | 仍是 V6.0 的「4 张题卡 → 收尾」断言 | QA：按 `spec.md` §7 改成「构造一方全到家」 |
| V4 | 暂停页状态卡文案 | 仍是「第 N/目标 张」 | fe-table / fe-shell（或 Lead 指派） |
| V5 | 安全词收尾回顾标题 | 实现写「安全词收棋」，文案要求「今晚就到这」 | fe-cards |
| V6 | 线上冒烟 | 未执行（发布后 1–2 分钟生效） | Lead |

### 9. 变更记录

| 版本 | 日期 | 摘要 |
|---|---|---|
| 6.1.0 | 2026-11-17 | 结束=一方全部飞机到家（快局 2 / 长夜 4），题卡数/心动值不再结束；6 起飞 + 两回合保底（`takeoffMiss`）；门厅模式卡、玩法速览 6 条、主桌状态条/保底提示/「先到家」、回顾「已到家 X/Y」同步；旧档补 `takeoffMiss` 续玩。 |
| 6.0.0 | 2026-11-16 | 视觉 A；SVG 2.5D 棋盘替代 three.js；心动值 / 连击 / 命运格 / 合作收尾；暂停 / 安全词全屏；今晚回顾 + 分享图；题库外链哈希 + SW 模板 + minify + `--check` 发布门；V5 存档迁移与备份（全文见附录）。 |

---

# 附录 · V6.0.0 发布说明（2026-11-16 归档）

- 版本：**6.0.0**（`app/src/app.js` → `App.version`）
- 日期：2026-11-16
- 线上：<https://chundongtou.github.io/couple-game/>
- 发布方式：仓库根产物 + GitHub Pages `main` 自动部署（本文档不改变发布方式）
- 需求 / 设计 / 验收：`docs/v6/spec.md`、`app/DESIGN.md`、`docs/v6/impl-freeze.md`；性能 / E2E / 视觉数据由 QA 执行，报告在 `reports/v6/`

---

## 0. 一句话

V6 把「今晚飞行棋」从能玩的原型改成**暗光下好看、反馈清楚、20 分钟内能收尾的双人升温棋**：视觉换成 **A · 午夜星轨 · 暖光纸感**，three.js 3D 棋盘换成 **SVG 2.5D 棋盘**（首屏不再加载 511 KB 的 `board.js`），并补齐心动值、连击、命运格、合作收尾、暂停/安全词、今晚回顾与分享图。**无输赢，合作收尾；V5 存档不丢。**

---

## 1. 主要变更

### 1.1 视觉：A · 午夜星轨 · 暖光纸感

- 深夜星空 + 琥珀/玫瑰暖光；玻璃面板与暖纸题卡的对比；宋体标题 + 黑体正文（系统字体栈，不引外链字体）。
- 设计令牌统一在 `app/src/styles/base.css` 的 `:root`（颜色 / 圆角 / 缓动 / 字体），所有屏幕只读变量。
- 门厅 360×640 首屏可见主按钮「摆上棋盘」；360 / 390 / 430 三档视口无横向滚动（QA 覆盖 320/360/390/430）。

### 1.2 棋盘：SVG 2.5D 替换 three.js

- 新棋盘由 `app/src/view/board.js`（`App.BoardView`）用 SVG 绘制：52 格主环 + 4 色 × 4 机坪 + 4 色 × 5 航线 + 4 终点 = **92 个格位**；中心是心动温度环与连击。
- 首屏与主桌**都不加载** `assets/board.js`（V5 的 511 KB three.js 产物）；3D 资源保留为回滚参考（见 §5）。
- 骰子点数有文字、无子可走有原因、可走子有文字按钮、落点有格名；动画时长上限：骰子 1.6s、整次走子 2.0s、题卡 0.4s，减少动画时关键反馈 ≤100ms。

### 1.3 玩法：心动值 / 连击 / 命运格 / 合作收尾

- **心动值**：双方共享 0–100，只增不降。题卡「做了」+8、「放过」+3；小游戏完成 +5、跳过 +0；收尾卡 +10 / +3；命运卡选「做了」+8、不选 +3；棋盘动作本身 +0（击落 / 叠机 / 进航抽到的卡按题卡结算）。五阶段：灯刚亮 / 有点热 / 靠近了 / 很近了 / 今晚可以更近。
- **连击**：「做了」+1，放过不清零；每 3 次记一个里程碑事件（V6 界面只显示连击数，双人选卡奖励留待后续）。
- **命运格**：第 5、29 格，两张不同池的卡二选一；另一张放回；不选不惩罚，不计入目标张数。
- **合作收尾**：快局 2 架 / 目标 4 张或 40；长夜 4 架 / 目标 8 张或 80，长夜多一个「任意一架进终点」条件。任一满足进入「今晚最后一段」：两张收尾卡一人一张，都可放过；结束**不判输赢**（`winnerId` 保留但不展示，ledger `ending` 为 `shared` / `safe`）。
- **放过不惩罚**（P0 红线）：心动值不减少、不阻断进终点、不丢叠机奖励步、连击不清零、回顾不写失败、放过也计入目标张数（修掉 V5「全放过永远结束不了」的问题）。

### 1.4 暂停 / 安全词

- 所有屏幕常驻右上角「先收棋」胶囊：按住 **1.6 秒**（环形进度）打开暂停层，不归档、不卸载当前屏。
- 暂停层四个动作：继续 / 今晚就到这 / 看今晚记录 / 加一条今晚不做的；只有「今晚就到这」确认后才归档进回顾（`ending:"safe"`）。
- 修掉 V5「安全词只在主桌、会遮挡离开按钮」的问题：主桌的暂停按钮与安全词区域不再重叠（QA 点击命中验证）。

### 1.5 今晚回顾 / 分享图

- 回顾页固定 6 类信息：今晚（日期/姓名/尺度）、时长、题卡（共 N / 做了 D / 放过 S）、心动值（含阶段名）、最高连击、小游戏；下方「今晚的每一张」可展开原文。
- 小游戏明细写「温度计 · 完成」「转盘 · 跳过」，不再出现 V5 的占位「（这一笔没有句子）」。
- 「存成图片」：本机 Canvas 生成 1080×1350 PNG（暗夜星轨 + 暖光纸感），**不请求网络、不上传、不生成外链**；默认不画题卡原文（显式 `includeText` 才画，最多 4 条）。
- 「以前的夜」最多保留 60 局；回顾无「输赢」。

### 1.6 工程与构建管线

- 题库外链：`assets/cards.<内容哈希>.js`（head `preload` + body `defer`），不再阻塞首屏；`index.html` 内联 CSS + 全部应用 JS。
- `sw.template.js` → `sw.js`：`CACHE = couple-flight-v6-<index.html sha256 前 8 位>`，`PRECACHE` 与磁盘一致、不含 `board.js`；导航 network-first、静态 cache-first；断网冷启动已验。
- minify 默认开：esbuild **0.25.12**，`target=es2018`、`charset=utf8`；`--no-minify` 可关。
- 发布门 `build_app.py --check`：**27 项**（模板/包标记、head 无阻塞脚本、资源存在、哈希一致、产物不含 board.js、sw 缓存与预缓存、manifest、ADR-012 三项预算）。
- 预算按 **ADR-012**：`index.html` ≤520 KB raw / ≤140 KB gzip；首屏总 gzip（index+cards+manifest）≤180 KB。

---

## 2. 性能（QA 实测，gzip 静态服务 + slow4G + 4×CPU）

数据来源：`reports/v6/qa-perf.md`（QA 生成于 2026-11-16 17:53，构建 `index.html` sha256 前 8 位 `a0bb61f1`）。V5 基线来自 `docs/v6/architecture.md` §1（本机同档实测）。
> 这些数字是本文编写时的快照；FE 后续若再改 UI，构建哈希与体积会轻微变化，发版前以最后一次 `build_app.py --check` 与 QA 报告为准。

| 指标 | V6 | V5 基线 | 说明 |
|---|---|---|---|
| 门厅 DCL（slow4G + 4×CPU） | **1384.2 ms**（3 次中位） | **4630 ms** | 不再加载 `board.js` + 题库移出关键路径 |
| 门厅 FCP（同档） | **384 ms** | 508 ms | 首屏骨架先把画面撑住 |
| `index.html` raw | 293.3 KB | 173.4 KB | SVG 棋盘内联，单文档变大 |
| `index.html` gzip | 92.7 KB | 47.1 KB | 同上 |
| 首屏总 gzip（index + cards + manifest） | **125.7 KB** | **209.4 KB**（index 47.1 + board 126.3 + cards 32.9 + sw 2.6 + manifest 0.4） | 减少约 40%；V5 的 126.3 KB `board.js` 是主因 |
| 主桌可掷骰（从点「开始」起） | 579 ms | 未测（V5 无此预算） | PB-6 |
| 主桌 JS heap | 5.77 MB | 11.02 MB（含 3D 棋盘） | three.js 常驻约 8.9 MB 被移除 |
| 首屏必需网络请求数 | 1 | 4（doc + board + cards + manifest） | PB-13 |
| 断网冷启动门厅 | 84 ms 且可开局 | 未测 | PB-12，SW 命中 |

- 口径说明：DCL 同档多轮实测在约 1.26–1.47s 之间浮动（本报告取最新一轮 3 次中位 1384ms）；V5 首屏总 gzip 的 AR §1.1 口径为 209.4KB，任务口径约 223KB（含 `board.js` 126KB），两种口径下 V6 的 125.7KB 都更低。
- 预算明细：PB-1/PB-2/PB-3/PB-4/PB-5/PB-6/PB-7/PB-12/PB-13 与两条裸文件参考全部 PASS（12/12）。
- 读法：单看 `index.html` 比 V5 大（92.7KB vs 47.1KB），因为 SVG 棋盘内联进去了；但 V5 还要再阻塞下载 `board.js`（126.3KB gzip）与 `cards.js`（32.9KB gzip），所以**首屏总 gzip 是 125.7KB vs 209.4KB**，DCL 也从 4630ms 降到 1384ms。
- 复现：`python tools/rebuild/build_app.py --out dist/rebuild --check`（体积）+ `python qa/v6/perf_budget.py --dist dist/rebuild`（时间，需 Playwright + Edge）。

---

## 3. 兼容性

### 3.1 V5 存档（不丢档）

- 进行中的 V5 飞行棋（`couple2.session`，`kind:"flight"`，`v:1`）**原样续玩**：`Flight.validate()` 只补可选默认字段（`mode / targetCards / targetHeat / cardsProcessed / meta / endingQueue`），**永不新增必填项**；`v` 升为 `2`。
- 首次读到 session 时把原始 JSON **原样备份**到 `couple2.backup.session`（只写一次，不覆盖；quota 失败静默跳过）。
- V5 停在「赢家收尾」的单卡局面：保留已发的那张，按单卡收束。
- 公寓局（`kind:"apartment"`）和更早的升温夜航：收进「以前的夜」（`couple2.history`，标题「今晚在这间公寓」/「以前的夜航」），不按 V6 规则续玩。
- 设置里的公寓遗留 `maxStar / gentleOnly` 会清掉并给 `suggestScale` 建议。

### 3.2 导出 / 导入

- 导出：`{ app:"couple-flight", v:6, exportedAt, settings, session, history, standalone, pending }`。
- 导入兼容 `couple-flight / couple-apartment / couple-voyage`；对 `flight` session 先 `validate()`，不通过整体拒绝且不覆盖现状；history 最多保留 60 条。
- 所有数据只在 `localStorage`（`couple2.*`），没有账号 / 云同步 / 上传；换手机请用导出/导入。

### 3.3 行为变化（与 V5 不同，需要知道）

1. **公寓玩法下线**：公寓的门厅 / 房间 / 关灯 / 游戏门那套屏幕不再是线上玩法；旧档进「以前的夜」。
2. **3D 主桌不再加载**：V6 主桌始终 SVG；`assets/board.js` 与 `app/render/` 保留为回滚资源，`settings.boardView:"3d"` 只是预留字段，当前不生效。
3. **结束不判输赢**：`winnerId` 不再展示；收尾统一为「今晚最后一段 + 今晚回顾」。
4. **放过语义修正**：放过不再阻断进军、不丢叠机奖励步、也计入目标张数（V5 的旧行为已修）。
5. **命运格位置**：规格候选 7/31，因 7 与绿方飞点冲突，落地为 5/29。
6. **安全词**：从「只在主桌」改为全屏常驻；长按 1.6 秒进暂停（不归档）。

---

## 4. 验收结果引用

> 以下 E2E / 性能 / 视觉均为 **QA 执行**，本文件只引用报告；数字以报告文件为准。

| 项 | 报告 | 最终状态（2026-11-16 18:40） |
|---|---|---|
| E2E（Playwright + Edge，全部分组 + 320/360/390/430） | `reports/v6/qa-e2e.md` / `qa-e2e.json` | **PASS 526 / FAIL 0 / SKIP 0** |
| 首屏性能预算 | `reports/v6/qa-perf.md` / `qa-perf.json` | **PASS 12 / 12**（gzip 口径 DCL 1229–1343ms、FCP 344–416ms、首屏总 gzip 125.8KB、断网冷启动 71–84ms） |
| 视觉回归 + 结构断言 | `reports/v6/qa-visual.md` / `qa-visual.json` | **PASS 49 / 0**（boot / table / prompt / ledger 基线；无 JS 错误） |
| 汇总 | `reports/v6/qa-report.md`（`qa/v6/run_all.py` 生成） | **PASS 589 / FAIL 0 / SKIP 0**；P0 执行 473/473（100%）、缺陷 0；**可发布：是** |

DOC 侧自查（命令与输出）：

- `python tools/rebuild/build_app.py --out dist/doc-verify --check` → **27 passed / 0 failed → GREEN**，index 293.3 KB raw / 92.7 KB gzip，首屏总 gzip 125.7 KB。
- `node qa/rebuild/flight-engine.test.mjs` → **700 passed / 0 failed**。
- 说明：完整 E2E / 性能 / 视觉需 QA 环境（Playwright + Edge）；DOC 未重复执行，引用上面 QA 报告。

**发布判断**：最终 QA 汇总 **PASS 589 / FAIL 0 / SKIP 0**，P0 用例 473/473、缺陷 0，**可发布：是**（发布门 = P0 全绿 + 构建 `--check` + 引擎 0 failed）。此前 Q-01（收尾文本 962ms）、Q-02~04（回顾时长「不到 1 分钟」）已分别修复并由最终全量复跑验证（收尾文本 0–57ms、时长「27 秒」）。

---

## 5. 回滚

- 最快：GitHub 上 revert 合并后的 commit（或 `git revert <commit>` 推 `main`），Pages 自动回到上一版。
- **整套回滚**：`git checkout <old-commit> -- index.html manifest.webmanifest sw.js assets/ icons/`（`index.html` / `assets` / `sw.js` 必须来自同一次构建，否则缓存与引用会对不上）。
- V6 的 SW 缓存名带 `index.html` 内容哈希，正常发版**不需要手工 bump 缓存版本**；回滚到 V5 时把 V5 的 `sw.js`、`assets/board.js`、`assets/cards.js` 一并恢复。
- 详细步骤与 3D 回滚资源说明见 `docs/REBUILD.md` §6。

---

## 6. 已知限制与已知问题

### 6.1 产品限制

- 只做竖屏，目标宽度 320–430；横屏 / 平板不做两栏布局。
- 两个人共用一部手机、轮流操作；没有联机 / 账号 / 云同步 / 第三人。
- 高尺度内容面向成年伴侣，需双方共同同意；任何一方随时可以停。不是未成年人内容。
- PWA 安装需要 `https` 或 `localhost`；iOS 只支持 Safari「添加到主屏幕」；局域网 `http://IP` 只能玩、不能安装。

### 6.2 已知问题（截至本文编写）

- **暂停时长计入回顾（P1，RV R-01）**：主桌暂停的秒数未从 `durationMs` 扣除，回顾时长会比实际活跃时长略长；不影响题卡/心动值/收尾。
- **暂停态刷新不复原暂停页（P1，RV R-02）**：暂停中刷新会回到主桌并恢复对局；状态不丢，但没有停在暂停层。
- **回顾页未显示目标张数（P2，RV R-03）**、**收尾/回顾未逐字写「记录会留着」（P2，RV R-04）**：均不影响主路径与数据。
- **连击里程碑奖励未上线**：引擎已发 `milestone` 事件，但「双人选卡」是 P1，V6 只显示连击数。
- **`boardView:"3d"` 预留字段不生效**：V6 主桌只用 SVG；若要 3D 主桌需回滚到 V5 或单独立项接回 loader。
- **仓库根 `--release --check` 会因回滚资源 `assets/board.js` 变红**：发布门请对干净输出目录跑 `--check`（见 `docs/REBUILD.md` §5.4）。

---

## 7. 后续（不在 V6 范围）

- P1：连击里程碑「双人选卡」奖励；暂停时长的统一扣除；暂停态刷新恢复；3D 回滚开关（若还要）。
- P2：回顾目标张数、收尾「记录会留着」逐字文案、回顾卡片图样式、长夜「谁先到家」彩蛋、横屏/平板、棋盘皮肤、成就系统、多语言（见 `docs/v6/spec.md` §5.9）。

---

## 8. 变更记录

| 版本 | 日期 | 摘要 |
|---|---|---|
| 6.0.0 | 2026-11-16 | 视觉 A；SVG 2.5D 棋盘替代 three.js；心动值 / 连击 / 命运格 / 合作收尾；暂停 / 安全词全屏；今晚回顾 + 分享图；题库外链哈希 + SW 模板 + minify + `--check` 发布门；V5 存档迁移与备份。 |
