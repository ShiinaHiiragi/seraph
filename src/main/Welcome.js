import React from "react";
import { styled } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import GlobalContext from "../interface/constants";
import RouteField from "../interface/RouteField";

const Center = styled('div')(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingBottom: theme.spacing(16)
}));

const Welcome = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField display>
      <Center className="CenterField">
        <Typography
          level="h2"
          color="neutral"
          fontWeight={400}
          sx={{ paddingBottom: 1 }}
        >
          SERAPH
        </Typography>
        <Typography
          level="body-sm"
          color="neutral"
          fontWeight={400}
        >
          {new Date(Date.now()).timeFormat("hh:mm")}
        </Typography>
      </Center>
    </RouteField>
  )
}

export default Welcome;
