import { visit } from 'unist-util-visit';

/**
 * 独占一段的图片 → <figure><img><figcaption>alt</figcaption></figure>。
 * 只改 hast 映射（data.hName），图片节点保持原样，Astro 的图片优化照常生效。
 */
function captionFrom(alt, title) {
  const text = alt
    .trim()
    .replace(/^atmosphere(:|\s+of)\s*/i, '')
    .replace(/的?氛围$/, '')
    .trim();
  if (text.length < 2 || text.length > 80) return '';
  // 自动生成的「标题 + 概览/细节」类 alt 只是在复读标题
  if (title && text.startsWith(title.trim())) return '';
  return text;
}

export default function remarkFigureCaption() {
  return (tree, file) => {
    const title = file?.data?.astro?.frontmatter?.title;
    visit(tree, 'paragraph', (node) => {
      const children = node.children.filter(
        (child) => !(child.type === 'text' && child.value.trim() === ''),
      );
      if (children.length !== 1 || children[0].type !== 'image') return;

      const image = children[0];
      const caption = captionFrom(image.alt ?? '', title);
      node.data = { ...node.data, hName: 'figure', hProperties: { className: ['md-figure'] } };
      node.children = [image];
      if (caption) {
        node.children.push({
          type: 'paragraph',
          data: { hName: 'figcaption' },
          children: [{ type: 'text', value: caption }],
        });
      }
    });
  };
}
