import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Welcome = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField>
      <Caption
        title={context.languagePicker("universal.inDevelopment.title")}
        caption={context.languagePicker("universal.inDevelopment.caption")}
      />
    </RouteField>
  )
}

export default Welcome;
