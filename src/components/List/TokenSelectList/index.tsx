import { TextField, Typography, makeStyles } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import clsx from "clsx";
import { DEFAULT_NETWORK_ID, TOKEN_DECIMALS } from "config/constants";
import { getToken, tokenIds } from "config/network";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import React, { useState } from "react";
import { KnownToken, SortOrder } from "types";
import { formatBigNumber, numberWithCommas } from "utils";
import { getLogger } from "utils/logger";

const logger = getLogger("UniswapModal::Index");

const useStyles = makeStyles((theme) => ({
  root: {},
  search: {
    marginTop: 24,
  },
  content: { marginTop: 24 },
  comment: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
    padding: "4px 12px",
    color: theme.colors.default400,
  },
  sortButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": { opacity: 0.6 },
    "& svg": {
      color: theme.colors.default400,
    },
    "&.down": {
      "& svg": {
        transform: "rotate(180deg)",
      },
    },
  },
  tokenRow: {
    height: 61,
    backgroundColor: theme.colors.default800,
    borderRadius: 2,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    cursor: "pointer",
    transition: "all 0.5s",
    "&:hover": {
      opacity: 0.7,
    },
  },
  tokenSubRow: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "16.8px",
    color: theme.colors.reverse,
    "& > * + *": { marginLeft: 4 },
    "& svg": { width: 24, height: 24 },
  },
  usd: {
    color: theme.colors.secondary,
  },
}));

interface IProps {
  disabledTokens: KnownToken[];
  className?: string;
  onSelect: (_: KnownToken) => void;
  searchable: boolean;
}

interface IState {
  keyword: string;
  order: SortOrder;
}

export const TokenSelectList = (props: IProps) => {
  const classes = useStyles();
  const {
    tokenPrices: { current: currentTokenPrices },
  } = useGlobal();
  const { networkId } = useConnectedWeb3Context();
  const { disabledTokens, onSelect, searchable } = props;
  const [state, setState] = useState<IState>({ keyword: "", order: "asc" });

  const tokensToShow = Object.values(tokenIds).filter(
    (tokenId) => !disabledTokens.includes(tokenId as KnownToken)
  );

  const setKeyword = (keyword: string) =>
    setState((prev) => ({ ...prev, keyword }));

  return (
    <div className={clsx(classes.root, props.className)}>
      {searchable && (
        <TextField
          className={classes.search}
          fullWidth
          label="Search by symbol or name"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder="Search"
          value={state.keyword}
          variant="outlined"
        />
      )}
      <div className={classes.content}>
        <Typography className={classes.comment}>
          <span>Token</span>
          <span
            className={classes.sortButton}
            onClick={() => {
              setState((prev) => ({
                ...prev,
                order: prev.order === "desc" ? "asc" : "desc",
              }));
            }}
          >
            Token price <ArrowDropDownIcon />
          </span>
        </Typography>
        {tokensToShow
          .filter((token) => {
            const tokenInfo = getToken(
              token as KnownToken,
              networkId || DEFAULT_NETWORK_ID
            );
            if (state.keyword === "") return true;
            if (
              tokenInfo.symbol.includes(state.keyword.toLowerCase()) ||
              tokenInfo.name.includes(state.keyword.toLowerCase())
            )
              return true;
            return false;
          })
          .sort((token1, token2) => {
            const price1 = currentTokenPrices[token1 as KnownToken];
            const price2 = currentTokenPrices[token2 as KnownToken];

            if (state.order === "asc") {
              if (price1.lt(price2)) return -1;
              if (price1.gt(price2)) return 1;
            }
            if (state.order === "desc") {
              if (price1.lt(price2)) return 1;
              if (price1.gt(price2)) return -1;
            }

            return 0;
          })
          .map((token) => {
            const tokenInfo = getToken(
              token as KnownToken,
              networkId || DEFAULT_NETWORK_ID
            );
            const price = currentTokenPrices[token as KnownToken];
            const Icon = tokenInfo.icon;

            return (
              <div
                className={classes.tokenRow}
                key={token}
                onClick={() => {
                  onSelect(token as KnownToken);
                }}
              >
                <div className={classes.tokenSubRow}>
                  <Icon />
                  <span>{token.toUpperCase()}</span>
                </div>
                <div className={classes.tokenSubRow}>
                  <span>
                    {numberWithCommas(
                      Number(formatBigNumber(price, TOKEN_DECIMALS, 6))
                    )}
                  </span>
                  <span className={classes.usd}>USD</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
