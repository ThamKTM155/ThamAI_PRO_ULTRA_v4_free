// backend/server.cjs
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const config = require("./config.cjs");
const { getReply } = require("./services/llm.cjs");
const { saveChat } = require("./services/history.cjs");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: config.limits.maxBodySize }));

const PORT = config.app.port;

console.log("🚀 ThamAI v5 backend starting");
console.log("• Port:", PORT);
console.log("• Env :", config.app.env);

/* ---------- /chat (NON-STREAM) ---------- */
app.post("/chat", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();
    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const reply = await getReply(message);

    saveChat("user", message);
    saveChat("ai", reply);

    res.json({ reply });
  } catch (err) {
    console.error("❌ /chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- /chat-stream (MAIN) ---------- */
app.post("/chat-stream", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();
    if (!message) {
      return res.status(400).end("Missing message");
    }

    const reply = await getReply(message);

    saveChat("user", message);
    saveChat("ai", reply);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");

    const chunkSize = config.limits.streamChunkSize;
    const delayMs = config.limits.streamDelayMs;

    for (let i = 0; i < reply.length; i += chunkSize) {
      res.write(reply.slice(i, i + chunkSize));
      await new Promise(r => setTimeout(r, delayMs));
    }

    res.end();
  } catch (err) {
    console.error("❌ /chat-stream error:", err);
    res.status(500).end("ERROR");
  }
});

/* ---------- health ---------- */
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    name: config.app.name,
    version: "v5 FINAL"
  });
});

app.listen(PORT, () => {
  console.log(`✅ ThamAI v5 backend listening on ${PORT}`);
});
