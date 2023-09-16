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
  const [filesSorting, setFilesSorting] = React.useState(["name", false]);
  const [folderState, setFolderState] = React.useState(0);
  const sortedFilesList = React.useMemo(() => {
    return filesList.sortBy(...filesSorting);
  }, [filesList, filesSorting]);
  const display = React.useMemo(() => {
    return type === "public" || context.isAuthority;
  }, [type, context.isAuthority]);
  const handleClickSort = React.useCallback((target) => {
    setFilesSorting((filesSorting) => {
      return filesSorting[0] === target
        ? [filesSorting[0], !filesSorting[1]]
        : [target, false];
    });
  }, []);

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
  const handleCloseRename = React.useCallback(() => {
    setModalRenameOpen(false);
    setModalRenameDisabled(false);
  }, [ ]);

  const handleRename = React.useCallback(() => {
    if (!isValidFilename(formNewNameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const originFilename = `${modalRenameOpen}`, newFilename = `${formNewNameText}`;
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
        setFilesList((filesList) => filesList.map((item) =>
          item.name === originFilename
            ? {
              ...item,
              name: formNewNameText,
              type: data.type
            } : item
        ));
        handleCloseRename();
        toast.success(
          context
            .languagePicker("modal.toast.success.rename")
            .format(originFilename, newFilename)
        );
      })
      .finally(() => setModalRenameDisabled(false));
  }, [
    context,
    type,
    folderName,
    modalRenameOpen,
    formNewNameText,
    handleCloseRename
  ]);

  // states and function for copy
  const [modalCopyOpen, setModalCopyOpen] = React.useState(null);
  const [modalCopyDisabled, setModalCopyDisabled] = React.useState(false);
  const handleCopy = React.useCallback((
    clearInnerState,
    formSelectedFolder
  ) => {
    const filename = `${modalCopyOpen}`;
    const [newType, newFolderName] = formSelectedFolder;
    setModalCopyDisabled(true);
    request(
      "POST/file/copy",
      {
        type: type,
        folderName: folderName,
        filename: filename,
        newType: formSelectedFolder[0],
        newFolderName: formSelectedFolder[1]
      },
      { "": () => setModalCopyDisabled(false) }
    )
      .then(() => {
        setModalCopyOpen(null);
        clearInnerState();
        toast.success(
          context
            .languagePicker("modal.toast.success.copy")
            .format(filename, newType + "/" + newFolderName)
        );
      })
      .finally(() => setModalCopyDisabled(false));
  }, [
    context,
    type,
    folderName,
    modalCopyOpen
  ]);

  // states and function for move
  const [modalMoveOpen, setModalMoveOpen] = React.useState(null);
  const [modalMoveDisabled, setModalMoveDisabled] = React.useState(false);
  const handleMove = React.useCallback((
    clearInnerState,
    formSelectedFolder
  ) => {
    const filename = `${modalMoveOpen}`;
    const [newType, newFolderName] = formSelectedFolder;
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
        setFilesList((filesList) => filesList.filter(
          (item) => item.name !== filename
        ));
        setModalMoveOpen(null);
        clearInnerState();
        toast.success(
          context
            .languagePicker("modal.toast.success.move")
            .format(filename, newType + "/" + newFolderName)
        );
      })
      .finally(() => setModalMoveDisabled(false));
  }, [
    context,
    type,
    folderName,
    modalMoveOpen
  ]);

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
            filesSorting={filesSorting}
            handleClickSort={handleClickSort}
            type={type}
            folderName={folderName}
            sortedFilesList={sortedFilesList}
            setModalRenameOpen={setModalRenameOpen}
            setFormNewNameText={setFormNewNameText}
            setFilesList={setFilesList}
            folderCount={folderCount}
            setModalMoveOpen={setModalMoveOpen}
            setModalCopyOpen={setModalCopyOpen}
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
            setModalCopyOpen={setModalCopyOpen}
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
        handleClose={handleCloseRename}
        handleClick={handleRename}
        title={context.languagePicker("modal.form.rename.title")}
        caption={context.languagePicker("modal.form.rename.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <Input
          autoFocus
          autoComplete="off"
          placeholder={context.languagePicker("modal.form.rename.placeholder")}
          value={formNewNameText}
          onChange={(event) => setFormNewNameText(event.target.value)}
        />
      </ModalForm>
      <FolderSelector
        open={Boolean(modalMoveOpen)}
        disabled={modalMoveDisabled}
        handleClose={() => setModalMoveOpen(null)}
        handleClick={handleMove}
        title={context.languagePicker("modal.form.move")}
        button={context.languagePicker("universal.button.continue")}
        sortedPublicFolders={
          context
            .sortedPublicFolders
            .filter((item) => type !== "public" || folderName !== item)
        }
        sortedPrivateFolders={
          context
            .sortedPrivateFolders
            .filter((item) => type !== "private" || folderName !== item)
        }
      />
      <FolderSelector
        open={Boolean(modalCopyOpen)}
        disabled={modalCopyDisabled}
        handleClose={() => setModalCopyOpen(null)}
        handleClick={handleCopy}
        title={context.languagePicker("modal.form.copy")}
        button={context.languagePicker("universal.button.continue")}
        sortedPublicFolders={
          context
            .sortedPublicFolders
            .filter((item) => type !== "public" || folderName !== item)
        }
        sortedPrivateFolders={
          context
            .sortedPrivateFolders
            .filter((item) => type !== "private" || folderName !== item)
        }
      />
    </RouteField>
  )
}

export default FileExplorer;
