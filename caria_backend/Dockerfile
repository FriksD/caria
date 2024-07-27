FROM node:18
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 8800
CMD ["yarn", "start"]