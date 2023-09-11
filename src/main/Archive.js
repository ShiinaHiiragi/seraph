import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

const Template = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.archive")
      ]}
      title={context.languagePicker("nav.utility.archive")}
      sx={{
        overflowY: "hidden",
        overflowX: "hidden"
      }}
    >
    </RouteField>
  )
}

export default Template;
