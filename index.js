import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const STATIC_PATH =  'public';

app.use(cors());
app.use(express.json());
app.use(express.static(STATIC_PATH));

console.log(process.env.GEMINI_API_KEY);

const genAI = new GoogleGenAI({
    apikey: process.env.GEMINI_API_KEY,
});

app.post('/api/chat/', async (req, res) => {
    const { message } = req.body;
    const SYSTEM_INSTRUCTION = `You are a color palette generator assistant. Your sole purpose is to generate a harmonious color palette of 5 colors based on a user-provided color name or hex code.

You MUST respond with a JSON object.

If the input is a valid color, the JSON object must have a "palette" key, which is an array of 5 hex color code strings. The first color in the array should be the user's input color, resolved to its hex code.
Example user input: "forest green"
Example successful response:
{
  "palette": ["#228B22", "#32CD32", "#006400", "#90EE90", "#F0FFF0"]
}

If the user asks for anything other than a color palette, or if the input is not a recognizable color, the JSON object must have an "error" key with a string explaining the issue.
Example error response:
{
  "error": "I can only generate color palettes. Please provide a color name or hex code."
}

Do not add any other text, explanation, or conversation. Only provide the JSON response.`

    if(!message) {
        return res.status(400).json({ reply: 'Message is required.' });
    }

    try {
        const result = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: message,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });

        const text = result.text;
        return res.status(200).json({ reply: text });
    }   catch (err) {
        console.log(err);
        return res.status(500).json({ reply: 'Something went wrong' });
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
