// src/ai/flows/product-suggestion.ts
'use server';

/**
 * @fileOverview This file implements a Genkit flow for suggesting related products based on a user's search history.
 *
 * @exports suggestProducts - A function that takes a user's search history and returns a list of suggested products.
 * @exports SuggestProductsInput - The input type for the suggestProducts function.
 * @exports SuggestProductsOutput - The output type for the suggestProducts function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestProductsInputSchema = z.object({
  searchHistory: z
    .array(z.string())
    .describe('The user search history, as a list of product names.'),
});

export type SuggestProductsInput = z.infer<typeof SuggestProductsInputSchema>;

const SuggestProductsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested products based on the search history.'),
});

export type SuggestProductsOutput = z.infer<typeof SuggestProductsOutputSchema>;

export async function suggestProducts(input: SuggestProductsInput): Promise<SuggestProductsOutput> {
  return suggestProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productSuggestionPrompt',
  input: {
    schema: z.object({
      searchHistory: z
        .array(z.string())
        .describe('The user search history, as a list of product names.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z
        .array(z.string())
        .describe('A list of suggested products based on the search history.'),
    }),
  },
  prompt: `You are an e-commerce product suggestion expert.

  Based on the user's search history, suggest other products that the user might be interested in. Return a maximum of 5 suggestions.

  Search History:
  {{#each searchHistory}}- {{{this}}}\n{{/each}}

  Suggestions:`,
});

const suggestProductsFlow = ai.defineFlow<
  typeof SuggestProductsInputSchema,
  typeof SuggestProductsOutputSchema
>(
  {
    name: 'suggestProductsFlow',
    inputSchema: SuggestProductsInputSchema,
    outputSchema: SuggestProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
