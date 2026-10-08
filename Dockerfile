# ---------- Steg 1: bygg React-appen med Node ----------
FROM node:24-alpine AS build
WORKDIR /app

# Beroenden först => cachas så länge package*.json inte ändras
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Tom API-URL => appen anropar /api/... på SAMMA adress som sidan,
# och nginx skickar vidare till API-containern.
# OBS: VITE_-variabler bakas in i JS-filerna vid BUILD, inte när containern startar.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Steg 2: servera filerna med nginx, som icke-root ----------
# nginx-unprivileged kör som användaren "nginx" (inte root) och lyssnar på 8080
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080