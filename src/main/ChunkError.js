import React from "react";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import Caption from "../components/Caption";

const ChunkError = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField display>
      <Caption
        title={context.languagePicker("main.chunk.title")}
        caption={context.languagePicker("main.chunk.caption")}
      />
    </RouteField>
  )
}

export default ChunkError;
