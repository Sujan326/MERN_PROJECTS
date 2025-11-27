import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import todoRouter from "./routes/todoRouter.js"

//* Load .env
dotenv.config();

//* create express app
const app = express();

//* middleware: express.json + cors
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//* connect to DB
connectDB();

//* simple test route returning server running..
app.get("/", (req, res) => {
  res.send("Server Running");
});

//* router
app.use("/api/todos", todoRouter);

//* listen on PORT
app.listen(process.env.PORT, () => {
  console.log(
    `Server is Ready and Running on PORT: http://localhost:${process.env.PORT}/api/todos`
  );
});
