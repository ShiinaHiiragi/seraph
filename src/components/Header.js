import React from "react";
import { toast } from "sonner";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography"
import Input from "@mui/joy/Input";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, useNavigate } from "react-router-dom";
import GreyLogo from "../logo-grey.svg";
import GlobalContext, {
  globalState,
  request,
  Status,
  defaultSetting,
  settingField,
  OnMounted
} from "../interface/constants";
import { languagePickerSpawner } from "../interface/languagePicker";
import SemiInput from "../interface/SemiInput";
import ModalForm from "../modal/Form";

const Config = React.lazy(() => import("../modal/Config"));

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
    setPublicFolders,
    setPrivateFolders,
    setMetadata,
    setClipboard,
    setSetting,
    setSettingPair
  } = props;
  const context = React.useContext(GlobalContext);
  const navigate = useNavigate();

  // state for config
  const [modalConfigOpen, setModalConfigOpen] = React.useState(false);
  const [modalConfigLoading, setModalConfigLoading] = React.useState(false);

  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(settingField.general);
  const [resetButtonLoading, setResetButtonLoading] = React.useState(false);

  const handleToggleConfig = React.useCallback(() => {
    context.crepeRef.snapshot.current = context.crepeRef.getText();
    setModalConfigLoading(true);
    setModalConfigOpen(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseConfig = React.useCallback(() => {
    setModalConfigOpen(false);
    setMobileNavOpen(false);
    setActiveSection(settingField.general);
  }, []);

  const handleApplySetting = React.useCallback((key, value) => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/config/set", { key: key, value: value })
        .then(() => {
          setSettingPair(key, value)
          resolve()
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: () => (
        key === "meta.language"
          ? languagePickerSpawner(value)
          : context.languagePicker
        )("modal.toast.success.setting"),
      error: (data) => data
    })
  }, [context, setSettingPair]);

  const handleResetSetting = React.useCallback(() => {
    setResetButtonLoading(true)
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/config/reset",
        undefined,
        { "": () => setResetButtonLoading(false) },
        reject
      )
        .then(() => {
          setResetButtonLoading(false)
          setSetting(defaultSetting)
          resolve()
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: () => languagePickerSpawner(defaultSetting.meta.language)("modal.toast.success.setting"),
      error: (data) => data
    })
  }, [context, setSetting])

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
        setPublicFolders(data.public);
        setPrivateFolders(data.private);
        setClipboard(data.clipboard);
        setGlobalSwitch(globalState.AUTHORITY);
        handleCloseLogin();
        toast(context.languagePicker("modal.toast.plain.login"));
      })
      .finally(() => setButtonLoading(false));
  }, [
    context,
    setGlobalSwitch,
    setPublicFolders,
    setPrivateFolders,
    setClipboard,
    formPasswordText,
    handleCloseLogin
  ]);

  // function for logout
  const handleLogout = React.useCallback(() => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/auth/logout", undefined, undefined, reject)
        .then(() => {
          setPublicFolders((publicFolders) => 
            publicFolders.filter((folder) => folder[0] !== ".")
          )
          setGlobalSwitch(globalState.ANONYMOUS);
          resolve();
          navigate("/");
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context.languagePicker("modal.toast.success.logout"),
      error: (data) => data
    })
  }, [context, setGlobalSwitch, setPublicFolders, navigate])

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
        <Link to="/">
          <IconButton
            disabled
            sx={{ display: { xs: "none", sm: "none", md: "inline-flex" } }}
          >
            <img src={GreyLogo} width={24} height={24} alt=""/>
          </IconButton>
        </Link>
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
            loading={modalConfigLoading}
            onClick={handleToggleConfig}
          >
            <SettingsOutlinedIcon />
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
      {modalConfigOpen && (
        <React.Suspense fallback={null}>
          <OnMounted onLoad={() => setModalConfigLoading(false)} />
          <Config
            open={modalConfigOpen}
            handleClose={handleCloseConfig}
            handleApplySetting={handleApplySetting}
            handleResetSetting={handleResetSetting}
            mobileNavOpen={mobileNavOpen}
            setMetadata={setMetadata}
            setMobileNavOpen={setMobileNavOpen}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            resetButtonLoading={resetButtonLoading}
          />
        </React.Suspense>
      )}
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
          <SemiInput
            initValue={formPasswordText}
            setValue={setFormPasswordText}
            autoFocus
            placeholder={context.languagePicker("modal.form.login.placeholder")}
            error={formPasswordError}
            autoComplete="current-password"
            slotProps={{ input: { type: "password" } }}
          />
        </form>
      </ModalForm>
    </HeaderLayout>
  );
}

export default Header;
