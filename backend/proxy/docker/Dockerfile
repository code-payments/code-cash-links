# Builder stage
FROM node:20-alpine AS builder

RUN apk update
RUN apk add --no-cache python3 make g++

COPY package.json .
COPY tsconfig.json .

RUN npm install

COPY src src
RUN npx tsc

# Final stage
FROM node:20-alpine

RUN apk update && \
    apk add --no-cache

# Define build-time arguments
ARG NEW_RELIC_LICENSE_KEY

ENV NEW_RELIC_APP_NAME=ws-grpc-proxy
ENV NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout

ENV NODE_PATH /usr/local/lib/node_modules
COPY --from=builder /node_modules /usr/local/lib/node_modules
COPY --from=builder /dist ./dist
COPY public public

EXPOSE 3000

RUN apk add --no-cache curl
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 CMD curl http://localhost:3000  || exit 1

# Start the application
CMD ["node", "./dist/src/index.js"]