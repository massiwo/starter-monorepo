import path from "path";
import { defineNuxtPlugin } from "#app";
import { createLogger, format, transports } from "winston";
import packageInfo from "../package.json";

export default defineNuxtPlugin(() => {
  const logger = createLogger({
    level: "debug", // Niveau le plus bas à enregistrer
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf((info) => {
        return `${info.timestamp} (${packageInfo.name}) [${info.level.toUpperCase()}]: ${info.message}`;
      }),
    ),
    defaultMeta: { service: packageInfo.name },
    transports: [
      // Console
      new transports.Console({
        level: "error",
      }),

      // Fichier pour les logs d'erreur
      new transports.File({
        filename: path.join("logs", "error.log"),
        level: "error",
      }),

      // Fichier pour les logs d'information
      new transports.File({
        filename: path.join("logs", "info.log"),
        level: "info",
      }),

      // Fichier pour les logs de débogage (contient tout)
      new transports.File({
        filename: path.join("logs", "debug.log"),
        // Pas de niveau spécifié, donc il enregistre tout
      }),
    ],
  });

  return {
    provide: {
      logger,
    },
  };
});
