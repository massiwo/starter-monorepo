#!/bin/bash

set -e

# Définition des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Détection du répertoire du script
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
CONFIG_PATH="${SCRIPT_DIR}/../config.sh"

# Vérification de l'existence du fichier de configuration
if [ ! -f "$CONFIG_PATH" ]; then
    echo -e "${RED}[ERR]${NC} Fichier de configuration introuvable : $CONFIG_PATH"
    exit 1
fi

# Chargement de la configuration
source "$CONFIG_PATH"

# Vérification que les variables nécessaires sont présentes
if [[ -z "$IMAGE_NAME" || -z "$IMAGE_TAG" || -z "$INSTALL_DIR" ]]; then
    echo -e "${RED}[ERR]${NC} Variables IMAGE_NAME, IMAGE_TAG ou INSTALL_DIR manquantes dans config.sh"
    exit 1
fi

# Mode
dev_mode=false
[[ "$INSTALL_DIR" == /tmp/* ]] && dev_mode=true

# Fonction : désinstaller une instance
uninstall_instance() {
    local dir="$1"
    echo -e "${YELLOW}[WARN]${NC} Suppression de l'installation : $dir"
    read -p "Confirmer la suppression ? (oui/Non) : " confirm
    if [[ "$confirm" == "oui" ]]; then
        rm -rf "$dir"
        echo -e "${GREEN}[OK]${NC} $dir supprimé."
    else
        echo -e "${BLUE}[INFO]${NC} Annulé pour $dir."
    fi
}

# 1. Désinstallation de la version courante
echo -e "${BLUE}[STEP]${NC} Désinstallation de la version courante : $IMAGE_NAME $IMAGE_TAG"
uninstall_instance "$INSTALL_DIR"

# 2. Recherche des anciennes versions installées
echo -e "${BLUE}[STEP]${NC} Recherche d'autres versions installées de ${IMAGE_NAME}..."

base_dir=$($dev_mode && echo "/tmp" || echo "/opt")

mapfile -t found_dirs < <(find "$base_dir" -maxdepth 1 -type d -name "${IMAGE_NAME}_*" ! -name "${IMAGE_NAME}_${IMAGE_TAG}")

if [ ${#found_dirs[@]} -eq 0 ]; then
    echo -e "${GREEN}[OK]${NC} Aucune autre version détectée."
else
    echo -e "${YELLOW}[WARN]${NC} Autres versions trouvées :"
    for d in "${found_dirs[@]}"; do
        uninstall_instance "$d"
    done
fi

echo -e "${GREEN}[DONE]${NC} Désinstallation terminée."