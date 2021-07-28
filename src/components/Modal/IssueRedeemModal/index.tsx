import { Button, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { TokenInput } from "components/Input";
import { DEFAULT_NETWORK_ID, TOKEN_DECIMALS } from "config/constants";
import {
  getContractAddress,
  getToken,
  getTokenFromAddress,
} from "config/network";
import { useConnectedWeb3Context } from "contexts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { transparentize } from "polished";
import React, { useEffect, useMemo, useState } from "react";
import { CkService } from "services/ck";
import { ERC20Service } from "services/erc20";
import { IssuanceService } from "services/issuance";
import useCommonStyles from "styles/common";
import { IPool, KnownToken } from "types";
import { formatBigNumber } from "utils";
import { getLogger } from "utils/logger";
import { ZERO_NUMBER } from "utils/number";

import { BaseModal } from "../BaseModal";

const logger = getLogger("IssueRedeemModal::Index");

const useStyles = makeStyles((theme) => ({
  root: {},
  comment: { color: theme.colors.default200, fontSize: 14 },
  labelWrapper: {
    marginBottom: 12,
    marginTop: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& span": {
      color: theme.colors.reverse,
      fontSize: 14,
    },
  },
  label: {
    color: theme.colors.default200,
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    lineHeight: 1.5,
    color: theme.colors.secondary,
  },
  swap: {
    height: 40,
    margin: "24px 0",
    backgroundColor: theme.colors.primary,
    "&:hover": {
      backgroundColor: theme.colors.default,
      color: theme.colors.primary,
    },
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
  swapDisabled: {
    backgroundColor: theme.colors.default,
  },
  tokens: {
    marginTop: 16,
    overflowY: "auto",
    maxHeight: 250,
  },
  tokenRow: {
    padding: 16,
    backgroundColor: theme.colors.default800,
    display: "flex",
    alignItems: "center",
    marginTop: 12,
  },
  tokenRowItem: {
    flex: 1,
    color: theme.colors.reverse,
    display: "flex",
    alignItems: "center",
    "& svg": { width: 24, height: 24 },
    "&.center": {
      justifyContent: "center",
    },
    "&.right": {
      justifyContent: "flex-end",
    },
  },
  tokenCommentRow: {
    display: "flex",
    alignItems: "center",
    padding: "4px 16px",
  },
  tokenCommentItem: {
    flex: 1,
    color: theme.colors.default400,
    fontSize: 13,
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  isIssue: boolean;
  onConfirm: (amount: BigNumber) => void;
  ckInfo: IPool;
}

interface IState {
  amount: BigNumber;
  balance: BigNumber;
  ckBalance: BigNumber;
  tokenBalance: { [key: string]: BigNumber };
  requiredComponentBalance: { [key: string]: BigNumber };
}

export const IssueRedeemModal = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const { ckInfo, isIssue, onConfirm } = props;
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({
    amount: ZERO_NUMBER,
    balance: parseEther("50"),
    ckBalance: ZERO_NUMBER,
    tokenBalance: {},
    requiredComponentBalance: {},
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const tokenBalance: { [key: string]: BigNumber } = {};
        const balanceArray = await Promise.all(
          Object.keys(ckInfo.tokens).map((tokenId) => {
            const tokenAddress = getToken(tokenId as KnownToken, networkId)
              .address;
            const erc20Service = new ERC20Service(
              provider,
              account,
              tokenAddress
            );
            return erc20Service.getBalanceOf(account || "");
          })
        );
        Object.keys(ckInfo.tokens).forEach((tokenId, tIndex) => {
          tokenBalance[tokenId] = balanceArray[tIndex];
        });

        const ckServie = new CkService(provider, account, ckInfo.address);
        const ckBalance = await ckServie.getBalanceOf(account || "");
        if (isMounted) {
          setState((prev) => ({ ...prev, ckBalance, tokenBalance }));
        }
      } catch (error) {
        console.warn(error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ckInfo.address]);

  useEffect(() => {
    let isMounted = true;
    const loadComponentsUnits = async () => {
      if (state.amount.eq(ZERO_NUMBER)) {
        return;
      }
      const issuanceAddress = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "basicIssuance"
      );
      const issuanceService = new IssuanceService(
        provider,
        account,
        issuanceAddress
      );
      try {
        const [
          addresses,
          amounts,
        ] = await issuanceService.getRequiredComponentUnitsForIssue(
          ckInfo.address,
          state.amount
        );
        const requiredComponentBalance: { [key: string]: BigNumber } = {};
        for (let index = 0; index < addresses.length; index++) {
          const address = addresses[index];
          const amount = amounts[index];
          const token = getTokenFromAddress(
            networkId || DEFAULT_NETWORK_ID,
            address
          );
          requiredComponentBalance[token.symbol] = amount;
        }
        if (isMounted) {
          setState((prev) => ({ ...prev, requiredComponentBalance }));
        }
      } catch (error) {
        logger.error(error);
        if (isMounted) {
          setState((prev) => ({ ...prev, requiredComponentBalance: {} }));
        }
      }
    };

    loadComponentsUnits();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.amount, ckInfo.address]);

  const isIssuAmountValid: boolean = useMemo(() => {
    if (isIssue) {
      const { requiredComponentBalance, tokenBalance } = state;
      if (
        Object.keys(tokenBalance).length === 0 ||
        Object.keys(requiredComponentBalance).length === 0
      )
        return false;
      const tokenIds = Object.keys(requiredComponentBalance);
      for (let index = 0; index < tokenIds.length; index++) {
        const tokenId = tokenIds[index];
        if (!tokenBalance[tokenId]) return false;
        if (tokenBalance[tokenId].lt(requiredComponentBalance[tokenId]))
          return false;
      }
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tokenBalance, state.requiredComponentBalance, state.amount]);

  return (
    <BaseModal
      backVisible={false}
      onBack={() => {}}
      onClose={props.onClose}
      title={isIssue ? "Issue" : "Redeem"}
      visible={props.visible}
    >
      <div>
        <Typography className={classes.comment}>
          Please enter the amount you want to {isIssue ? "issue" : "redeem"}.
        </Typography>
        {isIssue ? (
          <div className={classes.labelWrapper}>
            <span>{isIssue ? "Issue" : "Redeem"} value</span>
          </div>
        ) : (
          <div className={classes.labelWrapper}>
            <span>{isIssue ? "Issue" : "Redeem"} value</span>
            <Typography className={classes.label}>
              Balance: {formatBigNumber(state.ckBalance, TOKEN_DECIMALS)}&nbsp;{" "}
              {ckInfo.symbol}
            </Typography>
          </div>
        )}
        <TokenInput
          amount={state.amount}
          maxVisible={!isIssue}
          onChangeToken={() => {}}
          onChangeValue={(newAmount) => {
            setState((prev) => ({ ...prev, amount: newAmount }));
          }}
          onMax={() => {
            if (isIssue) {
              setState((prev) => ({ ...prev, amount: prev.balance }));
            } else {
              setState((prev) => ({ ...prev, amount: prev.ckBalance }));
            }
          }}
        />
        <div className={classes.tokens}>
          <div className={classes.tokenCommentRow}>
            <Typography
              className={clsx(classes.tokenCommentItem, commonClasses.textLeft)}
            >
              Token
            </Typography>
            <Typography
              className={clsx(
                classes.tokenCommentItem,
                commonClasses.textCenter
              )}
            >
              Amount
            </Typography>
            <Typography
              className={clsx(
                classes.tokenCommentItem,
                commonClasses.textRight
              )}
            >
              Balance
            </Typography>
          </div>
          {Object.keys(ckInfo.tokens).map((tokenId) => {
            const token = getToken(tokenId as KnownToken, networkId);
            const Icon = token.icon;

            return (
              <div className={classes.tokenRow} key={tokenId}>
                <div className={clsx(classes.tokenRowItem)}>
                  <Icon />
                  &nbsp;&nbsp;&nbsp;
                  {token.symbol.toUpperCase()}
                </div>
                <div className={clsx(classes.tokenRowItem, "center")}>
                  {state.requiredComponentBalance[tokenId]
                    ? formatBigNumber(
                        state.requiredComponentBalance[tokenId],
                        token.decimals
                      )
                    : ""}
                </div>
                <div className={clsx(classes.tokenRowItem, "right")}>
                  {state.tokenBalance[tokenId]
                    ? formatBigNumber(
                        state.tokenBalance[tokenId],
                        token.decimals
                      )
                    : ""}
                </div>
              </div>
            );
          })}
        </div>
        <Button
          className={classes.swap}
          classes={{ disabled: classes.swapDisabled }}
          color="primary"
          disabled={
            isIssue ? !isIssuAmountValid : state.amount.gt(state.ckBalance)
          }
          fullWidth
          onClick={() => onConfirm(state.amount)}
          variant="outlined"
        >
          {isIssue ? "Issue" : "Redeem"}
        </Button>
      </div>
    </BaseModal>
  );
};
