import React from "react";
import Box from "@mui/joy/Box";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const editorWrapStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
};

const CrepeEditorInner = () => {
  useEditor((root) => {
    return new Crepe({ root, defaultValue: "" });
  }, []);
  return <Milkdown />;
};

const CrepeEditor = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.milkdown")
      ]}
      title={context.languagePicker("nav.utility.milkdown")}
    >
      <Box sx={editorWrapStyle}>
        <MilkdownProvider>
          <CrepeEditorInner />
        </MilkdownProvider>
      </Box>
    </RouteField>
  );
}

export default CrepeEditor;
