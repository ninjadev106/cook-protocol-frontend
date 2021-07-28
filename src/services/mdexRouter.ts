import { ABIs } from "abi";
import { BigNumber, Contract, Wallet, ethers } from "ethers";
import { Maybe } from "types";
import { getLogger } from "utils/logger";

const logger = getLogger("Services::Controller");

const abi = ABIs.mdexRouter;

class MDexRouterService {
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

  pairFor = async (tokenA: string, tokenB: string): Promise<BigNumber> => {
    return this.contract.pairFor(tokenA, tokenB);
  };

  swapExactTokensForTokens = async (
    amountIn: BigNumber,
    amountOutMin: BigNumber,
    path: string[],
    to: string,
    deadline: BigNumber
  ): Promise<string> => {
    const transactionObject = await this.contract.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline,
      {
        value: "0x0",
      }
    );
    logger.log(
      `swapExactTokensForTokens transaction hash: ${transactionObject.hash}`
    );
    return transactionObject.hash;
  };
}

export { MDexRouterService };
