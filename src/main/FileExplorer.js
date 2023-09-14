import React from "react";
import { toast } from "sonner";
import { useParams } from "react-router";
import Input from "@mui/joy/Input";
import GlobalContext, { Status, request } from "../interface/constants";
import RouteField from "../interface/RouteField";
import FileTable from "../components/FileTable";
import FileList from "../components/FileList";
import Caption from "../components/Caption";
import ModalForm from "../modal/Form";

const FileExplorer = (props) => {
  const {
    type
  } = props;
  const { folderName } = useParams();
  const context = React.useContext(GlobalContext);

  const [filesList, setFilesList] = React.useState([]);
  const [folderState, setFolderState] = React.useState(0);
  const display = React.useMemo(() => {
    return type === "public" || context.isAuthority;
  }, [type, context.isAuthority])

  // after second tick, the globalSwitch were set properly
  React.useEffect(() => {
    if (context.secondTick && display) {
      request(`GET/${type}/${folderName}`)
        .then((data) => {
          setFolderState(1);
          setFilesList(data.info);
        })
        .catch((data) => {
          if (data.statusCode === Status.statusCode.ExecFailed
            && data.errorCode === Status.execErrCode.ResourcesUnexist) {
            setFolderState(-1);
            toast.error(context.languagePicker("modal.toast.exception.resourcesUnexist"));
          } else {
            request.unparseableResponse(data);
          }
        })
    }
  // eslint-disable-next-line
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
    // other folder are clicked
    type, folderName
  ]);

  // states and function for rename
  const [modalRenameOpen, setModalRenameOpen] = React.useState(false);
  const [formNewNameText, setFormNewNameText] = React.useState("");

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
      {folderState > 0 &&
        <React.Fragment>
          <FileTable
            type={type}
            folderName={folderName}
            filesList={filesList}
          />
          <FileList
            type={type}
            folderName={folderName}
            filesList={filesList}
          />
        </React.Fragment>}
      {folderState < 0 &&
        <Caption
          title={context.languagePicker("universal.placeholder.unexist.title")}
          caption={context.languagePicker("universal.placeholder.unexist.caption")}
        />}
      <ModalForm
        open={true}
        disabled={false}
        handleClose={() => { }}
        handleClick={() => { }}
        title={context.languagePicker("modal.form.rename.title")}
        caption={context.languagePicker("modal.form.rename.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <Input
          autoComplete="off"
          placeholder={context.languagePicker("modal.form.rename.placeholder")}
          value={formNewNameText}
          onChange={(event) => setFormNewNameText(event.target.value)}
        />
      </ModalForm>
    </RouteField>
  )
}

export default FileExplorer;
