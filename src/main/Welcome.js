import React from "react";
import { useTime, useStopwatch } from "react-timer-hook";
import { styled } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import LinearProgress from "@mui/joy/LinearProgress";
import GlobalContext, {
  defaultOSInfo,
  maxHistoryWindow,
  vacantTolerance,
  formatFree,
  clipInterval,
  request,
  Sparkline
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

const InfoPair = ({ label, value, keyWidth, sxValue }) => (
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
        width: keyWidth ?? "30%",
        flexShrink: 0,
        "@container (max-width: 420px)": {
          width: "100%"
        }
      }}
    >
      {label}
    </Typography>
    <Typography level="body-xs" sx={{ ...sxValue }}>
      {value}
    </Typography>
  </Box>
);

// TODO: add network
// TODO: add process list
// TODO: add related configs
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
  const [history, setHistory] = React.useState([]);

  const historyRef = React.useRef({ lastRequest: -1, future: [] });
  const intervalRef = React.useRef(context.setting.welcome.interval);
  const timeoutRef = React.useRef(null);
  const cancelRef = React.useRef(false);

  /**
   * 流程介绍：假设 setting.welcome.interval 为 3s，代表
   *   - React.useEffect 将最新 3 条记录存入 historyRef，之后每秒更新 history
   *     - 这样可以每秒更新 CPU 数据，但只需要每 interval 秒请求一次服务器
   *     - 为了实现近似每秒更新，需要每次计算下一次更新前的等待时间
   *     - 这是因为 request 的时间不确定，setInterval 难以控制
   *   - 假设 t=0 更新 historyRef 中最后一条数据，并发出 request，在 t=0.3s 时收到更新
   *     - 此时距离下次 request 还剩 2.7s，自然可以想到平均每 0.9s 更新一次 CPU
   *     - 但这样的更新间隔将是 0.9s、0.9s、0.9+0.3s 的循环
   *   - 事实上，当剩余秒数 timeRemain 和剩余 CPU 数据数量 itemRemain 差不多时
   *     - 可以计算 itemRemain 应该在 timeRemain 为多少时更新 CPU
   *     - 例如，t=0.3 时，timeRemain=2.7，应该在 timeAlign=2 时更新数据，此时要等待 0.7s
   *     - 之后 timeRemain=2，timeAlign=1，此时要等待 timeRemain - timeAlign = 1s，依此类推
   *   - 但是如果 timeRemain 和 itemRemain 差了很多
   *     - 这种情况可能发生吗？很有可能
   *       - 当服务器存储的历史数据不够多时，itemRemain 可能会远少于 timeRemain
   *       - 当用户手动调节 interval 时，两者差距可能会很大
   *       - 但是如果 interval 保持不变，itemRemain 不大可能会远多于 timeRemain
   *       - 即使因为网络拥堵导致 itemRemain 堆积，updateHistory 也将多余的 item 放入 history
   *     - 那么在两者差距很大的情况下，能否直接用 timeRemain / itemRemain 计算？
   *       - 可以，而且这样一次用 timeRemain 的时间更新 itemRemain 次 CPU，下次就能获取到正确的数据数量
   *       - 但是更新间隔太大或者太小对于体验不够良好，因此增加了 clip 裁剪
   *       - 加入 clip 后，经过几轮请求依然可以让请求到的数据规模收敛到 interval，只是稍慢一些
   *   - 特别地，如果 itemRemain 比 timeRemain 稍大一些，timeAlign 在 -1000 ~ 0 之间
   *     - 这说明 itemRemain 比 timeAlign 大概多了 1，按 timeAlign 的方法论应该立即执行一次更新
   *     - 但这意味着在约 0.3s 的 request 之间更新了两次，不如直接返回平均值，实际效果更加平滑
   */
  const waitTime = React.useCallback((interval) => {
    const dueTime = historyRef.current.lastRequest + interval * 1000;
    const timeRemain = Math.max(dueTime - Date.now(), 0);
    const itemRemain = historyRef.current.future.length;
    const timeAlign = timeRemain - (itemRemain - 1) * 1000;

    return timeAlign > 0 && timeAlign < 1000
      ? timeAlign
      : clipInterval(timeRemain / itemRemain)
  }, []);

  const updateHistory = React.useCallback((lastTime) => {
    if (cancelRef.current) {
      return;
    }

    if (historyRef.current.future.length > 0) {
      const nextItem = historyRef.current.future.shift();
      lastTime = nextItem.time;
      setHistory((history) => [...history, nextItem].slice(-maxHistoryWindow));
    }

    // need instant update if page is frozen
    if (
      historyRef.current.future.length > 0
        && (Date.now() - lastTime < 2 * intervalRef.current * 1000)
    ) {
      timeoutRef.current = setTimeout(
        () => updateHistory(lastTime),
        waitTime(intervalRef.current)
      );
    } else {
      historyRef.current.lastRequest = Date.now();
      historyRef.current.future.length = 0;
      request("GET/info/stat", { after: lastTime })
        .then((data) => {
          if (cancelRef.current) {
            return;
          }
          const { history: newHistory } = data;
          historyRef.current.future = newHistory.slice(-intervalRef.current);
          const unsynced = newHistory.slice(0, -intervalRef.current);
          if (unsynced.length > 0) {
            const timeGap = unsynced[0].time - lastTime;
            const vacancy = timeGap > vacantTolerance
              ? Math.min(Math.floor((timeGap) / 1000), maxHistoryWindow)
              : 0;
            setHistory((history) => {
              lastTime = history.slice(-1)[0].time;
              return [
                ...history,
                ...[...Array(vacancy)].map((_, index) => ({
                  cpu: 0,
                  net: 0,
                  time: lastTime + index
                })),
                ...unsynced
              ].slice(-maxHistoryWindow)
            })
          }
          timeoutRef.current = setTimeout(
            () => updateHistory(lastTime),
            waitTime(intervalRef.current)
          );
        });
    }
  // waitTime actually never changes
  // setTimeout will use original updateHistory forever
  }, [waitTime]);

  React.useEffect(() => {
    intervalRef.current = context.setting.welcome.interval;
  }, [context.setting.welcome.interval]);

  React.useEffect(() => {
    request("GET/info/version")
      .then((data) => setVersion(data.version));
  }, []);

  React.useEffect(() => {
    if (context.secondTick && context.isAuthority) {
      cancelRef.current = false;
      historyRef.current.lastRequest = Date.now()
      Promise.all([
        request("GET/info/os"),
        request("GET/info/stat", { after: 0 })
      ])
        .then(([osData, statData]) => {
          if (cancelRef.current) {
            return;
          }
          const { statusCode: _, ...osInfo } = osData;
          setOSInfo(osInfo);
          const stopwatchOffset = new Date();
          stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + osInfo.uptime);
          upReset(stopwatchOffset);

          const { history: newHistory } = statData;
          const historyInit = newHistory.slice(0, -context.setting.welcome.interval);
          setHistory(historyInit);
          historyRef.current.future = newHistory.slice(-context.setting.welcome.interval);
          timeoutRef.current = setTimeout(
            () => updateHistory(historyInit.slice(-1)?.[0]?.time ?? 0),
            waitTime(context.setting.welcome.interval)
          );
        });

      return () => {
        cancelRef.current = true;
        clearTimeout(timeoutRef.current);
      };
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

  const cpuUsage = history.abstract((item) => item.cpu);
  const memoryUsage = history.abstract((item) => item.mem);
  const storageUsage = history.abstract((item) => item.disk);
  // const rxUsage = history.abstract((item) => item.net.rxBPS);
  // const txUsage = history.abstract((item) => item.net.txBPS);

  const cpuTrend = history.map(({ cpu }) => cpu);
  // const memoryTrend = history.map(({ mem }) => mem);
  // const storageTrend = history.map(({ disk }) => disk);
  // const rxTrend = history.map(({ net }) => net.rxBPS);
  // const txTrend = history.map(({ net }) => net.txBPS);

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
              lg: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)"
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
                {context.languagePicker("main.welcome.kpiCards.cpu")}
              </Typography>
              {history.length > 0 &&
                <Typography
                  level="title-lg"
                  fontWeight={600}
                  sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
                >
                  {(cpuUsage.latest * 100).toFixed(1)}%
                </Typography>}
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
                {history.length > 0 &&
                  <LinearProgress
                    determinate
                    value={cpuUsage.latest * 100}
                    color="primary"
                  />}
              </Box>
            </Box>
            {osInfo.cpus.cores > 0 && osInfo.cpus.speed > 0 &&
              <Typography level="body-xs" color="neutral">
                {osInfo.cpus.cores}
                {" "}
                {context.languagePicker("main.welcome.kpiCards.cores")}
                {" / "}
                {osInfo.cpus.speed}
                {" MHz"}
              </Typography>}
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
                {context.languagePicker("main.welcome.kpiCards.memory")}
              </Typography>
              {history.length > 0 && osInfo.memory > 0 &&
                <Typography
                  level="title-lg"
                  fontWeight={600}
                  sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
                >
                  {formatFree(memoryUsage.latest, osInfo.memory).toFixed(1)}%
                </Typography>}
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
                {history.length > 0 && osInfo.memory > 0 &&
                  <LinearProgress
                    determinate
                    value={formatFree(memoryUsage.latest, osInfo.memory)}
                    color="primary"
                  />}
              </Box>
            </Box>
            {history.length > 0 && osInfo.memory > 0 && (
              <Typography level="body-xs" color="neutral">
                {Number(memoryUsage.latest).sizeFormat(1)} / {Number(osInfo.memory).sizeFormat(1)}
                {" "}
                {context.languagePicker("main.welcome.kpiCards.available")}
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
                {context.languagePicker("main.welcome.kpiCards.storage")}
              </Typography>
              {history.length > 0 && osInfo.storage > 0 &&
                <Typography
                  level="title-lg"
                  fontWeight={600}
                  sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
                >
                  {formatFree(storageUsage.latest, osInfo.storage).toFixed(1)}%
                </Typography>}
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
                {history.length > 0 && osInfo.storage > 0 &&
                  <LinearProgress
                    determinate
                    value={formatFree(storageUsage.latest, osInfo.storage)}
                    color="primary"
                  />}
              </Box>
            </Box>
            {history.length > 0 && osInfo.storage > 0 &&
              <Typography level="body-xs" color="neutral">
                {Number(storageUsage.latest).sizeFormat(1)} / {Number(osInfo.storage).sizeFormat(1)}
                {" "}
                {context.languagePicker("main.welcome.kpiCards.available")}
              </Typography>}
          </DashCard>

          <DashCard variant="outlined">
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em" }}
            >
              {context.languagePicker("main.welcome.kpiCards.uptime")}
            </Typography>
            {osInfo.uptime > 0 &&
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
              </Typography>}
            {osInfo.userAtHostname?.length > 0 && (
              <Typography level="body-xs" color="neutral" sx={{ fontFamily: "var(--joy-fontFamily-code)" }}>
                {osInfo.userAtHostname}
              </Typography>
            )}
          </DashCard>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr" },
            gap: 1.5,
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
                {context.languagePicker("main.welcome.trend.cpu")}
              </Typography>
              {history.length > 0 &&
                <Typography
                  level="title-lg"
                  fontWeight={600}
                  sx={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}
                >
                  {(cpuUsage.latest * 100).toFixed(2)}%
                </Typography>}
            </Box>
            <Box sx={{ mt: 0.5, mb: 1.5 }}>
              <Sparkline data={cpuTrend} height={80} />
            </Box>
            {history.length > 0 &&
              <Typography
                level="body-xs"
                color="neutral"
                align="right"
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                Min: {(cpuUsage.min * 100).toFixed(2)}%
                &ensp;
                Avg: {(cpuUsage.avg * 100).toFixed(2)}%
                &ensp;
                Max: {(cpuUsage.max * 100).toFixed(2)}%
              </Typography>}
          </DashCard>
        </Box>

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
              {context.languagePicker("main.welcome.info.systemInfo")}
            </Typography>
            {osInfo.platform.length > 0 && (
              <InfoPair
                label={context.languagePicker("main.welcome.info.platform")}
                value={String(osInfo.platform).upperCaseFirst()}
              />
            )}
            {osInfo.kernelVersion.length > 0 && (
              <InfoPair
                label={context.languagePicker("main.welcome.info.kernelVersion")}
                value={osInfo.kernelVersion}
              />
            )}
            {osInfo.cpus.model.length > 0 && (
              <InfoPair
                label={context.languagePicker("main.welcome.info.cpuModel")}
                value={osInfo.cpus.model}
              />
            )}
          </DashCard>

          <DashCard variant="outlined" sx={{ overflow: "auto", gap: 0 }}>
            <Typography
              level="title-md"
              color="neutral"
              sx={{ letterSpacing: "0.02em", mb: 1.5 }}
            >
              {context.languagePicker("main.welcome.info.network")}
            </Typography>
            {osInfo.network &&
              Object.entries(osInfo.network).flatMap(([name, ifaces]) =>
                ifaces.map((iface) => (
                  <InfoPair
                    key={`${name}-${iface.address}`}
                    label={name}
                    value={iface.address}
                    keyWidth="40%"
                    sxValue={{ fontVariantNumeric: "tabular-nums" }}
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
