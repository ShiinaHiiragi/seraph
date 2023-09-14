import React from "react";
import { toast } from "sonner";
import { useParams } from "react-router";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import isValidFilename from 'valid-filename';
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GlobalContext, { Status, request } from "../interface/constants";
import RouteField from "../interface/RouteField";
import FileTable from "../components/FileTable";
import FileList from "../components/FileList";
import Caption from "../components/Caption";
import ModalForm from "../modal/Form";

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
        .catch(request.unparseableResponse);
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
  const handleRename = React.useCallback(() => {
    if (!isValidFilename(formNewNameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const originFilename = `${modalRenameOpen}`;
    request("POST/file/rename", {
      type: type,
      folderName: folderName,
      filename: originFilename,
      newFilename: formNewNameText
    })
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
      .catch(request.unparseableResponse);
  }, [
    context,
    type,
    folderName,
    modalRenameOpen,
    formNewNameText
  ]);

  // states and function for move
  const [modalMoveOpen, setModalMoveOpen] = React.useState(null);
  const [formSelectedFolder, setFormSelectedFolder] = React.useState([null, null]);
  const handleMove = React.useCallback(() => {
    const filename = `${modalMoveOpen}`;

    request("POST/file/move", {
      type: type,
      folderName: folderName,
      filename: filename,
      newType: formSelectedFolder[0],
      newFolderName: formSelectedFolder[1]
    })
      .then(() => {
        setModalMoveOpen(null);
        setFilesList((filesList) => filesList.filter(
          (item) => item.name !== filename
        ));
        toast.success(context.languagePicker("modal.toast.success.move"));
      })
      .catch(request.unparseableResponse);
  }, [
    context,
    type,
    folderName,
    modalMoveOpen,
    formSelectedFolder
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
        disabled={formNewNameText.length === 0 || formNewNameText === modalRenameOpen}
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
      <ModalForm
        open={Boolean(modalMoveOpen)}
        disabled={formSelectedFolder[1] === null}
        handleClose={() => {
          setModalMoveOpen(false);
          setFormSelectedFolder([null, null]);
        }}
        handleClick={handleMove}
        title={context.languagePicker("modal.form.move")}
        button={context.languagePicker("universal.button.continue")}
        stackStyle={{ overflow: "auto" }}
      >
        <List
          size="sm"
          sx={{
            overflow: "auto",
            "--ListItem-radius": "8px",
            "--List-gap": "4px"
          }}
        >
          <ListItem nested>
            <ListSubheader>
              {context.languagePicker("nav.public")}
            </ListSubheader>
            <List
              aria-labelledby="nav-list-browse"
              sx={{
                "& .JoyListItemButton-root": { p: "8px" },
              }}
            >
              {context.publicFolders
                .filter((item) => type !== "public" || folderName !== item)
                .map((item, index) => (
                  <ListItem key={index}>
                    <ListItemButton
                      selected={
                        formSelectedFolder[0] === "public"
                          && formSelectedFolder[1] === item
                      }
                      onClick={() => setFormSelectedFolder(["public", item])}
                    >
                      <ListItemDecorator>
                        <FolderOpenIcon fontSize="small" />
                      </ListItemDecorator>
                      <ListItemContent>{item}</ListItemContent>
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </ListItem>

          <ListItem nested>
            <ListSubheader>
              {context.languagePicker("nav.private")}
            </ListSubheader>
            <List
              aria-labelledby="nav-list-browse"
              sx={{
                "& .JoyListItemButton-root": { p: "8px" },
              }}
            >
              {context.privateFolders
                .filter((item) => type !== "private" || folderName !== item)
                .map((item, index) => (
                  <ListItem key={index}>
                    <ListItemButton
                      selected={
                        formSelectedFolder[0] === "private"
                          && formSelectedFolder[1] === item
                      }
                      onClick={() => setFormSelectedFolder(["private", item])}
                    >
                      <ListItemDecorator>
                        <FolderOpenIcon fontSize="small" />
                      </ListItemDecorator>
                      <ListItemContent>{item}</ListItemContent>
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </ListItem>
        </List>
      </ModalForm>
    </RouteField>
  )
}

export default FileExplorer;
