const fetch = require("node-fetch");
const { api, limits } = require("../config.cjs");

/**
 * Lấy phản hồi từ OpenAI nếu có key,
 * nếu không → fallback FREE mode
 */
async function getReply(message) {
  const text = (message || "").trim();
  if (!text) return "Bạn chưa nhập nội dung.";

  // FREE MODE
  if (!api.openaiKey) {
    if (/xin chào|chào/i.test(text)) {
      return "Chào bạn! Mình là ThamAI v5 (chế độ miễn phí).";
    }
    return `Echo (FREE): ${text}`;
  }

  // OPENAI MODE
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${api.openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Bạn là ThamAI v5, trả lời ngắn gọn, rõ ràng." },
          { role: "user", content: text }
        ],
        max_tokens: limits.maxTokens
      })
    });

    if (!res.ok) {
      console.error("OpenAI error:", res.status);
      return "Hệ thống AI đang bận, vui lòng thử lại sau.";
    }

    const json = await res.json();
    return json?.choices?.[0]?.message?.content || "Không có phản hồi.";
  } catch (e) {
    console.error("LLM error:", e);
    return "Lỗi kết nối AI.";
  }
}

module.exports = { getReply };
