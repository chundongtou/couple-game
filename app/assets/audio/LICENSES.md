# 音频素材许可（V9 · audio9）

全部运行时素材均为**本地文件**，无外链、无第三方请求。

## 1. CC0 素材（Kenney）

| 素材包 | 作者 | 许可 | 来源 |
|---|---|---|---|
| Casino Audio (1.1) | Kenney Vleugels (Kenney.nl) | CC0 1.0 | https://kenney.nl/assets/casino-audio |
| Impact Sounds (1.0) | Kenney Vleugels (Kenney.nl) | CC0 1.0 | https://kenney.nl/assets/impact-sounds |
| Interface Sounds (1.0) | Kenney Vleugels (Kenney.nl) | CC0 1.0 | https://kenney.nl/assets/interface-sounds |
| RPG Audio | Kenney Vleugels (Kenney.nl) | CC0 1.0 | https://kenney.nl/assets/rpg-audio |

许可原文（随素材包 `License.txt`）：Creative Commons Zero (CC0) 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ 。CC0 不要求署名；此处署名出于礼敬。

### 具体使用的 CC0 原始文件

- Casino Audio (1.1)：`card-place-2.ogg`、`card-slide-3.ogg`、`card-slide-6.ogg`、`chips-stack-1.ogg`、`dice-shake-1.ogg`、`die-throw-1.ogg`
- Impact Sounds (1.0)：`impactPlate_heavy_002.ogg`、`impactSoft_medium_002.ogg`、`impactWood_heavy_001.ogg`、`impactWood_light_001.ogg`
- RPG Audio：`cloth3.ogg`
- Interface Sounds (1.0)：`bong_001.ogg`、`click_004.ogg`、`select_002.ogg`

加工方式：解码为单声道 → 重采样 22.05 kHz → 裁剪/包络/淡入淡出 → 与自制层混音 → 目标响度归一 → 16-bit 写盘。原始录音内容未改写语义，仅做剪辑与混音。

## 2. 自制素材

除上表 CC0 层外，其余成分（whoosh、钟片、和弦、环境底噪/音乐、纸/绒布/木共振等）均为本仓库自制：numpy 物理拟音（模态合成、时变滤波噪声、加法合成）+ 频域整数周期构造（环境无缝循环）。music 为 100% 自制：D 大调 4 小节钢琴/铺底/弦乐加法合成 + wrap 瞬态 + 循环卷积混响（生成脚本 `gen_music.py` 随素材目录存档）。自制部分版权归项目作者，随项目发布；不含任何第三方采样或外部链接。

## 3. 逐文件构成

| 文件 | 用途 | 许可 | CC0 层 | 自制层 |
|---|---|---|---|---|
| `amb-calm.wav` | 主桌环境底噪（8 s 无缝循环） | self-made (numpy physical synthesis) | — | 机舱嗡鸣：55/110/165/220/275/330/440 Hz 整数周期正弦 + 周期调相 + 慢速 AM；空调低隆隆 / 细嘶（irfft 周期噪声）；舷窗外远雨（900 Hz 以上噪声带 + 两条整数周期 LFO）；云海低频气流起伏 + 偶发细雨点（wrap 叠加）；极轻 Dm add9 pad（146.875/220.125/293.75/329.625/440.25 Hz） |
| `amb-win.wav` | win/ending 环境变体（4.5 s 无缝循环） | self-made (numpy physical synthesis) | — | D 大调 add9 pad（146.75/185/220/293.5/330/370 Hz）+ 玻璃泛音 1174/1479/1760 Hz；两下柔和铃（587.33 / 880 Hz，0.55 s / 2.55 s，wrap 叠加）；保留低隆隆/远雨（-33 dB，比 calm 更轻） |
| `mus-calm.wav` | 主桌舒缓纯音乐（13.52 s 无缝循环） | self-made (numpy additive synthesis) | — | D 大调 71 BPM 4 小节（Dmaj9-Bm7-Gmaj9-A7sus4）：8 泛音钢琴（非谐性 + 毡槌低频 + wrap 尾音）、4 声部铺底（频率量化 k/T + 周期交叉淡化）、慢颤音低音弦乐、2.8 s 暗色卷积混响；无鼓/无人声/无第三方采样 |
| `sfx-bear.wav` | 小熊出现 / 软绒互动 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `cloth3.ogg` | 绒布软吱（480→640 Hz 滑音 + 7 Hz 颤音，1.8 kHz 低通） |
| `sfx-capture.wav` | 击落（重木撞 + 低频冲击） | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `impactWood_heavy_001.ogg` | 58 Hz 冲击（ratio 1/1.58/2.6）+ 软限幅 |
| `sfx-card.wav` | 题卡滑出 + 落卡 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `card-slide-3.ogg`、`card-place-2.ogg` | — |
| `sfx-chime.wav` | 收尾钟片 / 提示 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `bong_001.ogg` | 880 Hz 加法钟：六条泛音 1/2/2.76/4.07/5.43/8.0，各自衰减 + 0.55 s 混响 |
| `sfx-dice-land.wav` | 骰子落定（桌面撞击 + 低频 + 二次轻弹） | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `die-throw-1.ogg` | 74 Hz 衰减 boom（ratio 1/1.63/2.4）+ 520 Hz 桌面 tick ×2 |
| `sfx-dice-shake.wav` | 掷骰滚动（3 变体由播放率/声像随机化产生） | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `dice-shake-1.ogg` | 木杯/桌面模态共振（420/380/460/330 Hz 四击）+ 低频体感 + 短混响 |
| `sfx-fly.wav` | 飞行（更长 whoosh + 纸张气流） | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `card-slide-6.ogg` | 时变带通 whoosh（600→4200→1200 Hz）+ 220→620 Hz 体感 |
| `sfx-hop.wav` | 走一格 / 轻放棋子 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `impactWood_light_001.ogg` | 纸/绒布轻擦噪声（2.2 kHz 高通 + 30 ms） |
| `sfx-stack.wav` | 叠机 / 收拢 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `chips-stack-1.ogg` | 700/880/620 Hz 纸片轻放三击 |
| `sfx-stamp.wav` | 盖章 / 收尾确认 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `impactPlate_heavy_002.ogg` | 纸拍瞬态（1.2 kHz 高通 + 6 ms 衰减） |
| `sfx-takeoff.wav` | 起飞（气流 whoosh + 软落地） | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `impactSoft_medium_002.ogg` | 时变带通 whoosh（500→3400→1500 Hz）+ 170→430 Hz 气流体感 |
| `sfx-ui-select.wav` | UI 选择 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `select_002.ogg` | 520 Hz 轻木尾（ratio 1/2.1/3.3） |
| `sfx-ui-tap.wav` | UI 轻触 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `click_004.ogg` | 640 Hz 木尾（ratio 1/2.3/3.7） |
| `sfx-win.wav` | 胜利 / 收尾和弦 | CC0 1.0 (Kenney layers) + self-made (numpy physical synthesis) | `bong_001.ogg` | D-F#-A-D-E 柔槌琶音（293.66/369.99/440/587.33/739.99 Hz）+ 146.83/220 Hz 铺底 + 0.7 s 混响 |

体积：SFX 287706 B / 307200 B（93.7%）；环境 551338 B / 614400 B（89.7%）；music 596332 B / 614400 B（97.1%）。
