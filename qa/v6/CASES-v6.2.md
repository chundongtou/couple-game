# V6.2 E2E 用例矩阵：夜航机舱（QA · qa/v6）

> 规则口径：`docs/v6/impl-freeze-cabin.md` §3/§5 + `docs/v6/spec.md`（V6.1 规则不变）。
> 一键：`python qa/v6/run_all.py --final`（先设 `PYTHONIOENCODING=utf-8`、`PYTHONUTF8=1`）。
> 新增用例组：`--only cabin`（E2E）、`perf_budget.py` 的 `CABIN-PERF-*`、`visual.py` 的 table/prompt 基线。

## 1. 用例组

| 组 | 覆盖 | 关键断言 | AC |
|---|---|---|---|
| `cabin` / layer | 机舱层结构 | `[data-test=cabin]` 存在；host/root `pointer-events:none`；`.cabin-root` 版本 6.2.0；Canvas=3（2 舷窗 + 尘）且 DPR≤2；层铺满视口；**92 格中心 `elementFromPoint` 全部命中棋盘层、0 落 cabin**；aria-hidden | AC-V6.2-1 |
| `cabin` / camera | 全动态镜头 | 掷骰 `cam=dice` 且 scale≥1.02、其后回 `rest`；走子 `cam=move` 且位移≥4px/scale≥1.015；击落 `cam=shake`（≥2 帧抖动）；换手 `cam=turn` 且 `data-turn=b`；收家 `is-won` + `data-cabin-dawn>0` + scale<1 | AC-V6.2-2 |
| `cabin` / reduced | 减少动画 | `settings.reduced` 与系统 `prefers-reduced-motion` 两路：`data-cabin-reduced=1`、idle transform 为空、掷骰/击落期间 0 次 transform、0 次 shake、无 `is-flicker` | AC-V6.2-3 |
| `cabin` / overlay | 浮层不被覆盖 | 题卡打开时 `is-overlay` + `.cb-dim` 透明度 >0.05；题卡「做了/放过」、安全词、暂停按钮中心 hit-test 不落 cabin；暂停页安全词/今晚就到这/继续同样不被覆盖 | AC-V6.2-4 |
| `cabin` / responsive | 320/360/390/430 | 无横向溢出；机舱层 w×h=视口；92 格 0 落 cabin；Canvas≥1 且 DPR≤2 | AC-V6.2-4 |
| `perf` / CABIN-PERF | 性能 | 门厅 DCL/FCP/index gzip 达标；主桌空闲 fps≥50、长帧(>25ms)≤5%；20 次连续走子长帧≤5%；reduced 下 `.cb-dust` 两帧一致；页面隐藏 `data-cabin-paused=1`、scene 帧数不增、恢复后继续 | AC-V6.2-5/6 |
| `visual` | 视觉基线 | table/prompt 基线重建（截图前 `CabinScene.setReduced(true)` + 暂停 CSS 动效，保证可复现）；boot/ledger 沿用 V6.1 基线 | AC-V6.2-7 |

## 2. 测试口径与已知环境处理

1. **相机观测**：`MutationObserver` 监听 `.v6-board` 的 `style` 与 `.cabin-root` 属性；
   逐帧读取 `data-cabin-cam` / `transform`，断言事件种类与幅度（不依赖固定耗时）。
2. **走子/击落/收家夹具**：只写 `localStorage` 里的合法 session（`App.Flight.validate` 校验），
   随后像用户一样点选子按钮；不改实现。走子落点按 a:0 实际颜色计算（不假设红方）。
3. **`prefers-reduced-motion`**：本机 Playwright/Edge 的 `context.emulate_media(reduced_motion=...)`
   实测不生效（`matchMedia().matches=false`），改用 CDP `Emulation.setEmulatedMedia`；
   `settings.reduced` 路径仍为主路径，两者都验证。
4. **视觉基线可复现**：机舱有逐帧动画（云/星/尘/镜头浮动），直接截图会导致像素基线抖动
   （实测 prompt 屏两次差 2.55%）。截图前调用公开 API `CabinScene.setReduced(true)` 静态化场景 +
   暂停 CSS animation/transition，截图后恢复；不放宽断言，正常态动画另由 e2e cabin 组验证。
5. **性能采样**：rAF 采样帧间隔，长帧阈值 25ms（≈40fps 以下记长帧）；20 次走子用长夜局，
   为防止提前结束可跨局累计（最多 3 局）；4×CPU 空闲帧率仅作参考（不设门槛）。

## 3. 回归清单（V6.2 发布前）

```powershell
$py="C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
$env:PYTHONIOENCODING='utf-8'; $env:PYTHONUTF8='1'
& $py tools/rebuild/build_app.py --out dist/rebuild --strict --check
& $py qa/v6/e2e_v6.py --only cabin
& $py qa/v6/run_all.py --final
```

- P0（新增）：机舱层 92 格不拦截、五类镜头 transform、reduced 无镜头/震动、浮层 hit-test、四视口溢出、性能门。
- P0（V6.1 回归）：main / takeoff / win / notend / legacy / skip / pause / events / reduced / responsive / offline 全绿。
- 视觉：`visual.py` 两连跑均 PASS（基线可复现）；boot/ledger 与 V6.1 基线像素差 0。
- 红线：相机不得遮挡/拦截棋盘（92 格 hit-test）、题卡/安全词/暂停不得被 cabin 覆盖、reduced 不得有位移。

## 4. 结果

见 `reports/v6/qa-report.md`（汇总）与 `qa-e2e.md` / `qa-perf.md` / `qa-visual.md`。
