FROM node:16.3.0-alpine
WORKDIR /app
COPY package.json . 
RUN npm install --force
COPY . /app
EXPOSE 3000
CMD ["npm","start"]