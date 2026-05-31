import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GlobalContext, {
  animeDuration,
  settingField
} from "../interface/constants";
import { languageMap } from "../interface/languagePicker";

const SECTIONS = (context, handleApply) => {
  const Selection = (value, itemsMap, handleClick) => (
    <Select size="sm" value={value} sx={{ maxWidth: 300 }}>
      {itemsMap.map(({value, label}) => (
        <Option
          key={value}
          value={value}
          onClick={() => handleClick(value)}
        >
          {label}
        </Option>
      ))}
    </Select>
  )

  return [
    {
      id: settingField.general,
      label: context.languagePicker("header.config.general.title"),
      items: [
        {
          key: context.languagePicker("header.config.general.language"),
          value: Selection(
            context.setting.meta.language,
            Object.entries(languageMap).map((item) => ({
              value: item[0],
              label: item[1].displayName
            })),
            (value) => handleApply("meta.language", value)
          ),
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
                        <Box>{item.value}</Box>
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
