// script.js — frontend (module)
const API_URL = window.API_URL || "http://localhost:3000/chat";

const chatBox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const voiceSelect = document.getElementById("voiceSelect");

// UI helpers
function appendUser(text) {
  const d = document.createElement("div");
  d.className = "msg user";
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAI(text) {
  const d = document.createElement("div");
  d.className = "msg ai";
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// TTS using browser SpeechSynthesis (free)
function speak(text, voicePref = "female") {
  try {
    if (!("speechSynthesis" in window)) return;
    const ut = new SpeechSynthesisUtterance(text);
    // choose approximate voice
    const voices = window.speechSynthesis.getVoices() || [];
    // prefer lang vi voices
    let chosen = voices.find(v => v.lang && v.lang.startsWith("vi")) || voices[0];
    if (voicePref === "male") {
      const male = voices.find(v => /male/i.test(v.name) || /male/i.test(v.voiceURI));
      if (male) chosen = male;
    }
    if (chosen) ut.voice = chosen;
    window.speechSynthesis.cancel(); // stop any playing
    window.speechSynthesis.speak(ut);
  } catch (e) {
    console.warn("TTS failed", e);
  }
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  appendUser(text);
  userInput.value = "";

  const loader = document.createElement("div");
  loader.className = "msg ai";
  loader.textContent = "Đang xử lý...";
  chatBox.appendChild(loader);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, want_tts: false, voice: voiceSelect.value })
    });
    if (!resp.ok) {
      loader.remove();
      appendAI("❗ Lỗi mạng: " + resp.status);
      return;
    }
    const data = await resp.json();
    loader.remove();
    appendAI(data.reply || "Không có phản hồi");
    // speak using browser TTS
    speak(data.reply || "", voiceSelect.value);
  } catch (err) {
    loader.remove();
    appendAI("❗ Lỗi kết nối máy chủ.");
    console.error(err);
  }
}

// Enter gửi (Shift+Enter xuống dòng)
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
sendBtn.addEventListener("click", sendMessage);

// Mic using Web Speech API (browser)
if (micBtn) {
  micBtn.addEventListener("click", () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Trình duyệt không hỗ trợ ghi âm (SpeechRecognition). Hãy dùng Chrome hoặc Edge mới nhất.");
      return;
    }
    const r = new SR();
    r.lang = "vi-VN";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev) => {
      const txt = Array.from(ev.results).map(r=>r[0].transcript).join(" ");
      userInput.value = txt;
      sendMessage();
    };
    r.onerror = (e) => console.error("STT error", e);
    r.start();
  });
}
