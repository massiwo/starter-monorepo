#!/bin/bash

# Charger les variables de configuration
source config.sh

# IMAGE_NAME et IMAGE_TAG sont défini dans le fichier "config.sh"
IMAGE_TAG=${IMAGE_TAG_DEV}

DOCKER_ARCHIVE="${IMAGE_NAME}_${IMAGE_TAG}.tar"

# Charger l'image Docker
echo "Chargement de l'image Docker ${DOCKER_ARCHIVE}..."
docker load -i ${DOCKER_ARCHIVE}
echo "Chargement terminé"

# S'assurer que les scripts sont exécutables
chmod +x *.sh

echo "Installation terminée. Utilisez ./start.dev.sh pour démarrer l'application."
