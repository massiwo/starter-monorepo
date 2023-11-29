/**
 * API Endpoint - [id].ts
 *
 * Ce fichier illustre comment gérer les routes dynamiques dans une application Nuxt.js.
 * Il sert d'exemple pour traiter les requêtes API vers des chemins spécifiques, comme
 * '/api/users/123', où '123' est un ID utilisateur dynamique.
 *
 * Date : Novembre 2023
 * Documentation : https://nuxt.com/docs/guide/directory-structure/server
 */

import authMiddleware from "../../middleware/exemple";
import { query } from "../../utils/db";

export default defineEventHandler(async (event) => {
  // Appliquer le middleware d'authentification
  await authMiddleware(event);

  const method = event.req.method;
  const id = event.context.params?.id;

  if (!id) {
    event.res.statusCode = 400;
    return "ID is required";
  }

  switch (method) {
    case "GET": {
      // Bloc local pour 'GET'
      const users = await query("SELECT * FROM users WHERE id = $1", [id]);
      return users[0] || "User not found";
    }

    // Ajoutez ici les blocs pour PUT et DELETE
    // ...

    default: {
      event.res.statusCode = 405;
      return "Method Not Allowed";
    }
  }
});
