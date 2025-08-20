// Layout con navegación y definición de rutas.
// No elimina ninguna funcionalidad existente: la lógica CRUD original vive en UsersManager.
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import History from './pages/History';
import Support from './pages/Support';

export default function App() {
  const linkStyle = ({ isActive }) => ({
    marginRight: '0.75rem',
    textDecoration: 'none',
    fontWeight: isActive ? '700' : '400'
  });

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <NavLink to="/" style={linkStyle} end>Home</NavLink>
        <NavLink to="/profile" style={linkStyle}>Profile</NavLink>
        <NavLink to="/settings" style={linkStyle}>Settings</NavLink>
        <NavLink to="/history" style={linkStyle}>History</NavLink>
        <NavLink to="/support" style={linkStyle}>Support</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </div>
  );
}
