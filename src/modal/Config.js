import * as React from "react";
import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Switch from "@mui/joy/Switch";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Tooltip from '@mui/joy/Tooltip';
import ListDivider from '@mui/joy/ListDivider';
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Checkbox from "@mui/joy/Checkbox";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import GlobalContext, {
  HiddenInput,
  animeDuration,
  settingField,
  reactionInterval,
  alphabet,
  monospaceFonts,
  request
} from "../interface/constants";
import { languageMap } from "../interface/languagePicker";

const Literal = (
  value,
  itemsMap,
  field,
  handleApply,
  disabled,
  maxWidth,
  fallback
) => (
  <Select size="sm" value={value} sx={{ maxWidth: maxWidth ?? 240 }} disabled={disabled}>
    {!itemsMap.some((item) => item.value === value) && (
      <Option value={value} disabled sx={{ '&.Mui-selected': { bgcolor: 'transparent' } }}>
        {fallback ? fallback(value) : value}
      </Option>
    )}
    {itemsMap.map(({value, label}) => (
      <Option
        key={value}
        value={value}
        onClick={() => handleApply(field, value)}
      >
        {label}
      </Option>
    ))}
  </Select>
);

const LabeledLiteral = (
  caption,
  value,
  itemsMap,
  field,
  handleApply,
  disabled,
  maxWidth,
  fallback
) => (
  <FormControl sx={{ maxWidth: (maxWidth ?? 240) + 20, flexGrow: 1 }}>
    <FormLabel sx={{ mb: 0, color: "neutral.500" }}>
      {caption}
    </FormLabel>
    <Select
      size="sm"
      value={value}
      disabled={disabled}
      sx={{ maxWidth: (maxWidth ?? 240) }}
    >
      {!itemsMap.some((item) => item.value === value) && (
        <Option value={value} disabled sx={{ '&.Mui-selected': { bgcolor: 'transparent' } }}>
          {fallback ? fallback(value) : value}
        </Option>
      )}
      {itemsMap.map(({value, label}) => (
        <Option
          key={value}
          value={value}
          onClick={() => handleApply(field, value)}
        >
          {label}
        </Option>
      ))}
    </Select>
  </FormControl>
);

const Bool = (label, checked, field, handleApply, disabled) => (
  <Checkbox
    size="sm"
    label={label}
    checked={checked}
    onChange={(event) => handleApply(field, event.target.checked)}
    disabled={disabled}
  />
);

const InstantBool = (label, checked, field, handleApply, disabled) => (
  <Switch
    size="sm"
    variant="outlined"
    label={label}
    checked={checked}
    onChange={(event) => handleApply(field, event.target.checked)}
    disabled={disabled}
  />
)

// Turkey -> Istanbul -> InstantBool
const Turkey = (checked, field, handleApply, disabled) =>
  InstantBool(undefined, checked, field, handleApply, disabled);

const StringInput = (props) => {
  const {
    disabled,
    caption,
    value,
    width,
    type,
    field,
    handleCheck,
    handleApply,
    start,
    end,
    translate,
    code,
    startStyle
  } = props;

  const [localValue, setLocalValue] = React.useState(value);
  const [localLastValid, setLocalLastValid] = React.useState(value);
  const [localError, setLocalError] = React.useState(false);

  const isMounted = React.useRef(false);
  const pendingApply = React.useRef(false);

  React.useEffect(() => {
    if (pendingApply.current) {
      pendingApply.current = false;
      return;
    }
    setLocalValue(value);
    setLocalLastValid(value);
  }, [value]);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const id = setTimeout(() => {
      const checkError = handleCheck(localValue)
      setLocalError(!checkError)
      if (checkError && localValue !== localLastValid) {
        const sendValue = typeof translate === "function"
          ? translate(localValue)
          : localValue;
        pendingApply.current = true;
        handleApply(field, sendValue);
        setLocalLastValid(localValue);
      }
    }, reactionInterval.slow);
    return () => clearTimeout(id);
  }, [localValue, localLastValid, field, handleApply, handleCheck, translate]);

  return (
    <FormControl>
      <FormLabel sx={{ mb: 0, color: "neutral.500" }}>
        {caption}
      </FormLabel>
      <Input
        disabled={disabled}
        size="sm"
        type={type}
        sx={{ maxWidth: width, fontFamily: code ? "var(--joy-fontFamily-code)" : undefined }}
        value={localValue}
        startDecorator={start}
        endDecorator={end}
        onChange={(event) => setLocalValue(event.target.value)}
        error={localError}
        slotProps={{ startDecorator: { sx: startStyle ?? { mr: 0.25 } } }}
      />
    </FormControl>
  );
};

const Password = (props) => {
  const { context, query } = props;

  const [password, setPassword] = React.useState("");
  const [inputType, setInputType] = React.useState("password");
  const [loading, setLoading] = React.useState(false);

  const handleChangePassword = React.useCallback(() => {
    setLoading(true)
    toast.promise(new Promise((resolve, reject) => {
      request(
        query,
        { password: password },
        { "": () => setLoading(false) },
        reject
      )
        .then(() => {
          setPassword("");
          setLoading(false);
          resolve();
        })
    }), {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: () => context.languagePicker("modal.toast.success.setting"),
      error: (data) => data
    })
  }, [context, query, password])

  return (
    <Stack spacing={1} direction="row">
      <Input
        size="sm"
        type={inputType}
        autoComplete="new-password"
        placeholder={context.languagePicker("header.config.placeholder.password")}
        sx={{ maxWidth: 240, flexGrow: 1 }}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        endDecorator={
          <IconButton
            onClick={() => {
              setInputType((inputType) => 
                inputType === "password" ? "text" : "password"
              );
            }}
          >
            {inputType === "password"
              ? <VisibilityIcon />
              : <VisibilityOffIcon />}
          </IconButton>
        }
      />
      {password.length > 0
        && <IconButton
          loading={loading}
          variant="plain"
          size="sm"
          onClick={handleChangePassword}
        >
          <SaveOutlinedIcon />
        </IconButton>}
    </Stack>
  );
};

const SECTIONS = (
  context,
  setMetadata,
  resetButtonLoading,
  handleApply,
  handleReset,
  handleUpload,
  handleDownload
) => {
  const escList = context.setting.terminal.control.esc ? ["esc"] : [];
  const controlLists = escList.concat(
    Object
      .keys(context.setting.terminal.control.ctrl)
      .filter((item) => context.setting.terminal.control.ctrl[item])
  )

  return [
    {
      id: settingField.general,
      label: context.languagePicker("header.config.general.title"),
      items: [
        {
          key: context.languagePicker("header.config.general.language"),
          value: Literal(
            context.setting.meta.language,
            Object.entries(languageMap).map((item) => ({
              value: item[0],
              label: item[1].displayName
            })),
            "meta.language",
            handleApply
          ),
        },
        {
          key: context.languagePicker("header.config.general.reset"),
          value: (
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              sx={{ minWidth: 80 }}
              onClick={handleReset}
              loading={resetButtonLoading}
              startDecorator={<RestartAltOutlinedIcon />}
            >
              {context.languagePicker("header.config.general.resetButton")}
            </Button>
          )
        },
        {
          key: context.languagePicker("header.config.general.upload"),
          value: (
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              component="label"
              sx={{ minWidth: 80 }}
              startDecorator={<FileUploadOutlinedIcon />}
            >
              {context.languagePicker("header.config.general.uploadButton")}
              <HiddenInput type="file" onChange={handleUpload} />
            </Button>
          )
        },
        {
          key: context.languagePicker("header.config.general.download"),
          value: (
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              sx={{ minWidth: 80 }}
              onClick={handleDownload}
              startDecorator={<FileDownloadOutlinedIcon />}
            >
              {context.languagePicker("header.config.general.downloadButton")}
            </Button>
          )
        }
      ]
    },
    {
      id: settingField.account,
      label: context.languagePicker("header.config.account.title"),
      items: [
        {
          key: context.languagePicker("header.config.account.token"),
          tip: context.languagePicker("header.config.account.tokenTip"),
          value: Literal(
            context.setting.meta.token,
            [
              { value: 15, label: context.languagePicker("header.config.account.tokenOption.15") },
              { value: 60, label: context.languagePicker("header.config.account.tokenOption.60") },
              { value: 720, label: context.languagePicker("header.config.account.tokenOption.720") },
              { value: 1440, label: context.languagePicker("header.config.account.tokenOption.1440") },
              { value: 2880, label: context.languagePicker("header.config.account.tokenOption.2880") }
            ],
            "meta.token",
            handleApply,
            undefined,
            undefined,
            (value) => context.languagePicker("header.config.fallback.minutes").format(value)
          )
        },
        {
          key: context.languagePicker("header.config.account.password"),
          value: (
            <Password
              context={context}
              query="POST/auth/reset"
            />
          )
        },
      ]
    },
    {
      id: settingField.welcome,
      label: context.languagePicker("header.config.welcome.title"),
      items: [
        {
          key: context.languagePicker("header.config.welcome.enable"),
          tip: context.languagePicker("header.config.welcome.enableTip"),
          value: (
            <Stack spacing={2}>
              <Box>
                {Turkey(
                  context.setting.welcome.enable.panel,
                  "welcome.enable.panel",
                  handleApply
                )}
              </Box>
              <Stack spacing={1}>
                {Bool(
                  context.languagePicker("header.config.welcome.enableTemp"),
                  context.setting.welcome.enable.temp,
                  "welcome.enable.temp",
                  handleApply,
                  !context.setting.welcome.enable.panel
                )}
                {Bool(
                  context.languagePicker("header.config.welcome.enableDisk"),
                  context.setting.welcome.enable.disk,
                  "welcome.enable.disk",
                  handleApply,
                  !context.setting.welcome.enable.panel
                )}
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.welcome.interval"),
          tip: context.languagePicker("header.config.welcome.intervalTip"),
          value: Literal(
            context.setting.welcome.interval,
            [
              { value: 1, label: context.languagePicker("header.config.welcome.intervalOption.1") },
              { value: 2, label: context.languagePicker("header.config.welcome.intervalOption.2") },
              { value: 3, label: context.languagePicker("header.config.welcome.intervalOption.3") },
              { value: 4, label: context.languagePicker("header.config.welcome.intervalOption.4") },
              { value: 5, label: context.languagePicker("header.config.welcome.intervalOption.5") },
              { value: 10, label: context.languagePicker("header.config.welcome.intervalOption.10") },
              { value: 15, label: context.languagePicker("header.config.welcome.intervalOption.15") },
              { value: 30, label: context.languagePicker("header.config.welcome.intervalOption.30") },
              { value: 45, label: context.languagePicker("header.config.welcome.intervalOption.45") },
              { value: 60, label: context.languagePicker("header.config.welcome.intervalOption.60") }
            ],
            "welcome.interval",
            handleApply,
            !context.setting.welcome.enable.panel,
            undefined,
            (value) => context.languagePicker("header.config.fallback.seconds").format(value)
          )
        },
        {
          key: context.languagePicker("header.config.welcome.window"),
          value: (
            <Stack spacing={1}>
              <Stack spacing={{ xs: 1, lg: 4 }} direction={{ xs: "column", lg: "row" }}>
                {LabeledLiteral(
                  context.languagePicker("header.config.welcome.windowCpu"),
                  context.setting.welcome.window.cpu,
                  [20, 40, 60, 80, 100, 120].map((num) => ({ value: num, label: num })),
                  "welcome.window.cpu",
                  handleApply,
                  !context.setting.welcome.enable.panel,
                  120
                )}
                {LabeledLiteral(
                  context.languagePicker("header.config.welcome.windowTemp"),
                  context.setting.welcome.window.temp,
                  [20, 40, 60, 80, 100, 120].map((num) => ({ value: num, label: num })),
                  "welcome.window.temp",
                  handleApply,
                  !context.setting.welcome.enable.panel,
                  120
                )}
              </Stack>
              <Stack spacing={{ xs: 1, lg: 4 }} direction={{ xs: "column", lg: "row" }}>
                {LabeledLiteral(
                  context.languagePicker("header.config.welcome.windowMemory"),
                  context.setting.welcome.window.memory,
                  [20, 40, 60, 80, 100, 120].map((num) => ({ value: num, label: num })),
                  "welcome.window.memory",
                  handleApply,
                  !context.setting.welcome.enable.panel,
                  120
                )}
                {LabeledLiteral(
                  context.languagePicker("header.config.welcome.windowStorage"),
                  context.setting.welcome.window.storage,
                  [20, 40, 60, 80, 100, 120].map((num) => ({ value: num, label: num })),
                  "welcome.window.storage",
                  handleApply,
                  !context.setting.welcome.enable.panel,
                  120
                )}
              </Stack>
              <Stack spacing={{ xs: 1, lg: 4 }} direction={{ xs: "column", lg: "row" }}>
                {LabeledLiteral(
                  context.languagePicker("header.config.welcome.windowDisk"),
                  context.setting.welcome.window.disk,
                  [20, 40, 60, 80, 100, 120].map((num) => ({ value: num, label: num })),
                  "welcome.window.disk",
                  handleApply,
                  !context.setting.welcome.enable.panel,
                  120
                )}
                {LabeledLiteral(
                  context.languagePicker("header.config.welcome.windowNet"),
                  context.setting.welcome.window.net,
                  [20, 40, 60, 80, 100, 120].map((num) => ({ value: num, label: num })),
                  "welcome.window.net",
                  handleApply,
                  !context.setting.welcome.enable.panel,
                  120
                )}
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.welcome.process"),
          hint: context.languagePicker("header.config.welcome.processHint"),
          value: (
            <Stack spacing={1}>
              <FormControl>
                <FormLabel sx={{ mb: 0, color: "neutral.500" }}>
                  {context.languagePicker("header.config.welcome.processSort")}
                </FormLabel>
                <RadioGroup
                  size="sm"
                  value={context.setting.welcome.process.sortBy}
                  onChange={(event) => handleApply("welcome.process.sortBy", event.target.value)}
                >
                  <Radio
                    value="cpu"
                    label={context.languagePicker("header.config.welcome.processSortBy.cpu")}
                    disabled={!context.setting.welcome.enable.panel}
                  />
                  <Radio
                    value="mem"
                    label={context.languagePicker("header.config.welcome.processSortBy.mem")}
                    disabled={!context.setting.welcome.enable.panel}
                  />
                  <Radio
                    value="priority"
                    label={context.languagePicker("header.config.welcome.processSortBy.priority")}
                    disabled={!context.setting.welcome.enable.panel}
                  />
                </RadioGroup>
              </FormControl>
              {LabeledLiteral(
                context.languagePicker("header.config.welcome.processCount"),
                context.setting.welcome.process.count,
                [5, 10, 15, 20, 25].map((num) => ({ value: num, label: num })),
                "welcome.process.count",
                handleApply,
                !context.setting.welcome.enable.panel,
                120
              )}
            </Stack>
          )
        }
      ]
    },
    {
      id: settingField.file,
      label: context.languagePicker("header.config.file.title"),
      items: [
        {
          key: context.languagePicker("header.config.file.cipher"),
          value: (
            <Password
              context={context}
              query="POST/file/reset"
            />
          )
        }
      ]
    },
    {
      id: settingField.terminal,
      label: context.languagePicker("header.config.terminal.title"),
      items: [
        {
          key: context.languagePicker("header.config.terminal.enable"),
          value: (
            Turkey(
              context.setting.terminal.enable,
              "terminal.enable",
              (field, value) => {
                if (!context.metadata.terminal && value) {
                  context.setModalReconfirm({
                    open: true,
                    caption: context
                      .languagePicker("modal.reconfirm.caption.enableTerminal"),
                    handleAction: () => {
                      handleApply(field, value);
                      setMetadata((metadata) => ({
                        ...metadata,
                        terminal: true
                      }));
                    }
                  });
                } else {
                  handleApply(field, value);
                }
              }
            )
          )
        },
        {
          key: context.languagePicker("header.config.terminal.shell"),
          value: (
            <Stack spacing={1}>
              <StringInput
                disabled={!context.setting.terminal.enable}
                caption={context.languagePicker("header.config.terminal.shellLinux")}
                value={context.setting.terminal.shell.linux}
                width={240}
                type="text"
                field="terminal.shell.linux"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
              <StringInput
                disabled={!context.setting.terminal.enable}
                caption={context.languagePicker("header.config.terminal.shellWin32")}
                value={context.setting.terminal.shell.win32}
                width={240}
                type="text"
                field="terminal.shell.win32"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.terminal.lifecycle"),
          value: (
            <Stack spacing={1}>
              {LabeledLiteral(
                context.languagePicker("header.config.terminal.lifecycleTimeout"),
                context.setting.terminal.lifecycle.timeout,
                [
                  { value: 15, label: context.languagePicker("header.config.terminal.lifecycleTimeoutOption.15") },
                  { value: 30, label: context.languagePicker("header.config.terminal.lifecycleTimeoutOption.30") },
                  { value: 60, label: context.languagePicker("header.config.terminal.lifecycleTimeoutOption.60") },
                  { value: 120, label: context.languagePicker("header.config.terminal.lifecycleTimeoutOption.120") },
                  { value: 240, label: context.languagePicker("header.config.terminal.lifecycleTimeoutOption.240") },
                  { value: 360, label: context.languagePicker("header.config.terminal.lifecycleTimeoutOption.360") }
                ],
                "terminal.lifecycle.timeout",
                handleApply,
                !context.setting.terminal.enable,
                undefined,
                (value) => context.languagePicker("header.config.fallback.minutes").format(value)
              )}
              {LabeledLiteral(
                context.languagePicker("header.config.terminal.lifecyclePing")
                  + context.languagePicker("header.config.appendix.reload"),
                context.setting.terminal.lifecycle.ping,
                [
                  { value: 15, label: context.languagePicker("header.config.terminal.lifecyclePingOption.15") },
                  { value: 30, label: context.languagePicker("header.config.terminal.lifecyclePingOption.30") },
                  { value: 45, label: context.languagePicker("header.config.terminal.lifecyclePingOption.45") },
                  { value: 60, label: context.languagePicker("header.config.terminal.lifecyclePingOption.60") },
                  { value: 120, label: context.languagePicker("header.config.terminal.lifecyclePingOption.120") },
                  { value: 180, label: context.languagePicker("header.config.terminal.lifecyclePingOption.180") },
                  { value: 240, label: context.languagePicker("header.config.terminal.lifecyclePingOption.240") },
                  { value: 300, label: context.languagePicker("header.config.terminal.lifecyclePingOption.300") },
                  { value: 0, label: context.languagePicker("header.config.terminal.lifecyclePingOption.0") }
                ],
                "terminal.lifecycle.ping",
                handleApply,
                !context.setting.terminal.enable,
                undefined,
                (value) => context.languagePicker("header.config.fallback.seconds").format(value)
              )}
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.terminal.cursor"),
          value: (
            <Stack spacing={2}>
              <Stack spacing={1}>
                {Bool(
                  context.languagePicker("header.config.terminal.cursorBlink"),
                  context.setting.terminal.cursor.blink,
                  "terminal.cursor.blink",
                  handleApply,
                  !context.setting.terminal.enable
                )}
                {Bool(
                  context.languagePicker("header.config.terminal.reflowCursorLine"),
                  context.setting.terminal.cursor.reflow,
                  "terminal.cursor.reflow",
                  handleApply,
                  !context.setting.terminal.enable
                )}
              </Stack>
              <Stack spacing={1}>
                {LabeledLiteral(
                  context.languagePicker("header.config.terminal.cursorStyle"),
                  context.setting.terminal.cursor.active,
                  [
                    { value: "block", label: context.languagePicker("header.config.terminal.activeStyleOption.block") },
                    { value: "underline", label: context.languagePicker("header.config.terminal.activeStyleOption.underline") },
                    { value: "bar", label: context.languagePicker("header.config.terminal.activeStyleOption.bar") },
                  ],
                  "terminal.cursor.active",
                  handleApply,
                  !context.setting.terminal.enable
                )}
                {LabeledLiteral(
                  context.languagePicker("header.config.terminal.cursorInactiveStyle"),
                  context.setting.terminal.cursor.inactive,
                  [
                    { value: "outline", label: context.languagePicker("header.config.terminal.inactiveStyleOption.outline") },
                    { value: "block", label: context.languagePicker("header.config.terminal.inactiveStyleOption.block") },
                    { value: "underline", label: context.languagePicker("header.config.terminal.inactiveStyleOption.underline") },
                    { value: "bar", label: context.languagePicker("header.config.terminal.inactiveStyleOption.bar") },
                    { value: "none", label: context.languagePicker("header.config.terminal.inactiveStyleOption.none") },
                  ],
                  "terminal.cursor.inactive",
                  handleApply,
                  !context.setting.terminal.enable
                )}
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.terminal.font"),
          value: (
            <Stack spacing={2}>
              {LabeledLiteral(
                context.languagePicker("header.config.terminal.fontFamily"),
                context.setting.terminal.font.family,
                monospaceFonts.map(({ name }) => ({ value: name, label: name })),
                "terminal.font.family",
                handleApply,
                !context.setting.terminal.enable
              )}
              <Stack spacing={1}>
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.fontSize")}
                  value={context.setting.terminal.font.size}
                  width={100}
                  type="number"
                  field="terminal.font.size"
                  handleCheck={(value) => !isNaN(value) && Number(value) > 0}
                  handleApply={handleApply}
                  end="px"
                  translate={(value) => Number(value)}
                />
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.fontWeight")}
                  value={context.setting.terminal.font.weight}
                  width={160}
                  type="text"
                  field="terminal.font.weight"
                  handleCheck={(_) => true}
                  handleApply={handleApply}
                  code={true}
                />
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.fontWeightBold")}
                  value={context.setting.terminal.font.weightBold}
                  width={160}
                  type="text"
                  field="terminal.font.weightBold"
                  handleCheck={(_) => true}
                  handleApply={handleApply}
                  code={true}
                />
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.terminal.text"),
          value: (
            <Stack spacing={2}>
              <Stack spacing={1}>
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.letterSpacing")}
                  value={context.setting.terminal.text.space}
                  width={100}
                  type="number"
                  field="terminal.text.space"
                  handleCheck={(value) => !isNaN(value) && Number(value) >= 0}
                  handleApply={handleApply}
                  translate={(value) => Number(value)}
                />
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.lineHeight")}
                  value={context.setting.terminal.text.height}
                  width={100}
                  type="number"
                  field="terminal.text.height"
                  handleCheck={(value) => !isNaN(value) && Number(value) >= 0}
                  handleApply={handleApply}
                  translate={(value) => Number(value)}
                />
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.contrastRatio")}
                  value={context.setting.terminal.text.contrast}
                  width={100}
                  type="number"
                  field="terminal.text.contrast"
                  handleCheck={(value) => !isNaN(value) && Number(value) >= 0}
                  handleApply={handleApply}
                  translate={(value) => Number(value)}
                />
              </Stack>
              <StringInput
                disabled={!context.setting.terminal.enable}
                caption={context.languagePicker("header.config.terminal.wordSeparator")}
                value={context.setting.terminal.text.separator}
                width={240}
                type="text"
                field="terminal.text.separator"
                handleCheck={(_) => true}
                handleApply={handleApply}
                code={true}
              />
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.terminal.scroll"),
          value: (
            <Stack spacing={2}>
              {LabeledLiteral(
                context.languagePicker("header.config.terminal.scrollback"),
                context.setting.terminal.scroll.back,
                [
                  { value: 1000, label: "1000" },
                  { value: 2500, label: "2500" },
                  { value: 5000, label: "5000" },
                  { value: 7500, label: "7500" },
                  { value: 10000, label: "10000" },
                ],
                "terminal.scroll.back",
                handleApply,
                !context.setting.terminal.enable
              )}
              <Stack spacing={1}>
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.scrollNormal")}
                  value={context.setting.terminal.scroll.normal}
                  width={100}
                  type="number"
                  field="terminal.scroll.normal"
                  handleCheck={(value) => !isNaN(value) && Number(value) > 0}
                  handleApply={handleApply}
                  translate={(value) => Number(value)}
                />
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.scrollFast")}
                  value={context.setting.terminal.scroll.fast}
                  width={100}
                  type="number"
                  field="terminal.scroll.fast"
                  handleCheck={(value) => !isNaN(value) && Number(value) > 0}
                  handleApply={handleApply}
                  translate={(value) => Number(value)}
                />
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.terminal.theme"),
          value: (
            <Stack spacing={2}>
              {Bool(
                context.languagePicker("header.config.terminal.themeTransparency")
                  + context.languagePicker("header.config.appendix.reload"),
                context.setting.terminal.theme.transparency,
                "terminal.theme.transparency",
                handleApply,
                !context.setting.terminal.enable
              )}
              <Stack spacing={1}>
                <StringInput
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.themeOption.selectionBackground")}
                  value={context.setting.terminal.theme.selectionBackground}
                  width={160}
                  type="text"
                  field="terminal.theme.selectionBackground"
                  start={<Typography sx={{ color: context.setting.terminal.theme.selectionBackground}}>ꔷ</Typography>}
                  handleCheck={(value) => value.trim() !== '' && CSS.supports("color", value.trim())}
                  handleApply={handleApply}
                  code={true}
                  startStyle={{ mr: 0.75, position: "relative", top: "0.5px" }}
                />
                {[
                  ["background", "foreground"],
                  ["cursor", "cursorAccent"],
                  ["black", "brightBlack"],
                  ["blue", "brightBlue"],
                  ["cyan", "brightCyan"],
                  ["green", "brightGreen"],
                  ["magenta", "brightMagenta"],
                  ["red", "brightRed"],
                  ["white", "brightWhite"],
                  ["yellow", "brightYellow"]
                ].map(([color, brightColor]) =>
                  <Stack key={color} spacing={{ xs: 1, lg: 4 }} direction={{ xs: "column", lg: "row" }}>
                    <StringInput
                      disabled={!context.setting.terminal.enable}
                      caption={context.languagePicker(`header.config.terminal.themeOption.${color}`)}
                      value={context.setting.terminal.theme[color]}
                      width={160}
                      type="text"
                      field={`terminal.theme.${color}`}
                      start={<Typography sx={{ color: context.setting.terminal.theme[color]}}>ꔷ</Typography>}
                      handleCheck={(value) => value.trim() !== '' && CSS.supports("color", value.trim())}
                      handleApply={handleApply}
                      code={true}
                      startStyle={{ mr: 0.75, position: "relative", top: "0.5px" }}
                    />
                    <StringInput
                      disabled={!context.setting.terminal.enable}
                      caption={context.languagePicker(`header.config.terminal.themeOption.${brightColor}`)}
                      value={context.setting.terminal.theme[brightColor]}
                      width={160}
                      type="text"
                      field={`terminal.theme.${brightColor}`}
                      start={<Typography sx={{ color: context.setting.terminal.theme[brightColor]}}>ꔷ</Typography>}
                      handleCheck={(value) => value.trim() !== '' && CSS.supports("color", value.trim())}
                      handleApply={handleApply}
                      code={true}
                      startStyle={{ mr: 0.75, position: "relative", top: "0.5px" }}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.terminal.control"),
          value: (
            <Select
              multiple
              size="sm"
              value={controlLists}
              disabled={!context.setting.terminal.enable}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                  {selected.map((selectedOption, index) => (
                    <Chip key={index} variant="outlined" color="neutral">
                      {selectedOption.label}
                    </Chip>
                  ))}
                </Box>
              )}
              onChange={(_, newValue) => {
                // shaole -> false
                const setFalse = controlLists
                  .filter((item) => !newValue.includes(item))
                  .map((item) => ({ key: item, value: false }));

                const setTrue = newValue
                  .filter((item) => !controlLists.includes(item))
                  .map((item) => ({ key: item, value: true }));

                const setKey = setFalse
                  .concat(setTrue)
                  .map((item) => ({
                    field: item.key === "esc"
                      ? "terminal.control.esc"
                      : `terminal.control.ctrl.${item.key}`,
                    value: item.value
                  }));

                setKey.forEach(({ field, value }) => handleApply(field, value))
              }}
              sx={{ maxWidth: "320px" }}
              slotProps={{
                listbox: {
                  sx: {
                    width: '100%',
                  }
                }
              }}
            >
              <Option value="esc">Esc</Option>
              <ListDivider />
              {alphabet.map((item) =>
                <Option key={item} value={item}>Ctrl + {item}</Option>
              )}
            </Select>
          )
        }
      ]
    },
    {
      id: settingField.todo,
      label: context.languagePicker("header.config.todo.title"),
      items: [
        {
          key: context.languagePicker("header.config.todo.deleteTime"),
          hint: context.languagePicker("header.config.todo.deleteTimeHint"),
          value: Literal(
            context.setting.task.delay,
            [
              { value: 0, label: context.languagePicker("header.config.todo.deleteTimeOption.0") },
              { value: 60, label: context.languagePicker("header.config.todo.deleteTimeOption.60") },
              { value: 3600, label: context.languagePicker("header.config.todo.deleteTimeOption.3600") },
              { value: 86400, label: context.languagePicker("header.config.todo.deleteTimeOption.86400") },
              { value: -1, label: context.languagePicker("header.config.todo.deleteTimeOption.never") },
            ],
            "task.delay",
            handleApply,
            undefined,
            undefined,
            (value) => context.languagePicker("header.config.fallback.seconds").format(value)
          ),
        }
      ]
    },
    {
      id: settingField.extension,
      label: context.languagePicker("header.config.extension.title"),
      items: [
        {
          key: context.languagePicker("header.config.extension.python"),
          value: (
            <Stack spacing={1}>
              <StringInput
                caption={context.languagePicker("header.config.extension.pythonLinux")}
                value={context.setting.extension.python.linux}
                width={240}
                type="text"
                field="extension.python.linux"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
              <StringInput
                caption={context.languagePicker("header.config.extension.pythonWin32")}
                value={context.setting.extension.python.win32}
                width={240}
                type="text"
                field="extension.python.win32"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.extension.pandoc"),
          value: (
            <Stack spacing={1}>
              <StringInput
                caption={context.languagePicker("header.config.extension.pandocLinux")}
                value={context.setting.extension.pandoc.linux}
                width={240}
                type="text"
                field="extension.pandoc.linux"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
              <StringInput
                caption={context.languagePicker("header.config.extension.pandocWin32")}
                value={context.setting.extension.pandoc.win32}
                width={240}
                type="text"
                field="extension.pandoc.win32"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
            </Stack>
          )
        }
      ]
    },
    {
      id: settingField.epub,
      label: context.languagePicker("header.config.epub.title"),
      items: [
        {
          key: context.languagePicker("header.config.epub.enable"),
          value: (
            Turkey(
              context.setting.epub.enable,
              "epub.enable",
              handleApply
            )
          )
        },
        {
          key: context.languagePicker("header.config.epub.page"),
          value: (
            <Stack spacing={1}>
              {Bool(
                context.languagePicker("header.config.epub.pageSplit"),
                context.setting.epub.page.split,
                "epub.page.split",
                handleApply,
                !context.setting.epub.enable
              )}
              {Bool(
                context.languagePicker("header.config.epub.pageFront"),
                context.setting.epub.page.front,
                "epub.page.front",
                handleApply,
                !context.setting.epub.enable
              )}
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.epub.nav"),
          value: (
            <Stack spacing={2}>
              {Bool(
                context.languagePicker("header.config.epub.navLink"),
                context.setting.epub.nav.link,
                "epub.nav.link",
                handleApply,
                !context.setting.epub.enable
              )}
              <Stack spacing={1}>
                <StringInput
                  disabled={!context.setting.epub.enable || !context.setting.epub.nav.link}
                  caption={context.languagePicker("header.config.epub.navPrev")}
                  value={context.setting.epub.nav.prev}
                  width={160}
                  type="text"
                  field="epub.nav.prev"
                  handleCheck={(value) => value.length > 0}
                  handleApply={handleApply}
                />
                <StringInput
                  disabled={!context.setting.epub.enable || !context.setting.epub.nav.link}
                  caption={context.languagePicker("header.config.epub.navNext")}
                  value={context.setting.epub.nav.next}
                  width={160}
                  type="text"
                  field="epub.nav.next"
                  handleCheck={(value) => value.length > 0}
                  handleApply={handleApply}
                />
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.epub.image"),
          value: (
            <Stack spacing={2}>
              <Stack spacing={1}>
                {Bool(
                  context.languagePicker("header.config.epub.imageSpec"),
                  context.setting.epub.image.spec,
                  "epub.image.spec",
                  handleApply,
                  !context.setting.epub.enable
                )}
                {Bool(
                  context.languagePicker("header.config.epub.imageAltInline"),
                  context.setting.epub.image.altInline,
                  "epub.image.altInline",
                  handleApply,
                  !context.setting.epub.enable
                )}
                {Bool(
                  context.languagePicker("header.config.epub.imageAltBlock"),
                  context.setting.epub.image.altBlock,
                  "epub.image.altBlock",
                  handleApply,
                  !context.setting.epub.enable
                )}
                {Bool(
                  context.languagePicker("header.config.epub.imageShow"),
                  context.setting.epub.image.show,
                  "epub.image.show",
                  handleApply,
                  !context.setting.epub.enable
                )}
              </Stack>
              <StringInput
                disabled={!context.setting.epub.enable || !context.setting.epub.image.show}
                caption={context.languagePicker("header.config.epub.imageWidth")}
                value={context.setting.epub.image.width ?? ""}
                width={100}
                type="number"
                field="epub.image.width"
                handleCheck={(value) => value === null || /^\d{0,3}$/.test(value)}
                handleApply={handleApply}
                end="%"
                translate={(value) => value === "" ? null : value}
              />
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.epub.text"),
          value: (
            <Stack spacing={2}>
              <Stack spacing={1}>
                {Bool(
                  context.languagePicker("header.config.epub.textClearLine"),
                  context.setting.epub.text.clearLine,
                  "epub.text.clearLine",
                  handleApply,
                  !context.setting.epub.enable
                )}
                {Bool(
                  context.languagePicker("header.config.epub.textShowRuby"),
                  context.setting.epub.text.showRuby,
                  "epub.text.showRuby",
                  handleApply,
                  !context.setting.epub.enable
                )}
              </Stack>
              <StringInput
                disabled={!context.setting.epub.enable}
                caption={context.languagePicker("header.config.epub.textBreakLine")}
                value={JSON.stringify(context.setting.epub.text.breakLine).slice(1, -1)}
                width={160}
                type="text"
                field="epub.text.breakLine"
                handleCheck={(_) => true}
                handleApply={handleApply}
                translate={(value) => JSON.parse('"' + value.replace(/"/g, '\\"') + '"')}
                code={true}
              />
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.epub.fade"),
          value: (
            <Stack spacing={2}>
              <RadioGroup
                size="sm"
                value={context.setting.epub.fade.kana}
                onChange={(event) => handleApply(
                  "epub.fade.kana",
                  event.target.value === "true"
                    ? true
                    : event.target.value === "false"
                    ? false
                    : null
                )}
              >
                <Radio
                  value="null"
                  label={context.languagePicker("header.config.epub.fadeNull")}
                  disabled={!context.setting.epub.enable}
                />
                <Radio
                  value="true"
                  label={context.languagePicker("header.config.epub.fadeTrue")}
                  disabled={!context.setting.epub.enable}
                />
                <Radio
                  value="false"
                  label={context.languagePicker("header.config.epub.fadeFalse")}
                  disabled={!context.setting.epub.enable}
                />
              </RadioGroup>
              <Stack spacing={1}>
                <StringInput
                  disabled={!context.setting.epub.enable || context.setting.epub.fade.kana === null}
                  caption={context.languagePicker("header.config.epub.fadeOpaque")}
                  value={context.setting.epub.fade.opaque}
                  width={100}
                  type="number"
                  field="epub.fade.opaque"
                  handleCheck={(value) => /^\d{1,3}$/.test(value)}
                  handleApply={handleApply}
                  start="0."
                />
                <StringInput
                  disabled={!context.setting.epub.enable || context.setting.epub.fade.kana === null}
                  caption={context.languagePicker("header.config.epub.fadeSize")}
                  value={context.setting.epub.fade.size}
                  width={100}
                  type="number"
                  field="epub.fade.size"
                  handleCheck={(value) => /^\d{1,3}$/.test(value)}
                  handleApply={handleApply}
                  start="0."
                  end="em"
                />
                <StringInput
                  disabled={!context.setting.epub.enable || context.setting.epub.fade.kana === null}
                  caption={context.languagePicker("header.config.epub.fadeTop")}
                  value={context.setting.epub.fade.top}
                  width={100}
                  type="number"
                  field="epub.fade.top"
                  handleCheck={(value) => /^-?\d+$/.test(value)}
                  handleApply={handleApply}
                  end="px"
                />
              </Stack>
            </Stack>
          )
        },
        {
          key: context.languagePicker("header.config.epub.out"),
          tip: context.languagePicker("header.config.epub.outTip"),
          value: (
            <Stack spacing={1}>
              {Bool(
                context.languagePicker("header.config.epub.outHTML"),
                context.setting.epub.out.html,
                "epub.out.html",
                handleApply,
                !context.setting.epub.enable
              )}
              {Bool(
                context.languagePicker("header.config.epub.outVert"),
                context.setting.epub.out.vert,
                "epub.out.vert",
                handleApply,
                !context.setting.epub.enable || !context.setting.epub.out.html
              )}
              {Bool(
                context.languagePicker("header.config.epub.outKeep"),
                context.setting.epub.out.keep,
                "epub.out.keep",
                handleApply,
                !context.setting.epub.enable || !context.setting.epub.out.html
              )}
            </Stack>
          )
        }
      ]
    }
  ]
};

export default function Config(props) {
  const {
    open,
    handleClose,
    handleApplySetting,
    handleResetSetting,
    handleUpload,
    handleDownload,
    mobileNavOpen,
    setMetadata,
    setMobileNavOpen,
    activeSection,
    setActiveSection,
    resetButtonLoading
  } = props;
  const context = React.useContext(GlobalContext);

  const [containerElement, setContainerElement] = React.useState(null);
  const sectionRefs = React.useRef({});
  const isSystemScrolling = React.useRef(false);
  const sectionUncurry = React.useMemo(() => SECTIONS(
    context,
    setMetadata,
    resetButtonLoading,
    handleApplySetting,
    handleResetSetting,
    handleUpload,
    handleDownload
  ), [
    context,
    setMetadata,
    resetButtonLoading,
    handleApplySetting,
    handleResetSetting,
    handleUpload,
    handleDownload
  ])

  const scrollToSection = React.useCallback((id) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const el = sectionRefs.current[id];
    if (el) {
      isSystemScrolling.current = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isSystemScrolling.current = false;
      }, animeDuration);
    }
  }, [setActiveSection, setMobileNavOpen]);

  React.useEffect(() => {
    if (!containerElement) {
      return;
    }
    const handleScroll = () => {
      if (isSystemScrolling.current) return;
      const containerTop = containerElement.getBoundingClientRect().top;
      let current = sectionUncurry[0].id;
      for (const section of sectionUncurry) {
        const el = sectionRefs.current[section.id];
        if (el && el.getBoundingClientRect().top - containerTop < 25) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };
    containerElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => containerElement.removeEventListener("scroll", handleScroll);
  }, [containerElement, setActiveSection, sectionUncurry]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        userSelect: "none",
        "& ::selection": { background: "var(--joy-palette-neutral-softActiveBg)" },
        "& ::-webkit-scrollbar": { width: "6px", height: "6px" },
        "& ::-webkit-scrollbar-track": { backgroundColor: "var(--joy-palette-background-surface)" },
        "& ::-webkit-scrollbar-thumb": { backgroundColor: "var(--joy-palette-scrollbarThumb)" },
      }}
    >
      <ModalDialog
        variant="outlined"
        role="dialog"
        aria-labelledby="config-modal-title"
        sx={{
          p: 0,
          width: { xs: "95vw", md: "82vw" },
          maxWidth: 900,
          height: { xs: "90vh", md: "78vh" },
          maxHeight: 700,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            pt: 2.5,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "neutral.outlinedBorder",
            flexShrink: 0,
            minHeight: 48,
          }}
        >
          <Typography
            sx={{mb: 0}}
            id="config-modal-title"
            level="h2"
          >
            {context.languagePicker("header.config.title")}
          </Typography>
          <Box sx={{ display: { md: "none" } }}>
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              {mobileNavOpen ? <KeyboardArrowLeftOutlinedIcon /> : <MenuRoundedIcon />}
            </IconButton>
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              onClick={handleClose}
              sx={{ ml: 1 }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
          <Box
            sx={{
              width: 170,
              flexShrink: 0,
              borderRight: "1px solid",
              borderColor: "neutral.outlinedBorder",
              overflowY: "auto",
              pt: 2,
              pb: 1,
              display: { xs: "none", md: "block" },
            }}
          >
            {sectionUncurry.map((s) => (
              <Box
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                sx={{
                  px: 2.5,
                  py: 1,
                  cursor: "pointer",
                  bgcolor: activeSection === s.id ? "neutral.100" : "transparent",
                  "&:hover": {
                    bgcolor: activeSection === s.id ? "neutral.100" : "neutral.50",
                  },
                  transition: "background-color 0.1s",
                }}
              >
                <Typography
                  level="title-sm"
                  sx={{ fontWeight: activeSection === s.id ? 600 : 400 }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
          {mobileNavOpen && (
            <Box
              sx={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                bgcolor: "background.surface",
                zIndex: 10,
                overflowY: "auto",
                display: { md: "none" },
              }}
            >
              {sectionUncurry.map((s) => (
                <Box
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    borderBottom: "1px solid",
                    borderColor: "neutral.outlinedBorder",
                    "&:hover": { bgcolor: "neutral.50" },
                  }}
                >
                  <Typography level="title-md" sx={{ fontWeight: 400 }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          <Box
            ref={setContainerElement}
            sx={{
              flex: 1,
              overflowY: "auto",
              px: { xs: 2.5, md: 4 },
              pt: 3,
              pb: 0,
            }}
          >
            {sectionUncurry.map((section) => (
              <Box
                key={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                sx={{ mb: 2 }}
              >
                <Typography
                  level="title-lg"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  {section.label}
                </Typography>
                <Stack>
                  {section.items.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Divider />}
                      <Box
                        sx={{
                          display: { xs: "flex", md: "grid" },
                          flexDirection: "column",
                          gridTemplateColumns: { md: "200px 1fr" },
                          py: 2,
                          gap: { xs: 1, md: 2 },
                          alignItems: "start",
                        }}
                      >
                        <Box>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            {item.key}
                            {item.tip &&
                              <Tooltip
                                size="sm"
                                variant="outlined"
                                color="neutral"
                                title={item.tip}
                                placement="right"
                                sx={{
                                  maxWidth: 300,
                                  py: 0.5,
                                  px: 0.75,
                                  cursor: "default"
                                }}
                              >
                                <HelpOutlineOutlinedIcon
                                  sx={{
                                    fontSize: 16,
                                    ":hover": {
                                      color: "var(--joy-palette-neutral-400)"
                                    }
                                  }}
                                />
                              </Tooltip>}
                          </Typography>
                          {item.hint && (
                            <Typography level="body-xs" textColor="text.tertiary">
                              {item.hint}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ width: "100%" }}>
                          {item.value}
                        </Box>
                      </Box>
                    </React.Fragment>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
