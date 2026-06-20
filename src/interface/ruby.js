import { $node, $remark, $inputRule, $prose } from "@milkdown/kit/utils";
import { InputRule } from "@milkdown/kit/prose/inputrules";
import { Plugin } from "@milkdown/kit/prose/state";

// split text string on {base|reading} patterns
const splitBracketRuby = (text) => {
  const re = /\{([^|{}\n]+)\|([^|{}\n]+)\}/g;
  const parts = [];
  let matched, last = 0;
  while ((matched = re.exec(text)) !== null) {
    if (matched.index > last) {
      parts.push({
        type: "text",
        value: text.slice(last, matched.index)
      });
    }
    parts.push({
      type: "ruby",
      base: matched[1], reading: matched[2]
    });
    last = matched.index + matched[0].length;
  }
  if (!parts.length) {
    return null;
  }
  if (last < text.length) {
    parts.push({
      type: "text",
      value: text.slice(last)
    });
  }
  return parts;
}

// parse the inner content of a <ruby> element into [{base, reading}] pairs.
const parseRubyInner = (inner) => {
  let matched;
  const pairs = [];
  const stripped = inner.replace(/<\/?rb>/g, "");
  const re = /([^<]*)<rt>([^<]*)<\/rt>/g;
  while ((matched = re.exec(stripped)) !== null) {
    pairs.push({ base: matched[1], reading: matched[2] });
  }
  return pairs;
};

// split html string on <ruby> elements with possible multiple <rt>
const splitHTMLRuby = (html) => {
  const re = /<ruby>((?:(?:<rb>[^<]*<\/rb>|[^<]*)<rt>[^<]*<\/rt>)+[^<]*)<\/ruby>/g;
  const parts = [];
  let matched, last = 0;
  while ((matched = re.exec(html)) !== null) {
    if (matched.index > last) {
      parts.push({
        type: "html",
        value: html.slice(last, matched.index)
      });
    }
    for (const pair of parseRubyInner(matched[1])) {
      parts.push({
        type: "ruby",
        ...pair
      });
    }
    last = matched.index + matched[0].length;
  }
  if (!parts.length) {
    return null;
  }
  if (last < html.length) {
    parts.push({
      type: "html",
      value: html.slice(last)
    });
  }
  return parts;
};

// for paste: find all ruby patterns in a text node and return replacement specs.
const findRubyInText = (text) => {
  const re = /\{([^|{}\n]+)\|([^|{}\n]+)\}|<ruby>((?:(?:<rb>[^<]*<\/rb>|[^<]*)<rt>[^<]*<\/rt>)+[^<]*)<\/ruby>/g;
  const hits = [];
  let matched;
  while ((matched = re.exec(text)) !== null) {
    if (matched[1] !== undefined) {
      hits.push({
        from: matched.index,
        to: matched.index + matched[0].length,
        pairs: [{
          base: matched[1],
          reading: matched[2]
        }]
      });
    } else {
      hits.push({
        from: matched.index,
        to: matched.index + matched[0].length,
        pairs: parseRubyInner(matched[3])
      });
    }
  }
  return hits;
};

// remark splits <ruby>A<rt>a</rt>B<rt>b</rt></ruby> into sibling nodes.
// cruise children and merge any <ruby>…</ruby> sequences back into ruby nodes.
const processChildren = (children) => {
  let index = 0;
  const result = [];
  while (index < children.length) {
    const child = children[index];
    if (child.type === "html" && /^<ruby>$/.test(child.value.trim())) {
      let subIndex = index + 1;
      const pairs = [];

      while (subIndex < children.length) {
        if (
          children[subIndex].type === "html"
            && /^<\/ruby>$/.test(children[subIndex].value.trim())
        ) {
          subIndex++;
          break;
        }

        let base = "";
        let reading = "";

        // skip optional <rb> wrapper
        if (
          children[subIndex].type === "html"
            && /^<rb>$/.test(children[subIndex].value.trim())
        ) {
          subIndex++;
        }

        if (children[subIndex].type === "text") {
          base = children[subIndex].value;
          subIndex++;
        }

        // skip optional </rb> wrapper
        if (
          subIndex < children.length
            && children[subIndex].type === "html"
            && /^<\/rb>$/.test(children[subIndex].value.trim())
        ) {
          subIndex++;
        }

        if (
          subIndex < children.length
            && children[subIndex].type === "html"
            && /^<rt>$/.test(children[subIndex].value.trim())
        ) {
          subIndex++;
          if (
            subIndex < children.length
              && children[subIndex].type === "text"
          ) {
            reading = children[subIndex].value;
            subIndex++;
          }

          if (
            subIndex < children.length
              && children[subIndex].type === "html"
              && /^<\/rt>$/.test(children[subIndex].value.trim())
          ) {
            subIndex++;
          }
          pairs.push({ base, reading });
        } else {
          break;
        }
      }

      if (pairs.length > 0) {
        for (const pair of pairs) {
          result.push({ type: "ruby", ...pair });
        }
        index = subIndex;
        continue;
      }
    }

    if (child.type === "html") {
      const parts = splitHTMLRuby(child.value);
      if (parts) {
        result.push(...parts);
        index++;
        continue;
      }
    }

    if (child.type === "text") {
      const parts = splitBracketRuby(child.value);
      if (parts) {
        result.push(...parts);
        index++;
        continue;
      }
    }
    result.push(child);
    index++;
  }
  return result;
};

const visitNode = (node) => {
  if (!node.children) {
    return;
  }
  node.children = processChildren(node.children);
  for (const child of node.children) {
    visitNode(child);
  }
};

// rearrange MDAST after remark executes
const remarkRubyPlugin = () =>
  (tree) => visitNode(tree);

// process for parsing markdown:
//       markdown text
//             ↓ remark
//           MDAST
// toMarkdown ↑ ↓ parseMarkdown
//    ProseMirror Node AST
//   parseDOM ↑ ↓ toDOM
//            DOM
// p.s. input/paster rule switch markdown text
//      directly into prose mirror node

// register remark rule for <ruby> or {ruby}
export const rubyRemark = $remark(
  "rubyRemark",
  () => remarkRubyPlugin
);

// register rendering rule for ruby
export const rubyNode = $node(
  "ruby",
  () => ({
    group: "inline",
    inline: true,
    atom: true,
    attrs: {
      base: { default: "" },
      reading: { default: "" },
    },
    parseMarkdown: {
      match: (node) => node.type === "ruby",
      runner: (state, node, type) => {
        state.addNode(type, {
          base: node.base,
          reading: node.reading
        });
      },
    },
    toDOM(node) {
      const dom = document.createElement("ruby");
      dom.appendChild(document.createTextNode(node.attrs.base));
      const rt = document.createElement("rt");
      rt.textContent = node.attrs.reading;
      dom.appendChild(rt);
      return { dom };
    },
    parseDOM: [{
      tag: "ruby",
      getAttrs(dom) {
        const rt = dom.querySelector("rt");
        const reading = rt?.textContent ?? "";
        const clone = dom.cloneNode(true);
        clone.querySelectorAll("rt, rp").forEach((el) => el.remove());
        return { base: clone.textContent.trim(), reading };
      },
    }],
    toMarkdown: {
      match: (node) => node.type.name === "ruby",
      runner: (state, node) => {
        state.addNode(
          "html",
          undefined,
          `<ruby>${node.attrs.base}<rt>${node.attrs.reading}</rt></ruby>`
        );
      },
    }
  })
);

// register input rule for {ruby}
export const rubyBracketInputRule = $inputRule(
  () => new InputRule(
    /\{([^|{}\n]+)\|([^|{}\n]+)\}$/,
    (state, match, start, end) => {
      const type = state.schema.nodes["ruby"];
      if (!type) {
        return null;
      }
      return state.tr.replaceWith(start, end, type.create({
        base: match[1],
        reading: match[2]
      }));
    }
  )
);

// register input rule for <ruby>
export const rubyHtmlInputRule = $inputRule(
  () => new InputRule(
    /<ruby>((?:(?:<rb>[^<]*<\/rb>|[^<]*)<rt>[^<]*<\/rt>)+[^<]*)<\/ruby>$/,
    (state, match, start, end) => {
      const type = state.schema.nodes["ruby"];
      if (!type) return null;
      const pairs = parseRubyInner(match[1]);
      if (!pairs.length) return null;
      return state.tr.replaceWith(
        start, end,
        pairs.map(({ base, reading }) => type.create({ base, reading }))
      );
    }
  )
);

// register paste rule for <ruby> or {ruby}
export const rubyPasteHandler = $prose(
  () => new Plugin({
    appendTransaction(transactions, _old, newState) {
      if (!transactions.some(tr => tr.getMeta("uiEvent") === "paste")) {
        return null;
      }

      const rubyType = newState.schema.nodes["ruby"];
      if (!rubyType) {
        return null;
      }

      const replacements = [];
      newState.doc.descendants((node, pos) => {
        if (!node.isText) {
          return;
        }
        for (const hit of findRubyInText(node.text)) {
          replacements.push({
            from: pos + hit.from,
            to: pos + hit.to,
            pairs: hit.pairs
          });
        }
      });
      if (!replacements.length) {
        return null;
      }

      const tr = newState.tr;
      replacements.sort((a, b) => b.from - a.from);
      for (const { from, to, pairs } of replacements) {
        tr.replaceWith(
          from,
          to,
          pairs.map(({ base, reading }) => rubyType.create({ base, reading }))
        );
      }
      return tr;
    },
  })
);
