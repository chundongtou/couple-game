# 公寓引擎

`App.Engine` 无 DOM、无 localStorage。`newSession(settings, names, seed)` 开始一夜。

常用动作：`enterRoom` / `leaveRoom`、`livingOffer` / `pushDeeper` / `settlePrompt`、`dealWheel` / `spinWheel` / `rerollWheel` / `handTruth`、`thermoBegin` / `thermoSet` / `thermoPass` / `thermoReveal`、`bedroomMode` / `bedroomDraw`、`strollStart` / `strollRoll` / `strollSettle`、`safeWord` / `closeNight`、`newStandalone` / `standalonePack` / `pasteStandalone`。

`roomOpen(state, 'bedroom').locked` 永远是 false。`cardAllowed` 同时看星级、露骨词和边界。`isLegacy` 认出旧夜航，`archiveLegacy` 把它收成以前的夜。

```bash
node qa/rebuild/engine.test.mjs
```
