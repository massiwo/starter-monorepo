#!/bin/bash

# Résolution du chemin absolu
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

# Exécute stop puis start
"$SCRIPT_DIR/stop.sh" "$@"
"$SCRIPT_DIR/start.sh" "$@"