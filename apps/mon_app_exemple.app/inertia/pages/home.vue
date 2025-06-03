<script lang="ts" setup>
const { appName } = defineProps<{
  appName: string
}>()
</script>

<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1>
        Bienvenue sur <span class="highlight">{{ appName }}</span>
      </h1>
    </header>

    <!-- Documentation Section -->
    <div class="doc-card">
      <div class="doc-header">
        <div class="doc-icon">📄</div>
        <h2>Documentation</h2>
      </div>
      <div class="doc-content">
        <p>
          Consultez la documentation officielle d’AdonisJS pour découvrir un ensemble complet de
          fonctionnalités, de recommandations techniques et de bonnes pratiques. À travers des
          exemples, des guides et une API de référence, vous disposerez de toutes les ressources
          nécessaires pour concevoir, développer et déployer efficacement vos projets.
        </p>
        <a href="https://adonisjs.com/" rel="noopener noreferrer" target="_blank">
          Voir la documentation
          <svg
            class="icon icon-tabler icons-tabler-outline icon-tabler-link"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" stroke="none" />
            <path d="M9 15l6 -6" />
            <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
            <path
              d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="features-grid">
      <!-- Lucid -->
      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">📦</div>
          <h3>Lucid</h3>
        </div>
        <div>
          <p>
            ORM SQL complet intégrant un générateur de requêtes performant, le pattern Active
            Record, des outils de migration et des usines de modèles. Idéal pour gérer l’accès et la
            persistance des données relationnelles.
          </p>
          <a
            href="https://lucid.adonisjs.com/docs/introduction"
            rel="noopener noreferrer"
            target="_blank"
          >
            Voir la documentation
            <svg
              class="icon icon-tabler icons-tabler-outline icon-tabler-link"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path
                d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- Vine -->
      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">🧪</div>
          <h3>Vine</h3>
        </div>

        <div>
          <p>
            Système de validation de données typé et modulaire. Fournit plus de 50 règles prêtes à
            l'emploi et une API expressive permettant la définition de règles personnalisées.
          </p>
          <a href="https://vinejs.dev/docs/introduction" rel="noopener noreferrer" target="_blank">
            Voir la documentation
            <svg
              class="icon icon-tabler icons-tabler-outline icon-tabler-link"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path
                d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- InertiaJS -->
      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">⚙️</div>
          <h3>InertiaJS</h3>
        </div>
        <div class="feature-content">
          <p>
            Architecture monolithique moderne permettant de concevoir des applications monopages
            (SPA) sans créer d’API séparée. Intégration fluide entre backend et frontend.
          </p>
          <a href="https://inertiajs.com/" rel="noopener noreferrer" target="_blank">
            Voir la documentation
            <svg
              class="icon icon-tabler icons-tabler-outline icon-tabler-link"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path
                d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- Japa -->
      <div class="feature-card">
        <div class="feature-header">
          <div class="feature-icon">🧪</div>
          <h3>Japa</h3>
        </div>
        <div>
          <p>
            Cadre de tests complet pour API JSON et interfaces utilisateurs. Prend en charge les
            schémas Open API ainsi que les tests de bout en bout via Playwright.
          </p>
          <a href="https://japa.dev/docs/introduction" rel="noopener noreferrer" target="_blank">
            Voir la documentation
            <svg
              class="icon icon-tabler icons-tabler-outline icon-tabler-link"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path
                d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', Arial, sans-serif;
}

.highlight {
  color: #ad3eff; /* Purple color */
  font-weight: bold;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.header p {
  margin-top: 0.5rem;
  color: #555;
  font-size: 1rem;
}

.doc-card,
.feature-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1.5rem;
  background-color: #fff;
  margin-bottom: 2rem;
}

.doc-icon {
  font-size: 2rem;
  color: #6b46c1;
}

.doc-header,
.feature-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.doc-header h2,
.feature-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.doc-content p,
.feature-header p {
  margin-top: 0.5rem;
  color: #555;
  line-height: 1.5;
}

.feature-card a,
.doc-content a {
  display: inline-flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: #ad3eff; /* Purple color */
  text-decoration: none;
  font-weight: bold;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.feature-icon {
  font-size: 1rem;
  color: #4a5568;
}

.feature-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: bold;
}

.feature-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #444;
}

.doc-card svg,
.feature-card svg {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
