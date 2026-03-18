import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const sections = sorted.map((post) => {
    const tags = post.data.tags?.length ? `\n标签: ${post.data.tags.join(', ')}` : '';
    const updated = post.data.updatedDate
      ? `\n更新时间: ${post.data.updatedDate.toISOString().split('T')[0]}`
      : '';

    return `<article>
<title>${post.data.title}</title>
<url>https://ssherun.github.io/blog/${post.id}/</url>
<description>${post.data.description}</description>
<published>${post.data.pubDate.toISOString().split('T')[0]}</published>${updated}${tags}

${post.body}
</article>`;
  });

  const body = `# SSHeRun's Blog — 完整内容

> 一个对 Agent 友好的博客。本文件包含所有文章的完整 Markdown 内容，供 AI Agent / LLM 一次性获取全站上下文。
> 站点地址: https://ssherun.github.io
> 文章数量: ${sorted.length}
> 生成时间: ${new Date().toISOString().split('T')[0]}

---

${sections.join('\n\n---\n\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
