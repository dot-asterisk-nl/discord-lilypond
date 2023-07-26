FROM library/node:alpine
LABEL maintainer="marcel@dot-asterisk.nl"

WORKDIR /app

COPY . .
RUN npm install
USER 1001

ENTRYPOINT ["node", "."]