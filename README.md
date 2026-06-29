# 🚀 Quy Trình Phát Triển Code Với Sự Hỗ Trợ Của AI

Chào mừng bạn đến với dự án! Repository này áp dụng mô hình tối ưu tốc độ bằng **AI Coding Assistants** (Copilot, Cursor, AI Agents), đồng thời thiết lập các "chốt chặn" kiểm soát chất lượng nghiêm ngặt bởi **Con người (Human-in-the-Loop)**.

---

## 🛠️ Chiến Lược Quản Lý Nhánh (Git Branching)

Để giữ source code luôn sạch sẽ và tránh xung đột (Merge Conflicts) khi AI tạo code với tốc độ chóng mặt, chúng ta áp dụng mô hình **Nhánh ngắn hạn (Short-Lived Feature Branches)**.

### 📌 Quy ước đặt tên nhánh (Naming Convention)

| Loại nhánh | Quy ước đặt tên | Ví dụ thực tế | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| **Nhánh chính** | `main` | `main` | Nhánh production, luôn ổn định và sẵn sàng deploy. |
| **Tính năng** | `feature/[ten-task]` | `feature/auth-jwt` | Nhánh làm task thông thường (Người + AI phối hợp). |
| **AI Agent** | `agent/[ten-agent]-[task]` | `agent/jules-fix-bug` | Các task do AI Agent tự động xử lý 100%. |
| **Thử nghiệm** | `experiment/[y-tuong]` | `experiment/ai-refactor`| Nơi cho AI tự do tối ưu code cũ hoặc thử nghiệm. |

> ⚠️ **Nguyên tắc cốt lõi:** Mọi nhánh feature/agent phải được chia nhỏ tối đa, giải quyết một việc duy nhất và chỉ nên tồn tại từ 1-2 ngày.

---

## 🛡️ Hệ Thống Chốt Chặn Bảo Vệ Nhánh Chính (`main`)

Nhánh `main` được bảo vệ nghiêm ngặt bằng **Branch Protection Rules**. Code do bạn hay AI viết ra đều phải vượt qua 3 tầng kiểm duyệt sau thì nút `Merge` mới mở khóa:

### 1️⃣ Kiểm tra tự động bằng CI/CD (Status Checks)
Mỗi khi Pull Request (PR) được tạo, hệ thống **GitHub Actions** sẽ tự động chạy workflow. Code **BẮT BUỘC** phải pass qua tất cả bài test tự động, check lỗi cú pháp (Linter) và build thành công.
* *Nếu CI/CD báo đỏ, nút Merge sẽ bị khóa cứng.*

### 2️⃣ AI Tự Động Review Code (Copilot Review)
**GitHub Copilot** sẽ tự động nhảy vào PR ngay khi vừa khởi tạo để quét toàn bộ code thay đổi. Nó sẽ tìm kiếm lỗ hổng bảo mật, lỗi logic hoặc code thừa và để lại comment nhận xét trực tiếp trên PR.

### 3️⃣ Con Người Duyệt Cuối Cùng (Human Approval)
* **Bắt buộc có ít nhất 1 Developer (Con người) Approve** thì PR mới được duyệt.
* Tất cả các cuộc hội thoại, comment góp ý (kể cả của Copilot) **phải được xử lý xong (`Resolved`)**.
* Nếu bạn hoặc AI tiếp tục push thêm commit mới sau khi đã được approve, lượt approve cũ sẽ tự động bị hủy bỏ để ép con người phải vào review lại phần mới sửa.

---

## 🚀 Quy Trình Đóng Góp Code (Workflow)

Dù bạn là một Lập trình viên hay một AI Agent, vui lòng tuân thủ chính xác các bước sau:

```text
[Kéo code main mới nhất] ──> [Tạo nhánh Feature] ──> [Code cùng AI] ──> [Tạo Pull Request] ──> [CI/CD & Copilot Check] ──> [Người duyệt] ──> [Merge vào main]
