'use server';
/**
 * @fileOverview An AI tool to analyze audit log entries, categorize them, and flag unusual activity patterns.
 *
 * - auditLogInsight - A function that analyzes audit log entries.
 * - AuditLogInsightInput - The input type for the auditLogInsight function.
 * - AuditLogInsightOutput - The return type for the auditLogInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AuditLogInsightInputSchema = z.object({
  auditLogs: z.array(z.string().describe('A single audit log entry string.')).describe('An array of audit log entries to analyze.'),
});
export type AuditLogInsightInput = z.infer<typeof AuditLogInsightInputSchema>;

// Output Schema
const CategorizedLogEntrySchema = z.object({
  logEntry: z.string().describe('The original audit log entry.'),
  category: z.string().describe('The categorized type of the log entry (e.g., "User Login", "Data Access", "Configuration Change", "Permission Update", "System Event", "File System Event", "Network Activity").'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The severity of the log entry, based on potential impact or unusualness.'),
});

const AuditLogInsightOutputSchema = z.object({
  categorizedEntries: z.array(CategorizedLogEntrySchema).describe('A list of audit log entries with their assigned categories and severities.'),
  unusualActivityDetected: z.boolean().describe('True if any unusual or suspicious activity patterns are detected across the provided logs, otherwise false.'),
  unusualActivityDescription: z.string().optional().describe('A detailed explanation of the detected unusual activity, including why it is considered unusual and which logs contributed to the detection.'),
  suggestedActions: z.array(z.string()).optional().describe('A list of recommended steps to investigate or mitigate the identified unusual activity.'),
});
export type AuditLogInsightOutput = z.infer<typeof AuditLogInsightOutputSchema>;

// Wrapper function
export async function auditLogInsight(input: AuditLogInsightInput): Promise<AuditLogInsightOutput> {
  return auditLogInsightFlow(input);
}

// Prompt Definition
const auditLogInsightPrompt = ai.definePrompt({
  name: 'auditLogInsightPrompt',
  input: { schema: AuditLogInsightInputSchema },
  output: { schema: AuditLogInsightOutputSchema },
  prompt: `You are an expert cybersecurity analyst specialized in detecting security incidents and operational anomalies from IT audit logs. Your task is to meticulously review the provided audit log entries.\n\nFor each log entry, you must:\n1. Accurately categorize its event type. Use common categories such as 'User Login', 'Data Access', 'Configuration Change', 'Permission Update', 'System Event', 'File System Event', 'Network Activity', or any other suitable category based on the content.\n2. Assign a severity level: 'Low', 'Medium', 'High', or 'Critical', reflecting its potential impact or unusualness.\n\nAfter analyzing individual entries, you must identify any overarching unusual or suspicious activity patterns across all provided logs. This includes, but is not limited to:\n- Multiple failed login attempts for the same user or different users.\n- Access to sensitive data by unauthorized or unusual users/roles.\n- Rapid or unexpected configuration changes.\n- Unusual network activity (e.g., access from new IP addresses, large data transfers).\n- Privilege escalation attempts.\n\nYour response must strictly adhere to the provided JSON schema. If unusual activity is detected, provide a clear description and actionable suggestions.\n\nAudit Logs to analyze:\n{{#each auditLogs}}\n- {{{this}}}\n{{/each}}`,
});

// Flow Definition
const auditLogInsightFlow = ai.defineFlow(
  {
    name: 'auditLogInsightFlow',
    inputSchema: AuditLogInsightInputSchema,
    outputSchema: AuditLogInsightOutputSchema,
  },
  async (input) => {
    const {output} = await auditLogInsightPrompt(input);
    if (!output) {
      throw new Error('Failed to get output from auditLogInsightPrompt.');
    }
    return output;
  }
);
