# Task Management System (MERN Stack)

A full-stack Task Management System built with MongoDB, Express.js, React.js, and Node.js. Includes JWT authentication with httpOnly cookies, Zod-based request validation, and centralized error handling.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt, httpOnly cookies
- **Validation:** Zod

## ✅ Features Implemented

### Authentication

- User signup with Zod schema validation (name, email, password)
- Password hashing with bcrypt before storing in the database
- Duplicate email handling (checked before insert, and on the unique index as a race-condition fallback)
- Login with JWT, issued as an httpOnly cookie (not exposed to client-side JS)
- "Remember Me" login option — conditional token/cookie expiry (30 days when checked, 1 day / session cookie when not)
- Logout endpoint that clears the auth cookie
- `role` field defaults to `"employee"` on signup and is server-controlled (not accepted from the request body)

### Middleware

- `authMiddleware` — reads the JWT from the cookie, verifies it, and attaches the decoded payload to `req.user` for use in protected routes
- `validateSchema` — generic Zod validation middleware, reusable across any route by passing in a schema
- `errorMiddleware` — centralized error handler; every controller and middleware calls `next(error)` instead of sending its own error response, so all errors return a consistent `{ success, message, extraDetails }` shape

## 📂 Project Structure

```
backend/
  config/          # DB connection
  controllers/      # authController (register, login, logout)
  middlewares/       # authMiddleware, validateMiddleware, errorMiddleware
  models/            # userModel (Mongoose schema)
  routes/            # authRoutes
  validators/         # userValidator (Zod schemas)
  app.js / server.js
```

## 🔐 Environment Variables

Create a `.env` file (not committed) with:

```
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## 🧪 Running Locally

```bash
cd backend
npm install
npm run dev
```

## 📌 API Endpoints

| Method | Endpoint           | Description                      | Protected |
| ------ | ------------------ | -------------------------------- | --------- |
| POST   | /api/auth/register | Register a new user              | No        |
| POST   | /api/auth/login    | Log in, sets JWT httpOnly cookie | No        |
| POST   | /api/auth/logout   | Log out, clears the auth cookie  | No        |

## 🔜 Planned Next

- [ ] Protected routes for actual app features (profile, tasks)
- [ ] Role-based access control (Admin / Employee)
- [ ] Task CRUD (create, assign, update status)
- [ ] Category module
- [ ] React frontend (auth pages, protected routing)
