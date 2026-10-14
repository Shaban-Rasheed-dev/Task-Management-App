# Task Management System

A full-stack task management application built with the MERN stack. Users can sign up, log in, and manage their tasks through a clean, responsive interface.

## Features

- User signup and signin with JWT authentication
- Password hashing with bcrypt
- Protected routes using auth middleware
- Create, view, update, and delete tasks
- Input validation (Zod)
- Responsive UI built with Tailwind CSS

> Edit this list so it matches what your app actually does.

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Auth:** JSON Web Tokens (JWT), bcrypt

## Project Structure

```
task-management-system/
├── client/          # React frontend
│   └── src/
└── server/          # Express backend
    ├── models/
    ├── controllers/
    ├── routes/
    └── middleware/
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository

```bash
git clone https://github.com/Shaban-Rasheed-dev/task-management-system.git
cd task-management-system
```

2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder (see `.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```

3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

The app will run at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

## API Endpoints

| Method | Endpoint            | Description            | Auth |
| ------ | ------------------- | ---------------------- | ---- |
| POST   | `/api/auth/signup`  | Register a new user    | No   |
| POST   | `/api/auth/signin`  | Log in and get a token | No   |
| GET    | `/api/tasks`        | Get all tasks          | Yes  |
| POST   | `/api/tasks`        | Create a task          | Yes  |
| PUT    | `/api/tasks/:id`    | Update a task          | Yes  |
| DELETE | `/api/tasks/:id`    | Delete a task          | Yes  |

> Change these routes to match your own.

## Screenshots

Add screenshots of your app here:

```
![Login](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)
```

## What I Learned

- Building a REST API with Express and MongoDB
- Implementing secure authentication with JWT and bcrypt
- Structuring a full-stack project into models, controllers, and routes
- Connecting a React frontend to a protected backend

## Future Improvements

- Task categories and priorities
- Due dates and reminders
- Role-based access (admin panel)
- Deployment

## Author

**Shaban Rasheed**
GitHub: [Shaban-Rasheed-dev](https://github.com/Shaban-Rasheed-dev)
