import React from "react";
import CssBaseline from "@mui/joy/CssBaseline";
import GlobalStyles from "@mui/joy/GlobalStyles";
import { styled, CssVarsProvider } from "@mui/joy/styles";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster, toast } from "sonner";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SideDrawer from "./components/SideDrawer";

import Init from "./modal/Init";
import Reconfirm from "./modal/Reconfirm";

import { languagePickerSpawner } from "./interface/languagePicker";
import GlobalTheme from "./interface/theme";
import GlobalContext, {
  ConstantContext,
  globalState,
  defaultMetadata,
  defaultClipboard,
  defaultSetting,
  setValue,
  request,
  toastTheme
} from "./interface/constants";

import Loading from "./main/Loading";
import Error from "./main/Error";

const Welcome = React.lazy(() => import("./main/Welcome"));
const FileExplorer = React.lazy(() => import("./main/FileExplorer"));
const Milkdown = React.lazy(() => import("./main/Milkdown"));
const Subscription = React.lazy(() => import("./main/Subscription"));
const Terminal = React.lazy(() => import("./main/Terminal"));
const TODO = React.lazy(() => import("./main/TODO"));

const RouterBridgeContext = React.createContext(null);

const Root = styled('div')(({ theme }) => ({
  width: "100vw",
  height: "100dvh",
  display: "flex",
  flexDirection: "column",
  userSelect: "none",
  "& ::selection": {
    background: "var(--joy-palette-neutral-softActiveBg)"
  },
  "& ::-webkit-scrollbar": {
    width: "6px",
    height: "6px"
  },
  "& ::-webkit-scrollbar-track": {
    borderRadius: 0,
    backgroundColor: "var(--joy-palette-background-body)"
  },
  "& ::-webkit-scrollbar-thumb": {
    borderRadius: 0,
    backgroundColor: "var(--joy-palette-scrollbarThumb)"
  },
  "& html": {
    userSelect: "none",
    scrollbarColor: "var(--joy-palette-scrollbarThumb) var(--joy-palette-background-body)"
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

const PublicExplorer = () => {
  const {
    clipboard,
    setClipboard,
    setPublicFolders,
    setPrivateFolders
  } = React.useContext(RouterBridgeContext);

  return (
    <FileExplorer
      type="public"
      clipboard={clipboard}
      setClipboard={setClipboard}
      setPublicFolders={setPublicFolders}
      setPrivateFolders={setPrivateFolders}
    />
  );
}

const PrivateExplorer = () => {
  const {
    clipboard,
    setClipboard,
    setPublicFolders,
    setPrivateFolders
  } = React.useContext(RouterBridgeContext);

  return (
    <FileExplorer
      type="private"
      clipboard={clipboard}
      setClipboard={setClipboard}
      setPublicFolders={setPublicFolders}
      setPrivateFolders={setPrivateFolders}
    />
  );
}

const PanelLayout = () => {
  const {
    setting
  } = React.useContext(GlobalContext);

  const {
    modalInitOpen,
    modalReconfirm,
    setModalReconfirm,
    setModalInitOpen,
    setGlobalSwitch,
    setClipboard,
    setMetadata,
    setSetting,
    setSettingPair,
    setPublicFolders,
    setPrivateFolders,
    setFirstTick
  } = React.useContext(RouterBridgeContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <React.Fragment>
      <GlobalStyles styles={toastTheme} />
      <Root className="Root">
        <CssVarsProvider
          disableTransitionOnChange
          theme={GlobalTheme(setting.meta.language)}
        >
          <CssBaseline />
          <HeaderField className="HeaderField">
            <Header
              setGlobalSwitch={setGlobalSwitch}
              setDrawerOpen={setDrawerOpen}
              setPublicFolders={setPublicFolders}
              setPrivateFolders={setPrivateFolders}
              setMetadata={setMetadata}
              setClipboard={setClipboard}
              setSetting={setSetting}
              setSettingPair={setSettingPair}
            />
          </HeaderField>
          {drawerOpen && (
            <SideDrawer onClose={() => setDrawerOpen(false)}>
              <Navigation setDrawerOpen={setDrawerOpen} />
            </SideDrawer>
          )}
          <ContentField className="ContentField">
            <NavigationField className="NavigationField">
              <Navigation setDrawerOpen={setDrawerOpen} />
            </NavigationField>
            <MainField className="MainField">
              <React.Suspense fallback={<Loading />}>
                <Outlet />
              </React.Suspense>
            </MainField>
          </ContentField>
          <Init
            setFirstTick={setFirstTick}
            setGlobalSwitch={setGlobalSwitch}
            setClipboard={setClipboard}
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
    </React.Fragment>
  );
};

const Panel = () => {
  // data router
  // refactored from browser router
  const routerRef = React.useRef(null);
  if (!routerRef.current) {
    routerRef.current = createBrowserRouter([{
      path: "/",
      element: <PanelLayout />,
      children: [
        { index: true, element: <Welcome /> },
        { path: "public/*", element: <PublicExplorer /> },
        { path: "private/*", element: <PrivateExplorer /> },
        { path: "crepe/*", element: <Milkdown /> },
        { path: "subscription", element: <Subscription /> },
        { path: "terminal", element: <Terminal /> },
        { path: "todo", element: <TODO /> },
        { path: "*", element: <Error /> },
      ],
    }]);
  }

  // independent components
  const [modalInitOpen, setModalInitOpen] = React.useState(false);
  const [modalReconfirm, setModalReconfirm] = React.useState({
    open: false,
    captionFirstHalf: "",
    handleAction: () => { }
  });

  // global states
  const [globalSwitch, setGlobalSwitch] = React.useState(globalState.INNOCENT);
  const [clipboard, setClipboard] = React.useState(defaultClipboard);
  const [metadata, setMetadata] = React.useState(defaultMetadata);
  const [setting, setSetting] = React.useState(defaultSetting);
  const setSettingPair = React.useCallback((key, value) => {
    setSetting((setting) => setValue(setting, key, value))
  }, []);

  const [publicFolders, setPublicFolders] = React.useState([]);
  const [privateFolders, setPrivateFolders] = React.useState([]);
  const sortedPublicFolders = React.useMemo(() => publicFolders.sortBy(), [publicFolders]);
  const sortedPrivateFolders = React.useMemo(() => privateFolders.sortBy(), [privateFolders]);

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

  // first tick starts on page loaded, ends after receiving metadata
  React.useEffect(() => {
    request("GET/auth/meta", undefined, undefined, undefined, setModalInitOpen)
      .then((data) => {
        setSetting(data.setting);
        setPublicFolders(data.public);
        setFirstTick(true);

        if (data.private) {
          setPrivateFolders(data.private);
          setMetadata(data.metadata);
          setClipboard(data.clipboard);
          setGlobalSwitch(globalState.AUTHORITY);
          if (data.saltWarning) {
            toast.error(
              languagePickerSpawner(data.setting.meta.language)("modal.toast.warning.saltMissing")
                .format(data.metadata.appdata),
              { duration: Infinity }
            );
          }
        } else {
          setGlobalSwitch(globalState.ANONYMOUS);
        }
      })
  }, []);

  // second tick starts after first tick is set, ends after globalSwitch is set
  React.useEffect(() => {
    if (firstTick && globalSwitch !== globalState.INNOCENT) {
      setSecondTick(true);
    }
  }, [firstTick, globalSwitch]);

  // hide some elements
  const isAuthority = React.useMemo(() => {
    return globalSwitch === globalState.AUTHORITY
  }, [globalSwitch]);

  // crepeEditor.current !== null when crepe is loaded
  // crepeSnapshot save current text every time setting is toggled
  // and act as init value for re-construction when setting changed
  const crepeEditor = React.useRef(null);
  const crepeUtils = React.useRef(null);
  const crepeSnapshot = React.useRef(null);
  const crepeSelect = React.useRef(null);

  const switchAction = React.useCallback((actionName) => (...args) => {
    if (crepeEditor.current?.status === "Created") {
      const handleAction = crepeUtils.current[actionName];
      const result = crepeEditor.current.action(handleAction(...args));
      return result === undefined ? true : result;
    } else {
      return false;
    }
  }, []);

  const crepeRef = React.useMemo(() => ({
    editor: crepeEditor,
    utils: crepeUtils,
    snapshot: crepeSnapshot,
    select: crepeSelect,
    load: (editor, utils) => {
      crepeEditor.current = editor;
      crepeUtils.current = utils;
    },
    unload: () => {
      crepeEditor.current = null;
      crepeUtils.current = null;
    },
    isLoaded: () => crepeEditor.current !== null,
    isCreated: () => crepeEditor.current?.status === "Created",
    getText: switchAction("getMarkdown"),
    setText: switchAction("replaceAll"),
    getSelect: switchAction("actionCaret"),
    setSelect: switchAction("actionFocus"),
    setReadOnly: (readOnly) => crepeUtils.current?.setReadOnly(readOnly)
  }), [switchAction]);

  return (
    <GlobalContext.Provider
      value={{
        isAuthority: isAuthority,
        firstTick: firstTick,
        secondTick: secondTick,
        crepeRef: crepeRef,
        metadata: metadata,
        setting: setting,
        modalReconfirm: modalReconfirm,
        sortedPublicFolders: sortedPublicFolders,
        sortedPrivateFolders: sortedPrivateFolders,
        languagePicker: languagePicker,
        setModalReconfirm: setModalReconfirm
      }}
    >
      <RouterBridgeContext.Provider
        value={{
          modalInitOpen: modalInitOpen,
          modalReconfirm: modalReconfirm,
          clipboard: clipboard,
          setModalReconfirm: setModalReconfirm,
          setModalInitOpen: setModalInitOpen,
          setGlobalSwitch: setGlobalSwitch,
          setClipboard: setClipboard,
          setMetadata: setMetadata,
          setSetting: setSetting,
          setSettingPair: setSettingPair,
          setPublicFolders: setPublicFolders,
          setPrivateFolders: setPrivateFolders,
          setFirstTick: setFirstTick
        }}
      >
        <RouterProvider router={routerRef.current} />
      </RouterBridgeContext.Provider>
    </GlobalContext.Provider>
  );
};

export default Panel;
