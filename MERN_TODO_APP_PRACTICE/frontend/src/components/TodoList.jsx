import { useState, useEffect } from "react";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");

  //! ADD TODO
  const addTodo = async () => {
    try {
      if (!todoText) return;

      const newTodo = {
        title: todoText,
      };

      const addedTodo = await axios.post(
        "http://localhost:8000/api/todos",
        newTodo
      );

      setTodos([...todos, addedTodo.data.todo]);

      setTodoText("");
    } catch (error) {
      console.log("Error Adding New Todo: ", error);
    }
  };

  //! DELETE TODO
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${id}`);
      const clickedTodo = todos.filter((todo) => (todo._id || todo.id) !== id);
      setTodos(clickedTodo);
    } catch (error) {
      console.log("Error while deleting..", error);
    }
  };

  useEffect(() => {
    //! FETCH TODO'S
    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/todos");
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
      <button onClick={addTodo}>Add</button>

      <div>
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo._id || todo.id}>
                {todo.title}
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
