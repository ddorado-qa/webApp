import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración de API y sesión con valores por defecto
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Valores por defecto de sesión (pueden venir del backend o env)
const DEFAULT_SESSION = {
  secret: 'defaultSecret123',
  maxAge: 3600000,
  role: 'user',
  subscribe: false,
};

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(DEFAULT_SESSION.role);
  const [subscribe, setSubscribe] = useState(DEFAULT_SESSION.subscribe);
  const [editId, setEditId] = useState(null);
  const [sessionConfig, setSessionConfig] = useState(DEFAULT_SESSION);

  // Cargar configuración de sesión desde backend
  useEffect(() => {
    const fetchSessionConfig = async () => {
      try {
        const res = await axios.get(`${API}/session-config`);
        const config = res.data || {};
        setSessionConfig({
          secret: config.secret || DEFAULT_SESSION.secret,
          maxAge: config.maxAge || DEFAULT_SESSION.maxAge,
          role: config.role || DEFAULT_SESSION.role,
          subscribe: config.subscribe ?? DEFAULT_SESSION.subscribe,
        });
      } catch (err) {
        console.warn('[SESSION] No se pudo cargar configuración desde backend, usando valores por defecto.');
        setSessionConfig(DEFAULT_SESSION);
      }
    };
    fetchSessionConfig();
  }, []);

  // Refrescar lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users`);
        setUsers(res.data || []);
      } catch (e) {
        console.warn('[USERS] No se pudo cargar la lista de usuarios.');
        setUsers([]);
      }
    };
    fetchUsers();
  }, [message]);

  const handleRegisterOrUpdate = async () => {
    try {
      let res;
      if (editId) {
        res = await axios.put(`${API}/users/${editId}`, { username, password, role, subscribe });
        setMessage(`Updated user: ${res.data.username}`);
      } else {
        res = await axios.post(`${API}/register`, { username, password, role, subscribe });
        setMessage(`Registered user: ${res.data.username}`);
      }
      setUsername('');
      setPassword('');
      setEditId(null);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error during save');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setMessage(`Logged in as: ${res.data.username}`);
      setUsername(''); setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error during login');
    }
  };

  const handleEdit = (user) => {
    setUsername(user.username);
    setPassword('');
    setRole(user.role || DEFAULT_SESSION.role);
    setSubscribe(user.subscribe ?? DEFAULT_SESSION.subscribe);
    setEditId(user.id);
  };

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

      <div style={{ marginTop: '1rem' }} datatest-id="message" className="row">{message}</div>

      <hr />

      <h2>Users</h2>
      <table datatest-id="usersTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>#</th><th>Username</th><th>Role</th><th>Subscribe</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.subscribe ? 'Yes' : 'No'}</td>
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
