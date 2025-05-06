# Build frontend
FROM node:23.10-bookworm-slim AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Build backend
FROM node:23.10-bookworm-slim AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .
# Copy tsconfig.json for proper build
COPY server/tsconfig.json ./
RUN npm run build

# Production image
FROM node:23.10-bookworm-slim
WORKDIR /app

# Copy backend build and necessary files
COPY --from=backend-builder /app/server/dist ./dist
COPY --from=backend-builder /app/server/package*.json ./
COPY --from=backend-builder /app/server/src/schema ./dist/schema
RUN npm ci --only=production

# Copy frontend build to serve statically
COPY --from=frontend-builder /app/client/dist ./public

# Set production environment
ENV NODE_ENV=production \
    PORT=4000 \
    DB_HOST=db \
    DB_PORT=5432 \
    DB_NAME=task-db

# Install dependencies needed for production
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN chown -R node:node /app
USER node

EXPOSE 4000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

CMD ["node", "dist/index.js"] 