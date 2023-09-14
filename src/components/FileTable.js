import * as React from "react";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import GlobalContext from "../interface/constants";
import RowMenu from "./RowMenu";

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
              {context.languagePicker("main.folder.tableColumn.name")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.tableColumn.size")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.tableColumn.type")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.tableColumn.time")}
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.tableColumn.operation")}
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
                  {item.type || context.languagePicker("main.folder.viewRegulate.unknown")}
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
