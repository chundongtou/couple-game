# V17 扩展包验收报告（D2）

> 被测物：`v17` 分支 `d6eb8d2` 的集成产物（4 个 feature：`10-moqi.js` / `20-memory.js` / `30-pwa.js` / `40-shellfix.js`）。
> **结论：全部通过。147/147 检查 PASS，0 个 P0/P1/P2 遗留失败，0 个应用级 pageerror / console error / HTTP 4xx。**
> 验收脚本：`qa/test_v17.py`（可复跑）；原始数据：`reports/v17-qa-data.json`；回归冒烟：`reports/v17-smoke.json`；截图：`reports/screenshots/v17/`（40 张）。

---

## 1. 测试环境与被测物

| 项 | 值 |
|---|---|
| 仓库 / 分支 | `couple-game` / `v17`，HEAD = **`d6eb8d2`**（"V17 修复: 安装胶囊置顶改为 DOMContentLoaded 后包装 + MutationObserver 兜底"） |
| 被测产物 | `python tools/build.py --out qa/_v17_build` 生成的全量产物；`index.html` 851 KB（gzip 249 KB） |
| **产物一致性** | 测试目录 `qa/_v17_build/index.html` SHA256 = **`C45AF281D2A64489…5D0C`** = 当前 `dist/index.html`（`meta.same_as_dist=true`）→ **QA 测的就是 Lead 交付的 dist** |
| 构建内容 | 4 features：`10-moqi.js`(49,677B) / `20-memory.js`(35,773B) / `30-pwa.js`(14,756B) / `40-shellfix.js`(4,393B)；静态资产 `manifest.webmanifest`(740B)、`sw.js`(4,631B)、`icons/` 5 张 PNG |
| 运行方式 | `qa/harness.py` 禁缓存静态服务（127.0.0.1:8801，http:// 同源）；Playwright Chromium headless |
| 环境 | Python 3.11.9、Playwright 1.59、Chromium；locale=zh-CN、timezone=Asia/Shanghai、color_scheme=dark |
| 视口 | 390×844（默认，is_mobile+has_touch+dsf3）、360×640、1280×800（桌面，dsf1） |
| 主题 | dark / light / sketch |

**种子数据与隔离策略**（与 D1 基线一致，便于对比）：
- 每个分组（A–E）与每个视口/场景都新建 `browser.new_context()`，localStorage 天然干净，组间零污染。
- 默认 `seed=True`：`context.add_init_script` 在页面脚本前写入 `couple-onboarded=1` + `couple-night={d:今天}`，抑制开场「夜间开场/新手引导」弹窗（D1 已单独验收过这两个弹窗，V17 未改动该逻辑）。
- 数据类场景使用的种子：`logEvent/v12TaskDone/coinAdd/heatUp` 造本晚数据；`couple-moqi` 坏 JSON / `couple-memories` 坏 JSON 用手工写入；导入测试用真实导出的备份文件 + 自造坏文件/脏文件/裸键值文件（均在 `qa/_v17_tmp/`）。
- 不启用无痕/极限模式（无痕提示单独用例开启后关闭）；全程不联网。

---

## 2. 汇总

| 分组 | 内容 | checks | 结果 |
|---|---|---|---|
| A | 功能 A · 默契大考验（心有灵犀 / 你说我猜） | 52 | **52 PASS** |
| B | 功能 B · 回忆册 + 数据备份 | 37 | **37 PASS** |
| C | 功能 C · PWA 离线安装 | 24 | **24 PASS** |
| D | 回归：29 个旧玩法 + 关键弹窗 + D1 修复复核 + ES5 | 15 | **15 PASS** |
| E | 横切：三主题 / 三视口 / 兼容性 | 19 | **19 PASS** |
| **合计** | | **147** | **147 PASS / 0 FAIL** |

- `console_agg`：应用级 console error = **0**、资源级 console error = **0**、HTTP 4xx = **0**、pageerror = **0**（覆盖 5 个分组所有 context）。
- 所有需要原生 `confirm/prompt` 的流程（提前结束、改备注、删除、导入确认）均通过 `page.once('dialog')` 真实接受/取消并校验了副作用。
- 下载类（回忆册导出）通过 `page.expect_download()` 真实落盘后解析 JSON。

---

## 3. 功能 A · 默契大考验（SPECS A 逐条）

### 3.1 入口 / 注册 / 帮助
| 验收项（SPECS） | 结果 | 证据（`reports/v17-qa-data.json` → `A` / checks `A1*..A4`） |
|---|---|---|
| 首页主角区第 5 张卡 + `.v12-tiles` 追加 | **PASS** | 首页共 6 张主角卡：`今夜地图/主题之夜/飞行棋/剧本之夜/默契大考验(data-t=moqi-hero-card)/回忆册`；A1b/A1c |
| `GAMES` 条目（进「全部玩法」网格） | **PASS** | `GAMES` 共 30 项含 `moqi`；网格卡 `data-t=moqi-grid-card` 真实点击进入入口页（A3/A3b）；网格共 19 张卡（18 旧 + 默契） |
| 两处入口都进入「入口页」 | **PASS** | 主角卡点击后 `#gContent [data-t=moqi-entry]` 渲染；入口含 2 个玩法大卡 + 默契档案 4 格 + 规则折叠 |
| `?` 帮助显示 `RULES.moqi` | **PASS** | `showRules('moqi')` 弹窗含「心有灵犀 / 你说我猜」文案且 `RULES.moqi` 已注册（A4） |

截图：`reports/screenshots/v17/moqi/entry-390x844.png`、`moqi/help-390x844.png`

### 3.2 心有灵犀（`heart`）
| 验收项 | 结果 | 证据 |
|---|---|---|
| 题数 5/8/10（默认 8） | **PASS** | 首次进入 setup 选中 `moqi-rounds-8`（A2c）；三档均可点选并高亮（A8） |
| 5 题完整对局，命中/默契度一致 | **PASS** | 设计命中 3/5 → 结算 `60%`、`命中 3 / 5 题`、`3 命中 2 未中 60%`；亲密币 +3（A5/A5c） |
| 8 题完整对局（100% 段位） | **PASS** | 全中 → `100%`、`🔥 灵魂伴侣`、亲密币 +8（A6） |
| 10 题完整对局（0% 段位） | **PASS** | 全错 → `0%`、`🌱 还需要多聊聊`、亲密币 +0（A7） |
| **四档段位边界全覆盖** | **PASS** | 0%→🌱（A7）、40%→🌱（A7e）、60%→🌤️渐入佳境（A5）、80%→💞心有灵犀（A7d）、100%→🔥灵魂伴侣（A6） |
| 两人角色交替 + 姓名显示正确 | **PASS** | 实测 5 题轮次文本依次为「现在由 **他** 亲口选择（**她** 先别看屏幕）」→ 第 2 题「**她**…（**他**…）」交替（A5b，`A.heart5.turn_full`） |
| 结算数字/按钮 | **PASS** | 结算栏 `命中 / 未中 / 默契度` 与 hits/total 一致；「🔁 再来一轮」可开新一轮（A6b）；「🏠 返回大厅」可用（A11f 同组件）；「🎲 换题」存在 |
| 计分与上报 | **PASS** | 结算 `coinAdd(hits)`（A5c/A7d）、`heatUp()` + 本晚战报 tasks 增加（A5d）、`logEvent` 写入本局记录（A5f）、写入档案（A5e） |
| 档案读写与刷新持久化 | **PASS** | 入口「默契档案」显示 `最高默契度 100% / 累计 3 局`（A7c）；刷新页面后 `couple-moqi` 数据未变且档案仍显示 heart.best（A15d） |

截图：`moqi/heart-setup-390x844.png`、`moqi/heart-result-5-390x844.png`、`moqi/heart-result-8-390x844.png`、`moqi/heart-result-80-390x844.png`

### 3.3 你说我猜（`guess`）
| 验收项 | 结果 | 证据 |
|---|---|---|
| 时长 60/90/120（默认 60）、描述人可选 | **PASS** | 默认选中 60 秒；选 90 秒 + 她描述后开局 `_v17Moqi.total=90, describer='her'`（A10/A10b） |
| 进行中：大字号词卡 + 倒计时 | **PASS** | `词卡「摩天轮」`、`90` 秒倒计时（A10c）；截图 `moqi/guess-play-390x844.png`（词卡 ≥28px 见截图） |
| 猜对/跳过计数正确 | **PASS** | 13 次猜对 + 2 次跳过 → 计数 13/2、结算页 13/2（A11/A11c） |
| 提前结束需确认 | **PASS** | 点击「🔚 换人/结束」弹原生 `confirm`，接受后正常结算（A11b） |
| 计时结束自动结算 | **PASS** | 加速剩余时间后（leftMs=900）无点击自动进入 `guess-result`，`ended=true`、timer 已清理（A12/A12b） |
| 评级四档 | **PASS** | 13 个→🏆天生一对（A11c）、8 个→💞心有灵犀（A11h-8）、5 个→🌤️渐入佳境（A11h-5）、0 个→🌱慢慢来（补充探针：0 命中提前结束 → `🌱 慢慢来` + 亲密币 +0，非 147 项 check 内容） |
| 计分 `coinAdd(min(hits,12))` | **PASS** | 13 命中 → 亲密币 +12（A11d）；8 命中 → +8、5 命中 → +5（A11h） |
| 结算按钮 | **PASS** | 「🔁 换人再来」开启新一轮并交换描述人 him→her（A11g）；「🏠 返回大厅」回首页（A11f） |
| 词库 ≥80 且用尽前不重复 | **PASS** | 实测连续 80 个词无重复（A15）；词长 2–7 字（A15b）；**静态源码核对：`WORDS` 110 个、全部唯一、长度 2–5 字** |
| 计时器清理（回大厅/重置/切玩法/再进入） | **PASS** | 回大厅 `_v17Moqi=null`（A13）；再进入回到入口页无残留（A13b）；切到其它玩法自动清理且目标玩法正常（A13c）；「重置本局」→ 入口页（A13d/A9b） |
| 切后台暂停/回前台恢复 | **PASS** | `visibilitychange`→`paused=true`、toast「⏸ 计时已暂停」、900ms 后秒数不变；回前台 `paused=false`（A14/A14b） |

截图：`moqi/guess-setup-390x844.png`、`moqi/guess-play-390x844.png`、`moqi/guess-result-390x844.png`

### 3.4 存档 / 容错 / 选择器
| 验收项 | 结果 | 证据 |
|---|---|---|
| `couple-moqi` 结构（v/plays/heart/guess/lastAt） | **PASS** | 写入后为 `{"v":1,…,"heart":{"best","last","plays","rounds","hits"},"guess":{…},"lastAt":"2026-10-25","lm":…}`（A5e/A11e） |
| 坏数据回退默认值、不崩 | **PASS** | `couple-moqi="{bad json"` → 入口正常、档案回到 `0%`、无 pageerror（A16） |
| 题库 ≥45 道 × 4 选项、与既有 GAMEDATA 不重复 | **PASS**（静态核对） | `QS` **50 道**、**每道恰好 4 个选项**（正则逐块核对 `{4}`）；与 `GAMEDATA` 字符串集合比对 **0 重叠**；与 `WORDS` 比对 0 重叠 |
| `data-t` 选择器清单 | **PASS** | SPEC 要求的 17 个全部出现（A17）：`moqi-hero-card/moqi-mode-heart/moqi-mode-guess/moqi-start/moqi-opt-0..3/moqi-next/moqi-result/moqi-replay/moqi-home/guess-word/guess-hit/guess-skip/guess-timer/guess-result` |
| 三主题可读、无横向滚动 | **PASS** | light 主题心有灵犀对局渲染且 `scrollWidth-innerWidth=0`（A18）；三主题入口均渲染（E1b-*）；截图 `theme/moqi-heart-light-390x844.png`、`theme/moqi-entry-sketch-390x844.png` |

---

## 4. 功能 B · 回忆册 + 数据备份（SPECS B 逐条）

| 验收项（SPECS） | 结果 | 证据（`B` / checks `B*`） |
|---|---|---|
| 首页第 6 张卡 `📖 回忆册`（data-t=mem-tile）打开全屏抽屉 | **PASS** | 6 张主角卡中最后一张为 mem-tile；点击后 `#v17MemSheet.on`、`body.overflow=hidden`（B1/B1b） |
| 抽屉 UI：统计条 4 格 + 「时间线/数据备份」两 Tab + 右上关闭 | **PASS** | 4 格统计（共 N 晚 / 累计任务 / 最高温度 / 陪伴天数）+ 两 tab + 可见关闭按钮（B2）；tab 双向切换（B2c） |
| 关闭/滚动锁恢复 | **PASS** | 关闭后 `.on` 移除、`body.style.overflow` 恢复为空（B2d）；Escape 键关闭逻辑在源码内（未单独触发，见限制） |
| 打开「本晚战报」后自动记录今天一条 | **PASS** | `showPartyReport()` 后 `couple-memories.list` 出现今日一条（B3）；时间线渲染 1 条且带「今晚」徽章（B3e/B3f） |
| 数字与战报一致 | **PASS** | 回忆 `tasks/heat/kisses/games` 与 `couple-party`/`getHeat()` 一致（B3b） |
| 同日重复打开不重复新增（upsert） | **PASS** | 再次打开战报后 list 长度仍为 1（B3d） |
| 跨功能：默契度进回忆册 | **PASS** | `couple-moqi.lastAt=今天 & heart.last>0` → 回忆条目 `moqi=60`（B3c） |
| 详情展开：亲吻/喝酒/默契度/游戏明细 | **PASS** | 点条目展开 `mem-detail`，含「改备注/删除」与数据 chips（B4） |
| 改备注（`prompt`，≤40 字） | **PASS** | 原生 prompt 接受「今晚笑到肚子疼 😂」→ localStorage `note` 与 UI 同步（B4b） |
| 删除（`confirm`）+ 取消 | **PASS** | 取消：数据保留（B4c）；确认：记录消失、统计条更新为 0 晚、空状态出现（B4d） |
| 统计条随数据变化 | **PASS** | 1 条时「共 1 晚/累计任务 1」；删除后「0 晚」（B3g/B4d） |
| 多日记录按日期倒序（今天在前） | **PASS** | 注入昨日+今日两条 → 顺序 `[today, yesterday]`，今天带「今晚」（B5） |
| 导出：真实下载 + 文件名含日期 + 合法 JSON | **PASS** | `expect_download` 得到 `情侣升温游戏备份-2026-10-25.json`；内容 `{app:'couple-game', v:17, exportedAt:ISO, data:{…}}`（B6/B6b） |
| 备份含 ≥5 个 `couple-*` 键 | **PASS** | 实际导出 **15** 个 `couple-*` 键（B6c）；备份页显示「已保存 N 项数据 · 约 X KB」（B6d） |
| 导入回滚：改值 → 导入旧备份 → 刷新恢复 | **PASS** | 先把 `couple-heat` 改成 99、删除 `couple-coins` → 导入刚才的备份 → confirm 文案含「将恢复 15 项数据/备份时间」→ 自动 reload → heat/coins 恢复原值（B7/B7b/B7c） |
| 坏文件容错 | **PASS** | 导入 `{oops not json` → toast「备份文件格式不对」、无 confirm、现有数据不变（B8） |
| 安全：非法键名忽略、只写 `couple-*` | **PASS** | 注入 `evil-key` / `couple-bad key` → 未写入；合法 `couple-heat` 写入成功（B8b） |
| 兼容裸键值对象（无外层包装） | **PASS** | 导入 `{"couple-heat":"{…v:7}"}` 成功恢复（B8c） |
| 空数据状态 / 坏 `couple-memories` 不崩 | **PASS** | 空册显示「还没有记录…」；坏 JSON 时回退空册、无 pageerror（B2b/B9） |
| 上限 200 条 | **PASS** | 写入 205 条 → 抽屉显示「200 晚」（B9b） |
| 无痕模式提示 + 导出仍可用 | **PASS** | `SET.incognito=true` 时抽屉显示提示，导出下载仍成功（B10） |
| `data-t` 清单 | **PASS** | SPEC 要求 10 个全部出现（B12）：`mem-tile/mem-sheet/mem-tab-timeline/mem-tab-backup/mem-export/mem-import/mem-file/mem-item/mem-stats/mem-close` |
| 三主题适配、移动端不横向溢出 | **PASS** | dark/light/sketch 抽屉 `scrollWidth-clientWidth=0`（B11-*）；截图 `theme/memory-*.png` |

---

## 5. 功能 C · PWA / 离线安装（SPECS C 逐条）

| 验收项（SPECS） | 结果 | 证据（`C` / checks `C*`） |
|---|---|---|
| `manifest.webmanifest` 合法、字段齐全 | **PASS** | HTTP 200、`content-type: application/manifest+json`、JSON 可解析；`name/short_name/start_url/scope/display=standalone/orientation=portrait` 与 SPECS 一致、3 个 icons（C1/C1b） |
| icons 路径 200 且尺寸正确 | **PASS** | `icon-192.png`=192×192、`icon-512.png`=512×512、`icon-maskable-512.png`=512×512（HTTP 200 + PNG IHDR 校验）（C1c） |
| `theme-color` 生效 | **PASS** | `<meta name="theme-color" content="#6c2bd9">`（C1d） |
| 分享资源 | **PASS** | `apple-touch-icon.png` 180×180、`og-image.png` **1200×630**；og/apple-touch-icon 均声明（C7/C1d） |
| `sw.js` 策略符合 SPECS | **PASS** | `CACHE='couple-game-v17-1'`、预缓存 `./`+index+manifest+192/512 图标、`install/activate/fetch` 齐全、导航 network-first + 离线回退 index（C2，静态核对） |
| SW 注册成功、无 console 报错 | **PASS** | `navigator.serviceWorker.ready` 有值（scope=同源根、active=activated）；`getRegistration()` 返回 active；（C3） |
| 页被 SW 接管、缓存写入 | **PASS** | `navigator.serviceWorker.controller` 非空；`caches.keys()=['couple-game-v17-1']`，预缓存 **5** 项（C3b/C3c） |
| **离线 reload 可玩** | **PASS** | `context.set_offline(True)` → `page.reload()` 成功进入首页（6 张主角卡）→ 能开一局 `truth`；离线 toast「📴 已离线，游戏仍可玩」；恢复联网后 reload 正常（C4/C4b/C4c/C4d/C4e） |
| 离线无 JS error | **PASS** | 离线场景 pageerrors=[]、应用级 console=[]（资源级网络错误过滤）（C4d） |
| 设置条出现「📲 装到桌面」 | **PASS** | `#setBar [data-t=pwa-install-pill]` 存在且唯一，文案「📲 装到桌面」（C5） |
| 胶囊幂等 / 置顶可发现 | **PASS** | `renderSettings()` 连续重渲染仍只有 1 个（C5b）；**胶囊位于 `#setBar` 第一位**，390 宽下 rect x=18、无需横滑即可见（C5f）；`goHome` 后仍置顶（D6） |
| 点击胶囊有安装弹窗 | **PASS** | headless 无 `beforeinstallprompt` → 走「查看安装方法」弹窗，含 3 步平台说明 + 「👍 知道了」按钮（C5c）；点击后关闭且无 error（C5d）；`v17PwaState()` 可读（C5e） |
| `file://` 打开无报错、SW 静默跳过 | **PASS** | `file:///…/index.html` 首页正常（6 tiles）、pageerrors=[]；`v17PwaState().protocol='file:'` 且 `hasRegistration=false/hasController=false`；安装胶囊仍存在（C6/C6b/C6c） |
| `data-t` 清单 | **PASS** | `pwa-install-pill/pwa-install-modal/pwa-install-action` 全部出现（C8） |

截图：`pwa/home-sw-ready-390x844.png`、`pwa/offline-home-390x844.png`、`pwa/install-modal-390x844.png`、`pwa/file-protocol-390x844.png`、`pwa/pill-first-390x844.png`

---

## 6. 回归（D 组）

| 项目 | 结果 | 证据 |
|---|---|---|
| `GAMES` = 30 项，原 29 个 id 全部保留 | **PASS** | D1；`reports/v17-smoke.json` |
| **29/29 旧玩法逐个 `startGame()` 渲染、0 新增 pageerror / console error** | **PASS** | D2（逐项见 `v17-smoke.json → old_games`：29/29 ok=true，`console_app=[]`、`http_4xx=[]`） |
| 与 V16 基线对比无渲染内容退化（`#gContent` kids） | **PASS** | D2b（对比 `reports/baseline-audit-data.json → games.items`）；截图 `regression/home-390x844.png` |
| 旧关键弹窗（本晚战报/商店/帮助/难度/夜终仪式）0 新增 error | **PASS** | D3 |
| 首页「全部玩法」网格 19 张卡（18 旧 + 默契） | **PASS** | D3b；截图 `regression/home-more-390x844.png` |
| **D1 P1 修复复核：本局记录入口** | **PASS** | 三视口（390×844/360×640/1280×800）`.ctrl-log-toggle` 均 `#ctrlBar.contains=true`、在视口内且点击能打开侧栏；实测 390 页 rect top=710（D5-*/D5c）；截图 `regression/shellfix-log-390x844.png` |
| **D1 P2 修复复核：念题「重听」浮标** | **PASS** | 三视口 `#ctrlVoiceBtn` 在 `#ctrlBar` 内且视口内可见（D5b-*） |
| **P2 修复复核：安装胶囊置顶** | **PASS** | `#setBar` 第一位 = pwa-install-pill，首屏无需横滑（D6） |
| **P2-5 修复复核：ES5 语法** | **PASS** | 去注释后静态扫描 `index.html` 与 4 个 feature：无 `?.` / `??` / `=>` / 模板字符串 / `let/const`（D7 + E3） |
| 回归冒烟输出 | **PASS** | `reports/v17-smoke.json`（`ok=true`、`build_sha256` 与被测产物一致） |

**D2 过程中发现并已修复的问题（1 个，已复验）**：
- **P1（临时）· 安装胶囊置顶在 `goHome()` 后失效**：首屏 `#setBar` 首位是 pill，但任意一次 `renderSettings()` 重渲染后（`goHome`/切主题都会）pill 回到 22 项横滑条最右端（`left=1838`，首屏不可见）。根因：`40-shellfix.js` 的 `renderSettings` 包装在解析期执行、而 `30-pwa.js` 在 DOMContentLoaded 包装 → pwa 成为外层，重渲染时先 append 再被内层置顶逻辑错过。
- 已上报 Lead，修复提交 **`d6eb8d2`**（包装移入 init + MutationObserver 兜底）；本轮复验：`C5f`/`D6`/`goHome()` 后均 **PASS**（三视口、连续 renderSettings、切主题后仍置顶）。

---

## 7. 横切（E 组）

| 项目 | 结果 | 证据 |
|---|---|---|
| 三主题首页（6 主角卡、无横向溢出） | **PASS** | E1-dark/light/sketch；截图 `theme/home-{dark,light,sketch}-390x844.png` |
| 三主题下新功能入口渲染 | **PASS** | E1b-*；moqi 入口 sketch 截图 `theme/moqi-entry-sketch-390x844.png` |
| 三主题切换无 pageerror/console error | **PASS** | E1c |
| 三视口：首页 6 主角卡 + 无横向溢出 | **PASS** | E2-{390x844,360x640,1280x800}；截图 `viewport/home-*.png` |
| 三视口：心有灵犀对局渲染 + 无横向溢出 | **PASS** | E2b-*；截图 `viewport/moqi-heart-*.png` |
| 三视口：回忆册抽屉无横向溢出 | **PASS** | E2c-*；截图 `viewport/memory-*.png` |
| ES5 兼容（4 feature + 集成 index.html） | **PASS** | E3（去注释扫描 0 命中）；`E.es5_scan` |
| 集成产物首屏 0 pageerror / 0 应用级 console error / 0 4xx | **PASS** | E3b/E3c |

---

## 8. D1 遗留项（S7）结论（按 Lead 要求写入）

D1 报告中 S7 曾出现 `Error: Missing catch or finally after try` 与「已开局未引导却弹夜间开场」两条失败：

- **结论：均为 QA 测试脚本缺陷，不是产品 bug，已修复且不计入缺陷。**
- 原因：S7 的 `context.add_init_script` 字符串拼接漏写 `catch`（`"try{localStorage.setItem(...);}"`），浏览器执行注入脚本时抛 SyntaxError → `couple-night` 未写入 → 应用按设计弹「🌙 今晚开场」；该 SyntaxError 被 `page.on('pageerror')` 记录。应用主脚本无语法错误（若主脚本报错首屏全崩，而 S0/S1/S6 全通过）。
- 修复后证据（D1 最终 clean run）：`s7_console.pageerrors=[]`，S7 5/5 PASS；`first_run.onboard` 场景确认「预置在 `page.goto()` 之前、经 `context.add_init_script`」时正确弹「💋 欢迎来到情侣升温游戏」并写入 `couple-onboarded=1`。
- **V17 验收中原生开场弹窗逻辑未被 feature 修改**（D2 的 A–E 组也使用 seed 抑制弹窗，未复用该失败路径）。

---

## 9. 已知限制 / 未覆盖项（不影响本次结论）

1. **PWA 原生安装路径**：headless Chromium 不触发 `beforeinstallprompt`，因此「原生安装弹窗 → userChoice」分支未实测；已验证无 deferred 时的说明弹窗、`v17PwaState()`、`appinstalled` 监听代码与 toast（静态）。真机安装需人工一次。
2. **SW 新版本提示**（`updatefound/statechange` → 「✨ 新版本已就绪」）无法在单次 headless 会话内构造版本升级，未实测；`sw.js` 版本清理逻辑已静态核对。
3. **Lighthouse**：未跑（SPECS 注明非硬要求）；已用等价项人工核对：manifest 合法 + SW active + 192/512/maskable 图标 200 + theme-color。
4. **`og:image` 线上可访问性**：`https://chundongtou.github.io/…/icons/og-image.png` 需部署后验证；本地已确认文件存在、1200×630、meta 正确。
5. **iOS/Android 真机**：未覆盖（环境限制）；已覆盖 Chromium 移动仿真 390×844 / 360×640。
6. 心有灵犀题库/词库计数为**静态源码核对**（feature 内部变量未挂 window）；运行期验证为抽样（50 道题实际渲染并玩到 33 道；110 个词中 A15 连续收集 80 个均唯一，其余轮次另有抽样）。
7. 回忆册「Escape 关闭」仅源码确认，未单独按键触发（关闭按钮/滚动锁已实测）。

---

## 10. 证据截图索引（`reports/screenshots/v17/`，共 40 张）

| 类别 | 截图 |
|---|---|
| 默契·入口/帮助 | `moqi/entry-390x844.png`、`moqi/help-390x844.png` |
| 默契·心有灵犀 | `moqi/heart-setup-390x844.png`、`moqi/heart-result-5-390x844.png`、`moqi/heart-result-8-390x844.png`、`moqi/heart-result-80-390x844.png` |
| 默契·你说我猜 | `moqi/guess-setup-390x844.png`、`moqi/guess-play-390x844.png`、`moqi/guess-result-390x844.png` |
| 回忆册 | `memory/sheet-empty-390x844.png`、`memory/timeline-1-390x844.png`、`memory/backup-empty-390x844.png`、`memory/backup-export-390x844.png`、`memory/incognito-390x844.png` |
| PWA | `pwa/home-sw-ready-390x844.png`、`pwa/offline-home-390x844.png`、`pwa/install-modal-390x844.png`、`pwa/file-protocol-390x844.png`、`pwa/pill-first-390x844.png` |
| 三主题 | `theme/home-{dark,light,sketch}-390x844.png`、`theme/moqi-entry-sketch-390x844.png`、`theme/moqi-heart-light-390x844.png`、`theme/memory-{dark,light,sketch}-390x844.png` |
| 三视口 | `viewport/home-*`、`viewport/moqi-heart-*`、`viewport/memory-*`（390x844/360x640/1280x800） |
| 回归 / D1 修复 | `regression/home-390x844.png`、`regression/home-more-390x844.png`、`regression/truth-game-390x844.png`、`regression/shellfix-log-390x844.png` |

---

## 11. 复现命令与产物

```powershell
cd couple-game
# 1) 从当前源码构建 QA 专用产物（与 dist/ 做 SHA256 对照）
python tools/build.py --out qa/_v17_build
# 2) 全量 D2（约 3.2 分钟；输出 147 项 checks / 40 张截图 / 回归冒烟）
python qa/test_v17.py
# 3) 分组复跑
python qa/test_v17.py --only a      # 默契
python qa/test_v17.py --only b      # 回忆册/备份
python qa/test_v17.py --only c,d    # PWA + 回归
python qa/test_v17.py --only e      # 主题/视口/ES5
```

产物：
- `reports/v17-qa-data.json` — 147 项 checks + 全部证据数据（`meta.tested_build_sha256 == meta.dist_sha256`）
- `reports/v17-smoke.json` — 29 个旧玩法逐项冒烟 + 0 新增 error
- `reports/screenshots/v17/**/*.png` — 40 张证据截图
- `qa/test_v17.py` — 可复跑验收脚本（约 1,900 行）
