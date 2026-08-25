import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postPath, postsForLocale } from '../../i18n/posts';
import { t } from '../../i18n/ui';

export const GET: APIRoute = async () => {
  const posts = postsForLocale(await getCollection('blog'), 'en').sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const postList = posts
    .map((p) => {
      const tags = p.data.tags?.length ? ` [${p.data.tags.join(', ')}]` : '';
      return `- [${p.data.title}](https://ssherun.github.io${postPath('en', p)}): ${p.data.description}${tags}`;
    })
    .join('\n');

  const body = `# SSHeRun's Blog

> ${t('en', 'siteDescription')}

Site: https://ssherun.github.io/en/
Author: SSHeRun
Languages: English / [中文](https://ssherun.github.io/llms.txt)
Posts: ${posts.length}

## Posts

${postList}

## Full content

- [All posts](https://ssherun.github.io/en/llms-full.txt)

## Site

- [Home](https://ssherun.github.io/en/)
- [Posts](https://ssherun.github.io/en/blog/)
- [Tags](https://ssherun.github.io/en/tags/)
- [Graph](https://ssherun.github.io/en/graph/)
- [About](https://ssherun.github.io/en/about/)
- [RSS](https://ssherun.github.io/en/rss.xml)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
