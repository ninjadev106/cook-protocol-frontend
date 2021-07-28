import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 8,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: "bold",
  },
}));

interface IProps {
  title: string;

  className?: string;
}

export const SectionHeader = (props: IProps) => {
  const classes = useStyles();
  const { title } = props;
  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography className={classes.title}>{title}</Typography>
    </div>
  );
};
