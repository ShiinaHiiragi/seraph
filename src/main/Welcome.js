import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

const Welcome = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      title={context.languagePicker("main.welcome.title")}
    >
      WELCOME PAGE HERE
    </RouteField>
  )
}

export default Welcome;
