import axios from 'axios';

export class CryptoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
  }

  async getPrices() {
    try {
      const response = await axios.get(
        `${this.baseURL}/simple/price?ids=bitcoin&vs_currencies=inr`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Crypto API error: ${error.message}`);
    }
  }
}
