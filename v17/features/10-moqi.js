/* =====================================================================
 * V17 功能 A · 默契大考验（心有灵犀 / 你说我猜）
 * ---------------------------------------------------------------------
 * 自包含单文件：运行时注入 CSS / DOM，只包装全局函数，绝不改 index.html。
 * 注册：GAMES / RULES.moqi / RESET_MAP.moqi
 * 包装：startGame（接管 moqi，其余 id 清理计时器后交还原函数）
 *       goHome（回大厅清计时器）、renderHome（首页入口防重复挂载）
 * 存档：localStorage['couple-moqi']
 * 关键测试选择器（data-t）：
 *   moqi-hero-card / moqi-grid-card / moqi-entry
 *   moqi-mode-heart / moqi-mode-guess / moqi-start / moqi-back
 *   moqi-rounds-5|8|10 / guess-dur-60|90|120 / guess-desc-him|her
 *   moqi-opt-0..3 / moqi-next / moqi-result / moqi-replay / moqi-swap
 *   guess-timer / guess-word / guess-hit / guess-skip / guess-end / guess-result
 *   moqi-home
 * ===================================================================== */
(function () {
  'use strict';
  if (window.__V17_MOQI_LOADED) return;
  window.__V17_MOQI_LOADED = true;

  /* ================= 题库 1：心有灵犀（50 道 × 4 选项） ================= */
  var QS = [
    { q: '周末更想怎么过？', o: ['宅家躺平', '出门逛街', '近郊走走', '睡到自然醒'] },
    { q: '如果只能选一种约会，你更想？', o: ['看电影', '吃大餐', '逛公园', '去电玩城'] },
    { q: '你更吃哪一套？', o: ['被摸头', '被牵手', '被背后抱住', '被捏脸'] },
    { q: '吵架后你更希望对方？', o: ['先哄我', '给我空间', '认真讲道理', '陪我沉默一会儿'] },
    { q: '收到礼物你更开心的是？', o: ['实用的', '有心意的', '贵一点的', 'TA 亲手做的'] },
    { q: '你最想和 TA 去哪里旅行？', o: ['海边', '山里', '古镇', '出国'] },
    { q: '半夜饿了你会？', o: ['点外卖', '翻冰箱', '忍着睡', '拉 TA 一起煮面'] },
    { q: '你手机里最舍不得删的是？', o: ['合照', '聊天记录', '语音', '表情包'] },
    { q: '你更喜欢的睡觉姿势是？', o: ['抱着睡', '各睡各的', '牵着手指睡', '背贴背睡'] },
    { q: '你早上醒来第一件事是？', o: ['看手机', '赖床', '找 TA', '喝水'] },
    { q: '你更喜欢 TA 怎么叫你？', o: ['叫全名', '叫小名', '叫昵称', '叫宝贝'] },
    { q: '你更想去哪种餐厅吃饭？', o: ['火锅', '日料', '家常小馆', '西餐'] },
    { q: '你更想收到的节日惊喜是？', o: ['花和礼物', '手写卡片', '突然的旅行', '一顿亲手做的饭'] },
    { q: '你更受不了 TA 哪一点？', o: ['回消息慢', '忘事情', '太黏人', '太冷静'] },
    { q: '你更喜欢的接吻时机是？', o: ['分别时', '见面时', '看电影中途', '吵架之后'] },
    { q: '你生气时最希望 TA？', o: ['立刻来哄', '讲个笑话', '做点好吃的', '认真道歉'] },
    { q: '你更喜欢的拍照方式？', o: ['拍 TA', '拍合照', '被 TA 拍', '自己自拍'] },
    { q: '你更想养什么宠物？', o: ['猫', '狗', '仓鼠', '不养'] },
    { q: '你工作或学习时最难忍的是？', o: ['被催', '被打断', '没灵感', '饿肚子'] },
    { q: '你更喜欢的电影类型？', o: ['爱情', '喜剧', '悬疑', '动画'] },
    { q: '你更喜欢的奶茶口味？', o: ['原味', '水果', '抹茶', '不喝奶茶'] },
    { q: '你更喜欢的旅行方式？', o: ['做满攻略', '走到哪算哪', '躺酒店', '跟着朋友走'] },
    { q: '你更喜欢的礼物预算？', o: ['几十块心意', '一两百', '贵重一点', '不如一起去玩'] },
    { q: '你最想和 TA 一起解锁哪件小事？', o: ['一起做饭', '一起看日出', '一起逛超市', '一起养绿植'] },
    { q: '你更容易在什么时候心软？', o: ['TA 认错时', 'TA 撒娇时', 'TA 委屈时', 'TA 认真努力时'] },
    { q: '你更喜欢的吵架收尾方式？', o: ['当场说开', '睡一觉再说', '抱一下就好', '发条长消息'] },
    { q: '你更想和 TA 一起看？', o: ['恐怖片', '喜剧', '演唱会', '球赛'] },
    { q: '你更喜欢的约会交通方式？', o: ['走路', '骑车', '地铁', '开车'] },
    { q: '你更想让 TA 记住的是？', o: ['你的生日', '你的口味', '你说过的小事', '你的表情'] },
    { q: '你更喜欢的夜景是？', o: ['城市灯光', '星空', '海边', '天台'] },
    { q: '你更想收到哪种早安？', o: ['一句问候', '一个电话', '一顿早饭', '一个抱抱'] },
    { q: '你更喜欢的相处状态是？', o: ['各忙各的偶尔说话', '一直黏在一起', '一起做事', '随时分享碎碎念'] },
    { q: '你更想和 TA 一起挑战？', o: ['密室逃脱', '过山车', '长途自驾', '一起跑个步'] },
    { q: '你最喜欢 TA 穿什么风格？', o: ['休闲卫衣', '干净衬衫', '运动装', '怎么穿都好看'] },
    { q: '你更喜欢的节日是？', o: ['生日', '圣诞', '跨年', '情人节'] },
    { q: '你更想和 TA 一起完成哪件事？', o: ['电影马拉松', '拼一幅拼图', '整理一次房间', '计划一次旅行'] },
    { q: '你更喜欢的道歉方式是？', o: ['说清原因', '做点补偿', '认真抱一下', '写张纸'] },
    { q: '你更喜欢的微信聊天节奏是？', o: ['秒回', '有空就回', '语音聊', '深夜长聊'] },
    { q: '你更想和 TA 一起听？', o: ['流行', '民谣', '摇滚', '纯音乐'] },
    { q: '你更喜欢的甜品是？', o: ['蛋糕', '冰淇淋', '布丁', '不太吃甜'] },
    { q: '你更容易被哪句话打动？', o: ['我陪着你', '我懂你', '我想你了', '我在'] },
    { q: '你更喜欢的旅行住宿是？', o: ['民宿', '酒店', '露营', '朋友家'] },
    { q: '你更喜欢的周末起床时间是？', o: ['七八点', '九十点', '中午', '随缘'] },
    { q: '你更想让 TA 陪你做的是？', o: ['逛超市', '剪头发', '看医生', '健身'] },
    { q: '你更喜欢的拍照背景是？', o: ['海边', '街道', '房间一角', '不管背景'] },
    { q: '你更喜欢的纪念方式？', o: ['每年拍合照', '收藏票根', '写日记', '一起做顿饭'] },
    { q: '你更喜欢的表白方式是？', o: ['当面说', '写下来', '拐弯抹角', '用行动证明'] },
    { q: '你更喜欢的默契程度是？', o: ['什么都不用说', '偶尔需要解释', '慢慢磨合', '越吵越懂'] },
    { q: '你更想和 TA 过哪种情人节？', o: ['出门玩一天', '在家做晚饭', '互送小礼物', '错峰补过'] },
    { q: '你更喜欢的日常小惊喜是？', o: ['突然的小零食', '一句夸奖', '帮忙做家务', '随手的小礼物'] }
  ];

  /* ================= 题库 2：你说我猜（110 个 · 2–5 字） ================= */
  var WORDS = [
    '第一次约会', '异地恋', '吃醋', '撒娇', '见家长', '情侣装', '摸头杀', '公主抱', '抢被子', '点外卖',
    '纪念日', '婚礼', '钻戒', '密室逃脱', '恐怖片', '火锅', '奶茶', '高铁', '机场', '婚纱照',
    '朋友圈', '情头', '晚安', '前任', '电灯泡', '闺蜜', '丈母娘', '工资卡', '行李箱', '自拍',
    '化妆', '吹头发', '熬夜', '打呼噜', '起床气', '爆米花', '情人节', '生日蛋糕', '玫瑰', '巧克力',
    '牵手', '拥抱', '额头吻', '早安', '语音条', '视频通话', '逛街', '游乐场', '过山车', '摩天轮',
    '海边', '烟花', '露营', '烧烤', '便利店', '电影院', '地铁', '加班', '存钱罐', '小作文',
    '冷战', '和好', '眼泪', '惊喜', '购物车', '快递', '撸猫', '遛狗', '金毛', '布偶猫',
    '哈士奇', '毕业照', '同桌', '初恋', '暗恋', '表白', '情书', '传纸条', '暖手', '围巾',
    '毛衣', '香水', '口红', '剃须刀', '情侣杯', '梦话', '失眠', '数羊', '烤肉', '螺蛳粉',
    '小龙虾', '冰美式', '草莓蛋糕', '机票', '护照', '民宿', '攻略', '打卡', '跨年', '红包',
    '年夜饭', '蜜月', '婚纱', '伴娘', '演唱会', '荧光棒', '电影票', '淋雨', '下雪', '星星'
  ];

  /* 供 QA / 调试读取 */
  window.V17_MOQI_QS = QS;
  window.V17_MOQI_WORDS = WORDS;

  /* ================= 存档 ================= */
  var KEY = 'couple-moqi';

  function defData() {
    return {
      v: 1,
      plays: 0,
      heart: { best: 0, last: 0, plays: 0, rounds: 0, hits: 0 },
      guess: { best: 0, last: 0, plays: 0, describer: 'him', duration: 60 },
      lastAt: '',
      lm: ''
    };
  }
  function n0(v) {
    var n = parseInt(v, 10);
    return (!isFinite(n) || n < 0) ? 0 : n;
  }
  function loadData() {
    var out = defData();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return out;
      var d = JSON.parse(raw);
      if (!d || typeof d !== 'object' || Object.prototype.toString.call(d) === '[object Array]') return out;
      out.plays = n0(d.plays);
      if (d.heart && typeof d.heart === 'object') {
        out.heart.best = Math.min(100, n0(d.heart.best));
        out.heart.last = Math.min(100, n0(d.heart.last));
        out.heart.plays = n0(d.heart.plays);
        out.heart.rounds = n0(d.heart.rounds);
        out.heart.hits = n0(d.heart.hits);
      }
      if (d.guess && typeof d.guess === 'object') {
        out.guess.best = n0(d.guess.best);
        out.guess.last = n0(d.guess.last);
        out.guess.plays = n0(d.guess.plays);
        out.guess.describer = (d.guess.describer === 'her') ? 'her' : 'him';
        var du = n0(d.guess.duration);
        out.guess.duration = (du === 90 || du === 120) ? du : 60;
      }
      if (typeof d.lastAt === 'string') out.lastAt = d.lastAt.slice(0, 10);
      if (d.lm === 'heart' || d.lm === 'guess') out.lm = d.lm;
    } catch (e) { return defData(); }
    return out;
  }
  function saveData(d) {
    try {
      d.v = 1;
      localStorage.setItem(KEY, JSON.stringify(d));
      return true;
    } catch (e) { return false; }
  }
  function dateStr() {
    var d = new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + ('0' + m).slice(-2) + '-' + ('0' + day).slice(-2);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function nameOf(who) {
    try { return (who === 'her' ? HE.her : HE.him) || (who === 'her' ? '她' : '他'); }
    catch (e) { return who === 'her' ? '她' : '他'; }
  }
  function other(who) { return who === 'her' ? 'him' : 'her'; }
  function byNum(n) { return n === 'her' ? 'her' : 'him'; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function st() { return window._v17Moqi; }
  function setHtml(html) {
    var c = document.getElementById('gContent');
    if (c) c.innerHTML = html;
    return c;
  }
  function dbg(e) {
    if (window.__V17_MOQI_DEBUG && window.console && console.error) console.error('[moqi]', e);
  }
  function fxBurst(n) { try { v12Fx.burst(innerWidth / 2, innerHeight * 0.4, n || 26); } catch (e) {} }
  function ding() { try { sndDing(); } catch (e) {} }
  function buzz() { try { sndBuzz(); } catch (e) {} }
  function vib(ms) { try { vibrate(ms || 40); } catch (e) {} }

  /* ================= 运行时 CSS（全部走 --v12-* 令牌） ================= */
  var CSS =
    '.mq-wrap{padding:14px 14px calc(30px + env(safe-area-inset-bottom));max-width:480px;margin:0 auto;color:var(--v12-ink);box-sizing:border-box}' +
    '.mq-hd h2{font-size:22px;font-weight:800;margin:0 0 6px;letter-spacing:-.01em;color:var(--v12-ink)}' +
    '.mq-hd p{margin:0;font-size:12.5px;color:var(--v12-dim);line-height:1.65}' +
    '.mq-card{background:var(--v12-surf);border:1px solid var(--v12-line);border-radius:18px;padding:14px;margin:12px 0;box-sizing:border-box}' +
    '.mq-sec{font-size:12px;color:var(--v12-dim2);margin:14px 0 6px;letter-spacing:.04em}' +
    '.mq-archive{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}' +
    '.mq-arc{background:var(--v12-surf2);border:1px solid var(--v12-line);border-radius:14px;padding:10px 8px;text-align:center;box-sizing:border-box;min-width:0}' +
    '.mq-arc b{display:block;font-size:18px;font-weight:800;color:var(--v12-m);line-height:1.25;overflow-wrap:anywhere}' +
    '.mq-arc span{display:block;font-size:10.5px;color:var(--v12-dim2);margin-top:3px;letter-spacing:.03em}' +
    '.mq-mode{display:flex;align-items:center;gap:12px;min-height:78px;padding:14px;border-radius:18px;border:1px solid var(--v12-line);background:var(--v12-surf);margin:10px 0;cursor:pointer;transition:transform .16s,border-color .2s;box-sizing:border-box;color:var(--v12-ink)}' +
    '.mq-mode:active{transform:scale(.98);border-color:rgba(255,45,149,.4)}' +
    '.mq-mode .ic{font-size:30px;line-height:1;flex:0 0 auto}' +
    '.mq-mode .tx{flex:1;min-width:0}' +
    '.mq-mode .tx b{display:block;font-size:15.5px;font-weight:800;color:var(--v12-ink)}' +
    '.mq-mode .tx span{display:block;font-size:11.5px;color:var(--v12-dim2);margin-top:3px;line-height:1.5}' +
    '.mq-mode .go{color:var(--v12-m);font-size:20px;flex:0 0 auto}' +
    '.mq-rules{margin:12px 0;border:1px solid var(--v12-line);border-radius:14px;padding:10px 14px;background:var(--v12-surf);font-size:12px;color:var(--v12-dim);box-sizing:border-box}' +
    '.mq-rules summary{cursor:pointer;color:var(--v12-ink);font-weight:700;font-size:13px;list-style:none;min-height:24px;display:flex;align-items:center}' +
    '.mq-rules summary::-webkit-details-marker{display:none}' +
    '.mq-rules p{line-height:1.85;margin:8px 0 0}' +
    '.mq-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}' +
    '.mq-seg.two{grid-template-columns:1fr 1fr}' +
    '.mq-seg button{min-height:46px;border-radius:14px;border:1px solid var(--v12-line);background:var(--v12-surf);color:var(--v12-dim);font-family:inherit;font-size:13px;cursor:pointer;padding:6px 4px;box-sizing:border-box;line-height:1.3}' +
    '.mq-seg button.on{background:linear-gradient(135deg,var(--v12-m),var(--v12-v));color:#fff;border-color:transparent;font-weight:700;box-shadow:0 0 18px rgba(255,45,149,.28)}' +
    '.mq-btn{display:block;width:100%;min-height:52px;border-radius:16px;border:0;font-family:inherit;font-size:16px;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--v12-m),var(--v12-v));cursor:pointer;margin:12px 0 0;box-shadow:0 0 20px rgba(255,45,149,.26);box-sizing:border-box;padding:10px 14px;line-height:1.35}' +
    '.mq-btn:active{transform:scale(.98)}' +
    '.mq-btn.ghost{background:var(--v12-surf);color:var(--v12-dim);border:1px solid var(--v12-line);font-weight:600;box-shadow:none;font-size:14px;min-height:48px}' +
    '.mq-btn.hit{background:linear-gradient(135deg,#10b981,#0ea5e9);box-shadow:0 0 20px rgba(16,185,129,.22)}' +
    '.mq-btn.skip{background:var(--v12-surf);color:var(--v12-dim);border:1px solid var(--v12-line);font-weight:700;box-shadow:none}' +
    '.mq-prog{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--v12-dim);margin:2px 0 10px}' +
    '.mq-prog b{color:var(--v12-m);font-size:14px}' +
    '.mq-turn{font-size:13.5px;line-height:1.7;color:var(--v12-dim);background:rgba(255,45,149,.08);border:1px solid rgba(255,45,149,.25);border-radius:14px;padding:10px 12px;margin:0 0 12px;box-sizing:border-box}' +
    'body.light .mq-turn,body.sketch .mq-turn{background:rgba(255,45,149,.06)}' +
    '.mq-turn b{color:var(--v12-ink)}' +
    '.mq-q{font-size:17.5px;font-weight:800;line-height:1.55;margin:4px 0 14px;color:var(--v12-ink);word-break:break-word}' +
    '.mq-opts{display:grid;grid-template-columns:1fr;gap:9px}' +
    '.mq-opt{width:100%;min-height:56px;border-radius:16px;border:1px solid var(--v12-line);background:var(--v12-surf);color:var(--v12-ink);font-family:inherit;font-size:14.5px;text-align:left;padding:12px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;box-sizing:border-box;transition:transform .14s,border-color .2s}' +
    '.mq-opt:active{transform:scale(.99);border-color:rgba(255,45,149,.45)}' +
    '.mq-opt .k{flex:0 0 26px;height:26px;border-radius:50%;border:1px solid var(--v12-line);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--v12-dim2);font-weight:700}' +
    '.mq-opt .t{flex:1;min-width:0;line-height:1.45}' +
    '.mq-banner{font-size:13px;color:#3ddc97;border:1px solid rgba(80,220,130,.45);background:rgba(80,220,130,.09);border-radius:12px;padding:10px 12px;margin:0 0 10px;text-align:center;line-height:1.6;box-sizing:border-box}' +
    'body.light .mq-banner,body.sketch .mq-banner{color:#0f8a5f}' +
    '.mq-verdict{text-align:center;font-size:20px;font-weight:900;margin:6px 0 14px;letter-spacing:.02em}' +
    '.mq-verdict.hit{color:#ff4d9d;text-shadow:0 0 22px rgba(255,45,149,.45)}' +
    '.mq-verdict.miss{color:var(--v12-dim)}' +
    '.mq-answer{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;border:1px solid var(--v12-line);background:var(--v12-surf);margin:8px 0;font-size:13px;color:var(--v12-dim);box-sizing:border-box}' +
    '.mq-answer b{margin-left:auto;color:var(--v12-ink);font-size:14px;text-align:right;line-height:1.45}' +
    '.mq-answer .dot{width:8px;height:8px;border-radius:50%;background:var(--v12-m);flex:0 0 auto}' +
    '.mq-answer.guess .dot{background:var(--v12-c)}' +
    '.mq-timer-row{display:flex;align-items:center;gap:10px;margin:2px 0 14px}' +
    '.mq-timebar{flex:1;height:10px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden}' +
    'body.light .mq-timebar,body.sketch .mq-timebar{background:rgba(150,80,110,.15)}' +
    '.mq-timebar i{display:block;height:100%;width:100%;border-radius:99px;background:linear-gradient(90deg,var(--v12-m),var(--v12-v));transition:width .2s linear}' +
    '.mq-guess.danger .mq-timebar i{background:linear-gradient(90deg,#ff6b6b,var(--v12-danger))}' +
    '.mq-clock{font-size:22px;font-weight:900;font-variant-numeric:tabular-nums;color:var(--v12-ink);min-width:48px;text-align:right}' +
    '.mq-guess.danger .mq-clock{color:var(--v12-danger);animation:mqPulse .9s ease-in-out infinite}' +
    '@keyframes mqPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}' +
    '.mq-role{font-size:12.5px;color:var(--v12-dim2);text-align:center;margin:0 0 8px;line-height:1.6}' +
    '.mq-role b{color:var(--v12-ink)}' +
    '.mq-word{min-height:150px;display:flex;align-items:center;justify-content:center;text-align:center;border-radius:22px;border:1px solid var(--v12-line);background:linear-gradient(135deg,rgba(255,45,149,.16),rgba(139,92,246,.14));font-size:32px;font-weight:900;line-height:1.35;letter-spacing:.04em;color:var(--v12-ink);padding:18px 12px;margin:0 0 14px;word-break:break-word;box-sizing:border-box}' +
    '.mq-guessbtns{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:stretch}' +
    '.mq-guessbtns .mq-btn{margin:0;min-height:64px;font-size:16px}' +
    '.mq-tally{text-align:center;font-size:12px;color:var(--v12-dim2);margin:12px 0 4px;line-height:1.7}' +
    '.mq-tally b{color:var(--v12-ink)}' +
    '.mq-mini{display:block;margin:8px auto 0;min-height:44px;padding:8px 18px;border-radius:999px;border:1px solid var(--v12-line);background:transparent;color:var(--v12-dim);font-family:inherit;font-size:12px;cursor:pointer}' +
    '.mq-result{text-align:center;padding:6px 0 2px}' +
    '.mq-tier{font-size:24px;font-weight:900;line-height:1.4;margin:4px 0 6px;color:var(--v12-ink)}' +
    '.mq-pct{font-size:46px;font-weight:900;color:var(--v12-m);line-height:1.15;text-shadow:0 0 26px rgba(255,45,149,.32);font-variant-numeric:tabular-nums}' +
    '.mq-sub2{font-size:13px;color:var(--v12-dim);line-height:1.8;margin:4px 0}' +
    '.mq-comment{font-size:13px;color:var(--v12-dim);line-height:1.9;background:var(--v12-surf);border:1px solid var(--v12-line);border-radius:14px;padding:12px 14px;margin:10px 0;text-align:left;box-sizing:border-box}' +
    '.mq-statrow{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}' +
    '.mq-stat{background:var(--v12-surf2);border:1px solid var(--v12-line);border-radius:14px;padding:10px 6px;text-align:center;min-width:0;box-sizing:border-box}' +
    '.mq-stat b{display:block;font-size:18px;font-weight:900;color:var(--v12-ink);line-height:1.25;font-variant-numeric:tabular-nums}' +
    '.mq-stat span{display:block;font-size:10.5px;color:var(--v12-dim2);margin-top:3px}' +
    '.mq-foot{text-align:center;font-size:11px;color:var(--v12-dim2);margin-top:14px;line-height:1.75}' +
    '.mq-result .mq-btn{margin-top:12px}' +
    '.mq-result .mq-btn.ghost{margin-top:8px}';

  function injectCSS() {
    if (document.getElementById('v17MoqiStyle')) return;
    var s = document.createElement('style');
    s.id = 'v17MoqiStyle';
    s.type = 'text/css';
    s.appendChild(document.createTextNode(CSS));
    (document.head || document.getElementsByTagName('head')[0] || document.body).appendChild(s);
  }

  /* ================= 设置状态（仅内存） ================= */
  var _setup = { mode: '', rounds: 8, dur: 0, desc: '' };
  function ensureSetup() {
    if (!_setup.rounds || [5, 8, 10].indexOf(_setup.rounds) < 0) _setup.rounds = 8;
    if (!_setup.dur) {
      var d = loadData();
      _setup.dur = d.guess.duration;
      _setup.desc = d.guess.describer;
    }
    if (_setup.dur !== 60 && _setup.dur !== 90 && _setup.dur !== 120) _setup.dur = 60;
    _setup.desc = byNum(_setup.desc);
  }
  function rulesText() {
    try { if (typeof RULES !== 'undefined' && RULES.moqi) return RULES.moqi; } catch (e) {}
    return '两个人轮流当出题人和读心人：心有灵犀一人先选答案，另一人猜 TA 选了什么；你说我猜一人描述词卡（不能说出词里的字），另一人抢答。';
  }

  /* ================= 入口页 ================= */
  function recentText(d) {
    if (d.lm === 'heart') return '💞 ' + d.heart.last + '%';
    if (d.lm === 'guess') return '🗣️ ' + d.guess.last + ' 个';
    if (d.heart.last) return '💞 ' + d.heart.last + '%';
    if (d.guess.last) return '🗣️ ' + d.guess.last + ' 个';
    return '还没玩过';
  }
  function renderEntry() {
    var d = loadData();
    setHtml('<div class="mq-wrap" data-t="moqi-entry">'
      + '<div class="mq-hd" style="margin-bottom:6px"><h2>💞 默契大考验</h2><p>同一道题，看看你们能不能想到一块儿去</p></div>'
      + '<div class="mq-card">'
      + '<div class="mq-sec" style="margin:0 0 2px">📊 默契档案</div>'
      + '<div class="mq-archive">'
      + '<div class="mq-arc"><b data-t="moqi-best-heart">' + d.heart.best + '%</b><span>最高默契度</span></div>'
      + '<div class="mq-arc"><b data-t="moqi-best-guess">' + d.guess.best + ' 个</b><span>你说我猜最佳</span></div>'
      + '<div class="mq-arc"><b>' + d.plays + ' 局</b><span>累计玩过</span></div>'
      + '<div class="mq-arc"><b style="font-size:14px" data-t="moqi-last">' + esc(recentText(d)) + '</b><span>最近一次</span></div>'
      + '</div></div>'
      + '<div class="mq-mode" data-t="moqi-mode-heart" onclick="v17MoqiPickMode(\'heart\')"><div class="ic">💑</div><div class="tx"><b>心有灵犀</b><span>同一道题，TA 会怎么选？</span></div><div class="go">›</div></div>'
      + '<div class="mq-mode" data-t="moqi-mode-guess" onclick="v17MoqiPickMode(\'guess\')"><div class="ic">🗣️</div><div class="tx"><b>你说我猜</b><span>不许说词里的字，看 TA 能不能猜到</span></div><div class="go">›</div></div>'
      + '<details class="mq-rules"><summary>📖 玩法规则</summary><p>' + esc(rulesText()) + '</p></details>'
      + '<button class="mq-btn ghost" data-t="moqi-home" onclick="v17MoqiHome()">🏠 返回大厅</button>'
      + '<div class="mq-foot">💡 一台手机就够玩，答完把手机递给对方</div>'
      + '</div>');
  }

  /* ================= 心有灵犀：设置页 ================= */
  function renderHeartSetup() {
    ensureSetup();
    _setup.mode = 'heart';
    var n = _setup.rounds;
    var seg = [5, 8, 10].map(function (x) {
      return '<button class="' + (n === x ? 'on' : '') + '" data-t="moqi-rounds-' + x + '" onclick="v17MoqiRounds(' + x + ')">' + x + ' 题</button>';
    }).join('');
    setHtml('<div class="mq-wrap" data-t="moqi-heart-setup">'
      + '<div class="mq-hd"><h2>💑 心有灵犀</h2><p>同一道题，TA 会怎么选？</p></div>'
      + '<div class="mq-sec">① 选择题数</div>'
      + '<div class="mq-seg">' + seg + '</div>'
      + '<div class="mq-card" style="margin-top:14px"><div style="font-size:13px;line-height:1.9;color:var(--v12-dim)">第 1 题由 <b style="color:var(--v12-ink)">' + esc(nameOf('him')) + '</b> 先答、<b style="color:var(--v12-ink)">' + esc(nameOf('her')) + '</b> 来猜；之后每换一题，两个人的角色交换一次。<br>猜中一次 +1 ❤️，最后看看你们的默契度。</div></div>'
      + '<button class="mq-btn" data-t="moqi-start" onclick="v17MoqiBegin()">开始测验 ›</button>'
      + '<button class="mq-btn ghost" data-t="moqi-back" onclick="v17MoqiEntry()">‹ 返回</button>'
      + '</div>');
  }

  /* ================= 心有灵犀：作答 / 猜测 / 揭晓 ================= */
  function optButtons(q) {
    return q.o.map(function (o, i) {
      return '<button class="mq-opt" data-t="moqi-opt-' + i + '" onclick="v17MoqiOpt(' + i + ')"><span class="k">' + 'ABCD'.charAt(i) + '</span><span class="t">' + esc(o) + '</span></button>';
    }).join('');
  }
  function heartProg(m) {
    return '<div class="mq-prog"><span>第 ' + (m.idx + 1) + ' / ' + m.total + ' 题</span><b>命中 ' + m.hits + '</b></div>';
  }
  function renderHeartQuestion() {
    var m = st();
    if (!m || m.mode !== 'heart') return;
    var q = m.qs[m.idx];
    setHtml('<div class="mq-wrap" data-t="moqi-heart-play">'
      + heartProg(m)
      + '<div class="mq-turn">📱 现在由 <b>' + esc(nameOf(m.answerer)) + '</b> 亲口选择（' + esc(nameOf(m.guesser)) + ' 先别看屏幕）</div>'
      + '<div class="mq-q">' + esc(q.q) + '</div>'
      + '<div class="mq-opts">' + optButtons(q) + '</div>'
      + '<div class="mq-foot">选好后把手机递给对方 👉</div>'
      + '</div>');
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function renderHeartGuess() {
    var m = st();
    if (!m || m.mode !== 'heart') return;
    var q = m.qs[m.idx];
    setHtml('<div class="mq-wrap" data-t="moqi-heart-guess">'
      + '<div class="mq-banner">已记录 ✓ 把手机交给 <b>' + esc(nameOf(m.guesser)) + '</b></div>'
      + heartProg(m)
      + '<div class="mq-turn">🔮 现在轮到 <b>' + esc(nameOf(m.guesser)) + '</b> 猜：<b>' + esc(nameOf(m.answerer)) + '</b> 会选哪个？</div>'
      + '<div class="mq-q">' + esc(q.q) + '</div>'
      + '<div class="mq-opts">' + optButtons(q) + '</div>'
      + '</div>');
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function renderHeartReveal() {
    var m = st();
    if (!m || m.mode !== 'heart') return;
    var q = m.qs[m.idx];
    var hit = m.guessIdx === m.answerIdx;
    var last = (m.idx + 1 >= m.total);
    setHtml('<div class="mq-wrap" data-t="moqi-heart-reveal">'
      + heartProg(m)
      + '<div class="mq-verdict ' + (hit ? 'hit' : 'miss') + '">' + (hit ? '💞 心有灵犀 +1' : '🌤️ 差一点点') + '</div>'
      + '<div class="mq-answer"><span class="dot"></span><span>' + esc(nameOf(m.answerer)) + ' 的真实选择</span><b>' + esc(q.o[m.answerIdx]) + '</b></div>'
      + '<div class="mq-answer guess"><span class="dot"></span><span>' + esc(nameOf(m.guesser)) + ' 的猜测</span><b>' + esc(q.o[m.guessIdx]) + '</b></div>'
      + '<button class="mq-btn" data-t="moqi-next" onclick="v17MoqiNext()">' + (last ? '查看结果 ›' : '下一题 ›') + '</button>'
      + '</div>');
  }

  /* ================= 心有灵犀：结算 ================= */
  function heartTier(p) {
    if (p <= 40) return { n: '🌱 还需要多聊聊', t: '别急，默契是慢慢聊出来的。下次多问一句「你怎么想」，就会更懂对方一点。' };
    if (p <= 60) return { n: '🌤️ 渐入佳境', t: '已经开始能猜到对方的心思啦。多留意 TA 的小习惯，你们会越来越准。' };
    if (p <= 80) return { n: '💞 心有灵犀', t: '大部分答案都想到一块儿去了。有些默契不用说出来，它自己会冒出来。' };
    return { n: '🔥 灵魂伴侣', t: '几乎全中，你们大概共用一个脑回路。这份默契值得截图纪念一下。' };
  }
  function settleHeart(m) {
    if (m.settled) return;
    m.settled = true;
    var pct = Math.round(m.hits / m.total * 100);
    try {
      var d = loadData();
      d.heart.best = Math.max(d.heart.best, pct);
      d.heart.last = pct;
      d.heart.plays = d.heart.plays + 1;
      d.heart.rounds = d.heart.rounds + m.total;
      d.heart.hits = d.heart.hits + m.hits;
      d.plays = d.plays + 1;
      d.lastAt = dateStr();
      d.lm = 'heart';
      saveData(d);
    } catch (e) { dbg(e); }
    try { coinAdd(m.hits); } catch (e) { dbg(e); }
    try { heatUp(); } catch (e) { dbg(e); }
    try { logEvent('💞 心有灵犀：默契度 ' + pct + '%（命中 ' + m.hits + '/' + m.total + '）'); } catch (e) { dbg(e); }
    try { v12SyncHome(); } catch (e) { dbg(e); }
    ding(); vib(60); fxBurst(30);
  }
  function renderHeartResult() {
    var m = st();
    if (!m || m.mode !== 'heart') return;
    var pct = Math.round(m.hits / m.total * 100);
    var tier = heartTier(pct);
    var d = loadData();
    setHtml('<div class="mq-wrap mq-result" data-t="moqi-result">'
      + '<div class="mq-hd" style="text-align:center"><h2>💞 本轮默契度</h2></div>'
      + '<div class="mq-pct">' + pct + '%</div>'
      + '<div class="mq-sub2">命中 <b style="color:var(--v12-ink)">' + m.hits + '</b> / ' + m.total + ' 题</div>'
      + '<div class="mq-tier">' + tier.n + '</div>'
      + '<div class="mq-comment">' + tier.t + '</div>'
      + '<div class="mq-statrow">'
      + '<div class="mq-stat"><b>' + m.hits + '</b><span>命中</span></div>'
      + '<div class="mq-stat"><b>' + (m.total - m.hits) + '</b><span>未中</span></div>'
      + '<div class="mq-stat"><b>' + pct + '%</b><span>默契度</span></div>'
      + '</div>'
      + '<button class="mq-btn" data-t="moqi-replay" onclick="v17MoqiReplay()">🔁 再来一轮</button>'
      + '<button class="mq-btn ghost" data-t="moqi-swap" onclick="v17MoqiSwap()">🎲 换题</button>'
      + '<button class="mq-btn ghost" data-t="moqi-home" onclick="v17MoqiHome()">🏠 返回大厅</button>'
      + '<div class="mq-foot">💰 亲密币 +' + m.hits + ' · 默契档案已更新（历史最佳 ' + d.heart.best + '%）</div>'
      + '</div>');
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function startHeart(total) {
    v17MoqiStop();
    total = parseInt(total, 10);
    if ([5, 8, 10].indexOf(total) < 0) total = 8;
    _setup.mode = 'heart'; _setup.rounds = total;
    var m = {
      mode: 'heart', total: total,
      qs: shuffle(QS.slice()).slice(0, total),
      idx: 0, hits: 0, phase: 'answer',
      answerIdx: -1, guessIdx: -1,
      answerer: 'him', guesser: 'her',
      settled: false
    };
    window._v17Moqi = m;
    renderHeartQuestion();
  }
  function v17MoqiOpt(i) {
    var m = st();
    if (!m || m.mode !== 'heart') return;
    i = parseInt(i, 10);
    if (!(i >= 0 && i <= 3)) return;
    if (m.phase === 'answer') {
      m.answerIdx = i; m.phase = 'guess';
      ding();
      renderHeartGuess();
    } else if (m.phase === 'guess') {
      m.guessIdx = i; m.phase = 'reveal';
      if (i === m.answerIdx) { m.hits++; ding(); vib(50); } else { buzz(); }
      renderHeartReveal();
    }
  }
  function v17MoqiNext() {
    var m = st();
    if (!m || m.mode !== 'heart' || m.phase !== 'reveal') return;
    m.idx++;
    if (m.idx >= m.total) { finishHeart(); return; }
    m.phase = 'answer';
    m.answerIdx = -1; m.guessIdx = -1;
    m.answerer = (m.idx % 2 === 0) ? 'him' : 'her';
    m.guesser = other(m.answerer);
    renderHeartQuestion();
  }
  function finishHeart() {
    var m = st();
    if (!m || m.mode !== 'heart') return;
    settleHeart(m);
    renderHeartResult();
  }

  /* ================= 你说我猜：设置页 ================= */
  function renderGuessSetup() {
    ensureSetup();
    _setup.mode = 'guess';
    var durs = [60, 90, 120].map(function (x) {
      return '<button class="' + (_setup.dur === x ? 'on' : '') + '" data-t="guess-dur-' + x + '" onclick="v17MoqiDur(' + x + ')">' + x + ' 秒</button>';
    }).join('');
    var who = '<button class="' + (_setup.desc === 'him' ? 'on' : '') + '" data-t="guess-desc-him" onclick="v17MoqiDesc(\'him\')">' + esc(nameOf('him')) + ' 描述</button>'
      + '<button class="' + (_setup.desc === 'her' ? 'on' : '') + '" data-t="guess-desc-her" onclick="v17MoqiDesc(\'her\')">' + esc(nameOf('her')) + ' 描述</button>';
    setHtml('<div class="mq-wrap" data-t="moqi-guess-setup">'
      + '<div class="mq-hd"><h2>🗣️ 你说我猜</h2><p>不许说词里的字，看 TA 能不能猜到</p></div>'
      + '<div class="mq-sec">① 选择时长</div>'
      + '<div class="mq-seg">' + durs + '</div>'
      + '<div class="mq-sec">② 谁负责描述</div>'
      + '<div class="mq-seg two">' + who + '</div>'
      + '<div class="mq-card" style="margin-top:14px"><div style="font-size:13px;line-height:1.9;color:var(--v12-dim)">描述的人<b style="color:var(--v12-ink)">不能说出词语里的任何一个字</b>（含谐音、英文、拼写），但可以描述、举例、做动作。<br>猜对点「✅ 猜对了」，卡住就「⏭ 跳过」，跳过不扣分。</div></div>'
      + '<button class="mq-btn" data-t="moqi-start" onclick="v17MoqiBegin()">开始计时 ›</button>'
      + '<button class="mq-btn ghost" data-t="moqi-back" onclick="v17MoqiEntry()">‹ 返回</button>'
      + '</div>');
  }

  /* ================= 你说我猜：进行中 ================= */
  function renderGuessPlay() {
    var m = st();
    if (!m || m.mode !== 'guess') return;
    setHtml('<div class="mq-wrap" id="mqGuessWrap" data-t="moqi-guess-play">'
      + '<div class="mq-timer-row"><span style="font-size:16px">⏱</span><div class="mq-timebar"><i id="mqBar" style="width:100%"></i></div><b class="mq-clock" id="mqTimer" data-t="guess-timer">' + m.total + '</b></div>'
      + '<div class="mq-role">🗣️ <b>' + esc(nameOf(m.describer)) + '</b> 描述 · 🙋 <b>' + esc(nameOf(other(m.describer))) + '</b> 猜</div>'
      + '<div class="mq-word" id="mqWord" data-t="guess-word">准备…</div>'
      + '<div class="mq-guessbtns">'
      + '<button class="mq-btn hit" data-t="guess-hit" onclick="v17MoqiGuessHit()">✅ 猜对了</button>'
      + '<button class="mq-btn skip" data-t="guess-skip" onclick="v17MoqiGuessSkip()">⏭ 跳过</button>'
      + '</div>'
      + '<div class="mq-tally">猜对 <b id="mqHits">0</b> 个 · 跳过 <b id="mqSkips">0</b> 个</div>'
      + '<button class="mq-mini" data-t="guess-end" onclick="v17MoqiGuessEnd()">🔚 换人 / 结束</button>'
      + '</div>');
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function syncGuessTally() {
    var m = st(); if (!m) return;
    var h = document.getElementById('mqHits');
    var s = document.getElementById('mqSkips');
    if (h) h.textContent = String(m.hits);
    if (s) s.textContent = String(m.skips);
  }
  function updateGuessTimerUI() {
    var m = st(); if (!m) return;
    var bar = document.getElementById('mqBar');
    var tl = document.getElementById('mqTimer');
    var wrap = document.getElementById('mqGuessWrap');
    var left = Math.max(0, m.leftMs);
    if (bar) bar.style.width = (m.totalMs ? Math.max(0, Math.min(100, left / m.totalMs * 100)) : 0) + '%';
    if (tl) tl.textContent = String(Math.ceil(left / 1000));
    if (wrap) {
      if (left <= 10000) wrap.classList.add('danger');
      else wrap.classList.remove('danger');
    }
  }
  function nextGuessWord() {
    var m = st(); if (!m) return '';
    if (!m.bag || !m.bag.length) {
      m.bag = shuffle(WORDS.slice());
      if (m.bag.length > 1 && m.bag[m.bag.length - 1] === m.word) {
        var t = m.bag[m.bag.length - 1];
        m.bag[m.bag.length - 1] = m.bag[0];
        m.bag[0] = t;
      }
    }
    var w = m.bag.pop();
    m.word = w;
    var el = document.getElementById('mqWord');
    if (el) el.textContent = w;
    return w;
  }
  function guessTick() {
    var m = st();
    if (!m || m.mode !== 'guess' || !m.running || m.ended) return;
    try { if (typeof curGame !== 'undefined' && curGame !== 'moqi') { v17MoqiStop(); return; } } catch (e) {}
    var now = Date.now();
    var d = now - m.lastTs;
    m.lastTs = now;
    if (!m.paused) {
      m.leftMs -= d;
      if (m.leftMs <= 10000 && !m.warned) { m.warned = true; buzz(); }
      if (m.leftMs <= 0) {
        m.leftMs = 0;
        updateGuessTimerUI();
        finishGuess(false);
        return;
      }
    }
    updateGuessTimerUI();
  }
  function startGuess(dur, desc) {
    v17MoqiStop();
    dur = parseInt(dur, 10);
    if (dur !== 60 && dur !== 90 && dur !== 120) dur = 60;
    desc = byNum(desc);
    _setup.mode = 'guess'; _setup.dur = dur; _setup.desc = desc;
    var m = {
      mode: 'guess', total: dur, totalMs: dur * 1000, leftMs: dur * 1000,
      hits: 0, skips: 0, describer: desc, word: '', bag: [],
      ended: false, running: true, paused: false, warned: false,
      timer: null, lastTs: Date.now(), used: 0, settled: false
    };
    window._v17Moqi = m;
    renderGuessPlay();
    nextGuessWord();
    updateGuessTimerUI();
    m.timer = setInterval(guessTick, 100);
  }
  function settleGuess(m) {
    if (m.settled) return;
    m.settled = true;
    var hits = m.hits, used = m.used;
    try {
      var d = loadData();
      d.guess.best = Math.max(d.guess.best, hits);
      d.guess.last = hits;
      d.guess.plays = d.guess.plays + 1;
      d.guess.describer = m.describer;
      d.guess.duration = m.total;
      d.plays = d.plays + 1;
      d.lastAt = dateStr();
      d.lm = 'guess';
      saveData(d);
    } catch (e) { dbg(e); }
    try { coinAdd(Math.min(hits, 12)); } catch (e) { dbg(e); }
    try { heatUp(); } catch (e) { dbg(e); }
    try { logEvent('🗣️ 你说我猜：猜对 ' + hits + ' 个（' + used + ' 秒）'); } catch (e) { dbg(e); }
    try { v12SyncHome(); } catch (e) { dbg(e); }
    ding(); vib(60); fxBurst(30);
  }
  function guessTier(h) {
    if (h >= 12) return { n: '🏆 天生一对', t: '12 个以上，这默契已经到了不用说话的程度。下次可以挑战闭眼比划。' };
    if (h >= 8) return { n: '💞 心有灵犀', t: '八个打底，你们的描述和联想几乎在一个频道上。' };
    if (h >= 4) return { n: '🌤️ 渐入佳境', t: '已经找到配合的节奏了，换个人描述会更好玩。' };
    return { n: '🌱 慢慢来', t: '别慌，先约定几个只有你们懂的暗号，下一轮就会顺很多。' };
  }
  function renderGuessResult() {
    var m = st();
    if (!m || m.mode !== 'guess') return;
    var tier = guessTier(m.hits);
    var d = loadData();
    setHtml('<div class="mq-wrap mq-result" data-t="guess-result">'
      + '<div class="mq-hd" style="text-align:center"><h2>🗣️ 本轮结果</h2></div>'
      + '<div class="mq-tier" style="margin-top:10px">' + tier.n + '</div>'
      + '<div class="mq-statrow">'
      + '<div class="mq-stat"><b data-t="guess-result-hits">' + m.hits + '</b><span>猜对</span></div>'
      + '<div class="mq-stat"><b data-t="guess-result-skips">' + m.skips + '</b><span>跳过</span></div>'
      + '<div class="mq-stat"><b data-t="guess-result-used">' + m.used + '</b><span>用时(秒)</span></div>'
      + '</div>'
      + '<div class="mq-comment">' + tier.t + '</div>'
      + '<button class="mq-btn" data-t="moqi-replay" onclick="v17MoqiReplay()">🔁 换人再来</button>'
      + '<button class="mq-btn ghost" data-t="moqi-home" onclick="v17MoqiHome()">🏠 返回大厅</button>'
      + '<div class="mq-foot">💰 亲密币 +' + Math.min(m.hits, 12) + ' · 历史最佳 ' + d.guess.best + ' 个</div>'
      + '</div>');
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function finishGuess(early) {
    var m = st();
    if (!m || m.mode !== 'guess' || m.ended) return;
    m.ended = true; m.running = false;
    if (m.timer) { clearInterval(m.timer); m.timer = null; }
    try { v12RingEnd(); } catch (e) {}
    m.leftMs = Math.max(0, m.leftMs);
    var used = Math.round((m.totalMs - m.leftMs) / 1000);
    if (used < 0) used = 0;
    if (used > m.total) used = m.total;
    if (early && used < 1) used = 1;
    m.used = used;
    if (!early) m.leftMs = 0;
    updateGuessTimerUI();
    settleGuess(m);
    renderGuessResult();
  }
  function v17MoqiGuessHit() {
    var m = st();
    if (!m || m.mode !== 'guess' || m.ended) return;
    m.hits++;
    syncGuessTally();
    nextGuessWord();
    ding(); vib(25);
  }
  function v17MoqiGuessSkip() {
    var m = st();
    if (!m || m.mode !== 'guess' || m.ended) return;
    m.skips++;
    syncGuessTally();
    nextGuessWord();
    try { sndSpin(); } catch (e) {}
  }
  function v17MoqiGuessEnd() {
    var m = st();
    if (!m || m.mode !== 'guess' || m.ended) return;
    var ok = false;
    try { ok = window.confirm('确定提前结束本轮吗？\n结束后可以在结算页「换人再来」。'); } catch (e) { ok = true; }
    if (!ok) return;
    finishGuess(true);
  }

  /* ================= 通用控制 ================= */
  function v17MoqiStop() {
    var m = window._v17Moqi;
    if (m && m.timer) {
      try { clearInterval(m.timer); } catch (e) {}
      m.timer = null;
    }
    window._v17Moqi = null;
    try { v12RingEnd(); } catch (e) {}
  }
  function v17MoqiReset() {
    v17MoqiStop();
    try { injectCSS(); } catch (e) {}
    renderEntry();
  }
  function v17MoqiStart() {
    v17MoqiStop();
    try { injectCSS(); } catch (e) {}
    renderEntry();
  }
  function v17MoqiEntry() {
    v17MoqiStop();
    renderEntry();
  }
  function v17MoqiPickMode(kind) {
    _setup.mode = (kind === 'guess') ? 'guess' : 'heart';
    try { injectCSS(); } catch (e) {}
    if (_setup.mode === 'guess') renderGuessSetup();
    else renderHeartSetup();
  }
  function v17MoqiRounds(n) {
    n = parseInt(n, 10);
    if ([5, 8, 10].indexOf(n) < 0) return;
    _setup.rounds = n;
    renderHeartSetup();
  }
  function v17MoqiDur(n) {
    n = parseInt(n, 10);
    if (n !== 60 && n !== 90 && n !== 120) return;
    _setup.dur = n;
    renderGuessSetup();
  }
  function v17MoqiDesc(who) {
    _setup.desc = byNum(who);
    renderGuessSetup();
  }
  function v17MoqiBegin() {
    ensureSetup();
    if (_setup.mode === 'guess') startGuess(_setup.dur, _setup.desc);
    else startHeart(_setup.rounds);
  }
  function v17MoqiReplay() {
    var m = st();
    if (!m) { renderEntry(); return; }
    if (m.mode === 'heart') startHeart(m.total);
    else startGuess(m.total, other(m.describer));
  }
  function v17MoqiSwap() {
    var m = st();
    if (m && m.mode === 'guess') renderGuessSetup();
    else renderHeartSetup();
  }
  function v17MoqiHome() {
    v17MoqiStop();
    try { goHome(); } catch (e) {}
  }

  /* ================= 注册与全局函数导出 ================= */
  function register() {
    try {
      if (typeof GAMES !== 'undefined') {
        var has = false;
        for (var i = 0; i < GAMES.length; i++) { if (GAMES[i] && GAMES[i].id === 'moqi') { has = true; break; } }
        if (!has) GAMES.push({ id: 'moqi', icon: '💞', name: '默契大考验', desc: '心有灵犀 / 你说我猜 · 看看你们多懂彼此' });
      }
    } catch (e) { dbg(e); }
    try {
      if (typeof RULES !== 'undefined') {
        RULES.moqi = '两个人轮流当出题人和读心人：心有灵犀里，一人先偷偷选答案，另一人猜 TA 选了什么；你说我猜里，一人描述词卡（不能说出词里的字），另一人抢答。每猜中一次都会给你们升温，结束后可以看看默契档案。';
      }
    } catch (e) { dbg(e); }
    try { if (typeof RESET_MAP !== 'undefined') RESET_MAP.moqi = 'v17MoqiReset'; } catch (e) { dbg(e); }
  }

  /* ================= 首页入口挂载 ================= */
  function mountHero() {
    try {
      var tiles = document.querySelector('.v12-tiles');
      if (tiles && !document.querySelector('[data-t="moqi-hero-card"]')) {
        tiles.insertAdjacentHTML('beforeend',
          '<div class="v12-tile" data-t="moqi-hero-card" onclick="startGame(\'moqi\')">'
          + '<div class="ic">💞</div><div class="nm">默契大考验</div>'
          + '<div class="ds">心有灵犀 / 你说我猜</div><div class="tag">NEW</div></div>');
      }
    } catch (e) { dbg(e); }
    try {
      var cards = document.querySelectorAll('#gameGrid .game-card');
      for (var i = 0; i < cards.length; i++) {
        var oc = cards[i].getAttribute('onclick') || '';
        if (oc.indexOf("startGame('moqi')") >= 0 && !cards[i].getAttribute('data-t')) {
          cards[i].setAttribute('data-t', 'moqi-grid-card');
        }
      }
    } catch (e) { dbg(e); }
  }
  function mountGridCard() {
    try {
      var grid = document.getElementById('gameGrid');
      if (!grid) return;
      var cards = grid.querySelectorAll('.game-card');
      for (var i = 0; i < cards.length; i++) {
        if ((cards[i].getAttribute('onclick') || '').indexOf("startGame('moqi')") >= 0) {
          if (!cards[i].getAttribute('data-t')) cards[i].setAttribute('data-t', 'moqi-grid-card');
          return;
        }
      }
      var html = '<div class="game-card" data-t="moqi-grid-card" onclick="startGame(\'moqi\')">'
        + '<span class="g-help" onclick="event.stopPropagation();showRules(\'moqi\')">?</span>'
        + '<div class="icon">💞</div><div class="name">默契大考验</div>'
        + '<div class="desc">心有灵犀 / 你说我猜 · 看看你们多懂彼此</div></div>';
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var node = tmp.firstChild;
      var last = grid.lastElementChild;
      var isUtility = !!(last && last !== node && last.querySelector && last.querySelector('.wheel-btn'));
      if (isUtility) grid.insertBefore(node, last);
      else grid.appendChild(node);
    } catch (e) { dbg(e); }
  }

  /* ================= 包装全局函数 ================= */
  function wrapGlobals() {
    try {
      if (typeof window.startGame === 'function' && !window.__V17_MOQI_WRAP_START) {
        var _startGame = window.startGame;
        window.startGame = function (id) {
          try { v17MoqiStop(); } catch (e) { dbg(e); }
          var r = _startGame.apply(this, arguments);
          if (id === 'moqi') {
            try { v17MoqiStart(); } catch (e) { dbg(e); }
          }
          return r;
        };
        window.__V17_MOQI_WRAP_START = true;
      }
    } catch (e) { dbg(e); }
    try {
      if (typeof window.goHome === 'function' && !window.__V17_MOQI_WRAP_HOME) {
        var _goHome = window.goHome;
        window.goHome = function () {
          try { v17MoqiStop(); } catch (e) { dbg(e); }
          return _goHome.apply(this, arguments);
        };
        window.__V17_MOQI_WRAP_HOME = true;
      }
    } catch (e) { dbg(e); }
    try {
      if (typeof window.renderHome === 'function' && !window.__V17_MOQI_WRAP_RHOME) {
        var _renderHome = window.renderHome;
        window.renderHome = function () {
          var r = _renderHome.apply(this, arguments);
          try { mountHero(); } catch (e) { dbg(e); }
          return r;
        };
        window.__V17_MOQI_WRAP_RHOME = true;
      }
    } catch (e) { dbg(e); }
  }

  /* ================= 切后台暂停计时 ================= */
  function onVisibility() {
    try {
      var m = st();
      if (!m || m.mode !== 'guess' || !m.running || m.ended) return;
      if (document.hidden) {
        m.paused = true;
        m.lastTs = Date.now();
        try { toast('⏸ 计时已暂停，回来再继续'); } catch (e) {}
      } else {
        m.lastTs = Date.now();
        m.paused = false;
        try { toast('▶️ 继续计时'); } catch (e) {}
      }
    } catch (e) { dbg(e); }
  }

  /* ================= 初始化 ================= */
  function init() {
    try { injectCSS(); } catch (e) { dbg(e); }
    register();
    mountHero();
    mountGridCard();
    wrapGlobals();
    try { document.addEventListener('visibilitychange', onVisibility, false); } catch (e) {}
  }

  /* 全局入口（内联 onclick 用） */
  window.v17MoqiStart = v17MoqiStart;
  window.v17MoqiStop = v17MoqiStop;
  window.v17MoqiReset = v17MoqiReset;
  window.v17MoqiEntry = v17MoqiEntry;
  window.v17MoqiPickMode = v17MoqiPickMode;
  window.v17MoqiRounds = v17MoqiRounds;
  window.v17MoqiDur = v17MoqiDur;
  window.v17MoqiDesc = v17MoqiDesc;
  window.v17MoqiBegin = v17MoqiBegin;
  window.v17MoqiOpt = v17MoqiOpt;
  window.v17MoqiNext = v17MoqiNext;
  window.v17MoqiReplay = v17MoqiReplay;
  window.v17MoqiSwap = v17MoqiSwap;
  window.v17MoqiHome = v17MoqiHome;
  window.v17MoqiGuessHit = v17MoqiGuessHit;
  window.v17MoqiGuessSkip = v17MoqiGuessSkip;
  window.v17MoqiGuessEnd = v17MoqiGuessEnd;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else {
    init();
  }
})();
