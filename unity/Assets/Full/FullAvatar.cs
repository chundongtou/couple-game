using UnityEngine;

/// <summary>第三人称角色占位：可替换为正式角色 prefab；提供镜头锚点和“当前玩家”表现。</summary>
public class FullAvatar : MonoBehaviour
{
    public string displayName = "Player";
    public Color theme = new Color(0.72f, 0.52f, 0.32f);
    public Transform cameraAnchor;

    GameObject body;
    GameObject head;
    Material bodyMat;
    bool current;

    public void SetTheme(Color c)
    {
        theme = c;
        if (!current && bodyMat != null) bodyMat.color = c;
    }

    public void Build()
    {
        bodyMat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
        bodyMat.color = theme;

        body = GameObject.CreatePrimitive(PrimitiveType.Capsule);
        body.name = "Body";
        body.transform.SetParent(transform, false);
        body.transform.localPosition = new Vector3(0, 0.62f, 0);
        body.transform.localScale = new Vector3(0.46f, 0.62f, 0.46f);
        Destroy(body.GetComponent<Collider>());
        body.GetComponent<MeshRenderer>().material = bodyMat;

        head = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        head.name = "Head";
        head.transform.SetParent(transform, false);
        head.transform.localPosition = new Vector3(0, 1.24f, 0);
        head.transform.localScale = Vector3.one * 0.34f;
        Destroy(head.GetComponent<Collider>());
        var hm = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
        hm.color = new Color(0.83f, 0.66f, 0.54f);
        head.GetComponent<MeshRenderer>().material = hm;

        var anchor = new GameObject("CameraAnchor");
        anchor.transform.SetParent(transform, false);
        anchor.transform.localPosition = new Vector3(0, 1.42f, 0);
        cameraAnchor = anchor.transform;

        // 简单的“手臂”占位，后续换手部 IK
        for (int i = 0; i < 2; i++)
        {
            var arm = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            arm.name = "Arm" + i;
            arm.transform.SetParent(transform, false);
            arm.transform.localPosition = new Vector3(i == 0 ? -0.32f : 0.32f, 0.72f, 0.20f);
            arm.transform.localRotation = Quaternion.Euler(55f, 0, i == 0 ? -18f : 18f);
            arm.transform.localScale = new Vector3(0.13f, 0.34f, 0.13f);
            Destroy(arm.GetComponent<Collider>());
            arm.GetComponent<MeshRenderer>().material = bodyMat;
        }
    }

    public void SetCurrent(bool isCurrent)
    {
        current = isCurrent;
        if (bodyMat != null) bodyMat.color = isCurrent ? new Color(0.92f, 0.66f, 0.32f) : theme;
        if (body != null) body.transform.localRotation = Quaternion.Euler(isCurrent ? -8f : 0f, 0, 0);
    }
}
