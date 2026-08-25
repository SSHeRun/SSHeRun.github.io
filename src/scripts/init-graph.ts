import cytoscape from 'cytoscape';

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
};

type GraphPayload = {
	nodes: GraphNode[];
	edges: GraphEdge[];
	ui?: GraphUi;
};

function readTheme() {
	const s = getComputedStyle(document.documentElement);
	return {
		accent: s.getPropertyValue('--accent').trim() || '#0891b2',
		accentSecondary: s.getPropertyValue('--accent-secondary').trim() || '#7c3aed',
		text: s.getPropertyValue('--text-primary').trim() || '#1e293b',
		muted: s.getPropertyValue('--text-muted').trim() || '#94a3b8',
		border: s.getPropertyValue('--border').trim() || '#e2e8f0',
		surface: s.getPropertyValue('--bg-surface').trim() || '#ffffff',
	};
}

function payload(): GraphPayload {
	const el = document.getElementById('graph-data');
	if (!el?.textContent) return { nodes: [], edges: [], ui: undefined };
	return JSON.parse(el.textContent);
}

const data = payload();
const container = document.getElementById('cy');
const panel = document.getElementById('graph-panel');
const panelBody = document.getElementById('graph-panel-body');
const panelClose = document.getElementById('graph-panel-close');
const searchInput = document.getElementById('graph-search') as HTMLInputElement | null;
const filterBar = document.getElementById('graph-filters');

if (!container) {
	throw new Error('图谱容器不存在');
}

const theme = readTheme();
const elements = [
	...data.nodes.map((node) => ({
		data: {
			id: node.id,
			label: node.label,
			nodeType: node.type,
			url: node.url || '',
			cluster: node.cluster || '',
			clusterColor: node.clusterColor || theme.accentSecondary,
			weight: node.weight ?? 1,
		},
	})),
	...data.edges.map((edge) => ({
		data: {
			source: edge.source,
			target: edge.target,
			edgeType: edge.type,
		},
	})),
];

const cy = cytoscape({
	container,
	elements,
	style: [
		{
			selector: 'node[nodeType="cluster"]',
			style: {
				'background-color': 'data(clusterColor)',
				label: 'data(label)',
				color: theme.text,
				'font-size': '13px',
				'font-weight': 700,
				'text-valign': 'center',
				'text-halign': 'center',
				width: 72,
				height: 72,
				shape: 'round-rectangle',
				'border-width': 2,
				'border-color': 'data(clusterColor)',
				'text-max-width': '70px',
				'text-wrap': 'wrap',
				'text-outline-color': theme.surface,
				'text-outline-width': 3,
			},
		},
		{
			selector: 'node[nodeType="tag"]',
			style: {
				'background-color': 'data(clusterColor)',
				label: 'data(label)',
				color: theme.text,
				'font-size': '12px',
				'text-valign': 'bottom',
				'text-margin-y': 6,
				width: 'mapData(weight, 1, 12, 20, 38)',
				height: 'mapData(weight, 1, 12, 20, 38)',
				shape: 'diamond',
				'border-width': 2,
				'border-color': 'data(clusterColor)',
			},
		},
		{
			selector: 'node[nodeType="post"]',
			style: {
				'background-color': theme.accent,
				label: 'data(label)',
				color: theme.text,
				'font-size': '11px',
				'text-valign': 'bottom',
				'text-margin-y': 6,
				width: 26,
				height: 26,
				'border-width': 2,
				'border-color': theme.accent,
				'text-max-width': '110px',
				'text-wrap': 'ellipsis',
			},
		},
		{
			selector: 'edge[edgeType="cluster"]',
			style: {
				'line-color': theme.border,
				width: 1.2,
				'curve-style': 'bezier',
				opacity: 0.35,
				'line-style': 'dashed',
			},
		},
		{
			selector: 'edge[edgeType="related-tag"]',
			style: {
				'line-color': theme.accentSecondary,
				width: 2,
				'curve-style': 'bezier',
				opacity: 0.45,
			},
		},
		{
			selector: 'edge[edgeType="tag"]',
			style: {
				'line-color': theme.border,
				width: 1.4,
				'curve-style': 'bezier',
				opacity: 0.5,
			},
		},
		{
			selector: 'edge[edgeType="wikilink"]',
			style: {
				'line-color': theme.accent,
				width: 2,
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle',
				'target-arrow-color': theme.accent,
				'arrow-scale': 0.8,
				opacity: 0.75,
			},
		},
		{
			selector: 'node:active',
			style: { 'overlay-opacity': 0 },
		},
		{
			selector: '.dim',
			style: { opacity: 0.12 },
		},
		{
			selector: '.hover',
			style: { 'border-width': 3, 'font-weight': 'bold' },
		},
		{
			selector: '.match',
			style: { 'border-width': 3, 'border-color': theme.accent },
		},
	],
	layout: {
		name: 'cose',
		idealEdgeLength: 110,
		nodeOverlap: 24,
		padding: 36,
		animate: true,
		animationDuration: 600,
		componentSpacing: 80,
		nodeRepulsion: () => 6400,
		gravity: 0.25,
		numIter: 1200,
	},
	minZoom: 0.25,
	maxZoom: 3,
	wheelSensitivity: 0.25,
});

function clearDim() {
	cy.elements().removeClass('dim');
}

function focusNeighborhood(node: cytoscape.NodeSingular) {
	clearDim();
	const neighborhood = node.closedNeighborhood();
	cy.elements().difference(neighborhood).addClass('dim');
	cy.animate({
		fit: { eles: neighborhood, padding: 60 },
		duration: 280,
	});
}

function renderPanel(node: cytoscape.NodeSingular) {
	if (!panel || !panelBody) return;
	const type = node.data('nodeType') as GraphNode['type'];
	const label = node.data('label') as string;
	const url = node.data('url') as string;
	const neighbors = node.neighborhood('node');
	const tags = neighbors.filter((n) => n.data('nodeType') === 'tag');
	const posts = neighbors.filter((n) => n.data('nodeType') === 'post');
	const clusters = neighbors.filter((n) => n.data('nodeType') === 'cluster');

	const list = (eles: cytoscape.NodeCollection, hrefAttr = 'url') =>
		eles
			.map((n) => {
				const href = n.data(hrefAttr);
				const text = n.data('label');
				return href
					? `<li><a href="${href}">${text}</a></li>`
					: `<li>${text}</li>`;
			})
			.join('');

	const copy = data.ui ?? {
		cluster: '主题群',
		tag: '标签',
		post: '文章',
		openPost: '打开文章',
		openTag: '查看该标签下的文章',
		belong: '所属主题',
		relatedTags: '相关标签',
		relatedPosts: '相关文章',
	};
	const typeLabel = type === 'cluster' ? copy.cluster : type === 'tag' ? copy.tag : copy.post;
	const primary =
		url && type !== 'cluster'
			? `<p><a class="panel-primary" href="${url}">${type === 'tag' ? copy.openTag : copy.openPost}</a></p>`
			: '';

	panelBody.innerHTML = `
		<p class="panel-kicker">${typeLabel}</p>
		<h2>${label}</h2>
		${primary}
		${clusters.length ? `<h3>${copy.belong}</h3><ul>${list(clusters)}</ul>` : ''}
		${tags.length ? `<h3>${copy.relatedTags}</h3><ul>${list(tags)}</ul>` : ''}
		${posts.length ? `<h3>${copy.relatedPosts}</h3><ul>${list(posts)}</ul>` : ''}
	`;
	panel.hidden = false;
}

function applyClusterFilter(clusterId: string) {
	clearDim();
	if (clusterId === 'all') {
		cy.animate({ fit: { eles: cy.elements(), padding: 40 }, duration: 250 });
		return;
	}
	const tags = cy.nodes(`[nodeType="tag"][cluster="${clusterId}"]`);
	const clusterNode = cy.getElementById(`cluster:${clusterId}`);
	const posts = tags.neighborhood('node[nodeType="post"]');
	const keep = clusterNode.union(tags).union(posts).closedNeighborhood();
	cy.elements().difference(keep).addClass('dim');
	cy.animate({ fit: { eles: keep, padding: 50 }, duration: 280 });
}

cy.on('tap', 'node', (evt) => {
	const node = evt.target;
	focusNeighborhood(node);
	renderPanel(node);
});

cy.on('tap', (evt) => {
	if (evt.target === cy) {
		clearDim();
		if (panel) panel.hidden = true;
	}
});

cy.on('dbltap', 'node[nodeType="post"]', (evt) => {
	const url = evt.target.data('url');
	if (url) window.location.href = url;
});

cy.on('mouseover', 'node', (evt) => {
	evt.target.addClass('hover');
	container.style.cursor = 'pointer';
});
cy.on('mouseout', 'node', (evt) => {
	evt.target.removeClass('hover');
	container.style.cursor = 'default';
});

panelClose?.addEventListener('click', () => {
	if (panel) panel.hidden = true;
	clearDim();
});

filterBar?.addEventListener('click', (event) => {
	const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-cluster]');
	if (!button) return;
	filterBar.querySelectorAll('button').forEach((el) => el.classList.toggle('active', el === button));
	applyClusterFilter(button.dataset.cluster || 'all');
});

searchInput?.addEventListener('input', () => {
	const q = searchInput.value.trim().toLowerCase();
	cy.nodes().removeClass('match');
	if (!q) {
		clearDim();
		return;
	}
	const hits = cy.nodes().filter((n) => String(n.data('label')).toLowerCase().includes(q));
	cy.elements().addClass('dim');
	hits.removeClass('dim').addClass('match');
	hits.closedNeighborhood().removeClass('dim');
	if (hits.length) {
		cy.animate({ fit: { eles: hits.closedNeighborhood(), padding: 70 }, duration: 220 });
	}
});

const params = new URLSearchParams(window.location.search);
const focusTag = params.get('tag');
if (focusTag) {
	const node = cy.getElementById(`tag:${focusTag}`);
	if (node.nonempty()) {
		cy.ready(() => {
			focusNeighborhood(node);
			renderPanel(node);
		});
	}
}

const themeRoot = document.documentElement;
const observer = new MutationObserver(() => {
	const next = readTheme();
	cy.style()
		.selector('node[nodeType="post"]')
		.style({
			'background-color': next.accent,
			'border-color': next.accent,
			color: next.text,
		})
		.selector('node[nodeType="tag"], node[nodeType="cluster"]')
		.style({ color: next.text })
		.selector('edge[edgeType="wikilink"]')
		.style({
			'line-color': next.accent,
			'target-arrow-color': next.accent,
		})
		.update();
});
observer.observe(themeRoot, { attributes: true, attributeFilter: ['data-theme'] });

document.addEventListener(
	'astro:before-swap',
	() => {
		observer.disconnect();
		cy.destroy();
	},
	{ once: true },
);
