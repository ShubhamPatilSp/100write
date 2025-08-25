import { NextResponse } from 'next/server';
import { getModel } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { text, strength = 'Strong' } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const system = `You are a professional editor with 20+ years of experience. Your task is to rewrite the provided text to sound completely natural and human-written, while preserving the original meaning and factual accuracy. Follow these guidelines:
    - Vary sentence structure and length for natural flow
- Use active voice and concrete, specific language
- Avoid clichés, jargon, and overused phrases
- Maintain a consistent tone throughout
- Ensure perfect grammar, spelling, and punctuation
- Adapt the formality level based on context
- Keep technical terms when necessary but explain them clearly
- Use contractions naturally
- Add variety in transition words and phrases
- Ensure logical flow between ideas

Strength Level: ${strength} (${strength === 'Light' ? 'minimal changes' : strength === 'Moderate' ? 'balanced approach' : 'thorough humanization'})

Return ONLY the rewritten text, with no additional commentary or formatting.`;
    const prompt = `Original Text:\n${text}`;

        const model = getModel('gemini-1.5-flash', {
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 4096,
      },
      systemInstruction: system,
    });

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    return NextResponse.json({ output });
  } catch (e) {
    console.error('AI humanize error:', e);
    return NextResponse.json({ error: 'Failed to humanize text', details: e.message }, { status: 500 });
  }
}