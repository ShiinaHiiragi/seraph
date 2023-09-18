import React from "react";
import { toast } from "sonner";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography"
import Input from "@mui/joy/Input";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import GreyLogo from "../logo-grey.svg";
import GlobalContext, { globalState, request, Status } from "../interface/constants";
import ModalForm from "../modal/Form";

const HeaderLayout = (props) => {
  return (
    <Box
      component="header"
      className="Header"
      {...props}
      sx={[
        {
          p: 2,
          gap: 2,
          bgcolor: "background.surface",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gridColumn: "1 / -1",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}

const Header = (props) => {
  const {
    setGlobalSwitch,
    setDrawerOpen,
    setPrivateFolders,
    setSettingPair
  } = props;
  const context = React.useContext(GlobalContext);
  const navigate = useNavigate();

  // function and states for login
  const [modalLoginOpen, setModalLoginOpen] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [formPasswordError, setFormPasswordError] = React.useState(false);
  const [formPasswordText, setFormPasswordText] = React.useState("");

  const handleCloseLogin = React.useCallback(() => {
    setModalLoginOpen(false);
    setButtonLoading(false);
    setFormPasswordError(false);
    setFormPasswordText("");
  }, [
    setModalLoginOpen,
    setButtonLoading,
    setFormPasswordError,
    setFormPasswordText
  ]);

  const handleLogin = React.useCallback(() => {
    setButtonLoading(true);
    request(
      "POST/auth/login",
      { password: formPasswordText },
      {
        "": () => setButtonLoading(false),
        [Status.execErrCode.IncorrectPassword]: () => setFormPasswordError(true)
      }
    )
      .then((data) => {
        setPrivateFolders(data.private);
        setGlobalSwitch(globalState.AUTHORITY);
        handleCloseLogin();
        toast(context.languagePicker("modal.toast.plain.login"));
      })
      .finally(() => setButtonLoading(false));
  }, [
    context,
    setGlobalSwitch,
    setPrivateFolders,
    formPasswordText,
    handleCloseLogin
  ]);

  // function for logout
  const handleLogout = React.useCallback(() => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/auth/logout", undefined, undefined, reject)
        .then(() => {
          setGlobalSwitch(globalState.ANONYMOUS);
          resolve();
          navigate("/");
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context.languagePicker("modal.toast.success.logout"),
      error: (data) => data
    })
  }, [context, setGlobalSwitch, navigate])

  return (
    <HeaderLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <IconButton
          variant="outlined"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          disabled
          sx={{ display: { xs: "none", sm: "none", md: "inline-flex" } }}
        >
          <img src={GreyLogo} width={24} height={24} alt=""/>
        </IconButton>
        <Typography component="h1" fontWeight="lg" sx={{ letterSpacing: "0.06em" }}>
          {context.languagePicker("nav.title")}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
        {context.isAuthority &&
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => {
              switch (document.documentElement.lang) {
                case "en":
                  setSettingPair("meta.language", "zh-Hans");
                  break;
                case "zh-Hans":
                  setSettingPair("meta.language", "ja");
                  break;
                case "ja":
                  setSettingPair("meta.language", "en");
                  break;
                default:
                  setSettingPair("meta.language", "en");
              }
            }}
          >
            <LanguageOutlinedIcon />
          </IconButton>}
        {context.isAuthority
          ? <IconButton
            size="sm"
            variant="outlined"
            color="danger"
            onClick={() => context.setModalReconfirm({
              open: true,
              captionFirstHalf: context.languagePicker("modal.reconfirm.captionFirstHalf.logout"),
              handleAction: handleLogout
            })}
          >
            <LogoutOutlinedIcon />
          </IconButton>
          : <IconButton
            id="loginButton"
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setModalLoginOpen(true)}
          >
            <LoginOutlinedIcon />
          </IconButton>
        }
      </Box>
      <ModalForm
        open={modalLoginOpen}
        loading={buttonLoading}
        disabled={formPasswordText.length === 0}
        handleClose={handleCloseLogin}
        handleClick={handleLogin}
        title={context.languagePicker("modal.form.login.title")}
        caption={context.languagePicker("modal.form.login.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <form>
          <Input type="text" autoComplete="username" sx={{ display: "none" }} />
          <Input
            autoFocus
            placeholder={context.languagePicker("modal.form.login.placeholder")}
            value={formPasswordText}
            error={formPasswordError}
            autoComplete="current-password"
            onChange={(event) => setFormPasswordText(event.target.value)}
            slotProps={{ input: { type: "password" } }}
          />
        </form>
      </ModalForm>
    </HeaderLayout>
  );
}

export default Header;
