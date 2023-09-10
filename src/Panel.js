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
import Links from "./main/Links"

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
                <Route exact path="/" element={<Welcome />} />
                <Route path="/links" element={<Links />} />
                <Route path="/public/:folderName" element={<FileExplorer type="public" />} />
                <Route path="/private/:folderName" element={<FileExplorer type="private" />} />
              </Routes>
            </BrowserRouter>
          </MainField>
        </ContentField>
      </CssVarsProvider>
    </Root>
  );
}

export default Panel;
