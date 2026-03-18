import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const postList = sorted
    .map((p) => {
      const tags = p.data.tags?.length ? ` [${p.data.tags.join(', ')}]` : '';
      return `- [${p.data.title}](https://ssherun.github.io/blog/${p.id}/): ${p.data.description}${tags}`;
    })
    .join('\n');

  const body = `# SSHeRun's Blog

> 一个对 Agent 友好的博客。本站不仅为人类读者提供良好的阅读体验，也为 AI Agent 提供结构化、机器可读的内容接口。探索 Agent 时代个人网站的新形态。

站点地址: https://ssherun.github.io
作者: SSHeRun
语言: 中文
文章数量: ${sorted.length}

## 博客文章

${postList}

## 完整内容

- [所有文章完整内容](https://ssherun.github.io/llms-full.txt): 包含所有博客文章的完整 Markdown 内容，适合需要深度理解站点内容的 Agent 使用。

## 站点结构

- [首页](https://ssherun.github.io/): 最新文章列表
- [文章列表](https://ssherun.github.io/blog/): 全部博客文章
- [关于](https://ssherun.github.io/about/): 关于作者
- [RSS 订阅](https://ssherun.github.io/rss.xml): RSS feed
- [站点地图](https://ssherun.github.io/sitemap-index.xml): Sitemap

## Optional

- [GitHub](https://github.com/SSHeRun): 作者的 GitHub 主页
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
