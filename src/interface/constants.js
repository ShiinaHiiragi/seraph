import React from "react";
import axios from "axios";
import { toast } from "sonner";

// eslint-disable-next-line
String.prototype.upperCaseFirst = function () {
  let formatted = this;
  return formatted[0].toUpperCase()
    + formatted.slice(1);
}

// eslint-disable-next-line
String.prototype.format = function () {
  let formatted = this;
  for (let i = 0; i < arguments.length; i++) {
    let regexp = new RegExp("\\{" + i + "\\}", "gi");
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

// eslint-disable-next-line
Number.prototype.sizeFormat = function() {
  let formatted = this;
  let index = 0;
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  while (formatted >= 1024 && index + 1 < suffix.length) {
    index += 1;
    formatted /= 1024;
  }
  return formatted.toFixed(1).replace(/\.0$/, '') + " " + suffix[index];
}

// eslint-disable-next-line
Date.prototype.timeFormat = function(formatString) {
  let formatted = this;
  let formatComponent = {
    "M+": formatted.getMonth() + 1,
    "d+": formatted.getDate(),
    "h+": formatted.getHours(),
    "m+": formatted.getMinutes(),
    "s+": formatted.getSeconds(),
    "q+": Math.floor((formatted.getMonth() + 3) / 3),
    S: formatted.getMilliseconds()
  };

  formatString = formatString.replace(/(y+)/, (_, _1) => {
    return ("" + formatted.getFullYear()).slice(4 - _1.length)
  });

  for (let index in formatComponent) {
    formatString = formatString.replace(
      new RegExp(`(${index})`),
      (_, _1) => {
        return _1.length === 1
          ? formatComponent[index]
          : ("00" + formatComponent[index]).slice(
            ("" + formatComponent[index]).length
          )
      }
    )
  }
  return formatString;
};

// eslint-disable-next-line
String.prototype.timeFormat = function(formatString) {
  return new Date(this).timeFormat(formatString);
}


const GlobalContext = React.createContext({ });
const ConstantContext = { };
const globalState = {
  INNOCENT: "innocent",
  ANONYMOUS: "anonymous",
  AUTHORITY: "authority"
};
const defaultSetting = {
  meta: {
    language: "en"
  }
};

export default GlobalContext;
export {
  ConstantContext,
  globalState,
  defaultSetting
};

const pathStartWith = (prefix) => {
  prefix = prefix.slice(-1) === "/" ? prefix.slice(0, -1) : prefix;
  const pathname = decodeURIComponent(window.location.pathname);
  return new RegExp(`^${prefix}$`).test(pathname) ||
    new RegExp(`^${prefix}/`).test(pathname)
}
const generateBaseURL = (protocol, hostname, port) => 
  `${protocol}://${hostname}:${port}`;
const serverBaseURL = generateBaseURL(
  process.env.REACT_APP_PROTOCOL,
  process.env.REACT_APP_HOSTNAME,
  process.env.REACT_APP_SPORT
);

export {
  pathStartWith,
  generateBaseURL,
  serverBaseURL
}


const Status = {
  statusCode: {
    BeforeAuth: "BA",
    AuthFailed: "AF",
    AuthSuccess: "AS",
    ExecFailed: "EF",
    ExecSuccess: "ES"
  },
  authErrCode: {
    NotInit: "NI",
    InvalidToken: "IT"
  },
  execErrCode: {
    IncorrectPassword: "IP",
    ResourcesUnexist: "RU",
    InternalServerError: "ISE"
  }
}

axios.defaults.withCredentials = true;
const request = (query, params, todo) => {
  const [method, path] = query.match(/(GET|POST)(.+)/).slice(1);
  return new Promise((resolve, reject) => {
    axios[method.toLowerCase()](
      new URL(path, serverBaseURL).href,
      method === "POST" ? params : { params: params }
    )
      .then((res) => {
        // returning ES
        if (res.data.statusCode === Status.statusCode.ExecSuccess) {
          resolve(res.data)
        // returning AF_IT, which is special
        } else if (res.data.statusCode === Status.statusCode.AuthFailed
          && res.data.errorCode === Status.authErrCode.InvalidToken
        ) {
          toast.error(
            ConstantContext
              .languagePicker("modal.toast.warning.invalidToken"),
            { duration: Infinity }
          );
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        } else {
          const exceptions = Object.keys(
            ConstantContext.languagePicker("modal.toast.exception")
          );
          const errorCodes = exceptions.map(
            (item) => Status.execErrCode[item.upperCaseFirst()]
          );
          // returning EF
          if (errorCodes.includes(res.data.errorCode)) {
            const mathcedErrorState = exceptions
              .filter((item) => Status.execErrCode[
                item.upperCaseFirst()
              ] === res.data.errorCode)[0];
            const matchedErrorCode = Status.execErrCode[
              mathcedErrorState.upperCaseFirst()
            ];
            toast.error(ConstantContext.languagePicker(
              "modal.toast.exception." + mathcedErrorState
            ));

            const planned = todo?.[matchedErrorCode];
            if (planned instanceof Function) {
              planned();
            }
          // returning others, such as AF_NI
          } else {
            reject(res.data);
          }
        }
      }).catch((res) => console.log(res) ?? toast.error(
        ConstantContext
          .languagePicker("modal.toast.error.serverError")
          .format(res.response.status)
      ));
  });
}

request.unparseableResponse = (data) => {
  toast.error(
    ConstantContext
      .languagePicker("modal.toast.error.unparseableResponse")
      .format(data.statusCode + (data.errorCode
        ? "_" + data.errorCode
        : ""
      ))
  );
}

export { Status, request };


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
    cursor: default;
  }

  &.sonner-toast-warn {
    --normal-bg: ${theme.vars.palette.warning.softBg};
    --normal-border: rgb(${theme.vars.palette.warning.mainChannel} / 0.2);
    --normal-text: ${theme.vars.palette.warning.softColor};
  }
`

export { toastTheme };
