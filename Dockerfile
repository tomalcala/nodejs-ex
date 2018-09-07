# FROM node:10
FROM node:8.11.4-alpine
# FROM node:8.11.4-slim

# Create app directory
WORKDIR /code

# RUN apt-get update

# RUN apt-get install -y --no-install-recommends \
#     build-essential \
#     make \
#     gcc

RUN apk add --no-cache make gcc g++ python

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

# ENV NODE_ENV=dev
# ENV NODE_PATH=/dependencies/node_modules
RUN yarn global add bs-platform nodemon
# RUN yarn link bs-platform

RUN yarn install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /code

RUN pwd
RUN ls
RUN ls node_modules
# RUN which bsb

EXPOSE 8080
RUN if [ -e .bsb.lock ]; then rm .bsb.lock; fi

CMD [ "yarn", "start" ]
