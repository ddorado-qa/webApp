// Backend Node.js + Express + SQLite (CRUD básico para usuarios)
// Atención: para simplicidad usamos SQLite en fichero ./data.db (persistente en volumen local)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Base de datos SQLite en fichero (persistente dentro del contenedor o en tu carpeta de proyecto)
const DB_PATH = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH);

// Inicializar tabla
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

// Registro
app.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if(!username || !password) return res.status(400).json({ error: 'username and password required' });
  db.run(`INSERT INTO users(username,password) VALUES (?,?)`, [username,password], function(err){
    if(err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, username });
  });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if(!username || !password) return res.status(400).json({ error: 'username and password required' });
  db.get(`SELECT id, username FROM users WHERE username=? AND password=?`, [username,password], (err,row)=>{
    if(err) return res.status(500).json({ error: err.message });
    if(!row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(row);
  });
});

// List users (sin passwords)
app.get('/users', (req, res) => {
  db.all(`SELECT id, username FROM users`, [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Health
app.get('/health', (req,res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
