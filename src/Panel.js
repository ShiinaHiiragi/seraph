import React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import { styled, CssVarsProvider } from "@mui/joy/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SideDrawer from "./components/SideDrawer";
import Welcome from "./main/Welcome";
import FileExplorer from "./main/FileExplorer"
import Archive from "./main/Archive";
import Links from "./main/Links";
import Milkdown from "./main/Milkdown";
import Subscription from "./main/Subscription";
import TODO from "./main/TODO";
import Error from "./main/Error";
import GlobalContext from "./interface/constants";
import GlobalTheme from "./interface/theme";
import { defaultLanguage, languagePickerSpawner } from "./interface/languagePicker";
import { ConstantContext, Status, toastTheme, request } from "./interface/constants";
import ModalForm from "./modal/Init";

const Root = styled('div')(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  userSelect: "none",
  "& ::selection": {
    background: "rgb(173, 214, 255)"
  },
  "& ::-webkit-scrollbar": {
    width: "6px",
    height: "6px"
  },
  "& ::-webkit-scrollbar-track": {
    borderRadius: 0,
    backgroundColor: "rgb(250, 250, 250)"
  },
  "& ::-webkit-scrollbar-thumb": {
    borderRadius: 0,
    backgroundColor: "rgb(190, 190, 190)"
  }
}));

const HeaderField = styled('div')(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    minHeight: "65px",
  },
  [theme.breakpoints.up("md")]: {
    minHeight: "73px",
  }
}));

const ContentField = styled('div')(({ theme }) => ({
  width: "100%",
  flexGrow: 1,
  display: "flex",
  flexDirection: "row",
  overflowY: "hidden",
  overflowX: "hidden",
}));

const NavigationField = styled('div')(({ theme }) => ({
  width: "225px",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.surface,
  borderRight: "1px solid",
  borderColor: theme.palette.divider,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  [theme.breakpoints.only("md")]: {
    minWidth: "28.5%",
  },
  [theme.breakpoints.up("lg")]: {
    minWidth: "285px",
  },
  overflowY: "auto",
  overflowX: "auto",
}));

const MainField = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflowY: "hidden",
  overflowX: "hidden",
}));

const Panel = () => {
  const [language, setLanguage] = React.useState("ja" || defaultLanguage);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modalInitOpen, setModalInitOpen] = React.useState(false);

  const languagePicker = React.useMemo(() => {
    ConstantContext.languagePicker = languagePickerSpawner(language);
    return languagePickerSpawner(language);
  }, [language]);

  React.useEffect(() => {
    request("GET/auth/meta")
      .then((data) => {
        if (data.statusCode === Status.statusCode.AuthFailed
          && data.errorCode === Status.authErrCode.NotInit) {
          setModalInitOpen(true);
        }
      })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        languagePicker: languagePicker
      }}
    >
      <GlobalStyles styles={toastTheme} />
      <Root className="Root">
        <CssVarsProvider
          disableTransitionOnChange
          theme={GlobalTheme}
        >
          <CssBaseline />
          <HeaderField className="HeaderField">
            <Header
              setDrawerOpen={setDrawerOpen}
            />
          </HeaderField>
          <ContentField className="ContentField">
            <BrowserRouter>
              {drawerOpen && (
                <SideDrawer onClose={() => setDrawerOpen(false)}>
                  <Navigation
                    setDrawerOpen={setDrawerOpen}
                  />
                </SideDrawer>
              )}
              <NavigationField className="NavigationField">
                <Navigation
                  setDrawerOpen={setDrawerOpen}
                />
              </NavigationField>
              <MainField className="MainField">
                <Routes>
                  <Route exact path="/" element={<Welcome />} />
                  <Route path="/public/:folderName" element={<FileExplorer type="public" />} />
                  <Route path="/private/:folderName" element={<FileExplorer type="private" />} />
                  <Route path="/archive" element={<Archive />} />
                  <Route path="/links" element={<Links />} />
                  <Route path="/milkdown" element={<Milkdown />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/todo" element={<TODO />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              </MainField>
            </BrowserRouter>
          </ContentField>
          <ModalForm
            language={language}
            setLanguage={setLanguage}
            modalInitOpen={modalInitOpen}
          />
          <Toaster position="top-center" richColors closeButton />
        </CssVarsProvider>
      </Root>
    </GlobalContext.Provider>
  );
}

export default Panel;
