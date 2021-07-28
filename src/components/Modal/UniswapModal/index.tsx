import { Button, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as ArrowDownIcon } from "assets/svgs/arrow_down.svg";
import { TokenInput } from "components/Input";
import { TokenSelectList } from "components/List";
import { TOKEN_DECIMALS } from "config/constants";
import { useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import React, { useState } from "react";
import { KnownToken } from "types";
import { formatBigNumber } from "utils";
import { getLogger } from "utils/logger";
import { ETH_NUMBER, ZERO_NUMBER } from "utils/number";

import { BaseModal } from "../BaseModal";

const logger = getLogger("UniswapModal::Index");

const MINIMUM_PRICE = parseEther("23.69");

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "4px 0",
    color: theme.colors.reverse,
    fontSize: 14,
    "& span": {
      "&:last-child": {
        color: theme.colors.default400,
        "& span": {
          color: theme.colors.default200,
        },
      },
    },
  },
  buttonWrapper: {
    textAlign: "center",
    margin: 16,
  },
  arrowButton: {
    cursor: "pointer",
    transition: "all 0.3s",

    "&:hover": {
      opacity: 0.7,
    },
    "& svg": {
      width: 24,
      height: 24,
      "& path": {
        fill: theme.colors.gray40,
      },
    },
  },
  price: {
    fontSize: 16,
    lineHeight: 1.5,
    color: theme.colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  swap: {
    height: 40,
    margin: "24px 0",
    backgroundColor: theme.colors.primary,
    "&:hover": {
      backgroundColor: theme.colors.default,
    },
  },
  infoRow: {
    marginTop: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
    lineHeight: 1.5,
    color: theme.colors.default400,
    "& span": {
      color: theme.colors.reverse,
      "&.price-impact": {
        color: theme.colors.success,
      },
    },
  },
  tokenSelector: {
    maxHeight: "50vh",
    overflowY: "auto",
  },
}));

enum ETokenToSelect {
  fromToken = "fromToken",
  toToken = "toToken",
}
interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IState {
  fromToken: KnownToken;
  fromAmount: BigNumber;
  fromBalance: BigNumber;
  toToken: KnownToken;
  toAmount: BigNumber;
  toBalance: BigNumber;
  estimatedToken: KnownToken;
  showTokenSelect: boolean;
  tokenToSelect: ETokenToSelect;
}

export const UniswapModal = (props: IProps) => {
  const classes = useStyles();
  const {
    tokenPrices: { current: currentTokenPrices },
  } = useGlobal();
  const [state, setState] = useState<IState>({
    fromToken: "eth",
    fromAmount: ZERO_NUMBER,
    fromBalance: parseEther("50"),
    toToken: "usdt",
    toAmount: ZERO_NUMBER,
    toBalance: parseEther("100"),
    estimatedToken: "usdt",
    showTokenSelect: false,
    tokenToSelect: ETokenToSelect.fromToken,
  });

  const price = currentTokenPrices[state.fromToken].eq(ZERO_NUMBER)
    ? ZERO_NUMBER
    : currentTokenPrices[state.toToken]
        .mul(ETH_NUMBER)
        .div(currentTokenPrices[state.fromToken]);

  const onBack = () => {
    setState((prev) => ({ ...prev, showTokenSelect: false }));
  };

  const onFlip = () => {
    setState((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      fromAmount: prev.toAmount,
      fromBalance: prev.toBalance,
      toToken: prev.fromToken,
      toAmount: prev.fromAmount,
      toBalance: prev.fromBalance,
      estimatedToken: prev.fromToken,
    }));
  };

  return (
    <BaseModal
      backVisible={state.showTokenSelect}
      onBack={onBack}
      onClose={props.onClose}
      title="Swap"
      visible={props.visible}
    >
      <div>
        {state.showTokenSelect ? (
          <div className={classes.tokenSelector}>
            <TokenSelectList
              disabledTokens={
                state.tokenToSelect === ETokenToSelect.fromToken
                  ? [state.fromToken]
                  : [state.toToken]
              }
              onSelect={(token: KnownToken) => {
                if (state.tokenToSelect === ETokenToSelect.fromToken) {
                  setState((prev) => ({
                    ...prev,
                    fromToken: token,
                    showTokenSelect: false,
                  }));
                } else {
                  setState((prev) => ({
                    ...prev,
                    toToken: token,
                    showTokenSelect: false,
                  }));
                }
              }}
              searchable
            />
          </div>
        ) : (
          <>
            <div className={classes.label}>
              <span>
                From
                {state.estimatedToken === state.fromToken ? " (Estimated)" : ""}
              </span>
              <span>
                Balance:{" "}
                <span>
                  {formatBigNumber(state.fromBalance, TOKEN_DECIMALS)}
                </span>
              </span>
            </div>
            <TokenInput
              amount={state.fromAmount}
              maxVisible
              onChangeToken={() => {
                setState((prev) => ({
                  ...prev,
                  showTokenSelect: true,
                  tokenToSelect: ETokenToSelect.fromToken,
                }));
              }}
              onChangeValue={(newAmount) => {
                setState((prev) => ({ ...prev, fromAmount: newAmount }));
              }}
              onMax={() => {}}
              token={state.fromToken}
            />
            <div className={classes.buttonWrapper}>
              <span className={classes.arrowButton} onClick={onFlip}>
                <ArrowDownIcon />
              </span>
            </div>
            <div className={classes.label}>
              <span>
                To{state.estimatedToken === state.toToken ? " (Estimated)" : ""}
              </span>
              <span>
                Balance:{" "}
                <span>{formatBigNumber(state.toBalance, TOKEN_DECIMALS)}</span>
              </span>
            </div>
            <TokenInput
              amount={state.toAmount}
              onChangeToken={() => {
                setState((prev) => ({
                  ...prev,
                  showTokenSelect: true,
                  tokenToSelect: ETokenToSelect.toToken,
                }));
              }}
              onChangeValue={(newAmount) => {
                setState((prev) => ({ ...prev, toAmount: newAmount }));
              }}
              onMax={() => {}}
              token={state.toToken}
            />
            <div className={classes.price}>
              <span>Price</span>
              <span>
                {formatBigNumber(price, TOKEN_DECIMALS, 6)}{" "}
                {state.fromToken.toUpperCase()} per{" "}
                {state.toToken.toUpperCase()}
              </span>
            </div>
            <Button
              className={classes.swap}
              color="primary"
              fullWidth
              variant="outlined"
            >
              SWAP
            </Button>
            <Typography className={classes.infoRow}>
              Minimum received{" "}
              <span>
                {formatBigNumber(
                  currentTokenPrices[state.toToken].eq(ZERO_NUMBER)
                    ? ZERO_NUMBER
                    : MINIMUM_PRICE.mul(ETH_NUMBER).div(
                        currentTokenPrices[state.toToken]
                      ),
                  TOKEN_DECIMALS,
                  2
                )}{" "}
                {state.toToken.toUpperCase()}
              </span>
            </Typography>
            <Typography className={classes.infoRow}>
              Price impact <span className="price-impact">0.02%</span>
            </Typography>
            <Typography className={classes.infoRow}>
              Liquidity Provider Fee <span>0.00003 ETH</span>
            </Typography>
          </>
        )}
      </div>
    </BaseModal>
  );
};
