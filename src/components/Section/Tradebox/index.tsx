import { Button, ButtonGroup, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 520,
    width: 520,
    padding: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    boxShadow: "0px 4px 6px 1px rgba(13, 21, 45, 0.5)",
  },
  modeItemButton: {
    height: 52,
    color: theme.colors.default,
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: "24px",
    textTransform: "none",
    "&.active": {
      backgroundColor: theme.colors.third,
      color: theme.colors.secondary,
    },
  },
  content: { marginTop: 28 },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: 28,
  },
  rowComment: {
    color: theme.colors.default,
    fontSize: 24,
    lineHeight: "32px",
    flex: 1,
  },
  rowButton: {
    flex: 1,
    height: 52,
    fontSize: 24,
    lineHeight: "32px",
  },
  rowComment1: {
    color: theme.colors.default,
    fontSize: 24,
    lineHeight: "32px",
  },
  bottom: { marginTop: 40, textAlign: "center" },
  confirm: {
    backgroundColor: theme.colors.third,
    color: theme.colors.secondary,
    height: 59,
    fontWeight: 500,
    minWidth: 310,
    fontSize: 24,
    lineHeight: "32px",
    textTransform: "none",
  },
}));

interface IProps {
  className?: string;
}

enum ETradeMode {
  Buy = "Buy",
  Sell = "Sell",
}

interface IState {
  mode: ETradeMode;
}

export const Tradebox = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    mode: ETradeMode.Buy,
  });

  const setMode = (mode: ETradeMode) => setState((prev) => ({ ...prev, mode }));

  return (
    <div className={clsx(classes.root, props.className)}>
      <ButtonGroup fullWidth>
        <Button
          className={clsx(
            classes.modeItemButton,
            state.mode === ETradeMode.Buy ? "active" : ""
          )}
          onClick={() => setMode(ETradeMode.Buy)}
        >
          Buy
        </Button>
        <Button
          className={clsx(
            classes.modeItemButton,
            state.mode === ETradeMode.Sell ? "active" : ""
          )}
          onClick={() => setMode(ETradeMode.Sell)}
        >
          Sell
        </Button>
      </ButtonGroup>
      <div className={classes.content}>
        <div className={classes.row}>
          <Typography className={classes.rowComment}>Token:</Typography>
          <Button className={classes.rowButton} variant="outlined">
            ETH
          </Button>
        </div>
        <div className={classes.row}>
          <Typography className={classes.rowComment}>Quantity:</Typography>
          <Button className={classes.rowButton} variant="outlined">
            30
          </Button>
        </div>
        <div className={classes.row}>
          <Typography className={classes.rowComment1}>
            Estimated Shares:
          </Typography>
          <Typography align="center" className={classes.rowComment}>
            21.8
          </Typography>
        </div>
      </div>
      <div className={classes.bottom}>
        <Button className={classes.confirm} variant="contained">
          Confirm
        </Button>
      </div>
    </div>
  );
};
