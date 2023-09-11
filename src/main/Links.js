import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import InDevelopment from "../components/InDevelopment";

const Links = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.links")
      ]}
      title={context.languagePicker("nav.utility.links")}
      sx={{
        overflowY: "hidden",
        overflowX: "hidden"
      }}
    >
      <InDevelopment />
    </RouteField>
  )
}

export default Links;
