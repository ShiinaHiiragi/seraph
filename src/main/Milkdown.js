import React from "react";
import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { getMarkdown, replaceAll } from "@milkdown/kit/utils";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
// import { emoji } from "@milkdown/plugin-emoji";
import Loading from "./Loading";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

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
    minHeight: 0
  },
  [theme.breakpoints.only("xs")]: {
    "& .milkdown .ProseMirror": {
      padding: theme.spacing(1, 1)
    }
  },
  [theme.breakpoints.up("sm")]: {
    "& .milkdown .ProseMirror": {
      padding: theme.spacing(2, 10)
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
        [CrepeFeature.blockEdit]: root.offsetWidth >= 552
      },
      featureConfigs: {
        [CrepeFeature.Placeholder]: {
          text: context.languagePicker("nav.utility.milkdown")
        },
      },
    });

    crepe.editor
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated(() => {
          context.crepeRef.modify.current = true;
        });
      })
      .use(listener);

    context.crepeRef.load(crepe.editor, { getMarkdown, replaceAll });
    return crepe;
  }, [
    context.setting.meta.language
  ]);

  React.useEffect(() => {
    return () => {
      context.crepeRef.unload();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Milkdown />;
};

const CrepeEditor = (props) => {
  const context = React.useContext(GlobalContext);

  const [crepeState, setCrepeState] = React.useState(0);
  const [fileContent, setFileContent] = React.useState(null);

  React.useEffect(() => {
    setCrepeState(0);
    setTimeout(() => {
      // TODO: get filename by url path
      // TODO: get text from server via filename
      setCrepeState(1);
      setFileContent("Init value");
    }, 1000);
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
