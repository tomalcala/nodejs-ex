FROM node:10.9.0-alpine

# RUN apt-get update

# RUN apt-get install -y --no-install-recommends \
#     build-essential \
#     make \
#     gcc

RUN apk add --no-cache make gcc g++ python

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN npm install -g yarn
RUN yarn global add bs-platform
RUN yarn install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080

# CMD [ "yarn", "start" ]
# CMD [ "yarn", "js:start" ]
