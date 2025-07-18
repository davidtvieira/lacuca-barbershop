FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

USER node
CMD ["npm", "run", "dev"]