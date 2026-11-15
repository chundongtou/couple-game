# 引擎 API（今晚这一页）

`App.Engine` 是纯逻辑：无 DOM、无 localStorage。数值在 `App.Balance`。

```js
let s = App.Engine.newSession({ maxStar: 3, blacklist: [] }, { a: '阿岚', b: '小满' }, 20260315);
s = App.Engine.chooseSticker(s, 0).state;
s = App.Engine.paste(s, '一句短注').state;
```

主要动作都返回 `{ state, events }`。`newSession`、`openArcade`、`previewDraw` 直接返回状态或卡面。

| 动作 | 何时 |
|---|---|
| `chooseSticker` / `paste` / `peel` | 自选贴 |
| `lockSecret` / `resolvePair` | 对贴 |
| `acceptStack` / `declineStack` / `pasteStack` / `peelStack` | 叠贴 |
| `shopBuy` / `leaveShop` | 页间贴纸店 |
| `thermoCommit` / `thermoKeep` | 温度贴 |
| `wheelSpin` / `wheelKeep` | 贴纸轮、印章轮 |
| `mapRoll` / `mapKeep` | 地图贴 |
| `openArcade` / `pasteExtra` | 游戏厅单独玩，再贴进手帐 |
| `safeWord` / `finish` | 合上本子 / 封底 |
| `isLegacy` / `legacyEntry` | 旧夜航存档收进往期 |
| `validate` | 修复手帐存档；旧档原样返回 |

```bash
node qa/rebuild/engine.test.mjs
```
