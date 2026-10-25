# QA 自动化（Playwright）

> 依赖：Python 3.11 + Playwright 1.59（chromium 已安装：`python -m playwright install chromium`）。
> 所有脚本通过 `qa/harness.py` 起「禁缓存」本地静态服务，并在全新 `browser.new_context()` 里跑
> （localStorage 干净；默认预置 `couple-onboarded=1` / `couple-night=今天` 抑制开场弹窗，避免遮挡点击；
> 需要专门测开场弹窗时传 `seed=False`）。

## 快速开始

```bash
# 1) 构建被测产物（V17 集成版）
python tools/build.py --out dist

# 2) V17 验收 + 回归：147 checks，约 3 分钟
python qa/test_v17.py --dist dist

# 3) 只跑某分组（a=默契大考验 b=回忆册/备份 c=PWA d=回归 e=横切）
python qa/test_v17.py --dist dist --only a,c
```

## V16 基线审计

基线审计需要一个 **V16 快照**目录（不要在 `dist/` 上跑，那是 V17）：

```bash
mkdir qa/_baseline_dist
git show d1460e9:index.html > qa/_baseline_dist/index.html
python qa/test_baseline.py --dist qa/_baseline_dist
```

## 文件说明

| 文件 | 作用 |
|------|------|
| `harness.py` | 基础设施：`serve()` 禁缓存服务、`new_bundle()` 移动端 page + console/pageerror 收集、`shot()` 截图、`dismiss_overlays()`、`smoke()` 基线冒烟 |
| `test_baseline.py` | V16 基线审计（88 checks，D1）：首屏/首页/29 玩法/弹窗/主题/视口/持久化/开场引导 |
| `test_v17.py` | V17 验收 + 回归（147 checks，D2）：SPECS A/B/C 逐条 + 三主题×三视口 + 29 旧玩法回归 |

产物写到 `reports/`（仓库 gitignore，不入库）：

```
reports/baseline-audit.md / baseline-audit-data.json     # D1 报告与证据
reports/v17-qa-report.md / v17-qa-data.json / v17-smoke.json  # D2 报告与证据
reports/screenshots/baseline|v17/                        # 截图证据
```

合并前最后一次验收结论（`d6eb8d2`）：**147/147 PASS，0 P0/P1/P2**，详见 [docs/v17/QA-验收报告.md](../docs/v17/QA-验收报告.md)。
