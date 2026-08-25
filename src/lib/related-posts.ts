import type { CollectionEntry } from 'astro:content';

type RelatedInput = {
	slug: string;
	tags?: string[];
	body?: string;
	limit?: number;
	lang?: 'zh' | 'en';
};

export function pickRelatedPosts(
	posts: CollectionEntry<'blog'>[],
	{ slug, tags = [], body = '', limit = 4, lang }: RelatedInput,
): CollectionEntry<'blog'>[] {
	if (body.includes('## 相关文章') || body.includes('## Related posts')) return [];
	const mine = new Set(tags);
	if (mine.size === 0) return [];

	const already = new Set<string>();
	const wikilinks = body.match(/\[\[([^\]|#]+)/g);
	if (wikilinks) {
		for (const match of wikilinks) already.add(match.slice(2).trim());
	}

	return posts
		.filter((post) => (lang ? (post.data.lang ?? 'zh') === lang : true))
		.filter((post) => post.id !== slug && !already.has(post.id) && !already.has(post.id.replace(/\.en$/, '')))
		.map((post) => {
			const overlap = (post.data.tags ?? []).filter((tag) => mine.has(tag)).length;
			return { post, overlap };
		})
		.filter((item) => item.overlap > 0)
		.sort((a, b) => {
			if (b.overlap !== a.overlap) return b.overlap - a.overlap;
			return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
		})
		.slice(0, limit)
		.map((item) => item.post);
}
