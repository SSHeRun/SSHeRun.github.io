import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection>>[number] };
  const { title, description, pubDate, updatedDate, tags } = post.data;

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `description: "${description}"`,
    `date: ${pubDate.toISOString().split('T')[0]}`,
    ...(updatedDate ? [`updated: ${updatedDate.toISOString().split('T')[0]}`] : []),
    ...(tags?.length ? [`tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]`] : []),
    `url: https://ssherun.github.io/blog/${post.id}/`,
    '---',
  ].join('\n');

  const body = `${frontmatter}\n\n${post.body}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
