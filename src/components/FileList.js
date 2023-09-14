/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import GlobalContext from '../interface/constants';

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
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

export default function FileList(props) {
  const {
    filesList
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
      {filesList.map((item, index) => (
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
                  {item.name}
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
            <RowMenu />
          </ListItem>
          <ListDivider />
        </List>
      ))}
    </Box>
  );
}
