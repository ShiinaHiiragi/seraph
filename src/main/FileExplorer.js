import React from "react";
import { useParams } from "react-router";
import Fuse from "fuse.js";
import isValidFilename from "valid-filename";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import GlobalContext, {
  Status,
  toast,
  request,
  reactionInterval,
  toastDuration,
  defaultClipboard,
  pathStartWith
} from "../interface/constants";
import Loading from "./Loading";
import RouteField from "../interface/RouteField";
import SemiInput from "../interface/SemiInput";
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
  const [filesSorting, setFilesSorting] = React.useState([
    context.setting.file.sort.field,
    context.setting.file.sort.reverse
  ]);
  const [folderState, setFolderState] = React.useState(0);

  // remove duplicate file entries
  const sortedFilesList = React.useMemo(() => 
    Object
      .values(Object.fromEntries(filesList.map((item) => [item.name, item])))
      .sortBy(...filesSorting),
    [filesList, filesSorting]
  );

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (filesList.some((item) => item.type === "directory")) {
      newFilterList.unshift("Directory")
    }
    setFilterList(newFilterList);
  }, [context, filesList]);

  React.useEffect(() => {
    setSearch("");
    setFilter(null);
  }, [type, folderName]);

  React.useEffect(() => setGuard((guard) => [search, guard[1]]), [search]);
  React.useEffect(() => setGuard((guard) => [guard[0], filter]), [filter]);

  // used by modal popup
  const [modalFilename, setModalFilename] = React.useState(null);
  const [modalFileLink, setModalFileLink] = React.useState(null);

  // used by onKeyDown
  const buttonNewFolderRef = React.useRef(null);
  const buttonNewMarkdownRef = React.useRef(null);
  const buttonNewLinkRef = React.useRef(null);
  const buttonDecryptRef = React.useRef(null);
  const buttonRenameRef = React.useRef(null);
  const buttonRelinkRef = React.useRef(null);

  // new folder
  const [modalNewFolderOpen, setModalNewFolderOpen] = React.useState(false);
  const [modalNewFolderLoading, setModalNewFolderLoading] = React.useState(false);
  const [formNewFolderNameText, setFormNewFolderNameText] = React.useState("");
  const handleCloseNewFolder = React.useCallback(() => {
    setModalNewFolderOpen(false);
    setModalNewFolderLoading(false);
    setFormNewFolderNameText("");
  }, [ ]);

  const modalNewFolderDisabled = React.useMemo(
    () => filesList.some((item) => item.name === formNewFolderNameText)
      || formNewFolderNameText.length === 0,
    [filesList, formNewFolderNameText]
  );

  const handleNewFolder = React.useCallback(() => {
    if (!isValidFilename(formNewFolderNameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const newFolderName = formNewFolderNameText;
    setModalNewFolderLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/file/new",
        {
          type: type,
          folderName: folderName,
          filename: newFolderName
        },
        { "": () => setModalNewFolderLoading(false) },
        reject
      )
        .then((data) => {
          const { statusCode, errorCode, ...newInfo } = data;
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              newInfo
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
          handleCloseNewFolder();
          resolve();
        })
        .finally(() => setModalNewFolderLoading(false));
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
    handleCloseNewFolder
  ]);

  // new link
  const urlRef = React.useRef(null);
  const [modalNewLinkOpen, setModalNewLinkOpen] = React.useState(false);
  const [modalNewLinkLoading, setModalNewLinkLoading] = React.useState(false);
  const [formNewLinkNameText, setFormNewLinkNameText] = React.useState("");
  const [formNewLinkURLText, setFormNewLinkURLText] = React.useState("");
  const handleCloseNewLink = React.useCallback(() => {
    setModalNewLinkOpen(false);
    setModalNewLinkLoading(false);
    setFormNewLinkNameText("");
    setFormNewLinkURLText("");
  }, [ ]);

  const modalNewLinkDisabled = React.useMemo(
    () => filesList.some((item) => item.name === formNewLinkNameText)
      || formNewLinkNameText.length === 0
      || formNewLinkURLText.length === 0,
    [filesList, formNewLinkNameText, formNewLinkURLText]
  );

  const handleNewLink = React.useCallback(() => {
    if (!isValidFilename(formNewLinkNameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    setModalNewLinkLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/file/link",
        {
          type: type,
          folderName: folderName,
          filename: formNewLinkNameText,
          url: formNewLinkURLText
        },
        { "": () => setModalNewLinkLoading(false) },
        reject
      )
        .then((data) => {
          const { statusCode, errorCode, ...newInfo } = data;
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              newInfo
            ]);
          }
          handleCloseNewLink();
          resolve(newInfo.name);
        })
        .finally(() => setModalNewLinkLoading(false));
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: (name) => context.languagePicker("modal.toast.success.new").format(name),
      error: (data) => data
    })
  }, [
    type,
    context,
    folderName,
    formNewLinkNameText,
    formNewLinkURLText,
    handleCloseNewLink
  ]);

  // new markdown
  const [modalNewMarkdownOpen, setModalNewMarkdownOpen] = React.useState(false);
  const [modalNewMarkdownLoading, setModalNewMarkdownLoading] = React.useState(false);
  const [formNewMarkdownText, setFormNewMarkdownText] = React.useState("");
  const handleCloseNewMarkdown = React.useCallback(() => {
    setModalNewMarkdownOpen(false);
    setModalNewMarkdownLoading(false);
    setFormNewMarkdownText("");
  }, [ ]);

  const modalNewMarkdownDisabled = React.useMemo(
    () => filesList.some((item) => item.name === formNewMarkdownText + ".md"),
    [filesList, formNewMarkdownText]
  );

  const handleNewMarkdown = React.useCallback(() => {
    if (!isValidFilename(formNewMarkdownText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const newMarkdownName = formNewMarkdownText;
    setModalNewMarkdownLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/file/markdown",
        {
          type: type,
          folderName: folderName,
          filename: newMarkdownName
        },
        { "": () => setModalNewMarkdownLoading(false) },
        reject
      )
        .then((data) => {
          const { statusCode, errorCode, ...newInfo } = data;
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              newInfo
            ]);
          }
          handleCloseNewMarkdown();
          resolve();
        })
        .finally(() => setModalNewMarkdownLoading(false));
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.new")
        .format(newMarkdownName),
      error: (data) => data
    })
  }, [
    type,
    context,
    folderName,
    formNewMarkdownText,
    handleCloseNewMarkdown
  ]);

  // uploading
  const uploadRef = React.useRef();
  const [dragging, setDragging] = React.useState(false);

  const handleUploadFiles = React.useCallback((files) => {
    const total = files.length;
    const toastId = toast.loading(
      context.languagePicker("modal.toast.plain.uploading") + ` (0/${total})`,
      { duration: Infinity }
    );

    files.reduce((chain, { filename, filebase }, index) =>
      chain.then(() => {
        if (index > 0) {
          toast.loading(
            `${context.languagePicker("modal.toast.plain.uploading")} (${index}/${total})`,
            { id: toastId }
          );
        }

        return new Promise((resolve, reject) => {
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
              const { statusCode, errorCode, ...newInfo } = data;
              if (pathStartWith(`/${type}/${folderName}`)) {
                setFilesList((filesList) => [
                  ...filesList,
                  newInfo
                ]);
              }
              resolve();
            });
        });
      }),
      Promise.resolve()
    )
      .then(() => {
        toast.success(
          context.languagePicker("modal.toast.success.upload")
            .format(
              total > 1
                ? context.languagePicker("modal.toast.success.files")
                : files[0].filename,
              folderName
            ) + ` (${total}/${total})`,
          { id: toastId }
        );
        setTimeout(() => toast.dismiss(toastId), toastDuration)
      })
      .catch((error) => {
        toast.error(error, { id: toastId });
        setTimeout(() => toast.dismiss(toastId), toastDuration)
      });
  }, [type, folderName, context]);

  const handleProprocessFile = React.useCallback((files) => {
    Promise.all([...files].map((targetFile) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (!isValidFilename(targetFile.name)) {
        return reject(() =>
          toast.error(context.languagePicker("modal.toast.warning.illegalRename"))
        );
      }

      if (filesList.some((item) => item.name === targetFile.name)) {
        return reject(() =>
          toast.error(
            context.languagePicker("modal.toast.exception.identifierConflict")
              .format(targetFile.name)
          )
        );
      }

      reader.readAsDataURL(targetFile);
      reader.onload = (event) => {
        resolve({
          filename: targetFile.name,
          filebase: event.target.result
        });
      };
      reader.onerror = (event) => {
        reject(() => {
          const error = event.target.error;
          toast.error(
            context.languagePicker("modal.toast.error.browserError")
              .format(error.name, error.message)
          );
        })
      }
    })))
      .then(handleUploadFiles)
      .catch((handleReport) => handleReport())
  }, [context, filesList, handleUploadFiles]);

  const handleDragOver = React.useCallback((event) => {
    event.preventDefault();
    if (!context.isAuthority || folderName.length === 0) {
      return;
    }
    setDragging(true);
  }, [context.isAuthority, folderName]);

  const handleDragLeave = React.useCallback((event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDragging(false);
    }
  }, []);

  const handleDrop = React.useCallback((event) => {
    event.preventDefault();
    setDragging(false);
    if (!context.isAuthority || folderName.length === 0) {
      return;
    }
    if ([...event.dataTransfer.items].some((item) =>
        item.webkitGetAsEntry?.()?.isDirectory
    )) {
      toast.error(context.languagePicker("modal.toast.warning.uploadFolder"));
      return;
    }
    if (event.dataTransfer.files.length > 0) {
      handleProprocessFile(event.dataTransfer.files);
    }
  }, [context, folderName, handleProprocessFile]);

  // paste (original)
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
          const { statusCode, errorCode, ...newInfo } = data;
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              newInfo
            ]);
          }

          // e.g. cut X/a/b/c -> paste to X/a
          // then size of X/a/b should one less than origin value
          if (
            !clipboard.permanent
              && originFolderName.startsWith(folderName + "/")
              && originFolderName.split("/").length === folderName.split("/").length + 1
          ) {
            setFilesList((filesList) => filesList.map((item) =>
              item.name === originFolderName.split("/").slice(-1)[0]
                ? {
                  ...item,
                  size: item.size - 1
                }
                : item
            ));
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
  const [modalRenameOpen, setModalRenameOpen] = React.useState(false);
  const [modalRenameLoading, setModalRenameLoading] = React.useState(false);
  const [formNewFilenameText, setFormNewFilenameText] = React.useState("");
  const handleCloseRename = React.useCallback(() => {
    setModalFilename(null);
    setModalRenameOpen(false);
    setModalRenameLoading(false);
  }, [ ]);

  const modalRenameDisabled = React.useMemo(
    () => filesList.some((item) => item.name === formNewFilenameText)
      || formNewFilenameText.length === 0,
    [filesList, formNewFilenameText]
  );

  const handleRename = React.useCallback(() => {
    if (!isValidFilename(formNewFilenameText)) {
      toast.error(context.languagePicker("modal.toast.warning.illegalRename"));
      return;
    }

    const originFilename = modalFilename, newFilename = formNewFilenameText;
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
          const { statusCode, errorCode, ...newInfo } = data;
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => filesList.map((item) =>
              item.name === originFilename
                ? newInfo
                : item
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
    modalFilename,
    formNewFilenameText,
    setPublicFolders,
    setPrivateFolders,
    handleCloseRename
  ]);

  // states and function for modifying link
  const [modalRelinkOpen, setModalRelinkOpen] = React.useState(false);
  const [modalRelinkLoading, setModalRelinkLoading] = React.useState(false);
  const [formRelinkText, setFormRelinkText] = React.useState("");
  const handleCloseRelink = React.useCallback(() => {
    setModalFilename(null);
    setModalRelinkOpen(false);
    setModalRelinkLoading(false);
  }, [ ]);

  const modalRelinkDisabled = React.useMemo(
    () => formRelinkText === modalFileLink || formRelinkText.length === 0,
    [formRelinkText, modalFileLink]
  );

  const handleRelink = React.useCallback(() => {
    const filename = modalFilename;
    setModalRelinkLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/file/relink",
        {
          type: type,
          folderName: folderName,
          filename: filename,
          url: formRelinkText
        },
        { "": () => setModalRelinkLoading(false) },
        reject
      )
        .then((data) => {
          const { statusCode, errorCode, ...newInfo } = data;
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => filesList.map((item) =>
              item.name === filename
                ? newInfo
                : item
            ));
          }
          handleCloseRelink();
          resolve();
        })
        .finally(() => setModalRelinkLoading(false));
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context.languagePicker("modal.toast.success.relink"),
      error: (data) => data
    })
  }, [
    context,
    type,
    folderName,
    modalFilename,
    formRelinkText,
    handleCloseRelink
  ]);

  // states and function for decrypt
  const [modalDecryptOpen, setModalDecryptOpen] = React.useState(false);
  const [modalDecryptLoading, setModalDecryptLoading] = React.useState(false);
  const [formPrivateKeyText, setFormPrivateKeyText] = React.useState("");
  const [formPrivateKeyError, setFormPrivateKeyError] = React.useState(false);
  const handleCloseDecrypt = React.useCallback(() => {
    setModalFilename(null);
    setModalDecryptOpen(false);
    setModalDecryptLoading(false);
    setFormPrivateKeyText("");
    setFormPrivateKeyError(false);
  }, [ ]);

  const handleDecrypt = React.useCallback(() => {
    setModalDecryptLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/file/decrypt",
        {
          type: type,
          folderName: folderName,
          filename: modalFilename,
          privateKey: formPrivateKeyText
        },
        {
          "": () => setModalDecryptLoading(false),
          [Status.execErrCode.InvalidDecrypt]: () => setFormPrivateKeyError(true)
        },
        reject
      )
        .then((data) => {
          const { statusCode, errorCode, ...newInfo } = data;
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              newInfo
            ]);
          }
          handleCloseDecrypt();
          resolve();
        })
        .finally(() => setModalDecryptLoading(false));
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.decrypt")
        .format(modalFilename),
      error: (data) => data
    })
  }, [
    context,
    type,
    folderName,
    modalFilename,
    formPrivateKeyText,
    handleCloseDecrypt
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
      {folderState === 0 && <Loading pinned /> }
      {folderState === 1 &&
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minHeight: 0
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
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
                <SemiInput
                  initValue={search}
                  setValue={setSearch}
                  offset={reactionInterval.slow}
                  autoComplete="off"
                  placeholder={context.languagePicker("main.folder.viewRegulate.search")}
                  size="sm"
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
                      <MenuItem onClick={() => setModalNewFolderOpen(true)}>
                        {context.languagePicker("main.folder.addMenu.newFolder")}
                      </MenuItem>
                      <MenuItem
                        onClick={() => setModalNewLinkOpen(true)}
                        disabled={folderName.length === 0}
                      >
                        {context.languagePicker("main.folder.addMenu.newLink")}
                      </MenuItem>
                      <MenuItem
                        onClick={() => setModalNewMarkdownOpen(true)}
                        disabled={folderName.length === 0}
                      >
                        {context.languagePicker("main.folder.addMenu.newMarkdown")}
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
                          (folderName.length === 0 && !clipboard.directory)
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
            filesList={filesList}
            sortedFilesList={sortedFilesList}
            setModalFilename={setModalFilename}
            setModalFileLink={setModalFileLink}
            setModalRenameOpen={setModalRenameOpen}
            setModalRelinkOpen={setModalRelinkOpen}
            setModalDecryptOpen={setModalDecryptOpen}
            setFormNewFilenameText={setFormNewFilenameText}
            setFormRelinkText={setFormRelinkText}
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
            filesList={filesList}
            sortedFilesList={sortedFilesList}
            setModalFilename={setModalFilename}
            setModalFileLink={setModalFileLink}
            setModalRenameOpen={setModalRenameOpen}
            setModalRelinkOpen={setModalRelinkOpen}
            setModalDecryptOpen={setModalDecryptOpen}
            setFormNewFilenameText={setFormNewFilenameText}
            setFormRelinkText={setFormRelinkText}
            setFilesList={setFilesList}
            guard={guard}
            searcher={searcher}
            setClipboard={setClipboard}
            setPublicFolders={setPublicFolders}
            setPrivateFolders={setPrivateFolders}
          />
          {dragging && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                border: "2px dashed",
                borderColor: "neutral.400",
                borderRadius: "sm",
                bgcolor: "neutral.softBg",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <FileUploadOutlinedIcon
                sx={{
                  fontSize: 64,
                  color: "neutral.400"
                }}
              />
            </Box>
          )}
        </Box>}
      {folderState === -1 &&
        <Caption
          title={context.languagePicker("universal.placeholder.unexist.title")}
          caption={context.languagePicker("universal.placeholder.unexist.caption")}
        />}
      <ModalForm
        ref={buttonNewFolderRef}
        open={modalNewFolderOpen}
        disabled={modalNewFolderDisabled}
        loading={modalNewFolderLoading}
        handleClose={handleCloseNewFolder}
        handleClick={handleNewFolder}
        title={context.languagePicker("modal.form.new.title")}
        caption={context.languagePicker("modal.form.new.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <SemiInput
          initValue={formNewFolderNameText}
          setValue={setFormNewFolderNameText}
          autoFocus
          autoComplete="off"
          placeholder={context.languagePicker("modal.form.new.placeholder")}
          handleEnter={() => buttonNewFolderRef.current?.click()}
        />
      </ModalForm>
      <ModalForm
        ref={buttonNewMarkdownRef}
        open={modalNewMarkdownOpen}
        disabled={modalNewMarkdownDisabled}
        loading={modalNewMarkdownLoading}
        handleClose={handleCloseNewMarkdown}
        handleClick={handleNewMarkdown}
        title={context.languagePicker("modal.form.newMarkdown.title")}
        caption={context.languagePicker("modal.form.newMarkdown.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <SemiInput
          initValue={formNewMarkdownText}
          setValue={setFormNewMarkdownText}
          autoFocus
          autoComplete="off"
          placeholder={context.languagePicker("modal.form.newMarkdown.placeholder")}
          endDecorator=".md"
          handleEnter={() => buttonNewMarkdownRef.current?.click()}
        />
      </ModalForm>
      <ModalForm
        ref={buttonNewLinkRef}
        open={modalNewLinkOpen}
        disabled={modalNewLinkDisabled}
        loading={modalNewLinkLoading}
        handleClose={handleCloseNewLink}
        handleClick={handleNewLink}
        title={context.languagePicker("modal.form.newLink.title")}
        caption={context.languagePicker("modal.form.newLink.caption")}
        button={context.languagePicker("universal.button.submit")}
        spacing={1}
      >
        <FormControl>
          <FormLabel>{context.languagePicker("modal.form.newLink.filename")}</FormLabel>
          <SemiInput
            initValue={formNewLinkNameText}
            setValue={setFormNewLinkNameText}
            autoFocus
            autoComplete="off"
            placeholder={context.languagePicker("universal.placeholder.instruction.required")}
            endDecorator={context.metadata.platform === 'linux' ? '.desktop' : 'url'}
            handleEnter={() => urlRef.current?.focus()}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{context.languagePicker("modal.form.newLink.url")}</FormLabel>
          <SemiInput
            ref={urlRef}
            initValue={formNewLinkURLText}
            setValue={setFormNewLinkURLText}
            autoComplete="off"
            placeholder={context.languagePicker("universal.placeholder.instruction.required")}
            handleEnter={() => buttonNewLinkRef.current?.click()}
          />
        </FormControl>
      </ModalForm>
      <ModalForm
        ref={buttonDecryptRef}
        open={modalDecryptOpen}
        loading={modalDecryptLoading}
        disabled={formPrivateKeyText.length === 0}
        handleClose={handleCloseDecrypt}
        handleClick={handleDecrypt}
        title={context.languagePicker("modal.form.decrypt.title")}
        caption={context.languagePicker("modal.form.decrypt.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <SemiInput
          initValue={formPrivateKeyText}
          setValue={setFormPrivateKeyText}
          autoFocus
          autoComplete="off"
          slotProps={{
            input: {
              type: "text",
              style: {
                WebkitTextSecurity: "disc"
              }
            }
          }}
          placeholder={context.languagePicker("modal.form.decrypt.placeholder")}
          error={formPrivateKeyError}
          handleEnter={() => buttonDecryptRef.current?.click()}
        />
      </ModalForm>
      <ModalForm
        ref={buttonRenameRef}
        open={modalRenameOpen}
        loading={modalRenameLoading}
        disabled={modalRenameDisabled}
        handleClose={handleCloseRename}
        handleClick={handleRename}
        title={context.languagePicker("modal.form.rename.title")}
        caption={context.languagePicker("modal.form.rename.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <SemiInput
          initValue={formNewFilenameText}
          setValue={setFormNewFilenameText}
          selectBasename
          autoFocus
          autoComplete="off"
          placeholder={context.languagePicker("modal.form.rename.placeholder")}
          handleEnter={() => buttonRenameRef.current?.click()}
        />
      </ModalForm>
      <ModalForm
        ref={buttonRelinkRef}
        open={modalRelinkOpen}
        loading={modalRelinkLoading}
        disabled={modalRelinkDisabled}
        handleClose={handleCloseRelink}
        handleClick={handleRelink}
        title={context.languagePicker("modal.form.relink.title")}
        caption={context.languagePicker("modal.form.relink.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <SemiInput
          initValue={formRelinkText}
          setValue={setFormRelinkText}
          autoFocus
          autoComplete="off"
          placeholder={context.languagePicker("modal.form.relink.placeholder")}
          handleEnter={() => buttonRelinkRef.current?.click()}
        />
      </ModalForm>
      <label role="button" ref={uploadRef}>
        <input
          hidden
          multiple
          type="file"
          onChange={(event) => {
            handleProprocessFile(event.target.files);
            event.target.value = null;
          }}
        />
      </label>
    </RouteField>
  )
}

export default FileExplorer;
