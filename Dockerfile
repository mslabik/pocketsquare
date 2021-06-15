FROM node:14-alpine

WORKDIR /usr/node/app

COPY --chown=node:node . .

RUN npm ci --production
RUN npm i -g nodemon

USER node
