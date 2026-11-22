# V10 Unity 6 URP WebGL — B1 方案 / Hybrid POC 冻结单

> 用户选择：**B1 Unity 6 LTS + URP WebGL**，目标 **Full Unity**；先做 **Hybrid POC**，CC0 真人手/前臂；体积可接受；iOS 需支持。
> 本机无 Unity，**不能在 DSH 里直接编译 WebGL**；需要用户装 Unity 6 LTS + WebGL Build Support，或提供 GameCI license。

## 1. 总体路线

```
Phase 0  Unity 单场景 spike（手+骰子+桌板）      3–5 天
Phase 1  Hybrid POC（Unity 画布 + 现有 JS 规则） 2–3 周
Phase 2  Full Unity（UI/规则/音频迁移）          6–10 周
```

目标：Full Unity；但先 Hybrid 验证 **手/骰子/物理/URP/加载**，避免直接重写全部。

## 2. Hybrid 架构

- JS 现有引擎：规则、题卡、HUD、音频、存档、V7/three 回退
- Unity WebGL：3D 主桌、手、骰子、机舱、物理、镜头、URP 后处理
- DOM UI 覆盖在 Unity canvas 上（题卡/HUD/按钮）
- 桥协议（JSON）：
  - Unity→JS：`ready`、`rollComplete {value, top}`、`error {code}`、`perf {fps}`
  - JS→Unity：`roll {value, seed}`、`setState {pieces, turn, theme, quality}`、`setReduced`、`setSound`
- 3D 规则以 JS 为准：Unity 只播；最终骰面强制=JS value
- 回退：Unity 加载失败/无 WebGL2 → 现有 three.js；再失败 → V7

## 3. B1 基础上增加的模块

### 必需
1. **CC0 真人右手**（`Assets/Art/Hand/hand.glb`，185k tris、37 bones、指甲、6s 动画）+ 深色夹克袖口/前臂；IK 捏握
2. **Rigidbody 骰子**：BoxCollider、PhysicsMaterial、2–3 次弹跳、子帧插值、落点 `(0.63,0.63)`
3. **Timeline/Animator**：拿起→上挑→抛出→手退出；慢动作/镜头推近
4. **URP**：SSAO/Bloom/DOF/TAA/Color Grading/Vignette；接触阴影
5. **HDRI/Reflection Probe/Lightmap**；4K 木纹/皮革/绒布/黄铜
6. **JS Bridge + 回退 + 加载进度**
7. **2K/4K 画质档**、Addressables/AssetBundle 分包
8. **iOS 内存/热启动**实测；首包 20–30MB

### 增强（体积换体验）
9. **FMOD/Wwise** 空间音频/动态音乐（或 Unity AudioMixer 起步）
10. **Haptics**（手机震动）与骰子弹跳/落点同步
11. **拖拽/滑动掷骰**（不只点按钮）
12. **粒子/贴花/尘土/咖啡蒸汽/窗帘**
13. **Photo Mode / 回放**（可选）
14. **对手半身/剪影角色**（不参与规则，只做氛围；可选）
15. **4K 材质包/Addressables 按需下载**
16. **WebGPU 暂不承诺**（Unity WebGL 主要 WebGL2）

### 不建议
- HDRP（WebGL 不支持）
- DOTS/Job System 线程（WebGL 无线程）
- UE5 WebGL / Pixel Streaming（服务器成本）
- 实时 4K 阴影/全屏 SSAO 在低端机（需档位）

## 4. 验收

- 手近看是真人手，不是胶囊；指甲/关节/皮肤可见
- 骰子物理真实、最终顶面=value、落点中心
- 390/320/430、2K、iOS/Android 真机；首包/冷启动/内存记录
- Unity 挂掉回退现有主桌；UI/题卡不被 canvas 挡
- 0 console error；桥事件不丢/不重复
- 包体目标：POC 15–30MB；Full 40–80MB

## 5. 资产

- `unity/Assets/Art/Hand/hand.glb`：CC0，来源/规格见 `LICENSE.md`
- 其他外部资产必须记录来源/许可；禁止不明来源
- 4K 贴图/HDRI 单独记录许可

## 6. 本机限制

- 无 Unity Editor/Unity Hub → 不能本地编译/验证 WebGL
- 需要用户安装 **Unity 6 LTS + WebGL Build Support**，或在 CI 配置 GameCI + license
- 在 Unity 安装前，只能完成：工程/脚本/桥接/资产/规范；不能出可玩 WebGL 包
