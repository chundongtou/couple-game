using System.Runtime.InteropServices;
using UnityEngine;

/// <summary>
/// JS ↔ Unity bridge。JS 调用：
///   unityInstance.SendMessage("UnityBridge", "Roll", "4")
/// Unity 掷骰完成后回推 window.dispatchEvent(new CustomEvent("unity-roll-complete", {detail:4}))
/// </summary>
public class UnityBridge : MonoBehaviour
{
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")] static extern void UnityBridgeReady();
    [DllImport("__Internal")] static extern void UnityBridgeRollComplete(int value);
#endif

    public static UnityBridge Instance { get; private set; }

    void Awake()
    {
        Instance = this;
    }

    void Start()
    {
        NotifyReady();
    }

    public void Roll(string value)
    {
        int v;
        if (!int.TryParse(value, out v)) v = 1;
        v = Mathf.Clamp(v, 1, 6);
        Debug.Log("[POC] bridge Roll " + v);
        var poc = FindObjectOfType<PocBootstrap>();
        if (poc != null)
        {
            poc.Roll(v);
            // POC：先立即回结果，确保 Hybrid 桥接 UI 可用；正式版改为动画结束事件。
            NotifyRollComplete(v);
        }
        else Debug.LogWarning("[POC] PocBootstrap not found for Roll");
    }

    public void Ping(string message)
    {
        Debug.Log("[POC] bridge ping: " + message);
    }

    internal void NotifyReady()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        UnityBridgeReady();
#endif
        Debug.Log("[POC] bridge ready");
    }

    internal void NotifyRollComplete(int value)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        UnityBridgeRollComplete(value);
#endif
        Debug.Log("[POC] roll complete: " + value);
    }
}
