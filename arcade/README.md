# 经典游戏厅（独立窗口）

新版「升温夜航」之外的经典玩法 + 新做的「温度计」，单独放在这个目录，互不影响：

- 入口：`/arcade/`
- 内容：🌡️ 温度计（新） / 真心话转盘 / 大冒险转盘 / 飞行棋
- 直达：`?game=truth|dare|flight`；温度计：`/arcade/thermometer.html`
- 温度计是一个独立单文件页：12 格、掷骰前进、温柔/大胆两种说法、2 次跳过、随时可停、进度自动保存（`thermo.*` 键）。
- 经典三款来源：V17 旧版单文件（git `98f56c4:index.html`），由 `tools/arcade/patch_legacy.py` 包装：
  - 去掉旧版 PWA 注册与 manifest 引用（避免 `/arcade/` 下 404）
  - 预置 `couple-onboarded` / `couple-night` 跳过开场弹窗
  - 注入「经典游戏厅」首页与返回钩子（旧版返回/大厅按钮回到游戏厅）
- 数据：旧版使用 `couple-*`、温度计使用 `thermo.*`、新版使用 `couple2.*`，完全隔离。

## 重新生成

```bash
python tools/arcade/patch_legacy.py
```

## 部署

与仓库一同发布到 GitHub Pages；根 `index.html`（新版）不受影响。

- https://chundongtou.github.io/couple-game/arcade/
- https://chundongtou.github.io/couple-game/arcade/?game=truth
- https://chundongtou.github.io/couple-game/arcade/?game=dare
- https://chundongtou.github.io/couple-game/arcade/?game=flight
