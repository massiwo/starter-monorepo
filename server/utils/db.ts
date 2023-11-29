/**
 * Connexion à la Base de Données - db.ts
 *
 * Ce fichier sert d'exemple pour établir et gérer une connexion à une base de données
 * dans une application Nuxt.js. Il utilise le package 'pg' pour se connecter à une base de données PostgreSQL.
 * Vous pouvez adapter ce fichier pour utiliser une base de données différente ou pour gérer
 * la connexion de manière plus complexe.
 *
 * Assurez-vous de configurer vos informations de connexion de manière sécurisée, idéalement en utilisant
 * des variables d'environnement.
 *
 * Documentation PostgreSQL (Node.js) : https://node-postgres.com/
 * Documentation Nuxt 3 : https://v3.nuxtjs.org/docs/directory-structure/server/
 */

import { Pool } from "pg";

let pool: Pool;

export const connect = () => {
  pool = new Pool({
    host: "localhost",
    user: "username",
    password: "password",
    database: "database",
    port: 5432,
  });
};

export const query = async (text: string, params?: any[]) => {
  if (pool === undefined) {
    return [];
  }
  const { rows } = await pool.query(text, params);
  return rows;
};
