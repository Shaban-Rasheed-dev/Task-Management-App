import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/authRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { userRouter } from "./routes/userRoutes.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import { categoryRouter } from "./routes/categoryRouter.js";
import { taskRouter } from "./routes/taskRouter.js";
import { commentRouter } from "./routes/commentRoutes.js";
dotenv.config();
cloudinaryConnect();
//app configration
const app = express();

//port defined
const port = process.env.PORT || 4000;

//middlerwares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/comments", commentRouter);

app.use(errorMiddleware);
app.use("/api/auth", authMiddleware);
//end point
app.get("/", (req, res) => {
  res.send("API WORKING");
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`server is runnig od port http://localhost:${port}`);
  });
});
