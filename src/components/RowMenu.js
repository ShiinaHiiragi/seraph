import React from "react";
import { toast } from "sonner";
import Divider from "@mui/joy/Divider";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import GlobalContext, { request, pathStartWith } from "../interface/constants";

export default function RowMenu(props) {
  const {
    type,
    folderName,
    filename,
    setModalRenameOpen,
    setFormNewFilenameText,
    setFilesList,
    setClipboard,
    setPublicFolders,
    setPrivateFolders,
    fileType
  } = props;
  const context = React.useContext(GlobalContext);

  const handleToggleRename = React.useCallback(() => {
    setFormNewFilenameText(filename);
    setModalRenameOpen(filename);
  }, [setFormNewFilenameText, setModalRenameOpen, filename]);

  const handleCopy = React.useCallback(() => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/file/copy", {
        type: type,
        folderName: folderName,
        filename: filename
      }, undefined, reject)
        .then((data) => {
          setClipboard({
            permanent: true,
            directory: data.directory,
            path: [type, folderName, filename]
          })
          resolve();
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.copy")
        .format(filename),
      error: (data) => data
    })
  }, [
    context,
    type,
    filename,
    folderName,
    setClipboard
  ]);

  const handleCut = React.useCallback(() => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/file/cut", {
        type: type,
        folderName: folderName,
        filename: filename
      }, undefined, reject)
        .then((data) => {
          setClipboard({
            permanent: false,
            directory: data.directory,
            path: [type, folderName, filename]
          })
          resolve();
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.cut")
        .format(filename),
      error: (data) => data
    })
  }, [
    context,
    type,
    filename,
    folderName,
    setClipboard
  ]);

  const handleDelete = React.useCallback((type, folderName, filename) => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/file/delete", {
        type: type,
        folderName: folderName,
        filename: filename
      }, undefined, reject)
        .then(() => {
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => filesList.filter(
              (item) => item.name !== filename
            ));
          }
          if (folderName.length === 0) {
            (type === "private" ? setPrivateFolders : setPublicFolders)(
              (folders) => folders.filter((item) => item !== filename)
            )
          }
          resolve();
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.delete")
        .format(filename),
      error: (data) => data
    })
  }, [
    context,
    setFilesList,
    setPublicFolders,
    setPrivateFolders
  ])

  const handleCompress = React.useCallback(() => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/file/zip", {
        type: type,
        folderName: folderName,
        filename: filename
      }, undefined, reject)
        .then((data) => {
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              data.info
            ]);
          }
          resolve();
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.compress")
        .format(filename),
      error: (data) => data
    })
  }, [
    context,
    type,
    filename,
    folderName,
    setFilesList
  ]);

  const handleExtract = React.useCallback(() => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/file/unzip", {
        type: type,
        folderName: folderName,
        filename: filename
      }, undefined, reject)
        .then((data) => {
          if (pathStartWith(`/${type}/${folderName}`)) {
            setFilesList((filesList) => [
              ...filesList,
              data.info
            ]);
          }
          resolve();
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.extract")
        .format(filename),
      error: (data) => data
    })
  }, [
    context,
    type,
    filename,
    folderName,
    setFilesList
  ])

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon sx={{ display: { xs: "none", sm: "inline-flex" } }} />
        <MoreVertRoundedIcon sx={{ display: { xs: "inline-flex", sm: "none" } }} />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={handleToggleRename}>
          {context.languagePicker("main.folder.rowMenu.rename")}
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          {context.languagePicker("main.folder.rowMenu.copy")}
        </MenuItem>
        <MenuItem onClick={handleCut}>
          {context.languagePicker("main.folder.rowMenu.cut")}
        </MenuItem>
        {fileType === "directory" && folderName.length > 0 &&
          <MenuItem onClick={handleCompress}>
            {context.languagePicker("main.folder.rowMenu.compress")}
          </MenuItem>}
        {fileType === "application/zip" && folderName.length > 0 &&
          <MenuItem onClick={handleExtract}>
            {context.languagePicker("main.folder.rowMenu.extract")}
          </MenuItem>}
        <Divider />
        <MenuItem
          color="danger"
          onClick={() => {
            context.setModalReconfirm({
              open: true,
              captionFirstHalf: context
                .languagePicker("modal.reconfirm.captionFirstHalf.deleteFile")
                .format(filename),
              handleAction: () => handleDelete(type, folderName, filename)
            })
          }}
        >
          {context.languagePicker("main.folder.rowMenu.delete")}
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
