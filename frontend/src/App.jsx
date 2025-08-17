import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Usamos la variable de entorno VITE_API_URL (vite expone VITE_* en import.meta.env)
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('user');
  const [subscribe, setSubscribe] = useState(false);

  useEffect(() => {
    // refrescar lista de usuarios
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users`);
        setUsers(res.data || []);
      } catch (e) {
        // backend puede no estar listo durante el arranque
        setUsers([]);
      }
    };
    fetchUsers();
  }, [message]);

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/register`, { username, password });
      setMessage(`Registered user: ${res.data.username}`);
      setUsername(''); setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error during register');
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

  return (
    <div className="container">
      <h1 datatest-id="title">Microfrontend Starter</h1>

      <div className="row">
        <label htmlFor="username">Username</label>
        <input id="username" datatest-id="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      </div>

      <div className="row">
        <label htmlFor="password">Password</label>
        <input id="password" datatest-id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <div className="row">
        <label htmlFor="role">Role (select)</label>
        <select id="role" datatest-id="roleSelect" value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="row">
        <label>
          <input datatest-id="subscribeToggle" type="checkbox" checked={subscribe} onChange={e => setSubscribe(e.target.checked)} />
          Subscribe to newsletter
        </label>
      </div>

      <div style={{ marginTop: '1rem' }} className="row">
        <button datatest-id="registerBtn" onClick={handleRegister}>Register</button>
        <button datatest-id="loginBtn" onClick={handleLogin} style={{ marginLeft: '1rem' }}>Login</button>
      </div>

      <div style={{ marginTop: '1rem' }} datatest-id="message" className="row">{message}</div>

      <hr />

      <h2>Users</h2>
      <table datatest-id="usersTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>#</th><th>Username</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}><td>{u.id}</td><td>{u.username}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
