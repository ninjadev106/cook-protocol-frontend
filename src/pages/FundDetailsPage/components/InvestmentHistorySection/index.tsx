import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SortableTransactionsTable } from "components";
import { TOKEN_DECIMALS } from "config/constants";
import { parseEther } from "ethers/lib/utils";
import moment from "moment";
import React from "react";
import { ITransactionItem } from "types";
import { ETransactionItemType } from "types/enums";
import { formatBigNumber } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    width: "70%",
    [theme.breakpoints.down(768)]: {
      width: "100%",
    },
  },
}));

const mockTransactions: ITransactionItem[] = [
  {
    txId: "234",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "hhhhh",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "het",
    type: ETransactionItemType.Sell,
    value: {
      token: "ltc",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vxvxv",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vv24",
    type: ETransactionItemType.Sell,
    value: {
      token: "zrx",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vxqw",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "fwfwf",
    type: ETransactionItemType.Sell,
    value: {
      token: "dot",
      amount: parseEther("20"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "q23424",
    type: ETransactionItemType.Buy,
    value: {
      token: "eth",
      amount: parseEther("100"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vvvv",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vxvxvxv",
    type: ETransactionItemType.Sell,
    value: {
      token: "usdt",
      amount: parseEther("20"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "hh4h4h",
    type: ETransactionItemType.Buy,
    value: {
      token: "eth",
      amount: parseEther("100"),
    },
    timestamp: 1614765512,
  },
];

interface IProps {
  className?: string;
}

export const InvestmentHistorySection = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <SortableTransactionsTable
          alignLastRight
          rows={mockTransactions.map((e) => {
            const m = moment(e.timestamp * 1000);
            return {
              ...e,
              amount: Number(formatBigNumber(e.value.amount, TOKEN_DECIMALS)),
              date: m.format("MM/DD/YYYY"),
              time: m.format("hh:mm"),
            };
          })}
        />
      </div>
    </div>
  );
};
