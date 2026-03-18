import { visit } from 'unist-util-visit';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const WIKILINK_RE = /!?\[\[([^\]]+)\]\]/g;

function parseWikilink(raw) {
  const isEmbed = raw.startsWith('!');
  const inner = raw.replace(/^!?\[\[|\]\]$/g, '');

  let target = inner;
  let display = null;
  let heading = null;

  const pipeIdx = inner.indexOf('|');
  if (pipeIdx !== -1) {
    target = inner.slice(0, pipeIdx).trim();
    display = inner.slice(pipeIdx + 1).trim();
  }

  const hashIdx = target.indexOf('#');
  if (hashIdx !== -1) {
    heading = target.slice(hashIdx + 1).trim();
    target = target.slice(0, hashIdx).trim();
  }

  return { isEmbed, target, display, heading };
}

function buildUrl(target, heading, pathPrefix) {
  const ext = target.match(/\.(png|jpe?g|gif|webp|svg|mp4|webm|pdf)$/i);
  if (ext) return target;

  const slug = slugify(target);
  let url = `${pathPrefix}${slug}/`;
  if (heading) url += `#${slugify(heading)}`;
  return url;
}

/**
 * Remark plugin for Obsidian-style wikilinks.
 *
 * Supports:
 *   [[page]]              → internal link
 *   [[page|text]]         → internal link with display text
 *   [[page#heading]]      → internal link with anchor
 *   [[page#heading|text]] → internal link with anchor + display text
 *   ![[image.png]]        → image embed
 */
export default function remarkWikilinks(opts = {}) {
  const pathPrefix = opts.pathPrefix ?? '/blog/';

  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || !WIKILINK_RE.test(node.value)) return;

      WIKILINK_RE.lastIndex = 0;
      const children = [];
      let lastIdx = 0;
      let match;

      while ((match = WIKILINK_RE.exec(node.value)) !== null) {
        if (match.index > lastIdx) {
          children.push({ type: 'text', value: node.value.slice(lastIdx, match.index) });
        }

        const raw = match[0];
        const { isEmbed, target, display, heading } = parseWikilink(raw);
        const url = buildUrl(target, heading, pathPrefix);

        if (isEmbed && /\.(png|jpe?g|gif|webp|svg)$/i.test(target)) {
          children.push({
            type: 'image',
            url,
            alt: display || target,
            data: { hProperties: { class: 'wikilink-embed' } },
          });
        } else {
          const linkText = display || (heading ? `${target} > ${heading}` : target);
          children.push({
            type: 'link',
            url,
            data: { hProperties: { class: 'wikilink' } },
            children: [{ type: 'text', value: linkText }],
          });
        }

        lastIdx = match.index + raw.length;
      }

      if (lastIdx < node.value.length) {
        children.push({ type: 'text', value: node.value.slice(lastIdx) });
      }

      if (children.length > 0) {
        parent.children.splice(index, 1, ...children);
        return index + children.length;
      }
    });
  };
}
