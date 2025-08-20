// Servidor Express que monta micro-rutas y mantiene compatibilidad con tu API actual.
// No se elimina ninguna funcionalidad existente sin tu aprobación.
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./db'); // inicializa DB y tablas

const authRoutes = require('./routes/auth');   // /register, /login (rutas exactas originales)
const usersRoutes = require('./routes/users'); // /users CRUD
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');
const historyRoutes = require('./routes/history');
const supportRoutes = require('./routes/support');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Rutas que CONSERVAN compatibilidad con tu frontend:
app.use('/', authRoutes);       // POST /register, POST /login
app.use('/users', usersRoutes); // GET/PUT/DELETE

// Nuevos micro-backends (extensibles)
app.use('/profile', profileRoutes);
app.use('/settings', settingsRoutes);
app.use('/history', historyRoutes);
app.use('/support', supportRoutes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'core' }));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
