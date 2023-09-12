import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import GlobalContext from "../interface/constants";

export default function Login(props) {
  const {
    modalLoginOpen,
    setModalLoginOpen
  } = props;
  const context = React.useContext(GlobalContext);
  const [formPasswordText, setFormPasswordText] = React.useState("");
  const [formPasswordDisabled, setFormPasswordDisabled] = React.useState(false);

  const handleClickSubmit = React.useCallback(() => {
    // TODO: fill this
  }, [ ]);

  return (
    <Modal
      open={modalLoginOpen}
      onClose={() => setModalLoginOpen(false)}
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
          startDecorator={<InfoOutlinedIcon />}
        >
          {context.languagePicker("modal.login.title")}
        </Typography>
        <Divider />
        <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
          {context.languagePicker("modal.login.caption")}
        </Typography>
        <Stack spacing={2}>
          <form>
            <Input type="text" autoComplete="username" sx={{ display: "none" }} />
            <FormControl>
              <FormLabel>{context.languagePicker("modal.login.password")}</FormLabel>
              <Input
                value={formPasswordText}
                autoComplete="current-password"
                onChange={(event) => setFormPasswordText(event.target.value)}
                slotProps={{ input: { type: "password" } }}
              />
            </FormControl>
          </form>
          <Button
            disabled={formPasswordDisabled || formPasswordText.length === 0}
            onClick={handleClickSubmit}
          >
            {context.languagePicker("universal.button.submit")}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
