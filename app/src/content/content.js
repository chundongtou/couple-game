/* =============================================================================
   升温夜航 · V3 重制版 · 剧情内容（content.js）
   -----------------------------------------------------------------------------
   唯一入口：window.CONTENT = { acts, events, endings, awards }
   引擎/UI 通过该对象读取文案与条件函数；本文件不含 DOM、不发请求、不读 localStorage。

   约定（与 app/DESIGN.md §1.4 / §3.2 对齐）：
   - acts   : 3 幕，id 1/2/3；intro 为「段落数组」，outtro.good/soft 为「段落数组」。
   - events : 4 个（前两个规范事件按 afterAct 1、2 排列，另两个为同幕备选，引擎按 afterAct 过滤后
              可确定性取第 1 个，也可随机取；【前两个的顺序不可调换】）。
              option = { id, label, effects:{heart,tension,sync,coins}, flag, outcome:[一句反馈] }
   - endings: 6 个，【数组顺序即判定优先级】，引擎取第一个 cond 为 true 的结局。
              cond = function (r, s) { return bool; }
              r = 资源视图（heart/tension/sync/coins，隐藏值 gentle 也在其中；若传整个 state 亦可）
              s = 会话统计（completes/skips/maxCombo/maxStarSeen/rounds/length/gentle…）
              flags.safeWord（state.flags）用于安全词收尾。
              条件函数内部做了多形态兜底：r 可以是 resources、也可以是整个 state，
              s 可以是 stats、也可以缺省；均按「r 优先 → s → r.resources」取值。
   - awards : 13 个，{ id, name, icon, cond:(r,s)=>bool }；条件从「特殊 → 通用」排序，
              引擎过滤后取前 2~3 个即可；最后两枚为保底（任何会话都能拿到，保证奖项≥2）。
   ========================================================================== */
(function () {
  /* ---------------- 取值兜底：兼容 r=resources / r=state / s=stats 多种调用 ---------------- */
  function num(v) { return (typeof v === 'number' && isFinite(v)) ? v : 0; }

  function pick(r, s, key) {
    var cands = [r, s, r && r.resources, s && s.resources];
    for (var i = 0; i < cands.length; i++) {
      var o = cands[i];
      if (o && typeof o[key] === 'number' && isFinite(o[key])) return o[key];
    }
    return 0;
  }

  function pickAny(r, s, keys) {
    for (var i = 0; i < keys.length; i++) {
      var v = pick(r, s, keys[i]);
      if (v !== 0) return v;
    }
    return 0;
  }

  function flagOf(r, s) {
    if (r && r.flags && typeof r.flags === 'object') return r.flags;
    if (s && s.flags && typeof s.flags === 'object') return s.flags;
    return {};
  }

  function hasFlag(r, s, name) {
    var f = flagOf(r, s);
    if (f[name]) return true;
    if (r && r[name]) return true;
    if (s && s[name]) return true;
    return false;
  }

  function maxStar(r, s) {
    return pickAny(r, s, ['maxStarSeen', 'maxStar', 'bestStar', 'starMax', 'highestStar']);
  }
  function completes(r, s) { return pickAny(r, s, ['completes', 'complete', 'done', 'doneCount']); }
  function skips(r, s) { return pickAny(r, s, ['skips', 'skip', 'skipCount']); }
  function maxCombo(r, s) { return pickAny(r, s, ['maxCombo', 'bestCombo', 'comboMax']); }
  function rounds(r, s) { return pickAny(r, s, ['rounds', 'round', 'roundsDone', 'played']); }

  window.CONTENT = {
    /* ============================== 三 幕 ============================== */
    acts: [
      {
        id: 1,
        name: '潮汐',
        sub: '靠近之前，海面先亮了一下',
        accent: '#e9b872',
        intro: [
          '船离岸时没有响。灯在水面碎成一片，又慢慢拼回去。',
          '你们坐在同一侧。谁都没有先开口，海替你们说了很多。',
          '第一张卡递过来的时候，你听见自己的心跳。'
        ],
        outtro: {
          good: [
            '潮水比想象中配合。',
            '你们把距离坐近了一点。'
          ],
          soft: [
            '潮水退了半寸，不急着追。',
            '有些靠近，本来就该慢慢来。'
          ]
        }
      },
      {
        id: 2,
        name: '暗涌',
        sub: '水面之下，有东西在动',
        accent: '#8d7cf6',
        intro: [
          '灯熄了一盏。剩下的光只够看清彼此的轮廓。',
          '这片海没有底。你听见水流从船底过去，像有人在很远的地方说话。',
          '有些话在这样的水上，会自己浮起来。'
        ],
        outtro: {
          good: [
            '暗处的水流托住了船。',
            '你们知道彼此在哪。'
          ],
          soft: [
            '暗涌没有把船推远。',
            '你们把话留在水里，等它自己浮上来。'
          ]
        }
      },
      {
        id: 3,
        name: '靠岸',
        sub: '天亮之前，总得选一个岸',
        accent: '#6fd3c7',
        intro: [
          '远处出现一线灰白。分不清是岸，还是天亮。',
          '船慢下来。你们都知道，这是最后一程。',
          '海面很平。像什么都没发生过，又像什么都发生过了。'
        ],
        outtro: {
          good: [
            '岸线在雾里显形。',
            '你们同时看见了它。'
          ],
          soft: [
            '岸还在雾里。',
            '但你们已经决定一起等天亮。'
          ]
        }
      }
    ],

    /* ========================== 幕末事件（4） ========================== */
    events: [
      /* e1 · 第 1 幕末（规范事件，勿移动位置） */
      {
        id: 'e1',
        afterAct: 1,
        title: '甲板上的风',
        text: [
          '风从船头绕过来，把对方的话吹散了一半。',
          '甲板上只有你们两个。你口袋里有一件外套。'
        ],
        options: [
          {
            id: 'coat',
            label: '把外套递过去',
            effects: { heart: 2, tension: 1 },
            flag: 'coat',
            outcome: ['外套有你的温度。对方没说谢谢，也没还回来。']
          },
          {
            id: 'let-wind',
            label: '站着不动，等风停',
            effects: { sync: 2, coins: 2 },
            flag: 'let-wind',
            outcome: ['你们谁都没动。风把两个人的影子吹到同一块甲板上。']
          },
          {
            id: 'ask-cold',
            label: '问一句：冷吗？',
            effects: { heart: 1, sync: 1 },
            flag: 'ask-cold',
            outcome: ['对方说不冷。你看见那只手缩进了袖子里。']
          }
        ]
      },
      /* e2 · 第 2 幕末（规范事件，勿移动位置） */
      {
        id: 'e2',
        afterAct: 2,
        title: '水面下的名字',
        text: [
          '船停了一会儿。海面黑得能照见人。',
          '有些话在你们之间浮上来，又被按回去。'
        ],
        options: [
          {
            id: 'speak-first',
            label: '先说出自己那句',
            effects: { heart: 2, tension: 2 },
            flag: 'speak-first',
            outcome: ['话说出口，海面反而安静了。']
          },
          {
            id: 'wait-other',
            label: '等对方先说',
            effects: { sync: 2, coins: 2 },
            flag: 'wait-other',
            outcome: ['沉默持续了很久。最后先笑的，是你们其中一个。']
          },
          {
            id: 'lighter',
            label: '换一个更轻的话题',
            effects: { tension: 1, sync: 1, coins: 1 },
            flag: 'lighter',
            outcome: ['你们聊起无关紧要的事。船身轻轻晃了一下。']
          }
        ]
      },
      /* e3 · 第 1 幕末备选（引擎随机挑选时用） */
      {
        id: 'e1b',
        afterAct: 1,
        title: '走廊的灯',
        text: [
          '走廊坏了一盏灯。一半亮，一半不亮。',
          '你们在暗处擦肩，谁也没有先让。'
        ],
        options: [
          {
            id: 'let-pass',
            label: '停下来，让对方先过',
            effects: { heart: 2, coins: 1 },
            flag: 'let-pass',
            outcome: ['对方过去时，肩膀碰了你一下。谁都没躲。']
          },
          {
            id: 'block-light',
            label: '伸手扶墙，把对方挡在光里',
            effects: { tension: 2, heart: 1 },
            flag: 'block-light',
            outcome: ['光落在对方的睫毛上。你忘了要说什么。']
          },
          {
            id: 'joke',
            label: '讲一个没头没尾的笑话',
            effects: { sync: 2, tension: 1 },
            flag: 'joke',
            outcome: ['对方笑的时候，走廊好像亮了一点。']
          }
        ]
      },
      /* e4 · 第 2 幕末备选 */
      {
        id: 'e2b',
        afterAct: 2,
        title: '岸上的灯',
        text: [
          '远处有别的船靠岸了，灯一盏一盏灭掉。',
          '你们的船还亮着。'
        ],
        options: [
          {
            id: 'dim',
            label: '关掉一盏灯',
            effects: { tension: 2, heart: 1 },
            flag: 'dim',
            outcome: ['船舱暗下来。你们的声音也低了下去。']
          },
          {
            id: 'keep-light',
            label: '让灯亮着，看它烧完',
            effects: { sync: 2, coins: 2 },
            flag: 'keep-light',
            outcome: ['灯一直亮着。你们谁也没提困。']
          },
          {
            id: 'future',
            label: '指着远处：以后我们也去那',
            effects: { heart: 2, sync: 1 },
            flag: 'future',
            outcome: ['对方顺着你的手指看过去，看了很久。']
          }
        ]
      }
    ],

    /* ====================== 六个结局（数组顺序 = 优先级） ====================== */
    endings: [
      {
        id: 'safe',
        name: '海面下的拥抱',
        accent: '#8fb7ff',
        cond: function (r, s) { return hasFlag(r, s, 'safeWord'); },
        text: [
          '安全词说出口的那一刻，船身轻轻一沉，像被人从水底托住。',
          '灯没有全灭。你们把卡收起来，把彼此留在原地。',
          '没有输赢。海面替你们，把没说完的话先盖好了。'
        ],
        quote: '不用玩完，也可以被好好接住。'
      },
      {
        id: 'slow',
        name: '慢一点，也很靠近',
        accent: '#9fd8c4',
        cond: function (r, s) {
          return pick(r, s, 'gentle') >= 3 && pick(r, s, 'heart') >= 6;
        },
        text: [
          '你们跳过了一些卡，也缓了几次。',
          '船没有因此走慢。它把水面让出来，让你们看得更清楚。',
          '靠岸之前，对方把头靠过来，很轻。你没有动。'
        ],
        quote: '有些靠近，是不着急的那种。'
      },
      {
        id: 'sync',
        name: '同一个频率',
        accent: '#8d7cf6',
        cond: function (r, s) {
          /* Lead 2026-10-27 决策：阈值 15 -> 12（sync 池 30 张、收益期望 8~10，15 不可达；12 仍需刻意走协作路线） */
          return pick(r, s, 'sync') >= 12 && pick(r, s, 'heart') >= 8;
        },
        text: [
          '后半程，你们几乎不用说话。',
          '你伸手，对方也正好伸手；你笑，对方也笑。',
          '船穿过暗涌的时候，两个人的呼吸在同一个节拍上。'
        ],
        quote: '不是猜得到，是本来就在一起。'
      },
      {
        id: 'tension',
        name: '不眠的暗涌',
        accent: '#f0729a',
        cond: function (r, s) { return pick(r, s, 'tension') >= 18; },
        text: [
          '这一晚的水一直在动。',
          '灯灭了一盏，谁都没有去开。',
          '靠岸的时候，你们还坐着，听自己的心跳比海浪更响。'
        ],
        quote: '没说完的，留给下一次出海。'
      },
      {
        id: 'heart',
        name: '天亮之前',
        accent: '#e9b872',
        cond: function (r, s) { return pick(r, s, 'heart') >= 14; },
        text: [
          '天边开始发白的时候，你们才发现已经坐了一整夜。',
          '对方没有松手，你也没有。',
          '岸就在前面。可谁都没急着下去。'
        ],
        quote: '天亮之前，再多待一会儿。'
      },
      {
        id: 'fallback',
        name: '各自听见的海',
        accent: '#8a93b8',
        cond: function () { return true; },
        text: [
          '船靠岸了。你们各拿各的外套，各自看了一眼海。',
          '这一晚没有变成什么故事。',
          '但它发生过。海记得，你们也记得。'
        ],
        quote: '同一条船，各有各的海。'
      }
    ],

    /* ====================== 奖项（13，特殊 → 通用） ====================== */
    awards: [
      {
        id: 'bravest',
        name: '全场最勇',
        icon: '🔥',
        cond: function (r, s) { return maxStar(r, s) >= 5; }
      },
      {
        id: 'starseeker',
        name: '星海拾荒者',
        icon: '🪐',
        cond: function (r, s) { return maxStar(r, s) >= 4; }
      },
      {
        id: 'combo-king',
        name: '连击王',
        icon: '🔗',
        cond: function (r, s) { return maxCombo(r, s) >= 5; }
      },
      {
        id: 'same-wave',
        name: '同频',
        icon: '🪢',
        cond: function (r, s) { return pick(r, s, 'sync') >= 8; }
      },
      {
        id: 'high-tide',
        name: '涨潮了',
        icon: '🌊',
        cond: function (r, s) { return pick(r, s, 'tension') >= 15; }
      },
      {
        id: 'heart-collector',
        name: '心动收藏家',
        icon: '💓',
        cond: function (r, s) { return pick(r, s, 'heart') >= 10; }
      },
      {
        id: 'stardust',
        name: '星屑富翁',
        icon: '✨',
        cond: function (r, s) { return pick(r, s, 'coins') >= 20; }
      },
      {
        id: 'gentle-guard',
        name: '温柔守护',
        icon: '🕊️',
        cond: function (r, s) { return pick(r, s, 'gentle') >= 3; }
      },
      {
        id: 'silent',
        name: '沉默是金',
        icon: '🤫',
        cond: function (r, s) { return skips(r, s) >= 4; }
      },
      {
        id: 'talker',
        name: '话痨',
        icon: '💬',
        cond: function (r, s) { return completes(r, s) >= 9; }
      },
      {
        id: 'voyage',
        name: '一路顺风',
        icon: '⛵',
        cond: function (r, s) {
          return completes(r, s) + skips(r, s) >= 1 || rounds(r, s) >= 1;
        }
      },
      /* 保底两枚：任何会话都能拿到，保证结算页「奖项 ≥2」 */
      {
        id: 'aboard',
        name: '登船',
        icon: '⚓',
        cond: function () { return true; }
      },
      {
        id: 'sea-listener',
        name: '听海的人',
        icon: '🎧',
        cond: function () { return true; }
      }
    ]
  };
})();
