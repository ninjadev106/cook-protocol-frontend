import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import {
  networkIds,
  supportedNetworkIds,
  supportedNetworkURLs,
} from "config/network";

const POLLING_INTERVAL = 12000;

const injected = new InjectedConnector({
  supportedChainIds: supportedNetworkIds,
});

const walletconnect = new WalletConnectConnector({
  rpc: { 128: supportedNetworkURLs[128] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

const fortmatic = new FortmaticConnector({
  apiKey: process.env.REACT_APP_FORTMATIC_API_KEY as string,
  chainId: 42,
});

const walletlink = new WalletLinkConnector({
  url: supportedNetworkURLs[128],
  appName: "COOK PROTOCOL FRONTEND",
});

export default {
  injected,
  walletconnect,
  fortmatic,
  walletlink,
};
