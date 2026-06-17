/**
 * Approach 2: Keep GlobalContext shape unchanged.
 * Add a minimal RouterBridgeContext for state that route components need.
 * Router is created once inside Panel via useRef.
 *
 * Trade-off: GlobalContext stays narrow (no setter sprawl), but a second
 * context is introduced and the router object lives inside the component
 * (though it is still stable — useRef prevents re-creation).
 */

import React from "react";
import CssBaseline from "@mui/joy/CssBaseline";
import GlobalStyles from "@mui/joy/GlobalStyles";
import { styled, CssVarsProvider } from "@mui/joy/styles";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

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

const Root = styled('div')(({ theme }) => ({
  width: "100vw",
  height: "100dvh",
  display: "flex",
  flexDirection: "column",
  userSelect: "none",
  "& ::selection": { background: "var(--joy-palette-neutral-softActiveBg)" },
  "& ::-webkit-scrollbar": { width: "6px", height: "6px" },
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
  [theme.breakpoints.down("md")]: { display: "none" },
  [theme.breakpoints.only("md")]: { minWidth: "28.5%" },
  [theme.breakpoints.up("lg")]: { minWidth: "285px" },
  overflowY: "auto",
  overflowX: "auto",
}));

const MainField = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflowY: "hidden",
  overflowX: "hidden",
}));

// ── Bridge context ────────────────────────────────────────────────────────────
// Carries the "prop-drilled" state (clipboard, setters, modal state) into the
// router tree without widening GlobalContext.
// In production, wrap the value in useMemo to avoid spurious re-renders.

const RouterBridgeContext = React.createContext(null);

// ── Route wrappers ────────────────────────────────────────────────────────────
// These maintain the existing prop-passing contract with FileExplorer,
// sourcing the values from RouterBridgeContext instead of a parent component.

function PublicExplorer() {
  const { clipboard, setClipboard, setPublicFolders, setPrivateFolders } =
    React.useContext(RouterBridgeContext);
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

function PrivateExplorer() {
  const { clipboard, setClipboard, setPublicFolders, setPrivateFolders } =
    React.useContext(RouterBridgeContext);
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

// ── Layout route ──────────────────────────────────────────────────────────────
// Reads immutable/derived data from GlobalContext and mutable setters from
// RouterBridgeContext — same prop signatures as the original Panel JSX.

function PanelLayout() {
  const ctx = React.useContext(GlobalContext);
  const bridge = React.useContext(RouterBridgeContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <GlobalStyles styles={toastTheme} />
      <Root className="Root">
        <CssVarsProvider
          disableTransitionOnChange
          theme={GlobalTheme(ctx.setting.meta.language)}
        >
          <CssBaseline />
          <HeaderField className="HeaderField">
            <Header
              setGlobalSwitch={bridge.setGlobalSwitch}
              setDrawerOpen={setDrawerOpen}
              setPublicFolders={bridge.setPublicFolders}
              setPrivateFolders={bridge.setPrivateFolders}
              setMetadata={bridge.setMetadata}
              setClipboard={bridge.setClipboard}
              setSetting={bridge.setSetting}
              setSettingPair={bridge.setSettingPair}
            />
          </HeaderField>
          {drawerOpen && (
            <SideDrawer onClose={() => setDrawerOpen(false)}>
              <Navigation
                sortedPublicFolders={ctx.sortedPublicFolders}
                sortedPrivateFolders={ctx.sortedPrivateFolders}
                setDrawerOpen={setDrawerOpen}
              />
            </SideDrawer>
          )}
          <ContentField className="ContentField">
            <NavigationField className="NavigationField">
              <Navigation
                sortedPublicFolders={ctx.sortedPublicFolders}
                sortedPrivateFolders={ctx.sortedPrivateFolders}
                setDrawerOpen={setDrawerOpen}
              />
            </NavigationField>
            <MainField className="MainField">
              <React.Suspense fallback={<Loading />}>
                <Outlet />
              </React.Suspense>
            </MainField>
          </ContentField>
          <Init
            setFirstTick={bridge.setFirstTick}
            setGlobalSwitch={bridge.setGlobalSwitch}
            setting={ctx.setting}
            setClipboard={bridge.setClipboard}
            setSetting={bridge.setSetting}
            setPublicFolders={bridge.setPublicFolders}
            setPrivateFolders={bridge.setPrivateFolders}
            modalInitOpen={bridge.modalInitOpen}
            setModalInitOpen={bridge.setModalInitOpen}
          />
          <Reconfirm
            modalReconfirm={bridge.modalReconfirm}
            setModalReconfirm={bridge.setModalReconfirm}
          />
          <Toaster position="top-center" richColors closeButton />
        </CssVarsProvider>
      </Root>
    </>
  );
}

// ── Root component ────────────────────────────────────────────────────────────
// All state lives here exactly as in the original.
// Router is created once via useRef — stable without being a module singleton,
// which preserves the option to instantiate Panel multiple times or in tests.

const Panel = () => {
  const [modalInitOpen, setModalInitOpen] = React.useState(false);
  const [modalReconfirm, setModalReconfirm] = React.useState({
    open: false,
    captionFirstHalf: "",
    handleAction: () => {}
  });

  const [globalSwitch, setGlobalSwitch] = React.useState(globalState.INNOCENT);
  const [metadata, setMetadata] = React.useState(defaultMetadata);
  const [clipboard, setClipboard] = React.useState(defaultClipboard);
  const [setting, setSetting] = React.useState(defaultSetting);

  const [publicFolders, setPublicFolders] = React.useState([]);
  const [privateFolders, setPrivateFolders] = React.useState([]);
  const sortedPublicFolders = React.useMemo(() => publicFolders.sortBy(), [publicFolders]);
  const sortedPrivateFolders = React.useMemo(() => privateFolders.sortBy(), [privateFolders]);

  const [firstTick, setFirstTick] = React.useState(false);
  const [secondTick, setSecondTick] = React.useState(false);

  const crepeEditor = React.useRef(null);
  const crepeUtils = React.useRef(null);
  const crepeSnapshot = React.useRef(null);
  const [crepeModified, setCrepeModified] = React.useState(false);

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
    modified: crepeModified,
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
    setReadOnly: switchAction("actionSetReadOnly"),
    setModified: setCrepeModified,
    reconfirm: (context, handleAction) => {
      setModalReconfirm({
        open: true,
        caption: context.languagePicker("modal.reconfirm.caption.discardDraft"),
        handleAction: handleAction
      });
    },
    warning: (context, handleAction) => (event) => {
      if (crepeModified) {
        event?.preventDefault();
        context.crepeRef.reconfirm(context, handleAction);
      }
    }
  }), [crepeModified, switchAction]);

  const languagePicker = React.useMemo(() => {
    ConstantContext.languagePicker = languagePickerSpawner(setting.meta.language);
    document.title = ConstantContext.languagePicker("nav.title");
    document.documentElement.lang = setting.meta.language;
    return languagePickerSpawner(setting.meta.language);
  }, [setting.meta.language]);

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
        } else {
          setGlobalSwitch(globalState.ANONYMOUS);
        }
      });
  }, []);

  React.useEffect(() => {
    if (firstTick && globalSwitch !== globalState.INNOCENT) {
      setSecondTick(true);
    }
  }, [firstTick, globalSwitch]);

  const isAuthority = React.useMemo(
    () => globalSwitch === globalState.AUTHORITY,
    [globalSwitch]
  );

  const setSettingPair = React.useCallback((key, value) => {
    setSetting((s) => setValue(s, key, value));
  }, []);

  // Router created once. The ref is stable across renders; the JSX elements
  // inside children are also stable because PanelLayout/PublicExplorer/
  // PrivateExplorer are module-level functions, not closures over state.
  const routerRef = React.useRef(null);
  if (!routerRef.current) {
    routerRef.current = createBrowserRouter([
      {
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
      },
    ]);
  }

  return (
    <GlobalContext.Provider
      value={{
        // ── unchanged from original ───────────────────────────────────────
        languagePicker,
        setModalReconfirm,
        globalSwitch,
        isAuthority,
        firstTick,
        secondTick,
        sortedPublicFolders,
        sortedPrivateFolders,
        crepeRef,
        metadata,
        setting,
      }}
    >
      {/* Bridge carries the remaining state into the router tree */}
      <RouterBridgeContext.Provider
        value={{
          clipboard,
          setClipboard,
          setPublicFolders,
          setPrivateFolders,
          setMetadata,
          setGlobalSwitch,
          setSetting,
          setSettingPair,
          modalReconfirm,
          setModalReconfirm,
          modalInitOpen,
          setModalInitOpen,
          setFirstTick,
        }}
      >
        <RouterProvider router={routerRef.current} />
      </RouterBridgeContext.Provider>
    </GlobalContext.Provider>
  );
};

export default Panel;
