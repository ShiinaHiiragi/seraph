import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import InDevelopment from "../components/InDevelopment";

const TODO = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.todo")
      ]}
      title={context.languagePicker("nav.utility.todo")}
      sx={{
        overflowY: "hidden",
        overflowX: "hidden"
      }}
    >
      <InDevelopment />
    </RouteField>
  )
}

export default TODO;
