# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies (including dev deps for build)
RUN npm ci

# Copy the rest of the app, including env files
COPY . .

# Build argument to decide environment
ARG BUILD_ENV=production
ENV BUILD_ENV=${BUILD_ENV}

# Build using the correct mode
RUN npm run build -- --mode $BUILD_ENV

# Stage 2 — Serve with nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
