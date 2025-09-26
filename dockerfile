FROM node:18-alpine

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --only=production

# Copiar el código
COPY . .

# Exponer el puerto de la app
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
