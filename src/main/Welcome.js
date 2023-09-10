import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

const Welcome = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField>
      {context.languagePicker("main.welcome.title")} Page Here
    </RouteField>
  )
}

export default Welcome;
