// ===== ThamAI v5 – STATIC FRONTEND (STABLE) =====
const API_BASE = "https://thamai-pro-ultra-v4-free.onrender.com";

// DOM
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const voiceBtn = document.getElementById("voice-btn");
const micBtn = document.getElementById("mic-btn");
const voiceSelect = document.getElementById("voice-select");

// State
let voiceEnabled = true;
let selectedVoice = "female";
let isSending = false;

// Safety
if (!input || !sendBtn || !chatBox || !voiceBtn || !micBtn || !voiceSelect) {
  console.error("❌ Missing DOM elements");
}

// Add message
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role === "user" ? "msg user" : "msg ai";
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Speak – Web Speech API
function speak(text) {
  if (!voiceEnabled) return;
  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "vi-VN";

  if (selectedVoice === "female") {
    utter.rate = 0.95;
    utter.pitch = 1.2;
  } else {
    utter.rate = 0.9;
    utter.pitch = 0.8;
  }

  speechSynthesis.speak(utter);
}

// Send message
async function sendMessage() {
  if (isSending) return;

  const text = input.value.trim();
  if (!text) return;

  isSending = true;
  sendBtn.disabled = true;
  sendBtn.textContent = "Đang gửi...";

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

  } catch (err) {
    console.error(err);
    addMessage("ai", "❌ Lỗi kết nối backend.");
  } finally {
    isSending = false;
    sendBtn.disabled = false;
    sendBtn.textContent = "Gửi";
  }
}

// Events
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

voiceSelect.addEventListener("change", () => {
  selectedVoice = voiceSelect.value;
});

voiceBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  voiceBtn.textContent = voiceEnabled
    ? "🔊 Âm thanh: BẬT"
    : "🔇 Âm thanh: TẮT";
});

// Micro – Speech to Text
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "vi-VN";
  recognition.continuous = false;

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
  };
}

micBtn.addEventListener("click", () => {
  if (recognition) recognition.start();
  else alert("Trình duyệt không hỗ trợ micro.");
});

console.log("✅ ThamAI v5 frontend loaded – mic & voice OK");
