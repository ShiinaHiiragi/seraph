/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Link as RouterLink } from "react-router-dom";
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListDivider from '@mui/joy/ListDivider';
import Link from "@mui/joy/Link";
import GlobalContext, { serverBaseURL, encodePath } from "../interface/constants";
import RowMenu from './RowMenu';

export default function FileList(props) {
  const {
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

  return (
    <Box
      sx={{
        display: { xs: 'block', sm: 'none' },
        overflowY: "visible",
      }}
    >
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
        .map((item, index, self) => (
          <List
            key={index}
            size="sm"
            sx={{ '--ListItem-paddingX': 0 }}
          >
            <ListItem
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
              }}
            >
              <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                <div>
                  <Typography fontWeight={600} gutterBottom>
                    {item.link
                      ? <Link target="_blank" component={RouterLink} to={item.link}>{item.name}</Link>
                      : item.type === "directory"
                      ? <Link component={RouterLink} to={`/${type}${folderName.length ? "/" : ""}${encodePath(folderName)}/${encodeURIComponent(item.name)}`}>{item.name}</Link>
                      : item.type === "text/markdown"
                      ? <Link component={RouterLink} to={`/crepe/${type}${folderName.length ? "/" : ""}${encodePath(folderName)}/${encodeURIComponent(item.name)}`}>{item.name}</Link>
                      : <Link target="_blank" href={new URL(`/${type}${folderName.length ? "/" : ""}${encodePath(folderName)}/${encodeURIComponent(item.name)}`, serverBaseURL).href}>{item.name}</Link>}
                  </Typography>
                  <Typography level="body-xs" gutterBottom>
                    {context
                      .languagePicker("main.folder.listHint.createTime")
                      .format(item.time.timeFormat(
                        context.languagePicker("universal.time.dateFormat")
                          + " "
                          + context.languagePicker("universal.time.timeFormat")
                      ))}
                  </Typography>
                  <Typography level="body-xs" gutterBottom>
                    {context
                      .languagePicker("main.folder.listHint.modifiedTime")
                      .format(item.mtime.timeFormat(
                        context.languagePicker("universal.time.dateFormat")
                          + " "
                          + context.languagePicker("universal.time.timeFormat")
                      ))}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 0.75,
                      mb: 1,
                    }}
                  >
                    <Typography level="body-xs" component="span">
                      {item.type === "directory"
                        ? context.languagePicker("main.folder.items").format(item.size)
                        : item.size.sizeFormat()}
                    </Typography>
                    <Typography level="body-xs">&bull;</Typography>
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
                  </Box>
                </div>
              </ListItemContent>
              {context.isAuthority &&
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
                />}
            </ListItem>
            {index !== self.length - 1 && <ListDivider />}
          </List>
        ))
      }
    </Box>
  );
}
