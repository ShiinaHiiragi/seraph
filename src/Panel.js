import React from "react";
import { styled } from "@mui/joy/styles";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SideDrawer from "./components/SideDrawer";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import FileExplorer from "./main/FileExplorer"
import Links from "./main/Links"

const Root = styled('div')(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const HeaderField = styled('div')(({ theme }) => ({
  width: "100%",
  minHeight: "64px",
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
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
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
                <Route exact path="/" element={<div />} />
                <Route path="/links" element={<Links />} />
                <Route path="/files/:folderName" element={<FileExplorer />} />
              </Routes>
            </BrowserRouter>
          </MainField>
        </ContentField>
      </CssVarsProvider>
    </Root>
  );
}

export default Panel;
