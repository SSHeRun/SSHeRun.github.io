import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);

type GraphNode = {
	id: string;
	label: string;
	type: 'post' | 'tag' | 'cluster';
	url?: string;
	cluster?: string;
	clusterColor?: string;
	weight?: number;
};

type GraphEdge = {
	source: string;
	target: string;
	type: string;
	color?: string;
};

type GraphUi = {
	cluster: string;
	tag: string;
	post: string;
	openPost: string;
	openTag: string;
	belong: string;
	relatedTags: string;
	relatedPosts: string;
	noMatch: string;
	matchCount: string;
};

type GraphPayload = {
	nodes: GraphNode[];
	edges: GraphEdge[];
	ui?: GraphUi;
};

const FALLBACK_UI: GraphUi = {
	cluster: '主题群',
	tag: '标签',
	post: '文章',
	openPost: '打开文章',
	openTag: '查看该标签下的文章',
	belong: '所属主题',
	relatedTags: '相关标签',
	relatedPosts: '相关文章',
	noMatch: '没有匹配的节点',
	matchCount: '匹配 {n} 个',
};

/** cytoscape 的颜色解析不认 #rrggbbaa，暗色主题的 --border 正是这种写法。 */
function cssColor(value: string, fallback: string): string {
	const v = value.trim();
	if (!v) return fallback;
	const m = /^#([0-9a-f]{6})([0-9a-f]{2})$/i.exec(v);
	if (!m) return v;
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
	return `rgba(${r}, ${g}, ${b}, ${(parseInt(m[2], 16) / 255).toFixed(3)})`;
}

function readTheme() {
	const s = getComputedStyle(document.documentElement);
	const get = (name: string, fallback: string) => cssColor(s.getPropertyValue(name), fallback);
	return {
		accent: get('--accent', '#0891b2'),
		accentSecondary: get('--accent-secondary', '#7c3aed'),
		text: get('--text-primary', '#1e293b'),
		muted: get('--text-muted', '#94a3b8'),
		border: get('--border', '#e2e8f0'),
		surface: get('--bg-surface', '#ffffff'),
	};
}

function payload(): GraphPayload {
	const el = document.getElementById('graph-data');
	if (!el?.textContent) return { nodes: [], edges: [] };
	return JSON.parse(el.textContent);
}

function escapeHtml(value: string): string {
	return value.replace(
		/[&<>"']/g,
		(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
	);
}

const data = payload();
const copy = { ...FALLBACK_UI, ...(data.ui ?? {}) };
const container = document.getElementById('cy');
const panel = document.getElementById('graph-panel');
const panelBody = document.getElementById('graph-panel-body');
const panelClose = document.getElementById('graph-panel-close');
const searchInput = document.getElementById('graph-search') as HTMLInputElement | null;
const searchStatus = document.getElementById('graph-search-status');
const filterBar = document.getElementById('graph-filters');
const resetButton = document.getElementById('graph-reset');
const stage = document.getElementById('graph-stage');
const hint = document.getElementById('graph-zoom-hint');

if (!container) {
	throw new Error('图谱容器不存在');
}

let theme = readTheme();

const elements = [
	...data.nodes.map((node) => ({
		data: {
			id: node.id,
			label: node.label,
			nodeType: node.type,
			url: node.url || '',
			cluster: node.cluster || '',
			clusterColor: node.clusterColor || (node.type === 'post' ? theme.accent : theme.accentSecondary),
			weight: node.weight ?? 1,
		},
	})),
	...data.edges.map((edge) => ({
		data: {
			source: edge.source,
			target: edge.target,
			edgeType: edge.type,
			edgeColor: edge.color || '',
		},
	})),
];

function buildStyle(t: ReturnType<typeof readTheme>): cytoscape.StylesheetJson {
	return [
		{
			selector: 'node[nodeType="cluster"]',
			style: {
				'background-color': 'data(clusterColor)',
				'background-opacity': 0.92,
				label: 'data(label)',
				color: '#ffffff',
				'font-size': '13px',
				'font-weight': 700,
				'text-valign': 'center',
				'text-halign': 'center',
				width: 78,
				height: 44,
				shape: 'round-rectangle',
				'border-width': 0,
				'text-max-width': '68px',
				'text-wrap': 'wrap',
				'z-index': 30,
			},
		},
		{
			selector: 'node[nodeType="tag"]',
			style: {
				'background-color': 'data(clusterColor)',
				label: 'data(label)',
				color: t.text,
				'font-size': '12px',
				'font-weight': 600,
				'text-valign': 'bottom',
				'text-margin-y': 5,
				'text-outline-color': t.surface,
				'text-outline-width': 3,
				width: 'mapData(weight, 1, 29, 18, 44)',
				height: 'mapData(weight, 1, 29, 18, 44)',
				shape: 'diamond',
				'border-width': 2,
				'border-color': t.surface,
				'z-index': 20,
			},
		},
		{
			// 文章默认不带标签：61 个标题同时渲染只会糊成一片，靠 .labeled 按需点亮。
			selector: 'node[nodeType="post"]',
			style: {
				'background-color': 'data(clusterColor)',
				'background-opacity': 0.85,
				label: '',
				width: 12,
				height: 12,
				'border-width': 1.5,
				'border-color': t.surface,
				'z-index': 10,
			},
		},
		{
			selector: 'node[nodeType="post"].labeled',
			style: {
				label: 'data(label)',
				color: t.text,
				'font-size': '11px',
				'text-valign': 'bottom',
				'text-margin-y': 4,
				'text-max-width': '120px',
				'text-wrap': 'ellipsis',
				'text-outline-color': t.surface,
				'text-outline-width': 3,
				'z-index': 25,
			},
		},
		{
			selector: 'edge',
			style: { 'curve-style': 'bezier' },
		},
		{
			selector: 'edge[edgeType="cluster"]',
			style: { 'line-color': 'data(edgeColor)', width: 1.6, opacity: 0.45, 'line-style': 'dashed' },
		},
		{
			// 168 条「文章→标签」是密度的主要来源，默认压到几乎看不见，只留骨架感。
			selector: 'edge[edgeType="tag"]',
			style: { 'line-color': t.border, width: 1, opacity: 0.22 },
		},
		{
			selector: 'edge[edgeType="related-tag"]',
			style: { 'line-color': t.accentSecondary, width: 2, opacity: 0.5 },
		},
		{
			selector: 'edge[edgeType="wikilink"]',
			style: {
				'line-color': t.accent,
				width: 1.4,
				'target-arrow-shape': 'triangle',
				'target-arrow-color': t.accent,
				'arrow-scale': 0.7,
				opacity: 0.35,
			},
		},
		{
			selector: 'node.hover',
			style: { 'border-width': 3, 'border-color': t.accent },
		},
		{
			selector: '.focus-edge',
			style: { opacity: 0.95, width: 2.4, 'z-index': 40 },
		},
		{
			selector: 'node.match',
			style: { 'border-width': 3, 'border-color': t.accent },
		},
		{
			selector: '.dim',
			style: { opacity: 0.06, 'text-opacity': 0, events: 'no' },
		},
		{
			selector: 'node:active',
			style: { 'overlay-opacity': 0.1 },
		},
	];
}

const cy = cytoscape({
	container,
	elements,
	style: buildStyle(theme),
	layout: {
		name: 'fcose',
		quality: 'proof',
		animate: false,
		randomize: true,
		padding: 40,
		nodeSeparation: 120,
		idealEdgeLength: (edge: cytoscape.EdgeSingular) =>
			edge.data('edgeType') === 'tag' ? 90 : edge.data('edgeType') === 'cluster' ? 60 : 160,
		edgeElasticity: (edge: cytoscape.EdgeSingular) => (edge.data('edgeType') === 'wikilink' ? 0.1 : 0.45),
		nodeRepulsion: (node: cytoscape.NodeSingular) => {
			const type = node.data('nodeType');
			if (type === 'cluster') return 30000;
			if (type === 'tag') return 18000;
			return 7000;
		},
		gravity: 0.3,
		gravityRange: 3.2,
		numIter: 3000,
		tile: false,
		nodeDimensionsIncludeLabels: true,
	} as cytoscape.LayoutOptions,
	minZoom: 0.2,
	maxZoom: 3,
	// 页面里嵌的画布不该抢走滚动，缩放交给下面的 ⌘/Ctrl + 滚轮。
	userZoomingEnabled: false,
	boxSelectionEnabled: false,
});

const posts = cy.nodes('[nodeType="post"]');
let focused: cytoscape.NodeSingular | null = null;
let searching = false;

/** 窄屏容器是竖长条，整图按宽度缩放后节点会小到点不中，给一个可用下限。 */
const MIN_USEFUL_ZOOM = 0.45;

function fitTo(eles: cytoscape.Collection, padding: number, duration = 300) {
	cy.animate({ fit: { eles, padding }, duration }, {
		complete: () => {
			if (cy.zoom() < MIN_USEFUL_ZOOM) {
				cy.zoom({ level: MIN_USEFUL_ZOOM, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
				cy.center(eles);
			}
		},
	});
}

/** 缩放到一定程度后文章标题不再互相压叠，可以整片放出来。 */
const ZOOM_LABEL_THRESHOLD = 1.25;

function syncPostLabels() {
	if (focused || searching) return;
	posts.toggleClass('labeled', cy.zoom() >= ZOOM_LABEL_THRESHOLD);
}

function clearHighlight() {
	cy.elements().removeClass('dim focus-edge match');
	posts.removeClass('labeled');
	focused = null;
	syncPostLabels();
}

function highlight(node: cytoscape.NodeSingular) {
	const neighborhood = node.closedNeighborhood();
	cy.elements().addClass('dim').removeClass('focus-edge');
	neighborhood.removeClass('dim');
	neighborhood.edges().addClass('focus-edge');
	posts.removeClass('labeled');
	neighborhood.nodes('[nodeType="post"]').addClass('labeled');
	focused = node;
}

function renderPanel(node: cytoscape.NodeSingular) {
	if (!panel || !panelBody) return;
	const type = node.data('nodeType') as GraphNode['type'];
	const neighbors = node.neighborhood('node');
	const groups: [string, cytoscape.NodeCollection][] = [
		[copy.belong, neighbors.filter((n) => n.data('nodeType') === 'cluster')],
		[copy.relatedTags, neighbors.filter((n) => n.data('nodeType') === 'tag')],
		[copy.relatedPosts, neighbors.filter((n) => n.data('nodeType') === 'post')],
	];

	// 热门标签能牵出近 30 篇文章，全列出来面板会长到溢出画布；截断，全量走标签页。
	const LIST_CAP = 8;
	const list = (eles: cytoscape.NodeCollection) => {
		const items = eles
			.map((n) => {
				const href = n.data('url');
				const text = escapeHtml(n.data('label'));
				return href ? `<li><a href="${escapeHtml(href)}">${text}</a></li>` : `<li>${text}</li>`;
			})
			.slice(0, LIST_CAP);
		if (eles.length > LIST_CAP) items.push(`<li class="more">+${eles.length - LIST_CAP}</li>`);
		return items.join('');
	};

	const typeLabel = type === 'cluster' ? copy.cluster : type === 'tag' ? copy.tag : copy.post;
	const url = node.data('url') as string;
	const primary =
		url && type !== 'cluster'
			? `<a class="panel-primary" href="${escapeHtml(url)}">${type === 'tag' ? copy.openTag : copy.openPost}</a>`
			: '';

	panelBody.innerHTML = `
		<p class="panel-kicker">${typeLabel}</p>
		<h2>${escapeHtml(node.data('label'))}</h2>
		${primary}
		${groups
			.filter(([, eles]) => eles.length)
			.map(([title, eles]) => `<h3>${title}<span>${eles.length}</span></h3><ul>${list(eles)}</ul>`)
			.join('')}
	`;
	panel.hidden = false;
}

function closePanel() {
	if (panel) panel.hidden = true;
	clearHighlight();
}

function applyClusterFilter(clusterId: string) {
	searchInput && (searchInput.value = '');
	searching = false;
	if (searchStatus) searchStatus.textContent = '';
	clearHighlight();
	if (clusterId === 'all') {
		fitTo(cy.elements(), 30);
		return;
	}
	const tags = cy.nodes(`[nodeType="tag"][cluster="${clusterId}"]`);
	const keep = cy
		.getElementById(`cluster:${clusterId}`)
		.union(tags)
		.union(tags.neighborhood('node[nodeType="post"]'))
		.closedNeighborhood();
	cy.elements().difference(keep).addClass('dim');
	keep.nodes('[nodeType="post"]').addClass('labeled');
	fitTo(keep, 40);
}

cy.on('tap', 'node', (evt) => {
	// 只高亮、不动镜头：密集图里每点一次就飞一次视角非常晕。
	highlight(evt.target);
	renderPanel(evt.target);
});

cy.on('tap', (evt) => {
	if (evt.target === cy) closePanel();
});

cy.on('dbltap', 'node', (evt) => {
	const node = evt.target;
	if (node.data('nodeType') === 'post' && node.data('url')) {
		window.location.href = node.data('url');
		return;
	}
	fitTo(node.closedNeighborhood(), 60, 320);
});

cy.on('mouseover', 'node', (evt) => {
	evt.target.addClass('hover');
	if (evt.target.data('nodeType') === 'post') evt.target.addClass('labeled');
	container.style.cursor = 'pointer';
});
cy.on('mouseout', 'node', (evt) => {
	evt.target.removeClass('hover');
	if (!focused && !searching && cy.zoom() < ZOOM_LABEL_THRESHOLD) evt.target.removeClass('labeled');
	container.style.cursor = 'default';
});

cy.on('zoom', syncPostLabels);

// ⌘ / Ctrl + 滚轮才缩放，普通滚轮留给页面；触控板捏合本身带 ctrlKey，天然可用。
let hintTimer: number | undefined;
container.addEventListener(
	'wheel',
	(event) => {
		if (!(event.ctrlKey || event.metaKey)) {
			if (hint) {
				hint.classList.add('show');
				window.clearTimeout(hintTimer);
				hintTimer = window.setTimeout(() => hint.classList.remove('show'), 1200);
			}
			return;
		}
		event.preventDefault();
		const rect = container.getBoundingClientRect();
		cy.zoom({
			level: cy.zoom() * (1 - event.deltaY * 0.002),
			renderedPosition: { x: event.clientX - rect.left, y: event.clientY - rect.top },
		});
	},
	{ passive: false },
);

panelClose?.addEventListener('click', closePanel);

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && panel && !panel.hidden) closePanel();
});

filterBar?.addEventListener('click', (event) => {
	const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-cluster]');
	if (!button) return;
	filterBar.querySelectorAll('button').forEach((el) => el.classList.toggle('active', el === button));
	applyClusterFilter(button.dataset.cluster || 'all');
});

resetButton?.addEventListener('click', () => {
	if (searchInput) searchInput.value = '';
	searching = false;
	if (searchStatus) searchStatus.textContent = '';
	filterBar?.querySelectorAll('button').forEach((el) => el.classList.toggle('active', el.dataset.cluster === 'all'));
	closePanel();
	fitTo(cy.elements(), 30);
});

let searchTimer: number | undefined;
searchInput?.addEventListener('input', () => {
	window.clearTimeout(searchTimer);
	searchTimer = window.setTimeout(() => {
		const q = searchInput.value.trim().toLowerCase();
		if (!q) {
			searching = false;
			if (searchStatus) searchStatus.textContent = '';
			clearHighlight();
			return;
		}
		searching = true;
		const hits = cy.nodes().filter((n) => String(n.data('label')).toLowerCase().includes(q));
		cy.elements().removeClass('focus-edge match').addClass('dim');
		posts.removeClass('labeled');
		if (searchStatus) {
			searchStatus.textContent = hits.length
				? copy.matchCount.replace('{n}', String(hits.length))
				: copy.noMatch;
		}
		if (!hits.length) return;
		const scope = hits.closedNeighborhood();
		scope.removeClass('dim');
		hits.addClass('match');
		scope.nodes('[nodeType="post"]').addClass('labeled');
		fitTo(scope, 60, 260);
	}, 200);
});

cy.ready(() => {
	stage?.classList.add('ready');
	// 布局自带的 fit 不经过 fitTo，窄屏上会把整图压到点不中的尺寸。
	if (cy.zoom() < MIN_USEFUL_ZOOM) {
		cy.zoom({ level: MIN_USEFUL_ZOOM, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
		cy.center();
	}
	syncPostLabels();
	const focusTag = new URLSearchParams(window.location.search).get('tag');
	if (focusTag) {
		const node = cy.getElementById(`tag:${focusTag}`);
		if (node.nonempty()) {
			highlight(node);
			renderPanel(node);
			fitTo(node.closedNeighborhood(), 60, 320);
		}
	}
});

const observer = new MutationObserver(() => {
	theme = readTheme();
	cy.style(buildStyle(theme) as cytoscape.Stylesheet[]).update();
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

document.addEventListener(
	'astro:before-swap',
	() => {
		observer.disconnect();
		cy.destroy();
	},
	{ once: true },
);
