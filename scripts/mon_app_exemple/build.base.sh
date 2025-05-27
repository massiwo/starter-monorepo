#!/bin/bash
pwd=$(dirname "$0")
ARGS=("$@")

# Charger les variables de configuration
source config.sh

IMAGE_NAME=mon_app_exemple
IMAGE_TAG=base

DOCKER_FOLDER="${pwd}/../../docker/$IMAGE_NAME"

echo "Build de l'image Base..."
docker build -t $IMAGE_NAME:$IMAGE_TAG -f $DOCKER_FOLDER/base.Dockerfile $pwd/../../
