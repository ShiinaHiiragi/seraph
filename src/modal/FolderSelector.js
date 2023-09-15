import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Stack from "@mui/joy/Stack";
import GlobalContext from "../interface/constants";

export default function FolderSelector(props) {
  const {
    open,
    disabled,
    handleClose,
    handleClick,
    title,
    caption,
    button,
    publicFolders,
    privateFolders
  } = props;
  const context = React.useContext(GlobalContext);
  
  const [formSelectedFolder, setFormSelectedFolder] = React.useState([null, null]);
  const clearInnerState = React.useCallback(() => {
    setFormSelectedFolder([null, null]);
  }, [ ]);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        clearInnerState();
      }}
      sx={{
        userSelect: "none",
        "& ::selection": {
          background: "rgb(173, 214, 255)"
        },
        "& ::-webkit-scrollbar": {
          width: "6px",
          height: "6px"
        },
        "& ::-webkit-scrollbar-track": {
          borderRadius: 0,
          backgroundColor: "rgb(250, 250, 250)"
        },
        "& ::-webkit-scrollbar-thumb": {
          borderRadius: 0,
          backgroundColor: "rgb(190, 190, 190)"
        },
        "& html": {
          userSelect: "none",
          scrollbarColor: "rgb(190, 190, 190) rgb(250, 250, 250)"
        }
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
      >
        <Typography
          id="alert-dialog-modal-title"
          level="h2"
        >
          {title}
        </Typography>
        <Divider />
        {caption && <Typography
          id="alert-dialog-modal-description"
          textColor="text.tertiary"
        >
          {caption}
        </Typography>}
        <Stack
          spacing={2}
          sx={{ overflowY: "auto" }}
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
                {publicFolders
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
                {privateFolders
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
          <Button
            disabled={disabled || formSelectedFolder[1] === null}
            onClick={() => handleClick(clearInnerState, formSelectedFolder)}
          >
            {button}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
