/* ==========================================================================
 * 今晚飞行棋 · 规则开关
 * 默认值来自架构契约 §1。A1 / A2 / A3 与 stackCapturedBySingle 均为待确认，
 * 不是用户已批准的死规则。确认后只改这里的默认值。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  /* 待确认：总控暂定口径，不得写成已批准规则。 */
  var DEFAULTS = {
    rerollOnEverySix: true,          /* 待确认 A1 */
    chooseAmongLegalPieces: true,    /* 待确认 A1 */
    threeSixesPenalty: false,        /* 待确认 A1：true 时的罚则本轮不实现 */
    skipHomeEntryBlocksEntry: true,  /* 待确认 A2 */
    skipStackKeepsBonusStep: false,  /* 待确认 A2 */
    endingPromptSkippable: true,     /* 待确认 A2 */
    ledgerIncludeMoveReplay: false,  /* 待确认 A3 */
    stackCapturedBySingle: true      /* 待确认：按规格原文暂定，不是已立项疑点 */
  };

  function current() {
    var out = {};
    Object.keys(DEFAULTS).forEach(function (k) { out[k] = DEFAULTS[k]; });
    return out;
  }

  root.FlightRules = {
    DEFAULTS: DEFAULTS,
    current: current
  };
})(typeof window !== 'undefined' ? window : this);
