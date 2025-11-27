import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.js";
import { connectDB } from "./config/db.js";

//* Go and find the secret key's from .env file
dotenv.config();

//* Create the Express Application
const app = express();

//* Convert the incoming json data from client to Javascript Object
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.listen(8000, () => {
  connectDB();
  console.log("Server is Ready at http://localhost:8000/api/todos");
});
