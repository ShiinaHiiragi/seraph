import React from "react";
import { styled } from "@mui/joy/styles";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GlobalContext from "./constants";
import Caption from "../components/Caption";

const RouteFieldRaw = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
}));

const RouteField = (props) => {
  const {
    display,
    path,
    title,
    sxRaw,
    children,
    ...otherProps
  } = props;
  const context = React.useContext(GlobalContext);
  const breadcrumb = React.useMemo(() => path ?? [ ], [path]);

  // const permissionCheck = React.useMemo(() => {
  //   return noCheck || context.isAuthority;
  // }, [noCheck, context.isAuthority]);

  // after second tick, the globalSwitch were set properly
  // React.useEffect(() => {
  //   if (context.secondTick && !permissionCheck) {
  //     const loginButton = document.querySelector("#loginButton");
  //     if (loginButton) {
  //       loginButton.click()
  //     }
  //   }
  // // eslint-disable-next-line
  // }, [context.secondTick]);

  return (
    <RouteFieldRaw
      className="RouteFieldRawOuter"
      sx={(theme) => ({
        flexDirection: "column",
        padding: theme.spacing(2, 3),
        ...sxRaw
      })}
    >
      {
        path &&
        <Breadcrumbs
          size="md"
          separator={<ChevronRightRoundedIcon fontSize="sm" />}
          sx={{ paddingLeft: 0 }}
        >
          <Link
            underline="none"
            color="neutral"
            href="/"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          {breadcrumb.map((item, index) => (
            <Typography
              key={index}
              color={index + 1 === breadcrumb.length ? "primary" : "neutral"}
              fontWeight={500}
              fontSize={12}
            >
              {item}
            </Typography>
          ))}
        </Breadcrumbs>
      }
      {
        title &&
        <Typography
          level="h3"
          children={title}
          sx={(theme) => ({ paddingBottom: theme.spacing(2) })}
        />
      }
      <RouteFieldRaw
        className="RouteFieldRawInner"
        {...otherProps}
      >
        {display ? children :
          <Caption
            title={context.languagePicker("universal.deny.title")}
            caption={context.languagePicker("universal.deny.caption")}
          />}
      </RouteFieldRaw>
    </RouteFieldRaw>
  )
}

export default RouteField;
