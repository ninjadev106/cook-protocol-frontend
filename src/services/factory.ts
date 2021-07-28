import { TransactionReceipt } from "@ethersproject/providers";
import { ABIs } from "abi";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::Factory");

const factoryAbi = ABIs.factory;

class FactoryService {
  provider: any;
  contract: Contract;

  constructor(
    provider: any,
    signerAddress: Maybe<string>,
    tokenAddress: string
  ) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner();
      this.contract = new ethers.Contract(
        tokenAddress,
        factoryAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, factoryAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * create fund with token addresses and weights
   */
  createCK = async (
    components: string[],
    units: BigNumber[],
    modules: string[],
    manager: string,
    name: string,
    symbol: string
  ): Promise<string> => {
    const transactionObject = await this.contract.create(
      components,
      units,
      modules,
      manager,
      name,
      symbol,
      {
        value: "0x0",
      }
    );
    logger.log(`create transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  getController = async (): Promise<string> => {
    return this.contract.controller();
  };

  getCreatedCKAddress = async (txHash: string): Promise<string> => {
    const filter = this.contract.filters.CKTokenCreated();
    logger.log(filter);
    if (!filter.topics || filter.topics.length === 0) return "";
    const SetTokenCreatedId = filter.topics[0] as string;
    const transactionReceipt: TransactionReceipt = await this.provider.getTransactionReceipt(
      txHash
    );

    const fundCreateLog = transactionReceipt.logs.find((lg) =>
      lg.topics.includes(SetTokenCreatedId)
    );

    if (fundCreateLog) {
      const parsedLog = this.contract.interface.parseLog(fundCreateLog);
      return parsedLog.args[0];
    }

    return "";
  };
}

export { FactoryService };
