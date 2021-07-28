import { TransactionReceipt } from "@ethersproject/providers";
import { ABIs } from "abi";
import { BigNumber, Contract, Wallet, ethers, utils } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";
import { isAddress, isContract } from "utils/tools";

const logger = getLogger("Services::Ck");

const ckAbi = ABIs.ck;
class CkService {
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
        ckAbi,
        provider
      ).connect(signer);
    } else {
      this.contract = new ethers.Contract(tokenAddress, ckAbi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  getSymbol = async (): Promise<string> => {
    return this.contract.symbol();
  };

  getName = async (): Promise<string> => {
    return this.contract.name();
  };

  getTotalSupply = async (): Promise<BigNumber> => {
    return this.contract.totalSupply();
  };

  /**
   * @returns A boolean indicating if `spender` has enough allowance to transfer `neededAmount` tokens from `spender`.
   */
  hasEnoughAllowance = async (
    owner: string,
    spender: string,
    neededAmount: BigNumber
  ): Promise<boolean> => {
    const allowance: BigNumber = await this.contract.allowance(owner, spender);
    return allowance.gte(neededAmount);
  };

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return this.contract.allowance(owner, spender);
  };

  /**
   * Approve `spender` to transfer `amount` tokens on behalf of the connected user.
   */
  approve = async (
    spender: string,
    amount: BigNumber
  ): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.approve(spender, amount, {
      value: "0x0",
    });
    logger.log(`Approve transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  approveUnlimited = async (spender: string): Promise<TransactionReceipt> => {
    const transactionObject = await this.contract.approve(
      spender,
      ethers.constants.MaxUint256,
      {
        value: "0x0",
      }
    );
    logger.log(`Approve unlimited transaction hash: ${transactionObject.hash}`);
    return this.provider.waitForTransaction(transactionObject.hash);
  };

  getBalanceOf = async (address: string): Promise<any> => {
    return this.contract.balanceOf(address);
  };

  hasEnoughBalanceToCk = async (
    owner: string,
    amount: BigNumber
  ): Promise<boolean> => {
    const balance: BigNumber = await this.contract.balanceOf(owner);

    return balance.gte(amount);
  };

  isValidErc20 = async (): Promise<boolean> => {
    try {
      if (!isAddress(this.contract.address)) {
        throw new Error("Is not a valid erc20 address");
      }

      if (!isContract(this.provider, this.contract.address)) {
        throw new Error("Is not a valid contract");
      }

      const [decimals, symbol] = await Promise.all([
        this.contract.decimals(),
        this.contract.symbol(),
      ]);

      return !!(decimals && symbol);
    } catch (err) {
      logger.error(err.message);
      return false;
    }
  };

  getModules = async (): Promise<string[]> => {
    return this.contract.getModules();
  };

  getComponents = async (): Promise<string[]> => {
    return this.contract.getComponents();
  };

  /**
   * add module
   */
  addModule = async (_module: string): Promise<string> => {
    const transactionObject = await this.contract.addModule(_module, {
      value: "0x0",
    });
    logger.log(`AddModule transaction hash: ${transactionObject.hash}`);
    return transactionObject.hash;
  };

  static encodeAddModule = (_module: string): string => {
    const iface = new utils.Interface(ckAbi);

    return iface.encodeFunctionData("addModule", [_module]);
  };
}

export { CkService };
