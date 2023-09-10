import * as React from "react";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography"

// Icons import
import GreyLogo from "../logo-grey.svg";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";

export default function Navigation() {
  return (
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      <ListItem sx={{ paddingLeft: 0, display: { xs: "inline-flex", sm: "none" } }}>
        <IconButton disabled sx={{ paddingLeft: "0px" }}>
          <img src={GreyLogo} width={24} height={24} alt=""/>
        </IconButton>
        <Typography component="h1" fontWeight="lg" sx={{ letterSpacing: "0.06em" }}>
          SERAPH
        </Typography>
      </ListItem>
      <ListItem nested>
        <ListSubheader>
          File
        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            "& .JoyListItemButton-root": { p: "8px" },
          }}
        >
          <ListItem>
            <ListItemButton selected>
              <ListItemDecorator>
                <FolderOpenIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Folder 01</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator>
                <FolderOpenIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Folder 02</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>

      <ListItem nested>
        <ListSubheader>
          Utility
        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            "& .JoyListItemButton-root": { p: "8px" },
          }}
        >
          <ListItem>
            <ListItemButton>
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <ShareOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Links</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
          <ListItemButton>
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <EventNoteOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Milkdown</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}
