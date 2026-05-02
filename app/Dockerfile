# app/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir la app
RUN npm run build

# Servir con nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]