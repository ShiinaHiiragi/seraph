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

export default function AlertDialogModal(props) {
  const {
    title,
    caption
  } = props;
  const [open, setOpen] = React.useState(false);

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
          Confirmation
        </Typography>
        <Divider />
        <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
          Are you sure you want to discard all of your notes?
        </Typography>
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Select placeholder="Select Language">
              <Option value="dog">A</Option>
              <Option value="cat">B</Option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input required />
          </FormControl>
          <Button type="submit">Submit</Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
