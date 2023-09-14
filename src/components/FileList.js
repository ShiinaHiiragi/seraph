/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
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
    setFormNewNameText,
    setFilesList,
    folderCount
  } = props;
  const context = React.useContext(GlobalContext);

  return (
    <Box
      sx={{
        display: { xs: 'block', sm: 'none' },
        overflowY: "visible",
      }}
    >
      <ListDivider sx={{ mb: 1 }} />
      {sortedFilesList.map((item, index) => (
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
                  <Link
                    target="_blank"
                    href={new URL(`/${type}/${folderName}/${item.name}`, serverBaseURL).href}
                  >
                    {item.name}
                  </Link>
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
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography level="body-xs" component="span">
                    {item.size.sizeFormat()}
                  </Typography>
                  <Typography level="body-xs">&bull;</Typography>
                  <Typography level="body-xs">
                    {item.type || context.languagePicker("main.folder.viewRegulate.unknown")}
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
                setFormNewNameText={setFormNewNameText}
                setFilesList={setFilesList}
                folderCount={folderCount}
              />}
          </ListItem>
          <ListDivider />
        </List>
      ))}
    </Box>
  );
}
