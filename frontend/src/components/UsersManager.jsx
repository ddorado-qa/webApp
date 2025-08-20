// Este componente contiene TODO lo que tenías en tu App.jsx original,
// incluido el CRUD de usuarios y login. Se mantiene la compatibilidad
// con los datatest-id usados en los tests de Playwright.

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Usamos la variable de entorno VITE_API_URL (vite expone VITE_* en import.meta.env)
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function UsersManager() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('user');
  const [subscribe, setSubscribe] = useState(false);
  const [editId, setEditId] = useState(null);

  // Refrescar lista cuando cambie message (misma lógica que tenías)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users`);
        setUsers(res.data || []);
      } catch (e) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [message]);

  // Registrar o actualizar (mantiene compatibilidad con tu flujo)
  const handleRegisterOrUpdate = async () => {
    try {
      if (editId) {
        const res = await axios.put(`${API}/users/${editId}`, { username, password });
        setMessage(`Updated user: ${res.data.username}`);
      } else {
        const res = await axios.post(`${API}/register`, { username, password });
        setMessage(`Registered user: ${res.data.username}`);
      }
      setUsername('');
      setPassword('');
      setEditId(null);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error during save');
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setMessage(`Logged in as: ${res.data.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error during login');
    }
  };

  // Editar (cargar datos en el formulario)
  const handleEdit = (user) => {
    setUsername(user.username);
    setPassword('');
    setEditId(user.id);
  };

  // Eliminar
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/users/${id}`);
      setMessage(`Deleted user with id: ${id}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error during delete');
    }
  };

  return (
    <div className="container">
      {/* Mantengo el mismo título y datatest-id que tus tests esperan */}
      <h1 datatest-id="title">Microfrontend Starter</h1>

      <div className="row">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          datatest-id="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div className="row">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          datatest-id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <div className="row">
        <label htmlFor="role">Role (select)</label>
        <select
          id="role"
          datatest-id="roleSelect"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="row">
        <label>
          <input
            datatest-id="subscribeToggle"
            type="checkbox"
            checked={subscribe}
            onChange={e => setSubscribe(e.target.checked)}
          />
          Subscribe to newsletter
        </label>
      </div>

      <div style={{ marginTop: '1rem' }} className="row">
        <button datatest-id="registerBtn" onClick={handleRegisterOrUpdate}>
          {editId ? 'Update' : 'Register'}
        </button>
        <button datatest-id="loginBtn" onClick={handleLogin} style={{ marginLeft: '1rem' }}>
          Login
        </button>
      </div>

      <div style={{ marginTop: '1rem' }} datatest-id="message" className="row">
        {message}
      </div>

      <hr />

      <h2>Users</h2>
      <table datatest-id="usersTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>#</th><th>Username</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
