FROM node:14.14.0-alpine
WORKDIR /app
COPY ./server/package.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "start"]