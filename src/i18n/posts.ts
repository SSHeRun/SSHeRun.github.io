import type { CollectionEntry } from 'astro:content';
import { localizedPath, type Locale } from './config';

export type BlogPost = CollectionEntry<'blog'>;

export function postLang(post: BlogPost): Locale {
	return post.data.lang === 'en' ? 'en' : 'zh-CN';
}

export function translationKey(post: BlogPost): string {
	if (post.data.translationKey) return post.data.translationKey;
	return post.id.replace(/\.en$/, '');
}

export function postsForLocale(posts: BlogPost[], locale: Locale): BlogPost[] {
	return posts.filter((post) => postLang(post) === locale);
}

export function findTranslation(posts: BlogPost[], key: string, locale: Locale): BlogPost | undefined {
	return posts.find((post) => translationKey(post) === key && postLang(post) === locale);
}

export function postPath(locale: Locale, post: BlogPost): string {
	return localizedPath(locale, `/blog/${translationKey(post)}/`);
}

export function postPathByKey(locale: Locale, key: string): string {
	return localizedPath(locale, `/blog/${key}/`);
}
