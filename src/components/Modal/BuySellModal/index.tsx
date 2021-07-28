import { Button, Typography, makeStyles } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { ReactComponent as DownIcon } from "assets/svgs/down.svg";
import clsx from "clsx";
import { TokenInput } from "components/Input";
import { TokenSelectList } from "components/List";
import { DEFAULT_NETWORK_ID, TOKEN_DECIMALS } from "config/constants";
import { getContractAddress, getToken, tokenIds } from "config/network";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { transparentize } from "polished";
import React, { useEffect, useState } from "react";
import { CkService } from "services/ck";
import { ERC20Service } from "services/erc20";
import { MDexFactoryService } from "services/mdexFactory";
import { MDexRouterService } from "services/mdexRouter";
import { KnownToken } from "types";
import { formatBigNumber } from "utils";
import { getLogger } from "utils/logger";
import { ETH_NUMBER, ZERO_NUMBER } from "utils/number";

import { BaseModal } from "../BaseModal";

const logger = getLogger("BuySellModal::Index");

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    marginBottom: 12,
    color: theme.colors.secondary,
    fontSize: 14,
  },
  price: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 1.5,
    color: theme.colors.secondary,
  },
  swap: {
    height: 40,
    margin: "24px 0",
    backgroundColor: theme.colors.primary,
    color: theme.colors.default,
    "&:hover": {
      backgroundColor: theme.colors.default,
      color: theme.colors.primary,
    },
  },
  swapDisabled: {
    backgroundColor: `${theme.colors.default} !important`,
  },
  infoRow: {
    marginTop: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
    lineHeight: 1.5,
    color: theme.colors.secondary,
    "& div": {
      display: "flex",
      alignItems: "center",
      "& svg": {
        color: transparentize(0.4, theme.colors.secondary),
        width: 20,
        height: 20,
      },
    },
    "& span": {
      color: theme.colors.primary,
      fontWeight: 500,
    },
  },
  tokenSelector: {
    maxHeight: "50vh",
    overflowY: "auto",
  },
  maxButton: {
    margin: "auto",
    marginBottom: 20,
    backgroundColor: theme.colors.gray30,
    padding: 8,
    borderRadius: 13,
    height: 26,
    width: 42,
    color: theme.colors.gray40,
    border: `1px solid ${theme.colors.gray40}`,
    fontSize: 12,
    lineHeight: "10px",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      transition: "all 0.4s",
      opacity: 0.7,
    },
  },
  estimateValueWrapper: {
    display: "flex",
    alignItems: "center",
    "&.select": {
      cursor: "pointer",
      userSelect: "none",
      transition: "all 0.4s",
      "&:hover": {
        opacity: 0.7,
      },
    },
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  isSell: boolean;
  whitelistTokenIds: KnownToken[];
  ckAddress: string;
  ckSymbol: string;
}

interface IState {
  token: KnownToken;
  amount: BigNumber;
  balance: BigNumber;
  showTokenSelect: boolean;
  ckBalance: BigNumber;
  estimate: BigNumber;
}

export const BuySellModal = (props: IProps) => {
  const classes = useStyles();
  const {
    tokenPrices: { current: currentTokenPrices },
  } = useGlobal();
  const { ckAddress, ckSymbol, isSell, whitelistTokenIds } = props;
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const { setTransactionModalVisible } = useGlobal();
  const [state, setState] = useState<IState>({
    token: whitelistTokenIds[0],
    amount: ZERO_NUMBER,
    balance: ZERO_NUMBER,
    showTokenSelect: false,
    ckBalance: ZERO_NUMBER,
    estimate: ZERO_NUMBER,
  });

  const price = currentTokenPrices[state.token].mul(state.amount);

  const tokenInfo = getToken(state.token, networkId);
  const TokenIcon = tokenInfo.icon;

  const onBack = () => {
    setState((prev) => ({ ...prev, showTokenSelect: false }));
  };

  useEffect(() => {
    let isMounted = true;
    const loadCkBalance = async () => {
      try {
        if (isSell) {
          const ckServie = new CkService(provider, account, ckAddress);
          const ckBalance = await ckServie.getBalanceOf(account || "");
          if (isMounted)
            setState((prev) => ({
              ...prev,
              ckBalance,
            }));
        }
      } catch (error) {
        if (isMounted)
          setState((prev) => ({
            ...prev,
            ckBalance: ZERO_NUMBER,
          }));
      }
    };

    loadCkBalance();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, ckAddress]);

  useEffect(() => {
    let isMounted = true;
    const loadTokenBalance = async () => {
      try {
        if (!isSell) {
          const tokenAddress = getToken(state.token as KnownToken, networkId)
            .address;
          const erc20Service = new ERC20Service(
            provider,
            account,
            tokenAddress
          );
          const balance = await erc20Service.getBalanceOf(account || "");
          if (isMounted)
            setState((prev) => ({
              ...prev,
              balance,
            }));
        }
      } catch (error) {
        if (isMounted)
          setState((prev) => ({
            ...prev,
            balance: ZERO_NUMBER,
          }));
      }
    };

    loadTokenBalance();
    return () => {
      isMounted = false;
    };
  }, [account, state.token]);

  useEffect(() => {
    let isMounted = true;
    const getEstimate = async () => {
      if (state.amount.eq(ZERO_NUMBER)) {
        setState((prev) => ({ ...prev, estimate: ZERO_NUMBER }));
        return;
      }

      try {
        const tokenAddress = getToken(state.token as KnownToken, networkId)
          .address;
        const mDexFactoryAddress = getContractAddress(
          networkId || DEFAULT_NETWORK_ID,
          "mdexFactory"
        );
        const mDexFactoryService = new MDexFactoryService(
          provider,
          account,
          mDexFactoryAddress
        );
        const [
          reserve0, // ck
          reserve1, // token
          blockTimestamp,
        ] = await mDexFactoryService.getReserves(ckAddress, tokenAddress);

        if (isSell) {
          const estimate = await mDexFactoryService.getAmountOut(
            state.amount,
            reserve0,
            reserve1
          );
          if (isMounted) setState((prev) => ({ ...prev, estimate }));
        } else {
          const estimate = await mDexFactoryService.getAmountOut(
            state.amount,
            reserve1,
            reserve0
          );
          if (isMounted) setState((prev) => ({ ...prev, estimate }));
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setState((prev) => ({ ...prev, estimate: ZERO_NUMBER }));
      }
    };
    getEstimate();
    return () => {
      isMounted = false;
    };
  }, [state.amount, state.token]);

  const onConfirm = async () => {
    if (!provider) return;

    const slippage = parseEther("0.05");
    const { amount, estimate } = state;
    const amountOutMin = estimate.sub(estimate.mul(slippage).div(ETH_NUMBER));
    const tokenAddress = getToken(state.token as KnownToken, networkId).address;
    const mDexRouterAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "mdexRouter"
    );
    const mDexRouterService = new MDexRouterService(
      provider,
      account,
      mDexRouterAddress
    );
    const deadline = Date.now() + 1000 * 60 * 10;

    try {
      if (isSell) {
        const erc20Servie = new ERC20Service(provider, account, ckAddress);
        const hasEnoughAllowance = await erc20Servie.hasEnoughAllowance(
          account || "",
          mDexRouterAddress,
          state.amount
        );
        setTransactionModalVisible(true, "", "Loading...");
        if (!hasEnoughAllowance) {
          const txHash = await erc20Servie.approveUnlimited(mDexRouterAddress);
          setTransactionModalVisible(true, txHash, "Approving...");
          await provider.waitForTransaction(txHash);
        }
        setTransactionModalVisible(true, "", "Selling...");
        const txHash = await mDexRouterService.swapExactTokensForTokens(
          amount,
          amountOutMin,
          [ckAddress, tokenAddress],
          account || "",
          BigNumber.from(deadline)
        );
        setTransactionModalVisible(true, txHash, "Selling...");
        await provider.waitForTransaction(txHash);
        setTransactionModalVisible(false);
        props.onClose();
      } else {
        const erc20Servie = new ERC20Service(provider, account, tokenAddress);
        const hasEnoughAllowance = await erc20Servie.hasEnoughAllowance(
          account || "",
          mDexRouterAddress,
          state.amount
        );
        setTransactionModalVisible(true, "", "Loading...");
        if (!hasEnoughAllowance) {
          const txHash = await erc20Servie.approveUnlimited(mDexRouterAddress);
          setTransactionModalVisible(true, txHash, "Approving...");
          await provider.waitForTransaction(txHash);
        }
        setTransactionModalVisible(true, "", "Buying...");

        const txHash = await mDexRouterService.swapExactTokensForTokens(
          amount,
          amountOutMin,
          [tokenAddress, ckAddress],
          account || "",
          BigNumber.from(deadline)
        );
        setTransactionModalVisible(true, txHash, "Buying...");

        await provider.waitForTransaction(txHash);
        setTransactionModalVisible(false);
        props.onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BaseModal
      backVisible={state.showTokenSelect}
      onBack={onBack}
      onClose={props.onClose}
      title={isSell ? "Sell" : "Buy"}
      visible={props.visible}
    >
      <div>
        {state.showTokenSelect ? (
          <div className={classes.tokenSelector}>
            <TokenSelectList
              disabledTokens={
                Object.values(tokenIds).filter(
                  (id) =>
                    whitelistTokenIds.includes(id as KnownToken) ||
                    id !== state.token
                ) as KnownToken[]
              }
              onSelect={(token: KnownToken) => {
                setState((prev) => ({
                  ...prev,
                  token,
                  showTokenSelect: false,
                }));
              }}
              searchable
            />
          </div>
        ) : (
          <>
            <Typography align="center" className={classes.label}>
              Balance:{" "}
              {formatBigNumber(
                isSell ? state.ckBalance : state.balance,
                TOKEN_DECIMALS
              )}
              &nbsp;
              {isSell ? ckSymbol.toUpperCase() : state.token.toUpperCase()}
            </Typography>

            <TokenInput
              amount={state.amount}
              maxVisible
              onChangeToken={() => {
                setState((prev) => ({
                  ...prev,
                  showTokenSelect: true,
                }));
              }}
              onChangeValue={(newAmount) => {
                setState((prev) => ({ ...prev, amount: newAmount }));
              }}
              onMax={() => {
                setState((prev) => ({
                  ...prev,
                  amount: isSell ? prev.ckBalance : prev.balance,
                }));
              }}
              token={isSell ? undefined : state.token}
            />
            <Typography align="center" className={classes.price}>
              {formatBigNumber(
                price,
                TOKEN_DECIMALS +
                  getToken(state.token, networkId || DEFAULT_NETWORK_ID)
                    .decimals
              )}
              &nbsp; USD
            </Typography>
            <Typography className={classes.infoRow}>
              <div>
                Estimated output&nbsp;
                <HelpOutlineIcon />
              </div>
              <span className={classes.estimateValueWrapper}>
                {formatBigNumber(state.estimate, TOKEN_DECIMALS)}&nbsp;
                {!isSell ? ckSymbol : null}
                {isSell ? (
                  <span
                    className={clsx(classes.estimateValueWrapper, "select")}
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        showTokenSelect: true,
                      }));
                    }}
                  >
                    {tokenInfo.symbol.toUpperCase()}&nbsp;
                    <TokenIcon />
                    <DownIcon />
                  </span>
                ) : null}
              </span>
            </Typography>
            <Button
              className={classes.swap}
              classes={{ disabled: classes.swapDisabled }}
              color="primary"
              disabled={
                state.amount.eq(ZERO_NUMBER) ||
                (isSell && state.amount.gt(state.ckBalance)) ||
                (!isSell && state.amount.gt(state.balance))
              }
              fullWidth
              onClick={onConfirm}
              variant="outlined"
            >
              {isSell ? "Sell" : "Buy"}
            </Button>
          </>
        )}
      </div>
    </BaseModal>
  );
};
