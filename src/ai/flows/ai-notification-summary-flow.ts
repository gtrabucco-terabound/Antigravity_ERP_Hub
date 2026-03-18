'use server';
/**
 * @fileOverview An AI agent that summarizes unread notifications for a busy user.
 *
 * - summarizeNotifications - A function that handles the notification summarization process.
 * - AINotificationSummaryInput - The input type for the summarizeNotifications function.
 * - AINotificationSummaryOutput - The return type for the summarizeNotifications function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AINotificationSchema = z.object({
  id: z.string().describe('Unique identifier for the notification.'),
  title: z.string().describe('The title of the notification.'),
  body: z.string().describe('The main content or message of the notification.'),
  timestamp: z.string().datetime().describe('The timestamp when the notification was created, in ISO 8601 format.'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('The severity level of the notification.'),
});

const AINotificationSummaryInputSchema = z.object({
  notifications: z.array(AINotificationSchema).describe('A list of unread notifications to be summarized.'),
});
export type AINotificationSummaryInput = z.infer<typeof AINotificationSummaryInputSchema>;

const AINotificationSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, AI-generated summary of the most important updates from the notifications.'),
});
export type AINotificationSummaryOutput = z.infer<typeof AINotificationSummaryOutputSchema>;

export async function summarizeNotifications(input: AINotificationSummaryInput): Promise<AINotificationSummaryOutput> {
  return aiNotificationSummaryFlow(input);
}

const aiNotificationSummaryPrompt = ai.definePrompt({
  name: 'aiNotificationSummaryPrompt',
  input: { schema: AINotificationSummaryInputSchema },
  output: { schema: AINotificationSummaryOutputSchema },
  prompt: `You are an AI assistant tasked with summarizing important notifications for a busy user.
Given a list of notifications, provide a concise summary that highlights the most critical updates and action items.
Prioritize recent and high-impact notifications. The summary should allow the user to quickly grasp the essential information without reading every individual alert.

Notifications:
{{#each notifications}}
- **{{title}}** ({{timestamp}}){{#if severity}} [Severity: {{severity}}]{{/if}}:
  {{{body}}}
{{/each}}

Provide the summary in markdown format.`,
});

const aiNotificationSummaryFlow = ai.defineFlow(
  {
    name: 'aiNotificationSummaryFlow',
    inputSchema: AINotificationSummaryInputSchema,
    outputSchema: AINotificationSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await aiNotificationSummaryPrompt(input);
    return output!;
  }
);
