import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

// Initialize DeepSeek via OpenAI-compatible endpoint
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  baseURL: 'https://api.deepseek.com/v1',
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { description, categories } = body as {
      description: string;
      categories: string[];
    };

    if (!description || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'Missing description or categories' },
        { status: 400 }
      );
    }

    // Call DeepSeek with a short, cheap prompt
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `Classify this transaction into one category. Description: "${description}". Categories: ${categories.join(', ')}. Respond with only the category name.`,
        },
      ],
      temperature: 0, // deterministic
      max_tokens: 20, // one-word answer, keep cost minimal
    });

    const category = completion.choices[0]?.message?.content?.trim() ?? null;

    // Validate that the response is actually one of the provided categories
    const validCategory = category && categories.includes(category)
      ? category
      : null;

    return NextResponse.json({ category: validCategory });
  } catch (error) {
    console.error('POST /api/classify error:', error);
    return NextResponse.json(
      { error: 'Classification failed' },
      { status: 500 }
    );
  }
}