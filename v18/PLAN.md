# V18「手感与节奏」实施计划（预览分支，不直接上线）

> 基线：V17 已上线（main `98f56c4`）。本分支 `v18` 只做体验改造，**不改内容题库、不删旧功能**。
> 审计依据（含数字证据与代码行号）：
> - `reports/v18/motion-audit.md`（动效/反馈/性能）
> - `reports/v18/mechanics-audit.md`（玩法/数值/节奏）
> 两份报告里的实测数据是验收基线，实施后必须复测并对比。

## 文件与写入边界（重要）

| 文件 | 负责 | 说明 |
|---|---|---|
| `index.html` | **impl-motion 唯一写者** | 只做 §A1/A2/A4 的定点修补；不要动 V17 注入区（`V17_INJECT_START/END` 之间） |
| `v18/features/50-motion.js` | impl-motion | 运行时注入 CSS/DOM，覆盖/增强反馈（toast 队列、浮字、金币飞行、阶段仪式等） |
| `v18/features/60-pace.js` | **impl-pace 唯一写者** | 只做 §B 的数值/节奏改造；**绝对不改 index.html** |
| `tools/build.py` | Lead | 已支持 `v17/features` + `v18/features` 两目录，按文件名排序注入 |
| `qa/_tmp_v18_*/`、`reports/v18/verify/` | QA | 验收脚本、数据、截图 |

构建：`python tools/build.py --out dist/v18`（注入全部 v17+18 片段）。`--only 50-motion` / `--only 60-pace` 只额外注入指定 V18 片段，**V17 片段始终全部包含**，可安全用于单人自测。
预览：`python tools/dev.py --out dist/v18 --port 8860`。测试基座：`qa/harness.py`（`serve`/`new_bundle`/`shot`/`dismiss_overlays`，默认抑制开场弹窗）。
端口：motion=8861，pace=8862，QA=8863。

### 跨片段接口（A/B 必须遵守，避免互相覆盖）
- **impl-pace（60-pace）**：覆盖 `taskDone` 的结算末尾调用
  `if (typeof window.v18HookTaskDone === 'function') { try { window.v18HookTaskDone({ lv: lv, heat: heatGain, coins: coinGain, heatBefore: before, heatAfter: getHeat() }); } catch (e) {} }`；
  覆盖 `panelSkip` 成功执行跳过时调用 `window.v18HookSkip && window.v18HookSkip({ free: freebies });`
- **impl-motion（50-motion）**：定义 `window.v18HookTaskDone = function(info){...}`（浮字、金币飞行、阶段升级检测）与 `window.v18HookSkip = function(info){...}`（轻 shake/灰粒子）。
- **impl-motion 不覆盖** `taskDone` / `panelSkip` / `heatStage` / `taskPardoned`（这些归 pace），只覆盖 `toast` 与做 DOM/CSS 增强；`index.html` 里只改 §A1/A2/A4 指定函数。

## 全局纪律
- ES5 风格（`var`/`function`/字符串拼接），不加外部依赖/网络请求/新字体。
- 一切覆盖必须**先调用原函数/保留原行为**，只增量增强；`SET.fx` / `SET.sound` / `SET.quiet` / `SET.chain` / 无痕 / 每日清零都要尊重。
- 新 UI 用 `--v12-*` 设计令牌，兼容 body.light / body.sketch；移动端 390×844 优先，点击区 ≥44px。
- 关键节点加 `data-v18`/`data-t` 属性方便 QA；计时器/监听器要能清理（切页/回大厅不残留）。
- 不允许回归：29 个旧玩法 + V17 的 moqi/回忆册/PWA 全部保持可用，0 新增 console error。

---

## A. 动效 / 反馈修复（impl-motion）

### A1. 轮盘手感（index.html `spinWheel`，约 2418–2455 行）
现状：random 3400–5800ms；reduce 下 CSS 过渡被压到 .001s → 视觉 230ms 停住但 JS 仍等 5.3s（死等 95.9%）；fx=off 仍转 3.8s 且照常音效震动；spin 中 GO 未禁用。

要求：
1. 单一 `dur` 变量同时控制 CSS transition / 结果 setTimeout / tick 调度：
   - `matchMedia('(prefers-reduced-motion: reduce)').matches` → `dur=650`，且 `cv.style.transition='none'`（直接用最终 rotate，结果 650ms 后出）；仍保留轻微 fade（CSS 类即可，可不做）。
   - `SET.fx==='off'` → `dur=900`；
   - 否则 → `dur = 2200 + Math.random()*700`（2200–2900ms），缓动改为减速感更强的曲线（如 `cubic-bezier(.15,.9,.12,1)`）。
   - 结果延时统一 `dur+80`（不要再额外随机 setTimeout）。
2. spin 期间 GO 按钮（`.wheel-go-btn` / canvas 上的按钮）禁用：`pointer-events:none; opacity:.55;` 并在结束时恢复；重复触发已有 `window[spinningKey]` 守卫，保留。
3. tick 音：旋转期间按「先密后疏」播放 8–14 个短 tick（`playBeep(1100~1500, 0.02, 'square', 0.03)`，受 `SET.sound`/`SET.quiet` 控制），停止/提前点击后立即清空 tick 定时器；结束保留 `sndDing()`。
4. 提前点击停盘逻辑保留；提前停时同样清理 tick 定时器。
5. 其它调用方（flight 的任务转盘、dice 等）行为不能变。

### A2. HUD 正反馈（index.html `v12SyncHud`，约 5945–5955 行）
现状：每次 innerHTML 重建 → `.hud-bar i{transition:width .8s}` 成死代码（实测 60ms 与 960ms 条宽相同）；游戏页没有金币可见元素。

要求：
1. 首次构建一次 HUD 骨架（保留 `#v12Hud` 内既有结构/类名，新增 `hud-coin`、`hud-combo` 两个 badge）；之后只更新：bar 的 `style.width`、数字文本、badge 文本。
2. 数字用 300ms count-up（rAF，小工具函数即可）；bar 宽度保留 CSS transition。
3. 金币 badge：`💰 <span>`；连击 badge：`🔥 ×N`（combo=0 时隐藏）；今夜氛围保留。
4. `v12SyncHud()` 幂等、HUD 不存在时直接 return；不得影响 `v12StorySync()`。

### A3. toast 队列与层级（`v18/features/50-motion.js`，覆盖全局 `toast`）
现状：z-index 9999 > 弹窗 200，完成 toast 盖住续章抽屉/结果卡；两条 toast 相隔 6ms 互相覆盖（成就提示永远看不见）；2s 到点硬消失。

要求：
1. 覆盖 `window.toast(msg)`：维护队列，普通消息每条 1.5s、最多排队 3 条（超出丢最旧）；含「🏅/成就/解锁」的消息走独立 lane，错开 400ms 展示，至少可见 1.6s。
2. 展示位置改到顶部（header 下方 ~72px）居中，**不再遮挡底部结果卡/抽屉**；z-index 规范：普通 toast 240（在弹窗 200 之上但处于顶部安全区），不覆盖底部内容。
3. 退出：180ms 淡出/上移后移除，不再 `display:none` 硬切。
4. 兼容原调用方（所有 `toast(...)` 调用不变）；不改变文案。

### A4. 降载与无障碍（index.html + 50-motion.js 的 CSS）
1. `v12Fx.size()`（约 5983–5990）：DPR 上限 2（`var dpr=Math.min(window.devicePixelRatio||1,2)`），canvas attr 与 transform 都按 dpr 计算。
2. `prefers-reduced-motion`：`v12Fx.burst` 在 reduce 下直接 return（不创建 canvas）；其余 CSS 动画沿用现有 media query。
3. `body.fx-off` 补 CSS：关闭 `titleShine`、`v12Sheen`、`v12PageIn` 等常驻/入场动画（现在是反的：lite 关扫光，off 反而还在放）；`body.fx-lite` 关闭 header/ctrl-bar 的 `backdrop-filter`。
4. `v12Ring` 刷新频率 100ms → 50ms（平滑度），不改 API。

### A5. 手感增强（50-motion.js）
1. **热度/金币浮字**：监听 HUD 数字变化（或在覆盖的 `taskDone`/`coinAdd` 后调用），在 HUD 附近浮出 `+2 热度`、`+8 亲密币` 的小字（400ms 上升淡出）。
2. **金币飞行**：完成任务时从屏幕中心/按钮向 HUD 金币 icon 飞 5–8 枚小金币（DOM 元素 + transform 动画，400ms；fx=off/reduce 时不飞，仅数字变化）。
3. **阶段升级仪式**：轮询/钩子检测 `heatStage()` 变化（升级时）：全屏轻仪式 1.8–2.2s（晕光 + 新段位名 `HEATLINE` + 粒子 + sndDing 序列 + vibrate）；同一晚每阶段只播一次；`SET.fx==='off'` 时降级为 toast。
4. **连击可见**：HUD `🔥×N` 脉冲；连击 ≥5/10 时中央 combo 提示更明显；断连击（skip）给一次轻 shake + 灰色粒子（负向反馈，不新增惩罚）。
5. **弹窗内容 stagger**：`.modal .m-item` 依次 30ms 入场（CSS animation + 打开时 `openModal` 后加 class；关闭清理）。

### A6. 验收（impl-motion 自测）
- `python tools/build.py --only 50-motion,40-shellfix --out dist/v18m` 后 Playwright 390×844：
  - reduce 下轮盘：`resultShownMs - firstVisualChangeMs ≤ 900`（目标 ≤ 900，含 650ms 延迟）；
  - normal：声明时长 2200–2900ms；tick 计数 ≥8；GO 在 spin 中 disabled；
  - 完成一条任务：60/300/900ms 三次采样 bar 宽度单调增加；金币 badge 内容变化；浮字出现；
  - 两条相隔 6ms 的 toast（`toast('A');toast('B')`）都能看到；modal 打开时 toast 与结果卡不重叠；
  - 29 个旧玩法逐个进入 0 error；`window.v12Fx` canvas 尺寸 ≤ 780×1688。
- 截图放 `reports/v18/motion-after/`；报告 `reports/v18/impl-motion.md`（改了什么、数据对比、遗留）。

---

## B. 玩法数值 / 节奏（impl-pace，只写 `v18/features/60-pace.js`）

### B1. 强度加权奖励（覆盖 `window.taskDone`）
现状：固定 热度+1 / 币+5，完全不看任务强度（`v12TaskMeta().lv` 1–5）。
要求：保留原 `taskDone` 的所有副作用（`v12TaskDone`、连击/连胜、每 5 连击免罚卡、gentTick、`v12SyncHome/Hud`、粒子、combo 提示、`v12StoryOnTask`/`v12CheckAch`），只改奖励：
- 强度 `lv = v12TaskMeta(window._lastTask||'', window._v12LastType||'').lv`，缺省 3；
- 热度：`heatUp()` 调用次数 = `[0,1,1,2,3,4][lv]`（即 lv1-2:+1、lv3:+2、lv4:+3、lv5:+4）；
- 亲密币 = `[0,3,4,6,8,10][lv]` + （`heatStage()>=2 ? 2 : 0`）；
- toast 改为 `✅ 完成！热度+X · 亲密币+Y`（走 motion 的 toast）。
- 兼容：旧存档无影响；V15/剧本里若有自己结算的路径不受影响（它们不走 taskDone 则不变）。

### B2. 热度阈值（覆盖 `heatStage`）
`heatStage()` = 基于 `getHeat() - gentGetV()*4` 的新阈值：`≥58→4`、`≥38→3`、`≥22→2`、`≥10→1`、否则 0；`heatStageName()`/`HEATLINE` 不动。
目标：按 B1 权重，20 条中等强度任务 ≈ 40 热 → 💥「热情似火」；15 条 ≈ 30 热 → 🔥「逐步升温」。

### B3. 续章降噪（覆盖 `v12ChainOffer`）
现状：每完成一条 450ms 后弹「续章？」模态（20 条=20 次打断）。
要求：
- 维护 `window._v18DoneCount`（在覆盖的 taskDone 里 +1，每天重置）；
- 无进行中链条时：仅当 `doneCount % 3 === 0` 才调用原 `v12ChainOffer()`，否则直接 return；
- 已有进行中链条（`window._v12Chain && lv>0`）时保持原逻辑（继续下一环）；
- `SET.chain===false`、V15 地图、V16 剧本内的原有静默逻辑不变（原函数内已有判断）。
- 结果：20 条夜约 6–7 次续章弹窗（原 20 次）。

### B4. 跳过兜底（覆盖 `window.panelSkip`）
现状：无免罚卡 + 精力 8 点用完后，`energyAsk` 默认「算了」→ 第 4 次起永久无法跳过。
要求：保留原逻辑（免罚卡优先、否则 3 精力）；在**无卡且精力<3**时：
- 每晚最多 2 次「免费跳过」（`couple-v18freeskip` 按天重置），用后 toast `🎫 免费跳过（今晚剩 N 次）` 并执行；
- 免费次数用尽 → toast `⚡ 精力不够：完成一条任务会回精力` 并 return（不弹无解弹窗）；
- 其它路径（`panelRedraw` 等）不动。

### B5. 首页 CTA 选择器（覆盖 `window.v12MainCta`）
现状：CTA「开始今晚」恒进 V15 地图 intro；`v12QuickStart` 死代码。
要求：
- 若 V15 地图进行中 → 原行为（`v15Show()`）；
- 否则打开底部弹窗「今晚怎么玩」：四个入口 `v12QuickStart()` / `v15Intro()` / `startGame('night')` / `v16Intro()`，并显示当前难度/主题一句话；每个按钮最小 46px。
- 不改变首页其它入口卡。

### B6. V15 章节目标（可选项，若 20 分钟内可安全完成则做）
审计：每章只有 4 个可选节点，目标却是 4/5/6，且 Boss 不计 `S.done` → ch1/ch2 不可达。修法二选一（评估后选风险低的）：
- 目标改为 4/4/4；或
- Boss 通过时 `S.done += 1` 计入。
若改动可能影响结局/奖励逻辑过多，**宁可不改**，在报告里写明原因和后续建议。

### B7. 验收（impl-pace 自测）
- 用 Playwright/`page.evaluate` 模拟 20 条任务（直接调覆盖后的 `taskDone`，`window._lastTask` 设不同强度）：
  - 热度累计 = Σ期望值（±0），币累计 = Σ期望值 + 阶段加成；
  - 20 条后 `heatStage()` ≥3；续章弹窗触发次数 ≤7；
  - 无卡无精力时跳过：前 2 次成功、第 3 次提示；
  - CTA 弹窗 4 个入口均可点击进入对应页面；
  - 29 旧玩法 + moqi/回忆册/PWA 冒烟 0 error；三主题截图。
- 报告 `reports/v18/impl-pace.md`（数值表、实测、风险、commit message 建议）。

---

## C. QA 验收（qa-v18，只写 qa/ + reports/）
读审计报告与上面的 A/B 验收项，写 `qa/_tmp_v18_qa/verify_v18.py`，对 `dist/v18`（Lead 集成后）跑：
1. 对比基线（报告里的数字）：reduce 轮盘结果时间、HUD bar 宽度采样、toast 行为、canvas 尺寸、续章打断次数、20 条任务热度/币/阶段、跳过兜底、CTA。
2. 回归：29 旧玩法 + V17 三功能（moqi/回忆册/PWA）冒烟；三主题 × 两视口；0 新增 pageerror/console error。
3. 报告 `reports/v18/verify/verify-report.md` + `verify-data.json` + 截图 `reports/v18/verify/shots/`；失败项给最小复现。
4. 完成后完成为 `send_message` 给 lead：通过/失败清单 + 最严重 3 项。

## D. 交付
- 全部完成后 Lead 集成（`build.py --inplace`）、跑 QA、更新 README/版本注释、提交 `v18` 分支、预览构建，**不自动合并**；用户确认后再上线。
