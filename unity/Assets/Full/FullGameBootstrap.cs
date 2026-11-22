using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// V11 Full Unity runtime: one room, two actors, third-person turns, real dice, board, cards, minigames.
/// Content is data-driven through FullContent; UI is built at runtime and has an IMGUI fallback.
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
    int currentCardHeat = 2;
    bool chapterTransition;
    bool busy;
    bool miniActive;
    float miniMarkerT;
    int miniSpeed = 1;
    float miniRate = 0.62f;

    const string SaveKey = "couple_full_save_v1";

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
        LoadGame();
        StartTurn();
    }

    // ---------- persistence ----------
    void SaveNow()
    {
        var s = new FullSave
        {
            chapter = chapter,
            turn = turn,
            heat = heat,
            currentPlayer = currentPlayer,
            posA = positions[0],
            posB = positions[1],
            valid = true
        };
        PlayerPrefs.SetString(SaveKey, JsonUtility.ToJson(s));
        PlayerPrefs.Save();
    }

    void LoadGame()
    {
        if (!PlayerPrefs.HasKey(SaveKey)) return;
        try
        {
            var s = JsonUtility.FromJson<FullSave>(PlayerPrefs.GetString(SaveKey));
            if (s == null || !s.valid) return;
            chapter = Mathf.Clamp(s.chapter, 1, 3);
            turn = Mathf.Clamp(s.turn, 0, turnsPerChapter - 1);
            heat = Mathf.Max(0, s.heat);
            currentPlayer = s.currentPlayer == 1 ? 1 : 0;
            positions[0] = s.posA % tilePositions.Length;
            positions[1] = s.posB % tilePositions.Length;
            if (pieces.Count > 1)
            {
                pieces[0].transform.position = tilePositions[positions[0]];
                pieces[1].transform.position = tilePositions[positions[1]];
            }
        }
        catch { }
    }

    void DeleteSave()
    {
        PlayerPrefs.DeleteKey(SaveKey);
        PlayerPrefs.Save();
    }

    // ---------- scene construction ----------
    void BuildEnvironment()
    {
        MakeBox("Floor", new Vector3(0, -0.06f, 0), new Vector3(6.4f, 0.12f, 6.4f), new Color(0.16f, 0.11f, 0.08f));
        MakeBox("WallBack", new Vector3(0, 1.6f, 3.2f), new Vector3(6.4f, 3.2f, 0.12f), new Color(0.10f, 0.10f, 0.12f));
        MakeBox("WallLeft", new Vector3(-3.2f, 1.6f, 0), new Vector3(0.12f, 3.2f, 6.4f), new Color(0.11f, 0.10f, 0.11f));
        MakeBox("WallRight", new Vector3(3.2f, 1.6f, 0), new Vector3(0.12f, 3.2f, 6.4f), new Color(0.11f, 0.10f, 0.11f));
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
            var tile = MakeBox("Tile" + i,
                new Vector3(Mathf.Cos(a) * 1.04f, 0.80f, Mathf.Sin(a) * 1.04f),
                new Vector3(0.18f, 0.018f, 0.18f),
                i % 3 == 0 ? new Color(0.92f, 0.70f, 0.34f) : new Color(0.38f, 0.30f, 0.22f));
            tile.transform.rotation = Quaternion.Euler(0, -a * Mathf.Rad2Deg, 0);
            tilePositions[i] = new Vector3(tile.transform.position.x, 0.815f, tile.transform.position.z);
        }

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
        ui.OnRestart += OnRestartClicked;
    }

    // ---------- turn flow ----------
    void PlaceCameraFor(int player, bool instant)
    {
        Vector3 pos = player == 0 ? new Vector3(0.0f, 1.55f, -3.0f) : new Vector3(0.0f, 1.55f, 3.0f);
        Vector3 look = new Vector3(0, 0.78f, 0);
        if (instant) { cam.transform.position = pos; cam.transform.LookAt(look); }
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
        chapterTransition = false;
        ui.HideCard();
        ui.HideMini();
        ui.HideEnding();
        ui.ShowRoll(true);
        for (int i = 0; i < avatars.Count; i++) avatars[i].SetCurrent(i == currentPlayer);
        PlaceCameraFor(currentPlayer, false);
        ui.SetHud($"第 {chapter} 章 · 第 {turn + 1} 回合",
            $"{avatars[currentPlayer].displayName} 的回合 · 热度 {heat}");
    }

    void OnRollClicked()
    {
        if (busy || chapterTransition) return;
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

        if ((turn + 1) % 3 == 0) StartCoroutine(MinigameRoutine());
        else ShowEventCard();
    }

    void ShowEventCard()
    {
        busy = false;
        var cards = FullContent.CardsForChapter(chapter);
        var card = cards[Random.Range(0, cards.Length)];
        currentCardHeat = card.heat;
        ui.ShowCard(card.title, card.body + "\n\n" + (Random.value > 0.5f ? "（对方可以补充一句）" : "（一起完成）"));
    }

    void OnContinueClicked()
    {
        if (chapterTransition)
        {
            ui.HideCard();
            chapter++;
            turn = 0;
            currentPlayer = 0;
            heat += 2;
            SaveNow();
            StartTurn();
            return;
        }
        if (busy) return;
        heat += currentCardHeat;
        ui.HideCard();
        EndTurn();
    }

    IEnumerator MinigameRoutine()
    {
        miniActive = true;
        miniMarkerT = 0;
        miniSpeed = Random.value > 0.5f ? 1 : -1;
        var mini = FullContent.MiniFor(turn);
        miniRate = mini.speed;
        ui.miniGreen.sizeDelta = new Vector2(mini.green, 40);
        ui.miniGreen.anchoredPosition = new Vector2(Random.Range(-150f, 150f), 0);
        ui.ShowMini("小游戏 · " + mini.title);
        yield return null;
    }

    void OnMiniStopClicked()
    {
        if (!miniActive) return;
        miniActive = false;
        currentCardHeat = 0;
        var marker = ui.miniMarker.anchoredPosition;
        var green = ui.miniGreen.anchoredPosition;
        float half = ui.miniGreen.sizeDelta.x * 0.5f;
        bool success = Mathf.Abs(marker.x - green.x) < half;
        heat += success ? 4 : 1;
        ui.HideMini();
        ui.ShowCard(success ? "默契成功" : "差一点",
            success ? "你们在同一拍按下。热度 +4。" : "节奏错开了，但也很可爱。热度 +1。");
        busy = false;
    }

    void EndTurn()
    {
        turn++;
        SaveNow();
        if (turn >= turnsPerChapter)
        {
            if (chapter < 3)
            {
                busy = false;
                chapterTransition = true;
                ui.ShowCard($"第 {chapter} 章 · 完成", $"你们走完了第 {chapter} 章。\n\n热度 {heat}。下一章，继续一起飞。");
                return;
            }
            ShowEnding();
            return;
        }
        currentPlayer = 1 - currentPlayer;
        StartTurn();
    }

    void ShowEnding()
    {
        FullContent.Ending(heat, chapter, out string title, out string body);
        ui.ShowEnding(title, body);
        DeleteSave();
    }

    void OnRestartClicked()
    {
        DeleteSave();
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    // HTML shell entry points
    public void WebRoll() { OnRollClicked(); }
    public void WebContinue() { OnContinueClicked(); }
    public void WebStop() { OnMiniStopClicked(); }
    public void WebRestart() { OnRestartClicked(); }

    void Update()
    {
        if (miniActive && ui != null && ui.miniMarker != null)
        {
            miniMarkerT += Time.deltaTime * miniRate * miniSpeed;
            float x = Mathf.Sin(miniMarkerT) * 335f;
            ui.miniMarker.anchoredPosition = new Vector2(x, ui.miniMarker.anchoredPosition.y);
        }
    }

    // IMGUI fallback: keeps the turn loop playable even if uGUI is clipped on a device.
    void OnGUI()
    {
        if (ui == null) return;
        var style = new GUIStyle(GUI.skin.button) { fontSize = 22 };
        var rect = new Rect(Screen.width * 0.5f - 140, Screen.height - 96, 280, 60);
        if (ui.endPanel != null && ui.endPanel.activeSelf)
        {
            if (GUI.Button(rect, "RESTART", style)) OnRestartClicked();
        }
        else if (ui.cardPanel != null && ui.cardPanel.activeSelf)
        {
            if (GUI.Button(rect, "CONTINUE", style)) OnContinueClicked();
        }
        else if (ui.miniPanel != null && ui.miniPanel.activeSelf)
        {
            if (GUI.Button(rect, "STOP", style)) OnMiniStopClicked();
        }
        else if (!busy)
        {
            if (GUI.Button(rect, "ROLL", style)) OnRollClicked();
        }
    }

    // ---------- helpers ----------
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
