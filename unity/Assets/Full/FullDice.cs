using System.Collections;
using UnityEngine;

/// <summary>真实刚体骰子：白底、蓝点 2/3/5/6、红点 1/4，落地后按顶面法线取点数。</summary>
public class FullDice : MonoBehaviour
{
    public float size = 0.11f;
    public float tableY = 0f;
    public bool Settled { get; private set; }
    public int TopFace { get; private set; } = 1;

    Rigidbody rb;
    bool rolling;

    static readonly Vector3[] Normals =
    {
        Vector3.up, Vector3.down, Vector3.forward, Vector3.back, Vector3.right, Vector3.left
    };
    static readonly int[] FaceValues = { 1, 6, 2, 5, 3, 4 };

    void Awake()
    {
        BuildBody();
    }

    void BuildBody()
    {
        transform.localScale = Vector3.one * size;
        var mr = GetComponent<MeshRenderer>();
        if (mr == null) mr = gameObject.AddComponent<MeshRenderer>();
        var mat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
        mat.color = new Color(0.96f, 0.93f, 0.86f);
        mr.material = mat;

        rb = gameObject.GetComponent<Rigidbody>();
        if (rb == null) rb = gameObject.AddComponent<Rigidbody>();
        rb.mass = 0.03f;
        rb.linearDamping = 0.18f;
        rb.angularDamping = 0.25f;
        rb.maxAngularVelocity = 25f;
        rb.collisionDetectionMode = CollisionDetectionMode.ContinuousDynamic;

        var col = gameObject.GetComponent<BoxCollider>();
        if (col == null) col = gameObject.AddComponent<BoxCollider>();
        col.size = Vector3.one * 0.98f;
        var pm = new PhysicsMaterial("DiceFelt");
        pm.dynamicFriction = 0.55f;
        pm.staticFriction = 0.6f;
        pm.bounciness = 0.32f;
        pm.bounceCombine = PhysicsMaterialCombine.Maximum;
        pm.frictionCombine = PhysicsMaterialCombine.Average;
        col.material = pm;

        BuildPips();
    }

    void BuildPips()
    {
        // 每个面用局部坐标画点；点大小按骰子面比例。
        AddFace(Vector3.up, 1, new Color(0.62f, 0.10f, 0.12f), new[] { Vector2.zero });
        AddFace(Vector3.down, 6, new Color(0.12f, 0.24f, 0.46f), new[]
        {
            new Vector2(-.25f,-.25f), new Vector2(.25f,-.25f),
            new Vector2(-.25f,0f), new Vector2(.25f,0f),
            new Vector2(-.25f,.25f), new Vector2(.25f,.25f)
        });
        AddFace(Vector3.forward, 2, new Color(0.12f, 0.24f, 0.46f), new[] { new Vector2(-.25f,-.25f), new Vector2(.25f,.25f) });
        AddFace(Vector3.back, 5, new Color(0.12f, 0.24f, 0.46f), new[]
        {
            new Vector2(-.25f,-.25f), new Vector2(.25f,-.25f), new Vector2(0,0),
            new Vector2(-.25f,.25f), new Vector2(.25f,.25f)
        });
        AddFace(Vector3.right, 3, new Color(0.12f, 0.24f, 0.46f), new[]
        {
            new Vector2(-.25f,-.25f), new Vector2(0,0), new Vector2(.25f,.25f)
        });
        AddFace(Vector3.left, 4, new Color(0.62f, 0.10f, 0.12f), new[]
        {
            new Vector2(-.25f,-.25f), new Vector2(.25f,-.25f),
            new Vector2(-.25f,.25f), new Vector2(.25f,.25f)
        });
    }

    void AddFace(Vector3 normal, int value, Color color, Vector2[] points)
    {
        var root = new GameObject("Pips_" + value);
        root.transform.SetParent(transform, false);
        // face plane basis
        Vector3 up = Vector3.up;
        if (Mathf.Abs(Vector3.Dot(normal, Vector3.up)) > 0.9f) up = Vector3.forward;
        Vector3 right = Vector3.Cross(up, normal).normalized;
        up = Vector3.Cross(normal, right).normalized;
        Vector3 center = normal * 0.505f;

        var pipMat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
        pipMat.color = color;
        foreach (var p in points)
        {
            var pip = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            pip.name = "pip";
            Destroy(pip.GetComponent<Collider>());
            pip.transform.SetParent(root.transform, false);
            pip.transform.localPosition = center + right * p.x + up * p.y;
            pip.transform.localScale = Vector3.one * 0.105f;
            pip.GetComponent<MeshRenderer>().material = pipMat;
        }
    }

    public void ResetTo(Vector3 pos)
    {
        transform.position = pos;
        transform.rotation = Quaternion.Euler(Random.Range(0f, 360f), Random.Range(0f, 360f), Random.Range(0f, 360f));
        if (rb == null) rb = GetComponent<Rigidbody>();
        rb.isKinematic = true;
        rb.linearVelocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;
        Settled = false;
    }

    public void StartRoll()
    {
        if (!rolling) StartCoroutine(CoRoll());
    }

    IEnumerator CoRoll()
    {
        rolling = true;
        Settled = false;
        rb.isKinematic = false;
        rb.linearVelocity = new Vector3(-0.35f, 1.5f, -0.25f);
        rb.angularVelocity = new Vector3(Random.Range(-12f, 12f), Random.Range(-12f, 12f), Random.Range(-12f, 12f));

        float t = 0f;
        while (t < 7f)
        {
            t += Time.deltaTime;
            if (t > 1.0f && rb.linearVelocity.magnitude < 0.04f && rb.angularVelocity.magnitude < 0.08f) break;
            yield return null;
        }

        rb.isKinematic = true;
        Settled = true;
        TopFace = ReadTopFace();
        rolling = false;
    }

    int ReadTopFace()
    {
        int best = 0;
        float bestDot = -999f;
        for (int i = 0; i < Normals.Length; i++)
        {
            float d = Vector3.Dot(transform.rotation * Normals[i], Vector3.up);
            if (d > bestDot) { bestDot = d; best = i; }
        }
        return FaceValues[best];
    }
}
