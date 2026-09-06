# 赛博神婆 · Design System MASTER

> 全局设计唯一事实源（Source of Truth）。生成依据：ui-ux-pro-max `--design-system`（tarot divination cyber y2k neon mystical dark, variance 8 / motion 7）+ `y2k-aesthetic` / `hud-sci-fi-fui` / `retro-futurism` style 数据，经产品调性适配（见 codestable/vision）。
> 页面级偏差放 `pages/` 下对应文件；无页面文件时严格遵循本文。

## 1. 风格定义

**Y2K 赛博酸性神婆**：深空黑底 × 酸性荧光 × 铬金属渐变 × HUD 细线 × 扫描线。
关键词：acid lime、neon glow、chrome、iridescent、scanline、terminal、mystic-tech。
气质：赛博仪式感 + 00 后网感 + 一点点神棍。**禁止**：老派神秘学视觉（羊皮纸/水晶球实拍/衬线哥特体）、emoji 作结构性图标。

## 2. 色彩 Tokens（仅深色主题，MVP 不做亮色）

### 基础面
| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#07070C` | 页面底 |
| `--surface` | `#0E0E18` | 卡片/面板 |
| `--surface-2` | `#151524` | 浮层/高一层 |
| `--border` | `#232338` | 常规描边 |
| `--border-acid` | `rgba(200,255,30,.35)` | 强调描边 |

### 品牌色（酸性三原色 + 神秘辅色）
| Token | 值 | 语义 |
|---|---|---|
| `--acid` | `#C8FF1E` | 主品牌色：主 CTA、选中态、班味运势 |
| `--magenta` | `#FF3DB4` | 情感场景、Crush、警示性吐槽 |
| `--violet` | `#8B5CF6` | 神秘/巫师、树洞、合盘 |
| `--cyan` | `#22E4FF` | 翻译/信息类、潜台词翻译器 |
| `--gold` | `#FFC838` | 决策/星币/彩蛋、决策天平 |
| `--danger` | `#FF4D5E` | 错误、危机信息 |

### 文本
| Token | 值 | 对比要求 |
|---|---|---|
| `--text-1` | `#F4F4F8` | 主文本，对 bg ≥ 4.5:1 |
| `--text-2` | `#A0A0B8` | 次要，仅 ≥18px 或粗体用 |
| `--text-3` | `#63637E` | 弱化/HUD 装饰，不承载关键信息 |

### 场景 Accent 映射（固定，勿换）
daily→acid / translate→cyan / crush→magenta / decide→gold / pool→violet。人格色沿用其推荐场景色。

## 3. 字体

| Token | 栈 | 用途 |
|---|---|---|
| `--font-display` | `'ZCOOL QingKe HuangYou', 'Orbitron', system-ui` | 中文大标题、场景名、结果关键词（自带的圆润黄油感，最贴 00 后） |
| `--font-cyber` | `'Orbitron', 'ZCOOL QingKe HuangYou', sans-serif` | 数字、英文点缀、罗马数字牌号 |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace` | HUD 标签、指数、时间戳 |
| `--font-body` | `system-ui, -apple-system, 'PingFang SC', 'HarmonyOS Sans SC', 'MiSans', 'Microsoft YaHei', sans-serif` | 正文 |

字号阶梯（移动优先）：display-1 32px / display-2 24px / title 18px / body 15px / caption 12px / hud 10px(大写+letter-spacing 0.15em)。行高：正文 1.7，标题 1.25。

字体本地化：通过 `@fontsource/*` 打包（orbitron、jetbrains-mono、zcool-qingke-huangyou），**不依赖 Google Fonts CDN**。

## 4. 空间与形状

- 间距节奏：4/8 系（4,8,12,16,20,24,32,48）。页面水平安全边距 20px。
- 圆角：卡片 16px / 按钮 12px / HUD 标签 4px / 药丸 tag 999px。
- 触控目标 ≥ 44×44px；图标按钮可视 24px 但热区扩到 44px。
- 底部 Tab 栏与固定 CTA 预留 `env(safe-area-inset-bottom)`。

## 5. 效果与质感

| 效果 | 实现 |
|---|---|
| 霓虹辉光 | `box-shadow: 0 0 24px color-mix(in srgb, accent 45%, transparent)`；文本 glow 用 text-shadow |
| 铬金属字 | `linear-gradient(180deg,#fff,#B8BECC 45%,#5A6070 55%,#E8ECF4)` + bg-clip:text |
| 全息渐变边框 | conic/linear(#acid,#cyan,#magenta) 1px 边框（padding-box + border-box 双背景） |
| 扫描线 | body::after 3px 周期 repeating-linear-gradient，opacity 0.04，pointer-events none |
| 网格底纹 | 24px 网格 1px 线 rgba(200,255,30,.04) |
| 玻璃拟态 | 仅浮层：`backdrop-blur(12px)` + surface 70% |

暗色对比铁律：正文一律 text-1；text-2 不得用于 <15px 关键信息；accent 色文本需 ≥3:1（acid/cyan/gold 在深底上安全，magenta/violet 仅用于大字或图形）。

## 6. 动效（framer-motion，全部 transform/opacity）

| 场景 | 规格 |
|---|---|
| 微交互 | spring(stiffness 400, damping 28)；按压 scale 0.96，80–150ms 内反馈 |
| 翻牌 | rotateY 0→180，550ms ease [0.2,0.7,0.2,1]，背面 backface-hidden |
| 洗牌 | 牌堆散开抖动 380ms × 3 循环，stagger 40ms |
| 列表入场 | opacity+y16，380ms back.out(1.4)，stagger 60ms |
| 页面切换 | 淡入+上移 12px，260ms |

`prefers-reduced-motion: reduce` 时：跳过装饰动效直接呈现终态；翻牌退化为 150ms 淡入。动效可被"跳过仪式"按钮中断。

## 7. 组件规范摘要

- **按钮**：primary = acid 底黑字(粗体)；ghost = 1px border-acid 透明底 acid 字；场景页内 CTA 用该场景 accent。禁用态 40% 透明 + 不可点。
- **HUD 标签**：mono 10px 大写 + 4px 圆角描边，前置 `▸` 或 `//` 装饰符。
- **塔罗牌**：比例 2:3.2；牌背 = 黑底 + acid 符文环 + 中央眼睛/星标；牌面 = 暗底 + 铬字罗马数字 + 场景无关的独符文构图 + 底部中文牌名（display 字体）。逆位整体 rotate(180deg) + 左上角 "REVERSED" mono 标记。
- **结果面板**：surface 底 + 场景 accent 左侧 3px 竖条 + 标题行(HUD tag) + 正文。
- **Tab 栏**：4 项（神婆/记录/树洞/设置），图标线性 1.5px，激活态 accent 色 + 辉光。

## 8. 页面清单与结构

| 路由 | 页面 | 结构 |
|---|---|---|
| `/` | 首页 | 品牌头(铬字 logo+日期) → 每日一抽大卡 → 场景矩阵 2×2 → 树洞入口条 → 免责微文案 |
| `/scene/:id` | 场景流程 | 阶段机 input→persona→ritual→reading，顶部场景色标题 + 返回 |
| `/pool` | 能量树洞 | 顶部池状态 → 捞卡区 → 扔纸条输入 |
| `/history` | 记录 | 按日期分组的抽牌历史 |
| `/settings` | 设置 | 音效/震动开关 · 人格默认 · LLM 配置(baseUrl/key/model/测试按钮) · 免责声明全文 |

## 9. 反模式（禁止）

亮色模式、渐变横幅堆砌、emoji 当图标、系统性紫色渐变模板脸、超过两种 accent 同屏并存（场景页内）、动效超 500ms（仪式除外）、正文小于 13px。
