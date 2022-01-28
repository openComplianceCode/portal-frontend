#!/usr/bin/env bash
SHA=$(git rev-parse main)
kubectl set image deployments/front front=aleczheng/license-front:$SHA

