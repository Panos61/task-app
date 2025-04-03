FROM node:23.10-bookworm-slim AS builder
WORKDIR /usr/src/app

COPY package.json .

RUN npm install
RUN npm install -g serve

COPY . .

RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "dev"]