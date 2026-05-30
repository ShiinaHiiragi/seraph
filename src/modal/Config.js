import * as React from "react";
import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GlobalContext, { animeDuration, settingField } from "../interface/constants";

const SECTIONS = [
  {
    id: settingField.general,
    label: "General",
    items: [
      {
        key: "On Launch",
        value: (
          <Select size="sm" defaultValue="new" sx={{ maxWidth: 300 }}>
            <Option value="new">Open new file</Option>
            <Option value="last">Open last file</Option>
            <Option value="folder">Open last folder</Option>
          </Select>
        ),
      },
      {
        key: "Save & Recover",
        value: (
          <Stack spacing={1}>
            <Checkbox size="sm" label="Auto Save" />
            <Checkbox size="sm" label="Save without asking when switch files on side panel" />
            <Button variant="outlined" color="neutral" size="sm" sx={{ alignSelf: "flex-start" }}>
              Recover Unsaved Drafts
            </Button>
          </Stack>
        ),
      },
      {
        key: "Language",
        hint: "(applied after restart)",
        value: (
          <Select size="sm" defaultValue="system" sx={{ maxWidth: 300 }}>
            <Option value="system">System Language</Option>
            <Option value="en">English</Option>
            <Option value="zh">Chinese (Simplified)</Option>
            <Option value="ja">Japanese</Option>
          </Select>
        ),
      },
      {
        key: "Update",
        value: (
          <Stack spacing={1}>
            <Button variant="outlined" color="neutral" size="sm" sx={{ alignSelf: "flex-start" }}>
              Check Updates
            </Button>
            <Checkbox size="sm" label="Check updates automatically" />
          </Stack>
        ),
      },
      {
        key: "Shortcut Keys",
        value: (
          <Button variant="outlined" color="neutral" size="sm" sx={{ alignSelf: "flex-start" }}>
            Custom Shortcut Keys
          </Button>
        ),
      },
      {
        key: "Dialogs",
        value: (
          <Button variant="outlined" color="neutral" size="sm" sx={{ alignSelf: "flex-start" }}>
            Reset All Dialog Warnings
          </Button>
        ),
      },
      {
        key: "Advanced Settings",
        value: (
          <Stack spacing={1}>
            <Checkbox size="sm" label="Enable Debug" />
            <Checkbox size="sm" label="Send Anonymous Usage Info" defaultChecked />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="outlined" color="neutral" size="sm">
                Open Advanced Settings
              </Button>
              <Button variant="outlined" color="neutral" size="sm">
                Reset Advanced Settings
              </Button>
            </Box>
          </Stack>
        ),
      },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    items: [
      {
        key: "Theme",
        value: (
          <RadioGroup size="sm" defaultValue="light">
            <Radio value="light" label="Light" />
            <Radio value="dark" label="Dark" />
            <Radio value="system" label="Follow System" />
          </RadioGroup>
        ),
      },
      {
        key: "Font Family",
        value: (
          <Select size="sm" defaultValue="default" sx={{ maxWidth: 300 }}>
            <Option value="default">Default</Option>
            <Option value="serif">Serif</Option>
            <Option value="sans-serif">Sans Serif</Option>
            <Option value="monospace">Monospace</Option>
          </Select>
        ),
      },
      {
        key: "Font Size",
        value: <Input size="sm" type="number" defaultValue={16} sx={{ width: 120 }} endDecorator="px" />,
      },
      {
        key: "Line Spacing",
        value: <Input size="sm" type="number" defaultValue={1.6} sx={{ width: 120 }} />,
      },
      {
        key: "Code Block",
        value: (
          <Stack spacing={1}>
            <Checkbox size="sm" label="Syntax highlight" defaultChecked />
            <Checkbox size="sm" label="Show line numbers" />
            <Checkbox size="sm" label="Auto wrap" />
          </Stack>
        ),
      },
    ],
  },
  {
    id: "editor",
    label: "Editor",
    items: [
      {
        key: "Default Edit Mode",
        value: (
          <RadioGroup size="sm" defaultValue="wysiwyg">
            <Radio value="wysiwyg" label="WYSIWYG" />
            <Radio value="source" label="Source Code Mode" />
            <Radio value="outline" label="Outline Mode" />
          </RadioGroup>
        ),
      },
      {
        key: "Indent",
        value: (
          <Select size="sm" defaultValue="4" sx={{ maxWidth: 200 }}>
            <Option value="2">2 Spaces</Option>
            <Option value="4">4 Spaces</Option>
            <Option value="tab">Tab</Option>
          </Select>
        ),
      },
      {
        key: "Features",
        value: (
          <Stack spacing={1}>
            <Checkbox size="sm" label="Live preview" defaultChecked />
            <Checkbox size="sm" label="Spell check" />
            <Checkbox size="sm" label="Auto pair brackets / quotes" defaultChecked />
            <Checkbox size="sm" label="Smart punctuation" defaultChecked />
          </Stack>
        ),
      },
      {
        key: "Table",
        value: (
          <Stack spacing={1}>
            <Checkbox size="sm" label="Format table on save" defaultChecked />
            <Checkbox size="sm" label="Drag to reorder rows and columns" />
          </Stack>
        ),
      },
    ],
  },
  {
    id: "image",
    label: "Image",
    items: [
      {
        key: "Image Insert",
        value: (
          <Select size="sm" defaultValue="copy" sx={{ maxWidth: 300 }}>
            <Option value="none">No action</Option>
            <Option value="copy">Copy to assets folder</Option>
            <Option value="move">Move to assets folder</Option>
            <Option value="upload">Upload image</Option>
          </Select>
        ),
      },
      {
        key: "Prefer Relative Path",
        value: <Checkbox size="sm" label="Use relative path where possible" defaultChecked />,
      },
    ],
  },
  {
    id: "export",
    label: "Export",
    items: [
      {
        key: "Export Format",
        value: (
          <Select size="sm" defaultValue="pdf" sx={{ maxWidth: 200 }}>
            <Option value="pdf">PDF</Option>
            <Option value="html">HTML</Option>
            <Option value="docx">Word (.docx)</Option>
            <Option value="md">Markdown</Option>
          </Select>
        ),
      },
      {
        key: "PDF Margin",
        value: <Input size="sm" defaultValue="1in" sx={{ width: 120 }} />,
      },
      {
        key: "Include Front Matter",
        value: <Checkbox size="sm" label="Add YAML front matter to export" />,
      },
    ],
  },
];

export default function Config(props) {
  const {
    open,
    handleClose,
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
      let current = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = sectionRefs.current[section.id];
        if (el && el.getBoundingClientRect().top - containerTop < 25) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };
    containerElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => containerElement.removeEventListener("scroll", handleScroll);
  }, [containerElement, setActiveSection]);

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
            {SECTIONS.map((s) => (
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
              {SECTIONS.map((s) => (
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
            {SECTIONS.map((section) => (
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
