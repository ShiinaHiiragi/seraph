import React from "react";
import RouteField from "../interface/RouteField";
import { useParams } from "react-router";
import GlobalContext from "../interface/constants";

const FileExplorer = (props) => {
  const {
    type
  } = props;
  const { folderName } = useParams();
  const context = React.useContext(GlobalContext);
  const breadCrumb = `main.file.bread.${type}`

  return (
    <RouteField
      path={[
        context.languagePicker(breadCrumb),
        folderName
      ]}
    >
    </RouteField>
  )
}

export default FileExplorer;
