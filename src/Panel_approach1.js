/**
 * Approach 1: Extend GlobalContext with all setters + clipboard,
 * then define createBrowserRouter at module level (stable singleton).
 *
 * Trade-off: GlobalContext carries more surface area (setters live there),
 * but the router object is truly static and FileExplorer/Header can later
 * drop their props in favour of useContext.
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

// ── Route wrappers ────────────────────────────────────────────────────────────
// Read clipboard from GlobalContext and pass as props.
// In a complete approach-1 refactor, FileExplorer would call useContext itself
// and these wrappers would disappear.

function PublicExplorer() {
  const { clipboard, setClipboard, setPublicFolders, setPrivateFolders } =
    React.useContext(GlobalContext);
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
    React.useContext(GlobalContext);
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
// Renders the shell (header, nav, modals) and delegates page content to <Outlet>.
// Everything comes from GlobalContext — no props needed.

function PanelLayout() {
  const ctx = React.useContext(GlobalContext);
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
              setGlobalSwitch={ctx.setGlobalSwitch}
              setDrawerOpen={setDrawerOpen}
              setPublicFolders={ctx.setPublicFolders}
              setPrivateFolders={ctx.setPrivateFolders}
              setMetadata={ctx.setMetadata}
              setClipboard={ctx.setClipboard}
              setSetting={ctx.setSetting}
              setSettingPair={ctx.setSettingPair}
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
            setFirstTick={ctx.setFirstTick}
            setGlobalSwitch={ctx.setGlobalSwitch}
            setting={ctx.setting}
            setClipboard={ctx.setClipboard}
            setSetting={ctx.setSetting}
            setPublicFolders={ctx.setPublicFolders}
            setPrivateFolders={ctx.setPrivateFolders}
            modalInitOpen={ctx.modalInitOpen}
            setModalInitOpen={ctx.setModalInitOpen}
          />
          <Reconfirm
            modalReconfirm={ctx.modalReconfirm}
            setModalReconfirm={ctx.setModalReconfirm}
          />
          <Toaster position="top-center" richColors closeButton />
        </CssVarsProvider>
      </Root>
    </>
  );
}

// ── Router: stable module-level singleton ─────────────────────────────────────
// Defined after PanelLayout/PublicExplorer/PrivateExplorer so the JSX references
// resolve. createBrowserRouter runs once at import time.

const router = createBrowserRouter([
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

// ── Root component ────────────────────────────────────────────────────────────
// Owns all state. Provides an extended GlobalContext that includes setters so
// PanelLayout (and any route component) can act on state without prop-drilling.

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

  return (
    <GlobalContext.Provider
      value={{
        // ── original values ───────────────────────────────────────────────
        languagePicker,
        globalSwitch,
        isAuthority,
        firstTick,
        secondTick,
        sortedPublicFolders,
        sortedPrivateFolders,
        crepeRef,
        metadata,
        setting,
        // ── new in approach 1: setters + volatile state ───────────────────
        // PanelLayout reads these instead of receiving them as props.
        // In a follow-up, Header/FileExplorer can consume these directly.
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
      <RouterProvider router={router} />
    </GlobalContext.Provider>
  );
};

export default Panel;
