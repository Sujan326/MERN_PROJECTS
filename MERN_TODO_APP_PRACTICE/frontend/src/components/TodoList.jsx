// * Importing necessary React hooks and axios
import { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

function TodoList() {
  // ! STATE VARIABLES
  // ? todos → holds list of all todos coming from backend
  const [todos, setTodos] = useState([]);

  // ? todoText → stores whatever user types in input box
  const [todoText, setTodoText] = useState("");

  // ? editingId → stores the ID of the todo currently being edited
  const [editingId, setEditingId] = useState(null);

  // ? isEditing → true/false to toggle between Add button and Update button
  const [isEditing, setIsEditing] = useState(false);

  // * Backend API URL
  const API_URL = "http://localhost:8000/api/todos";

  // -------------------------------------------------------------
  // ! ADD TODO
  // -------------------------------------------------------------
  const addTodo = async () => {
    try {
      // ? If input is empty, don't add anything
      if (!todoText) return;

      // ? Create body to send to backend
      const newTodo = {
        title: todoText,
      };

      // ? POST request to add todo
      const addedTodo = await axios.post(API_URL, newTodo);

      // ? Add the new todo to our UI list
      setTodos([...todos, addedTodo.data.todo]);

      // ? Clear input box
      setTodoText("");
    } catch (error) {
      console.log("Error Adding New Todo: ", error);
    }
  };

  // -------------------------------------------------------------
  // ! DELETE TODO
  // -------------------------------------------------------------
  const deleteTodo = async (id) => {
    try {
      // ? Delete todo from backend
      await axios.delete(`${API_URL}/${id}`);

      // ? Filter it out from UI list
      const clickedTodo = todos.filter((todo) => (todo._id || todo.id) !== id);

      setTodos(clickedTodo);
    } catch (error) {
      console.log("Error while deleting..", error);
    }
  };

  // -------------------------------------------------------------
  // ! FETCH TODO DETAILS FOR EDITING
  // -------------------------------------------------------------
  const fetchUpdatingDetails = async (todo) => {
    // ? Load todo title into input box
    setTodoText(todo.title);

    // ? Set editing mode for this ID
    setEditingId(todo._id);

    // ? Switch Add → Update mode
    setIsEditing(true);
  };

  // -------------------------------------------------------------
  // ! UPDATE TODO
  // -------------------------------------------------------------
  const updateTodo = async () => {
    try {
      // ? If input is empty, don't update anything
      if (!todoText) return;

      // ? Body with new value
      const updateTodoBody = {
        title: todoText,
      };

      // ? PUT request to backend to update todo
      const res = await axios.put(`${API_URL}/${editingId}`, updateTodoBody);

      const updatedTodo = res.data.todo;

      // ? Replace old todo with updated one inside list
      const updateArrayList = todos.map((todo) =>
        todo._id === editingId ? updatedTodo : todo
      );

      setTodos(updateArrayList);

      // ? Reset everything back to normal
      setTodoText("");
      setEditingId(null);
      setIsEditing(false);
    } catch (error) {
      console.log("Error while Updating Todo: ", error);
    }
  };

  // -------------------------------------------------------------
  // ! CANCEL EDIT MODE
  // -------------------------------------------------------------
  const cancelEdit = () => {
    // ? Clear input
    setTodoText("");

    // ? Turn editing off
    setIsEditing(false);

    // ? No todo is being edited now
    setEditingId(null);
  };

  // -------------------------------------------------------------
  // ! TOGGLE COMPLETED STATUS
  // -------------------------------------------------------------
  const toggleComplete = async (todo) => {
    try {
      // ? Prepare request body
      const updatedBody = {
        title: todo.title, // title stays same
        completed: !todo.completed, // completed toggles
      };

      // ? Send update request to backend
      const res = await axios.put(`${API_URL}/${todo._id}`, updatedBody);

      const updatedTodo = res.data.todo;

      // ? Replace updated todo in UI list
      const updateArrayList = todos.map((t) =>
        t._id === todo._id ? updatedTodo : t
      );

      setTodos(updateArrayList);
    } catch (error) {
      console.log("Error while Toggle Complete: ", error);
    }
  };

  // -------------------------------------------------------------
  // ! FETCH TODOS (RUNS ONLY ON PAGE LOAD)
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API_URL);

        console.log("DATA FROM BACKEND: ", res.data);

        // ? Some backends send data.todo, some send just data
        setTodos(res.data.todo || res.data);
      } catch (error) {
        console.log("Error fetching TODOS...", error);
        setTodos([]);
      }
    };

    fetchTodos();
  }, []); // empty array = run once

  // -------------------------------------------------------------
  // ! UI SECTION (RENDER)
  // -------------------------------------------------------------
  return (
    <div className="todo-container">
      <h1>Todo Application</h1>

      {/* Input + Add/Update/Cancel Buttons */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter your todo..."
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />

        {/* Button changes based on isEditing */}
        <button
          className={isEditing ? "update-btn" : "add-btn"}
          onClick={isEditing ? updateTodo : addTodo}
        >
          {isEditing ? "Update" : "Add"}
        </button>

        {/* Cancel button only visible during editing */}
        {isEditing && (
          <button className="cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id || todo.id}>
            {/* Completed checkbox */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
            />

            {/* Todo title with strike-through if completed */}
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>

            {/* Edit button */}
            <button
              className="edit-btn"
              onClick={() => fetchUpdatingDetails(todo)}
            >
              Edit
            </button>

            {/* Delete button */}
            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo._id || todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
