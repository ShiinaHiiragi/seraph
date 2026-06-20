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

const materialTheme = materialExtendTheme();

const FAKE_CHILDREN = {
  home: [
    { id: "home-downloads", label: "Downloads", children: null },
    { id: "home-desktop", label: "Desktop", children: [] },
  ],
  documents: [
    { id: "documents-work", label: "Work", children: null },
    { id: "documents-personal", label: "Personal", children: null },
  ],
  "documents-work": [
    { id: "documents-work-q1", label: "Q1 Reports", children: [] },
    { id: "documents-work-q2", label: "Q2 Reports", children: [] },
  ],
  "documents-personal": [],
  "home-downloads": [
    { id: "home-downloads-2024", label: "2024", children: [] },
  ],
  pictures: [
    { id: "pictures-2023", label: "2023", children: [] },
    { id: "pictures-2024", label: "2024", children: [] },
  ],
};

const INITIAL_ITEMS = [
  { id: "home", label: "Home", children: null },
  { id: "documents", label: "Documents", children: null },
  { id: "pictures", label: "Pictures", children: null },
  { id: "music", label: "Music", children: [] },
];

function fakeLoad(id) {
  return new Promise(resolve =>
    setTimeout(() => resolve(FAKE_CHILDREN[id] ?? []), 800)
  );
}

function mapTree(nodes, id, updater) {
  return nodes.map(node => {
    if (node.id === id) return updater(node);
    if (node.children) return { ...node, children: mapTree(node.children, id, updater) };
    return node;
  });
}

function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function SpinnerIcon() {
  return <CircularProgress size={16} sx={{ color: "inherit" }} />;
}

function renderItems(nodes, loadingSet) {
  return nodes.map(node => {
    const isLoading = loadingSet.has(node.id);
    const isKnownLeaf = node.children !== null && node.children.length === 0;
    const hasChildren = node.children?.length > 0;

    const slots = isKnownLeaf ? {} : {
      expandIcon: isLoading ? SpinnerIcon : ChevronRightIcon,
      collapseIcon: ExpandMoreIcon,
    };

    return (
      <TreeItem key={node.id} itemId={node.id} label={node.label} slots={slots}>
        {/* stub makes unloaded nodes expandable; hidden visually */}
        {node.children === null && (
          <TreeItem itemId={`${node.id}__stub`} label="" sx={{ display: "none" }} />
        )}
        {hasChildren && renderItems(node.children, loadingSet)}
      </TreeItem>
    );
  });
}

export default function Tree(props) {
  const { open, handleClose } = props;

  const [items, setItems] = React.useState(INITIAL_ITEMS);
  const [expandedItems, setExpandedItems] = React.useState([]);
  const [loadingSet, setLoadingSet] = React.useState(new Set());

  // Refs to read latest state inside async callback without stale closures
  const itemsRef = React.useRef(items);
  const loadingSetRef = React.useRef(loadingSet);
  itemsRef.current = items;
  loadingSetRef.current = loadingSet;

  const handleExpansionToggle = React.useCallback(async (event, itemId, isExpanded) => {
    if (loadingSetRef.current.has(itemId)) return;

    if (!isExpanded) {
      setExpandedItems(prev => prev.filter(id => id !== itemId));
      return;
    }

    const node = findNode(itemsRef.current, itemId);
    if (!node) return; // stub item or unknown id

    if (node.children !== null) {
      // Already loaded (even if empty) — expand immediately
      setExpandedItems(prev => [...prev, itemId]);
      return;
    }

    // Show spinner, fetch, then expand
    setLoadingSet(prev => new Set([...prev, itemId]));
    try {
      const children = await fakeLoad(itemId);
      setItems(prev => mapTree(prev, itemId, n => ({ ...n, children })));
      setExpandedItems(prev => [...prev, itemId]);
    } finally {
      setLoadingSet(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }, []);

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
              expandedItems={expandedItems}
              onItemExpansionToggle={handleExpansionToggle}
            >
              {renderItems(items, loadingSet)}
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
