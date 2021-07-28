import { ABIs } from "abi";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::Controller");

const controllerAbi = ABIs.controller;

class ControllerService {
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
        controllerAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(
        tokenAddress,
        controllerAbi,
        provider
      );
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * get Factory addreses
   */
  getFactories = async (index: BigNumber): Promise<string> => {
    return this.contract.factories(index);
  };

  /**
   * get FeeRecipient address
   */
  getFeeRecipient = async (): Promise<string> => {
    return this.contract.feeRecipient();
  };

  /**
   * get CKs
   */
  getCKs = async (): Promise<string[]> => {
    return this.contract.getCKs();
  };
}

export { ControllerService };
