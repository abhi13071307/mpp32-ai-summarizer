require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.json({
    message: "MPP32 AI Summarizer API Running"
  });
});

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
    Summarize the following text in 2-3 concise sentences:

    ${text}
    `;

    const result = await model.generateContent(prompt);

    res.json({
  success: true,
  summary: result.response.text(),
  timestamp: new Date().toISOString()
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate summary"
    });
  }
});

app.get("/verify", (req, res) => {
  res.json({
    owner: "AK",
    service: "MPP32 AI Summarizer API"
  });
});


app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "MPP32 AI Summarizer API"
  });
});

module.exports = app;