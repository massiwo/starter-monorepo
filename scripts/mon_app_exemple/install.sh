#!/bin/bash

set -e  # Arrêt en cas d'erreur

# ========== COULEURS ==========
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ========== VARIABLES GLOBALES ==========
source "config.sh"

docker_archive="${IMAGE_NAME}_${IMAGE_TAG}.tar"
tmp_mount="$(dirname "$0")"
env_mode="production"
base_dir="/opt/applications/${IMAGE_NAME}"

# Mode développement
if [[ "$1" == "--dev" ]]; then
    env_mode="development"
    base_dir="/tmp/applications/${IMAGE_NAME}"
fi

install_dir="${base_dir}/${IMAGE_NAME}_${IMAGE_TAG}"
install_dir_scripts="$install_dir/scripts"
install_dir_docker="$install_dir/docker"
install_dir_config_file="$install_dir/config.sh"
install_dir_compose_file="$install_dir_docker/compose.yml"

# ========== PRÉPARATION ==========

confirm_installation() {
    echo -e "${BLUE}[STEP]${NC} Installation en mode $env_mode dans $install_dir"
    read -p "Souhaitez-vous continuer ? (oui/Non) : " confirmation
    confirmation=$(echo "$confirmation" | tr -d '\r' | xargs)
    if [[ "$confirmation" != "oui" ]]; then
        echo -e "${RED}[ERR]${NC} Installation annulée."
        exit 1
    fi
}

check_prerequisites() {
    echo -e "${BLUE}[STEP]${NC} Vérification des prérequis..."
    [[ $EUID -ne 0 && "$env_mode" == "production" ]] && {
        echo -e "${RED}[ERR]${NC} Ce script doit être exécuté en tant que root en production."
        exit 1
    }
    command -v docker &> /dev/null || {
        echo -e "${RED}[ERR]${NC} Docker n'est pas installé."
        exit 1
    }
    echo -e "${GREEN}[OK]${NC} Prérequis vérifiés."
}

cleanup_versions() {
    echo -e "${BLUE}[STEP]${NC} Nettoyage des anciennes installations et images..."

    local existing_dirs=()
    local existing_images=()

    # Détection des anciens répertoires
    for dir in "$base_dir/${IMAGE_NAME}_"*/; do
        [[ -d "$dir" && "$(basename "$dir")" != "${IMAGE_NAME}_${IMAGE_TAG}" ]] && existing_dirs+=("$dir")
    done

    # Détection des anciennes images Docker
    while IFS= read -r image; do
        [[ "$image" != "${IMAGE_NAME}:${IMAGE_TAG}" ]] && existing_images+=("$image")
    done < <(docker images --format '{{.Repository}}:{{.Tag}}' | awk -v name="$IMAGE_NAME" '$0 ~ "^"name":"')

    # Supprimer l'installation actuelle
    if [[ -d "$install_dir" ]]; then
        echo -e "${BLUE}[INFO]${NC} Suppression de l'installation actuelle : $install_dir"
        rm -rf "$install_dir"
        echo -e "${GREEN}[OK]${NC} Répertoire supprimé."
    fi

    # Supprimer image Docker actuelle
    if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:${IMAGE_TAG}$"; then
        echo -e "${BLUE}[INFO]${NC} Suppression image Docker ${IMAGE_NAME}:${IMAGE_TAG}"
        docker image rm --force "${IMAGE_NAME}:${IMAGE_TAG}" || echo -e "${RED}[ERR]${NC} Échec suppression image \"${IMAGE_NAME}:${IMAGE_TAG}\" (en cours d'utilisation ?)"
    fi

    # Supprimer autres installations
    if (( ${#existing_dirs[@]} > 0 )); then
        echo -e "${BLUE}[INFO]${NC} Autres versions installées détectées :"
        for dir in "${existing_dirs[@]}"; do
            echo -e "${BLUE}[INFO]${NC} Suppression : $dir"
            rm -rf "$dir"
        done
        echo -e "${GREEN}[OK]${NC} Anciennes installations supprimées."
    fi

    # Supprimer autres images Docker
    if (( ${#existing_images[@]} > 0 )); then
        echo -e "${BLUE}[INFO]${NC} Autres images Docker détectées :"
        for img in "${existing_images[@]}"; do
            echo -e "${BLUE}[INFO]${NC} Suppression image : $img"
            docker image rm --force "$img" || echo -e "${RED}[ERR]${NC} Échec suppression image \"$img\" (utilisée ?)"
        done
        echo -e "${GREEN}[OK]${NC} Anciennes images Docker supprimées."
    fi
}


# ========== INSTALLATION DOCKER ==========

load_docker_image() {
    echo -e "${BLUE}[STEP]${NC} Chargement de l'image Docker \"${IMAGE_NAME}:${IMAGE_TAG}\"..."

    if docker load -i "$tmp_mount/$docker_archive"; then
        echo -e "${BLUE}[INFO]${NC} Image Docker chargée."
    else
        echo -e "${RED}[ERR]${NC} Échec chargement image Docker."
        exit 1
    fi

    # Vérifie si le tag :latest existe (certains exports le contiennent)
    if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:latest$"; then
        echo -e "${BLUE}[INFO]${NC} Retag de l'image en ${IMAGE_NAME}:${IMAGE_TAG}"
        docker tag "${IMAGE_NAME}:latest" "${IMAGE_NAME}:${IMAGE_TAG}" || true
    else
        echo -e "${BLUE}[INFO]${NC} Aucune image :latest à retaguer."
    fi
}


# ========== INSTALLATION FICHIERS ==========

copy_files() {
    echo -e "${BLUE}[STEP]${NC} Copie des fichiers vers $install_dir..."
    mkdir -p "$install_dir_scripts" "$install_dir_docker"

    cp "$tmp_mount/docker/compose.yml" "$install_dir_compose_file"
    cp "$tmp_mount/scripts/"*.sh "$install_dir_scripts"
    cp "$tmp_mount/config.sh" "$install_dir_config_file"
    cp "$tmp_mount/version.txt" "$install_dir"

    chmod +x "$install_dir_scripts"/*.sh

    # Fichier de métadonnées d’installation
    echo "$IMAGE_TAG" > "$install_dir/.installed"

    # Symlink vers version active (utile pour rollback ou start.sh global)
    ln -sfn "$install_dir" "${base_dir}/${IMAGE_NAME}_current"

    # Enrichir config.sh
    cat <<EOF >> "$install_dir_config_file"
# Répertoires clés de l'installation
INSTALL_DIR="$install_dir"
SCRIPTS_DIR="$install_dir_scripts"
DOCKER_DIR="$install_dir_docker"
CONFIG_FILE="$install_dir_config_file"
COMPOSE_FILE="$install_dir_compose_file"
EOF

    echo -e "${GREEN}[OK]${NC} Fichiers installés avec succès."
}


# ========== VALIDATION ==========

check_config() {
    echo -e "${BLUE}[STEP]${NC} Vérification du fichier de configuration..."
    [[ -f "$install_dir_config_file" ]] && echo -e "${GREEN}[OK]${NC} Config détectée." ||
    { echo -e "${RED}[ERR]${NC} Config manquante."; exit 1; }
}

show_installed_files() {
    [[ "$env_mode" == "development" ]] && {
        echo -e "${BLUE}[INFO]${NC} Détails de la version \"${IMAGE_NAME}:${IMAGE_TAG}\" :"
        cat "$install_dir/version.txt"
    }
}

print_success() {
    echo -e "${GREEN}[OK]${NC} Installation complétée en mode $env_mode dans $install_dir."
    echo -e "${BLUE}[INFO]${NC} Rendez-vous dans $install_dir_scripts pour exécuter les scripts."
    echo -e "${BLUE}[INFO]${NC} Utilisez ./start.sh pour démarrer l'application."
}

# ========== EXÉCUTION ==========

confirm_installation
check_prerequisites
cleanup_versions
load_docker_image
copy_files
check_config
show_installed_files
print_success
