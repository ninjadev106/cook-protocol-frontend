import {
  IKnownTokenData,
  INetwork,
  IToken,
  KnownContracts,
  KnownToken,
  NetworkId,
} from "types";
import { entries } from "utils/type-utils";

import {
  DEFAULT_NETWORK_ID,
  INFURA_PROJECT_ID,
  TOKEN_ICONS,
} from "./constants";

export const networkIds = {
  RINKEBY: 4,
  HTMAINNET: 128,
  HTTEST: 256,
} as const;

export const tokenIds = {
  btc: "btc",
  eth: "eth",
  link: "link",
  xrp: "xrp",
  ltc: "ltc",
  dot: "dot",
  uni: "uni",
  comp: "comp",
  bal: "bal",
  yfi: "yfi",
  rep: "rep",
  dai: "dai",
  xlm: "xlm",
  usdt: "usdt",
};

const networks: { [K in NetworkId]: INetwork } = {
  [networkIds.HTMAINNET]: {
    label: "HT-Mainnet",
    url: "https://http-mainnet.hecochain.com",
    contracts: {
      factory: "0xBF0e4fA97E39d0e2F45DB97B64f12810bC55F106",
      controller: "0x070198264d00dA6BBF2dA1A310Dec58a3Ba11eb4",
      streamingFee: "0x946686adF780E147d4D680F27b57c89bbf339CE4",
      basicIssuance: "0x5FCED5B32a7318AC469BE149f365C2063FaD3378",
      integrationRegistry: "0x796534BC40bB31712fa601280AD4987fAB1961c4",
      governance: "0x8539D654a2Fc7F923811D2B8009d867513B435e5",
      wrapModule: "0xf1059eddb6dAE0042b8238dFd030feA2a9cD6915",
      tradeModule: "0xF48bB965CcD14eD44Ee95d6CFEf854918d06f6Dd",
      singleIndexModule: "0xB6ca725b91b28637b2BBc22c1810Cd030d9A5dC6",
      mdexFactory: "0x9718b33b3016d15010b7874c3878de647c907253",
      mdexRouter: "0xde979bb8fbe73e551061ca420d843f1905c840bb",
    },
    etherscanUri: "https://scan.hecochain.com/",
  },
  [networkIds.HTTEST]: {
    label: "HT-Testnet",
    url: "https://http-testnet.hecochain.com",
    contracts: {
      factory: "0xBF0e4fA97E39d0e2F45DB97B64f12810bC55F106",
      controller: "0x070198264d00dA6BBF2dA1A310Dec58a3Ba11eb4",
      streamingFee: "0x946686adF780E147d4D680F27b57c89bbf339CE4",
      basicIssuance: "0x5FCED5B32a7318AC469BE149f365C2063FaD3378",
      integrationRegistry: "0x796534BC40bB31712fa601280AD4987fAB1961c4",
      governance: "0x8539D654a2Fc7F923811D2B8009d867513B435e5",
      wrapModule: "0xf1059eddb6dAE0042b8238dFd030feA2a9cD6915",
      tradeModule: "0xF48bB965CcD14eD44Ee95d6CFEf854918d06f6Dd",
      singleIndexModule: "0xB6ca725b91b28637b2BBc22c1810Cd030d9A5dC6",
      mdexFactory: "0x9718b33b3016d15010b7874c3878de647c907253",
      mdexRouter: "0xde979bb8fbe73e551061ca420d843f1905c840bb",
    },
    etherscanUri: "https://testnet.hecoinfo.com/",
  },
  [networkIds.RINKEBY]: {
    label: "RINKEBY",
    url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    contracts: {
      factory: "0xAf7c304Eaea34002C7D28D6F42BA098c7BbBA815",
      controller: "0xd22a6524E9Bd4F5E7604AC7d80d60FB4Ae8e1114",
      streamingFee: "0x3381545476B5396049785B0E10f3078973DabD1c",
      basicIssuance: "0xaCD8ef35aF33ce89920b00F1852e06f0029c75F9",
      integrationRegistry: "0xf2e8E59D8832Ac6fe0eDeF84a967b7677Df2e46B",
      governance: "0x41587101E8DEf18ecC4517CB68e0941eB7CaDde4",
      wrapModule: "0x4F7Ca3C7c31A346eDB8A140910Ca3dE9eD185Fef",
      tradeModule: "0x2130fc1F8DaD207Bb0c169EE4E5Cb7a4A0b3C2Da",
      singleIndexModule: "0xBA80E2495e728af03FD69C77C4C130FC5Ad84F8b",
      mdexFactory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      mdexRouter: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
    etherscanUri: "https://rinkeby.etherscan.io/",
  },
};

const knownTokens: { [K in KnownToken]: IKnownTokenData } = {
  btc: {
    name: "Bitcoin",
    symbol: "btc",
    coingeckoId: "bitcoin",
    addresses: {
      [networkIds.HTMAINNET]: "0x1D8684e6CdD65383AfFd3D5CF8263fCdA5001F13",
      [networkIds.HTTEST]: "0x1D8684e6CdD65383AfFd3D5CF8263fCdA5001F13",
      [networkIds.RINKEBY]: "0xCC9308318B91528a8a4573Db77E9Abfa1Fc85224",
    },
    image: "/assets/svgs/token/btc.svg",
    decimals: 18,
  },
  eth: {
    name: "Ethereum",
    symbol: "eth",
    coingeckoId: "ethereum",
    addresses: {
      [networkIds.HTMAINNET]: "0xfeB76Ae65c11B363Bd452afb4A7eC59925848656",
      [networkIds.HTTEST]: "0xfeB76Ae65c11B363Bd452afb4A7eC59925848656",
      [networkIds.RINKEBY]: "0x5939F1B2999edF416A4A9Ab067AF2CC5eC1D9BBD",
    },
    image: "/assets/svgs/token/eth.svg",
    decimals: 18,
  },
  link: {
    name: "Chainlink",
    symbol: "link",
    coingeckoId: "chainlink",
    addresses: {
      [networkIds.HTMAINNET]: "0x3E24e9d2c824B0ac2C82edc931B67252099B8e79",
      [networkIds.HTTEST]: "0x3E24e9d2c824B0ac2C82edc931B67252099B8e79",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/link.svg",
    decimals: 18,
  },
  xrp: {
    name: "XRP",
    symbol: "xrp",
    coingeckoId: "ripple",
    addresses: {
      [networkIds.HTMAINNET]: "0x69AB5c067370FfcF48f1678918A719B7e1f4B4AA",
      [networkIds.HTTEST]: "0x69AB5c067370FfcF48f1678918A719B7e1f4B4AA",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/xrp.svg",
    decimals: 18,
  },
  ltc: {
    name: "Litecoin",
    symbol: "ltc",
    coingeckoId: "litecoin",
    addresses: {
      [networkIds.HTMAINNET]: "0x326708a5C67c187725317ED89A1fb242B44e192a",
      [networkIds.HTTEST]: "0x326708a5C67c187725317ED89A1fb242B44e192a",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/ltc.svg",
    decimals: 18,
  },
  dot: {
    name: "Polkadot",
    symbol: "dot",
    coingeckoId: "polkadot",
    addresses: {
      [networkIds.HTMAINNET]: "0x97DE62E21D85c3D1A1bBF7E455C004096e51EcFc",
      [networkIds.HTTEST]: "0x97DE62E21D85c3D1A1bBF7E455C004096e51EcFc",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/dot.svg",
    decimals: 18,
  },
  uni: {
    name: "Uniswap",
    symbol: "uni",
    coingeckoId: "uniswap",
    addresses: {
      [networkIds.HTMAINNET]: "0x4d879F43f6644784248553Ee91A2e4Dfb06fE0BC",
      [networkIds.HTTEST]: "0x4d879F43f6644784248553Ee91A2e4Dfb06fE0BC",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/uni.svg",
    decimals: 18,
  },
  comp: {
    name: "Compound Coin",
    symbol: "comp",
    coingeckoId: "compound-coin",
    addresses: {
      [networkIds.HTMAINNET]: "0xd948d1017b81d3497fba3f6f44135d7afe6edfeb",
      [networkIds.HTTEST]: "0xd948d1017b81d3497fba3f6f44135d7afe6edfeb",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/comp.svg",
    decimals: 18,
  },
  bal: {
    name: "Balancer",
    symbol: "bal",
    coingeckoId: "balancer",
    addresses: {
      [networkIds.HTMAINNET]: "0xEaaB9DbB37e2149a8205e67783819c7FBEd7087f",
      [networkIds.HTTEST]: "0xEaaB9DbB37e2149a8205e67783819c7FBEd7087f",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/bal.svg",
    decimals: 18,
  },
  yfi: {
    name: "yearn.finance",
    symbol: "yfi",
    coingeckoId: "yearn-finance",
    addresses: {
      [networkIds.HTMAINNET]: "0x48B284700Ff525D2cE32eb1F8Fb449D780305883",
      [networkIds.HTTEST]: "0x48B284700Ff525D2cE32eb1F8Fb449D780305883",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/bal.svg",
    decimals: 18,
  },
  rep: {
    name: "Augur",
    symbol: "rep",
    coingeckoId: "augur",
    addresses: {
      [networkIds.HTMAINNET]: "0x9d4c69aE56002a152e428A216A406d63d207f6b2",
      [networkIds.HTTEST]: "0x9d4c69aE56002a152e428A216A406d63d207f6b2",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/rep.svg",
    decimals: 18,
  },
  dai: {
    name: "Dai",
    symbol: "dai",
    coingeckoId: "dai",
    addresses: {
      [networkIds.HTMAINNET]: "0x60d64Ef311a4F0E288120543A14e7f90E76304c6",
      [networkIds.HTTEST]: "0x60d64Ef311a4F0E288120543A14e7f90E76304c6",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/dai.svg",
    decimals: 18,
  },
  xlm: {
    name: "Stellar",
    symbol: "xlm",
    coingeckoId: "stellar",
    addresses: {
      [networkIds.HTMAINNET]: "0xaD941373782E3162a9EE661FB859E64Cc559FA9c",
      [networkIds.HTTEST]: "0xaD941373782E3162a9EE661FB859E64Cc559FA9c",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/xlm.svg",
    decimals: 18,
  },
  zrx: {
    name: "0x",
    symbol: "zrx",
    coingeckoId: "0x",
    addresses: {
      [networkIds.HTMAINNET]: "0x5000F1595491A4C2F6946d3976f0B9e3D3c3Da77",
      [networkIds.HTTEST]: "0x5000F1595491A4C2F6946d3976f0B9e3D3c3Da77",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/zrx.svg",
    decimals: 18,
  },
  usdt: {
    name: "Tether",
    symbol: "usdt",
    coingeckoId: "tether",
    addresses: {
      [networkIds.HTMAINNET]: "0x04F535663110A392A6504839BEeD34E019FdB4E0",
      [networkIds.HTTEST]: "0x04F535663110A392A6504839BEeD34E019FdB4E0",
      [networkIds.RINKEBY]: "0x7c7F0428238815492194c2AFC30cf186CfC67dcb",
    },
    image: "/assets/svgs/token/usdt.svg",
    decimals: 18,
  },
};

export const supportedNetworkIds = Object.keys(networks).map(
  Number
) as NetworkId[];

export const supportedNetworkURLs = entries(networks).reduce<{
  [networkId: number]: string;
}>(
  (acc, [networkId, network]) => ({
    ...acc,
    [networkId]: network.url,
  }),
  {}
);

const validNetworkId = (networkId: number): networkId is NetworkId => {
  return networks[networkId as NetworkId] !== undefined;
};

export const getEtherscanUri = (networkId?: number): string => {
  const fNetworkId = networkId || DEFAULT_NETWORK_ID;
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`);
  }

  return networks[fNetworkId].etherscanUri;
};

export const getToken = (tokenId: KnownToken, networkId?: number): IToken => {
  const token = knownTokens[tokenId];

  if (!token) {
    throw new Error(`Unsupported token id: '${tokenId}'`);
  }
  const fNetworkId = networkId || DEFAULT_NETWORK_ID;
  if (!validNetworkId(fNetworkId)) {
    throw new Error(`Unsupported network id: '${fNetworkId}'`);
  }
  return {
    name: token.name,
    symbol: token.symbol,
    coingeckoId: token.coingeckoId,
    decimals: token.decimals,
    address: token.addresses[fNetworkId],
    icon: TOKEN_ICONS[tokenId],
  };
};

export const getContractAddress = (
  networkId: number,
  contract: KnownContracts
): string => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }
  return networks[networkId].contracts[contract];
};

export const getTokenFromAddress = (
  networkId: number,
  address: string
): IToken => {
  if (!validNetworkId(networkId)) {
    throw new Error(`Unsupported network id: '${networkId}'`);
  }

  for (const token of Object.values(knownTokens)) {
    const tokenAddress = token.addresses[networkId];

    // token might not be supported in the current network
    if (!tokenAddress) {
      continue;
    }

    if (tokenAddress.toLowerCase() === address.toLowerCase()) {
      return {
        name: token.name,
        symbol: token.symbol,
        coingeckoId: token.coingeckoId,
        decimals: token.decimals,
        address: tokenAddress,
        icon: TOKEN_ICONS[token.symbol as KnownToken],
      };
    }
  }

  throw new Error(
    `Couldn't find token with address '${address}' in network '${networkId}'`
  );
};
