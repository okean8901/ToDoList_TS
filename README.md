# 📝 Ứng Dụng Quản Lý Công Việc (Todo List)

Ứng dụng web full-stack để quản lý công việc hàng ngày với xác thực JWT an toàn.

## 🎯 Tính Năng

- ✅ Đăng ký & Đăng nhập
- ✅ Tạo, sửa, xóa công việc
- ✅ Đánh dấu hoàn thành
- ✅ Quản lý phiên làm việc với JWT

---

## 💻 Công Nghệ Sử Dụng

**Backend**: NestJS, TypeScript, MongoDB, Mongoose, JWT, Passport, bcrypt  
**Frontend**: Next.js, React, TypeScript, Tailwind CSS, Axios  
**Yêu cầu**: Node.js v18+, npm, MongoDB

---

## 🚀 Cài Đặt & Chạy

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Chỉnh sửa nếu cần
npm run start:dev     # Chạy tại http://localhost:3001
```

**File `.env` (nếu cần thay đổi):**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/todolist
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local  # Chỉnh sửa nếu cần
npm run dev                        # Chạy tại http://localhost:3000
```

**File `.env.local` (nếu cần thay đổi):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### MongoDB

**Local:**
```bash
mongosh
```

**Cloud (Atlas):**
- Tạo tài khoản tại https://www.mongodb.com/cloud/atlas
- Lấy connection string và cập nhật `MONGODB_URI` trong `backend/.env`

---

## 📂 Cấu Trúc Dự Án

```
backend/
├── src/modules/
│   ├── auth/          # Xác thực & JWT
│   ├── users/         # Quản lý người dùng
│   ├── todos/         # Quản lý công việc
│   └── schemas/       # Database schemas
├── .env
└── package.json

frontend/
├── src/app/           # Pages
├── src/components/    # React components
├── src/lib/           # API client & types
├── .env.local
└── package.json
```

---

## 🔌 API Endpoints

```
POST   /api/auth/register      # Đăng ký
POST   /api/auth/login         # Đăng nhập
POST   /api/auth/refresh       # Làm mới token
POST   /api/auth/logout        # Đăng xuất

GET    /api/todos              # Lấy danh sách todos
POST   /api/todos              # Tạo todo
PUT    /api/todos/:id          # Cập nhật todo
DELETE /api/todos/:id          # Xóa todo

GET    /api/users/:id          # Lấy thông tin user
```

---

## 🧪 Kiểm Tra Ứng Dụng

1. Mở http://localhost:3000
2. Đăng ký tài khoản mới
3. Tạo, chỉnh sửa, xóa công việc
4. Đăng xuất và đăng nhập lại

---

## 🔐 Bảo Mật

- Mật khẩu được mã hóa bằng **bcrypt**
- JWT tokens (access: 15m, refresh: 7d)
- Tokens lưu trong **HTTP-only cookies**
- CORS được cấu hình an toàn
- Production: HTTPS bắt buộc

---

## 🛠️ Các Lệnh Hữu Ích

**Backend:**
```bash
npm install              # Cài dependencies
npm run start:dev        # Chạy dev mode
npm run build            # Build production
npm run start:prod       # Chạy production
```

**Frontend:**
```bash
npm install              # Cài dependencies
npm run dev              # Chạy dev mode
npm run build            # Build production
npm run start            # Chạy production
```

---

## 🐛 Xử Lý Sự Cố

| Vấn đề | Giải pháp |
|--------|-----------|
| MongoDB không kết nối | Kiểm tra MongoDB đang chạy, kiểm tra `MONGODB_URI` |
| Port 3000/3001 đã dùng | Đổi port trong `.env` hoặc kill process đang chiếm |
| CORS error | Kiểm tra `FRONTEND_URL` trong `backend/.env` |
| Không kết nối API | Kiểm tra `NEXT_PUBLIC_API_URL` trong `frontend/.env.local` |
| JWT error | Kiểm tra `JWT_SECRET` được đặt trong `backend/.env` |

---

## 📚 Tài Liệu Tham Khảo

- [NestJS](https://docs.nestjs.com/)
- [Next.js](https://nextjs.org/docs)
- [MongoDB](https://docs.mongodb.com/)
- [JWT](https://jwt.io/)

---

## 🚀 Deployment

**Backend (Heroku):**
```bash
heroku create your-app
heroku config:set JWT_SECRET=your-secret MONGODB_URI=your-uri
git push heroku main
```

**Frontend (Vercel):**
```bash
vercel
vercel env add NEXT_PUBLIC_API_URL
vercel --prod
```
