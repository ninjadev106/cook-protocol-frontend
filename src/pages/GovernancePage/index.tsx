import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const GovernancePage = () => {
  const classes = useStyles();
  return <div className={classes.root}>GovernancePage</div>;
};

export default GovernancePage;
