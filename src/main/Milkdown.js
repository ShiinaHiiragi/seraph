import React from "react";
import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/joy/styles";
import { useParams } from "react-router";
import { useNavigate, useBlocker } from "react-router-dom";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { editorViewCtx, editorViewOptionsCtx } from "@milkdown/kit/core";
import { getMarkdown, replaceAll } from "@milkdown/kit/utils";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { linkTooltipAPI } from "@milkdown/kit/component/link-tooltip";
import { keymap } from "@milkdown/kit/prose/keymap";
import { Plugin } from "@milkdown/kit/prose/state";
import { $prose } from "@milkdown/kit/utils";
// import { emoji } from "@milkdown/plugin-emoji";
import EditOffOutlinedIcon from "@mui/icons-material/EditOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
// import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
// import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import Loading from "./Loading";
import RouteField from "../interface/RouteField";
import GlobalContext, {
  request,
  Status
} from "../interface/constants";
import {
  rubyRemark,
  rubyNode,
  rubyBracketInputRule,
  rubyHtmlInputRule,
  rubyPasteHandler
} from "../interface/ruby";

import "@milkdown/crepe/theme/common/style.css";
import "../interface/milk.css";

function actionSetReadOnly(readOnly) {
  return (ctx) => {
    ctx.get(editorViewCtx).setProps({
      editable: () => !readOnly
    });
  }
}

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
  const { readOnly, fileContent, setModified } = props;
  const context = React.useContext(GlobalContext);

  useEditor((root) => {
    let regulatedInitValue = null;
    const crepe = new Crepe({
      root,
      defaultValue: context.crepeRef.snapshot.current ?? fileContent,
      features: {
        [CrepeFeature.Toolbar]: true,
      },
      featureConfigs: {
        [CrepeFeature.Cursor]: {
          width: 2,
        },
        [Crepe.Feature.LinkTooltip]: {
          inputPlaceholder: "Enter URL...",
          onCopyLink: () => console.log("Link copied"),
        }
      },
    });

    crepe.setReadonly(readOnly);
    crepe.editor
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: { spellcheck: "false" },
          scrollThreshold: { top: 0, right: 0, bottom: 64, left: 0 },
          scrollMargin: { top: 0, right: 0, bottom: 64, left: 0 }
        }));
        // listener will prevent jittering itself
        ctx.get(listenerCtx)
          .mounted(() => {
            regulatedInitValue = getMarkdown()(ctx);
          })
          .markdownUpdated((_, markdown) => {
            setModified(markdown !== regulatedInitValue);
          });
      })
      .use($prose((ctx) => keymap({
        "Mod-k": () => {
          const { selection } = ctx.get(editorViewCtx).state;
          if (selection.empty) {
            return false;
          }
          ctx.get(linkTooltipAPI.key)
            .addLink(selection.from, selection.to);
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
      actionSetReadOnly
    });
    return crepe;
  }, [
    fileContent,
    context.setting.meta.language
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
      .replace(/^\//, '')
      .replace(/\/$/, ''),
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
            />
          </MilkdownProvider>
        </MaildownField>}
    </RouteField>
  );
}

export default CrepeEditor;
