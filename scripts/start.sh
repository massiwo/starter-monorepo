#!/bin/bash
pwd=$(dirname "$0")
ARGS=("$@")

# Vérifier si un arg a été fourni, si aucun argument n'est fourni, demander confirmation avant de continuer pour éviter de démarrer tous les conteneurs
if [ "${#ARGS[@]}" -eq 0 ]; then
    read -p "Êtes-vous sûr de vouloir démarrer tous les conteneurs ? (y/N) " confirmation

    if [ "$confirmation" != "y" ]; then
        echo "Exécution annulée."
        exit 1
    fi
fi

# Si une argument existe, demander confirmation avant de continuer pour éviter de démarrer le mauvais conteneur
if [ "${#ARGS[@]}" -eq 1 ]; then
    read -p "Êtes-vous sûr de vouloir démarrer le conteneur "$1" ? (oui/Non) " confirmation

    if [ "$confirmation" != "oui" ]; then
        echo "Exécution annulée."
        exit 1
    fi
fi

# Charger les variables de configuration
source config.sh

echo "Démarrage des conteneurs Docker..."

# Ce chemin correspond à la structure de dossiers de production
DOCKER_COMPOSE_FILE=$pwd/docker-compose.yml

IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose -f ${DOCKER_COMPOSE_FILE} up -d $1

