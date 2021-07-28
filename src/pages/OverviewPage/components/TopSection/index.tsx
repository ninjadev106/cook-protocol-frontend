import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundSize: "cover",
  },
  content: {},
  title: {
    fontSize: 40,
    lineHeight: 1.5,
    color: theme.colors.reverse,
  },
  description: {
    fontSize: 16,
    color: theme.colors.default400,
    marginTop: 8,
    lineHeight: 1.5,
  },
}));

export const TopSection = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={classes.root}>
      <div className={clsx(classes.content, commonClasses.limitedContent)}>
        <Typography className={classes.title}>Cook Protocol</Typography>
        <Typography className={classes.description}>
          Decentralized Asset Management Platform
        </Typography>
      </div>
    </div>
  );
};
