using System;
using System.Collections.Generic;
using UnityEngine;

/// <summary>V11 全量内容表：3 章 60 卡、12 小游戏、6 结局。后续可替换为 ScriptableObject/远程配置。</summary>
public static class FullContent
{
    public static bool English;
    public struct Card
    {
        public string title;
        public string body;
        public int heat;
        public int chapter;
        public Card(string t, string b, int h, int c) { title = t; body = b; heat = h; chapter = c; }
    }

    public struct Mini
    {
        public string title;
        public int kind; // 0 = timing, 1 = rapid tap, 2 = reaction
        public float speed;
        public float green;
        public int target;
        public Mini(string t, int k, float s, float g, int targetCount = 0)
        { title = t; kind = k; speed = s; green = g; target = targetCount; }
    }

    public static readonly Card[] Cards =
    {
        // 第 1 章 · 同居日常
        new Card("今晚谁洗碗", "你们因为洗碗拌了两句。一起洗 +2；猜拳输的人洗 +1。", 2, 1),
        new Card("突然的拥抱", "对方从背后抱住你。什么都不用说。", 3, 1),
        new Card("秘密任务", "让对方在下一回合前笑一次。成功 +3，失败 -1。", 3, 1),
        new Card("旧照片", "翻到一张旧照片，讲一个当时的故事。", 2, 1),
        new Card("雨夜外卖", "外卖迟到。一起等 +1；先吃零食 0。", 1, 1),
        new Card("一起唱歌", "打开一首你们都喜欢的歌，合唱副歌。", 2, 1),
        new Card("谁先睡着", "赌一局谁先睡着。赢的人指定明天早餐。", 1, 1),
        new Card("旅行计划", "每人说一个想去的地方。", 2, 1),
        new Card("手机相册", "互相翻最近一张照片，讲当时发生了什么。", 2, 1),
        new Card("深夜散步", "下楼走十分钟，不带手机。", 3, 1),
        new Card("对方的小习惯", "说出对方一个可爱的小习惯。说对 +2，说错 -1。", 2, 1),
        new Card("十年后", "想象十年后的今晚，你们会在哪里。", 3, 1),
        new Card("抢被子", "半夜抢被子。谁先道歉？", 1, 1),
        new Card("早餐口味", "为对方做一次早餐，猜对口味 +2。", 2, 1),
        new Card("猫的任务", "猫把东西打翻了。一起收拾 +2。", 2, 1),
        new Card("一句谢谢", "认真说一句谢谢，不要开玩笑。", 2, 1),
        new Card("一起断电", "关掉所有灯十分钟，只聊天。", 3, 1),
        new Card("谁的歌单", "交换一首最近循环的歌。", 1, 1),
        new Card("周末计划", "一起定一个不用花钱的周末。", 1, 1),
        new Card("晚安方式", "说出你最喜欢的晚安方式。", 2, 1),

        // 第 2 章 · 旅行
        new Card("出发前夜", "行李还没收。一起列清单 +2。", 2, 2),
        new Card("错过高铁", "你们跑错了站台。互相埋怨还是大笑？", 1, 2),
        new Card("民宿钥匙", "钥匙藏在花盆下。谁先找到？", 1, 2),
        new Card("海边日落", "赶在日落前到海边。", 3, 2),
        new Card("迷路", "导航失灵。选择相信直觉还是问路？", 2, 2),
        new Card("当地小吃", "挑战一种没吃过的食物。", 2, 2),
        new Card("雨天行程", "下大雨。改去博物馆 +2；淋雨跑回去 +1。", 2, 2),
        new Card("拍一张合照", "请陌生人帮你们拍一张合照。", 2, 2),
        new Card("旅店停电", "整层楼停电。点蜡烛聊天 +3。", 3, 2),
        new Card("最想留住", "说出这趟旅行最想留住的一刻。", 3, 2),
        new Card("纪念品", "给对方挑一件不超过二十块的纪念品。", 2, 2),
        new Card("回程车票", "回程票买错日期。一起解决 +2。", 2, 2),
        new Card("陌生城市", "凌晨的陌生城市，只有你们两个人。", 3, 2),
        new Card("山顶风", "山顶风很大。把外套给对方 +2。", 2, 2),
        new Card("一张明信片", "给未来的自己写一张明信片。", 2, 2),
        new Card("旅行的争吵", "因为路线吵了一架。谁先低头 +2。", 2, 2),
        new Card("共享耳机", "一人一只耳机，听同一首歌。", 2, 2),
        new Card("最后一晚", "最后一晚，不刷手机，只看窗外。", 3, 2),
        new Card("带回什么", "除了照片，你们带回了什么？", 2, 2),
        new Card("下次去哪", "约定下一次旅行。", 3, 2),

        // 第 3 章 · 周年夜
        new Card("周年晚餐", "谁准备的？为对方倒一杯。", 2, 3),
        new Card("第一印象", "说说第一次见到对方时的印象。", 3, 3),
        new Card("争吵复盘", "回顾一次争吵，这次不翻旧账。", 2, 3),
        new Card("对方的改变", "说一个对方这几年最大的变化。", 2, 3),
        new Card("最难的时刻", "说出你们一起扛过的最难时刻。", 3, 3),
        new Card("秘密愿望", "说一个没告诉过对方的愿望。", 3, 3),
        new Card("交换礼物", "把准备好的礼物拿出来。", 2, 3),
        new Card("十秒对视", "对视十秒，不许笑。", 3, 3),
        new Card("重新求婚", "如果再来一次，你会怎么开口？", 3, 3),
        new Card("家庭照片", "想象一张十年后的全家福。", 2, 3),
        new Card("对方的优点", "连说三个对方的优点。", 2, 3),
        new Card("未来清单", "写下三件想一起完成的事。", 3, 3),
        new Card("一起变老", "想象你们老了以后的一天。", 3, 3),
        new Card("未说出口", "说一句一直没来得及说的话。", 4, 3),
        new Card("拥抱一分钟", "什么都不说，抱一分钟。", 4, 3),
        new Card("感谢", "感谢对方一件很小的事。", 2, 3),
        new Card("重新开始", "如果明天重新开始，你还会选 TA 吗？", 4, 3),
        new Card("周年愿望", "每人许一个和对方有关的愿望。", 3, 3),
        new Card("最后一支舞", "放一首歌，在客厅跳完。", 3, 3),
        new Card("今晚之后", "说出你希望明天醒来记得的一件事。", 3, 3),
    };

    public static readonly Mini[] Minigames =
    {
        new Mini("默契一拍", 0, 0.80f, 150f),
        new Mini("心跳同步", 0, 1.00f, 130f),
        new Mini("雨夜节奏", 0, 1.20f, 110f),
        new Mini("一起连点", 1, 0f, 0f, 6),
        new Mini("快速回应", 1, 0f, 0f, 8),
        new Mini("厨房手速", 1, 0f, 0f, 10),
        new Mini("等绿再按", 2, 0f, 0f),
        new Mini("眼神确认", 2, 0f, 0f),
        new Mini("最后一秒", 2, 0f, 0f),
        new Mini("记住顺序", 3, 0f, 0f, 4),
        new Mini("颜色记忆", 3, 0f, 0f, 4),
        new Mini("周年序列", 3, 0f, 0f, 4),
    };

    public static readonly string[] TitlesEn =
    {
        "Dish Duty", "Sudden Hug", "Secret Mission", "Old Photo", "Rainy Takeout",
        "Sing Together", "Who Falls Asleep First", "Travel Plan", "Camera Roll", "Night Walk",
        "Little Habit", "Ten Years Later", "Blanket Thief", "Breakfast", "The Cat's Mess",
        "A Real Thank You", "Lights Out", "Song Swap", "Weekend Plan", "Goodnight",
        "The Night Before", "Missed Train", "Hidden Key", "Seaside Sunset", "Lost",
        "Local Snack", "Rainy Day", "A Photo Together", "Blackout", "What to Keep",
        "Souvenir", "Wrong Return Ticket", "Strange City", "Mountain Wind", "A Postcard",
        "The Argument", "Shared Earphones", "Last Night", "What We Brought Back", "Next Trip",
        "Anniversary Dinner", "First Impression", "Argument Review", "How You Changed", "Hardest Moment",
        "Secret Wish", "Exchange Gifts", "Ten-Second Look", "Propose Again", "Family Photo",
        "Three Things", "Future List", "Growing Old", "Unsaid", "One-Minute Hug",
        "Gratitude", "Start Again", "Anniversary Wish", "Last Dance", "After Tonight"
    };

    public static readonly string[] BodiesEn =
    {
        "You argue about the dishes. Wash together (+2) or rock-paper-scissors (+1).",
        "A hug from behind. No words needed. +3.",
        "Secret mission: make your partner laugh before your next turn. +3 or -1.",
        "An old photo. Tell the story behind it. +2.",
        "The takeout is late. Wait together (+1) or snack first (0).",
        "Play a song you both love and sing the chorus. +2.",
        "Bet on who falls asleep first. The winner picks breakfast. +1.",
        "Each of you names a place you want to go. +2.",
        "Show the last photo in your camera roll and tell its story. +2.",
        "Walk downstairs for ten minutes without your phones. +3.",
        "Name one cute little habit of your partner. +2 if right, -1 if wrong.",
        "Imagine where you will be ten years from tonight. +3.",
        "Someone stole the blanket. Who apologizes first? +1.",
        "Make breakfast for your partner and guess their taste. +2.",
        "The cat knocked something over. Clean it up together. +2.",
        "Say a real thank you, no jokes. +2.",
        "Turn off every light for ten minutes and just talk. +3.",
        "Swap one song you have had on repeat. +1.",
        "Plan a weekend that costs nothing. +1.",
        "Describe your favorite way to say goodnight. +2.",
        "Packing is not done. Make a list together. +2.",
        "You ran to the wrong platform. Blame or laugh? +1.",
        "The key is under the flowerpot. Who finds it? +1.",
        "Reach the sea before sunset. +3.",
        "The navigation died. Trust your gut or ask someone? +2.",
        "Try a food you have never eaten. +2.",
        "It rains. Museum (+2) or run home wet (+1).",
        "Ask a stranger to take a photo of you two. +2.",
        "The whole floor loses power. Light a candle and talk. +3.",
        "Name the moment from this trip you want to keep. +3.",
        "Pick a souvenir for your partner under twenty. +2.",
        "The return ticket has the wrong date. Fix it together. +2.",
        "An unfamiliar city at midnight, just the two of you. +3.",
        "It is windy on the summit. Give your coat away. +2.",
        "Write a postcard to your future selves. +2.",
        "You argued about the route. Who reaches out first? +2.",
        "One earbud each, same song. +2.",
        "On the last night, put the phones away and watch the window. +3.",
        "Besides photos, what did you bring home? +2.",
        "Promise the next trip. +3.",
        "Who prepared dinner? Pour your partner a drink. +2.",
        "Describe your first impression of each other. +3.",
        "Revisit an argument without bringing up old scores. +2.",
        "Name the biggest change in your partner these years. +2.",
        "Tell the hardest moment you survived together. +3.",
        "Share one wish you never told your partner. +3.",
        "Take out the gift you prepared. +2.",
        "Hold eye contact for ten seconds without laughing. +3.",
        "If you could propose again, how would you do it? +3.",
        "Imagine a family photo ten years from now. +2.",
        "Say three good things about your partner. +2.",
        "Write down three things you want to do together. +3.",
        "Imagine one day when you are old. +3.",
        "Say the thing you never found the right moment to say. +4.",
        "Hold each other for one minute in silence. +4.",
        "Thank your partner for one tiny thing. +2.",
        "If tomorrow started over, would you choose them again? +4.",
        "Each of you makes one anniversary wish. +3.",
        "Play one song and dance in the living room. +3.",
        "Say one thing you hope to remember tomorrow morning. +3."
    };

    public static Card[] CardsForChapter(int chapter)
    {
        var list = new List<Card>();
        foreach (var c in Cards) if (c.chapter == chapter) list.Add(c);
        return list.ToArray();
    }

    public static Mini MiniFor(int turn)
    {
        return Minigames[Mathf.Abs(turn) % Minigames.Length];
    }

    public static void Ending(int heat, int chapter, out string title, out string body)
    {
        if (heat >= 36 && chapter >= 3) { title = "真结局 · 同频"; body = "你们把今晚过成了一个小小的宇宙。下一章，继续一起飞。"; }
        else if (heat >= 28) { title = "浪漫结局"; body = "有些话没说出口，但你们都听见了。"; }
        else if (heat >= 20) { title = "温馨结局"; body = "普通的一晚，也值得被记住。"; }
        else if (heat >= 12) { title = "搞笑结局"; body = "你们把飞行棋玩成了互相拆台，但笑得很开心。"; }
        else if (heat >= 6) { title = "遗憾结局"; body = "话到嘴边又咽了回去，但还有下一次。"; }
        else { title = "秘密结局 · 再来一局"; body = "你们还没开始认真，但棋局已经记住了你们。"; }
    }
}

[Serializable]
public class FullSave
{
    public int chapter = 1;
    public int unlockedChapter = 1;
    public int turn;
    public int heat;
    public int currentPlayer;
    public int posA;
    public int posB;
    public bool valid;
}
