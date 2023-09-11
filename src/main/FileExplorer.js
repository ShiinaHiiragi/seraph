import React from "react";
import RouteField from "../interface/RouteField";
import { useParams } from "react-router";
import GlobalContext from "../interface/constants";
import FileTable from "../components/FileTable";

const FileExplorer = (props) => {
  const {
    type
  } = props;
  const { folderName } = useParams();
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      path={[
        context.languagePicker(`nav.${type}`),
        folderName
      ]}
      title={folderName}
      sx={{
        flexDirection: "column",
        overflowY: "hidden",
        overflowX: "hidden"
      }}
    >
      <FileTable />
    </RouteField>
  )
}

export default FileExplorer;
