import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Links = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display={context.isAuthority}
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.links")
      ]}
      title={context.languagePicker("nav.utility.links")}
    >
      <Caption
        title={context.languagePicker("universal.placeholder.inDevelopment.title")}
        caption={context.languagePicker("universal.placeholder.inDevelopment.caption")}
      />
    </RouteField>
  )
}

export default Links;
