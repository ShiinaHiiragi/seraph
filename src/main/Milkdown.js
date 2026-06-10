import React from "react";
import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { CrepeBuilder } from "@milkdown/crepe/builder";
import { codeMirror } from "@milkdown/crepe/feature/code-mirror";
import { listItem } from "@milkdown/crepe/feature/list-item";
import { linkTooltip } from "@milkdown/crepe/feature/link-tooltip";
import { imageBlock } from "@milkdown/crepe/feature/image-block";
import { blockEdit } from "@milkdown/crepe/feature/block-edit";
import { toolbar } from "@milkdown/crepe/feature/toolbar";
import { table } from "@milkdown/crepe/feature/table";
import { cursor } from "@milkdown/crepe/feature/cursor";
import { placeholder } from "@milkdown/crepe/feature/placeholder";
import { latex } from "@milkdown/crepe/feature/latex";
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

const CrepeEditorInner = () => {
  useEditor((root) => 
    new CrepeBuilder({root, defaultValue: ""})
      .addFeature(codeMirror)
      .addFeature(listItem)
      .addFeature(linkTooltip)
      .addFeature(imageBlock)
      .addFeature(root.offsetWidth >= 552 ? blockEdit : () => {})
      .addFeature(toolbar)
      .addFeature(table)
      .addFeature(cursor)
      .addFeature(placeholder)
      .addFeature(latex)
  );
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
