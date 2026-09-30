/**
 * Extracted client-side data algorithms from LINE Flex Simulator's downloaded bundle.
 * Source: readable/main.js (TreeToFlex, FlexToTree, path mapping, tree operations).
 * Function bodies are preserved. Changes: module wrapper/exports and replacement of
 * webpack UUID dependency with crypto.randomUUID(). This is NOT the server validator.
 * These original algorithms are not lossless for every possible Flex API field:
 * bubble import preserves size/direction/blocks/styles, but drops bubble action and
 * unknown bubble fields. Validate or retain your input separately when that matters.
 */

const createComponent = function e(t) {
  switch (t) {
    case "bubble":
      return { type: "bubble", body: e("box") };
    case "carousel":
      return {
        type: "carousel",
        contents: [e("bubble"), e("bubble")],
      };
    case "box":
      return { type: "box", layout: "vertical", contents: [] };
    case "text":
      return { type: "text", text: "hello, world" };
    case "span":
      return { type: "span", text: "hello, world" };
    case "image":
      return {
        type: "image",
        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
      };
    case "video":
      return {
        type: "video",
        url: "https_url_to_video",
        previewUrl: "https_url_to_preview_image",
        altContent: {
          type: "image",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
          url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
        },
      };
    case "button":
      return { type: "button", action: e("uri") };
    case "filler":
      return { type: "filler" };
    case "icon":
      return {
        type: "icon",
        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
      };
    case "separator":
      return { type: "separator" };
    case "postback":
      return { type: "postback", label: "action", data: "hello" };
    case "message":
      return { type: "message", label: "action", text: "hello" };
    case "uri":
      return {
        type: "uri",
        label: "action",
        uri: "http://linecorp.com/",
      };
    case "datetimepicker":
      return {
        type: "datetimepicker",
        label: "action",
        data: "hello",
        mode: "date",
      };
    case "linearGradient":
      return {
        type: "linearGradient",
        angle: "0deg",
        startColor: "#000000",
        endColor: "#ffffff",
      };
  }
  return null;
};

class it {
  constructor({ withId: e } = {}) {
    this.withId = e || !1;
  }
  handleCarousel(e) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    return {
      type: "carousel",
      contents: e.children.map((e) => this.handleBubble(e)),
    };
  }
  handleBubble(e) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    const t = { type: "bubble" },
      o = {};
    return (
      Object.keys(e).forEach((n) => {
        "id" === n ||
          "root" === n ||
          ("children" === n
            ? e.children.forEach((e) => {
                const n = e.type,
                  s = e.children;
                (Array.isArray(s) &&
                  1 === s.length &&
                  (t[n] = this.handleComponent(s[0])),
                  Object.keys(e.style).length > 0 && (o[n] = e.style));
              })
            : (t[n] = e[n]));
      }),
      Object.keys(o).length > 0 && (t.styles = o),
      t
    );
  }
  handleComponent(e) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    const t = e.type;
    if (!t) throw new Error(`unexpected component type: ${t}`);
    const o = {};
    return (
      Object.keys(e).forEach((n) => {
        ("id" !== n || this.withId) &&
          ("children" === n && "video" === t
            ? 1 === e.children.length
              ? (o.altContent = this.handleComponent(e.children[0]))
              : (o.altContent = null)
            : "children" === n
              ? (o.contents = e.children.map((e) =>
                  this.handleComponent(e),
                ))
              : (o[n] = e[n]));
      }),
      o
    );
  }
  convert(e) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    switch (e.type) {
      case "carousel":
        return this.handleCarousel(e);
      case "bubble":
        return this.handleBubble(e);
      default:
        return this.handleComponent(e);
    }
  }
}
const rt = { A: () => globalThis.crypto.randomUUID() };
class at {
  constructor({ idgen: e } = {}) {
    this.idgen = e || rt.A;
  }
  handleBlock(e, t) {
    let o = {};
    return (
      t.styles && t.styles[e] && (o = t.styles[e]),
      {
        type: e,
        id: this.idgen(),
        style: o,
        children: t[e] ? [this.handleComponent(t[e])] : [],
      }
    );
  }
  handleCarousel(e) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    return {
      type: "carousel",
      id: this.idgen(),
      root: !0,
      children: e.contents.map((e) => this.handleBubble(e)),
    };
  }
  handleBubble(e) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    const t = {};
    return (
      void 0 !== e.size && (t.size = e.size),
      void 0 !== e.direction && (t.direction = e.direction),
      {
        type: "bubble",
        ...t,
        id: this.idgen(),
        root: !1,
        children: ["header", "hero", "body", "footer"].map((t) =>
          this.handleBlock(t, e),
        ),
      }
    );
  }
  handleComponent(e) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    const t = e.type;
    if (!t) throw new Error(`unexpected component type: ${t}`);
    const o = { id: this.idgen() };
    return (
      Object.keys(e).forEach((t) => {
        "contents" === t
          ? (o.children = e.contents.map((e) =>
              this.handleComponent(e),
            ))
          : "altContent" === t
            ? (o.children = [this.handleComponent(e.altContent)])
            : (o[t] = e[t]);
      }),
      o
    );
  }
  convert(e, t = !1) {
    if (!e) throw new Error(`unexpected data: ${e}`);
    switch (e.type) {
      case "carousel":
        return this.handleCarousel(e);
      case "bubble": {
        const o = this.handleBubble(e);
        return ((o.root = t), o);
      }
      default:
        return this.handleComponent(e);
    }
  }
}
function dt(e, t) {
  const o = e.shift();
  switch (o) {
    case "contents": {
      const n = parseInt(e.shift());
      return n >= 0 ? dt(e, t.children[n]) : { node: t, property: o };
    }
    case "style":
    case "background":
    case "action":
      return { node: t, property: e.shift(), parent: o };
    default:
      return { node: t, property: o };
  }
}
var lt = {
  findByPath: function e(t, o) {
    switch (
      (Array.isArray(t) ||
        (t = t.split("/").filter((e) => e.length > 0)),
      o.type)
    ) {
      case "carousel":
        return (function (t, o) {
          const n = t.shift();
          if ("contents" === n) {
            const n = parseInt(t.shift());
            if (n >= 0) return e(t, o.children[n]);
          }
          return { node: o, property: n };
        })(t, o);
      case "bubble":
        return (function (e, t) {
          const o = e.shift();
          switch (o) {
            case "styles": {
              const o = e.shift();
              return (
                e.unshift("style"),
                dt(
                  e,
                  t.children.find((e) => e.type === o),
                )
              );
            }
            case "header":
            case "hero":
            case "body":
            case "footer":
              return dt(
                e,
                t.children.find((e) => e.type === o).children[0],
              );
            default:
              return { node: t, property: o };
          }
        })(t, o);
      default:
        return dt(t, o);
    }
  },
};
function ct(e, t) {
  if (!e) return null;
  if (e.id === t) return e;
  if (e.children)
    for (const o of e.children) {
      const e = ct(o, t);
      if (null != e) return e;
    }
  return null;
}
function ut(e, t) {
  return e
    ? e.id === t
      ? null
      : (e.children &&
          (e.children = e.children
            .map((e) => ut(e, t))
            .filter((e) => null != e)),
        e)
    : null;
}
function pt(e) {
  if (!e) return null;
  const t = Object.assign({}, e);
  return (
    (function (e) {
      let t = e.type;
      return (
        "header" === t || "hero" === t || "body" === t || "footer" === t
      );
    })(e) && (t.style = pt(e.style)),
    e.children && (t.children = e.children.map((e) => pt(e))),
    e.action && (t.action = pt(e.action)),
    t
  );
}
function mt(e, t, o) {
  if (!e) return null;
  if (e.id === t) return e;
  if (e.children) {
    const n = e.children;
    let s = -1;
    if (
      (n.forEach((e, n) => {
        null != mt(e, t, o) && (s = n);
      }),
      s >= 0)
    ) {
      const e = s + (o > 0 ? 1 : -1);
      e >= 0 && e < n.length && ([n[s], n[e]] = [n[e], n[s]]);
    }
  }
  return null;
}
class ht {
  constructor(e, t = {}) {
    ((this.root = pt(e)), (this.flexToTree = new at(t)));
  }
  getRoot() {
    return this.root;
  }
  findById(e) {
    return ct(this.root, e);
  }
  findByPath(e) {
    return lt.findByPath(e, this.root);
  }
  addNode(e, t) {
    const o = this.findById(e);
    if (null == o) console.error("node not found");
    else {
      const e = this.flexToTree.convert(t);
      Array.isArray(o.children)
        ? o.children.push(e)
        : (o.children = [e]);
    }
  }
  removeNode(e) {
    ut(this.root, e);
  }
  moveNode(e, t) {
    mt(this.root, e, t);
  }
}

export { it as TreeToFlex, at as FlexToTree, ht as FlexTreeEditor, lt as errorPathMapper, pt as cloneTree, createComponent };
