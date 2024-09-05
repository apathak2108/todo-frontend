import axios from "axios";
import React, { useEffect, useState } from "react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [isEditing, setIsEditing] = useState(null); // Tracks the current task being edited
  const [editTask, setEditTask] = useState(""); // Tracks the input for editing

  useEffect(() => {
    getAllTodos();
  }, []);

  // Fetch all todos
  const getAllTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (err) {
      console.log("error fetching data", err);
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (task === "") return;
    try {
      await axios.post("/api/todos", { task });
      setTask("");
      getAllTodos();
    } catch (err) {
      console.log("Error adding task", err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      getAllTodos();
    } catch (err) {
      console.log("error in deleting todo", err);
    }
  };

  // Edit a todo
  const editTodo = (id, currentTask) => {
    setIsEditing(id); // Set editing mode
    setEditTask(currentTask); // Pre-fill the input with the current task
  };

  // Update a todo
  const updateTodo = async (id) => {
    try {
      await axios.patch(`/api/todos/${id}`, { task: editTask });
      setIsEditing(null); // Exit editing mode
      setEditTask(""); // Clear the input field
      getAllTodos(); // Fetch updated todos
    } catch (err) {
      console.log("Error updating task", err);
    }
  };

  return (
    <div className="todo-app">
      <h1>Todo List</h1>

      {/* Form to add new tasks */}
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {isEditing === todo._id ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
                <button onClick={() => updateTodo(todo._id)}>Save</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                >
                  {todo.task}
                </span>
                <button onClick={() => editTodo(todo._id, todo.task)}>
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
