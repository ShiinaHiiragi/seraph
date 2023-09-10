import React from "react";
import RouteField from "../interface/RouteField";
import { useParams } from "react-router";

const FileExplorer = () => {
  const { folderName } = useParams();

  return (
    <RouteField path={`File/${folderName}`}>
    </RouteField>
  )
}

export default FileExplorer;
