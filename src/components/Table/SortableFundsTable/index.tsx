import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/network";
import { BigNumber } from "ethers";
import { transparentize } from "polished";
import React from "react";
import { IPool, KnownToken, SortOrder } from "types";
import { numberWithCommas } from "utils";

interface Data extends IPool {
  returns24h: number;
  price: number;
  valuation: number;
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
    id: "name",
    numeric: false,
    label: "Fund",
  },
  { id: "symbol", numeric: false, label: "Symbol" },
  { id: "tokens", numeric: false, label: "Assets" },
  { id: "price", numeric: true, label: "Price" },
  { id: "returns24h", numeric: true, label: "Return (24h)" },
  { id: "valuation", numeric: true, label: "Valuation" },
  { id: "assetType", numeric: true, label: "Asset Type" },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: SortOrder;
  orderBy: string;
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
              [0, 2].includes(index) ? "left" : index === 6 ? "right" : "center"
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
          background: "none !important",
          "& th": {
            borderBottom: "none",
            color: theme.colors.default400,
            fontSize: 14,
            lineHeight: "21px",
            fontWeight: 300,
            padding: "12px 16px",
          },
        },
      },
      "& tr": {
        cursor: "pointer",
        transition: "all 0.3s",
        background: theme.colors.gradient2,
        "&:hover": {
          opacity: 0.7,
        },
        "& td": {
          borderBottom: "none",

          fontSize: 14,
          lineHeight: "21px",

          "& span": {
            borderRadius: 2,
            display: "inline-flex",
            alignItems: "center",
            padding: "9px 16px",
          },
          padding: "12px 16px",
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
    assets: {
      display: "flex",
      alignItems: "center",
      "& span": {
        "&.more-assets": {},
      },
    },
  })
);

interface IProps {
  rows: Data[];
  networkId?: number;
  onClick?: (_: string) => void;
}

export const SortableFundsTable = (props: IProps) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<SortOrder>("asc");
  const {
    networkId = DEFAULT_NETWORK_ID,
    onClick = (_: string) => {},
    rows,
  } = props;
  const [orderBy, setOrderBy] = React.useState<keyof Data>("name");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
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
            {stableSort<Data>(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const moreAssets = Object.keys(row.tokens).length - 8;
                return (
                  <TableRow
                    hover
                    key={row.name}
                    onClick={() => onClick(row.address)}
                    tabIndex={-1}
                  >
                    <TableCell
                      align="left"
                      id={labelId}
                      padding="none"
                      scope="row"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.symbol}</TableCell>
                    <TableCell align="left">
                      <div className={classes.assets}>
                        {Object.keys(row.tokens)
                          .slice(0, 8)
                          .map((key) => {
                            const token = getToken(
                              key as KnownToken,
                              networkId || DEFAULT_NETWORK_ID
                            );
                            const { icon: Icon } = token;
                            return (
                              <span className={classes.icon} key={token.name}>
                                <Icon />
                              </span>
                            );
                          })}
                        {moreAssets > 0 && (
                          <span className="more-assets">+{moreAssets}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      {row.price}
                      <span className={classes.usd}>USD</span>
                    </TableCell>
                    <TableCell
                      align="center"
                      className={
                        row.returns24h > 0 ? classes.positive : classes.negative
                      }
                    >
                      {row.returns24h > 0 ? "+ " : " "} {row.returns24h} %
                    </TableCell>
                    <TableCell align="center">
                      {numberWithCommas(row.valuation)}
                      <span className={classes.usd}>USD</span>
                    </TableCell>
                    <TableCell align="right">{row.assetType}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
