#! /bin/bash

docker build -t docker_adress/app-backend .
docker push docker_adress/app-backend:latest
ssh -i ~/.ssh/key.pem ubuntu@3.255.255.255 "
  cd exchange-backend &&
  sudo docker pull docker_adress/app-backend &&
  sudo docker-compose stop app &&
  sudo docker-compose up -d app &&
  sudo docker image prune --force
"
exit
