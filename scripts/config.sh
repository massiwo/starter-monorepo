#!/bin/bash
pwd=$PWD
root=$(dirname "$pwd")

# --------------------------------------------
# A LIRE AVANT DE COMMENCER
# --------------------------------------------
# Ce fichier contient les variables de configuration pour les scripts de gestion des conteneurs Docker.
# Ce fichier est importé en tant que source dans chaque script.
# --------------------------------------------

# --------------------------------------------

# La fonction ci-dessous permet de récupérer le nom d'un dépôt Git à partir de son URL.
git_repo_name() {
  local repo_url=$(git config --get remote.origin.url)
  local repo_name=$(basename $repo_url .git)

  
  if [ -z $repo_name ]; then
    repo_name=$(basename $root)
  fi
  
  if [ -z $repo_name ]; then
    echo "Impossible de déterminer le nom du dépôt Git"
    exit 1
  fi

  echo $repo_name
}

# La fonction ci-dessous permet de récupérer le tag ou le commit sur lequel vous êtes situé.
git_repo_tag() {
  local repo_tag=$(git describe --tags --always)
  repo_tag=${repo_tag#v} # Supprimer le préfixe 'v' des tags

  if [ -z $repo_tag ]; then
    repo_tag=$(git rev-parse --short HEAD)
  fi
  if [ -z $repo_tag ]; then
    echo "Impossible de déterminer le tag ou le commit du dépôt Git"
    exit 1
  fi

  echo $repo_tag
}

IMAGE_NAME=$(git_repo_name)
IMAGE_TAG=$(git_repo_tag)