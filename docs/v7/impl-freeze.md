# V7「云海机舱 · 45° 格子剧场」冻结单（2026-11-18）

> 用户拍板：两者都要（第三人称跟拍 + 第一人称 POV）；主题 = **云海机舱**；小熊 = **随主题换装**；每回合 **5–8 秒**；**直接全量**。
> 目标：把主桌从「一块好看的棋盘」升级为「每回合都像一小段电影」：俯瞰 → 掷骰 → POV → 跟拍 → 落地 → 45° 格子特写 → 小熊 + 本格内容 → 拉回俯瞰。

## 1. 每回合镜头链（状态机）

| # | 状态 | 画面 | 时长 |
|---|---|---|---|
| 1 | overview | 整个棋盘俯瞰；当前玩家机坪/灯光亮 | 常驻 |
| 2 | roll | 骰子落到桌面；镜头轻推；棋盘/机舱震一下 | 0.9–1.2s |
| 3 | choose（仅多子可走） | 回到俯瞰；可走子高亮 + 文字按钮；玩家选子 | 用户操作 |
| 4 | pov | 第一人称短镜头：机头/机翼 + 速度线 + 云向后掠，棋盘在下方倾斜 | 1.0–1.2s |
| 5 | chase | 第三人称跟拍：镜头沿航线跟到目标格；目标格发光；飞机由远到近 | 1.5–2.5s |
| 6 | land | 落地：尘土/涟漪/轻震；目标格放大 | 0.4–0.6s |
| 7 | cell45 | 棋盘压暗；目标格升起到 45° 小舞台；格子场景放大 | 0.6–0.8s |
| 8 | bear | 小熊从格子后探头；右侧滑入内容卡（类型/星级/归属/来源/做了/放过） | 0.5s |
| 9 | return | 选「做了/放过」后卡片折回收起；小熊挥手；镜头拉回俯瞰 | 0.7–0.9s |

- 总镜头 5–8s（不含用户答题）。
- **快进**：动画中显示「快进」小按钮；点按立即到终态。
- **减少动画**：跳过 POV/跟拍，只做 120–200ms 淡入；格子舞台静态出现。

## 2. 主题与预设

### 2.1 三个主题（云海机舱为默认）
| id | 名称 | 棋盘/场景 | 小熊 |
|---|---|---|---|
| `cloud` | 云海机舱（默认） | 机舱小桌板、舷窗云海、暖阅读灯、蓝色云纹 | 机长小熊（帽子/围巾/护目镜） |
| `star` | 星轨夜航 | 深紫星空、星图环、流星、心形星云 | 星轨小熊（披风/星星别针） |
| `paper` | 纸雕童话 | 暖纸层叠、纸片翻页、纸飞机 | 纸雕小熊（纸围巾/圆眼镜） |

- 主题改变：背景/机舱色调、棋盘外圈与格位光晕、粒子/云/星、小熊服装、内容卡配色。
- 不改变：52 格拓扑、题卡内容、规则、安全词。
- 玩家预设（名字/颜色/尺度）继续改变棋子/机坪颜色与灯光冷暖；主题与预设独立，可组合。
- 门厅新增「今晚的桌面」三选一（`data-test="theme-cloud|star|paper"`），存入 `settings.theme`，默认 `cloud`；刷新记住。

### 2.2 小熊
- 单只向导小熊，随主题换装；SVG 程序化绘制，无外部素材。
- 动画：探头、眨眼、耳朵抖、举牌；做了→点头；放过→轻轻放下牌子（不评判）。
- `data-test="bear"`；`aria-hidden=true`（内容卡负责可读文本）。

## 3. 45° 格子舞台（CellStage）

- 位置：表格页面覆盖层，`z-index` 高于棋盘、低于安全词/暂停（安全词永远最上）。
- 布局（430 宽）：左侧 28% 小熊 + 45° 格子立体场景；右侧 68% 内容卡（文字保持正向）。
  - 320 宽：小熊 22%，卡片 74%，卡片可滚动；按钮固定。
- 格子场景：目标格图标/类型、光晕、45° 透视（CSS 3D 倾斜 10–15°，文字不倾斜）、主题材质。
- 内容卡：`data-test` 与旧 PromptCard 对齐（`prompt-card`/`prompt-kicker`/`prompt-done`/`prompt-skip`/`prompt-actor`/`prompt-fate-option` 等），QA 可复用。
- 变体：
  - 普通题卡：类型/星级/来源/归属 + 做了/放过 + 先看棋盘
  - 命运格：两卡二选一 + 今晚先不选
  - 收尾：一封信，给指定人；做了/放过
  - 小游戏格：显示「开始小游戏」→ 旧 MiniGame 覆盖层；完成后回到格子舞台/俯瞰
  - 功能格（跳/飞/进航）：短说明 + 继续
- 长文本：卡片内部滚动，按钮固定；不遮安全词/暂停。

## 4. 技术契约

### 4.1 `App.Cinema`（新 `app/src/view/cinema.js`）
```js
App.Cinema = {
  mount(host, opts) -> inst,   // host: .v6-table；opts: {boardEl, cabinHost, reduced, sound, theme}
  unmount(),
  overview(opts),              // 回俯瞰
  roll(events, opts),          // 掷骰镜头；resolve 后可 choose/pov
  pov(opts),                   // 第一人称短镜头
  chase(events, opts),         // 跟拍；与 BoardView.play 并行
  land(events, opts),          // 落地
  returnToOverview(opts),      // 收卡后拉回
  setTheme(theme), setReduced(flag), setSound(flag), skip()
};
```
- 只动 `.v6-board` 的 transform + 场景 CSS 变量；不拦截点击；`pointer-events:none`。
- 事件驱动；不调引擎、不读写 localStorage。
- 第一人称 POV 用前景机头/机翼/速度线 + 棋盘倾斜，1 秒后交叉淡入第三人称；不做自由视角。
- 时序由 table 编排；Cinema 不假设事件顺序以外的东西。

### 4.2 `App.CellStage`（新 `app/src/ui/overlay/cell-stage.js` + `app/src/ui/bear.js`）
```js
App.CellStage.open(host, prompt, state, handlers) -> close()
// handlers: done(), skipped(), choose(cardIndex), close?()
// 主题从 App.Themes.get() 读；小熊从 App.Bear.render({outfit})
```
- 必须兼容旧 PromptCard 的 `data-test`；`App.PromptCard` 保留为 fallback（CellStage 缺失时 table 回退）。
- 只接收数据，不调引擎。

### 4.3 `App.Themes`（新 `app/src/ui/themes.js`）
```js
App.Themes = {
  list: [{id,name,desc}],
  get(),                       // {id,name,...} 默认 cloud
  apply(rootEl, themeId),      // 设置 data-theme + CSS 变量
  bearOutfit(themeId)          // 'pilot'|'starlight'|'paper'
};
```
- boot 主题选择写 `Store.saveSettings({theme})`；table mount 时 `apply`；Cinema/CellStage 读 `get()`。
- 主题 CSS 用 `data-theme` 覆盖变量，不重写整份 base.css。

### 4.4 table 编排（`app/src/ui/screens/table.js`）
- 把 `BoardView.play(events)` 按「dice / motion」拆成两段：
  - roll：先播 dice 段 → 若 `awaiting=choose-piece`，俯瞰等待；否则 `Cinema.pov()` → `playMove(events)`。
  - move：`Promise.all([BoardView.play(moveEvents), Cinema.chase(moveEvents)])` → `Cinema.land()`。
- 题卡/收尾：`openPrompt` 优先 `App.CellStage.open`，缺失回退 `App.PromptCard.open`；resolve 后 `Cinema.returnToOverview()`。
- 小游戏：`openMinigame` 前可经 CellStage 的「开始」；完成后返回俯瞰。
- `cleanup`：`CellStage.close`、`Cinema.unmount`；`settings` 转发 reduced/sound/theme。
- 现有 `CabinScene` 保留为背景（云海机舱），Cinema 叠加镜头；避免双层相机冲突（Cinema 接管 boardEl transform，CabinScene 只做场景视差）。

## 5. 性能与降级
- 镜头全部走 transform/opacity；不跑滤镜/模糊大层；粒子/云数量按宽度和 reduced 降级。
- 5–8s/回合；「快进」立即到终态；reduced 无 POV/跟拍/震动。
- 320–430 无横向溢出；内容卡长文本可滚动；安全词/暂停始终可点。
- 首屏预算仍按 ADR-012（index gzip ≤140KB；新增模块预计 +20–40KB，必要时 CellStage/Cinema 懒加载）。

## 6. 验收（QA）
- 每回合状态链可断言：`data-cinema-state=overview|roll|pov|chase|land|cell45|bear|return`；各状态有截图。
- POV 与第三人称都出现；目标格发光；落地后 CellStage 出现；小熊 `data-test=bear` 可见且随主题换装。
- 题卡 `data-test` 与旧 QA 对齐；做了/放过/命运二选一/收尾都能完成并回俯瞰。
- 320/360/390/430 无溢出；长文本可滚动；安全词/暂停 hit-test 不被遮挡。
- reduced：无 POV/跟拍/震动，120–200ms 淡入；`data-reduced=1`。
- 性能：20 回合连续走子长帧 >25ms ≤5%；页面隐藏暂停；首屏 gzip ≤140KB。
- V6.1/V6.2 全量回归通过；视觉基线按 V7 重建。

## 7. Owner / 写作用域
| owner | 写作用域 |
|---|---|
| fe-director | `app/src/view/cinema.js`、`app/src/ui/screens/table.js`、`app/dev/cinema-demo.html` |
| fe-cellstage | `app/src/ui/overlay/cell-stage.js`、`app/src/ui/bear.js`、`app/dev/cell-stage-demo.html` |
| fe-theme | `app/src/ui/themes.js`、`app/src/ui/screens/boot.js`、`app/src/ui/screens/settings.js`（仅主题行） |
| fe-build | `tools/rebuild/build_app.py`（模块表/构建） |
| qa | `qa/v6/**`（V7 组） |
| doc | `README.md`、`app/DESIGN.md`、`docs/v6/spec.md`、`docs/v6/release-notes.md` |
| lead | 构建、发布、线上冒烟、`.devteam/` |

**禁止**：改题库；新增露骨文案；相机/覆盖层拦截棋盘；reduced 失效；git commit（Lead 统一）。
