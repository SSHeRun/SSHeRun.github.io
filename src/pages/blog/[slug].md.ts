import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

/** YAML 双引号字符串转义，避免标题/摘要含 " 或换行时整段 frontmatter 损坏 */
function yamlDoubleQuoted(value: string): string {
  return `"${value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')}"`;
}

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
    `title: ${yamlDoubleQuoted(title)}`,
    `description: ${yamlDoubleQuoted(description)}`,
    `date: ${pubDate.toISOString().split('T')[0]}`,
    ...(updatedDate ? [`updated: ${updatedDate.toISOString().split('T')[0]}`] : []),
    ...(tags?.length
      ? [`tags: [${tags.map((t: string) => yamlDoubleQuoted(t)).join(', ')}]`]
      : []),
    `url: https://ssherun.github.io/blog/${post.id}/`,
    '---',
  ].join('\n');

  const body = `${frontmatter}\n\n${post.body}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
