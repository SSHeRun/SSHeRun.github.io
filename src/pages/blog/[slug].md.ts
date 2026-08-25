import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { postPath, translationKey } from '../../i18n/posts';

/** YAML 双引号字符串转义，避免标题/摘要含 " 或换行时整段 frontmatter 损坏 */
function yamlDoubleQuoted(value: string): string {
  return `"${value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')}"`;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = (await getCollection('blog')).filter((post) => (post.data.lang ?? 'zh') !== 'en');
  return posts.map((post) => ({
    params: { slug: translationKey(post) },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection>>[number] };
  const { title, description, pubDate, updatedDate, tags } = post.data;
  const key = translationKey(post);

  const frontmatter = [
    '---',
    `title: ${yamlDoubleQuoted(title)}`,
    `description: ${yamlDoubleQuoted(description)}`,
    `date: ${pubDate.toISOString().split('T')[0]}`,
    ...(updatedDate ? [`updated: ${updatedDate.toISOString().split('T')[0]}`] : []),
    ...(tags?.length
      ? [`tags: [${tags.map((t: string) => yamlDoubleQuoted(t)).join(', ')}]`]
      : []),
    `lang: zh`,
    `url: https://ssherun.github.io${postPath('zh-CN', post)}`,
    '---',
  ].join('\n');

  const body = `${frontmatter}\n\n${post.body}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
