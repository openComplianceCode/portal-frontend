#!/usr/bin/env bash

SHA=$(git rev-parse main)

ImageExist=$(docker manifest inspect aleczheng/license-front:$SHA > /dev/null;echo $?)
if [[ $ImageExist != '0' ]]; then
  echo 'buiding license-back'
  echo 'tag:'$SHA
  docker build -t aleczheng/license-front -t "aleczheng/license-front:$SHA" -f ./Dockerfile .
  docker push aleczheng/license-front:latest
  docker push "aleczheng/license-front:$SHA"
fi
exit 0


