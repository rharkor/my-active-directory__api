FROM node as builder

ENV NODE_ENV build

WORKDIR /home/api

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build && npm prune --omit=dev

FROM node as production

ENV NODE_ENV production

USER node
WORKDIR /home/api

COPY --from=builder --chown=node:node /home/api .

CMD npm run migrate:up && npm run sql:default-roles && npm run start:prod
