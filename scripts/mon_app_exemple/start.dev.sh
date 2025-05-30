#!/bin/bash
pwd=$(dirname "$0")
ARGS=("$@")
DOCKER_FOLDER="${pwd}/../../docker"

# Vérifier si un arg a été fourni, si aucun argument n'est fourni, demander confirmation avant de continuer pour éviter de démarrer tous les conteneurs
if [ "${#ARGS[@]}" -eq 0 ]; then
    read -p "Êtes-vous sûr de vouloir démarrer tous les conteneurs ? (oui/Non) " confirmation

    if [ "$confirmation" != "oui" ]; then
        echo "Exécution annulée."
        exit 1
    fi
fi

# Si une argument existe, demander confirmation avant de continuer pour éviter de démarrer le mauvais conteneur
if [ "${#ARGS[@]}" -eq 1 ]; then
    read -p "Êtes-vous sûr de vouloir démarrer le conteneur "${ARGS[0]}" ? (oui/Non) " confirmation

    if [ "$confirmation" != "oui" ]; then
        echo "Exécution annulée."
        exit 1
    fi
fi

# Charger les variables de configuration
source config.sh

# IMAGE_TAG est défini dans le fichier "config.sh"
IMAGE_TAG=${IMAGE_TAG_DEV}

echo "Démarrage des conteneurs Docker..."
DOCKER_COMPOSE_FILE=$DOCKER_FOLDER/compose.dev.yml
IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose -f ${DOCKER_COMPOSE_FILE} up -d $1