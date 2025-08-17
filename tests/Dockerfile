# Tests: Playwright
FROM node:18-bullseye

WORKDIR /app

# Copiar package.json para instalar dependencias dentro del contenedor
COPY package.json package-lock.json* ./

# Instalar dependencias (incluye @playwright/test)
RUN npm install

# Instalar navegadores y dependencias del sistema necesarias para Playwright
RUN apt-get update && apt-get install -y wget curl ca-certificates \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libgbm1 libgtk-3-0 libxcomposite1 libxdamage1 libxrandr2 libasound2 \
    libpangocairo-1.0-0 libpango-1.0-0 libgdk-pixbuf2.0-0 libcairo2 libexpat1 \
    && rm -rf /var/lib/apt/lists/*

# Instalar navegadores de Playwright
RUN npx playwright install --with-deps

# Copiar tests al contenedor
COPY . .

# Comando por defecto para ejecutar tests
CMD ["npx", "playwright", "test", "--reporter=list"]
