import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for word translation
app.post('/api/translate', async (req, res) => {
  try {
    const { word, context } = req.body;
    if (!word || typeof word !== 'string') {
      return res.status(400).json({ error: 'Word is required' });
    }

    const cleanWord = word.trim().toLowerCase().replace(/[.,!?;:'"()[\]]/g, '');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to free public translation when GEMINI_API_KEY is not configured
      try {
        const freeRes = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=en|id`
        );
        if (freeRes.ok) {
          const freeData = (await freeRes.json()) as any;
          const translatedText = freeData?.responseData?.translatedText;
          if (translatedText && typeof translatedText === 'string') {
            const cleanTranslation = translatedText.toLowerCase().trim();
            return res.json({
              word: cleanWord,
              indonesianTranslation: cleanTranslation,
              partOfSpeech: 'kosa kata teks bacaan',
              contextMeaning: `Arti kata "${cleanWord}" adalah "${cleanTranslation}". Coba pahami perannya dalam kalimat bacaan.`,
              exampleSentence: `Students can learn the meaning of "${cleanWord}" from this passage.`,
              exampleTranslation: `Siswa dapat mempelajari arti "${cleanWord}" dari bacaan ini.`,
              isSingleWord: true,
            });
          }
        }
      } catch (fallbackErr) {
        // Continue to general error below
      }

      return res.status(200).json({
        word: cleanWord,
        indonesianTranslation: `kata "${cleanWord}"`,
        partOfSpeech: 'kata bahasa Inggris',
        contextMeaning: `Kata "${cleanWord}" merupakan kosa kata dalam teks bacaan siswa.`,
        exampleSentence: `We can read the word "${cleanWord}" in our story.`,
        exampleTranslation: `Kita dapat membaca kata "${cleanWord}" dalam cerita kita.`,
        isSingleWord: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Task: Translate this SINGLE English word to Indonesian for a Grade 5 elementary school student (age 10-11).
Word: "${cleanWord}"
Context: ${context || 'Elementary school English reading comprehension passage'}

Respond ONLY with valid JSON in this exact structure:
{
  "word": "${cleanWord}",
  "indonesianTranslation": "terjemahan ringkas bahasa Indonesia",
  "partOfSpeech": "noun / verb / adjective / adverb",
  "contextMeaning": "arti kata dalam 1-2 kalimat sederhana dan ramah anak kelas 5",
  "exampleSentence": "A simple English sentence for Grade 5 elementary school.",
  "exampleTranslation": "Terjemahan bahasa Indonesia dari kalimat contoh tersebut."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 300,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({
        word: cleanWord,
        indonesianTranslation: parsed.indonesianTranslation || cleanWord,
        partOfSpeech: parsed.partOfSpeech || 'kata',
        contextMeaning: parsed.contextMeaning || `Arti kata "${cleanWord}" dalam teks.`,
        exampleSentence: parsed.exampleSentence || `The word "${cleanWord}" is used in our reading text.`,
        exampleTranslation: parsed.exampleTranslation || `Kata "${cleanWord}" digunakan dalam teks bacaan kita.`,
        isSingleWord: true,
      });
    }

    return res.status(500).json({ error: 'Empty response from AI' });
  } catch (error: any) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: error.message || 'Translation failed' });
  }
});

// Vite Middleware for Dev vs Static for Production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
