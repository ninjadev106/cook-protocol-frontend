import {
  FormControl,
  FormHelperText,
  FormHelperTextProps,
  InputProps,
  makeStyles,
} from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import clsx from "clsx";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: "flex",
    flexDirection: "row",
  },
  formControlContent: {
    width: "40%",
    backgroundColor: theme.colors.secondary,
    padding: "14px 30px",
    "&.fullWidth": {
      flex: 1,
    },
  },
  formControlHelperText: {
    fontSize: 18,
  },
}));

interface IProps {
  FormHelperTextProps: FormHelperTextProps;
  AutocompleteProps: AutocompleteProps<InputProps, true, false, false>;
  label: string;
  helperText: string;
}

export const FormAutocompleteMultipleRow = (props: IProps) => {
  const classes = useStyles();
  const { AutocompleteProps, FormHelperTextProps, helperText, label } = props;

  return (
    <FormControl className={classes.formControl} fullWidth>
      <Autocomplete {...AutocompleteProps} />
      {helperText && (
        <FormHelperText
          className={classes.formControlHelperText}
          {...FormHelperTextProps}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
