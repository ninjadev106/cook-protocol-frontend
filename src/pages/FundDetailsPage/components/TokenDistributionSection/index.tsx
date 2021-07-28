import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SortableAssetDistributionTable } from "components";
import { TOKEN_DECIMALS } from "config/constants";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { IPool, ITokenDistributionTableItem, KnownToken } from "types";
import { AssetType } from "types/enums";
import { formatBigNumber } from "utils";
import { ZERO_NUMBER } from "utils/number";
import { calculateValuation } from "utils/token";

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 20 },
  header: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
  },
  headerItem: {
    cursor: "pointer",
    userSelect: "none",
    fontSize: 14,
    lineHeight: 1.5,
    color: theme.colors.primary,
    marginRight: 40,
    transition: "all 0.5s",
    padding: "3px 0",
    borderBottom: `2px solid ${theme.colors.transparent}`,
    "&:hover": {
      opacity: 0.7,
    },
    "&.active": {
      fontWeight: "bold",
      borderBottom: `2px solid ${theme.colors.primary}`,
    },
  },
  content: {},
}));

enum ETab {
  All = "All",
  Yields = "Yields",
  Tokens = "Tokens",
}
interface IProps {
  className?: string;
  pool: IPool;
}
interface IState {
  tab: ETab;
}

export const TokenDistributionSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { tokenPrices } = useGlobal();
  const { networkId } = useConnectedWeb3Context();
  const [state, setState] = useState<IState>({ tab: ETab.All });
  const { pool } = props;
  const setTab = (tab: ETab) => setState((prev) => ({ ...prev, tab }));

  const fakeData: any[] = [];

  Object.keys(pool.tokens).forEach((tokenId) => {
    fakeData.push({
      tokenId: tokenId as KnownToken,
      quantity: pool.tokens[tokenId as KnownToken],
      portfolioAllocation: 8,
    });
  });

  const mockDistributionItems: ITokenDistributionTableItem[] = fakeData.map(
    (item) => {
      const prices = tokenPrices.current;
      const curValuation = calculateValuation(prices, {
        [item.tokenId]: pool.tokens[item.tokenId],
      });

      prices[item.tokenId as KnownToken] =
        tokenPrices.prev[item.tokenId as KnownToken];
      const prevValuation = calculateValuation(prices, {
        [item.tokenId]: pool.tokens[item.tokenId],
      });

      const difference = curValuation
        .sub(prevValuation)
        .mul(BigNumber.from("1000"));

      const return24hBigNumber = prevValuation.isZero()
        ? ZERO_NUMBER
        : difference.div(prevValuation);

      const returns24hStr = (
        Number(formatBigNumber(return24hBigNumber, 0, 9)) / 1000
      ).toString();

      const value = item.quantity.mul(
        tokenPrices.current[item.tokenId as KnownToken]
      );

      const valueStr = (
        Number(formatBigNumber(value, TOKEN_DECIMALS + TOKEN_DECIMALS, 3)) /
        1000
      ).toString();

      const quantityStr = (
        Number(formatBigNumber(item.quantity, TOKEN_DECIMALS, 3)) / 1000
      ).toString();

      return {
        ...item,
        returns24h: return24hBigNumber,
        value,
        portfolioAllocation: 20,
        tokenId: item.tokenId as KnownToken,
        returns24hStr,
        valueStr,
        quantityStr,
      };
    }
  );

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.header}>
        {Object.values(ETab).map((tab) => (
          <span
            className={clsx(
              classes.headerItem,
              state.tab === tab ? "active" : ""
            )}
            key={tab}
            onClick={() => setTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className={classes.content}>
        <SortableAssetDistributionTable
          networkId={networkId}
          rows={mockDistributionItems}
        />
      </div>
    </div>
  );
};
