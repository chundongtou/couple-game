# 工作台状态

- 项目：couple-game
- 当前阶段：V11 Full Unity · M0（场景/角色/镜头/回合/UI 骨架）
- 目标：按全量产品范围搭建第三人称电影感双人桌游，过程中完善，不做垂直切片。
- 交付物：
  - 设计蓝图：`docs/v11/full-unity-blueprint.md`
  - FullGame 工程：`D:\CoupleUnity\FullGame`
  - 源码：`couple-game/unity/Assets/Full/`
  - 已构建：`D:\CoupleUnity\FullGame\Build\FullWebGL`（未压缩，约 84.6MB）
- 不做的事：
  - 本轮不宣称 Full Unity 已完成；M0 只是可运行骨架
  - 不删除现有 JS V9.7 与 Unity POC

## M0 已做
- URP 单场景 `FullGame.unity`，运行时构建房间/桌/棋盘/两角色/骰子
- 第三人称双机位（A/B 越肩），骰子物理 + 顶面点数 + 蓝/红点
- 回合/热度/掷骰/移动/事件卡/小游戏/结局运行时状态机
- uGUI HUD / 骰子按钮 / 卡牌 / 小游戏 / 结局
- WebGL 构建成功；collider stripping 用 `link.xml` 修复
- UI/Default shader 已加入 Always Included

## 已知问题
- UI 布局在 WebGL 最新构建里仍需校验（此前出现缩放/裁切）
- 角色/房间仍是 primitive 占位，未接正式美术
- 卡牌只有 12 条，60 卡/12 小游戏/6 结局未完成
- 无存档/音频/本地化/照片模式
- Pages 发布通道仍故障；FullGame 未上线

## 下一步
- M1：UI 布局/回合闭环稳定、正式第三人称镜头、手部 prefab 接入
- M2：12 小游戏、60 卡数据、3 章/6 结局
- M3：美术/音频/灯光/性能
