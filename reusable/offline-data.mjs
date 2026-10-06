/**
 * Independent implementation of the LINE Flex editor tree model.
 *
 * Written against the public Flex Message spec. Round-trip is verified
 * against the 12 official showcase samples in ../samples, and error-path
 * mapping is verified against recorded responses from the official
 * validation endpoint in ../research. This is not the server validator.
 *
 * The tree model intentionally represents only what a structured Flex editor
 * needs: a bubble round-trip preserves size/direction/blocks/styles but
 * drops bubble.action and any other bubble fields it does not represent.
 * Keep your own copy of the input when those fields matter.
 */

const BLOCKS = ['header', 'hero', 'body', 'footer'];

/** Default component factories, mirroring the editor's "add" menu. */
function createComponent(type) {
  switch (type) {
    case 'bubble':
      return { type: 'bubble', body: createComponent('box') };
    case 'carousel':
      return { type: 'carousel', contents: [createComponent('bubble'), createComponent('bubble')] };
    case 'box':
      return { type: 'box', layout: 'vertical', contents: [] };
    case 'text':
      return { type: 'text', text: 'hello, world' };
    case 'span':
      return { type: 'span', text: 'hello, world' };
    case 'image':
      return { type: 'image', url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png' };
    case 'video':
      return {
        type: 'video',
        url: 'https_url_to_video',
        previewUrl: 'https_url_to_preview_image',
        altContent: {
          type: 'image',
          size: 'full',
          aspectRatio: '20:13',
          aspectMode: 'cover',
          url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
        },
      };
    case 'button':
      return { type: 'button', action: createComponent('uri') };
    case 'filler':
      return { type: 'filler' };
    case 'icon':
      return { type: 'icon', url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png' };
    case 'separator':
      return { type: 'separator' };
    case 'postback':
      return { type: 'postback', label: 'action', data: 'hello' };
    case 'message':
      return { type: 'message', label: 'action', text: 'hello' };
    case 'uri':
      return { type: 'uri', label: 'action', uri: 'http://linecorp.com/' };
    case 'datetimepicker':
      return { type: 'datetimepicker', label: 'action', data: 'hello', mode: 'date' };
    case 'linearGradient':
      return { type: 'linearGradient', angle: '0deg', startColor: '#000000', endColor: '#ffffff' };
    default:
      return null;
  }
}

/** Flex JSON -> editor tree (nodes get ids, bubble blocks become child nodes). */
class FlexToTree {
  constructor({ idgen = () => globalThis.crypto.randomUUID() } = {}) {
    this.idgen = idgen;
  }

  convert(flex, isRoot = false) {
    if (flex == null) throw new Error(`unexpected data: ${flex}`);
    if (flex.type === 'carousel') return this.carouselToTree(flex);
    if (flex.type === 'bubble') {
      const tree = this.bubbleToTree(flex);
      tree.root = isRoot;
      return tree;
    }
    return this.componentToTree(flex);
  }

  carouselToTree(carousel) {
    if (carousel == null) throw new Error(`unexpected data: ${carousel}`);
    return {
      type: 'carousel',
      id: this.idgen(),
      root: true,
      children: carousel.contents.map((bubble) => this.bubbleToTree(bubble)),
    };
  }

  bubbleToTree(bubble) {
    if (bubble == null) throw new Error(`unexpected data: ${bubble}`);
    const tree = { type: 'bubble', id: this.idgen(), root: false };
    if (bubble.size !== undefined) tree.size = bubble.size;
    if (bubble.direction !== undefined) tree.direction = bubble.direction;
    tree.children = BLOCKS.map((name) => this.blockToTree(name, bubble));
    return tree;
  }

  blockToTree(name, bubble) {
    return {
      type: name,
      id: this.idgen(),
      style: bubble.styles && bubble.styles[name] ? bubble.styles[name] : {},
      children: bubble[name] ? [this.componentToTree(bubble[name])] : [],
    };
  }

  componentToTree(component) {
    if (component == null) throw new Error(`unexpected data: ${component}`);
    if (component.type === undefined || component.type === null) {
      throw new Error(`unexpected component type: ${component.type}`);
    }
    const node = { id: this.idgen() };
    for (const [key, value] of Object.entries(component)) {
      if (key === 'contents') node.children = value.map((child) => this.componentToTree(child));
      else if (key === 'altContent') node.children = [this.componentToTree(value)];
      else node[key] = value;
    }
    return node;
  }
}

/** Editor tree -> Flex JSON (inverse of FlexToTree, drops editor-only ids). */
class TreeToFlex {
  constructor({ withId = false } = {}) {
    this.withId = withId;
  }

  convert(tree) {
    if (tree == null) throw new Error(`unexpected data: ${tree}`);
    if (tree.type === 'carousel') return this.carouselToFlex(tree);
    if (tree.type === 'bubble') return this.bubbleToFlex(tree);
    return this.componentToFlex(tree);
  }

  carouselToFlex(carousel) {
    if (carousel == null) throw new Error(`unexpected data: ${carousel}`);
    return { type: 'carousel', contents: carousel.children.map((bubble) => this.bubbleToFlex(bubble)) };
  }

  bubbleToFlex(bubble) {
    if (bubble == null) throw new Error(`unexpected data: ${bubble}`);
    const flex = { type: 'bubble' };
    const styles = {};
    for (const [key, value] of Object.entries(bubble)) {
      if (key === 'id' || key === 'root') continue;
      if (key !== 'children') {
        flex[key] = value;
        continue;
      }
      for (const block of value) {
        const name = block.type;
        if (Array.isArray(block.children) && block.children.length === 1) {
          flex[name] = this.componentToFlex(block.children[0]);
        }
        if (block.style && Object.keys(block.style).length > 0) styles[name] = block.style;
      }
    }
    if (Object.keys(styles).length > 0) flex.styles = styles;
    return flex;
  }

  componentToFlex(node) {
    if (node == null) throw new Error(`unexpected data: ${node}`);
    if (node.type === undefined || node.type === null) {
      throw new Error(`unexpected component type: ${node.type}`);
    }
    const flex = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === 'id' && !this.withId) continue;
      if (key === 'children' && node.type === 'video') {
        flex.altContent = value.length === 1 ? this.componentToFlex(value[0]) : null;
      } else if (key === 'children') {
        flex.contents = value.map((child) => this.componentToFlex(child));
      } else {
        flex[key] = value;
      }
    }
    return flex;
  }
}

/** Map a server error path (e.g. "/hero/size") to a tree node + property. */
const errorPathMapper = {
  findByPath(path, root) {
    const segments = typeof path === 'string' ? path.split('/').filter((s) => s.length > 0) : [...path];
    if (root.type === 'carousel') return this.carouselLookup(segments, root);
    if (root.type === 'bubble') return this.bubbleLookup(segments, root);
    return this.resolve(segments, root);
  },

  carouselLookup(segments, root) {
    const head = segments.shift();
    if (head === 'contents') {
      const index = parseInt(segments.shift(), 10);
      if (index >= 0) return this.findByPath(segments, root.children[index]);
    }
    return { node: root, property: head };
  },

  bubbleLookup(segments, root) {
    const head = segments.shift();
    if (head === 'styles') {
      const block = root.children.find((child) => child.type === segments.shift());
      segments.unshift('style');
      return this.resolve(segments, block);
    }
    if (head === 'header' || head === 'hero' || head === 'body' || head === 'footer') {
      const block = root.children.find((child) => child.type === head);
      return this.resolve(segments, block.children[0]);
    }
    return { node: root, property: head };
  },

  resolve(segments, node) {
    const head = segments.shift();
    if (head === 'contents') {
      const index = parseInt(segments.shift(), 10);
      if (index >= 0) return this.resolve(segments, node.children[index]);
      return { node, property: 'contents' };
    }
    if (head === 'style' || head === 'background' || head === 'action') {
      return { node, property: segments.shift(), parent: head };
    }
    return { node, property: head };
  },
};

function cloneTree(node) {
  if (node == null) return null;
  const copy = { ...node };
  if (copy.type === 'header' || copy.type === 'hero' || copy.type === 'body' || copy.type === 'footer') {
    copy.style = cloneTree(node.style);
  }
  if (node.children) copy.children = node.children.map((child) => cloneTree(child));
  if (node.action) copy.action = cloneTree(node.action);
  return copy;
}

function findById(node, id) {
  if (node == null) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findById(child, id);
      if (found != null) return found;
    }
  }
  return null;
}

function removeNode(node, id) {
  if (node == null) return null;
  if (node.id === id) return null;
  if (node.children) {
    node.children = node.children.map((child) => removeNode(child, id)).filter((child) => child != null);
  }
  return node;
}

function moveNode(node, id, direction) {
  if (node == null) return null;
  if (node.id === id) return node;
  if (node.children) {
    let index = -1;
    node.children.forEach((child, i) => {
      if (moveNode(child, id, direction) != null) index = i;
    });
    if (index >= 0) {
      const target = index + (direction > 0 ? 1 : -1);
      if (target >= 0 && target < node.children.length) {
        [node.children[index], node.children[target]] = [node.children[target], node.children[index]];
      }
    }
  }
  return null;
}

/** Editor facade: operates on a deep copy, so the source tree stays untouched. */
class FlexTreeEditor {
  constructor(root) {
    this.root = cloneTree(root);
    this.flexToTree = new FlexToTree();
  }

  getRoot() {
    return this.root;
  }

  findById(id) {
    return findById(this.root, id);
  }

  findByPath(path) {
    return errorPathMapper.findByPath(path, this.root);
  }

  addNode(parentId, component) {
    const parent = this.findById(parentId);
    if (parent == null) {
      console.error('node not found');
      return;
    }
    const child = this.flexToTree.convert(component);
    if (Array.isArray(parent.children)) parent.children.push(child);
    else parent.children = [child];
  }

  removeNode(id) {
    removeNode(this.root, id);
  }

  moveNode(id, direction) {
    moveNode(this.root, id, direction);
  }
}

export { FlexToTree, TreeToFlex, FlexTreeEditor, errorPathMapper, cloneTree, createComponent };
