import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

export default function ModalForm(props) {
  const {
    open,
    disabled,
    handleClose,
    handleClick,
    title,
    caption,
    button,
    children,
    stackStyle
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
          "scrollbar-color": "rgb(190, 190, 190) rgb(250, 250, 250)"
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
          {title}
        </Typography>
        <Divider />
        {caption && <Typography
          id="alert-dialog-modal-description"
          textColor="text.tertiary"
        >
          {caption}
        </Typography>}
        <Stack spacing={2} sx={stackStyle}>
          {children}
          <Button
            disabled={disabled}
            onClick={handleClick}
          >
            {button}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
