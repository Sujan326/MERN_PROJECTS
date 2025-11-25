import express from "express";
import { Todo } from "../models/todo.models.js";

const router = express.Router();

// Get All Todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log("Todos: ", todos);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new todo
router.post("/", async (req, res) => {
  console.log("Request body from add a new todo: ", req.body);
  const todo = new Todo({
    text: req.body.text,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a todo (text and/or completed)
router.patch("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    console.log("Todo from Update function: ", todo);
    if (!todo) return res.status(404).json({ message: "Todo Not Found" });

    if (req.body.text !== undefined) {
      // Change the existing todo with the new todo req.body.text
      todo.text = req.body.text;
    }

    if (req.body.completed !== undefined) {
      // Change the existing todo status with the new todo req.body.completed
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;