# V17 功能规格与验收标准

> 三个功能 + 一轮 QA。每条都写了「必须做到 / 验收方式 / 测试选择器」。
> 一切 UI 文案用简体中文；视觉必须落在既有的 `--v12-*` 设计令牌上（见 ARCHITECTURE.md §2）。

---

## 功能 A · 默契大考验（文件：`v17/features/10-moqi.js`）

### 定位
现有的游戏都是「抽任务 → 执行 / 受罚」，缺一个**两个人一起合作、比谁更懂对方**的轻竞技玩法。
入口：首页主角区第 5 张卡（`.v12-tiles` 追加同款 `.v12-tile`）+ `GAMES` 条目（进「全部玩法」网格）。

### 注册
```js
GAMES.push({id:'moqi', icon:'💞', name:'默契大考验', desc:'心有灵犀 / 你说我猜 · 看看你们多懂彼此'});
RULES.moqi = '……（两句玩法简介，供 ? 帮助弹窗）';
RESET_MAP.moqi = 'v17MoqiReset';
```
包装 `startGame`：`startGame('moqi')` 时接管渲染（仍先调用原函数以复用道具卡/HUD/切页逻辑，参考 ARCHITECTURE §2）。

### 入口页（`#gContent` 内）
- 顶部标题区：`💞 默契大考验` + 一句话副标题；下方「默契档案」小卡：
  - 最高默契度（`心` 模式历史最佳）、你说我猜最佳个数、累计玩过几局、最近一次成绩。
- 两个玩法大卡（点击进入对应玩法）：
  1. `💑 心有灵犀` —— 「同一道题，TA 会怎么选？」
  2. `🗣️ 你说我猜` —— 「不许说词里的字，看 TA 能不能猜到」
- 底部：规则说明折叠 / 「返回大厅」按钮。

### 玩法 1：心有灵犀（`heart`）
题数选择 5 / 8 / 10（默认 8）；选项题，每题 4 个选项（来自内置题库，见下）。
每轮流程（轮次交替由「先答的人」开始）：
1. **答题阶段**：显示题目 + 4 选项，标注“现在由 **A** 亲口选择（B 先别看屏幕）”。A 点选项 → 立即记录，显示“已记录 ✓ 把手机交给 B”。
2. **猜测阶段**：同一题目 + 4 选项，标注“**B** 猜：A 会选哪个？”。B 点选项 → 记录。
3. **揭晓阶段**：显示两人选择与是否命中：命中 `+1 ❤️ 心有灵犀`，未命中 `差一点点`；显示 A 的真实选择 + B 的猜测；按钮「下一题」。A/B 在轮次间交换角色（第 1 题 A 先答 B 猜；第 2 题 B 先答 A 猜；依次交替）。
4. **结算页**：默契度 = 命中数 / 题数（百分比）；段位：
   - `0–40%` → `🌱 还需要多聊聊`；`41–60%` → `🌤️ 渐入佳境`；`61–80%` → `💞 心有灵犀`；`81–100%` → `🔥 灵魂伴侣`。
   同时给出 1–2 句按段位变化的点评；按钮「再来一轮 / 换题 / 返回大厅」。
- 计分与上报：结算时 `coinAdd(命中数)`（1 币/命中，最多 10）、`heatUp()`、`logEvent('💞 心有灵犀：默契度 xx%（命中 n/m）')`、写档案、`v12SyncHome()`。
- 题库要求：**≥45 道**，每题 4 个选项；覆盖日常偏好（周末/口味/旅行/礼物/吵架和好方式/手机习惯/工作状态/约会地点/宠物/节日/旅行/情绪），甜而不腻。选项之间差异明显、无“标准答案”暗示；不得与现有 `GAMEDATA` 重复（抽查即可）。数据结构建议：
  ```js
  var QS = [ {q:'周末更想怎么过？', o:['宅家躺平','出门逛街','近郊走走','睡到自然醒']}, ... ];
  ```

### 玩法 2：你说我猜（`guess`）
- 时长选择 60 / 90 / 120 秒（默认 60）；选择「谁描述」（A 描述 B 猜 / B 描述 A 猜）。
- 开始前提示规则：不能说出词语里的任何一个字（含谐音、英文、拼写），可以描述、举例、做动作。
- 进行中：大字显示当前词卡（≥28px）；顶部倒计时进度条 + 剩余秒数（最后 10 秒变红并有 `sndBuzz()`）；左下大按钮「✅ 猜对了」→ 换下一词、+1；右下「⏭ 跳过」→ 换下一词、不扣分（不限次数，但要记录跳过数）；底部提示“换人 / 结束”小按钮（确认后提前结束）。
- 结算页：猜对 X 个 · 跳过 Y 个 · 用时 Z 秒；评级：`≥12 个` → `🏆 天生一对`，`8–11` → `💞 心有灵犀`，`4–7` → `🌤️ 渐入佳境`，`<4` → `🌱 慢慢来`；按钮「换人再来 / 返回大厅」。
- 词库：**≥80 个**中文词/短语（2–5 字为主），情侣日常 + 生活场景（例：第一次约会、异地恋、吃醋、撒娇、见家长、情侣装、摸头杀、公主抱、抢被子、点外卖、纪念日、婚礼、钻戒、KTV、密室逃脱、恐怖片、火锅、奶茶、高铁、机场、婚纱照、朋友圈、情头、晚安、前任、电灯泡、闺蜜、丈母娘、工资卡、行李箱、自拍、化妆、吹头发、行李箱……）。禁止露骨词。
- 计分与上报：结算 `coinAdd(Math.min(猜对数,12))`、`heatUp()`、`logEvent('🗣️ 你说我猜：猜对 X 个（Y 秒）')`、写档案。
- 计时器必须可清理：回大厅/重置/切玩法时清 `setInterval`；切后台（`visibilitychange`）暂停计时并提示（避免挂后台刷分）。

### 存档（`couple-moqi`）
```js
{ v:1, plays:0, heart:{best:0, last:0, plays:0, rounds:0, hits:0},
  guess:{best:0, last:0, plays:0, describer:'him', duration:60}, lastAt:'2026-10-25' }
```
- 每次结算写入；坏数据回退默认值；`localStorage` 异常不得中断玩法。
- 档案卡读 `heart.best` / `guess.best` / `plays`。

### 验收
- [ ] 从首页主角卡与「全部玩法」两处都能进入；`?` 帮助弹窗显示 `RULES.moqi` 文本。
- [ ] 心有灵犀：5/8/10 题均能完整玩完，命中率与 `hits/total` 一致；两人角色交替正确（第 1 题先答者与猜测者姓名显示正确）；结算数字正确。
- [ ] 你说我猜：计时结束自动结算；提前结束可确认；猜对/跳过计数正确；80 个词不重复出现直到用尽。
- [ ] 中途回大厅、面板「重置本局」、再进入不残留计时器/上一次状态。
- [ ] 结算写入 `couple-moqi`，刷新页面后档案仍显示；`coinGet()`/热度/本局记录有变化。
- [ ] 三套主题下可读、无横向滚动；`data-t` 选择器覆盖：`moqi-hero-card`、`moqi-mode-heart`、`moqi-mode-guess`、`moqi-start`、`moqi-opt-0..3`、`moqi-next`、`moqi-result`、`moqi-replay`、`moqi-home`、`guess-word`、`guess-hit`、`guess-skip`、`guess-timer`、`guess-result`。

---

## 功能 B · 我们的回忆册 + 数据备份（文件：`v17/features/20-memory.js`）

### 定位
现在所有数据（热度/战报/成就/剧本进度……）都只存在本机 `localStorage`，换手机或清缓存就全没了；
「本晚战报」也只在当晚存在。这个功能做两件事：**把每个夜晚沉淀成可回看的时间线** + **一键导出/导入全部数据**。

### 入口
首页主角区第 6 张卡：`📖 回忆册`，副标题「这些夜晚，值得留档」；点击打开全屏抽屉（自定义 overlay，不用 `openModal`，内容较多）。

### 数据（`couple-memories`）
```js
{ v:1, list:[ {ts:1729000000000, date:'2026-10-25', heat:12, tasks:8, games:3,
               kisses:2, drinks:1, moqi:0, note:'今晚笑到肚子疼'} ] }   // list 按 ts 倒序
```
- 上限 200 条，超出丢最旧。
- **自动记录**：包装 `showPartyReport`，原函数执行后调用 `v17MemUpsertToday()`：若当天有数据（`couple-party.tasks>0` 或 `heat>0`），把当天聚合数据 upsert 到 list 头部；同一天重复打开只更新数字，不重复新增。
- 备注：详情里可编辑「今晚的一句话」（`prompt`，≤40 字，存 `note`）。

### 抽屉 UI（`#v17MemSheet`，全屏、可滚动、右上关闭）
- 顶部：`📖 我们的回忆` + 副标题 + 关闭按钮。
- 统计条（4 格）：`共 N 晚` / `累计任务 N` / `最高温度 xx`（当日 heat 最大值对应 `heatStageName` 太绕，直接用数值 + 火焰 emoji）/ `陪伴 N 天`（今天 − 最早记录日期 + 1）。
- 两个 Tab：`时间线` / `数据备份`（复用 `.hub-tabs`/`.hub-tab` 样式）。
- 时间线：
  - 空状态：「还没有记录。今晚玩一局，看一眼本晚战报，它就会自动存进来 💌」
  - 每条卡片：日期（`10月25日 周六`）+ 温度 `🔥 12` + `📋 8 任务` + `🎮 3 局` + 备注（若有）；点击展开详情（亲吻/喝酒/默契度/游戏明细），详情里有「✏️ 改备注」「🗑️ 删除」（confirm）。
  - 列表按日期倒序；今天那条加「今晚」徽章。
- 数据备份 Tab：
  - 说明卡：「数据只存在这台手机的浏览器里。换手机 / 清缓存 / 无痕模式都会丢。建议偶尔导出一次备份。」
  - 数据概况：`已保存 X 项数据 · 约 Y KB`（遍历 `couple-*` 键）。
  - 主按钮「⬇️ 导出备份」：把**所有** `localStorage` 里 `couple-` 开头的键打包成
    ```json
    {"app":"couple-game","v":17,"exportedAt":"2026-10-25T10:00:00.000Z","data":{ "couple-heat": "...", ... }}
    ```
    下载文件名 `情侣升温游戏备份-2026-10-25.json`（`Blob` + `a[download]`；若 `navigator.canShare({files:[file]})` 为真则优先调用 `navigator.share`，失败回退下载）。
  - 次按钮「⬆️ 导入备份」：隐藏 `<input type="file" accept="application/json,.json">`；读取后校验：必须是对象且 `data` 为对象（同时兼容没有外层包装的裸键值对象）；统计将要恢复的键数量与导出时间；`confirm` 后写入（覆盖同名键，不清除其它键），`toast('已恢复，正在刷新…')` 后 `location.reload()`。解析失败给明确 toast：`备份文件格式不对`。
  - 安全：导入不执行任何代码，只写 `couple-*` 键；不合法键名忽略。
- 主题适配：抽屉背景用深色玻璃 + `body.light/.sketch` 覆盖；安全区 padding。

### 无痕模式
`SET.incognito` 为真时，抽屉里显示一行提示「无痕模式开启中：回大厅会清空这些数据」，并且备份 Tab 的导出仍可用（用户主动导出不受限）。

### 验收
- [ ] 首页卡可打开抽屉；Tab 切换、关闭、滚动、移动端不横向溢出。
- [ ] 打开「本晚战报」后，回忆册出现今天一条；再次打开不重复；数字与战报一致。
- [ ] 详情可改备注/删除；统计条随数据变化。
- [ ] 导出得到合法 JSON（Playwright `expect_download` 保存并解析：包含 `couple-*` 键且 ≥5 项）；文件名含日期。
- [ ] 改几个键的值 → 导入刚才的备份 → 刷新后恢复原值；导入坏文件有错误提示且不破坏现有数据。
- [ ] 空数据状态正常；`couple-memories` 为坏 JSON 时不崩。
- [ ] `data-t`：`mem-tile`、`mem-sheet`、`mem-tab-timeline`、`mem-tab-backup`、`mem-export`、`mem-import`、`mem-file`、`mem-item`、`mem-stats`、`mem-close`。

---

## 功能 C · 离线安装（PWA）+ 分享信息（文件：`v17/features/30-pwa.js` + 根目录资源）

### 定位
这是纯前端静态页，天然适合“添加到主屏幕、全屏、离线可玩”；加上分享卡片 meta，链接发出去更好看。
**不改变应用任何游戏逻辑**。

### 交付文件
1. `manifest.webmanifest`（根目录）
   ```json
   {"name":"情侣升温游戏 · 今晚升温","short_name":"情侣升温","lang":"zh-CN",
    "start_url":"./","scope":"./","display":"standalone","orientation":"portrait",
    "background_color":"#0b0617","theme_color":"#6c2bd9",
    "description":"24+ 款情侣面对面互动小游戏 · 一台手机就够",
    "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},
             {"src":"icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"},
             {"src":"icons/icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
   ```
2. `sw.js`（根目录）：
   - `CACHE = 'couple-game-v17-1'`；`install` 预缓存 `./`、`./index.html`、`./manifest.webmanifest`、`./icons/icon-192.png`、`./icons/icon-512.png`（`Promise.allSettled`，单个失败不阻塞）；`self.skipWaiting()`。
   - `activate`：删除非当前版本缓存；`clients.claim()`。
   - `fetch`：只处理同源 GET；页面导航请求用 **network-first**（网络失败回退缓存的 `index.html`），其它静态资源 cache-first（后台回填）。跨域/非 GET 直接 `return`。
   - 版本升级后旧缓存自动清理；`index.html` 永远走网络优先，避免用户被锁死在旧版。
3. `icons/`：`icon-192.png`、`icon-512.png`、`icon-maskable-512.png`（安全区内主体）、`apple-touch-icon.png`（180）、`og-image.png`（1200×630 分享卡）。
   - 生成脚本 `tools/gen_icons.py`（Python + Pillow，Pillow 11 已装）：渐变底（#6c2bd9→#ff2d95）+ 白色爱心 + 极简光点；og 图带文字「情侣升温游戏 · 今晚升温」「24+ 款双人玩法 · 一台手机就够」（用 Windows 字体 `C:\Windows\Fonts\msyh.ttc`，找不到就降级 `arial.ttf`/默认）。脚本可复跑，产物提交到仓库（**不依赖运行时生成**）。
4. `v17/features/30-pwa.js`：
   - 注册 SW：仅当 `location.protocol` 是 http/https，且 `'serviceWorker' in navigator`；`window.addEventListener('load', ...)`；监听 `updatefound`/`statechange`，新版本就绪时 `toast('✨ 新版本已就绪，重开一次生效')`（同一会话只提示一次）；`appinstalled` 时 toast `📲 已添加到桌面`。
   - 捕获 `beforeinstallprompt`（存 `e`，`e.preventDefault()`），使安装按钮可用；无该事件时按钮显示「查看安装方法」。
   - 在 `#setBar` 追加一个设置胶囊（包装 `renderSettings`，追加后判重）：`📲 装到桌面`（已安装/standalone 时显示 `✅ 已安装` 且点击只 toast）。
   - 点击按钮：若有 deferred prompt → `prompt()` 并处理 `userChoice`；否则打开说明弹窗（`openModal`）：
     - iOS：Safari 底部分享 ⬆️ → 「添加到主屏幕」→ 添加；
     - Android：Chrome 右上 ⋮ → 「安装应用 / 添加到主屏幕」；
     - 桌面：地址栏右侧安装图标。
   - 离线/在线监听：`offline` 时 `toast('📴 已离线，游戏仍可玩')`；`online` 时 `toast('🛜 已恢复联网')`（只提示，不做同步）。
   - 不注册 SW 的场景（`file://` 直接打开）必须静默跳过、不报错。

### 验收
- [ ] `python -m http.server`（或 dev.py）打开：DevTools/console 无 SW 报错；`navigator.serviceWorker.getRegistration()` 有值。
- [ ] Playwright：首次访问 → 等待 SW ready → `context.set_offline(True)` → `page.reload()` 仍能完整进入首页并开一局；`set_offline(False)` 恢复。
- [ ] `manifest.webmanifest` JSON 合法、图标路径 200、`theme-color` 生效；Lighthouse PWA 关键项（manifest + SW + 192/512 图标）通过（可用 `npx lighthouse` 不做硬要求，人工核对即可）。
- [ ] 设置条里出现 `📲 装到桌面`；点击有弹窗/安装提示；`file://` 场景无报错。
- [ ] `og:image` 链接可访问（部署后），图片 1200×630 且文字清晰。
- [ ] `data-t`：`pwa-install-pill`、`pwa-install-modal`、`pwa-install-action`。

---

## 功能 D · QA（文件：`qa/`，报告 `reports/`）

### 职责
1. **基线审计（先做，别的功能还没合入时）**：对当前 V16 应用跑一遍自动化冒烟，找**已有 bug**：
   - 首页渲染、26 个 `GAMES` 入口逐个进入（`startGame(id)` → 等 600ms → `#gContent` 非空）、控制台 error/warning、4 个主角入口弹窗、战报、商店、帮助、设置（难度/主题切换）、本局记录、夜终仪式海报（canvas 生成）、剧本/地图入口。
   - 三种视口：`390×844`（iPhone 12）、`360×640`、`1280×800`；三主题。
   - 输出 `reports/baseline-audit.md`：按严重度列 bug（附选择器/复现步骤/截图），并给「不修/可修」建议。
2. **V17 验收**：按本文件 A/B/C 的验收清单写 `qa/test_v17.py`，在 Lead 集成后的 `dist/` 上跑；输出 `reports/v17-qa-report.md`（通过/失败清单、截图、失败详情）与 `reports/screenshots/v17/*.png`。
3. **回归**：V17 合入后重跑基线冒烟，确认 26 个老玩法 0 新增 error。
4. 工具：`qa/harness.py`（已提供骨架：本地禁缓存静态服务 + Playwright 移动端 page + 控制台收集 + 截图）。可自由扩展，但**不要修改应用代码**。
5. 质量门：任何 JS error、白屏、关键按钮无反应、数据不落库 → 必须报告；截图用 390×844。

### 交付
- `reports/baseline-audit.md`、`reports/v17-qa-report.md`、截图目录。
- 在共享任务完成说明里列出：失败项数量、最严重 3 个问题、复现命令。
