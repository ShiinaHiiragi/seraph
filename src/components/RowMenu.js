import React from "react";
import Divider from "@mui/joy/Divider";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import GlobalContext from "../interface/constants";

export default function RowMenu(props) {
  const {
    type,
    folderName,
    filename,
    setModalRenameOpen,
    setFormNewNameText
  } = props;
  const context = React.useContext(GlobalContext);

  const handleToggleRename = React.useCallback(() => {
    setFormNewNameText(filename);
    setModalRenameOpen(filename);
  }, [setFormNewNameText, setModalRenameOpen, filename]);

  const handleDelete = React.useCallback(() => {
    // TODO: fill this
  }, [ ])

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
        <MenuItem>
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
              handleAction: () => handleDelete()
            })
          }}
        >
          {context.languagePicker("main.folder.rowMenu.delete")}
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
