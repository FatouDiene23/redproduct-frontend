# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Argument pour l'URL API (défaut pour dev local)
ARG VITE_API_URL=http://localhost:8000

COPY package*.json ./
RUN npm ci

COPY . .

# Build avec la variable d'environnement
RUN VITE_API_URL=${VITE_API_URL} npm run build

# Stage 2: Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]