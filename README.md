# Maruti Krushiseva Kendra

An agricultural store website for farmers to browse products and contact the store, with an admin panel to manage inventory.

## Tech Stack

| Side | Tech |
|------|------|
| Frontend | React, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) |
| Auth | JWT + bcryptjs |
| Images | Cloudinary |

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo>
cd MarutiKrushisevaKendra
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev            # runs on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env   # fill in your values
npm run dev            # runs on http://localhost:5173
```

### 4. Seed the Database (optional)

```bash
cd server
npm run seed
```

> ⚠️ This clears all existing data. Do not run in production.

## Environment Variables

**`server/.env`**
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_STORE_NAME=
VITE_STORE_PHONE=
VITE_STORE_WHATSAPP=   # no + prefix
VITE_STORE_ADDRESS=
VITE_GOOGLE_MAPS_URL=
```

## Admin Panel

After seeding, log in at `http://localhost:5173/admin/login` using the email and password set in `server/.env`.

---

*Built for local farmers.*
