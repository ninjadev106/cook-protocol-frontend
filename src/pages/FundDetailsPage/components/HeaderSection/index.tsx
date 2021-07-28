import { Button, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as LeftIcon } from "assets/svgs/left.svg";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 8,
    display: "flex",
    alignItems: "center",
    fontSize: 24,
    lineHeight: 1.5,
    color: theme.colors.primary,
    "& > * + *": {
      marginLeft: 8,
    },
  },
  left: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.5s",

    "& p": {
      fontWeight: 300,
    },
    "&:hover": {
      opacity: 0.7,
    },
  },
  center: { flex: 1 },
  right: {
    display: "flex",
    alignItems: "center",
    "& > * + *": { marginLeft: 16 },
  },
  button: {
    height: 40,
    fontSize: 16,
    lineHeight: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    color: theme.colors.reverse,
    minWidth: 90,
    fontWeight: 300,
    "& span": {
      textTransform: "none",
    },
    "&:hover": {
      color: theme.colors.secondary,
    },
  },
}));

interface IProps {
  name: string;
  className?: string;
  onBuy: () => void;
  onSell: () => void;
  onIssue: () => void;
  onRedeem: () => void;
}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();
  const { account } = useConnectedWeb3Context();
  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.left}>
        <LeftIcon />
        <Typography>Fund name:</Typography>
      </div>
      <Typography className={classes.center}>{props.name}</Typography>
      {account && (
        <div className={classes.right}>
          <Button
            className={classes.button}
            color="secondary"
            onClick={props.onBuy}
            variant="outlined"
          >
            Buy
          </Button>
          <Button
            className={classes.button}
            color="secondary"
            onClick={props.onSell}
            variant="outlined"
          >
            Sell
          </Button>
          <Button
            className={classes.button}
            color="secondary"
            onClick={props.onIssue}
            variant="outlined"
          >
            Issue
          </Button>
          <Button
            className={classes.button}
            color="secondary"
            onClick={props.onRedeem}
            variant="outlined"
          >
            Redeem
          </Button>
        </div>
      )}
    </div>
  );
};
