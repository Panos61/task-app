FROM node:23.10-bookworm-slim AS base
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

# Development stage
FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=development \
    PORT=4000
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

# Production stage
FROM node:23.10-bookworm-slim AS production
WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files and schemas
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/schema ./dist/schema

# Create directory for SSL certificates
RUN mkdir -p /usr/src/app/ssl

# Set production environment variables with defaults
ENV NODE_ENV=production \
    PORT=4000 \
    DB_HOST=db \
    DB_PORT=5432 \
    LOG_LEVEL=info \
    RATE_LIMIT_WINDOW_MS=900000 \
    RATE_LIMIT_MAX_REQUESTS=100

# Expose necessary ports
EXPOSE 4000

# Use a non-root user for better security
RUN chown -R node:node /usr/src/app
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

CMD ["node", "dist/index.js"]