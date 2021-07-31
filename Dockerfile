FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY index.js ./
COPY src/ ./src

CMD ['npm', 'start']
