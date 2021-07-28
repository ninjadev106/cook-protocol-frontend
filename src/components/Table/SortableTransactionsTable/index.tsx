import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { ReactComponent as ArrowDownIcon } from "assets/svgs/arrow_down.svg";
import { ReactComponent as ArrowRightIcon } from "assets/svgs/arrow_right.svg";
import { BigNumber } from "ethers";
import { transparentize } from "polished";
import React from "react";
import { ITransactionItem, SortOrder } from "types";
import { ETransactionItemType } from "types/enums";

const Icons = {
  [ETransactionItemType.Buy]: ArrowDownIcon,
  [ETransactionItemType.Sell]: ArrowRightIcon,
};

interface Data extends ITransactionItem {
  amount: number;
  date: string;
  time: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (!["number", "string"].includes(typeof a[orderBy])) {
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: SortOrder,
  orderBy: Key
): (
  a: { [key in Key]: number | string | BigNumber | any },
  b: { [key in Key]: number | string | BigNumber | any }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "type",
    numeric: false,
    label: "Type",
  },
  { id: "amount", numeric: false, label: "Value" },
  { id: "timestamp", numeric: false, label: "Date" },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: SortOrder;
  orderBy: string;
  alignLastRight: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onRequestSort, order, orderBy } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            align={
              props.alignLastRight && index === headCells.length - 1
                ? "right"
                : "left"
            }
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              IconComponent={ArrowDropDownIcon}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      overflowX: "auto",
    },
    table: {
      borderCollapse: "separate",
      borderSpacing: "0 20px",
      "& thead": {
        "& tr": {
          "& th": {
            borderBottom: "none",
            color: transparentize(0.5, theme.colors.primary),
            fontSize: 14,
            lineHeight: "21px",
            padding: "4px",
            flexDirection: "row",
            "&:first-child": {
              padding: "4px 0",
            },
            "&:last-child": {
              padding: "4px 0",
            },
          },
        },
      },
      "& tr": {
        cursor: "pointer",
        transition: "all 0.3s",
        "&:hover": {
          opacity: 0.7,
        },
        "& td": {
          borderBottom: "none",
          backgroundColor: theme.colors.default,
          fontSize: 14,
          lineHeight: "21px",
          padding: "4px",
          "&:first-child": {
            padding: "4px 0",
          },
          "&:last-child": {
            padding: "4px 0",
          },
        },
      },
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    icon: {
      width: 16,
      height: 16,
      color: "unset !important",
      display: "inline-block !important",
      padding: "0 !important",
      "& svg": {
        width: 16,
        height: 16,
      },
      marginRight: 3,
    },
    value: {
      color: theme.colors.primary,
    },
    unit: {
      color: theme.colors.secondary,
    },
    info: {
      display: "flex",
      alignItems: "center",
    },
    paginationWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& > * + *": {
        marginLeft: 4,
      },
    },
    paginationText: {
      fontSize: 12,
      color: theme.colors.secondary,
      lineHeight: "14.5px",
      "& span": {
        color: theme.colors.primary,
      },
    },
    paginationIcon: {
      color: theme.colors.primary,
    },
  })
);

interface IProps {
  rows: Data[];
  alignLastRight?: boolean;
}

export const SortableTransactionsTable = (props: IProps) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<SortOrder>("asc");
  const { alignLastRight = false, rows } = props;
  const [orderBy, setOrderBy] = React.useState<keyof Data>("timestamp");

  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const totalPage = Math.ceil(rows.length / rowsPerPage);

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table
          aria-label="enhanced table"
          aria-labelledby="tableTitle"
          className={classes.table}
        >
          <EnhancedTableHead
            alignLastRight={alignLastRight}
            classes={classes}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
          />
          <TableBody>
            {stableSort<Data>(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const Icon = Icons[row.type];
                return (
                  <TableRow hover key={row.txId} tabIndex={-1}>
                    <TableCell
                      align="left"
                      id={labelId}
                      padding="none"
                      scope="row"
                    >
                      <div className={classes.info}>
                        <Icon />
                        &nbsp;
                        {row.type}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <span className={classes.value}>{row.amount}</span>&nbsp;
                      <span className={classes.unit}>
                        {row.value.token.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell align={alignLastRight ? "right" : "left"}>
                      <span className={classes.value}>{row.date}</span>&nbsp;
                      <span className={classes.unit}>{row.time}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows - 20 }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className={classes.paginationWrapper}>
          <IconButton
            className={classes.paginationIcon}
            disabled={page === 0}
            onClick={() => handleChangePage(page - 1)}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <span className={classes.paginationText}>
            Page <span>{page + 1}</span> of {totalPage}
          </span>
          <IconButton
            className={classes.paginationIcon}
            disabled={page === totalPage - 1}
            onClick={() => handleChangePage(page + 1)}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </TableContainer>
    </div>
  );
};
