#Version 0.0.1

FROM node:14

WORKDIR /home/node/app

COPY . .

#RUN yarn install

EXPOSE 3000

CMD ["yarn", "build"]

