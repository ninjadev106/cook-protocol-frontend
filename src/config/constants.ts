import { ReactComponent as BalSvg } from "assets/svgs/token/bal.svg";
import { ReactComponent as BtcSvg } from "assets/svgs/token/btc.svg";
import { ReactComponent as CompSvg } from "assets/svgs/token/comp.svg";
import { ReactComponent as DaiSvg } from "assets/svgs/token/dai.svg";
import { ReactComponent as DotSvg } from "assets/svgs/token/dot.svg";
import { ReactComponent as EthSvg } from "assets/svgs/token/eth.svg";
import { ReactComponent as LinkSvg } from "assets/svgs/token/link.svg";
import { ReactComponent as LtcSvg } from "assets/svgs/token/ltc.svg";
import { ReactComponent as RepSvg } from "assets/svgs/token/rep.svg";
import { ReactComponent as UniSvg } from "assets/svgs/token/uni.svg";
import { ReactComponent as UsdtSvg } from "assets/svgs/token/usdt.svg";
import { ReactComponent as XlmSvg } from "assets/svgs/token/xlm.svg";
import { ReactComponent as XrpSvg } from "assets/svgs/token/xrp.svg";
import { ReactComponent as YfiSvg } from "assets/svgs/token/yfi.svg";
import { ReactComponent as ZrxSvg } from "assets/svgs/token/zrx.svg";
import { ReactComponent as CoinbaseSVG } from "assets/svgs/wallet/coinbase.svg";
import { ReactComponent as FormaticSVG } from "assets/svgs/wallet/fortmatic.svg";
import { ReactComponent as MetaMaskSVG } from "assets/svgs/wallet/metamask-color.svg";
import { ReactComponent as WalletConnectSVG } from "assets/svgs/wallet/wallet-connect.svg";
import { ICoinPrices, KnownToken } from "types";
import { ConnectorNames } from "types/enums";
import { ZERO_NUMBER } from "utils/number";

export const STORAGE_KEY_SETTINGS = "settings";
export const STORAGE_KEY_CONNECTOR = "CONNECTOR";

export const DEFAULT_NETWORK_ID = 256;
export const LOGGER_ID = "COOK PROTOCOL DEMO:";

export const TOKEN_DECIMALS = 18;

export const WALLET_ICONS: { [key in ConnectorNames]: React.ElementType } = {
  [ConnectorNames.Injected]: MetaMaskSVG,
  [ConnectorNames.WalletConnect]: WalletConnectSVG,
  [ConnectorNames.WalletLink]: CoinbaseSVG,
  [ConnectorNames.Fortmatic]: FormaticSVG,
};

export const TOKEN_ICONS: { [key in KnownToken]: React.ElementType } = {
  btc: BtcSvg,
  comp: CompSvg,
  uni: UniSvg,
  eth: EthSvg,
  link: LinkSvg,
  xlm: XlmSvg,
  ltc: LtcSvg,
  dot: DotSvg,
  bal: BalSvg,
  yfi: YfiSvg,
  rep: RepSvg,
  dai: DaiSvg,
  xrp: XrpSvg,
  zrx: ZrxSvg,
  usdt: UsdtSvg,
};

export const PlATFORMS = [
  { label: "Compound", value: "comp" },
  { label: "Uniswap", value: "uni" },
];

export const TEST_MODE = process.env.REACT_APP_TEST || true;
export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID || "";

export const NETWORK_CONFIG = TEST_MODE
  ? {
      method: "wallet_addEthereumChain",
      params: [
        // {
        //   chainId: "0x100",
        //   chainName: "Heco Testnet",
        //   nativeCurrency: {
        //     name: "Heco",
        //     symbol: "HT",
        //     decimals: 18,
        //   },
        //   rpcUrls: ["https://http-testnet.hecochain.com"],
        //   blockExplorerUrls: ["https://testnet.hecoinfo.com/"],
        // },
        {
          chainId: "0x4",
          chainName: "Rinkeyby Testnet",
          nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: [`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`],
          blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
        },
      ],
    }
  : {
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x80",
          chainName: "Heco Mainnet",
          nativeCurrency: {
            name: "Heco",
            symbol: "HT",
            decimals: 18,
          },
          rpcUrls: ["https://http-mainnet.hecochain.com"],
          blockExplorerUrls: ["https://scan.hecochain.com"],
        },
      ],
    };

export const defaultCoinPrices: ICoinPrices = {
  current: {
    btc: ZERO_NUMBER,
    eth: ZERO_NUMBER,
    link: ZERO_NUMBER,
    xrp: ZERO_NUMBER,
    ltc: ZERO_NUMBER,
    dot: ZERO_NUMBER,
    uni: ZERO_NUMBER,
    comp: ZERO_NUMBER,
    bal: ZERO_NUMBER,
    yfi: ZERO_NUMBER,
    rep: ZERO_NUMBER,
    dai: ZERO_NUMBER,
    xlm: ZERO_NUMBER,
    zrx: ZERO_NUMBER,
    usdt: ZERO_NUMBER,
  },
  prev: {
    btc: ZERO_NUMBER,
    eth: ZERO_NUMBER,
    link: ZERO_NUMBER,
    xrp: ZERO_NUMBER,
    ltc: ZERO_NUMBER,
    dot: ZERO_NUMBER,
    uni: ZERO_NUMBER,
    comp: ZERO_NUMBER,
    bal: ZERO_NUMBER,
    yfi: ZERO_NUMBER,
    rep: ZERO_NUMBER,
    dai: ZERO_NUMBER,
    xlm: ZERO_NUMBER,
    zrx: ZERO_NUMBER,
    usdt: ZERO_NUMBER,
  },
};
