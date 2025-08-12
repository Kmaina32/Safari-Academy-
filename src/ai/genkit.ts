import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash-latest',
});
