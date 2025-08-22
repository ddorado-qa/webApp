FROM node:18-bullseye

WORKDIR /app

# Copiar package.json primero para cache
COPY package.json package-lock.json* ./

# Instalar dependencias Node
RUN npm install

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    wget curl ca-certificates xvfb x11vnc fluxbox novnc websockify \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libgbm1 libgtk-3-0 libxcomposite1 libxdamage1 \
    libxrandr2 libasound2 libpangocairo-1.0-0 libpango-1.0-0 \
    libgdk-pixbuf2.0-0 libcairo2 libexpat1 \
    && rm -rf /var/lib/apt/lists/*

# Instalar navegadores Playwright
RUN npx playwright install --with-deps

# Copiar tests y entrypoint
COPY . .
COPY entrypoint.sh /app/entrypoint.sh
COPY entrypoint_silence.sh /app/entrypoint_silence.sh

# Dar permisos ejecutables
RUN chmod +x /app/entrypoint.sh
RUN chmod +x /app/entrypoint_silence.sh

# Ejecutar entrypoint por defecto
ENTRYPOINT ["/app/entrypoint_silence.sh"]
