import { DEFAULT_NETWORK_ID, NETWORK_CONFIG } from "config/constants";
import { getContractAddress } from "config/network";
import { ethers } from "ethers";
import { useIsMountedRef } from "helpers";
import React, { useEffect, useState } from "react";
import { ControllerService } from "services/controller";
import { waitSeconds } from "utils";

interface IState {
  cks: string[];
  loading: boolean;
}

export const useAllCks = (
  provider: any,
  networkId?: number
): IState & {
  load: () => Promise<void>;
} => {
  const [state, setState] = useState<IState>({
    cks: [],
    loading: true,
  });
  const isMountedRef = useIsMountedRef();

  const load = async () => {
    const finalProvider = provider
      ? provider
      : new ethers.providers.JsonRpcProvider(
          NETWORK_CONFIG.params[0].rpcUrls[0],
          parseInt(NETWORK_CONFIG.params[0].chainId)
        );
    const finalNetworkID = networkId || DEFAULT_NETWORK_ID;
    const controllerAddress = getContractAddress(finalNetworkID, "controller");

    const controllerService = new ControllerService(
      finalProvider,
      null,
      controllerAddress
    );

    setState((prev) => ({ ...prev, loading: true }));
    try {
      const cks = await controllerService.getCKs();
      if (isMountedRef.current === true) {
        setState((prev) => ({
          ...prev,
          cks,
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, cks: [], loading: false }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { ...state, load };
};
