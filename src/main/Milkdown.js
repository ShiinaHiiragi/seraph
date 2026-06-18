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
import { editorViewCtx, editorViewOptionsCtx, commandsCtx } from "@milkdown/kit/core";
import { getMarkdown, replaceAll, $prose } from "@milkdown/kit/utils";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { linkTooltipAPI } from "@milkdown/kit/component/link-tooltip";
import {
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  createCodeBlockCommand
} from '@milkdown/kit/preset/commonmark';
import { toggleStrikethroughCommand } from "@milkdown/kit/preset/gfm";
import { keymap } from "@milkdown/kit/prose/keymap";
import { Plugin } from "@milkdown/kit/prose/state";
// import { emoji } from "@milkdown/plugin-emoji";
import EditOffOutlinedIcon from "@mui/icons-material/EditOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
// import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
// import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
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
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
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
  const { readOnly, fileContent, setModified, saveRef } = props;
  const context = React.useContext(GlobalContext);

  useEditor((root) => {
    let regulatedInitValue = null;
    const crepe = new Crepe({
      root,
      defaultValue: context.crepeRef.snapshot.current ?? fileContent,
      features: {
        [CrepeFeature.Toolbar]: false,
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
              label: context.languagePicker("main.crepe.popup.slash.list.bulletList")
            },
            orderedList: {
              label: context.languagePicker("main.crepe.popup.slash.list.orderedList")
            },
            taskList: {
              label: context.languagePicker("main.crepe.popup.slash.list.taskList")
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
        }
      },
    });

    crepe.setReadonly(readOnly);
    crepe.editor
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
            regulatedInitValue = getMarkdown()(ctx);
          })
          .markdownUpdated((_, markdown) => {
            setModified(markdown !== regulatedInitValue);
          });
      })
      .use($prose((ctx) => keymap({
        // Mod-Alt-0 -> text (default
        // Mod-Alt-1 -> h1 (default)
        // Mod-Alt-2 -> h2 (default)
        // Mod-Alt-3 -> h3 (default)
        // Mod-Alt-4 -> h4 (default)
        // Mod-Alt-5 -> h5 (default)
        // Mod-Alt-6 -> h6 (default)
        // Mod-Alt-q -> quote block
        "Mod-Alt-q": () => {
          ctx.get(commandsCtx)
            .call(wrapInBlockquoteCommand.key);
          return true;
        },
        "Mod-Shift-b": () => false,
        // NULL      -> divider
        // Mod-Alt-u -> unordered list
        "Mod-Alt-u": () => {
          ctx.get(commandsCtx)
            .call(wrapInBulletListCommand.key);
          return true;
        },
        "Mod-Alt-8": () => false,
        // Mod-Alt-o -> ordered list
        "Mod-Alt-o": () => {
          ctx.get(commandsCtx)
            .call(wrapInOrderedListCommand.key);
          return true;
        },
        "Mod-Alt-7": () => false,
        // NULL      -> task list
        // NULL      -> images
        // Mod-Alt-c -> code block
        "Mod-Alt-e": () => {
          ctx.get(commandsCtx)
            .call(createCodeBlockCommand.key);
          return true;
        },
        "Mod-Alt-c": () => false,
        // NULL      -> tables
        // NULL      -> latex block
        // Mod-b     -> bold text (default)
        // Mod-i     -> italic text (default)
        // Mod-q     -> delete line
        "Mod-q": () => {
          ctx.get(commandsCtx)
            .call(toggleStrikethroughCommand.key);
          return true;
        },
        "Mod-Alt-x": () => false,
        // Mod-e     -> inline code (default)
        // NULL      -> inline math
        // Mod-l     -> inline link
        "Mod-l": () => {
          const { selection } = ctx.get(editorViewCtx).state;
          if (selection.empty) {
            return false;
          }
          ctx.get(linkTooltipAPI.key)
            .addLink(selection.from, selection.to);
          return true;
        },
        "Mod-s": () => {
          saveRef.current?.click();
          return true;
        }
      })))
      .use($prose(() => new Plugin({
        props: {
          handleDOMEvents: {
            click(view, event) {
              if (view.editable) return false
              const a = event.target.closest("a[href]");
              if (a) {
                event.preventDefault();
                window.open(a.href, "_blank", "noopener,noreferrer");
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
      setReadonly: crepe.setReadonly.bind(crepe)
    });
    return crepe;
  }, [
    fileContent,
    context.languagePicker
    // TODO: add config in context.setting
    // spell check
    // enable tool bar
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
    context.crepeRef.setReadOnly(readOnly);
  }, [context, readOnly]);

  React.useEffect(() => {
    if (modified) {
      const handler = (event) => event.preventDefault();
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [modified]);

  const blocker = useBlocker(modified);
  const blockerActiveRef = React.useRef(false);
  const saveRef = React.useRef(null);

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
  // - not read only
  // and save button is hidden without any modification
  const savable = React.useMemo(
    () => context.isAuthority && crepeState === 1 && crepeRefer && !readOnly,
    [context.isAuthority, crepeState, crepeRefer, readOnly]
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

  const handleSave = React.useCallback(() => {
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
              onClick={() => setReadOnly((readOnly) => !readOnly)}
              sx={buttonStyle}
            >
              {readOnly ? <EditOffOutlinedIcon /> : <EditOutlinedIcon/>}
            </IconButton>
            <IconButton
              size="sm"
              variant="soft"
              onClick={handleDownload}
              sx={buttonStyle}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
            {savable && modified && <IconButton
              ref={saveRef}
              size="sm"
              variant="soft"
              onClick={handleSave}
              sx={buttonStyle}
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
              fileContent={fileContent}
              setModified={setModified}
              saveRef={saveRef}
            />
          </MilkdownProvider>
        </MaildownField>}
    </RouteField>
  );
}

export default CrepeEditor;
