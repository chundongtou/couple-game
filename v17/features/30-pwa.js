/* ============================================================================
 * V17 · 功能 C：离线安装（PWA）+ 分享信息
 * 文件：v17/features/30-pwa.js（构建时拼进 index.html 注入区，运行时注入 CSS / DOM）
 *
 * 做四件事，且不改动任何游戏逻辑、不发起任何外部网络请求：
 *  1. http/https 下注册 ./sw.js（离线可玩、发新版不锁死旧缓存）；file:// 静默跳过。
 *  2. 首页设置条 #setBar 末尾追加「📲 装到桌面」胶囊（包装 renderSettings，判重）。
 *  3. 点击安装：有 beforeinstallprompt 就原生弹窗，否则 openModal 各平台安装方法。
 *  4. appinstalled / SW 新版本就绪 / 离线 / 联网 的轻提示。
 *
 * 测试选择器：pwa-install-pill、pwa-install-modal、pwa-install-action
 * ========================================================================== */
(function () {
  'use strict';

  var STATE = {
    deferred: null,        // beforeinstallprompt 事件（一次性）
    installed: false,      // 本次会话内已确认安装
    online: (typeof navigator.onLine === 'boolean' ? navigator.onLine : true),
    updateToasted: false,  // 新版本提示同一会话只弹一次
    swReg: null,
    cssDone: false,
    initDone: false
  };

  /* --------------------------------------------------------------------- */
  /* 小工具                                                                */
  /* --------------------------------------------------------------------- */
  function safeToast(msg) {
    try {
      if (typeof window.toast === 'function') window.toast(msg);
    } catch (e) {}
  }

  function safeCloseModal() {
    try {
      if (typeof window.closeModal === 'function') window.closeModal();
    } catch (e) {}
  }

  function isStandalone() {
    try {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
      if (window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches) return true;
    } catch (e) {}
    if (navigator.standalone === true) return true; // iOS Safari「添加到主屏幕」
    return STATE.installed;
  }

  function getPlatform() {
    var ua = String(navigator.userAgent || '');
    var iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (iOS) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return 'desktop';
  }

  /* --------------------------------------------------------------------- */
  /* 1) CSS（运行时注入，只写一次）                                          */
  /* --------------------------------------------------------------------- */
  var CSS = [
    /* 设置条胶囊：沿用 .tb-item 的形状，只加一点渐变高亮 */
    '#setBar .tb-item.v17-pwa-pill{font-weight:700;color:var(--v12-ink);',
    'border-color:rgba(255,45,149,.42);',
    'background:linear-gradient(135deg,rgba(255,45,149,.16),rgba(139,92,246,.18));}',
    '#setBar .tb-item.v17-pwa-pill:active{transform:scale(.96);}',
    '#setBar .tb-item.v17-pwa-pill.done{color:#34d399;border-color:rgba(52,211,153,.42);background:rgba(52,211,153,.10);}',
    'body.light #setBar .tb-item.v17-pwa-pill.done,body.sketch #setBar .tb-item.v17-pwa-pill.done{color:#0b8f68;}',
    /* 安装方法弹窗 */
    '.v17-pwa-sub{font-size:12px;color:var(--v12-dim);line-height:1.65;margin:2px 0 8px;}',
    '.v17-pwa-steps{margin:0;padding:0;list-style:none;}',
    '.v17-pwa-steps li{position:relative;padding:9px 12px 9px 40px;margin:7px 0;border-radius:12px;',
    'background:var(--v12-surf);border:1px solid var(--v12-line);',
    'font-size:13px;line-height:1.55;color:var(--v12-ink);}',
    '.v17-pwa-steps li::before{content:attr(data-step);position:absolute;left:10px;top:50%;',
    'transform:translateY(-50%);width:20px;height:20px;line-height:20px;text-align:center;',
    'border-radius:50%;font-size:11px;font-weight:800;color:#fff;',
    'background:linear-gradient(135deg,var(--v12-m),var(--v12-v));}',
    '.v17-pwa-tip{font-size:12px;color:var(--v12-dim);line-height:1.65;margin-top:10px;}',
    /* .modal .m-item 是 flex，这里提高选择器优先级改回块级，避免文字被拆成多列 */
    '.modal .m-item.v17-pwa-tip{display:block;}',
    '.v17-pwa-btns{display:flex;gap:8px;margin-top:12px;}',
    '.v17-pwa-btns .wheel-btn{flex:1;min-height:46px;font-size:13px;padding:10px 6px;line-height:1.3;}'
  ].join('');

  function injectCss() {
    if (STATE.cssDone) return;
    try {
      if (!document.getElementById('v17PwaStyle')) {
        var style = document.createElement('style');
        style.id = 'v17PwaStyle';
        style.type = 'text/css';
        if (style.styleSheet) style.styleSheet.cssText = CSS; // 老 IE 兜底（无碍）
        else style.appendChild(document.createTextNode(CSS));
        (document.head || document.documentElement).appendChild(style);
      }
      STATE.cssDone = true;
    } catch (e) {}
  }

  /* --------------------------------------------------------------------- */
  /* 2) 设置条「装到桌面」胶囊                                              */
  /* --------------------------------------------------------------------- */
  function pillHtml() {
    if (isStandalone()) {
      return '<span class="tb-item v17-pwa-pill done" data-t="pwa-install-pill"'
        + ' onclick="v17PwaInstallClick()">✅ 已安装</span>';
    }
    return '<span class="tb-item v17-pwa-pill" data-t="pwa-install-pill"'
      + ' onclick="v17PwaInstallClick()">📲 装到桌面</span>';
  }

  /* 幂等挂载：已存在就更新文案（安装状态可能变化），不存在才追加到末尾 */
  function mountPill() {
    try {
      var bar = document.getElementById('setBar');
      if (!bar) return;
      var old = bar.querySelector('[data-t="pwa-install-pill"]');
      if (old) {
        old.className = isStandalone() ? 'tb-item v17-pwa-pill done' : 'tb-item v17-pwa-pill';
        old.textContent = isStandalone() ? '✅ 已安装' : '📲 装到桌面';
        return;
      }
      bar.insertAdjacentHTML('beforeend', pillHtml());
    } catch (e) {}
  }

  /* 包装 renderSettings：#setBar 每次重渲染后补回胶囊（其它页面逻辑完全不动） */
  function wrapRenderSettings() {
    if (typeof window.renderSettings !== 'function') return;
    if (window.renderSettings.__v17PwaWrapped) return;
    var orig = window.renderSettings;
    var wrapped = function () {
      var ret = orig.apply(this, arguments);
      mountPill(); // 判重，重复调用安全
      return ret;
    };
    wrapped.__v17PwaWrapped = true;
    window.renderSettings = wrapped;
  }

  /* --------------------------------------------------------------------- */
  /* 3) 安装流程                                                            */
  /* --------------------------------------------------------------------- */
  function actionLabel() {
    return STATE.deferred ? '📲 现在就装' : '👍 知道了';
  }

  function helpHtml() {
    var platform = getPlatform();
    var steps;
    var foot;
    if (platform === 'ios') {
      steps = [
        '用 <b>Safari</b> 打开本页（微信 / QQ 内置浏览器不支持安装）',
        '点屏幕底部的 <b>⬆️ 分享</b> 按钮',
        '在菜单里选 <b>「添加到主屏幕」</b>，再点右上角「添加」'
      ];
      foot = '装好后桌面会出现「情侣升温」图标，点开即全屏。';
    } else if (platform === 'android') {
      steps = [
        '点 Chrome 右上角的 <b>⋮</b> 菜单',
        '选 <b>「安装应用」</b>（部分机型叫「添加到主屏幕」）',
        '确认后桌面会出现「情侣升温」图标'
      ];
      foot = '微信 / QQ 里打开的话，先点右上角「···」→「在浏览器打开」。';
    } else {
      steps = [
        '点地址栏右侧的 <b>安装图标</b>（显示器 ⬇️ / ⊕ 形状）',
        '在弹窗里选 <b>「安装」</b>',
        '之后从桌面 / 开始菜单打开，就是全屏 App'
      ];
      foot = '找不到图标时，也可以按 Ctrl+F5 刷新一次再试。';
    }
    var lis = '';
    for (var i = 0; i < steps.length; i++) {
      lis += '<li data-step="' + (i + 1) + '">' + steps[i] + '</li>';
    }
    return '<div data-t="pwa-install-modal">'
      + '<h3>📲 查看安装方法</h3>'
      + '<p class="v17-pwa-sub">装到主屏幕后：全屏无地址栏 · 离线也能玩 · 打开就像原生 App</p>'
      + '<ol class="v17-pwa-steps">' + lis + '</ol>'
      + '<div class="m-item v17-pwa-tip">小提示：需要用 <b>https</b>（或本机 localhost）打开才支持安装。'
      + foot + '</div>'
      + '<div class="v17-pwa-btns">'
      + '<button class="wheel-btn spin" data-t="pwa-install-action" onclick="v17PwaActionClick()">' + actionLabel() + '</button>'
      + '<button class="wheel-btn back" onclick="closeModal()">关闭</button>'
      + '</div></div>';
  }

  function openHelp() {
    try {
      if (typeof window.openModal === 'function') window.openModal(helpHtml());
    } catch (e) {}
  }

  function installClick() {
    if (isStandalone()) {
      safeToast('已经装到桌面啦 ✨');
      return;
    }
    var ev = STATE.deferred;
    if (!ev) {
      openHelp(); // 没有原生安装事件（iOS / 已用过 / 浏览器不支持）→ 教用户手动装
      return;
    }
    STATE.deferred = null; // beforeinstallprompt 只能 prompt 一次
    try {
      if (typeof ev.prompt === 'function') {
        var promptResult = ev.prompt();
        // prompt() 在某些时机（非用户手势等）会 reject，吞掉避免 unhandledrejection
        if (promptResult && typeof promptResult.then === 'function') {
          promptResult['catch'](function () {});
        }
      }
      var choice = ev.userChoice;
      if (choice && typeof choice.then === 'function') {
        choice.then(function (result) {
          if (result && result.outcome === 'accepted') {
            safeToast('📲 正在安装…');
          } else {
            safeToast('已取消，随时可以再装 📲');
          }
        })['catch'](function () {});
      }
    } catch (e) {
      openHelp(); // prompt 不可用时退回手动说明
    }
  }

  function actionClick() {
    if (STATE.deferred) {
      safeCloseModal();
      installClick();
      return;
    }
    safeCloseModal();
    safeToast('装好后打开就是全屏 App 啦 ✨');
  }

  /* --------------------------------------------------------------------- */
  /* 4) Service Worker 注册 + 新版本提示                                    */
  /* --------------------------------------------------------------------- */
  function notifyUpdateOnce() {
    if (STATE.updateToasted) return;
    STATE.updateToasted = true;
    safeToast('✨ 新版本已就绪，重开一次生效');
  }

  function watchRegistration(reg) {
    STATE.swReg = reg;
    // 页面打开期间就有一个 waiting 的新版本
    if (reg.waiting && navigator.serviceWorker.controller) notifyUpdateOnce();
    try {
      reg.addEventListener('updatefound', function () {
        var fresh = reg.installing;
        if (!fresh) return;
        fresh.addEventListener('statechange', function () {
          // 有 controller 才说明是「更新」而不是「首次安装」
          if (fresh.state === 'installed' && navigator.serviceWorker.controller) notifyUpdateOnce();
        });
      });
    } catch (e) {}
  }

  function registerSW() {
    // file:// 等非 http(s) 场景：静默跳过，绝不报错
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    if (!('serviceWorker' in navigator)) return;

    var doRegister = function () {
      try {
        navigator.serviceWorker.register('./sw.js').then(function (reg) {
          watchRegistration(reg);
        })['catch'](function () {
          /* 注册失败（例如被隐私策略禁用）不打扰用户，也不改任何游戏行为 */
        });
      } catch (e) {}
    };

    if (document.readyState === 'complete') doRegister();
    else window.addEventListener('load', doRegister);
  }

  /* --------------------------------------------------------------------- */
  /* 5) 安装事件 / 离线在线提示                                             */
  /* --------------------------------------------------------------------- */
  function bindEvents() {
    // 浏览器判定可安装时接管原生安装提示（阻止默认的迷你信息条，改由设置条胶囊触发）
    window.addEventListener('beforeinstallprompt', function (e) {
      try { e.preventDefault(); } catch (err) {}
      STATE.deferred = e;
      STATE.installed = false;
      mountPill();
    });

    window.addEventListener('appinstalled', function () {
      STATE.installed = true;
      STATE.deferred = null;
      safeToast('📲 已添加到桌面');
      mountPill();
    });

    window.addEventListener('offline', function () {
      if (STATE.online === false) return;
      STATE.online = false;
      safeToast('📴 已离线，游戏仍可玩');
    });

    window.addEventListener('online', function () {
      if (STATE.online === true) return;
      STATE.online = true;
      safeToast('🛜 已恢复联网');
    });
  }

  /* --------------------------------------------------------------------- */
  /* 6) 初始化 + 暴露给内联 onclick / QA 的全局函数                          */
  /* --------------------------------------------------------------------- */
  window.v17PwaInstallClick = function () { installClick(); };
  window.v17PwaShowInstallHelp = function () { openHelp(); };
  window.v17PwaActionClick = function () { actionClick(); };
  window.v17PwaRefreshPill = function () { mountPill(); };
  window.v17PwaPlatform = function () { return getPlatform(); };
  window.v17PwaState = function () {
    return {
      protocol: location.protocol,
      standalone: isStandalone(),
      installed: STATE.installed,
      deferred: !!STATE.deferred,
      online: STATE.online,
      updateToasted: STATE.updateToasted,
      hasController: !!(navigator.serviceWorker && navigator.serviceWorker.controller),
      hasRegistration: !!STATE.swReg
    };
  };

  function init() {
    if (STATE.initDone) return;
    STATE.initDone = true;
    injectCss();
    wrapRenderSettings();
    mountPill();      // 首屏 renderHome 发生在注入区之前，这里手动补挂一次
    bindEvents();
    registerSW();     // 内部会等 load 后再真正注册
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
