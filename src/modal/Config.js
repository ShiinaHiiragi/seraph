import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Switch from "@mui/joy/Switch";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Checkbox from "@mui/joy/Checkbox";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GlobalContext, {
  animeDuration,
  settingField,
  reactionInterval,
  monospaceFonts
} from "../interface/constants";
import { languageMap } from "../interface/languagePicker";

const Literal = (value, itemsMap, field, handleApply, disabled) => (
  <Select size="sm" value={value} sx={{ maxWidth: 240 }} disabled={disabled}>
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

const LabeledLiteral = (caption, value, itemsMap, field, handleApply, disabled) => (
  <FormControl>
    <FormLabel sx={{ mb: 0, color: "neutral.500" }}>
      {caption}
    </FormLabel>
    <Select size="sm" value={value} sx={{ maxWidth: 240 }} disabled={disabled}>
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

const String = (props) => {
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
    code
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
        sx={{ maxWidth: width, fontFamily: code ? "monospace" : undefined }}
        value={localValue}
        startDecorator={start}
        endDecorator={end}
        onChange={(e) => setLocalValue(e.target.value)}
        error={localError}
        slotProps={{ startDecorator: { sx: { mr: 0.5 } } }}
      />
    </FormControl>
  );
};

const SECTIONS = (context, resetButtonLoading, handleApply, handleReset) => {
  // TODO: reset password
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
          key: context.languagePicker("header.config.general.token"),
          hint: context.languagePicker("header.config.general.tokenHint"),
          value: Literal(context.setting.meta.token, [
            { value: 15, label: context.languagePicker("header.config.general.tokenOption.15") },
            { value: 60, label: context.languagePicker("header.config.general.tokenOption.60") },
            { value: 720, label: context.languagePicker("header.config.general.tokenOption.720") },
            { value: 1440, label: context.languagePicker("header.config.general.tokenOption.1440") },
            { value: 2880, label: context.languagePicker("header.config.general.tokenOption.2880") }
          ], "meta.token", handleApply)
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
            >
              {context.languagePicker("header.config.general.resetButton")}
            </Button>
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
              handleApply
            )
          )
        },
        {
          key: context.languagePicker("header.config.terminal.shell"),
          value: (
            <Stack spacing={1}>
              <String
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
              <String
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
          key: context.languagePicker("header.config.terminal.timeout"),
          value: Literal(context.setting.terminal.timeout, [
            { value: 15, label: context.languagePicker("header.config.terminal.timeoutOption.15") },
            { value: 30, label: context.languagePicker("header.config.terminal.timeoutOption.30") },
            { value: 60, label: context.languagePicker("header.config.terminal.timeoutOption.60") },
            { value: 120, label: context.languagePicker("header.config.terminal.timeoutOption.120") },
            { value: 240, label: context.languagePicker("header.config.terminal.timeoutOption.240") },
            { value: 360, label: context.languagePicker("header.config.terminal.timeoutOption.360") },
          ], "terminal.timeout", handleApply, !context.setting.terminal.enable)
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
                monospaceFonts.map((item) => ({ value: item, label: item })),
                "terminal.font.family",
                handleApply,
                !context.setting.terminal.enable
              )}
              <Stack spacing={1}>
                <String
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
                <String
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
                <String
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
                <String
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
                <String
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
                <String
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
              <String
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
                <String
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
                <String
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
                context.languagePicker("header.config.terminal.themeTransparency"),
                context.setting.terminal.theme.transparency,
                "terminal.theme.transparency",
                handleApply
              )}
              <Stack spacing={1}>
                <String
                  disabled={!context.setting.terminal.enable}
                  caption={context.languagePicker("header.config.terminal.themeOption.selectionBackground")}
                  value={context.setting.terminal.theme.selectionBackground}
                  width={160}
                  type="text"
                  field="terminal.theme.selectionBackground"
                  handleCheck={(value) => value.trim() !== '' && CSS.supports("color", value.trim())}
                  handleApply={handleApply}
                  code={true}
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
                  <Stack key={color} spacing={{ md: 1, lg: 4 }} direction={{ md: "column", lg: "row" }}>
                    <String
                      disabled={!context.setting.terminal.enable}
                      caption={context.languagePicker(`header.config.terminal.themeOption.${color}`)}
                      value={context.setting.terminal.theme[color]}
                      width={160}
                      type="text"
                      field={`terminal.theme.${color}`}
                      handleCheck={(value) => value.trim() !== '' && CSS.supports("color", value.trim())}
                      handleApply={handleApply}
                      code={true}
                    />
                    <String
                      disabled={!context.setting.terminal.enable}
                      caption={context.languagePicker(`header.config.terminal.themeOption.${brightColor}`)}
                      value={context.setting.terminal.theme[brightColor]}
                      width={160}
                      type="text"
                      field={`terminal.theme.${brightColor}`}
                      handleCheck={(value) => value.trim() !== '' && CSS.supports("color", value.trim())}
                      handleApply={handleApply}
                      code={true}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
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
          value: Literal(context.setting.task.delay, [
            { value: 0, label: context.languagePicker("header.config.todo.deleteTimeOption.0") },
            { value: 60, label: context.languagePicker("header.config.todo.deleteTimeOption.60") },
            { value: 3600, label: context.languagePicker("header.config.todo.deleteTimeOption.3600") },
            { value: 86400, label: context.languagePicker("header.config.todo.deleteTimeOption.86400") }
          ], "task.delay", handleApply),
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
              <String
                caption={context.languagePicker("header.config.extension.pythonLinux")}
                value={context.setting.extension.python.linux}
                width={240}
                type="text"
                field="extension.python.linux"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
              <String
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
              <String
                caption={context.languagePicker("header.config.extension.pandocLinux")}
                value={context.setting.extension.pandoc.linux}
                width={240}
                type="text"
                field="extension.pandoc.linux"
                handleCheck={(value) => value.length > 0}
                handleApply={handleApply}
                code={true}
              />
              <String
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
          key: context.languagePicker("header.config.epub.page"),
          value: (
            <Stack spacing={1}>
              {Bool(
                context.languagePicker("header.config.epub.pageSplit"),
                context.setting.epub.page.split,
                "epub.page.split",
                handleApply
              )}
              {Bool(
                context.languagePicker("header.config.epub.pageFront"),
                context.setting.epub.page.front,
                "epub.page.front",
                handleApply
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
                handleApply
              )}
              <Stack spacing={1}>
                <String
                  disabled={!context.setting.epub.nav.link}
                  caption={context.languagePicker("header.config.epub.navPrev")}
                  value={context.setting.epub.nav.prev}
                  width={160}
                  type="text"
                  field="epub.nav.prev"
                  handleCheck={(value) => value.length > 0}
                  handleApply={handleApply}
                />
                <String
                  disabled={!context.setting.epub.nav.link}
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
                  handleApply
                )}
                {Bool(
                  context.languagePicker("header.config.epub.imageAltInline"),
                  context.setting.epub.image.altInline,
                  "epub.image.altInline",
                  handleApply
                )}
                {Bool(
                  context.languagePicker("header.config.epub.imageAltBlock"),
                  context.setting.epub.image.altBlock,
                  "epub.image.altBlock",
                  handleApply
                )}
                {Bool(
                  context.languagePicker("header.config.epub.imageShow"),
                  context.setting.epub.image.show,
                  "epub.image.show",
                  handleApply
                )}
              </Stack>
              <String
                disabled={!context.setting.epub.image.show}
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
                  handleApply
                )}
                {Bool(
                  context.languagePicker("header.config.epub.textShowRuby"),
                  context.setting.epub.text.showRuby,
                  "epub.text.showRuby",
                  handleApply
                )}
              </Stack>
              <String
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
                <Radio value="null" label={context.languagePicker("header.config.epub.fadeNull")} />
                <Radio value="true" label={context.languagePicker("header.config.epub.fadeTrue")} />
                <Radio value="false" label={context.languagePicker("header.config.epub.fadeFalse")} />
              </RadioGroup>
              <Stack spacing={1}>
                <String
                  disabled={context.setting.epub.fade.kana === null}
                  caption={context.languagePicker("header.config.epub.fadeOpaque")}
                  value={context.setting.epub.fade.opaque}
                  width={100}
                  type="number"
                  field="epub.fade.opaque"
                  handleCheck={(value) => /^\d{1,3}$/.test(value)}
                  handleApply={handleApply}
                  start="0."
                />
                <String
                  disabled={context.setting.epub.fade.kana === null}
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
                <String
                  disabled={context.setting.epub.fade.kana === null}
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
          value: (
            <Stack spacing={1}>
              {Bool(
                context.languagePicker("header.config.epub.outHTML"),
                context.setting.epub.out.html,
                "epub.out.html",
                handleApply
              )}
              {Bool(
                context.languagePicker("header.config.epub.outVert"),
                context.setting.epub.out.vert,
                "epub.out.vert",
                handleApply,
                !context.setting.epub.out.html
              )}
              {Bool(
                context.languagePicker("header.config.epub.outKeep"),
                context.setting.epub.out.keep,
                "epub.out.keep",
                handleApply
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
    mobileNavOpen,
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
    resetButtonLoading,
    handleApplySetting,
    handleResetSetting
  ), [context, resetButtonLoading, handleApplySetting, handleResetSetting])

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
        "& ::selection": { background: "rgb(173, 214, 255)" },
        "& ::-webkit-scrollbar": { width: "6px", height: "6px" },
        "& ::-webkit-scrollbar-track": { backgroundColor: "rgb(250,250,250)" },
        "& ::-webkit-scrollbar-thumb": { backgroundColor: "rgb(190,190,190)" },
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
                  {section.items.map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <Divider />}
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
                          <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                            {item.key}
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
