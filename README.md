# 📦 Employee Management System (EMS)

Backend API built with **Node.js + TypeScript + Express**, using **PostgreSQL (Prisma ORM)**, **Redis (BullMQ Worker)**, and **Jest** for testing.

---

## 📋 Tech Stack

- Node.js ≥ 18
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ (Background Worker)
- Jest + Supertest

---

## 📁 Project Structure

```
server/
├─ src/
│  ├─ index.ts
│  ├─ routes/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ workers/
│  │  └─ employee.ts
│  ├─ db/
│  │  └─ prisma.ts
│  └─ libs/
│     └─ redis.ts
├─ dist/
├─ prisma/
│  └─ schema.prisma
├─ .env (in production)
├─ .env.local
├─ jest.config.js
├─ tsconfig.json
└─ package.json
```

---

# ⚙️ Prerequisites

Make sure you have:

- **Node.js** ≥ 18
- **PostgreSQL**
- **Redis**
- **npm** or **yarn**

---

# 🚀 Setup From Zero (Development)

## 1️⃣ Clone Repository

```bash
git clone https://github.com/rakasiwisurya/employee-management-system-api.git
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Environment Setup (Development)

Create `.env.local`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db_hr?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=4000
ORIGIN_URL=http://localhost:3000
TOKEN_KEY=abcdefghijklmnopqrstuvwxyz
```

---

## 4️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

## 5️⃣ Run Database Migration

```bash
npx prisma migrate dev
```

---

## 6️⃣ Run Development Mode (API + Worker)

```bash
npm run dev
```

This will start:

- Express API
- BullMQ Worker
- TypeScript watch mode

---

## 7️⃣ Verify Services

- API: `http://localhost:3000`
- Redis running
- Worker log:

```bash
Employee worker running...
```

---

# 🧪 Run Tests

```bash
npm run test
```

Optional:

```bash
npm run test:watch
npm run test:coverage
```

---

# 🚀 Production Setup

## 1️⃣ Environment Setup

Create `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db_hr?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=4000
ORIGIN_URL=http://localhost:3000
TOKEN_KEY=abcdefghijklmnopqrstuvwxyz
```

---

## 2️⃣ Build Project

```bash
npm run build
```

---

## 3️⃣ Run Migration

```bash
npx prisma migrate deploy
```

---

## 4️⃣ Run API

```bash
npm run start
```

---

## 5️⃣ Run Worker

```bash
npm run start:worker
```

---

# 🧠 Important Notes

- `.env.local` is loaded manually via `dotenv`
- Worker and API run in **separate processes**
- Redis must be running
- Prisma batch insert uses `createMany`

---

# ✅ Ready to Submit

This project includes:

- Authentication (JWT)
- CRUD Employee
- CSV Import with Worker
- Redis Queue
- Unit Tests
- Production-ready setup
