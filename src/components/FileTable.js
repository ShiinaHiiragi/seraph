import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import GlobalContext from "../interface/constants";

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function FileTable(props) {
  const {
    filesList
  } = props;
  const context = React.useContext(GlobalContext);

  return (
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
        overflowX: "auto",
      }}
    >
      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        hoverRow
        sx={{
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "4px",
          "--TableCell-paddingX": "8px",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 24 }}>
            </th>
            <th style={{ width: 120, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.fileAttribute.name")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.fileAttribute.size")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.fileAttribute.type")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.fileAttribute.time")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.fileAttribute.operation")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filesList.map((item, index) => (
            <tr key={index}>
              <td>
              </td>
              <td>
                <Typography level="body-xs">
                  {item.name}
                </Typography>
              </td>
              <td>
                <Typography level="body-xs">
                  {item.size.sizeFormat()}
                </Typography>
              </td>
              <td>
                <Typography level="body-xs">
                  {item.type || context.languagePicker("main.folder.tableView.unknown")}
                </Typography>
              </td>
              <td>
                <Typography level="body-xs">
                  {item.time.timeFormat(
                    context.languagePicker("universal.time.dateFormat")
                      + " "
                      + context.languagePicker("universal.time.timeFormat")
                  )}
                </Typography>
              </td>
              <td>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <RowMenu />
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
