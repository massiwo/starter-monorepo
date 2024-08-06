#!/bin/bash

# Charger les variables de configuration
source config.sh

pwd=$(dirname "$0")
ARGS=("$@")

echo "Build de l'image Base..."
docker build -t $IMAGE_NAME:base -f $pwd/../docker/Dockerfile.base $pwd/../
