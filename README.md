# SSHeRun's Blog

基于 Hexo 8.x + Fluid 主题的个人博客，通过 GitHub Actions 自动部署到 GitHub Pages。

## 快速开始

### 环境要求

- Node.js >= 20
- npm

### 安装依赖

```bash
npm install
```

### 本地预览

```bash
npx hexo server
```

浏览器打开 http://localhost:4000 即可预览。

## 写新文章

### 方法一：命令行创建

```bash
npx hexo new "文章标题"
```

这会在 `source/_posts/` 下生成 `文章标题.md`，然后编辑该文件即可。

### 方法二：手动创建

直接在 `source/_posts/` 目录下新建 `.md` 文件，格式如下：

```markdown
---
title: 文章标题
date: 2026-03-18 12:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名
---

正文内容（支持 Markdown 语法）...
```

## 发布文章

只需要把改动推送到 `main` 分支，GitHub Actions 会自动构建并部署：

```bash
git add .
git commit -m "新文章：文章标题"
git push
```

推送后等待约 1-2 分钟，访问 https://ssherun.github.io 即可看到更新。

## 项目结构

```
├── _config.yml          # Hexo 主配置
├── _config.fluid.yml    # Fluid 主题配置
├── source/
│   ├── _posts/          # ✏️ 文章放这里（Markdown）
│   └── about/           # 关于页面
├── scaffolds/           # 文章模板
├── .github/workflows/   # GitHub Actions 自动部署
└── package.json         # 依赖管理
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npx hexo new "标题"` | 创建新文章 |
| `npx hexo server` | 本地预览（http://localhost:4000） |
| `npx hexo generate` | 生成静态文件 |
| `npx hexo clean` | 清理缓存和已生成文件 |

## 自定义配置

- **站点配置**：编辑 `_config.yml`（标题、作者、URL 等）
- **主题配置**：编辑 `_config.fluid.yml`（外观、导航栏、页脚等）
- **Fluid 主题文档**：https://hexo.fluid-dev.com/docs/guide/

## 注意事项

1. GitHub Pages 部署源需设置为 **GitHub Actions**（在仓库 Settings > Pages 中配置）
2. 文章文件名建议使用英文或拼音，避免 URL 编码问题
3. 图片可放在 `source/img/` 目录下，在文章中用 `/img/xxx.png` 引用
