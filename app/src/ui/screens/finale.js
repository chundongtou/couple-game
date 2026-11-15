/* ===== 封底海报 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  function archive(s) {
    if (!s || s.archived) return s;
    try {
      App.Store.addHistory(App.Store.makeHistoryEntry(s));
      s.archived = true;
      App.Store.saveSession(s);
    } catch (e) {}
    return s;
  }

  function dots(page) {
    return (page.slots || []).map(function (slot) {
      var cls = "mini-dot";
      if (slot && slot.kind === "residue") cls += " glue";
      else if (slot && slot.kind !== "empty") cls += " on";
      return '<i class="' + cls + '"></i>';
    }).join("");
  }

  function drawPoster(s) {
    var c = document.createElement("canvas");
    c.width = 1080;
    c.height = 1620;
    var g = c.getContext("2d");
    g.fillStyle = "#f6efe4";
    g.fillRect(0, 0, 1080, 1620);
    g.strokeStyle = "#e2d4c0";
    g.strokeRect(48, 48, 984, 1524);
    g.fillStyle = "#2a241c";
    g.font = "700 42px sans-serif";
    g.fillText("今晚这一页", 120, 220);
    g.font = "500 32px sans-serif";
    g.fillStyle = "#6b5e4e";
    g.fillText((s.names.a || "") + "  ·  " + (s.names.b || ""), 120, 290);
    g.strokeStyle = "#c45c4a";
    g.lineWidth = 6;
    g.beginPath();
    g.arc(760, 520, 150, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#c45c4a";
    g.font = "800 40px sans-serif";
    g.textAlign = "center";
    var stamp = (s.result && (s.result.stamp || s.result.endingName)) || "轻轻合上";
    var lines = stamp.length > 4 ? [stamp.slice(0, 4), stamp.slice(4)] : [stamp];
    lines.forEach(function (line, i) { g.fillText(line, 760, 500 + i * 52); });
    g.textAlign = "left";
    g.fillStyle = "#2a241c";
    g.font = "500 30px sans-serif";
    var quote = (s.result && s.result.quote) || "";
    g.fillText(quote, 120, 760);
    g.fillStyle = "#6b5e4e";
    g.font = "500 28px sans-serif";
    var stats = s.result && s.result.stats || {};
    g.fillText("升温 " + (stats.heat || 0) + "    对页印 " + (stats.imprint || 0), 120, 860);
    g.fillText("贴上 " + (stats.pastes || 0) + "    撕掉 " + (stats.peels || 0) + "    叠贴 " + (stats.stacks || 0), 120, 920);
    (s.pages || []).forEach(function (page, pi) {
      g.fillStyle = "#6b5e4e";
      g.fillText(page.name, 120, 1060 + pi * 90);
      (page.slots || []).forEach(function (slot, i) {
        g.fillStyle = slot && slot.kind === "residue" ? "#e8d39a" : (slot && slot.kind !== "empty" ? "#c45c4a" : "#eadfce");
        g.fillRect(280 + i * 70, 1030 + pi * 90, 48, 36);
      });
    });
    return c;
  }

  function render(root, s) {
    var res = s.result || {};
    var rows = (s.pages || []).map(function (page) {
      return '<div class="small dim mt-8">' + U.escape(page.name) + '</div><div class="mini-row">' + dots(page) + "</div>";
    }).join("");
    root.innerHTML =
      '<div class="page book">' +
      '<div class="book-kicker">封底</div>' +
      '<div class="poster mt-16" data-test="finale-poster">' +
      '<div class="tape-title">今晚这一页</div>' +
      '<h1 class="spread-name" style="font-size:34px">' + U.escape(s.names.a) + "<br>" + U.escape(s.names.b) + "</h1>" +
      '<div style="display:flex;justify-content:flex-end;margin-top:-20px"><div class="stamp-seal" data-test="finale-stamp">' + U.escape(res.stamp || res.endingName || "轻轻合上") + "</div></div>" +
      '<p class="mt-12" style="font-size:16px;line-height:1.7">' + U.escape(res.quote || "") + "</p>" +
      '<p class="small muted mt-8">' + U.escape(res.text || "") + "</p>" +
      '<div class="margin-row mt-16">' +
      '<div class="margin-card"><em>升温</em><b>' + (res.stats ? res.stats.heat : s.heat) + "</b></div>" +
      '<div class="margin-card"><em>对页印</em><b>' + (res.stats ? res.stats.imprint : s.imprint) + "</b></div>" +
      '<div class="margin-card"><em>撕掉</em><b>' + (res.stats ? res.stats.peels : s.peels) + "</b></div></div>" +
      rows +
      '<div class="small dim mt-12">' + ((res.awards || []).map(function (a) { return U.escape(a.name); }).join(" · ") || "") + "</div>" +
      "</div>" +
      '<button class="btn primary wide mt-16" data-act="save" data-test="finale-save">保存海报</button>' +
      '<div class="row gap-8 mt-8">' +
      '<button class="btn ghost grow" data-act="memory">往期页</button>' +
      '<button class="btn soft grow" data-act="again" data-test="finale-again">再写一页</button></div>' +
      "</div>";
  }

  App.Screens = App.Screens || {};
  App.Screens.finale = {
    mount: function (root) {
      var s = null;
      try { s = App.Store.getSession(); } catch (e) {}
      if (!s || !s.result) {
        if (s && s.phase !== "poster") s = App.Engine.finish(s).state;
        if (s) App.Store.saveSession(s);
      }
      if (!s) { App.Router.reset("boot"); return; }
      s = archive(s);
      render(root, s);
      root.addEventListener("click", function (e) {
        var t = e.target.closest && e.target.closest("[data-act]");
        if (!t) return;
        var act = t.getAttribute("data-act");
        if (act === "save") {
          try {
            var canvas = drawPoster(App.Store.getSession() || s);
            var a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = "今晚这一页.png";
            document.body.appendChild(a);
            a.click();
            a.remove();
            App.UI.toast("海报已保存");
          } catch (err) { App.UI.toast("这台浏览器没能导出图片", { kind: "rose" }); }
        } else if (act === "memory") App.Router.go("memory");
        else if (act === "again") {
          App.Store.clearSession();
          App.Router.reset("setup");
        }
      });
    },
    unmount: function () {}
  };
})();
