import { extendTheme } from "@mui/joy/styles";

const GlobalTheme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 800,
      lg: 1000,
      xl: 1200,
    },
  },
  typography: {
    h3: {
      letterSpacing: "0.02em"
    }
  }
});

export default GlobalTheme;
