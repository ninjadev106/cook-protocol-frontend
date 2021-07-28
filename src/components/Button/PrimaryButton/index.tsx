import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 40,
    background: theme.colors.gradient1,
    borderRadius: 2,
    "& span": { flex: 1, textAlign: "left" },
    "& svg": {
      height: theme.spacing(3.5),
      width: theme.spacing(3.5),
    },
  },
  label: {
    color: theme.colors.default50,
    textTransform: "none",
    fontSize: 14,
    lineHeight: "21px",
  },
}));

export const PrimaryButton = (
  props: ButtonProps & { children: React.ReactNode | React.ReactNode[] }
) => {
  const classes = useStyles();
  const { children, ...buttonProps } = props;
  return (
    <Button
      {...buttonProps}
      className={clsx(props.className, classes.root)}
      classes={{
        ...props.classes,
        label: clsx(props.classes?.label, classes.label),
      }}
      fullWidth
      variant="contained"
    >
      {children}
    </Button>
  );
};
