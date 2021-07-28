import {
  InputLabel,
  InputLabelProps,
  Typography,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.spacing(2.25),
  },
  optional: {
    opacity: 0.7,
  },
}));

interface IProps {
  title: string;
  optional?: boolean;
  className?: string;
}

export const FormInputLabel = (props: IProps & InputLabelProps) => {
  const { className, optional = false, title, ...restProps } = props;
  const classes = useStyles();
  return (
    <InputLabel className={clsx(classes.root, className)} {...restProps}>
      {title}&nbsp;
      {optional && (
        <Typography className={classes.optional} component="span">
          (Optional)
        </Typography>
      )}
    </InputLabel>
  );
};
