#!/usr/bin/env bash

container_id=$(docker ps | grep 'js:start' | cut -d' ' -f1)

echo "Restarting $container_id"
docker-compose restart "$container_id"
docker ps
