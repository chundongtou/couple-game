# V17 扩展包 · 开发约定（给协作者）

> 目标：在**零回归**的前提下，给「情侣升温游戏」加入三块新功能，最终仍保持「单文件 `index.html` 部署」。
> 本文件是所有写代码的协作者的第一份必读材料；具体功能细节看 `v17/SPECS.md`。

---

## 0. 一句话架构

`index.html` 是一个 8700 行的**纯前端单文件**应用：`<style>` 在 9–876 行，`<script>` 在 940–8688 行，全部代码在全局作用域（无模块、无打包器）。
V17 的做法：在脚本末尾留了一个**注入区**，构建脚本把 `v17/features/*.js` 按文件名排序拼接进去。

```
V17_INJECT_START
  /* ===== V17 FEATURE: 10-moqi.js ===== */      ← 各协作者只写这里面的文件
  /* ===== V17 FEATURE: 20-memory.js ===== */
  /* ===== V17 FEATURE: 30-pwa.js ===== */
V17_INJECT_END
```

---

## 1. 目录与纪律

```
couple-game/                 ← git 仓库根（当前分支 v17）
├─ index.html                ← 线上唯一入口；只有 Lead 能改
├─ manifest.webmanifest      ← PWA（属于 30-pwa 任务）
├─ sw.js                     ← Service Worker（属于 30-pwa 任务）
├─ icons/                    ← PWA 图标（属于 30-pwa 任务）
├─ v17/
│   ├─ ARCHITECTURE.md       ← 本文
│   ├─ SPECS.md              ← 三个功能的验收规格
│   └─ features/
│       ├─ 10-moqi.js        ← 协作者 A 写
│       ├─ 20-memory.js      ← 协作者 B 写
│       └─ 30-pwa.js         ← 协作者 C 写
├─ tools/
│   ├─ build.py              ← 拼装构建（不要手改 index.html 的注入区）
│   └─ dev.py                ← 一键「构建 + 本地静态服务（禁缓存）」
├─ qa/                       ← QA 的测试脚本
└─ reports/                  ← QA 报告与截图（git 忽略）
```

**硬性纪律**

1. **禁止**修改 `index.html`（含其 `<style>`/`<script>`/注入区）。你需要的 DOM 一律运行时注入。
2. **禁止**修改已有函数体、已有 `GAMES` 条目、已有 CSS 规则；只能**包装**（wrap）已有全局函数。
3. **禁止**引入任何外部依赖/网络请求/新字体；离线可用是硬要求。
4. **禁止**执行 `git push`、`git checkout`、删除文件；提交由 Lead 统一做。
5. 只在你的 `v17/features/*.js`、以及你自己的临时目录里写文件；`dist/` 用 `--out` 分开，避免互相覆盖。
6. 保持 ES5 风格（`var`/`function`/字符串拼接），与应用现有代码一致；iOS Safari 12 也能跑。

---

## 2. 运行时基本面（写代码前必须知道）

### 页面与导航
- 只有两个页面：`#homePage` / `#gamePage`；`showPage('homePage'|'gamePage')` 切换（自带滑动动画）。
- `goHome()` = 清各类计时器 + `showPage('homePage')` + `renderHome()`。
- 游戏页结构：`#gTitle` 标题、`#gContent` 内容容器、底部 `#ctrlBar` 控制栏（完成/重抽/跳过/撤销/重置/大厅）。
- 首页结构：`.v12-hero` 里 `.v12-tiles`（4 个主角入口卡）+ `#setBar` 设置胶囊条 + `.v12-more`（`#gameGrid` 全部玩法网格）。

### 游戏注册与启动
- 游戏清单是全局数组 `GAMES`：`{id,icon,name,desc,hidden?}`。首页 `renderHome()` 会遍历它渲染 `#gameGrid`。
- `startGame(id)` 负责：切页、设 `curGame`、`gTitle`、发道具卡、`renderCtrl()`、HUD 同步、`markPlayed(id)`，然后 `if(id==='xxx') renderXxx(c)` 分派内容。
- 新玩法**不要**去改 `startGame` 的分派链，而是包装它。**关键：自己的 id 也要先调原函数**（它负责切页、设置 `gTitle`、`curGame`、发道具卡、`renderCtrl`、HUD 同步、`markPlayed`；分发链没有你的 id 时它只是不渲染内容）：

```js
var _startGame = window.startGame;
window.startGame = function (id) {
  if (id === 'moqi') {
    var r = _startGame.apply(this, arguments);   // 先复用原逻辑：切页/标题/curGame/道具卡/HUD
    v17MoqiStart();                              // 再渲染自己的内容到 #gContent
    return r;
  }
  v17MoqiStop();                                 // 去别的玩法时清自己的计时器
  return _startGame.apply(this, arguments);
};
```

> 已用真实应用验证过（`qa/_tmp_lead/probe.py`）：只渲染不调原函数会导致停留在首页、`#gContent` 被首页遮罩挡住。

> 注意：`startGame` 是脚本顶层的函数声明，等价于 `window.startGame`，重新赋值即可全局生效；
> 内联 `onclick="startGame('x')"` 在点击时才会解析，所以包装一定生效。

### 首页挂载（不要改 HTML）
`renderHome()` 每次都会重写 `#gameGrid.innerHTML`。包装它，在原始渲染后追加自己的入口；同时**在 init 时手动挂载一次**（因为首屏渲染发生在我们脚本之前），并用「已存在则跳过」判断防重复：

```js
var _renderHome = window.renderHome;
window.renderHome = function () {
  var r = _renderHome.apply(this, arguments);
  v17MoqiMount();     // 内部：if(document.querySelector('[data-t="moqi-card"]')) return;
  return r;
};
```

`.v12-tiles` 里的 4 张主角卡是静态 HTML：新功能可以用 `document.querySelector('.v12-tiles').insertAdjacentHTML('beforeend', ...)` 追加同款卡片（`data-t` 标记防重复）。

### 数据与存储
- 全部持久化在 `localStorage`，键名统一前缀 `couple-`，值一律 JSON 字符串。
- 每日清零型数据结构惯例：`{d: new Date().toDateString(), ...}`；开机时发现 `d !== 今天` 就重置。
- **无痕模式**：当 `SET.incognito` 为真时，`incognitoSweep()` 会在回大厅时删除除 `couple-set` 外的所有 `couple-*` 键。新键会被自动清掉——这是预期行为，不要绕过。
- 读写一律 `try/catch`，坏数据回退默认值（用户可能手改/旧版本残留）。

### 主题与视觉
- 深色是默认；`body.light`（浅色浪漫）/ `body.sketch`（手绘情书）由 `SET.theme` 切换。
- **必须**使用 V12 设计令牌，浅色/手绘主题才会自动适配：
  `--v12-ink`（主文字）`--v12-dim` `--v12-dim2`（次要文字）`--v12-surf` `--v12-surf2`（卡面）`--v12-line`（描边）
  `--v12-m`（粉）`--v12-v`（紫）`--v12-c`（青）`--v12-g`（金）`--v12-danger`（警示）
- 组件可复用：`.wheel-btn`（`.spin` 主按钮 / `.next` / `.back` 次按钮 / `.mini-btn`）、`.m-item`（弹窗内条目卡）、`.modal`（经 `openModal(html)`）、`.hub-tabs`+`.hub-tab`（吸顶胶囊页签，参考 741–749 行）、`.game-card`、`.v12-tile`。
- 弹窗系统：`openModal(html)` / `closeModal()`；`#modalBox` 是弹窗内容容器。
- 轻提示：`toast('文本')`；音效：`sndDing()` `sndSpin()` `sndBoom()` `vibrate(ms)`（受 `SET.sound` 控制，内部已判断）。
- 玩家昵称：全局 `HE.him` / `HE.her`，随时可能被改名，**每次用的时候现读**，不要缓存到本地变量里长期持有。

### 统计与成长（让新玩法融入既有经济）
- `addRound()`：完成一轮，累计轮数并可能解锁道具卡（10/15 轮）。
- `logEvent(txt)`：写入「本局记录」侧栏 + `addRound()` + `partyTrack(txt)`（本晚战报统计）。
- `partyTrack(txt)`：只做本晚战报统计，不写记录侧栏。
- `heatUp()` / `getHeat()`：今晚升温线（每日清零）。
- `coinAdd(n)`：亲密币。
- `v12SyncHome()` / `v12SyncHud()`：刷新首页/游戏页 HUD 数字。
- 成就：`v12UnlockAch(id)`（已有 9 枚定义在 `V12_ACH`，不必新增）。
- 帮助：`RULES` 是 `id → 规则文案` 的全局对象；`showRules(id)` 自动读它，新玩法请 `RULES.moqi = '…'`。
- 重置本局：`RESET_MAP[curGame]` 的值是全局函数名字符串，例如 `RESET_MAP.moqi = 'v17MoqiReset'`；`panelReset()` 会 `window[fn](#gContent)`。

### 可用的参考实现
- 简单页签/卡片式玩法：`renderHub`（6460 行附近）、`bombRangeSet`、`renderVault`。
- 计时器/倒计时：`escalate`（`escStart`）、烫手山芋 `renderPotato`。
- 弹窗结算页：`renderGamble` / `blinddice` / `v16StageEnding`。
- 首页瓷砖注入可参考 `.v12-tiles` 的 HTML（899–904 行）与 CSS（516–527 行）。
- 具体行号会漂移，用 `grep`/`read` 定位，不要盲信行号。

---

## 3. 构建与自测

```bash
# 只构建自己的片段（不会碰到别人的半成品），产物在 dist/moqi/
python tools/build.py --only 10-moqi --out dist/moqi

# 一键构建 + 本地服务（禁用缓存，适合 Playwright / 手机同局域网访问）
python tools/dev.py --port 8802 --only 10-moqi
# 打开 http://127.0.0.1:8802
```

- Python 3.11；`playwright` 1.59（chromium 已安装）可直接 `from playwright.sync_api import sync_playwright`。
- 自测最少要求：手机视口 `390×844` 下，用 Playwright 走通「首次进入 → 进入功能 → 完成一局 → 看到结算 → 回大厅 → 数据已保存」；控制台 0 error；三套主题（dark/light/sketch）各扫一眼截图；不联网（`context.set_offline(True)` 后刷新仍可用）。
- 端口分配（避免冲突）：`qa`=8801，`10-moqi`=8802，`20-memory`=8803，`30-pwa`=8804。
- 你的临时测试脚本放 `qa/_tmp_<feature>/`，不要放进 `qa/` 顶层污染 QA 的目录。

---

## 4. 内容与体验标准

- 文案：简体中文、轻松、有梗、情侣向；**不写露骨性内容**（本扩展面向大众可分享）；避免说教和尴尬煽情。
- 移动优先：点击区 ≥44px、字号 ≥12px、单屏不出现横向滚动；iOS Safari 安全区（`env(safe-area-inset-bottom)`）。
- 视觉：沿用霓虹夜店设计系统（18/13px 圆角、渐变按钮、emoji 图标）；禁止引入外部图片/字体；可用内联 SVG/canvas。
- 容错：重复点击、数据为空、localStorage 损坏、切到后台再回来、倒计时中途回大厅——都要不崩、不重复计分。
- 无痕/每日清零/换主题等既有设置对新功能同样生效，不许绕过。

---

## 5. 交付（写进共享任务的完成说明里）

1. 改动文件清单（只应有 `v17/features/xx.js`，pwa 另有 manifest/sw/icons）。
2. 自测命令 + 结果（截图放 `reports/` 下自建子目录）。
3. 你实现的 UI 上稳定的测试选择器（`data-t` 属性列表），供 QA 写自动化。
4. 已知限制 / 没做完的部分。
5. 一句话变更说明（中文，供 commit message 用）。
