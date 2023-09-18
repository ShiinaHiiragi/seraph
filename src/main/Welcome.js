import React from "react";
import { useTime } from "react-timer-hook";
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
  [theme.breakpoints.only("xs")]: {
    padding: theme.spacing(0, 0, 8)
  },
  [theme.breakpoints.only("sm")]: {
    padding: theme.spacing(0, 4, 8)
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(0, 8, 8)
  }
}));

const Welcome = () => {
  const context = React.useContext(GlobalContext);
  const { hours, minutes, seconds } = useTime();

  React.useEffect(() => {
    console.log(seconds);
  }, [seconds])

  return (
    <RouteField display>
      <Center className="CenterField">
        <Typography
          level="h2"
          color="neutral"
          fontWeight={400}
          sx={{ pb: 1 }}
        >
          {context.languagePicker("nav.title")}
        </Typography>
        <Typography
          level="body-lg"
          color="neutral"
          fontWeight={400}
          sx={{ pb: 2 }}
        >
          {String(hours).padStart(2, '0')}
          {":"}
          {String(minutes).padStart(2, '0')}
          {":"}
          {String(seconds).padStart(2, '0')}
        </Typography>
        <Typography
          level="body-sm"
          color="neutral"
          fontWeight={400}
        >
          INFO
        </Typography>
      </Center>
    </RouteField>
  )
}

export default Welcome;
