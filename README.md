# Employee Management System (EMS) – Backend

Backend service untuk **Employee Management System (EMS)** PT Nusantara Digital.

Sistem ini menangani:

- Autentikasi Admin (JWT)
- CRUD Data Karyawan
- Background Job menggunakan Redis Queue
- Import CSV besar (20.000+ rows) dengan streaming
- Realtime Notification (SSE)

---

## 🛠 Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- Redis + BullMQ
- JWT Authentication
- bcrypt (password hashing)
- Multer + csv-parser (CSV streaming)
- Jest (Unit Test)

---

## 📦 Prerequisites

Pastikan sudah terinstall:

- Node.js >= 18
- PostgreSQL
- Redis
- npm

---

## ⚙️ Environment Variables

Buat file `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db_hr?schema=public"
ORIGIN_URL=http://localhost:3000
PORT=4000
TOKEN_KEY=abcdefghijklmnopqrstuvwxyz
```
