# v6 mocks 自检记录（FE）

日期：2026-11-16 · 范围：`docs/v6/mocks/` · 执行：design（FE）

## 环境

- Python：`C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe`（3.12.14, playwright）
- 浏览器：Playwright `chromium.launch(channel="msedge", headless=True)`
- 视口：`viewport 430×932`，`device_scale_factor=2`，`locale=zh-CN`
- 字体：本机 `Noto Serif SC` / `Noto Sans SC` / `STKaiti` 均可用（`document.fonts.check` 返回 true）

## 自动检查

脚本：`shots/shoot.py`（临时，未入库；按上面的参数对 6 个 HTML 截图并检查）

逐屏检查：截图尺寸、`scrollWidth/scrollHeight`、超出 430×932 的元素（装饰层 `aria-hidden` 不计）、必需文案、外部请求、console error / pageerror、字体可用性。

```
screen       png          scroll        wide miss ext err fonts
a-boot      860x1864     430x932     0    0   0   0 True/True
a-table     860x1864     430x932     0    0   0   0 True/True
b-boot      860x1864     430x932     0    0   0   0 True/True
b-table     860x1864     430x932     0    0   0   0 True/True
c-boot      860x1864     430x932     0    0   0   0 True/True
c-table     860x1864     430x932     0    0   0   0 True/True
=== ALL PASS ===
```

- 无外部请求：所有请求均为 `file:` 或 `data:`（噪点/滤镜为内联 data URI）。
- 无 console error、无 pageerror。
- 必需文案：boot 的「今晚 / 两个人，一部手机，一盘桌上的棋 / 摆上棋盘 / 以前的夜 / 小游戏 / 设置」；table 的「先收棋 / 做了 / 放过」——6 屏全部存在。
- HTML 中无 `src="http…"` / `href="http…"` / `url(http…)` / `@import`。

## 人工检查

- 6 张 PNG 逐一打开：中文无乱码、无豆腐块、无裁切；三方向气质差异明显（星轨/信纸/霓虹）。
- 每屏 430 宽：棋盘、题卡、顶部回合条、小入口均在安全区内，无横向滚动。
- 文案：复用了现有文案（今晚飞行棋、两个人，一部手机，一盘桌上的棋、摆上棋盘、掷骰、做了、放过、先收棋、真心话、以前的夜、小游戏、设置）；题卡问题为含蓄向，无露骨内容。
- 映射说明：C 的四色在视觉上霓虹化为「桃粉 / 柠黄 / 电青 / 薄荷」，落地时映射回数据里的红/黄/蓝/绿 id。

## 复现

```powershell
& 'C:\Users\xiaohu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe' `
  'E:\DSH研发\.agents\worktrees\dsh-bf954628-7cd3\shots\shoot.py'
```

> 该脚本依赖本机 Edge + playwright；换机器需加 `playwright install msedge` 或改 channel。
