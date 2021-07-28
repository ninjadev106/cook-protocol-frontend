import {
  DEFAULT_NETWORK_ID,
  NETWORK_CONFIG,
  TOKEN_DECIMALS,
} from "config/constants";
import { getTokenFromAddress } from "config/network";
import { BigNumber, ethers } from "ethers";
import { useIsMountedRef } from "helpers";
import React, { useEffect, useState } from "react";
import { CkService } from "services/ck";
import { ERC20Service } from "services/erc20";
import { ICoinPrices, IPool, Maybe } from "types";
import { AssetType } from "types/enums";
import { formatBigNumber } from "utils";

import { ZERO_NUMBER } from "./number";
import { calculateValuation } from "./token";

export const getPoolDetailsFromPool = (
  pool: IPool,
  tokenPrices: ICoinPrices
) => {
  const curValuation = calculateValuation(tokenPrices.current, pool.tokens);
  const prevValuation = calculateValuation(tokenPrices.prev, pool.tokens);

  const difference = curValuation
    .sub(prevValuation)
    .mul(BigNumber.from("1000"));

  const return24hBigNumber = prevValuation.isZero()
    ? ZERO_NUMBER
    : difference.div(prevValuation);

  const returns24h = Number(formatBigNumber(return24hBigNumber, 0, 3)) / 1000;

  const price = pool.ckTokens.eq(ZERO_NUMBER)
    ? 0
    : Number(formatBigNumber(curValuation.div(pool.ckTokens), TOKEN_DECIMALS));
  return {
    ...pool,
    price,
    returns24h,
    valuation: Number(formatBigNumber(curValuation, TOKEN_DECIMALS)),
  };
};

export const getCKDetails = async (
  ckAddress: string,
  provider: any,
  networkId?: number
): Promise<Maybe<IPool>> => {
  if (!ckAddress) return null;
  const finalProvider = provider
    ? provider
    : new ethers.providers.JsonRpcProvider(
        NETWORK_CONFIG.params[0].rpcUrls[0],
        parseInt(NETWORK_CONFIG.params[0].chainId)
      );
  const finalNetworkID = networkId || DEFAULT_NETWORK_ID;
  const ckService = new CkService(finalProvider, null, ckAddress);

  try {
    const ckDetails: any = {
      id: ckAddress,
      address: ckAddress,
      tokens: {},
      assetType: AssetType.SpotComposite,
    };
    const components = await ckService.getComponents();
    // getTokenBalances
    const [ckName, ckSymbol, ckTotalSupply] = await Promise.all([
      ckService.getName(),
      ckService.getSymbol(),
      ckService.getTotalSupply(),
    ]);
    ckDetails.name = ckName;
    ckDetails.symbol = ckSymbol;
    ckDetails.ckTokens = ckTotalSupply;
    const componentBalances = await Promise.all(
      components.map((tokenAddress) => {
        const erc20Service = new ERC20Service(
          finalProvider,
          null,
          tokenAddress
        );
        return erc20Service.getBalanceOf(ckAddress);
      })
    );
    components.forEach((tokenAddress, index) => {
      const tokenBalance = componentBalances[index] as BigNumber;
      const token = getTokenFromAddress(finalNetworkID, tokenAddress);
      ckDetails.tokens[token.symbol] = tokenBalance;
    });
    return ckDetails as IPool;
  } catch (error) {
    return null;
  }
};
