'use server';

import { generateDrawingWord, type GenerateDrawingWordInput } from '@/ai/flows/generate-drawing-word';

export async function getNewWordAction(input: GenerateDrawingWordInput) {
  try {
    const result = await generateDrawingWord(input);
    return { success: true, word: result.word };
  } catch (error) {
    console.error('Error generating word:', error);
    return { success: false, error: 'Failed to generate a new word.' };
  }
}
