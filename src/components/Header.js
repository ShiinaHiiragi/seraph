import React from "react";
import { toast } from "sonner";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography"
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import GreyLogo from "../logo-grey.svg";
import GlobalContext, { globalState, request } from "../interface/constants";
import Login from "../modal/Login";

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
    setDrawerOpen,
    setGlobalSwitch,
    setPrivateFolders
  } = props;
  const context = React.useContext(GlobalContext);
  const navigate = useNavigate();

  const isAuthority = context.globalSwitch === globalState.AUTHORITY;
  const [modalLoginOpen, setModalLoginOpen] = React.useState(false);
  const handleLogout = React.useCallback(() => {
    request("POST/auth/logout")
      .then((data) => {
        toast.success(context.languagePicker("modal.toast.success.logout"));
        setGlobalSwitch(globalState.ANONYMOUS);
        navigate("/");
      })
      .catch(request.unparseableResponse)
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
        {isAuthority &&
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
          >
            <SettingsOutlinedIcon />
          </IconButton>}
        {isAuthority
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
      <Login
        modalLoginOpen={modalLoginOpen}
        setModalLoginOpen={setModalLoginOpen}
        setGlobalSwitch={setGlobalSwitch}
        setPrivateFolders={setPrivateFolders}
      />
    </HeaderLayout>
  );
}

export default Header;
