import { BigNumber } from "ethers";
import { formatUnits, parseEther, parseUnits } from "ethers/lib/utils";

import { fetchQuery } from "./graphql";
import { ETH_NUMBER, ZERO_NUMBER } from "./number";

import { getDecimalsLimitedString } from "./index";

const query = `query GetSwaps($pair: String!, $timestamp: String!) {
  swaps(orderBy:timestamp, orderDirection: desc, first:1, where: {pair: $pair, timestamp_lt: $timestamp}) {
    id
    pair {
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
    amount0In
    amount0Out
    amount1In
    amount1Out
    amountUSD
    timestamp
  }
}
`;

export const getTokenPrice = async (
  httpUri: string,
  pairId: string,
  timestamp: number
) => {
  const response = await fetchQuery(
    query,
    { pair: pairId, timestamp: timestamp.toString() },
    httpUri
  );
  const res = response.data;
  const swaps = res.data.swaps;

  if (swaps.length === 0) {
    return ZERO_NUMBER;
  }

  const { amount0In, amount0Out, amount1In, amount1Out } = swaps[0];
  const a0In = parseEther(getDecimalsLimitedString(amount0In));
  const a0Out = parseEther(getDecimalsLimitedString(amount0Out));
  const a1In = parseEther(getDecimalsLimitedString(amount1In));
  const a1Out = parseEther(getDecimalsLimitedString(amount1Out));

  const getPrice = (): BigNumber => {
    if (a1Out.isZero() && a1In.isZero()) return ZERO_NUMBER;
    if (a1Out.isZero()) return a0Out.div(a1In);
    return a0In.div(a1Out);
  };

  return getPrice().mul(ETH_NUMBER);
};
