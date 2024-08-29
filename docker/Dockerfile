# Contenu du fichier Dockerfile pour l'image des application
# Documentations:
#    PNPM: https://pnpm.io/fr/docker
#    Node.js: https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
#    Docker: https://docs.docker.com/engine/reference/builder/


# --------------------------------------------
# A LIRE AVANT DE COMMENCER
# --------------------------------------------
# Ce fichier doit contenir les instructions pour construire l'image Docker de votre application
# Il est recommandé de diviser le fichier en plusieurs étapes pour optimiser la construction de l'image
# En général, il est recommandé de diviser le fichier en 3 étapes:
# 1. Build: Installation des dépendances, compilation des applications backend et frontend, copie des fichiers nécessaires dans les images backend et frontend
# 2. Production: Image pour exécuter les applications en production
# 3. Développement: Image pour exécuter les applications en mode développement
# Il est recommandé d'utiliser des images de base pour les étapes Build, Production et Développement
# Il est recommandé d'utiliser des variables d'environnement pour spécifier les images de base et les versions des applications

# Ci-dessus un exemple de Dockerfile pour une application fullstack avec un backend et un frontend
# Vous pouvez modifier ce fichier pour l'adapter à votre application
# Pensez à ajouter des commentaires pour expliquer le fonctionnement des instructions
# --------------------------------------------

# --------------------------------------------
# EXEMPLE DE DOCKERFILE POUR UNE APPLICATION FULLSTACK
# --------------------------------------------

### Build
#
#FROM ${IMAGE_NAME:-myapp}:base AS build
#WORKDIR /usr/src/app
#COPY . .
#RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
#ENV NODE_OPTIONS="--max-old-space-size=4096"
#RUN pnpm --filter=backend run build
#RUN pnpm --filter=backend --prod deploy ./prod/backend
#RUN pnpm --filter=frontend run build
#RUN mv ./apps/frontend/.output/server/node_modules ./apps/frontend/.output/server/node_modules_prod
#
### Production
#
## Backend
#FROM ${IMAGE_NAME:-myapp}:base AS backend
#WORKDIR /usr/src/app
#COPY --from=build /usr/src/app/prod/backend/package*.json ./
#COPY --from=build /usr/src/app/prod/backend/dist ./
#COPY --from=build /usr/src/app/prod/backend/node_modules ./node_modules
#EXPOSE 3333
#CMD [ "pnpm", "--filter=backend", "run", "start" ]
#
## Frontend
#FROM ${IMAGE_NAME:-myapp}:base AS frontend
#WORKDIR /usr/src/app
#COPY --from=build /usr/src/app/apps/frontend/.output .
#RUN mv ./server/node_modules_prod ./server/node_modules
#EXPOSE 8000
#CMD [ "pnpm", "--filter=frontend", "run", "start" ]
#
### Développement
#
## Backend
#FROM backend AS backend-dev
#WORKDIR /usr/app
#CMD [ "pnpm", "--filter=backend", "run", "dev" ]
#
## Frontend
#FROM frontend AS frontend-dev
#WORKDIR /usr/app
#CMD [ "pnpm", "--filter=frontend", "run", "dev" ]