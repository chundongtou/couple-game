/* ==========================================================================
 * 今晚飞行棋 · 规则开关
 * V6 冻结（docs/v6/impl-freeze.md §2.4）：
 *   - skipHomeEntryBlocksEntry = false：进航题「放过」仍进军（修 AUD-03，不惩罚放过）
 *   - skipStackKeepsBonusStep = true：叠机题「放过」仍得奖励步（修 AUD-03，不丢奖励）
 * 其余 A1 / A3 与 stackCapturedBySingle 仍是待确认口径，不是用户已批准的死规则。
 * 确认后只改这里的默认值；进行中的旧局按 state.rules 快照走（architecture §7.1）。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  /* 待确认：总控暂定口径，不得写成已批准规则。A2 两项已由 V6 冻结单拍板。 */
  var DEFAULTS = {
    rerollOnEverySix: true,          /* 待确认 A1 */
    chooseAmongLegalPieces: true,    /* 待确认 A1 */
    threeSixesPenalty: false,        /* 待确认 A1：true 时的罚则本轮不实现 */
    skipHomeEntryBlocksEntry: false, /* V6 冻结：false = 放过也进军 */
    skipStackKeepsBonusStep: true,   /* V6 冻结：true = 放过也保留叠机奖励步 */
    endingPromptSkippable: true,     /* 待确认 A2：V6 收尾卡默认可放过 */
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
