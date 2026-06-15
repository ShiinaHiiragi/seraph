import { $node, $remark, $inputRule, $prose } from "@milkdown/kit/utils";
import { InputRule } from "@milkdown/kit/prose/inputrules";
import { Plugin } from "@milkdown/kit/prose/state";

// Parse the inner content of a <ruby> element into [{base, reading}] pairs.
function parseRubyInner(inner) {
  const pairs = [];
  const re = /([^<]*)<rt>([^<]*)<\/rt>/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    pairs.push({ base: m[1], reading: m[2] });
  }
  return pairs;
}

// Split a plain-text html string on <ruby> elements (multi-rt aware).
function splitHtmlRuby(html) {
  const re = /<ruby>((?:[^<]*<rt>[^<]*<\/rt>)+[^<]*)<\/ruby>/g;
  const parts = [];
  let last = 0;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m.index > last) parts.push({ type: "html", value: html.slice(last, m.index) });
    for (const pair of parseRubyInner(m[1])) {
      parts.push({ type: "ruby", ...pair });
    }
    last = m.index + m[0].length;
  }
  if (!parts.length) return null;
  if (last < html.length) parts.push({ type: "html", value: html.slice(last) });
  return parts;
}

// Split a text string on {base|reading} patterns.
function splitBracketRuby(text) {
  const re = /\{([^|{}\n]+)\|([^|{}\n]+)\}/g;
  const parts = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "ruby", base: m[1], reading: m[2] });
    last = m.index + m[0].length;
  }
  if (!parts.length) return null;
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}

// Remark splits <ruby>A<rt>a</rt>B<rt>b</rt></ruby> into sibling nodes.
// Walk children and merge any <ruby>…</ruby> sequences back into ruby nodes.
function processChildren(children) {
  const result = [];
  let i = 0;
  while (i < children.length) {
    const c = children[i];

    if (c.type === "html" && /^<ruby>$/.test(c.value.trim())) {
      let j = i + 1;
      const pairs = [];

      while (j < children.length) {
        if (children[j].type === "html" && /^<\/ruby>$/.test(children[j].value.trim())) {
          j++;
          break;
        }
        let base = "";
        let reading = "";
        if (children[j].type === "text") { base = children[j].value; j++; }
        if (j < children.length && children[j].type === "html" && /^<rt>$/.test(children[j].value.trim())) {
          j++;
          if (j < children.length && children[j].type === "text") { reading = children[j].value; j++; }
          if (j < children.length && children[j].type === "html" && /^<\/rt>$/.test(children[j].value.trim())) j++;
          pairs.push({ base, reading });
        } else {
          break;
        }
      }

      if (pairs.length > 0) {
        for (const pair of pairs) result.push({ type: "ruby", ...pair });
        i = j;
        continue;
      }
    }

    if (c.type === "html") {
      const parts = splitHtmlRuby(c.value);
      if (parts) { result.push(...parts); i++; continue; }
    }

    if (c.type === "text") {
      const parts = splitBracketRuby(c.value);
      if (parts) { result.push(...parts); i++; continue; }
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

// For paste: find all ruby patterns in a text node and return replacement specs.
function findRubyInText(text) {
  const re = /\{([^|{}\n]+)\|([^|{}\n]+)\}|<ruby>((?:[^<]*<rt>[^<]*<\/rt>)+[^<]*)<\/ruby>/g;
  const hits = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) {
      hits.push({ from: m.index, to: m.index + m[0].length, pairs: [{ base: m[1], reading: m[2] }] });
    } else {
      hits.push({ from: m.index, to: m.index + m[0].length, pairs: parseRubyInner(m[3]) });
    }
  }
  return hits;
}

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

export const rubyPasteHandler = $prose(() => new Plugin({
  appendTransaction(transactions, _old, newState) {
    if (!transactions.some(tr => tr.getMeta("uiEvent") === "paste")) return null;

    const rubyType = newState.schema.nodes["ruby"];
    if (!rubyType) return null;

    const replacements = [];
    newState.doc.descendants((node, pos) => {
      if (!node.isText) return;
      for (const hit of findRubyInText(node.text)) {
        replacements.push({ from: pos + hit.from, to: pos + hit.to, pairs: hit.pairs });
      }
    });
    if (!replacements.length) return null;

    const tr = newState.tr;
    replacements.sort((a, b) => b.from - a.from);
    for (const { from, to, pairs } of replacements) {
      tr.replaceWith(from, to, pairs.map(({ base, reading }) => rubyType.create({ base, reading })));
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
      state.addNode("html", undefined, `<ruby>${node.attrs.base}<rt>${node.attrs.reading}</rt></ruby>`);
    },
  },
}));
