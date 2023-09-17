import React from "react";
import { toast } from "sonner";
import { useParams } from "react-router";
import Fuse from "fuse.js";
import isValidFilename from "valid-filename";
import Input from "@mui/joy/Input";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import SearchIcon from "@mui/icons-material/Search";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
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
    ), 500);
    return () => clearTimeout(timeOutId);
  }, [search]);

  React.useEffect(() => setGuard((guard) => [
    guard[0],
    filter
  ]), [filter]);

  // uploading
  const handleUploadFile = React.useCallback((filename, filebase) => {
    toast.promise(() => new Promise((resolve, reject) => {
      request("POST/file/upload", {
        type: type,
        folderName: folderName,
        filename: filename,
        base: filebase.split(",")[1]
      }, { "": reject })
        .then((data) => {
          setFilesList((filesList) => [
            ...filesList,
            {
              name: filename,
              size: data.size,
              time: data.time,
              mtime: data.mtime,
              type: data.type
            }
          ])
          resolve();
        });
    }), {
      loading: context.languagePicker("modal.toast.plain.uploading"),
      success: context
        .languagePicker("modal.toast.success.upload")
        .format(filename, folderName),
      error: context.languagePicker("modal.toast.warning.generalPromise")
    })
  }, [type, folderName, context]);

  const handleProprocessFile = React.useCallback((event) => {
    const targetFile = event.target.files[0];
    const reader = new FileReader();
    if (targetFile === undefined) {
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
  }, [context, handleUploadFile]);

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

  return (
    <RouteField
      display={display}
      path={[
        context.languagePicker(`nav.${type}`),
        ...(folderName.length ? folderName.split("/") : [])
      ]}
      link={`/${type}${folderName.length ? "/" : ""}${folderName}`}
      title={folderName.split("/").slice(-1)}
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
            <Box sx={{ display: "flex", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
              <FormControl size="sm" sx={{ flexGrow: 1, minWidth: "160px" }}>
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
              <FormControl size="sm" sx={{ justifyContent: "flex-end" }}>
                <Button
                  component="label"
                  color="primary"
                  startDecorator={<UploadRoundedIcon />}
                  size="sm"
                >
                  {context.languagePicker("main.folder.viewRegulate.upload")}
                  <input
                    type="file"
                    onChange={(event) => {
                      handleProprocessFile(event);
                      event.target.value = null;
                    }}
                    hidden
                  />
                </Button>
              </FormControl>
            </Box>
          </Box>
          <FileTable
            handleClickSort={handleClickSort}
            type={type}
            folderName={folderName}
            sortedFilesList={sortedFilesList}
            setModalRenameOpen={setModalRenameOpen}
            setFormNewNameText={setFormNewNameText}
            setFilesList={setFilesList}
            guard={guard}
            searcher={searcher}
            filesSorting={filesSorting}
          />
          <FileList
            type={type}
            folderName={folderName}
            sortedFilesList={sortedFilesList}
            setModalRenameOpen={setModalRenameOpen}
            setFormNewNameText={setFormNewNameText}
            setFilesList={setFilesList}
            guard={guard}
            searcher={searcher}
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
    </RouteField>
  )
}

export default FileExplorer;
