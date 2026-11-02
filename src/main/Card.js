import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

const Error = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display={context.isAuthority}
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.card"),
      ]}
      title={context.languagePicker("nav.utility.card")}
    >
    </RouteField>
  )
}

export default Error;
