FROM node

WORKDIR /usr/src/app

RUN apt update && \
    apt install -y wget netcat-traditional && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for

COPY package*.json ./

RUN if [ ! -f package.json ]; then npm init -y; fi

RUN npm install express && \
    npm install moniker && \
    npm install mysql

RUN npm install

COPY . .

RUN chmod +x /usr/src/app/start.sh

EXPOSE 3000

# CMD [ "node", "index.js" ]
