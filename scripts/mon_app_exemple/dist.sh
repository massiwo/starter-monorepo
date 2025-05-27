#!/bin/bash

set -e  # Arrêt en cas d'erreur

# ========== COULEURS ==========
RED='\033[0;31m'     # Erreur
GREEN='\033[0;32m'   # Succès
YELLOW='\033[0;33m'  # Avertissement
BLUE='\033[0;34m'    # Information
NC='\033[0m'        # Étape en cours

# Charger la configuration
source config.sh

# Définition des variables globales
pwd=$(dirname "$0")
ARCHIVE_FOLDER="${pwd}/../../livraison"
ARCHIVE_NAME="${IMAGE_NAME}_${IMAGE_TAG}.iso"
DOCKER_ARCHIVE="${IMAGE_NAME}_${IMAGE_TAG}.tar"
DOCKER_FOLDER="${pwd}/../../docker"
TMP_DIR="${IMAGE_NAME}_${IMAGE_TAG}"
CONFIG_FILE="${TMP_DIR}/config.sh"
VERSION_FILE="${TMP_DIR}/version.txt"

# Fonction : Nettoyage des anciens fichiers
clean_old_files() {
    echo -e "${BLUE}[STEP]${NC} Nettoyage des anciens fichiers..."
    rm -rf "${TMP_DIR}" "${DOCKER_ARCHIVE}" && echo -e "${GREEN}[OK]${NC} Nettoyage terminé." || echo -e "${RED}[ERR]${NC} Erreur lors du nettoyage."
    mkdir -p "${TMP_DIR}" "${ARCHIVE_FOLDER}"
}

# Fonction : Construction de l'image Docker
build_docker_image() {
    echo -e "${BLUE}[STEP]${NC} Construction de l'image Docker..."
    if ./build.base.sh && ./build.app.sh; then
        echo -e "${GREEN}[OK]${NC} Image Docker construite avec succès."
    else
        echo -e "${RED}[ERR]${NC} Erreur lors de la construction de l'image Docker."
        exit 1
    fi
}

# Fonction : Sauvegarde de l'image Docker
docker_save_image() {
    echo -e "${BLUE}[STEP]${NC} Sauvegarde de l'image Docker..."
    if docker save -o "${DOCKER_ARCHIVE}" "${IMAGE_NAME}:latest"; then
        echo -e "${GREEN}[OK]${NC} Image Docker sauvegardée avec succès."
    else
        echo -e "${RED}[ERR]${NC} Erreur lors de la sauvegarde de l'image Docker."
        exit 1
    fi
}

# Fonction : Préparation du livrable
prepare_bundle() {
    echo -e "${BLUE}[STEP]${NC} Préparation du livrable..."

    mkdir -p "${TMP_DIR}/docker" && \
    mkdir -p "${TMP_DIR}/scripts" && \

    cp "${DOCKER_ARCHIVE}" "${TMP_DIR}/" && \
    cp "${DOCKER_FOLDER}/docker-compose.yml" "${TMP_DIR}/docker" && \
    cp "${pwd}/start.sh" "${pwd}/stop.sh" "${pwd}restart.sh" "${pwd}/enter.sh" "${TMP_DIR}/scripts" && \
    cp "${pwd}/install.sh" "${pwd}/uninstall.sh" "${pwd}/config.sh" "${TMP_DIR}/" && echo -e "${GREEN}[OK]${NC} Livrable préparé avec succès." || echo -e "${RED}[ERR]${NC} Erreur lors de la préparation du livrable."
}

# Fonction : Création du fichier de configuration
create_config_file() {
    echo -e "${BLUE}[STEP]${NC} Création du fichier de configuration : $CONFIG_FILE"
    cat <<EOF > "$CONFIG_FILE"
#!/bin/bash
ARCHIVE_NAME="$ARCHIVE_NAME"
IMAGE_NAME="$IMAGE_NAME"
IMAGE_TAG="$IMAGE_TAG"
EOF
    echo -e "${GREEN}[OK]${NC} Fichier de configuration créé avec succès."
}

# Fonction : Création du fichier de version
create_version_file() {
    echo -e "${BLUE}[STEP]${NC} Création du fichier version : $VERSION_FILE"
    echo "Application : $IMAGE_NAME" > "$VERSION_FILE"
    echo "Version : $IMAGE_TAG" >> "$VERSION_FILE"
    echo "Commit : $(git rev-parse HEAD)" >> "$VERSION_FILE"
    echo -e "${GREEN}[OK]${NC} Fichier de version créé avec succès."
}

# Fonction : Création de l'image ISO
create_iso() {
    echo -e "${BLUE}[STEP]${NC} Création de l'image ISO..."
    if genisoimage -o "${ARCHIVE_NAME}" -R -J "${TMP_DIR}"; then
        mv "${ARCHIVE_NAME}" "${ARCHIVE_FOLDER}/"
        echo -e "${GREEN}[OK]${NC} Image ISO créée avec succès."
    else
        echo -e "${RED}[ERR]${NC} Erreur lors de la création de l'image ISO."
        exit 1
    fi
}

# Fonction : Nettoyage final
clean_final() {
    echo -e "${BLUE}[STEP]${NC} Nettoyage final..."
    rm -rf "${TMP_DIR}" "${DOCKER_ARCHIVE}" && echo -e "${GREEN}[OK]${NC} Nettoyage final terminé." || echo -e "${RED}[ERR]${NC} Erreur lors du nettoyage final."
}

# Fonction : Affichage du succès
print_success() {
    echo -e "${GREEN}[OK]${NC} Livrable créé avec succès : ${ARCHIVE_FOLDER}/${ARCHIVE_NAME}"
}

# Exécution des fonctions
clean_old_files
build_docker_image
docker_save_image
prepare_bundle
create_config_file
create_version_file
create_iso
clean_final
print_success
