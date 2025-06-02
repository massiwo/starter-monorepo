import { inject } from '@adonisjs/core'
import MonExempleDeModuleRepository from '#mon_exemple_de_module/repositories/mon_exemple_de_module_repository'
import MonExempleDeModule from '#mon_exemple_de_module/models/mon_exemple_de_module'

@inject()
export default class MonExempleDeModuleService {
  constructor(private repository: MonExempleDeModuleRepository) {}

  public async getAll() {
    return this.repository.all()
  }

  public async getById(id: number) {
    return this.repository.find(id)
  }

  public async create(payload: Partial<MonExempleDeModule>) {
    return this.repository.create(payload)
  }

  public async update(id: number, payload: Partial<MonExempleDeModule>) {
    return this.repository.update(id, payload)
  }

  public async delete(id: number) {
    return this.repository.delete(id)
  }
}
