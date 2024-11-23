import express from 'express';
import dotenv from 'dotenv'; // For environment variables
import OpenAI from 'openai'; 

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI instance with the API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Access the OpenAI API key from process.env
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error during API request:", error);
    res.status(500).send("Error processing the request.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
