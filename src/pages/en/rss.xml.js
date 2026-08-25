import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { postsForLocale, postPath } from '../../i18n/posts';
import { t } from '../../i18n/ui';

export async function GET(context) {
	const posts = postsForLocale(await getCollection('blog'), 'en').sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	return rss({
		title: t('en', 'siteTitle'),
		description: t('en', 'siteDescription'),
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: postPath('en', post),
		})),
	});
}
