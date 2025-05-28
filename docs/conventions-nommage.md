# 📘 Conventions de nommage – Starter Web App Monorepo

Ce guide définit les conventions de nommage obligatoires à respecter dans le cadre du développement avec le starter
monorepo SAE RER.

---

## 🧱 Noms des applications (`apps/<nom_app>.app`)

Toute application intégrée dans une monorepo doit respecter les conventions suivantes :

- Doit être au format `<nom_app>.app` (ex. `guda.app`, `gestion_droits.app`), le suffixe `.app` définit une
  application nécessitant un environnement monorepo.
- Doit être unique dans le monorepo.
- Doit être en minuscules.
- Doit être court, explicite, sans espaces ni caractères spéciaux.
- Doit utiliser le caractère `_` pour séparer les mots.

---

## 🛠️ Nommage et logique des scripts

Tout script de gestion d’application doit respecter les conventions suivantes :

- Doit être situé dans le dossier `scripts/` à la racine du monorepo, dans un sous-dossier nommé d’après
  l’application suivant `scripts/<nom_app>/` (ex. `scripts/mon_app_exemple/`).
- Doit être au format `<nom_app>` (sans suffixe `.app`)
- Doit être situé dans le dossier `scripts/` se trouvant à la racine du monorepo.
- Doit avoir un nom explicite et cohérent avec son action.
- Doit réaliser une seule action bien définie.
- Doit être autonome et exécutable seul en ligne de commande.
- Doit être appelable depuis un script parent (ex. `dist.sh` appelant `build-base.sh`).
- Doit avoir un nom cohérent avec son rôle, au format `<action>.sh` ou `<action-cible>.sh`.
- Exemples :

```bash
build-app.sh  # construit le code applicatif
start.sh      # lance l’application
stop.sh       # stoppe les conteneurs associés
enter.sh      # entre dans le conteneur
```

## 🐳 Nommage et logique des fichiers Docker

Toute configuration Docker liée à une application doit respecter les conventions suivantes :

- Doit être situé dans le dossier `docker/` à la racine du monorepo, dans un sous-dossier nommé d’après
  l’application suivant `docker/<nom_app>/` (ex. `docker/mon_app_exemple/`).
- Tous les `Dockerfiles` ainsi que les fichiers de configuration utilisés pour construire l’image Docker doivent être
  regroupés dans le répertoire propre à l’application, situé à l’emplacement `docker/<nom_app>/`
- Les fichiers `Dockerfiles` doivent être nommés de manière explicite
    - `base.Dockerfile` pour le Dockerfile lié à l'environnement de base de l’application.
    - `build.Dockerfile` pour le Dockerfile de construction de l’application.

Les services Docker doivent respecter les conventions suivantes :

- Nom du service :
    - Doit être identique au nom de l’application (sans suffixe `.app`).
    - Doit être unique dans les fichiers `docker-compose`.
    - Doit être court, explicite, en minuscules, sans espaces ni caractères spéciaux, privilégiant le nomma
    - Exemple : `mon_app_exemple` pour l’application `mon_app_exemple.app`.

- `image` doit être au format `<nom-service>:<version>` (ex. `mon_app_exemple:1.0.0`).
- `container_name` doit être identique au nom du service.
- `build.context` doit pointer vers le dossier parent de l’application (ex. `..`).
- `build.dockerfile` doit pointer vers le Dockerfile spécifique de l’application (ex.
  `docker/mon_app_exemple/build.Dockerfile`).
- `ports` doit être défini de manière non conflictuelle (à configurer manuellement après génération).
- `environment` doit contenir les variables d’environnement nécessaires à l’application.

- Exemple :

```yaml
  services:
    mon_app_exemple:
      image: mon_app_exemple:1.0.0
      container_name: mon_app_exemple
      build:
        context: ..
        dockerfile: docker/mon_app_exemple/build.Dockerfile
      ports:
        - "3000:3000"
      environment:
        - NODE_ENV=production
        - DATABASE_URL=postgres://user:password@db:5432/mydb
```

## 📝 **Conventions de commit Git (Conventional Commits)**

Les messages de commit doivent suivre la
norme [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/#sp%c3%a9cification) pour assurer une
meilleure
lisibilité, un historique
clair, et permettre l'automatisation (changelog, versioning sémantique, etc.).

### **🧱 Structure du message**

```plaintext
<type>(<portée>): <sujet>

<description>

<footer>
```

- `type` : indique la nature du changement, parmi les suivants :

    - `feat` : ajout d’une nouvelle fonctionnalité.
    - `fix` : correction de bug.
    - `docs` : modifications de la documentation uniquement. c.-à-d. pour des changements dans les fichiers
      README, JSDoc, guides, etc.
    - `style` : changements de style de code (indentation, espaces, etc.)
    - `refactor` : factorisation sans ajout de fonctionnalité ni correction de bug, c.-à-d. our des modifications qui
      améliorent le code sans changer son comportement. *Ex: renommage de variables, réécriture de fonctions, etc.*
    - `test` : ajout ou modification de tests.
    - `chore` : tâches de maintenance (CI, dépendances, fichiers de config…). c.-à-d. Pour des tâches sans impact direct
      sur le code fonctionnel, comme la mise à jour des dépendances, la configuration de l’environnement, etc.

- `portée` (recommandé) : indique la partie impactée (ex. : auth, login, api)

- `sujet` :

    - court (maximum 72 caractères)
    - écrit à l’impératif (ex. : « ajoute », « corrige », « supprime »)
    - première lettre en minuscule
    - sans point final

- `description` (recommandé) : fournit un contexte ou une explication complémentaire sur le changement

- `footer` (optionnel) : sert à :
    - documenter une modification rupture (ex. : BREAKING CHANGE: modification de l'API)
    - faire référence à un ticket ou un mail (ex. : FT #1234, BUG #5678, MAIL <objet-du-mail_date>)

## 📦 Conventions de nommage des livrables

Les livrables générés par le script `dist.sh` doivent respecter une convention stricte afin de garantir leur
traçabilité,
leur archivage, et leur exploitation par d'autres outils ou équipes.

### 📜 Format standard

Le nom des livrables doit suivre le format suivant :

```bash
<nom_app>-<version>.iso # pour les livrables complets
<nom_app>-<version>.tar # pour les images Docker (inclue dans le livrable)
```

🔤 Détail des éléments :

- `<nom_app>` : nom de l’application (sans suffixe `.app`), en minuscules, sans espace (ex. `mon_app_exemple`).
- `<version>` : identifiant de version, court et explicite, par exemple :
    - `v1.0.0` (tag de version) : utilisé pour les livrables de production, généré à partir des tags Git.
    - `dev-42` (commit hash abrégé) : utilisé pour les livrables de développement, généré en attendant le tag de
      version.
    - `2024.05.27` (date) : non recommandé pour les livrables de production, généré en cas de référence Git non trouvée.

### 📁 Emplacement des fichiers

Par convention :

- Les fichiers `.tar` (image Docker) et `.iso` (bundle complet) sont placés dans le répertoire `livraison/`
- Les noms sont construits automatiquement via la configuration présente dans `config.sh` :

```bash
IMAGE_NAME="mon_app_exemple"
IMAGE_TAG="v1.2.3"
```