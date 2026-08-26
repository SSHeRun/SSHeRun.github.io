import type { Locale } from '../i18n/config';
import { localizedPath } from '../i18n/config';
import { clusterLabel, tagLabel } from '../i18n/ui';
import { getTagCluster, TAG_CLUSTERS, TAG_RELATIONS, tagPath, unknownTags } from './taxonomy';

export type GraphPost = {
	id: string;
	data: { title: string; tags?: string[]; translationKey?: string; lang?: 'zh' | 'en' };
	body?: string;
};

export type GraphNode = {
	id: string;
	label: string;
	type: 'post' | 'tag' | 'cluster';
	url?: string;
	cluster?: string;
	clusterColor?: string;
	weight?: number;
};

export type GraphEdge = {
	source: string;
	target: string;
	type: 'tag' | 'wikilink' | 'related-tag' | 'cluster';
};

export type GraphPayload = {
	nodes: GraphNode[];
	edges: GraphEdge[];
	stats: { posts: number; tags: number; clusters: number; edges: number };
	unknownTags: string[];
};

const edgeKey = (s: string, t: string, type: string) => `${s}\0${t}\0${type}`;

function postKey(post: GraphPost): string {
	return post.data.translationKey ?? post.id.replace(/\.en$/, '');
}

export function buildGraphData(posts: GraphPost[], locale: Locale = 'zh-CN'): GraphPayload {
	const nodes: GraphNode[] = [];
	const edges: GraphEdge[] = [];
	const seenEdges = new Set<string>();
	const tagCount = new Map<string, number>();
	const usedClusters = new Set<string>();
	const stray: string[] = [];

	function addEdge(source: string, target: string, type: GraphEdge['type']) {
		if (source === target) return;
		const key = edgeKey(source, target, type);
		if (seenEdges.has(key)) return;
		seenEdges.add(key);
		edges.push({ source, target, type });
	}

	for (const cluster of TAG_CLUSTERS) {
		nodes.push({
			id: `cluster:${cluster.id}`,
			label: clusterLabel(locale, cluster.id),
			type: 'cluster',
			cluster: cluster.id,
			clusterColor: cluster.color,
			weight: cluster.tags.length,
		});
	}

	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
		}
	}

	for (const [tag, count] of tagCount) {
		const cluster = getTagCluster(tag);
		if (!cluster) stray.push(tag);
		else usedClusters.add(cluster.id);

		nodes.push({
			id: `tag:${tag}`,
			label: tagLabel(locale, tag),
			type: 'tag',
			url: tagPath(tag, locale),
			cluster: cluster?.id,
			clusterColor: cluster?.color,
			weight: count,
		});

		if (cluster) {
			addEdge(`cluster:${cluster.id}`, `tag:${tag}`, 'cluster');
		}
	}

	for (const cluster of TAG_CLUSTERS) {
		if (!usedClusters.has(cluster.id)) {
			const idx = nodes.findIndex((n) => n.id === `cluster:${cluster.id}`);
			if (idx >= 0) nodes.splice(idx, 1);
		}
	}

	for (const [a, b] of TAG_RELATIONS) {
		if (tagCount.has(a) && tagCount.has(b)) {
			addEdge(`tag:${a}`, `tag:${b}`, 'related-tag');
		}
	}

	const postIds = new Set(posts.map((p) => postKey(p)));

	for (const post of posts) {
		const key = postKey(post);
		const primaryTag = (post.data.tags ?? []).find((tag) => getTagCluster(tag));
		const cluster = primaryTag ? getTagCluster(primaryTag) : undefined;
		nodes.push({
			id: key,
			label: post.data.title,
			type: 'post',
			url: localizedPath(locale, `/blog/${key}/`),
			cluster: cluster?.id,
			clusterColor: cluster?.color,
			weight: post.data.tags?.length ?? 1,
		});

		for (const tag of post.data.tags ?? []) {
			addEdge(key, `tag:${tag}`, 'tag');
		}

		const wikilinks = (post.body || '').match(/\[\[([^\]|#]+)/g);
		if (wikilinks) {
			for (const match of wikilinks) {
				const target = match.slice(2).trim().replace(/\.en$/, '');
				if (postIds.has(target) || posts.some((p) => p.id === target)) {
					addEdge(key, target, 'wikilink');
				}
			}
		}
	}

	return {
		nodes,
		edges,
		stats: {
			posts: posts.length,
			tags: tagCount.size,
			clusters: usedClusters.size,
			edges: edges.length,
		},
		unknownTags: [...new Set([...stray, ...posts.flatMap((p) => unknownTags(p.data.tags ?? []))])],
	};
}
