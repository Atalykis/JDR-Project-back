FROM node:16.17.0-alpine3.16

WORKDIR /jdr-back

COPY ["package.json", "tsconfig.json", "yarn.lock", "./out/", "./"]

RUN yarn

COPY . . 

EXPOSE 3000

CMD ["node", "index.js"]