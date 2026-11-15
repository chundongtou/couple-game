/* ===== 今晚飞行棋：设置 / 存档 / 以前的夜 / 导入导出 ===== */
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
  var VER = 5;
  var SCALES = { gentle: 1, warm: 2, hot: 3, open: 4 };
  var COLORS = ["red", "yellow", "blue", "green"];
  var DEFAULT_SETTINGS = {
    v: VER,
    sound: true,
    haptics: true,
    reduced: false,
    names: { a: "他", b: "她" },
    blacklist: []
  };

  function merge(base, patch) {
    var out = U.copy(base || {});
    Object.keys(patch || {}).forEach(function (k) {
      var v = patch[k];
      if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) out[k] = merge(out[k], v);
      else out[k] = v;
    });
    return out;
  }

  function archiveApi() { return App.Archive || null; }
  function flightApi() { return App.Flight || null; }

  var legacyNote = null;

  function pushHistory(entry) {
    if (!entry) return Store.getHistory();
    var list = Store.getHistory();
    if (entry.id && list.some(function (x) { return x && x.id === entry.id; })) return list;
    list.unshift(entry);
    if (list.length > 60) list = list.slice(0, 60);
    U.storage.set(KEYS.history, list);
    if (App.Bus) App.Bus.emit("history", list);
    return list;
  }

  function rememberForeign(raw) {
    var A = archiveApi();
    var entry = A && A.archiveForeign ? A.archiveForeign(raw) : null;
    if (!entry) return null;
    pushHistory(entry);
    legacyNote = entry;
    return entry;
  }

  function cleanSettings(raw) {
    var merged = merge(DEFAULT_SETTINGS, raw || {});
    merged.v = VER;
    merged.names = {
      a: merged.names && String(merged.names.a || "").trim() ? String(merged.names.a).trim() : "他",
      b: merged.names && String(merged.names.b || "").trim() ? String(merged.names.b).trim() : "她"
    };
    merged.sound = merged.sound !== false;
    merged.haptics = merged.haptics !== false;
    merged.reduced = !!merged.reduced;
    if (!Array.isArray(merged.blacklist)) merged.blacklist = [];
    merged.blacklist = merged.blacklist.map(function (x) { return String(x || "").trim(); }).filter(Boolean);
    if (!SCALES[merged.scale]) delete merged.scale;
    if (merged.colors) {
      if (COLORS.indexOf(merged.colors.a) < 0 || COLORS.indexOf(merged.colors.b) < 0 || merged.colors.a === merged.colors.b) delete merged.colors;
    }
    if (merged.lastPlaneCount !== 2 && merged.lastPlaneCount !== 4) delete merged.lastPlaneCount;
    /* 公寓的 maxStar / gentleOnly 不作为本局尺度，也不自动开局。 */
    var oldCap = parseInt(raw && raw.maxStar, 10);
    if (!SCALES[merged.scale] && oldCap >= 1 && oldCap <= 4) {
      merged.suggestScale = ({ 1: "gentle", 2: "warm", 3: "hot", 4: "open" })[oldCap];
    }
    delete merged.maxStar;
    delete merged.gentleOnly;
    return merged;
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
      var raw = null;
      try { raw = U.storage.get(KEYS.settings, null); } catch (e) { raw = null; }
      return cleanSettings(raw || {});
    },

    saveSettings: function (patch) {
      var next = cleanSettings(merge(Store.getSettings(), patch || {}));
      if (patch && patch.scale && SCALES[patch.scale]) next.scale = patch.scale;
      if (patch && patch.colors) next.colors = patch.colors;
      if (patch && (patch.lastPlaneCount === 2 || patch.lastPlaneCount === 4)) next.lastPlaneCount = patch.lastPlaneCount;
      next = cleanSettings(next);
      var ok = U.storage.set(KEYS.settings, next);
      if (App.Bus) App.Bus.emit("settings", next);
      if (ok === false) return next;
      return Store.getSettings();
    },

    getSession: function () {
      var raw = null;
      try { raw = U.storage.get(KEYS.session, null); } catch (e) { return null; }
      if (!raw || typeof raw !== "object") return null;
      var A = archiveApi();
      if (A && A.isForeign && A.isForeign(raw)) {
        rememberForeign(raw);
        U.storage.remove(KEYS.session);
        if (App.Bus) App.Bus.emit("session", null);
        return null;
      }
      var F = flightApi();
      if (F && F.validate) {
        var valid = F.validate(raw);
        return valid;
      }
      return raw.kind === "flight" ? raw : null;
    },

    hasSession: function () {
      var s = Store.getSession();
      return !!(s && s.kind === "flight" && s.phase === "playing");
    },

    saveSession: function (state) {
      var F = flightApi();
      var valid = F && F.validate ? F.validate(state) : null;
      if (!valid) return { ok: false };
      var ok = U.storage.set(KEYS.session, valid);
      if (ok === false) return { ok: false };
      if (App.Bus) App.Bus.emit("session", valid);
      return { ok: true };
    },

    clearSession: function () {
      U.storage.remove(KEYS.session);
      if (App.Bus) App.Bus.emit("session", null);
    },

    getStandalone: function () {
      var s = U.storage.get(KEYS.standalone, null);
      if (!s || typeof s !== "object") return null;
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
      return pushHistory(entry);
    },

    clearHistory: function () {
      U.storage.set(KEYS.history, []);
      if (App.Bus) App.Bus.emit("history", []);
    },

    exportAll: function () {
      return {
        app: "couple-flight",
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
      if (!obj || typeof obj !== "object") return { ok: false, msg: "文件格式不对", error: { code: "IMPORT_INVALID", message: "文件格式不对" } };
      var data = obj.data && typeof obj.data === "object" ? obj.data : obj;
      var knownApp = !data.app || data.app === "couple-flight" || data.app === "couple-apartment" || data.app === "couple-voyage";
      if (!data.settings && !data.session && !data.history && !data.standalone) {
        return { ok: false, msg: "找不到可恢复的数据", error: { code: "IMPORT_INVALID", message: "找不到可恢复的数据" } };
      }
      if (!knownApp && !data.settings && !data.history) {
        return { ok: false, msg: "文件格式不对", error: { code: "IMPORT_INVALID", message: "文件格式不对" } };
      }
      if (data.session && data.session.kind === "flight") {
        var F = flightApi();
        if (!F || !F.validate || !F.validate(data.session)) {
          return { ok: false, msg: "这盘飞行棋读不出来，没有覆盖当前对局", error: { code: "IMPORT_REJECTED", message: "这盘飞行棋读不出来，没有覆盖当前对局" } };
        }
      }
      try {
        if (data.settings) U.storage.set(KEYS.settings, cleanSettings(data.settings));
        if (Array.isArray(data.history)) U.storage.set(KEYS.history, data.history.slice(0, 60));
        if (data.session && archiveApi() && archiveApi().isForeign(data.session)) {
          rememberForeign(data.session);
          U.storage.remove(KEYS.session);
        } else if (data.session && data.session.kind === "flight") {
          U.storage.set(KEYS.session, flightApi().validate(data.session));
        } else if (!data.session) {
          U.storage.remove(KEYS.session);
        }
        if (data.standalone && typeof data.standalone === "object") U.storage.set(KEYS.standalone, data.standalone);
        else U.storage.remove(KEYS.standalone);
        if (data.pending) U.storage.set(KEYS.pending, data.pending);
        else U.storage.remove(KEYS.pending);
        if (App.Bus) {
          App.Bus.emit("settings", Store.getSettings());
          App.Bus.emit("history", Store.getHistory());
          App.Bus.emit("session", Store.getSession());
        }
        return { ok: true, msg: "已恢复" };
      } catch (e) {
        return { ok: false, msg: "恢复失败", error: { code: "IMPORT_INVALID", message: "恢复失败" } };
      }
    },

    resetAll: function () {
      U.storage.remove(KEYS.settings);
      U.storage.remove(KEYS.session);
      U.storage.remove(KEYS.history);
      U.storage.remove(KEYS.standalone);
      U.storage.remove(KEYS.pending);
      legacyNote = null;
      if (App.Bus) {
        App.Bus.emit("settings", Store.getSettings());
        App.Bus.emit("history", []);
        App.Bus.emit("session", null);
      }
    },

    archiveForeign: function (raw) {
      return rememberForeign(raw);
    },

    makeHistoryEntry: function (state) {
      var ledger = (state && state.result) || (App.Flight && App.Flight.buildLedger ? App.Flight.buildLedger(state) : null);
      var endingName = "这局记下了";
      if (ledger && ledger.ending === "safe") endingName = "安全词收棋";
      else if (ledger && ledger.ending === "win-a") endingName = ((state.names && state.names.a) || "甲方") + " 先把飞机送回家";
      else if (ledger && ledger.ending === "win-b") endingName = ((state.names && state.names.b) || "乙方") + " 先把飞机送回家";
      return {
        id: (state && state.id) || U.uid(),
        ts: (ledger && ledger.endedAt) || (state && state.ts) || Date.now(),
        kind: "flight",
        title: "今晚飞行棋",
        names: state && state.names,
        endingName: endingName,
        note: "",
        safe: !!(ledger && ledger.ending === "safe"),
        ledger: ledger || undefined
      };
    }
  });
})();
