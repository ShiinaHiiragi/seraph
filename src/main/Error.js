import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Error = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField noCheck>
      <Caption
        title={context.languagePicker("main.error.title")}
        caption={context.languagePicker("main.error.caption")}
      />
    </RouteField>
  )
}

export default Error;
