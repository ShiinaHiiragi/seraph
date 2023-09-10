import { styled } from "@mui/joy/styles";
import IconButton from "@mui/joy/IconButton";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import Menu from "./components/Menu";

const Root = styled('div')(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const MenuField = styled('div')(({ theme }) => ({
  width: "100%",
  minHeight: "64px",
  backgroundColor: theme.palette.background.level1
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
  backgroundColor: theme.palette.background.level2,
  overflow: "auto",
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
  backgroundColor: theme.palette.background.level3,
  overflow: "auto",
}));

const Panel = () => {
  return (
    <Root>
      <HeaderField>
      </HeaderField>
      <ContentField>
        <NavigationField>
        </NavigationField>
        <MainField>
        </MainField>
      </ContentField>
    </Root>
  );
}

export default Panel;
