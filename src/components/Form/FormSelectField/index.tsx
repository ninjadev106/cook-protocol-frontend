import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  InputLabelProps,
  MenuItem,
  Select,
  SelectProps,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

import { FormInputLabel } from "../FormInputLabel";

const useStyles = makeStyles(() => ({
  root: {},
}));

interface IProps {
  optional?: boolean;
  className?: string;
  FormControlProps: FormControlProps;
  InputLabelProps: InputLabelProps;
  SelectProps: SelectProps;
  items: { value: string; label: string }[];
  FormHelperTextProps?: FormHelperTextProps;
  label?: string;
  helperText?: string | false | undefined;
}

export const FormSelectField = (props: IProps) => {
  const { className, helperText, items, optional = false } = props;
  const classes = useStyles();
  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      {props.label && (
        <FormInputLabel
          optional={optional}
          title={props.label}
          {...props.InputLabelProps}
        />
      )}
      <Select {...props.SelectProps}>
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText {...props.FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
