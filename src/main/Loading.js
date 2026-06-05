import React from "react";
import RouteField from "../interface/RouteField";
import LinearProgress from "@mui/joy/LinearProgress";

const Loading = () => {
  return (
    <LinearProgress
      size="sm"
      variant="plain"
      color="primary"
    />
  )
}

export default Loading;
