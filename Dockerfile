FROM node:18-alpine as build-stage

WORKDIR /app

COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install --include=dev

COPY client/ ./client/
RUN cd client && npm run build

FROM node:18-alpine as production-stage

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/

COPY --from=build-stage /app/client/dist ./client/dist

EXPOSE 8000

CMD ["node", "server/src/index.js"]
