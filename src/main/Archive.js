import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Archive = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.archive")
      ]}
      title={context.languagePicker("nav.utility.archive")}
    >
      <Caption
        title={context.languagePicker("universal.placeholder.title")}
        caption={context.languagePicker("universal.placeholder.caption")}
      />
    </RouteField>
  )
}

export default Archive;
