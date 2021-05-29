#Version 0.0.1

FROM node:latest

LABEL maintainer="jvaldesgonzalez9@gmail.com"
LABEL project="saturday.backend"
LABEL version="0.0.1"

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]

