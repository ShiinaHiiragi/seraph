import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import InDevelopment from "../components/InDevelopment";

const Milkdown = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.milkdown")
      ]}
      title={context.languagePicker("nav.utility.milkdown")}
      sx={{
        overflowY: "hidden",
        overflowX: "hidden"
      }}
    >
      <InDevelopment />
    </RouteField>
  )
}

export default Milkdown;
