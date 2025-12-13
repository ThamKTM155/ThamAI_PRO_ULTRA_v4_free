// backend/services/llm.cjs
import fetch from "node-fetch";
import {
  OPENAI_KEY,
  MODEL_NAME,
  MAX_TOKENS,
  SYSTEM_PROMPT
} from "../config.cjs";

/* ---------- fallback FREE ---------- */
function freeReply(user) {
  const u = user.toLowerCase();

  if (/xin chào|chào/.test(u))
    return "Chào bạn 👋 Mình là ThamAI v5 (chế độ miễn phí).";

  if (/giúp|làm gì/.test(u))
    return "Mình có thể trò chuyện, hỗ trợ học tập, lập trình và ý tưởng.";

  return `Bạn vừa nói: "${user}"`;
}

/* ---------- OpenAI (non-stream, ổn định) ---------- */
async function callOpenAI(message) {
  if (!OPENAI_KEY) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        max_tokens: MAX_TOKENS
      })
    });

    if (!res.ok) {
      console.error("OpenAI error:", res.status);
      return null;
    }

    const json = await res.json();
    return json?.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error("OpenAI exception:", e);
    return null;
  }
}

/* ---------- PUBLIC API ---------- */
export async function getReply(message) {
  const ai = await callOpenAI(message);
  if (ai) return ai;
  return freeReply(message);
}
