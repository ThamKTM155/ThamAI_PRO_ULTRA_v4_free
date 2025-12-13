// backend/services/history.cjs
import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve("backend/data");
const FILE_PATH = path.join(DATA_DIR, "chats.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]", "utf8");
}

export function saveChat(role, content) {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    const chats = JSON.parse(raw);

    chats.push({
      role,
      content,
      time: new Date().toISOString()
    });

    // giới hạn 200 dòng cho nhẹ
    if (chats.length > 200) chats.shift();

    fs.writeFileSync(FILE_PATH, JSON.stringify(chats, null, 2), "utf8");
  } catch (e) {
    console.error("saveChat error:", e);
  }
}
