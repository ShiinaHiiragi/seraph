import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Error = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField>
      <Caption
        title={context.languagePicker("universal.notFound.title")}
        caption={context.languagePicker("universal.notFound.caption")}
      />
    </RouteField>
  )
}

export default Error;
