// ===============================
// ThamAI PRO ULTRA - Frontend
// script.js (STABLE VERSION)
// ===============================

let recognition = null;
let isListening = false;
let hasSentFromMic = false;

// API
const STREAM_API = "https://thamai-pro-ultra-v4-free.onrender.com/chat-stream";

// DOM
const chatBox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const voiceSelect = document.getElementById("voiceSelect");

// ===============================
// UI helpers
// ===============================
function appendUser(text) {
  const d = document.createElement("div");
  d.className = "msg user";
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAIContainer() {
  const d = document.createElement("div");
  d.className = "msg ai";
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
  return d;
}

// ===============================
// Browser TTS (free)
// ===============================
function speak(text, voicePref = "female") {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const ut = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices() || [];

  let chosen =
    voices.find(v => v.lang && v.lang.startsWith("vi")) || voices[0];

  if (voicePref === "male") {
    const male = voices.find(v => /male/i.test(v.name));
    if (male) chosen = male;
  }

  if (chosen) ut.voice = chosen;
  speechSynthesis.speak(ut);
}

// ===============================
// SEND MESSAGE (STREAM – DUY NHẤT)
// ===============================
async function sendMessageStream(text) {
  if (!text) return;

  appendUser(text);
  const aiDiv = appendAIContainer();

  try {
    const resp = await fetch(STREAM_API, {
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

      fullText += decoder.decode(value, { stream: true });
      aiDiv.textContent = fullText;
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    speak(fullText, voiceSelect.value);
  } catch (err) {
    aiDiv.textContent = "❗ Lỗi kết nối máy chủ.";
    console.error(err);
  }
}

// ===============================
// ENTER & BUTTON SEND
// ===============================
sendBtn?.addEventListener("click", () => {
  const text = userInput.value.trim();
  userInput.value = "";
  sendMessageStream(text);
});

userInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = userInput.value.trim();
    userInput.value = "";
    sendMessageStream(text);
  }
});

// ===============================
// MICROPHONE – CHỐT LỖI LẶP
// ===============================
if (micBtn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SR) {
    micBtn.onclick = () =>
      alert("Trình duyệt không hỗ trợ ghi âm. Dùng Chrome / Edge mới.");
  } else {
    recognition = new SR();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      hasSentFromMic = false;
      micBtn.disabled = true;
      micBtn.textContent = "🎙️";
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.disabled = false;
      micBtn.textContent = "🎤";
    };

    recognition.onresult = (e) => {
      if (hasSentFromMic) return; // 🔒 CHỐT GỬI 1 LẦN

      hasSentFromMic = true;
      const text = e.results[0][0].transcript.trim();

      recognition.stop(); // 🛑 DỪNG NGAY – TRÁNH PHÁT SINH KẾT QUẢ PHỤ
      sendMessageStream(text);
    };

    recognition.onerror = () => {
      recognition.stop();
    };

    micBtn.addEventListener("click", () => {
      if (isListening) return;
      recognition.start();
    });
  }
}
