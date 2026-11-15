/* ===== 公寓夜：设置 / 存档 / 以前的夜 / 导入导出 ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  var KEYS = {
    settings: "couple2.settings",
    session: "couple2.session",
    history: "couple2.history",
    standalone: "couple2.standalone",
    pending: "couple2.pending"
  };
  var VER = 4;
  var DEFAULT_SETTINGS = {
    v: VER,
    maxStar: 3,
    sound: true,
    haptics: true,
    reduced: false,
    gentleOnly: false,
    blacklist: [],
    names: { a: "他", b: "她" }
  };

  function merge(base, patch) {
    var out = U.copy(base || {});
    Object.keys(patch || {}).forEach(function (k) {
      var v = patch[k];
      if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object") out[k] = merge(out[k], v);
      else out[k] = v;
    });
    return out;
  }

  function engine() { return App.Engine || null; }

  var legacyNote = null;

  function archiveLegacy(raw) {
    var E = engine();
    var entry = E && E.archiveLegacy ? E.archiveLegacy(raw) : {
      id: raw.id || U.uid(),
      ts: raw.ts || Date.now(),
      kind: "voyage",
      title: "以前的夜航",
      endingName: "未走完的夜航",
      note: "这是升温夜航的记录，已收进以前的夜，不会在这间公寓里继续。",
      imported: true,
      rooms: []
    };
    var list = U.storage.get(KEYS.history, []);
    if (!Array.isArray(list)) list = [];
    if (!list.some(function (x) { return x && x.id === entry.id; })) {
      list.unshift(entry);
      if (list.length > 60) list = list.slice(0, 60);
      U.storage.set(KEYS.history, list);
      if (App.Bus) App.Bus.emit("history", list);
    }
    legacyNote = entry;
    return entry;
  }

  var Store = (App.Store = {
    KEYS: KEYS,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,

    takeLegacyNote: function () {
      var n = legacyNote;
      legacyNote = null;
      return n;
    },

    getSettings: function () {
      var s = U.storage.get(KEYS.settings, null) || {};
      var merged = merge(DEFAULT_SETTINGS, s);
      merged.v = VER;
      merged.maxStar = U.clamp(parseInt(merged.maxStar, 10) || 3, 1, 4);
      if (!Array.isArray(merged.blacklist)) merged.blacklist = [];
      merged.names = {
        a: merged.names && merged.names.a ? String(merged.names.a) : "他",
        b: merged.names && merged.names.b ? String(merged.names.b) : "她"
      };
      merged.sound = merged.sound !== false;
      merged.haptics = merged.haptics !== false;
      merged.reduced = !!merged.reduced;
      merged.gentleOnly = !!merged.gentleOnly;
      return merged;
    },
    saveSettings: function (patch) {
      var next = patch && patch.__full ? patch : merge(Store.getSettings(), patch || {});
      next.v = VER;
      U.storage.set(KEYS.settings, next);
      if (App.Bus) App.Bus.emit("settings", next);
      return Store.getSettings();
    },
    resetSettings: function () {
      U.storage.set(KEYS.settings, DEFAULT_SETTINGS);
      return Store.getSettings();
    },

    getSession: function () {
      var raw = U.storage.get(KEYS.session, null);
      if (!raw || typeof raw !== "object") return null;
      var E = engine();
      try {
        if (E && E.isLegacy && E.isLegacy(raw)) {
          archiveLegacy(raw);
          U.storage.remove(KEYS.session);
          if (App.Bus) App.Bus.emit("session", null);
          return null;
        }
        if (E && E.validate) return E.validate(raw);
      } catch (e) { return null; }
      return raw && raw.kind === "apartment" ? raw : null;
    },
    hasSession: function () {
      var s = Store.getSession();
      return !!(s && s.phase && s.phase !== "done" && s.mode !== "standalone");
    },
    saveSession: function (state) {
      var ok = U.storage.set(KEYS.session, state);
      if (App.Bus) App.Bus.emit("session", state);
      return ok;
    },
    clearSession: function () {
      U.storage.remove(KEYS.session);
      if (App.Bus) App.Bus.emit("session", null);
    },

    getStandalone: function () {
      var s = U.storage.get(KEYS.standalone, null);
      if (!s || s.kind !== "apartment") return null;
      return s;
    },
    saveStandalone: function (state) {
      U.storage.set(KEYS.standalone, state);
      return state;
    },
    clearStandalone: function () { U.storage.remove(KEYS.standalone); },

    getPending: function () { return U.storage.get(KEYS.pending, null); },
    setPending: function (pack) { U.storage.set(KEYS.pending, pack); return pack; },
    takePending: function () {
      var p = Store.getPending();
      U.storage.remove(KEYS.pending);
      return p;
    },

    getHistory: function () {
      var list = U.storage.get(KEYS.history, []);
      return Array.isArray(list) ? list : [];
    },
    addHistory: function (entry) {
      var list = Store.getHistory();
      if (entry && entry.id && list.some(function (x) { return x.id === entry.id; })) return list;
      list.unshift(entry);
      if (list.length > 60) list = list.slice(0, 60);
      U.storage.set(KEYS.history, list);
      if (App.Bus) App.Bus.emit("history", list);
      return list;
    },
    updateHistory: function (id, patch) {
      var list = Store.getHistory().map(function (x) {
        if (!x || x.id !== id) return x;
        var next = U.copy(x);
        Object.keys(patch || {}).forEach(function (k) { next[k] = patch[k]; });
        return next;
      });
      U.storage.set(KEYS.history, list);
      return list;
    },
    removeHistory: function (id) {
      var list = Store.getHistory().filter(function (x) { return x.id !== id; });
      U.storage.set(KEYS.history, list);
      return list;
    },
    clearHistory: function () {
      U.storage.set(KEYS.history, []);
      if (App.Bus) App.Bus.emit("history", []);
    },

    exportAll: function () {
      return {
        app: "couple-apartment",
        v: VER,
        exportedAt: new Date().toISOString(),
        settings: Store.getSettings(),
        session: U.storage.get(KEYS.session, null),
        history: Store.getHistory(),
        standalone: Store.getStandalone(),
        pending: Store.getPending()
      };
    },
    importAll: function (obj) {
      if (!obj || typeof obj !== "object") return { ok: false, msg: "文件格式不对" };
      var data = obj.data && typeof obj.data === "object" ? obj.data : obj;
      if (!data.settings && !data.session && !data.history && !data.standalone) {
        return { ok: false, msg: "找不到可恢复的数据" };
      }
      try {
        if (data.settings) U.storage.set(KEYS.settings, merge(DEFAULT_SETTINGS, data.settings));
        if (Array.isArray(data.history)) U.storage.set(KEYS.history, data.history.slice(0, 60));
        var E = engine();
        if (data.session && E && E.isLegacy && E.isLegacy(data.session)) {
          archiveLegacy(data.session);
          U.storage.remove(KEYS.session);
        } else if (data.session) {
          U.storage.set(KEYS.session, data.session);
        } else {
          U.storage.remove(KEYS.session);
        }
        if (data.standalone && data.standalone.kind === "apartment") U.storage.set(KEYS.standalone, data.standalone);
        else U.storage.remove(KEYS.standalone);
        if (data.pending) U.storage.set(KEYS.pending, data.pending);
        if (App.Bus) {
          App.Bus.emit("settings", Store.getSettings());
          App.Bus.emit("history", Store.getHistory());
          App.Bus.emit("session", Store.getSession());
        }
        return { ok: true, msg: "已恢复" };
      } catch (e) { return { ok: false, msg: "恢复失败" }; }
    },
    resetAll: function () {
      U.storage.remove(KEYS.settings);
      U.storage.remove(KEYS.session);
      U.storage.remove(KEYS.history);
      U.storage.remove(KEYS.standalone);
      U.storage.remove(KEYS.pending);
      if (App.Bus) {
        App.Bus.emit("settings", Store.getSettings());
        App.Bus.emit("history", []);
        App.Bus.emit("session", null);
      }
    },
    makeHistoryEntry: function (state) {
      var mem = state.result || (engine() && App.Engine.buildMemory ? App.Engine.buildMemory(state) : {});
      var rooms = mem.rooms || [];
      return {
        id: state.id || U.uid(),
        ts: state.ts || Date.now(),
        kind: "apartment",
        title: "今晚在这间公寓",
        names: state.names,
        heat: state.heat || 0,
        intensity: state.settings && state.settings.maxStar,
        intensityName: mem.intensityName || "",
        rooms: rooms,
        moments: (state.log || []).length,
        endingName: mem.safe ? "先回去关灯" : "灯关掉了",
        note: "",
        safe: !!mem.safe,
        line: mem.line || "",
        clock: mem.clock || ""
      };
    }
  });
})();
