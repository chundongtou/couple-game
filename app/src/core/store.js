/* ===== V3 core/store.js：设置 / 存档 / 回忆册 / 导入导出 ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  var KEYS = {
    settings: "couple2.settings",
    session: "couple2.session",
    history: "couple2.history",
    pending: "couple2.pendingPastes"
  };
  var VER = 3;
  var DEFAULT_SETTINGS = {
    v: VER,
    maxStar: 3,
    length: "classic",
    sound: true,
    haptics: true,
    reduced: false,
    safeHold: true,
    blacklist: [],
    names: { a: "他", b: "她" }
  };

  function merge(base, patch) {
    var out = U.copy(base || {});
    Object.keys(patch || {}).forEach(function (k) {
      var v = patch[k];
      if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object") {
        out[k] = merge(out[k], v);
      } else {
        out[k] = v;
      }
    });
    return out;
  }

  var Store = (App.Store = {
    KEYS: KEYS,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,

    getSettings: function () {
      var s = U.storage.get(KEYS.settings, null) || {};
      var merged = merge(DEFAULT_SETTINGS, s);
      merged.v = VER;
      merged.maxStar = U.clamp(parseInt(merged.maxStar, 10) || 3, 1, 4);
      if (["quick", "classic", "deep"].indexOf(merged.length) < 0) merged.length = "classic";
      if (!Array.isArray(merged.blacklist)) merged.blacklist = [];
      merged.names = { a: merged.names && merged.names.a ? merged.names.a : "他", b: merged.names && merged.names.b ? merged.names.b : "她" };
      return merged;
    },
    saveSettings: function (patch) {
      var next = patch && patch.__full ? patch : merge(Store.getSettings(), patch || {});
      U.storage.set(KEYS.settings, next);
      App.Bus.emit("settings", next);
      return next;
    },
    resetSettings: function () {
      U.storage.set(KEYS.settings, DEFAULT_SETTINGS);
      return Store.getSettings();
    },

    getSession: function () {
      var s = U.storage.get(KEYS.session, null);
      if (!s || typeof s !== "object") return null;
      try {
        if (App.Engine && App.Engine.isLegacy && App.Engine.isLegacy(s)) {
          Store.addHistory(App.Engine.legacyEntry(s));
          U.storage.remove(KEYS.session);
          return null;
        }
        if (App.Engine && App.Engine.validate) s = App.Engine.validate(s);
        if (!s || !s.phase) {
          U.storage.remove(KEYS.session);
          return null;
        }
        return s;
      } catch (e) { return null; }
    },
    hasSession: function () {
      var s = Store.getSession();
      return !!(s && s.phase && s.phase !== "done");
    },
    saveSession: function (state) {
      var ok = U.storage.set(KEYS.session, state);
      App.Bus.emit("session", state);
      return ok;
    },
    clearSession: function () {
      U.storage.remove(KEYS.session);
      App.Bus.emit("session", null);
    },

    getHistory: function () {
      var list = U.storage.get(KEYS.history, []);
      return Array.isArray(list) ? list : [];
    },
    addHistory: function (entry) {
      var list = Store.getHistory();
      list.unshift(entry);
      if (list.length > 60) list = list.slice(0, 60);
      U.storage.set(KEYS.history, list);
      App.Bus.emit("history", list);
      return list;
    },
    removeHistory: function (id) {
      var list = Store.getHistory().filter(function (x) { return x.id !== id; });
      U.storage.set(KEYS.history, list);
      return list;
    },
    clearHistory: function () {
      U.storage.set(KEYS.history, []);
      App.Bus.emit("history", []);
    },

    consumePending: function () {
      var list = U.storage.get(KEYS.pending, []);
      U.storage.remove(KEYS.pending);
      return Array.isArray(list) ? list : [];
    },
    addPending: function (paste) {
      if (!paste) return [];
      var list = U.storage.get(KEYS.pending, []);
      if (!Array.isArray(list)) list = [];
      list.push(paste);
      if (list.length > 12) list = list.slice(-12);
      U.storage.set(KEYS.pending, list);
      return list;
    },
    exportAll: function () {
      return {
        app: "tonight-page",
        v: VER,
        exportedAt: new Date().toISOString(),
        settings: Store.getSettings(),
        session: U.storage.get(KEYS.session, null),
        history: Store.getHistory(),
        pending: U.storage.get(KEYS.pending, [])
      };
    },
    importAll: function (obj) {
      if (!obj || typeof obj !== "object") return { ok: false, msg: "文件格式不对" };
      var data = obj.data && typeof obj.data === "object" ? obj.data : obj;
      if (!data.settings && !data.session && !data.history) return { ok: false, msg: "找不到可恢复的数据" };
      try {
        if (data.settings) U.storage.set(KEYS.settings, merge(DEFAULT_SETTINGS, data.settings));
        if (Array.isArray(data.history)) U.storage.set(KEYS.history, data.history.slice(0, 60));
        if (Array.isArray(data.pending)) U.storage.set(KEYS.pending, data.pending.slice(0, 12));
        if (data.session && App.Engine && App.Engine.isLegacy && App.Engine.isLegacy(data.session)) {
          Store.addHistory(App.Engine.legacyEntry(data.session));
          U.storage.remove(KEYS.session);
        } else if (data.session) U.storage.set(KEYS.session, data.session);
        else U.storage.remove(KEYS.session);
        App.Bus.emit("settings", Store.getSettings());
        App.Bus.emit("history", Store.getHistory());
        return { ok: true, msg: "已恢复" };
      } catch (e) { return { ok: false, msg: "恢复失败" }; }
    },
    resetAll: function () {
      U.storage.remove(KEYS.settings);
      U.storage.remove(KEYS.session);
      U.storage.remove(KEYS.history);
      U.storage.remove(KEYS.pending);
      App.Bus.emit("settings", Store.getSettings());
      App.Bus.emit("history", []);
      App.Bus.emit("session", null);
    },
    // 回忆册条目
    makeHistoryEntry: function (state) {
      var r = state.resources || {};
      var res = state.result || {};
      var journal = !!(state.pages || state.kind === "journal");
      return {
        id: state.id || U.uid(),
        ts: state.ts || Date.now(),
        names: state.names,
        kind: journal ? "journal" : (state.kind || "voyage"),
        ending: res.endingId || "gentle",
        endingName: res.endingName || (journal ? "温柔合上" : "一段夜航"),
        stamp: res.stamp || res.endingName || "",
        heart: r.heart || 0, tension: r.tension || 0, sync: r.sync || 0,
        heat: state.heat || 0,
        imprint: state.imprint || 0,
        tape: state.tape || 0,
        pastes: state.pastes || state.completes || 0,
        peels: state.peels || state.skips || 0,
        stacks: state.stacks || 0,
        rounds: state.round || ((state.pastes || 0) + (state.peels || 0)),
        completes: state.pastes || state.completes || 0,
        skips: state.peels || state.skips || 0,
        maxCombo: state.maxCombo || state.stacks || 0,
        maxStar: state.maxStarSeen || 0,
        awards: (res.awards || []).map(function (a) { return a.name || a; }),
        note: journal ? (res.quote || "") : ""
      };
    }
  });
})();
