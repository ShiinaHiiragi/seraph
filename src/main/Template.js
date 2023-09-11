import React from "react";
import { useParams } from "react-router";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

// TODO: change name of Template
const Template = (props) => {
  const {
    // TODO: fill parameters
  } = props;
  const {
    // TODO: fill parameters
  } = useParams();
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={""}
      title={""}
      sx={{
        overflowY: "hidden",
        overflowX: "hidden"
      }}
    >
    </RouteField>
  )
}

export default Template;
