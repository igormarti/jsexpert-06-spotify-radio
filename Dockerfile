FROM node:17-slim

RUN apt-get update \
&& apt-get install -y sox libsox-fmt-mp3
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# libsox-fmt-all

WORKDIR /spotify-radio/

COPY package.json package-lock.json /spotify-radio/

RUN npm ci --silent

COPY . .

USER node

CMD npm run live-reload