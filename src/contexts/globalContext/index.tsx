import { TransactionProgressModal, UniswapModal } from "components";
import { defaultCoinPrices } from "config/constants";
import { useConnectedWeb3Context } from "contexts/connectedWeb3";
import React, { useEffect, useState } from "react";
import { IGlobalData } from "types";
import { ZERO_NUMBER } from "utils/number";
import { getCoinsPrices } from "utils/token";

const GlobalContext = React.createContext<
  IGlobalData & {
    setUniswapModalVisible: (_: boolean) => void;
    setTransactionModalVisible: (
      visible: boolean,
      txId?: string,
      description?: string
    ) => void;
  }
>({
  createdPools: [],
  tokenPrices: defaultCoinPrices,
  ethBalance: ZERO_NUMBER,
  uniswapModalVisible: false,
  setUniswapModalVisible: (_: boolean) => {},
  transactionModalInfo: {
    visible: false,
    txId: "",
  },
  setTransactionModalVisible: (_: boolean) => {},
});

export const useGlobal = () => {
  const context = React.useContext(GlobalContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

export const GlobalProvider: React.FC = (props) => {
  const [state, setState] = useState<IGlobalData>({
    createdPools: [],
    tokenPrices: defaultCoinPrices,
    ethBalance: ZERO_NUMBER,
    uniswapModalVisible: false,
    transactionModalInfo: {
      visible: false,
      txId: "",
    },
  });
  const { account, library: provider } = useConnectedWeb3Context();

  const setUniswapModalVisible = (uniswapModalVisible: boolean) => {
    setState((prev) => ({
      ...prev,
      uniswapModalVisible,
    }));
  };

  useEffect(() => {
    const loadCoinPrices = async () => {
      const prices = await getCoinsPrices();

      setState((prev) => ({ ...prev, tokenPrices: prices }));
    };
    loadCoinPrices();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadEthBalance = async () => {
      setState((prev) => ({ ...prev, ethBalance: ZERO_NUMBER }));
      if (provider) {
        const balance = await provider.getBalance(account || "");
        if (isMounted) {
          setState((prev) => ({ ...prev, ethBalance: balance }));
        }
      }
    };

    loadEthBalance();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const setTransactionModalVisible = (
    visible: boolean,
    txId?: string,
    description?: string
  ) => {
    setState((prev) => ({
      ...prev,
      transactionModalInfo: {
        visible,
        txId: txId || "",
        description,
      },
    }));
  };

  return (
    <GlobalContext.Provider
      value={{ ...state, setUniswapModalVisible, setTransactionModalVisible }}
    >
      {props.children}
      {state.uniswapModalVisible && (
        <UniswapModal
          onClose={() => setUniswapModalVisible(false)}
          visible={state.uniswapModalVisible}
        />
      )}
      {state.transactionModalInfo.visible && (
        <TransactionProgressModal
          {...state.transactionModalInfo}
          onClose={() => {
            setTransactionModalVisible(false);
          }}
        />
      )}
    </GlobalContext.Provider>
  );
};
