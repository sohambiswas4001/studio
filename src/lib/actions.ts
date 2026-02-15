'use server';

import { generateDrawingWord, type GenerateDrawingWordInput } from '@/ai/flows/generate-drawing-word';

export async function getNewWordAction(input: GenerateDrawingWordInput) {
  try {
    const result = await generateDrawingWord(input);
    return { success: true, words: result.words };
  } catch (error) {
    console.error('Error generating words:', error);
    return { success: false, error: 'Failed to generate new words.' };
  }
}
