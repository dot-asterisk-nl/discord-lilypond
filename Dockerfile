FROM node:alpine
LABEL maintainer="marcel@dot-asterisk.nl"

WORKDIR /app

COPY . .
USER 1001

ENTRYPOINT ["node", "."]