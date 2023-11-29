# Template Projet Web

Ce fichier README est un guide rapide de la structure d'un projet Web.

## Structure du Projet

```
mon-projet-nuxt/
|-- .nuxt/              # Dossier généré automatiquement pour le build
|-- assets/             # Ressources statiques comme les styles, images, fonts
|-- components/         # Composants Vue réutilisables
|-- composables/        # Composables réutilisables (optionnel)
|-- content/            # Fichiers Markdown ou YAML pour le CMS intégré (optionnel)
|-- layouts/            # Mises en page (layouts) de l'application
|-- middleware/         # Middleware (optionnel)
|-- node_modules/       # Bibliothèques et dépendances du projet
|-- pages/              # Composants Vue pour les pages, avec routage automatique
|-- plugins/            # Plugins Vue.js ou JavaScript (optionnel)
|-- public/             # Fichiers statiques servis directement (comme favicon.ico)
|-- server/             # Scripts et fonctions serveur (Nuxt 3 feature, optionnel)
|-- store/              # Store Vuex (optionnel)
|-- test/               # Tests unitaires et d'intégration (optionnel)
|-- .gitignore          # Fichiers et dossiers à ignorer par Git
|-- nuxt.config.js      # Configuration de Nuxt.js
|-- package.json        # Configuration et versions des paquets
|-- package-lock.json   # Lock file pour les versions des paquets
|-- README.md           # Documentation du projet
```

Pour plus d'informations sur la structure du projet, consultez la page concernant la [structure d'un projet Nuxt.js](https://nuxt.com/docs/guide/directory-structure/app)

## Dépendances Principales

- **Vue.js** (v3.x) : Le framework progressif pour construire des interfaces utilisateur, intégré dans Nuxt.js.

- **Nuxt.js** (v3.8.2) : Un framework intuitif basé sur Vue.js, offrant des fonctionnalités telles que le rendu côté serveur, la génération de sites statiques, et une structure de projet efficace.

## Démarrage du Projet

Pour démarrer le projet, suivez ces étapes :

1. **Installation des Dépendances**:

   ```bash
   npm install
   ```

2. **Lancement du Serveur de Développement**:

   ```bash
   npm run dev
   ```

3. **Build et Lancement en Production**:

   ```bash
   npm run build
   npm start
   ```

4. **Génération d'une Version Statique du Projet**:

   ```bash
   npm run generate
   ```

Pour plus d'informations sur les commandes et configurations spécifiques, référez-vous à la documentation de [Nuxt.js](https://nuxtjs.org).
