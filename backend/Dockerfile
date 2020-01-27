FROM node:10.14.0-alpine as builder

RUN apk add g++ make python git
RUN apk add yarn
RUN apk --no-cache update \
    && apk --no-cache add g++ make bash zlib-dev libpng-dev \
    &&  rm -fr /var/cache/apk/*

COPY . /src/backend

# build
WORKDIR /src/backend
RUN yarn install
RUN yarn build

# final image
FROM node:10.14.0-alpine

ENV NODE_ENV=production

COPY --from=builder /src/backend/dist /app
COPY --from=builder /src/backend/node_modules /app/node_modules

WORKDIR /app

CMD ["node", "/app/main.js"]
