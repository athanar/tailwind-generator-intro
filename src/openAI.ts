import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: "Your api key",
  dangerouslyAllowBrowser: true,
});