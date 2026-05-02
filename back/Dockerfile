# back/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "dev"]