FROM node:alpine
MAINTAINER yqrashawn <namy.19@gmail.com>

WORKDIR /conflux-scan
COPY package.json yarn.lock ./
RUN yarn
COPY .prettier* .eslint* .babelrc webpack.*.js ./
ADD src /conflux-scan/src
ADD static /conflux-scan/static

ENTRYPOINT ["yarn"]
