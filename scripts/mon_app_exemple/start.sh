#!/bin/bash

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
source "${SCRIPT_DIR}/../config.sh"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Le fichier compose.yml est introuvable."
    echo "Vérifiez que votre installation correspond à l'environnement souhaité."
    exit 1
fi

read -p "Êtes-vous sûr de vouloir démarrer le conteneur \"$IMAGE_NAME\" ? (oui/Non) " confirmation
[[ "$confirmation" != "oui" ]] && echo "Exécution annulée." && exit 1

echo "Démarrage des conteneurs Docker..."
IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose -f "$COMPOSE_FILE" up -d NOM_APP_A_MODIFIER
