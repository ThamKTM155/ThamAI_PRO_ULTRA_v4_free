// server.cjs (CommonJS) — Free mode default (no external API calls).
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

// ⭐ FIX: Khai báo biến môi trường tránh lỗi ReferenceError
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

console.log("ThamAI backend starting on port 3000");
console.log("OPENAI_KEY present:", !!OPENAI_KEY);

// Simple rules / fallback for free mode
function simpleReply(user) {
  const u = (user || "").toLowerCase();
  if (!u) return "Bạn chưa nhập gì cả.";
  if (u.includes("xin chào") || u.includes("chào")) return "Chào bạn! Mình là ThamAI (chế độ miễn phí).";
  if (u.includes("giúp") || u.includes("làm")) return "Mình có thể giúp học lập trình, viết nội dung, tạo ý tưởng video, và tán gẫu.";
  return `Echo (miễn phí): ${user}`;
}

// Optional: call OpenAI ChatCompletion if OPENAI_KEY set
async function callOpenAI(message) {
  try {
    if (!OPENAI_KEY) return null;
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là ThamAI — trợ lý thân thiện, trả lời ngắn gọn khi cần." },
        { role: "user", content: message }
      ],
      max_tokens: 512
    };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const t = await res.text().catch(()=>"");
      console.error("OpenAI chat error", res.status, t);
      return null;
    }
    const j = await res.json();
    const reply = j?.choices?.[0]?.message?.content || j?.choices?.[0]?.text || null;
    return reply;
  } catch (e) {
    console.error("callOpenAI error", e);
    return null;
  }
}

// POST /chat
app.post("/chat", async (req, res) => {
  try {
    const message = (req.body && req.body.message) || "";
    if (!message) return res.status(400).json({ error: "Missing message" });

    let reply = null;
    if (OPENAI_KEY) {
      reply = await callOpenAI(message);
    }
    if (!reply) reply = simpleReply(message);

    return res.json({ reply, audio_base64: null });
  } catch (err) {
    console.error("chat handler err:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Health
app.get("/", (req, res) => res.json({ status: "ok", mode: OPENAI_KEY ? "openai" : "free" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ThamAI backend listening on ${PORT}`));
