import React from "react";
import axios from "axios";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import { toast } from "sonner";

// eslint-disable-next-line
String.prototype.upperCaseFirst = function () {
  let formatted = this;
  return formatted.length
    ? formatted[0].toUpperCase() + formatted.slice(1)
    : "";
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
Number.prototype.sizeFormat = function(precision=1) {
  let formatted = this;
  let index = 0;
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  while (formatted >= 1024 && index + 1 < suffix.length) {
    index += 1;
    formatted /= 1024;
  }
  const numberPart = arguments.length === 0
    ? formatted.toFixed(1).replace(/\.0$/, '')
    : formatted.toFixed(precision);

  return numberPart + " " + suffix[index]
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
Array.prototype.sortBy = function(key, reverse = false) {
  let formatted = this.slice();
  reverse = reverse ? -1 : 1;
  formatted.sort((left, right) => {
    left = key ? left[key] : left;
    right = key ? right[key] : right;
    return left > right ? reverse : left < right ? -reverse : 0;
  });
  return formatted;
};

// eslint-disable-next-line
Array.prototype.abstract = function(handleKey) {
  if (this.length === 0) {
    return { latest: -1, min: -1, max: -1, avg: -1 };
  }

  return {
    latest: handleKey(this.slice(-1)[0]),
    min: this.reduce((prev, curr) => Math.min(prev, handleKey(curr)), handleKey(this[0])),
    max: this.reduce((prev, curr) => Math.max(prev, handleKey(curr)), handleKey(this[0])),
    avg: this.reduce((prev, curr) => prev + handleKey(curr), 0) / this.length
  };
};

// eslint-disable-next-line
String.prototype.timeFormat = function(formatString) {
  return new Date(this).timeFormat(formatString);
}


const GlobalContext = React.createContext({ });
const ConstantContext = { };
const reactionInterval = {
  rapid: 150,
  medium: 300,
  slow: 450
}

const animeDuration = 1500
const toastDuration = 4000

const globalState = {
  INNOCENT: "innocent",
  ANONYMOUS: "anonymous",
  AUTHORITY: "authority"
};

const defaultMetadata = {
  terminal: false,
  platform: "linux"
};

const defaultClipboard = {
  permanent: null,
  directory: null,
  path: null
};

const defaultSetting = {
  meta: {
    language: "en",
    token: 60
  },
  welcome: {
    enable: {
      panel: true,
      temp: false,
      disk: true
    },
    interval: 45,
    window: {
      cpu: 120,
      temp: 60,
      memory: 80,
      storage: 20,
      disk: 60,
      net: 60
    },
    process: {
      sortBy: "cpu",
      count: 10
    }
  },
  terminal: {
    enable: false,
    shell: {
      linux: "bash",
      win32: "powershell.exe"
    },
    lifecycle: {
      ping: 60,
      timeout: 30,
    },
    cursor: {
      blink: false,
      reflow: false,
      active: "block",
      inactive: "outline"
    },
    font: {
      size: 14,
      family: "Noto Sans Mono",
      weight: "normal",
      weightBold: "bold"
    },
    scroll: {
      back: 1000,
      normal: 1,
      fast: 4
    },
    text: {
      space: 0,
      height: 1,
      contrast: 1,
      separator: "()[]{} ',\"`─‘’|"
    },
    theme: {
      transparency: false,
      selectionBackground: "#C8D2E6",
      background: "#F8F8F8",
      foreground: "#383838",
      cursor: "#383838",
      cursorAccent: "#F8F8F8",
      black: "#383A42",
      blue: "#4078F2",
      cyan: "#0184BC",
      green: "#50A14F",
      magenta: "#A626A4",
      red: "#E45649",
      white: "#A0A1A7",
      yellow: "#C18401",
      brightBlack: "#4F525E",
      brightBlue: "#4078F2",
      brightCyan: "#0184BC",
      brightGreen: "#50A14F",
      brightMagenta: "#A626A4",
      brightRed: "#E45649",
      brightWhite: "#383A42",
      brightYellow: "#C18401"
    },
    control: {
      esc: true,
      ctrl: {
        A: false,
        B: true,
        C: true,
        D: false,
        E: false,
        F: false,
        G: false,
        H: false,
        I: false,
        J: false,
        K: false,
        L: false,
        M: false,
        N: false,
        O: false,
        P: false,
        Q: false,
        R: false,
        S: false,
        T: false,
        U: false,
        V: false,
        W: false,
        X: false,
        Y: false,
        Z: true
      }
    }
  },
  task: {
    delay: 60
  },
  extension: {
    python: {
      linux: "python3",
      win32: "python"
    },
    pandoc: {
      linux: "pandoc",
      win32: "pandoc"
    }
  },
  epub: {
    enable: false,
    page: {
      split: true,
      front: true
    },
    nav: {
      link: false,
      prev: "← 前へ",
      next: "次へ →"
    },
    fade: {
      kana: null,
      opaque: "72",
      size: "84",
      top: "-6"
    },
    image: {
      show: true,
      width: null,
      altInline: true,
      altBlock: false,
      spec: true
    },
    text: {
      clearLine: true,
      showRuby: true,
      breakLine: ""
    },
    out: {
      html: false,
      vert: false,
      keep: false
    }
  }
};

const defaultOSInfo = {
  memory: -1,
  storage: -1,
  uptime: -1,
  userAtHostname: "",
  manufacturer: "",
  model: "",
  serial: "",
  virtual: undefined,
  biosVersion: "",
  platform: "",
  kernel: "",
  cpu: {
    model: "",
    speed: -1,
    cores: -1,
    cache: { l1d: -1, l1i: -1, l2: -1, l3: -1 }
  },
  mac: "",
  network: { }
}

const settingField = {
  general: "general",
  welcome: "welcome",
  terminal: "terminal",
  todo: "todo",
  extension: "extension",
  epub: "epub"
};

const alphabet = Array
  .from(Array(26))
  .map((_, index) => index + 65)
  .map((item) => String.fromCharCode(item));

const monospaceFonts = [
  {
    name: "Noto Sans Mono",
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&display=swap"
  },
  {
    name: "Roboto Mono",
    url: "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
  },
  {
    name: "JetBrains Mono",
    url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
  },
  {
    name: "IBM Plex Mono",
    url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
  },
  {
    name: "Ubuntu Mono",
    url: "https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
  },
  {
    name: "Space Mono",
    url: "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
  },
  {
    name: "PT Mono",
    url: "https://fonts.googleapis.com/css2?family=PT+Mono&display=swap"
  },
  {
    name: "DM Mono",
    url: "https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
  },
  {
    name: "Anonymous Pro",
    url: "https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap"
  },
  {
    name: "Source Code Pro",
    url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
  },
  {
    name: "Fira Code",
    url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap"
  },
  {
    name: "Cascadia Code",
    url: "https://fonts.googleapis.com/css2?family=Cascadia+Code:ital,wght@0,200..700;1,200..700&display=swap"
  },
  {
    name: "Inconsolata",
    url: "https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap"
  }
];

const setValue = (obj, key, value) => {
  const parts = key.split(".");
  if (parts.length > 1) {
    const outerKey = parts[0];
    const innerKeys = parts.slice(1).join(".");
    return {
      ...obj,
      [outerKey]: setValue(obj[outerKey], innerKeys, value)
    }
  } else {
    return {
      ...obj,
      [key]: value
    }
  }
};

export default GlobalContext;
export {
  ConstantContext,
  reactionInterval,
  animeDuration,
  toastDuration,
  globalState,
  defaultMetadata,
  defaultClipboard,
  defaultSetting,
  defaultOSInfo,
  settingField,
  alphabet,
  monospaceFonts,
  setValue
};

const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/");
const pathStartWith = (prefix) => {
  prefix = prefix.slice(-1) === "/" ? prefix.slice(0, -1) : prefix;
  const pathname = decodeURIComponent(window.location.pathname);
  return new RegExp(`^${prefix}$`).test(pathname) ||
    new RegExp(`^${prefix}/`).test(pathname)
}
const isLoopback = (hostname) => {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "::1" || /^127(\.\d{1,3}){3}$/.test(h);
}

const generateBaseURL = (protocol, hostname, port) => 
  `${protocol}://${hostname}:${port}`;

const serverBaseURL = isLoopback(process.env.REACT_APP_HOSTNAME)
  ? generateBaseURL(
    "http",
    process.env.REACT_APP_HOSTNAME,
    process.env.REACT_APP_SPORT
  )
  : generateBaseURL(
    "https",
    process.env.REACT_APP_HOSTNAME,
    process.env.REACT_APP_SSLCERT === "nginx"
      ? process.env.REACT_APP_NPORT
      : process.env.REACT_APP_SPORT
  );
const serverWebSocketURL = serverBaseURL.replace("http", "ws");


export {
  encodePath,
  pathStartWith,
  generateBaseURL,
  serverBaseURL,
  serverWebSocketURL
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
    IdentifierConflict: "IC",
    FileModuleError: "FME",
    EnvironmentMissing: "EM",
    ExtensionError: "EE",
    DuplicateRequest: "DR",
    InternalServerError: "ISE"
  }
}

/**
 * request 使用须知（重要）
 *   1. 工作原理：自动分析 GET/POST，填入不同参数。返回时分析返回结果，自动响应绝大部分错误
 *       - ES：直接进入 then
 *       - EF：如果能在 languagePicker 处找到错误，自动报出对应错误
 *       - AF：IT 直接处理，NI 进入 catch
 *       - 余下的进入 catch，一般用 request.unparseableResponse（第一类不可控错误）
 *       - 返回 500：node 出错，进入 axios 的 catch（第二类不可控错误）
 *   2. EF 的自动处理部分会识别 res.data 的数字 key，并 format 到错误信息中
 *   3. todo 是什么：EF 在 languagePicker 处找到错误后，不会进入返回的 Promise 流，因
 *      此额外动作需要用 todo 指定，这个函数被传入返回的响应体 data 部分
 *       - 当第二项参数不需要指定的时候，填 undefined 即可
 *       - key 为 "" 时，对应的函数一定会被执行，相当于 finally
 *   3. handleReject 是什么：有些用了 toast.promise 的 request，希望将 loading 后的
 *      错误状态归到 promise 的内部，此时可以传入这个参数
 *   4. 注意一致性
 *       - 服务器返回错误码中，只分为认证错误和执行错误
 *       - 但在 languagePicker 中，错误分为警告、异常和错误三种
 *       - 警告包括前端预检查发现的错误和认证错误的 IT（NI 进到 catch）
 *       - 异常应该被包含在执行错误中，而且名字应保持一致（除了首字母）
 *       - 错误只有两种，catch 中统一处理的 fallback 和服务器内部错误，后者包含在执行错误中
 *      综上所述，前端异常 + 服务器内部错误 == 后端执行错误
 *      须务必保持除了服务器内部错误 ISE 外其他所有错误名字相同（除了首字母）
 */
axios.defaults.withCredentials = true;
const request = (query, params, todo, handleReject, handleInit) => {
  const [method, path] = query.match(/(GET|POST)(.+)/).slice(1);
  const universalPlanned = todo?.[""];

  // no catch() in request()
  // learn to use finally()
  return new Promise((resolve) => {
    axios[method.toLowerCase()](
      new URL(path, serverBaseURL).href,
      method === "POST" ? params : { params: params }
    )
      .then((res) => {
        window.lastResponse = res
        window.lastResponseData = res?.data

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
        // returning AF_NI, which is rather special
        } else if (res.data.statusCode === Status.statusCode.AuthFailed
          && res.data.errorCode === Status.authErrCode.NotInit) {
            handleInit(true);
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

            const interCount =
              Object.keys(res.data)
                .map(Number)
                .sort((left, right) => left - right)
                .findIndex((key, index) => key !== index);

            const errorInfo = [...Array(interCount).keys()].reduce(
              (prev, curr) => prev.format(res.data[curr]),
              ConstantContext.languagePicker(
                "modal.toast.exception."
                  + mathcedErrorState
              )
            )

            ;(handleReject ?? toast.error)(errorInfo);

            const planned = todo?.[matchedErrorCode];
            if (planned instanceof Function) {
              planned(res.data);
            }
            if (universalPlanned instanceof Function) {
              universalPlanned(res.data);
            }
          // returning others
          } else {
            if (universalPlanned instanceof Function) {
              universalPlanned(res.data);
            }

            (handleReject ?? toast.error)(
              ConstantContext
                .languagePicker("modal.toast.error.unparseableResponse")
                .format(res.data.statusCode + (res.data.errorCode
                  ? "_" + res.data.errorCode
                  : ""
                ))
            );
          }
        }
      })
      .catch((res) => {
        if (universalPlanned instanceof Function) {
          universalPlanned(res.data);
        }

        (handleReject ?? toast.error)(
          ConstantContext
            .languagePicker("modal.toast.error.serverError")
            .format(res.response?.status ?? res.code)
        );
      });
  });
}

export { Status, request };


// eslint-disable-next-line
const linkReg = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/i;

// eslint-disable-next-line
String.prototype.annotateLink = function() {
  let formatted = this, result = [], matched = undefined, index = 0;
  while ((matched = formatted.match(linkReg)) !== null) {
    if (matched.index > 0) {
      result.push(formatted.slice(0, matched.index));
    }
    result.push(
      <Link
        key={index}
        target="_blank"
        rel="noopener"
        href={matched[0]}
      >
        {matched[0]}
      </Link>
    );
    index += 1
    formatted = formatted.slice(matched.index + matched[0].length);
  }
  result.push(formatted);
  return result;
}

export { linkReg };


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
    word-break: normal;
    overflow-wrap: anywhere;
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


const OnMounted = ({ onLoad }) => {
  React.useEffect(() => onLoad(), [onLoad]);
  return null;
};

export { OnMounted }

// maxHistory = 120, maxInterval = 60
// extra 20 items kept
const maxHistoryWindow = 200;
const vacantTolerance = 2000;
const formatFree = (free, total) => (total - free) / total * 100;
const clip = (min, value, max) => Math.min(Math.max(min, value), max);
const clipInterval = (value) => clip(750, value, 1500);

const Sparkline = ({ data, height = 64 }) => {
  if (!data || data.length < 2) {
    return <Box sx={{ height }} />;
  }

  const max = Math.max(...data) * 1.25 || 1;
  const points = data.map((v, i) => [(i / (data.length - 1)) * 100, (1 - v / max) * 100]);
  const lineStr = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaStr = `0,100 ${lineStr} 100,100`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block" }}
    >
      <defs>
        <linearGradient id="cpuSparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--joy-palette-primary-400)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--joy-palette-primary-400)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#cpuSparkGrad)" points={areaStr} />
      <polyline
        fill="none"
        stroke="var(--joy-palette-primary-400)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={lineStr}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export {
  maxHistoryWindow,
  vacantTolerance,
  formatFree,
  clipInterval,
  Sparkline
}
