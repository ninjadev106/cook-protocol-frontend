import { BigNumber } from "ethers";
import { AssetType, ETransactionItemType, THEME } from "./enums";

export type Maybe<T> = T | null;

export interface ISettings {
  theme: THEME;
  responsiveFontSizes: boolean;
}

export interface INetwork {
  label: string;
  url: string;
  contracts: {
    factory: string;
    controller: string;
    streamingFee: string;
    basicIssuance: string;
    integrationRegistry: string;
    governance: string;
    wrapModule: string;
    tradeModule: string;
    singleIndexModule: string;
    mdexFactory: string;
    mdexRouter: string;
  };
  etherscanUri: string;
}

export type NetworkId = 4 | 128 | 256;

export type KnownContracts = keyof INetwork["contracts"];

export interface IToken {
  address: string;
  decimals: number;
  symbol: string;
  image?: string;
  coingeckoId: string;
  name: string;
  icon: React.ElementType;
}

export interface IFeaturedLiquidityPool {
  id: string;
  address: string;
  title: string;
  returns24h: number;
  riskIndex: string;
  sector: string;
}

export interface IPool {
  id: string;
  address: string;
  name: string;
  symbol: string;
  assetType: AssetType;
  ckTokens: BigNumber;
  tokens: { [key: string]: BigNumber };
}

export interface IPoolDetails extends IPool {
  returns24h: number;
  price: number;
  valuation: number;
}

export interface ITokenDistributionItem {
  tokenId: KnownToken;
  quantity: BigNumber;
  value: BigNumber;
  portfolioAllocation: Number;
  returns24h: BigNumber;
}

export interface ITokenDistributionTableItem extends ITokenDistributionItem {
  valueStr: string;
  returns24hStr: string;
  quantityStr: string;
}

export type KnownToken =
  | "btc"
  | "eth"
  | "link"
  | "xrp"
  | "ltc"
  | "dot"
  | "uni"
  | "comp"
  | "bal"
  | "yfi"
  | "rep"
  | "dai"
  | "xlm"
  | "zrx"
  | "usdt";

export interface IKnownTokenData {
  name: string;
  symbol: string;
  coingeckoId: string;
  addresses: { [key in NetworkId]: string };
  image: string;
  decimals: number;
}

export interface ICoinPrices {
  current: { [key in KnownToken]: BigNumber };
  prev: { [key in KnownToken]: BigNumber };
}

export interface ICreateFund {
  name: string;
  symbol: string;
  about: string;
  fee: number;
  acceptedTokens: string[];
  liquidityPoolType: string;
  platformWhitelist: string[];
  allowLeverage: string;
}

export interface IGlobalData {
  createdPools: ICreateFund[];
  tokenPrices: ICoinPrices;
  ethBalance: BigNumber;
  uniswapModalVisible: boolean;
  transactionModalInfo: {
    visible: boolean;
    txId: string;
    description?: string;
    title?: string;
  };
}

export interface ITransactionItem {
  txId: string;
  type: ETransactionItemType;
  value: {
    token: KnownToken;
    amount: BigNumber;
  };
  timestamp: number;
}

export type SortOrder = "asc" | "desc";

export interface IABIs {
  factory: any;
  controller: any;
  streamingFee: any;
  basicIssuance: any;
  integrationRegistry: any;
  governance: any;
  wrapModule: any;
  tradeModule: any;
  singleIndexModule: any;
  ck: any;
  mdexFactory: any;
  mdexRouter: any;
  mdexPair: any;
}
