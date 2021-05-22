#Version 0.0.1

FROM node:latest

LABEL maintainer="jvaldesgonzalez9@gmail.com"
LABEL project="saturday.backend"
LABEL version="0.0.1"

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

RUN yarn build

CMD ["yarn", "run", "start:prod"]
