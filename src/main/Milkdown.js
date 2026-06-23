import React from "react";
import { useParams } from "react-router";
import { useNavigate, useBlocker } from "react-router-dom";
import { toast } from "sonner";
import { styled } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { Popper } from "@mui/base/Popper";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import {
  EditorStatus,
  editorViewCtx,
  editorViewOptionsCtx,
  commandsCtx
} from "@milkdown/kit/core";
import {
  listItemSchema,
  codeBlockSchema,
  insertHrCommand,
  insertImageCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockTypeCommand,
  addBlockTypeCommand,
  selectTextNearPosCommand,
  toggleInlineCodeCommand,
  createCodeBlockCommand
} from "@milkdown/kit/preset/commonmark";
import { createTable, toggleStrikethroughCommand } from "@milkdown/kit/preset/gfm";
import { getMarkdown, replaceAll, $prose } from "@milkdown/kit/utils";
import { listenerCtx } from "@milkdown/kit/plugin/listener";
import { imageBlockSchema } from "@milkdown/kit/component/image-block";
import { toggleLinkCommand } from "@milkdown/kit/component/link-tooltip";
import { keymap } from "@milkdown/kit/prose/keymap";
import { TextSelection, Plugin } from "@milkdown/kit/prose/state";
import {
  EditorView,
  lineNumbers,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap as codeMirrorKeymap
} from "@codemirror/view";
import {
  foldGutter,
  indentOnInput,
  bracketMatching,
  foldKeymap
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, historyKeymap } from "@codemirror/commands";
import { highlightSelectionMatches } from "@codemirror/search";
import EditOffOutlinedIcon from "@mui/icons-material/EditOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DoneIcon from "@mui/icons-material/Done";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";
import Looks5OutlinedIcon from "@mui/icons-material/Looks5Outlined";
import Looks6OutlinedIcon from "@mui/icons-material/Looks6Outlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import { countWords, countLines } from "alfaaz";
import { createPatch } from "diff";
import Loading from "./Loading";
import Tree from "../modal/Tree";
import RouteField from "../interface/RouteField";
import GlobalContext, { request, Status, toSVG } from "../interface/constants";
import {
  createImageObserver,
  imageRemark,
  imageBracketInputRule,
  imageHTMLInputRule,
  imagePasteHandler
} from "../interface/image";
import {
  rubyRemark,
  rubyNode,
  rubyBracketInputRule,
  rubyHTMLInputRule,
  rubyPasteHandler
} from "../interface/ruby";

import "@milkdown/crepe/theme/common/style.css";
import "../interface/milk.css";

const buttonStyle = {
  backgroundColor: "transparent",
  "&:hover": { backgroundColor: "transparent" }
};

const count = (markdown) => ({
  lines: countLines(markdown),
  words: countWords(markdown),
  chars: [...new Intl.Segmenter(
    "und",
    { granularity: "grapheme" }
  ).segment(markdown)]
    .filter(({ segment }) => segment.trim())
    .length
});

const MaildownField = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  "& [data-milkdown-root]": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0
  },
  "& .milkdown": {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 2.5)
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(0, 3)
    }
  },
  "& .milkdown .ProseMirror": {
    wordBreak: "normal",
    overflowWrap: "anywhere",
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 1, 8)
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(0, 5, 8)
    }
  }
}));

const CrepeEditorInner = (props) => {
  const {
    basePath,
    editableKey,
    readOnly,
    autoSave,
    setModified,
    setCounter,
    handleToggleTree,
    handleCloseModalTree,
    fileContentRef,
    normalizedRef
  } = props;
  const context = React.useContext(GlobalContext);

  const observerRef = React.useRef(null);
  const milkdownRef = React.useRef(null);

  const handleProcessImage = React.useCallback((file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        const error = event.target.error;
        toast.error(
          context.languagePicker("modal.toast.error.browserError")
            .format(error.name, error.message)
        );
        reject();
      }
    }),
    [context]
  );

  const handleUploadImage = React.useCallback((file) =>
    new Promise((resolve, reject) => {
      Promise.all([
        context.isAuthority
          ? handleToggleTree()
          : Promise.resolve([]),
        handleProcessImage(file),
      ])
        .then(([[folderPath], filebase]) => {
          if (!context.isAuthority || !folderPath) {
            resolve(filebase);
            return;
          }

          const filename = file.name;
          const path = folderPath?.split("/")?.filter(Boolean)
          const type = path[0];
          const folderName = path.slice(1).join("/");

          toast.promise(() => new Promise((innerResolve, innerReject) => {
            request(
              "POST/file/upload",
              {
                type: type,
                folderName: folderName,
                filename: filename,
                base: filebase.split(",")[1]
              },
              { "": () => {
                handleCloseModalTree();
                reject(new Error("canceled"));
              } },
              innerReject
            )
              .then(() => {
                innerResolve();
                resolve(["", ...path, filename].join("/"));
                handleCloseModalTree();
              });
          }), {
            loading: context.languagePicker("modal.toast.plain.uploading"),
            success: context.languagePicker("modal.toast.success.upload")
              .format(filename, folderName),
            error: (data) => data
          })
        })
        .catch(() => {
          reject(new Error("canceled"));
        })
    }),
    [context, handleToggleTree, handleCloseModalTree, handleProcessImage]
  );

  useEditor((root) => {
    const isLoadedFromFile = context.crepeRef.snapshot.current === null;
    const crepe = new Crepe({
      root,
      defaultValue: context.crepeRef.snapshot.current ?? fileContentRef.current,
      features: {
        [CrepeFeature.BlockEdit]: context.setting.crepe.feature.blockEdit,
        [CrepeFeature.Toolbar]: context.setting.crepe.feature.toolbar
      },
      featureConfigs: {
        [CrepeFeature.Cursor]: {
          width: 2
        },
        [CrepeFeature.LinkTooltip]: {
          editButton: toSVG(EditOutlinedIcon),
          removeButton: toSVG(DeleteOutlineOutlinedIcon),
          confirmButton: toSVG(DoneIcon),
          inputPlaceholder: context.languagePicker("main.crepe.popup.url"),
        },
        [CrepeFeature.ImageBlock]: {
          inlineUploadButton: context.languagePicker("main.crepe.image.upload"),
          inlineUploadPlaceholderText: context.languagePicker("main.crepe.image.link"),
          inlineImageIcon: toSVG(ImageOutlinedIcon),
          inlineConfirmButton: toSVG(DoneIcon),
          blockUploadButton: context.languagePicker("main.crepe.image.upload"),
          blockUploadPlaceholderText: context.languagePicker("main.crepe.image.link"),
          blockConfirmButton: toSVG(DoneIcon),
          blockCaptionIcon: toSVG(EditOutlinedIcon),
          blockCaptionPlaceholderText: context.languagePicker("main.crepe.image.caption"),
          blockImageIcon: toSVG(ImageOutlinedIcon),
          onUpload: handleUploadImage,
        },
        [CrepeFeature.BlockEdit]: {
          textGroup: {
            label: context.languagePicker("main.crepe.popup.slash.text.title"),
            text: {
              label: context.languagePicker("main.crepe.popup.slash.text.text"),
              icon: toSVG(NotesOutlinedIcon)
            },
            h1: {
              label: context.languagePicker("main.crepe.popup.slash.text.h1"),
              icon: toSVG(LooksOneOutlinedIcon)
            },
            h2: {
              label: context.languagePicker("main.crepe.popup.slash.text.h2"),
              icon: toSVG(LooksTwoOutlinedIcon)
            },
            h3: {
              label: context.languagePicker("main.crepe.popup.slash.text.h3"),
              icon: toSVG(Looks3OutlinedIcon)
            },
            h4: {
              label: context.languagePicker("main.crepe.popup.slash.text.h4"),
              icon: toSVG(Looks4OutlinedIcon)
            },
            h5: {
              label: context.languagePicker("main.crepe.popup.slash.text.h5"),
              icon: toSVG(Looks5OutlinedIcon)
            },
            h6: {
              label: context.languagePicker("main.crepe.popup.slash.text.h6"),
              icon: toSVG(Looks6OutlinedIcon)
            },
            quote: {
              label: context.languagePicker("main.crepe.popup.slash.text.quote"),
              icon: toSVG(FormatQuoteIcon)
            },
            divider: {
              label: context.languagePicker("main.crepe.popup.slash.text.divider"),
              icon: toSVG(HorizontalRuleOutlinedIcon)
            }
          },
          listGroup: {
            label: context.languagePicker("main.crepe.popup.slash.list.title"),
            bulletList: {
              label: context.languagePicker("main.crepe.popup.slash.list.bulletList"),
              icon: toSVG(FormatListBulletedOutlinedIcon)
            },
            orderedList: {
              label: context.languagePicker("main.crepe.popup.slash.list.orderedList"),
              icon: toSVG(FormatListNumberedOutlinedIcon)
            },
            taskList: {
              label: context.languagePicker("main.crepe.popup.slash.list.taskList"),
              icon: toSVG(ChecklistOutlinedIcon)
            }
          },
          advancedGroup: {
            label: context.languagePicker("main.crepe.popup.slash.advanced.title"),
            image: {
              label: context.languagePicker("main.crepe.popup.slash.advanced.image"),
              icon: toSVG(ImageOutlinedIcon)
            },
            codeBlock: {
              label: context.languagePicker("main.crepe.popup.slash.advanced.codeBlock"),
              icon: toSVG(CodeOutlinedIcon)
            },
            table: {
              label: context.languagePicker("main.crepe.popup.slash.advanced.table"),
              icon: toSVG(CalendarViewMonthOutlinedIcon)
            },
            math: {
              label: context.languagePicker("main.crepe.popup.slash.advanced.math"),
              icon: toSVG(FunctionsOutlinedIcon)
            }
          },
        },
        [CrepeFeature.Placeholder]: {
          text: context.languagePicker("main.crepe.placeholder")
        },
        [CrepeFeature.Toolbar]: {
          codeIcon: toSVG(CodeOutlinedIcon),
          linkIcon: toSVG(InsertLinkOutlinedIcon)
        },
        [CrepeFeature.CodeMirror]: {
          extensions: [
            EditorView.lineWrapping,
            ...(context.setting.crepe.code.lineNumber ? [lineNumbers()] : []),
            ...(context.setting.crepe.code.lineGutter ? [highlightActiveLineGutter()] : []),
            highlightActiveLine(),
            foldGutter(),
            indentOnInput(),
            closeBrackets(),
            bracketMatching(),
            dropCursor(),
            crosshairCursor(),
            rectangularSelection(),
            highlightSelectionMatches(),
            EditorState.allowMultipleSelections.of(true),
            codeMirrorKeymap.of([
              ...closeBracketsKeymap,
              ...defaultKeymap,
              ...historyKeymap,
              ...foldKeymap
            ])
          ],
          searchPlaceholder: context.languagePicker("main.crepe.code.search"),
          noResultText: context.languagePicker("main.crepe.code.noResult"),
          copyIcon: toSVG(ContentCopyOutlinedIcon),
          copyText: context.languagePicker("main.crepe.code.copy"),
          onCopy: () => toast.success(context.languagePicker("modal.toast.success.code")),
          previewToggleText: (previewOnlyMode) => previewOnlyMode
            ? context.languagePicker("main.crepe.code.edit")
            : context.languagePicker("main.crepe.code.hide"),
          previewLabel: context.languagePicker("main.crepe.code.preview")
        },
        [CrepeFeature.Table]: {
          deleteRowIcon: toSVG(DeleteOutlineOutlinedIcon),
          deleteColIcon: toSVG(DeleteOutlineOutlinedIcon)
        },
        [CrepeFeature.Latex]: {
          katexOptions: {
            throwOnError: false
          },
          inlineEditConfirm: toSVG(DoneIcon)
        }
      },
    });

    crepe.setReadonly(readOnly);
    crepe.editor
      .onStatusChange((status) => {
        if (status === EditorStatus.Created) {
          // recover caret selection after rebuilt
          // triggers after saving / config changing
          // fallback to autofocus for remaining situations
          context.crepeRef.setSelect(context.crepeRef.select.current);
          context.crepeRef.select.current = null;
          context.crepeRef.snapshot.current = null;
        }
      })
      .config((ctx) => {
        // preserve some space for scrolling
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: { spellcheck: String(context.setting.crepe.feature.spellCheck) },
          scrollThreshold: { top: 0, right: 0, bottom: 64, left: 0 },
          scrollMargin: { top: 0, right: 0, bottom: 64, left: 0 }
        }));
        // listener itself prevents jittering
        ctx.get(listenerCtx)
          .mounted(() => {
            if (isLoadedFromFile) {
              const markdown = getMarkdown()(ctx);
              if (context.setting.crepe.feature.stat) {
                setCounter(count(markdown));
              }
              normalizedRef.current = markdown.trimEnd();
            }
            observerRef.current?.disconnect();
            observerRef.current = createImageObserver(root, basePath);
            milkdownRef.current = root.querySelector(".milkdown");
            context.crepeRef.setScroll(context.crepeRef.scroll, milkdownRef);
          })
          .markdownUpdated((_, markdown) => {
            setModified(markdown.trimEnd() !== normalizedRef.current);
            if (context.setting.crepe.feature.stat) {
              setCounter(count(markdown));
            }
            autoSave(context.setting.crepe.save * 1000);
          });
      })
      .use($prose((ctx) => keymap({
        // Mod-Alt-0 -> block text (default)
        // Mod-Alt-1 -> block h1 (default)
        // Mod-Alt-2 -> block h2 (default)
        // Mod-Alt-3 -> block h3 (default)
        // Mod-Alt-4 -> block h4 (default)
        // Mod-Alt-5 -> block h5 (default)
        // Mod-Alt-6 -> block h6 (default)
        // Mod-Alt-q -> block quote
        "Mod-Shift-b": () => false,
        "Mod-Alt-q": () => {
          ctx.get(commandsCtx)
            .call(wrapInBlockquoteCommand.key);
          return true;
        },
        // Mod-Alt-d -> block divider
        "Mod-Alt-d": () => {
          ctx.get(commandsCtx)
            .call(insertHrCommand.key);
          return true;
        },
        // Mod-Alt-u -> block unordered list
        "Mod-Alt-8": () => false,
        "Mod-Alt-u": () => {
          ctx.get(commandsCtx)
            .call(wrapInBulletListCommand.key);
          return true;
        },
        // Mod-Alt-o -> block ordered list
        "Mod-Alt-7": () => false,
        "Mod-Alt-o": () => {
          ctx.get(commandsCtx)
            .call(wrapInOrderedListCommand.key);
          return true;
        },
        // Mod-Alt-t -> block task list
        "Mod-Alt-t": () => {
          ctx.get(commandsCtx)
            .call(wrapInBlockTypeCommand.key, {
              nodeType: listItemSchema.type(ctx),
              attrs: { checked: false },
            });
          return true;
        },
        // Mod-Alt-g -> block images
        "Mod-Alt-g": () => {
          ctx.get(commandsCtx)
            .call(addBlockTypeCommand.key, {
              nodeType: imageBlockSchema.type(ctx)
            });
          return true;
        },
        // Mod-Alt-` -> block code
        "Mod-Alt-c": () => false,
        "Mod-Alt-`": () => {
          ctx.get(commandsCtx)
            .call(createCodeBlockCommand.key);
          return true;
        },
        // Mod-Alt-p -> block tables
        "Mod-Alt-p": () => {
          ctx.get(commandsCtx)
            .call(addBlockTypeCommand.key, {
              nodeType: createTable(ctx, 3, 3),
            });
          ctx.get(commandsCtx)
            .call(selectTextNearPosCommand.key, {
              pos: ctx.get(editorViewCtx).state.selection.from
            });
          return true;
        },
        // Mod-Alt-m -> block latex
        "Mod-Alt-m": () => {
          ctx.get(commandsCtx)
            .call(addBlockTypeCommand.key, {
              nodeType: codeBlockSchema.type(ctx),
              attrs: { language: "LaTeX" },
            });
          return true;
        },
        // Mod-b     -> inline bold text (default)
        // Mod-i     -> inline italic text (default)
        // Mod-q     -> inline strike through
        "Mod-Alt-x": () => false,
        "Mod-q": () => {
          ctx.get(commandsCtx)
            .call(toggleStrikethroughCommand.key);
          return true;
        },
        // Mod-g     -> inline image (inaccessible via neither toolbar or slash)
        "Mod-g": () => {
          ctx.get(commandsCtx)
            .call(insertImageCommand.key);
          return true;
        },
        // Mod-`     -> inline code (Mod-e was used for editable/read-only)
        "Mod-`": () => {
          ctx.get(commandsCtx)
            .call(toggleInlineCodeCommand.key);
          return true;
        },
        // Mod-m     -> inline math
        "Mod-m": () => {
          // @milkdown/crepe/src/feature/latex/constants.ts
          //   const toggleLatexCommandName = "ToggleLatex"
          const { from, to } = ctx.get(editorViewCtx).state.selection;
          if (from === to) {
            return false;
          }
          ctx.get(commandsCtx)
            .call("ToggleLatex");
          return true;
        },
        // Mod-l     -> inline link
        "Mod-l": () => {
          ctx.get(commandsCtx)
            .call(toggleLinkCommand.key);
          return true;
        }
      })))
      .use($prose(() => new Plugin({
        props: {
          handleDOMEvents: {
            click(view, event) {
              const anchor = event.target.closest("a[href]");
              if (!view.editable && anchor) {
                event.preventDefault();
                window.open(anchor.href, "_blank", "noopener,noreferrer");
                return true
              }
              return false
            },
            paste(view) {
              requestAnimationFrame(() => {
                view.dispatch(view.state.tr.scrollIntoView());
              });
              return false;
            }
          }
        }
      })))
      .use(imageRemark)
      .use(imageBracketInputRule)
      .use(imageHTMLInputRule)
      .use(imagePasteHandler)
      .use(rubyRemark)
      .use(rubyNode)
      .use(rubyBracketInputRule)
      .use(rubyHTMLInputRule)
      .use(rubyPasteHandler);

    context.crepeRef.load(crepe.editor, {
      getMarkdown,
      replaceAll,
      actionCaret: () => (ctx) => ctx.get(editorViewCtx).state.selection,
      actionFocus: (select) => (ctx) => {
        const editorView = ctx.get(editorViewCtx);
        if (select) {
          const transact = editorView.state.tr;
          const docSize = transact.doc.content.size;
          const from = Math.min(select.from, docSize);
          const to = Math.min(select.to, docSize);
          transact.setSelection(TextSelection.create(transact.doc, from, to));
          editorView.dispatch(transact);
        }
        editorView.focus();
      },
      getScroll: () => milkdownRef.current?.scrollTop ?? 0,
      setScroll: (scrollRef, milkdownRef) => {
        if (scrollRef.current !== null) {
          milkdownRef.current.scrollTop = scrollRef.current;
          scrollRef.current = null;
        }
      },
      setReadOnly: crepe.setReadonly.bind(crepe)
    });
    return crepe;
  }, [
    // save text | select | scroll when editor reload
    // save text & scroll when creating new markdown
    basePath,
    // save text & select when switch readonly -> editable
    editableKey,
    // save text & select & scroll when loging in
    context.isAuthority,
    // save text & select & scroll when setting changes
    // languagePicker -> context.setting.meta.language
    context.languagePicker,
    context.setting.crepe.feature.blockEdit,
    context.setting.crepe.feature.toolbar,
    context.setting.crepe.feature.stat,
    context.setting.crepe.feature.spellCheck,
    context.setting.crepe.code.lineNumber,
    context.setting.crepe.code.lineGutter
  ]);

  React.useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      context.crepeRef.unload();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Milkdown />;
};

const CrepeEditor = () => {
  const navigate = useNavigate();
  const context = React.useContext(GlobalContext);

  const [modalTree, setModalTree] = React.useState({
    open: false,
    handleAction: () => { },
    handleCancel: () => { }
  });

  const handleToggleTree = React.useCallback(
    () => new Promise((resolve, reject) => {
      setModalTree({
        open: true,
        initValue: undefined,
        handleAction: resolve,
        handleCancel: reject
      });
    }),
    []
  );

  const handleCloseModalTree = React.useCallback(() => {
    setModalTree((modalTree) => ({ ...modalTree, open: false }));
  }, [setModalTree]);

  const [crepeState, setCrepeState] = React.useState(0);
  const [editableKey, setEditableKey] = React.useState(0);
  const [readOnly, setReadOnly] = React.useState(false);
  const [modified, setModified] = React.useState(false);
  const [counter, setCounter] = React.useState({ lines: 0, words: 0, chars: 0 });

  const [wordCountOpen, setWordCountOpen] = React.useState(false);
  const wordCountAnchorRef = React.useRef(null);

  const fileContentRef = React.useRef(null);
  const normalizedRef = React.useRef(null);
  const nextRef = React.useRef(null);

  const { "*": rawFolderName } = useParams();
  const folderName = React.useMemo(
    () => rawFolderName
      .replace(/\/+/g, "/")
      .replace(/^\//, "")
      .replace(/\/$/, ""),
    [rawFolderName]
  );

  const folderPart = React.useMemo(() => folderName.split("/"), [folderName]);
  const crepeType = React.useMemo(() => folderPart[0], [folderPart]);
  const crepePath = React.useMemo(() => folderPart.slice(1, -1), [folderPart]);
  const crepeTitle = React.useMemo(
    () => folderName.length
      ? folderPart.slice(-1)[0]
      : `${context.languagePicker("modal.tree.untitled")}.md`,
    [folderName, folderPart, context]
  );

  const basePath = React.useMemo(
    () => folderName.length
      ? `/${[crepeType, ...crepePath].join("/")}/`
      : null,
    [folderName, crepeType, crepePath]
  );

  const breadcrumb = React.useMemo(() => folderName.length
    ? [
      context.languagePicker(`nav.${crepeType}`),
      ...crepePath,
      crepeTitle
    ] : [
      context.languagePicker("nav.utility.title"),
      context.languagePicker("nav.utility.milkdown")
    ], [context, folderName, crepeType, crepePath, crepeTitle]);

  const breadLink = React.useMemo(
    () => folderName.length ? `/${folderName}` : undefined,
    [folderName]
  );

  const saveRef = React.useRef(null);
  const autoSaveRef = React.useRef(null);
  const autoSavableRef = React.useRef(false);
  const autoSaveTimerRef = React.useRef(null);

  const [autoSaving, setAutoSaving] = React.useState(false);
  const [autoSaveError, setAutoSaveError] = React.useState(false);
  const autoSaveMode = React.useMemo(() => context.setting.crepe.save > 0, [context]);

  // a markdown is savable when
  // - user has logged in
  // - text content is ready
  // - text is modified
  const savable = React.useMemo(
    () => context.isAuthority && crepeState === 1 && modified,
    [context.isAuthority, crepeState, modified]
  );

  // a markdown is auto savable when
  // - markdown is savable
  // - auto save is on
  // - auto save doesn't encounter error
  // - file is loaded from server
  React.useEffect(() => {
    autoSavableRef.current = savable
      && autoSaveMode
      && !autoSaveError
      && folderName.length > 0;
  }, [savable, autoSaveMode, autoSaveError, folderName]);

  // autoSave will be executed in useEditor
  // so its deps array should be empty to avoid any remounting
  const autoSave = React.useCallback((autoSaveInterval) => {
    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (autoSavableRef.current) {
        autoSaveRef.current?.click();
      }
    }, autoSaveInterval);
  }, []);

  const handleAutoSave = React.useCallback(() => {
    // double-check for user's manually clicking
    if (autoSaving || !autoSavableRef.current) {
      return;
    }

    const text = context.crepeRef.getText();
    const diff = createPatch(crepeTitle, fileContentRef.current, text);
    setAutoSaving(true);
    request(
      "POST/utility/crepe/update",
      {
        type: crepeType,
        folderName: crepePath.join("/"),
        filename: crepeTitle,
        diff: diff
      },
      { "": () => {
        setAutoSaveError(true);
        setAutoSaving(false);
      } }
    ).then((data) => {
      setAutoSaving(false);
      if (data.success) {
        setModified(false);
        fileContentRef.current = text;
        normalizedRef.current = text.trimEnd();
      } else {
        // TODO change caption
        toast.error("AUTO SAVE FAILED, DISABLED.");
        setAutoSaveError(true);
      }
    })
  }, [context, crepeType, crepePath, crepeTitle, autoSaving]);

  React.useEffect(() => {
    // a new file is saved
    const nextRefActivated = nextRef.current !== null;
    nextRef.current = null;
    if (nextRefActivated) {
      return;
    }

    clearTimeout(autoSaveTimerRef.current);
    setCrepeState(0);
    setModified(false);
    setAutoSaveError(false);
    if (folderName.length > 0) {
      request("GET/utility/crepe/load", {
        type: crepeType,
        folderName: crepePath.join("/"),
        filename: crepeTitle
      }, { [Status.execErrCode.ResourcesUnexist]: () => {
        navigate("/crepe");
      } })
        .then(({ text }) => {
          if (
            context.setting.crepe.edit === "false"
              || (context.setting.crepe.edit === "auto" && text.length > 0)
          ) {
            context.crepeRef.setReadOnly(true);
            setReadOnly((readOnly) => !readOnly);
          }
          fileContentRef.current = text;
          setCrepeState(1);
        });
    } else {
      if (context.setting.crepe.edit === "false") {
        context.crepeRef.setReadOnly(true);
        setReadOnly((readOnly) => !readOnly);
      }
      fileContentRef.current = "";
      setCrepeState(1);
      setReadOnly(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // url is changed directly
    rawFolderName
  ]);

  const blocker = useBlocker(modified);
  const blockerActiveRef = React.useRef(false);

  React.useEffect(() => {
    if (blocker.state === "blocked") {
      blockerActiveRef.current = true;
      context.setModalReconfirm({
        open: true,
        caption: context.languagePicker("modal.reconfirm.caption.discardDraft"),
        handleAction: () => {
          blockerActiveRef.current = false;
          setModified(false);
          blocker.proceed();
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);

  // unblock the router when modal is cancelled
  React.useEffect(() => {
    if (blockerActiveRef.current && !context.modalReconfirm?.open) {
      blockerActiveRef.current = false;
      blocker.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.modalReconfirm?.open]);

  React.useEffect(() => {
    if (modified) {
      const handler = (event) => event.preventDefault();
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    } else if (nextRef.current) {
      navigate(nextRef.current);
    }
  }, [modified, navigate]);

  const handleToggleReadOnly = React.useCallback(() => {
    if (readOnly) {
      context.crepeRef.snapshot.current = context.crepeRef.getText();
      context.crepeRef.select.current = context.crepeRef.getSelect();
      setEditableKey((editableKey) => editableKey + 1);
    } else {
      context.crepeRef.setReadOnly(true);
    }
    // React 18 will make sure that
    // editableKey & readOnly update at the same time
    setReadOnly((readOnly) => !readOnly);
  }, [context, readOnly]);

  const handleDownload = React.useCallback(() => {
    // getText() != fileContentRef.current even if not modified
    // because crepe will normalize markdown on load
    const text = modified
      ? context.crepeRef.getText()
      : fileContentRef.current;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = crepeTitle;
    a.click();
    URL.revokeObjectURL(url);
  }, [context, modified, crepeTitle]);

  const handleRewrite = React.useCallback(
    (type, folderName, filename, create, text) => {
      toast.promise(new Promise((resolve, reject) => {
        request(
          "POST/utility/crepe/save",
          { type, folderName, filename, create, text },
          { "": handleCloseModalTree },
          reject
        ).then(() => {
          if (create) {
            context.crepeRef.select.current = context.crepeRef.getSelect();
            context.crepeRef.scroll.current = context.crepeRef.getScroll();
            nextRef.current = `/crepe/${type}/${folderName}/${filename}`;
          }
          fileContentRef.current = text;
          normalizedRef.current = text.trimEnd();
          setModified(false);
          handleCloseModalTree();
          resolve();
        })
      }), {
        loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
        success: context.languagePicker("modal.toast.success.saveText"),
        error: (data) => data
      });
    },
    [context, handleCloseModalTree]
  );

  const handleSave = React.useCallback((type, folderName, filename, create) => {
    const text = context.crepeRef.getText();
    if (!create) {
      const diff = createPatch(filename, fileContentRef.current, text);
      const toastID = toast.promise(new Promise((resolve, reject) => {
        request(
          "POST/utility/crepe/update",
          { type, folderName, filename, diff },
          undefined,
          reject
        ).then((data) => {
          if (data.success) {
            setModified(false);
            fileContentRef.current = text;
            normalizedRef.current = text.trimEnd();
            resolve();
          } else {
            toast.dismiss(toastID);
            context.setModalReconfirm({
              open: true,
              caption: context.languagePicker("modal.reconfirm.caption.overwrite"),
              handleAction: () =>
                handleRewrite(type, folderName, filename, create, text)
            });
          }
        })
      }), {
        loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
        success: context.languagePicker("modal.toast.success.saveText"),
        error: (data) => data
      });
    } else {
      handleRewrite(type, folderName, filename, create, text);
    }
  }, [context, handleRewrite]);

  const handleToggleSave = React.useCallback(() => {
    if (folderName.length === 0) {
      setModalTree({
        open: true,
        initValue: crepeTitle,
        handleAction: ([folderPath, filename]) => {
          const path = folderPath?.split("/")?.filter(Boolean)
          const type = path[0];
          const folderName = path.slice(1).join("/");
          handleSave(type, folderName, filename, true);
        },
        handleCancel: () => { }
      });
      return;
    } else {
      handleSave(crepeType, crepePath.join("/"), crepeTitle, false);
    }
  }, [handleSave, folderName, crepeType, crepePath, crepeTitle]);

  React.useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "e") {
        event.preventDefault();
        handleToggleReadOnly();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault();
        handleDownload();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        const buttonRef = (autoSaveMode && !autoSaveError) ? autoSaveRef : saveRef;
        buttonRef.current?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleToggleReadOnly, handleDownload, autoSaveMode]);

  return (
    <RouteField
      display
      path={breadcrumb}
      link={breadLink}
      title={
        <Stack
          direction="row"
          spacing={1}
          sx={{ px: 3, pb: 1.5, alignItems: "flex-end" }}
        >
          <Typography
            level="h3"
            children={crepeTitle}
          />
          <Stack direction="row" sx={{ position: "relative", top: "1px" }}>
            <IconButton
              size="sm"
              variant="soft"
              onClick={handleToggleReadOnly}
              onMouseDown={(event) => event.preventDefault()}
              sx={buttonStyle}
            >
              {readOnly ? <EditOffOutlinedIcon /> : <EditOutlinedIcon/>}
            </IconButton>
            <IconButton
              size="sm"
              variant="soft"
              onClick={handleDownload}
              onMouseDown={(event) => event.preventDefault()}
              sx={buttonStyle}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
            {(!autoSaveMode || autoSaveError) && savable && (
              <IconButton
                size="sm"
                variant="soft"
                onClick={handleToggleSave}
                onMouseDown={(event) => event.preventDefault()}
                sx={buttonStyle}
                ref={saveRef}
              >
                <SaveRoundedIcon />
              </IconButton>
            )}
            {(autoSaveMode && !autoSaveError) && (
              <IconButton
                size="sm"
                variant="soft"
                onClick={handleAutoSave}
                onMouseDown={(event) => event.preventDefault()}
                sx={buttonStyle}
                ref={autoSaveRef}
              >
                {autoSaving
                  ? <CloudUploadOutlinedIcon />
                  : modified
                  ? <CloudOutlinedIcon />
                  : <CloudDoneOutlinedIcon />}
              </IconButton>
            )}
          </Stack>
        </Stack>
      }
      sx={{
        px: 0,
        pb: 0,
        minHeight: 0,
        flexGrow: 1,
        flexDirection: "column",
        height: "auto"
      }}
    >
      {crepeState === 0 && <Loading pinned />}
      {crepeState === 1 &&
        <MaildownField>
          <MilkdownProvider>
            <CrepeEditorInner
              basePath={basePath}
              editableKey={editableKey}
              readOnly={readOnly}
              autoSave={autoSave}
              setModified={setModified}
              setCounter={setCounter}
              handleToggleTree={handleToggleTree}
              handleCloseModalTree={handleCloseModalTree}
              fileContentRef={fileContentRef}
              normalizedRef={normalizedRef}
            />
          </MilkdownProvider>
        </MaildownField>}
      {context.setting.crepe.feature.stat && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "1.8rem"
          }}
        >
          <ClickAwayListener onClickAway={() => setWordCountOpen(false)}>
            <Box sx={{ height: "100%" }}>
              <Box
                ref={wordCountAnchorRef}
                onClick={() => setWordCountOpen(prev => !prev)}
                sx={{
                  px: 2.5,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "var(--joy-palette-neutral-softHoverBg)"
                  }
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: "var(--joy-palette-neutral-600)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {counter.words} {context.languagePicker("main.crepe.stat.words")}
                </Typography>
                <UnfoldMoreOutlinedIcon sx={{ ml: 0.5, fontSize: "0.9rem" }} />
              </Box>
              <Popper
                open={wordCountOpen}
                anchorEl={wordCountAnchorRef.current}
                placement="top-end"
                style={{ zIndex: 1300 }}
              >
                <Box
                  sx={{
                    pt: 1.5,
                    pb: 1,
                    minWidth: 160,
                    bgcolor: "var(--joy-palette-background-popup)",
                    border: "1px solid var(--joy-palette-neutral-outlinedBorder)",
                    borderRadius: "sm",
                    boxShadow: "xs"
                  }}
                >
                  <Typography
                    level="body-xs"
                    sx={{
                      pl: 2,
                      pr: 2,
                      mb: 0.5,
                      fontSize: "0.85rem",
                      color: "text.secondary"
                    }}
                  >
                    {context.languagePicker("main.crepe.stat.title")}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 3fr",
                      columnGap: 1.5,
                    }}
                  >
                    {["lines", "words", "chars"].map((key) => (
                      <React.Fragment key={key}>
                        <Typography
                          sx={{
                            pl: 2.5,
                            py: 0.25,
                            fontSize: "0.8rem",
                            color: "text.secondary",
                            fontVariantNumeric: "tabular-nums",
                            textAlign: "right"
                          }}
                        >
                          {counter[key]}
                        </Typography>
                        <Typography
                          sx={{
                            pr: 1.5,
                            py: 0.25,
                            fontSize: "0.8rem",
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {context.languagePicker(`main.crepe.stat.${key}`)}
                        </Typography>
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              </Popper>
            </Box>
          </ClickAwayListener>
        </Box>
      )}
      {modalTree.open && (
        <Tree
          modalTree={modalTree}
          handleCloseModalTree={handleCloseModalTree}
        />
      )}
    </RouteField>
  );
}

export default CrepeEditor;
