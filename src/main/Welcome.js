import React from "react";
import { useTime } from "react-timer-hook";
import { styled } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import GlobalContext, { request } from "../interface/constants";
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

const InfoField = styled('div')(({ theme }) => ({

}));

const Welcome = () => {
  const context = React.useContext(GlobalContext);
  const { hours, minutes, seconds } = useTime();

  const [version, setVersion] = React.useState("");
  const [osInfo, setOSInfo] = React.useState({ });
  const [memory, setMemory] = React.useState(1);

  React.useEffect(() => {
    request("GET/info/version").then((data) => setVersion(data.version));
    request("GET/info/os").then((data) => setOSInfo(data.os));
  }, [ ])

  React.useEffect(() => {
    request("GET/info/free").then((data) => setMemory(data.free));
  }, [minutes])

  return (
    <RouteField display>
      <Center className="CenterField">
        <Typography
          level="h2"
          color="neutral"
          fontWeight={600}
          sx={{ pb: 0.5, letterSpacing: "0.02em" }}
        >
          {context.languagePicker("nav.title")}
          <Typography
            component="span"
            level="body-md"
            color="neutral"
            fontWeight={400}
            children={"v" + version}
            sx={{ pl: 1 }}
          />
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
          {osInfo.userAtHostname}
        </Typography>
        <Typography
          level="body-sm"
          color="neutral"
          fontWeight={400}
        >
          {osInfo.platform}
        </Typography>
        <Typography
          level="body-sm"
          color="neutral"
          fontWeight={400}
        >
          {osInfo.kernelVersion}
        </Typography>
        <Typography
          level="body-sm"
          color="neutral"
          fontWeight={400}
        >
          {Number(memory).sizeFormat()}
          {" / "}
          {Number(osInfo.memory).sizeFormat()}
        </Typography>
      </Center>
    </RouteField>
  )
}

export default Welcome;
