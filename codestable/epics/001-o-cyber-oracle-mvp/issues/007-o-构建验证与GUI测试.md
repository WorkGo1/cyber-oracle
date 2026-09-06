---
kind: issue
title: "构建验证与 GUI 测试"
type: feature
status: open
created: 2026-09-06
---

# 构建验证与 GUI 测试

## 做成以后是什么样

生产构建产物可部署；浏览器 GUI 黑盒测试覆盖全部用户旅程并通过。

**范围：** 包含 `npm run build` 修复、预览服务下的黑盒测试（首页 → 四场景全链路 → 深潜 → 生成卡片 → 树洞 → 设置页 LLM 配置保存）、移动视口检查、明显性能问题记录；不包含自动化测试框架搭建（MVP 手测）。

**归属：** Epic 001。测试遵循 web-gui-tester 技能（浏览器 GUI 黑盒方式）。

## 验证

全部旅程通过截图比对；无控制台报错；构建产物体积记录在执行记录中。

## 执行记录

- 2026-09-06：`npm run build` 通过（JS 361.7KB / gzip 131.5KB；CSS 183.7KB / gzip 79.4KB，主要来自字体子集 CSS；字体 woff2 按需加载）。修复构建期 TS 未使用变量 4 处。favicon 以内联 SVG data-URI 补齐，消除 404。
- GUI 测试：`scripts/gui-test*.mjs`（playwright-core + 无头 Edge，375px@2x 与 1024px）覆盖首页、四场景全链路、深潜、每日限次、危机守护、分享卡、树洞、历史、设置、桌面视口，约 21 张截图；控制台无错误。
- 视觉验收：两个 judge 并行审查 22 张截图；B 批 11/11 pass，A 批复验后全 pass（此前的"定调卡裁切/进度条不符"确认为 fullPage 截图动画时序伪影，3 倍放大复验无裁切）。
- 遗留（非阻断，记录到 Epic）：小阿尔卡纳 insight 跨场景复用度偏高；桌面首页底部留白偏多。
