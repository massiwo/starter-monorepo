import vine from '@vinejs/vine'

/**
 * Validation pour la création d'un élément du module
 */
export const createMonExempleDeModuleValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2),
    // ... d'autres champs peuvent être ajoutés ici
  })
)

/**
 * Validation pour la mise à jour d'un élément du module
 */
export const updateMonExempleDeModuleValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).optional(),
    // ... d'autres champs peuvent être ajoutés ici
  })
)
