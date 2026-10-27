# 经典游戏厅（独立窗口）

新版「升温夜航」之外的三个经典玩法，单独放在这个目录，互不影响：

- 入口：`/arcade/`（或直接 `?game=truth|dare|flight`）
- 内容：真心话转盘 / 大冒险转盘 / 飞行棋
- 来源：V17 旧版单文件（git `98f56c4:index.html`），由 `tools/arcade/patch_legacy.py` 包装：
  - 去掉旧版 PWA 注册与 manifest 引用（避免 `/arcade/` 下 404）
  - 预置 `couple-onboarded` / `couple-night` 跳过开场弹窗
  - 注入「经典游戏厅」首页与返回钩子（旧版返回/大厅按钮回到游戏厅）
- 数据：旧版使用 `couple-*` localStorage 键；新版使用 `couple2.*`，完全隔离。

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
