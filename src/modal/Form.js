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
    children
  } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        userSelect: "none",
        "& ::selection": {
          background: "rgb(173, 214, 255)"
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
        <Typography
          id="alert-dialog-modal-description"
          textColor="text.tertiary"
        >
          {caption}
        </Typography>
        <Stack spacing={2}>
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
