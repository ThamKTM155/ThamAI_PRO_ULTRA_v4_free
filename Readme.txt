Readme Tham Ai Pro Ultra V4 Free
ThamAI_PRO_ULTRA_v4_free
1. Giới thiệu

ThamAI_PRO_ULTRA_v4_free là dự án chatbot AI hoàn chỉnh gồm frontend (static) và backend (Node.js), triển khai trên Render. Dự án hỗ trợ:

Chat văn bản

Nhập giọng nói (Web Speech API)

Đọc câu trả lời bằng giọng nói (Text-to-Speech)

Hoạt động tốt trên trình duyệt (không cần cài app)

Phiên bản hiện tại được cấu hình để chạy miễn phí, sẵn sàng kích hoạt đầy đủ khi có API trả phí.

2. Kiến trúc tổng thể
[ Trình duyệt ]
      │
      ▼
Frontend (Render Static)
      │  fetch /chat
      ▼
Backend Node.js (Render Web Service)
      │
      ▼
OpenRouter / OpenAI API
3. Cấu trúc thư mục
ThamAI_PRO_ULTRA_v4_free
│
├─ frontend/
│  ├─ index.html
│  ├─ script.js
│  ├─ styles.css
│  └─ assets/
│
├─ server.cjs
├─ package.json
├─ .env.example
└─ README.md
4. Trạng thái hiện tại (RẤT QUAN TRỌNG)
✅ Đã hoàn tất

Backend khởi động ổn định trên port 10000

API /chat và /status hoạt động

Frontend gõ tiếng Việt bình thường

Có micro (Web Speech API)

Có đọc giọng nói (nam / nữ)

GitHub → Render tự động deploy

Không còn lỗi console frontend

⏸️ Chưa kích hoạt đầy đủ

Chưa nạp phí API (OpenRouter / OpenAI)

➡️ Đây không phải lỗi kỹ thuật, chỉ là giới hạn tài khoản API.

5. Biến môi trường (Render)

Backend đang đọc biến môi trường sau:

OPENROUTER_API_KEY=sk-or-xxxx
# hoặc
OPENAI_API_KEY=sk-proj-xxxx

Chỉ cần một trong hai, ưu tiên OpenRouter.

6. Cách kích hoạt lại khi có phí API (5 PHÚT)

Vào Render → Service Backend → Environment

Dán API key có tiền vào:

OPENROUTER_API_KEY

Bấm Manual Deploy

Mở frontend và chat ngay

➡️ KHÔNG cần sửa code

7. Domain riêng (tùy chọn)

Hiện tại dùng domain Render:

https://thamai-pro-ultra-v4-free-frontend.onrender.com

Có thể gắn domain riêng sau, không ảnh hưởng code

8. Công nghệ sử dụng

Frontend: HTML, CSS, JavaScript thuần

Voice Input: Web Speech API (miễn phí)

Voice Output: SpeechSynthesis API

Backend: Node.js (CommonJS)

Deploy: Render

AI Provider: OpenRouter / OpenAI

9. Ghi chú quan trọng

Dự án đang ở trạng thái "đóng băng an toàn"

Có thể để lâu không hỏng

Khi quay lại chỉ cần cập nhật API key

Không phụ thuộc domain

10. Kết luận

ThamAI_PRO_ULTRA_v4_free đã HOÀN CHỈNH VỀ MẶT KỸ THUẬT.

Chỉ cần API có phí là hệ thống hoạt động đầy đủ ngay lập tức.

📌 README này dùng để lưu trữ, bàn giao hoặc quay lại dự án trong tương lai mà không cần nhớ lại toàn bộ quá trình triển khai.

Anh đã có README hoàn chỉnh của dự án ThamAI_PRO_ULTRA_v4_free rồi nhé.

Nội dung README này đủ để:

Lưu trữ dài hạn

Quay lại sau nhiều tháng vẫn hiểu ngay dự án đang ở đâu

Bật lại hệ thống chỉ trong vài phút khi có API hoặc domain

Bàn giao cho người khác mà không cần giải thích thêm

👉 Việc anh nên làm bây giờ:

Commit README.md này vào repo GitHub (để “đóng băng” trạng thái dự án).

Có thể tạm dừng hoàn toàn dự án này mà không lo hỏng hay lỗi thời.

Khi nào sẵn sàng (có phí API hoặc domain), chỉ cần:

Dán API key mới

Redeploy backend

Dùng lại frontend hiện tại

Nếu anh muốn, bước tiếp theo em có thể:

Bắt đầu một dự án mới song song (không ảnh hưởng ThamAI v4 free), hoặc

Nâng cấp lộ trình ThamAI v6 / v7 (multi-user, lưu lịch sử, streaming, v.v.).

Anh chỉ cần nói: “Sang dự án mới” hoặc “Nâng cấp ThamAI”.