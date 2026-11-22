# 踩坑记录

- **现象**：Unity 6 编辑器下载 404（`download.unitychina.cn`），Hub/CLI 都装不上。
- **原因**：地区 CDN 重定向到中国 CDN，Unity 6 版本未镜像。
- **正确做法**：本地代理下官方安装包，`RunAsInvoker` 静默安装；WebGL 模块同法。
- **怎么提前发现**：先 `curl -I` 检查正式下载 URL 是否 200，而不是直接跑 Hub。

- **现象**：Unity WebGL 构建被 `PlayerBuildProgramLibrary.dll` 的 CodeIntegrity 拦截（0x800711C7）。
- **原因**：Windows Smart App Control 拦截未签名 Unity 构建 DLL。
- **正确做法**：关闭 Smart App Control（不可逆，需用户确认），或换干净构建机/CI。
- **怎么提前发现**：查看 `Microsoft-Windows-CodeIntegrity/Operational` 事件 3077。

- **现象**：URP 构建卡在 884736 个 shader variants，几小时不结束。
- **原因**：把 URP/Lit 和 glTF shader 全量加入 Always Included Shaders。
- **正确做法**：POC 只用 URP/Unlit + Unlit/Color + Sprites/Default；手部材质运行时换 URP/Unlit。
- **怎么提前发现**：构建日志出现 `variants ready` 计数增长极慢时立刻停。

- **现象**：GitHub Pages 上 Unity 报 “still brotli/gzip-compressed，缺少 Content-Encoding”。
- **原因**：Pages 不能自定义响应头，Unity 压缩构建默认依赖 header。
- **正确做法**：构建 `WebGLCompressionFormat.Disabled`，或启用 decompression fallback。
- **怎么提前发现**：用 `curl -I` 看静态托管是否返回 `Content-Encoding`。

- **现象**：URP 运行时手部一直 `loading hand`，glTFast 异步加载不完成。
- **原因**：运行时 GLB + URP shader/Input System 组合不稳定，185k 三角网格加载也慢。
- **正确做法**：在 Editor 预导入 glb 为 prefab，场景序列化引用，运行时直接 Instantiate。
- **怎么提前发现**：`AssetDatabase.LoadAssetAtPath<GameObject>` 能拿到 glb 主资源时就该预导入。
