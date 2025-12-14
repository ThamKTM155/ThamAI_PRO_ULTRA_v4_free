// ===== ThamAI v5 – STATIC FRONTEND (CLEAN) =====

const API_BASE = "https://thamai-pro-ultra-v4-free.onrender.com";

// DOM
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const voiceBtn = document.getElementById("voice-btn");

let voiceEnabled = true;

// Safety check
if (!chatBox || !input || !sendBtn || !voiceBtn) {
  console.error("❌ Missing DOM elements");
}

// Add message
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role === "user" ? "msg user" : "msg ai";
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Speak – Web Speech API
function speak(text) {
  if (!voiceEnabled) return;
  if (!("speechSynthesis" in window)) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "vi-VN";
  speechSynthesis.speak(utter);
}

// Send message
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  try {
    const res = await fetch(API_BASE + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    const reply = data.reply || "⚠️ Không có phản hồi.";

    addMessage("ai", reply);
    speak(reply);

  } catch (e) {
    console.error(e);
    addMessage("ai", "❌ Lỗi kết nối backend.");
  }
}

// Events
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

voiceBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  voiceBtn.innerText = voiceEnabled
    ? "🔊 Âm thanh: BẬT"
    : "🔇 Âm thanh: TẮT";
});

console.log("✅ ThamAI v5 frontend loaded (clean)");
