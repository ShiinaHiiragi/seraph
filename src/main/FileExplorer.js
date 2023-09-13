import React from "react";
import RouteField from "../interface/RouteField";
import { useParams } from "react-router";
import GlobalContext from "../interface/constants";
import FileTable from "../components/FileTable";
import FileList from "../components/FileList";

const FileExplorer = (props) => {
  const {
    type
  } = props;
  const { folderName } = useParams();
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      noCheck
      path={[
        context.languagePicker(`nav.${type}`),
        folderName
      ]}
      title={folderName}
      sxRaw={{
        overflowY: {
          xs: "auto",
          sm: "hidden"
        }
      }}
      sx={{
        flexDirection: "column",
        overflowY: {
          xs: "visible",
          sm: "hidden"
        },
        overflowX: {
          xs: "visible",
          sm: "hidden"
        },
        height: {
          xs: "auto",
          sm: "100%"
        }
      }}
    >
      <FileTable />
      <FileList />
    </RouteField>
  )
}

export default FileExplorer;
