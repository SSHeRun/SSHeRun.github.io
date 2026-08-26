---
title: '为什么你可能想用 Canvas 而不是 HTML 做 WebApp'
description: 'Google Docs、Sheets、Canva、Miro、Hivekit 调度器为何把核心界面画在 Canvas 上：速度、控制、一致性与可移植性，以及何时绝对不该这么做。'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-webapp-canvas-instead-of-html.jpg'
tags: ['前端', 'Canvas', '工程', '性能']
lang: zh
---

## 核心观点

Canvas **不是** HTML 的更快替代品，而是更底层的渲染工具：你拿到更多控制权，也要自己扛更多浏览器原本免费给你的能力。当界面不再像「文档」，而像「可缩放平移的场景」时，Canvas 才值得选。

![空间画布与调度网格意象](../../assets/inline-webapp-canvas-instead-of-html-01.jpg)

## 大厂为什么这么干？

Google Docs 的文档区是 Canvas；Google Sheets / Excel Web 的表格区也是。Canva、Miro 的画板同样如此。Hivekit 的调度界面也是一块可缩放、可平移的 Canvas。

这些产品要在「旗舰机」到「土豆机」上都能用。作者认为，其中很值得琢磨的一点是：他们把**本该用 DOM 实现的功能**，改用 Canvas 画出来。

## Canvas 到底是什么？

Canvas 已存在二十多年：HTML 里的一块空白画布，用 JavaScript 绘制。你可以用 `fillRect()` 这类高层 API，也可以用 `getImageData()` 碰像素。

结果本质是**静态位图**。对习惯 DOM 的开发者来说，这意味着：没有元素树帮你管布局，没有事件冒泡体系，没有回流/重绘管线替你优化设备差异——这一切都要自己做。

![像素级绘制与图层叠加](../../assets/inline-webapp-canvas-instead-of-html-02.jpg)

## 为什么还要用？

- **速度**：解析 HTML、建 DOM、套 CSS、处理交互都很重。复杂应用里，浏览器负担会暴涨。「笨」绘图 API 往往意味着更少的中间层、更高的帧率。
- **控制**：无限白板、海量网格、可缩放工作区——你本来就要虚拟滚动或动态增删节点。到了这一步，不如直接拥有整条渲染管线。
- **一致性**：跨设备输出更接近「你指定什么就画什么」。响应式、渐变、过渡在不同系统上仍可能长相不一。
- **可移植**：Flutter Web / 部分 WASM 把帧缓冲打到 Canvas；也可反向把 Canvas 风格 API 接到原生绘制。

## 为什么大多数时候不该用？

反例比正例多得多。一个普通的 `<input type="text">` 就白送：清晰文字、焦点与选区、方向键、国际化、读屏无障碍……

对多数 WebApp，DOM + 成熟框架在可维护性、团队协作和无障碍上仍然更划算。

## 什么时候 Canvas 更合适？

1. **大量绝对定位、不规则形状、复杂 z-order**——界面已经脱离常规文档流。
2. **只渲染需要的部分**——缩放、平移、相机变换、裁剪、瓦片、LOD、虚拟化。
3. **已有强内部模型**——状态、几何、焦点、交互都成型了，缺的只是可视化层。

## Hivekit 的可复用实践

### 统一调度渲染

中央 `Renderer` 调用分层渲染器（背景 / 行 / 任务）。子模块只调 `scheduleRender()`，用 `requestAnimationFrame` 合并成下一帧一次绘制。他们每帧清空整块 Canvas 全量重绘——略浪费，但实现简单，实践中很少成为瓶颈。

### 多层 Canvas

底层画相对静态的计划内容；上层 `InteractionRenderer` 高频刷新 hover/高亮，只画少量边框，更轻。

### 样式、坐标与像素密度

- 像抽 CSS 一样，把颜色/字号抽到独立样式对象
- 领域坐标（列索引、工作区 x/y）→ 像素：集中做转换函数
- 按 `devicePixelRatio` 放大物理像素，再 `ctx.scale` 抵消，保证清晰且业务少碰 scale

### 命中检测与事件

预建屏幕空间包围盒索引；量大可再做轴索引或 R-Tree。全局监听鼠标/键盘，用注册/注销管理元素级回调生命周期。

## 怎么选？

默认选 DOM。只有当应用的核心是大型空间工作区、复杂定位、缩放平移、海量视觉元素，并且你愿意自建交互 / 命中 / 缩放 / 渲染管线时，再上 Canvas。

不要因为「听起来更快」就选 Canvas。界面像文档，就用文档模型；界面像场景，再用场景模型。

> 原文：[Why you might want to build your WebApp in Canvas instead of HTML](https://hivekit.io/blog/why-you-might-want-to-build-your-webapp-in-canvas-instead-of-html/)（Hivekit）
