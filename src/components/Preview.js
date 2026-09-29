import React from "react";
import { Popper } from "@mui/base/Popper";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import GlobalContext from "../interface/constants";

export default function ImagePreview({ anchorEl, src, name }) {
  const context = React.useContext(GlobalContext);
  const [status, setStatus] = React.useState("loading");
  const popperRef = React.useRef(null);

  React.useLayoutEffect(() => {
    popperRef.current?.update();
  }, [status]);

  return (
    <Popper
      open
      anchorEl={anchorEl}
      popperRef={popperRef}
      placement="right-start"
      modifiers={[
        { name: "offset", options: { offset: [0, 12] } },
        { name: "flip", options: { fallbackPlacements: ["left-start", "bottom-start", "top-start"] } },
        { name: "preventOverflow", options: { padding: 8 } }
      ]}
      style={{ zIndex: 1300, pointerEvents: "none" }}
    >
      <Sheet
        variant="outlined"
        sx={{ p: 1, borderRadius: "sm", boxShadow: "md", bgcolor: "background.popup" }}
      >
        <Box sx={{
          width: status === "loaded" ? "auto" : 160,
          height: status === "loaded" ? "auto" : 90,
          display: "grid",
          placeItems: "center"
        }}>
          {status === "loading" && <CircularProgress size="sm" />}
          {status === "error" && (
            <Typography level="body-sm">
              {context.languagePicker("main.folder.previewUnavailable")}
            </Typography>
          )}
          <Box
            component="img"
            src={src}
            alt={name}
            decoding="async"
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            sx={{
              display: status === "loaded" ? "block" : "none",
              width: "auto",
              height: "auto",
              maxWidth: 320,
              maxHeight: 240,
              objectFit: "contain"
            }}
          />
        </Box>
      </Sheet>
    </Popper>
  );
}
