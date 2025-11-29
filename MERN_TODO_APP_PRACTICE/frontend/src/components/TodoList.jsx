import { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = "http://localhost:8000/api/todos";

  //! ADD TODO
  const addTodo = async () => {
    try {
      if (!todoText) return;

      const newTodo = {
        title: todoText,
      };

      const addedTodo = await axios.post(API_URL, newTodo);

      setTodos([...todos, addedTodo.data.todo]);

      setTodoText("");
    } catch (error) {
      console.log("Error Adding New Todo: ", error);
    }
  };

  //! DELETE TODO
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const clickedTodo = todos.filter((todo) => (todo._id || todo.id) !== id);
      setTodos(clickedTodo);
    } catch (error) {
      console.log("Error while deleting..", error);
    }
  };

  //! FETCHING TODO DETAILS
  const fetchUpdatingDetails = async (todo) => {
    setTodoText(todo.title);
    setEditingId(todo._id);
    setIsEditing(true);
  };

  //! UPDATE TODO
  const updateTodo = async () => {
    try {
      if (!todoText) return;

      const updateTodoBody = {
        title: todoText,
      };

      const res = await axios.put(`${API_URL}/${editingId}`, updateTodoBody);

      const updatedTodo = res.data.todo;

      // Upate the todos array:
      const updateArrayList = todos.map((todo) =>
        todo._id === editingId ? updatedTodo : todo
      );

      setTodos(updateArrayList);

      // revert everything to normal
      setTodoText("");
      setEditingId(null);
      setIsEditing(false);
    } catch (error) {
      console.log("Error while Updating Todo: ", error);
    }
  };

  //! CANCEL EDIT
  const cancelEdit = () => {
    setTodoText("");
    setIsEditing(false);
    setEditingId(null);
  };

  //! TOGGLE COMPLETE
  const toggleComplete = async (todo) => {
    try {
      const updatedBody = {
        title: todo.title,
        completed: !todo.completed,
      };

      const res = await axios.put(`${API_URL}/${todo._id}`, updatedBody);

      const updatedTodo = res.data.todo;

      const updateArrayList = todos.map((t) =>
        t._id === todo._id ? updatedTodo : t
      );

      setTodos(updateArrayList);
    } catch (error) {
      console.log("Error while Toggle Complete: ", error);
    }
  };

  useEffect(() => {
    //! FETCH TODO'S
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API_URL);
        console.log("DATA FROM BACKEND: ", res.data);
        setTodos(res.data.todo || res.data);
      } catch (error) {
        console.log("Error fetching TODOS...", error);
        setTodos([]);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todo Application</h1>

      <input
        type="text"
        placeholder="Enter your todo..."
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <button onClick={isEditing ? updateTodo : addTodo}>
        {isEditing === true ? "Update" : "Add"}
      </button>

      {isEditing && <button onClick={cancelEdit}>Cancel</button>}

      <div>
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo._id || todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                />
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.title}
                </span>{" "}
                <button onClick={() => fetchUpdatingDetails(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo._id || todo.id)}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
