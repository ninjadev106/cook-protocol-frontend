import { Button, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as PlusIcon } from "assets/svgs/plus.svg";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    lineHeight: 1.5,
    color: theme.colors.reverse,
    fontWeight: 300,
  },
  button: {
    minWidth: 200,
    height: 40,
  },
}));

export const TopSection = () => {
  const classes = useStyles();
  const history = useHistory();

  const onNewFund = () => {
    history.push("/new-fund");
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>My funds</Typography>
      <Button
        className={classes.button}
        color="primary"
        onClick={onNewFund}
        variant="contained"
      >
        <PlusIcon />
        &nbsp;&nbsp;&nbsp;
        <span>Create new fund</span>
      </Button>
    </div>
  );
};
