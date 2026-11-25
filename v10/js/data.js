/*  data.js — 卡池、姿势映射、视频清单
 *  依赖：data/cards.js 提供 window.CARDS
 */
(function (w) {
  "use strict";

  var POOLS = ["truth", "dare", "touch", "sync", "spark", "punish"];

  /* 关键词 → 姿势（与 clips/ 目录一致） */
  var RULES = [
    [/口|含|舔|吞|深喉|嘴|脸/, "kneel"],
    [/跪|趴/, "kneel"],
    [/墙|玄关|门|抵|壁咚/, "wall"],
    [/后|顶|背对|背后|撞/, "behind"],
    [/骑|跨坐|坐上去|在上|坐好/, "straddle"],
    [/侧|贴着|抱|贴/, "spoon"],
    [/压|身下|躺/, "ontop"],
    [/站/, "stand"],
    [/坐|面对面|看着|说|说话/, "face"]
  ];
  var POSE_NAMES = ["kneel", "wall", "behind", "straddle", "ontop", "spoon", "face", "stand", "rest"];

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function pickPose(text) {
    var t = String(text || "");
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t)) return RULES[i][1];
    return POSE_NAMES[hash(t) % POSE_NAMES.length];
  }

  function poolOf(card) { return card.pool || card.type || "truth"; }

  /* 卡片完整文本（用于姿势判定） */
  function textOf(card) {
    return [card.title, card.text, card.setup, card.line, card.escalate, card.reply, card.stop]
      .filter(Boolean).join(" ");
  }

  function clipFor(card, level) {
    var map = level === "explicit" ? (w.V10_CLIPS_X || {}) : (w.V10_CLIPS || {});
    var pose = pickPose(textOf(card));
    var list = map[pose] || [];
    if (!list.length) return null;
    var id = list[hash(card.id + pose) % list.length];
    return { pose: pose, id: id, src: (level === "explicit" ? "clips-x/" : "clips/") + id + ".mp4" };
  }

  function all() { return w.CARDS || {}; }

  function byPool(pool) {
    var c = all()[pool];
    return Array.isArray(c) ? c : [];
  }

  function count() {
    var n = 0;
    POOLS.forEach(function (p) { n += byPool(p).length; });
    return n;
  }

  w.Data = {
    POOLS: POOLS, POSE_NAMES: POSE_NAMES,
    pickPose: pickPose, poolOf: poolOf, textOf: textOf,
    clipFor: clipFor, byPool: byPool, count: count, hash: hash
  };
})(window);
