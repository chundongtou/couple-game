/* ===== V3 ui/pwa.js：PWA 注册 / 装到桌面入口 / 离线提示 / 版本更新 =====
 *
 * 对外 API：
 *   App.PWA.register()    —— app.js 启动时调用（幂等）
 *   App.PWA.showInstall() —— 任意屏幕可调用，打开「装到桌面」说明抽屉
 *   App.PWA.installed     —— 只读布尔（standalone / 本次会话已安装）
 *
 * 行为：
 *   · 仅 http/https 注册 ./sw.js（load 后）；file:// 静默跳过，不报错；
 *   · 捕获 beforeinstallprompt（preventDefault 存起来），有原生安装能力时
 *     右下角出现小胶囊「装到桌面」；iOS 没有 beforeinstallprompt，始终给出手动入口；
 *   · 已安装 / standalone 不显示胶囊；
 *   · 胶囊 z-index 400 < 抽屉 500，绝不挡弹层；
 *   · offline / online / appinstalled / SW 新版本就绪 各 toast 一次；
 *   · 不发起任何外部网络请求，不改任何游戏/引擎数据。
 */
(function () {
  var App = (window.App = window.App || {});

  var STATE = {
    booted: false,
    styleDone: false,
    deferred: null,      // beforeinstallprompt 事件（一次性）
    eligible: false,     // 本次会话曾经可安装（prompt 用掉后仍保留手动入口）
    installed: false,    // 本次会话内触发过 appinstalled
    online: (typeof navigator.onLine === "boolean" ? navigator.onLine : true),
    updateToasted: false,
    reg: null,
    pill: null
  };
  /* 右下角「装到桌面」胶囊已移除；安装说明 API 保留。 */
  var SHOW_PILL = false;

  /* ------------------------------------------------------------------ */
  /* 环境判断                                                            */
  /* ------------------------------------------------------------------ */
  function isHttp() {
    return location.protocol === "http:" || location.protocol === "https:";
  }

  function isStandalone() {
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
      if (window.matchMedia && window.matchMedia("(display-mode: fullscreen)").matches) return true;
    } catch (e) {}
    if (navigator.standalone === true) return true; // iOS 主屏启动
    return false;
  }

  function isInstalled() {
    return STATE.installed || isStandalone();
  }

  function isIOS() {
    var ua = String(navigator.userAgent || "");
    if (/iPad|iPhone|iPod/.test(ua)) return true;
    return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  }

  function platform() {
    var ua = String(navigator.userAgent || "");
    if (isIOS()) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  }

  function canPrompt() {
    return !!STATE.deferred;
  }

  /* ------------------------------------------------------------------ */
  /* toast 兜底                                                          */
  /* ------------------------------------------------------------------ */
  function toast(msg) {
    try {
      if (App.UI && App.UI.toast) App.UI.toast(msg);
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ */
  /* 样式（运行时注入一次，全部走 base.css 设计令牌）                    */
  /* ------------------------------------------------------------------ */
  var CSS = [
    /* 右下角小胶囊：不打扰、低于抽屉(z500) */
    ".pwa-pill{position:fixed;z-index:400;",
    "  right:calc(14px + env(safe-area-inset-right,0px));",
    "  bottom:calc(16px + var(--safe-b));",
    "  display:inline-flex;align-items:center;gap:7px;",
    "  min-height:46px;padding:0 16px 0 14px;border-radius:999px;",
    "  background:rgba(24,16,42,.84);border:1px solid var(--line2);",
    "  color:var(--dim);font-size:12px;font-weight:700;letter-spacing:.06em;",
    "  box-shadow:var(--sh-1);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);",
    "  opacity:0;transform:translateY(10px) scale(.96);pointer-events:none;",
    "  transition:opacity var(--t-mid) var(--ease-out),transform var(--t-mid) var(--ease-out),",
    "             color var(--t-fast),border-color var(--t-fast);",
    "  -webkit-user-select:none;user-select:none;}",
    ".pwa-pill i{font-style:normal;font-size:14px;line-height:1;}",
    ".pwa-pill.on{opacity:.94;transform:none;pointer-events:auto;}",
    ".pwa-pill:active{transform:scale(.95);}",
    ".pwa-pill:hover{color:var(--ink);border-color:rgba(243,200,121,.42);}",
    /* 安全词优先：play 屏右下角是「长按安全词」按钮，隐藏胶囊，绝不遮挡 */
    'body[data-screen="play"] .pwa-pill{display:none;}',
    "@media (max-width:340px){.pwa-pill{right:10px;bottom:12px;font-size:11.5px;min-height:44px;}}",
    /* 安装说明抽屉 */
    ".pwa-sheet .sheet-sub{margin-bottom:2px;}",
    ".pwa-steps{display:flex;flex-direction:column;gap:10px;margin-top:14px;}",
    ".pwa-step{display:flex;align-items:flex-start;gap:11px;",
    "  padding:12px 14px;border-radius:var(--r-md);",
    "  background:var(--glass);border:1px solid var(--line);}",
    ".pwa-step b{flex:0 0 auto;width:22px;height:22px;border-radius:50%;",
    "  display:inline-flex;align-items:center;justify-content:center;",
    "  font-size:11.5px;font-weight:800;color:#2a0f1c;",
    "  background:linear-gradient(135deg,var(--gold),var(--rose));}",
    ".pwa-step span{font-size:13px;line-height:1.62;color:var(--dim);}",
    ".pwa-step span em{font-style:normal;color:var(--ink);font-weight:700;}",
    ".pwa-note{margin-top:14px;font-size:11.5px;line-height:1.7;color:var(--dim2);",
    "  border-top:1px solid var(--line);padding-top:12px;}",
    ".pwa-sheet .btn{margin-top:16px;}"
  ].join("\n");

  function injectStyle() {
    if (STATE.styleDone) return;
    try {
      if (App.UI && App.UI.injectStyle) App.UI.injectStyle("pwa", CSS);
      STATE.styleDone = true;
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ */
  /* 右下角「装到桌面」胶囊                                              */
  /* ------------------------------------------------------------------ */
  function ensurePill() {
    if (!SHOW_PILL) return null;
    if (STATE.pill && document.body && document.body.contains(STATE.pill)) return STATE.pill;
    if (!document.body) return null;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pwa-pill";
    btn.setAttribute("data-test", "pwa-install-pill");
    btn.setAttribute("aria-label", "装到桌面");
    btn.innerHTML = '<i aria-hidden="true">📲</i><span>装到桌面</span>';
    btn.addEventListener("click", function () {
      if (isInstalled()) { toast("已经装到桌面了 · 从主屏打开即可"); return; }
      if (canPrompt()) promptInstall();
      else showInstall();
    });
    // 挂在 #app 里而不是 body：#app 是 position:fixed 的 stacking context，
    // 这样胶囊(z400)才会真正低于抽屉(.sheet-mask z500)，不会浮在弹层上面。
    var host = document.getElementById("app") || document.body;
    host.appendChild(btn);
    STATE.pill = btn;
    return btn;
  }

  function syncPill() {
    try {
      var btn = ensurePill();
      if (!btn) return;
      var visible = !isInstalled() && (canPrompt() || STATE.eligible || isIOS());
      if (visible) btn.classList.add("on");
      else btn.classList.remove("on");
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ */
  /* 原生安装提示                                                        */
  /* ------------------------------------------------------------------ */
  function promptInstall() {
    var ev = STATE.deferred;
    if (!ev) { showInstall(); return; }
    STATE.deferred = null; // beforeinstallprompt 只能 prompt 一次
    try {
      var p = ev.prompt();
      if (p && typeof p.then === "function") p["catch"](function () {});
      var choice = ev.userChoice;
      if (choice && typeof choice.then === "function") {
        choice.then(function (r) {
          if (r && r.outcome === "accepted") {
            toast("📲 正在安装…");
          } else {
            toast("已取消安装");
          }
          syncPill();
        })["catch"](function () {});
      }
    } catch (e) {
      showInstall(); // prompt 不可用时退回手动说明
    }
  }

  /* ------------------------------------------------------------------ */
  /* 手动安装说明抽屉                                                    */
  /* ------------------------------------------------------------------ */
  function stepsFor(p) {
    if (p === "ios") {
      return [
        '用 <em>Safari</em> 打开本页（微信 / QQ 内置浏览器不支持安装）',
        '点屏幕底部的 <em>⬆ 分享</em> 按钮',
        '在菜单里选 <em>「添加到主屏幕」</em>，再点右上角「添加」'
      ];
    }
    if (p === "android") {
      return [
        '点 Chrome 右上角的 <em>⋮</em> 菜单',
        '选 <em>「安装应用」</em>（部分机型叫「添加到主屏幕」）',
        '确认后桌面会出现 <em>「升温夜航」</em> 图标'
      ];
    }
    return [
      '点地址栏右侧的 <em>安装图标</em>（显示器 ⬇ / ⊕ 形状）',
      '在弹窗里选 <em>「安装」</em>',
      '之后从桌面 / 开始菜单打开，就是全屏 App'
    ];
  }

  function showInstall() {
    if (isInstalled()) { toast("已经装到桌面了 · 从主屏打开即可"); return; }
    var p = platform();
    var steps = stepsFor(p);
    var list = steps.map(function (s, i) {
      return '<div class="pwa-step"><b aria-hidden="true">' + (i + 1) + "</b><span>" + s + "</span></div>";
    }).join("");
    var actionLabel = canPrompt() ? "现在就装" : "知道了";
    var ref = null;
    try {
      ref = App.UI.sheet({
        title: "装到桌面",
        subtitle: "像 App 一样全屏打开 · 没有地址栏 · 离线也能继续夜航",
        cls: "pwa-sheet",
        html:
          '<div class="pwa-steps" data-test="pwa-install-sheet">' + list + "</div>" +
          '<div class="pwa-note">需要用 <b class="gold">https</b>（或本机 localhost）打开才支持安装；' +
          "iPad / iPhone 请用 Safari，安卓请用 Chrome。装好后数据仍在原浏览器里。</div>" +
          '<button class="btn primary wide" data-test="pwa-install-action">' + actionLabel + "</button>",
        onMount: function (panel, close) {
          var btn = panel.querySelector('[data-test="pwa-install-action"]');
          if (!btn) return;
          btn.addEventListener("click", function () {
            close();
            if (canPrompt()) promptInstall();
          });
        }
      });
    } catch (e) {
      return;
    }
    return ref;
  }

  /* ------------------------------------------------------------------ */
  /* Service Worker：注册 / 更新提示                                      */
  /* ------------------------------------------------------------------ */
  function notifyUpdateOnce() {
    if (STATE.updateToasted) return;
    STATE.updateToasted = true;
    toast("✨ 新版本已就绪，重开一次生效");
  }

  function watchUpdate(reg) {
    STATE.reg = reg;
    try {
      if (reg.waiting && navigator.serviceWorker.controller) notifyUpdateOnce();
      reg.addEventListener("updatefound", function () {
        var fresh = reg.installing;
        if (!fresh) return;
        fresh.addEventListener("statechange", function () {
          // 有 controller 才是「更新」而不是首次安装
          if (fresh.state === "installed" && navigator.serviceWorker.controller) notifyUpdateOnce();
        });
      });
    } catch (e) {}
  }

  function registerSW() {
    if (!isHttp()) return;                                   // file:// 等场景静默跳过
    if (!("serviceWorker" in navigator)) return;
    var go = function () {
      try {
        navigator.serviceWorker.register("./sw.js").then(function (reg) {
          watchUpdate(reg);
        })["catch"](function () {
          /* 注册失败（隐私策略 / 非安全上下文等）静默，不影响游戏 */
        });
      } catch (e) {}
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go);
  }

  /* ------------------------------------------------------------------ */
  /* 离线 / 联网 / 已安装 事件                                            */
  /* ------------------------------------------------------------------ */
  function bindEvents() {
    window.addEventListener("beforeinstallprompt", function (e) {
      try { e.preventDefault(); } catch (err) {}
      STATE.deferred = e;
      STATE.eligible = true;
      STATE.installed = false;
      syncPill();
    });

    window.addEventListener("appinstalled", function () {
      STATE.installed = true;
      STATE.deferred = null;
      toast("📲 已添加到桌面");
      syncPill();
    });

    window.addEventListener("offline", function () {
      if (STATE.online === false) return;
      STATE.online = false;
      toast("📴 已离线 · 夜航仍可继续");
    });

    window.addEventListener("online", function () {
      if (STATE.online === true) return;
      STATE.online = true;
      toast("🌐 已恢复联网");
    });
  }

  /* ------------------------------------------------------------------ */
  /* 初始化 + 对外 API                                                   */
  /* ------------------------------------------------------------------ */
  var PWA = {
    register: function () {
      if (STATE.booted) return;
      STATE.booted = true;
      injectStyle();
      ensurePill();
      syncPill();
      bindEvents();
      registerSW();
    },
    showInstall: showInstall,
    // 供屏幕/QA 使用的小工具
    platform: platform,
    canPrompt: canPrompt,
    isStandalone: isStandalone
  };

  // installed 用 getter：读 App.PWA.installed 永远是最新状态
  try {
    Object.defineProperty(PWA, "installed", {
      enumerable: true,
      get: function () { return isInstalled(); }
    });
  } catch (e) {
    PWA.installed = false;
  }

  App.PWA = PWA;
})();
