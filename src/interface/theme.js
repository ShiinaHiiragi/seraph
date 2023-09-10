import { extendTheme } from "@mui/joy/styles";

const GlobalTheme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500,
    },
  }
});

export default GlobalTheme;
