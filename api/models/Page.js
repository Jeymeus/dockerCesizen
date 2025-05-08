import BaseModel from './BaseModel.js'

export default class Page extends BaseModel {
    constructor(data) {
        super('pages')

        if (
            typeof data !== 'object' || data === null ||
            !('id' in data) ||
            !('title' in data) ||
            !('url' in data) ||
            !('visible' in data) ||
            !('count_view' in data)
        ) {
            throw new Error('[Page] Données invalides : certains champs requis sont manquants')
        }

        this.id = Number(data.id)
        this.title = String(data.title)
        this.url = String(data.url)
        this.content = 'content' in data ? String(data.content ?? '') : ''
        this.visible = Boolean(data.visible)
        this.count_view = Number(data.count_view)
        this.menu_id = 'menu_id' in data ? Number(data.menu_id) : null
        this.created_at = data.created_at ?? new Date().toISOString()
        this.updated_at = data.updated_at ?? null
    }

    isVisible() {
        return this.visible
    }

    incrementViews() {
        this.count_view += 1
    }

    get preview() {
        return this.content?.slice(0, 100) + '...'
    }
}
