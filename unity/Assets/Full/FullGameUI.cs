using System;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.InputSystem.UI;

/// <summary>Runtime uGUI for the full game: HUD, dice, card, minigame, ending.</summary>
public class FullGameUI : MonoBehaviour
{
    public Text hud;
    public Text status;
    public Button rollButton;
    public GameObject cardPanel;
    public Text cardTitle;
    public Text cardBody;
    public Button cardContinue;
    public GameObject miniPanel;
    public RectTransform miniTrack;
    public RectTransform miniMarker;
    public RectTransform miniGreen;
    public Button miniStop;
    public Text miniTitle;
    public GameObject endPanel;
    public Text endTitle;
    public Text endBody;
    public Button endRestart;

    Font font;
    Material uiMat;

    public event Action OnRoll;
    public event Action OnContinue;
    public event Action OnMiniStop;
    public event Action OnRestart;

    public void Build()
    {
        font = Resources.Load<Font>("Fonts/NotoSansSC");
        if (font == null) font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        if (font == null) font = Font.CreateDynamicFontFromOSFont("Arial", 20);
        uiMat = new Material(Shader.Find("UI/Default"));

        if (FindObjectOfType<EventSystem>() == null)
        {
            var es = new GameObject("EventSystem");
            es.AddComponent<EventSystem>();
            es.AddComponent<InputSystemUIInputModule>();
        }

        var cgo = new GameObject("FullUI");
        var canvas = cgo.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.sortingOrder = 100;
        var scaler = cgo.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(960, 600);
        scaler.matchWidthOrHeight = 0.5f;
        cgo.AddComponent<GraphicRaycaster>();

        var top = MakePanel(cgo.transform, "Top", new Vector2(0.5f, 1), new Vector2(960, 132), new Vector2(0, -66));
        hud = MakeText(top.transform, "HUD", 20, TextAnchor.MiddleLeft, new Vector2(0, 20), new Vector2(900, 44));
        status = MakeText(top.transform, "Status", 15, TextAnchor.MiddleLeft, new Vector2(0, -24), new Vector2(900, 32));

        var bottom = MakePanel(cgo.transform, "Bottom", new Vector2(0.5f, 0), new Vector2(960, 148), new Vector2(0, 74));
        rollButton = MakeButton(bottom.transform, "Roll", "掷 骰 子", new Vector2(0.5f, 0.5f), new Vector2(460, 72), Vector2.zero);
        rollButton.onClick.AddListener(() => OnRoll?.Invoke());

        var cardRt = MakePanel(cgo.transform, "Card", new Vector2(0.5f, 0.5f), new Vector2(720, 500), Vector2.zero);
        cardRt.GetComponent<Image>().color = new Color(0.06f, 0.05f, 0.04f, 0.97f);
        cardPanel = cardRt.gameObject;
        cardTitle = MakeText(cardRt.transform, "CardTitle", 26, TextAnchor.MiddleCenter, new Vector2(0, 190), new Vector2(640, 60));
        cardBody = MakeText(cardRt.transform, "CardBody", 18, TextAnchor.UpperLeft, new Vector2(0, 0), new Vector2(620, 290));
        cardContinue = MakeButton(cardRt.transform, "Continue", "继续", new Vector2(0.5f, 0), new Vector2(360, 64), new Vector2(0, 62));
        cardContinue.onClick.AddListener(() => OnContinue?.Invoke());

        var miniRt = MakePanel(cgo.transform, "Mini", new Vector2(0.5f, 0.5f), new Vector2(720, 420), Vector2.zero);
        miniRt.GetComponent<Image>().color = new Color(0.04f, 0.05f, 0.07f, 0.97f);
        miniPanel = miniRt.gameObject;
        miniTitle = MakeText(miniRt.transform, "MiniTitle", 24, TextAnchor.MiddleCenter, new Vector2(0, 155), new Vector2(640, 60));
        var track = MakePanel(miniRt.transform, "Track", new Vector2(0.5f, 0.5f), new Vector2(560, 40), new Vector2(0, 20));
        track.GetComponent<Image>().color = new Color(0.16f, 0.14f, 0.12f);
        miniTrack = track;
        miniGreen = MakePanel(track.transform, "Green", new Vector2(0.5f, 0.5f), new Vector2(120, 40), new Vector2(150, 0));
        miniGreen.GetComponent<Image>().color = new Color(0.22f, 0.55f, 0.30f, 0.85f);
        miniMarker = MakePanel(track.transform, "Marker", new Vector2(0.5f, 0.5f), new Vector2(14, 48), new Vector2(-280, 0));
        miniMarker.GetComponent<Image>().color = new Color(0.95f, 0.78f, 0.42f);
        miniStop = MakeButton(miniRt.transform, "Stop", "停", new Vector2(0.5f, 0), new Vector2(260, 64), new Vector2(0, 62));
        miniStop.onClick.AddListener(() => OnMiniStop?.Invoke());
        miniPanel.SetActive(false);

        var endRt = MakePanel(cgo.transform, "End", new Vector2(0.5f, 0.5f), new Vector2(720, 500), Vector2.zero);
        endRt.GetComponent<Image>().color = new Color(0.04f, 0.04f, 0.05f, 0.97f);
        endPanel = endRt.gameObject;
        endTitle = MakeText(endRt.transform, "EndTitle", 32, TextAnchor.MiddleCenter, new Vector2(0, 180), new Vector2(640, 80));
        endBody = MakeText(endRt.transform, "EndBody", 18, TextAnchor.UpperLeft, new Vector2(0, 0), new Vector2(620, 280));
        endRestart = MakeButton(endRt.transform, "Restart", "再玩一局", new Vector2(0.5f, 0), new Vector2(360, 64), new Vector2(0, 62));
        endRestart.onClick.AddListener(() => OnRestart?.Invoke());
        endRestart.onClick.AddListener(() => OnRestart?.Invoke());
        endPanel.SetActive(false);
    }

    RectTransform MakePanel(Transform parent, string name, Vector2 anchor, Vector2 size, Vector2 pos)
    {
        var go = new GameObject(name, typeof(RectTransform), typeof(Image));
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = anchor;
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.sizeDelta = size;
        rt.anchoredPosition = pos;
        var img = go.GetComponent<Image>();
        img.color = new Color(0.05f, 0.06f, 0.08f, 0.92f);
        if (uiMat != null) img.material = uiMat;
        return rt;
    }

    Text MakeText(Transform parent, string name, int size, TextAnchor align, Vector2 pos, Vector2 dim)
    {
        var go = new GameObject(name, typeof(RectTransform), typeof(Text));
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = new Vector2(0.5f, 0.5f);
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.sizeDelta = dim;
        rt.anchoredPosition = pos;
        var t = go.GetComponent<Text>();
        t.font = font;
        t.fontSize = size;
        t.alignment = align;
        t.color = new Color(0.94f, 0.90f, 0.82f);
        t.horizontalOverflow = HorizontalWrapMode.Wrap;
        t.verticalOverflow = VerticalWrapMode.Overflow;
        return t;
    }

    Button MakeButton(Transform parent, string name, string label, Vector2 anchor, Vector2 size, Vector2 pos)
    {
        var go = new GameObject(name, typeof(RectTransform), typeof(Image), typeof(Button));
        go.transform.SetParent(parent, false);
        var rt = go.GetComponent<RectTransform>();
        rt.anchorMin = rt.anchorMax = anchor;
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.sizeDelta = size;
        rt.anchoredPosition = pos;
        var img = go.GetComponent<Image>();
        img.color = new Color(0.72f, 0.52f, 0.27f);
        if (uiMat != null) img.material = uiMat;
        var b = go.GetComponent<Button>();
        var colors = b.colors;
        colors.highlightedColor = new Color(0.95f, 0.72f, 0.40f);
        colors.pressedColor = new Color(0.55f, 0.38f, 0.18f);
        b.colors = colors;
        var t = MakeText(go.transform, "Label", 28, TextAnchor.MiddleCenter, Vector2.zero, size);
        t.text = label;
        t.color = new Color(0.10f, 0.07f, 0.04f);
        return b;
    }

    public void ShowRoll(bool on) { if (rollButton != null) rollButton.interactable = on; }
    public void ShowCard(string title, string body) { cardPanel.SetActive(true); cardTitle.text = title; cardBody.text = body; }
    public void HideCard() => cardPanel.SetActive(false);
    public void ShowMini(string title) { miniPanel.SetActive(true); miniTitle.text = title; }
    public void HideMini() => miniPanel.SetActive(false);
    public void ShowEnding(string title, string body) { endPanel.SetActive(true); endTitle.text = title; endBody.text = body; }
    public void HideEnding() => endPanel.SetActive(false);
    public void SetHud(string text, string sub) { hud.text = text; status.text = sub; }
}
