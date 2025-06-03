# 🚀 Starter Web Application – SAE RER

Ce projet est un **starter monorepo** pour le développement d'applications web fullstack avec **AdonisJS**, conçu pour
harmoniser les pratiques internes au SAE RER.

Il fournit une architecture modulaire, un environnement Docker, des scripts de gestion, un design system intégré, et un
outil interactif pour générer ou supprimer des applications dans le monorepo.

---

## 🧱 Structure du projet

```plaintext
.
├── apps/                → Applications AdonisJS
├── config/              → Nginx, certificats TLS, configuration globale
├── docker/              → Dockerfiles & docker-compose par application
├── livraison/           → Artéfacts livrables (.iso, etc.)
├── packages/            → Librairies partagées (design system, etc.)
├── scripts/             → Scripts de build/dev/stop par application
├── pnpm-workspace.yaml  → Définition des workspaces
├── package.json         → Dépendances globales et scripts
├── init.js              → Script CLI pour créer/supprimer des apps
└── README.md            → Documentation du projet
```

---

## ⚙️ Prérequis

- **Node.js** ≥ 22.0
- **pnpm** ≥ 9.1
- **Docker & Docker Compose**

---

## 📦 Installation

1. **Cloner le projet avec sous-modules :**

```bash
git clone --recurse-submodules git@gitlab-ipl.valfontenay.ratp:outils/starter_web_app.git <mon-projet>
cd <mon-projet>
```

2. **Installer les dépendances :**

```bash
pnpm install
```

2. **Configurer les variables d'environnement AdonisJs pour l'environnement de développement :**

Rendez-vous dans le dossier de l'application AdonisJS que vous souhaitez configurer (par exemple, `apps/<nom-app>`) et
Copiez le fichier `.env.example` en `.env` et modifiez les variables selon vos besoins.
Assurez-vous de configurer les variables suivantes :

```dotenv
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_NAME=MonAppExemple
APP_KEY=<app_key> # Généré par AdonisJS avec la commande `node ace generate:key`
NODE_ENV=development
SESSION_DRIVER=cookie
DB_HOST=<db_host> # L'utilisation de 'localhost' est recommandée pour le développement à condition que le conteneur Docker de la base de données soit accessible
DB_PORT=5432
DB_USER=<db_user>
DB_PASSWORD=<db_password>
DB_DATABASE=<db_name>
```

4. **Lancer l’environnement de développement :**

```bash
pnpm run dev                      # Démarre toutes les apps
pnpm run dev --filter=<nom-app>  # Démarre une app spécifique (ou cd apps/<nom-app> && pnpm dev)
```

---

## 🧰 Générer ou supprimer une application (CLI)

Un script interactif est disponible pour faciliter la gestion des applications dans le monorepo :

```bash
node init.js
```

Ce script permet :

- d’ajouter une application comme **sous-module Git**
- de **dupliquer une app existante**
- de **copier manuellement** une app avec préconfiguration
- de **supprimer** proprement une app (apps/, docker/, scripts/)

---

## 🎨 Design System intégré

Ce monorepo inclut un design system basé sur Storybook dans :

```plaintext
packages/design-system/
```

### ➕ Ajouter dans une app AdonisJS (ex : Vue embarqué via Edge ou Inertia)

1. **Dans le package.json de l’app :**

```json
{
  "dependencies": {
    "@myapp/design-system": "workspace:*"
  }
}
```

2. **Installer :**

```bash
pnpm install
```

3. **Utiliser dans votre app :**

```vue

<script setup>
  import {Button} from '@myapp/design-system'
</script>

<template>
  <Button color="primary">Envoyer</Button>
</template>
```

---

## 🔄 Mise à jour

Pour mettre à jour le design system ou les dépendances :

```bash
git submodule update --remote packages/design-system
pnpm install
pnpm update
```

## 📚 Conventions de nommage

Les conventions de nommage pour les applications, images Docker, services, scripts et variables sont détaillées dans le
fichier suivant : [docs/conventions-nommage.md](docs/conventions-nommage.md)
