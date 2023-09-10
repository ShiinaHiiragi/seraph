import React from "react";
import RouteField from "../interface/RouteField";
import { useParams } from "react-router";

const FileExplorer = (props) => {
  // const {
  //   setBreadcrumb
  // } = props;
  const { folderName } = useParams();

  // React.useEffect(() => {
  //   setBreadcrumb((breadcrumb) => [...breadcrumb, folderName])
  // }, [])

  return (
    <RouteField path="File">
      FILENAME: {folderName}
    </RouteField>
  )
}

export default FileExplorer;
