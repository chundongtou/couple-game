using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class FullSetup
{
    [MenuItem("Full/Create Game Scene")]
    public static void Create()
    {
        EnsureShaders();
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var go = new GameObject("FullGame");
        var boot = go.AddComponent<FullGameBootstrap>();
        boot.handPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Art/Hand/hand.glb");
        const string path = "Assets/Scenes/FullGame.unity";
        System.IO.Directory.CreateDirectory("Assets/Scenes");
        EditorSceneManager.SaveScene(scene, path);
        EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(path, true) };
        Debug.Log("[FULL] scene created: " + path);
    }

    static void EnsureShaders()
    {
        var assets = AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/GraphicsSettings.asset");
        if (assets == null || assets.Length == 0) return;
        var so = new SerializedObject(assets[0]);
        var arr = so.FindProperty("m_AlwaysIncludedShaders");
        if (arr == null) return;
        arr.ClearArray();
        Add(arr, "Universal Render Pipeline/Unlit");
        Add(arr, "Unlit/Color");
        Add(arr, "Sprites/Default");
        Add(arr, "UI/Default");
        so.ApplyModifiedProperties();
        AssetDatabase.SaveAssets();
    }

    static void Add(SerializedProperty arr, string name)
    {
        var sh = Shader.Find(name);
        if (sh == null) { Debug.LogWarning("[FULL] missing shader " + name); return; }
        int i = arr.arraySize;
        arr.InsertArrayElementAtIndex(i);
        arr.GetArrayElementAtIndex(i).objectReferenceValue = sh;
    }
}
