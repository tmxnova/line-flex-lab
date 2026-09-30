/** Original client UI addable-type rules. This is NOT the server validator. */
function m(e) {
  return Object.assign(
    {
      name: "none",
      canCopy: !0,
      canMove: !0,
      isAddable: !1,
      addableTypes: [],
      isRemovable: !1,
      iconClass: null,
      isDeprecated: !1,
    },
    e,
  );
}
class h {
  static of(e) {
    if (!e) return null;
    switch (e.type) {
      case "carousel":
        return m({
          name: "carousel",
          canCopy: !1,
          canMove: !1,
          isAddable: !0,
          isRemovable: !1,
          addableTypes: ["bubble"],
        });
      case "bubble":
        return (function (e) {
          const t = !!e.root;
          return m({ name: "bubble", canMove: !t, isRemovable: !t });
        })(e);
      case "box":
        return (function (e) {
          let t = [],
            o = "box";
          switch (e.layout) {
            case "baseline":
              ((t = ["icon", "text", "filler"]),
                (o = "box [baseline]"));
              break;
            case "horizontal":
            case "vertical":
              ((t = [
                "box",
                "image",
                "text",
                "button",
                "filler",
                "separator",
              ]),
                (o = `box [${e.layout}]`));
          }
          return m({
            name: o,
            isAddable: !0,
            addableTypes: t,
            isRemovable: !0,
          });
        })(e);
      case "header":
      case "hero":
      case "body":
      case "footer":
        return (function (e) {
          return m({
            name: e.type,
            canCopy: !1,
            canMove: !1,
            isAddable: 0 === e.children.length,
            addableTypes:
              "hero" === e.type ? ["box", "image", "video"] : ["box"],
          });
        })(e);
      case "text":
        return (function (e) {
          let t = "text";
          const o = e.children;
          if (Array.isArray(o) && o.length > 0) t = "text";
          else if (e.text) {
            let o = e.text;
            (o.length > 10 && (o = o.substring(0, 9) + "..."),
              (t = t + " [" + o + "]"));
          }
          return m({
            name: t,
            isRemovable: !0,
            iconClass: "fa-font",
            isAddable: !0,
            addableTypes: ["span"],
          });
        })(e);
      case "span":
        return (function (e) {
          let t = "span";
          if (e.text) {
            let o = e.text;
            (o.length > 10 && (o = o.substring(0, 9) + "..."),
              (t = t + " [" + o + "]"));
          }
          return m({ name: t, isRemovable: !0, iconClass: "fa-font" });
        })(e);
      case "image":
        return m({
          name: "image",
          isRemovable: !0,
          iconClass: "fa-picture-o",
        });
      case "video":
        return (function (e) {
          let t = "video";
          return (
            0 === e.children.length &&
              (t += " (Please set altContent by adding child node)"),
            m({
              name: t,
              isRemovable: !0,
              isAddable: 0 === e.children.length,
              iconClass: "fa-picture-o",
              addableTypes: ["box", "image"],
            })
          );
        })(e);
      case "button":
        return (function (e) {
          let t = "button";
          return (
            e.action &&
              e.action.label &&
              (t = t + " [" + e.action.label + "]"),
            m({
              name: t,
              isRemovable: !0,
              iconClass: "fa-caret-square-o-right",
            })
          );
        })(e);
      case "filler":
        return m({
          name: "filler",
          isRemovable: !0,
          iconClass: "fa-arrows",
        });
      case "icon":
        return m({
          name: "icon",
          isRemovable: !0,
          iconClass: "fa-smile-o",
        });
      case "separator":
        return m({
          name: "separator",
          isRemovable: !0,
          iconClass: "fa-minus-square-o",
        });
      case "spacer":
        return m({
          name: "spacer",
          isRemovable: !0,
          iconClass: "fa-square-o",
          isDeprecated: !0,
        });
      default:
        throw new Error("unexpected type: " + e.type);
    }
  }
}

export { h as ComponentMetadata };
