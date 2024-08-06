#!/bin/bash
pwd=$(dirname "$0")

source config.sh

# Variables
ARCHIVE_FOLDER="${pwd}/../../livraison"
ARCHIVE_NAME="${IMAGE_NAME}_${IMAGE_TAG}.tar.gz"
DOCKER_ARCHIVE="${IMAGE_NAME}_${IMAGE_TAG}.tar"
DOCKER_FOLDER="${pwd}/../../docker"

# Construire l'image Docker
#./build.base.sh
./build.app.sh

# Sauvegarder l'image Docker dans un fichier tar
docker save -o ${DOCKER_ARCHIVE} ${IMAGE_NAME}:${IMAGE_TAG}

# Créer un répertoire temporaire pour le livrable
TMP_DIR=${IMAGE_NAME}_${IMAGE_TAG}
mkdir -p ${TMP_DIR} ${ARCHIVE_FOLDER}
cp ${DOCKER_ARCHIVE} ${TMP_DIR}/
cp ${DOCKER_FOLDER}/compose.common.yml ${TMP_DIR}/
cp ${DOCKER_FOLDER}/compose.ligneA.yml ${TMP_DIR}/compose.yml
cp start.sh \
   stop.sh \
   restart.sh \
   enter.sh \
   install.sh \
   config.sh \
   ${TMP_DIR}/

# Créer l'archive tar.gz
tar -czvf ${ARCHIVE_NAME} ${TMP_DIR}
mv ${ARCHIVE_NAME} ${ARCHIVE_FOLDER}/

# Nettoyer les fichiers temporaires
rm -rf ${TMP_DIR}
rm ${DOCKER_ARCHIVE}

echo "Livrable créé : ${ARCHIVE_NAME}"
