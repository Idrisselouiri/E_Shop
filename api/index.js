import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";

dotenv.config();
// connect mongoDb
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

//listen server on port 3000
app.listen(3000, () => {
  console.log("Sever is running on port 3000");
});

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Interval Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
