#!/bin/bash
pwd=$(dirname "$0")

source config.sh

# IMAGE_NAME et IMAGE_TAG sont défini dans le fichier "config.sh"
IMAGE_TAG=${IMAGE_TAG_DEV}

# Variables
ARCHIVE_FOLDER="${pwd}/../../livraison"
ARCHIVE_NAME="${IMAGE_NAME}_${IMAGE_TAG}.tar.gz"
DOCKER_ARCHIVE="${IMAGE_NAME}_${IMAGE_TAG}.tar"
DOCKER_FOLDER="${pwd}/../../docker"

# Construire l'image Docker
./build.base.sh
./build.app.dev.sh

# Sauvegarder l'image Docker dans un fichier tar
echo "Sauvegarde de l'image Docker: ${DOCKER_ARCHIVE} depuis ${IMAGE_NAME}:${IMAGE_TAG}"
docker save -o ${DOCKER_ARCHIVE} ${IMAGE_NAME}:${IMAGE_TAG}

# Nettoie le répertoire de livraison
rm -rf ${ARCHIVE_FOLDER}

# Créer un répertoire temporaire pour le livrable
TMP_DIR="${IMAGE_NAME}_${IMAGE_TAG}"
mkdir -p ${TMP_DIR} ${ARCHIVE_FOLDER}
cp ${DOCKER_ARCHIVE} ${TMP_DIR}/
cp ${DOCKER_FOLDER}/compose.yml ${TMP_DIR}/
cp ${DOCKER_FOLDER}/compose.dev.yml ${TMP_DIR}/
cp start.dev.sh \
   stop.dev.sh \
   restart.dev.sh \
   enter.sh \
   install.dev.sh \
   config.sh \
   ${TMP_DIR}/

# Créer l'archive tar.gz
tar -czvf ${ARCHIVE_NAME} ${TMP_DIR}
mv ${ARCHIVE_NAME} ${ARCHIVE_FOLDER}/

# Nettoyer les fichiers temporaires
rm -rf ${TMP_DIR}
rm ${DOCKER_ARCHIVE}

echo "Livrable créé : ${ARCHIVE_NAME}"
