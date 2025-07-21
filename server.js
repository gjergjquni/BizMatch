import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/evaluate', async (req, res) => {
  const { idea } = req.body;

  const prompt = `
Je një investitor profesional që vlerëson idetë e bizneseve të vogla. Vlerëso këtë ide biznesi nga 1 deri në 10, bazuar në:

1. Potenciali i tregut
2. Krijimtaria e produktit ose shërbimit
3. Sa e realizueshme është me burime të kufizuara

Kthe vetëm një numër të plotë nga 1 deri në 10, pa shpjegim, pa komente.

Ideja:
${idea}
`;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Je një analist i investimeve" },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer sk-0450a8187106499dbcaff4736f6d3f05`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    const score = parseInt(reply) || 5; // Fallback to 5 if parsing fails
    res.json({ score: score * 10 }); // Convert 1-10 to 10-100 scale
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Nuk u bë dot vlerësimi.", score: 50 });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveri në portin ${PORT}`);
}); 