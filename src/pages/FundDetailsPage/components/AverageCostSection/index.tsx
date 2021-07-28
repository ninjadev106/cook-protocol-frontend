import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SectionHeader } from "components";
import { transparentize } from "polished";
import React from "react";
import { numberWithCommas } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 24,
  },
  content: {
    marginTop: 8,
    border: `1px solid ${theme.colors.gray20}`,
    padding: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 1.5,
    color: theme.colors.neutral900,
  },
  usd: {
    color: theme.colors.secondary,
  },
  row: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: "21px",
    display: "flex",
    justifyContent: "space-between",
    "& span": {
      "&:last-child": {
        color: theme.colors.primary,
      },
    },
  },
}));

interface IProps {
  className?: string;
}

export const AverageCostSection = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <Typography align="center" className={classes.title}>
          500 <span className={classes.usd}>USD</span>
        </Typography>
        <div className={classes.row}>
          <span>SHARES</span>
          <span>2</span>
        </div>
        <div className={classes.row}>
          <span>Porfolio diversity</span>
          <span>20%</span>
        </div>
      </div>
    </div>
  );
};
