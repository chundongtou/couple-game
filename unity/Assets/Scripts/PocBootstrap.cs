using System.Collections;
using System.IO;
using System.Threading.Tasks;
using GLTFast;
using UnityEngine;
using UnityEngine.Networking;

/// <summary>
/// V10 Unity Hybrid POC锛圔uilt-in RP锛夛細
/// 涓€鍧楁鏉?+ 涓€棰楀垰浣撻瀛?+ CC0 鐪熶汉鍙虫墜锛圙LB锛孲treamingAssets锛夈€?/// 鐩殑锛氶獙璇?Unity WebGL 鑳藉惁鍔犺浇鐪熶汉鎵嬭祫浜с€佹覆鏌撴晥鏋滀笌鍩虹鐗╃悊锛?/// 瑙勫垯/UI/闊抽浠嶇敱鐜版湁 JS 璐熻矗锛圚ybrid锛夈€?/// </summary>
public class PocBootstrap : MonoBehaviour
{
    [Header("POC")]
    public bool loadHand = true;
    public GameObject handPrefab;
    public Vector3 handPosition = new Vector3(0f, 0.18f, 0.35f);
    public Vector3 handEuler = new Vector3(0f, 180f, 0f);
    public float handScale = 2.4f;

    private Rigidbody die;
    private GameObject handRoot;
    private Camera cam;
    private string status = "loading...";

    void Awake()
    {
        BuildTable();
        BuildDie();
        BuildCameraAndLight();
    }

    void Start()
    {
        if (handPrefab != null)
        {
            var go = Instantiate(handPrefab, transform, false);
            AttachHand(go);
            return;
        }
        if (loadHand) StartCoroutine(LoadHand());
    }

    void AttachHand(GameObject root)
    {
        handRoot = root;
        handRoot.name = "RealisticHand";
        handRoot.transform.SetParent(transform, false);
        handRoot.transform.localPosition = handPosition;
        handRoot.transform.localRotation = Quaternion.Euler(handEuler);
        handRoot.transform.localScale = Vector3.one * handScale;

        ApplyUrpMaterialFallback();

        var renderers = handRoot.GetComponentsInChildren<Renderer>();
        if (renderers.Length > 0)
        {
            var bounds = renderers[0].bounds;
            for (int i = 1; i < renderers.Length; i++) bounds.Encapsulate(renderers[i].bounds);
            var target = transform.TransformPoint(handPosition);
            handRoot.transform.position += target - bounds.center;
        }

        status = "hand loaded";
        Debug.Log("[POC] hand loaded, meshes under " + handRoot.name);
    }

#if ENABLE_LEGACY_INPUT_MANAGER
    void Update()
    {
        if (Input.GetMouseButtonDown(0) || Input.GetKeyDown(KeyCode.Space))
        {
            ThrowDie();
        }
        if (Input.GetKeyDown(KeyCode.R))
        {
            die.position = new Vector3(0.35f, 0.9f, 0.55f);
            die.rotation = Quaternion.Euler(20f, 30f, 10f);
            die.linearVelocity = Vector3.zero;
            die.angularVelocity = Vector3.zero;
        }

        for (int i = 1; i <= 6; i++)
        {
            if (Input.GetKeyDown(KeyCode.Alpha0 + i)) Roll(i);
        }
    }
#endif

    /// <summary>JS bridge 鍏ュ彛锛欽S 鎸囧畾鐐规暟锛孭OC 鍏堝仛鐗╃悊婕旂ず锛涘悗缁敤鏈濆悜鍒ゅ畾鐪熷疄 top銆?/summary>
    public void Roll(int value)
    {
        StartCoroutine(RollRoutine(value));
    }

    IEnumerator RollRoutine(int value)
    {
        status = "rolling " + value;
        ThrowDie();
        yield return new WaitForSeconds(2.0f);
        status = "rolled " + value;
    }

    Material MakeMat(Color color, float metallic = 0f, float gloss = 0.4f)
    {
        // URP 工程优先用 URP/Unlit；Built-in 工程回退到 Unlit/Color。
        var shader = Shader.Find("Universal Render Pipeline/Unlit");
        if (shader == null) shader = Shader.Find("Unlit/Color");
        if (shader == null) shader = Shader.Find("Sprites/Default");
        var m = new Material(shader);
        m.color = color;
        if (m.HasProperty("_Metallic")) m.SetFloat("_Metallic", metallic);
        if (m.HasProperty("_Glossiness")) m.SetFloat("_Glossiness", gloss);
        return m;
    }

    void BuildTable()
    {
        var table = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        table.name = "Table";
        table.transform.SetParent(transform, false);
        table.transform.position = new Vector3(0f, -0.12f, 0.35f);
        table.transform.localScale = new Vector3(2.4f, 0.12f, 2.4f);
        var mr = table.GetComponent<MeshRenderer>();
        mr.material = MakeMat(new Color(0.20f, 0.11f, 0.06f), 0.1f, 0.35f);

        var rim = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        rim.name = "Rim";
        rim.transform.SetParent(table.transform, false);
        rim.transform.localPosition = new Vector3(0f, 0.55f, 0f);
        rim.transform.localScale = new Vector3(1.02f, 0.06f, 1.02f);
        var rr = rim.GetComponent<MeshRenderer>();
        rr.material = MakeMat(new Color(0.55f, 0.36f, 0.18f), 0.75f, 0.55f);
        Object.Destroy(rim.GetComponent<Collider>());
    }

    void BuildDie()
    {
        var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
        go.name = "Die";
        go.transform.SetParent(transform, false);
        go.transform.position = new Vector3(-0.10f, 0.28f, 0.18f);
        go.transform.localScale = Vector3.one * 0.12f;
        go.GetComponent<MeshRenderer>().material = MakeMat(new Color(0.96f, 0.93f, 0.86f), 0f, 0.42f);

        die = go.AddComponent<Rigidbody>();
        die.mass = 0.02f;
        die.linearDamping = 0.15f;
        die.angularDamping = 0.2f;
        die.isKinematic = true;

        var pm = new PhysicsMaterial("DiceFelt");
        pm.dynamicFriction = 0.55f;
        pm.staticFriction = 0.6f;
        pm.bounciness = 0.35f;
        pm.bounceCombine = PhysicsMaterialCombine.Maximum;
        pm.frictionCombine = PhysicsMaterialCombine.Average;
        go.GetComponent<Collider>().material = pm;
    }

    void BuildCameraAndLight()
    {
        var camGo = new GameObject("Main Camera");
        camGo.transform.SetParent(transform, false);
        cam = camGo.AddComponent<Camera>();
        cam.fieldOfView = 45f;
        cam.transform.position = new Vector3(0f, 1.9f, -2.35f);
        cam.transform.LookAt(new Vector3(0f, 0.15f, 0.25f));
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color(0.025f, 0.035f, 0.05f);

        var keyGo = new GameObject("Key");
        keyGo.transform.SetParent(transform, false);
        var key = keyGo.AddComponent<Light>();
        key.type = LightType.Directional;
        key.color = new Color(1f, 0.82f, 0.62f);
        key.intensity = 1.25f;
        keyGo.transform.rotation = Quaternion.Euler(48f, -35f, 0f);

        var fillGo = new GameObject("Fill");
        fillGo.transform.SetParent(transform, false);
        var fill = fillGo.AddComponent<Light>();
        fill.type = LightType.Point;
        fill.color = new Color(0.55f, 0.7f, 1f);
        fill.intensity = 2.2f;
        fill.range = 12f;
        fillGo.transform.position = new Vector3(-2.5f, 3.2f, -3.0f);

        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
        RenderSettings.ambientLight = new Color(0.08f, 0.11f, 0.16f);
    }

    IEnumerator LoadHand()
    {
        string path = Path.Combine(Application.streamingAssetsPath, "hand.glb");
        byte[] bytes = null;

#if UNITY_WEBGL && !UNITY_EDITOR
        using (var req = UnityWebRequest.Get(path))
        {
            yield return req.SendWebRequest();
            if (req.result != UnityWebRequest.Result.Success)
            {
                status = "hand fetch failed: " + req.error;
                Debug.LogError(status);
                yield break;
            }
            bytes = req.downloadHandler.data;
        }
#else
        if (!File.Exists(path))
        {
            status = "hand not found: " + path;
            Debug.LogError(status);
            yield break;
        }
        bytes = File.ReadAllBytes(path);
#endif
        status = "loading hand (" + (bytes.Length / 1024 / 1024) + "MB)...";

        GltfImport gltf = null;
        Task<bool> loadTask = null;
        try
        {
            gltf = new GltfImport();
            loadTask = gltf.LoadGltfBinary(bytes);
        }
        catch (System.Exception e)
        {
            status = "gltf init: " + e.Message;
            Debug.LogError(status);
            yield break;
        }
        while (!loadTask.IsCompleted) yield return null;
        if (loadTask.Result == false)
        {
            status = "gltf load failed";
            Debug.LogError(status);
            yield break;
        }

        handRoot = new GameObject("RealisticHand");
        var instantiator = new GameObjectInstantiator(gltf, handRoot.transform);
        Task<bool> instTask = gltf.InstantiateSceneAsync(instantiator);
        while (!instTask.IsCompleted) yield return null;
        if (!instTask.Result)
        {
            status = "hand instantiate failed";
            Debug.LogError(status);
            yield break;
        }

        AttachHand(handRoot);
    }

    void ApplyUrpMaterialFallback()
    {
        var urpLit = Shader.Find("Universal Render Pipeline/Unlit");
        if (urpLit == null) return;

        foreach (var r in handRoot.GetComponentsInChildren<Renderer>())
        {
            var mats = r.materials;
            for (int i = 0; i < mats.Length; i++)
            {
                var old = mats[i];
                var nm = new Material(urpLit);
                nm.SetFloat("_Smoothness", 0.35f);
                nm.SetFloat("_Metallic", 0f);
                if (old != null)
                {
                    nm.color = old.color;
                    if (old.mainTexture != null) nm.SetTexture("_BaseMap", old.mainTexture);
                }
                mats[i] = nm;
            }
            r.materials = mats;
        }
        Debug.Log("[POC] hand materials switched to URP/Lit");
    }

    void ThrowDie()
    {
        if (die == null) return;
        die.isKinematic = false;
        die.position = new Vector3(-0.16f, 0.75f, 0.10f);
        die.rotation = Quaternion.Euler(Random.Range(0f, 360f), Random.Range(0f, 360f), Random.Range(0f, 360f));
        die.linearVelocity = new Vector3(-0.25f, 0.8f, -0.25f);
        die.angularVelocity = new Vector3(Random.Range(-8f, 8f), Random.Range(-8f, 8f), Random.Range(-8f, 8f));
    }

    void OnGUI()
    {
        var style = new GUIStyle(GUI.skin.label);
        style.fontSize = 18;
        style.normal.textColor = Color.white;
        GUI.Label(new Rect(20, 20, 900, 30), "Unity Hybrid POC 路 " + status, style);
        GUI.Label(new Rect(20, 50, 900, 30), "Click / Space: throw dice 路 R: reset", style);
    }
}

