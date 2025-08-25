import { NextResponse } from 'next/server';
import { getModel } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const model = getModel();
    const out = await model.generateContent(`Suggest 5 concise research topics as a JSON array of strings for: ${prompt || 'general topic'}`);
    let topics = [];
    try {
      topics = JSON.parse(out.response.text());
    } catch {
      topics = [
        'The impact of online learning on assessment policies',
        'The difference between low carb and low fat diets',
        'How is Google search affecting our intelligence',
        'Should there be laws preventing cyber bullying',
        'How and why have divorce rates changed over time',
      ];
    }
    return NextResponse.json({ topics });
  } catch (e) {
    console.error('AI topic generation error:', e);
    return NextResponse.json({ error: 'Failed to generate topics', details: e.message }, { status: 500 });
  }
}