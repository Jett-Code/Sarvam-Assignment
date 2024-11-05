import axios from 'axios';

export class TogetherAI {
  constructor() {
    this.apiKey = process.env.TOGETHER_API_KEY;
    this.baseURL = 'https://api.together.xyz/v1';
    this.model = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo';
  }

  async getResponse(messages) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`LLM API error: ${error.message}`);
    }
  }
}
