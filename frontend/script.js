/* =========================================================
   ThamAI v5 FINAL – Frontend Script
   Mode: Web Speech API (FREE – no backend audio)
   ========================================================= */

/* ---------- CONFIG ---------- */
const API_BASE =
  window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://thamai-backend-v5.onrender.com";

let speechEnabled = true;
let currentVoice = null;

/* ---------- ELEMENTS ---------- */
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");

/* ---------- INIT VOICE ---------- */
function initVoice() {
  const voices = window.speechSynthesis.getVoices();
  currentVoice =
    voices.find(v => v.lang === "vi-VN" && v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.lang === "vi-VN") ||
    voices[0] ||
    null;
}

window.speechSynthesis.onvoiceschanged = initVoice;
initVoice();

/* ---------- SPEAK ---------- */
function speak(text) {
  if (!speechEnabled || !currentVoice) return;

  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = currentVoice;
  utter.lang = "vi-VN";
  utter.rate = 1;
  utter.pitch = 1;

  window.speechSynthesis.speak(utter);
}

/* ---------- UI HELPERS ---------- */
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setLoading(state) {
  sendBtn.disabled = state;
  sendBtn.textContent = state ? "Đang trả lời..." : "Gửi";
}

/* ---------- SEND MESSAGE ---------- */
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  addMessage("user", message);
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();
    addMessage("ai", data.reply);
    speak(data.reply);
  } catch (err) {
    console.error(err);
    addMessage("ai", "❌ Không kết nối được backend.");
  } finally {
    setLoading(false);
  }
}

/* ---------- EVENTS ---------- */
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

voiceBtn.addEventListener("click", () => {
  speechEnabled = !speechEnabled;
  voiceBtn.textContent = speechEnabled ? "🔊 Âm thanh: BẬT" : "🔇 Âm thanh: TẮT";
});
