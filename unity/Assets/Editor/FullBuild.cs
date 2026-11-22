using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class FullBuild
{
    [MenuItem("Full/Build WebGL")]
    public static void BuildWebGL()
    {
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
        var opts = new BuildPlayerOptions
        {
            scenes = new[] { "Assets/Scenes/FullGame.unity" },
            locationPathName = "Build/FullWebGL",
            target = BuildTarget.WebGL,
            options = BuildOptions.None
        };
        BuildReport report = BuildPipeline.BuildPlayer(opts);
        Debug.Log("[FULL] build result: " + report.summary.result + " size=" + report.summary.totalSize);
        if (report.summary.result != BuildResult.Succeeded) EditorApplication.Exit(1);
    }
}
