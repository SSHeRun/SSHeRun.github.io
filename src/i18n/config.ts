export const LOCALES = ['zh-CN', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh-CN';

export const localeMeta = {
	'zh-CN': {
		htmlLang: 'zh-Hans',
		hreflang: 'zh-Hans',
		ogLocale: 'zh_CN',
		dateLocale: 'zh-CN',
		giscusLang: 'zh-CN',
		prefix: '',
		label: '中文',
		short: '中',
	},
	en: {
		htmlLang: 'en',
		hreflang: 'en',
		ogLocale: 'en_US',
		dateLocale: 'en-US',
		giscusLang: 'en',
		prefix: '/en',
		label: 'English',
		short: 'EN',
	},
} as const;

export function isLocale(value: string | undefined): value is Locale {
	return value === 'zh-CN' || value === 'en';
}

export function currentLocale(astroLocale?: string): Locale {
	return astroLocale === 'en' ? 'en' : DEFAULT_LOCALE;
}

export function localeFromPath(pathname: string): Locale {
	return pathname === '/en' || pathname === '/en/' || pathname.startsWith('/en/') ? 'en' : DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
	if (pathname === '/en' || pathname === '/en/') return '/';
	if (pathname.startsWith('/en/')) return pathname.slice(3);
	return pathname;
}

function withSlash(path: string): string {
	if (path === '/') return '/';
	return path.endsWith('/') ? path : `${path}/`;
}

export function localizedPath(locale: Locale, path: string): string {
	const clean = withSlash(path.startsWith('/') ? path : `/${path}`);
	const stripped = stripLocalePrefix(clean);
	if (locale === DEFAULT_LOCALE) return stripped;
	if (stripped === '/') return '/en/';
	return `/en${stripped}`;
}

export function switchLocalePath(currentPath: string, target: Locale, fallbackPath?: string): string {
	const stripped = stripLocalePrefix(currentPath);
	return localizedPath(target, fallbackPath ?? stripped);
}

export function absoluteUrl(path: string, site = 'https://ssherun.github.io'): string {
	const url = new URL(path, site);
	return url.href;
}

export type Alternate = { locale: Locale | 'x-default'; href: string };

export function pageAlternates(pathname: string, site?: string | URL): Alternate[] {
	const origin = site ? new URL(site).origin : 'https://ssherun.github.io';
	const stripped = stripLocalePrefix(pathname);
	const zh = new URL(localizedPath('zh-CN', stripped), origin).href;
	const en = new URL(localizedPath('en', stripped), origin).href;
	return [
		{ locale: 'zh-CN', href: zh },
		{ locale: 'en', href: en },
		{ locale: 'x-default', href: zh },
	];
}
