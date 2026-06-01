import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
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
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GlobalContext, {
  animeDuration,
  settingField,
  reactionInterval
} from "../interface/constants";
import { languageMap } from "../interface/languagePicker";

const Literal = (value, itemsMap, field, handleApply) => (
  <Select size="sm" value={value} sx={{ maxWidth: 250 }}>
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
)

// const Trifid = (value, itemsMap, field, handleApply) => (
//   <RadioGroup
//     size="sm"
//     value={value}
//     onChange={(event) => handleApply(field, event.target.value)}
//   >
//     {itemsMap.map(({ value, label }) => (
//       <Radio key={label} value={value} label={label} />
//     ))}
//   </RadioGroup>
// )

const Bool = (label, checked, field, handleApply) => (
  <Checkbox
    size="sm"
    label={label}
    checked={checked}
    onChange={(event) => handleApply(field, event.target.checked)}
  />
)

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
    end
  } = props;

  const [localValue, setLocalValue] = React.useState(value);
  const [localLastValid, setLocalLastValid] = React.useState(value);
  const [localError, setLocalError] = React.useState(false);
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const id = setTimeout(() => {
      const checkError = handleCheck(localValue)
      setLocalError(!checkError)
      if (checkError && localValue !== localLastValid) {
        handleApply(field, localValue);
        setLocalLastValid(localValue);
      }
    }, reactionInterval.slow);
    return () => clearTimeout(id);
  }, [localValue, localLastValid, field, handleApply, handleCheck]);

  return (
    <FormControl>
      <FormLabel sx={{ mb: 0, color: "neutral.500" }}>
        {caption}
      </FormLabel>
      <Input
        disabled={disabled}
        size="sm"
        type={type}
        sx={{ maxWidth: width }}
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

const SECTIONS = (context, handleApply) => {
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
          ], (value) => handleApply("task.delay", value)),
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
                  width={200}
                  type="text"
                  field="epub.nav.prev"
                  handleCheck={(value) => value.length > 0}
                  handleApply={handleApply}
                />
                <String
                  disabled={!context.setting.epub.nav.link}
                  caption={context.languagePicker("header.config.epub.navNext")}
                  value={context.setting.epub.nav.next}
                  width={200}
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
    mobileNavOpen,
    setMobileNavOpen,
    activeSection,
    setActiveSection
  } = props;
  const context = React.useContext(GlobalContext);

  const [containerElement, setContainerElement] = React.useState(null);
  const sectionRefs = React.useRef({});
  const isSystemScrolling = React.useRef(false);

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
      let current = SECTIONS(context, handleApplySetting)[0].id;
      for (const section of SECTIONS(context, handleApplySetting)) {
        const el = sectionRefs.current[section.id];
        if (el && el.getBoundingClientRect().top - containerTop < 25) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };
    containerElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => containerElement.removeEventListener("scroll", handleScroll);
  }, [containerElement, setActiveSection, context, handleApplySetting]);

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
          width: { xs: "95vw", sm: "82vw" },
          maxWidth: 900,
          height: { xs: "90vh", sm: "78vh" },
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
          <Box sx={{ display: { sm: "none" } }}>
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              {mobileNavOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
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
              display: { xs: "none", sm: "block" },
            }}
          >
            {SECTIONS(context, handleApplySetting).map((s) => (
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
                display: { sm: "none" },
              }}
            >
              {SECTIONS(context, handleApplySetting).map((s) => (
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
              px: { xs: 2.5, sm: 4 },
              pt: 3,
              pb: 0,
            }}
          >
            {SECTIONS(context, handleApplySetting).map((section) => (
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
                          display: { xs: "flex", sm: "grid" },
                          flexDirection: "column",
                          gridTemplateColumns: { sm: "200px 1fr" },
                          py: 2,
                          gap: { xs: 1, sm: 2 },
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
                        <Box sx={{ width: { xs: "100%" } }}>
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
