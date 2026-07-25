# Stage 1: Build client
FROM node:22-alpine AS build

WORKDIR /app

COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

# Stage 2: Production server
FROM node:22-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install --production

COPY server/ ./server/

COPY --from=build /app/client/dist ./client/dist

EXPOSE 8000

CMD ["node", "server/src/index.js"]
