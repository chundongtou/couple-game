# 升温夜航 · V3 重制版 —— 构建、发布与维护手册

> 本文只讲「怎么构建 / 怎么发 / 怎么改」。规则与设计以 `app/DESIGN.md` 为唯一事实来源。
> 旧版（V17 单文件 index.html）保留在 git 历史与 `v17/`、`v18/` 分支里，不再部署。

---

## 1. 目录结构

```
couple-game/                      ← 仓库根 = GitHub Pages 站点根
├─ index.html                     ← 发布产物（单文件，由 build_app.py --release 生成；不要手改）
├─ manifest.webmanifest           ← PWA 清单（发布产物，提交进仓库）
├─ sw.js                          ← Service Worker（发布产物，提交进仓库）
├─ icons/                         ← PWA 图标（192/512/maskable/apple-touch/分享图）
├─ app/                           ← 重制版源码（唯一开发入口）
│  ├─ DESIGN.md                   ← 设计文档（唯一事实来源）
│  ├─ index.template.html         ← HTML 模板（含 PWA / 分享 meta，占位符 APP_CSS/APP_DATA/APP_JS）
│  ├─ data/                       ← 题库原始数据（raw.json、scores.json、cards-meta.json、inventory.json）
│  └─ src/
│     ├─ app.js                   ← 启动入口（Router.init / 首次交互解锁音频 / App.PWA.register）
│     ├─ core/                    ← bus / store / ui / util / audio / motion
│     ├─ engine/                  ← engine.js（规则）+ balance.js（数值）
│     ├─ data/cards.js            ← 题库（make_cards.py 生成，不要手改）
│     ├─ content/content.js       ← 三幕 / 事件 / 结局 / 奖项文案
│     ├─ styles/base.css          ← 设计令牌 + 基础组件
│     └─ ui/                      ← router、pwa、screens/*（每个屏幕自包含）
├─ tools/rebuild/                 ← 构建与内容脚本
│  ├─ build_app.py                ← 内联构建（dev / --release）
│  ├─ dev_app.py                  ← 构建 + 本地禁缓存静态服务
│  ├─ make_cards.py               ← raw.json → src/data/cards.js
│  └─ extract_data.py / enrich_scores.py / inspect_data.py
├─ qa/rebuild/                    ← 重制版 E2E 测试
├─ reports/rebuild/               ← 测试报告与截图（git 忽略）
└─ .github/workflows/pages.yml    ← main 分支推送 → 自动部署 Pages
```

**原则**：`app/` 是源码，根目录 `index.html` 是产物。任何功能改动都在 `app/` 里做，然后重新 `--release`。

---

## 2. 构建与本地预览

```bash
# 开发构建：app/ → dist/rebuild/index.html（单文件，外链只有 manifest 与图标）
python tools/rebuild/build_app.py

# 构建到自定义目录
python tools/rebuild/build_app.py --out dist/pwa-dev

# 一键「构建 + 本地服务（禁缓存）」：http://127.0.0.1:8877
python tools/rebuild/dev_app.py --port 8877

# 只服务已构建目录（不重新构建）
python tools/rebuild/dev_app.py --port 8877 --out dist/rebuild --no-build
```

构建会：
1. 按 `tools/rebuild/build_app.py` 里的 `JS_MODULES` / `DATA_MODULES` / `CSS_FILES` 顺序读源码；
2. 用 `node --check` 逐个做语法体检（node 不存在则跳过）；
3. 用 `<!--APP_CSS--> / <!--APP_DATA--> / <!--APP_JS-->` 三个占位符内联进 `app/index.template.html`；
4. 把根目录的 `manifest.webmanifest`、`sw.js`、`icons/` 复制到输出目录。

> 屏幕模块是「缺失即跳过」的：并行开发时某个 screen 还没写好也能构建出壳层，控制台会打印 `[WARN] 跳过未完成的模块`。

---

## 3. 发布（生成根目录 index.html）

```bash
# 生产构建：写仓库根 index.html，并同步 manifest/sw/icons 到根目录
python tools/rebuild/build_app.py --release

# 想先检查产物而不覆盖根 index.html：
python tools/rebuild/build_app.py --release --out dist/release-test
```

发布前检查清单：

- [ ] 根目录 `index.html` 是刚由 `--release` 生成的（文件头有构建信息，`git diff` 只应包含本次改动）；
- [ ] `manifest.webmanifest` / `sw.js` 已是最新；**改了前端资源就把 `sw.js` 的 `CACHE` 版本 +1**（`couple-voyage-v1` → `-v2`），否则老用户下次打开仍用旧缓存；
- [ ] 根目录 `icons/` 五张图齐全（192 / 512 / maskable-512 / apple-touch-180 / og-image-1200×630）；
- [ ] `qa/rebuild` 的 E2E 已跑过（见 §6）。

---

## 4. 部署（GitHub Pages）

- 站点发布目录就是**仓库根**；工作流 `.github/workflows/pages.yml` 在 **push 到 `main`** 时自动部署。
- 流程：在 `v2` 分支完成重制 → 跑 `--release` 生成根 `index.html` → 提交 → 合并到 `main` → Pages 自动更新（约 1–2 分钟）。
- 线上地址：`https://chundongtou.github.io/couple-game/`
- 该工作流 `path: '.'` 会把整个仓库上传，所以**不要把半成品 dist/ 或私有文件提交进仓库根**（`dist/`、`reports/` 已在 `.gitignore`）。
- 也可以手动触发：Actions → “Deploy to GitHub Pages” → Run workflow。

### 回滚

1. **最快**：GitHub 上 revert 合并后的 commit（或 `git revert <merge-commit>` 推 `main`），Pages 自动回到上一版；
2. **回滚到某个历史版本**：`git show <commit>:index.html > index.html`（同时取回同 commit 的 `manifest.webmanifest` / `sw.js` / `icons/`）→ 提交推 `main`；
3. 回滚后**也要 bump 一次 `sw.js` 的 `CACHE` 版本**，让已经缓存旧版的用户能换回来；
4. 本地应急：`git checkout <old-commit> -- index.html manifest.webmanifest sw.js icons/`。

---

## 5. 怎么改内容 / 数值 / 样式

| 想改什么 | 改哪里 | 备注 |
|---|---|---|
| 数值（收益、连击、阈值、幕长、商店价格） | `app/src/engine/balance.js` | 引擎只读常量；改完跑 `qa/rebuild` 的规则用例 |
| 玩法规则 / 状态机 | `app/src/engine/engine.js` | 纯逻辑无 DOM；必须保持确定性（`mulberry32(seed)`） |
| 三幕文案 / 事件 / 结局 / 奖项 | `app/src/content/content.js` | `window.CONTENT`；结局按 `endings[].cond` 优先级命中 |
| 题库 | `app/data/raw.json` → `python tools/rebuild/make_cards.py` | 产物 `app/src/data/cards.js` 不要手改；标签/星级在 `tools/rebuild/make_cards.py` 里调 |
| 视觉令牌（颜色/圆角/阴影/缓动） | `app/src/styles/base.css` `:root` | 所有屏幕必须用令牌，不要另写 body 背景 |
| 单个屏幕 | `app/src/ui/screens/<name>.js` | 自包含，CSS 用 `App.UI.injectStyle('<name>', css)` |
| PWA / 安装入口 / 离线提示 | `app/src/ui/pwa.js`、`manifest.webmanifest`、`sw.js` | 见 §7 |
| 分享卡片（og:image / 标题 / 描述） | `app/index.template.html` 的 `<head>` | 改完需 `--release`；`og:image` 指向 `icons/og-image.png` |

改完统一流程：**改 `app/` → `python tools/rebuild/build_app.py --out dist/rebuild` → 本地 8877 验证 → `--release` → 提交**。

---

## 6. 测试

```bash
# 重制版 E2E（boot→setup→…→finale，quick/classic/deep，三视口，离线）
python qa/rebuild/e2e.py
```

- 报告与截图：`reports/rebuild/`（git 忽略）。
- 关键验收项见 `app/DESIGN.md` §8；离线项属于 PWA，需要 http(s) 或 localhost 打开（`file://` 不注册 SW）。

---

## 7. PWA / 离线 / 装到桌面

- **注册**：`app/src/app.js` 启动时调用 `App.PWA.register()`；只有 http/https 且支持 `serviceWorker` 才注册 `./sw.js`，`file://` 直接打开会静默跳过（不报错）。
- **安装入口**：右下角小胶囊「装到桌面」（`data-test="pwa-install-pill"`）。只在两种情况下出现：
  1. 浏览器触发了 `beforeinstallprompt`（Chrome/Edge/Android，可原生安装）；
  2. iOS Safari（没有该事件，始终给出手动入口）。
  已安装 / standalone 模式不显示；`play` 屏会隐藏（右下角是长按安全词按钮，安全词优先）。
- **安装流程**：点击胶囊 → 有原生事件就 `prompt()`；否则打开说明抽屉（`data-test="pwa-install-sheet"`），按平台给出 iOS Safari / Android Chrome / 桌面地址栏三种步骤。其它屏幕也可以调用 `App.PWA.showInstall()`。
- **状态查询**：`App.PWA.installed`（只读布尔）、`App.PWA.canPrompt()`、`App.PWA.platform()`。
- **离线**：`sw.js` 预缓存 `./`、`./index.html`、`manifest.webmanifest` 与四个图标；导航 network-first（刷新永远先要新版本，失败回退缓存），静态资源 cache-first。所有数据在 `localStorage`（`couple2.*`），离线照常可玩。
- **离线提示**：`offline` / `online` / `appinstalled` 各 toast 一次；SW 新版本就绪时 toast「✨ 新版本已就绪，重开一次生效」（每会话一次）。
- **发版**：改完前端后把 `sw.js` 的 `CACHE` 版本 +1，`--release` 时根目录 `sw.js` 一并更新，老用户下次打开收到更新提示。

---

## 8. 已知边界

- 安装能力依赖安全上下文：`https://` 或 `localhost` 才行；用局域网 IP 的 `http://` 打开时浏览器不提供安装（胶囊会退化为「查看方法」）。
- iOS 只支持 Safari「添加到主屏幕」，微信/QQ 内置浏览器需先在浏览器打开。
- 卸载 PWA 不会清除数据；数据只在同一浏览器的 `localStorage` 里，换手机请用「设置 → 数据导出/导入」。
- `--release` 不自动改版本号；`CACHE` 与 `index.html` 的版本提示由发版人手动维护。
