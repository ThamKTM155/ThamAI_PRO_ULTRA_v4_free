/* =========================
   ThamAI v5 FINAL – Frontend
   File: frontend/src/script.js
   ========================= */

// ================= CONFIG =================
const API_BASE =
  import.meta?.env?.VITE_API_BASE ||
  "https://thamai-pro-ultra-v4-free.onrender.com";

// ================= DOM =================
const chatBox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const voiceSelect = document.getElementById("voiceSelect");

// ================= UI HELPERS =================
function appendUser(text) {
  const div = document.createElement("div");
  div.className = "msg user";
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAI(text) {
  const div = document.createElement("div");
  div.className = "msg ai";
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ================= TTS =================
function speak(text, voicePref = "female") {
  if (!("speechSynthesis" in window)) return;

  const utter = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();

  let selected =
    voices.find(v => v.lang?.startsWith("vi")) || voices[0];

  if (voicePref === "male") {
    const male = voices.find(v => /male/i.test(v.name));
    if (male) selected = male;
  }

  if (selected) utter.voice = selected;

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// ================= SEND (STREAM) =================
async function sendMessageStream() {
  const text = userInput.value.trim();
  if (!text) return;

  appendUser(text);
  userInput.value = "";

  const aiDiv = document.createElement("div");
  aiDiv.className = "msg ai";
  chatBox.appendChild(aiDiv);

  try {
    const resp = await fetch(`${API_BASE}/chat-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      aiDiv.textContent = fullText;
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    speak(fullText, voiceSelect?.value || "female");
  } catch (e) {
    aiDiv.textContent = "❗ Lỗi kết nối máy chủ.";
    console.error(e);
  }
}

// ================= EVENTS =================
sendBtn?.addEventListener("click", sendMessageStream);

userInput?.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessageStream();
  }
});

// ================= MIC (STT – 1 LẦN DUY NHẤT) =================
let recognition = null;
let isListening = false;

if (micBtn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SR) {
    recognition = new SR();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      micBtn.disabled = true;
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.disabled = false;
    };

    recognition.onresult = e => {
      const text = e.results[0][0].transcript;
      userInput.value = text;
      sendMessageStream();
    };

    recognition.onerror = () => {
      recognition.stop();
    };

    micBtn.addEventListener("click", () => {
      if (!isListening) recognition.start();
    });
  }
}
