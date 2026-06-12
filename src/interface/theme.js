import { extendTheme } from "@mui/joy/styles";

const localeCombinator = (language) => {
  const zhHans = [
    "'Noto Sans SC'",
    "'Noto Sans CJK SC'",
    "'Microsoft YaHei'",
    "'WenQuanYi Micro Hei'",
    "'PingFang SC'"
  ]

  const ja = [
    "'Noto Sans JP'",
    "'Noto Sans CJK JP'",
    "'Yu Gothic'",
    "'IPAGothic'",
    "'Hiragino Sans'"
  ]

  const fontMap = {
    "zh-Hans": zhHans,
    ja: [...ja, ...zhHans]
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
        scrollbarThumb: "#BEBEBE",
        background: {
          body: "#F5F7FA"
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
      xl: 1200
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
    code: "'Noto Sans Mono', 'Noto Sans Mono CJK SC', 'Consolas', 'DejaVu Sans Mono', 'Menlo', monospace"
  },
  components: {
    JoyInput: {
      defaultProps: {
        slotProps: {
          input: {
            spellCheck: false
          }
        }
      }
    },
    JoyTypography: {
      styleOverrides: {
        root: {
          wordBreak: "normal",
          overflowWrap: "anywhere",
        }
      }
    }
  }
});

export default GlobalTheme;
