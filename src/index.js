import dotenv from 'dotenv';
import { CryptoAgent } from './agent.js';
import { createInterface } from 'readline';

dotenv.config();

const agent = new CryptoAgent();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Crypto AI Agent started. Enter "exit" to quit.');

const chat = () => {
  rl.question('You: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const response = await agent.processMessage(input);
      console.log('Agent:', response);
    } catch (error) {
      console.error('Error:', error.message);
    }

    chat();
  });
};

chat();
