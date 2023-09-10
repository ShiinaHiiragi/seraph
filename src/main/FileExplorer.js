import React from "react";
import RouteField from "../interface/RouteField";
import { useParams } from "react-router";
import { capitalized } from "../interface/constants";

const FileExplorer = (props) => {
  const {
    type
  } = props;
  const { folderName } = useParams();

  return (
    <RouteField path={`${capitalized(type)}/${folderName}`}>
    </RouteField>
  )
}

export default FileExplorer;
