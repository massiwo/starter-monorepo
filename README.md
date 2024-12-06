# Projet de démarrage d'une application Web

## Description

Ce projet sert de point de départ pour le développement d’applications web au sein de nos systèmes du SAE RER. Il vise à harmoniser les pratiques et à fournir une structure communes.

## Fonctionnalités

- Architecture modulaire : Facilite l’ajout et la modification de fonctionnalités.
- Intégration continue : Configuration prête à l’emploi.
- Scripts fournis : Inclut des scripts génériques pour la maintenance des conteneurs en phase de développement et de production.

## Prérequis

- Node.js (version 18.12 ou supérieure)
- npm (version 10 ou supérieure)
- pnpm (version 9.1)
- Docker et Docker-compose (pour l’environnement de développement)

## Installation

1. **Cloner le dépôt :**

```bash
git clone --recurse-submodules git@gitlab-ipl.valfontenay.ratp:outils/starter_web_app.git <ton-projet>
cd <ton-projet>
```

Vous venez d'importer toute la structure principale du projet.

En fonction de votre projet et de vos choix techniques parmis l'harmonisation web, vous avez la possibilité de :

1. **Importer l'arborescence frontend Nuxt.js**

```bash
git merge nuxt
```

2. **Importer l'arborescence backend Adonis**

```bash
git merge adonis
```

3. **Importer l'arborescence backend Express.js** _(en cours de construction)_

```bash
git merge expressjs
```

4. **Installer toutes les dépences de votre monorepo et des projets**

```bash
pnpm install
```
