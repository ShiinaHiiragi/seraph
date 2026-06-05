import React from "react";
import { useTime, useStopwatch } from "react-timer-hook";
import { styled } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import LinearProgress from "@mui/joy/LinearProgress";
import GlobalContext, {
  defaultOSInfo,
  cpuHistoryWindow,
  Sparkline,
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

const DashCard = styled(Sheet)(({ theme }) => ({
  containerType: "inline-size",
  borderRadius: theme.radius.sm,
  padding: theme.spacing(1.5, 2),
  display: "flex",
  flexDirection: "column",
}));

const InfoPair = ({ label, value }) => (
  <Box sx={{
    display: "flex",
    flexDirection: "row",
    gap: 1,
    mb: 0.75,
    alignItems: "baseline",
    "@container (max-width: 420px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 0.25,
    },
  }}>
    <Typography
      level="body-xs"
      color="neutral"
      sx={{
        width: "30%",
        flexShrink: 0,
        "@container (max-width: 420px)": {
          width: "100%"
        }
      }}
    >
      {label}
    </Typography>
    <Typography level="body-xs">
      {value}
    </Typography>
  </Box>
);

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

  const [cpuHistory, setCpuHistory] = React.useState([]);
  const [cpuLive, setCpuLive] = React.useState(0);
  const [memFree, setMemFree] = React.useState(-1);
  const [diskFree, setDiskFree] = React.useState(-1);

  React.useEffect(() => {
    request("GET/info/version")
      .then((data) => setVersion(data.version));
  }, []);

  React.useEffect(() => {
    if (context.secondTick && context.isAuthority) {
      request("GET/info/os").then((data) => {
        setOSInfo(data.os);
        const stopwatchOffset = new Date();
        stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + data.os.uptime);
        upReset(stopwatchOffset);
      });
    }
  // eslint-disable-next-line
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
  ])

  React.useEffect(() => {
    if (context.secondTick && context.isAuthority) {
      const pollStatus = () =>
        request("GET/info/stat").then((data) => {
          setCpuLive(data.cpus);
          setCpuHistory((cpuHistory) => [
            ...cpuHistory.slice(-(cpuHistoryWindow - 1)),
            data.cpus
          ]);
          setMemFree(data.memory);
          setDiskFree(data.storage);
      });
      pollStatus();
      const id = setInterval(pollStatus, 2000);
      return () => clearInterval(id);
    }
  // eslint-disable-next-line
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
  ])

  const time = [hours, minutes, seconds]
    .map((num) => String(num).padStart(2, "0"))
    .join(":");

  const uptime = [upDays * 24 + upHours, upMinutes, upSeconds]
    .map((num) => String(num).padStart(2, "0"))
    .join(":");

  const memoryPercentage = osInfo.memory > 0 && memFree >= 0
      ? ((osInfo.memory - memFree) / osInfo.memory) * 100
      : 0;

  const storagePercentage = osInfo.storage > 0 && diskFree >= 0
      ? ((osInfo.storage - diskFree) / osInfo.storage) * 100
      : 0;

  if (!context.isAuthority) {
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
            sx={{ pb: 2, fontVariantNumeric: "tabular-nums" }}
          >
            {time}
          </Typography>
        </Center>
      </RouteField>
    );
  }

  return (
    <RouteField
      display
      path={[]}
      title={
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexShrink: 0,
            px: 3,
            pb: 1.5
          }}
        >
          <Typography level="h3" fontWeight={600}>
            {context.languagePicker("nav.title")}
            {version.length > 0 && (
              <Typography
                component="span"
                level="body-md"
                color="neutral"
                fontWeight={400}
                children={"v" + version}
                sx={{ pl: 1 }}
              />
            )}
          </Typography>
          <Typography
            level="body-lg"
            color="neutral"
            fontWeight={500}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {time}
          </Typography>
        </Box>
      }
      sx={{
        flexDirection: "column",
        overflowY: "auto"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          gap: 1.5
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(3, 1fr)"
            },
            gap: 1.5,
            flexShrink: 0
          }}
        >
          <DashCard variant="outlined">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em" }}
            >
                {context.languagePicker("main.welcome.osInfo.memoryAvailable")}
              </Typography>
              {osInfo.memory > 0 && (
                <Typography
                  level="title-lg"
                  fontWeight={600}
                  sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
                >
                  {memoryPercentage.toFixed(0)}%
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
                my: 1,
              }}
            >
              <Box>
                <LinearProgress
                  determinate
                  value={memoryPercentage}
                  color="primary"
                />
              </Box>
            </Box>
            {memFree >= 0 && osInfo.memory > 0 && (
              <Typography level="body-xs" color="neutral">
                {Number(memFree).sizeFormat(1)} / {Number(osInfo.memory).sizeFormat(1)}
              </Typography>
            )}
          </DashCard>

          <DashCard variant="outlined">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em" }}
            >
                {context.languagePicker("main.welcome.osInfo.storageAvailable")}
              </Typography>
              {osInfo.storage > 0 && (
                <Typography
                  level="title-lg"
                  fontWeight={600}
                  sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
                >
                  {storagePercentage.toFixed(0)}%
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                my: 1,
              }}
            >
              <Box>
                <LinearProgress
                  determinate
                  value={storagePercentage}
                  color="primary"
                />
              </Box>
            </Box>
            {diskFree >= 0 && osInfo.storage > 0 && (
              <Typography level="body-xs" color="neutral">
                {Number(diskFree).sizeFormat(1)} / {Number(osInfo.storage).sizeFormat(1)}
              </Typography>
            )}
          </DashCard>

          <DashCard variant="outlined">
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em" }}
            >
              {context.languagePicker("main.welcome.osInfo.uptime")}
            </Typography>
            <Typography
              level="h3"
              fontWeight={500}
              sx={{
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
                flex: 1,
                display: "flex",
                alignItems: "center",
                my: 1
              }}
            >
              {uptime}
            </Typography>
            {osInfo.userAtHostname?.length > 0 && (
              <Typography level="body-xs" color="neutral" sx={{ fontFamily: "var(--joy-fontFamily-code)" }}>
                {osInfo.userAtHostname}
              </Typography>
            )}
          </DashCard>
        </Box>

        <DashCard variant="outlined">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em" }}
            >
              CPU
            </Typography>
            <Typography
              level="title-lg"
              fontWeight={600}
              sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
            >
              {(cpuLive * 100).toFixed(2)}%
            </Typography>
          </Box>
          <Box sx={{ mt: 0.5, mb: 1.5 }}>
            <Sparkline data={cpuHistory} height={80} />
          </Box>
          <Typography level="body-xs" color="neutral">
            {osInfo.cpus?.cores ?? "—"} cores
          </Typography>
        </DashCard>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          <DashCard variant="outlined" sx={{ overflow: "auto", gap: 0 }}>
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em", mb: 1.5 }}
            >
              System
            </Typography>
            {osInfo.platform?.length > 0 && (
              <InfoPair
                label={context.languagePicker("main.welcome.osInfo.platform")}
                value={String(osInfo.platform).upperCaseFirst()}
              />
            )}
            {osInfo.kernelVersion?.length > 0 && (
              <InfoPair
                label={context.languagePicker("main.welcome.osInfo.kernelVersion")}
                value={osInfo.kernelVersion}
              />
            )}
            {osInfo.cpus?.model && (
              <InfoPair label="CPU Model" value={osInfo.cpus.model} />
            )}
            {osInfo.cpus?.cores != null && (
              <InfoPair label="CPU Speed" value={`${osInfo.cpus.speed} MHz`} />
            )}
            {osInfo.cpus?.cores != null && (
              <InfoPair label="CPU Cores" value={String(osInfo.cpus.cores)} />
            )}
          </DashCard>

          <DashCard variant="outlined" sx={{ overflow: "auto", gap: 0 }}>
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em", mb: 1.5 }}
            >
              Netword Interfaces
            </Typography>
            {osInfo.network &&
              Object.entries(osInfo.network).flatMap(([name, ifaces]) =>
                ifaces.map((iface) => (
                  <InfoPair
                    key={`${name}-${iface.address}`}
                    label={name}
                    value={iface.address}
                  />
                ))
              )}
          </DashCard>
        </Box>
      </Box>
    </RouteField>
  );
};

export default Welcome;
