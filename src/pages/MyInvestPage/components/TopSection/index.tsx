import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundSize: "cover",
  },
  title: {
    fontSize: 40,
    lineHeight: 1.5,
    color: theme.colors.reverse,
    fontWeight: 300,
  },
}));

export const TopSection = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>My invest</Typography>
    </div>
  );
};
