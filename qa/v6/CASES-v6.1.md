# V6.1 E2E 用例矩阵（QA · qa/v6）

> 规则口径：`docs/v6/impl-freeze-v6.1.md` + `docs/v6/spec.md` §0/§7。
> 结束 = **一方全部飞机到家**（快局 2 / 长夜 4）；起飞 = 6 + **连续两次没掷出 6 后第 3 个回合任意点数保底**；
> 题卡数 / 心动值**不再**触发结束；回顾只写「<姓名> 先到家 / 已到家 X/Y」。
> 一键验收：`python qa/v6/run_all.py --final`（先设 `PYTHONIOENCODING=utf-8`、`PYTHONUTF8=1`）。

## 1. 用例组

| 组 | 覆盖 | 关键断言 |
|---|---|---|
| `env` | 首屏 / 0 错误 / 无横向滚动 / 安全词 | AC-A1-1、H4-1、H6-1、B4-1 |
| `boot` | 门厅模式卡、尺度、规则速览、校验、续玩 | AC-A2-2（新文案）、A4-1、A5-1（6 条含保底/先到家）、A3-1/3/4、A4-3 |
| `main` | §7 主路径（360/390/430） | 注入「一方差一步全到家」→ 掷骰/选子到家 → `winner-text`「<姓名> 先到家」→「今晚最后一段」→ 两张收尾卡 → 回顾 `ending=win-a` + `ledger-home` + 点击 ≤22 |
| `skip` | 放过不惩罚 + 全放过也能收尾 | AC-C2-1/E1-2/E2-5/C2-5；收尾卡全放过仍进回顾，明细「今晚先放过」 |
| `takeoff` | 起飞保底（新增） | 第 1/2 个自己的回合非 6 **不提前起飞**（miss=1→2）→ 第 3 个回合掷骰前 `takeoff-pity` → 任意点数（注入 2）可起飞 → `takeoffMiss.a=0`；提示只跟随当前行动方 |
| `win` | 另一方先到家（新增） | b 方全到家 → `winner-text`「阿策 先到家」、`win.playerId=b`、`ledger.ending=win-b`、`已到家 0/2 · 2/2` |
| `notend` | 不结束判定（新增） | 长夜 4 架/人：题卡 20 张 + 心动值 100 + 只 1 架到家 → `phase=playing`、无「今晚最后一段」 |
| `legacy` | 旧档兼容（新增） | 删 `takeoffMiss`/`winnerId` → `validate()` 补 `{a:0,b:0}` 且可续玩/可掷骰；旧 `ending='shared'` 回顾写「今晚一起走到这里」且无输赢词 |
| `resume` | A6 刷新续玩 | 继续入口 + 相同状态 |
| `pause` | 暂停 / 安全词 / 今晚就到这 | G1/G2/B4/B5；回顾无输赢词 |
| `minigame` | 温度计 / 转盘 | D1/D2/D3（含「跳过」按钮存在 = AC-D2-1） |
| `fate` | 命运格（P1） | E5 |
| `events` | 击落 / 叠机 / 进航 | C1-2、C1-3、C2-2（放过不阻断进军红线）、C2-3 |
| `responsive` | 320/360/390/430 | H4-1、H1-1、H1-2（hit-test 命中自身）、B4-2（不被安全词遮挡） |
| `offline` | 断网开局 | H3-1 |
| `reduced` | 减少动画 | H2-1/H2-2 |

## 2. 测试夹具（不改实现）

V6.1 结束条件是「一方全部到家」，自然对局 40+ 次掷骰，浏览器侧按 spec §7 用**注入局面**验证流程：

- `Q.fixture_near_home(page, pid, steps=(3,4))`：pid 方只剩最后 len(steps) 架未到家
  （分别停在 `home:<color>:3` / `home:<color>:4`），其余已到家、对方全部留机坪；写 `couple2.session`
  后**刷新**页面，再点「继续今晚飞行棋」（注入不计点击）。
- `Q.fixture_place(page, placements, turn, cards_processed, heat, takeoff_miss)`：通用摆子夹具
  （`{a}`/`{b}` 占位符替换成该玩家颜色；`:goal` 自动置 `arrived=true`）。
- `Q.drop_takeoff_miss(page)`：模拟 V6.0 存档（缺 `takeoffMiss`/`winnerId`）。
- `Q.put_history(page, [entry])` / `Q.old_ledger_entry("shared")`：旧回顾兼容用例。
- 所有注入都经 `App.Flight.validate()` 校验后写 localStorage；**不改 app/ 实现**。

## 3. 计时口径与已确认的非缺陷

1. **「掷骰 → 先到家」≤1s**：Playwright 的 `click()` 会等元素「稳定」，棋盘动画期间多等 1s+（框架开销）。
   测时改用页面内真实 `button.click()` + `performance.now()`（`Q.click_and_time`），实测 6~20ms。
2. **保底提示是「当前行动方」口径**：a 起飞后轮到 b，若 b 也累计 2 次非 6，提示仍显示（正确）；
   `takeoff` 组据此断言 `view.takeoff.misses[turn]=2 且 pity=true`，不误判为缺陷。
3. **题卡数 / 心动值**：`targetCards/targetHeat` 仍由引擎保留（旧 UI/测试兼容），但 `shouldEnd` 不读；
   QA 只断言「不触发结束」，不断言这两个字段被删除。
4. **暂停页状态卡**：`app/src/ui/screens/pause.js` 已按 copy §9-D9 对齐为「双方已到家」
   （`data-test=pause-home`），`pause` 组已断言「含 X/Y 且无『目标』字样」。旧 `copy.md` §9-D9 可视为已解决。
5. **视觉基线**：V6.1 有意改了状态条/门厅文案/新增先到家与保底提示，基线已用
   `python qa/v6/visual.py --update-baseline` 重建（rebaseline 记录见 `reports/v6/qa-visual.md`）。

## 4. 结果（2026-11-17 12:13 最终复跑）

- `python qa/v6/run_all.py --final` → **PASS**，485 项检查全绿（PASS 485 / FAIL 0 / SKIP 0），P0 403/403。
- build `--strict --check` 27/27；engine `node qa/rebuild/flight-engine.test.mjs` 745 passed / 0 failed；
  e2e 422 项 0 失败；perf 12 项 0 失败；visual 49 项 0 失败。
- 报告：`reports/v6/qa-report.md`（汇总）、`qa-e2e.md`、`qa-perf.md`、`qa-visual.md`、`logs/*.log`。
