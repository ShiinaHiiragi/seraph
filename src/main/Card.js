import React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Input from "@mui/joy/Input";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListDivider from "@mui/joy/ListDivider";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import IconButton from "@mui/joy/IconButton";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

const initialCards = [
  {
    id: "84d875da8b8f97c5501cd8a8240a5918",
    query: "抜粋",
    key: "ばっすい\n[名·他动·サ变] 摘录，集锦",
    time: 1793596082531,
    point: [1, 0, 0, -1]
  },
  {
    id: "edd8a7514d8211c077c9f9cad4523320",
    query: "落胆",
    key: "らくたん\n[名·自动·サ变] 灰心，气馁，消沉",
    time: 1793596084387,
    point: [1, 1, 1, -1]
  },
  {
    id: "37a3c4c1cd1fdd4ff5c300e732c932a6",
    query: "頓珍漢",
    key: "とんちんかん\n[名·形动] (说话做事)前后不符,前后矛盾傻事笨事",
    time: 1793596084949,
    point: [0, 0, 0, 1]
  },
  {
    id: "efc28f2a1a5aadeede9ceddadb323990",
    query: "我楽多",
    key: "がらくた\n[名] 値打ちのない、または役に立たない雑多な品物。",
    time: 1793596085404,
    point: [0, 1, -1, 0]
  }
];

const CardRowMenu = () => (
  <Dropdown>
    <MenuButton
      aria-label="操作"
      slots={{ root: IconButton }}
      slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
    >
      <MoreHorizRoundedIcon sx={{ display: { xs: "none", sm: "inline-flex" } }} />
      <MoreVertRoundedIcon sx={{ display: { xs: "inline-flex", sm: "none" } }} />
    </MenuButton>
    <Menu size="sm" sx={{ minWidth: 140 }}>
      <MenuItem>编辑</MenuItem>
      <Divider />
      <MenuItem color="danger">删除</MenuItem>
    </Menu>
  </Dropdown>
);

const Card = () => {
  const context = React.useContext(GlobalContext);
  const [cards, setCards] = React.useState(initialCards);
  const [memorizing, setMemorizing] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const unfinished = cards.some((item) => item.point[item.point.length - 1] === -1);
  const filteredCards = cards.filter(
    (item) => `${item.query}\n${item.key}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const handleStart = () => {
    setCards((cards) => cards.map((item) => ({
      ...item,
      point: [...item.point, -1]
    })));
    setMemorizing(true);
  };

  const handleAnswer = (time) => {
    setCards((cards) => cards.map((item) => item.time === time
      ? {
        ...item,
        point: [
          ...item.point.slice(0, -1),
          item.point[item.point.length - 1] === 1 ? 0 : 1
        ]
      }
      : item
    ));
  };

  const renderAnswer = (item) => {
    const point = item.point[item.point.length - 1];
    const hidden = memorizing && point === -1;

    return (
      <Box
        component={memorizing ? "button" : "div"}
        type={memorizing ? "button" : undefined}
        onClick={memorizing ? () => handleAnswer(item.time) : undefined}
        aria-label={hidden ? `显示 ${item.query} 的答案` : undefined}
        sx={{
          display: "block",
          width: "100%",
          boxSizing: "border-box",
          border: 0,
          borderRadius: "sm",
          px: 1,
          py: 0.75,
          textAlign: "left",
          cursor: memorizing ? "pointer" : "default",
          bgcolor: !memorizing
            ? "transparent"
            : hidden
            ? "neutral.300"
            : point === 1
            ? "success.softBg"
            : "danger.softBg",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.500",
            outlineOffset: 2
          }
        }}
      >
        <Typography
          component="span"
          level="body-xs"
          sx={{
            display: "block",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            visibility: hidden ? "hidden" : "visible"
          }}
        >
          {item.key}
        </Typography>
      </Box>
    );
  };

  return (
    <RouteField
      display={context.isAuthority}
      path={["实用工具", "记忆卡片"]}
      title="记忆卡片"
      sxRaw={{ overflowY: "hidden" }}
      sx={{
        flexDirection: "column",
        minHeight: 0,
        overflowY: { xs: "auto", sm: "hidden" },
        overflowX: { xs: "auto", sm: "hidden" },
        height: { xs: "auto", sm: "100%" }
      }}
    >
      <Box
        className="SearchAndFilters"
        sx={{ display: "flex", flexWrap: "nowrap", gap: 1.5, pb: 2, borderRadius: "sm" }}
      >
        <Input
          size="sm"
          placeholder="搜索"
          aria-label="搜索卡片"
          autoComplete="off"
          startDecorator={<SearchIcon />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ flex: 1, minWidth: 0 }}
        />
        {memorizing ? <Button
          size="sm"
          startDecorator={<CloseOutlinedIcon />}
          onClick={() => setMemorizing(false)}
          sx={{ flexShrink: 0 }}
        >
          结束
        </Button> : <Dropdown>
          <MenuButton
            size="sm"
            variant="solid"
            color="primary"
            startDecorator={<DoneOutlinedIcon />}
            sx={{ flexShrink: 0 }}
          >
            操作
          </MenuButton>
          <Menu size="sm" placement="bottom-end" sx={{ minWidth: 140 }}>
            <MenuItem onClick={handleStart}>
              开始
            </MenuItem>
            <MenuItem
              disabled={!unfinished}
              onClick={() => setMemorizing(true)}
            >
              继续
            </MenuItem>
            <Divider />
            <MenuItem>查看报告</MenuItem>
          </Menu>
        </Dropdown>}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          height: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "auto"
        }}
      >
        <Table
          aria-label="记忆卡片"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px"
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 24 }}></th>
              <th style={{ width: 100, padding: "12px 6px" }}>问题</th>
              <th style={{ width: 200, padding: "12px 6px" }}>答案</th>
              <th style={{ width: 100, padding: "12px 6px" }}>创建时间</th>
              <th style={{ width: 100, padding: "12px 6px" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.map((item) => (
              <tr key={item.time}>
                <td></td>
                <td><Typography level="body-xs">{item.query}</Typography></td>
                <td>{renderAnswer(item)}</td>
                <td>
                  <Typography level="body-xs">
                    {new Date(item.time).toLocaleString("zh-CN", { hour12: false })}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <CardRowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box sx={{ display: { xs: "block", sm: "none" }, overflowY: "visible" }}>
        {filteredCards.map((item, index, self) => (
          <List key={item.time} size="sm" sx={{ "--ListItem-paddingX": 0 }}>
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start"
              }}
            >
              <ListItemContent sx={{ display: "flex", gap: 2, alignItems: "start" }}>
                <Box sx={{ width: "100%", minWidth: 0 }}>
                  <Typography fontWeight={600} gutterBottom>{item.query}</Typography>
                  <Typography level="body-xs" gutterBottom>
                    创建于 {new Date(item.time).toLocaleString("zh-CN", { hour12: false })}
                  </Typography>
                  <Box sx={{ mx: -1, mb: 1 }}>{renderAnswer(item)}</Box>
                </Box>
              </ListItemContent>
              <CardRowMenu />
            </ListItem>
            {index !== self.length - 1 && <ListDivider />}
          </List>
        ))}
      </Box>
    </RouteField>
  )
}

export default Card;
