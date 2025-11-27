import { Todo } from "../models/todoModel.js";

//! CREATE TODO
export const createTodo = async (req, res) => {
  try {
    //* Get Title and description from Body
    const { title, description } = req.body;

    //* If title not found, response 404
    if (!title) return res.status(400).json({ message: "Title is required" });

    //* If title found create a new todo
    const newTodo = await Todo.create({ title, description });

    //* Send the response 201 and new todo
    res.status(201).json({
      todo: newTodo,
      message: "Todo Created Succesfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! GET ALL TODOS
export const getTodos = async (req, res) => {
  try {
    //* Find all the todos using find
    const todos = await Todo.find();

    //* If todos not found send response 404
    if (!todos)
      return res.status(404).json({ message: "Todos Does Not Exist" });

    //* Send response 200 and todos
    res.status(200).json({
      todo: todos,
      message: "Todos Fetched Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! GET TODO BY ID
export const getTodoById = async (req, res) => {
  //* Get the id from params
  const { id } = req.params;
  try {
    //* Find the todo using id
    const todo = await Todo.findById(id);

    //* If todo not found send response 404
    if (!todo) return res.status(404).json({ message: "Todo Does Not Exist" });

    //* If todo found send response 200 and todo
    res.status(200).json({
      todo,
      message: "Todo Fetched Succesfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! UPDATE TODO
export const updateTodo = async (req, res) => {
  //* Get the id from params
  const { id } = req.params;
  try {
    //* Get the title, description and completed from body
    const { title, description, completed } = req.body;

    //* Find the todo by id
    const todo = await Todo.findById(id);

    //* If todo not found send response 404
    if (!todo) return res.status(404).json({ message: "Todo Does Not Exist" });

    //* If todo, completed and description found, update the existing(todo.title) with incoming title from req.body
    if (todo) todo.title = title;
    if (description) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    //* Save the changes
    await todo.save();

    //* Send the response 200 with todo
    res.status(200).json({
      todo,
      message: "Todo Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! DELETE TODO
export const deleteTodo = async (req, res) => {
  //* Get the id from params
  const { id } = req.params;
  try {
    //* Find the todo by id
    const todo = await Todo.findById(id);

    //* If todo not found send response 404
    if (!todo) return res.status(404).json({ message: "Todo Does Not Exist" });

    //* If todo found, delete using findByIdAndDelete
    await Todo.findByIdAndDelete(id);

    res.status(200).json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
