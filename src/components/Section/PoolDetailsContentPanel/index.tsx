import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    boxShadow: "0px 4px 6px 1px rgba(13, 21, 45, 0.5)",
    padding: "40px 48px",
  },
  title: {
    color: transparentize(0.28, theme.colors.default),
    fontSize: 26,
    lineHeight: "34px",
  },
  value: {
    fontSize: 44,
    lineHeight: "58px",
    color: theme.colors.default,
    fontWeight: "bold",
    marginTop: 12,
  },
  divider: {
    marginTop: 31,
    marginBottom: 12,
    height: 1,
    backgroundColor: transparentize(0.6, theme.colors.default),
  },
  detailsWrapper: {},
  detailsRow: {
    paddingTop: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsComment: {
    fontSize: 18,
    lineHeight: "23px",
    color: transparentize(0.5, theme.colors.default),
  },
  detailsValue: {
    fontSize: 18,
    lineHeight: "23px",
    color: theme.colors.default,
  },
}));

interface IProps {
  className?: string;
  data: {
    title: string;
    value: string;
    details: { comment: string; value: string }[];
  };
}

export const PoolDetailsContentPanel = (props: IProps) => {
  const classes = useStyles();
  const {
    data: { details, title, value },
  } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <Typography align="center" className={classes.title}>
        {title}
      </Typography>
      <Typography align="center" className={classes.value}>
        {value}
      </Typography>
      <div className={classes.divider} />
      <div className={classes.detailsWrapper}>
        {details.map((detail) => (
          <div className={classes.detailsRow} key={detail.comment}>
            <Typography className={classes.detailsComment}>
              {detail.comment}
            </Typography>
            <Typography className={classes.detailsValue}>
              {detail.value}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};
