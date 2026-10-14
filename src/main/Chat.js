import React from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Textarea from "@mui/joy/Textarea";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import Alert from "@mui/joy/Alert";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import RouteField from "../interface/RouteField";

// Include /v1 in base_url, for example https://api.openai.com/v1.
// Browser requests require CORS support and expose this key to the browser.
const base_url = "YOUR_BASE_URL";
const api_key = "YOUR_API_KEY";

const request = async (path, signal, body) => {
  if (base_url === "YOUR_BASE_URL" || api_key === "YOUR_API_KEY") {
    throw new Error("Set base_url and api_key in Chat.js to connect.");
  }
  const response = await fetch(`${base_url.replace(/\/+$/, "")}/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${api_key}`,
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error?.message || `Request failed (${response.status}).`);
  }
  return response;
};

// SSE frames may span network chunks, including inside a UTF-8 character.
export const readStream = async (body, onEvent) => {
  if (!body) throw new Error("Streaming responses are unavailable.");
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const dispatch = (frame) => {
    const data = frame.split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).replace(/^ /, ""))
      .join("\n");
    if (!data || data === "[DONE]") return false;
    return onEvent(JSON.parse(data));
  };
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        if (dispatch(frame)) return;
      }
      if (done) {
        if (buffer.trim()) dispatch(buffer);
        return;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
};

const markdown = remark().use(remarkGfm);
const safeURL = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
};

// Render the existing remark AST as React elements; never inject model HTML.
const Markdown = React.memo(({ text }) => {
  const tree = React.useMemo(() => markdown.parse(text), [text]);
  const definitions = {};
  tree.children.forEach((node) => {
    if (node.type === "definition") definitions[node.identifier] = node;
  });
  const render = (node, key) => {
    const children = node.children?.map(render);
    switch (node.type) {
      case "root": return <React.Fragment key={key}>{children}</React.Fragment>;
      case "text": return node.value;
      case "paragraph": return <p key={key}>{children}</p>;
      case "heading": return React.createElement(`h${node.depth}`, { key }, children);
      case "strong": return <strong key={key}>{children}</strong>;
      case "emphasis": return <em key={key}>{children}</em>;
      case "delete": return <del key={key}>{children}</del>;
      case "inlineCode": return <code key={key}>{node.value}</code>;
      case "code": return <pre key={key}><code>{node.value}</code></pre>;
      case "blockquote": return <blockquote key={key}>{children}</blockquote>;
      case "break": return <br key={key} />;
      case "thematicBreak": return <hr key={key} />;
      case "list": return node.ordered
        ? <ol key={key} start={node.start}>{children}</ol>
        : <ul key={key}>{children}</ul>;
      case "listItem": return <li key={key}>
        {typeof node.checked === "boolean" && <input type="checkbox" checked={node.checked} disabled />}
        {children}
      </li>;
      case "link":
      case "linkReference": {
        const link = node.type === "link" ? node : definitions[node.identifier];
        return <a key={key} href={safeURL(link?.url)} title={link?.title} target="_blank" rel="noopener noreferrer">{children}</a>;
      }
      case "image":
      case "imageReference": return <span key={key}>{node.alt || "Image"}</span>;
      case "table": return <Box key={key} sx={{ overflowX: "auto" }}>
        <table>
          <thead><tr>{node.children[0].children.map((cell, index) =>
            <th key={index} style={{ textAlign: node.align[index] }}>{cell.children.map(render)}</th>
          )}</tr></thead>
          <tbody>{node.children.slice(1).map((row, index) => <tr key={index}>
            {row.children.map((cell, column) =>
              <td key={column} style={{ textAlign: node.align[column] }}>{cell.children.map(render)}</td>
            )}
          </tr>)}</tbody>
        </table>
      </Box>;
      case "html": return node.value;
      case "definition": return null;
      default: return children || node.value || null;
    }
  };
  return render(tree, "root");
});

const markdownStyle = {
  lineHeight: 1.75,
  overflowWrap: "anywhere",
  "& > :first-child": { mt: 0 },
  "& > :last-child": { mb: 0 },
  "& pre": { p: 2, borderRadius: "md", bgcolor: "background.level1", overflowX: "auto" },
  "& code": { fontFamily: "monospace", fontSize: "0.9em", bgcolor: "background.level1", borderRadius: "sm" },
  "& :not(pre) > code": { px: 0.5 },
  "& blockquote": { ml: 0, pl: 2, borderLeft: "3px solid", borderColor: "neutral.outlinedBorder", color: "text.secondary" },
  "& a": { color: "var(--joy-palette-primary-500)" },
  "& table": { borderCollapse: "collapse", width: "100%" },
  "& th, & td": { p: 1, border: "1px solid", borderColor: "neutral.outlinedBorder" },
  "& li > p": { my: 0.5 }
};

export const responseContent = (response) => {
  const parts = (response?.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || []);
  return {
    text: parts.map((part) => part.text || part.refusal || "").join("\n\n"),
    sources: parts.flatMap((part) => part.annotations || [])
      .filter((annotation) => annotation.type === "url_citation")
  };
};

const Chat = () => {
  const [models, setModels] = React.useState([]);
  const [model, setModel] = React.useState("");
  const [modelError, setModelError] = React.useState("");
  const [loadingModels, setLoadingModels] = React.useState(true);
  const [reload, setReload] = React.useState(0);
  const [search, setSearch] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const requestRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const followRef = React.useRef(true);
  const nextIDRef = React.useRef(0);

  React.useEffect(() => {
    const controller = new AbortController();
    setLoadingModels(true);
    setModelError("");
    request("models", controller.signal)
      .then((response) => response.json())
      .then((data) => {
        if (controller.signal.aborted) return;
        const available = [...new Set((data.data || []).map((item) => item.id).filter(Boolean))].sort();
        if (!available.length) throw new Error("No models are available.");
        setModels(available);
        setModel((current) => available.includes(current) ? current : available[0]);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setModelError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingModels(false);
      });
    return () => controller.abort();
  }, [reload]);

  React.useEffect(() => () => {
    requestRef.current?.abort();
    requestRef.current = null;
  }, []);

  React.useEffect(() => {
    if (followRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  const handleSend = async () => {
    if (!input.trim() || !model || loadingModels || modelError || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const user = { id: nextIDRef.current++, role: "user", text: input };
    const answer = { id: nextIDRef.current++, role: "assistant", text: "", sources: [], status: "Thinking…" };
    const history = [...messages, user];
    setMessages([...history, answer]);
    setInput("");
    setError("");
    setBusy(true);
    followRef.current = true;
    const update = (change) => {
      if (requestRef.current !== controller || controller.signal.aborted) return;
      setMessages((current) => current.map((message) => message.id === answer.id
        ? { ...message, ...(typeof change === "function" ? change(message) : change) }
        : message));
    };
    let completed = false;
    try {
      const response = await request("responses", controller.signal, {
        model,
        stream: true,
        store: false,
        input: history.filter((message) => message.role === "user" || message.complete)
          .map((message) => ({ role: message.role, content: message.text })),
        ...(search ? { tools: [{ type: "web_search" }] } : {})
      });
      await readStream(response.body, (event) => {
        if (event.type === "response.output_text.delta" || event.type === "response.refusal.delta") {
          update((message) => ({ text: message.text + event.delta, status: "" }));
        } else if (event.type === "response.output_text.annotation.added") {
          if (event.annotation?.type === "url_citation") {
            update((message) => ({ sources: [...message.sources, event.annotation] }));
          }
        } else if (event.type?.startsWith("response.web_search_call.")) {
          update({ status: event.type.endsWith("completed") ? "Thinking…" : "Searching the web…" });
        } else if (event.type === "response.completed") {
          const content = responseContent(event.response);
          update((message) => ({
            text: content.text || message.text,
            sources: content.sources.length ? content.sources : message.sources,
            complete: true,
            status: content.text || message.text ? "" : "No text was returned."
          }));
          completed = true;
          return true;
        } else if (["error", "response.failed", "response.incomplete"].includes(event.type)) {
          throw new Error(event.message || event.error?.message || event.response?.error?.message ||
            `Response incomplete: ${event.response?.incomplete_details?.reason || "unknown reason"}.`);
        }
        return false;
      });
      if (!completed) throw new Error("The connection closed before the response finished. Please try again.");
    } catch (error) {
      if (requestRef.current !== controller) return;
      if (!controller.signal.aborted) {
        setError(error.message || "Unable to connect to the API.");
        update({ status: "Response failed" });
      }
    } finally {
      if (requestRef.current === controller) {
        if (controller.signal.aborted) {
          setMessages((current) => current.map((message) => message.id === answer.id
            ? { ...message, status: "Stopped" } : message));
        }
        requestRef.current = null;
        setBusy(false);
      }
    }
  };

  return (
    <RouteField display sxRaw={{ minHeight: 0, flex: 1 }} sx={{ minHeight: 0, flexDirection: "column", height: "auto", px: { xs: 2, md: 3 } }}>
      <Stack direction="row" spacing={1.5} sx={{ width: "100%", maxWidth: 800, mx: "auto", pb: 2, alignItems: "center", flexWrap: "wrap", gap: 1 }}>
        <Typography level="title-lg">Chat</Typography>
        <Select
          aria-label="Model"
          placeholder={loadingModels ? "Loading models…" : "Select a model"}
          value={model || null}
          onChange={(event, value) => setModel(value)}
          disabled={busy || loadingModels || !models.length}
          sx={{ minWidth: 160, maxWidth: "100%", flex: 1 }}
        >
          {models.map((id) => <Option key={id} value={id}>{id}</Option>)}
        </Select>
        {modelError && <Button size="sm" variant="plain" color="neutral" title={modelError} onClick={() => setReload((value) => value + 1)}>Retry models</Button>}
      </Stack>
      <Box
        ref={scrollRef}
        onScroll={() => {
          const element = scrollRef.current;
          followRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
        }}
        sx={{ flex: 1, minHeight: 0, overflowY: "auto", userSelect: "text" }}
      >
        <Stack spacing={4} sx={{ maxWidth: 800, mx: "auto", py: 3 }}>
          {!messages.length && <Box sx={{ textAlign: "center", py: { xs: 6, md: 12 } }}>
            <Typography level="h2">How can I help?</Typography>
            <Typography level="body-sm" sx={{ mt: 1 }}>Start a conversation. Chat history is cleared when you leave this page.</Typography>
          </Box>}
          {messages.map((message) => message.role === "user"
            ? <Box key={message.id} aria-label="Your message" sx={{ alignSelf: "flex-end", maxWidth: "85%", px: 2.5, py: 1.5, borderRadius: "20px", bgcolor: "background.level1", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{message.text}</Box>
            : <Box key={message.id} aria-label="Assistant message" sx={{ minWidth: 0 }}>
              <Box sx={markdownStyle}><Markdown text={message.text} /></Box>
              {message.status && <Typography role="status" level="body-sm" sx={{ mt: message.text ? 1 : 0 }}>{message.status}</Typography>}
              {!!message.sources.length && <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                {[...new Map(message.sources.map((source) => [source.url, source])).values()]
                  .filter((source) => safeURL(source.url))
                  .map((source, index) => <Button key={source.url} component="a" href={safeURL(source.url)} target="_blank" rel="noopener noreferrer" size="sm" variant="soft" color="neutral" sx={{ maxWidth: "100%", overflowWrap: "anywhere" }}>
                    {index + 1}. {source.title || source.url}
                  </Button>)}
              </Stack>}
            </Box>
          )}
        </Stack>
      </Box>
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", pt: 2 }}>
        {error && <Alert role="alert" color="danger" sx={{ mb: 1.5 }}>{error}</Alert>}
        <Textarea
          aria-label="Message"
          placeholder="Message…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.ctrlKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
              event.preventDefault();
              handleSend();
            }
          }}
          minRows={2}
          maxRows={8}
          sx={{ borderRadius: "20px", p: 2, userSelect: "text" }}
          endDecorator={<Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center", width: "100%", pt: 1 }}>
            <Chip
              variant={search ? "soft" : "outlined"}
              color={search ? "primary" : "neutral"}
              disabled={busy}
              onClick={() => setSearch((value) => !value)}
              slotProps={{ action: { "aria-pressed": search } }}
            >
              Web search
            </Chip>
            <Button
              aria-label={busy ? "Stop generating" : "Send message"}
              variant="solid"
              color="neutral"
              disabled={!busy && (!input.trim() || !model || loadingModels || !!modelError)}
              onClick={busy ? () => requestRef.current?.abort() : handleSend}
              size="sm"
              sx={{ borderRadius: "xl" }}
            >
              {busy ? "Stop" : "Send"}
            </Button>
          </Stack>}
        />
      </Box>
    </RouteField>
  );
};

export default Chat;
