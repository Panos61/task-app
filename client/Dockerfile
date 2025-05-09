FROM node:23.10-bookworm-slim AS base
WORKDIR /usr/src/app

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - simplified without Nginx
FROM node:23.10-bookworm-slim AS production
WORKDIR /usr/src/app

# Install a simple static file server
RUN npm install -g serve

# Copy built files
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 80
# Serve the app on port 80
CMD ["serve", "-s", "dist", "-l", "80"]