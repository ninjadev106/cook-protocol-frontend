import { RateLimit } from "async-sema";
import axios from "axios";

class CoingeckoService {
  private readonly _rateLimit: () => Promise<void>;
  constructor() {
    this._rateLimit = RateLimit(10);
  }

  async getData(endPoint: string) {
    await this._rateLimit();
    return axios.get(endPoint);
  }
}

let coingeckoService: CoingeckoService;

export const getCoingeckoService = () => {
  if (!coingeckoService) {
    coingeckoService = new CoingeckoService();
  }
  return coingeckoService;
};
