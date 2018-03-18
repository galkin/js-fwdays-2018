FROM node:8.10.0-alpine

RUN addgroup -S -g 700 fwdays && adduser -S -G fwdays -u 700 galkin
RUN mkdir /microservice
RUN chown -R galkin:fwdays /microservice
USER galkin:fwdays
WORKDIR /microservice

COPY package.json .
COPY package-lock.json .
RUN npm install --production

ADD . /microservice

ENTRYPOINT ["npm", "start"]
