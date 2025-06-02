import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import MonExempleDeModuleService from '#mon_exemple_de_module/services/mon_exemple_de_module_service'
import {
  createMonExempleDeModuleValidator,
  updateMonExempleDeModuleValidator,
} from '#mon_exemple_de_module/validators/mon_exemple_de_module_validator'

@inject()
export default class MonExempleDeModuleController {
  constructor(private service: MonExempleDeModuleService) {}

  /**
   * Affiche une vue de la page d'accueil (via Inertia.js)
   */
  public async render({ inertia }: HttpContext) {
    return inertia.render('home', {
      appName: process.env.APP_NAME || 'Mon Application Exemple',
    })
  }

  /**
   * Retourne la liste des entités
   */
  public async index({ response }: HttpContext) {
    const data = await this.service.getAll()
    return response.ok(data)
  }

  /**
   * Affiche une seule entité
   */
  public async show({ params, response }: HttpContext) {
    const item = await this.service.getById(params.id)
    return item ? response.ok(item) : response.notFound({ message: 'Introuvable' })
  }

  /**
   * Crée une nouvelle entité
   */
  public async store({ request, response }: HttpContext) {
    const payload = await createMonExempleDeModuleValidator.validate(request)
    const created = await this.service.create(payload)
    return response.created(created)
  }

  /**
   * Met à jour une entité existante
   */
  public async update({ params, request, response }: HttpContext) {
    const payload = await updateMonExempleDeModuleValidator.validate(request)
    const updated = await this.service.update(params.id, payload)
    return updated ? response.ok(updated) : response.notFound({ message: 'Introuvable' })
  }

  /**
   * Supprime une entité
   */
  public async destroy({ params, response }: HttpContext) {
    const deleted = await this.service.delete(params.id)
    return deleted ? response.noContent() : response.notFound({ message: 'Introuvable' })
  }
}
