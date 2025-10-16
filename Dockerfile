# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install all dependencies (including dev — needed for vite build)
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the app for production
ARG BUILD_ENV=production
RUN if [ "$BUILD_ENV" = "production" ]; then \
      npm run build -- --mode production; \
    else \
      npm run build -- --mode development; \
    fi

# Stage 2 — Serve with nginx
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for web traffic
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
