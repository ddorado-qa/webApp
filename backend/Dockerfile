# Backend: Node + Express + SQLite
FROM node:20-bullseye

WORKDIR /app

# Copiar package.json primero para aprovechar la cache
COPY package.json package-lock.json* ./

# Instalar dependencias en la plataforma linux del contenedor
RUN npm install
RUN npm rebuild sqlite3 --build-from-source

# Copiar el resto del backend
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando por defecto (desarrollo con nodemon)
CMD ["npm", "run", "dev"]
