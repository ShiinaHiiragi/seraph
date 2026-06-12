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
    loading,
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
          background: "var(--joy-palette-neutral-softActiveBg)"
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
        sx={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
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
        <Stack
          spacing={2}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            ...stackStyle
          }}
        >
          {children}
        </Stack>
        <Button
          loading={loading}
          disabled={disabled}
          onClick={handleClick}
        >
          {button}
        </Button>
      </ModalDialog>
    </Modal>
  );
}
