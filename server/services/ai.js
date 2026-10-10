const fs = require('fs');
const path = require('path');

const LANGUAGES = { en: 'English', ta: 'Tamil', hi: 'Hindi', te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', bn: 'Bengali', mr: 'Marathi' };
const CATEGORIES = ['Textiles', 'Pottery', 'Jewelry', 'Woodwork', 'Metalwork', 'Paintings', 'Basketry', 'Leather', 'Home Decor', 'Other'];

function fallback({ title, materials, category, languages }) {
  const descriptions = {};
  languages.forEach((l) => {
    descriptions[l] = `${title} is a handmade ${category.toLowerCase()} piece${materials ? ` crafted from ${materials}` : ''}. Each item is made by hand by a skilled artisan, so no two are exactly alike.${l !== 'en' ? ' (Add an ANTHROPIC_API_KEY to get a real ' + LANGUAGES[l] + ' translation.)' : ''}`;
  });
  const keywords = [title, category, materials, 'handmade', 'artisan', 'handcrafted']
    .filter(Boolean).flatMap((s) => s.toLowerCase().split(/[,\s]+/)).filter((w) => w.length > 2);
  return { descriptions, keywords: [...new Set(keywords)].slice(0, 10), category, source: 'fallback' };
}

exports.generate = async ({ title, materials = '', category = '', notes = '', languages = ['en'], imagePath }) => {
  languages = languages.filter((l) => LANGUAGES[l]);
  if (!languages.length) languages = ['en'];
  if (!process.env.ANTHROPIC_API_KEY) return fallback({ title, materials, category: category || 'Other', languages });

  const content = [];
  if (imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const media = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    content.push({ type: 'image', source: { type: 'base64', media_type: media, data: fs.readFileSync(imagePath).toString('base64') } });
  }
  content.push({
    type: 'text',
    text: `You write product listings for handmade crafts sold by independent artisans.
Product title: ${title}
Materials: ${materials || 'not given'}
Category hint: ${category || 'not given'}
Artisan notes: ${notes || 'none'}

Return ONLY valid JSON (no markdown) in this exact shape:
{"category": one of ${JSON.stringify(CATEGORIES)},
 "keywords": [8 to 10 short lowercase search keywords in English],
 "descriptions": {${languages.map((l) => `"${l}": "..."`).join(', ')}}}
Each description: 2-3 warm, honest sentences (60-90 words) covering look, materials, craft technique and use. Do not invent facts that are not given or visible. Write the descriptions in these languages in order: ${languages.map((l) => `${l}=${LANGUAGES[l]}`).join(', ')}, using each language's native script.`,
  });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 1500, messages: [{ role: 'user', content }] }),
  });
  if (!res.ok) throw new Error(`AI service error (${res.status})`);
  const data = await res.json();
  const text = data.content.filter((b) => b.type === 'text').map((b) => b.text).join('').replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(text);
  return {
    descriptions: parsed.descriptions,
    keywords: parsed.keywords || [],
    category: CATEGORIES.includes(parsed.category) ? parsed.category : category || 'Other',
    source: 'ai',
  };
};

exports.LANGUAGES = LANGUAGES;
exports.CATEGORIES = CATEGORIES;
