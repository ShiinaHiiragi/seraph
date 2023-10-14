import React from "react";
import RouteField from "../interface/RouteField";
import { styled } from "@mui/joy/styles";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Checkbox from "@mui/joy/Checkbox";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import GlobalContext from "../interface/constants";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import AccessAlarmsOutlinedIcon from "@mui/icons-material/AccessAlarmsOutlined";

const Item = styled(ListItem)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start"
}));

const Details = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: theme.spacing(0, 1.5)
}));

const TODO = () => {
  const context = React.useContext(GlobalContext);

  return (
    <RouteField
      display={context.isAuthority}
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.todo")
      ]}
      title={context.languagePicker("nav.utility.todo")}
      sx={{
        flexDirection: "column",
        overflowY: "auto"
      }}
    >
      <List>
        <Item>
          <Box sx={{ pt: 0.5 }} >
            <Checkbox
              variant="outlined"
              color="neutral"
            />
          </Box>
          <Details>
            <Typography
              level="title-md"
              sx={{ textDecoration: "line-through" }}
              color="neutral"
            >
              Homework
            </Typography>
            <Typography level="body-sm">
              In esse ullamco fugiat aliquip consectetur fugiat ex ad labore minim commodo quis commodo.
            </Typography>
            <Box
              sx={{
                pt: 0.5,
                gap: 0.5,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Typography
                startDecorator={<AccessAlarmsOutlinedIcon />}
                level="body-xs"
                color="neutral"
                sx={{ display: { xs: "flex", sm: "none" } }}
              >
                Async
              </Typography>
              <Typography
                startDecorator={<TodayOutlinedIcon />}
                level="body-xs"
                color="neutral"
              >
                10/14/2022 23:59:59
              </Typography>

            </Box>
          </Details>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <Chip
              onClick={() => { }}
              color="success"
            >
              Completed
            </Chip>
          </Box>
        </Item>
        <ListDivider inset="startDecorator" />
      </List>
    </RouteField>
  )
}

export default TODO;
