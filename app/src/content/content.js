/* =============================================================================
   今晚这一页 · 文案
   题库原文不在这里。这里只有对页、贴纸店、封底印章和奖项。
   结局数组顺序就是判定优先级。
   ========================================================================== */
(function () {
  function num(v) { return (typeof v === 'number' && isFinite(v)) ? v : 0; }
  function read(r, s, key) {
    if (r && typeof r[key] === 'number') return r[key];
    if (s && typeof s[key] === 'number') return s[key];
    return 0;
  }
  function flags(r, s) {
    if (r && r.flags) return r.flags;
    if (s && s.flags) return s.flags;
    return {};
  }
  function th() {
    var b = (typeof window !== 'undefined' && window.App && window.App.Balance) || {};
    return {
      peel: b.PEEL_STAMP || 6,
      heat: b.HEAT_STAMP || 32,
      imprint: b.IMPRINT_STAMP || 3
    };
  }

  window.CONTENT = {
    acts: [
      {
        id: 1,
        name: '热身',
        sub: '先把这一页暖起来',
        accent: '#c45c4a',
        intro: ['本子翻开。第一页还是空的，胶带就放在手边。'],
        outtro: { good: ['这一页贴得刚刚好。'], soft: ['空着的地方也没关系。'] }
      },
      {
        id: 2,
        name: '升温',
        sub: '贴纸开始靠在一起',
        accent: '#e0b15a',
        intro: ['翻过一页。温度带比刚才高一点。'],
        outtro: { good: ['第二页有了重量。'], soft: ['慢慢来，纸还热着。'] }
      },
      {
        id: 3,
        name: '靠近',
        sub: '这一页留给更近的话',
        accent: '#6e7a4f',
        intro: ['最后一页。贴满之后，封底就是今晚的海报。'],
        outtro: { good: ['三页都在。'], soft: ['合上就好。'] }
      }
    ],
    events: [],
    shop: {
      title: '贴纸店',
      sub: '用胶带段换一小件。不买也可以直接翻页。'
    },
    endings: [
      {
        id: 'safe',
        name: '合上本子',
        stamp: '合上本子',
        quote: '已经贴上的，都还在。',
        text: '页角的安全词被按住了。这一页就停在这里，不扣，也不评。',
        cond: function (r, s) { return !!(flags(r, s).safeWord); }
      },
      {
        id: 'peel',
        name: '撕掉较多',
        stamp: '胶痕也算数',
        quote: '揭走过的地方，留下一点胶。',
        text: '有些贴纸被撕下来了。胶痕留在纸上，不算错过，只是今晚的痕迹。',
        cond: function (r, s) { return read(r, s, 'peels') >= th().peel; }
      },
      {
        id: 'heat',
        name: '热度很高',
        stamp: '这一页是热的',
        quote: '温度带走到了靠上的地方。',
        text: '这一页的热度很高。封底盖一枚暖的印章。',
        cond: function (r, s) { return read(r, s, 'heat') >= th().heat; }
      },
      {
        id: 'close',
        name: '对贴很近',
        stamp: '对页很齐',
        quote: '两张贴纸一次次落到一起。',
        text: '对贴揭晓的时候，你们常常贴得很近。对页印留在页边上。',
        cond: function (r, s) { return read(r, s, 'imprint') >= th().imprint; }
      },
      {
        id: 'gentle',
        name: '温柔合上',
        stamp: '轻轻合上',
        quote: '这一页合得很轻。',
        text: '没有哪一枚印章特别响。本子合上，今晚就停在这一页。',
        cond: function () { return true; }
      }
    ],
    awards: [
      { id: 'stacked', name: '叠了一层', icon: '叠', cond: function (r, s) { return read(r, s, 'stacks') >= 1; } },
      { id: 'close', name: '对页很齐', icon: '印', cond: function (r, s) { return read(r, s, 'imprint') >= th().imprint; } },
      { id: 'warm', name: '这一页是热的', icon: '温', cond: function (r, s) { return read(r, s, 'heat') >= th().heat; } },
      { id: 'kept', name: '贴住了', icon: '贴', cond: function (r, s) { return read(r, s, 'pastes') >= 6; } },
      { id: 'together', name: '一起写下', icon: '页', cond: function () { return true; } },
      { id: 'page', name: '今晚这一页', icon: '页', cond: function () { return true; } }
    ]
  };

  void num;
})();
