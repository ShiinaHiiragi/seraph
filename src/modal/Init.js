import * as React from "react";
import { styled } from "@mui/joy/styles";
import { toast } from "sonner";
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
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import IconButton from "@mui/joy/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { request, Status, globalState } from "../interface/constants";
import { languageMap } from "../interface/languagePicker";

const Aligned = styled("span")(({ theme }) => ({
  paddingLeft: theme.spacing(4)
}));

const AlignedOption = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Option {...otherProps}>
      <Aligned>{children}</Aligned>
    </Option>
  );
}

export default function Init(props) {
  const {
    setGlobalSwitch,
    language,
    setLanguage,
    setFolders,
    modalInitOpen
  } = props;
  const context = React.useContext(GlobalContext);
  const [formPasswordText, setFormPasswordText] = React.useState("");
  const [formPasswordType, setFormPasswordType] = React.useState("password");

  const handleClickSubmit = React.useCallback(() => {
    request("POST/auth/init", {
      language: language,
      password: formPasswordText
    })
      .then((res) => {
        if (res.statusCode === Status.statusCode.ExecSuccess) {
          toast.success(context.languagePicker("modal.toast.success.init"));
          setFolders({ public: [ ], private: [ ] })
          setGlobalSwitch(globalState.AUTHORITY);
        }
      })
      .catch(request.unparseableResponse);
  }, [context, language, formPasswordText]);

  return (
    <Modal open={modalInitOpen} sx={{ userSelect: "none" }}>
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
            <Select
              value={language}
              startDecorator={<LanguageOutlinedIcon />}
              onChange={(_, newValue) => setLanguage(newValue)}
            >
              {Object.keys(languageMap).map((item, index) => (
                <AlignedOption value={item} key={index}>
                  {languageMap[item].displayName}
                </AlignedOption>
              ))}
            </Select>
          </FormControl>
          <form>
            <Input type="text" autoComplete="username" sx={{ display: "none" }} />
            <FormControl>
              <FormLabel>{context.languagePicker("modal.init.password.label")}</FormLabel>
              <Input
                endDecorator={
                  <IconButton
                    onClick={() => {
                      setFormPasswordType((formPasswordType) => 
                        formPasswordType === "password"
                          ? "text"
                          : "password"
                      );
                    }}
                  >
                    {formPasswordType === "password"
                      ? <VisibilityIcon />
                      : <VisibilityOffIcon />}
                  </IconButton>
                }
                placeholder={context.languagePicker("modal.init.password.placeholder")}
                value={formPasswordText}
                autoComplete="new-password"
                onChange={(event) => setFormPasswordText(event.target.value)}
                slotProps={{ input: { type: formPasswordType } }}
              />
            </FormControl>
          </form>
          <Button disabled={formPasswordText.length === 0} onClick={handleClickSubmit}>
            {context.languagePicker("universal.button.submit")}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
