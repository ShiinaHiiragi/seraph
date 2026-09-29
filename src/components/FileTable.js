import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import GlobalContext, {
  serverBaseURL,
  encodePath,
  reactionInterval
} from "../interface/constants";
import RowMenu from "./RowMenu";
import ImagePreview from "./Preview"

export default function FileTable(props) {
  const {
    filesSorting,
    handleClickSort,
    type,
    folderName,
    filesList,
    sortedFilesList,
    setModalFilename,
    setModalFileLink,
    setModalRenameOpen,
    setModalRelinkOpen,
    setModalDecryptOpen,
    setFormNewFilenameText,
    setFormRelinkText,
    setFilesList,
    guard,
    searcher,
    setClipboard,
    setPublicFolders,
    setPrivateFolders
  } = props;
  const context = React.useContext(GlobalContext);

  const [preview, setPreview] = React.useState(null);
  const previewTimer = React.useRef(null);

  const closePreview = React.useCallback(() => {
    clearTimeout(previewTimer.current);
    previewTimer.current = null;
    setPreview(null);
  }, []);

  const handlePreview = React.useCallback((event, item) => {
    closePreview();
    if (
      !context.setting.file.preview.enable
        || event.pointerType !== "mouse"
        || item.link
        || !item.type?.startsWith("image/")
    ) {
      return;
    }

    const anchorEl = event.currentTarget;
    previewTimer.current = setTimeout(() => {
      previewTimer.current = null;
      if (anchorEl.isConnected) {
        setPreview({ anchorEl, src: anchorEl.href, name: item.name });
      }
    }, reactionInterval.medium);
  }, [context.setting.file.preview.enable, closePreview]);

  React.useEffect(() => {
    closePreview();
  }, [
    type,
    folderName,
    guard,
    sortedFilesList,
    filesSorting,
    context.isAuthority,
    closePreview
  ]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    window.addEventListener("scroll", closePreview, true);
    window.addEventListener("resize", closePreview);
    window.addEventListener("blur", closePreview);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(previewTimer.current);
      window.removeEventListener("scroll", closePreview, true);
      window.removeEventListener("resize", closePreview);
      window.removeEventListener("blur", closePreview);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePreview]);

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
                onClick={() => {
                  if (guard[0].length === 0) {
                    handleClickSort("name")
                  }
                }}
                sx={{ cursor: guard[0].length ? "default" : "pointer" }}
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
            <th style={{ width: 60, padding: "12px 6px" }}>
              <Link
                underline="none"
                color={guard[0].length ? "neutral" : "primary"}
                component="button"
                onClick={() => {
                  if (guard[0].length === 0) {
                    handleClickSort("size")
                  }
                }}
                sx={{ cursor: guard[0].length ? "default" : "pointer" }}
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
            <th style={{ width: 100, padding: "12px 6px" }}>
              <Link
                underline="none"
                color={guard[0].length ? "neutral" : "primary"}
                component="button"
                onClick={() => {
                  if (guard[0].length === 0) {
                    handleClickSort("type")
                  }
                }}
                sx={{ cursor: guard[0].length ? "default" : "pointer" }}
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
                onClick={() => {
                  if (guard[0].length === 0) {
                    handleClickSort("time")
                  }
                }}
                sx={{ cursor: guard[0].length ? "default" : "pointer" }}
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
            .map((item) => (
              <tr key={item.name}>
                <td>
                </td>
                <td>
                  <Typography level="body-xs">
                    {item.link
                      ? <Link target="_blank" component={RouterLink} to={item.link}>{item.name}</Link>
                      : item.type === "directory"
                      ? <Link component={RouterLink} to={`/${type}${folderName.length ? "/" : ""}${encodePath(folderName)}/${encodeURIComponent(item.name)}`}>{item.name}</Link>
                      : item.type === "text/markdown"
                      ? <Link component={RouterLink} to={`/crepe/${type}${folderName.length ? "/" : ""}${encodePath(folderName)}/${encodeURIComponent(item.name)}`}>{item.name}</Link>
                      : <Link
                          target="_blank"
                          href={new URL(`/${type}${folderName.length ? "/" : ""}${encodePath(folderName)}/${encodeURIComponent(item.name)}`, serverBaseURL).href}
                          onPointerEnter={(event) => handlePreview(event, item)}
                          onPointerLeave={closePreview}
                          onPointerDown={closePreview}
                          onClick={closePreview}
                        >{item.name}</Link>}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {item.type === "directory"
                      ? context.languagePicker("main.folder.items").format(item.size)
                      : item.size.sizeFormat()}
                  </Typography>
                </td>
                <td>
                  <Typography level="body-xs">
                    {item.type === "directory"
                      ? context.languagePicker("main.folder.viewRegulate.directory")
                      : item.link
                      ? context.languagePicker("main.folder.viewRegulate.link")
                      : item.name.endsWith(".srph")
                      ? context.languagePicker("main.folder.viewRegulate.encrypt")
                      : item.type === "unknown"
                      ? context.languagePicker("main.folder.viewRegulate.unknown")
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
                      filesList={filesList}
                      setModalFilename={setModalFilename}
                      setModalFileLink={setModalFileLink}
                      setModalRenameOpen={setModalRenameOpen}
                      setModalRelinkOpen={setModalRelinkOpen}
                      setModalDecryptOpen={setModalDecryptOpen}
                      setFormNewFilenameText={setFormNewFilenameText}
                      setFormRelinkText={setFormRelinkText}
                      setFilesList={setFilesList}
                      setClipboard={setClipboard}
                      setPublicFolders={setPublicFolders}
                      setPrivateFolders={setPrivateFolders}
                      fileType={item.type}
                      fileLink={item.link}
                    />
                  </Box>
                </td>}
              </tr>
            ))
          }
        </tbody>
      </Table>
      {preview && <ImagePreview key={preview.src} {...preview} />}
    </Sheet>
  );
}
