import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Welcome = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField>
      <Caption
        title={context.languagePicker("universal.placeholder.title")}
        caption={context.languagePicker("universal.placeholder.caption")}
      />
    </RouteField>
  )
}

export default Welcome;
