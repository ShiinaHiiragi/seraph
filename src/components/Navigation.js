import * as React from "react";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography"
import GreyLogo from "../logo-grey.svg";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DoneIcon from "@mui/icons-material/Done";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import GlobalContext from "../interface/constants";

export default function Navigation() {
  const context = React.useContext(GlobalContext);

  return (
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      <ListItem sx={{ paddingLeft: 0, display: { xs: "inline-flex", sm: "none" } }}>
        <IconButton disabled sx={{ paddingLeft: "0px" }}>
          <img src={GreyLogo} width={24} height={24} alt="" />
        </IconButton>
        <Typography component="h1" fontWeight="lg" sx={{ letterSpacing: "0.06em" }}>
          {context.languagePicker("nav.title")}
        </Typography>
      </ListItem>
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
          <ListItem>
            <ListItemButton>
              <ListItemDecorator>
                <FolderOpenIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>Folder 03</ListItemContent>
            </ListItemButton>
          </ListItem>
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
          <ListItem>
            <ListItemButton>
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
          {context.languagePicker("nav.utility.title")}
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
              <ListItemContent>{context.languagePicker("nav.utility.archive")}</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <CloudOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.deposit")}</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <EventNoteOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.milkdown")}</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <DoneIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.todo")}</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}
