import React from "react";
import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
// import { emoji } from "@milkdown/plugin-emoji";
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
  const { crepeRef, crepeSnapshot } = props;
  const context = React.useContext(GlobalContext);

  useEditor((root) => {
    console.log(crepeRef.current?.status);

    const crepe = new Crepe({
      root,
      defaultValue: crepeSnapshot.current ?? "Requesting...",
      features: {
        [CrepeFeature.blockEdit]: root.offsetWidth >= 552
      },
      featureConfigs: {
        [CrepeFeature.Placeholder]: {
          text: context.languagePicker("nav.utility.milkdown")
        },
      },
    });

    // crepe.editor
    //   .use(emoji);
    crepeRef.current = crepe.editor;
    return crepe;
  }, [context.setting]);

  React.useEffect(() => {
    return () => {
      crepeSnapshot.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Milkdown />;
};

const CrepeEditor = (props) => {
  const { crepeRef, crepeSnapshot } = props;
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.milkdown")
      ]}
      title={context.languagePicker("nav.utility.milkdown")}
      sx={{ flexGrow: 1, minHeight: 0, height: "auto" }}
    >
      <MaildownField>
        <MilkdownProvider>
          <CrepeEditorInner
            crepeRef={crepeRef}
            crepeSnapshot={crepeSnapshot}
          />
        </MilkdownProvider>
      </MaildownField>
    </RouteField>
  );
}

export default CrepeEditor;
