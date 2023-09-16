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
import Links from "./main/Links";
import Milkdown from "./main/Milkdown";
import Subscription from "./main/Subscription";
import Terminal from "./main/Terminal";
import TODO from "./main/TODO";
import Error from "./main/Error";

import Init from "./modal/Init";
import Reconfirm from "./modal/Reconfirm";

import { languagePickerSpawner } from "./interface/languagePicker";
import GlobalTheme from "./interface/theme";
import GlobalContext, {
  ConstantContext,
  globalState,
  defaultSetting,
  request,
  toastTheme
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
  },
  "& html": {
    userSelect: "none",
    scrollbarColor: "rgb(190, 190, 190) rgb(250, 250, 250)"
  }
}));

const HeaderField = styled('div')(({ theme }) => ({
  width: "100%",
  minHeight: { xs: "65px", sm: "65px", md: "73px" }
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
  const [modalReconfirm, setModalReconfirm] = React.useState({
    open: false,
    captionFirstHalf: "",
    handleAction: () => { }
  });

  // global states
  const [globalSwitch, setGlobalSwitch] = React.useState(globalState.INNOCENT);
  const [setting, setSetting] = React.useState(defaultSetting);
  const [publicFolders, setPublicFolders] = React.useState([]);
  const [privateFolders, setPrivateFolders] = React.useState([]);
  const sortedPublicFolders = React.useMemo(() => publicFolders.sortBy(), [publicFolders]);
  const sortedPrivateFolders = React.useMemo(() => privateFolders.sortBy(), [privateFolders]);
  const folderCount = React.useMemo(() => {
    return sortedPublicFolders.length + sortedPrivateFolders.length;
  }, [sortedPublicFolders, sortedPrivateFolders]);

  // global clocks, explicit life cycles, only set once
  // when set to true, the corresponding tick ends
  const [firstTick, setFirstTick] = React.useState(false);
  const [secondTick, setSecondTick] = React.useState(false);

  // language related
  const languagePicker = React.useMemo(() => {
    ConstantContext.languagePicker = languagePickerSpawner(setting.meta.language);
    document.title = ConstantContext.languagePicker("nav.title");
    document.documentElement.lang = setting.meta.language
    return languagePickerSpawner(setting.meta.language);
  }, [setting.meta.language]);

  // first tick starts on page loaded
  //            ends after receiving metadata
  React.useEffect(() => {
    request("GET/auth/meta", undefined, undefined, setModalInitOpen)
      .then((data) => {
        setSetting(data.setting);
        setPublicFolders(data.public);
        setFirstTick(true);

        if (data.private) {
          setPrivateFolders(data.private);
          setGlobalSwitch(globalState.AUTHORITY);
        } else {
          setGlobalSwitch(globalState.ANONYMOUS);
        }
      })
  }, [])

  // second tick starts after first tick is set
  //             ends after globalSwitch is set
  React.useEffect(() => {
    if (firstTick && globalSwitch !== globalState.INNOCENT) {
      setSecondTick(true);
    }
  }, [firstTick, globalSwitch]);

  // hide some elements
  const isAuthority = React.useMemo(() => {
    return globalSwitch === globalState.AUTHORITY
  }, [globalSwitch]);

  const setSettingPair = React.useCallback((key, value) => {
    const [item, subItem] = key.split(".");
    setSetting((setting) => ({
      ...setting,
      [item]: {
        ...setting["item"],
        [subItem]: value
      }
    }));
  }, [ ]);

  return (
    <GlobalContext.Provider
      value={{
        languagePicker: languagePicker,
        setModalReconfirm: setModalReconfirm,
        globalSwitch: globalSwitch,
        isAuthority: isAuthority,
        firstTick: firstTick,
        secondTick: secondTick,
        sortedPublicFolders: sortedPublicFolders,
        sortedPrivateFolders: sortedPrivateFolders
      }}
    >
      <GlobalStyles styles={toastTheme} />
      <Root className="Root">
        <CssVarsProvider
          disableTransitionOnChange
          theme={GlobalTheme}
        >
          <CssBaseline />
          <BrowserRouter>
            <HeaderField className="HeaderField">
              <Header
                setGlobalSwitch={setGlobalSwitch}
                setDrawerOpen={setDrawerOpen}
                setPrivateFolders={setPrivateFolders}
                setSettingPair={setSettingPair}
              />
            </HeaderField>
            {drawerOpen && (
              <SideDrawer onClose={() => setDrawerOpen(false)}>
                <Navigation
                  sortedPublicFolders={sortedPublicFolders}
                  sortedPrivateFolders={sortedPrivateFolders}
                  setDrawerOpen={setDrawerOpen}
                />
              </SideDrawer>
            )}
            <ContentField className="ContentField">
              <NavigationField className="NavigationField">
                <Navigation
                  sortedPublicFolders={sortedPublicFolders}
                  sortedPrivateFolders={sortedPrivateFolders}
                  setDrawerOpen={setDrawerOpen}
                />
              </NavigationField>
              <MainField className="MainField">
                <Routes>
                  <Route exact path="/" element={<Welcome />} />
                  <Route
                    path="/public/:folderName"
                    element={<FileExplorer folderCount={folderCount} type="public" />}
                  />
                  <Route
                    path="/private/:folderName"
                    element={<FileExplorer folderCount={folderCount} type="private" />}
                  />
                  <Route path="/links" element={<Links />} />
                  <Route path="/milkdown" element={<Milkdown />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/terminal" element={<Terminal />} />
                  <Route path="/todo" element={<TODO />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              </MainField>
            </ContentField>
          </BrowserRouter>
          <Init
            setFirstTick={setFirstTick}
            setGlobalSwitch={setGlobalSwitch}
            setting={setting}
            setSetting={setSetting}
            setPublicFolders={setPublicFolders}
            setPrivateFolders={setPrivateFolders}
            modalInitOpen={modalInitOpen}
            setModalInitOpen={setModalInitOpen}
          />
          <Reconfirm
            modalReconfirm={modalReconfirm}
            setModalReconfirm={setModalReconfirm}
          />
          <Toaster position="top-center" richColors closeButton />
        </CssVarsProvider>
      </Root>
    </GlobalContext.Provider>
  );
}

export default Panel;
