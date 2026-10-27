# V3 内容圣经 · 剧情 / 事件 / 结局 / 卡池复核

> 对应文件：`app/src/content/content.js`（内容唯一入口 `window.CONTENT`）与本文。
> 设计依据：`app/DESIGN.md` §0 世界观、§1.4 幕与结局判定、§2 屏幕、§3.2 数据结构、§8 验收。
> 本文件是给 Lead / engine / ui / QA 的内容契约与审查结论；改内容后请按文末「自测」复跑。

---

## 1. 一句话世界观

> 「今晚，你们登上一艘只在夜里出现的船。航线有三段：潮汐、暗涌、靠岸。
> 每一张卡，都是海面递来的一句话。你可以回答，也可以跳过——船会记得你们怎么选择。」

语气三条铁律：

1. **短句优先**。一句话里只放一个画面（灯、水面、风、舷窗、影子），不解释规则。
2. **克制**。情绪停在「差一点说出口」的位置，让卡牌正文去完成具体内容；剧情文案不替玩家抒情。
3. **不说教**。结局只写发生了什么，不总结道理、不给关系建议、不写「你们学会了……」式升华。

> 成人内容只来自旧题库原文；新写的幕/事件/结局文案全部为氛围叙事，不新增露骨内容。

---

## 2. 三幕语气示例

| 幕 | 名 | sub | accent | intro 语气样例 | 幕末 outtro 走向 |
|---|---|---|---|---|---|
| 1 | 潮汐 | 靠近之前，海面先亮了一下 | `#e9b872` 暖金 | 「船离岸时没有响。灯在水面碎成一片，又慢慢拼回去。」 | `good`：靠近了半步；`soft`：不急着追 |
| 2 | 暗涌 | 水面之下，有东西在动 | `#8d7cf6` 紫 | 「这片海没有底。你听见水流从船底过去，像有人在很远的地方说话。」 | `good`：知道彼此在哪；`soft`：把话留在水里，等它浮上来 |
| 3 | 靠岸 | 天亮之前，总得选一个岸 | `#6fd3c7` 青 | 「远处出现一线灰白。分不清是岸，还是天亮。」 | `good`：同时看见岸；`soft`：一起等天亮 |

写法提示：

- 第 1 幕允许「亮」：灯、风、甲板、外套，句子可以稍微暖。
- 第 2 幕压暗：熄灭的灯、看不见底的水、被按回去的话；句子更短、更少形容词。
- 第 3 幕收：灰白的天、变慢的船、很平的海面；禁止出现「总结陈词」。
- `intro` 与 `outtro.good/soft` 都是**字符串数组，一个元素一段**（UI 逐段渲染或 `join('')`，不要按字符遍历）。

---

## 3. 幕末事件设计

结构：`{ id, afterAct, title, text[], options[3] }`；每个选项
`{ id, label, effects:{heart|tension|sync|coins}, flag, outcome:['一句反馈'] }`。

- **一共 4 个**：`e1`(afterAct 1) / `e2`(afterAct 2) 是规范事件，**前两个位置不可调换**（引擎可能按 `afterAct` 过滤后取第一个，也可能按数组下标取）。
  `e1b`(afterAct 1) / `e2b`(afterAct 2) 是同幕备选，只有随机挑选型引擎才会用到，不影响规范流程。
- **每个事件 3 个选项，构成真取舍**，不是三条同向收益：
  - 靠近（heart↑）↔ 保留/等对方（sync 或 coins↑）↔ 轻处理（小幅多资源）。
  - 效果预算：单选项合计 ≤ 4 点，单项 +1/+2；事件是整局中 **sync 的主要来源之一**（见 §7.4）。
- `flag` 用短横线命名（`coat` / `let-wind` / `speak-first` …），引擎写入 `state.flags[flag]=true`，结局与奖项可读。
- `outcome` 固定 1 句，只写动作后的画面，不写评价。

| id | afterAct | 标题 | 三个选项（取舍） |
|---|---|---|---|
| `e1` | 1 | 甲板上的风 | 递外套（心+2 张+1）／站着等风（默+2 屑+2）／问「冷吗」（心+1 默+1） |
| `e2` | 2 | 水面下的名字 | 先说自己那句（心+2 张+2）／等对方先说（默+2 屑+2）／换个轻话题（张+1 默+1 屑+1） |
| `e1b` | 1 | 走廊的灯 | 让对方先过（心+2 屑+1）／挡在光里（张+2 心+1）／讲个笑话（默+2 张+1） |
| `e2b` | 2 | 岸上的灯 | 关一盏灯（张+2 心+1）／让灯亮着（默+2 屑+2）／指远处说以后（心+2 默+1） |

---

## 4. 结局判定表（数组顺序 = 优先级，取第一个 cond 为真的）

| # | id | 名称 | cond(r, s) | 构造命中 state | 备注 |
|---|---|---|---|---|---|
| 1 | `safe` | 海面下的拥抱 | `flags.safeWord` 为真 | `{heart:99,tension:99,sync:99,gentle:9,flags:{safeWord:true}}` | 安全词最高优先，任何资源下都温柔收尾 |
| 2 | `slow` | 慢一点，也很靠近 | `gentle>=3 && heart>=6` | `{gentle:3,heart:6}` | 跳过/缓一缓多的人 |
| 3 | `sync` | 同一个频率 | `sync>=12 && heart>=8` | `{sync:12,heart:8}` | Lead 2026-10-27 决策 15→12（见 §7.4） |
| 4 | `tension` | 不眠的暗涌 | `tension>=18` | `{tension:18,heart:3}` | 高张力路线 |
| 5 | `heart` | 天亮之前 | `heart>=14` | `{heart:14}` | 高心动路线 |
| 6 | `fallback` | 各自听见的海 | `true` | `{}` | 兜底，永远可命中 |

`cond` 的实现约定（content.js 内已做多形态兜底，engine 按 DESIGN 调用即可）：

- 签名 `cond(r, s)`；`r` = 资源视图（`heart/tension/sync/coins`，隐藏值 `gentle` 也在其中），`s` = 会话统计
  （`completes/skips/maxCombo/maxStarSeen/rounds`）。
- 兼容三种调用：`cond(resources, stats)`、`cond(state, stats)`、`cond(resources)`。
- 取值优先级：`r` → `s` → `r.resources`；`r` 若是整个 state，`s` 可缺省。
- `flags` 从 `r.flags` / `s.flags` / `r.safeWord` / `s.safeWord` 任一读取。

结局页额外字段：`name`、`accent`（强调色）、`text` 3 段、`quote` 1 句（≤16 字）。

---

## 5. 奖项（13 个，数组顺序 = 展示优先级；引擎过滤后取前 2–3 个）

| # | id | 名称 | icon | cond |
|---|---|---|---|---|
| 1 | `bravest` | 全场最勇 | 🔥 | `maxStarSeen>=5` |
| 2 | `starseeker` | 星海拾荒者 | 🪐 | `maxStarSeen>=4` |
| 3 | `combo-king` | 连击王 | 🔗 | `maxCombo>=5` |
| 4 | `same-wave` | 同频 | 🪢 | `sync>=8` |
| 5 | `high-tide` | 涨潮了 | 🌊 | `tension>=15` |
| 6 | `heart-collector` | 心动收藏家 | 💓 | `heart>=10` |
| 7 | `stardust` | 星屑富翁 | ✨ | `coins>=20` |
| 8 | `gentle-guard` | 温柔守护 | 🕊️ | `gentle>=3` |
| 9 | `silent` | 沉默是金 | 🤫 | `skips>=4` |
| 10 | `talker` | 话痨 | 💬 | `completes>=9` |
| 11 | `voyage` | 一路顺风 | ⛵ | `completes+skips>=1` 或 `rounds>=1` |
| 12 | `aboard` | 登船 | ⚓ | 恒真（保底） |
| 13 | `sea-listener` | 听海的人 | 🎧 | 恒真（保底） |

- 最后两枚恒真，保证**任何会话（含开局即安全词）奖项 ≥2**，满足 DESIGN §8.3。
- 统计字段命名在 award cond 里做了别名兜底（`maxStarSeen/maxStar/bestStar`、`completes/done`、`skips/skip`、`maxCombo`、`rounds/round`），engine 用 DESIGN 的字段名最稳。
- 阈值是按 DESIGN §1.2 收益公式估的：9 回合 quick 下 `completes≈9`、`coins≈20-27`、`heart/tension≈10-20`、`maxCombo≈3-6`；classic/deep 更容易触发前排奖项。

---

## 6. 卡池分布审查结论

数据来源：`app/src/data/cards.js`（1423 张）、`app/data/cards-meta.json`、`app/data/scores.json`（旧分类器 1728 条）。

### 6.1 规模 vs DESIGN 目标（§3.1）

| 池 | 实际 | DESIGN 目标 | 结论 |
|---|---|---|---|
| truth | 497 | 300+ | ✅ 充足（但见 §7.2 露骨卡打星偏低） |
| dare | 270 | 250+ | ✅ 达标 |
| touch | 288 | 120+ | ✅ 数量够，**星级偏斜严重**（star1 仅 14 / star5 104） |
| sync | 30 | 50+ | ❌ 缺口大；且 7 张是提问式（§7.5） |
| spark | 127 | 60+ | ✅ 数量够，**低星 19 张**与池定位冲突（§7.3） |
| punish | 211 | 150+ | ⚠️ 过剩；DESIGN §1.2 里 punish 只在「心跳赌注」事件出现，实际用量极低 |

### 6.2 星级分布（`cards-meta.json`）

| 池\星 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| truth | 124 | 167 | 84 | 74 | 48 |
| dare | 50 | 80 | 77 | 42 | 21 |
| touch | 14 | 65 | 49 | 56 | 104 |
| sync | 12 | 11 | 6 | 1 | 0 |
| spark | 0 | 2 | 17 | 27 | 81 |
| punish | 2 | 44 | 59 | 45 | 61 |

**maxStar 过滤后的实际可用池**（引擎 §1.5）：

| maxStar | truth | dare | touch | sync | spark |
|---|---|---|---|---|---|
| 1（温柔） | 124 | 50 | **14** | **12** | 0 |
| 2（暧昧） | 291 | 130 | 79 | 23 | 2 |
| 3（热烈） | 375 | 207 | 128 | 29 | 19 |
| 4（不设限） | 449 | 249 | 184 | 30 | 46 |

结论：**温柔档（maxStar=1）的 touch 14 / sync 12 过薄**，3 张手牌要求类型多样时很快重洗、感知重复；建议把部分 star2 的轻触卡降星（如 `t18` 帮脱外套、`t73` 摸手、`t77` 蒙眼喂水果）或补写 star1 touch/sync。

### 6.3 来源分布（top）

- truth：GAMEDATA 310 / V14_TRUTHS 100 / DRUNK_TRUTHS 30 / RANK_POOL 25 / flightM+F 32
- dare：GAMEDATA 181 / V14_DARE 44 / RANK_POOL 16 / flightF 15 / flightM 14
- touch：GAMEDATA 118 / PAIR_PARTS 57 / V14_DARE 56 / HOTEL 25 / BLIND_NIGHT 10 / KISS_POOL 10
- sync：flightD 16 / V11_WIND_DOWN 8 / V11_GENTLE_ALT 6（**只从 3 个温和来源挑，所以量少**）
- spark：V12_SPICY 40 / V14_SHOW 30 / V14_BOND 30 / V14_TOYS 27
- punish：V14_PUNISH 100 / GAMEDATA 99 / V12_SPICY 12

### 6.4 数据卫生

- 重复文本：**0**（去重成功）。
- `cards.js` 文本 100% 能在 `scores.json` 找到（1423/1423）。
- **跨池 id 碰撞 318 个**：`truth` 与 `touch` 都从 `t1` 起（288 个），`sync` 与 `spark` 都从 `s1` 起（30 个）。
  已核对 `engine.js`：它以 `pool + ':' + id` 作为手牌/当前卡/已用卡键（`__test.cardKey`），**运行时不会取错卡**；
  但仍是数据卫生问题（日志/调试/未来复用/任何假设 id 全局唯一的工具都会歧义）。**建议 make_cards.py 加池前缀**
  （`tr_`/`da_`/`to_`/`sy_`/`sp_`/`pu_`），与 engine 的 `pool:id` 双保险。
- tags 覆盖 **320/1423 = 22.5%**，只有 7 个标签（束缚/私密/露出/喝酒/蒙眼/道具/角色），
  设置里的「黑名单标签」过滤基本空转；建议补标签规则并回写 `cards-meta.json`。

### 6.5 旧分类器 `scores.json` 的可用性

- 1728 条里 `type` 有 **1389 条是 `other`（80.4%）**，`truth/dare/touch/sync/spark/punish` 总共不到 300 条；
  `lv` 分布严重偏低：lv1 952、lv2 601、lv3 117、lv4 36、lv5 22。
- 与 `cards.js` 的 star 对比：**1007/1423 不一致，且全部是「新星 > 旧 lv」，没有一条「新星 < 旧 lv」**。
- 结论：**旧 scores.json 只能当「下限参考」，不能当打星基准**。它既没有 6 池分类能力，也把大量露骨文本判成 lv1
  （例：`t12「你喜欢被口还是喜欢口对方？」`、`t14「你被对方顶到最深处的时候在想什么？」` 都是旧 lv1 / 新 star1）。
  建议 Lead 决定：要么弃用旧分数、以人工抽检 + 新关键词表为准；要么重跑一版带 6 池 label 的分类器并落库。

---

## 7. 打星问题清单与建议

### 7.1 分类器机制推断

新星与来源池高度相关（V14_SHOW/BOND/TOYS 的 spark 大量 5 星、V14_DARE→touch 的 56 张里 48 张 5 星），
但同一来源内部仍有大量错配 → 现在的 star 更像「关键词表命中 + 来源先验」的混合，**关键词表覆盖不足**。
旧 scores.json 的 lv 与内容严重脱节，不能用它校准。

### 7.2 露骨内容落在低星（最高优先级，影响尺度门禁）

- 用**严格露骨词表**（做爱/插入/高潮/口交/被口/口对方/自慰/内射/后入/叫床/呻吟/前戏/骑在/被绑/跳蛋/私处/下体…）筛：
  **42 张卡 star ≤2**（truth 28 / dare 10 / touch 4）。
- 用**宽表**（再加 弄/床/内衣/蒙眼/绑/羞/求/挑逗/撩…）：**92 张卡 star ≤2**（truth 56 / dare 22 / touch 14）。
- 代表卡：`t12` 被口/口对方 = star1；`t14` 顶到最深处 = star1；`d49` 女生用手把男生弄到快出来再停住 = star1；
  `d75/d99/d123` 骑在男生身上扭动 = star2；`d126` 轮流互相口对方 = star2；`t64` 舌吻到呼吸急促 = star2。
- 风险：设置 maxStar=1（温柔）/2（暧昧）的用户会在前几回合直接抽到这些卡 → 尺度分级失效。
- 建议：把 §7.2 命中的卡**至少升到 star4**（性行为细节升 5）；并在 make_cards.py 里加「露骨词强制 star≥4」的兜底规则。
  逐卡清单见 `app/data/cards-review.md` A 组。

### 7.3 spark 低星

- spark 定位 =「高星专属，只在 maxStar=4 或加码时出现」（DESIGN §1.2/§1.5）。
- 实际 spark 有 **star2 × 2、star3 × 17**（`s1`「最喜欢对方身体哪个部位想对它做什么」、`s2`「第一次有反应…」、
  `s3`「只裹浴巾去阳台」、`s11` 跳蛋、`s13-s17` 束缚/蒙眼…）。
- 风险：加码机制按「星级+1」升级，低星 spark 让「深潜」看起来没有更深；且 spark 池内部星级语义混乱。
- 建议：spark 全池统一 ≥4 星；`s1/s2` 移入 truth 并升 4；`s3-s19` 升 4（清单见 cards-review B 组）。

### 7.4 sync 池（与结局 3 的可达性直接相关）

- sync 只有 30 张，且 7 张是提问式（`s3-s9`），真正双人互动 23 张，star4 只有 1 张。
- 按 DESIGN §1.2：sync 卡收益 = 星级点数（共鸣 +2s → round(2s/2)=s），star1/2 卡只给 1-2 点；
  classic 14 回合里期望抽到 sync 卡约 2-3 张 → **+4~6 sync**，两次事件最多 +4 → 合计约 **8-10 sync**。
  原阈值 15 在正常流程不可达（构造状态可达、真实对局难）。
- **Lead 2026-10-27 决策（已落地）**：
  1. 结局 3 阈值 `sync>=15` → **`sync>=12`**（content.js 已改，DESIGN §1.4 由 Lead 同步）；
  2. spark 全池 ≥4 星 + 严格露骨词强制 star≥4（Lead 改 make_cards.py 重新生成 cards.js）；
  3. sync 池扩容到 60+（从旧版 dare/truth 里把「互相/一起/十指/对视/拥抱/牵手」类非露骨项重分类进 sync，不新写文本）。
- 12 分的可达性：扩池后 sync 卡期望 +6~9，两事件 +4~6 → 12 属于「需要刻意走协作路线」的目标，不再是死阈值；
  若后续 QA 实测 12 仍偏难，可按同一优先级只改 content.js 的这一个数字（无需动引擎）。

### 7.5 其他类型问题

- `sync.s3-s9` 是真心话问句 → 应归 truth（清单见 cards-review C 组）。
- `truth.t279`「描述你最想和对方尝试的性爱姿势」是命令句，是 truth 池唯一非问句 → 建议归 dare 并升星。
- `truth.t234`「你希望对方怎么惩罚不听话的你？」旧分类器判 punish，混在 truth 池语气不一致。
- `sync.s23` tags 含「露出」但文本是「喝温水发呆」→ 标签错误。
- `sync.s13` 是温柔安慰类，却给 +2 sync，强度与内容不匹配。

### 7.6 字段/标签修复建议（给 make_cards.py）

1. id 加池前缀（最高优先级，防引擎取错卡）。
2. 露骨词强制升星规则（见 §7.2）。
3. spark 生成时强制 `star = max(4, star)`。
4. tags 规则补齐：至少覆盖「喝酒 / 蒙眼 / 束缚 / 角色 / 露出 / 公开 / 疼痛 / 玩具 / 脏话 / 私密」，覆盖率目标 ≥80%。
5. 输出 `cards-meta.json` 时带上 `byTag` 与 `reviewQueue`（低置信卡列表），方便下轮人工复核。
6. 分类器输出 6 池 label + star + tags + confidence，旧 scores.json 标记 deprecated。

---

## 8. 建议人工复核的卡

完整逐卡清单（74 条，按 A/B/C/D 分组，含现星、建议星、文本、旧分、问题）见：

- `app/data/cards-review.md`

抽检中确认「打星合理」的正样本也列在文末 E 组，可用于校准规则（如 `t1`/`t2`/`d1` 星1、`t452` 星5、`t154` 星4）。

---

## 9. 接入注意（给 engine / ui）

1. **事件顺序**：`events[0]=e1(afterAct 1)`、`events[1]=e2(afterAct 2)` 是规范事件，不要按 id 排序或用后两个备选替换。
2. **结局顺序**：`endings` 数组顺序即优先级，`finish()` 取第一个 `cond` 为真的；不要自行按资源大小重排。
3. **安全词**：`Engine.safeWord()` 应直接走 `endings[0]`（或构造 `flags.safeWord` 后调用同一判定），保证最高优先级。
4. **outtro 是数组**：`acts[i].outtro.good/soft` 为段落数组；引擎返回 `actEnd` 事件时把数组透传给 UI，UI 逐段渲染。
5. **奖项**：`awards.filter(cond).slice(0,3)`；最后两枚恒真，保证 ≥2。若 engine 想按稀有度排序，建议按数组顺序保留。
6. **cond 调用形态**：按 DESIGN 传 `(resources, stats)` 即可；content 内部已兼容 `(state, stats)`。
7. **字数预算**：结局 + 事件文案合计 **914 字**（要求 ≤1400）；改文案时保持简洁。

---

## 10. 自测（改 content.js 后必跑）

```bash
# 语法
node --check app/src/content/content.js

# 结构 + 结局优先级 + 奖项 + 字数（node vm 加载，52 条断言）
node -e "const fs=require('fs'),vm=require('vm');const w={};vm.runInNewContext(fs.readFileSync('app/src/content/content.js','utf8'),{window:w});const C=w.CONTENT;console.log('acts',C.acts.length,'events',C.events.length,'endings',C.endings.length,'awards',C.awards.length);['safe','slow','sync','tension','heart','fallback'].forEach((id,i)=>{const e=C.endings[i];if(e.id!==id)throw new Error('order '+i)});console.log('OK');"
```

当前状态：**52 条断言全过**；6 个结局各自在构造 state 上可命中，且优先级（safe→slow→sync→tension→heart→fallback）验证通过。

另做过一次 **content × engine 契约自检（35 条断言全过）**：`Engine.newSession/actInfo/finish/safeWord/nextRound/chooseEvent/leaveAct` 实测——
actInfo 能拿到三幕 name/sub/accent/intro/outtro；6 结局经 `finish()` 全部命中且优先级正确；`safeWord()` 落到 `safe`；
奖项最多 3 枚且为 content 名称；第 1/2 幕末分别触发 `e1`/`e2`，选项 effects/flag 正确写入 state；结局+事件文案 914 字。

---

## 11. 变更记录

| 日期 | 变更 | 作者 |
|---|---|---|
| 2026-10-27 | 初版：3 幕 / 4 事件（2 规范 + 2 备选）/ 6 结局 / 13 奖项 / 卡池复核 | content-worker |
| 2026-10-27 | 结局 3「同一个频率」阈值 `sync>=15` → `sync>=12`（Lead 决策，提升真实对局可达性；DESIGN §1.4 同步） | content-worker |
