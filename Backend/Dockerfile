FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ..
EXPOSE 3000
EXPOSE 3002
CMD ["npm", "start"]