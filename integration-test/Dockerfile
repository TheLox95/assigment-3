FROM node:8

# Create app directory
WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 9090

CMD [ "npm", "start" ]