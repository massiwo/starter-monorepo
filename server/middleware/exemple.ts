/**
 * Middleware de Traçage des Requêtes
 *
 * Ce middleware sert d'exemple pour tracer les requêtes entrantes dans une application Nuxt.js.
 * Il enregistre des informations de base sur chaque requête, telles que l'URL, la méthode et
 * éventuellement le corps de la requête. Cela peut être utile pour le débogage et la surveillance
 * des activités de l'application.
 *
 * Date : Novembre 2023
 * Documentation : https://nuxt.com/docs/guide/directory-structure/middleware
 */

export default defineEventHandler((event) => {
  console.log(`Requête reçue: ${event.req.method} ${event.req.url}`);
  // Autres logiques de traçage ici
  // ...
});
