// Módulo de base de datos SQLite compartido por todas las rutas.
// No elimina funcionalidades: solo extrae la lógica de conexión/creación de tabla.
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH);

// Inicializar tabla si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

module.exports = db;
