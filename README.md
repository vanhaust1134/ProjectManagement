## Quy Trình Phát Triển Code

Repository là demo để quản lý cộng tác trong công việc, bảo đảm các nhánh công việc không xung đột.

<img width="1424" height="751" alt="image" src="https://github.com/user-attachments/assets/6aa50c66-d265-464a-bf6d-08a536a33768" />

---

## 🛠️ Quản Lý Nhánh (Git Branching)

Để giữ source code luôn sạch sẽ và tránh xung đột (Merge Conflicts).

### 📌 Quy ước đặt tên nhánh (Naming Convention)

| Loại nhánh | Quy ước đặt tên | Ví dụ thực tế | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| **Nhánh chính** | `main` | `main` | Nhánh production, luôn ổn định và sẵn sàng deploy. |
| **Tính năng** | `feature/[ten-tinh-nang]` | `feature/login-ui` | Nhánh làm task thông thường. |
| **Sửa lỗi** | `bugfix/[ten-loi]` | `bugfix/button-crash` | Sửa lỗi tính năng. |
| **Bản vá sau golive** | `hotfix/[ten-ban-va]` | `hotfix/[security-path]`| Cập nhật bản vá, các đoạn code nhỏ. |

> **Nguyên tắc:** Mọi nhánh feature/bugfix phải được chia nhỏ tối đa, giải quyết một việc duy nhất và các commit/merge request cần được đẩy lên từ 1-2 ngày code.

---

## 🛡️ Coding
Trước khi bắt đầu hãy clone dự án trên repository về máy

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/cf565e05-8eda-4d1f-a107-8789762b75ff" />


### ⏳ Giai đoạn 1: Đồng bộ Code
Trước khi bắt đầu code, phải thực hiện lấy code mới nhất mà đồng nghiệp đã merge vào nhánh chính ngày hôm trước về máy mình.

```bash
# 1. Chuyển về nhánh chính
git checkout main

# 2. Cập nhật code mới nhất từ GitHub về máy local
git pull origin main

# 3. Tạo và chuyển sang nhánh feature mới
git checkout -b feature/ten-tinh-nang

# 4. Kiểm tra các file đã chỉnh sửa hoặc thêm mới
git status

# 5. Đưa các file muốn lưu vào vùng chờ (Staging Area)
git add .

# 6. Lưu lại commit kèm theo comment rõ ràng
git commit -m "feat: thêm giao diện đăng nhập"

# 7. Kéo code main mới nhất về máy (để phòng trường hợp trong ngày có ai vừa merge)
git fetch origin main

# 8. Đưa code mới nhất từ main vào nhánh feature của bạn
git merge origin/main

# 📝 LƯU Ý: Nếu terminal báo "CONFLICT" (Xung đột code):
# -> Mở VS Code/Cursor lên, chọn giữ code của bạn, của đồng nghiệp hoặc cả hai.
# -> Sau khi sửa xong xuôi bằng tay, gõ tiếp:
#    git add .
#    git commit -m "fix: giải quyết xung đột với nhánh main"

# 9. Kéo code main mới nhất về máy (phòng trường hợp trong ngày có ai vừa merge)
git fetch origin main

# 10. Đưa code mới nhất từ main vào nhánh feature của bạn
git merge origin/main

# 📝 LƯU Ý: Nếu terminal báo "CONFLICT" (Xung đột code):
# -> Mở VS Code/Cursor lên, chọn giữ code của bạn, của đồng nghiệp hoặc cả hai.
# -> Sau khi sửa xong xuôi bằng tay, gõ tiếp:
#    git add .
#    git commit -m "fix: giải quyết xung đột với nhánh main"
```

---

## 🛡️ Quản lý Nhánh Chính (`main`)

Nhánh `main` được bảo vệ nghiêm ngặt bằng **Branch Protection Rules**. Code viết ra đều đi qua 3 tầng kiểm duyệt sau thì nút `Merge` mới mở khóa:

### 1️⃣ Kiểm tra tự động bằng CI/CD (Status Checks)
Mỗi khi Pull Request (PR) được tạo, hệ thống **GitHub Actions** sẽ tự động chạy workflow. Code **BẮT BUỘC** phải pass qua tất cả bài test tự động, check lỗi cú pháp (Linter) và build thành công.
* *Nếu CI/CD báo đỏ, nút Merge sẽ bị ẩn.*

### 2️⃣ AI Tự Động Review Code (Copilot Review)
**GitHub Copilot** sẽ tự động nhảy vào PR ngay khi vừa khởi tạo để quét toàn bộ code thay đổi. Nó sẽ tìm kiếm lỗ hổng bảo mật, lỗi logic hoặc code thừa và để lại comment nhận xét trực tiếp trên PR.

### 3️⃣ Phê duyệt thay đổi
* **Bắt buộc có ít nhất 1 Developer Approve** thì PR mới được duyệt.
* Tất cả các cuộc hội thoại, comment góp ý (kể cả của Copilot) **phải được xử lý xong (`Resolved`)**.
* Nếu bạn hoặc AI tiếp tục push thêm commit mới sau khi đã được approve, lượt approve cũ sẽ tự động bị hủy bỏ để ép con người phải vào review lại phần mới sửa.

---

## 🚨 Hướng Dẫn Xử Lý Sự Cố: Quay Lại Phiên Bản Cũ Khi Nhánh Main Bị Lỗi

Khi một đoạn code lỗi (do người hoặc AI viết) lỡ bị merge vào nhánh `main` làm sập ứng dụng, bạn có 2 cách để đưa dự án về trạng thái an toàn trước đó.

---

### 🛡️ Cách 1: Sử dụng `git revert`
* **Xử lý:** Tạo ra một commit mới có nội dung **ngược lại hoàn toàn** với commit lỗi để xóa đi commit lỗi trước đó. 

**Các bước thực hiện:**
```bash
# 1. Chuyển về nhánh main và cập nhật code mới nhất từ server
git checkout main
git pull origin main
git checkout -b hotfix/revert-error

# 2. Xem lịch sử commit để lấy ID (7 ký tự đầu) của commit gây lỗi
git log --oneline
# Console hiển thị:
# c123456 (HEAD -> main) feat: code lỗi của AI làm crash app
# a789101 feat: phiên bản cũ vận hành bình thường

# 3. Tiến hành reverse commit lỗi (Điền mã commit LỖI)
git revert c123456

# (Lúc này Git sẽ tự động mở cửa sổ bắt nhập tin nhắn, bạn cứ lưu và đóng lại)

# 4. Đẩy code sửa lỗi lên GitHub để cập nhật cho cả team
git push origin hotfix/revert-error

```
### 🛡️ Cách 2: Sử dụng `git reset --hard`
* **Xử lý:** Xóa hoàn toàn phiên bản lỗi.

**Các bước thực hiện:**
```bash
# 1. Chuyển về nhánh main
git checkout main
git pull origin main
git checkout -b hotfix/reset-error

# 2. Xem lịch sử commit để lấy ID của commit ổn định gần nhất
git log --oneline
# Ví dụ chọn commit là: a789101

# 3. Ép nhánh main trả ngược phiên bản vị trí commit (Điền mã commit trên)
git reset --hard a789101

# 4. Vì máy local bây giờ đang "cũ" hơn trên server, phải dùng "vũ lực" để đè code lên
git push origin hotfix/reset-error
```
