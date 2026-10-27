# 经典游戏厅（独立窗口）

新版「升温夜航」之外的经典玩法 + 新做的「温度计」，单独放在这个目录，互不影响：

- 入口：`/arcade/`
- 内容：🌡️ 温度计（新） / 真心话转盘 / 大冒险转盘 / 飞行棋
- 直达：`?game=truth|dare|flight`；温度计：`/arcade/thermometer.html`
- 温度计是一个独立单文件页：12 格、掷骰前进、温柔/大胆两种说法、2 次跳过、随时可停、进度自动保存（`thermo.*` 键）。
- 经典三款来源：V17 旧版单文件（git `98f56c4:index.html`），由 `tools/arcade/patch_legacy.py` 包装：
  - **已换新版皮肤**：`arcade/skin.css`（暗夜玻璃/金玫瑰配色）在旧版 CSS 最后注入，只改视觉不改布局与逻辑
  - 转盘/玩家颜色常量同步换成夜航调色；旧版顶部三条 HUD 隐藏
  - **工具条收纳**：底部只留「完成 / 重抽 / 跳过 / 更多」；道具、撤销、重置、大厅、缓一缓进「更多」底部抽屉
  - **转盘结果卡**：新版大标题 + 标签 chips（类型 / 星级 / 执行人），按钮改成卡片动作 chips
  - **飞行棋**：双道/环岛都换成卡片式棋盘，格子改轻量玻璃色块，类型色只做淡染
  - **飞行棋开局**：长表单收成「基础 / 节奏与强度 / 边界」三组折叠，底部固定大「开局！」；设置页隐藏底部工具条
  - 去掉旧版 PWA 注册与 manifest 引用（避免 `/arcade/` 下 404）
  - 预置 `couple-onboarded` / `couple-night` 跳过开场弹窗
  - 注入「经典游戏厅」首页与返回钩子（旧版返回/大厅按钮回到游戏厅）
  - 支持 `?embed=1`：内嵌进新版时隐藏重复标题，返回用 postMessage 交给新版
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
