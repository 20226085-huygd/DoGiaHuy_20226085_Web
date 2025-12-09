# Ứng Dụng Quản Lý Học Sinh (MERN Stack)

Ứng dụng web quản lý học sinh được xây dựng với React (frontend), Express.js (backend), MongoDB (database).

## Tính năng

- ✅ Hiển thị danh sách học sinh
- ✅ Thêm học sinh mới
- ✅ Chỉnh sửa thông tin học sinh
- ✅ Xóa học sinh
- ✅ Tìm kiếm học sinh theo tên
- ✅ Sắp xếp danh sách theo tên (A-Z / Z-A)

## Cài đặt và Chạy

### 1. Khởi động MongoDB với Docker

```bash
cd backend
docker-compose up -d
```

### 2. Chạy Backend (Express)

```bash
cd backend
npm install
npm start
```

Backend sẽ chạy tại: http://localhost:5000

### 3. Chạy Frontend (React)

Mở terminal mới:

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

**Lưu ý:** Nếu cần thay đổi URL API, tạo file `.env` trong thư mục `frontend` với nội dung:
```
REACT_APP_API_URL=http://localhost:5000/api/students
```

## API Endpoints

- `GET /api/students` - Lấy danh sách tất cả học sinh
- `GET /api/students/:id` - Lấy thông tin một học sinh
- `POST /api/students` - Thêm học sinh mới
- `PUT /api/students/:id` - Cập nhật thông tin học sinh
- `DELETE /api/students/:id` - Xóa học sinh

## Cấu trúc Database

```javascript
{
  name: String,    // Họ tên học sinh
  age: Number,     // Tuổi
  class: String    // Lớp học
}
```

## Công nghệ sử dụng

- **Frontend**: React, Axios
- **Backend**: Express.js, Mongoose
- **Database**: MongoDB (Docker)
- **Others**: CORS, Body-Parser
