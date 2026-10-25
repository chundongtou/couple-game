# V18「手感与节奏」独立验收报告（QA）

> 被测物：`v18` 工作树集成产物 `dist/v18`，`index.html` SHA256 = **`B87BBF342A99151294ABB63D7960F295CCB1BB395478E3F906D63A0A8E6B32E2`**（与 Lead 提供值、以及 QA 用 `python tools/build.py --out qa/_v18_final` 独立重建的 SHA **三方完全一致**）。
> **结论：60/60 项检查全部 PASS，0 个 P0 / P1 / P2 失败，0 pageerror，0 应用级 console error。**
> 数据：`reports/v18/verify/verify-data.json`；截图：`reports/v18/verify/shots/`（18 张）；脚本：`qa/_tmp_v18_qa/verify_v18.py`。

---

## 1. 被测物与环境

| 项 | 值 |
|---|---|
| 分支 / HEAD | `v18`（集成尚未提交，HEAD 仍为 V17 main `98f56c4`；以产物 SHA 锁定被测物） |
| 构建 | `python tools/build.py --out dist/v18`（Lead 集成版，921,072 B / gzip 263 KB） |
| 片段 | v17：`10-moqi / 20-memory / 30-pwa / 40-shellfix` + v18：`50-motion.js`(27,280B) / `60-pace.js`(14,444B)，共 6 片段；`index.html` 已 `--inplace` |
| 独立复核 | `python tools/build.py --out qa/_v18_final` → SHA256 `B87BBF34…` **一致**；测试直接 serving `dist/v18`（未覆盖） |
| 环境 | Playwright 1.59 + Chromium headless；390×844（is_mobile/touch/DPR3，默认）、360×640、1280×800；locale zh-CN、tz Asia/Shanghai |
| 特殊 context | M1 用 `reduced_motion="reduce"`；M2/M7b 用 `couple-set.fx='off'`；其余默认 fx=full、dark |
| 种子/隔离 | 每组/每视口新建 `browser.new_context()`；默认 init script 写 `couple-onboarded=1`+`couple-night=今天` 抑制开场弹窗；全程不联网 |
| 验收口径（按 Lead） | reduce 轮盘 = `__v18wheel.resultMs` 或「结果时刻−首视觉」≤900ms；HUD = bar 宽度 60/300/900ms 严格递增 + 金币 badge == `coinGet()`；P1 用白盒 lv 注入（真实题库 lv 覆盖 1–5，缺失等级注入补足，测公式而非抽题分布） |

---

## 2. 结果总表

| 分组 | 内容 | checks | 结果 |
|---|---|---|---|
| M1 | reduce 轮盘（死等修复） | 3 | **PASS** |
| M2 | fx=off 轮盘（≤1100ms） | 2 | **PASS** |
| M3 | normal 轮盘（时长 2200–2900 / tick≥8 / GO 禁用 / 提前停盘） | 6 | **PASS** |
| M4 | HUD 连续动画 + 金币 badge + 连击 badge | 6 | **PASS** |
| M5 | toast 队列 / 层级 / 成就 lane | 5 | **PASS** |
| M6 | canvas DPR 上限 + burst 帧性能 + reduce 降级 | 4 | **PASS** |
| M7 | 阶段升级仪式（真实路径 / 直接触发 / fx=off 降级） | 4 | **PASS** |
| P1 | 20 条任务：强度加权热度/币/阶段（白盒 lv） | 5 | **PASS** |
| P3 | 跳过兜底（免费 2 次 + 第 3 次提示 + 免罚卡路径） | 5 | **PASS** |
| P4 | CTA「今晚怎么玩」4 入口 + 地图进行中优先 | 7 | **PASS** |
| R | 回归：29 旧玩法 + V17 三功能 + 三主题×两视口 | 13 | **PASS** |
| **合计** | | **60** | **60 PASS / 0 FAIL** |

全局：`pageerror=0`、应用级 `console error=0`、HTTP 4xx=0（覆盖全部 context）。

---

## 3. 动效 / 反馈（§A）逐项验收：基线 vs V18

| 验收项 | V17 基线（audit） | V18 实测 | 判定 |
|---|---|---|---|
| reduce 轮盘死等 | 视觉 230ms 停、结果 5615ms、**死等 5385ms** | `__v18wheel.resultMs=732ms`（declared 650ms）、结果−首视觉 **748ms**、死等≈511ms | **PASS** |
| reduce tick / 结果保留 | 首尾 2 声 | tick 11–14 次、`sndDing≥1`、结果卡正常 | **PASS** |
| fx=off 轮盘 | 声明 3791ms（未缩短） | declared **900ms**、结果−首视觉 **974ms** | **PASS** |
| normal 轮盘时长 | random 3400–5800ms（实测 3403.89） | declared **2509.63ms**（区间 2200–2900）、实际结果−首视觉 2567–2683ms | **PASS** |
| tick 音 ≥8 | 无 tick（仅首尾） | **8 次**（playBeep 1050–1600Hz 实测） | **PASS** |
| spin 中 GO 禁用 | `disabled:false, opacity:1, pointer-events:auto` | `disabled:true, class="wheel-go-btn spinning", pointer-events:none, opacity:.55`，结束恢复 | **PASS** |
| 提前点击停盘保留 | 520ms 生效 | 清空旧结果卡后实测 **527ms** 出新结果 | **PASS** |
| HUD bar 连续动画 | 60ms 与 960ms 同值（1.39/13.91px，`.8s` 过渡是死代码） | bar 宽度 0 → **0.11** → **0.41** → **0.47px**（60/300/900ms 严格递增，`.8s` 过渡生效） | **PASS** |
| 金币 HUD | 游戏页金币可见元素 **0** 个 | `💰 4` badge 存在，900ms 时数值与 `coinGet()` 一致；金币飞行/浮字由 motion 钩子触发 | **PASS** |
| 连击 badge | 无 HUD 连击元素 | `🔥 ×1` 可见（combo>0 显示、=0 隐藏） | **PASS** |
| 双 toast（相隔 6ms） | 互相覆盖，成就提示永远看不到 | A 88–1623ms、B 1788–3289ms，**两条都可见，总跨度 3201ms** | **PASS** |
| toast 不遮挡底部结果卡 | `.toast` z=9999 > 弹窗 200，压住结果卡 | 弹窗打开时 toast 位于顶部安全区：rect 与 `.modal` **无重叠**（z 240/241） | **PASS** |
| 成就独立 lane | 无 lane，6ms 被覆盖 | 成就 toast 独立 lane：与普通 toast 同时可见，**持续 1616ms**，rect（y 126–191）与普通 toast（y 72–116）**无重叠** | **PASS** |
| canvas DPR 上限 | 1170×2532（DPR3） | **780×1688**（DPR 上限 2） | **PASS** |
| burst 帧性能 | p95 17.9ms | p95 **17.7ms**（200 粒子） | **PASS** |
| reduce 下粒子降级 | reduce 仍创建 canvas/burst | reduce 下 burst 后 **`#v12Fx` 不存在** | **PASS** |
| 阶段升级仪式 | 无（只有 toast） | 真实路径 `heatSet(9)+taskDone()`：捕获 **`#v18StageUp` 全屏仪式 2.1s**（含「🌤️ 暧昧试探 / 升 温 新 阶 段」+ 粒子 + sndDing/vibrate），新增节点距触发 **219ms** | **PASS** |
| fx=off 仪式降级 | — | 降级为 toast：`🎉 升温到新阶段：🌤️ 暧昧试探`，无 error | **PASS** |

截图：`m1-reduce-wheel.png`、`m2-fx-off-wheel.png`、`m3-normal-wheel.png`、`m4-hud-after-task.png`、`m5-toast-lanes.png`、`m6-burst.png`、`m7-stage-ceremony-real.png`、`m7-stage-ceremony-direct.png`

---

## 4. 玩法数值 / 节奏（§B）逐项验收

### P1/P2 · 20 条任务模拟（白盒 lv：`[1,2,3,4,5]×4`，通过 `v12TaskComplete()` 走真实完成链路）

| 指标 | V17 基线 | V18 实测 | 判定 |
|---|---|---|---|
| 热度累计 | 20 条 = 20（固定 +1） | **44** = Σ`[0,1,1,2,3,4][lv]`，逐条增量**全部精确相符** | **PASS** |
| 亲密币累计 | 20 条 = 100（5/条，+阶段加成） | **146** = Σ`[0,3,4,6,8,10][lv]` + 阶段加成，逐条精确相符 | **PASS** |
| 20 条后 `heatStage()` | 1（🌤️） | **3**（💥 热情似火，阈值 10/22/38/58） | **PASS** |
| 续章弹窗次数 | **20/20（100% 打断）** | **6 次**（每 3 条一次，≤7 达标） | **PASS** |
| 其它副作用保留 | — | combo=20、免罚卡 +5（每 5 连）、无 pageerror/console error | **PASS** |

### P3 · 跳过兜底

| 场景 | 结果 | 判定 |
|---|---|---|
| 无免罚卡 + 精力 0，第 1 次跳过 | 成功；toast「🎫 免费跳过（今晚剩 1 次）」；`couple-v18freeskip` n=1 | **PASS** |
| 第 2 次跳过 | 成功；toast「🎫 免费跳过（今晚剩 0 次）」；n=0 | **PASS** |
| 第 3 次跳过 | 不执行 handler（runsDelta=0）；toast「⚡ 精力不够：完成一条任务会回精力」；**不再弹无解 energyAsk 弹窗** | **PASS** |
| 免罚卡路径 | 消耗 1 张、跳过成功（原语义不变） | **PASS** |

### P4 · 首页 CTA

| 验收项 | V17 基线 | V18 实测 | 判定 |
|---|---|---|---|
| CTA 行为 | 恒进 V15 地图 intro，`v12QuickStart` 死代码（调用 0） | 打开「🌙 今晚怎么玩」弹窗，含当前难度/主题行 + 4 个 ≥46px 入口 | **PASS** |
| 4 入口 | — | `cta-quick`→经典抽题开局（gamePage，`curGame` 随机游戏）；`cta-map`→今夜地图 intro 弹窗；`cta-night`→`curGame='night'`；`cta-script`→剧本之夜弹窗 | **PASS** |
| 地图进行中优先 | `v15Show()` | 建地图后回大厅点 CTA → `runPage` 激活、不弹新入口 | **PASS** |

截图：`p1-after-20-tasks.png`、`p3-skip-fallback.png`、`p4-cta-modal.png`

---

## 5. 回归（PASS）

- **R2 29/29 旧玩法**逐个 `startGame()` 渲染且 0 pageerror；GAMES 30 项、29 个旧 id 全部保留（R1）。
- **V17 三功能**：默契大考验入口+5 题完整对局结算（R3）；回忆册抽屉+导出下载 `情侣升温游戏备份-2026-10-25.json`（R4）；PWA SW ready/active、离线 reload 首页可玩（R5）。
- **三主题 × 两视口**（dark/light/sketch × 390×844/360×640）：首页 6 主角卡、横向溢出 =0（R6-*，6 张截图）。
- R7 三功能可用、**R8 0 新增 pageerror / 应用级 console error**。

---

## 6. 验收过程记录（QA 侧，非产品缺陷）

1. 首轮全量中 **M1 组崩溃**：QA 脚本在 `group_m1` 里误用未定义 `pb`（新增 `__v18wheel` 取值时作用域写错）→ 已改为在 context 内捕获，非产品问题。
2. **P3c 一次假失败**：第 3 次跳过时读到 `#toast` 仍是上一条「免费跳过」文本（队列尚未播完），实现行为正确 → 改为读取 toast 队列的**新消息增量**后 PASS。
3. M5d 曾因「首帧入场动画 rect」误判成就 lane 重叠（动画 translateY 期间）→ 改为动画结束后稳定时刻 rect（实测 y 72–116 vs 126–191，无重叠）→ PASS。
4. 部分构建热身（motion-only / pace-only）阶段 M7 真实路径不触发属预期（缺跨片段 heatStage 阈值），集成产物上真实路径已 PASS。

---

## 7. 已知限制 / 未覆盖

- 本轮验收严格对应 PLAN §A/§B 与 Lead 阶段 2 清单；以下审计项**不在** V18 计划内、未验收：3D 骰子 WAAPI 在 reduce 下的 1650ms+震动、页面切换 crossfade、负向反馈动效、扫光/标题流光的全量 token 化。
- Headless Chromium（SwiftShader）无法测真机 GPU 相关（`backdrop-filter` 叠加、发烫、60fps 稳定性）；建议真机复核一次投放体验。
- M7「同一晚每阶段只播一次」的 mask 逻辑存在（`couple-v18stage`），本轮只验证仪式出现/降级，未单独做跨阶段重复触发断言。
- PWA 原生安装弹窗与 SW 更新 toast 属 V17 范围，本轮回归只验证 SW 注册/离线可用。

---

## 8. 复现命令与产物

```powershell
cd couple-game
# 独立重建并核对 SHA（期望 B87BBF34…）
python tools/build.py --out qa/_v18_final
# 全量验收（约 2 分钟；直接 serving dist/v18，不覆盖）
python qa/_tmp_v18_qa/verify_v18.py --dist dist/v18 --port 8863
# 分组复跑
python qa/_tmp_v18_qa/verify_v18.py --dist dist/v18 --only m1,m2,m3,m4,m5,m6,m7
python qa/_tmp_v18_qa/verify_v18.py --dist dist/v18 --only p1,p3,p4,r
```

产物：
- `reports/v18/verify/verify-data.json`（60 checks + 全部原始测量数据；`meta.tested_index_sha256=B87BBF34…`）
- `reports/v18/verify/shots/`（18 张证据截图）
- `qa/_tmp_v18_qa/verify_v18.py`（验收脚本，约 1,340 行）
