import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/network";
import { BigNumber } from "ethers";
import { transparentize } from "polished";
import React from "react";
import { ITokenDistributionTableItem, SortOrder } from "types";
import { ZERO_NUMBER } from "utils/number";

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
  id: keyof ITokenDistributionTableItem;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "tokenId",
    numeric: false,
    label: "Asset",
  },
  { id: "quantityStr", numeric: false, label: "Quantity" },
  { id: "valueStr", numeric: false, label: "Value" },
  { id: "portfolioAllocation", numeric: true, label: "Portfolio allocation" },
  { id: "returns24h", numeric: true, label: "Return (24h)" },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ITokenDistributionTableItem
  ) => void;
  order: SortOrder;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onRequestSort, order, orderBy } = props;
  const createSortHandler = (property: keyof ITokenDistributionTableItem) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            align={[0, 3].includes(index) ? "left" : "center"}
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
        <TableCell />
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

          "& span": {
            borderRadius: 2,
            display: "inline-flex",
            alignItems: "center",
            padding: "9px 16px",
          },
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
    usd: {
      color: theme.colors.secondary,
    },
    positive: {
      color: theme.colors.success,
    },
    negative: {
      color: theme.colors.warn,
    },
    progressWrapper: { display: "flex", alignItems: "center" },
    progress: {
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
      height: 4,
    },
    row: {
      display: "flex",
      alignItems: "center",
    },
  })
);

interface IProps {
  rows: ITokenDistributionTableItem[];
  networkId?: number;
}

export const SortableAssetDistributionTable = (props: IProps) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<SortOrder>("asc");
  const { networkId = DEFAULT_NETWORK_ID, rows } = props;
  const [orderBy, setOrderBy] = React.useState<
    keyof ITokenDistributionTableItem
  >("tokenId");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITokenDistributionTableItem
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table
          aria-label="enhanced table"
          aria-labelledby="tableTitle"
          className={classes.table}
        >
          <EnhancedTableHead
            classes={classes}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
          />
          <TableBody>
            {stableSort<ITokenDistributionTableItem>(
              rows,
              getComparator(order, orderBy)
            ).map((row, index) => {
              const labelId = `asset-distribution-table-checkbox-${index}`;
              const tokenInfo = getToken(
                row.tokenId,
                networkId || DEFAULT_NETWORK_ID
              );
              const Icon = tokenInfo.icon;

              return (
                <TableRow hover key={row.tokenId} tabIndex={-1}>
                  <TableCell
                    align="left"
                    id={labelId}
                    padding="none"
                    scope="row"
                  >
                    <div className={classes.row}>
                      <Icon />
                      &nbsp;
                      {row.tokenId.toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell align="center">{row.quantityStr}</TableCell>
                  <TableCell align="center">
                    {row.valueStr}
                    <span className={classes.usd}>USD</span>
                  </TableCell>
                  <TableCell align="left" className={classes.progressWrapper}>
                    <div
                      className={classes.progress}
                      style={{ width: `${row.portfolioAllocation}px` }}
                    />
                    &nbsp;&nbsp;
                    {row.portfolioAllocation}%
                  </TableCell>
                  <TableCell
                    align="center"
                    className={
                      row.returns24h.gte(ZERO_NUMBER)
                        ? classes.positive
                        : classes.negative
                    }
                  >
                    {row.returns24h.gte(ZERO_NUMBER) ? "+" : ""}{" "}
                    {row.returns24hStr}
                  </TableCell>
                  <TableCell align="center">
                    <span>
                      <DeleteOutlineIcon />
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
