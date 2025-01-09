FROM node AS builder

WORKDIR /usr/src/app

RUN npm init -y
RUN npm install express
RUN npm install moniker

COPY package*.json ./

RUN npm install

COPY . .

FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl curl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY --from=builder /usr/src/app .
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["dockerize", "-wait", "tcp://db:3306", "-timeout", "20s"]
CMD [ "node","index.js" ]
