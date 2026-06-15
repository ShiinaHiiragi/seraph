import { $node, $remark, $inputRule, $prose } from "@milkdown/kit/utils";
import { InputRule } from "@milkdown/kit/prose/inputrules";
import { Plugin } from "@milkdown/kit/prose/state";

function splitByRuby(text, textType) {
  const regex = textType === "html"
    ? /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g
    : /\{([^|{}\n]+)\|([^|{}\n]+)\}/g;
  const parts = [];
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: textType, value: text.slice(last, match.index) });
    }
    parts.push({ type: "ruby", base: match[1], reading: match[2] });
    last = match.index + match[0].length;
  }
  if (!parts.length) return null;
  if (last < text.length) {
    parts.push({ type: textType, value: text.slice(last) });
  }
  return parts;
}

// Remark splits <ruby>base<rt>reading</rt></ruby> into separate sibling nodes.
// This function scans children and merges that sequence back into a ruby node.
function processChildren(children) {
  const result = [];
  let i = 0;
  while (i < children.length) {
    const c = children[i];

    if (c.type === "html" && /^<ruby>$/.test(c.value.trim())) {
      let j = i + 1;
      let base = "";
      let reading = "";

      if (j < children.length && children[j].type === "text") {
        base = children[j].value;
        j++;
      }
      if (j < children.length && children[j].type === "html" && /^<rt>$/.test(children[j].value.trim())) {
        j++;
        if (j < children.length && children[j].type === "text") {
          reading = children[j].value;
          j++;
        }
        if (j < children.length && children[j].type === "html" && /^<\/rt>$/.test(children[j].value.trim())) {
          j++;
          if (j < children.length && children[j].type === "html" && /^<\/ruby>$/.test(children[j].value.trim())) {
            j++;
            if (base) {
              result.push({ type: "ruby", base, reading });
              i = j;
              continue;
            }
          }
        }
      }
    }

    if (c.type === "html" || c.type === "text") {
      const parts = splitByRuby(c.value, c.type);
      if (parts) {
        result.push(...parts);
        i++;
        continue;
      }
    }

    result.push(c);
    i++;
  }
  return result;
}

function visitNode(node) {
  if (!node.children) return;
  node.children = processChildren(node.children);
  for (const child of node.children) visitNode(child);
}

function remarkRubyPlugin() {
  return (tree) => visitNode(tree);
}

const RUBY_PATTERNS = [
  /\{([^|{}\n]+)\|([^|{}\n]+)\}/g,
  /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g,
];

export const rubyRemark = $remark("rubyRemark", () => remarkRubyPlugin);

export const rubyBracketInputRule = $inputRule(() =>
  new InputRule(
    /\{([^|{}\n]+)\|([^|{}\n]+)\}$/,
    (state, match, start, end) => {
      const type = state.schema.nodes["ruby"];
      if (!type) return null;
      return state.tr.replaceWith(start, end, type.create({ base: match[1], reading: match[2] }));
    }
  )
);

export const rubyHtmlInputRule = $inputRule(() =>
  new InputRule(
    /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>$/,
    (state, match, start, end) => {
      const type = state.schema.nodes["ruby"];
      if (!type) return null;
      return state.tr.replaceWith(start, end, type.create({ base: match[1], reading: match[2] }));
    }
  )
);

// Handles paste of plain-text ruby patterns (input rules don't fire on paste).
// Only runs on paste transactions to avoid interfering with undo/redo.
export const rubyPasteHandler = $prose(() => new Plugin({
  appendTransaction(transactions, _old, newState) {
    if (!transactions.some(tr => tr.getMeta("uiEvent") === "paste")) return null;

    const rubyType = newState.schema.nodes["ruby"];
    if (!rubyType) return null;

    const replacements = [];
    newState.doc.descendants((node, pos) => {
      if (!node.isText) return;
      for (const regex of RUBY_PATTERNS) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          replacements.push({
            from: pos + match.index,
            to: pos + match.index + match[0].length,
            base: match[1],
            reading: match[2],
          });
        }
      }
    });

    if (!replacements.length) return null;

    const tr = newState.tr;
    replacements.sort((a, b) => b.from - a.from);
    for (const { from, to, base, reading } of replacements) {
      tr.replaceWith(from, to, rubyType.create({ base, reading }));
    }
    return tr;
  },
}));

export const rubyNode = $node("ruby", () => ({
  group: "inline",
  inline: true,
  atom: true,
  attrs: {
    base: { default: "" },
    reading: { default: "" },
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
  toDOM(node) {
    const dom = document.createElement("ruby");
    dom.appendChild(document.createTextNode(node.attrs.base));
    const rt = document.createElement("rt");
    rt.textContent = node.attrs.reading;
    dom.appendChild(rt);
    return { dom };
  },
  parseMarkdown: {
    match: (node) => node.type === "ruby",
    runner: (state, node, type) => {
      state.addNode(type, { base: node.base, reading: node.reading });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === "ruby",
    runner: (state, node) => {
      state.addNode("text", undefined, `{${node.attrs.base}|${node.attrs.reading}}`);
    },
  },
}));
