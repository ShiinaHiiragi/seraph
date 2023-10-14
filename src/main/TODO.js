import React from "react";
import RouteField from "../interface/RouteField";
import { styled } from "@mui/joy/styles";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Checkbox from "@mui/joy/Checkbox";
import Typography from "@mui/joy/Typography";
import GlobalContext from "../interface/constants";

const Item = styled(ListItem)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start"
}));

const BoxContainer = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(0.5)
}));

const Details = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: theme.spacing(0, 1.5, 0.75)
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
          <BoxContainer>
            <Checkbox
              variant="outlined"
              color="neutral"
            />
          </BoxContainer>
          <Details>
            <Typography level="title-md">
              do this
            </Typography>
            <Typography level="body-sm">
              In esse ullamco fugiat aliquip consectetur fugiat ex ad labore minim commodo quis commodo.
            </Typography>
          </Details>
        </Item>
        <ListDivider inset="startDecorator" />
        <Item>
          <BoxContainer>
            <Checkbox
              variant="outlined"
              color="neutral"
            />
          </BoxContainer>
          <Details>
            <Typography level="title-md">
              do this
            </Typography>
            <Typography level="body-sm">
              Esse esse magna dolore tempor laborum adipisicing ipsum voluptate ea ad dolore aliquip.
            </Typography>
            <Typography level="body-sm">
              Cupidatat cupidatat laboris pariatur et esse esse elit ut aute tempor ad nulla cillum. Do esse nisi Lorem irure. Minim ex amet nisi non quis proident et cillum dolore amet sit cupidatat officia deserunt fugiat.
            </Typography>
          </Details>
        </Item>
      </List>
    </RouteField>
  )
}

export default TODO;
