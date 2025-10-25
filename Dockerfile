# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

RUN npm ci

# 👇 Copy the environment file first (important)
COPY .env.production .env.production

# Then copy the rest of the app
COPY . .

# Build the app for production (Vite automatically loads .env.production)
ARG BUILD_ENV=production
RUN if [ "$BUILD_ENV" = "production" ]; then \
      npm run build -- --mode production; \
    else \
      npm run build -- --mode development; \
    fi

# Stage 2 — Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
