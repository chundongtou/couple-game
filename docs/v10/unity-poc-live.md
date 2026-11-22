# Unity 6 URP Hybrid POC锛堝凡涓婄嚎锛?
## 绾夸笂鍦板潃

- POC锛歨ttps://chundongtou.github.io/couple-game/unity-poc/
- 涓绘父鎴忥細https://chundongtou.github.io/couple-game/

## 浜や粯鍐呭

- Unity 6 LTS `6000.0.85f2` + WebGL Build Support
- URP `17.0.4`锛孶RP/Unlit 鏉愯川锛屾湭鍘嬬缉 WebGL锛圙itHub Pages 鍙洿鎺ユ墭绠★級
- CC0 鐪熶汉鍙虫墜 `unity/Assets/Art/Hand/hand.glb`锛孍ditor 棰勫鍏?prefab
- 妗屾澘 + 鍒氫綋楠板瓙 + 閿洏/鎸夐挳鎺烽
- `UnityBridge`锛?  - JS 鈫?`unityInstance.SendMessage("UnityBridge", "Roll", "4")`
  - Unity 鈫?`window` 鐨?`unity-roll-complete` 浜嬩欢锛宍detail` 涓虹偣鏁?- HUD 鐐规暟鎸夐挳 1鈥?銆佺粨鏋滃洖鏄俱€佽繑鍥炰富娓告垙閾炬帴

## 楠屾敹璇佹嵁

- 绾夸笂 `200`锛宍Build/WebGL.wasm` 杩斿洖 `application/wasm`
- ego 娴忚鍣ㄧ嚎涓婂姞杞斤細`window.__unityInstance` 瀛樺湪锛孒UD 鏄剧ず鈥淯nity 宸插氨缁€?- 鐐瑰嚮 4锛歚unity-roll-complete` 鈫?椤甸潰鏄剧ず鈥滅粨鏋?4鈥?- 鎴浘锛歚shots/unity-live-final.png`

## 宸茬煡闄愬埗

- 褰撳墠鏄?Hybrid POC锛歎nity 鍙礋璐?3D 鍦烘櫙/鎵?楠板瓙锛岃鍒?UI/闊抽浠嶅湪 JS
- 鎵嬮儴鏄潤鎬?prefab锛涙姄鍙?鎶涙幏 IK 鍔ㄧ敾銆佺偣鏁版湞鍚戝垽瀹氫负鍚庣画
- 鏈帇缂?wasm 绾?55MB锛沬OS 鐪熸満鍐呭瓨/棣栧睆鏃堕棿寰呮祴
- Full Unity锛圲I/瑙勫垯/闊抽鍏ㄩ儴杩佺Щ锛変笉鍦ㄦ湰闃舵

## 澶嶇幇

```bash
# 鏈湴 Unity 璺緞
D:\Unity\6000.0.85f2\Editor\Unity.exe

# URP 宸ョ▼
D:\CoupleUnity\PocURP

# 鏋勫缓锛堟湭鍘嬬缉锛?Unity.exe -batchmode -quit -projectPath D:\CoupleUnity\PocURP \
  -executeMethod PocBuild.BuildWebGL -buildTarget WebGL
```

鏋勫缓浜х墿澶嶅埗鍒?`couple-game/unity-poc/`锛屾帹鍒?`main` 鍚?GitHub Pages 宸ヤ綔娴佽嚜鍔ㄩ儴缃层€?
