const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const config = require("./config.cjs");
const { getReply } = require("./services/llm.cjs");
const { saveChat } = require("./services/history.cjs");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

const PORT = config.PORT;

console.log("🚀 ThamAI v5 backend starting on port", PORT);

/* ---------- /chat ---------- */
app.post("/chat", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "Missing message" });

    const reply = await getReply(message);

    saveChat("user", message);
    saveChat("ai", reply);

    res.json({ reply });
  } catch (e) {
    console.error("chat error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- /chat-stream ---------- */
app.post("/chat-stream", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();
    if (!message) return res.status(400).end("Missing message");

    const reply = await getReply(message);

    saveChat("user", message);
    saveChat("ai", reply);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");

    for (let i = 0; i < reply.length; i += 60) {
      res.write(reply.slice(i, i + 60));
      await new Promise(r => setTimeout(r, 40));
    }
    res.end();
  } catch (e) {
    console.error("chat-stream error:", e);
    res.status(500).end("ERROR");
  }
});

/* ---------- health ---------- */
app.get("/", (_, res) => {
  res.json({ status: "ok", version: "ThamAI v5 FINAL" });
});

app.listen(PORT, () => {
  console.log(`✅ ThamAI v5 backend listening on ${PORT}`);
});
