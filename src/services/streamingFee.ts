import { TransactionReceipt } from "@ethersproject/providers";
import { ABIs } from "abi";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::StreamingFee");

const streamingFeeAbi = ABIs.streamingFee;

class StreamingFeeService {
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
        streamingFeeAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(
        tokenAddress,
        streamingFeeAbi,
        provider
      );
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * initialize
   * settings[0]: feeRecipient: string
   * settings[1]: maxStreamingFeePercentage: BigNumber (1% = 1e16, 100% = 1e18)
   * settings[2]: streamingFeePercentage: BigNumber
   * settings[3]: lastStreamingFeeTimestamp: BigNumber
   */
  initialize = async (ckToken: string, settings: any[]): Promise<string> => {
    console.log(ckToken, settings);
    const transactionObject = await this.contract.initialize(
      ckToken,
      settings,
      {
        value: "0x0",
      }
    );
    logger.log(`initialize transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };
}

export { StreamingFeeService };
