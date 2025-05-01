import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch todos from the backend
  useEffect(() => {
    axios.get('http://localhost:3000/todo/1')  // Assuming you are using GET /todo/<id> endpoint for testing.
      .then(response => {
        setTodos([response.data]); // Replace with actual logic to fetch all todos.
      })
      .catch(error => console.log(error));
  }, []);

  // Add a new Todo
  const addTodo = () => {
    if (!newTodo) return;

    const todo = { text: newTodo, createdAt: new Date().toISOString() };
    axios.post('http://localhost:3000/todo', todo)  // Assuming POST request for adding a new Todo
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodo('');
      })
      .catch(error => console.log(error));
  };

  // Edit a Todo
  const editTodo = (todo) => {
    setEditingTodo(todo);
  };

  // Save the edited Todo
  const saveTodo = () => {
    axios.put(`http://localhost:3000/todo/${editingTodo.id}`, editingTodo)
      .then(response => {
        setTodos(todos.map(todo => (todo.id === editingTodo.id ? editingTodo : todo)));
        setEditingTodo(null);
      })
      .catch(error => console.log(error));
  };

  // Delete a Todo with confirmation
  const deleteTodo = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeletion = () => {
    axios.delete(`http://localhost:3000/todo/${confirmDelete}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== confirmDelete));
        setConfirmDelete(null);
      })
      .catch(error => console.log(error));
  };

  const cancelDeletion = () => {
    setConfirmDelete(null);
  };

  const handleChange = (e) => {
    if (editingTodo) {
      setEditingTodo({ ...editingTodo, text: e.target.value });
    } else {
      setNewTodo(e.target.value);
    }
  };

  const renderTodos = () => {
    return todos.map(todo => (
      <div key={todo.id} className="todo-item">
        {editingTodo && editingTodo.id === todo.id ? (
          <input 
            type="text" 
            value={editingTodo.text} 
            onChange={handleChange} 
          />
        ) : (
          <span>{todo.text} - {new Date(todo.createdAt).toLocaleString()}</span>
        )}

        <div className="actions">
          {editingTodo && editingTodo.id === todo.id ? (
            <button onClick={saveTodo}>Save</button>
          ) : (
            <button onClick={() => editTodo(todo)}>Edit</button>
          )}
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>

      <div className="todo-input">
        <input
          type="text"
          value={editingTodo ? editingTodo.text : newTodo}
          onChange={handleChange}
          placeholder="Enter new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {confirmDelete && (
        <div className="confirm-delete">
          <p>Are you sure you want to delete this Todo?</p>
          <button onClick={confirmDeletion}>Yes</button>
          <button onClick={cancelDeletion}>No</button>
        </div>
      )}

      <div className="todos-list">
        {renderTodos()}
      </div>
    </div>
  );
};

export default App;
