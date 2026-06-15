import React from "react";
import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { editorViewOptionsCtx } from "@milkdown/kit/core";
import { getMarkdown, replaceAll } from "@milkdown/kit/utils";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { editorViewCtx } from "@milkdown/kit/core";
import { linkTooltipAPI } from "@milkdown/kit/component/link-tooltip";
import { keymap } from "@milkdown/kit/prose/keymap";
import { $prose } from "@milkdown/kit/utils";
// import { emoji } from "@milkdown/plugin-emoji";
import Loading from "./Loading";
import RouteField from "../interface/RouteField";
import GlobalContext, {
  id,
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
  const { fileContent } = props;
  const context = React.useContext(GlobalContext);

  useEditor((root) => {
    const isReloading = context.crepeRef.isLoaded();
    const crepe = new Crepe({
      root,
      defaultValue: isReloading
        ? context.crepeRef.snapshot.current
        : fileContent,
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

    crepe.editor
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            spellcheck: "false"
          },
          scrollThreshold: {
            top: 0,
            right: 0,
            bottom: 64,
            left: 0
          },
          scrollMargin: {
            top: 0,
            right: 0,
            bottom: 64,
            left: 0
          }
        }));
        ctx.get(listenerCtx).markdownUpdated(() => {
          context.crepeRef.modify.current = true;
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
      .use(listener)
      .use(rubyRemark)
      .use(rubyNode)
      .use(rubyBracketInputRule)
      .use(rubyHtmlInputRule)
      .use(rubyPasteHandler);

    context.crepeRef.load(crepe.editor, { getMarkdown, replaceAll });
    return crepe;
  }, [
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
  const { "*": rawFolderName } = useParams();
  const context = React.useContext(GlobalContext);

  const [crepeState, setCrepeState] = React.useState(0);
  const [fileContent, setFileContent] = React.useState(null);

  const folderName = React.useMemo(
    () => rawFolderName
      .replace(/\/+/g, "/")
      .replace(/^\//, '')
      .replace(/\/$/, ''),
    [rawFolderName]
  );

  React.useEffect(() => {
    setCrepeState(0);
    const validPath = ["public", "private"]
      .map((prefix) => folderName.startsWith(prefix))
      .some(id);

    const initCrepe = (text) => {
      setCrepeState(1);
      setFileContent(text ?? "");
      if (text === undefined) {
        navigate("/crepe");
      }
    };

    if (validPath) {
      request(
        "GET/utility/crepe/load",
        {
          type: folderName.split("/")[0],
          file: folderName.split("/").slice(1).join("/")
        },
        { [Status.execErrCode.ResourcesUnexist]: initCrepe }
      ).then((data) => initCrepe(data.text));
    } else {
      initCrepe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // check if
    // load with auth naturally
    context.secondTick
  ]);

  return (
    <RouteField
      display
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.milkdown")
      ]}
      title={context.languagePicker("nav.utility.milkdown")}
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
              fileContent={fileContent}
            />
          </MilkdownProvider>
        </MaildownField>}
    </RouteField>
  );
}

export default CrepeEditor;
