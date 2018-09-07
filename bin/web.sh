#!/usr/bin/env bash

# docker run -d -t -p 8080:9000 animo/reason yarn js:start
docker-compose run -d -p 8080:8080 web

