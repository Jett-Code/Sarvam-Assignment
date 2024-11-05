import { TogetherAI } from './services/together-ai.js';
import { CryptoService } from './services/crypto-service.js';
import { TranslationService } from './services/translation-service.js';
import NodeCache from 'node-cache';

export class CryptoAgent {
  constructor() {
    this.llm = new TogetherAI();
    this.cryptoService = new CryptoService();
    this.translationService = new TranslationService();
    this.cache = new NodeCache({ stdTTL: 5 }); // Cache for 5 seconds
    this.context = [];
    this.outputLanguage = 'english';
  }

  async setLanguage(language) {
    this.outputLanguage = language.toLowerCase();
    return `Output language set to ${language}`;
  }

  async processMessage(message) {
    try {
      // Detect if message is in another language and translate to English
      const translatedMessage = await this.translationService.translateToEnglish(message);

      // Check if it's a language change request
      const languageMatch = translatedMessage.match(/(?:change|set|switch)(?:\s+the)?\s+language\s+to\s+(\w+)/i);
      if (languageMatch) {
        return this.setLanguage(languageMatch[1]);
      }

      // Check if message contains crypto price request
      if (this.isCryptoPriceRequest(translatedMessage)) {
        const priceData = await this.getCryptoPriceData();
        const currentBtcPrice = priceData.bitcoin.inr;

        
        this.context = [
          {
            role: 'system',
            content: `You are a helpful cryptocurrency assistant. The current Bitcoin price is ${currentBtcPrice} INR. Always reference this current price when discussing Bitcoin or cryptocurrency prices.`,
          },
          {
            role: 'user',
            content: translatedMessage,
          },
        ];
      } else {
        // For non-price queries send as it is
        this.context.push({ role: 'user', content: translatedMessage });
      }

      const response = await this.llm.getResponse(this.context);
      this.context.push({ role: 'assistant', content: response });
      
      if (this.context.length > 10) {
        this.context = this.context.slice(-10);
      }

      // Translate
      if (this.outputLanguage !== 'english') {
        return await this.translationService.translate(response, this.outputLanguage);
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to process message: ${error.message}`);
    }
  }

  isCryptoPriceRequest(message) {
    const priceKeywords = ['price', 'bitcoin', 'btc', 'crypto', 'cost', 'value'];
    return priceKeywords.some((keyword) => message.toLowerCase().includes(keyword));
  }

  async getCryptoPriceData() {
    const cacheKey = 'crypto_prices';
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const priceData = await this.cryptoService.getPrices();
    this.cache.set(cacheKey, priceData);
    return priceData;
  }
}