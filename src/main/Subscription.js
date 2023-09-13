import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Subscription = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display={context.isAuthority}
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.subscription")
      ]}
      title={context.languagePicker("nav.utility.subscription")}
    >
      <Caption
        title={context.languagePicker("universal.placeholder.inDevelopment.title")}
        caption={context.languagePicker("universal.placeholder.inDevelopment.caption")}
      />
    </RouteField>
  )
}

export default Subscription;
