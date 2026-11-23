import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

const Code = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display={true}
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.code"),
      ]}
      title={context.languagePicker("nav.utility.code")}
    >
    </RouteField>
  )
}

export default Code;
