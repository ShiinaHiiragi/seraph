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
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AccessAlarmsOutlinedIcon from "@mui/icons-material/AccessAlarmsOutlined";
import RouteField from "../interface/RouteField";
import GlobalContext, { request } from "../interface/constants";
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
  const [task, setTask] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState(undefined);

  const [modalTaskTitle, setModalTaskTitle] = React.useState("");
  const [modalTaskOpen, setModalTaskOpen] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [modalTaskName, setModalTaskName] = React.useState("");
  const [modalTaskDesciption, setModalTaskDesciption] = React.useState("");
  const [modalTaskType, setModalTaskType] = React.useState("permanant");
  const [modalTaskDueTime, setModalTaskDueTime] = React.useState(null);
  const [taskDueTime, setTaskDueTime] = React.useState(null);

  React.useEffect(() => {
    if (modalTaskDueTime?.$ms === 0) {
      const { $y, $M, $D, $H, $m } = modalTaskDueTime;
      setTaskDueTime(new Date($y, $M, $D, $H, $m).getTime());
    } else {
      setTaskDueTime(null);
    }
  }, [modalTaskDueTime])

  const modalTaskExpired = React.useMemo(() => {
    if (taskDueTime) {
      return taskDueTime < Date.now()
    } else {
      return false
    }
  }, [taskDueTime])

  const handleToggleModalTask = React.useCallback((name, description, type, dueTime) => {
    setModalTaskTitle(
      context.languagePicker(
        `modal.form.todo.${dueTime ? "edit" : "new"}`
      )
    );
    setModalTaskName(name ?? "");
    setModalTaskDesciption(description ?? "");
    setModalTaskType(type ?? "permanant");
    setModalTaskDueTime(dueTime ?? null);
    setModalTaskOpen(true);
  }, [context]);

  // after second tick, the globalSwitch were set properly
  React.useEffect(() => {
    if (context.secondTick && context.isAuthority) {
      request(
        `GET/utility/todo/list`,
        undefined
      )
        .then((data) => setTask(data.task) );
    }
  // eslint-disable-next-line
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
  ]);

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
        className="SearchAndFilters"
        sx={{
          borderRadius: "sm",
          pb: 1,
          display: "flex",
          flexWrap: "no-wrap",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 1.5 },
          "& > *": { minWidth: { xs: "120px", md: "160px" } },
        }}
      >
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <FormControl sx={{ width: "100%" }} size="sm">
            <Input
              autoComplete="off"
              size="sm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={context.languagePicker("main.todo.form.search")}
              startDecorator={<SearchIcon />}
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" }
          }}
        >
          <FormControl
            size="sm" 
            sx={{
              flexGrow: 1,
              minWidth: "160px"
            }}
          >
            <Select
              size="sm"
              value={filter}
              placeholder={context.languagePicker("main.todo.form.filter")}
              slotProps={{ button: { sx: { whiteSpace: "wrap" } } }}
            >
              <Option value="all" onClick={(event) => setFilter("all")}>
                {context.languagePicker("main.todo.type.all")}
              </Option>
              <Option value="permanant" onClick={(event) => setFilter("permanant")}>
                {context.languagePicker("main.todo.type.permanant")}
              </Option>
              <Option value="async" onClick={(event) => setFilter("async")}>
                {context.languagePicker("main.todo.type.async")}
              </Option>
              <Option value="sync" onClick={(event) => setFilter("sync")}>
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
              onClick={() => handleToggleModalTask()}
            >
              {context.languagePicker("main.todo.form.add")}
            </Button>
          </FormControl>
        </Box>
      </Box>
      <List>
        {task.map((item, index) => (
          <React.Fragment>
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
                  {item.name}
                </Typography>
                {item.description.split("\n").map((paragraph) => (
                  <Typography level="body-sm">
                    {paragraph}
                  </Typography>
                ))}
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
                    {context.languagePicker(`main.todo.type.${item.type}`)}
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
                    {item.dueTime.timeFormat(
                      context.languagePicker("universal.time.dateFormat")
                        + " "
                        + context.languagePicker("universal.time.timeFormat")
                    )}
                  </Typography>
                </Box>
              </Details>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
                  >
                    <MoreVertRoundedIcon />
                  </MenuButton>
                  <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem>
                      {context.languagePicker("main.todo.form.edit")}
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      {context.languagePicker("main.todo.form.delete")}
                    </MenuItem>
                  </Menu>
                </Dropdown>
                <Box sx={{ flexGrow: 1 }} />
                {item.deleteTime && <Countdown
                  date={item.deleteTime ?? 0}
                  intervalDelay={0}
                  precision={1}
                  renderer={(props) => (
                    <CircularProgress
                      size="sm"
                      variant="soft"
                      determinate
                      value={props.total / (context.setting.task.delay * 10)}
                    />
                  )}
                />}
              </Box>
            </Item>
            <ListDivider inset="startDecorator" />
          </React.Fragment>
        ))}
      </List>
      <ModalForm
        open={modalTaskOpen}
        loading={buttonLoading}
        disabled={modalTaskName.length === 0 || (modalTaskType !== "permanant" && modalTaskDueTime?.$ms !== 0)}
        handleClose={() => setModalTaskOpen(false)}
        handleClick={() => { }}
        title={modalTaskTitle}
        caption={context.languagePicker("modal.form.todo.caption")}
        button={context.languagePicker("universal.button.submit")}
      >
        <FormControl>
          <FormLabel>{context.languagePicker("main.todo.regulate.name")}</FormLabel>
          <Input
            value={modalTaskName}
            onChange={(event) => setModalTaskName(event.target.value)}
            placeholder={context.languagePicker("universal.placeholder.instruction.required")}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{context.languagePicker("main.todo.regulate.description")}</FormLabel>
          <Textarea
            minRows={4}
            maxRows={4}
            placeholder={context.languagePicker("universal.placeholder.instruction.optional")}
            value={modalTaskDesciption}
            onChange={(event) => setModalTaskDesciption(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{context.languagePicker("main.todo.regulate.type")}</FormLabel>
          <Select value={modalTaskType}>
            <Option value="permanant" onClick={() => setModalTaskType("permanant")}>
              {context.languagePicker("main.todo.type.permanant")}
            </Option>
            <Option value="async" onClick={() => setModalTaskType("async")}>
              {context.languagePicker("main.todo.type.async")}
            </Option>
            <Option value="sync" onClick={() => setModalTaskType("sync")}>
              {context.languagePicker("main.todo.type.sync")}
            </Option>
          </Select>
        </FormControl>
        {modalTaskType !== "permanant" &&
          <FormControl error={modalTaskExpired}>
            <FormLabel>
              {context.languagePicker("main.todo.regulate.dueTime")}
            </FormLabel>
            <Picker
              timeFormat={context.languagePicker("universal.time.taskModalFormat")}
              value={modalTaskDueTime}
              onChange={(newValue) => setModalTaskDueTime(newValue)}
            />
            {modalTaskExpired && <FormHelperText>
              {context.languagePicker("modal.form.todo.helper")}
            </FormHelperText>}
          </FormControl>}
      </ModalForm>
    </RouteField>
  )
}

export default TODO;
