FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_PUBLIC_API_URL
ENV VITE_PUBLIC_API_URL=$VITE_PUBLIC_API_URL

RUN npx vite build

FROM node:20-alpine as runner

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Comando de inicio: servir en modo SPA
CMD ["serve", "-s", "dist", "-l", "3000"]
