FROM node:18
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn
EXPOSE 8800
CMD ["yarn", "start"]