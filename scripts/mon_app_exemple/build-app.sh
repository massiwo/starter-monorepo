#!/bin/bash
pwd=$(dirname "$0")
ARGS=("$@")
DOCKER_FOLDER="${pwd}/../../docker/"

# Charger les variables de configuration
source config.sh

# IMAGE_NAME et IMAGE_TAG sont défini dans le fichier "config.sh"
DOCKER_COMPOSE_FILE=${DOCKER_FOLDER}/docker-compose.yml
DOCKER_COMPOSE_SERVICE=mon_app_exemple

echo "Build de l'image applicatif \"$IMAGE_NAME:$IMAGE_TAG\"..."
IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose --verbose -f $DOCKER_COMPOSE_FILE build $DOCKER_COMPOSE_SERVICE

if [ $? -ne 0 ]; then
  echo "⛔️ Build échoué."
  exit 1
fi

echo "Build terminé"
