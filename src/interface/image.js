import { serverBaseURL } from "./constants";
import { $remark, $inputRule, $prose } from "@milkdown/kit/utils";
import { InputRule } from "@milkdown/kit/prose/inputrules";
import { Plugin } from "@milkdown/kit/prose/state";

// resolve image src to absolute URL
// dirPath must have a leading & trailing slash, e.g. "/docs/subfolder/"
const resolveImage = (src, dirPath) => {
  // keep it as it is when
  //   - src is null or ""
  //   - dest file not exists (dirPath is null)
  if (!src || (!dirPath && !src.startsWith("/"))) {
    return src;
  }

  // relative path: /private/... or  /public/...
  if (src.startsWith("/")) {
    return serverBaseURL + src;
  }

  // a valid url, e.g. http:, https:, data:, blob:, ...
  try {
    new URL(src);
    return src;
  } catch { }

  // relative path: . & .. supported
  const stack = dirPath.split("/").filter(Boolean);
  for (const part of src.split("/")) {
    if (!part || part === ".") {
      continue;
    } else if (part === "..") {
      if (stack.length > 1) {
        stack.pop();
      }
      continue;
    } else {
      stack.push(part);
    }
  }
  return serverBaseURL + "/" + stack.join("/");
}

// watch DOM and resolve relative img src attributes after rendered
// WeakSet is used to avoid re-processing imgs already resolved
export const createImageObserver = (container, dirPath) => {
  const processing = new WeakSet();
  function processImg(img) {
    if (processing.has(img)) {
      return;
    }
    const src = img.getAttribute("src");
    if (!src) {
      return;
    }
    const resolved = resolveImage(src, dirPath);
    if (resolved === src) {
      return;
    }

    processing.add(img);
    img.src = resolved;
    Promise.resolve().then(() => processing.delete(img));
  }

  function processAll() {
    container.querySelectorAll("img[src]").forEach(processImg);
  }
  processAll();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) {
            return;
          }
          if (node.tagName === "IMG") {
            processImg(node);
          }
          node.querySelectorAll("img[src]").forEach(processImg);
        });
      } else if (mutation.type === "attributes") {
        processImg(mutation.target);
      }
    }
  });

  observer.observe(container, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["src"]
  });
  return observer;
}

// parse src and optional quoted caption from image URL part
const parseCaption = (inner) => {
  const matched = inner.match(/^(.*?)\s+"([^"]*)"$/);
  if (matched) {
    return {
      src: matched[1].trim(),
      caption: matched[2]
    };
  }
  return {
    src: inner.trim(),
    caption: ""
  };
};

// parse src and alt from <img> tag
const parseTag = (tag) => {
  const srcM = tag.match(/\bsrc=(?:"([^"]*)"|'([^']*)')/);
  const altM = tag.match(/\balt=(?:"([^"]*)"|'([^']*)')/);
  return {
    src: srcM ? (srcM[1] ?? srcM[2]) : "",
    alt: altM ? (altM[1] ?? altM[2]) : ""
  };
};

// alt string is a valid scale when it represents a finite number in [0, 1]
// used to distinguish "![0.75](...)" block images from "![](...)"
const IMG_TAG_RE = /^<img\b[^>]*\/?>$/i;
const SCALE_RE = /^(?:0(?:\.[0-9]{0,2})?|1(?:\.0{0,2})?)$/;
const isScaleAlt = (alt) => alt != null && SCALE_RE.test(alt);

// <img> must stay as inline inside these containers
const INLINE_CONTAINERS = new Set([
  "paragraph",
  "heading",
  "link",
  "emphasis",
  "strong",
  "delete",
  "tableCell"
]);

// cruise MDAST and convert image patterns to image-block MDAST nodes.
// block context:
//   paragraph whose sole child is an image with scale alt → image-block
//   html node that is a lone <img> tag → image-block
// inline context:
//   html node that is a lone <img> tag → inline image (type "image")
const processImgNode = (node) => {
  if (!node.children) {
    return;
  }
  const inlineCtx = INLINE_CONTAINERS.has(node.type);
  const result = [];
  for (const child of node.children) {
    if (!inlineCtx) {
      // paragraph wrapping a sole scale-image → lift to image-block
      if (
        child.type === "paragraph"
        && child.children?.length === 1
        && child.children[0].type === "image"
        && isScaleAlt(child.children[0].alt)
      ) {
        const img = child.children[0];
        result.push({
          type: "image-block",
          url: img.url,
          alt: img.alt,
          title: img.title
        });
        continue;
      }

      // block-level <img> html node → image-block
      if (child.type === "html" && IMG_TAG_RE.test(child.value.trim())) {
        const { src, alt } = parseTag(child.value);
        result.push({
          type: "image-block",
          url: src,
          alt: "1.00",
          title: alt || undefined
        });
        continue;
      }
    // inline <img> html node → inline image node
    } else if (child.type === "html" && IMG_TAG_RE.test(child.value.trim())) {
      const { src, alt } = parseTag(child.value);
      result.push({
        type: "image",
        url: src,
        alt: "",
        title: alt || undefined
      });
      continue;
    }
    result.push(child);
    processImgNode(child);
  }
  node.children = result;
};

// find ![scale](src "caption") and <img ...> text patterns (for paste handler)
// milkdown already handles pasted markdown images natively; this catches
// scale-bearing images that would otherwise become inline, and <img> text markup
const findImagesInText = (text) => {
  const re = /!\[([0-9]*(?:\.[0-9]{1,2})?)\]\(([^)]*)\)|<img\b[^>]*\/?>/gi;
  const hits = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) {
      const { src, caption } = parseCaption(m[2]);
      hits.push({
        from: m.index,
        to: m.index + m[0].length,
        scale: m[1],
        src,
        caption,
        isBlock: m[1].length > 0
      });
    } else {
      const { src, alt } = parseTag(m[0]);
      hits.push({
        from: m.index,
        to: m.index + m[0].length,
        scale: "1.00",
        src,
        caption: alt,
        isBlock: true
      });
    }
  }
  return hits;
};

// create a ProseMirror image node.
// image-block attrs: { src, caption, ratio }  (ratio is a number)
// inline image attrs: { src, alt, title }
const makeImageNode = (schema, { scale, src, caption, isBlock }) => {
  if (!isBlock) {
    const type = schema.nodes["image"];
    if (!type) return null;
    return type.create({ src, alt: "", title: caption || "" });
  }
  const type = schema.nodes["image-block"];
  if (!type) return null;
  const ratio = parseFloat(scale);
  return type.create({
    src,
    caption: caption || "",
    ratio: (isNaN(ratio) || ratio === 0) ? 1 : ratio
  });
};

const remarkImagePlugin = () =>
  (tree) => processImgNode(tree);

// register remark rule for <img> and ![scale]()
export const imageRemark = $remark(
  "imageRemark",
  () => remarkImagePlugin
);

// paste handler: replace image text patterns in pasted content with nodes
export const imagePasteHandler = $prose(
  () => new Plugin({
    appendTransaction(transactions, _old, newState) {
      if (!transactions.some((tr) => tr.getMeta("uiEvent") === "paste")) {
        return null;
      }
      const replacements = [];
      newState.doc.descendants((node, pos) => {
        if (!node.isText) return;
        for (const hit of findImagesInText(node.text)) {
          const pmNode = makeImageNode(newState.schema, hit);
          if (pmNode) {
            replacements.push({ from: pos + hit.from, to: pos + hit.to, node: pmNode });
          }
        }
      });
      if (!replacements.length) return null;
      const tr = newState.tr;
      replacements.sort((a, b) => b.from - a.from);
      for (const { from, to, node } of replacements) {
        // replaceRangeWith finds a valid insertion point for block nodes
        tr.replaceRangeWith(from, to, node);
      }
      return tr;
    }
  })
);

// input rule: convert ![scale](src "caption") as the user finishes typing it
// empty scale → inline image; non-empty scale → image-block
export const imageBracketInputRule = $inputRule(
  () => new InputRule(
    /!\[([0-9]*(?:\.[0-9]{1,2})?)\]\(([^)\n]*)\)$/,
    (state, match, start, end) => {
      const scale = match[1];
      const { src, caption } = parseCaption(match[2]);
      const node = makeImageNode(state.schema, {
        scale,
        src,
        caption,
        isBlock: scale.length > 0
      });
      if (!node) return null;
      return state.tr.replaceWith(start, end, node);
    }
  )
);

// input rule: convert <img src="..." alt="..."> as the user finishes typing it
export const imageHTMLInputRule = $inputRule(
  () => new InputRule(
    /<img\b[^>]*\/?>$/i,
    (state, match, start, end) => {
      const { src, alt } = parseTag(match[0]);
      const node = makeImageNode(state.schema, {
        scale: "1.00",
        src,
        caption: alt,
        isBlock: true
      });
      if (!node) return null;
      return state.tr.replaceWith(start, end, node);
    }
  )
);
