import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import GlobalContext, { serverBaseURL } from "../interface/constants";
import RowMenu from "./RowMenu";

export default function FileTable(props) {
  const {
    filesSorting,
    handleClickSort,
    type,
    folderName,
    sortedFilesList,
    setModalRenameOpen,
    setFormNewFilenameText,
    setFilesList,
    guard,
    searcher,
    setPublicFolders,
    setPrivateFolders
  } = props;
  const context = React.useContext(GlobalContext);
  const navigate = useNavigate();

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
            <th style={{ width: 140, padding: "12px 6px" }}>
              <Link
                underline="none"
                color={guard[0].length ? "neutral" : "primary"}
                component="button"
                onClick={() => handleClickSort("name")}
                fontWeight="lg"
                endDecorator={
                  guard[0] === "" && filesSorting[0] === "name"
                    ? filesSorting[1]
                    ? <ArrowDropDownIcon />
                    : <ArrowDropUpIcon />
                    : null
                }
              >
                {context.languagePicker("main.folder.tableColumn.name")}
              </Link>
            </th>
            <th style={{ width: 80, padding: "12px 6px" }}>
              <Link
                underline="none"
                color={guard[0].length ? "neutral" : "primary"}
                component="button"
                onClick={() => handleClickSort("size")}
                fontWeight="lg"
                endDecorator={
                  guard[0] === "" && filesSorting[0] === "size"
                    ? filesSorting[1]
                    ? <ArrowDropDownIcon />
                    : <ArrowDropUpIcon />
                    : null
                }
              >
                {context.languagePicker("main.folder.tableColumn.size")}
              </Link>
            </th>
            <th style={{ width: 80, padding: "12px 6px" }}>
              <Link
                underline="none"
                color={guard[0].length ? "neutral" : "primary"}
                component="button"
                onClick={() => handleClickSort("type")}
                fontWeight="lg"
                endDecorator={
                  guard[0] === "" && filesSorting[0] === "type"
                    ? filesSorting[1]
                    ? <ArrowDropDownIcon />
                    : <ArrowDropUpIcon />
                    : null
                }
              >
                {context.languagePicker("main.folder.tableColumn.type")}
              </Link>
            </th>
            <th style={{ width: 100, padding: "12px 6px" }}>
              <Link
                underline="none"
                color={guard[0].length ? "neutral" : "primary"}
                component="button"
                onClick={() => handleClickSort("time")}
                fontWeight="lg"
                endDecorator={
                  guard[0] === "" && filesSorting[0] === "time"
                    ? filesSorting[1]
                    ? <ArrowDropDownIcon />
                    : <ArrowDropUpIcon />
                    : null
                }
              >
                {context.languagePicker("main.folder.tableColumn.time")}
              </Link>
            </th>
            {context.isAuthority && <th style={{ width: 100, padding: "12px 6px" }}>
              {context.languagePicker("main.folder.tableColumn.operation")}
            </th>}
          </tr>
        </thead>
        <tbody>
          {(guard[0] === ""
            ? sortedFilesList
            : searcher
              .search(guard[0])
              .map((item) => item.item)
          )
            .filter((item) => 
              [null, "All"]
                .includes(guard[1])
                  ? true
                  : new RegExp(
                    `^(${guard[1].toLowerCase()}/|${guard[1].toLowerCase()}$)`
                  ).test(item.type)
            )
            .map((item, index) => (
              <tr key={index}>
                <td>
                </td>
                <td>
                  <Typography level="body-xs">
                    {item.type === "directory"
                      ? <Link
                      onClick={() => navigate(
                        `/${type}${folderName.length ? "/" : ""}${folderName}/${item.name}`
                      )}
                    >
                      {item.name}
                    </Link>
                    : <Link
                      target="_blank"
                      href={
                        new URL(
                          `/${type}${folderName.length ? "/" : ""}${folderName}/${item.name}`,
                          serverBaseURL
                        ).href
                      }
                    >
                      {item.name}
                    </Link>}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {item.size.sizeFormat()}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {item.type === "unknown"
                      ? context.languagePicker("main.folder.viewRegulate.unknown")
                      : item.type === "directory"
                      ? context.languagePicker("main.folder.viewRegulate.directory")
                      : item.type}
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
                {context.isAuthority && <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <RowMenu
                      type={type}
                      folderName={folderName}
                      filename={item.name}
                      setModalRenameOpen={setModalRenameOpen}
                      setFormNewFilenameText={setFormNewFilenameText}
                      setFilesList={setFilesList}
                      setPublicFolders={setPublicFolders}
                      setPrivateFolders={setPrivateFolders}
                    />
                  </Box>
                </td>}
              </tr>
            ))
          }
        </tbody>
      </Table>
    </Sheet>
  );
}
