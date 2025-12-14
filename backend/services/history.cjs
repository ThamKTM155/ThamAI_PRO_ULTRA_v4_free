const fs = require("fs");
const path = require("path");
const { paths } = require("../config.cjs");

function ensureFile() {
  const dir = path.dirname(paths.chatsFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(paths.chatsFile)) {
    fs.writeFileSync(paths.chatsFile, "[]", "utf-8");
  }
}

function saveChat(role, content) {
  try {
    ensureFile();
    const raw = fs.readFileSync(paths.chatsFile, "utf-8");
    const chats = JSON.parse(raw);
    chats.push({
      role,
      content,
      time: new Date().toISOString()
    });
    fs.writeFileSync(paths.chatsFile, JSON.stringify(chats, null, 2));
  } catch (err) {
    console.warn("⚠️ saveChat skipped:", err.message);
  }
}

module.exports = { saveChat };
