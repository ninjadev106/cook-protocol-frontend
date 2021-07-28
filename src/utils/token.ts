import axios from "axios";
import { defaultCoinPrices } from "config/constants";
import { getToken, tokenIds } from "config/network";
import { BigNumber, utils } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { getCoingeckoService } from "services/coingecko";
import { ICoinPrices, KnownToken } from "types";
import { formatBigNumber, getDecimalsLimitedString } from "utils";

import { ETH_NUMBER, ZERO_NUMBER } from "./number";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getImageUrl(tokenAddress?: string): string | undefined {
  if (!tokenAddress) return undefined;
  tokenAddress = utils.getAddress(tokenAddress);
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
}

export const getCoinsChartData = async (
  tokens: {
    [key: string]: BigNumber;
  },
  ckTokens: BigNumber
) => {
  const tokenIds = Object.keys(tokens);
  const date = new Date();
  const to = Math.floor(date.getTime() / 1000);
  date.setMonth(date.getMonth() - 3);
  const from = Math.floor(date.getTime() / 1000);

  const coinInfos: { [key: string]: Array<Array<number>> } = {};

  const promises = tokenIds.map(async (tokenId) => {
    const oneInfo = await getCoinChartInfo(tokenId as KnownToken, from, to);
    coinInfos[tokenId] = oneInfo as Array<Array<number>>;
  });

  await Promise.all(promises);

  const finalInfo: Array<Array<number>> = [];
  let isEnd = false;
  while (!isEnd) {
    let total: BigNumber = ZERO_NUMBER;
    let timestamp = 0;
    const currentLength = finalInfo.length;

    tokenIds.forEach((tokenId) => {
      const totalLength = coinInfos[tokenId].length;
      timestamp = coinInfos[tokenId][totalLength - currentLength - 1][0];
      const price = coinInfos[tokenId][totalLength - currentLength - 1][1];

      total = total.add(
        tokens[tokenId].mul(
          parseEther(getDecimalsLimitedString(Number(price).toFixed(6)))
        )
      );
      if (totalLength - currentLength - 1 === 0) {
        isEnd = true;
      }
    });
    const lpPrice = ckTokens.eq(ZERO_NUMBER)
      ? ZERO_NUMBER
      : total.div(ckTokens);

    finalInfo.unshift([timestamp, Number(formatBigNumber(lpPrice, 18, 6))]);
  }

  return finalInfo;
};

export const getCoinChartInfo = async (
  id: KnownToken,
  from: number,
  to: number
) => {
  const token = getToken(id);
  const endPoint = `https://api.coingecko.com/api/v3/coins/${token.coingeckoId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
  const coingeckoService = getCoingeckoService();
  const response = await coingeckoService.getData(endPoint);
  return response.data.prices;
};

export const getCoinsPrices = async (): Promise<ICoinPrices> => {
  const prices: ICoinPrices = { ...defaultCoinPrices };

  const promises = Object.keys(tokenIds).map(async (tokenId) => {
    const token = getToken(tokenId as KnownToken);

    const tokenPrices = await getCoinPrices(token.coingeckoId);
    prices.current[tokenId as KnownToken] = tokenPrices.current;
    prices.prev[tokenId as KnownToken] = tokenPrices.prev;
  });

  await Promise.all(promises);

  return prices;
};

export const getCoinPrices = async (
  coingeckoId: string
): Promise<{ current: BigNumber; prev: BigNumber }> => {
  const endPoint = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=2&interval=daily`;
  const response = await axios.get(endPoint);
  const { prices } = response.data;
  if (prices.length === 0) {
    return { current: ZERO_NUMBER, prev: ZERO_NUMBER };
  }

  const currentPrice = Number(prices[prices.length - 1][1]).toFixed(6);
  const prevPrice = Number(prices[0][1]).toFixed();
  return {
    current: parseEther(getDecimalsLimitedString(String(currentPrice))),
    prev: parseEther(getDecimalsLimitedString(String(prevPrice))),
  };
};

export const calculateValuation = (
  prices: { [key in KnownToken]: BigNumber },
  tokens: { [key: string]: BigNumber }
): BigNumber => {
  let total = ZERO_NUMBER;

  Object.keys(tokens).map((tokenId) => {
    const price = prices[tokenId as KnownToken];
    const amount = tokens[tokenId];

    total = total.add(price.mul(amount).div(ETH_NUMBER));
  });

  return total;
};
