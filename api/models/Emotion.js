import BaseModel from './BaseModel.js'

export default class Emotion extends BaseModel {
    constructor(data) {
        super('emotions')

        if (
            typeof data !== 'object' || data === null ||
            !('id' in data) ||
            !('label' in data) ||
            !('category' in data)
        ) {
            throw new Error('[Emotion] Données invalides : id, label et category sont requis')
        }

        this.id = Number(data.id)
        this.label = String(data.label)
        this.category = String(data.category)
        this.emoji = data.emoji ?? null
        this.created_at = data.created_at ?? new Date().toISOString()
        this.updated_at = data.updated_at ?? null
    }

    get display() {
        return `${this.emoji ?? '❓'} ${this.label}`
    }
}
