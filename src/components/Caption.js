import React from "react";
import { styled } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import GlobalContext from "../interface/constants";

const Center = styled('div')(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const Caption = (props) => {
  const {
    title,
    caption
  } = props;
  const context = React.useContext(GlobalContext);

  return (
    <Center>
      <Typography
        level="h2"
        color="neutral"
        fontWeight={400}
        sx={{ paddingBottom: 1 }}
      >
        {title}
      </Typography>
      <Typography
        level="body-sm"
        color="neutral"
        fontWeight={400}
        sx={{ paddingBottom: 8 }}
      >
        {caption}
      </Typography>
    </Center>
  );
}

export default Caption;
