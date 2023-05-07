FROM node:20-alpine
COPY . /app
WORKDIR /app
RUN yarn
CMD ["node", "index.js"]
