const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mode: "openrouter",
    model: "free"
  });
});

// Chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "⚠️ Nội dung trống." });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://thamai.onrender.com",
          "X-Title": "ThamAI Free"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content:
                "Bạn là ThamAI, trợ lý AI tiếng Việt, lịch sự, ngắn gọn."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "⚠️ OpenRouter không phản hồi.";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ Backend lỗi khi gọi OpenRouter." });
  }
});

app.listen(PORT, () =>
  console.log("🚀 ThamAI backend running on port " + PORT)
);
