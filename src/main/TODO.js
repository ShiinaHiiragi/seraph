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
              Esse esse magna dolore tempor laborum adipisicing ipsum voluptate ea ad dolore aliquip. Ex consequat mollit laboris culpa aliqua excepteur duis aliqua voluptate. Dolor magna voluptate amet fugiat. Dolor non dolor esse sint cupidatat dolore labore labore proident. Eu nostrud occaecat enim in dolor aliquip incididunt cillum dolor. Deserunt nulla proident sunt nostrud excepteur pariatur labore aliquip. Dolor cillum excepteur culpa ex anim commodo.
            </Typography>
            <Typography level="body-sm">
              Cupidatat cupidatat laboris pariatur et esse esse elit ut aute tempor ad nulla cillum. Do esse nisi Lorem irure. Minim ex amet nisi non quis proident et cillum ad. Cupidatat dolore amet sit cupidatat officia deserunt fugiat.
            </Typography>
            <Typography level="body-sm">
              Do est et pariatur amet Lorem cupidatat officia eiusmod cillum cillum esse tempor. Voluptate reprehenderit consectetur in pariatur sint veniam ex officia enim ad exercitation. Nulla aliquip ex id minim laboris nostrud proident irure est dolore eiusmod ut. Adipisicing cillum reprehenderit ut nostrud do culpa qui mollit duis esse. Magna sint deserunt ex labore cillum consequat quis irure do ex occaecat mollit mollit nulla. Labore incididunt officia quis deserunt qui proident pariatur.
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
              Esse esse magna dolore tempor laborum adipisicing ipsum voluptate ea ad dolore aliquip. Ex consequat mollit laboris culpa aliqua excepteur duis aliqua voluptate. Dolor magna voluptate amet fugiat. Dolor non dolor esse sint cupidatat dolore labore labore proident. Eu nostrud occaecat enim in dolor aliquip incididunt cillum dolor. Deserunt nulla proident sunt nostrud excepteur pariatur labore aliquip. Dolor cillum excepteur culpa ex anim commodo.
            </Typography>
            <Typography level="body-sm">
              Cupidatat cupidatat laboris pariatur et esse esse elit ut aute tempor ad nulla cillum. Do esse nisi Lorem irure. Minim ex amet nisi non quis proident et cillum ad. Cupidatat dolore amet sit cupidatat officia deserunt fugiat.
            </Typography>
            <Typography level="body-sm">
              Do est et pariatur amet Lorem cupidatat officia eiusmod cillum cillum esse tempor. Voluptate reprehenderit consectetur in pariatur sint veniam ex officia enim ad exercitation. Nulla aliquip ex id minim laboris nostrud proident irure est dolore eiusmod ut. Adipisicing cillum reprehenderit ut nostrud do culpa qui mollit duis esse. Magna sint deserunt ex labore cillum consequat quis irure do ex occaecat mollit mollit nulla. Labore incididunt officia quis deserunt qui proident pariatur.
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
              Esse esse magna dolore tempor laborum adipisicing ipsum voluptate ea ad dolore aliquip. Ex consequat mollit laboris culpa aliqua excepteur duis aliqua voluptate. Dolor magna voluptate amet fugiat. Dolor non dolor esse sint cupidatat dolore labore labore proident. Eu nostrud occaecat enim in dolor aliquip incididunt cillum dolor. Deserunt nulla proident sunt nostrud excepteur pariatur labore aliquip. Dolor cillum excepteur culpa ex anim commodo.
            </Typography>
            <Typography level="body-sm">
              Cupidatat cupidatat laboris pariatur et esse esse elit ut aute tempor ad nulla cillum. Do esse nisi Lorem irure. Minim ex amet nisi non quis proident et cillum ad. Cupidatat dolore amet sit cupidatat officia deserunt fugiat.
            </Typography>
            <Typography level="body-sm">
              Do est et pariatur amet Lorem cupidatat officia eiusmod cillum cillum esse tempor. Voluptate reprehenderit consectetur in pariatur sint veniam ex officia enim ad exercitation. Nulla aliquip ex id minim laboris nostrud proident irure est dolore eiusmod ut. Adipisicing cillum reprehenderit ut nostrud do culpa qui mollit duis esse. Magna sint deserunt ex labore cillum consequat quis irure do ex occaecat mollit mollit nulla. Labore incididunt officia quis deserunt qui proident pariatur.
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
              Esse esse magna dolore tempor laborum adipisicing ipsum voluptate ea ad dolore aliquip. Ex consequat mollit laboris culpa aliqua excepteur duis aliqua voluptate. Dolor magna voluptate amet fugiat. Dolor non dolor esse sint cupidatat dolore labore labore proident. Eu nostrud occaecat enim in dolor aliquip incididunt cillum dolor. Deserunt nulla proident sunt nostrud excepteur pariatur labore aliquip. Dolor cillum excepteur culpa ex anim commodo.
            </Typography>
            <Typography level="body-sm">
              Cupidatat cupidatat laboris pariatur et esse esse elit ut aute tempor ad nulla cillum. Do esse nisi Lorem irure. Minim ex amet nisi non quis proident et cillum ad. Cupidatat dolore amet sit cupidatat officia deserunt fugiat.
            </Typography>
            <Typography level="body-sm">
              Do est et pariatur amet Lorem cupidatat officia eiusmod cillum cillum esse tempor. Voluptate reprehenderit consectetur in pariatur sint veniam ex officia enim ad exercitation. Nulla aliquip ex id minim laboris nostrud proident irure est dolore eiusmod ut. Adipisicing cillum reprehenderit ut nostrud do culpa qui mollit duis esse. Magna sint deserunt ex labore cillum consequat quis irure do ex occaecat mollit mollit nulla. Labore incididunt officia quis deserunt qui proident pariatur.
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
              Esse esse magna dolore tempor laborum adipisicing ipsum voluptate ea ad dolore aliquip. Ex consequat mollit laboris culpa aliqua excepteur duis aliqua voluptate. Dolor magna voluptate amet fugiat. Dolor non dolor esse sint cupidatat dolore labore labore proident. Eu nostrud occaecat enim in dolor aliquip incididunt cillum dolor. Deserunt nulla proident sunt nostrud excepteur pariatur labore aliquip. Dolor cillum excepteur culpa ex anim commodo.
            </Typography>
            <Typography level="body-sm">
              Cupidatat cupidatat laboris pariatur et esse esse elit ut aute tempor ad nulla cillum. Do esse nisi Lorem irure. Minim ex amet nisi non quis proident et cillum ad. Cupidatat dolore amet sit cupidatat officia deserunt fugiat.
            </Typography>
            <Typography level="body-sm">
              Do est et pariatur amet Lorem cupidatat officia eiusmod cillum cillum esse tempor. Voluptate reprehenderit consectetur in pariatur sint veniam ex officia enim ad exercitation. Nulla aliquip ex id minim laboris nostrud proident irure est dolore eiusmod ut. Adipisicing cillum reprehenderit ut nostrud do culpa qui mollit duis esse. Magna sint deserunt ex labore cillum consequat quis irure do ex occaecat mollit mollit nulla. Labore incididunt officia quis deserunt qui proident pariatur.
            </Typography>
          </Details>
        </Item>
      </List>
    </RouteField>
  )
}

export default TODO;
