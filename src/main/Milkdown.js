import React from "react";
import { styled } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord.css";

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
  }
}));

const CrepeEditorInner = () => {
  const { get } = useEditor((root) => {
    return new Crepe({ root })
  });

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
      sx={{ flexGrow: 1, minHeight: 0, height: "auto" }}
    >
      <MaildownField>
        <MilkdownProvider>
          <CrepeEditorInner />
        </MilkdownProvider>
      </MaildownField>
    </RouteField>
  );
}

export default CrepeEditor;
