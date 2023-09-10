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
  const { path, children, ...otherProps } = props;
  const [breadcrumb, setBreadcrumb] = React.useState(path ?? []);

  return (
    <RouteFieldRaw sx={(theme) => ({
      flexDirection: "column",
      padding: theme.spacing(2, 3),
    })}>
      {path.length &&
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
        </Breadcrumbs>}
      <RouteFieldRaw
        children={children}
        setBreadcrumb={setBreadcrumb}
        {...otherProps}
      />
    </RouteFieldRaw>
  )
}

export default RouteField;
