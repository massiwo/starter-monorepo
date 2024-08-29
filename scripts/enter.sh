#!/bin/bash

# Charger les variables de configuration
source config.sh

pwd=$(dirname "$0")
ARGS=("$@")

# Vérifier si un arg a été fourni, si aucun argument n'est fourni, demander confirmation avant de continuer pour éviter de démarrer tous les conteneurs
if [ "${#ARGS[@]}" -eq 0 ]; then
    echo "Veuillez spécifier le service vous souhaitez."
    echo "Usage: ./enter.sh <service1, service2, ...>"
    exit 1
fi

# Si une argument existe, demander confirmation avant de continuer pour éviter de démarrer le mauvais conteneur
if [ "${#ARGS[@]}" -eq 1 ]; then
    read -p "Êtes-vous sûr de vouloir entrer le conteneur "${$1}" ? (oui/Non) " confirmation

    if [ "$confirmation" != "oui" ]; then
        echo "Exécution annulée."
        exit 1
    fi
fi

echo "Démarrage des conteneurs Docker..."
DOCKER_COMPOSE_FILE=$pwd/docker-compose.yml
IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose -f ${DOCKER_COMPOSE_FILE} exec -it $1 /bin/bash

