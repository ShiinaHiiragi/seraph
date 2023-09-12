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
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import GlobalContext from "../interface/constants";

export default function Init(props) {
  const [open, setOpen] = React.useState(false);
  const context = React.useContext(GlobalContext);

  return (
    <Modal open={true} onClose={() => setOpen(false)}>
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
          {context.languagePicker("modal.init.title")}
        </Typography>
        <Divider />
        <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
          {context.languagePicker("modal.init.caption")}
        </Typography>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{context.languagePicker("setting.general.language")}</FormLabel>
            <Select value="dog" placeholder="Select Language">
              <Option value="dog">A</Option>
              <Option value="cat">B</Option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{context.languagePicker("modal.init.password.label")}</FormLabel>
            <Input required />
          </FormControl>
          <Button type="submit">{context.languagePicker("universal.button.submit")}</Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}