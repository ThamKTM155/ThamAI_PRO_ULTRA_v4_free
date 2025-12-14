const fs = require("fs");
const path = require("path");
const { paths } = require("../config.cjs");

const chatsFile = paths.chatsFile;

function ensureFile() {
  if (!fs.existsSync(chatsFile)) {
    fs.mkdirSync(path.dirname(chatsFile), { recursive: true });
    fs.writeFileSync(
      chatsFile,
      JSON.stringify(
        {
          version: "ThamAI v5 FINAL",
          created_at: new Date().toISOString(),
          chats: []
        },
        null,
        2
      ),
      "utf-8"
    );
  }
}

function saveChat(role, text) {
  try {
    ensureFile();
    const raw = fs.readFileSync(chatsFile, "utf-8");
    const data = JSON.parse(raw);

    data.chats.push({
      role,
      text,
      time: new Date().toISOString()
    });

    // Giới hạn 500 tin gần nhất
    if (data.chats.length > 500) {
      data.chats = data.chats.slice(-500);
    }

    fs.writeFileSync(chatsFile, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ saveChat error:", err);
  }
}

module.exports = { saveChat };
