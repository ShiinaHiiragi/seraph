import React from "react";
import { toast } from "sonner";
import { useParams } from "react-router";
import Fuse from "fuse.js";
import isValidFilename from "valid-filename";
import Input from "@mui/joy/Input";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import GlobalContext, {
  Status,
  request,
  reactionInterval,
  defaultClipboard,
  pathStartWith
} from "../interface/constants";
import RouteField from "../interface/RouteField";
import FileTable from "../components/FileTable";
import FileList from "../components/FileList";
import Caption from "../components/Caption";
import ModalForm from "../modal/Form";

const FileExplorer = (props) => {
  const {
    type,
    clipboard,
    setClipboard,
    setPublicFolders,
    setPrivateFolders
  } = props;
  const { "*": rawFolderName } = useParams();
  const context = React.useContext(GlobalContext);
  const folderName = React.useMemo(
    () => rawFolderName
      .replace(/\/+/g, "/")
      .replace(/^\//, '')
      .replace(/\/$/, ''),
    [rawFolderName]
  );

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
    setFolderState(0);
    if (context.secondTick && display) {
      request(
        `GET/folder/${type}/${folderName}`,
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

  // search and filter
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState(null);
  const [guard, setGuard] = React.useState(["", null]);
  const [filterList, setFilterList] = React.useState([]);

  const searcher = React.useMemo(() => new Fuse(
    sortedFilesList,
    { keys: ["name"] }
  ), [sortedFilesList])

  React.useEffect(() => {
    const newFilterList = [
      ...new Set(
        filesList
          .filter((item) => item.type !== "directory")
          .map((item) => item.type.split("/")[0].upperCaseFirst())
      )
    ].sortBy();

    if (filesList.filter((item) => item.type === "directory").length) {
      newFilterList.unshift("Directory")
    }
    setFilterList(newFilterList);
  }, [context, filesList]);

  React.useEffect(() => {
    setSearch("");
    setFilter(null);
  }, [type, folderName]);

  React.useEffect(() => {
    const timeOutId = setTimeout(() =>
      setGuard((guard) => [search, guard[1]]
    ), reactionInterval.slow);
    return () => clearTimeout(timeOutId);
  }, [search]);

  React.useEffect(() => setGuard((guard) => [
    guard[0],
    filter
  ]), [filter]);

  // new folder
  const [modalNewOpen, setModalNewOpen] = React.useState(false);
  const [modalNewDisabled, setModalNewDisabled] = React.useState(false);
  const [modalNewLoading, setModalNewLoading] = React.useState(false);
  const [formNewFolderNameText, setFormNewFolderNameText] = React.useState("");
  const handleCloseNew = React.useCallback(() => {
    setModalNewOpen(false);
    setModalNewLoading(false);
    setFormNewFolderNameText("");
  }, [ ]);

  React.useEffect(() => {
    const timeOutId = setTimeout(() => setModalNewDisabled(() => {
      if (filesList.filter((item) => item.name === formNewFolderNameText).length > 0) {
        return true
      } else {
        return formNewFolderNameText.length === 0
      }
    }), reactionInterval.rapid);
    return () => clearTimeout(timeOutId);
  }, [filesList, formNewFolderNameText]);

  const handleNewFolder = React.useCallback(() => {
    if (!isValidFilename(formNewFolderNameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const newFolderName = formNewFolderNameText;
    setModalNewLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/file/new",
        {
          type: type,
          folderName: folderName,
          filename: newFolderName
        },
        { "": () => setModalNewLoading(false) },
        reject
      )
        .then((data) => {
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              {
                name: newFolderName,
                size: data.size,
                time: data.time,
                mtime: data.mtime,
                type: data.type
              }
            ]);
          }

          if (folderName.length === 0) {
            (type === "private" ? setPrivateFolders : setPublicFolders)(
              (folders) => [
                ...folders,
                newFolderName
              ]
            )
          };
          handleCloseNew();
          resolve();
        })
        .finally(() => setModalNewLoading(false));
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.new")
        .format(newFolderName),
      error: (data) => data
    })
  }, [
    type,
    context,
    folderName,
    formNewFolderNameText,
    setPublicFolders,
    setPrivateFolders,
    handleCloseNew
  ]);

  // uploading
  const uploadRef = React.useRef();
  const handleUploadFile = React.useCallback((filename, filebase) => {
    toast.promise(() => new Promise((resolve, reject) => {
      request(
        "POST/file/upload",
        {
          type: type,
          folderName: folderName,
          filename: filename,
          base: filebase.split(",")[1]
        },
        undefined,
        reject
      )
        .then((data) => {
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              {
                name: data.name,
                size: data.size,
                time: data.time,
                mtime: data.mtime,
                type: data.type
              }
            ]);
          }
          resolve();
        });
    }), {
      loading: context.languagePicker("modal.toast.plain.uploading"),
      success: context
        .languagePicker("modal.toast.success.upload")
        .format(filename, folderName),
      error: (data) => data
    })
  }, [type, folderName, context]);

  const handleProprocessFile = React.useCallback((event) => {
    const targetFile = event.target.files[0];
    const reader = new FileReader();
    if (targetFile === undefined) {
      return;
    }

    if (!isValidFilename(targetFile.name)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    if (filesList.filter((item) => item.name === targetFile.name).length) {
      toast.error(context.languagePicker("modal.toast.exception.identifierConflict"))
      return;
    }
    reader.readAsDataURL(targetFile);
    reader.onload = (event) => {
      handleUploadFile(targetFile.name, event.target.result);
    };
    reader.onerror = (event) => {
      const error = event.target.error;
      toast.error(
        context.languagePicker("modal.toast.error.browserError")
          .format(error.name, error.message)
      );
    }
  }, [context, filesList, handleUploadFile]);

  // paste
  const handlePaste = React.useCallback(() => {
    const originType = clipboard.path[0];
    const originFolderName = clipboard.path[1];
    toast.promise(new Promise((resolve, reject) => {
      request("POST/file/paste", {
        type: type,
        folderName: folderName
      }, {
        [Status.execErrCode.ResourcesUnexist]: () => setClipboard({ ...defaultClipboard })
      }, reject)
        .then((data) => {
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              {
                name: data.name,
                size: data.size,
                time: data.time,
                mtime: data.mtime,
                type: data.type
              }
            ]);
          }

          setClipboard((clipboard) =>
            clipboard.permanent ? clipboard : { ...defaultClipboard }
          )
          if (!clipboard.permanent && originFolderName.length === 0) {
            (originType === "private" ? setPrivateFolders : setPublicFolders)(
              (folders) => folders.filter((item) => item !== data.name)
            )
          }

          if (!clipboard.permanent && folderName.length === 0) {
            (type === "private" ? setPrivateFolders : setPublicFolders)(
              (folders) => [...folders, data.name]
            )
          }
          resolve(data.name);
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: (filename) => 
        context.languagePicker("modal.toast.success.paste")
          .format(filename, folderName),
      error: (data) => data
    })
  }, [
    clipboard.permanent,
    clipboard.path,
    context,
    type,
    folderName,
    setClipboard,
    setPublicFolders,
    setPrivateFolders
  ]);

  // states and function for rename
  const [modalRenameOpen, setModalRenameOpen] = React.useState(null);
  const [modalRenameLoading, setModalRenameLoading] = React.useState(false);
  const [modalRenameDisabled, setModalRenameDisabled] = React.useState(false);
  const [formNewFilenameText, setFormNewFilenameText] = React.useState("");
  const handleCloseRename = React.useCallback(() => {
    setModalRenameOpen(false);
    setModalRenameLoading(false);
  }, [ ]);

  React.useEffect(() => {
    const timeOutId = setTimeout(() => setModalRenameDisabled(() => {
      if (filesList.filter((item) => item.name === formNewFilenameText).length > 0) {
        return true
      } else {
        return formNewFilenameText.length === 0
      }
    }), reactionInterval.rapid);
    return () => clearTimeout(timeOutId);
  }, [filesList, modalRenameOpen, formNewFilenameText]);

  const handleRename = React.useCallback(() => {
    if (!isValidFilename(formNewFilenameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const originFilename = modalRenameOpen, newFilename = formNewFilenameText;
    setModalRenameLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/file/rename",
        {
          type: type,
          folderName: folderName,
          filename: originFilename,
          newFilename: newFilename
        },
        { "": () => setModalRenameLoading(false) },
        reject
      )
        .then((data) => {
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => filesList.map((item) =>
              item.name === originFilename
                ? {
                  ...item,
                  name: newFilename,
                  type: data.type
                } : item
            ));
          }
          if (folderName.length === 0) {
            (type === "private" ? setPrivateFolders : setPublicFolders)(
              (folders) => folders.map((item) =>
                item === originFilename ? newFilename : item
              )
            )
          }
          handleCloseRename();
          resolve();
        })
        .finally(() => setModalRenameLoading(false));
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.rename")
        .format(originFilename, newFilename),
      error: (data) => data
    })
  }, [
    context,
    type,
    folderName,
    modalRenameOpen,
    formNewFilenameText,
    setPublicFolders,
    setPrivateFolders,
    handleCloseRename
  ]);

  return (
    <RouteField
      display={display}
      path={[
        context.languagePicker(`nav.${type}`),
        ...(folderName.length ? folderName.split("/") : [])
      ]}
      link={`/${type}${folderName.length ? "/" : ""}${folderName}`}
      title={
        folderName.split("/").slice(-1)[0]
          || context.languagePicker(`nav.${type}`)
      }
      sxRaw={{
        overflowY: {
          xs: "hidden",
          sm: "hidden"
        }
      }}
      sx={{
        flexDirection: "column",
        overflowY: {
          xs: "auto",
          sm: "hidden"
        },
        overflowX: {
          xs: "auto",
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
          <Box
            className="SearchAndFilters"
            sx={{
              borderRadius: "sm",
              pb: 2,
              display: "flex",
              flexWrap: "no-wrap",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 1.5 },
              "& > *": { minWidth: { xs: "120px", md: "160px" } },
            }}
          >
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <FormControl sx={{ width: "100%" }} size="sm">
                <Input
                  autoComplete="off"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  size="sm"
                  placeholder={context.languagePicker("main.folder.viewRegulate.search")}
                  startDecorator={<SearchIcon />}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: context.isAuthority ? 1.5 : 0,
                width: { xs: "100%", sm: "auto" }
              }}
            >
              <FormControl
                size="sm"
                sx={{
                  flexGrow: 1,
                  minWidth: context.isAuthority ? "160px" : "200px"
                }}
              >
                <Select
                  size="sm"
                  placeholder={context.languagePicker("main.folder.viewRegulate.filter")}
                  slotProps={{ button: { sx: { whiteSpace: "wrap" } } }}
                  value={filter}
                  onChange={(event) => setFilter(event.target.id)}
                >
                  <Option id="All" value="All">
                    {context.languagePicker("main.folder.viewRegulate.all")}
                  </Option>
                  {filterList.map((item) => (<Option id={item} key={item} value={item}>
                    {item === "Unknown"
                      ? context.languagePicker("main.folder.viewRegulate.unknown")
                      : item === "Directory"
                      ? context.languagePicker("main.folder.viewRegulate.directory")
                      : item}
                  </Option>))}
                </Select>
              </FormControl>
              {context.isAuthority &&
                <FormControl size="sm" sx={{ justifyContent: "flex-end" }}>
                  <Dropdown>
                    <MenuButton
                      color="primary"
                      variant="solid"
                      startDecorator={<AddOutlinedIcon />}
                      size="sm"
                    >
                      {context.languagePicker("main.folder.viewRegulate.add")}
                    </MenuButton>
                    <Menu
                      size="sm"
                      placement="bottom-end"
                      sx={{ userSelect: "none" }}
                    >
                      <MenuItem onClick={() => setModalNewOpen(true)}>
                        {context.languagePicker("main.folder.addMenu.newFolder")}
                      </MenuItem>
                      <MenuItem
                        onClick={() => uploadRef.current.click()}
                        component="label"
                        disabled={folderName.length === 0}
                      >
                        {context.languagePicker("main.folder.addMenu.newFile")}
                      </MenuItem>
                      <ListDivider />
                      <MenuItem
                        onClick={handlePaste}
                        disabled={
                          (folderName.length === 0 && clipboard.directory === false)
                          || clipboard.path === null
                        }
                      >
                        {context.languagePicker("main.folder.addMenu.paste")}
                      </MenuItem>
                    </Menu>
                  </Dropdown>
                </FormControl>}
            </Box>
          </Box>
          <FileTable
            handleClickSort={handleClickSort}
            type={type}
            folderName={folderName}
            sortedFilesList={sortedFilesList}
            setModalRenameOpen={setModalRenameOpen}
            setFormNewFilenameText={setFormNewFilenameText}
            setFilesList={setFilesList}
            guard={guard}
            searcher={searcher}
            filesSorting={filesSorting}
            setClipboard={setClipboard}
            setPublicFolders={setPublicFolders}
            setPrivateFolders={setPrivateFolders}
          />
          <FileList
            type={type}
            folderName={folderName}
            sortedFilesList={sortedFilesList}
            setModalRenameOpen={setModalRenameOpen}
            setFormNewFilenameText={setFormNewFilenameText}
            setFilesList={setFilesList}
            guard={guard}
            searcher={searcher}
            setClipboard={setClipboard}
            setPublicFolders={setPublicFolders}
            setPrivateFolders={setPrivateFolders}
          />
        </React.Fragment>}
      {folderState < 0 &&
        <Caption
          title={context.languagePicker("universal.placeholder.unexist.title")}
          caption={context.languagePicker("universal.placeholder.unexist.caption")}
        />}
      <ModalForm
        open={Boolean(modalRenameOpen)}
        loading={modalRenameLoading}
        disabled={modalRenameDisabled}
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
          value={formNewFilenameText}
          onChange={(event) => setFormNewFilenameText(event.target.value)}
        />
      </ModalForm>
      <ModalForm
        open={modalNewOpen}
        disabled={modalNewDisabled}
        loading={modalNewLoading}
        handleClose={handleCloseNew}
        handleClick={handleNewFolder}
        title={context.languagePicker("modal.form.new.title")}
        caption={context.languagePicker("modal.form.new.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <Input
          autoFocus
          autoComplete="off"
          placeholder={context.languagePicker("modal.form.new.placeholder")}
          value={formNewFolderNameText}
          onChange={(event) => setFormNewFolderNameText(event.target.value)}
        />
      </ModalForm>
      <label role="button" ref={uploadRef}>
        <input
          hidden
          type="file"
          onChange={(event) => {
            handleProprocessFile(event);
            event.target.value = null;
          }}
        />
      </label>
    </RouteField>
  )
}

export default FileExplorer;
