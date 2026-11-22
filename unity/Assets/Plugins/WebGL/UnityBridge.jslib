mergeInto(LibraryManager.library, {
  UnityBridgeReady: function () {
    try {
      window.dispatchEvent(new CustomEvent("unity-bridge-ready"));
    } catch (e) {}
  },
  UnityBridgeRollComplete: function (value) {
    try {
      window.dispatchEvent(new CustomEvent("unity-roll-complete", { detail: Number(value) }));
    } catch (e) {}
  }
});
