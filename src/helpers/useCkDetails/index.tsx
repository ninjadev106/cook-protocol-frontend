import { DEFAULT_NETWORK_ID, NETWORK_CONFIG } from "config/constants";
import { getTokenFromAddress } from "config/network";
import { BigNumber, ethers } from "ethers";
import { useIsMountedRef } from "helpers";
import React, { useEffect, useState } from "react";
import { CkService } from "services/ck";
import { ERC20Service } from "services/erc20";
import { IPool } from "types";
import { AssetType } from "types/enums";

interface IState {
  details?: IPool;
  loading: boolean;
}

export const useCkDetails = (
  ckAddress: string,
  provider: any,
  networkId?: number
): IState & {
  load: () => Promise<void>;
} => {
  const [state, setState] = useState<IState>({ loading: true });
  const isMountedRef = useIsMountedRef();

  const load = async () => {
    if (!ckAddress) return;
    const finalProvider = provider
      ? provider
      : new ethers.providers.JsonRpcProvider(
          NETWORK_CONFIG.params[0].rpcUrls[0],
          parseInt(NETWORK_CONFIG.params[0].chainId)
        );
    const finalNetworkID = networkId || DEFAULT_NETWORK_ID;
    const ckService = new CkService(finalProvider, null, ckAddress);
    setState((prev) => ({ ...prev, loading: true }));
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
      if (isMountedRef.current === true)
        setState((prev) => ({
          ...prev,
          details: ckDetails as IPool,
          loading: false,
        }));
    } catch (error) {
      setState((prev) => ({ ...prev, details: undefined, loading: false }));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ckAddress, provider]);

  return { ...state, load };
};
