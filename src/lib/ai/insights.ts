import OpenAI from "openai";
import type { InsightData, SavingsOpportunity, Insight } from "@/types/insights";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export interface CategorySpend {
  name: string
  spent: number
  budget: number | null
  icon: string
  color: string
}

export interface TopTransaction {
  description: string
  amount: number
  category_name: string | null
  date: string
}

export interface InsightPromptData {
  month: {
    name: string
    year: number
    daysInMonth: number
    daysElapsed: number
  }
  currency: string
  income: {
    total: number
    sources: { description: string; amount: number }[]
  }
  spending: {
    total: number
    budget: number
    byCategory: CategorySpend[]
  }
  topTransactions: TopTransaction[]
  previousMonth: {
    total: number
    byCategory: Record<string, number>
  }
}

export function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Builds the system and user prompts for the DeepSeek insight generation.
 */
export function buildInsightPrompt(data: InsightPromptData): {
  system: string
  user: string
} {

  const systemPrompt = `You are Flo, an AI financial assistant integrated into a personal finance tracker. Your role is to analyze the user's monthly spending data and provide clear, actionable, and personalized financial insights.

## Your Task
Analyze the provided financial data for the given month and generate a comprehensive insight report. Your analysis should be practical, specific to the user's data, and help them make informed financial decisions.

## Output Format
You MUST respond with a valid JSON object (no markdown wrapping, no \`\`\`json blocks). The JSON must exactly match this TypeScript type:

{
  "summary": "A 2-3 sentence narrative summary of the user's financial month. Start with their name placeholder if available. Tone: encouraging but honest. Mention the total spent vs income or budget.",
  "insights": [
    {
      "type": "warning" | "success" | "tip" | "neutral",
      "title": "A short, punchy title (max 60 chars)",
      "body": "Expanded explanation with specific numbers from the user's data. 1-3 sentences.",
      "category": "The category name this relates to, or null if general",
      "amount": null or a specific amount in PHP
    }
  ],
  "savingsOpportunity": {
    "amount": "A specific amount the user could save based on patterns found",
    "tip": "A specific, actionable saving tip based on their actual spending patterns"
  },
  "nextMonthForecast": "A 1-2 sentence prediction for next month based on current trajectory, with one specific recommendation"
}

## Type Usage Guidelines

- **warning**: Use when the user is overspending in a category, spending significantly more than last month, or approaching budget limits. Examples: "Dining out spending is up 40% this month", "You've already used 85% of your entertainment budget with 10 days left."
- **success**: Use when the user is under budget, saving more than usual, or showing positive financial behavior. Examples: "You're under budget on groceries this month!", "You've saved 15% more than last month."
- **tip**: Use for general improvement suggestions based on patterns. Examples: "Consider meal prepping to reduce dining out costs", "Your subscription services total ₱1,200/month — review if you're using them all."
- **neutral**: Use for interesting observations that aren't clearly positive or negative. Examples: "Your spending patterns are consistent with last month", "You made 23 transactions this month, averaging ₱450 per transaction."

## Category Breakdown Format
When referencing specific categories in your insights, use the exact category name from the data. Reference budget status (over/under) when applicable.`;

  // Build user message with data
  const monthName = data.month.name;
  const year = data.month.year;
  const daysInMonth = data.month.daysInMonth;
  const daysElapsed = data.month.daysElapsed;

  // Format spending by category
  const categoryBreakdownLines = data.spending.byCategory.map((cat) => {
    const budgetStr = cat.budget !== null ? formatPeso(cat.budget) : "No budget";
    const diffStr =
      cat.budget !== null
        ? cat.spent > cat.budget
          ? `⚠️ Over by ${formatPeso(cat.spent - cat.budget)}`
          : `✅ Under budget`
        : "";
    return `${cat.name.padEnd(15)} | ${formatPeso(cat.spent).padStart(8)} | ${budgetStr.padStart(8)} | ${diffStr}`;
  });

  // Format top transactions
  const topTransactionsLines = data.topTransactions.map((t) => {
    const date = new Date(t.date);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    return `${t.description.padEnd(25)} | ${formatPeso(t.amount).padStart(8)} | ${(t.category_name ?? "Uncategorized").padEnd(15)} | ${formattedDate}`;
  });

  // Format income sources
  const incomeSourcesLines = data.income.sources.map(
    (s) => `${s.description.padEnd(25)} | ${formatPeso(s.amount).padStart(8)}`
  );

  const userMessage = `Generate a financial insight report for ${monthName} ${year}.

## Month Information
- Month: ${monthName} ${year}
- Days in month: ${daysInMonth}
- Days elapsed so far: ${daysElapsed}
- Currency: ${data.currency}

## Income
Total Income: ${formatPeso(data.income.total)}
Sources:
${incomeSourcesLines.length > 0 ? incomeSourcesLines.join("\n") : "No income recorded yet."}

## Spending Summary
Total Spent: ${formatPeso(data.spending.total)}
Total Budget: ${formatPeso(data.spending.budget)}
${data.spending.budget > 0 ? `Remaining: ${formatPeso(data.spending.budget - data.spending.total)}` : ""}

## Category Breakdown
\`\`\`
Category         | Spent     | Budget    | Status
${categoryBreakdownLines.join("\n")}
\`\`\`

## Top Expenses This Month
\`\`\`
Description                | Amount    | Category        | Date
${topTransactionsLines.join("\n")}
\`\`\`

## Previous Month Comparison
Last month total spending: ${formatPeso(data.previousMonth.total)}
${data.previousMonth.total > 0 ? `Change: ${data.spending.total > data.previousMonth.total ? "↑ Increase" : "↓ Decrease"} of ${formatPeso(Math.abs(data.spending.total - data.previousMonth.total))}` : "No previous month data available."}

Generate the insight report as a valid JSON object following the specified format.`;

  return {
    system: systemPrompt,
    user: userMessage,
  };
}

/**
 * Calls DeepSeek API with streaming to generate insights.
 * Returns a ReadableStream that the API route can pipe to the client.
 */
export async function generateInsightStream(
  promptData: InsightPromptData
): Promise<ReadableStream> {
  const { system, user } = buildInsightPrompt(promptData);

  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
      stream: true,
    });

    // Convert the async iterable to a ReadableStream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
        } catch (error) {
          console.error("DeepSeek stream error:", error);
          controller.error(error);
        }
      },
    });

    return stream;
  } catch (error) {
    console.error("DeepSeek API call failed:", error);
    throw new Error("Failed to generate insight from AI provider");
  }
}

/**
 * Parses a raw JSON string from DeepSeek into a typed InsightData object.
 * Validates the structure and throws if anything is missing.
 */
export function parseInsightResponse(rawJson: string): InsightData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error("Invalid AI response format");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid insight structure");
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.summary !== "string") {
    throw new Error("Invalid insight structure");
  }

  if (!Array.isArray(obj.insights)) {
    throw new Error("Invalid insight structure");
  }

  for (const insight of obj.insights) {
    if (
      typeof insight !== "object" ||
      insight === null ||
      typeof (insight as Record<string, unknown>).type !== "string" ||
      typeof (insight as Record<string, unknown>).title !== "string" ||
      typeof (insight as Record<string, unknown>).body !== "string"
    ) {
      throw new Error("Invalid insight structure");
    }
  }

  const savings = obj.savingsOpportunity as Record<string, unknown> | undefined;
  if (!savings || typeof savings.amount !== "number" || typeof savings.tip !== "string") {
    throw new Error("Invalid insight structure");
  }

  if (typeof obj.nextMonthForecast !== "string") {
    throw new Error("Invalid insight structure");
  }

  return obj as InsightData;
}