# 🌌 Project Management - AI-Enhanced SDLC Workflow

<p align="left">
  <img src="https://img.shields.io/badge/Git-F05033?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/Azure_Static_Web_Apps-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white" alt="Azure" />
  <img src="https://img.shields.io/badge/GitHub_Copilot-181717?style=for-the-badge&logo=githubcopilot&logoColor=white" alt="Copilot" />
</p>

---

## 📖 Tổng Quan

Tài liệu này chuẩn hóa quy trình **6 giai đoạn phát triển phần mềm (SDLC)** cùng hệ thống kiểm thử & triển khai tự động. 

Mục tiêu: **"Tối ưu tốc độ phát triển nhờ AI - Đảm bảo tính ổn định."**

---

## 📌 Mục Lục

* [Giai Đoạn 1: Lên Kế Hoạch & Phân Tích (Planning)](#giai-đoạn-1-lên-kế-hoạch--phân-tích-planning)
* [Giai Đoạn 2: Thiết Kế Kiến Trúc & Ngữ Cảnh AI (Design)](#giai-đoạn-2-thiết-kế-kiến-trúc--ngữ-cảnh-ai-design)
* [Giai Đoạn 3: Lập Trình Phối Hợp AI (Coding Workflow)](#giai-đoạn-3-lập-trình-phối-hợp-ai-coding-workflow)
  * [1. Chiến lược quản lý nhánh (Git Branching)](#1-chiến-lược-quản-lý-nhánh-git-branching)
  * [2. Chu kỳ dòng lệnh Git hàng ngày](#2-chu-kỳ-dòng-lệnh-git-hàng-ngày)
  * [3. Kỹ thuật cất giữ code tạm thời (Git Stash)](#3-kỹ-thuật-cất-giữ-code-tạm-thời-git-stash)
* [Giai Đoạn 4: Kiểm Thử Tự Động (Automation Test - Playwright)](#giai-đoạn-4-kiểm-thử-tự-động-automation-test---playwright)
* [Giai Đoạn 5: Triển Khai Liên Tục (Deployment - Azure Static Web Apps)](#giai-đoạn-5-triển-khai-liên-tục-deployment---azure-static-web-apps)
* [Giai Đoạn 6: Vận Hành & Khắc Phục Sự Cố (Maintenance & Rollback)](#giai-đoạn-6-vận-hành--khắc-phục-sự-cố-maintenance--rollback)

---

## Giai Đoạn 1: Lên Kế Hoạch & Phân Tích (Planning)

Chúng ta điều phối công việc của cả người và các AI Agent thông qua **GitHub Projects (Kanban Board)**.

```text
  ┌───────────┐      ┌───────────────┐      ┌─────────────┐      ┌──────────┐
  │  To Do    │ ───> │  In Progress  │ ───> │  Review/QA  │ ───> │   Done   │
  └───────────┘      └───────────────┘      └─────────────┘      └──────────┘
```

---

## Giai Đoạn 2: Thiết Kế Kiến Trúc & Ngữ Cảnh AI (Design)

Để AI Assistants (Cursor, GitHub Copilot) phải thiết lập các "ngữ cảnh chuẩn" trước khi viết code:

1. **Giao Diện (UI/UX Design):** Đồng bộ hóa các liên kết thiết kế hệ thống từ Figma làm khuôn mẫu.
2. **Hợp Đồng Dữ Liệu (API Contract):** Định nghĩa cấu trúc JSON API và schema cơ sở dữ liệu rõ ràng.
3. **Cấu Hình Luật AI (`.cursorrules`):** Định nghĩa các quy chuẩn kiến trúc của dự án vào file cấu hình ở thư mục gốc để AI luôn tuân thủ nghiêm ngặt.

---

## Giai Đoạn 3: Lập Trình Phối Hợp AI (Coding Workflow)

Trước khi bắt tay vào gõ code, hãy đảm bảo bạn đã kéo (clone) phiên bản mới nhất của repository này về máy local.

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/cf565e05-8eda-4d1f-a107-8789762b75ff" />

**Sau khi hoàn tất nếu mới sử dụng git lần đầu hãy chạy các dòng lệnh chứng thực cá nhân**
$ git config --global user.name "User Name"
$ git config --global user.email "username@gmail.com"
**Lấy kho chứa git trên account về**
$ git init

### 1. Quản lý nhánh (Git Branching)

Để đảm bảo không xảy ra xung đột khi nhiều người và AI cùng tạo code liên tục, toàn bộ thành viên bắt buộc phải tuân thủ quy ước đặt tên nhánh:

| Tiền tố nhánh | Mục đích sử dụng | Ví dụ thực tế |
| :--- | :--- | :--- |
| `main` | Nhánh Production chính thức, luôn trong trạng thái cực kỳ ổn định. | `main` |
| `feature/` | Phát triển các tính năng mới theo phân công của Task. | `feature/login-ui` |
| `bugfix/` | Sửa lỗi phát sinh trong quá trình code và kiểm thử nội bộ. | `bugfix/button-crash` |
| `hotfix/` | Vá lỗi khẩn cấp trực tiếp từ môi trường Production. | `hotfix/security-patch` |

> 💡 **Nguyên tắc:** Các nhánh tính năng (`feature/`) phải được chia nhỏ ở mức tối đa, xử lý duy nhất một nhiệm vụ và chỉ được phép tồn tại từ 1-2 ngày trước khi merge.

**Sơ đồ thể hiện các cập nhật và làm việc cộng tác trên nhánh**

<img width="1213" height="761" alt="image" src="https://github.com/user-attachments/assets/5bac86d7-bca9-469d-a696-5618f9d62c7d" />


### 2. Chu kỳ dòng lệnh Git hàng ngày

Thực hiện chuẩn xác chu trình dòng lệnh sau mỗi ngày để giữ code local đồng nhất:

<details>
<summary><b>📐 Nhấp để xem chuỗi lệnh Git chi tiết từng bước</b></summary>

```bash
# Bước 1: Trở về main và cập nhật code mới nhất từ team về máy
git checkout main
git pull origin main

# Bước 2: Tạo một nhánh tính năng mới từ Task trên GitHub Project
git checkout -b feature/login-ui

# Bước 3: Kiểm tra trạng thái các file đã chỉnh sửa hoặc tạo mới
git status

# Bước 4: Đưa toàn bộ file thay đổi vào vùng chờ đóng gói
git add .

# Bước 5: Commit code kèm comment
git commit -m "feat: hoàn thành giao diện màn hình đăng nhập"

# Bước 7: Kéo code main mới nhất trên server về để phòng ngừa conflict
git fetch origin main

# Bước 7: Mở github web để tiến hành tạo merge request

# 📝 LƯU Ý: Nếu xuất hiện xung đột (CONFLICT):
# -> Mở trình editor để chỉnh sửa
# -> Sau khi chỉnh sửa xong xuôi, tiến hành lưu lại:
#    git add .
#    git commit -m "fix: giải quyết xung đột với nhánh main"

# Bước 8: Đẩy nhánh tính năng của bạn lên GitHub để bắt đầu tạo PR
git push origin feature/login-ui

```
</details>

### 3. Lưu code tạm thời (Git Stash)

Xảy ra khi quên pull code mới nhất từ nhánh main hoặc cần phải chuyển sang nhánh mới để ưu tiên xử lý việc gấp

<details>
<summary><b>📦 Nhấp để xem hướng dẫn sử dụng Git Stash khi chuyển nhánh gấp</b></summary>

```bash
# 1. Cất toàn bộ code đang viết dở (bao gồm cả file mới tạo chưa theo dõi -u) vào stash tạm thời
git stash -u

# (Code cũ đã lưu, có thể tiếp tục công việc trên nhánh khác)
git checkout main
git checkout -b bugfix/button-crash
# ... tiến hành fix bug & push ...

# 2. Quay lại nhánh tính năng đang làm trước đó
git checkout feature/login-ui

# 3. Xem danh sách các bản lưu tạm thời đã cất (nếu cất nhiều lần)
git stash list

# 4. Lấy code cũ ra để tiếp tục gõ code và xóa bản lưu tạm này khỏi bộ nhớ chờ
git stash pop

```
</details>

---

## Giai Đoạn 4: Kiểm Thử Tự Động (Automation Test - Playwright)

Nhánh `main` là `protected main` để trách các yêu cầu pull trực tiếp vào production. Để merge code vào nhánh `main`, Pull Request phải qua các bước sau trước khi được pull trực tiếp lên nhánh:

<img width="1200" height="628" alt="image" src="https://github.com/user-attachments/assets/d8074597-0afe-43ba-81a6-bda35f54d0fc" />

```text
[Tạo Pull Request] ──> [1. Chạy các công cụ automation test (vitetest, playwright,...)] ──> [2. Copilot Review] ──> [3. Người duyệt] ──> [MỞ KHÓA MERGE]
```
### 1️⃣ Bước 1: Chạy Test tự động với các công cụ automation test
Khi PR được mở, GitHub Actions sẽ khởi tạo một máy ảo ubuntu để tự động cài đặt môi trường và chạy toàn bộ kịch bản kiểm thử giao diện đầu cuối (End-to-End Testing):
# Lệnh tự động kích hoạt bởi GitHub Actions trong pipeline CI/CD
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

### 2️⃣ Bước 2: Quét lỗi tự động bằng Copilot Code Review
Hệ thống GitHub Copilot AI sẽ tự động phân tích các dòng code thay đổi trong PR, chỉ ra các đoạn code viết chưa tối ưu, các lỗ hổng bảo mật tiềm ẩn và đề xuất code sửa đổi trực tiếp dưới dạng bình luận trên PR.

### 3️⃣ Chốt chặn 3: Phê duyệt user
* PR bắt buộc phải nhận được ít nhất **1 lượt Approve (Duyệt)** từ thành viên khác có quyền ghi (Write Access) trong dự án.
* Mọi thảo luận và bắt lỗi trên PR bắt buộc phải được giải quyết xong (chuyển trạng thái sang `Resolved`).

---

## Giai Đoạn 5: CI/CD (Deployment - Azure Static Web Apps)

Dự án áp dụng quy trình đóng gói và triển khai tự động trên các hosting có kết nối được với `GitHub Actions`:

<img width="1900" height="894" alt="image" src="https://github.com/user-attachments/assets/f6a1591b-45b1-42f4-abc1-3d83d505f44e" />

1. Ngay khi PR được merge thành công vào nhánh chính `main`, một workflow GitHub Actions sẽ tự động biên dịch dự án.
2. Bản build ổn định này sẽ được đẩy tự động lên đám mây **Azure Static Web Apps (ASWA)**.
3. Ứng dụng thực tế ngoài môi trường Production sẽ được cập nhật phiên bản mới.
---

## Giai Đoạn 6: Vận Hành & Khắc Phục Sự Cố (Maintenance & Rollback)

Khi phát hiện code lỗi nghiêm trọng lỡ bị đưa lên nhánh `main` và làm ảnh hưởng trực tiếp đến người dùng ngoài thực tế, chúng ta áp dụng 1 trong 2 phương án khôi phục sau:

### 🛡️ Phương án 1: Sử dụng `git revert`
Tạo ra một commit mới để roll back hoàn toàn thay đổi của commit lỗi. Sẽ ghi nhận commit

```bash
# 1. Tạo một nhánh hotfix từ main mới nhất
git checkout main
git pull origin main
git checkout -b hotfix/revert-error

# 2. Xem lịch sử commit để lấy mã ID (7 ký tự đầu) của commit gây lỗi
git log --oneline
# Ví dụ: c123456 là commit lỗi, a789101 là phiên bản ổn định trước đó.

# 3. Chạy lệnh revert (Điền mã của commit gây lỗi)
git revert c123456

# 4. Đẩy nhánh hotfix lên GitHub để mở PR khẩn cấp xin duyệt
git push origin hotfix/revert-error
```

### 🛡️ Phương án 2: Sử dụng `git reset --hard`
Không ghi nhận commit và xóa hoàn toàn phiên bản lỗi. Dùng trong trường hợp không xác định được lỗi

```bash
# 1. Tạo nhánh hotfix
git checkout main
git pull origin main
git checkout -b hotfix/reset-error

# 2. Ép nhánh quay ngược về đúng vị trí phiên bản an toàn (Điền mã của commit ổn định)
git reset --hard a789101

# 3. Sử dụng lực ép (force push) để đè lại lịch sử mới lên server cứu hộ
git push origin hotfix/reset-error --force
```
