// backend/config.cjs
const path = require("path");

module.exports = {
  app: {
    name: "ThamAI v5 FINAL",
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "production"
  },

  api: {
    openaiKey: process.env.OPENAI_API_KEY || "",
    openrouterKey: process.env.OPENROUTER_KEY || ""
  },

  limits: {
    maxBodySize: "1mb",
    maxTokens: 512,
    streamChunkSize: 60,
    streamDelayMs: 50
  },

  paths: {
    dataDir: path.join(__dirname, "data"),
    chatsFile: path.join(__dirname, "data", "chats.json")
  }
};
