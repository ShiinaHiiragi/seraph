import * as React from "react";
import Box from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import CircularProgress from "@mui/material/CircularProgress";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GlobalContext, { request } from "../interface/constants";

const materialTheme = materialExtendTheme();
const SpinnerIcon = () =>
  <CircularProgress size={16} sx={{ color: "inherit" }} />;

const findNode = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    };
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

const mapTree = (nodes, id, handleUpdate) => 
  nodes.map((node) => node.id === id
    ? handleUpdate(node)
    : node.children
    ? {
      ...node,
      children: mapTree(node.children, id, handleUpdate)
    }
    : node
  )

const renderItems = (nodes, loadingSet) => 
  nodes.map((node) => {
    const isLoading = loadingSet.has(node.id);
    const isKnownLeaf = node.children !== null && node.children.length === 0;
    const hasChildren = node.children?.length > 0;

    const slots = isKnownLeaf ? {} : {
      expandIcon: isLoading ? SpinnerIcon : ChevronRightIcon,
      collapseIcon: ExpandMoreIcon,
    };

    return (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={node.label}
        slots={slots}
        sx={{
          marginTop: "1px",
          marginBottom: "2px",
          wordBreak: "normal",
          overflowWrap: "anywhere",
          borderRadius: "var(--ListItem-radius) !important",
          "& .MuiTreeItem-content:hover": {
            backgroundColor: "var(--joy-palette-neutral-plainHoverBg)"
          },
          "& .MuiTreeItem-content.Mui-selected": {
            backgroundColor: "var(--joy-palette-neutral-plainActiveBg)"
          }
        }}
      >
        {node.children === null && (
          <TreeItem itemId={`${node.id}__stub`} label="" sx={{ display: "none" }} />
        )}
        {hasChildren && renderItems(node.children, loadingSet)}
      </TreeItem>
    );
  });

export default function Tree(props) {
  const { open, handleClose } = props;
  const context = React.useContext(GlobalContext);

  const [folderList, setFolderList] = React.useState([
    {
      id: "/public",
      label: "Public",
      children: context.sortedPublicFolders.map((name) => ({
        id: `/public/${name}`,
        label: name,
        children: null
      }))
    },
    {
      id: "/private",
      label: "Private",
      children: context.sortedPrivateFolders.map((name) => ({
        id: `/private/${name}`,
        label: name,
        children: null
      }))
    }
  ]);

  const [expandedItem, setExpandedItem] = React.useState(["/public", "/private"]);
  const [loadingSet, setLoadingSet] = React.useState(new Set());

  // ref to read latest state inside async callback without stale closures
  const folderListRef = React.useRef(folderList);
  const loadingSetRef = React.useRef(loadingSet);
  folderListRef.current = folderList;
  loadingSetRef.current = loadingSet;

  const handleExpansionToggle = React.useCallback(
    (_, itemID, needExpand) => {
      if (loadingSetRef.current.has(itemID)) {
        return;
      }

      if (!needExpand) {
        setExpandedItem((expandedItem) =>
          expandedItem.filter(id => id !== itemID)
        );
        return;
      }

      const node = findNode(folderListRef.current, itemID);
      if (node.children !== null) {
        setExpandedItem((expandedItem) =>
          [...expandedItem, itemID]
        );
        return;
      }

      setLoadingSet((loadingSet) => new Set([...loadingSet, itemID]));
      request(
        `GET/folder${itemID}`,
        { "abstract": "1" }
      )
        .then((data) => {
          const children = data.info
            .filter((item) => item.type === "directory")
            .map((item) => ({
              id: `${itemID}/${item.name}`,
              label: item.name,
              children: null
            }));
          setFolderList((folderList) => mapTree(
            folderList,
            itemID,
            (nodes) => ({ ...nodes, children })
          ));
          setExpandedItem((expandedItem) => [...expandedItem, itemID]);
        })
        .finally(() => {
          setLoadingSet((loadingSet) => {
            const next = new Set(loadingSet);
            next.delete(itemID);
            return next;
          });
        })
    },
    []
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        userSelect: "none",
        "& ::selection": {
          background: "var(--joy-palette-neutral-softActiveBg)"
        },
        "& ::-webkit-scrollbar-track": {
          borderRadius: 0,
          backgroundColor: "var(--joy-palette-background-body)"
        },
        "& ::-webkit-scrollbar-thumb": {
          borderRadius: 0,
          backgroundColor: "var(--joy-palette-scrollbarThumb)"
        },
        "& html": {
          userSelect: "none",
          scrollbarColor: "var(--joy-palette-scrollbarThumb) var(--joy-palette-background-body)"
        }
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
        sx={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <Typography
          id="alert-dialog-modal-title"
          level="h2"
        >
          Select Directory
        </Typography>
        <Divider />
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }}
        >
          <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
            <SimpleTreeView
              expandedItems={expandedItem}
              onItemExpansionToggle={handleExpansionToggle}
            >
              {renderItems(folderList, loadingSet)}
            </SimpleTreeView>
          </MaterialCssVarsProvider>
        </Box>
        <Button onClick={handleClose}>
          Confirm
        </Button>
      </ModalDialog>
    </Modal>
  );
}
