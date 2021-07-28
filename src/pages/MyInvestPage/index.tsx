import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { TOKEN_DECIMALS } from "config/constants";
import { useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import React from "react";
import useCommonStyles from "styles/common";
import { IPool, IPoolDetails, ITransactionItem } from "types";
import { AssetType, ETransactionItemType } from "types/enums";
import { formatBigNumber } from "utils";
import { ZERO_NUMBER } from "utils/number";
import { calculateValuation } from "utils/token";

import {
  FeaturedLiquidityPoolsSection,
  TopSection,
  TransactionsSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  subTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "bold",
    marginBottom: 0,
    marginTop: 24,
  },
}));

const mockPools: IPool[] = [
  {
    id: "1",
    address: "123",
    name: "COOK 10",
    symbol: "COOK100",
    assetType: AssetType.SpotComposite,
    ckTokens: BigNumber.from("100000"),
    tokens: {
      eth: BigNumber.from("700"),
      xrp: BigNumber.from("312000"),
      link: BigNumber.from("4333"),
      ltc: BigNumber.from("433"),
      dot: BigNumber.from("4622"),
      uni: BigNumber.from("4622"),
    },
  },
  {
    id: "2",
    address: "123",
    name: "FundName",
    symbol: "F100",
    assetType: AssetType.SpotComposite,
    ckTokens: BigNumber.from("1000000"),
    tokens: {
      comp: BigNumber.from("7000"),
      xrp: BigNumber.from("3100"),
      link: BigNumber.from("43033"),
      ltc: BigNumber.from("433"),
      dot: BigNumber.from("46022"),
    },
  },
  {
    id: "3",
    address: "123",
    name: "Name",
    symbol: "N100",
    assetType: AssetType.SpotComposite,
    ckTokens: BigNumber.from("100000"),
    tokens: {
      eth: BigNumber.from("700"),
      xrp: BigNumber.from("310"),
      link: BigNumber.from("4333"),
      ltc: BigNumber.from("433"),
      dot: BigNumber.from("4022"),
    },
  },
  {
    id: "4",
    address: "123",
    name: "TTT",
    symbol: "T100",
    assetType: AssetType.SpotComposite,
    ckTokens: BigNumber.from("100000"),
    tokens: {
      eth: BigNumber.from("700"),
      xrp: BigNumber.from("310"),
      link: BigNumber.from("4333"),
      ltc: BigNumber.from("433"),
      dot: BigNumber.from("4022"),
      comp: BigNumber.from("310"),
      dai: BigNumber.from("4333"),
      xlm: BigNumber.from("433"),
      rep: BigNumber.from("4022"),
    },
  },
];

const mockTransactions: ITransactionItem[] = [
  {
    txId: "234",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "hhhhh",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "het",
    type: ETransactionItemType.Sell,
    value: {
      token: "ltc",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vxvxv",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vv24",
    type: ETransactionItemType.Sell,
    value: {
      token: "zrx",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vxqw",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "fwfwf",
    type: ETransactionItemType.Sell,
    value: {
      token: "dot",
      amount: parseEther("20"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "q23424",
    type: ETransactionItemType.Buy,
    value: {
      token: "eth",
      amount: parseEther("100"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vvvv",
    type: ETransactionItemType.Buy,
    value: {
      token: "bal",
      amount: parseEther("10"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "vxvxvxv",
    type: ETransactionItemType.Sell,
    value: {
      token: "usdt",
      amount: parseEther("20"),
    },
    timestamp: 1614765512,
  },
  {
    txId: "hh4h4h",
    type: ETransactionItemType.Buy,
    value: {
      token: "eth",
      amount: parseEther("100"),
    },
    timestamp: 1614765512,
  },
];

const MyInvestPage = () => {
  const classes = useStyles();
  const { tokenPrices } = useGlobal();
  const commonClasses = useCommonStyles();
  const poolDetailsRows: IPoolDetails[] = mockPools.map((pool) => {
    const curValuation = calculateValuation(tokenPrices.current, pool.tokens);
    const prevValuation = calculateValuation(tokenPrices.prev, pool.tokens);

    const difference = curValuation
      .sub(prevValuation)
      .mul(BigNumber.from("1000"));

    const return24hBigNumber = prevValuation.isZero()
      ? ZERO_NUMBER
      : difference.div(prevValuation);

    const returns24h = Number(formatBigNumber(return24hBigNumber, 0, 3)) / 1000;

    const price = Number(
      formatBigNumber(curValuation.div(pool.ckTokens), TOKEN_DECIMALS)
    );
    return {
      ...pool,
      price,
      returns24h,
      valuation: Number(formatBigNumber(curValuation, TOKEN_DECIMALS)),
    };
  });
  return (
    <div className={clsx(classes.root, commonClasses.pageContent)}>
      <TopSection />
      <Typography className={classes.subTitle}>My invest</Typography>
      <FeaturedLiquidityPoolsSection pools={poolDetailsRows.slice(0, 3)} />
      <Typography className={classes.subTitle}>My transactions</Typography>
      <TransactionsSection transactions={mockTransactions} />
    </div>
  );
};

export default MyInvestPage;
