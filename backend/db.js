// Inicialización de SQLite con tablas necesarias para todos los micro-backends
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'data.db'));

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    email TEXT,
    subscribed INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    action TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS support (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    subject TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    stars INTEGER,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
