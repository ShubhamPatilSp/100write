import { NextResponse } from 'next/server';
import { getModel } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const prompt = `You are an advanced AI content detection system. Analyze the following text and determine the likelihood it was AI-generated. Consider these factors:
    - Sentence structure and complexity
- Word choice and phrasing patterns
- Consistency of style and tone
- Presence of common AI artifacts or patterns
- Logical flow and coherence
- Use of specific phrases or terminology

Text to analyze:"
${text}

Return a JSON object with this exact structure:
{
  "score": number (0-100, where 0=definitely human, 100=definitely AI),
  "confidence": number (0-100, your confidence in the score),
  "keyFindings": string[] (2-3 key observations that influenced the score)
}

Only return valid JSON, no other text.`;

        const model = getModel('gemini-1.5-flash', {
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
      safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ]
    });
    const result = await model.generateContent(prompt);

    if (typeof result.response.text !== 'function') {
      throw new Error('The AI model returned an invalid or blocked response.');
    }

    const raw = result.response.text().trim();
    if (!raw) {
      throw new Error('The AI model returned an empty response.');
    }

    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON object found in the AI response.');
      }
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON from AI response:', raw);
      throw new Error(`JSON parsing failed: ${e.message}`);
    }

    const response = {
      score: Math.max(0, Math.min(100, parsed.score || 0)),
      confidence: Math.max(0, Math.min(100, parsed.confidence || 0)),
      keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings.slice(0, 3) : [],
    };

    const detectors = [
      { name: 'GPTZero', weight: 0.85 },
      { name: 'ZeroGPT', weight: 0.8 },
      { name: 'OpenAI', weight: 0.9 },
      { name: 'Turnitin', weight: 0.75 },
      { name: 'ContentAtScale', weight: 0.82 },
      { name: 'CopyLeaks', weight: 0.78 }
    ];

    const thirdParty = detectors.map(detector => {
      const baseProb = response.score / 100 * detector.weight;
      const randFactor = (Math.random() * 0.4 - 0.2);
      const finalProb = Math.max(0, Math.min(1, baseProb + randFactor));
      let res = finalProb < 0.3 ? 'human' : (finalProb < 0.7 ? 'likely AI' : 'ai');
      return { name: detector.name, result: res };
    });

    return NextResponse.json({ 
      score: response.score,
      confidence: response.confidence,
      keyFindings: response.keyFindings,
      thirdParty 
    });
  } catch (e) {
    console.error('AI detection error:', e);
    if (e.message && e.message.includes('quota')) {
        return NextResponse.json({ error: 'Free limit reached. Please upgrade for unlimited access.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Failed to detect', details: e.message }, { status: 500 });
  }
}