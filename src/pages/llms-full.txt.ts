import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postPath, postsForLocale } from '../i18n/posts';

export const GET: APIRoute = async () => {
  const posts = postsForLocale(await getCollection('blog'), 'zh-CN').sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const sections = posts.map((post) => {
    const tags = post.data.tags?.length ? `\n标签: ${post.data.tags.join(', ')}` : '';
    const updated = post.data.updatedDate
      ? `\n更新时间: ${post.data.updatedDate.toISOString().split('T')[0]}`
      : '';

    return `<article>
<title>${post.data.title}</title>
<url>https://ssherun.github.io${postPath('zh-CN', post)}</url>
<description>${post.data.description}</description>
<published>${post.data.pubDate.toISOString().split('T')[0]}</published>${updated}${tags}

${post.body}
</article>`;
  });

  const body = `# SSHeRun's Blog — 完整内容

> ${posts.length} 篇中文文章。English: https://ssherun.github.io/en/llms-full.txt
> 站点地址: https://ssherun.github.io
> 生成时间: ${new Date().toISOString().split('T')[0]}

---

${sections.join('\n\n---\n\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
