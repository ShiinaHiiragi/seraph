import React from "react";
import { styled } from "@mui/joy/styles";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GlobalContext from "./constants";
import Caption from "../components/Caption";
import { useNavigate } from "react-router-dom";

const RouteFieldRaw = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexGrow: 1
}));

const RouteField = (props) => {
  // Welcome, Error: display
  // File Explorer: display, path, link, title, sxRaw, sx
  // Utilities: display, path, title
  const {
    display,
    path,
    link,
    title,
    sxRaw,
    children,
    ...otherProps
  } = props;
  const context = React.useContext(GlobalContext);
  const breadcrumb = React.useMemo(() => path ?? [ ], [path]);
  const navigate = useNavigate();

  // after second tick, the globalSwitch were set properly
  React.useEffect(() => {
    if (context.secondTick && !display) {
      const loginButton = document.querySelector("#loginButton");
      if (loginButton) {
        loginButton.click()
      }
    }
  // eslint-disable-next-line
  }, [context.secondTick]);

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
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          {breadcrumb.slice(0, -1).map((item, index) => (
            <Link
              key={index}
              underline="none"
              fontWeight={500}
              fontSize={12}
              onClick={() => navigate(link.split("/").slice(0, index + 2).join("/"))}
              color={"neutral"}
            >
              {item}
            </Link>
          ))}
          <Typography
            color={"primary"}
            fontWeight={500}
            fontSize={12}
          >
            {breadcrumb.slice(-1)[0]}
          </Typography>
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
        {display
          ? children
          : <Caption
            title={context.languagePicker("universal.placeholder.deny.title")}
            caption={context.languagePicker("universal.placeholder.deny.caption")}
          />}
      </RouteFieldRaw>
    </RouteFieldRaw>
  )
}

export default RouteField;
