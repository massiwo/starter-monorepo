#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
source "${SCRIPT_DIR}/../config.sh"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Le fichier compose.yml est introuvable."
    echo "Vérifiez que votre installation correspond à l'environnement souhaité."
    exit 1
fi

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
source "${SCRIPT_DIR}/../config.sh"

echo "Entrée dans le conteneur Docker NOM_APP_A_MODIFIER..."
IMAGE=$IMAGE_NAME TAG=$IMAGE_TAG docker compose -f $COMPOSE_FILE exec -it NOM_APP_A_MODIFIER /bin/bash

