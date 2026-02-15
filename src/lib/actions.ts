'use server';

import { generateDrawingWord, type GenerateDrawingWordInput } from '@/ai/flows/generate-drawing-word';

export async function getNewWordAction(input: GenerateDrawingWordInput) {
  try {
    const result = await generateDrawingWord(input);
    return { success: true, words: result.words };
  } catch (error: any) {
    console.error('Error generating words:', error);
    if (error.message && (error.message.includes('API key') || error.message.includes('permission'))) {
        return { success: false, error: 'The AI service requires a valid API key. Please check your configuration.' };
    }
    return { success: false, error: 'An unexpected error occurred while generating words.' };
  }
}
