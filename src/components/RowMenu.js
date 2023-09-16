import React from "react";
import { toast } from "sonner";
import Divider from "@mui/joy/Divider";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import GlobalContext, { request } from "../interface/constants";

export default function RowMenu(props) {
  const {
    type,
    folderName,
    filename,
    setModalRenameOpen,
    setFormNewNameText,
    setFilesList,
    folderCount,
    setModalMoveOpen,
    setModalCopyOpen
  } = props;
  const context = React.useContext(GlobalContext);

  const handleToggleRename = React.useCallback(() => {
    setFormNewNameText(filename);
    setModalRenameOpen(filename);
  }, [setFormNewNameText, setModalRenameOpen, filename]);

  const handleDelete = React.useCallback((type, folderName, filename) => {
    request("POST/file/delete", {
      type: type,
      folderName: folderName,
      filename: filename
    })
      .then(() => {
        setFilesList((filesList) => filesList.filter(
          (item) => item.name !== filename
        ));
        toast.success(
          context
            .languagePicker("modal.toast.success.delete")
            .format(filename)
        );
      })
  }, [context, setFilesList])

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={handleToggleRename}>
          {context.languagePicker("main.folder.rowMenu.rename")}
        </MenuItem>
        <MenuItem onClick={() => setModalCopyOpen(filename)} disabled={folderCount < 2}>
          {context.languagePicker("main.folder.rowMenu.copy")}
        </MenuItem>
        <MenuItem onClick={() => setModalMoveOpen(filename)} disabled={folderCount < 2}>
          {context.languagePicker("main.folder.rowMenu.move")}
        </MenuItem>
        <Divider />
        <MenuItem
          color="danger"
          onClick={() => {
            context.setModalReconfirm({
              open: true,
              captionFirstHalf: context
                .languagePicker("modal.reconfirm.captionFirstHalf.delete")
                .format(folderName + "/" + filename),
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
