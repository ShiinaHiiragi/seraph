import React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

const ModalForm = React.forwardRef((props, ref) => {
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
    spacing,
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
        sx={{
          maxHeight: "90vh",
          minWidth: "min(480px, calc(100vw - 2.5rem))",
          display: "flex",
          flexDirection: "column"
        }}
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
          spacing={spacing ?? 2}
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
          ref={ref}
          loading={loading}
          disabled={disabled}
          onClick={handleClick}
        >
          {button}
        </Button>
      </ModalDialog>
    </Modal>
  );
});

export default ModalForm;
