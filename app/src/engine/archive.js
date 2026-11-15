/* ==========================================================================
 * 今晚飞行棋 · 旧局归档
 * 进行中的夜航、进行中的公寓局收进「以前的夜」，不按新规则续玩。
 * ========================================================================== */
(function (global) {
  'use strict';

  var root = global.App = global.App || {};

  function isApartment(raw) {
    return !!(raw && typeof raw === 'object' && raw.kind === 'apartment');
  }

  function isLegacy(raw) {
    if (!raw || typeof raw !== 'object') return false;
    if (raw.kind === 'apartment' || raw.kind === 'flight') return false;
    if (raw.hand || raw.act || raw.tokens || raw.resources) return true;
    var ph = raw.phase;
    return !!(ph && ['draft', 'play', 'resolve', 'escalate', 'event', 'act', 'shop', 'finale'].indexOf(ph) >= 0);
  }

  function isForeign(raw) {
    return isApartment(raw) || isLegacy(raw);
  }

  function archiveForeign(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (isApartment(raw)) {
      var safe = !!(raw.flags && raw.flags.safeWord) || !!(raw.result && raw.result.safe);
      return {
        id: raw.id || ('apt-' + (raw.ts || 0)),
        ts: raw.ts || Date.now(),
        kind: 'apartment',
        title: '今晚在这间公寓',
        names: raw.names || undefined,
        endingName: safe ? '先回去关灯' : '未走完的公寓',
        note: '已收进以前的夜，不按今晚飞行棋续玩',
        safe: safe,
        imported: true
      };
    }
    if (isLegacy(raw)) {
      var res = raw.resources || {};
      var result = raw.result || {};
      var done = raw.phase === 'finale';
      return {
        id: raw.id || ('legacy-' + (raw.ts || 0)),
        ts: raw.ts || Date.now(),
        kind: 'voyage',
        title: '以前的夜航',
        endingName: result.endingName || (done ? '已靠岸' : '未走完的夜航'),
        note: '这是升温夜航的记录，已收进以前的夜，不会继续，也不会在这间公寓里继续。',
        heart: res.heart || 0,
        tension: res.tension || 0,
        sync: res.sync || 0,
        rounds: raw.round || 0,
        safe: !!(raw.flags && raw.flags.safeWord),
        imported: true,
        rooms: []
      };
    }
    return null;
  }

  root.Archive = {
    isApartment: isApartment,
    isLegacy: isLegacy,
    isForeign: isForeign,
    archiveForeign: archiveForeign
  };
})(typeof window !== 'undefined' ? window : this);
