import React from "react";
import { useTime, useStopwatch } from "react-timer-hook";
import { styled } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import GlobalContext, {
  defaultOSInfo,
  request
} from "../interface/constants";
import RouteField from "../interface/RouteField";

const Center = styled('div')(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  marginTop: 32,
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
    days: upDays,
    hours: upHours,
    minutes: upMinutes,
    seconds: upSeconds,
    reset: upReset
  } = useStopwatch();

  const [version, setVersion] = React.useState("");
  const [osInfo, setOSInfo] = React.useState(defaultOSInfo);
  const [memory, setMemory] = React.useState(-1);
  const [storage, setStorage] = React.useState(-1);

  React.useEffect(() => {
    if (context.secondTick && context.isAuthority) {
      request("GET/info/os").then((data) => {
        setOSInfo(data.os);
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
    request("GET/info/stat").then((data) => {
      const { memory, storage } = data;
      setMemory(memory);
      setStorage(storage);
    });
  }, [minutes]);

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
          {version.length > 0 &&
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
            {osInfo.userAtHostname.length > 0 &&
              <ItemField item="userAtHostname">
                {osInfo.userAtHostname}
              </ItemField>}
            {osInfo.platform.length > 0 &&
              <ItemField item="platform">
                {String(osInfo.platform ?? "").upperCaseFirst()}
              </ItemField>}
            {osInfo.kernelVersion.length > 0 &&
              <ItemField item="kernelVersion">
                {osInfo.kernelVersion}
              </ItemField>}
            {osInfo.uptime >= 0 &&
              <ItemField item="uptime">
                {String(upDays * 24 + upHours).padStart(2, '0')}
                {":"}
                {String(upMinutes).padStart(2, '0')}
                {":"}
                {String(upSeconds).padStart(2, '0')}
              </ItemField>}
            {memory >= 0 && osInfo.memory >= 0 &&
              <ItemField item="memoryAvailable">
                {Number(memory).sizeFormat(2)}
                {" / "}
                {Number(osInfo.memory).sizeFormat(2)}
              </ItemField>}
            {storage >= 0 && osInfo.storage >= 0 &&
            <ItemField item="storageAvailable">
              {Number(storage).sizeFormat(2)}
              {" / "}
              {Number(osInfo.storage).sizeFormat(2)}
            </ItemField>}
          </InfoField>}
      </Center>
    </RouteField>
  )
}

export default Welcome;
