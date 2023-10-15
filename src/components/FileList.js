/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListDivider from '@mui/joy/ListDivider';
import Link from "@mui/joy/Link";
import GlobalContext, { serverBaseURL } from "../interface/constants";
import RowMenu from './RowMenu';

export default function FileList(props) {
  const {
    type,
    folderName,
    sortedFilesList,
    setModalRenameOpen,
    setFormNewFilenameText,
    setFilesList,
    guard,
    searcher,
    setClipboard,
    setPublicFolders,
    setPrivateFolders
  } = props;
  const context = React.useContext(GlobalContext);
  const navigate = useNavigate();

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
                        ? "—"
                        : item.size.sizeFormat()}
                    </Typography>
                    <Typography level="body-xs">&bull;</Typography>
                    <Typography level="body-xs">
                      {item.type === "unknown"
                        ? context.languagePicker("main.folder.viewRegulate.unknown")
                        : item.type === "directory"
                        ? context.languagePicker("main.folder.viewRegulate.directory")
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
                  setModalRenameOpen={setModalRenameOpen}
                  setFormNewFilenameText={setFormNewFilenameText}
                  setFilesList={setFilesList}
                  setClipboard={setClipboard}
                  setPublicFolders={setPublicFolders}
                  setPrivateFolders={setPrivateFolders}
                  fileType={item.type}
                />}
            </ListItem>
            {index !== self.length - 1 && <ListDivider />}
          </List>
        ))
      }
    </Box>
  );
}
