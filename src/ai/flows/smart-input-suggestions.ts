'use server';

/**
 * @fileOverview An AI agent that provides smart suggestions for dental lab data entry.
 *
 * - getSmartSuggestions - A function that generates smart input suggestions.
 * - SmartSuggestionsInput - The input type for the getSmartSuggestions function.
 * - SmartSuggestionsOutput - The return type for the getSmartSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSuggestionsInputSchema = z.object({
  fieldDescription: z.string().describe('Description of the data entry field.'),
  existingData: z.string().describe('Existing data in the field, if any.'),
  contextualInformation: z.string().describe('Any additional context that might be relevant.'),
});
export type SmartSuggestionsInput = z.infer<typeof SmartSuggestionsInputSchema>;

const SmartSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested values for the field.'),
});
export type SmartSuggestionsOutput = z.infer<typeof SmartSuggestionsOutputSchema>;

export async function getSmartSuggestions(input: SmartSuggestionsInput): Promise<SmartSuggestionsOutput> {
  return smartSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSuggestionsPrompt',
  input: {schema: SmartSuggestionsInputSchema},
  output: {schema: SmartSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping dental technicians with data entry in a dental lab management application.

You will provide smart suggestions for completing a data entry field, based on the field's description, any existing data in the field, and any contextual information provided.

The suggestions should be relevant to common dental lab terminology, materials, and procedures.

Field Description: {{{fieldDescription}}}
Existing Data: {{{existingData}}}
Contextual Information: {{{contextualInformation}}}

Suggestions (as a JSON array of strings):`,
});

const smartSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartSuggestionsFlow',
    inputSchema: SmartSuggestionsInputSchema,
    outputSchema: SmartSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
