import * as React from "react";
import Box from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

const materialTheme = materialExtendTheme();

export default function Tree(props) {
  const { open, handleClose } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        userSelect: "none",
        "& ::selection": {
          background: "var(--joy-palette-neutral-softActiveBg)"
        },
        "& ::-webkit-scrollbar-track": {
          borderRadius: 0,
          backgroundColor: "var(--joy-palette-background-body)"
        },
        "& ::-webkit-scrollbar-thumb": {
          borderRadius: 0,
          backgroundColor: "var(--joy-palette-scrollbarThumb)"
        },
        "& html": {
          userSelect: "none",
          scrollbarColor: "var(--joy-palette-scrollbarThumb) var(--joy-palette-background-body)"
        }
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
        sx={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <Typography
          id="alert-dialog-modal-title"
          level="h2"
        >
          PLACEHOLDER_TITLE_NAME
        </Typography>
        <Divider />
        <Typography
          id="alert-dialog-modal-description"
          textColor="text.tertiary"
        >
          PLACEHOLDER_CAPTION_TEXT
        </Typography>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }}
        >
          <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
            <SimpleTreeView>
              <TreeItem itemId="grid" label="Data Grid">
                <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
                <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
                <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
              </TreeItem>
              <TreeItem itemId="pickers" label="Date and Time Pickers">
                <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
                <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
              </TreeItem>
              <TreeItem itemId="charts" label="Charts">
                <TreeItem itemId="charts-community" label="@mui/x-charts" />
              </TreeItem>
              <TreeItem itemId="tree-view" label="Tree View">
                <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
              </TreeItem>
            </SimpleTreeView>
          </MaterialCssVarsProvider>
        </Box>
        <Button
          loading={false}
          disabled={false}
          onClick={() => { }}
        >
          PLACEHOLDER_BUTTON_NAME
        </Button>
      </ModalDialog>
    </Modal>
  );
}
