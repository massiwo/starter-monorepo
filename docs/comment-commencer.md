# ✨ Comment commencer la phase de réalisation avec le Starter AdonisJS SAE RER

Ce guide explique comment démarrer concrètement la phase de réalisation de votre application à partir du starter
monorepo fourni. Il est destiné aux développeurs qui souhaitent intégrer leur propre application dans la structure
existante.

## 🛠️ Étape 1 – Initialiser votre application avec le script CLI

Utilisez le script interactif `init.js` fourni pour créer, importer, dupliquer ou supprimer une application dans le
monorepo :

```bash
node init.js
```

Vous serez guidé pas à pas pour :

* Ajouter une application comme sous-module Git
* Copier manuellement une app dans ./apps
* Dupliquer une application existante
* Supprimer proprement une application

Ce script configure également :

* Le dossier `apps/<nom-app>`
* Les Dockerfiles (`docker/<nom-app>`)
* Les scripts (`scripts/<nom-app>`)
* Le `docker-compose.yml` et `docker-compose.dev.yml`

## 🧱 Étape 2 – Structure du projet générée automatiquement

Une fois votre application initialisée via `init.js`, les éléments suivants sont générés :

```bash
apps/<nom-app>/                # Code de votre app
docker/<nom-app>/             # Dockerfiles de base & build
scripts/<nom-app>/            # Scripts d'exécution associés
```

🔁 Basé sur le modèle mon_app_exemple (contenu générique à adapter).

## 📦 **Étape 3 – Dépendances et workspace PNPM**

Assurez-vous que le fichier pnpm-workspace.yaml contient :

```yml
packages:
  - 'apps/*'
  - 'packages/*'
```

Puis installez les dépendances :

```bash
pnpm install
```

## ⚙️ **Étape 4 – Configuration Docker (automatique mais vérifiable)**

Le script `init.js` ajoute automatiquement votre service aux fichiers :

* `docker-compose.yml`
* `docker-compose.dev.yml`

Assurez-vous de :

* Adapter les ports exposés (de docker et des variables d’environnement)
* Vérifier les variables d’environnement nécessaires
* Corriger l’image et le container_name si besoin

## 🚀 **Étape 5 – Démarrer votre application**

Pour démarrer votre application, utilisez les commandes suivantes :

```bash
pnpm run dev                         # Démarre toutes les apps
pnpm --filter=<nom-app> run dev      # Démarre uniquement votre application
```

Afin de vous accompagner dans le développement, vous pouvez également consulter la documentation de l'application