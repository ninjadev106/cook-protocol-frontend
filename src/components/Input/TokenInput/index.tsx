import { InputAdornment, TextField, makeStyles } from "@material-ui/core";
import { ReactComponent as DownIcon } from "assets/svgs/down.svg";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID, TOKEN_DECIMALS } from "config/constants";
import { getToken } from "config/network";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { KnownToken } from "types";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.default800,
    fontSize: 24,
    color: theme.colors.reverse,
  },
  prefix: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: 16,
    },
  },
  max: {
    backgroundColor: theme.colors.gray30,
    padding: 8,
    borderRadius: 53,
    height: 24,
    width: 42,
    color: theme.colors.gray40,
    fontSize: 12,
    lineHeight: "10px",
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
  symbol: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      "&:first-child": {
        width: 24,
        height: 24,
      },
    },
    "& span": {
      textTransform: "uppercase",
      fontSize: 24,
      lineHeight: "36px",
      color: theme.colors.reverse,
    },
    "& > * + *": {
      marginLeft: 8,
    },
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
}));

interface IProps {
  className?: string;
  token?: KnownToken;
  amount: BigNumber;
  maxVisible?: boolean;
  onMax: () => void;
  onChangeToken: () => void;
  onChangeValue: (_: BigNumber) => void;
}

export const TokenInput = (props: IProps) => {
  const {
    amount,
    maxVisible = false,
    onChangeToken,
    onChangeValue,
    onMax,
    token,
  } = props;
  const { networkId } = useConnectedWeb3Context();
  const classes = useStyles();
  const [currentValue, setCurrentValue] = useState("");
  const tokenInfo = getToken(token || "eth", networkId || DEFAULT_NETWORK_ID);

  useEffect(() => {
    if (amount.eq(ZERO_NUMBER)) {
      // setCurrentValue(() => "");
    } else if (
      !ethers.utils.parseUnits(currentValue || "0", TOKEN_DECIMALS).eq(amount)
    ) {
      setCurrentValue(() => ethers.utils.formatUnits(amount, TOKEN_DECIMALS));
    }
    // eslint-disable-next-line
  }, [amount, currentValue]);

  const onChangeAmount = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value: inputValue } = e.target;
    if (!inputValue) {
      onChangeValue(ZERO_NUMBER);
    } else {
      const newValue = ethers.utils.parseUnits(inputValue, TOKEN_DECIMALS);
      onChangeValue(newValue);
    }
    setCurrentValue(() => inputValue);
  };

  const TokenIcon = tokenInfo.icon;

  return (
    <TextField
      InputProps={{
        endAdornment: (maxVisible || token) && (
          <InputAdornment position="end">
            <div className={classes.prefix}>
              {maxVisible && (
                <div className={classes.max} onClick={onMax}>
                  MAX
                </div>
              )}
              {token && (
                <div className={classes.symbol} onClick={onChangeToken}>
                  <TokenIcon />
                  <span>{tokenInfo.symbol}</span>
                  <DownIcon />
                </div>
              )}
            </div>
          </InputAdornment>
        ),
      }}
      className={clsx(classes.root, props.className)}
      fullWidth
      onChange={onChangeAmount}
      placeholder="0.00"
      type="number"
      value={currentValue}
      variant="outlined"
    />
  );
};
