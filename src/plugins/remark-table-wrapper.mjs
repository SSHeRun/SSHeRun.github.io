import { visit, SKIP } from 'unist-util-visit';

/** 表格外包一层 div.table-wrapper：表格本身保持 100% 宽，窄屏由外层横向滚动。 */
export default function remarkTableWrapper() {
  return (tree) => {
    visit(tree, 'table', (node, index, parent) => {
      if (!parent || index === undefined) return;
      parent.children[index] = {
        type: 'tableWrapper',
        data: { hName: 'div', hProperties: { className: ['table-wrapper'] } },
        children: [node],
      };
      return [SKIP, index + 1];
    });
  };
}
