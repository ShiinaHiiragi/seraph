import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Subscription = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.subscription")
      ]}
      title={context.languagePicker("nav.utility.subscription")}
    >
      <Caption
        title={context.languagePicker("universal.inDevelopment.title")}
        caption={context.languagePicker("universal.inDevelopment.caption")}
      />
    </RouteField>
  )
}

export default Subscription;
