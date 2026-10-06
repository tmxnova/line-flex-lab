/**
 * Per-node UI rules for a Flex editor outline: which component types may be
 * added under each node, which nodes can be copied/moved/removed, and the
 * outline label for display.
 *
 * Written from the public Flex Message spec and the editor rules observed in
 * LINE's official Flex tooling. This is NOT the server validator —
 * a node being "addable" here only reflects editor UX, not what LINE accepts.
 */

const BASE = {
  name: 'none',
  canCopy: true,
  canMove: true,
  isAddable: false,
  addableTypes: [],
  isRemovable: false,
  iconClass: null,
  isDeprecated: false,
};

function withRules(overrides) {
  return { ...BASE, ...overrides };
}

function shortText(text) {
  return text.length > 10 ? `${text.substring(0, 9)}...` : text;
}

function textOutlineLabel(node) {
  if (Array.isArray(node.children) && node.children.length > 0) return 'text';
  return node.text ? `text [${shortText(node.text)}]` : 'text';
}

function spanOutlineLabel(node) {
  return node.text ? `span [${shortText(node.text)}]` : 'span';
}

class ComponentMetadata {
  static of(node) {
    if (!node) return null;
    switch (node.type) {
      case 'carousel':
        return withRules({
          name: 'carousel',
          canCopy: false,
          canMove: false,
          isAddable: true,
          isRemovable: false,
          addableTypes: ['bubble'],
        });
      case 'bubble':
        return withRules({
          name: 'bubble',
          canMove: !node.root,
          isRemovable: !node.root,
        });
      case 'box':
        return this.boxRules(node);
      case 'header':
      case 'hero':
      case 'body':
      case 'footer':
        return withRules({
          name: node.type,
          canCopy: false,
          canMove: false,
          isAddable: node.children.length === 0,
          addableTypes: node.type === 'hero' ? ['box', 'image', 'video'] : ['box'],
        });
      case 'text':
        return withRules({
          name: textOutlineLabel(node),
          isRemovable: true,
          iconClass: 'fa-font',
          isAddable: true,
          addableTypes: ['span'],
        });
      case 'span':
        return withRules({ name: spanOutlineLabel(node), isRemovable: true, iconClass: 'fa-font' });
      case 'image':
        return withRules({ name: 'image', isRemovable: true, iconClass: 'fa-picture-o' });
      case 'video': {
        const missingAlt = node.children.length === 0;
        return withRules({
          name: missingAlt ? 'video (Please set altContent by adding child node)' : 'video',
          isRemovable: true,
          isAddable: missingAlt,
          iconClass: 'fa-picture-o',
          addableTypes: ['box', 'image'],
        });
      }
      case 'button':
        return withRules({
          name: node.action && node.action.label ? `button [${node.action.label}]` : 'button',
          isRemovable: true,
          iconClass: 'fa-caret-square-o-right',
        });
      case 'filler':
        return withRules({ name: 'filler', isRemovable: true, iconClass: 'fa-arrows' });
      case 'icon':
        return withRules({ name: 'icon', isRemovable: true, iconClass: 'fa-smile-o' });
      case 'separator':
        return withRules({ name: 'separator', isRemovable: true, iconClass: 'fa-minus-square-o' });
      case 'spacer':
        return withRules({ name: 'spacer', isRemovable: true, iconClass: 'fa-square-o', isDeprecated: true });
      default:
        throw new Error(`unexpected type: ${node.type}`);
    }
  }

  static boxRules(node) {
    let name = 'box';
    let addable = [];
    if (node.layout === 'baseline') {
      name = 'box [baseline]';
      addable = ['icon', 'text', 'filler'];
    } else if (node.layout === 'horizontal' || node.layout === 'vertical') {
      name = `box [${node.layout}]`;
      addable = ['box', 'image', 'text', 'button', 'filler', 'separator'];
    }
    return withRules({ name, isAddable: true, addableTypes: addable, isRemovable: true });
  }
}

export { ComponentMetadata };
