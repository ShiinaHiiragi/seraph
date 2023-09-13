import React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import { styled, CssVarsProvider } from "@mui/joy/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SideDrawer from "./components/SideDrawer";
import Init from "./modal/Init";

import Welcome from "./main/Welcome";
import FileExplorer from "./main/FileExplorer"
import Archive from "./main/Archive";
import Links from "./main/Links";
import Milkdown from "./main/Milkdown";
import Subscription from "./main/Subscription";
import TODO from "./main/TODO";
import Error from "./main/Error";

import { languagePickerSpawner } from "./interface/languagePicker";
import GlobalTheme from "./interface/theme";
import GlobalContext, {
  ConstantContext,
  globalState,
  defaultSetting,
  Status,
  request,
  toastTheme,
  formatter
} from "./interface/constants";

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
  // independent components
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modalInitOpen, setModalInitOpen] = React.useState(false);

  // global states
  const [globalSwitch, setGlobalSwitch] = React.useState(globalState.INNOCENT);
  const [setting, setSetting] = React.useState(defaultSetting);
  const [publicFolders, setPublicFolders] = React.useState([ ]);
  const [privateFolders, setPrivateFolders] = React.useState([ ]);

  // language related
  const languagePicker = React.useMemo(() => {
    ConstantContext.languagePicker = languagePickerSpawner(setting.meta.language);
    return languagePickerSpawner(setting.meta.language);
  }, [setting.meta.language]);

  // init the whole page; only load once
  React.useEffect(() => {
    request("GET/auth/meta")
      .then((data) => {
        setSetting(data.setting);
        setPublicFolders(formatter.folderFormatter(data.public));

        if (data.private) {
          setPrivateFolders(formatter.folderFormatter(data.private));
          setGlobalSwitch(globalState.AUTHORITY);
        } else {
          setGlobalSwitch(globalState.ANONYMOUS);
        }
      })
      .catch((data) => {
        if (data.statusCode === Status.statusCode.AuthFailed
          && data.errorCode === Status.authErrCode.NotInit) {
          setModalInitOpen(true);
        } else {
          request.unparseableResponse(data);
        }
      })
  }, [ ])

  return (
    <GlobalContext.Provider
      value={{
        languagePicker: languagePicker,
        globalSwitch: globalSwitch
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
              setGlobalSwitch={setGlobalSwitch}
              setPrivateFolders={setPrivateFolders}
            />
          </HeaderField>
          <ContentField className="ContentField">
            <BrowserRouter>
              {drawerOpen && (
                <SideDrawer onClose={() => setDrawerOpen(false)}>
                  <Navigation
                    publicFolders={publicFolders}
                    privateFolders={privateFolders}
                    setDrawerOpen={setDrawerOpen}
                  />
                </SideDrawer>
              )}
              <NavigationField className="NavigationField">
                <Navigation
                  publicFolders={publicFolders}
                  privateFolders={privateFolders}
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
          <Init
            setGlobalSwitch={setGlobalSwitch}
            setting={setting}
            setSetting={setSetting}
            modalInitOpen={modalInitOpen}
            setModalInitOpen={setModalInitOpen}
          />
          <Toaster position="top-center" richColors closeButton />
        </CssVarsProvider>
      </Root>
    </GlobalContext.Provider>
  );
}

export default Panel;
