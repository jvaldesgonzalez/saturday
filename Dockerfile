#Version 0.0.1

FROM node:14
LABEL maintainer="jvaldesgonzalez9@gmail.com"

WORKDIR /home/node/app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn global add pegjs \
		yarn install \
		yarn run build


EXPOSE 3000

CMD ["yarn", "start:prod"]

