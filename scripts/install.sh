#!/bin/bash

# Charger les variables de configuration
source config.sh

DOCKER_ARCHIVE="${IMAGE_NAME}_${IMAGE_TAG}.tar"

# Charger l'image Docker
docker load -i ${DOCKER_ARCHIVE}

# S'assurer que les scripts sont exécutables
chmod +x *.sh

echo "Installation terminée. Utilisez ./start.sh pour démarrer l'application."
