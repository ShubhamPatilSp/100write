import { NextResponse } from 'next/server';
import { getModel } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { prompt, purpose = 'Essay', level = 'Middle School', words = 430, topics = [] } = await req.json();

    const instructions = `You are a professional content creator. Create a detailed outline for a ${purpose} at a ${level} level, targeting approximately ${words} words total.

Guidelines:
- Create 3-5 main sections with clear, descriptive titles
- Each section should have a specific word count that adds up to ~${words} words total
- Include 2-4 key points under each section
- Ensure logical flow and progression of ideas
- Use clear, concise language
- Maintain consistent formatting

Format Requirements:
- Return ONLY valid JSON array
- Each item must have: {"title": string, "words": number, "content": string}
- "title": Section title (1-7 words)
- "words": Target word count for this section
- "content": 2-4 key points as a single string, each point on a new line with "- " prefix

${topics?.length ? `Focus Areas: ${topics.join(', ')}` : ''}

Topic: ${prompt || 'General topic'}`;

        const model = getModel('gemini-1.5-flash', {
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      ]
    });
    const result = await model.generateContent(instructions);
    const raw = result.response.text();

    let outline = [];
    try {
      // First try to parse the raw response
      outline = JSON.parse(raw);
      
      // Validate the parsed outline structure
      if (!Array.isArray(outline) || !outline.length) {
        throw new Error('Invalid outline format');
      }
      
      // Ensure each section has required fields and proper formatting
      outline = outline.map(section => ({
        title: section?.title?.trim() || 'Untitled Section',
        words: Number.isInteger(section?.words) ? section.words : Math.round(words / (outline.length || 3)),
        content: (section?.content || '').replace(/^\s*[-•*]\s*/gm, '- ').trim()
      }));
      
      // Ensure word counts add up to approximately the target
      const totalWords = outline.reduce((sum, sec) => sum + (sec.words || 0), 0);
      if (totalWords === 0) {
        // If no word counts were provided, distribute them evenly
        const wordsPerSection = Math.round(words / outline.length);
        outline = outline.map(sec => ({
          ...sec,
          words: wordsPerSection
        }));
      } else if (Math.abs(totalWords - words) > words * 0.5) {
        // If word counts are way off, normalize them
        const factor = words / Math.max(1, totalWords);
        outline = outline.map(sec => ({
          ...sec,
          words: Math.round(sec.words * factor)
        }));
      }
      
    } catch (e) {
      console.error('Error parsing outline:', e);
      // Fallback outline if parsing fails
      outline = [
        { 
          title: 'Introduction', 
          words: Math.round(words * 0.2), 
          content: '- Hook/Attention Grabber\n- Background Information\n- Thesis Statement' 
        },
        { 
          title: 'Main Content Section 1', 
          words: Math.round(words * 0.3), 
          content: '- Main Point 1\n- Supporting Evidence\n- Analysis/Explanation' 
        },
        { 
          title: 'Main Content Section 2', 
          words: Math.round(words * 0.3), 
          content: '- Main Point 2\n- Supporting Evidence\n- Analysis/Explanation' 
        },
        { 
          title: 'Conclusion', 
          words: Math.round(words * 0.2), 
          content: '- Restate Thesis\n- Summary of Main Points\n- Final Thoughts/Call to Action' 
        },
      ];
    }

    outline = outline.map((s) => ({
      ...s,
      aiDetected: /paradigm|synergy|utilize|leverag(e|ing)/i.test(s.content || ''),
    }));

    return NextResponse.json({ outline });
  } catch (e) {
    console.error('AI outline generation error:', e);
    return NextResponse.json({ error: 'Failed to generate outline', details: e.message }, { status: 500 });
  }
}