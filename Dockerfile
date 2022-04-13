FROM node:16 AS development

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn global add pegjs
RUN yarn install

COPY . .

RUN yarn run build

FROM node:16-alpine AS production

WORKDIR /usr/src/app

COPY . .

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

