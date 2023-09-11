import React from "react";

const GlobalContext = React.createContext({});
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
    Unknown: "U"
  },
  authErrCode: {
    NotInit: "NI",
    InvalidToken: "IT",
    FormUnmatch: "FU"
  },
  execErrCode: {
    UnknownErr: "UE",
    InternalServerErr: "ISE"
  }
}

export default GlobalContext;
export {
  GlobalContext,
  pathStartWith,
  Status,
};
