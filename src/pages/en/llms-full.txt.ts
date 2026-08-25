import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postPath, postsForLocale } from '../../i18n/posts';

export const GET: APIRoute = async () => {
  const posts = postsForLocale(await getCollection('blog'), 'en').sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const sections = posts.map((post) => {
    const tags = post.data.tags?.length ? `\nTags: ${post.data.tags.join(', ')}` : '';
    const updated = post.data.updatedDate
      ? `\nUpdated: ${post.data.updatedDate.toISOString().split('T')[0]}`
      : '';

    return `<article>
<title>${post.data.title}</title>
<url>https://ssherun.github.io${postPath('en', post)}</url>
<description>${post.data.description}</description>
<published>${post.data.pubDate.toISOString().split('T')[0]}</published>${updated}${tags}

${post.body}
</article>`;
  });

  const body = `# SSHeRun's Blog — full text

> ${posts.length} English posts. Chinese: https://ssherun.github.io/llms-full.txt
> Site: https://ssherun.github.io/en/
> Generated: ${new Date().toISOString().split('T')[0]}

---

${sections.join('\n\n---\n\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
