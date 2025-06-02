import MonExempleDeModule from '#mon_exemple_de_module/models/mon_exemple_de_module'
import { DateTime } from 'luxon'

/**
 * ────────────────────────────────────────────────────────────────────────────────
 * 📦 ViewModel : Qu’est-ce que c’est ?
 * ────────────────────────────────────────────────────────────────────────────────
 *
 * Un ViewModel est une **couche de transformation** entre le modèle métier
 * (ex : base de données) et le monde extérieur (API, UI, client).
 *
 * 👉 Il permet de :
 *   - Masquer des champs sensibles ou inutiles
 *   - Adapter les noms, les formats ou les structures
 *   - Garantir une sortie **stable, contrôlée et claire**
 *   - Séparer les préoccupations entre le backend et la présentation
 *
 * ────────────────────────────────────────────────────────────────────────────────
 * 🎯 Exemple concret :
 *
 * Imaginons que "models/mon_exemple_de_module" soit un modèle `User` contenant les champs suivants :
 *   - id
 *   - email
 *   - password_hash
 *   - last_login
 *   - created_at
 *
 * En exposant l’utilisateur au frontend, on ne veut **surtout pas** renvoyer :
 *   - `password_hash` (sensibilité)
 *   - `last_login` (pas pertinent, selon le contexte)
 *
 * Le ViewModel nous permet alors de faire :
 *
 *    return {
 *      id: user.id,
 *      email: user.email,
 *      registeredAt: user.created_at
 *    }
 *
 * Résultat : une sortie **propre, safe, adaptée à l’interface**.
 *
 * ────────────────────────────────────────────────────────────────────────────────
 * 💡 Astuce :
 * On peut aussi utiliser les ViewModel pour ajouter des **données calculées**,
 * comme une `isActive`, `fullName` (la concaténation de `firstName` et `lastName`), ou autre champ UI-friendly.
 */

export type MonExempleDeModuleViewModelSerialized = ReturnType<
  MonExempleDeModuleViewModel['serialize']
>
export type AllMonExempleDeModuleViewModelSerialized = ReturnType<
  AllMonExempleDeModuleViewModel['serialize']
>

/**
 * @class MonExempleDeModuleViewModel
 * @description Transforme un objet métier en un format exploitable côté frontend.
 */
export class MonExempleDeModuleViewModel {
  constructor(private entity: MonExempleDeModule) {}

  /**
   * @static fromDomain
   * @description Crée une instance à partir d'un modèle de domaine.
   */
  static fromDomain(entity: MonExempleDeModule): MonExempleDeModuleViewModel {
    return new this(entity)
  }

  /**
   * @method serialize
   * @description Sérialise l’objet pour l’interface utilisateur (API).
   */
  serialize(): {
    id: number
    name: string
    createdAt: DateTime
    updatedAt: DateTime
  } {
    return {
      id: this.entity.id,
      name: this.entity.name,
      createdAt: this.entity.createdAt,
      updatedAt: this.entity.updatedAt,
    }
  }
}

/**
 * @class AllMonExempleDeModuleViewModel
 * @description Transforme une liste d’objets métier pour l'UI.
 */
export class AllMonExempleDeModuleViewModel {
  constructor(private entities: MonExempleDeModuleViewModel[]) {}

  /**
   * @static fromDomain
   * @description Construit la vue liste à partir d'une collection métier.
   */
  static fromDomain(entities: MonExempleDeModule[]): AllMonExempleDeModuleViewModel {
    return new this(entities.map((e) => new MonExempleDeModuleViewModel(e)))
  }

  /**
   * @method serialize
   * @returns Liste des entités formatées pour l’UI.
   */
  serialize(): ReturnType<MonExempleDeModuleViewModel['serialize']>[] {
    return this.entities.map((e) => e.serialize())
  }
}
