import { extendTheme } from "@mui/joy/styles";

const localeCombinator = (language) => {
  const fontMap = {
    "zh-Hans": ["'Noto Sans SC'"],
    ja: [
      "'Noto Sans JP'",
      "'Noto Sans SC'"
    ]
  };
  return [
    "Inter",
    ...(fontMap[language] ?? []),
    "var(--joy-fontFamily-fallback)",
    "sans-serif"
  ].join(", ");
};

const GlobalTheme = (language) => extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: "rgb(245, 247, 250)"
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 800,
      lg: 1000,
      xl: 1200,
    },
  },
  radius: {
    sm: "4px"
  },
  typography: {
    h3: {
      letterSpacing: "0.02em"
    }
  },
  fontFamily: {
    display: localeCombinator(language),
    body: localeCombinator(language),
  }
});

export default GlobalTheme;
