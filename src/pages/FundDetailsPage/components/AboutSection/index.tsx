import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SectionHeader } from "components";
import { transparentize } from "polished";
import React from "react";
import { numberWithCommas } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: "19px",
    color: theme.colors.secondary,
  },
  top: {
    marginTop: 24,
    marginBottom: 24,
    "& > * + *": {
      marginTop: 16,
    },
  },
  item: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: 1.5,
    color: theme.colors.secondary,
    "& span": {
      "&:first-child": { width: "60%" },
      "&:last-child": {
        color: theme.colors.primary,
        "& span": {
          color: theme.colors.third,
        },
      },
    },
  },
}));

interface IProps {
  className?: string;
}

export const AboutSection = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <Typography className={classes.description}>
          Fund managed by Cook Protocol. It is an index of the top 100 tokens to
          seek for high returns consistently.
        </Typography>
        <div className={classes.top}>
          <div className={classes.item}>
            <span>Fees:</span>
            <span>2</span>
          </div>
          <div className={classes.item}>
            <span>Total value:</span>
            <span>
              626, 676 <span>USD</span>
            </span>
          </div>
          <div className={classes.item}>
            <span>Price::</span>
            <span>
              10,000,000 <span>USD</span>
            </span>
          </div>
          <div className={classes.item}>
            <span>Trade volume:</span>
            <span>
              200.76 <span>USD</span>
            </span>
          </div>
          <div className={classes.item}>
            <span>Highest price (52 weeks):</span>
            <span>
              26 <span>USD</span>
            </span>
          </div>
          <div className={classes.item}>
            <span>Lowest price (52 weeks):</span>
            <span>
              5 <span>USD</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
