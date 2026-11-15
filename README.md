# 今晚这一页

两人共用的一本手帐。一台手机，三个对页：热身、升温、靠近。贴满之后，封底是今晚的海报。

线上：https://chundongtou.github.io/couple-game/

- 题库原文保留（约 1423 张），不改写句子
- 自选贴 / 对贴交替，可以叠贴，撕掉只留胶痕
- 页边只有升温、对页印；贴纸店用胶带段
- 四款小游戏（温度贴、贴纸轮、印章轮、地图贴）既能在某一格里出现，也能从游戏厅单独玩，结果可以贴回今晚
- 页角长按「合上本子」温柔收尾
- 存档、导出导入、添加到桌面都还在。旧的一夜会进往期页

## 本地

```bash
python tools/rebuild/build_app.py --out dist/rebuild
python tools/rebuild/dev_app.py --port 8877 --out dist/rebuild --no-build

node qa/rebuild/engine.test.mjs
python tools/rebuild/build_app.py --release
```

开发只改 `app/`。根目录 `index.html` 由 `--release` 生成。

规则见 [app/DESIGN.md](app/DESIGN.md)。构建、PWA 和部署见 [docs/REBUILD.md](docs/REBUILD.md)。

## 隐私

数据只在这台浏览器的 `localStorage`（`couple2.*`）。没有账号，没有上报。
