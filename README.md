# 今晚飞行棋 V6

两个人，一部手机，一盘 20 分钟的飞行棋。暗光里点一盏暖灯，摇骰子、抽题卡，玩到今晚收尾。

没有输赢：题卡一起走，心动值一起涨，最后两张收尾卡一人一张。任何一屏都能「先收棋」，做过的都留着。

- 线上：<https://chundongtou.github.io/couple-game/>
- 版本：**6.0.0**（`app/src/app.js` 的 `App.version`）
- 形态：纯前端单页 + PWA；没有后端、没有账号，数据只在这台手机的 `localStorage`

> V6 是「今晚飞行棋」的全面改版：视觉换成 **A · 午夜星轨 · 暖光纸感**，棋盘从 three.js 换成 **SVG 2.5D**（首屏不再加载 511 KB 的 `board.js`），并加入心动值、连击、命运格、合作收尾、暂停/安全词、今晚回顾与分享图。旧的「公寓」玩法已下线，存档会被收进「以前的夜」，不会丢。

---

## 这一版有什么

| 模块 | 现在是什么 |
|---|---|
| 门厅 | 快局 / 长夜、两个人的名字与颜色、四档尺度、边界、玩法速览；360×640 首屏就能看到「摆上棋盘」 |
| 主桌 | SVG 2.5D 星轨棋盘：52 格主环 + 4 色机坪（16 槽）+ 20 格航线 + 4 个终点；掷骰有点数文字与骰子动画；可走子有高亮和文字按钮；落点显示格名；状态条显示第 N/目标 张、心动值、连击、时长 |
| 题卡 | 每张都写明给谁；类型 / 星级 / 来源；「做了 / 放过」；打开后不挡暂停与安全词 |
| 小游戏 | 落在温度计或转盘格直接开面板，有「跳过」；完成 +5 心动值，跳过 +0 |
| 心动值 / 连击 | 双方共享的 0–100；「做了」+8、「放过」+3，只增不降；连击每 3 次「做了」由引擎记一个里程碑（V6 界面只显示连击数，里程碑奖励留到后续版本） |
| 命运格 | 第 5、29 格：同时给两张不同池的卡，二选一，另一张放回；不选不惩罚 |
| 合作收尾 | 目标张数 / 心动值 / 长夜一架进终点，任一满足即进入「今晚最后一段」：两张收尾卡，一人一张，都可放过；不判输赢 |
| 暂停 / 安全词 | 所有屏幕右上角「先收棋」，按住 1.6 秒进暂停（不归档）；暂停页四个动作：继续 / 今晚就到这 / 看今晚记录 / 加一条今晚不做的 |
| 今晚回顾 | 无输赢，6 类信息 + 题卡明细（原文默认收起）；可「存成图片」（本机生成 1080×1350，不上传） |
| PWA / 离线 | 可装到主屏幕；导航 network-first、静态 cache-first；断网冷启动已验 |

## 玩法（就是游戏里的「玩法速览」六条）

1. **6 起飞**：掷出 6，才有一架飞机从机坪起飞。
2. **6 可再掷**：掷出 6，走完还能再掷一次。
3. **跳 / 飞 / 进航**：落在跳格向前 4 格，飞点向前 12 格；进航格转进自己的航线。
4. **击落回机坪**：落在对方飞机所在的格子，对方的飞机回机坪。
5. **放过不惩罚**：题卡可以放过——心动值不减少、不挡路、连击不清零，也照样计入目标张数。
6. **安全词随时可停**：按住右上角「先收棋」1.6 秒，任何屏幕都能先停一下。

目标：**快局** 2 架飞机、4 张题卡或 40 心动值（约 8–12 分钟）；**长夜** 4 架、8 张或 80（约 25–40 分钟），长夜还有第三个收尾条件：任意一架飞机进终点。

## 尺度与边界

| 尺度 | 星级上限 | 这一档的口径 |
|---|---|---|
| 温柔 | ★1 | 只留 1 星；排除露骨句，以及束缚 / 露出 / 道具 / 蒙眼 |
| 暧昧 | ★1–2（最多到 3） | 偏向 2 星；露骨句仍排除 |
| 热烈 | ★1–3（最多到 5） | 偏好 3 星起，开放更直接的句子 |
| 不设限 | ★1–4（最多到 5） | 偏好 4 星起；`spark` 池只在这一档开放 |

- 边界在开局、暂停页、设置里都能加；**任何尺度都会排除**写着边界的卡（标签或自定义词）。
- **安全词不是结束**：暂停只是先停一下，记录一条不少；只有暂停页的「今晚就到这」会把这一局归档并进回顾。
- 全部内容面向成年伴侣，需要双方在场、共同同意；任何一方随时可以停。不是给未成年人的内容。

## 本地跑起来（三步）

要求：Python 3（本机 3.12.14 实测）。Node 建议装（本机 Node 26 实测）：构建会用它做 `node --check` 与 esbuild 压缩；没有 Node 时构建仍会成功，但会警告并输出未压缩产物。

```bash
cd couple-game
python tools/rebuild/build_app.py --out dist/rebuild
python -m http.server 8899 --directory dist/rebuild
```

第 3 步：浏览器打开 <http://127.0.0.1:8899/>。手机想连同一局域网，就用电脑 IP 访问（`http.server` 默认监听所有网卡，也可显式加 `--bind 0.0.0.0`）；安装 PWA 需要 `localhost` 或 `https`，局域网 IP 只能玩。

- 必须走 `http://`，不要双击 `index.html` 用 `file://` 打开：那样 Service Worker 不注册，离线能力不可用。
- 8899 被占用就换端口：`python -m http.server 8898 --directory dist/rebuild`。
- 在 DSH 工作台里，Python 解释器是 `C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe`，把上面的 `python` 换成它即可。
- 想改完立刻看：`python tools/rebuild/build_app.py --out dist/rebuild` 后 `python tools/rebuild/dev_app.py --port 8877 --no-build`（禁缓存静态服务；不带 `--no-build` 时它可能尝试重建 V5 的 3D 棋盘）。
- 调试时想读未压缩代码：给构建加 `--no-minify`。

生产构建（写仓库根的 `index.html` + `assets/` + `sw.js`，给 GitHub Pages 用）：

```bash
python tools/rebuild/build_app.py --release
```

发布门（干净输出目录，27 项全过才退出 0）：

```bash
python tools/rebuild/build_app.py --out dist/rebuild --check
```

## 发布（GitHub Pages）

1. `python tools/rebuild/build_app.py --release` 生成仓库根产物；
2. 提交并推到 `main`；
3. `.github/workflows/pages.yml` 自动部署，约 1–2 分钟线上生效：<https://chundongtou.github.io/couple-game/>。

回滚、`sw.js` 缓存版本、3D 棋盘回滚资源的处置见 [`docs/REBUILD.md`](docs/REBUILD.md) §5–§6。发版说明见 [`docs/v6/release-notes.md`](docs/v6/release-notes.md)。

## 测试

```bash
# 引擎（纯逻辑，无浏览器）：本机实测 700 passed / 0 failed
node qa/rebuild/flight-engine.test.mjs

# 构建 + 发布门：本机实测 27 passed / 0 failed -> GREEN
python tools/rebuild/build_app.py --out dist/rebuild --check

# 浏览器 E2E（Playwright + Edge；主路径 / 暂停 / 小游戏 / 命运 / 响应式 / 离线 / 减少动画）
python qa/v6/e2e_v6.py --dist dist/rebuild

# 首屏性能预算（slow4G + 4×CPU、gzip 静态服务）
python qa/v6/perf_budget.py --dist dist/rebuild

# 视觉回归（首次运行生成基线）
python qa/v6/visual.py --dist dist/rebuild

# 一键：构建 + 引擎 + E2E + 性能 + 视觉 + 汇总报告
python qa/v6/run_all.py --dist dist/rebuild --final
```

- 报告写到 `reports/v6/`（git 忽略）：`qa-e2e.md`、`qa-perf.md`、`qa-visual.md`，汇总为 `qa-report.md`；截图在 `qa/v6/shots/`。
- E2E / 性能 / 视觉需要 Playwright 与 Edge（DSH 运行时已装 Playwright；`channel="msedge"`）。
- 单元测试只依赖 Node，不需要浏览器，改动 `app/src/engine/**` 后第一时间跑它。

## 数据与隐私

所有数据只在这台手机的 `localStorage`，键名沿用 V5 的 `couple2.*`：

| 键 | 内容 |
|---|---|
| `couple2.settings` | 声音 / 震动 / 减少动画 / 名字 / 颜色 / 边界 / `boardView` |
| `couple2.session` | 进行中的这一局（`kind:"flight"`，V6 结构 `v:2`） |
| `couple2.history` | 以前的夜 / 以前的一局，最多 60 条 |
| `couple2.standalone` | 单独玩的小游戏进度（温度计 / 转盘） |
| `couple2.pending` | 从独立小游戏「带回今晚」的临时结果 |
| `couple2.backup.session` | 首次读到旧 session 时的原始备份（只写一次，不覆盖） |

- 设置里有「导出以前的夜」「导入」「清除这台手机上的棋」；导出是 JSON，文件留在你自己手里。
- 没有网络请求上传数据；回顾里的「存成图片」在本地用 Canvas 画，不请求、不上传、不生成外链，题卡原文默认不画进图里。
- 换手机不会自动同步，请用导出/导入迁移。

## 从 V5 升上来

- 进行中的 V5 飞行棋（`state.v:1`）**原样续玩**：`Flight.validate()` 只补可选默认值（`mode`、`targetCards`、`targetHeat`、`cardsProcessed`、`meta`），不新增必填项，不丢档；首次读到时把原始 JSON 备份进 `couple2.backup.session`。
- V5 的「公寓」局和更早的「升温夜航」不会按新规则续玩，会被收进「以前的夜」（标题「今晚在这间公寓」/「以前的夜航」）。
- 导入兼容 `couple-flight` / `couple-apartment` / `couple-voyage` 的导出文件；对局数据校验不过会整体拒绝，不会覆盖当前存档。
- 旧的 3D 棋盘（`assets/board.js`、`app/render/`）保留为回滚资源，V6 首屏和主桌都不加载它。

## 已知限制

- 只做竖屏，目标宽度 320–430；横屏 / 平板不做两栏布局。
- 两个人共用一部手机、轮流操作；没有联机、没有账号、没有云同步、没有第三人。
- 依赖现代浏览器（SVG / `backdrop-filter` / Service Worker）；很旧的 WebView 会降级，动画自动变短。
- 安装到主屏幕需要 `https` 或 `localhost`；用局域网 `http://IP` 打开时只能玩，不能安装。iOS 需要 Safari「添加到主屏幕」。
- 设置里的 `boardView:"3d"` 是预留字段，V6 主桌始终使用 SVG 棋盘；3D 资源只作为回滚参考。
- `build_app.py --check` 面向干净输出目录。仓库根保留的 V5 `assets/board.js` 是回滚资源，会让「产物不含/不引用 board.js」这一项在仓库根上变红——发布门请对 `dist/rebuild`（或其它干净目录）跑。

## 目录与文档

- 源码与构建入口：`app/`、`tools/rebuild/build_app.py`；构建 / 发布 / 回滚细则见 [`docs/REBUILD.md`](docs/REBUILD.md)。
- 规则与数值（唯一事实来源）：[`app/DESIGN.md`](app/DESIGN.md)。
- V6 需求、架构、审计、文案：[`docs/v6/spec.md`](docs/v6/spec.md)、[`docs/v6/architecture.md`](docs/v6/architecture.md)、[`docs/v6/audit.md`](docs/v6/audit.md)、[`docs/v6/copy.md`](docs/v6/copy.md)；实施冻结口径：[`docs/v6/impl-freeze.md`](docs/v6/impl-freeze.md)。
- 发版说明：[`docs/v6/release-notes.md`](docs/v6/release-notes.md)。
- 测试：`qa/rebuild/flight-engine.test.mjs`、`qa/v6/`（报告在 `reports/v6/`）。

## 版本

**6.0.0** · 2026-11-16。本版为全面改版（视觉 A、SVG 棋盘、心动值/连击/命运格、合作收尾、暂停/安全词、回顾/分享图、构建管线）；V5 存档与安全词机制不退化。变更明细与兼容性见 [`docs/v6/release-notes.md`](docs/v6/release-notes.md)。
