import React from "react";
import { styled } from "@mui/joy/styles";
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
import { toast, request, globalState } from "../interface/constants";
import { languageMap, languagePickerSpawner } from "../interface/languagePicker";
import SemiInput from "../interface/SemiInput";

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
    setFirstTick,
    setGlobalSwitch,
    setClipboard,
    setSetting,
    setMetadata,
    setPublicFolders,
    setPrivateFolders,
    modalInitOpen,
    setModalInitOpen
  } = props;
  const context = React.useContext(GlobalContext);
  const buttonRef = React.useRef(null);

  const [formPasswordText, setFormPasswordText] = React.useState("");
  const [formPasswordType, setFormPasswordType] = React.useState("password");
  const [formPasswordLoading, setFormPasswordLoading] = React.useState(false);

  const handleClickSubmit = React.useCallback(() => {
    setFormPasswordLoading(true);
    request("POST/auth/init", {
      language: context.setting.meta.language,
      password: formPasswordText
    })
      .then((data) => {
        setFirstTick(true);
        setPublicFolders(data.public);
        setPrivateFolders(data.private);
        setClipboard(data.clipboard);
        setSetting(data.setting);
        setMetadata(data.metadata);
        setGlobalSwitch(globalState.AUTHORITY);

        if (data.saltWarning) {
          toast.error(
            languagePickerSpawner(data.setting.meta.language)("modal.toast.warning.saltMissing")
              .format(data.metadata.appdata),
            { duration: Infinity }
          );
        }

        setModalInitOpen(false);
        toast.success(context.languagePicker("modal.toast.success.init"));
      })
      .finally(() => setFormPasswordLoading(false));
  }, [
    context,
    formPasswordText,
    setGlobalSwitch,
    setModalInitOpen,
    setFirstTick,
    setPublicFolders,
    setPrivateFolders,
    setClipboard,
    setSetting,
    setMetadata
  ]);

  return (
    <Modal
      open={modalInitOpen}
      sx={{
        userSelect: "none",
        "& ::selection": {
          background: "var(--joy-palette-neutral-softActiveBg)"
        }
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
        sx={{ minWidth: "min(480px, calc(100vw - 2.5rem))" }}
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
              value={context.setting.meta.language}
              startDecorator={<LanguageOutlinedIcon />}
              onChange={(_, newValue) => setSetting((setting) => ({
                ...setting,
                meta: {
                  ...setting.meta,
                  language: newValue
                }
              }))}
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
              <SemiInput
                initValue={formPasswordText}
                setValue={setFormPasswordText}
                autoFocus
                autoComplete="new-password"
                slotProps={{ input: { type: formPasswordType } }}
                placeholder={context.languagePicker("modal.init.password.placeholder")}
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
                handleEnter={() => buttonRef.current?.click()}
              />
            </FormControl>
          </form>
          <Button
            ref={buttonRef}
            loading={formPasswordLoading}
            disabled={formPasswordText.length === 0}
            onClick={handleClickSubmit}
          >
            {context.languagePicker("universal.button.submit")}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
