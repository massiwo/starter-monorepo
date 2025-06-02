import MonExempleDeModule from '#mon_exemple_de_module/models/mon_exemple_de_module'

export default class MonExempleDeModuleRepository {
  public async all() {
    return MonExempleDeModule.all()
  }

  public async find(id: number) {
    return MonExempleDeModule.find(id)
  }

  public async create(data: Partial<MonExempleDeModule>) {
    return MonExempleDeModule.create(data)
  }

  public async update(id: number, data: Partial<MonExempleDeModule>) {
    const item = await MonExempleDeModule.find(id)
    if (!item) return null

    item.merge(data)
    await item.save()
    return item
  }

  public async delete(id: number) {
    const item = await MonExempleDeModule.find(id)
    if (!item) return false

    await item.delete()
    return true
  }
}
