import React from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WrapTextRoundedIcon from "@mui/icons-material/WrapTextRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Compartment, EditorState } from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  rectangularSelection
} from "@codemirror/view";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  HighlightStyle,
  indentOnInput,
  indentUnit,
  syntaxHighlighting
} from "@codemirror/language";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  highlightSelectionMatches,
  openSearchPanel,
  search,
  searchKeymap
} from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";
import { tags } from "@lezer/highlight";
import RouteField from "../interface/RouteField";
import GlobalContext, { toSVG } from "../interface/constants";

const initialCode = `const projects = [
  { name: "星河", progress: 86 },
  { name: "微光", progress: 64 },
  { name: "晨曦", progress: 100 }
];

function summarize(items) {
  return items.map(({ name, progress }) => ({
    name,
    progress,
    status: progress === 100 ? "已完成" : "进行中"
  }));
}

const result = summarize(projects);

console.table(result);
`;

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    color: "var(--joy-palette-text-primary)",
    backgroundColor: "transparent",
    fontSize: "14px"
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "var(--joy-fontFamily-code, monospace)",
    lineHeight: "1.8"
  },
  ".cm-content": { padding: "16px 24px 16px 0", caretColor: "var(--joy-palette-text-primary)" },
  ".cm-line": { padding: "0 16px" },
  ".cm-gutters": {
    backgroundColor: "var(--joy-palette-background-body)",
    paddingLeft: "24px",
    color: "var(--joy-palette-text-tertiary)",
    border: "none"
  },
  ".cm-lineNumbers .cm-gutterElement": { paddingLeft: "12px" },
  ".cm-foldGutter .cm-gutterElement svg": {
    width: "16px",
    height: "16px",
    verticalAlign: "middle"
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "rgba(var(--joy-palette-neutral-mainChannel) / 0.06)"
  },
  "&.cm-hasSelection .cm-activeLine, &.cm-hasSelection .cm-activeLineGutter": {
    backgroundColor: "transparent"
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--joy-palette-text-primary)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "var(--joy-palette-primary-softHoverBg)"
  },
  ".cm-selectionMatch, .cm-searchMatch": {
    backgroundColor: "var(--joy-palette-warning-softBg)"
  },
  ".cm-searchMatch.cm-searchMatch-selected, &.cm-focused .cm-matchingBracket": {
    backgroundColor: "var(--joy-palette-primary-softBg)",
    outline: "1px solid var(--joy-palette-primary-outlinedBorder)"
  },
  ".cm-panels, .cm-tooltip": {
    backgroundColor: "var(--joy-palette-background-popup)",
    color: "var(--joy-palette-text-primary)",
    borderColor: "var(--joy-palette-divider)"
  },
  ".cm-panel.cm-search": { padding: "8px 12px" },
  ".cm-textfield, .cm-button": {
    color: "var(--joy-palette-text-primary)",
    background: "transparent",
    border: "1px solid var(--joy-palette-neutral-outlinedBorder)",
    borderRadius: "var(--joy-radius-sm)"
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--joy-palette-primary-softBg)",
    color: "var(--joy-palette-primary-softColor)"
  }
});

const editorHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--joy-palette-primary-500)" },
  { tag: [tags.string, tags.regexp], color: "var(--joy-palette-success-500)" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--joy-palette-warning-500)" },
  { tag: tags.comment, color: "var(--joy-palette-text-tertiary)" },
  { tag: tags.function(tags.variableName), color: "var(--joy-palette-primary-softColor)" },
  { tag: [tags.operator, tags.punctuation], color: "var(--joy-palette-text-secondary)" }
]);

const Code = () => {
  const context = React.useContext(GlobalContext);
  const containerRef = React.useRef(null);
  const editorRef = React.useRef(null);
  const wrappingRef = React.useRef(new Compartment());
  const [wrapping, setWrapping] = React.useState(false);
  const [cursor, setCursor] = React.useState({ line: 1, column: 1 });

  React.useEffect(() => {
    const editor = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: initialCode,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          drawSelection(),
          dropCursor(),
          rectangularSelection(),
          history(),
          foldGutter({
            markerDOM: (open) => {
              const marker = document.createElement("span");
              marker.title = open ? "折叠" : "展开";
              marker.innerHTML = toSVG(open ? ExpandMoreRoundedIcon : ChevronRightRoundedIcon);
              return marker;
            }
          }),
          indentOnInput(),
          indentUnit.of("  "),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          highlightSelectionMatches(),
          search({ top: true }),
          javascript({ jsx: true }),
          syntaxHighlighting(editorHighlight),
          editorTheme,
          wrappingRef.current.of([]),
          EditorState.allowMultipleSelections.of(true),
          EditorView.editorAttributes.of((view) => ({
            class: view.state.selection.ranges.some((range) => !range.empty)
              ? "cm-hasSelection"
              : ""
          })),
          EditorState.phrases.of({
            "Find": "查找",
            "Replace": "替换",
            "next": "下一个",
            "previous": "上一个",
            "all": "全选",
            "match case": "区分大小写",
            "regexp": "正则",
            "by word": "全词",
            "replace": "替换",
            "replace all": "全部替换",
            "close": "关闭",
            "Go to line": "跳转到行",
            "go": "跳转",
            "Fold line": "折叠",
            "Unfold line": "展开"
          }),
          EditorView.contentAttributes.of({ "aria-label": "代码编辑器", spellcheck: "false" }),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...searchKeymap,
            ...foldKeymap,
            ...completionKeymap
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged || update.selectionSet) {
              const head = update.state.selection.main.head;
              const line = update.state.doc.lineAt(head);
              setCursor({ line: line.number, column: head - line.from + 1 });
            }
          })
        ]
      })
    });
    editorRef.current = editor;
    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const handleToggleWrapping = () => {
    const next = !wrapping;
    editorRef.current.dispatch({
      effects: wrappingRef.current.reconfigure(next ? EditorView.lineWrapping : [])
    });
    setWrapping(next);
  };

  const handleDownload = () => {
    const blob = new Blob([editorRef.current.state.doc.toString()], {
      type: "text/javascript;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "demo.js";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <RouteField
      display={true}
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.code"),
      ]}
      title={
        <Stack
          direction="row"
          spacing={1}
          sx={{ px: 3, pb: 1.5, alignItems: "flex-end" }}
        >
          <Typography level="h3">
            {context.languagePicker("nav.utility.code")}
          </Typography>
          <Stack direction="row" sx={{
            position: "relative",
            top: "1px",
            "& .MuiIconButton-root": {
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "transparent" }
            }
          }}>
          <IconButton
            size="sm"
            variant="plain"
            aria-label="查找与替换"
            title="查找与替换"
            onClick={() => openSearchPanel(editorRef.current)}
          >
            <SearchRoundedIcon />
          </IconButton>
          <IconButton
            size="sm"
            variant={wrapping ? "soft" : "plain"}
            color={wrapping ? "primary" : "neutral"}
            aria-label="自动换行"
            aria-pressed={wrapping}
            title="自动换行"
            onClick={handleToggleWrapping}
          >
            <WrapTextRoundedIcon />
          </IconButton>
          <IconButton
            size="sm"
            variant="plain"
            aria-label="下载"
            title="下载"
            onClick={handleDownload}
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
          </Stack>
        </Stack>
      }
      sx={{ px: 0, pb: 0, flexDirection: "column", minHeight: 0, height: "auto" }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        minHeight: 320,
        overflow: "hidden"
      }}>
        <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
          <Box ref={containerRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
        <Stack direction="row" spacing={2} sx={{
          px: 2.5,
          height: "1.8rem",
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: "transparent"
        }}>
          <Typography level="body-xs" sx={{ fontVariantNumeric: "tabular-nums" }}>
            行 {cursor.line}，列 {cursor.column}
          </Typography>
          <Typography level="body-xs">UTF-8</Typography>
        </Stack>
      </Box>
    </RouteField>
  )
}

export default Code;
