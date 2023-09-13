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
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import DoneIcon from "@mui/icons-material/Done";
import GlobalContext, { globalState } from "../interface/constants";
import { pathStartWith } from "../interface/constants";
import { useNavigate } from "react-router-dom";

export default function Navigation(props) {
  const {
    publicFolders,
    privateFolders,
    setDrawerOpen
  } = props;
  const context = React.useContext(GlobalContext);
  const navigate = useNavigate();

  const isAuthority = context.globalSwitch === globalState.AUTHORITY;
  const navigateTo = React.useCallback((pathname) => {
    navigate(pathname);
    setDrawerOpen(false);
  }, [navigate, setDrawerOpen]);

  return (
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      <ListItem sx={{ paddingLeft: 0, display: { xs: "inline-flex", sm: "inline-flex", md: "none" } }}>
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
          {publicFolders.map((item, index) => (
            <ListItem key={index}>
              <ListItemButton
                selected={pathStartWith(`/public/${item.name}`)}
                onClick={() => navigateTo(`/public/${item.name}`)}
              >
                <ListItemDecorator>
                  <FolderOpenIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>{item.name}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>

      {isAuthority && <ListItem nested>
        <ListSubheader>
          {context.languagePicker("nav.private")}
        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            "& .JoyListItemButton-root": { p: "8px" },
          }}
        >
          {privateFolders.map((item, index) => (
            <ListItem key={index}>
              <ListItemButton
                selected={pathStartWith(`/private/${item.name}`)}
                onClick={() => navigateTo(`/private/${item.name}`)}
              >
                <ListItemDecorator>
                  <FolderOpenIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>{item.name}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>}

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
          {isAuthority && <ListItem>
            <ListItemButton
              selected={pathStartWith("/archive")}
              onClick={() => navigateTo("/archive")}
            >
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <CloudOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.archive")}</ListItemContent>
            </ListItemButton>
          </ListItem>}
          {isAuthority && <ListItem>
            <ListItemButton
              selected={pathStartWith("/links")}
              onClick={() => navigateTo("/links")}
            >
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <ShareOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.links")}</ListItemContent>
            </ListItemButton>
          </ListItem>}
          <ListItem>
            <ListItemButton
              selected={pathStartWith("/milkdown")}
              onClick={() => navigateTo("/milkdown")}
            >
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <EventNoteOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.milkdown")}</ListItemContent>
            </ListItemButton>
          </ListItem>
          {isAuthority && <ListItem>
            <ListItemButton
              selected={pathStartWith("/subscription")}
              onClick={() => navigateTo("/subscription")}
            >
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <ForwardToInboxOutlinedIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.subscription")}</ListItemContent>
            </ListItemButton>
          </ListItem>}
          {isAuthority && <ListItem>
            <ListItemButton
              selected={pathStartWith("/todo")}
              onClick={() => navigateTo("/todo")}
            >
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <DoneIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{context.languagePicker("nav.utility.todo")}</ListItemContent>
            </ListItemButton>
          </ListItem>}
        </List>
      </ListItem>
    </List>
  );
}
