using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

/// <summary>生成 POC 场景，并把运行时用到的 shader 加入 Always Included，避免 WebGL 剥离。</summary>
public static class PocSetup
{
    [MenuItem("POC/Create Scene")]
    public static void Create()
    {
        EnsureAlwaysIncludedShaders();

        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var go = new GameObject("PocBootstrap");
        var boot = go.AddComponent<PocBootstrap>();
        boot.handPosition = new Vector3(0f, 0.18f, 0.35f);
        boot.handEuler = new Vector3(0f, 180f, 0f);
        boot.handScale = 2.4f;
        boot.handPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Art/Hand/hand.glb");
        if (boot.handPrefab == null) Debug.LogWarning("[POC] hand prefab not imported; runtime GLB fallback");
        var bridgeGo = new GameObject("UnityBridge");
        bridgeGo.AddComponent<UnityBridge>();
        const string path = "Assets/Scenes/Poc.unity";
        System.IO.Directory.CreateDirectory("Assets/Scenes");
        EditorSceneManager.SaveScene(scene, path);
        EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(path, true) };
        Debug.Log("[POC] scene created: " + path);
    }

    static void EnsureAlwaysIncludedShaders()
    {
        var assets = AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/GraphicsSettings.asset");
        if (assets == null || assets.Length == 0)
        {
            Debug.LogWarning("[POC] GraphicsSettings.asset not found");
            return;
        }

        var so = new SerializedObject(assets[0]);
        var arr = so.FindProperty("m_AlwaysIncludedShaders");
        if (arr == null)
        {
            Debug.LogWarning("[POC] m_AlwaysIncludedShaders not found");
            return;
        }

        arr.ClearArray();
        AddShader(so, arr, "Universal Render Pipeline/Unlit");
        AddShader(so, arr, "Unlit/Color");
        AddShader(so, arr, "Sprites/Default");
        so.ApplyModifiedProperties();
        AssetDatabase.SaveAssets();
        Debug.Log("[POC] always-included shaders updated");
    }

    static void AddShader(SerializedObject so, SerializedProperty arr, string name)
    {
        var shader = Shader.Find(name);
        if (shader == null)
        {
            Debug.LogWarning("[POC] shader not found: " + name);
            return;
        }

        for (int i = 0; i < arr.arraySize; i++)
        {
            if (arr.GetArrayElementAtIndex(i).objectReferenceValue == shader) return;
        }

        int idx = arr.arraySize;
        arr.InsertArrayElementAtIndex(idx);
        arr.GetArrayElementAtIndex(idx).objectReferenceValue = shader;
        Debug.Log("[POC] include shader: " + name);
    }
}
