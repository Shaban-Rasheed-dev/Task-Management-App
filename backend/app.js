import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

const port = process.env.PORT || 5001;
//middlerwares
app.use(express.json());
app.use(cookieParser());
// api end points
app.use("/api/auth/user", userRouter);
app.get("/", (req, res) => {
  res.send("backend working");
});

//error middleware
app.use(errorMiddleware);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
  });
});
