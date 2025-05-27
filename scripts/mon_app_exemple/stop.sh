#!/bin/bash

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
source "${SCRIPT_DIR}/../config.sh"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Le fichier docker-compose.yml est introuvable."
    echo "Vérifiez que votre installation correspond à l'environnement souhaité."
    exit 1
fi

read -p "Êtes-vous sûr de vouloir arrêter le conteneur \"$IMAGE_NAME\" ? (oui/Non) " confirmation
[[ "$confirmation" != "oui" ]] && echo "Exécution annulée." && exit 1

echo "Arrêt du conteneur NOM_APP_A_MODIFIER..."
IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose -f "$COMPOSE_FILE" down NOM_APP_A_MODIFIER
