import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const Milkdown = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.milkdown")
      ]}
      title={context.languagePicker("nav.utility.milkdown")}
    >
      <Caption
        title={context.languagePicker("universal.placeholder.title")}
        caption={context.languagePicker("universal.placeholder.caption")}
      />
    </RouteField>
  )
}

export default Milkdown;
