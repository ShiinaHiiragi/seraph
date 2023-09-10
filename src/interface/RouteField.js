import React from "react";
import { styled } from "@mui/joy/styles";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const RouteFieldRaw = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
}));

const RouteField = (props) => {
  const { path, title, children } = props;
  const breadcrumb = path ?? [];

  return (
    <RouteFieldRaw sx={(theme) => ({
      flexDirection: "column",
      padding: theme.spacing(2, 3),
    })}>
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
      <RouteFieldRaw children={children} />
    </RouteFieldRaw>
  )
}

export default RouteField;
