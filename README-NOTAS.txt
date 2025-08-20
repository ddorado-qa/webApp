// Notas rápidas de integración (sin eliminar nada):
// 1) Frontend:
//    - Añadimos react-router-dom. Instala dependencias:
//        $ cd frontend && npm install
//    - VITE_API_URL ya está soportada (por defecto http://localhost:4000).
//
// 2) Backend:
//    - Estructurado en rutas modulares. Las rutas originales /register, /login y /users siguen funcionando.
//    - Arranca en puerto 4000 (expuesto en docker-compose).
//
// 3) Tests / noVNC / VNC:
//    - El nuevo ./tests/entrypoint.sh crea un ~/.fluxbox/init completo para evitar los avisos
//      “Failed to read: session.* Setting default value”.
//    - El servicio tests en docker-compose ya llama a /app/entrypoint.sh, por lo que al
//      montar ./tests como volumen, usará este script automáticamente.
//
// 4) Rutas nuevas (extensibles) de ejemplo en backend:
//    GET /profile/health
//    GET /settings/health
//    GET /history/health
//    GET /support/health
//
// 5) Nada existente se elimina. El CRUD y login se mantienen en UsersManager (Home).
