import React from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { styled } from "@mui/joy/styles";
import Countdown from "react-countdown";
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
  const [modalButtonLoading, setModalButtonLoading] = React.useState(false);
  const [modalTaskName, setModalTaskName] = React.useState("");
  const [modalTaskDesciption, setModalTaskDesciption] = React.useState("");
  const [modalTaskType, setModalTaskType] = React.useState("permanent");
  const [modalTaskDueTime, setModalTaskDueTime] = React.useState(null);
  const [taskDueTime, setTaskDueTime] = React.useState(null);
  const [taskInfo, setTaskInfo] = React.useState(null);

  // after second tick, the globalSwitch were set properly
  React.useEffect(() => {
    if (context.secondTick && context.isAuthority) {
      request(`GET/utility/todo/list`, undefined)
        .then((data) => setTask(data.task));
    }
  // eslint-disable-next-line
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
  ]);

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
    setModalTaskType(type ?? "permanent");
    setModalTaskDueTime(dueTime ? dayjs(dueTime) : null);
    setModalTaskOpen(true);
  }, [context]);

  const handleTickTask = React.useCallback((id, createTime) => {
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/utility/todo/tick",
        {
          id: id,
          createTime: createTime
        },
        undefined,
        reject
      )
        .then((data) => {
          setTask((task) => task.map((item) =>
            item.id === id && item.createTime === createTime
              ? {
                ...item,
                deleteTime: data.deleteTime
              } : item
          ))
          resolve();
        });
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.tick")
        .format(context.setting.task.delay),
      error: (data) => data
    })
  }, [context]);

  const handleUntickTask = React.useCallback((id, createTime) => {
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/utility/todo/untick",
        {
          id: id,
          createTime: createTime
        },
        undefined,
        reject
      )
        .then((data) => {
          setTask((task) => task.map((item) =>
            item.id === id && item.createTime === createTime
              ? {
                ...item,
                deleteTime: null
              } : item
          ))
          resolve();
        });
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context.languagePicker("modal.toast.success.untick"),
      error: (data) => data
    })
  }, [context]);

  const handleModTask = React.useCallback((name, description, type, dueTime) => {
    setModalButtonLoading(true);
    if (taskInfo === null) {
      toast.promise(new Promise((resolve, reject) => {
        request(
          "POST/utility/todo/new",
          {
            name: name,
            description: description,
            type: type,
            dueTime: dueTime
          },
          { "": () => setModalButtonLoading(false) },
          reject
        )
          .then((data) => {
            setTask((task) => [
              {
                id: data.id,
                createTime: data.createTime,
                name: name,
                description: description,
                type: type,
                dueTime: dueTime,
                deleteTime: null
              },
              ...task
            ])
            setModalTaskOpen(false);
            resolve();
          })
          .finally(() => setModalButtonLoading(false));
      }), {
        loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
        success: context
          .languagePicker("modal.toast.success.new")
          .format(name),
        error: (data) => data
      })
    } else {
      const id = `${taskInfo.id}`, createTime = taskInfo.createTime, deleteTime = taskInfo.deleteTime
      toast.promise(new Promise((resolve, reject) => {
        request(
          "POST/utility/todo/edit",
          {
            id: id,
            createTime: createTime,
            name: name,
            description: description,
            type: type,
            dueTime: dueTime
          },
          { "": () => setModalButtonLoading(false) },
          reject
        )
          .then(() => {
            setTask((task) => task.map((item) =>
              item.id === id && item.createTime === createTime
                ? {
                  id: id,
                  createTime: createTime,
                  name: name,
                  description: description,
                  type: type,
                  dueTime: dueTime,
                  deleteTime: deleteTime
                } : item
            ))
            setModalTaskOpen(false);
            resolve();
          })
          .finally(() => setModalButtonLoading(false));
      }), {
        loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
        success: context.languagePicker("modal.toast.success.modTask"),
        error: (data) => data
      })
    }
  }, [context, taskInfo]);

  const handleDeleteTask = (id, createTime, name) => {
    toast.promise(new Promise((resolve, reject) => {
      request(
        "POST/utility/todo/delete",
        { id: id, createTime: createTime },
        undefined,
        reject
      )
        .then(() => {
          setTask((task) => task.filter(
            (item) => item.id !== id ||
              item.createTime !== createTime
          ))
          resolve();
        });
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: context
        .languagePicker("modal.toast.success.delete")
        .format(name),
      error: (data) => data
    })
  }

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
              <Option value="all" onClick={() => setFilter("all")}>
                {context.languagePicker("main.todo.type.all")}
              </Option>
              <Option value="permanent" onClick={() => setFilter("permanent")}>
                {context.languagePicker("main.todo.type.permanent")}
              </Option>
              <Option value="async" onClick={() => setFilter("async")}>
                {context.languagePicker("main.todo.type.async")}
              </Option>
              <Option value="sync" onClick={() => setFilter("sync")}>
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
              onClick={() => {
                setTaskInfo(null);
                handleToggleModalTask();
              }}
            >
              {context.languagePicker("main.todo.form.add")}
            </Button>
          </FormControl>
        </Box>
      </Box>
      <List>
        {task.map((item, index, self) => (
          <React.Fragment key={item.id}>
            <Item>
              <Box sx={{ pt: 0.5 }} >
                <Checkbox
                  variant="outlined"
                  color="neutral"
                  checked={item.deleteTime !== null}
                  onClick={
                    () => item.deleteTime === null
                      ? handleTickTask(item.id, item.createTime)
                      : handleUntickTask(item.id, item.createTime)
                  }
                />
              </Box>
              <Details>
                <Typography
                  level="title-md"
                  sx={{ textDecoration: item.deleteTime ? "line-through" : "unset" }}
                  color={item.deleteTime ? "neutral" : "secondary"}
                >
                  {item.name}
                </Typography>
                {item.description.split("\n").map((paragraph, index) => (
                  <Typography level="body-sm" key={index}>
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
                  {item.type !== "permanent" &&
                    <React.Fragment>
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
                        {new Date(item.dueTime).timeFormat(
                          context.languagePicker("universal.time.taskListFormat")
                        )}
                      </Typography>
                    </React.Fragment>}
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
                    <MenuItem
                      onClick={() => {
                        setTaskInfo({
                          id: item.id,
                          createTime: item.createTime,
                          deleteTime: item.deleteTime
                        });
                        handleToggleModalTask(
                          item.name,
                          item.description,
                          item.type,
                          item.dueTime
                        );
                      }}
                    >
                      {context.languagePicker("main.todo.form.edit")}
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      color="danger"
                      onClick={() => {
                        context.setModalReconfirm({
                          open: true,
                          captionFirstHalf: context
                            .languagePicker("modal.reconfirm.captionFirstHalf.deleteTask")
                            .format(item.name),
                          handleAction: () => handleDeleteTask(item.id, item.createTime, item.name)
                        })
                      }}
                    >
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
            {index !== self.length - 1 && <ListDivider inset="startDecorator" />}
          </React.Fragment>
        ))}
      </List>
      <ModalForm
        open={modalTaskOpen}
        loading={modalButtonLoading}
        disabled={modalTaskName.length === 0 || (modalTaskType !== "permanent" && modalTaskDueTime?.$ms !== 0)}
        handleClose={() => setModalTaskOpen(false)}
        handleClick={() => handleModTask(
          modalTaskName,
          modalTaskDesciption,
          modalTaskType,
          taskDueTime
        )}
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
            <Option value="permanent" onClick={() => setModalTaskType("permanent")}>
              {context.languagePicker("main.todo.type.permanent")}
            </Option>
            <Option value="async" onClick={() => setModalTaskType("async")}>
              {context.languagePicker("main.todo.type.async")}
            </Option>
            <Option value="sync" onClick={() => setModalTaskType("sync")}>
              {context.languagePicker("main.todo.type.sync")}
            </Option>
          </Select>
        </FormControl>
        {modalTaskType !== "permanent" &&
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
