import axios from 'axios';

export class TranslationService {
  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY;
    this.baseURL = 'https://api.sarvam.ai';
  }

  async translateToEnglish(text) {
    if (this.isEnglish(text)) {
      return text;
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/translate`,
        {
          text: text,
          target_language: 'english',
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      return response.data.translated_text;
    } catch (error) {
      console.warn('Translation failed:', error.message);
      return text;
    }
  }

  async translate(text, targetLanguage) {
    if (targetLanguage === 'english') {
      return text;
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/translate`,
        {
          text: text,
          target_language: targetLanguage,
          model: "mayura:v1"
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      return response.data.translated_text;
    } catch (error) {
      console.warn('Translation failed:', error.message);
      return text;
    }
  }

  isEnglish(text) {
    const englishPattern = /^[A-Za-z0-9\s.,!?-]+$/;
    return englishPattern.test(text);
  }
}