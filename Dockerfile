FROM node:18-alpine

WORKDIR /app

# Instalar curl para healthchecks del contenedor
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .

# Crear directorio de logs y configurar usuario sin privilegios
RUN mkdir -p /app/logs && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "app.js"]
