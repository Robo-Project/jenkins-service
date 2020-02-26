FROM node:13-alpine

COPY . .

RUN npm install

CMD node index.js
