import React from "react";
import axios from "axios";
import { toast } from "sonner";

const generateBaseURL = (protocol, hostname, port) => `${protocol}//${hostname}:${port}`;
const serverBaseURL = generateBaseURL(
  process.env.REACT_APP_PROTOCOL,
  process.env.REACT_APP_HOSTNAME,
  process.env.REACT_APP_SPORT
);
const pathStartWith = (prefix) => {
  prefix = prefix.slice(-1) === "/" ? prefix.slice(0, -1) : prefix;
  const pathname = decodeURIComponent(window.location.pathname);
  return new RegExp(`^${prefix}$`).test(pathname) ||
    new RegExp(`^${prefix}/`).test(pathname)
}

const Status = {
  statusCode: {
    BeforeAuth: "BA",
    AuthFailed: "AF",
    AuthSuccess: "AS",
    ExecFailed: "EF",
    ExecSuccess: "ES",
    UnknownStatus: "US"
  },
  authErrCode: {
    NotInit: "NI",
    InvalidToken: "IT",
    PasswordUnmatch: "PU"
  },
  execErrCode: {
    InternalServerError: "ISE"
  }
}

const toastTheme = (theme) => `
  [data-sonner-toaster][data-theme] {
    font-family: ${theme.vars.fontFamily.body};
    font-size: ${theme.fontSize.md};
    --border-radius: ${theme.vars.radius.sm};
    --normal-bg: ${theme.vars.palette.background.body};
    --normal-border: ${theme.vars.palette.divider};
    --normal-text: ${theme.vars.palette.text.primary};
    --success-bg: ${theme.vars.palette.success.softBg};
    --success-border: rgb(${theme.vars.palette.success.mainChannel} / 0.2);
    --success-text: ${theme.vars.palette.success.softColor};
    --error-bg: ${theme.vars.palette.danger.softBg};
    --error-border: rgb(${theme.vars.palette.danger.mainChannel} / 0.2);
    --error-text: ${theme.vars.palette.danger.softColor};
    --gray1: ${theme.vars.palette.neutral[50]};
    --gray2: ${theme.vars.palette.neutral[100]};
    --gray3: ${theme.vars.palette.neutral[200]};
    --gray4: ${theme.vars.palette.neutral[300]};
    --gray5: ${theme.vars.palette.neutral[400]};
    --gray6: ${theme.vars.palette.neutral[500]};
    --gray7: ${theme.vars.palette.neutral[600]};
    --gray8: ${theme.vars.palette.neutral[700]};
    --gray9: ${theme.vars.palette.neutral[800]};
    --gray10: ${theme.vars.palette.neutral[900]};
  }

  [data-sonner-toast][data-styled=true] {
    box-shadow: none;
  }

  &.sonner-toast-warn {
    --normal-bg: ${theme.vars.palette.warning.softBg};
    --normal-border: rgb(${theme.vars.palette.warning.mainChannel} / 0.2);
    --normal-text: ${theme.vars.palette.warning.softColor};
  }
`

const request = (query, params) => {
  const [method, path] = query.match(/(GET|POST)(.+)/).slice(1);
  return new Promise((resolve) => {
    axios[method.toLowerCase()](new URL(path, serverBaseURL).href, params)
      .then((res) => resolve(res.data))
      .catch((res) => console.log(res.response.data))
  });
}

const GlobalContext = React.createContext({});
export default GlobalContext;

export {
  generateBaseURL,
  serverBaseURL,
  pathStartWith,
  Status,
  toastTheme,
  request
};
