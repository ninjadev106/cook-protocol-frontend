import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const MiningPage = () => {
  const classes = useStyles();
  return <div className={classes.root}>MiningPage</div>;
};

export default MiningPage;
