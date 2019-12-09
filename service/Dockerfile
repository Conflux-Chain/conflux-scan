FROM node:current-slim
MAINTAINER yqrashawn <namy.19@gmail.com>

WORKDIR /conflux-scan
COPY package.json yarn.lock ./
RUN yarn
ADD index.js ./

EXPOSE 3000

ENTRYPOINT ["yarn"]
