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

const InDevelopment = () => {
  const context = React.useContext(GlobalContext);

  return (
    <Center>
      <Typography level="h2" color="neutral" fontWeight={400} sx={{ paddingBottom: 1 }}>
        {context.languagePicker("universal.inDevelopment")}
      </Typography>
      <Typography level="body-sm" color="neutral" fontWeight={400} sx={{ paddingBottom: 8 }}>
        {context.languagePicker("universal.inDevelopmentCaption")}
      </Typography>
    </Center>
  );
}

export default InDevelopment;
