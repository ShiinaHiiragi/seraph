import * as React from "react";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

export default function Config(props) {
  const {
    open,
    handleClose
  } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        userSelect: "none",
        "& ::selection": {
          background: "rgb(173, 214, 255)"
        },
        "& ::-webkit-scrollbar": {
          width: "6px",
          height: "6px"
        },
        "& ::-webkit-scrollbar-track": {
          borderRadius: 0,
          backgroundColor: "rgb(250, 250, 250)"
        },
        "& ::-webkit-scrollbar-thumb": {
          borderRadius: 0,
          backgroundColor: "rgb(190, 190, 190)"
        },
        "& html": {
          userSelect: "none",
          scrollbarColor: "rgb(190, 190, 190) rgb(250, 250, 250)"
        }
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
      >
        <Typography
          id="alert-dialog-modal-title"
          level="h2"
        >
          TITLE
        </Typography>
        <Divider />
        <Stack
          spacing={2}
          sx={{
            overflow: "auto",
            mt: 1.5
          }}
        >
          Content
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
