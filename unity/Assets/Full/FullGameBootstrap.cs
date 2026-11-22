using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// V11 Full Unity 核心：一个房间、两个角色、第三人称回合、真实骰子、棋盘、卡牌和小游戏。
/// 这是完整产品的运行时骨架，内容通过 cards/章节数据扩展。
/// </summary>
public class FullGameBootstrap : MonoBehaviour
{
    [Header("Content")]
    public GameObject handPrefab;
    public int turnsPerChapter = 12;
    public int chapter = 1;

    FullDice dice;
    FullGameUI ui;
    Camera cam;
    readonly List<FullAvatar> avatars = new List<FullAvatar>();
    readonly List<GameObject> pieces = new List<GameObject>();
    readonly int[] positions = new int[2];
    readonly Vector3[] tilePositions = new Vector3[20];

    int currentPlayer;
    int turn;
    int heat;
    bool busy;
    bool miniActive;
    float miniMarkerT;
    int miniSpeed = 1;

    static readonly string[] CardTitles =
    {
        "今晚谁洗碗", "突然的拥抱", "秘密任务", "旧照片", "雨夜外卖", "一起唱歌",
        "谁先睡着", "旅行计划", "手机相册", "深夜散步", "对方的小习惯", "十年后"
    };
    static readonly string[] CardBodies =
    {
        "你们因为洗碗吵了两句。选择：一起洗（热度 +2），或者猜拳输的人洗（热度 +1）。",
        "对方突然从背后抱住你。什么都不用说，热度 +3。",
        "抽到秘密任务：在下一回合结束前，让对方笑一次。成功 +3，失败 -1。",
        "翻到一张旧照片。讲一个照片背后的故事，热度 +2。",
        "雨下大了，外卖迟到。选择：一起等（热度 +1），或者先吃零食（热度 0）。",
        "打开一首你们都喜欢的歌，合唱副歌。热度 +2。",
        "谁先睡着？赌一局。赢的人指定明天的早餐，热度 +1。",
        "计划一次说走就走的旅行。每人说一个想去的地方，热度 +2。",
        "互相翻对方手机相册里最近一张照片，讲当时发生了什么，热度 +2。",
        "下楼走十分钟，不带手机。回来时热度 +3。",
        "说出对方一个可爱的小习惯。说对 +2，说错 -1。",
        "想象十年后的今晚，你们会在哪里。每人说一句，热度 +3。"
    };

    void Awake()
    {
        BuildEnvironment();
        BuildActors();
        BuildDice();
        BuildCamera();
        BuildUI();
    }

    void Start()
    {
        StartTurn();
    }

    void BuildEnvironment()
    {
        var floor = MakeBox("Floor", new Vector3(0, -0.06f, 0), new Vector3(6.4f, 0.12f, 6.4f), new Color(0.16f, 0.11f, 0.08f));
        var wallBack = MakeBox("WallBack", new Vector3(0, 1.6f, 3.2f), new Vector3(6.4f, 3.2f, 0.12f), new Color(0.10f, 0.10f, 0.12f));
        var wallLeft = MakeBox("WallLeft", new Vector3(-3.2f, 1.6f, 0), new Vector3(0.12f, 3.2f, 6.4f), new Color(0.11f, 0.10f, 0.11f));
        var wallRight = MakeBox("WallRight", new Vector3(3.2f, 1.6f, 0), new Vector3(0.12f, 3.2f, 6.4f), new Color(0.11f, 0.10f, 0.11f));

        MakeBox("Rug", new Vector3(0, -0.01f, 0.2f), new Vector3(3.8f, 0.02f, 3.0f), new Color(0.24f, 0.12f, 0.10f));

        var table = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        table.name = "Table";
        table.transform.position = new Vector3(0, 0.72f, 0);
        table.transform.localScale = new Vector3(1.55f, 0.05f, 1.55f);
        Paint(table, new Color(0.24f, 0.13f, 0.07f));

        var board = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        board.name = "Board";
        board.transform.position = new Vector3(0, 0.785f, 0);
        board.transform.localScale = new Vector3(1.42f, 0.01f, 1.42f);
        Paint(board, new Color(0.55f, 0.39f, 0.20f));

        for (int i = 0; i < tilePositions.Length; i++)
        {
            float a = i / (float)tilePositions.Length * Mathf.PI * 2f;
            var tile = MakeBox("Tile" + i, new Vector3(Mathf.Cos(a) * 1.04f, 0.80f, Mathf.Sin(a) * 1.04f), new Vector3(0.18f, 0.018f, 0.18f),
                i % 3 == 0 ? new Color(0.92f, 0.70f, 0.34f) : new Color(0.38f, 0.30f, 0.22f));
            tile.transform.rotation = Quaternion.Euler(0, -a * Mathf.Rad2Deg, 0);
            tilePositions[i] = new Vector3(tile.transform.position.x, 0.815f, tile.transform.position.z);
        }

        // 沙发、壁炉、窗（占位，后续替换正式资产）
        MakeBox("Sofa", new Vector3(0, 0.30f, 2.55f), new Vector3(2.7f, 0.55f, 0.75f), new Color(0.14f, 0.16f, 0.18f));
        MakeBox("SofaBack", new Vector3(0, 0.70f, 2.88f), new Vector3(2.7f, 0.55f, 0.16f), new Color(0.12f, 0.14f, 0.16f));
        MakeBox("Fireplace", new Vector3(-2.45f, 0.65f, -1.2f), new Vector3(0.45f, 1.3f, 1.35f), new Color(0.18f, 0.10f, 0.07f));
        MakeBox("Window", new Vector3(2.55f, 1.5f, 0.4f), new Vector3(0.08f, 1.2f, 1.8f), new Color(0.18f, 0.28f, 0.38f));

        var fire = new GameObject("FireLight");
        fire.transform.position = new Vector3(-2.1f, 0.8f, -1.2f);
        var fl = fire.AddComponent<Light>();
        fl.type = LightType.Point;
        fl.color = new Color(1f, 0.45f, 0.16f);
        fl.intensity = 3.2f;
        fl.range = 3.2f;

        var sun = new GameObject("Sun");
        sun.transform.rotation = Quaternion.Euler(48, -38, 0);
        var sl = sun.AddComponent<Light>();
        sl.type = LightType.Directional;
        sl.color = new Color(1f, 0.82f, 0.65f);
        sl.intensity = 1.1f;

        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Flat;
        RenderSettings.ambientLight = new Color(0.10f, 0.09f, 0.12f);
    }

    void BuildActors()
    {
        for (int i = 0; i < 2; i++)
        {
            var go = new GameObject("Player" + (i == 0 ? "A" : "B"));
            go.transform.SetParent(transform, false);
            go.transform.position = new Vector3(i == 0 ? -0.5f : 0.5f, 0, i == 0 ? -1.9f : 1.9f);
            go.transform.rotation = Quaternion.Euler(0, i == 0 ? 0 : 180, 0);
            var av = go.AddComponent<FullAvatar>();
            av.displayName = i == 0 ? "你" : "TA";
            av.theme = i == 0 ? new Color(0.72f, 0.42f, 0.32f) : new Color(0.32f, 0.42f, 0.58f);
            av.Build();
            avatars.Add(av);

            var piece = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            piece.name = "Piece" + i;
            piece.transform.position = tilePositions[i * 9];
            piece.transform.localScale = new Vector3(0.085f, 0.035f, 0.085f);
            Paint(piece, i == 0 ? new Color(0.86f, 0.52f, 0.30f) : new Color(0.38f, 0.58f, 0.78f));
            Destroy(piece.GetComponent<Collider>());
            pieces.Add(piece);

            positions[i] = i * 9;
        }
    }

    void BuildDice()
    {
        var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
        go.name = "Dice";
        go.transform.SetParent(transform, false);
        dice = go.AddComponent<FullDice>();
        dice.ResetTo(new Vector3(0, 1.3f, 0));
    }

    void BuildCamera()
    {
        var cgo = new GameObject("Main Camera");
        cam = cgo.AddComponent<Camera>();
        cam.tag = "MainCamera";
        cam.fieldOfView = 42f;
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = new Color(0.02f, 0.025f, 0.035f);
        PlaceCameraFor(0, true);
    }

    void BuildUI()
    {
        var uiGo = new GameObject("FullGameUI");
        ui = uiGo.AddComponent<FullGameUI>();
        ui.Build();
        ui.OnRoll += OnRollClicked;
        ui.OnContinue += OnContinueClicked;
        ui.OnMiniStop += OnMiniStopClicked;
        ui.OnRestart += () => SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    void PlaceCameraFor(int player, bool instant)
    {
        Vector3 pos = player == 0 ? new Vector3(0.0f, 1.55f, -3.0f) : new Vector3(0.0f, 1.55f, 3.0f);
        Vector3 look = new Vector3(0, 0.78f, 0);
        if (instant)
        {
            cam.transform.position = pos;
            cam.transform.LookAt(look);
        }
        else StartCoroutine(MoveCamera(pos, look));
    }

    IEnumerator MoveCamera(Vector3 pos, Vector3 look)
    {
        Vector3 p0 = cam.transform.position;
        Quaternion q0 = cam.transform.rotation;
        Quaternion q1 = Quaternion.LookRotation(look - pos);
        float t = 0;
        while (t < 0.7f)
        {
            t += Time.deltaTime;
            float k = Mathf.SmoothStep(0, 1, t / 0.7f);
            cam.transform.position = Vector3.Lerp(p0, pos, k);
            cam.transform.rotation = Quaternion.Slerp(q0, q1, k);
            yield return null;
        }
    }

    void StartTurn()
    {
        busy = false;
        ui.HideCard();
        ui.HideMini();
        ui.HideEnding();
        ui.ShowRoll(true);
        for (int i = 0; i < avatars.Count; i++) avatars[i].SetCurrent(i == currentPlayer);
        PlaceCameraFor(currentPlayer, false);
        ui.SetHud($"第 {chapter} 章 · 第 {turn + 1} 回合", $"{avatars[currentPlayer].displayName} 的回合 · 热度 {heat}");
    }

    void OnRollClicked()
    {
        if (busy) return;
        StartCoroutine(RollRoutine());
    }

    IEnumerator RollRoutine()
    {
        busy = true;
        ui.ShowRoll(false);
        ui.SetHud($"第 {chapter} 章 · 第 {turn + 1} 回合", "骰子滚动中…");

        dice.ResetTo(new Vector3(0, 1.35f, 0));
        dice.StartRoll();
        while (!dice.Settled) yield return null;

        int value = dice.TopFace;
        positions[currentPlayer] = (positions[currentPlayer] + value) % tilePositions.Length;
        var piece = pieces[currentPlayer];
        Vector3 from = piece.transform.position;
        Vector3 to = tilePositions[positions[currentPlayer]];
        float t = 0;
        while (t < 0.6f)
        {
            t += Time.deltaTime;
            piece.transform.position = Vector3.Lerp(from, to, t / 0.6f) + Vector3.up * Mathf.Sin(t / 0.6f * Mathf.PI) * 0.18f;
            yield return null;
        }
        piece.transform.position = to;
        ui.SetHud($"第 {chapter} 章 · 第 {turn + 1} 回合", $"掷出 {value} 点 · 热度 {heat}");
        yield return new WaitForSeconds(0.4f);

        if ((turn + 1) % 3 == 0)
            StartCoroutine(MinigameRoutine());
        else
            ShowEventCard();
    }

    void ShowEventCard()
    {
        int idx = Random.Range(0, CardTitles.Length);
        ui.ShowCard(CardTitles[idx], CardBodies[idx] + "\n\n" + (Random.value > 0.5f ? "（对方可以补充一句）" : "（一起完成）"));
    }

    void OnContinueClicked()
    {
        if (busy) return;
        heat += 2;
        ui.HideCard();
        EndTurn();
    }

    IEnumerator MinigameRoutine()
    {
        miniActive = true;
        miniMarkerT = 0;
        miniSpeed = Random.value > 0.5f ? 1 : -1;
        ui.ShowMini("默契小游戏 · 在绿区按停");
        yield return null;
    }

    void OnMiniStopClicked()
    {
        if (!miniActive) return;
        miniActive = false;
        var marker = ui.miniMarker.anchoredPosition;
        var green = ui.miniGreen.anchoredPosition;
        float half = ui.miniGreen.sizeDelta.x * 0.5f;
        bool success = Mathf.Abs(marker.x - green.x) < half;
        heat += success ? 4 : 1;
        ui.HideMini();
        ui.ShowCard(success ? "默契成功" : "差一点", success ? "你们在同一拍按下。热度 +4。" : "节奏错开了，但也很可爱。热度 +1。");
        busy = false;
    }

    void EndTurn()
    {
        turn++;
        if (turn >= turnsPerChapter)
        {
            ShowEnding();
            return;
        }
        currentPlayer = 1 - currentPlayer;
        StartTurn();
    }

    void ShowEnding()
    {
        string title;
        string body;
        if (heat >= 24) { title = "真结局 · 同频"; body = "你们把今晚过成了一个小小的宇宙。下一章，继续一起飞。"; }
        else if (heat >= 16) { title = "浪漫结局"; body = "有些话没说出口，但你们都听见了。"; }
        else if (heat >= 8) { title = "温馨结局"; body = "普通的一晚，也值得被记住。"; }
        else { title = "搞笑结局"; body = "你们把飞行棋玩成了互相拆台，但笑得很开心。"; }
        ui.ShowEnding(title, body);
    }

    void Update()
    {
        if (miniActive && ui != null && ui.miniMarker != null)
        {
            miniMarkerT += Time.deltaTime * 0.62f * miniSpeed;
            float x = Mathf.Sin(miniMarkerT) * 335f;
            ui.miniMarker.anchoredPosition = new Vector2(x, ui.miniMarker.anchoredPosition.y);
        }
    }

    GameObject MakeBox(string name, Vector3 pos, Vector3 scale, Color color)
    {
        var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
        go.name = name;
        go.transform.SetParent(transform, false);
        go.transform.position = pos;
        go.transform.localScale = scale;
        Paint(go, color);
        return go;
    }

    void Paint(GameObject go, Color color)
    {
        var mr = go.GetComponent<MeshRenderer>();
        var mat = new Material(Shader.Find("Universal Render Pipeline/Unlit"));
        mat.color = color;
        mr.material = mat;
    }
}
