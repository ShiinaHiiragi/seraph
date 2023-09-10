import React from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography"
import MenuIcon from "@mui/icons-material/Menu";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";

const HeaderLayout = (props) => {
  return (
    <Box
      component="header"
      className="Header"
      {...props}
      sx={[
        {
          p: 2,
          gap: 2,
          bgcolor: "background.surface",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gridColumn: "1 / -1",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}

const Header = (props) => {
  const {
    setDrawerOpen
  } = props;

  return (
    <HeaderLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <IconButton
          variant="outlined"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          size="sm"
          variant="soft"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          <FindInPageRoundedIcon />
        </IconButton>
        <Typography component="h1" fontWeight="lg" sx={{ letterSpacing: "0.06em" }}>
          SERAPH
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
        >
          <SearchRoundedIcon />
        </IconButton>

        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          component="a"
          href="#"
        >
          <BookRoundedIcon />
        </IconButton>
      </Box>
    </HeaderLayout>
  );
}

export default Header;
