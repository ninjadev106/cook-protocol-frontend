import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { CreateLiquidityPoolForm } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress, getToken } from "config/network";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import React from "react";
import { useHistory } from "react-router-dom";
import { CkService } from "services/ck";
import { FactoryService } from "services/factory";
import { IssuanceService } from "services/issuance";
import { SingleIndexService } from "services/singleIndex";
import { StreamingFeeService } from "services/streamingFee";
import { TradeService } from "services/trade";
import { ICreateFund, KnownToken } from "types";
import { ZERO_NUMBER } from "utils/number";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
}));

const NewFundPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const { setTransactionModalVisible } = useGlobal();

  const onSubmit = async (payload: ICreateFund) => {
    if (!provider) return;

    const factoryAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "factory"
    );
    const factoryService = new FactoryService(
      provider,
      account,
      factoryAddress
    );
    const tokens: string[] = [];
    const units: BigNumber[] = [];

    payload.acceptedTokens.forEach((tokenId) => {
      const tokenInfo = getToken(tokenId as KnownToken, networkId);
      tokens.push(tokenInfo.address);
      units.push(parseEther("1"));
    });

    try {
      const streamingFee = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "streamingFee"
      );
      const basicIssuance = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "basicIssuance"
      );
      let txHash = await factoryService.createCK(
        tokens,
        units,
        [streamingFee, basicIssuance],
        account || "",
        payload.name,
        payload.symbol
      );
      setTransactionModalVisible(true, txHash);
      await provider.waitForTransaction(txHash);

      // get ckAddress
      const ckAddress = await factoryService.getCreatedCKAddress(txHash);
      console.log(ckAddress);

      // Initialize Streaming Fee Module
      const streamingFeeAddress = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "streamingFee"
      );
      const streamingFeeService = new StreamingFeeService(
        provider,
        account,
        streamingFeeAddress
      );
      setTransactionModalVisible(true, "", "Initializing streamingFee module");
      txHash = await streamingFeeService.initialize(ckAddress, [
        account,
        BigNumber.from("50000000000000000"),
        parseEther(Math.floor(payload.fee * 1000).toString()).div(
          BigNumber.from("100000")
        ),
        ZERO_NUMBER,
      ]);
      setTransactionModalVisible(
        true,
        txHash,
        "Initializing streamingFee module"
      );
      await provider.waitForTransaction(txHash);

      // Initialize Issuance Module
      const issuanceAddress = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "basicIssuance"
      );
      const issuanceService = new IssuanceService(
        provider,
        account,
        issuanceAddress
      );
      setTransactionModalVisible(
        true,
        "",
        "Initializing basic Issuance module"
      );
      txHash = await issuanceService.initialize(ckAddress);
      setTransactionModalVisible(
        true,
        txHash,
        "Initializing basic Issuance module"
      );
      await provider.waitForTransaction(txHash);

      // add modules
      const ckService = new CkService(provider, account, ckAddress);

      // const wrapModuleAddress = getContractAddress(
      //   networkId || DEFAULT_NETWORK_ID,
      //   "wrapModule"
      // );
      // txHash = await ckService.addModule(wrapModuleAddress);
      // setTransactionModalVisible(true, txHash, "Adding Wrap Module");
      // await provider.waitForTransaction(txHash);

      // add trade module
      const tradeModuleAddress = getContractAddress(
        networkId || DEFAULT_NETWORK_ID,
        "tradeModule"
      );
      setTransactionModalVisible(true, "", "Adding Trade Module");
      txHash = await ckService.addModule(tradeModuleAddress);
      setTransactionModalVisible(true, txHash, "Adding Trade Module");
      await provider.waitForTransaction(txHash);

      // Initialize Trade Module
      const tradeService = new TradeService(
        provider,
        account,
        tradeModuleAddress
      );
      setTransactionModalVisible(true, "", "Initializing trade module");
      txHash = await tradeService.initialize(ckAddress);
      setTransactionModalVisible(true, txHash, "Initializing trade module");
      await provider.waitForTransaction(txHash);

      // add singleIndex module
      // const singleIndexModuleAddress = getContractAddress(
      //   networkId || DEFAULT_NETWORK_ID,
      //   "singleIndexModule"
      // );
      // setTransactionModalVisible(true, "", "Adding Single Index Module");
      // txHash = await ckService.addModule(singleIndexModuleAddress);
      // setTransactionModalVisible(true, txHash, "Adding Single Index Module");
      // await provider.waitForTransaction(txHash);

      // Initialize singleIndex Module
      // const singleIndexService = new SingleIndexService(
      //   provider,
      //   account,
      //   singleIndexModuleAddress
      // );
      // setTransactionModalVisible(true, "", "Initializing single index module");
      // txHash = await singleIndexService.initialize(ckAddress);
      // setTransactionModalVisible(
      //   true,
      //   txHash,
      //   "Initializing single index module"
      // );
      // await provider.waitForTransaction(txHash);

      setTransactionModalVisible(false);
      history.push("/");
    } catch (error) {
      console.error(error);
      setTransactionModalVisible(false);
    }
  };
  return (
    <div className={clsx(classes.root)}>
      <CreateLiquidityPoolForm onSubmit={onSubmit} />
    </div>
  );
};

export default NewFundPage;
