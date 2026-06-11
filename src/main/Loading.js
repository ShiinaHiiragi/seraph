import React from "react";
import Box from "@mui/joy/Box";

const Loading = ({ pinned }) => (
  <Box sx={{
    position: pinned ? "absolute" : "relative",
    ...(pinned && { top: 0, left: 0, right: 0, zIndex: 1 }),
    overflow: "hidden",
    background: "transparent",
    height: { xs: 1.5, sm: 2.5 }
  }}>
    <Box sx={{
      position: "absolute",
      height: "100%",
      borderRadius: "var(--joy-radius-sm)",
      background: `linear-gradient(
        90deg,
        var(--joy-palette-primary-400),
        var(--joy-palette-primary-500) 25%,
        var(--joy-palette-primary-500) 75%,
        var(--joy-palette-primary-400)
      )`,
      "@keyframes comet": {
        "0%":   { left: "-90%", width: "10%" },
        "50%":  { width: "80%" },
        "100%": { left: "110%", width: "10%" },
      },
      animation: "comet 1.6s ease-in-out infinite"
    }} />
  </Box>
);

export default Loading;
