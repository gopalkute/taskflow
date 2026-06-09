# TaskFlow — MERN Task Management Application

A complete, production-ready task management web application built with the MERN stack. Features JWT authentication, full CRUD operations, search, filtering, pagination, dark/light mode, and a modern responsive UI.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Register, Login, Logout with JWT |
| ✅ Task CRUD | Create, Read, Update, Delete tasks |
| 🔄 Status Toggle | Mark tasks as completed or pending |
| 🔍 Search | Real-time debounced search |
| 🎛️ Filter | Filter by status and priority |
| 📄 Pagination | Paginated task list |
| 👤 Profile | View and update profile |
| 🌙 Dark Mode | Full light/dark theme |
| 📱 Responsive | Mobile, tablet, desktop optimized |
| 📊 Dashboard | Stats: total, completed, pending, rate |
| 📚 Swagger Docs | Auto-generated API documentation |
| 🧪 Tests | Jest + Supertest API tests |

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Axios, Tailwind CSS, Context API, React Hot Toast, Vite

**Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, express-validator, Helmet, Morgan

**Database:** MongoDB

**Testing:** Jest, Supertest

---

## 📁 Folder Structure

```
taskflow/
├── package.json              ← Root scripts (run both servers)
├── server/
│   ├── config/
│   │   ├── db.js             ← MongoDB connection
│   │   └── swagger.js        ← Swagger/OpenAPI config
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js           ← JWT protect middleware
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── task.test.js
│   ├── utils/
│   │   └── jwt.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   └── taskValidators.js
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── auth/           ← ProtectedRoute
    │   │   ├── common/         ← Spinner, Modal, EmptyState, Pagination, Skeleton
    │   │   ├── layout/         ← Navbar, Sidebar, Layout
    │   │   └── tasks/          ← TaskCard, TaskModal, StatsCards
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── hooks/
    │   │   ├── useTasks.js
    │   │   └── useDebounce.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── TaskDetail.jsx
    │   │   ├── Profile.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── taskService.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ ([download](https://nodejs.org))
- MongoDB v6+ running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- npm v9+

---

### Step 1 — Clone / Extract

```bash
# If downloaded as zip, extract it, then:
cd taskflow
```

### Step 2 — Configure Environment

```bash
# Server environment
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskflow   # or your Atlas URI
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3 — Install Dependencies

```bash
# Install root tools
npm install

# Install all dependencies (server + client)
npm run install:all
```

### Step 4 — Run the Application

```bash
# Start both backend and frontend together
npm run dev
```

This runs:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:5173
- **API Docs** → http://localhost:5000/api/docs

---

## 📋 API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, get JWT |
| GET | `/api/auth/profile` | Private 🔒 | Get current user |
| PUT | `/api/auth/profile` | Private 🔒 | Update name |

### Task Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tasks` | Private 🔒 | List tasks (search, filter, paginate) |
| GET | `/api/tasks/stats` | Private 🔒 | Dashboard statistics |
| GET | `/api/tasks/:id` | Private 🔒 | Get single task |
| POST | `/api/tasks` | Private 🔒 | Create task |
| PUT | `/api/tasks/:id` | Private 🔒 | Update task |
| DELETE | `/api/tasks/:id` | Private 🔒 | Delete task |
| PATCH | `/api/tasks/:id/status` | Private 🔒 | Toggle status |

### Query Parameters for GET /api/tasks

```
?status=pending|completed
?priority=low|medium|high
?search=keyword
?page=1
?limit=10
?sortBy=createdAt
?order=asc|desc
```

### Authentication

All protected routes require the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🗄️ Database Schema

### User Collection
```js
{
  name:      String,   // required, 2-50 chars
  email:     String,   // required, unique, lowercase
  password:  String,   // bcrypt hashed, select: false
  createdAt: Date,     // auto
  updatedAt: Date      // auto
}
```

### Task Collection
```js
{
  title:       String,             // required, 2-100 chars
  description: String,             // optional, max 500 chars
  status:      "pending"|"completed",  // default: "pending"
  priority:    "low"|"medium"|"high",  // default: "medium"
  dueDate:     Date,               // optional
  userId:      ObjectId,           // ref: User, required
  createdAt:   Date,               // auto
  updatedAt:   Date                // auto
}
```

---

## 🧪 Running Tests

Make sure MongoDB is running, then:

```bash
# Run all API tests
npm run test

# Or from server directory
cd server && npm test
```

Tests cover:
- ✅ User registration (success, duplicate, invalid)
- ✅ User login (success, wrong password, not found)
- ✅ Profile retrieval (auth, no token, invalid token)
- ✅ Task CRUD (create, read, update, delete)
- ✅ Status toggle
- ✅ Search and filter
- ✅ Dashboard stats

---

## 📚 Swagger API Documentation

After starting the server, visit:
```
http://localhost:5000/api/docs
```

The Swagger UI provides interactive documentation for all endpoints. Click **Authorize** and enter your JWT token to test protected routes.

---

## 🌙 Dark Mode

Click the moon/sun icon in the navbar to toggle. The preference is saved to localStorage and persists across sessions.

---

## 🚢 Deployment Guide

### Backend (Render / Railway)

1. Create a new **Web Service**
2. Set the root directory to `server/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables from `server/.env`
6. Set `NODE_ENV=production`

### Frontend (Vercel / Netlify)

1. Set root directory to `client/`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add env: `VITE_API_URL=https://your-backend-url.com/api`

### Database (MongoDB Atlas)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist your server IP (or 0.0.0.0/0 for development)
3. Copy the connection string to `MONGO_URI`

---

## 🔒 Security Features

- **Helmet** — sets secure HTTP headers
- **CORS** — restricted to frontend origin
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **JWT** — stateless authentication, 7-day expiry
- **bcrypt** — 12-round password hashing
- **express-validator** — input validation on all endpoints
- **Password hidden** — `select: false` in User schema

---

## 👨‍💻 Environment Variables Reference

### server/.env
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_super_long_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📝 License

MIT — free to use for personal and commercial projects.

---

Built with ❤️ using the MERN Stack
