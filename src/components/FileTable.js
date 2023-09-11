/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

const rows = [
  {
    id: "INV-1234",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "O",
      name: "Olivia Ryhe",
      email: "olivia@email.com",
    },
  },
  // {
  //   id: "INV-1233",
  //   date: "Feb 3, 2023",
  //   status: "Paid",
  //   customer: {
  //     initial: "S",
  //     name: "Steve Hampton",
  //     email: "steve.hamp@email.com",
  //   },
  // },
  // {
  //   id: "INV-1232",
  //   date: "Feb 3, 2023",
  //   status: "Refunded",
  //   customer: {
  //     initial: "C",
  //     name: "Ciaran Murray",
  //     email: "ciaran.murray@email.com",
  //   },
  // },
  // {
  //   id: "INV-1231",
  //   date: "Feb 3, 2023",
  //   status: "Refunded",
  //   customer: {
  //     initial: "M",
  //     name: "Maria Macdonald",
  //     email: "maria.mc@email.com",
  //   },
  // },
  // {
  //   id: "INV-1230",
  //   date: "Feb 3, 2023",
  //   status: "Cancelled",
  //   customer: {
  //     initial: "C",
  //     name: "Charles Fulton",
  //     email: "fulton@email.com",
  //   },
  // },
  // {
  //   id: "INV-1229",
  //   date: "Feb 3, 2023",
  //   status: "Cancelled",
  //   customer: {
  //     initial: "J",
  //     name: "Jay Hooper",
  //     email: "hooper@email.com",
  //   },
  // },
  // {
  //   id: "INV-1228",
  //   date: "Feb 3, 2023",
  //   status: "Refunded",
  //   customer: {
  //     initial: "K",
  //     name: "Krystal Stevens",
  //     email: "k.stevens@email.com",
  //   },
  // },
  // {
  //   id: "INV-1227",
  //   date: "Feb 3, 2023",
  //   status: "Paid",
  //   customer: {
  //     initial: "S",
  //     name: "Sachin Flynn",
  //     email: "s.flyn@email.com",
  //   },
  // },
  // {
  //   id: "INV-1226",
  //   date: "Feb 3, 2023",
  //   status: "Cancelled",
  //   customer: {
  //     initial: "B",
  //     name: "Bradley Rosales",
  //     email: "brad123@email.com",
  //   },
  // },
  // {
  //   id: "INV-1234",
  //   date: "Feb 3, 2023",
  //   status: "Paid",
  //   customer: {
  //     initial: "O",
  //     name: "Olivia Ryhe",
  //     email: "olivia@email.com",
  //   },
  // },
  // {
  //   id: "INV-1233",
  //   date: "Feb 3, 2023",
  //   status: "Cancelled",
  //   customer: {
  //     initial: "S",
  //     name: "Steve Hampton",
  //     email: "steve.hamp@email.com",
  //   },
  // },
  // {
  //   id: "INV-1232",
  //   date: "Feb 3, 2023",
  //   status: "Paid",
  //   customer: {
  //     initial: "C",
  //     name: "Ciaran Murray",
  //     email: "ciaran.murray@email.com",
  //   },
  // },
  // {
  //   id: "INV-1231",
  //   date: "Feb 3, 2023",
  //   status: "Refunded",
  //   customer: {
  //     initial: "M",
  //     name: "Maria Macdonald",
  //     email: "maria.mc@email.com",
  //   },
  // },
  // {
  //   id: "INV-1230",
  //   date: "Feb 3, 2023",
  //   status: "Paid",
  //   customer: {
  //     initial: "C",
  //     name: "Charles Fulton",
  //     email: "fulton@email.com",
  //   },
  // },
  // {
  //   id: "INV-1229",
  //   date: "Feb 3, 2023",
  //   status: "Cancelled",
  //   customer: {
  //     initial: "J",
  //     name: "Jay Hooper",
  //     email: "hooper@email.com",
  //   },
  // },
  // {
  //   id: "INV-1228",
  //   date: "Feb 3, 2023",
  //   status: "Cancelled",
  //   customer: {
  //     initial: "K",
  //     name: "Krystal Stevens",
  //     email: "k.stevens@email.com",
  //   },
  // },
  // {
  //   id: "INV-1227",
  //   date: "Feb 3, 2023",
  //   status: "Paid",
  //   customer: {
  //     initial: "S",
  //     name: "Sachin Flynn",
  //     email: "s.flyn@email.com",
  //   },
  // },
  // {
  //   id: "INV-1226",
  //   date: "Feb 3, 2023",
  //   status: "Cancelled",
  //   customer: {
  //     initial: "B",
  //     name: "Bradley Rosales",
  //     email: "brad123@email.com",
  //   },
  // },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(
  order,
  orderBy,
) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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

export default function FileTable() {
  const [order, setOrder] = React.useState("desc");
  const [selected, setSelected] = React.useState([]);

  return (
    <Sheet
      className="OrderTableContainer"
      variant="outlined"
      sx={{
        display: { xs: "none", sm: "initial" },
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        borderRadius: "sm",
        flexShrink: 1,
        overflow: "auto",
        minHeight: 0,
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
            <th style={{ width: 48, textAlign: "center", padding: "12px 6px" }}>
              <Checkbox
                size="sm"
                indeterminate={
                  selected.length > 0 && selected.length !== rows.length
                }
                checked={selected.length === rows.length}
                onChange={(event) => {
                  setSelected(
                    event.target.checked ? rows.map((row) => row.id) : [],
                  );
                }}
                color={
                  selected.length > 0 || selected.length === rows.length
                    ? "primary"
                    : undefined
                }
                sx={{ verticalAlign: "text-bottom" }}
              />
            </th>
            <th style={{ width: 120, padding: "12px 6px" }}>
              <Link
                underline="none"
                color="primary"
                component="button"
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                fontWeight="lg"
                endDecorator={<ArrowDropDownIcon />}
                sx={{
                  "& svg": {
                    transition: "0.2s",
                    transform:
                      order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                  },
                }}
              >
                Invoice
              </Link>
            </th>
            <th style={{ width: 140, padding: "12px 6px" }}>Date</th>
            <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
            <th style={{ width: 240, padding: "12px 6px" }}>Customer</th>
            <th style={{ width: 140, padding: "12px 6px" }}>Operation</th>
          </tr>
        </thead>
        <tbody>
          {stableSort(rows, getComparator(order, "id")).map((row, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", width: 120 }}>
                <Checkbox
                  size="sm"
                  checked={selected.includes(row.id)}
                  color={selected.includes(row.id) ? "primary" : undefined}
                  onChange={(event) => {
                    setSelected((ids) =>
                      event.target.checked
                        ? ids.concat(row.id)
                        : ids.filter((itemId) => itemId !== row.id),
                    );
                  }}
                  slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </td>
              <td>
                <Typography level="body-xs">{row.id}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.date}</Typography>
              </td>
              <td>
                <Chip
                  variant="soft"
                  size="sm"
                  startDecorator={
                    {
                      Paid: <CheckRoundedIcon />,
                      Refunded: <AutorenewRoundedIcon />,
                      Cancelled: <BlockIcon />,
                    }[row.status]
                  }
                  color={
                    {
                      Paid: "success",
                      Refunded: "neutral",
                      Cancelled: "danger",
                    }[row.status]
                  }
                >
                  {row.status}
                </Chip>
              </td>
              <td>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar size="sm">{row.customer.initial}</Avatar>
                  <div>
                    <Typography level="body-xs">{row.customer.name}</Typography>
                    <Typography level="body-xs">{row.customer.email}</Typography>
                  </div>
                </Box>
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
