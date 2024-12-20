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

   **Solution:**

   ```bash
   git status # Vérifier les répertoires ou fichiers en conflits
   git add apps/ pnpm-lock.yaml # Prendre en compte ces conflits (exemple ici avec le répertoire "apps" et le fichier "pnpm-lock.yaml")
   git commit # Appliquer la résolution des conflits avec Ctrl+X
   ```

   <br>

4. **Installer les dépendances**

```bash
pnpm install
```

5. **Exécuter votre projet en développement**

```bash
pnpm run dev # exécute tous les projets en mode dev

cd apps/<projet>
pnpm run dev # exécute le projet en mode dev

```

# Design System

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

A ce stade votre design-system est ajouté dans votre projet comme sous-module et vous possédez une application dans `./apps`.
Il ne vous reste plus qu'à l'installer dans votre application.

**Pour votre toute première utilisation :**

1. Rendez-vous dans le ficher `package.json` du design-system et identifiez le nom du package, indiqué par la propriété `name`:

```json
{
  "name": "@myapp/design-system" // <- Exemple
  // ... autres paramètres
}
```

2. Puis, rendez-vous dans le ficher `package.json` de votre application.
3. Déclarez la dépendance `design-system` dans la section `dependencies`, en indiquant son nom (identifié précédemment) et sa version, comme ceci:

```json
  "dependencies": {
      // ... autre dépendances
    "@myapp/design-system": "workspace:^1.0.0" // <- "workspace" signifie que cette dépendance se trouve dans ce projet.
  },
```

4. Maintenant que vous avez déclaré cette dépendance, on l'installe :

```bash
pnpm install
```

## Utilisation

C'est parti pour l'intégrer à votre application !
Deux choses à faires :

1. Importer la dépdance dans la partie "css" de votre application en ajoutant ceci:

```scss
@import "@myapp/design-system/style"; /* <- Exemple (n'oubliez pas d'indiquez le vrai nom de la dépendance indiqué dans votre fichier package.json) */
```

2. Utiliser les composants de votre choix dans vos pages:

```javascript
<script setup lang="ts">
import { Button } from '@myapp/design-system' // <- Exemple (n'oubliez pas d'indiquez le vrai nom de la dépendance indiqué dans votre fichier package.json)
// ... reste du code
</script>

<template>
   <Button color="primary">Hello World !</Button>
</template>

```

## Mise à jour

Pour mettre à jour le design-system vers sa dernière version disponible, il vous suffit de :

1. Récupérer la dernière version du sous-module

```bash
git submodule update --remote packages/design-system # <- Vérifiez le nom de votre sous-module
```

2. Installer cette version dans votre application

```bash
cd <racine/de/votre/monorepo>
pnpm install
```
