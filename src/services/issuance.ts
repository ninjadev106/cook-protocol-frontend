import { TransactionReceipt } from "@ethersproject/providers";
import { ABIs } from "abi";
import { BigNumber, Contract, Wallet, ethers, utils } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";
import { ZERO_ADDRESS } from "utils/token";
import { isAddress, isContract } from "utils/tools";

const logger = getLogger("Services::Issuance");

const issuanceAbi = ABIs.basicIssuance;

class IssuanceService {
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
        issuanceAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, issuanceAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * initialize
   */
  initialize = async (
    ckToken: string,
    preIssueHook?: string
  ): Promise<string> => {
    const transactionObject = await this.contract.initialize(
      ckToken,
      preIssueHook || ZERO_ADDRESS,
      {
        value: "0x0",
      }
    );
    logger.log(`initialize transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  /**
   * Issue quantity to ckToken
   */
  issue = async (
    ckToken: string,
    quantity: BigNumber,
    to: string
  ): Promise<string> => {
    const transactionObject = await this.contract.issue(ckToken, quantity, to);
    logger.log(`Issue transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  /**
   * Issue quantity to ckToken
   */
  redeem = async (
    ckToken: string,
    quantity: BigNumber,
    to: string
  ): Promise<string> => {
    const transactionObject = await this.contract.redeem(ckToken, quantity, to);
    logger.log(`Redeem transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  getRequiredComponentUnitsForIssue = async (
    ckToken: string,
    quantity: BigNumber
  ): Promise<any[]> => {
    return this.contract.getRequiredComponentUnitsForIssue(ckToken, quantity);
  };
}

export { IssuanceService };
