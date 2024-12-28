import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import authRouter from "./routes/auth.routes.js";
import testRouter from "./routes/test.routes.js";
import questionRouter from "./routes/question.routes.js";
import attemptRouter from "./routes/attempt.routes.js";

import User from "./models/user.model.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Login route should not use auth
app.use("/api/v1/auth", authRouter);

app.use(async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = user;
  }
  next();
});

// Routes go here
app.use("/api/v1/tests", testRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/attempts", attemptRouter);

export default app;
