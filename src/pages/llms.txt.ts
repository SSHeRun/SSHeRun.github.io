import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postPath, postsForLocale, translationKey } from '../i18n/posts';
import { t } from '../i18n/ui';

export const GET: APIRoute = async () => {
  const posts = postsForLocale(await getCollection('blog'), 'zh-CN').sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const postList = posts
    .map((p) => {
      const tags = p.data.tags?.length ? ` [${p.data.tags.join(', ')}]` : '';
      return `- [${p.data.title}](https://ssherun.github.io${postPath('zh-CN', p)}): ${p.data.description}${tags}`;
    })
    .join('\n');

  const body = `# SSHeRun's Blog

> ${t('zh-CN', 'siteDescription')}

站点地址: https://ssherun.github.io
作者: SSHeRun
语言: 中文（默认） / [English](https://ssherun.github.io/en/llms.txt)
文章数量: ${posts.length}

## 博客文章

${postList}

## 完整内容

- [所有文章完整内容](https://ssherun.github.io/llms-full.txt)

## 站点结构

- [首页](https://ssherun.github.io/)
- [文章列表](https://ssherun.github.io/blog/)
- [标签](https://ssherun.github.io/tags/)
- [知识图谱](https://ssherun.github.io/graph/)
- [关于](https://ssherun.github.io/about/)
- [English](https://ssherun.github.io/en/)
- [RSS](https://ssherun.github.io/rss.xml)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
