import React from "react";
import { toast } from "sonner";
import { useParams } from "react-router";
import Input from "@mui/joy/Input";
import isValidFilename from 'valid-filename';
import GlobalContext, { Status, request } from "../interface/constants";
import RouteField from "../interface/RouteField";
import FileTable from "../components/FileTable";
import FileList from "../components/FileList";
import Caption from "../components/Caption";
import ModalForm from "../modal/Form";
import FolderSelector from "../modal/FolderSelector";

const FileExplorer = (props) => {
  const {
    type,
    folderCount
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
      request(
        `GET/${type}/${folderName}`,
        undefined,
        { [Status.execErrCode.ResourcesUnexist]: () => {
          setFolderState(-1);
        } }
      )
        .then((data) => {
          setFolderState(1);
          setFilesList(data.info);
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
  const [modalRenameOpen, setModalRenameOpen] = React.useState(null);
  const [formNewNameText, setFormNewNameText] = React.useState("");
  const [modalRenameDisabled, setModalRenameDisabled] = React.useState(false);
  const handleRename = React.useCallback(() => {
    if (!isValidFilename(formNewNameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const originFilename = `${modalRenameOpen}`;
    setModalRenameDisabled(true);
    request(
      "POST/file/rename",
      {
        type: type,
        folderName: folderName,
        filename: originFilename,
        newFilename: formNewNameText
      },
      { "": () => setModalRenameDisabled(false) }
    )
      .then((data) => {
        setModalRenameOpen(null);
        setFilesList((filesList) => filesList.map((item) =>
          item.name === originFilename
            ? {
              ...item,
              name: formNewNameText,
              type: data.type
            } : item
        ));
        toast.success(context.languagePicker("modal.toast.success.rename"));
      })
      .finally(() => setModalRenameDisabled(false));
  }, [
    context,
    type,
    folderName,
    modalRenameOpen,
    formNewNameText
  ]);

  // states and function for move
  const [modalMoveOpen, setModalMoveOpen] = React.useState(null);
  const [modalMoveDisabled, setModalMoveDisabled] = React.useState(false);
  const handleMove = React.useCallback((
    formSelectedFolder,
    setFormSelectedFolder
  ) => {
    const filename = `${modalMoveOpen}`;
    setModalMoveDisabled(true);
    request(
      "POST/file/move",
      {
        type: type,
        folderName: folderName,
        filename: filename,
        newType: formSelectedFolder[0],
        newFolderName: formSelectedFolder[1]
      },
      { "": () => setModalMoveDisabled(false) }
    )
      .then(() => {
        setModalMoveOpen(null);
        setFormSelectedFolder([null, null]);
        setFilesList((filesList) => filesList.filter(
          (item) => item.name !== filename
        ));
        toast.success(context.languagePicker("modal.toast.success.move"));
      })
      .finally(() => setModalMoveDisabled(true));
  }, [
    context,
    type,
    folderName,
    modalMoveOpen
  ]);

  const sortedFilesList = React.useMemo(() => {
    return filesList.slice().sort((left, right) => {
      return left.name > right.name ? 1 : -1;
    });
  }, [filesList]);

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
            sortedFilesList={sortedFilesList}
            setModalRenameOpen={setModalRenameOpen}
            setFormNewNameText={setFormNewNameText}
            setFilesList={setFilesList}
            folderCount={folderCount}
            setModalMoveOpen={setModalMoveOpen}
          />
          <FileList
            type={type}
            folderName={folderName}
            sortedFilesList={sortedFilesList}
            setModalRenameOpen={setModalRenameOpen}
            setFormNewNameText={setFormNewNameText}
            setFilesList={setFilesList}
            folderCount={folderCount}
            setModalMoveOpen={setModalMoveOpen}
          />
        </React.Fragment>}
      {folderState < 0 &&
        <Caption
          title={context.languagePicker("universal.placeholder.unexist.title")}
          caption={context.languagePicker("universal.placeholder.unexist.caption")}
        />}
      <ModalForm
        open={Boolean(modalRenameOpen)}
        disabled={
          modalRenameDisabled
          || formNewNameText.length === 0
          || formNewNameText === modalRenameOpen
        }
        handleClose={() => setModalRenameOpen(null)}
        handleClick={handleRename}
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
      <FolderSelector
        open={Boolean(modalMoveOpen)}
        disabled={modalMoveDisabled}
        handleClose={() => setModalMoveOpen(false)}
        handleClick={handleMove}
        title={context.languagePicker("modal.form.move")}
        button={context.languagePicker("universal.button.continue")}
        publicFolders={context.publicFolders}
        privateFolders={context.privateFolders}
      />
    </RouteField>
  )
}

export default FileExplorer;
