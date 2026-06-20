import { serverBaseURL } from "./constants";

// resolve image src to absolute URL
// dirPath must have a leading & trailing slash, e.g. "/docs/subfolder/"
const resolveImageSrc = (src, dirPath) => {
  if (!src) {
    return src;
  } else if (/^(https?|data|blob):\/\//i.test(src)) {
    return src;
  } else {
    return new URL(src, serverBaseURL + dirPath).href;
  }
}

// watch DOM and resolve relative img src attributes after rendered
// WeakSet is used to avoid re-processing imgs already resolved
const createImageObserver = (container, dirPath) => {
  const processing = new WeakSet();
  function processImg(img) {
    if (processing.has(img)) {
      return;
    }
    const src = img.getAttribute("src");
    if (!src) {
      return;
    }
    const resolved = resolveImageSrc(src, dirPath);
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

export { resolveImageSrc, createImageObserver };
