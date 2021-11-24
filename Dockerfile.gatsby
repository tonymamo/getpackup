FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY .env.* ./

RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev python3 py3-pip nasm automake autoconf make g++ libtool libpng-dev

RUN yarn install --network-timeout=100000

COPY . .

ENV PORT=1391

EXPOSE 1391

CMD ["yarn", "start"]