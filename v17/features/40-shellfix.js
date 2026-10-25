/* ============================================================================
 * V17 · 壳层小修（Lead 收尾）
 *
 * 只做两件事，不改任何玩法逻辑：
 *  1. 修复 V16 存量 UI bug：「📜 本局记录」和「🔊 重听」两个浮标是 #ctrlBar 的
 *     *兄弟节点*，却用 position:absolute + top:-26/-52 定位。它们没有定位父级，
 *     结果被定位到初始包含块 → 实际跑到视口外，iPhone/Playwright 都点不到。
 *     修法：运行时把它们移进 #ctrlBar（fixed），让原有 top:-26/-52 重新相对底栏生效。
 *  2. PWA「📲 装到桌面」胶囊默认追加在 22 项横滑设置条的最右端，很难被发现；
 *     这里把它挪到设置条最前（仍然可横向滑动，不改变任何其他胶囊）。
 *
 * 说明：V16 主脚本唯一一处可选链 ?.（iOS < 13.4 会整页白屏）已在 index.html
 * 主脚本里直接改成 ES5 写法，不在此文件内处理。
 * ========================================================================== */
(function () {
  'use strict';

  function injectCss() {
    if (document.getElementById('v17ShellFixStyle')) return;
    var css = [
      /* 移进底栏后，原来的 top:-26 / -52 就相对底栏了；这里只补一点点击热区和层级 */
      '.ctrl-bar .ctrl-log-toggle{right:10px;top:-28px;z-index:121;min-height:26px;line-height:1.2;}',
      '.ctrl-bar .ctrl-voice-toggle{right:10px;top:-56px;z-index:121;min-height:26px;line-height:1.2;}',
      'body.light .ctrl-bar .ctrl-log-toggle,body.light .ctrl-bar .ctrl-voice-toggle{background:rgba(255,248,252,.95);}',
      /* 设置条里被挪到首位的安装胶囊：留一点视觉权重 */
      '#setBar .tb-item[data-t="pwa-install-pill"]{flex:0 0 auto;}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'v17ShellFixStyle';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function moveTogglesIntoCtrlBar() {
    var bar = document.getElementById('ctrlBar');
    if (!bar) return;
    var log = document.querySelector('.ctrl-log-toggle');
    if (log && !bar.contains(log)) bar.appendChild(log);
    var voice = document.getElementById('ctrlVoiceBtn');
    if (voice && !bar.contains(voice)) bar.appendChild(voice);
  }

  /* 幂等：安装胶囊永远保持为 #setBar 第一个子节点。
     注意：不能依赖「包装 renderSettings 的先后顺序」——30-pwa.js 在 DOMContentLoaded 里
     才包装，若本文件在解析期就包装，会变成内层、在 pill 生成前空跑。所以：
       a) 包装动作也放进 init()（DOMContentLoaded，晚于 30-pwa 的 listener → 成为最外层）；
       b) 再用 MutationObserver 兜底，无论谁重建 #setBar，只要 pill 出现就置顶。 */
  function installPillFirst() {
    var bar = document.getElementById('setBar');
    if (!bar) return;
    var pill = bar.querySelector('[data-t="pwa-install-pill"]');
    if (pill && bar.firstElementChild !== pill) bar.insertBefore(pill, bar.firstChild);
  }

  function watchSetBar() {
    if (window.__v17ShellFixObserver) return;
    var bar = document.getElementById('setBar');
    if (!bar || typeof MutationObserver === 'undefined') return;
    var mo = new MutationObserver(function () {
      installPillFirst();
    });
    mo.observe(bar, { childList: true });
    window.__v17ShellFixObserver = mo;
  }

  function wrapRenderSettings() {
    if (typeof window.renderSettings !== 'function' || window.renderSettings.__v17ShellFix) return;
    var orig = window.renderSettings;
    var wrapped = function () {
      var ret = orig.apply(this, arguments);
      try { installPillFirst(); } catch (e) {}
      return ret;
    };
    wrapped.__v17ShellFix = true;
    window.renderSettings = wrapped;
  }

  function init() {
    try { injectCss(); } catch (e) {}
    try { moveTogglesIntoCtrlBar(); } catch (e) {}
    try {
      wrapRenderSettings();      // 此时 30-pwa 已包装过 → 这里成为最外层
      installPillFirst();
      watchSetBar();             // 兜底：任何重建都能瞬间置顶
    } catch (e) {}
  }

  window.v17ShellFix = init;   // 排障/测试入口（幂等）
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
