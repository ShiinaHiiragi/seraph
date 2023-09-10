import React from "react";

const GlobalContext = React.createContext({});
const capitalized = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export default GlobalContext;
export {
  GlobalContext,
  capitalized,
};
