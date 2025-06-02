import router from '@adonisjs/core/services/router'
import MonExempleDeModuleController from '#mon_exemple_de_module/controllers/mon_exemple_de_module_controller'

const controller = MonExempleDeModuleController

/**
 * Mon Exemple De Module Routes
 * Ces routes gèrent les opérations CRUD pour le module "Mon Exemple De Module".
 * Elles permettent de créer, lire, mettre à jour et supprimer des instances de ce module.
 * Ces routes sont préfixées par '/api' pour indiquer qu'elles font partie de l'API de l'application.
 */

/**
 * Application Routes for Mon Exemple De Module
 */
router
  // Groupe de routes pour l'application
  .group(() => {
    router.get('/', [controller, 'render']) // Route pour la page d'accueil
  })
  .prefix('/') // Préfixe pour indiquer que ces routes sont pour l'application (par exemple, '/mon_exemple_de_module')

/**
 * API Routes for Mon Exemple De Module
 */
router
  // Groupe de routes pour l'API
  .group(() => {
    router.get('/mon_exemple_de_module', [controller, 'index']) // Route pour obtenir la liste des entités
    router.get('/mon_exemple_de_module/:id', [controller, 'show']) // Route pour obtenir une entité spécifique
    router.post('/mon_exemple_de_module', [controller, 'store']) // Route pour créer une nouvelle entité
    router.put('/mon_exemple_de_module/:id', [controller, 'update']) // Route pour mettre à jour une entité existante
    router.delete('/mon_exemple_de_module/:id', [controller, 'destroy']) // Route pour supprimer une entité
  })
  .prefix('/api') // Préfixe pour indiquer que ces routes font partie de l'API (par exemple, '/api/mon_exemple_de_module')
