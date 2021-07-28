import { makeStyles } from "@material-ui/core";
import { SortableFundsTable, SortableTransactionsTable } from "components";
import { TOKEN_DECIMALS } from "config/constants";
import { useGlobal } from "contexts";
import { BigNumber } from "ethers";
import moment from "moment";
import React from "react";
import { ITransactionItem } from "types";
import { formatBigNumber } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 24,
  },
  content: {},
}));

interface IProps {
  transactions: ITransactionItem[];
}

export const TransactionsSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div>
          <SortableTransactionsTable
            rows={props.transactions.map((e) => {
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
    </div>
  );
};
