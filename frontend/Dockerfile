# Frontend: React + Vite
FROM node:20-bullseye

WORKDIR /app

# Copiar package.json antes para cache layer
COPY package.json package-lock.json* ./

# Instalar dependencias (en la plataforma linux del contenedor)
RUN npm install

# Copiar el resto de la app
COPY . .

# Exponer puerto Vite
EXPOSE 3000

# Ejecutar dev server (vite --host para escuchar en 0.0.0.0)
CMD ["npm", "run", "dev"]
