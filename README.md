# Projet de démarrage d'une application Web

## Description

Ce projet sert de point de départ pour le développement d’applications web au sein de nos systèmes du SAE RER. Il vise à harmoniser les pratiques et à fournir une structure communes.

## Fonctionnalités

- **Architecture modulaire** : Facilite l’ajout et la modification de fonctionnalités.
- **Intégration continue** : Configuration prête à l’emploi.
- **Scripts fournis** : Inclut des scripts génériques pour la maintenance des conteneurs en phase de développement et de production.

## Prérequis

- Node.js (version 18.12 ou supérieure)
- npm (version 10 ou supérieure)
- pnpm (version 9.1)
- Docker et Docker-compose

## Installation

1. **Cloner le dépôt :**

```bash
git clone --recurse-submodules git@gitlab-ipl.valfontenay.ratp:outils/starter_web_app.git <ton-projet>
cd <ton-projet>
```

Vous venez d'importer toute la structure principale du projet.

En fonction de votre projet et de vos choix techniques parmis l'harmonisation web, vous avez la possibilité de :

2.1. **Importer l'arborescence frontend Nuxt.js**

```bash
git merge nuxt
```

2.2 **Importer l'arborescence backend Adonis**

```bash
git merge adonis
```

2.3 **Importer l'arborescence backend Express.js** _(en cours de construction)_

```bash
git merge expressjs
```

3. **Nettoyez votre projet** (optionel)
   _Après votre merge, il se peut que des conflits de dépendance apparaissent entre le framework et le starter._

   **Solution:** Supprimer le dossier "node_modules" à la racie et dans les des différents projets.
   <br>

4. **Installer les dépendances**

```bash
pnpm install
```

# Design System

🔗 `cd ./packages/design-system`

## Description

Ce dépôt contient notre design system, conçu pour être utilisé avec Storybook. Il fournit une collection de composants UI réutilisables, de styles et de guidelines pour garantir une expérience utilisateur homogène et intuitive à travers toutes nos applications.

## Installation

_Par défaut, ce module est intégré au projet "starter_web_app" dans le répertoire `./packages/design-system`_

---

**NOTE**

Le module "Design System" a été conçu dans un environnement monorepo. Pour intégrer ce module dans un autre projet ou environnement, il est recommandé de se former et se renseigner sur le fonctionnement et l'intégration d'un Storybook, vérifier soigneusement les dépendances, configurations et adaptations nécessaires. Toute intégration et les ajustements qui en découlent, en dehors de l'environnement initialement prévu, relèvent de la responsabilité de l'utilisateur.

---

1. **Installation comme sous-module indépendante :**
   Pour une installation indépendante en tant que sous-modules à votre projet, vous pouvez l'intégrer de la manière suivante :

```bash
git submodule add git@gitlab-ipl.valfontenay.ratp:outils/design-system.git <chemin_souhaité>
```

2. **Démarrez Storybook :**

```bash
cd <chemin_vers_le_répertoire_parent>/design-system
pnpm run storybook
```
