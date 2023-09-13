import React from "react";
import { toast } from "sonner";
import { useParams } from "react-router";
import GlobalContext, { Status, request } from "../interface/constants";
import RouteField from "../interface/RouteField";
import FileTable from "../components/FileTable";
import FileList from "../components/FileList";

const FileExplorer = (props) => {
  const {
    type
  } = props;
  const { folderName } = useParams();
  const context = React.useContext(GlobalContext);

  const [filesList, setFilesList] = React.useState([]);
  const display = React.useMemo(() => {
    return type === "public" || context.isAuthority;
  }, [type, context.isAuthority])

  console.log(folderName);
  // after second tick, the globalSwitch were set properly
  React.useEffect(() => {
    if (context.secondTick && display) {
      request("GET/folder/info", {
        type: type,
        name: folderName
      })
        .then((data) => {
          setFilesList(data.info);
        })
        .catch((data) => {
          if (data.statusCode === Status.statusCode.ExecFailed
            && data.errorCode === Status.execErrCode.ResourcesUnexist) {
            toast.error("EF_RU");
          } else {
            request.unparseableResponse(data);
          }
        })
    }
  // eslint-disable-next-line
  }, [context.secondTick, type, folderName]);

  return (
    <RouteField
      display={display}
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
      <FileTable filesList={filesList} />
      <FileList filesList={filesList} />
    </RouteField>
  )
}

export default FileExplorer;
