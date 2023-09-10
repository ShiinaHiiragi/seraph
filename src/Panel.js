import { styled } from "@mui/joy/styles";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

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
  [theme.breakpoints.only("xs")]: {
    display: "none",
  },
  [theme.breakpoints.only("sm")]: {
    minWidth: "25%",
  },
  [theme.breakpoints.up("md")]: {
    minWidth: "225px",
  },
}));

const MainField = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
}));

const Panel = () => {
  return (
    <Root>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <HeaderField>
          <Header/>
        </HeaderField>
        <ContentField>
          <NavigationField>
            <Navigation />
          </NavigationField>
          <MainField>
          </MainField>
        </ContentField>
      </CssVarsProvider>
    </Root>
  );
}

export default Panel;
