import React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import GlobalContext, { request, toast } from "../interface/constants";

export default function Passcode() {
  const context = React.useContext(GlobalContext);

  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [passcode, setPasscode] = React.useState("");
  const [error, setError] = React.useState("");

  const handleGenerate = React.useCallback(() => {
    setLoading(true);
    setError("");
    request("POST/auth/code", undefined, undefined, (message) => {
      setError(message);
      setLoading(false);
    }).then((data) => {
      setPasscode(data.passcode);
      setLoading(false);
      setOpen(true);
    });
  }, []);

  const handleClose = React.useCallback(() => setOpen(false), []);
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(String(passcode))
      .then(() => toast.success(context.languagePicker("modal.toast.success.passcode")));
  }, [context, passcode]);

  return (
    <React.Fragment>
      <Button
        size="sm"
        color="neutral"
        variant="outlined"
        sx={{
          alignSelf: "flex-start",
          minWidth: context.languagePicker("header.config.attrs.width")
        }}
        loading={loading}
        onClick={handleGenerate}
        startDecorator={<KeyOutlinedIcon />}
        disabled={context.isTempPass}
      >
        {context.languagePicker("header.config.account.passcodeGenerate")}
      </Button>
      {!open && error && <Typography color="danger" level="body-sm">{error}</Typography>}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          userSelect: "none",
          "& ::selection": { background: "var(--joy-palette-neutral-softActiveBg)" }
        }}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="passcode-modal-title"
          aria-describedby="passcode-modal-description"
          sx={{ minWidth: "min(480px, calc(100vw - 2.5rem))" }}
        >
          <Typography id="passcode-modal-title" level="h2" startDecorator={<KeyOutlinedIcon />}>
            {context.languagePicker("header.config.account.passcodePopup.title")}
          </Typography>
          <Divider />
          <Typography textColor="text.tertiary">
            {context.languagePicker("header.config.account.passcodePopup.caption")
              .format(
                passcode,
                context.setting.meta.secret
              )}
          </Typography>
          {error && <Typography color="danger" level="body-sm">{error}</Typography>}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="solid" onClick={handleCopy}>
              {context.languagePicker("header.config.account.passcodePopup.copy")}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
