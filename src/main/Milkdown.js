import React from "react";
import { useParams } from "react-router";
import { useNavigate, useBlocker } from "react-router-dom";
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
  paragraphSchema,
  headingSchema,
  listItemSchema,
  codeBlockSchema,
  addBlockTypeCommand,
  setBlockTypeCommand,
  wrapInBlockTypeCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  insertHrCommand,
  insertImageCommand,
  toggleStrongCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  createCodeBlockCommand,
  selectTextNearPosCommand
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
import Caption from "../components/Caption";
import Tree from "../modal/Tree";
import RouteField from "../interface/RouteField";
import GlobalContext, {
  toast,
  request,
  Status,
  toSVG,
  animeDuration
} from "../interface/constants";
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
  "&:hover": { backgroundColor: "transparent" },
  "&:disabled": { backgroundColor: "transparent" }
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

const MilkdownField = styled(Box)(({ theme }) => ({
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
    setModified,
    setCounter,
    handleToggleTree,
    handleToggleAutoSave,
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

  React.useEffect(() => {
    if (context.crepeStyle) {
      const style = document.createElement("style");
      style.textContent = `.milkdown {\n${context.crepeStyle}\n}`;
      document.head.appendChild(style);
      return () => style.remove();
    }
  }, [context.crepeStyle]);

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
            handleToggleAutoSave(context.setting.crepe.save * 1000);
          });
      })
      .use($prose((ctx) => keymap({
        // Mod-Alt-0 -> block text (default)
        "Mod-Alt-0": () => false,
        [context.setting.crepe.shortcut.blockText]: () => {
          ctx.get(commandsCtx)
            .call(setBlockTypeCommand.key, {
              nodeType: paragraphSchema.type(ctx)
            });
          return true;
        },
        // Mod-Alt-1 -> block h1 (default)
        "Mod-Alt-1": () => false,
        [context.setting.crepe.shortcut.blockH1]: () => {
          ctx.get(commandsCtx)
            .call(setBlockTypeCommand.key, {
              nodeType: headingSchema.type(ctx),
              attrs: { level: 1 }
            });
          return true;
        },
        // Mod-Alt-2 -> block h2 (default)
        "Mod-Alt-2": () => false,
        [context.setting.crepe.shortcut.blockH2]: () => {
          ctx.get(commandsCtx)
            .call(setBlockTypeCommand.key, {
              nodeType: headingSchema.type(ctx),
              attrs: { level: 2 }
            });
          return true;
        },
        // Mod-Alt-3 -> block h3 (default)
        "Mod-Alt-3": () => false,
        [context.setting.crepe.shortcut.blockH3]: () => {
          ctx.get(commandsCtx)
            .call(setBlockTypeCommand.key, {
              nodeType: headingSchema.type(ctx),
              attrs: { level: 3 }
            });
          return true;
        },
        // Mod-Alt-4 -> block h4 (default)
        "Mod-Alt-4": () => false,
        [context.setting.crepe.shortcut.blockH4]: () => {
          ctx.get(commandsCtx)
            .call(setBlockTypeCommand.key, {
              nodeType: headingSchema.type(ctx),
              attrs: { level: 4 }
            });
          return true;
        },
        // Mod-Alt-5 -> block h5 (default)
        "Mod-Alt-5": () => false,
        [context.setting.crepe.shortcut.blockH5]: () => {
          ctx.get(commandsCtx)
            .call(setBlockTypeCommand.key, {
              nodeType: headingSchema.type(ctx),
              attrs: { level: 5 }
            });
          return true;
        },
        // Mod-Alt-6 -> block h6 (default)
        "Mod-Alt-6": () => false,
        [context.setting.crepe.shortcut.blockH6]: () => {
          ctx.get(commandsCtx)
            .call(setBlockTypeCommand.key, {
              nodeType: headingSchema.type(ctx),
              attrs: { level: 6 }
            });
          return true;
        },
        // Mod-Alt-q -> block quote
        "Mod-Shift-b": () => false,
        [context.setting.crepe.shortcut.blockQuote]: () => {
          ctx.get(commandsCtx)
            .call(wrapInBlockquoteCommand.key);
          return true;
        },
        // Mod-Alt-d -> block divider
        [context.setting.crepe.shortcut.blockDivider]: () => {
          ctx.get(commandsCtx)
            .call(insertHrCommand.key);
          return true;
        },
        // Mod-Alt-u -> block unordered list
        "Mod-Alt-8": () => false,
        [context.setting.crepe.shortcut.blockBullet]: () => {
          ctx.get(commandsCtx)
            .call(wrapInBulletListCommand.key);
          return true;
        },
        // Mod-Alt-o -> block ordered list
        "Mod-Alt-7": () => false,
        [context.setting.crepe.shortcut.blockOrdered]: () => {
          ctx.get(commandsCtx)
            .call(wrapInOrderedListCommand.key);
          return true;
        },
        // Mod-Alt-t -> block task list
        [context.setting.crepe.shortcut.blockTask]: () => {
          ctx.get(commandsCtx)
            .call(wrapInBlockTypeCommand.key, {
              nodeType: listItemSchema.type(ctx),
              attrs: { checked: false },
            });
          return true;
        },
        // Mod-Alt-g -> block images
        [context.setting.crepe.shortcut.blockImage]: () => {
          ctx.get(commandsCtx)
            .call(addBlockTypeCommand.key, {
              nodeType: imageBlockSchema.type(ctx)
            });
          return true;
        },
        // Mod-Alt-` -> block code
        "Mod-Alt-c": () => false,
        [context.setting.crepe.shortcut.blockCode]: () => {
          ctx.get(commandsCtx)
            .call(createCodeBlockCommand.key);
          return true;
        },
        // Mod-Alt-p -> block tables
        [context.setting.crepe.shortcut.blockTable]: () => {
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
        [context.setting.crepe.shortcut.blockLatex]: () => {
          ctx.get(commandsCtx)
            .call(addBlockTypeCommand.key, {
              nodeType: codeBlockSchema.type(ctx),
              attrs: { language: "LaTeX" },
            });
          return true;
        },
        // Mod-b     -> inline bold text (default)
        "Mod-b": () => false,
        [context.setting.crepe.shortcut.inlineBold]: () => {
          ctx.get(commandsCtx)
            .call(toggleStrongCommand.key);
          return true;
        },
        // Mod-i     -> inline italic text (default)
        "Mod-i": () => false,
        [context.setting.crepe.shortcut.inlineItalic]: () => {
          ctx.get(commandsCtx)
            .call(toggleEmphasisCommand.key);
          return true;
        },
        // Mod-q     -> inline strike through
        "Mod-Alt-x": () => false,
        [context.setting.crepe.shortcut.inlineStrike]: () => {
          ctx.get(commandsCtx)
            .call(toggleStrikethroughCommand.key);
          return true;
        },
        // Mod-g     -> inline image (inaccessible via neither toolbar or slash)
        [context.setting.crepe.shortcut.inlineImage]: () => {
          ctx.get(commandsCtx)
            .call(insertImageCommand.key);
          return true;
        },
        // Mod-`     -> inline code (Mod-e was used for editable/read-only)
        [context.setting.crepe.shortcut.inlineCode]: () => {
          ctx.get(commandsCtx)
            .call(toggleInlineCodeCommand.key);
          return true;
        },
        // Mod-m     -> inline math
        [context.setting.crepe.shortcut.inlineLatex]: () => {
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
        [context.setting.crepe.shortcut.inlineLink]: () => {
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
    // save text & select & scroll when loging in
    // context.isAuthority,
    // save select & scroll when creating new markdown
    basePath,
    // save text & select when switch readonly -> editable
    editableKey,
    // save text & select & scroll when setting changes
    // languagePicker -> context.setting.meta.language
    context.languagePicker,
    context.setting.crepe.save,
    context.setting.crepe.feature.blockEdit,
    context.setting.crepe.feature.toolbar,
    context.setting.crepe.feature.stat,
    context.setting.crepe.feature.spellCheck,
    context.setting.crepe.code.lineNumber,
    context.setting.crepe.code.lineGutter,
    context.setting.crepe.shortcut.blockText,
    context.setting.crepe.shortcut.blockH1,
    context.setting.crepe.shortcut.blockH2,
    context.setting.crepe.shortcut.blockH3,
    context.setting.crepe.shortcut.blockH4,
    context.setting.crepe.shortcut.blockH5,
    context.setting.crepe.shortcut.blockH6,
    context.setting.crepe.shortcut.blockQuote,
    context.setting.crepe.shortcut.blockDivider,
    context.setting.crepe.shortcut.blockBullet,
    context.setting.crepe.shortcut.blockOrdered,
    context.setting.crepe.shortcut.blockTask,
    context.setting.crepe.shortcut.blockImage,
    context.setting.crepe.shortcut.blockCode,
    context.setting.crepe.shortcut.blockTable,
    context.setting.crepe.shortcut.blockLatex,
    context.setting.crepe.shortcut.inlineBold,
    context.setting.crepe.shortcut.inlineItalic,
    context.setting.crepe.shortcut.inlineStrike,
    context.setting.crepe.shortcut.inlineImage,
    context.setting.crepe.shortcut.inlineCode,
    context.setting.crepe.shortcut.inlineLatex,
    context.setting.crepe.shortcut.inlineLink
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

  // § url path analysis
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
      : `${context.languagePicker("modal.tree.untitled")}`,
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

  const display = React.useMemo(() => {
    return crepeType !== "private" || context.isAuthority;
  }, [crepeType, context.isAuthority]);

  // § core states & initialization
  const [crepeState, setCrepeState] = React.useState(0);
  const [loadKey, setLoadKey] = React.useState(0);
  const [editableKey, setEditableKey] = React.useState(0);
  const [readOnly, setReadOnly] = React.useState(false);
  const [modified, setModified] = React.useState(false);

  const fileContentRef = React.useRef(null);
  const normalizedRef = React.useRef(null);
  const nextRef = React.useRef(null);

  /**
   * Milkdown Crepe 页面的主入口，useEffect 与 useEditor 的依赖必须相互配合
   *   - 页面的重建条件有且仅有三项：初次进入、登录、切换文件
   *     - 三者的共同点是都需要重新请求文件内容
   *     - 登出不考虑，因为会自动切换到主页
   *     - useEffect 重建一定会卸载并重装 Editor，因为开头有 setCrepeState(0)
   *   - useEditor 的重建虽然项目繁多，但实际上只有三类：保存新文件、切换只读、更新设置
   *     - 切换 path 中，保存新文件会设置 nextRef 导致 useEffect 立即退出，因此不会重建页面
   *     - 另外两项的重建不会导致页面重建
   *   - 请注意，两者的依赖项事实上是不重合的
   *     - 因为部分 Editor 重建前会利用 crepeRef 保存状态（文本、光标等）并在重建后恢复
   *     - 重建时若对应的 crepeRef 有值，则会使用保存的值，此时 Editor 能得知自己本次启动是重建
   *     - 随后保存的值被立即使用，因此如果 Editor 在短期内被重建两次，则保存的值会丢失
   *     - 用户做的每个改变要么重建整个页面，要么只重建 Editor
   *     - 如果更新竞态导致重建 Editor 后又重建页面，那么保存的快照一定会丢失
   *     - 保存已有文件不需要两者任意一个的重建
   *       - 保存即更新 fileContentRef、normalizedRef 以及 modified 的值
   *       - fileContentRef 只在页面重建时 / 保存时读取最新值
   *       - normalizedRef 只在编辑器非重建的初始化时 / 保存时读取值
   *   - 对 useEditor 重建的逐项解释
   *     - 更新设置时，handleApply 在请求前会保存文本、光标、滚动条
   *       - handleApply 结束后，如果 Editor 被重建，则保存的快照被消费
   *       - 如果 Editor 没有重建，关闭设置面板时，快照将被清空
   *     - 切换只读 / 可编辑模式时
   *       - 可编辑 -> 只读只需使用正常接口即可；只读 -> 可编辑的接口实现有误，代码块会无法编辑
   *       - 仅在从只读 -> 可编辑切换前的瞬间保存文本、光标
   *       - 无需保存滚动条，这样切换后的滚动条位置和切换时一致，不会出现突变
   *     - 保存新文件时，保存光标与滚动条位置
   *       - 设置 nextRef，于是在下面的 useEffect 中 early return，页面不重建
   *       - 编辑器重建，fileContent 使用刚保存的最新版，使用保存的光标与滚动条快照
   *   - 对 useEffect 重建的逐项解释
   *     - 每次（包括初次）进入时不检查用户权限，直接请求文件内容并调节 crepeState
   *       - state=0  认证失败：用户未登录且访问私有文件，此时没有挂载 Editor
   *       - state=-1 没有文件：未认证失败但未找到文件，此时没有挂载 Editor
   *       - state=1  返回内容：未认证失败且找到文件
   *     - 登录导致页面重建包括三种情况
   *       - Editor 未挂载 -> 未挂载，没有权限/资源不可用 -> 资源不可用
   *       - Editor 未挂载 -> 已挂载，没有权限 -> 返回内容，用于访问私有文件
   *       - Editor 已挂载 -> 已挂载，内容可能有修改 -> 保存内容快照并在重建时恢复
   *         - 由于 useEffect 使用了 loadKey，因此将强制卸载 Editor
   *         - handleLogin 会先保存之前的内容、光标、快照，并在重建后用于恢复
   *         - 如果 Editor 未挂载，则 isCreated 为 false，不会保存快照
   *         - autoSaveError 与 autoSaveTimerRef 在登陆前本就不可用，即使初始化也不影响
   *     - 切换页面导致页面重建：来到完全不同的文档，一切将从头初始化
   *     - 关于 modified
   *       - 初次进入时，snapshot 为空，normalizedRef 为空 -> setModified(false)
   *       - 切换页面时，snapshot 为空，normalizedRef 是前一篇内容 -> setModified(false)
   *       - 登录时，snapshot 为当前内容，normalizedRef 为最后一次保存的内容，根据两者关系设置
   *     - readonly 不会在 useEffect 中初始化
   *       - 初次进入时，readonly 默认为 true，然后根据用户设置的偏好选择性改为 false
   *       - useEffect 重建时不会重设 readonly，因此只读/可编辑状态保持原状
   *       - 根据 snapshot 的有无确定是否是重建，上述的 readonly 改变仅在初次进入时设置
   */
  React.useEffect(() => {
    // eatly return when a new file is saved
    // cannot be replaced by location.state
    // because useBlocker prevents navigate() with replace: true
    const nextRefActivated = nextRef.current !== null;
    nextRef.current = null;
    if (nextRefActivated) {
      return;
    }

    const snapshot = context.crepeRef.snapshot.current;
    const isRebuilt = snapshot !== null;
    setModified(
      snapshot === null
        ? false
        : snapshot !== normalizedRef.current
    );
    setAutoSaveError(false);
    clearTimeout(autoSaveTimerRef.current);

    // React will re-mount components forcibly when key attr changes
    // because components with different key value will not be viewed as the one mounted before
    setLoadKey((loadKey) => loadKey + 1);
    setCrepeState(0);
    if (folderName.length > 0) {
      request(
        "GET/utility/crepe/load",
        {
          type: crepeType,
          folderName: crepePath.join("/"),
          filename: crepeTitle
        },
        {
          [Status.authErrCode.InvalidToken]: () => setCrepeState(0),
          [Status.execErrCode.ResourcesUnexist]: () => setCrepeState(-1)
        })
          .then(({ text }) => {
            if (!isRebuilt && (
              context.setting.crepe.edit === "false"
                || (context.setting.crepe.edit === "auto" && text.length > 0)
            )) {
              context.crepeRef.setReadOnly(true);
              setReadOnly((readOnly) => !readOnly);
            }
            fileContentRef.current = text;
            setCrepeState(1);
          });
    } else {
      if (!isRebuilt && context.setting.crepe.edit === "false") {
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
    context.isAuthority,
    // url is changed directly
    rawFolderName
  ]);

  React.useEffect(() => {
    if (context.crepeStyle === null) {
      request("GET/utility/crepe/style")
        .then(({ style }) => context.crepeRef.setStyle(style));
    }
  }, [context.crepeStyle, context.crepeRef]);

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

  // § blocker
  const blocker = useBlocker(({ nextLocation, historyAction }) =>
    modified && !(historyAction !== 'POP' && nextLocation.state?.logout)
  );
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

  React.useEffect(() => {
    // unblock the router when modal is cancelled
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

  // § tree for saving file & image
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

  // § saving and auto saving
  // autoSaveLockRef is a more instant version of autoSaveLock
  const autoSaveLockRef = React.useRef(false);
  const [autoSaveLock, setAutoSaveLock] = React.useState(false);
  const [autoSaveError, setAutoSaveError] = React.useState(false);
  const [autoSaveTip, setAutoSaveTip] = React.useState(false);

  const buttonSaveRef = React.useRef(null);
  const buttonAutoSaveRef = React.useRef(null);

  // a markdown is savable when
  // - user has logged in
  // - text content is ready
  // - text is modified
  const savable = React.useMemo(
    () => context.isAuthority && crepeState === 1 && modified,
    [context.isAuthority, crepeState, modified]
  );

  // auto save mode is used when
  // - auto save setting is toggled
  // - file is loaded from server
  // - auto save doesn't encounter error
  const autoSavableRef = React.useRef(false);
  const autoSaveMode = React.useMemo(
    () => context.setting.crepe.save > 0
      && folderName.length > 0
      && !autoSaveError,
    [context, folderName, autoSaveError]
  );

  // a markdown is auto savable when
  // - markdown is savable
  // - auto save mode is switched on when
  React.useEffect(() => {
    autoSavableRef.current = savable && autoSaveMode;
  }, [savable, autoSaveMode]);

  const handleRewrite = React.useCallback(
    (type, folderName, filename, create, text) => {
      toast.promise(new Promise((resolve, reject) => {
        const suffix = create ? ".md" : ""
        request(
          "POST/utility/crepe/save",
          { type, folderName, filename: filename + suffix, create, text },
          { "": handleCloseModalTree },
          reject
        ).then(() => {
          if (create) {
            context.crepeRef.select.current = context.crepeRef.getSelect();
            context.crepeRef.scroll.current = context.crepeRef.getScroll();
            nextRef.current = `/crepe/${type}/${folderName}/${filename}${suffix}`;
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

  // autoSave will be executed in useEditor
  // so its deps array should be empty to avoid any remounting
  const autoSaveTimerRef = React.useRef(null);
  const handleToggleAutoSave = React.useCallback((interval) => {
    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (autoSavableRef.current) {
        buttonAutoSaveRef.current?.click();
      }
    }, interval);
  }, []);

  const handleAutoSave = React.useCallback(() => {
    // double-check for user's manually clicking
    if (autoSaveLockRef.current || !autoSavableRef.current) {
      return;
    }
    autoSaveLockRef.current = true;
    setAutoSaveLock(true);

    const text = context.crepeRef.getText();
    const diff = createPatch(crepeTitle, fileContentRef.current, text);
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
        setAutoSaveLock(false);
        autoSaveLockRef.current = false;
      } }
    ).then((data) => {
      if (data.success) {
        setModified(false);
        fileContentRef.current = text;
        normalizedRef.current = text.trimEnd();
      } else {
        toast.error(
          context.languagePicker("modal.toast.warning.autoSaveFailed"),
          { duration: Infinity }
        );
        setAutoSaveError(true);
      }
      setAutoSaveLock(false);
      autoSaveLockRef.current = false;
    })
  }, [context, crepeType, crepePath, crepeTitle]);

  const firstTimeRef = React.useRef(true);
  React.useEffect(() => {
    if (firstTimeRef.current) {
      firstTimeRef.current = false;
      return;
    }

    if (!modified && autoSaveMode) {
      setAutoSaveTip(true);
      const timeoutID = setTimeout(
        () => setAutoSaveTip(false),
        animeDuration
      );
      return () => {
        clearTimeout(timeoutID);
        setAutoSaveTip(false);
      }
    }
  }, [modified, autoSaveMode]);

  // § other features
  const [counter, setCounter] = React.useState({ lines: 0, words: 0, chars: 0 });
  const [wordCountOpen, setWordCountOpen] = React.useState(false);
  const wordCountAnchorRef = React.useRef(null);

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

  React.useEffect(() => {
    const matchShortcut = (shortcut, event) => {
      const parts = shortcut.split("-");
      const key = parts[parts.length - 1];
      const modifiers = parts.slice(0, -1);
      return (
        modifiers.includes("Mod") === (event.ctrlKey || event.metaKey) &&
        modifiers.includes("Alt") === event.altKey &&
        modifiers.includes("Shift") === event.shiftKey &&
        event.key.toLowerCase() === key.toLowerCase()
      );
    };

    const handler = (event) => {
      if (matchShortcut(context.setting.crepe.shortcut.edit, event)) {
        event.preventDefault();
        handleToggleReadOnly();
      }
      if (matchShortcut(context.setting.crepe.shortcut.download, event)) {
        event.preventDefault();
        handleDownload();
      }
      if (matchShortcut(context.setting.crepe.shortcut.save, event)) {
        event.preventDefault();
        const buttonRef = autoSaveMode ? buttonAutoSaveRef : buttonSaveRef;
        buttonRef.current?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    autoSaveMode,
    context.setting.crepe.shortcut.save,
    context.setting.crepe.shortcut.edit,
    context.setting.crepe.shortcut.download,
    handleDownload,
    handleToggleReadOnly
  ]);

  return (
    <RouteField
      display={display}
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
          {crepeState === 1 && (
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
              {!autoSaveMode && context.isAuthority && crepeState === 1 && (
                <IconButton
                  size="sm"
                  variant="soft"
                  onClick={handleToggleSave}
                  onMouseDown={(event) => event.preventDefault()}
                  sx={buttonStyle}
                  ref={buttonSaveRef}
                  disabled={!modified}
                >
                  <SaveRoundedIcon />
                </IconButton>
              )}
              {autoSaveMode && (
                <React.Fragment>
                  <IconButton
                    size="sm"
                    variant="soft"
                    onClick={handleAutoSave}
                    onMouseDown={(event) => event.preventDefault()}
                    sx={buttonStyle}
                    ref={buttonAutoSaveRef}
                  >
                    {autoSaveLock
                      ? <CloudUploadOutlinedIcon />
                      : modified
                      ? <CloudOutlinedIcon />
                      : <CloudDoneOutlinedIcon />}
                  </IconButton>
                  <Typography
                    level="body-sm"
                    sx={{
                      height: "var(--joy-fontSize-sm)",
                      lineHeight: "var(--joy-fontSize-sm)",
                      alignSelf: "center",
                      ml: 0.5
                    }}
                  >
                    {autoSaveLock
                      ? context.languagePicker("main.crepe.sync.saving")
                      : autoSaveTip
                      ? context.languagePicker("main.crepe.sync.saved")
                      : ""}
                  </Typography>
                </React.Fragment>
              )}
            </Stack>
          )}
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
        <MilkdownField key={loadKey}>
          <MilkdownProvider>
            <CrepeEditorInner
              basePath={basePath}
              editableKey={editableKey}
              readOnly={readOnly}
              setModified={setModified}
              setCounter={setCounter}
              handleToggleTree={handleToggleTree}
              handleToggleAutoSave={handleToggleAutoSave}
              handleCloseModalTree={handleCloseModalTree}
              fileContentRef={fileContentRef}
              normalizedRef={normalizedRef}
            />
          </MilkdownProvider>
        </MilkdownField>}
      {crepeState === -1 && (
        <Caption
          title={context.languagePicker("universal.placeholder.unexist.title")}
          caption={context.languagePicker("universal.placeholder.unexist.caption")}
        />
      )}
      {crepeState === 1 && context.setting.crepe.feature.stat && (
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
                onClick={() => setWordCountOpen((wordCountOpen) => !wordCountOpen)}
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
