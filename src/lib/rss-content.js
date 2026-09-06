import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';

let containerPromise;

function getContainer() {
	containerPromise ??= AstroContainer.create();
	return containerPromise;
}

/** 把 /_astro/... 这类根相对地址补成绝对地址，否则阅读器里图片和站内链接都是断的。 */
function absolutize(html, site) {
	if (!site) return html;
	const origin = new URL(site).origin;
	return html.replace(/(\s(?:src|href))="\/(?!\/)/g, `$1="${origin}/`);
}

/**
 * 渲染文章正文供 RSS 全文输出。
 *
 * 走容器 API 而不是直接把 markdown 丢给解析器，是因为正文里的图片写的是
 * ../../assets/xxx.jpg 这种相对路径，只有过一遍 Astro 的图片管线才会变成
 * 构建后带 hash 的真实地址。
 */
export async function renderPostContent(post, site) {
	const container = await getContainer();
	const { Content } = await render(post);
	const html = await container.renderToString(Content);
	return absolutize(html, site);
}
