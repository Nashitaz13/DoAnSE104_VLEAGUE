# VLEAGUE 1

> ...

---

## Sơ đồ kiến trúc



## Tính năng chính



---

## 🏗️ Công nghệ sử dụng: 

- **Backend:** Express + Javascript
- **Auth:** JWT
- **Database:** Postgresql
- **Email:** Mailgun

---

## ⚡️ Khởi động nhanh dự án

### Clone code về máy

```bash
git clone https://github.com/Nashitaz13/DoAnSE104_VLEAGUE
```

### Chạy Local

#### Cài đặt backend

```bash
cd backend
cp .env.example .env        # Tạo file .env và điền biến môi trường
npm install
npm run dev
```

### Cấu trúc thư mục

```bash

```

---

## Chú ý workflow

### 1. Tạo nhánh riêng cho mỗi người

Ví dụ:

#### Tạo nhánh

```bash
git checkout main
git pull origin main
git checkout -b feature/tam-auth
```

#### Commit

```bash
git add .
git commit -m "Add login API"
git push -u origin feature/tam-auth
```

### 2. Khi hoàn thành 1 phần, lên GitHub tạo Pull Request (PR) từ nhánh feature/tam-auth về main

Những người khác (hoặc leader) review, góp ý, đồng ý thì mới merge vào main.

### 3. Lưu ý khi Merge

Nếu nhiều bạn cùng sửa chung 1 file, sẽ dễ bị merge conflict. Nên trao đổi rõ ai làm phần nào, hoặc tách rõ folder/module.

### 4. Đặt tên nhánh

feature/tennguoi-chucnang hoặc tennguoi-chucnang (dễ nhớ, đồng bộ là được).

## Tóm lại

- **KHÔNG push thẳng lên main.**

- **NÊN mỗi bạn 1 nhánh riêng, hoặc mỗi tính năng 1 nhánh.**

- **Tạo PR, review rồi merge vào main.**

## Chú ý trước khi merge vào main

### Bước 1: Làm tính năng trên nhánh riêng của mình

Code, commit, test tính năng.

Push nhánh đó lên GitHub.

### Bước 2: Merge vào branch dev trước

Tạo Pull Request (PR) từ nhánh feature vào dev.

Test tích hợp trên nhánh dev (có thể deploy lên dev server cho team review/test).

Fix bug, resolve conflict nếu có.

Không làm việc trực tiếp trên dev, chỉ merge từ feature branch vào.

### Bước 3: Khi đã test xong trên dev → Tạo Pull Request từ dev vào main

Chỉ merge dev vào main khi đã test ổn định.

Không được merge thẳng, luôn tạo PR để review lại lần cuối.

### Bước 4: Review kỹ trước khi merge vào main:

Đảm bảo PR đã được duyệt (approve) đủ số người (leader hoặc reviewer).

## Commit theo convention sau:

```bash
<loại_commit>(<phạm_vi>): <nội_dung_ngắn_gọn>
```

- <loại_commit>: Loại thay đổi, ví dụ: feat, fix, refactor, docs, test, chore.
- <phạm_vi>: Phần của dự án bị ảnh hưởng (ví dụ: course, user, api, ...).
- <nội_dung_ngắn_gọn>: Diễn giải vắn tắt nội dung commit.

### Một số loại commit thường dùng

- feat: Thêm tính năng mới
- fix: Sửa lỗi
- refactor: Chỉnh sửa code, không thay đổi logic
- docs: Cập nhật tài liệu
- test: Thêm hoặc sửa test
- chore: Các thay đổi lặt vặt khác

### Ví dụ

```bash
feat(course): add getCourses controller with filter and pagination
fix(course): handle bug when filtering by rate
docs: update README with setup instructions
refactor(user): change user model structure
```

## 👥 Contributors :

