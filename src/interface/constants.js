import React from "react";

const GlobalContext = React.createContext({});
const pathStartWith = (prefix) => {
  prefix = prefix.slice(-1) === "/" ? prefix.slice(0, -1) : prefix;
  const pathname = decodeURIComponent(window.location.pathname);
  return new RegExp(`^${prefix}$`).test(pathname) ||
    new RegExp(`^${prefix}/`).test(pathname)
}

const authStateCode = {
  NotInitialized: "NI",
  InvalidToken: "IT",
  AccountUnmatch: "AU",
  PasswordUnmatch: "PU",
  AuthSuccess: "AS",
}

export default GlobalContext;
export {
  GlobalContext,
  pathStartWith,
  authStateCode
};
