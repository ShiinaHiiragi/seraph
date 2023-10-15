import React from "react";
import { useTime, useStopwatch } from "react-timer-hook";
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
    padding: theme.spacing(0, 0)
  },
  [theme.breakpoints.only("sm")]: {
    padding: theme.spacing(0, 4)
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(0, 8)
  }
}));

const InfoField = styled('div')(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));

const InfoItem = styled('div')(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  paddingBottom: theme.spacing(0.5)
}));

const ItemField = (props) => {
  const { item, children } = props;
  const context = React.useContext(GlobalContext);

  return (
    <InfoItem style={{ mb: 0.5 }}>
      <Typography
        level="body-sm"
        color="neutral"
        fontWeight={500}
        sx={{ minWidth: "3rem" }}
      >
        {context.languagePicker(`main.welcome.osInfo.${item}`)}
      </Typography>
      <Typography
        level="body-sm"
        color="neutral"
        fontWeight={400}
        sx={{ flexGrow: 1 }}
      >
        {children}
      </Typography>
    </InfoItem>
  )
}

const Welcome = () => {
  const context = React.useContext(GlobalContext);
  const { hours, minutes, seconds } = useTime();
  const {
    hours: upHours,
    minutes: upMinutes,
    seconds: upSeconds,
    reset: upReset
  } = useStopwatch();

  const [version, setVersion] = React.useState("");
  const [osInfo, setOSInfo] = React.useState({ });
  const [uptime, setUptime] = React.useState(0);
  const [memory, setMemory] = React.useState(0);
  const [storage, setStorage] = React.useState(0);

  React.useEffect(() => {
    if (context.secondTick && context.isAuthority) {
      request("GET/info/os").then((data) => {
        setOSInfo(data.os);
        setUptime(Math.trunc(data.os.uptime / (60 * 60)));
        const stopwatchOffset = new Date();
        stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + data.os.uptime);
        upReset(stopwatchOffset);
      });
    }
    request("GET/info/version").then((data) => setVersion(data.version));
  // eslint-disable-next-line
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
  ])

  React.useEffect(() => {
    request("GET/info/free").then((data) => {
      setMemory(data.memory);
      setStorage(data.storage);
    });
  }, [minutes]);
  React.useEffect(() => setUptime((uptime) => uptime + 1), [upHours]);

  return (
    <RouteField display>
      <Center className="CenterField">
        <Typography
          level="h2"
          color="secondary"
          fontWeight={600}
          sx={{ pb: 0.5, letterSpacing: "0.02em" }}
        >
          {context.languagePicker("nav.title")}
          {version.length &&
            <Typography
              component="span"
              level="body-md"
              color="neutral"
              fontWeight={400}
              children={"v" + version}
              sx={{ pl: 1 }}
            />}
        </Typography>
        <Typography
          level="body-lg"
          color="neutral"
          fontWeight={500}
          sx={{ pb: 2 }}
        >
          {String(hours).padStart(2, '0')}
          {":"}
          {String(minutes).padStart(2, '0')}
          {":"}
          {String(seconds).padStart(2, '0')}
        </Typography>
        {context.isAuthority &&
          <InfoField>
            <ItemField item="userAtHostname">
              {osInfo.userAtHostname}
            </ItemField>
            <ItemField item="platform">
              {osInfo.platform.upperCaseFirst()}
            </ItemField>
            <ItemField item="kernelVersion">
              {osInfo.kernelVersion}
            </ItemField>
            <ItemField item="uptime">
              {String(uptime).padStart(2, '0')}
              {":"}
              {String(upMinutes).padStart(2, '0')}
              {":"}
              {String(upSeconds).padStart(2, '0')}
            </ItemField>
            <ItemField item="memoryAvailable">
              {Number(memory).sizeFormat(2)}
              {" / "}
              {Number(osInfo.memory).sizeFormat(2)}
            </ItemField>
            <ItemField item="storageAvailable">
              {Number(storage).sizeFormat(2)}
              {" / "}
              {Number(osInfo.storage).sizeFormat(2)}
            </ItemField>
          </InfoField>}
      </Center>
    </RouteField>
  )
}

export default Welcome;
