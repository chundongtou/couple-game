using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

/// <summary>Batchmode WebGL build for the POC.</summary>
public static class PocBuild
{
    [MenuItem("POC/Build WebGL")]
    public static void BuildWebGL()
    {
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
        var opts = new BuildPlayerOptions
        {
            scenes = new[] { "Assets/Scenes/Poc.unity" },
            locationPathName = "Build/WebGL",
            target = BuildTarget.WebGL,
            options = BuildOptions.None
        };
        BuildReport report = BuildPipeline.BuildPlayer(opts);
        Debug.Log("[POC] build result: " + report.summary.result + " size=" + report.summary.totalSize);
        if (report.summary.result != BuildResult.Succeeded)
        {
            EditorApplication.Exit(1);
        }
    }
}
