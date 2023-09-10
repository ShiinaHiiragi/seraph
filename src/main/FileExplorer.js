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

  return (
    <RouteField
      path={[
        context.languagePicker(`main.file.bread.${type}`),
        folderName
      ]}
      title={folderName}
    >
    </RouteField>
  )
}

export default FileExplorer;
