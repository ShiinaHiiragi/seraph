import React from "react";
import { useParams } from "react-router";
import { useNavigate, useBlocker } from "react-router-dom";
import { toast } from "sonner";
import { styled } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
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
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
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
// import { emoji } from "@milkdown/plugin-emoji";
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
import Loading from "./Loading";
import RouteField from "../interface/RouteField";
import GlobalContext, { request, Status, toSVG } from "../interface/constants";
import {
  rubyRemark,
  rubyNode,
  rubyBracketInputRule,
  rubyHtmlInputRule,
  rubyPasteHandler
} from "../interface/ruby";

import "@milkdown/crepe/theme/common/style.css";
import "../interface/milk.css";

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
  const { readOnly, editableKey, fileContent, setModified } = props;
  const context = React.useContext(GlobalContext);
  const normalizedFileContent = React.useRef(null);

  useEditor((root) => {
    let regulatedInitValue = null;
    const loadedFromSnapshot = context.crepeRef.snapshot.current !== null;
    const crepe = new Crepe({
      root,
      defaultValue: context.crepeRef.snapshot.current ?? fileContent,
      features: {
        [CrepeFeature.Toolbar]: true
      },
      featureConfigs: {
        [CrepeFeature.Cursor]: {
          width: 2
        },
        [CrepeFeature.LinkTooltip]: {
          editButton: toSVG(EditOutlinedIcon),
          removeButton: toSVG(DeleteOutlineOutlinedIcon),
          confirmButton: toSVG(DoneIcon),
          inputPlaceholder: "URL"
        },
        [CrepeFeature.ImageBlock]: {
          // TODO: upload images
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
            // TODO: wrap / .milkdown .ProseMirror .milkdown-code-block { overflow: hidden; }
            EditorView.lineWrapping,
            lineNumbers(),
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
          attributes: { spellcheck: "false" },
          scrollThreshold: { top: 0, right: 0, bottom: 64, left: 0 },
          scrollMargin: { top: 0, right: 0, bottom: 64, left: 0 }
        }));
        // listener itself prevents jittering
        ctx.get(listenerCtx)
          .mounted(() => {
            if (!loadedFromSnapshot) {
              normalizedFileContent.current = getMarkdown()(ctx).trimEnd();
            }
            regulatedInitValue = normalizedFileContent.current;
          })
          .markdownUpdated((_, markdown) => {
            setModified(markdown.trimEnd() !== regulatedInitValue);
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
            }
          }
        }
      })))
      .use(listener)
      .use(rubyRemark)
      .use(rubyNode)
      .use(rubyBracketInputRule)
      .use(rubyHtmlInputRule)
      .use(rubyPasteHandler);

    context.crepeRef.load(crepe.editor, {
      getMarkdown,
      replaceAll,
      actionCaret: () => (ctx) => ctx.get(editorViewCtx).state.selection,
      actionFocus: (select) => (ctx) => {
        const editorView = ctx.get(editorViewCtx);
        if (select) {
          const transact = editorView.state.tr;
          transact.setSelection(TextSelection.create(
            transact.doc,
            select.from,
            select.to
          ));
          editorView.dispatch(transact);
        }
        editorView.focus();
      },
      setReadOnly: crepe.setReadonly.bind(crepe)
    });
    return crepe;
  }, [
    fileContent,
    editableKey,
    context.languagePicker
    // TODO: add config in context.setting
    // spell check, enable tool bar
  ]);

  React.useEffect(() => {
    return () => {
      context.crepeRef.unload();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Milkdown />;
};

const CrepeEditor = () => {
  const navigate = useNavigate();
  const context = React.useContext(GlobalContext);

  const [crepeState, setCrepeState] = React.useState(0);
  const [crepeRefer, setCrepeRefer] = React.useState(false);
  const [fileContent, setFileContent] = React.useState(null);

  const [readOnly, setReadOnly] = React.useState(true);
  const [editableKey, setEditableKey] = React.useState(0);
  const [modified, setModified] = React.useState(false);

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
      : context.languagePicker("nav.utility.milkdown"),
    [folderName, folderPart, context]
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

  React.useEffect(() => {
    if (modified) {
      const handler = (event) => event.preventDefault();
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [modified]);

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

  // a markdown is savable when
  // - user has logged in
  // - text content is ready
  // - dest file exists
  // and save button is hidden without any modification
  const savable = React.useMemo(
    () => context.isAuthority && crepeState === 1 && crepeRefer,
    [context.isAuthority, crepeState, crepeRefer]
  );

  React.useEffect(() => {
    setCrepeState(0);
    setModified(false);

    if (folderName.length > 0) {
      request("GET/utility/crepe/load", {
        type: crepeType,
        folderName: crepePath.join("/"),
        filename: crepeTitle
      }, { [Status.execErrCode.ResourcesUnexist]: () => {
        navigate("/crepe");
      } })
        .then(({ text }) => {
          setCrepeState(1);
          setCrepeRefer(true);
          setFileContent(text);
        });
    } else {
      setCrepeState(1);
      setCrepeRefer(false);
      setFileContent("");
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
    const text = modified ? context.crepeRef.getText() : fileContent;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = crepeTitle;
    a.click();
    URL.revokeObjectURL(url);
  }, [context, modified, fileContent, crepeTitle]);

  const saveRef = React.useRef(null);
  const handleSave = React.useCallback(() => {
    context.crepeRef.select.current = context.crepeRef.getSelect();
    toast.promise(new Promise((resolve, reject) => {
      const text = context.crepeRef.getText();
      request(
        "POST/utility/crepe/save",
        {
          type: crepeType,
          folderName: crepePath.join("/"),
          filename: crepeTitle,
          text: text
        },
        undefined,
        reject
      ).then(() => {
        setModified(false);
        setFileContent(text);
        resolve();
      })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context.languagePicker("modal.toast.success.saveText"),
      error: (data) => data
    });
  }, [context, crepeType, crepePath, crepeTitle]);

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
        saveRef.current?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleToggleReadOnly, handleDownload]);

  const buttonStyle = React.useMemo(() => ({
    backgroundColor: "transparent",
    "&:hover": { backgroundColor: "transparent" }
  }), []);

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
            {savable && modified && <IconButton
              size="sm"
              variant="soft"
              onClick={handleSave}
              onMouseDown={(event) => event.preventDefault()}
              sx={buttonStyle}
              ref={saveRef}
            >
              <SaveRoundedIcon />
            </IconButton>}
          </Stack>
        </Stack>
      }
      sx={{
        px: 0,
        pb: 0,
        flexGrow: 1,
        minHeight: 0,
        height: "auto"
      }}
    >
      {(crepeState === 0 || fileContent === null) && <Loading pinned />}
      {(crepeState === 1 && fileContent !== null) &&
        <MaildownField>
          <MilkdownProvider>
            <CrepeEditorInner
              readOnly={readOnly}
              editableKey={editableKey}
              fileContent={fileContent}
              setModified={setModified}
            />
          </MilkdownProvider>
        </MaildownField>}
    </RouteField>
  );
}

export default CrepeEditor;
