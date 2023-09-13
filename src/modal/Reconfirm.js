import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Typography from "@mui/joy/Typography";
import GlobalContext from "../interface/constants";

export default function Reconfirm(props) {
  const {
    modalReconfirm,
    setModalReconfirm
  } = props;
  const context = React.useContext(GlobalContext);

  const handleCloseModalReconfirm = React.useCallback(() => {
    setModalReconfirm((modalReconfirm) => ({
      ...modalReconfirm,
      open: false
    }));
  }, [setModalReconfirm]);

  return (
    <Modal
      open={modalReconfirm.open}
      onClose={handleCloseModalReconfirm}
      sx={{ userSelect: "none" }}
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
          startDecorator={<WarningRoundedIcon />}
        >
          {context.languagePicker("modal.reconfirm.title")}
        </Typography>
        <Divider />
        <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
          {modalReconfirm.captionFirstHalf + 
            context.languagePicker("modal.reconfirm.captionSecondHalf")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}>
          <Button variant="plain" color="neutral" onClick={handleCloseModalReconfirm}>
            {context.languagePicker("universal.button.cancel")}
          </Button>
          <Button variant="solid" color="danger" onClick={() => {
            modalReconfirm.handleAction();
            handleCloseModalReconfirm();
          }}>
            {context.languagePicker("universal.button.continue")}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
