import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { postsForLocale, postPath } from '../i18n/posts';
import { t } from '../i18n/ui';
import { renderPostContent } from '../lib/rss-content.js';

export async function GET(context) {
	const posts = postsForLocale(await getCollection('blog'), 'zh-CN').sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	const items = await Promise.all(
		posts.map(async (post) => ({
			...post.data,
			link: postPath('zh-CN', post),
			content: await renderPostContent(post, context.site),
		})),
	);
	return rss({
		title: t('zh-CN', 'siteTitle'),
		description: t('zh-CN', 'siteDescription'),
		site: context.site,
		items,
	});
}
