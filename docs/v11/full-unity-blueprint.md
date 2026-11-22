# V11 · Full Unity 双人电影感飞行棋（全量蓝图）

> 目标：不是垂直切片。一次把完整产品所需的系统、场景、内容结构全部搭起来，之后在同一个骨架上持续补内容/打磨。
> 注意：这里的“3A”指**呈现规格**（镜头、光照、音频、动画、UI 质感），不是 3A 团队/开放世界体量。

## 1. 产品定位

- 类型：第三人称电影感双人合作桌游 + 短小游戏合集
- 平台：Web/PWA 优先，iOS/Android 同源；后续 Steam
- 单局：20–40 分钟；3 章；可中途存档
- 受众：情侣/朋友同屏或远程共享屏；16+，不露骨
- 变现：基础章节付费 + 章节包/外观包，无广告

## 2. 设计支柱

1. **看见对方**：第三人称越肩镜头，始终能看到伴侣和桌面
2. **手感**：真人手抓骰/抛骰、骰子真实物理、卡牌可拿起
3. **每章换机制**：第 1 章合作、第 2 章竞争、第 3 章混合
4. **电影感**：Cinemachine + Timeline + URP 后处理 + 自适应音乐
5. **情侣专属**：共享热度、秘密任务、对视/同步按键、结局回顾

## 3. 全量内容矩阵

| 模块 | 全量 |
|---|---|
| 章节 | 3 章（同居日常 / 旅行 / 周年夜） |
| 棋盘 | 每章 1 张，共 3 张；事件格/机会格/小游戏格 |
| 卡牌 | 60+（事件/选择/秘密/道具） |
| 小游戏 | 12 个（做饭、拼图、节奏、找不同、双人按键、平衡等） |
| 结局 | 6 个（合作/搞笑/浪漫/遗憾/隐藏/真结局） |
| 角色 | 2 个可定制主角 + 2 个 NPC（猫/邻居） |
| 场景 | 1 个高精度公寓（可换章节软装） |
| 音频 | 3 章自适应音乐 + 60+ SFX + 旁白/语气 |
| 系统 | 存档、章节解锁、成就、照片模式、回放、辅助功能、中英本地化 |

## 4. 场景结构（单场景，数据驱动）

```
FullGame.unity
├─ Systems
│  ├─ GameFlow (turn/chapter/ending)
│  ├─ SaveSystem
│  ├─ AudioDirector
│  ├─ ContentDatabase (cards/minigames/endings)
│  └─ UnityBridge (JS ↔ Unity)
├─ Environment
│  ├─ Apartment (floor/walls/window/fireplace/sofa/shelf)
│  ├─ Table + Board + Props
│  └─ Lighting (baked + HDRI + point/spot)
├─ Actors
│  ├─ PlayerA (avatar root, hand IK target, seat)
│  ├─ PlayerB
│  └─ NPC_Cat
├─ Camera
│  ├─ CM_OverShoulderA/B
│  ├─ CM_DiceCloseup
│  ├─ CM_CardCloseup
│  └─ CM_Ending
└─ UI
   ├─ HUD (turn, heat, chapter)
   ├─ DicePanel
   ├─ CardPanel
   ├─ MinigameOverlay
   ├─ Pause/Settings
   ├─ PhotoMode
   └─ Ending/Recap
```

## 5. 系统架构

- `GameFlow`：状态机 `Boot → Menu → ChapterIntro → TurnStart → ActionSelect → DiceRoll → Resolve → Event → Minigame → TurnEnd → ChapterEnd → Ending`
- `TurnSystem`：当前玩家、行动点、热度、章节进度
- `DiceSystem`：Rigidbody 骰子、点数贴图、落地稳定检测、顶面判定、慢动作
- `CardSystem`：ScriptableObject/JSON 数据、抽牌、条件、结果
- `MinigameSystem`：`MinigameBase` 接口 + 12 个实现，统一结算
- `AvatarController`：坐/站/伸手/抓骰/抛骰/庆祝；IK 目标
- `CameraDirector`：Cinemachine 优先级切换 + Timeline 演出
- `AudioDirector`：Music/SFX/Ambience 总线、章节参数
- `SaveSystem`：JSON + PlayerPrefs/IndexedDB
- `Localization`：Unity Localization 或 JSON 表
- `Accessibility`：字号/对比度/减少动态/色盲点数符号
- `PhotoMode`：自由相机、滤镜、隐藏 UI、截图

## 6. 技术选型

- Unity 6 LTS `6000.0.85f2` + URP 17
- Cinemachine 3、Timeline、Animation Rigging
- uGUI（运行时构建，减少 prefab 依赖）
- Input System（触屏/鼠标/键盘）
- Addressables（章节资源按需）
- FMOD/Wwise（后续；先 Unity AudioMixer）
- WebGL：未压缩或 decompression fallback；移动端 30/60fps
- 数据：StreamingAssets JSON + ScriptableObject 缓存

## 7. 里程碑（全量，非切片）

- M0 工程/场景/相机/双角色/UI 框架
- M1 回合/骰子/棋盘/卡牌主循环
- M2 12 小游戏框架 + 前 3 个
- M3 3 章内容/60 卡/6 结局数据
- M4 音频/后处理/灯光/材质
- M5 存档/设置/辅助/本地化/照片模式
- M6 iOS/Android/WebGL 性能与内存
- M7 发布/监控/热更新内容包

## 8. 验收（全量）

- 3 章可从开始玩到 6 结局之一，中途存档可恢复
- 60 卡全部有实际效果，无空卡
- 12 小游戏可独立结算，失败/成功都推进流程
- 第三人称镜头无穿墙，切第一人称卡牌/骰子特写正常
- 移动端 30fps 底线，WebGL 可玩；内存 < 1.2GB（iOS）
- 0 console error；JS bridge ready/rollComplete 幂等
- 线上部署可回滚；主游戏 V9.7 fallback 不受影响
