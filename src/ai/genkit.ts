import {genkit} from 'genkit';
import {googleAI} from '@gen-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY environment variable not found. Please create a .env.local file and add your API key.'
    );
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash-latest',
});
