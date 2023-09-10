import React from "react";
import { styled } from "@mui/joy/styles";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SideDrawer from "./components/SideDrawer";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from "./main/Welcome";
import FileExplorer from "./main/FileExplorer"
import { defaultLanguage, languagePickerSpawner } from "./interface/languagePicker";
import GlobalContext from "./interface/constants";

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
  [theme.breakpoints.only("xs")]: {
    minHeight: "64px",
  },
  [theme.breakpoints.up("sm")]: {
    minHeight: "72px",
  }
}));

const ContentField = styled('div')(({ theme }) => ({
  width: "100%",
  flexGrow: 1,
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
}));

const NavigationField = styled('div')(({ theme }) => ({
  width: "225px",
  overflow: "auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.surface,
  borderRight: "1px solid",
  borderColor: theme.palette.divider,
  [theme.breakpoints.only("xs")]: {
    display: "none",
  },
  [theme.breakpoints.up("sm")]: {
    minWidth: "225px",
  }
}));

const MainField = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
}));

const Panel = () => {
  const [language, setLanguage] = React.useState(defaultLanguage);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const languagePicker = React.useMemo(() => languagePickerSpawner(language), [language])

  return (
    <GlobalContext.Provider value={{
      languagePicker: languagePicker
    }}>
      <Root>
        <CssVarsProvider disableTransitionOnChange>
          <CssBaseline />
          {drawerOpen && (
            <SideDrawer onClose={() => setDrawerOpen(false)}>
              <Navigation />
            </SideDrawer>
          )}
          <HeaderField>
            <Header
              setDrawerOpen={setDrawerOpen}
            />
          </HeaderField>
          <ContentField>
            <NavigationField>
              <Navigation />
            </NavigationField>
            <MainField>
              <BrowserRouter>
                <Routes>
                  <Route exact path="/" element={<Welcome />} />
                  <Route path="/public/:folderName" element={<FileExplorer type="public" />} />
                  <Route path="/private/:folderName" element={<FileExplorer type="private" />} />
                </Routes>
              </BrowserRouter>
            </MainField>
          </ContentField>
        </CssVarsProvider>
      </Root>
    </GlobalContext.Provider>
  );
}

export default Panel;
