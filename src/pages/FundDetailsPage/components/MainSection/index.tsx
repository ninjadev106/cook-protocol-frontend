import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PoolChart } from "components";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {},
  header: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },
  headerItem: {
    cursor: "pointer",
    userSelect: "none",
    fontSize: 14,
    lineHeight: 1.5,
    color: theme.colors.primary,
    marginRight: 40,
    transition: "all 0.5s",
    padding: "3px 0",
    borderBottom: `2px solid ${theme.colors.transparent}`,
    "&:hover": {
      opacity: 0.7,
    },
    "&.active": {
      fontWeight: "bold",
      borderBottom: `2px solid ${theme.colors.primary}`,
    },
  },
}));

enum ETab {
  Price = "Price",
  TotalFund = "Total fund",
}
interface IProps {
  className?: string;
}
interface IState {
  tab: ETab;
}

export const MainSection = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ tab: ETab.Price });

  const setTab = (tab: ETab) => setState((prev) => ({ ...prev, tab }));

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        {Object.values(ETab).map((tab) => (
          <span
            className={clsx(
              classes.headerItem,
              state.tab === tab ? "active" : ""
            )}
            key={tab}
            onClick={() => setTab(tab)}
          >
            Price
          </span>
        ))}
      </div>
      <div className={classes.content}>
        <PoolChart />
      </div>
    </div>
  );
};
