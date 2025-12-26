# Hướng Dẫn Cài Đặt và Chạy Dự Án (Sau khi Pull Code)

Tài liệu này hướng dẫn các bước cần thực hiện để chạy dự án V-League sau khi clone hoặc pull code mới nhất từ GitHub về máy.

## 1. Yêu cầu hệ thống

*   **Python**: 3.10 trở lên
*   **Node.js**: 18.x trở lên
*   **PostgreSQL**: Đã cài đặt và đang chạy (dùng pgAdmin hoặc terminal để quản lý)

## 2. Thiết lập Backend (Quan trọng)

Frontend sẽ không hoạt động nếu không có Backend chạy và Database được khởi tạo đúng.

1.  **Di chuyển vào thư mục backend**:
    ```bash
    cd backend
    ```

2.  **Tạo và kích hoạt môi trường ảo (Virtual Environment)**:
    *   Windows:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
    *   macOS/Linux:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

3.  **Cài đặt các thư viện phụ thuộc**:
    ```bash
    pip install -r requirements.txt
    ```
    *Lưu ý: Nếu gặp lỗi thư viện, hãy đảm bảo pip đã được upgrade (`python -m pip install --upgrade pip`).*

4.  **Cấu hình biến môi trường**:
    *   Tạo file `.env` trong thư mục `backend`.

5.  **Khởi tạo Database và Dữ liệu mẫu**:
    *   Nếu đây là lần đầu chạy hoặc muốn reset database:
        ```bash
        python create_db.py
        ```
    *   Nhập dữ liệu mẫu (quan trọng để có tài khoản admin):
        ```bash
        python app/initial_data.py
        ```
    *   *Tài khoản mặc định:* `admin` / `admin123` `quanlydoi1` / `manager123` `viewer1` / `viewer123`

6.  **Chạy Backend Server**:
    ```bash
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```
    *Backend sẽ chạy tại: `http://localhost:8000`*

## 3. Thiết lập Frontend

1.  **Di chuyển vào thư mục frontend** (mở terminal mới):
    ```bash
    cd frontend
    ```

2.  **Cài đặt các thư viện Node.js**:
    ```bash
    npm install
    ```

3.  **Cập nhật API Client (Nếu Backend có thay đổi)**:
    Nếu code mới có thay đổi về API Backend, bạn cần cập nhật client cho frontend:
    *   Đảm bảo Backend đang chạy ở bước 2.
    *   Chạy lệnh:
        ```bash
        npm run generate-client
        ```

4.  **Chạy Frontend Server**:
    ```bash
    npm run dev
    ```
    *Frontend sẽ chạy tại: `http://localhost:5173`*

## 4. Kiểm tra hoạt động

1.  Truy cập `http://localhost:5173` trên trình duyệt.
2.  Đăng nhập với các tài khoản ở trên.

## 5. Xử lý lỗi thường gặp

*   **Lỗi "Network Error" hoặc không đăng nhập được**:
    *   Kiểm tra xem Backend có đang chạy không.
    *   Kiểm tra file `frontend/.env` (nếu có). Đảm bảo không set cứng `VITE_API_URL` nếu đang chạy local để tận dụng Proxy của Vite.
    *   Thử xóa `node_modules` và chạy lại `npm install`.

*   **Lỗi "Internal Server Error" khi đăng nhập**:
    *   Do lỗi thư viện `bcrypt` và `passlib`. Đảm bảo file `backend/app/core/security.py` đã được patch (code mới nhất đã xử lý việc này).

*   **Lỗi "resolution too deep" khi chạy pip install**:
    *   Do xung đột phiên bản các thư viện. File `backend/requirements.txt` đã được cập nhật để fix lỗi này.
    *   Hãy thử chạy `pip install -r requirements.txt` lại.
    *   Nếu vẫn lỗi, hãy chạy `python -m pip install --upgrade pip` trước.
