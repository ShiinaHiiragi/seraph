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
import GlobalContext, { request } from "../interface/constants";

export default function RowMenu(props) {
  const {
    type,
    folderName,
    filename,
    setModalRenameOpen,
    setFormNewFilenameText,
    setFilesList,
    setPublicFolders,
    setPrivateFolders
  } = props;
  const context = React.useContext(GlobalContext);

  const handleToggleRename = React.useCallback(() => {
    setFormNewFilenameText(filename);
    setModalRenameOpen(filename);
  }, [setFormNewFilenameText, setModalRenameOpen, filename]);

  const handleDelete = React.useCallback((type, folderName, filename) => {
    toast.promise(new Promise((resolve, reject) => {
      request("POST/file/delete", {
        type: type,
        folderName: folderName,
        filename: filename
      }, undefined, reject)
        .then(() => {
          setFilesList((filesList) => filesList.filter(
            (item) => item.name !== filename
          ));
          if (!folderName.length) {
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
        <Divider />
        <MenuItem
          color="danger"
          onClick={() => {
            context.setModalReconfirm({
              open: true,
              captionFirstHalf: context
                .languagePicker("modal.reconfirm.captionFirstHalf.delete")
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
