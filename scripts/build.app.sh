#!/bin/bash
pwd=$(dirname "$0")
ARGS=("$@")

# Charger les variables de configuration
source config.sh

echo "Build de l'image applicatif..."
IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose -f $pwd/../../docker/compose.common.yml build simulateur_rer-la

