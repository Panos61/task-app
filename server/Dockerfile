# Stage 1: Build
FROM node:23.10-bookworm-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:23.10-bookworm-slim AS production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]