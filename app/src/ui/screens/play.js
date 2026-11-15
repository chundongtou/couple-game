/* 贴纸交互在对页上完成。旧的 play 路由直接回到这一页。 */
(function () {
  var App = window.App;
  App.Screens = App.Screens || {};
  App.Screens.play = {
    mount: function () {
      setTimeout(function () { App.Router.go("journey", {}, { replace: true }); }, 0);
    },
    unmount: function () {}
  };
})();
