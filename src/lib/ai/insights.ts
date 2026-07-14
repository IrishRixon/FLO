import OpenAI from "openai";
import type { InsightData, SavingsOpportunity, Insight } from "@/types/insights";

let deepseekClient: OpenAI | null = null;

function getDeepSeekClient(): OpenAI {
  if (!deepseekClient) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY environment variable is missing or empty");
    }
    deepseekClient = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey,
    });
  }
  return deepseekClient;
}

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
    monthlySpendingLimit: number
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
You MUST STRICTLY respond with a valid JSON object (no markdown wrapping, no \`\`\`json blocks). The JSON must exactly match this TypeScript type:

{
  "summary": "A 3-4 sentence narrative summary of the user's financial month. ...",
  "insights": [
    {
      "type": "warning" | "success" | "tip" | "neutral",
      "title": "A short, punchy title (max 60 chars)",
      "body": "Expanded explanation with specific numbers. 1-3 sentences.",
      "category": "The category name this relates to, or null if general",
      "amount": null or a specific number in PHP
    }
  ],
  "savingsOpportunity": {
    "amount": "A specific amount the user could save based on patterns found make sure it is a number only but make sure it is a number type, not a string",
    "tip": "A specific, actionable saving tip based on their actual spending patterns"
  },
  "nextMonthForecast": "A 1-2 sentence prediction for next month ..."
}

## CRITICAL JSON RULES (MUST FOLLOW):
1. The "amount" in savingsOpportunity MUST be a NUMBER, not a string. Example: "amount": 1200 (no quotes around the number).
2. The "amount" field in each insight item must be either null or a NUMBER, not a string.
3. If a string value contains double-quote characters (e.g., in a quote like "treating yourself"), you MUST escape them with a backslash: \\"treating yourself\\".
4. Do NOT use smart/curly quotes ("" or '') — always use straight ASCII quotes.
5. Do NOT include any trailing commas after the last item in an array or object.
6. Make sure every opening { or [ has a matching closing } or ].
7. Make sure every string value has both opening and closing double quotes.

## Type Usage Guidelines

- **warning**: Use when the user is overspending in a category, spending significantly more than last month, or approaching budget limits. Examples: 'Dining out spending is up 40% this month', 'You've already used 85% of your entertainment budget with 10 days left.'
- **success**: Use when the user is under budget, saving more than usual, or showing positive financial behavior. Examples: 'You're under budget on groceries this month!', 'You've saved 15% more than last month.'
- **tip**: Use for general improvement suggestions based on patterns. Examples: 'Consider meal prepping to reduce dining out costs', 'Your subscription services total ₱1,200/month — review if you're using them all.'
- **neutral**: Use for interesting observations that aren't clearly positive or negative. Examples: 'Your spending patterns are consistent with last month', 'You made 23 transactions this month, averaging ₱450 per transaction.'

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
- Monthly Spending Limit: ${formatPeso(data.month.monthlySpendingLimit)}

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
    const response = await getDeepSeekClient().chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 2000,
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
 * Cleans common JSON formatting issues from the AI response before parsing.
 * Fixes unescaped quotes, trailing commas, smart quotes, etc.
 */
export function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();

  // Strip any markdown code block fences if the AI wrapped in ```json ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  // Replace smart/curly quotes with straight quotes
  cleaned = cleaned.replace(/[\u201C\u201D]/g, '"');
  cleaned = cleaned.replace(/[\u2018\u2019]/g, "'");

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  // Try to fix unescaped double quotes inside string values.
  // This is a best-effort heuristic: find patterns where a quote appears mid-word
  // and replace it with escaped quote.
  // Pattern: inside a string value (between ":" and next "," or "}"), find stray quotes
  // that are NOT preceded by a backslash and are NOT at string boundaries.
  // We do a simple approach: match quoted strings and try to balance them.
  
  return cleaned;
}

/**
 * Attempts to fix unescaped double quotes within JSON string values.
 * This handles cases where the AI outputs something like:
 *   "body": "You're "treating yourself" too much"
 * where the quotes around "treating yourself" break the JSON.
 */
export function repairUnescapedQuotes(raw: string): string {
  // Strategy: go character by character, track whether we're inside a string value.
  // When we find a double quote inside a string that looks like it's mid-content
  // (preceded by alphanumeric or punctuation, not by , : or [ {), escape it.
  
  let result = "";
  let inString = false;
  let escaped = false;
  
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    const prevChar = i > 0 ? raw[i - 1] : "";
    const nextChar = i < raw.length - 1 ? raw[i + 1] : "";
    
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    
    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }
    
    if (char === '"') {
      if (!inString) {
        // Opening quote
        inString = true;
        result += char;
      } else {
        // Potential closing quote or unescaped inner quote
        // Check context: if next non-whitespace char is , ] } or end of string, it's a closing quote
        const afterTrim = raw.slice(i + 1).trimStart();
        if (afterTrim.startsWith(",") || afterTrim.startsWith("]") || afterTrim.startsWith("}") || afterTrim.length === 0) {
          // This is a closing quote
          inString = false;
          result += char;
        } else if (/[\w\s.!?;:\-–—]/.test(nextChar)) {
          // Quote is followed by word characters — likely an unescaped inner quote
          result += "\\" + char;
        } else {
          // Could be closing or other, treat as closing
          inString = false;
          result += char;
        }
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * Tries to extract a valid JSON object from a string that may have 
 * extra content before/after the JSON.
 */
export function extractJsonObject(raw: string): string {
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return raw;
  }
  
  return raw.slice(firstBrace, lastBrace + 1);
}

/**
 * Parses a raw JSON string from DeepSeek into a typed InsightData object.
 * Attempts multiple repair strategies before giving up.
 */
export function parseInsightResponse(rawJson: string): InsightData {
  // Strategy 1: Try direct parse
  try {
    const parsed = JSON.parse(rawJson);
    return validateInsightData(parsed);
  } catch {
    // Fall through to repair strategies
  }
  
  // Strategy 2: Clean and try again
  let cleaned = cleanJsonString(rawJson);
  try {
    const parsed = JSON.parse(cleaned);
    return validateInsightData(parsed);
  } catch {
    // Fall through
  }
  
  // Strategy 3: Repair unescaped quotes
  const repaired = repairUnescapedQuotes(cleaned);
  try {
    const parsed = JSON.parse(repaired);
    return validateInsightData(parsed);
  } catch {
    // Fall through
  }
  
  // Strategy 4: Extract JSON object from surrounding text
  const extracted = extractJsonObject(repaired);
  try {
    const parsed = JSON.parse(extracted);
    return validateInsightData(parsed);
  } catch {
    // Fall through
  }
  
  // Strategy 5: Extract then repair again
  const extractedRepaired = repairUnescapedQuotes(extractJsonObject(cleaned));
  try {
    const parsed = JSON.parse(extractedRepaired);
    return validateInsightData(parsed);
  } catch {
    // Fall through
  }
  
  // All strategies failed — throw a descriptive error
  throw new Error(
    `Invalid AI response format. Received ${rawJson.length} chars. ` +
    `First 200 chars: ${rawJson.slice(0, 200)}`
  );
}

/**
 * Validates that a parsed object conforms to InsightData structure.
 * Returns the typed data if valid, throws otherwise.
 */
function validateInsightData(parsed: unknown): InsightData {
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
  if (!savings || typeof savings.tip !== "string") {
    throw new Error("Invalid insight structure");
  }
  
  // Coerce amount to number if it came as a string
  if (typeof savings.amount === "string") {
    const parsedAmount = parseFloat(savings.amount.replace(/[^0-9.-]/g, ""));
    if (!isNaN(parsedAmount)) {
      savings.amount = parsedAmount;
    }
  }
  
  if (typeof savings.amount !== "number") {
    throw new Error("Invalid insight structure");
  }

  if (typeof obj.nextMonthForecast !== "string") {
    throw new Error("Invalid insight structure");
  }

  return obj as InsightData;
}