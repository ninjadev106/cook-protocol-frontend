import { ABIs } from "abi";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::MDexFactory");

const abi = ABIs.mdexFactory;

class MDexFactoryService {
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
      this.contract = new ethers.Contract(tokenAddress, abi, provider).connect(
        signer
      );
    } else {
      this.contract = new ethers.Contract(tokenAddress, abi, provider);
    }
  }

  get address(): string {
    return this.contract.address;
  }

  /**
   * reserve0: BigNumber;
   * reserve1: BigNumber;
   * blockTimestamp: number;
   */
  getReserves = async (tokenA: string, tokenB: string): Promise<any> => {
    return this.contract.getReserves(tokenA, tokenB);
  };

  getAmountIn = async (
    amountOut: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber
  ): Promise<BigNumber> => {
    return this.contract.getAmountIn(amountOut, reserveIn, reserveOut);
  };

  getAmountOut = async (
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber
  ): Promise<BigNumber> => {
    return this.contract.getAmountOut(amountIn, reserveIn, reserveOut);
  };
}

export { MDexFactoryService };
