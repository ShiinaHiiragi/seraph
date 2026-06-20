import { serverBaseURL } from "./constants";

// resolve image src to absolute URL
// dirPath must have a leading & trailing slash, e.g. "/docs/subfolder/"
const resolveImage = (src, dirPath) => {
  // keep it as it is when
  //   - src is null or ""
  //   - dest file not exists (dirPath is null)
  if (!src || !dirPath) {
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

export { resolveImage, createImageObserver };
