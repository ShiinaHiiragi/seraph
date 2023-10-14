import React from "react";
import Countdown from "react-countdown";
import { styled } from "@mui/joy/styles";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Checkbox from "@mui/joy/Checkbox";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AccessAlarmsOutlinedIcon from "@mui/icons-material/AccessAlarmsOutlined";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";
import ModalForm from "../modal/Form";
import Picker from "../components/Picker";

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
      <Box
        sx={{
          display: "flex",
          gap: 1.5
        }}
      >
        <FormControl
          size="sm"
          sx={{ flexGrow: 2 }}
        >
          <Select
            size="sm"
            placeholder={context.languagePicker("main.todo.form.sortBy")}
            slotProps={{ button: { sx: { whiteSpace: "wrap" } } }}
          >
            <Option value="name">
              {context.languagePicker("main.todo.regulate.name")}
            </Option>
            <Option value="description">
              {context.languagePicker("main.todo.regulate.description")}
            </Option>
            <Option value="dueTime">
              {context.languagePicker("main.todo.regulate.dueTime")}
            </Option>
          </Select>
        </FormControl>
        <FormControl
          size="sm"
          sx={{ flexGrow: 1 }}
        >
          <Select
            size="sm"
            placeholder={context.languagePicker("main.todo.form.filter")}
            slotProps={{ button: { sx: { whiteSpace: "wrap" } } }}
          >
            <Option value="all">
              {context.languagePicker("main.todo.type.all")}
            </Option>
            <Option value="permanant">
              {context.languagePicker("main.todo.type.permanant")}
            </Option>
            <Option value="async">
              {context.languagePicker("main.todo.type.async")}
            </Option>
            <Option value="sync">
              {context.languagePicker("main.todo.type.sync")}
            </Option>
          </Select>
        </FormControl>
        <FormControl
          size="sm"
        >
          <Button
            size="sm"
            color="primary"
            variant="solid"
            startDecorator={<AddOutlinedIcon />}
          >
            ADD
          </Button>
        </FormControl>
      </Box>
      <List>
        <Item>
          <Box sx={{ pt: 0.5 }} >
            <Checkbox
              variant="outlined"
              color="neutral"
              checked
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
                gap: 0.75,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }
              }}
            >
              <Typography
                startDecorator={<AccessAlarmsOutlinedIcon />}
                level="body-xs"
                color="neutral"
              >
                Async
              </Typography>
              <Typography
                level="body-xs"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                &bull;
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
          <Box>
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
              >
                <MoreVertRoundedIcon />
              </MenuButton>
              <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>
                  234
                </MenuItem>
                <Divider />
                <MenuItem>
                  123
                </MenuItem>
              </Menu>
            </Dropdown>
          </Box>
        </Item>
        <ListDivider inset="startDecorator" />
      </List>
      {/* <Countdown
        date={Date.now() + 60000}
        intervalDelay={0}
        precision={2}
        renderer={(props) => <CircularProgress size="sm" determinate value={props.total / 600} />}
      /> */}
      <ModalForm
        open={false}
        loading={false}
        disabled={false}
        handleClose={() => { }}
        handleClick={() => { }}
        title={"123"}
        caption={"234"}
        button={context.languagePicker("universal.button.submit")}
      >
        <FormControl>
          <FormLabel>Task</FormLabel>
          <Input placeholder="PLACEHOLDER" />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea minRows={4} maxRows={4} placeholder="PLACEHOLDER" />
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select placeholder="PLACEHOLDER">
            <Option value="permanant">
              Permanant
            </Option>
            <Option value="async">
              Async
            </Option>
            <Option value="sync">
              Sync
            </Option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Due</FormLabel>
          <Picker />
        </FormControl>
      </ModalForm>
    </RouteField>
  )
}

export default TODO;
