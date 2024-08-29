#!/bin/bash
pwd=$(dirname "$0")

source config.sh

# Variables
ARCHIVE_FOLDER="${pwd}/../livraison"
ARCHIVE_NAME="${IMAGE_NAME}_${IMAGE_TAG}.tar.gz"
ARCHIVE_FILEPATH="${ARCHIVE_FOLDER}/${ARCHIVE_NAME}"
DOCKER_ARCHIVE="${IMAGE_NAME}_${IMAGE_TAG}.docker-image.tar"
DOCKER_FOLDER="${pwd}/../docker"

# Construire l'image Docker
echo "Construire l'image Docker"
#./build.base.sh
./build.app.sh

# Sauvegarder l'image Docker dans un fichier tar
echo "Sauvegarder l'image Docker dans un fichier tar"
docker save -o ${DOCKER_ARCHIVE} ${IMAGE_NAME}:${IMAGE_TAG}

# Créer un répertoire temporaire pour le livrable
TMP_DIR=${IMAGE_NAME}_${IMAGE_TAG}
mkdir -p ${TMP_DIR} ${ARCHIVE_FOLDER}
cp ${DOCKER_ARCHIVE} ${TMP_DIR}/
cp ${DOCKER_FOLDER}/docker-compose.common.yml ${TMP_DIR}/
cp ${DOCKER_FOLDER}/docker-compose.yml ${TMP_DIR}/
cp start.sh \
   stop.sh \
   restart.sh \
   enter.sh \
   install.sh \
   ${TMP_DIR}/

echo IMAGE_NAME=${IMAGE_NAME} > ${TMP_DIR}/config.sh
echo IMAGE_TAG=${IMAGE_TAG} >> ${TMP_DIR}/config.sh

# Créer l'archive tar.gz
tar -czvf ${ARCHIVE_NAME} ${TMP_DIR}
mv ${ARCHIVE_NAME} ${ARCHIVE_FOLDER}/

# Nettoyer les fichiers temporaires
rm -rf ${TMP_DIR}
rm ${DOCKER_ARCHIVE}

echo -e "\nLivrable créé : ${ARCHIVE_FILEPATH}"
