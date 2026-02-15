'use server';
/**
 * @fileOverview A Genkit flow for generating a drawing word based on game history and player skill.
 *
 * - generateDrawingWord - A function that handles the word generation process.
 * - GenerateDrawingWordInput - The input type for the generateDrawingWord function.
 * - GenerateDrawingWordOutput - The return type for the generateDrawingWord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDrawingWordInputSchema = z.object({
  drawnWords: z.array(z.string()).describe('A list of words that have already been drawn in the current game.'),
  playerSkillLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The drawing skill level of the player for whom the word is being generated.').default('beginner'),
});
export type GenerateDrawingWordInput = z.infer<typeof GenerateDrawingWordInputSchema>;

const GenerateDrawingWordOutputSchema = z.object({
  word: z.string().describe('The word for the player to draw, considering previous words and skill level.'),
});
export type GenerateDrawingWordOutput = z.infer<typeof GenerateDrawingWordOutputSchema>;

export async function generateDrawingWord(input: GenerateDrawingWordInput): Promise<GenerateDrawingWordOutput> {
  return generateDrawingWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDrawingWordPrompt',
  input: {schema: GenerateDrawingWordInputSchema},
  output: {schema: GenerateDrawingWordOutputSchema},
  prompt: `You are a helpful game master for a drawing game. Your task is to generate a single word for a player to draw, and output it in JSON format.
The word must be suitable for a player with a "{{playerSkillLevel}}" skill level.
It is crucial that the generated word has NOT been used before. The words that have already been used are:
{{#if drawnWords}}
{{#each drawnWords}}
- "{{this}}"
{{/each}}
{{else}}
(No words have been drawn yet.)
{{/if}}

Consider the player's skill level:
- For 'beginner', provide common, easy-to-draw objects or concepts (e.g., "apple", "house").
- For 'intermediate', provide slightly more complex objects, actions, or abstract concepts (e.g., "bicycle", "swimming", "happiness").
- For 'advanced', provide challenging or abstract concepts, complex scenes, or specific items (e.g., "constellation", "epiphany", "quantum physics").

Ensure the generated word is unique and challenging appropriately for the given skill level.
Provide only the JSON object, do not add any other text.`
});

const generateDrawingWordFlow = ai.defineFlow(
  {
    name: 'generateDrawingWordFlow',
    inputSchema: GenerateDrawingWordInputSchema,
    outputSchema: GenerateDrawingWordOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
