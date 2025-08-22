// Layout con navegación y definición de rutas.
// Ahora incluye Rating sin eliminar nada anterior.
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import History from './pages/History';
import Support from './pages/Support';
import Rating from './pages/Rating';

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
        <NavLink to="/rating" style={linkStyle}>Rating</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
        <Route path="/support" element={<Support />} />
        <Route path="/rating" element={<Rating />} />
      </Routes>
    </div>
  );
}
