# 升温夜航 · V3 重制版设计文档（唯一事实来源）

> 决策：**推倒重来**。旧版「29 个小游戏 + 地图 + 剧本 + 飞行棋」的拼盘不再保留；只复用旧版**题库文本**。
> 新游戏：一款**双人轮流领航的叙事卡牌游戏**，一局 20–60 分钟，3 幕、14 回合（可选 9/18）、6 结局。
> 目标：不是功能多，而是**每一次点击都好看、每一步都有反馈、每一局都有弧光**。

---

## 0. 世界观与语气

> 「今晚，你们登上一艘只在夜里出现的船。航线有三段：潮汐、暗涌、靠岸。
> 每一张卡，都是海面递来的一句话。你可以回答，也可以跳过——船会记得你们怎么选择。」

- 视觉：深夜海域 / 极光 / 玻璃舷窗 / 暖金与玫红。深色为主，**单一强美术方向**（不再做三套换皮）。
- 文案：短、具体、有画面感；不解释规则，用界面引导。成人内容只出现在旧题库原文里，新写的 UI/剧情文案不新增露骨内容。
- 节奏：一局 3 幕；每幕结束有转场与商店；最终结算有结局、奖项、海报。

## 1. 核心循环（一回合）

```
领航员(draft) → 三选一 → 展示卡牌并执行(完成) → 结算反馈 → (可选)加码 → 下一回合，换人领航
                       ↘ 跳过（重置连击/扣张力，但记温柔值）
```

### 1.1 回合规则
1. 每回合由 `host` 玩家（A/B 交替）从 **3 张手牌** 中选 1 张。
2. 手牌由引擎按「幕强度 + 类型多样性」抽取；可花 1 张「换牌券」重抽整手。
3. 选定后进入执行态：界面展示卡面（类型、星级、正文、标签、预期收益）。
4. 玩家选择：
   - **完成**：获得收益，`combo+1`，记录历史。
   - **跳过**：`combo=0`、张力 -1（不低于 0），温柔值 +1，记录 skip；到达幕末时不会因此卡关（自适应）。
   - **加码**（完成前不可用）：完成当前卡后出现「深潜」按钮；点击立即抽一张 `星级+1` 的深潜卡：
     - 完成它：收益 ×2、额外星屑；本回合结束。
     - 跳过它：心动 -1（不低于 0）、连击归零；本回合结束；不抽惩罚卡。
5. 每回合结束后推进 `round`；`round % actLength === 0` 时触发事件/幕转场。

### 1.2 卡牌类型与基础收益
| 类型 | 图标 | 基础收益（星级 s） | 说明 |
|---|---|---|---|
| 真心话 truth | 💬 | 默契 +1.5s、心动 +0.5s | 回答问题；跳过=不想说，无额外惩罚 |
| 大冒险 dare | ⚡ | 张力 +1.5s、心动 +0.5s | 执行任务；失败由玩家自评 |
| 触碰 touch | 🫧 | 心动 +1.5s、张力 +1s | 肢体互动类任务 |
| 共鸣 sync | 🪢 | 默契 +2s、心动 +1s | 双人协作/互相配合 |
| 心跳 spark | 🌟 | 张力 +2s、心动 +1.5s | 高星专属「更深一层」卡池，只在 maxStar=4 或加码时出现 |
| 惩罚 punish | 🚫 | —（风险结算用） | 加码跳过不抽惩罚；仅在「心跳赌注」事件里出现 |

> 所有收益取整规则：`Math.round(base * s / 2)`，最低 1。星屑 `coins = s + floor(combo/3)`。
> 连击：每次「完成」+1；每 3 连击额外 +1 星屑；每 5 连击获得 1 张随机券（护身符/换牌/加码）。跳过归零。

### 1.3 资源
- **心动 heart**：亲密浓度。
- **张力 tension**：刺激与暧昧的电流。
- **默契 sync**：你们在同一个频率上。
- **星屑 coins**：局内货币，幕间商店用。
- 隐藏值 **温柔值 gentle**：跳过/缓一缓累积，影响结局与自适应。

### 1.4 幕与结局判定
- 长度：`quick` 9 回合（3/3/3）、`classic` 14 回合（5/5/4）、`deep` 18 回合（6/6/6）。
- 每幕结束时结算「共鸣检定」：`score = heart + sync*1.2 + tension*0.8 + gentle*2`
  - `≥ 阈值`：幕末奖励（+1 券 / 星屑 / 特别转场文案）；阈值随幕提升（act1 12、act2 26、act3 42，按回合数缩放）。
  - `< 阈值`：自适应——下一幕手牌星级 -1（不低于 1），转场文案更温柔。
- 两处事件（第 1 幕末、第 2 幕末）由 `content.js` 提供，各 2–3 个选项，改变资源/flag。
- 结局（session 结束或安全词）按以下优先级取第一个满足项：
  1. `flags.safeWord` → 温柔收尾「海面下的拥抱」
  2. `gentle >= 3 && heart >= 6` → 「慢一点，也很靠近」
  3. `sync >= 12 && heart >= 8` → 「同一个频率」
  4. `tension >= 18` → 「不眠的暗涌」
  5. `heart >= 14` → 「天亮之前」
  6. 兜底 → 「各自听见的海」
- 结局页同时展示：三资源、最高星级、最大连击、跳过数、完成数、奖项 2–3 个、海报。

### 1.5 星级与尺度
- 设置里的 `maxStar`：1 温柔 / 2 暧昧 / 3 热烈 / 4 不设限；手牌与加码都不会超过 maxStar。
- 旧题库按关键词自动打星（1–5），引擎按 `star <= maxStar` 过滤；`spark` 仅在 maxStar>=4 出现。
- 黑名单（文本关键词 / 标签）在抽卡时过滤；用户设置保存 `couple2.settings`。

## 2. 屏幕与流程

```
boot ──开始/继续──> setup ──> journey ⇄ play ──(幕末)──> event? ──> act-transition ⇄ shop ──> … ──> finale ──> memory/replay
  │                                   └──安全词/暂停──> finale(温柔收尾)
  ├──回忆册 memory
  └──设置 settings ──> boot
```

| 屏幕 | 内容 | 主要交互 |
|---|---|---|
| boot | 标题、极光背景、继续/新的一夜/回忆册/游戏厅/设置 | 点击、键盘 Enter |
| setup | 3 步向导：①名字 ②尺度与边界（maxStar + 黑名单标签 + 缓和开关）③今晚长度（9/14/18）+ 开始 | 步骤指示、chips、开始按钮 |
| journey | 顶部 HUD（❤🔥🤝✦ + 连击）、幕标题/进度、领航员提示、3 张手牌扇形 | 选卡、换牌券、菜单 |
| play | 大卡面、执行/跳过、（完成后）加码、安全词长按、缓一缓 | 完成/跳过/加码/安全词 |
| event | 事件叙事卡 + 2–3 选项 | 选项 → 资源反馈 |
| act | 幕转场：标题、幕评语、资源结算、自适应提示；按钮进入商店/下一幕 | 继续 |
| shop | 3–4 个商品（护身符 6✦ / 换牌券 4✦ / 加码券 8✦ / 心糖 5✦+1心动） | 购买/离开 |
| finale | 结局名/文案、资源、奖项、海报（canvas 下载/分享）、存进回忆册、再来一夜 | 保存、分享、回大厅 |
| memory | 历史夜晚列表（日期/结局/资源/备注），删除、导出/导入全部数据 | 列表/详情 |
| arcade | 游戏厅：温度计 / 真心话转盘 / 大冒险转盘 / 飞行棋；iframe 内嵌，独立 localStorage | 选择游戏、iframe 内返回 |
| settings | 声音/触感/减少动效/默认尺度/安全词说明/清除数据/关于 | 开关、按钮 |

- 任意屏幕可直接 `App.Router.back()`；只有 boot 是根。
- 安全词：长按 2 秒（或设置里开启双击）→ 立即 `Engine.safeWord()` → finale（温柔收尾，不惩罚、不扣数据）。
- 缓一缓：对当前卡降 1 星；每局 2 次；若降到 0 则视为跳过但记温柔值。
- 自动存档：每次状态变化写 `localStorage['couple2.session']`；boot 显示「继续」。
- 减少动效：`prefers-reduced-motion` 或设置开关；所有入场动画降为淡入，粒子关闭。

## 3. 数据结构

### 3.1 卡牌（`app/src/data/cards.js`）
```js
window.CARDS = {
  truth: [{ id:'t1', text:'…', star:2, tags:['私密'], src:'truths' }],
  dare: [...], touch: [...], sync: [...], spark: [...], punish: [...]
};
```
- 生成脚本：`tools/rebuild/make_cards.py`（从 `app/data/raw.json` 去重+分类+打星+打标签；可重复运行）。
- 目标规模（实际生成）：truth ≈ 500、dare ≈ 235+、touch ≈ 288、sync ≈ 65、spark ≈ 127、punish ≈ 211。

### 3.2 剧情内容（`app/src/content/content.js`）
```js
window.CONTENT = {
  acts: [
    { id:1, name:'潮汐', sub:'靠近之前，海面先亮了一下', accent:'#e9b872',
      intro:['…','…'], outtro:{good:'…', soft:'…'} },
    { id:2, ... }, { id:3, ... }
  ],
  events: [
    { id:'e1', afterAct:1, title:'窗外的雨', text:['…'], options:[
        { id:'a', label:'把窗推开一条缝', effects:{tension:+2, sync:+1}, flag:'rain_open' },
        { id:'b', label:'拉上窗帘，看他', effects:{heart:+2}, flag:'rain_close' },
      ] },
    ...
  ],
  endings: [
    { id:'safe', name:'海面下的拥抱', cond:(r,s)=>..., text:[...], quote:'…' },
    ...
  ],
  awards: [ {id, name, icon, cond:(r,s)=>...} ]
};
```

### 3.3 会话状态（持久化）
```js
{
  v: 1, id, ts, names:{a,b},
  settings:{ maxStar, length, sound, haptics, reduced, safeHold },
  act: 1|2|3, round: 1..N, host:'a'|'b',
  resources:{ heart, tension, sync, coins }, gentle,
  combo, maxCombo, skips, completes, maxStarSeen,
  tokens:{ shield, reroll, escalate },   // 护身符/换牌券/加码券
  hand:[cardId…], current:cardId|null, phase,
  usedCards:{ [pool]: { [id]: true } },  // 已抽过的卡（避免重复，按池洗牌）
  events:{ [eventId]: optionId }, flags:{},
  log:[{round, type, cardId, text, star, outcome, deltas}],
  result:null|{endingId, awards:[], stats}
}
```

## 4. 引擎 API（`app/src/engine/engine.js`，纯逻辑、无 DOM）

引擎是唯一规则权威；UI 只读状态、派发动作、播放返回的事件。
```js
App.Engine = {
  // 生命周期
  newSession(settings, names) -> state,
  validate(state) -> state,               // 恢复存档时校验/修复
  // 抽牌
  startRound(state) -> state,             // 生成 hand，phase='draft'
  reroll(state) -> state,                 // 消耗 reroll 券
  chooseCard(state, cardId) -> state,     // phase='play'
  // 结算
  complete(state) -> { state, events },   // phase='resolve'，可加码
  escalate(state) -> { state, events },   // 抽深潜卡 phase='escalate'
  escalateComplete(state) -> { state, events },
  escalateSkip(state) -> { state, events },
  skip(state) -> { state, events },
  gentleDown(state) -> { state, events }, // 缓一缓
  // 幕与事件
  nextRound(state) -> { state, events },  // 若幕末：phase='event'|'act'
  chooseEvent(state, eventId, optionId) -> { state, events },
  leaveAct(state) -> state,               // 进入下一幕第 1 回合
  shopBuy(state, itemId) -> { state, events },
  finish(state) -> { state, events },     // 结算结局+奖项
  safeWord(state) -> { state, events },
  // 只读辅助
  eligibleCards(state), drawHand(state), actInfo(state), progress(state),
  canEscalate(state), shopOffers(state), currentCard(state), handCards(state)
};
```
- 所有动作返回新的 `state`（浅拷贝 + 不可变更新），不直接写 localStorage；持久化由 `App.Store` 负责。
- `events[]` 示例：`{type:'gain', res:{heart:2,tension:1}, combo:3, msg:'共鸣 +'} / {type:'combo', n:3} / {type:'actEnd'} / {type:'ending'}`
- 抽取必须确定性可测：`App.Engine` 内部 RNG 使用 `mulberry32(seed)`，`newSession` 接受可选 `seed`，测试用固定 seed。
- 卡池洗牌袋存在 `usedCards`，用尽自动重洗。

## 5. UI 架构

- 无框架、无构建依赖；`window.App` 命名空间，模块 IIFE 挂载。
- `App.Bus` 简单事件总线；`App.Store` 读写/迁移；`App.Engine`；`App.UI`（DOM 工具：h/qs/sheet/toast/flip/animate）；`App.Router` 屏幕栈；`App.Audio` 合成音效；`App.Motion` 动效工具。
- 每个屏幕是一个**自包含文件**：`App.Screens.xxx = { mount(root, params), unmount() }`，自己注入 scoped CSS（`App.UI.injectStyle('screen-xxx', css)`）。屏幕之间不互相 import，只通过 `App.Engine/App.Store/App.Router/App.Bus` 协作。
- 屏幕文件命名/归属见 §7。
- 设计令牌（CSS 变量，`styles/base.css`）：`--bg0/--bg1/--ink/--dim/--line/--card/--gold/--rose/--violet/--teal/--danger/--r-lg/--r-md/--sh/--ease/--t-*`；所有屏幕必须使用。
- 动效原则：入场 180–420ms、缓动 `cubic-bezier(.2,.8,.2,1)`；页面切换 fade+scale；资源变化 count-up + 浮字；卡牌 3D 翻面；连击/幕末粒子；`reduce` 时全部降级。
- 音效：WebAudio 合成（tick/whoosh/flip/chime/coin/soft），无外部资源；受 `settings.sound` 控制；首屏点击后解锁 AudioContext。

## 6. 构建与部署

```bash
# 开发（构建到 dist/rebuild 并起本地服务，禁缓存）
python tools/rebuild/build_app.py && python tools/rebuild/dev_app.py --port 8877

# 生成题库（raw.json 已在 app/data/）
python tools/rebuild/make_cards.py

# 生产构建：把 app/ 源码内联成 repo 根 index.html（单文件，保留 PWA）
python tools/rebuild/build_app.py --release
```
- 构建顺序在 `tools/rebuild/build_app.py` 的 `MODULES` 清单里；CSS 拼接顺序同理。
- `--release`：读 `app/index.template.html`，内联全部 CSS/JS/DATA，输出根 `index.html`；同步更新 `manifest.webmanifest`/`sw.js` 缓存版本；旧版保留在 git 历史与 `legacy-v17/`（可选，不部署）。
- 线上仍由 GitHub Pages 从 `main` 部署；本重制在 `v2` 分支，合并后生效。

## 7. 文件归属（并行开发边界）

| 路径 | 负责人 | 内容 |
|---|---|---|
| `app/DESIGN.md` | Lead | 本文 |
| `app/index.template.html`、`tools/rebuild/build_app.py`、`dev_app.py` | Lead + PWA | 构建管线 |
| `app/src/styles/base.css`、`app/src/app.js`、`app/src/core/{bus,store,ui,util}.js`、`app/src/ui/router.js`、`app/src/ui/screens/boot.js` | Lead | 壳层与基础组件 |
| `app/src/engine/engine.js`、`app/src/engine/balance.js` | engine-worker | 规则/数值/确定性 RNG |
| `app/src/data/cards.js`（生成）、`app/data/cards-meta.json` | Lead 生成 + content-worker 复核 | 题库 |
| `app/src/content/content.js` | content-worker | 三幕文案、2 个事件、6 结局、奖项 |
| `app/src/ui/screens/setup.js`、`settings.js` | ui-setup-worker | 向导/边界/设置 |
| `app/src/ui/screens/play.js` | ui-play-worker | 选卡/执行/加码/资源动效 |
| `app/src/ui/screens/journey.js`、`act.js`（幕转场）、`shop.js` | ui-journey-worker | 航程/幕/商店 |
| `app/src/ui/screens/finale.js`、`memory.js` | ui-meta-worker | 结局/海报/回忆册 |
| `app/src/ui/pwa.js`、`manifest.webmanifest`、`sw.js`、构建管线 | pwa-worker | PWA/离线/安装 |
| `qa/rebuild/*`、`reports/rebuild/*` | qa-worker | E2E 验收 |
| `app/src/core/audio.js`、`app/src/core/motion.js`、视觉打磨 | motion-worker | 音效/动效库/后期 |

## 8. 验收标准（QA worker 按此写测试）

1. **流程**：boot→setup→9 回合 quick 全流程→finale 可完成；classic/deep 长度正确；继续/存档恢复；再来一夜。
2. **规则**：手牌 3 张且类型不单一；星级 ≤ maxStar；换牌券/护身符/加码券消耗与效果正确；连击、星屑公式正确；加码星级+1 且完成收益×2；跳过重置 combo 且张力-1（≥0）；幕末事件只触发一次；自适应降星生效；提前安全词进入温柔结局且不扣数据。
3. **结局**：6 种结局在构造状态下均可达；奖项≥2；海报 canvas 可下载（playwright expect_download）。
4. **持久化**：刷新后继续；回忆册记录结局/资源/日期；导出/导入全部数据；清除数据回 boot。
5. **设置/安全**：maxStar 过滤生效（构造 200 抽验证 star<=maxStar、无禁用标签）；减少动效后无粒子和长动画；安全词长按 2s 生效；黑名单关键词不出现在手牌。
6. **质量**：390×844 / 360×640 / 430×932 / 1280×800 无横向滚动；三视口 0 pageerror / console error；首屏可交互 < 1.5s；离线 reload 可玩（PWA）；reduce 下轮盘类动效无死等（本版无轮盘，等价检查：卡牌翻面/资源动画降级）。
7. **可访问性**：所有按钮 ≥44px、aria-label 完整、焦点可见、色彩对比 ≥4.5:1（正文）。
8. **回归**：旧版 `index.html` 只有在本分支合并时才被替换；`app/` 构建产物与 `dist/rebuild` 一致。

## 9. 里程碑

- M1 壳层：构建管线 + boot + router + base.css + 空屏幕可跑。
- M2 引擎 + 题库 + 内容：脚本可跑通 9 回合（无 UI 美化）。
- M3 全套屏幕：setup/journey/play/act/shop/finale/memory/settings 可走通。
- M4 动效/音效/打磨/PWA。
- M5 QA 全绿 + 构建 index.html + 截图 + 文档 + PR。
