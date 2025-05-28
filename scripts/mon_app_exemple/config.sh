#!/bin/bash

# Répertoire enfant
CHILD_DIR="../../apps/mon_app_exemple.app"

# Sauvegarde du répertoire courant
CURRENT_DIR=$(pwd)

# Aller dans le répertoire enfant
cd "$CHILD_DIR" || { echo "Le répertoire $CHILD_DIR n'existe pas."; exit 1; }

# Lecture du tag de commit git
IMAGE_TAG=$(git describe --tags --always)
IMAGE_TAG_DEV=${IMAGE_TAG}-dev

# Nom de l'application (nom du répertoire racine du dépôt Git)
IMAGE_NAME=$(basename $(git rev-parse --show-toplevel))

# Revenir dans le répertoire d'origine
cd "$CURRENT_DIR"
