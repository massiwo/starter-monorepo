/**
 * API Endpoint - index.ts
 *
 * Ce fichier est un exemple de route API principale dans une application Nuxt.js utilisant
 * Server-Side Rendering ou Server API. Il peut être utilisé pour gérer des requêtes de
 * niveau racine ou pour implémenter des fonctionnalités API globales.
 *
 * Date : Novembre 2023
 * Documentation : https://nuxt.com/docs/guide/directory-structure/server
 */

import { query } from "../../utils/db";

export default defineEventHandler(async () => {
  const users = await query("SELECT * FROM users");
  return users;
});
