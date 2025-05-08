import BaseModel from './BaseModel.js'

export default class Menu extends BaseModel {
    constructor(data) {
        super('menus')

        if (
            typeof data !== 'object' || data === null ||
            !('id' in data) ||
            !('title' in data)
        ) {
            throw new Error('[Menu] Données invalides : id et title sont requis')
        }

        this.id = Number(data.id)
        this.title = String(data.title)
    }
}
